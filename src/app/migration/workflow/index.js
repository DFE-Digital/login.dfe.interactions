'use strict';

const users = require('./../../../infrastructure/Users');
const services = require('./../../../infrastructure/Services');
const access = require('./../../../infrastructure/access');
const userCodes = require('./../../../infrastructure/UserCodes');
const logger = require('./../../../infrastructure/logger');
const org = require('./../../../infrastructure/Organisations');
const osa = require('./../../../infrastructure/osa');
const config = require('./../../../infrastructure/Config')();

const createOrUpdateUser = async (email, password, firstName, lastName, emailConfId, saUsername, correlationId) => {
  const invitation = await users.findInvitationByEmail(email, correlationId);
  if (invitation && !invitation.isCompleted) {
    await users.acceptInvitation(invitation.id, password, correlationId);
    logger.info(`Completed invitation ${invitation.id} for ${email} while migrating ${saUsername}`);
  }

  if (password) { // Will not have password when we have checked user exists
    logger.info(`Attempting to create user for ${saUsername} (email = ${email}, firstName = ${firstName}, lastName = ${lastName})`, { correlationId });
    const user = await users.create(email, password, firstName, lastName, saUsername, correlationId);
    if (user) {
      logger.info(`Created new user for SA user ${saUsername} with id ${user.id}`, { correlationId });
      return {
        userId: user.id,
        existing: false,
      };
    }
  }

  logger.info(`Did not create user for SA user ${saUsername}. Seeing if user already exists with email (${email})`, { correlationId });
  const existingUser = await users.find(email, correlationId);
  if (existingUser) {
    logger.info(`Found existing user for SA user ${saUsername} with id ${existingUser.sub}`, { correlationId });

    if (!existingUser.legacyUsernames) {
      existingUser.legacyUsernames = [];
    }
    if (!existingUser.legacyUsernames.find(x => x.toLowerCase() === saUsername.toLowerCase())) {
      existingUser.legacyUsernames.push(saUsername.toLowerCase());
      await users.update(existingUser.sub, undefined, undefined, undefined, existingUser.legacyUsernames, correlationId);
      logger.info(`Updated exsiting user ${existingUser.sub} with SA user ${saUsername}`);
    }

    return {
      userId: existingUser.sub,
      existing: true,
    };
  }

  throw new Error(`Failed to create or find a user for SA user ${saUsername} (email: ${email})`);
};
const addUserToOrganisation = async (userId, saOrganisation, saUserId, saUserName, correlationId) => {
  const organisation = await org.getOrganisationByExternalId(saOrganisation.osaId, '000');
  if (!organisation) {
    throw new Error(`Failed to find an organisation of type ${saOrganisation.type} with SA id ${saOrganisation.osaId} for user ${userId}`);
  }

  logger.info(`Adding user ${userId} to organisation ${organisation.id} with role ${saOrganisation.role.id}`, { correlationId });
  await org.setUsersRoleAtOrg(userId, organisation.id, saOrganisation.role.id, saUserId, saUserName, correlationId);

  return organisation;
};
const addUserToService = async (userId, organisation, saOrganisation, currentServiceId, currentServiceRoles, saUserId, saUserName, correlationId) => {
  const externalIdentifiers = [];
  externalIdentifiers.push({ key: 'organisationId', value: saOrganisation.osaId });
  externalIdentifiers.push({
    key: 'groups',
    value: (currentServiceRoles || []).join(','),
  });
  externalIdentifiers.push({ key: 'saUserId', value: saUserId });
  externalIdentifiers.push({ key: 'saUserName', value: saUserName });

  const allRolesForService = await access.getRolesOfService(currentServiceId, correlationId);
  const roles = currentServiceRoles ? currentServiceRoles.map(code => allRolesForService.find(role => role.code.toLowerCase() === code.toLowerCase())).map(x => x.id) : [];

  const servicesResult = await access.create(userId, currentServiceId, organisation.id, externalIdentifiers, roles, correlationId);
  return servicesResult;
};
const completeMigration = async (emailConfId, saUserName, correlationId) => {
  await userCodes.deleteCode(emailConfId, correlationId, 'ConfirmMigratedEmail');

  await osa.requestSync(saUserName, correlationId);
};

const migrate = async (emailConfId, email, password, firstName, lastName, saOrganisation, serviceId, serviceRoles, saUserId, saUsername, correlationId) => {
  const user = await createOrUpdateUser(email, password, firstName, lastName, emailConfId, saUsername, correlationId);

  const organisation = await addUserToOrganisation(user.userId, saOrganisation, saUserId, saUsername, correlationId);

  const servicesResult = await addUserToService(user.userId, organisation, saOrganisation, serviceId,
    serviceRoles, saUserId, saUsername, correlationId);
  if (!servicesResult) {
    logger.audit({
      type: 'sign-in',
      subType: 'migration',
      userId: user.userId,
      application: config.loggerSettings.applicationName,
      env: config.hostingEnvironment.env,
      message: `Unsuccessful migration for ${saUsername} to ${email} (id: ${user.userId}) - unable to link user to organisation ${organisation.id} and to service id ${serviceId}`,
      meta: {
        success: false,
        userEmail: email,
      },
    });
    throw new Error('Error occurred migrating user services');
  }

  logger.audit({
    type: 'sign-in',
    subType: 'migration',
    userId: user.userId,
    application: config.loggerSettings.applicationName,
    env: config.hostingEnvironment.env,
    message: `Successful migration for ${saUsername} to ${email} (id: ${user.userId})`,
    meta: {
      success: true,
      userEmail: email,
    },
  });

  await completeMigration(emailConfId, saUsername, correlationId);
};

module.exports = {
  migrate,
};

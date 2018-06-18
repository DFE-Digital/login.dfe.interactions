'use strict';

const users = require('./../../infrastructure/Users');
const services = require('./../../infrastructure/Services');
const userCodes = require('./../../infrastructure/UserCodes');
const logger = require('./../../infrastructure/logger');
const { validate } = require('./../utils/validatePassword');
const org = require('./../../infrastructure/Organisations');

const establishment = '001';
const localAuthority = '002';
const multiAcademyTrust = '010';
const singleAcademyTrust = '013';


const validateInputAndUserCode = async (newPassword, confirmPassword, emailConfId, csrfToken, correlationId) => {
  const validationResult = {
    model: {
      csrfToken,
      newPassword: '',
      confirmPassword: '',
      validationFailed: true,
      backLink: true,
      validationMessages: {},
      emailConfId,
    },
    userCode: null,
  };

  const result = validate(newPassword, confirmPassword);
  if (result.failed) {
    validationResult.model.validationMessages = result.messages;
    return validationResult;
  }

  validationResult.userCode = await userCodes.getCode(emailConfId, correlationId, 'ConfirmMigratedEmail');
  if (!validationResult.userCode || !validationResult.userCode.userCode || !validationResult.userCode.userCode.contextData) {
    logger.warn(`Usercode no longer exists for ${emailConfId}`);
    validationResult.model.validationMessages.general = 'An error has occurred.';
  }

  return validationResult;
};
const createOrFindUser = async (email, password, firstName, lastName, emailConfId, saUsername, correlationId) => {
  logger.info(`Attempting to create user for ${saUsername} (email = ${email}, firstName = ${firstName}, lastName = ${lastName})`, { correlationId });
  const user = await users.create(email, password, firstName, lastName, emailConfId, saUsername, correlationId);
  if (user) {
    logger.info(`Created new user for SA user ${saUsername} with id ${user.id}`, { correlationId });
    return {
      userId: user.id,
      existing: false,
    };
  }

  logger.info(`Did not create user for SA user ${saUsername}. Seeing if user already exists with email (${email})`, { correlationId });
  const existingUser = await users.find(email, correlationId);
  if (existingUser) {
    logger.info(`Found existing user for SA user ${saUsername} with id ${existingUser.sub}`, { correlationId });
    return {
      userId: existingUser.sub,
      existing: true,
    };
  }

  throw new Error(`Failed to create or find a user for SA user ${saUsername} (email: ${email})`);
};
const addUserToOrganisation = async (userId, saOrganisation, correlationId) => {
  let orgId;
  if (saOrganisation.type === establishment) {
    orgId = saOrganisation.urn;
  } else if (saOrganisation.type === localAuthority) {
    orgId = saOrganisation.localAuthority;
  } else if (saOrganisation.type === multiAcademyTrust || saOrganisation.type === singleAcademyTrust) {
    orgId = saOrganisation.uid;
  }
  const organisation = await org.getOrganisationByExternalId(orgId, saOrganisation.type);
  if (!organisation) {
    throw new Error(`Failed to find an organisation of type ${saOrganisation.type} with id ${orgId} for user ${userId}`);
  }

  logger.info(`Adding user ${userId} to organisation ${organisation.id} with role ${saOrganisation.role.id}`, { correlationId });
  await org.setUsersRoleAtOrg(userId, organisation.id, saOrganisation.role.id, correlationId);

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

  externalIdentifiers.push({ key: 'localAuthority', value: saOrganisation.localAuthority });
  externalIdentifiers.push({ key: 'organisationName', value: saOrganisation.name});
  externalIdentifiers.push({ key: 'orgStatusName', value: saOrganisation.statusName});
  externalIdentifiers.push({ key: 'orgStatusCode', value: saOrganisation.statusCode});
  Object.keys(saOrganisation.establishmentData).forEach((ek) => {
    externalIdentifiers.push({ key: ek, value: saOrganisation.establishmentData[ek]});
  })

  const servicesResult = await services.create(userId, currentServiceId, organisation.id, externalIdentifiers, correlationId);
  return servicesResult;
};

const action = async (req, res) => {
  const validationResult = await validateInputAndUserCode(req.body.newPassword, req.body.confirmPassword, req.body.emailConfId, req.csrfToken(), req.id);
  if (Object.keys(validationResult.model.validationMessages).length > 0) {
    return res.render('migration/views/createPassword', validationResult.model);
  }

  const userCode = validationResult.userCode;
  const userToMigrate = JSON.parse(userCode.userCode.contextData);

  try {
    const user = await createOrFindUser(userCode.userCode.email, req.body.newPassword, userToMigrate.firstName, userToMigrate.lastName, userToMigrate.userName, req.id);
    const userId = user.userId;

    const organisation = await addUserToOrganisation(userId, userToMigrate.organisation, req.id);

    const servicesResult = await addUserToService(userId, organisation, userToMigrate.organisation, userToMigrate.serviceId,
      userToMigrate.service.roles, userToMigrate.osaUserId, userToMigrate.userName, req.id);


    if (!servicesResult) {
      logger.audit(`Unsuccessful migration for ${userToMigrate.userName} to ${userCode.userCode.email} (id: ${userId}) - unable to link user to organisation ${organisation.id} and to service id ${userToMigrate.serviceId}`, {
        type: 'sign-in',
        subType: 'migration',
        success: false,
        userId,
        userEmail: userCode.userCode.email,
      });

      validationResult.model.validationMessages.general = 'An error has occurred.';
      return res.render('migration/views/createPassword', validationResult.model);
    }

    logger.audit(`Successful migration for ${userToMigrate.userName} to ${userCode.userCode.email} (id: ${userId})`, {
      type: 'sign-in',
      subType: 'migration',
      success: true,
      userId,
      userEmail: userCode.userCode.email,
    });

    await userCodes.deleteCode(req.body.emailConfId, req.id, 'ConfirmMigratedEmail');

    if (user.existing) {
      validationResult.model.validationMessages.general = 'Email address has already been registered. Please sign in using your email address';
      return res.render('migration/views/createPassword', validationResult.model);
    }

    req.session.migrationUser = undefined;
    req.session.redirectUri = userCode.userCode.redirectUri;
    return res.redirect(`/${req.params.uuid}/migration/complete`);
  } catch (e) {
    logger.error(`Error migrating SA user ${userToMigrate.userName} - ${e.messge}`, { correlationId: req.id });
    validationResult.model.validationMessages.general = 'An error has occurred.';
    return res.render('migration/views/createPassword', validationResult.model);
  }
};

module.exports = action;

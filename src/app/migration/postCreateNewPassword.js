'use strict';

const userCodes = require('./../../infrastructure/UserCodes');
const Users = require('./../../infrastructure/Users');
const logger = require('./../../infrastructure/logger');
const { validate } = require('./../utils/validatePassword');
const { migrate } = require('./workflow');
const config = require('./../../infrastructure/Config')();


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

const action = async (req, res) => {
  const validationResult = await validateInputAndUserCode(req.body.newPassword, req.body.confirmPassword, req.body.emailConfId, req.csrfToken(), req.id);
  if (Object.keys(validationResult.model.validationMessages).length > 0) {
    return res.render('migration/views/createPassword', validationResult.model);
  }

  const userCode = validationResult.userCode;
  const userToMigrate = JSON.parse(userCode.userCode.contextData);

  const alreadyMigratedUser = await Users.findByLegacyUsername(userToMigrate.userName, req.id);
  if (alreadyMigratedUser) {
    logger.audit({
      type: 'sign-in',
      subType: 'username-password',
      success: false,
      userEmail: userToMigrate.userName,
      application: config.loggerSettings.applicationName,
      env: config.hostingEnvironment.env,
      message: `Attempt login to already migrated account for ${userToMigrate.userName}`,
    });
    req.migrationUser = {
      redirectUri: req.query.redirect_uri,
    };
    return res.redirect(`/${req.params.uuid}/migration/already-migrated`);
  }

  try {
    await migrate(req.body.emailConfId, userCode.userCode.email, req.body.newPassword, userToMigrate.firstName, userToMigrate.lastName,
      userToMigrate.organisation, userToMigrate.serviceId, userToMigrate.service.roles, userToMigrate.osaUserId, userToMigrate.userName, req.id);

    req.migrationUser = undefined;
    req.session.redirectUri = userCode.userCode.redirectUri;
    req.session.clientId = userCode.userCode.clientId;
    return res.redirect(`/${req.params.uuid}/migration/complete`);
  } catch (e) {
    logger.error(`Error migrating SA user ${userToMigrate.userName} - ${e.message}`, { correlationId: req.id });
    validationResult.model.validationMessages.general = 'An error has occurred.';
    return res.render('migration/views/createPassword', validationResult.model);
  }
};

module.exports = action;

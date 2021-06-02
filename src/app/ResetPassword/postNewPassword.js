'use strict';

const users = require('./../../infrastructure/Users');
const userCodes = require('./../../infrastructure/UserCodes');
const logger = require('./../../infrastructure/logger');
const config = require('./../../infrastructure/Config')();
const { validate } = require('./../utils/validatePassword');

const action = async (req, res) => {
  const validationResult = validate(req.body.newPassword, req.body.confirmPassword);

  if (validationResult.failed) {
    res.render('ResetPassword/views/newpassword', {
      csrfToken: req.csrfToken(),
      newPassword: '',
      confirmPassword: '',
      validationFailed: true,
      validationMessages: validationResult.messages,
      redirectUri: req.query.redirect_uri,
    });
    return;
  }

  await users.changePassword(req.session.uid, req.body.newPassword, req.id);

  const userCode = await userCodes.getCode(req.session.uid);

  await userCodes.deleteCode(req.session.uid);

  logger.audit({
    type: 'reset-password',
    subType: 'reset-password',
    success: true,
    userId: req.session.uid,
    application: config.loggerSettings.applicationName,
    env: config.hostingEnvironment.env,
    message: `Successful reset password for user id: ${req.session.uid}`,
  });

  req.session.redirectUri = userCode.userCode.redirectUri;
  res.redirect(`/${req.params.uuid}/resetpassword/complete`);
};

module.exports = action;

'use strict';

const userCodes = require('./../../infrastructure/UserCodes');
const logger = require('./../../infrastructure/logger');
const config = require('./../../infrastructure/Config')();


const validate = (code) => {
  const messages = {};
  let failed = false;

  if (code.length === 0) {
    messages.code = 'Enter the verification code included in the email we sent you.';
    failed = true;
  }

  return {
    failed,
    messages,
  };
};

const action = async (req, res) => {
  const validationResult = validate(req.body.code);

  if (validationResult.failed) {
    res.render('ResetPassword/views/confirm', {
      csrfToken: req.csrfToken(),
      uid: req.body.uid,
      code: req.body.code,
      validationFailed: true,
      validationMessages: validationResult.messages,
      clientId: req.body.clientId,
      redirectUri: req.body.redirectUri,
    });
    return;
  }

  let userCode;
  try {
    userCode = await userCodes.validateCode(req.body.uid, req.body.code, req.id);
  } catch (e) {
    logger.info(`Error confirming password reset for ${req.body.email} correlationId: ${req.id}`);
    logger.info(e);
  }

  if (userCode) {
    req.session.uid = req.body.uid;
    req.session.clientId = req.body.clientId;
    res.redirect(`/${req.params.uuid}/resetpassword/newpassword`);
    return;
  }

  logger.audit({
    type: 'reset-password',
    success: false,
    userId: req.body.uid,
    reqId: req.id,
    application: config.loggerSettings.applicationName,
    env: config.hostingEnvironment.env,
    message: `Failed attempt to reset password id: ${req.body.uid} - Invalid code`,
  });

  validationResult.messages.code = 'The code you entered is incorrect. Please check and try again.';
  res.render('ResetPassword/views/confirm', {
    csrfToken: req.csrfToken(),
    uid: req.body.uid,
    code: req.body.code,
    validationFailed: true,
    validationMessages: validationResult.messages,
    reqId: req.id,
    clientId: req.body.clientId,
    redirectUri: req.body.redirectUri,
  });
};

module.exports = action;

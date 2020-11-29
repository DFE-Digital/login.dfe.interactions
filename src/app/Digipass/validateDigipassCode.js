const { getDevices } = require('./../../infrastructure/Users');
const { validateDigipassToken } = require('./../../infrastructure/devices');
const logger = require('./../../infrastructure/logger');
const config = require('./../../infrastructure/Config')();
const InteractionComplete = require('./../InteractionComplete');

const validateInput = (code) => {
  const messages = {};
  let valid = true;

  if (!code) {
    messages.code = 'Please enter your token code';
    valid = false;
  } else if (code.length !== 8 || isNaN(parseInt(code))) {
    messages.code = 'Your token code must be 8 digits';
    valid = false;
  }

  return {
    valid,
    messages,
  };
};

const validateToken = async (uid, code, reqId) => {
  const devices = await getDevices(uid, reqId);
  if (!devices || devices.length === 0) {
    logger.info(`No devices for ${uid}`);
    logger.audit({
      type: 'sign-in',
      subType: 'digipass',
      success: false,
      userId: uid,
      reqId,
      application: config.loggerSettings.applicationName,
      env: config.hostingEnvironment.env,
      message: `Failed digipass challenge/response for ${uid} - no devices`,
    });
    return false;
  }

  const digipass = devices.find(d => d.type === 'digipass');
  if (!digipass) {
    logger.info(`No digipass devices for ${uid}`);
    logger.audit({
      type: 'sign-in',
      subType: 'digipass',
      success: false,
      userId: uid,
      reqId,
      application: config.loggerSettings.applicationName,
      env: config.hostingEnvironment.env,
      message: `Failed digipass challenge/response for ${uid} - no digipass`,
    });
    return false;
  }

  const valid = await validateDigipassToken(digipass.serialNumber, code, reqId);
  if (valid) {
    logger.audit({
      type: 'sign-in',
      subType: 'digipass',
      success: true,
      userId: uid,
      deviceSerialNumber: digipass.serialNumber,
      reqId,
      application: config.loggerSettings.applicationName,
      env: config.hostingEnvironment.env,
      message: `Successful digipass challenge/response for ${uid} using device ${digipass.serialNumber}`,
    });

  } else {
    logger.audit({
      type: 'sign-in',
      subType: 'digipass',
      success: false,
      userId: uid,
      deviceSerialNumber: digipass.serialNumber,
      reqId,
      application: config.loggerSettings.applicationName,
      env: config.hostingEnvironment.env,
      message: `Failed digipass challenge/response for ${uid} using device ${digipass.serialNumber}`,
    });
  }
  return valid;
};

const action = async (req, res) => {
  const validationResult = validateInput(req.body.code);
  if (!validationResult.valid) {
    return res.render('Digipass/views/token', {
      csrfToken: req.csrfToken(),
      code: '',
      validationMessages: validationResult.messages,
    });
  }

  const codeValid = await validateToken(req.query.uid, req.body.code, req.id);
  if (!codeValid) {
    return res.render('Digipass/views/token', {
      csrfToken: req.csrfToken(),
      code: '',
      validationMessages: {
        code: 'The token code you entered is invalid',
      },
    });
  }

  return InteractionComplete.process(req.params.uuid, { status: 'success', uid: req.query.uid, type: 'digipass' }, req, res);
};

module.exports = action;

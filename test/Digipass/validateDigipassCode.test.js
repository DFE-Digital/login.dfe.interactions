jest.mock('./../../src/infrastructure/Users', () => {
  return {
    getDevices: jest.fn(),
  };
});
jest.mock('./../../src/infrastructure/devices', () => {
  return {
    validateDigipassToken: jest.fn(),
  };
});
jest.mock('./../../src/infrastructure/logger', () => {
  return {
    audit: jest.fn(),
    info: jest.fn(),
  };
});
jest.mock('login.dfe.audit.winston-sequelize-transport');
jest.mock('./../../src/app/InteractionComplete');
jest.mock('./../../src/infrastructure/config', () => {
  return {
    loggerSettings: {
      applicationName: 'test',
    },
  };
});
const validateDigipassCode = require('./../../src/app/Digipass/validateDigipassCode');
const utils = require('./../utils');

describe('when validating the user entered digipass code', () => {
  let req;
  let res;
  let getDevices;
  let validateDigipassToken;
  let processComplete;
  let logger;

  beforeEach(() => {
    req = utils.mockRequest();
    req.body.code = '12345678';
    req.query.uid = 'user-1';

    res = utils.mockResponse();

    getDevices = require('./../../src/infrastructure/Users').getDevices;
    getDevices.mockReset();
    getDevices.mockReturnValue([
      { id: '1', type: 'authenticator', serialNumber: '0987654' },
      { id: '2', type: 'digipass', serialNumber: '567890' },
    ]);

    validateDigipassToken = require('./../../src/infrastructure/devices').validateDigipassToken;
    validateDigipassToken.mockReset();
    validateDigipassToken.mockReturnValue(true);

    processComplete = require('./../../src/app/InteractionComplete').process;
    processComplete.mockReset();

    logger = require('./../../src/infrastructure/logger');
  });

  it('then it should get list of devices for user', async () => {
    await validateDigipassCode(req, res);

    expect(getDevices.mock.calls).toHaveLength(1);
    expect(getDevices.mock.calls[0][0]).toBe('user-1');
  });

  it('then it should use digipass device to validate code', async () => {
    await validateDigipassCode(req, res);

    expect(validateDigipassToken.mock.calls).toHaveLength(1);
    expect(validateDigipassToken.mock.calls[0][0]).toBe('567890');
    expect(validateDigipassToken.mock.calls[0][1]).toBe('12345678');
  });

  it('then it should complete the interaction', async () => {
    await validateDigipassCode(req, res);

    expect(processComplete.mock.calls).toHaveLength(1);
    expect(processComplete.mock.calls[0][0]).toBe(req.params.uuid);
    expect(processComplete.mock.calls[0][1]).toMatchObject({
      status: 'success',
      type: 'digipass',
      uid: 'user-1',
    });
  });

  it('then it should return errored view if code not entered', async () => {
    req.body.code = undefined;

    await validateDigipassCode(req, res);

    expect(res.render.mock.calls).toHaveLength(1);
    expect(res.render.mock.calls[0][0]).toBe('Digipass/views/token');
    expect(res.render.mock.calls[0][1]).toMatchObject({
      csrfToken: 'token',
      code: '',
      validationMessages: {
        code: 'Please enter your token code',
      },
    });
  });

  it('then it should return errored view if code is not 8 characters long', async () => {
    req.body.code = '123456';

    await validateDigipassCode(req, res);

    expect(res.render.mock.calls).toHaveLength(1);
    expect(res.render.mock.calls[0][0]).toBe('Digipass/views/token');
    expect(res.render.mock.calls[0][1]).toMatchObject({
      csrfToken: 'token',
      code: '',
      validationMessages: {
        code: 'Your token code must be 8 digits',
      },
    });
  });

  it('then it should return errored view if code is not numeric', async () => {
    req.body.code = 'abcdefgh';

    await validateDigipassCode(req, res);

    expect(res.render.mock.calls).toHaveLength(1);
    expect(res.render.mock.calls[0][0]).toBe('Digipass/views/token');
    expect(res.render.mock.calls[0][1]).toMatchObject({
      csrfToken: 'token',
      code: '',
      validationMessages: {
        code: 'Your token code must be 8 digits',
      },
    });
  });

  it('then it should return errored view if user has no devices registered', async () => {
    getDevices.mockReturnValue([]);

    await validateDigipassCode(req, res);

    expect(res.render.mock.calls).toHaveLength(1);
    expect(res.render.mock.calls[0][0]).toBe('Digipass/views/token');
    expect(res.render.mock.calls[0][1]).toMatchObject({
      csrfToken: 'token',
      code: '',
      validationMessages: {
        code: 'The token code you entered is invalid',
      },
    });
    expect(validateDigipassToken.mock.calls).toHaveLength(0);
  });

  it('then it should return errored view if user has no digipass devices registered', async () => {
    getDevices.mockReturnValue([
      { id: '1', type: 'authenticator', serialNumber: '0987654' },
    ]);

    await validateDigipassCode(req, res);

    expect(res.render.mock.calls).toHaveLength(1);
    expect(res.render.mock.calls[0][0]).toBe('Digipass/views/token');
    expect(res.render.mock.calls[0][1]).toMatchObject({
      csrfToken: 'token',
      code: '',
      validationMessages: {
        code: 'The token code you entered is invalid',
      },
    });
    expect(validateDigipassToken.mock.calls).toHaveLength(0);
  });

  it('then it should return errored view if code not valid', async () => {
    validateDigipassToken.mockReturnValue(false);

    await validateDigipassCode(req, res);

    expect(res.render.mock.calls).toHaveLength(1);
    expect(res.render.mock.calls[0][0]).toBe('Digipass/views/token');
    expect(res.render.mock.calls[0][1]).toMatchObject({
      csrfToken: 'token',
      code: '',
      validationMessages: {
        code: 'The token code you entered is invalid',
      },
    });
    expect(validateDigipassToken.mock.calls).toHaveLength(1);
  });

  it('then it should audit successful authentication', async () => {
    await validateDigipassCode(req, res);

    expect(logger.audit.mock.calls).toHaveLength(1);
    expect(logger.audit.mock.calls[0][0]).toBe('Successful digipass challenge/response for user-1 using device 567890');
    expect(logger.audit.mock.calls[0][1]).toMatchObject({
      type: 'sign-in',
      subType: 'digipass',
      success: true,
      userId: 'user-1',
      deviceSerialNumber: '567890',
    });
  });

  it('then it should audit failure if code not valid', async () => {
    validateDigipassToken.mockReturnValue(false);

    await validateDigipassCode(req, res);

    expect(logger.audit.mock.calls).toHaveLength(1);
    expect(logger.audit.mock.calls[0][0]).toBe('Failed digipass challenge/response for user-1 using device 567890');
    expect(logger.audit.mock.calls[0][1]).toMatchObject({
      type: 'sign-in',
      subType: 'digipass',
      success: false,
      userId: 'user-1',
      deviceSerialNumber: '567890',
    });
  });

  it('then it should audit failure if user has no digipass device registered', async () => {
    getDevices.mockReturnValue([
      { id: '1', type: 'authenticator', serialNumber: '0987654' },
    ]);

    await validateDigipassCode(req, res);

    expect(logger.audit.mock.calls).toHaveLength(1);
    expect(logger.audit.mock.calls[0][0]).toBe('Failed digipass challenge/response for user-1 - no digipass');
    expect(logger.audit.mock.calls[0][1]).toMatchObject({
      type: 'sign-in',
      subType: 'digipass',
      success: false,
      userId: 'user-1',
    });
  });

  it('then it should audit failure if user has no devices registered', async () => {
    getDevices.mockReturnValue([]);

    await validateDigipassCode(req, res);

    expect(logger.audit.mock.calls).toHaveLength(1);
    expect(logger.audit.mock.calls[0][0]).toBe('Failed digipass challenge/response for user-1 - no devices');
    expect(logger.audit.mock.calls[0][1]).toMatchObject({
      type: 'sign-in',
      subType: 'digipass',
      success: false,
      userId: 'user-1',
    });
  });
});

jest.mock('login.dfe.request-promise-retry');
jest.mock('login.dfe.audit.winston-sequelize-transport');
jest.mock('login.dfe.jwt-strategies', () => {
  return jest.fn().mockImplementation(() => {
    return {
      getBearerToken: jest.fn().mockReturnValue('token'),
    };
  });
});
jest.mock('agentkeepalive', () => ({
  HttpsAgent: jest.fn(),
}));
jest.mock('./../../src/infrastructure/Config', () => {
  return jest.fn().mockImplementation(() => {
    return {
      devices: {
        service: {
          url: 'https://devices.test',
        },
      },
      hostingEnvironment: {
        agentKeepAlive: {},
      },
    };
  });
});
jest.mock('./../../src/infrastructure/logger', () => {
  return {
    warn :jest.fn()
  };
});


const rp = jest.fn();
const requestPromise = require('login.dfe.request-promise-retry');
requestPromise.defaults.mockReturnValue(rp);

const { validateDigipassToken } = require('./../../src/infrastructure/devices/devicesApi');

const serialNumber = '123456';
const code = '987654';

describe('When validating a digipass code with the api', () => {

  beforeEach(() => {
    rp.mockReturnValue({
      valid: true,
    });
  });

  it('then it should post to the api', async () => {
    await validateDigipassToken(serialNumber, code);

    expect(rp.mock.calls).toHaveLength(1);
    expect(rp.mock.calls[0][0].method).toBe('POST');
    expect(rp.mock.calls[0][0].uri).toBe('https://devices.test/digipass/123456/verify');
  });

  it('then it should authorize with the api using the jwt token', async () => {
    await validateDigipassToken(serialNumber, code);

    expect(rp.mock.calls[0][0].headers.authorization).toBe('bearer token');
  });

  it('then it should include the code in the body', async () => {
    await validateDigipassToken(serialNumber, code);

    expect(rp.mock.calls[0][0].body).toMatchObject({
      code,
    });
  });

  it('then it should return the validity response from the api', async () => {
    const actual = await validateDigipassToken(serialNumber, code);

    expect(actual).toBe(true);
  });

  it('then it should return false if api returns 404', async () => {
    rp.mockImplementation(() => {
      const error = new Error('test');
      error.statusCode = 404;
      throw error;
    });

    const actual = await validateDigipassToken(serialNumber, code);

    expect(actual).toBe(false);
  });

  it('then it should throw error if api returns 500', async () => {
    rp.mockImplementation(() => {
      const error = new Error('test');
      error.statusCode = 500;
      throw error;
    });

    try {
      await validateDigipassToken(serialNumber, code);
      throw new Error('No error thrown');
    } catch (e) {
      expect(e.message).toBe('test');
    }
  });
});

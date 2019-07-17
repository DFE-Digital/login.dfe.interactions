jest.mock('login.dfe.request-promise-retry');
jest.mock('./../../src/infrastructure/Config', () => {
  return jest.fn().mockImplementation(() => {
    return {
      directories: {
        service: {
          url: 'https://directories.test',
        },
      },
      hostingEnvironment: {
        agentKeepAlive: {},
      },
    };
  });
});
jest.mock('agentkeepalive', () => ({
  HttpsAgent: jest.fn(),
}));
jest.mock('login.dfe.jwt-strategies', () => {
  return jest.fn().mockImplementation(() => {
    return {
      getBearerToken: jest.fn().mockReturnValue('token'),
    };
  });
});

const rp = jest.fn();
const requestPromise = require('login.dfe.request-promise-retry');
requestPromise.defaults.mockReturnValue(rp);


const { getDevices } = require('./../../src/infrastructure/Users/DirectoriesApiUserAdapter');

const uid = 'user-1';


describe('when getting users devices', () => {

  beforeEach(() => {
    rp.mockReturnValue([
      {
        id: 'device-1',
        type: 'test',
        serialNumber: '123456',
      },
    ]);
  });

  it('then it should get devices from user url', async () => {
    await getDevices(uid);

    expect(rp.mock.calls).toHaveLength(1);
    expect(rp.mock.calls[0][0].method).toBe('GET');
    expect(rp.mock.calls[0][0].uri).toBe('https://directories.test/users/user-1/devices');
  });

  it('then it should authorize with the api using the jwt token', async () => {
    await getDevices(uid);

    expect(rp.mock.calls).toHaveLength(1);
    expect(rp.mock.calls[0][0].headers.authorization).toBe('bearer token');
  });

  it('then it should return result of api call', async () => {
    const actual = await getDevices(uid);

    expect(actual).not.toBeNull();
    expect(actual).toHaveLength(1);
    expect(actual[0]).toMatchObject({
      id: 'device-1',
      type: 'test',
      serialNumber: '123456',
    });
  });

  it('then it should return null if api returns 404', async () => {
    rp.mockImplementation(() => {
      const error = new Error('test');
      error.statusCode = 404;
      throw error;
    });

    const actual = await getDevices(uid);

    expect(actual).toBeNull();
  });

  it('then it should throw error if api returns 500', async () => {
    rp.mockImplementation(() => {
      const error = new Error('test');
      error.statusCode = 500;
      throw error;
    });

    try {
      await getDevices(uid);
      throw new Error('No error thrown');
    } catch (e) {
      expect(e.message).toBe('test');
    }
  });
});

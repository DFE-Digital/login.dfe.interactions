jest.mock('login.dfe.request-promise-retry');
jest.mock('login.dfe.jwt-strategies');
jest.mock('../../src/infrastructure/Config');
jest.mock('agentkeepalive', () => ({
  HttpsAgent: jest.fn(),
}));
const rp = jest.fn();
const requestPromise = require('login.dfe.request-promise-retry');
requestPromise.defaults.mockReturnValue(rp);

describe('When changing password for a user with the api', () => {
  const uid = 'user1';
  const password = 'password';
  const bearerToken = 'some-token';

  let jwtGetBearerToken;

  let directoriesApiUserAdapter;

  beforeEach(() => {
    rp.mockReturnValue('user1');

    jwtGetBearerToken = jest.fn().mockReturnValue(bearerToken);
    const jwt = require('login.dfe.jwt-strategies');
    jwt.mockImplementation(jwtConfig => ({
      getBearerToken: jwtGetBearerToken,
    }));

    const config = require('./../../src/infrastructure/Config');
    config.mockImplementation(() => ({
      directories: {
        service: {
          url: 'https://directories.login.dfe.test',
        },
      },
      hostingEnvironment: {
        agentKeepAlive: {},
      },
    }));

    directoriesApiUserAdapter = require('./../../src/infrastructure/Users/DirectoriesApiUserAdapter');
  });

  it('then it should set users password in directories api', async () => {
    await directoriesApiUserAdapter.changePassword(uid, password);

    expect(rp.mock.calls[0][0].uri).toBe('https://directories.login.dfe.test/users/user1/changepassword');
  });

  it('then it should jwt as auth for api call', async () => {
    await directoriesApiUserAdapter.changePassword(uid, password);

    expect(rp.mock.calls[0][0].headers.authorization).toBe(`bearer ${bearerToken}`);
  });

  it('then it should send new password in body', async () => {
    await directoriesApiUserAdapter.changePassword(uid, password);

    expect(rp.mock.calls[0][0].body.password).toBe(password);
  });

  it('then it should throw error if api call fails', async () => {
    rp.mockImplementation(() => {
      throw new Error('unit test');
    });

    try {
      await directoriesApiUserAdapter.changePassword(uid, password);
      throw new Error('didnt throw an error');
    } catch (e) {
      expect(e.message).toBe('Error: unit test');
    }
  });
});

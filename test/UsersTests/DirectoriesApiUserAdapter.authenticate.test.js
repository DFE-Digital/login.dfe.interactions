jest.mock('login.dfe.request-promise-retry');
jest.mock('login.dfe.jwt-strategies');
jest.mock('../../src/infrastructure/Config');
jest.mock('agentkeepalive', () => ({
  HttpsAgent: jest.fn(),
}));
const rp = jest.fn();
const requestPromise = require('login.dfe.request-promise-retry');
requestPromise.defaults.mockReturnValue(rp);

describe('When authenticating a user with the api', () => {
  const username = 'user.one@unit.tests';
  const password = 'mary-had-a-little-lamb';
  const bearerToken = 'some-token';

  let jwtGetBearerToken;

  let directoriesApiUserAdapter;

  beforeEach(() => {
    rp.mockReset().mockReturnValue('user1');

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

  it('it should post to the clients directory', async () => {
    await directoriesApiUserAdapter.authenticate(username, password);

    expect(rp.mock.calls[0][0].method).toBe('POST');
    expect(rp.mock.calls[0][0].uri).toBe('https://directories.login.dfe.test/users/authenticate');
  });

  it('it should send entered username and password', async () => {
    await directoriesApiUserAdapter.authenticate(username, password);

    expect(rp.mock.calls[0][0].body.username).toBe(username);
    expect(rp.mock.calls[0][0].body.password).toBe(password);
  });

  it('it should user the jwt token for authorization', async () => {
    await directoriesApiUserAdapter.authenticate(username, password);

    expect(rp.mock.calls[0][0].headers.authorization).toBe(`bearer ${bearerToken}`);
  });

  it('then it should throw an error if the api call failed', async () => {
    rp.mockImplementation(() => {
      const error = new Error();
      error.statusCode = 500;
      throw error;
    });

    try {
      await directoriesApiUserAdapter.authenticate(username, password);
      throw new Error('No error thrown!');
    } catch (e) {
      if (e.message === 'No error thrown!') {
        throw e;
      }
    }
  });

  describe('with valid credentials', () => {
    it('then it should return the user id if user active', async () => {
      const userId = await directoriesApiUserAdapter.authenticate(username, password);

      expect(userId).not.toBeNull();
      expect(userId.id).toBe('user1');
    });

    it('then it should return the status if user inactive', async () => {
      rp.mockImplementation(() => {
        const error = new Error();
        error.statusCode = 403;
        error.error = {
          reason_code: 'ACCOUNT_DEACTIVATED',
          reason_description: 'Account has been deactivated',
        };
        throw error;
      });

      const user = await directoriesApiUserAdapter.authenticate(username, password);

      expect(user).not.toBeNull();
      expect(user.status).toBe('Deactivated');
    });
  });

  describe('with invalid credentials', () => {
    beforeEach(() => {
      rp.mockImplementation(() => {
        const error = new Error();
        error.statusCode = 403;
        throw error;
      });
    });

    it('then it should return null', async () => {
      const userId = await directoriesApiUserAdapter.authenticate(username, password);

      expect(userId).toBeNull();
    });
  });
});

jest.mock('login.dfe.request-promise-retry');
jest.mock('login.dfe.jwt-strategies');
jest.mock('../../src/infrastructure/Config');
jest.mock('agentkeepalive', () => ({
  HttpsAgent: jest.fn(),
}));
const rp = jest.fn();
const requestPromise = require('login.dfe.request-promise-retry');
requestPromise.defaults.mockReturnValue(rp);

describe('When creating a user with the api', () => {
  const username = 'user.one@unit.tests';
  const password = 'mary-had-a-little-lamb';
  const firstName = 'Tester';
  const lastName = 'Testing';
  const legacyUsername = 'old_login_name';
  const bearerToken = 'some-token';
  const expectedCorrelationId = 'some-uid';

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

  it('it should post to the directories api', async () => {
    await directoriesApiUserAdapter.create(username, password, firstName, lastName,legacyUsername, expectedCorrelationId);

    expect(rp.mock.calls[0][0].method).toBe('POST');
    expect(rp.mock.calls[0][0].uri).toBe('https://directories.login.dfe.test/users');
  });

  it('it should send entered user information', async () => {
    await directoriesApiUserAdapter.create(username, password, firstName, lastName,legacyUsername, expectedCorrelationId);

    expect(rp.mock.calls[0][0].body.email).toBe(username);
    expect(rp.mock.calls[0][0].body.password).toBe(password);
    expect(rp.mock.calls[0][0].body.firstName).toBe(firstName);
    expect(rp.mock.calls[0][0].body.lastName).toBe(lastName);
    expect(rp.mock.calls[0][0].body.legacy_username).toBe(legacyUsername);
  });

  it('then the correlation id is passed in the header', async () => {
    await directoriesApiUserAdapter.create(username, password, firstName, lastName,legacyUsername, expectedCorrelationId);

    expect(rp.mock.calls[0][0].headers['x-correlation-id']).toBe(expectedCorrelationId);
  });

  it('it should user the jwt token for authorization', async () => {
    await directoriesApiUserAdapter.create(username, password, firstName, lastName,legacyUsername, expectedCorrelationId);

    expect(rp.mock.calls[0][0].headers.authorization).toBe(`bearer ${bearerToken}`);
  });

  it('then null is returned if a conflict status code is returned', async () => {
    rp.mockImplementation(() => {
      const error = new Error();
      error.statusCode = 409;
      throw error;
    });

    const actual = await directoriesApiUserAdapter.create(username, password, firstName, lastName,legacyUsername, expectedCorrelationId);

    expect(actual).toBe(null);
  });

  it('then it should throw an error if the api call failed', async () => {
    rp.mockImplementation(() => {
      const error = new Error();
      error.statusCode = 500;
      throw error;
    });

    try {
      await directoriesApiUserAdapter.create(username, password, firstName, lastName,legacyUsername, expectedCorrelationId);
      throw new Error('No error thrown!');
    } catch (e) {
      if (e.message === 'No error thrown!') {
        throw e;
      }
    }
  });

});

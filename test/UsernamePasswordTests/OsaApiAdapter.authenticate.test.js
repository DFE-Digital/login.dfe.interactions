jest.mock('login.dfe.request-promise-retry');
jest.mock('agentkeepalive', () => ({
  HttpsAgent: jest.fn(),
}));
jest.mock('login.dfe.jwt-strategies');
jest.mock('../../src/infrastructure/Config');

const rp = jest.fn();
const requestPromise = require('login.dfe.request-promise-retry');

requestPromise.defaults.mockReturnValue(rp);


describe('When authenticating a user with the OSA api', () => {
  const username = 'user.one@unit.tests';
  const password = 'mary-had-a-little-lamb';
  const bearerToken = 'some-token';

  let jwtGetBearerToken;

  let osaApiUserAdapter;

  beforeEach(() => {
    rp.mockReset().mockReturnValue('user1');

    jwtGetBearerToken = jest.fn().mockReturnValue(bearerToken);
    const jwt = require('login.dfe.jwt-strategies');
    jwt.mockImplementation(jwtConfig => ({
      getBearerToken: jwtGetBearerToken,
    }));

    const config = require('./../../src/infrastructure/Config');
    config.mockImplementation(() => ({
      osaApi: {
        service: {
          url: 'https://osa.login.dfe.test',
        },
      },
      hostingEnvironment: {
        agentKeepAlive: {},
      },
    }));

    osaApiUserAdapter = require('./../../src/infrastructure/osa/OsaApiAdapter');
  });

  it('it should post to the osa api', async () => {
    await osaApiUserAdapter.authenticate(username, password);

    expect(rp.mock.calls[0][0].method).toBe('POST');
    expect(rp.mock.calls[0][0].uri).toBe('https://osa.login.dfe.test/authenticate');
  });

  it('it should send entered username and password', async () => {
    await osaApiUserAdapter.authenticate(username, password);

    expect(rp.mock.calls[0][0].body.username).toBe(username);
    expect(rp.mock.calls[0][0].body.password).toBe(password);
  });

  it('it should user the jwt token for authorization', async () => {
    await osaApiUserAdapter.authenticate(username, password);

    expect(rp.mock.calls[0][0].headers.authorization).toBe(`bearer ${bearerToken}`);
  });

  it('then it should throw an error if the api call failed', async () => {
    rp.mockImplementation(() => {
      const error = new Error();
      error.statusCode = 500;
      throw error;
    });

    try {
      await osaApiUserAdapter.authenticate(username, password);
      throw new Error('No error thrown!');
    } catch (e) {
      if (e.message === 'No error thrown!') {
        throw e;
      }
    }
  });

});

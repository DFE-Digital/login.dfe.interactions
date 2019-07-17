jest.mock('login.dfe.request-promise-retry');
jest.mock('login.dfe.jwt-strategies');
jest.mock('../../src/infrastructure/Config');
jest.mock('agentkeepalive', () => ({
  HttpsAgent: jest.fn(),
}));
const rp = jest.fn();
const requestPromise = require('login.dfe.request-promise-retry');
requestPromise.defaults.mockReturnValue(rp);


describe('When getting a reset code through the api', () => {
  let jwtGetBearerToken;

  let userCodesApiAdapter;

  beforeEach(() => {
    rp.mockReturnValue('user1');

    jwtGetBearerToken = jest.fn().mockReturnValue('some-token');
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

    userCodesApiAdapter = require('./../../src/infrastructure/UserCodes/UserCodesApiAdapter');
  });

  it('then the user codes api endpoint is called with the default code type', async () => {
    const userId = 'user1@test.com';

    await userCodesApiAdapter.getCode(userId);

    expect(rp.mock.calls).toHaveLength(1);
    expect(rp.mock.calls[0][0].method).toBe('GET');
    expect(rp.mock.calls[0][0].uri).toBe(`https://directories.login.dfe.test/userCodes/${userId}/PasswordReset`);
  });

  it('then the user codes api endpoint is called with the passed in code type', async () => {
    const userId = 'user1@test.com';

    await userCodesApiAdapter.getCode(userId,'123abc342', 'ConfirmEmail');

    expect(rp.mock.calls).toHaveLength(1);
    expect(rp.mock.calls[0][0].method).toBe('GET');
    expect(rp.mock.calls[0][0].uri).toBe(`https://directories.login.dfe.test/userCodes/${userId}/ConfirmEmail`);
  });
});

jest.mock('login.dfe.request-promise-retry');
jest.mock('agentkeepalive', () => ({
  HttpsAgent: jest.fn(),
}));
jest.mock('login.dfe.jwt-strategies');
jest.mock('../../src/infrastructure/Config');

const rp = jest.fn();
const requestPromise = require('login.dfe.request-promise-retry');

requestPromise.defaults.mockReturnValue(rp);


describe('When validating a reset code through the api', () => {
  let jwtGetBearerToken;

  let userCodesApiAdapter;

  beforeEach(() => {
    rp.mockReturnValue('ABC123');

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

  it('then the user codes api endpoint is called', async () => {
    const userId = 'user1@test.com';
    const code = 'ABC123';
    rp.mockReturnValue(code);

    await userCodesApiAdapter.validateCode(userId, code);

    expect(rp.mock.calls).toHaveLength(1);
    expect(rp.mock.calls[0][0].method).toBe('GET');
    expect(rp.mock.calls[0][0].uri).toBe(`https://directories.login.dfe.test/userCodes/validate/${userId}/${code}/PasswordReset`);
  });

  it('then the code is returned if the response is valid', async () => {
    const userId = 'user1@test.com';
    const code = 'ABC123';
    rp.mockReturnValue(code);

    const actual = await userCodesApiAdapter.validateCode(userId, code);

    expect(actual).not.toBeNull();
    expect(actual.userCode).toBe(code);
  });

  it('then null is returned if a 404 is received', async () => {
    rp.mockImplementation(() => {
      const error = new Error();
      error.statusCode = 404;
      throw error;
    });

    const actual = await userCodesApiAdapter.validateCode('user', 'code');

    expect(actual).toBeNull();
  });
});

jest.mock('login.dfe.request-promise-retry');
jest.mock('login.dfe.jwt-strategies');
jest.mock('../../src/infrastructure/Config');
jest.mock('agentkeepalive', () => ({
  HttpsAgent: jest.fn(),
}));
const rp = jest.fn();
const requestPromise = require('login.dfe.request-promise-retry');
requestPromise.defaults.mockReturnValue(rp);


describe('When deleting a reset code through the api', () => {
  let jwtGetBearerToken;

  let userCodesApiAdapter;

  beforeEach(() => {
    rp.mockReturnValue('user1');

    jwtGetBearerToken = jest.fn().mockReturnValue('some-token');
    const jwt = require('login.dfe.jwt-strategies');
    jwt.mockImplementation((jwtConfig) => {
      return {
        getBearerToken: jwtGetBearerToken
      };
    });

    const config = require('./../../src/infrastructure/Config');
    config.mockImplementation(() => {
      return {
        directories: {
          service: {
            url: 'https://directories.login.dfe.test',
          },
        },
        hostingEnvironment: {
          agentKeepAlive: {},
        },
      }
    });

    userCodesApiAdapter = require('./../../src/infrastructure/UserCodes/UserCodesApiAdapter');
  });

  it('then the user codes api endpoint is called', async () => {
    const userId = 'user1@test.com';

    await userCodesApiAdapter.deleteCode(userId);

    expect(rp.mock.calls.length).toBe(1);
    expect(rp.mock.calls[0][0].method).toBe('DELETE');
    expect(rp.mock.calls[0][0].uri).toBe(`https://directories.login.dfe.test/userCodes/${userId}`);
  });
});

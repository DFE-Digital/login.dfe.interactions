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
  const userId = 'user-1';
  const serviceId = 'svc-1';
  const organisationId = 'org-1';
  const externalIdentifiers = [{ key: 'foo', value: 'bar' }];
  const orgType = '001';
  const bearerToken = 'some-token';
  const expectedCorrelationId = 'some-uid';

  let jwtGetBearerToken;

  let servicesApiUserAdapter;

  beforeEach(() => {
    rp.mockReset().mockReturnValue('user1');

    jwtGetBearerToken = jest.fn().mockReturnValue(bearerToken);
    const jwt = require('login.dfe.jwt-strategies');
    jwt.mockImplementation(jwtConfig => ({
      getBearerToken: jwtGetBearerToken,
    }));

    const config = require('./../../src/infrastructure/Config');
    config.mockImplementation(() => ({
      organisations: {
        service: {
          url: 'https://organisations.login.dfe.test',
        },
      },
      hostingEnvironment: {
        agentKeepAlive: {},
      },
    }));

    servicesApiUserAdapter = require('./../../src/infrastructure/Services/ServicesApiAdapter');
  });

  it('then the data is posted to the organisations api', async () => {
    await servicesApiUserAdapter.create(userId, serviceId, organisationId, orgType, expectedCorrelationId);

    expect(rp.mock.calls[0][0].method).toBe('PUT');
    expect(rp.mock.calls[0][0].uri).toBe(`https://organisations.login.dfe.test/organisations/${organisationId}/services/${serviceId}/users/${userId}`);
  });

  it('then the bearer token is passed in the header', async () => {
    await servicesApiUserAdapter.create(userId, serviceId, organisationId, orgType, expectedCorrelationId);

    expect(rp.mock.calls[0][0].headers.authorization).toBe(`bearer ${bearerToken}`);
  });

  it('then the correlation id is passed in the header', async () => {
    await servicesApiUserAdapter.create(userId, serviceId, organisationId, orgType, expectedCorrelationId);

    expect(rp.mock.calls[0][0].headers['x-correlation-id']).toBe(expectedCorrelationId);
  });

  it('then the body parameters are passed to the API', async () => {
    await servicesApiUserAdapter.create(userId, serviceId, organisationId, externalIdentifiers, expectedCorrelationId);

    expect(rp.mock.calls[0][0].body.externalIdentifiers).toBe(externalIdentifiers);
  });

  it('then false is returned if a 403 is returned from the API', async () => {
    rp.mockImplementation(() => {
      const error = new Error();
      error.statusCode = 403;
      throw error;
    });

    const actual = await servicesApiUserAdapter.create(userId, serviceId, organisationId, orgType, expectedCorrelationId);

    expect(actual).toBe(false);
  });

  it('then true is returned when the request is accepted', async () => {
    const actual = await servicesApiUserAdapter.create(userId, serviceId, organisationId, orgType, expectedCorrelationId);

    expect(actual).toBe(true);
  });

  it('then an error is thrown if the api call failed', async () => {
    rp.mockImplementation(() => {
      const error = new Error();
      error.statusCode = 500;
      throw error;
    });

    try {
      await servicesApiUserAdapter.create(userId, serviceId, organisationId, orgType, expectedCorrelationId);
      throw new Error('No error thrown!');
    } catch (e) {
      if (e.message === 'No error thrown!') {
        throw e;
      }
    }
  });
});

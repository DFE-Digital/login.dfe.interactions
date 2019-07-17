jest.mock('login.dfe.request-promise-retry');
jest.mock('login.dfe.jwt-strategies');
jest.mock('../../src/infrastructure/Config');
jest.mock('agentkeepalive', () => ({
  HttpsAgent: jest.fn(),
}));
const rp = jest.fn();
const requestPromise = require('login.dfe.request-promise-retry');

requestPromise.defaults.mockReturnValue(rp);

describe('When getting an organisation by external id with the api', () => {
  const organisationId = 'org-1';
  const orgType = '001';
  const bearerToken = 'some-token';
  const expectedCorrelationId = 'some-uid';

  let jwtGetBearerToken;

  let organisationsApiAdapter;

  beforeEach(() => {
    rp.mockReset().mockReturnValue({id: '123'});

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

    organisationsApiAdapter = require('./../../src/infrastructure/Organisations/OrganisationApiAdapter');
  });

  it('then the data retrieved from the organisations api', async () => {
    await organisationsApiAdapter.getOrganisationByExternalId(organisationId, orgType, expectedCorrelationId);

    expect(rp.mock.calls[0][0].method).toBe('GET');
    expect(rp.mock.calls[0][0].uri).toBe(`https://organisations.login.dfe.test/organisations/by-external-id/${orgType}/${organisationId}`);
  });

  it('then the bearer token is passed in the header', async () => {
    await organisationsApiAdapter.getOrganisationByExternalId(organisationId, orgType, expectedCorrelationId);

    expect(rp.mock.calls[0][0].headers.authorization).toBe(`bearer ${bearerToken}`);
  });

  it('then the correlation id is passed in the header', async () => {
    await organisationsApiAdapter.getOrganisationByExternalId(organisationId, orgType, expectedCorrelationId);

    expect(rp.mock.calls[0][0].headers['x-correlation-id']).toBe(expectedCorrelationId);
  });

  it('then null is returned if a 404 is returned from the API', async () => {
    rp.mockImplementation(() => {
      const error = new Error();
      error.statusCode = 404;
      throw error;
    });

    const actual = await organisationsApiAdapter.getOrganisationByExternalId(organisationId, orgType, expectedCorrelationId);

    expect(actual).toBe(null);
  });

  it('then true is returned when the request is accepted', async () => {
    const actual = await organisationsApiAdapter.getOrganisationByExternalId(organisationId, orgType, expectedCorrelationId);

    expect(actual.id).toBe('123');
  });

  it('then an error is thrown if the api call failed', async () => {
    rp.mockImplementation(() => {
      const error = new Error();
      error.statusCode = 500;
      throw error;
    });

    try {
      await organisationsApiAdapter.getOrganisationByExternalId(organisationId, orgType, expectedCorrelationId);
      throw new Error('No error thrown!');
    } catch (e) {
      if (e.message === 'No error thrown!') {
        throw e;
      }
    }
  });
});

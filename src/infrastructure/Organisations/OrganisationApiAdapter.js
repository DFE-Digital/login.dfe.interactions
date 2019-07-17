const config = require('./../Config')();
const KeepAliveAgent = require('agentkeepalive').HttpsAgent;
const rp = require('login.dfe.request-promise-retry').defaults({
  agent: new KeepAliveAgent({
    maxSockets: config.hostingEnvironment.agentKeepAlive.maxSockets,
    maxFreeSockets: config.hostingEnvironment.agentKeepAlive.maxFreeSockets,
    timeout: config.hostingEnvironment.agentKeepAlive.timeout,
    keepAliveTimeout: config.hostingEnvironment.agentKeepAlive.keepAliveTimeout,
  }),
});
const jwtStrategy = require('login.dfe.jwt-strategies');
const promiseRetry = require('promise-retry');

const getOrganisationByExternalId = async (organisationId, orgType, correlationId) => {
  const token = await jwtStrategy(config.organisations.service).getBearerToken();

  try {
    const org = await rp({
      method: 'GET',
      uri: `${config.organisations.service.url}/organisations/by-external-id/${orgType}/${organisationId}`,
      headers: {
        authorization: `bearer ${token}`,
        'x-correlation-id': correlationId,
      },
      json: true,
    });

    return {
      id: org.id,
    };
  } catch (e) {
    const status = e.statusCode ? e.statusCode : 500;
    if (status === 404) {
      return null;
    }
    throw e;
  }
};


const associatedWithUser = async (userId, correlationId) => {
  const token = await jwtStrategy(config.organisations.service).getBearerToken();

  try {
    const data = await rp({
      method: 'GET',
      uri: `${config.organisations.service.url}/organisations/associated-with-user/${userId}`,
      headers: {
        authorization: `bearer ${token}`,
        'x-correlation-id': correlationId,
      },
      json: true,
    });

    return data;
  } catch (e) {
    const status = e.statusCode ? e.statusCode : 500;
    if (status === 404) {
      return null;
    }
    throw e;
  }
};

const callOrganisationsApi = async (endpoint, method, body, correlationId) => {
  const token = await jwtStrategy(config.organisations.service).getBearerToken();

  const numberOfRetires = config.organisations.service.numberOfRetries || 3;
  const retryFactor = config.organisations.service.retryFactor || 2;

  return promiseRetry(async (retry, number) => {
      try {
        return await rp({
          method,
          uri: `${config.organisations.service.url}/${endpoint}`,
          headers: {
            authorization: `bearer ${token}`,
            'x-correlation-id': correlationId,
          },
          body,
          json: true,
          strictSSL: config.hostingEnvironment.env.toLowerCase() !== 'dev',
        });
      } catch (e) {
        const status = e.statusCode ? e.statusCode : 500;
        if (status === 401 || status === 404) {
          return null;
        }
        if (status === 409) {
          return false;
        }
        if ((status === 500 || status === 503) && number < numberOfRetires) {
          retry();
        }
        throw e;
      }
    }, { factor: retryFactor },
  );
};

const setUsersRoleAtOrg = async (userId, organisationId, roleId, numericIdentifier, textIdentifier, correlationId) => {
  const body = { roleId, numericIdentifier, textIdentifier };
  const result = await callOrganisationsApi(`organisations/${organisationId}/users/${userId}`, 'PUT', body, correlationId);
  return result === undefined;
};

const putSingleServiceIdentifierForUser = async (userId, serviceId, orgId, value, reqId) => {
  const body = {
    id_key: 'k2s-id',
    id_value: value,
  };
  const result = await callOrganisationsApi(`organisations/${orgId}/services/${serviceId}/identifiers/${userId}`, 'PUT', body, reqId);
  return result === undefined;
};

const getOrganisationById = async (id, correlationId) => {
  return callOrganisationsApi(`organisations/v2/${id}`, 'GET', undefined, correlationId);
};

const getPageOfOrganisationAnnouncements = async (organisationId, pageNumber, correlationId) => {
  return callOrganisationsApi(`/organisations/${organisationId}/announcements?page=${pageNumber}`, 'GET', undefined, correlationId);
};

const associatedWithUserV2 = async (userId, correlationId) => {
  return callOrganisationsApi(`organisations/v2/associated-with-user/${userId}`, 'GET', undefined, correlationId);
};

module.exports = {
  getOrganisationByExternalId,
  associatedWithUser,
  putSingleServiceIdentifierForUser,
  setUsersRoleAtOrg,
  getOrganisationById,
  getPageOfOrganisationAnnouncements,
  associatedWithUserV2,
};

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


const create = async (userId, serviceId, organisationId, externalIdentifiers = [], roles = [], correlationId) => {
  const token = await jwtStrategy(config.access.service).getBearerToken();

  try {
    await rp({
      method: 'PUT',
      uri: `${config.access.service.url}/users/${userId}/services/${serviceId}/organisations/${organisationId}`,
      headers: {
        authorization: `bearer ${token}`,
        'x-correlation-id': correlationId,
      },
      body: {
        identifiers: externalIdentifiers,
        roles,
      },
      json: true,
    });

    return true;
  } catch (e) {
    const status = e.statusCode ? e.statusCode : 500;
    if (status === 403) {
      return false;
    }
    throw e;
  }
};

const getRolesOfService = async (serviceId, correlationId) => {
  const token = await jwtStrategy(config.access.service).getBearerToken();

  try {
    return await rp({
      method: 'GET',
      uri: `${config.access.service.url}/services/${serviceId}/roles`,
      headers: {
        authorization: `bearer ${token}`,
        'x-correlation-id': correlationId,
      },
      json: true,
    });
  } catch (e) {
    const status = e.statusCode ? e.statusCode : 500;
    if (status === 403) {
      return false;
    }
    throw e;
  }
};

const getUsersAccessForServiceInOrganisation = async (userId, serviceId, organisationId, correlationId) => {
  const token = await jwtStrategy(config.access.service).getBearerToken();

  try {
    return await rp({
      method: 'GET',
      uri: `${config.access.service.url}/users/${userId}/services/${serviceId}/organisations/${organisationId}`,
      headers: {
        authorization: `bearer ${token}`,
        'x-correlation-id': correlationId,
      },
      json: true,
    });
  } catch (e) {
    const status = e.statusCode ? e.statusCode : 500;
    if (status === 404) {
      return undefined;
    }
    throw e;
  }
};

const getUsersWithAccessToServiceInOrganisation = async (serviceId, organisationId, pageNumber, correlationId) => {
  const token = await jwtStrategy(config.access.service).getBearerToken();

  try {
    return await rp({
      method: 'GET',
      uri: `${config.access.service.url}/services/${serviceId}/organisations/${organisationId}/users`,
      headers: {
        authorization: `bearer ${token}`,
        'x-correlation-id': correlationId,
      },
      json: true,
    });
  } catch (e) {
    const status = e.statusCode ? e.statusCode : 500;
    if (status === 404) {
      return undefined;
    }
    throw e;
  }
};

const listUserServices = async (userId, correlationId) => {
  const token = await jwtStrategy(config.access.service).getBearerToken();

  try {
    return await rp({
      method: 'GET',
      uri: `${config.access.service.url}/users/${userId}/services`,
      headers: {
        authorization: `bearer ${token}`,
        'x-correlation-id': correlationId,
      },
      json: true,
    });
  } catch (e) {
    const status = e.statusCode ? e.statusCode : 500;
    if (status === 404) {
      return undefined;
    }
    throw e;
  }
};


module.exports = {
  create,
  getRolesOfService,
  getUsersAccessForServiceInOrganisation,
  getUsersWithAccessToServiceInOrganisation,
  listUserServices,
};

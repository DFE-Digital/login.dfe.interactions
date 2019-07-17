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


const create = async (userId, serviceId, organisationId, externalIdentifiers = [], correlationId) => {
  const token = await jwtStrategy(config.organisations.service).getBearerToken();

  try {
    await rp({
      method: 'PUT',
      uri: `${config.organisations.service.url}/organisations/${organisationId}/services/${serviceId}/users/${userId}`,
      headers: {
        authorization: `bearer ${token}`,
        'x-correlation-id': correlationId,
      },
      body: {
        externalIdentifiers,
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

module.exports = {
  create,
};

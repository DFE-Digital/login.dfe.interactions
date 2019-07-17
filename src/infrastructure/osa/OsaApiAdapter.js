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

const authenticate = async (username, password, correlationId) => {
  const token = await jwtStrategy(config.osaApi.service).getBearerToken();
  try {
    const user = await rp({
      method: 'POST',
      uri: `${config.osaApi.service.url}/authenticate`,
      headers: {
        authorization: `bearer ${token}`,
        'x-correlation-id': correlationId,
      },
      body: {
        username,
        password,
      },
      json: true,
    });

    return user;
  } catch (e) {
    const status = e.statusCode ? e.statusCode : 500;
    if (status === 404 || status === 403) {
      return null;
    }
    throw new Error(e);
  }
};

const requestSync = async (username, correlationId) => {
  const token = await jwtStrategy(config.osaApi.service).getBearerToken();
  try {
    await rp({
      method: 'PUT',
      uri: `${config.osaApi.service.url}/sync/users/${username}`,
      headers: {
        authorization: `bearer ${token}`,
        'x-correlation-id': correlationId,
      },
      json: true,
    });
  } catch (e) {
    throw new Error(`Error requesting user sync ${e.statusCode} - ${e.message} (correlation id ${correlationId})`);
  }
};

const getSaUser = async (id, correlationId) => {
  const token = await jwtStrategy(config.osaApi.service).getBearerToken();
  try {
    return await rp({
      method: 'GET',
      uri: `${config.osaApi.service.url}/users/${id}`,
      headers: {
        authorization: `bearer ${token}`,
        'x-correlation-id': correlationId,
      },
      json: true,
    });
  } catch (e) {
    if (e.statusCode === 404) {
      return undefined;
    }
    throw new Error(e);
  }
};


module.exports = {
  authenticate,
  requestSync,
  getSaUser,
};

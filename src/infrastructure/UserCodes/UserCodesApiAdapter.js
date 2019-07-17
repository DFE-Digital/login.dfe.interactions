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

const upsertCode = async (userId, clientId, redirectUri, correlationId, codeType = 'PasswordReset', email = '', contextData = '') => {
  const token = await jwtStrategy(config.directories.service).getBearerToken();

  try {
    const user = await rp({
      method: 'PUT',
      uri: `${config.directories.service.url}/userCodes/upsert`,
      headers: {
        authorization: `bearer ${token}`,
        'x-correlation-id': correlationId,
      },
      body: {
        uid: userId,
        clientId,
        redirectUri,
        codeType,
        email,
        contextData,
      },
      json: true,
    });

    return user;
  } catch (e) {
    throw new Error(e);
  }
};

const deleteCode = async (userId, correlationId, codeType = undefined) => {
  const token = await jwtStrategy(config.directories.service).getBearerToken();

  let uri = `${config.directories.service.url}/userCodes/${userId}`;
  if (codeType) {
    uri += `/${codeType}`;
  }

  try {
    const user = await rp({
      method: 'DELETE',
      uri,
      headers: {
        authorization: `bearer ${token}`,
        'x-correlation-id': correlationId,
      },
      json: true,
    });

    return {
      user,
    };
  } catch (e) {
    const status = e.statusCode ? e.statusCode : 500;
    if (status === 404) {
      return null;
    }
    throw new Error(e);
  }
};

const validateCode = async (userId, code, correlationId, codeType = 'PasswordReset') => {
  const token = await jwtStrategy(config.directories.service).getBearerToken();

  try {
    const userCode = await rp({
      method: 'GET',
      uri: `${config.directories.service.url}/userCodes/validate/${userId}/${code}/${codeType}`,
      headers: {
        authorization: `bearer ${token}`,
        'x-correlation-id': correlationId,
      },
      body: {
        uid: userId,
      },
      json: true,
    });

    return {
      userCode,
    };
  } catch (e) {
    const status = e.statusCode ? e.statusCode : 500;
    if (status === 404) {
      return null;
    }
    throw new Error(e);
  }
};

const getCode = async (userId, correlationId, codeType = 'PasswordReset') => {
  const token = await jwtStrategy(config.directories.service).getBearerToken();
  try {
    const userCode = await rp({
      method: 'GET',
      uri: `${config.directories.service.url}/userCodes/${userId}/${codeType}`,
      headers: {
        authorization: `bearer ${token}`,
        'x-correlation-id': correlationId,
      },
      body: {
        uid: userId,
      },
      json: true,
    });

    return {
      userCode,
    };
  } catch (e) {
    const status = e.statusCode ? e.statusCode : 500;
    if (status === 404) {
      return null;
    }
    throw new Error(e);
  }
};

module.exports = {
  upsertCode,
  deleteCode,
  validateCode,
  getCode,
};

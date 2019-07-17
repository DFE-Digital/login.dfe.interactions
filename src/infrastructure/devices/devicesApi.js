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
const logger = require('./../logger');

const validateDigipassToken = async (serialNumber, code, correlationId) => {
  const token = await jwtStrategy(config.devices.service).getBearerToken();

  try {
    const result = await rp({
      method: 'POST',
      uri: `${config.devices.service.url}/digipass/${serialNumber}/verify`,
      headers: {
        authorization: `bearer ${token}`,
        'x-correlation-id': correlationId,
      },
      body: {
        code,
      },
      json: true,
    });

    return result.valid;
  } catch (e) {
    const status = e.statusCode ? e.statusCode : 500;
    if (status === 404) {
      logger.warn(`Tried to login using digipass ${serialNumber} but it does not exist in devices store`);
      return false;
    }
    throw e;
  }
};

module.exports = {
  validateDigipassToken,
};

const rp = require('login.dfe.request-promise-retry');
const jwtStrategy = require('login.dfe.jwt-strategies');
const config = require('./../Config')();

const callApi = async (opts) => {
  const defaultOpts = {
    route: '/',
    method: 'GET',
    body: undefined,
  };
  const patchedOpts = { ...defaultOpts, ...opts };
  const { route, method, body } = patchedOpts;

  let token;
  try {
    token = await jwtStrategy(config.oidcService).getBearerToken();
  } catch (e) {
    throw new Error(`Error getting bearer token to call oidc - ${e.message}`);
  }

  const url = opts.isGateway ? 'https://gateway-test.signin.education.gov.uk/interaction' : config.oidcService.url;

  try {
    const uri = `${url}${route}`;
    return await rp({
      method: method || 'GET',
      uri,
      headers: {
        authorization: `bearer ${token}`,
      },
      body,
      json: true,
    });
  } catch (e) {
    if (e.statusCode === 404) {
      return undefined;
    }
    throw e;
  }
};


const getInteractionById = async (id, isGateway) => await callApi({
  route: `/${id}/check`,
  isGateway,
});

module.exports = {
  getInteractionById,
};

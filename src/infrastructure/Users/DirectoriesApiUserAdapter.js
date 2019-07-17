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
  const token = await jwtStrategy(config.directories.service).getBearerToken();

  try {
    const userId = await rp({
      method: 'POST',
      uri: `${config.directories.service.url}/users/authenticate`,
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

    return {
      id: userId,
    };
  } catch (e) {
    const status = e.statusCode ? e.statusCode : 500;
    if (status === 403 && e.error && e.error.reason_code === 'ACCOUNT_DEACTIVATED') {
      return {
        status: 'Deactivated',
      };
    }
    if (status === 403 && e.error && e.error.reason_code === 'INVALID_CREDENTIALS' && e.error.reason_subcode === 'PASSWORD') {
      return {
        status: 'invalid_credentials',
      };
    }
    if (status === 403) {
      return null;
    }
    throw e;
  }
};

const find = async (username, correlationId) => {
  const token = await jwtStrategy(config.directories.service).getBearerToken();

  try {
    const res = await rp({
      method: 'GET',
      uri: `${config.directories.service.url}/users/${username}`,
      headers: {
        authorization: `bearer ${token}`,
        'x-correlation-id': correlationId,
      },
      json: true,
    });

    return {
      sub: res.sub,
      email: res.email,
      given_name: res.given_name,
      family_name: res.family_name,
      legacyUsernames: res.legacyUsernames,
    };
  } catch (e) {
    const status = e.statusCode ? e.statusCode : 500;
    if (status === 404) {
      return null;
    }
    throw new Error(e);
  }
};

const findByLegacyUsername = async (username, correlationId) => {
  const token = await jwtStrategy(config.directories.service).getBearerToken();

  try {
    const res = await rp({
      method: 'GET',
      uri: `${config.directories.service.url}/users/by-legacyusername/${username}`,
      headers: {
        authorization: `bearer ${token}`,
        'x-correlation-id': correlationId,
      },
      json: true,
    });

    return {
      sub: res.sub,
      email: res.email,
      given_name: res.given_name,
      family_name: res.family_name,
      legacy_username: res.legacy_username,
    };
  } catch (e) {
    const status = e.statusCode ? e.statusCode : 500;
    if (status === 404) {
      return null;
    }
    throw new Error(e);
  }
};

const changePassword = async (uid, password, correlationId) => {
  const token = await jwtStrategy(config.directories.service).getBearerToken();

  try {
    await rp({
      method: 'POST',
      uri: `${config.directories.service.url}/users/${uid}/changepassword`,
      headers: {
        authorization: `bearer ${token}`,
        'x-correlation-id': correlationId,
      },
      body: {
        password,
      },
      json: true,
    });
  } catch (e) {
    throw new Error(e);
  }
};

const getDevices = async (uid, correlationId) => {
  const token = await jwtStrategy(config.directories.service).getBearerToken();

  try {
    return await rp({
      method: 'GET',
      uri: `${config.directories.service.url}/users/${uid}/devices`,
      headers: {
        authorization: `bearer ${token}`,
        'x-correlation-id': correlationId,
      },
      json: true,
    });
  } catch (e) {
    const status = e.statusCode ? e.statusCode : 500;
    if (status === 404) {
      return null;
    }
    throw e;
  }
};

const create = async (username, password, firstName, lastName, legacyUsername, correlationId) => {
  const token = await jwtStrategy(config.directories.service).getBearerToken();

  try {
    return await rp({
      method: 'POST',
      uri: `${config.directories.service.url}/users`,
      headers: {
        authorization: `bearer ${token}`,
        'x-correlation-id': correlationId,
      },
      body: {
        email: username,
        password,
        firstName,
        lastName,
        legacy_username: legacyUsername,
      },
      json: true,
    });
  } catch (e) {
    const status = e.statusCode ? e.statusCode : 500;
    if (status === 409) {
      return null;
    }
    throw e;
  }
};

const update = async (uid, email, firstName, lastName, legacyUsernames, correlationId) => {
  const token = await jwtStrategy(config.directories.service).getBearerToken();

  const body = {};
  if (email) {
    body.email = email;
  }
  if (firstName) {
    body.given_name = firstName;
  }
  if (lastName) {
    body.family_name = lastName;
  }
  if (legacyUsernames) {
    body.legacyUsernames = legacyUsernames;
  }

  try {
    return await rp({
      method: 'PATCH',
      uri: `${config.directories.service.url}/users/${uid}`,
      headers: {
        authorization: `bearer ${token}`,
        'x-correlation-id': correlationId,
      },
      body,
      json: true,
    });
  } catch (e) {
    const status = e.statusCode ? e.statusCode : 500;
    if (status === 409) {
      return null;
    }
    throw e;
  }
};

const findInvitationByEmail = async (email, correlationId) => {
  const token = await jwtStrategy(config.directories.service).getBearerToken();

  try {
    const invitation = await rp({
      method: 'GET',
      uri: `${config.directories.service.url}/invitations/by-email/${email}`,
      headers: {
        authorization: `bearer ${token}`,
        'x-correlation-id': correlationId,
      },
      json: true,
    });

    return invitation;
  } catch (e) {
    const status = e.statusCode ? e.statusCode : 500;
    if (status === 404) {
      return null;
    }
    throw new Error(e);
  }
};

const acceptInvitation = async (invitationId, password, correlationId) => {
  const token = await jwtStrategy(config.directories.service).getBearerToken();

  try {
    const result = await rp({
      method: 'POST',
      uri: `${config.directories.service.url}/invitations/${invitationId}/create_user`,
      headers: {
        authorization: `bearer ${token}`,
        'x-correlation-id': correlationId,
      },
      body: {
        password,
      },
      json: true,
    });

    return result;
  } catch (e) {
    const status = e.statusCode ? e.statusCode : 500;
    if (status === 404) {
      return null;
    }
    throw new Error(e);
  }
};

module.exports = {
  authenticate,
  find,
  changePassword,
  getDevices,
  create,
  findByLegacyUsername,
  update,
  findInvitationByEmail,
  acceptInvitation,
};

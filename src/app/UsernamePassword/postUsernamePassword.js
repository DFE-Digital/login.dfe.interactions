const CryptoJS = require('crypto-js');
const InteractionComplete = require('./../InteractionComplete');
const applicationsApi = require('./../../infrastructure/applications');
const Users = require('./../../infrastructure/Users');
const emailValidator = require('email-validator');
const logger = require('./../../infrastructure/logger');
const {sendRedirect, sendResult} = require('./../../infrastructure/utils');
const osaApi = require('./../../infrastructure/osa');
const oidc = require('./../../infrastructure/oidc');
const config = require('./../../infrastructure/Config');

const key = config.crypto.key || 'CRYPTO KEY';

const validateBody = (body, allowUserName) => {
    const validationMessages = {};
    let failedValidation = false;

    if (body.username === '') {
        if (allowUserName) {
            validationMessages.username = 'Please enter your email address or username';
        } else {
            validationMessages.username = 'Please enter your email address';
        }
        failedValidation = true;
    } else if (!emailValidator.validate(body.username.trim()) && !allowUserName) {
        validationMessages.username = 'Please enter a valid email address';
        failedValidation = true;
    }

    if (body.password === '') {
        validationMessages.password = 'Please enter your password';
        failedValidation = true;
    }
    return {
        validationMessages,
        failedValidation,
    };
};

const authenticateWithEmail = async (req) => {
    const user = await Users.authenticate(req.body.username.trim(), req.body.password, req.id);
    return {
        user,
        legacyUser: false,
        migrationComplete: false,
    };
};
const authenticateWithUsername = async (req) => {
    const user = await osaApi.authenticate(req.body.username, req.body.password, req.id);
    const migrationComplete = user ? await Users.findByLegacyUsername(req.body.username, req.id) : false;

    return {
        user,
        legacyUser: true,
        migrationComplete,
    };
};

const handleInvalidCredentials = (req, res, validation, client, legacyUser) => {
    logger.audit(`Failed login attempt for ${req.body.username}`, {
        type: 'sign-in',
        subType: 'username-password',
        success: false,
        userEmail: req.body.username,
    });

    if (Object.keys(validation.validationMessages).length === 0 && validation.validationMessages.constructor === Object) {
        validation.validationMessages.loginError = 'Sorry, we did not recognise your sign-in details, please try again.';
        if (legacyUser) {
            validation.validationMessages.loginError = 'Sorry, we did not recognise your sign-in details, please try again. <br>If you have changed your password on Secure Access today, please try again tomorrow.';
        }
    }

    sendResult(req, res, 'UsernamePassword/views/index', {
        isFailedLogin: true,
        title: 'DfE Sign-in',
        clientId: req.query.clientid,
        uuid: req.params.uuid,
        csrfToken: req.csrfToken(),
        redirectUri: req.query.redirect_uri,
        validationMessages: validation.validationMessages,
        username: req.body.username,
        header: !client.relyingParty.params || client.relyingParty.params.header,
        headerMessage: !client.relyingParty.params || client.relyingParty.params.headerMessage,
        supportsUsernameLogin: !client.relyingParty.params || client.relyingParty.params.supportsUsernameLogin,
    });
};
const handleDeactivated = (req, res, validation, client) => {
    logger.audit(`Attempt login to deactivated account for ${req.body.username}`, {
        type: 'sign-in',
        subType: 'username-password',
        success: false,
        userEmail: req.body.username,
    });

    if (Object.keys(validation.validationMessages).length === 0 && validation.validationMessages.constructor === Object) {
        validation.validationMessages.loginError = 'Your account has been deactivated.';
    }

    sendResult(req, res, 'UsernamePassword/views/index', {
        isFailedLogin: true,
        title: 'DfE Sign-in',
        clientId: req.query.clientid,
        uuid: req.params.uuid,
        csrfToken: req.csrfToken(),
        redirectUri: req.query.redirect_uri,
        validationMessages: validation.validationMessages,
        username: req.body.username,
        header: !client.relyingParty.params || client.relyingParty.params.header,
        headerMessage: !client.relyingParty.params || client.relyingParty.params.headerMessage,
        supportsUsernameLogin: !client.relyingParty.params || client.relyingParty.params.supportsUsernameLogin,
    });
};
const handleValidLegacyUser = (req, res, user, client) => {
    req.migrationUser = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        organisation: user.organisation,
        clientName: client.name,
        clientId: req.query.clientid,
        redirectUri: req.query.redirect_uri,
        serviceId: client.id,
        userName: req.body.username,
        osaUserId: user.osaId,
        service: user.services.find(s => s.id.toLowerCase() === client.id.toLowerCase()),

    };
    if (req.migrationUser.service) {
        sendRedirect(req, res, {
            redirect: true,
            uri: `/${req.params.uuid}/migration`,
        });
    } else {
        req.migrationUser.redirectUri = req.query.redirect_uri;
        sendRedirect(req, res, {
            redirect: true,
            uri: `/${req.params.uuid}/migration/service-access-denied`,
        });
    }
};

const encrypt = (value) => {
  if (value) {
    return null;
  }
  return CryptoJS.AES.encrypt(value, key).toString();
};

const handleValidSigninUser = (req, res, user) => {
    logger.audit(`Successful login attempt for ${req.body.username} (id: ${user.id})`, {
        type: 'sign-in',
        subType: 'username-password',
        success: true,
        userId: user.id,
        userEmail: req.body.username,
    });

    const userId = encrypt(user.id);
    InteractionComplete.process(req.params.uuid, {
        status: 'success',
        uid: userId,
        type: 'usernamepassword',
        clientId: req.body.clientId,
        redirectUri: req.body.redirectUri,
    }, req, res);
};

const post = async (req, res) => {
    const interactionDetails = await oidc.getInteractionById(req.params.uuid);
    if (!interactionDetails) {
        return sendRedirect(req, res, {
            redirect: true,
            uri: `${req.query.redirect_uri}?error=sessionexpired`,
        });
    }

    const client = await applicationsApi.getServiceById(req.query.clientid, req.id);
    if (client === null) {
        return InteractionComplete.process(req.params.uuid, {status: 'failed', reason: 'invalid clientid'}, req, res);
    }

    let user = null;
    let legacyUser = false;

    const supportsUsernameLogin = client.relyingParty.params && client.relyingParty.params.supportsUsernameLogin;
    const validation = validateBody(req.body, supportsUsernameLogin);

    if (!validation.failedValidation) {
        let result;

        if (emailValidator.validate(req.body.username.trim())) {
            result = await authenticateWithEmail(req);
        } else {
            result = await authenticateWithUsername(req);
        }

        user = result.user;
        legacyUser = result.legacyUser;
        if (result.migrationComplete) {
            logger.audit(`Attempt login to already migrated account for ${req.body.username}`, {
                type: 'sign-in',
                subType: 'username-password',
                success: false,
                userEmail: req.body.username,
            });
            req.migrationUser = {
                redirectUri: req.query.redirect_uri,
            };
            return sendRedirect(req, res, {
                redirect: true,
                uri: `/${req.params.uuid}/migration/already-migrated`,
            });
        }
    }

    if (user === null || user === undefined || user.status === 'invalid_credentials') {
        handleInvalidCredentials(req, res, validation, client, legacyUser);
    } else if (user.status === 'Deactivated') {
        handleDeactivated(req, res, validation, client);
    } else if (legacyUser) {
        handleValidLegacyUser(req, res, user, client);
    } else {
        handleValidSigninUser(req, res, user);
    }
};

module.exports = post;

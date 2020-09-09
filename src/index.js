// process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

const listEndpoints = require('express-list-endpoints');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const csurf = require('csurf');
const session = require('cookie-session');
const http = require('http');
const https = require('https');
const logger = require('./infrastructure/logger');
const config = require('./infrastructure/Config')();
const helmet = require('helmet');
const sanitization = require('login.dfe.sanitization');
const healthCheck = require('login.dfe.healthcheck');
const { getErrorHandler, ejsErrorPages } = require('login.dfe.express-error-handling');
const migratingUserMiddleware = require('./app/utils/migratingUserMiddleware');
const configSchema = require('./infrastructure/Config/schema');
const { sendRedirect } = require('./infrastructure/utils');
// const rateLimiter = require('./app/rateLimit');

const usernamePassword = require('./app/UsernamePassword');
const smsCode = require('./app/smsCode');
const migrationUser = require('./app/migration');
const resetPassword = require('./app/ResetPassword');
const digipass = require('./app/Digipass');
const selectOrganisation = require('./app/select-organisation');
const giasLockout = require('./app/giasLockout');
const consent = require('./app/consent');
const devLauncher = require('./app/DevLauncher');
const content = require('./app/Content');
const setCorrelationId = require('express-mw-correlation-id');
// const b2cApp = require('./app/b2c');

https.globalAgent.maxSockets = http.globalAgent.maxSockets = config.hostingEnvironment.agentKeepAlive.maxSockets || 50;


configSchema.validate();

let expiryInMinutes = 30;
const sessionExpiry = parseInt(config.hostingEnvironment.sessionCookieExpiryInMinutes);
if (!isNaN(sessionExpiry)) {
  expiryInMinutes = sessionExpiry;
}

const expiryInMilliseconds = 60000 * expiryInMinutes;

const app = express();

app.use(helmet({
  noCache: true,
  frameguard: {
    action: 'deny',
  },
}));
app.use(setCorrelationId(true));

const csrf = csurf({
  cookie: {
    secure: true,
    httpOnly: true,
  },
});

const sess = {
  secret: config.session.secret,
  cookie: {
    httpOnly: true,
    secure: true,
    expires: expiryInMilliseconds,
  },
};

if (config.hostingEnvironment.env !== 'dev') {
  app.set('trust proxy', 1);
}

// app.use(rateLimiter);
app.use(session(sess));
app.use(migratingUserMiddleware({
  signingSecret: config.session.secret,
  encrypt: true,
  encryptionSecret: config.session.encryptionSecret,
}));

// Add middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(sanitization({
  sanitizer: (key, value) => {
    const fieldToNotSanitize = ['email', 'username', 'password', 'confirmPassword', 'newPassword'];

    if (fieldToNotSanitize.find((x) => x.toLowerCase() === key.toLowerCase())) {
      return value;
    }

    if (key.toLowerCase() === 'clientid') {
      return !/^[A-Za-z0-9]+$/.test(value) ? '' : value;
    }
    return sanitization.defaultSanitizer(key, value);
  },
}));

process.env.NODE_ENV = config.NODE_ENV || 'development';


// Set view engine
app.set('view engine', 'ejs');
app.use('/assets', express.static(path.join(__dirname, 'app/assets')));
app.set('views', path.resolve(__dirname, 'app'));
app.set('logger', logger);

// Setup express layouts
app.use(expressLayouts);
app.set('layout', 'shared/layout');

// Setup routes
app.use('/healthcheck', healthCheck({ config }));
app.get('/', (req, res) => res.redirect(config.hostingEnvironment.servicesUrl || '/welcome'));
app.use('/', content(csrf));

app.use('/:uuid/usernamepassword', usernamePassword(csrf));
app.use('/:uuid/sms', smsCode(csrf));
app.use('/:uuid/migration', migrationUser(csrf));
app.use('/:uuid/resetpassword', resetPassword(csrf));
app.use('/:uuid/digipass', digipass(csrf));
app.use('/:uuid/select-organisation', selectOrganisation(csrf));
app.use('/:uuid/gias-lockout', giasLockout(csrf));
app.use('/:uuid/consent', consent(csrf));
app.use('/b2c/', b2cApp(csrf));

if (config.hostingEnvironment.useDevViews) {
  app.use('/dev/', devLauncher(csrf));
}

let assetsUrl = config.hostingEnvironment.assetsUrl || 'https://rawgit.com/DFE-Digital/dfe.ui.toolkit/master/dist/';
assetsUrl = assetsUrl.endsWith('/') ? assetsUrl.substr(0, assetsUrl.length - 1) : assetsUrl;
// Setup global locals for layouts and views
Object.assign(app.locals, {
  urls: {
    services: config.hostingEnvironment.servicesUrl,
    help: config.hostingEnvironment.helpUrl,
    profile: config.hostingEnvironment.profileUrl,
    survey: config.hostingEnvironment.surveyUrl,
    assets: assetsUrl,
  },
  app: {
    title: 'DfE Sign-in',
    environmentBannerMessage: config.hostingEnvironment.environmentBannerMessage,
  },
  gaTrackingId: config.hostingEnvironment.gaTrackingId,
  useSelfRegister: config.toggles ? config.toggles.useSelfRegister : false,
});

app.use((err, req, res, next) => {
  if (err.code !== 'EBADCSRFTOKEN') return next(err);

  return sendRedirect(req, res, {
    redirect: true,
    uri: req.originalUrl,
  });
});

const errorPageRenderer = ejsErrorPages.getErrorPageRenderer({
  help: config.hostingEnvironment.helpUrl,
  assets: assetsUrl,
}, config.hostingEnvironment.env === 'dev');
app.use(getErrorHandler({
  logger,
  errorPageRenderer,
}));

app.get('/routes', (req, res) => {
  res.json(listEndpoints(app));
});

app.get('*', (req, res) => {
  res.status(404).render('errors/views/notFound');
});

// Setup server
if (config.hostingEnvironment.env === 'dev') {
  app.proxy = true;

  const options = {
    key: config.hostingEnvironment.sslKey,
    cert: config.hostingEnvironment.sslCert,
    requestCert: false,
    rejectUnauthorized: false,
  };

  const server = https.createServer(options, app);

  server.listen(config.hostingEnvironment.port, () => {
    logger.info(`Dev server listening on https://${config.hostingEnvironment.host}:${config.hostingEnvironment.port}/dev`);
  });
} else if (config.hostingEnvironment.env === 'docker') {
  app.listen(config.hostingEnvironment.port, () => {
    logger.info(`Server listening on http://${config.hostingEnvironment.host}:${config.hostingEnvironment.port}`);
  });
} else {
  app.listen(process.env.PORT, () => {
    logger.info(`Server listening on http://${config.hostingEnvironment.host}:${config.hostingEnvironment.port}/dev`);
  });
}

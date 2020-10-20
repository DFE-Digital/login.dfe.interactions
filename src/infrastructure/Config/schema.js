const SimpleSchema = require('simpl-schema').default;
const { validateConfigAgainstSchema, schemas, patterns } = require('login.dfe.config.schema.common');
const config = require('./index');
const logger = require('./../logger');

const hostingEnvironmentSchema = new SimpleSchema({
  rateLimitUrl: patterns.redis,
  giasApplicationId: patterns.uuid,
});

const oidcServiceSchema = new SimpleSchema({
  url: patterns.url,
  auth: Object,
  'auth.type': {
    type: String,
    allowedValues: ['aad', 'secret'],
  },
  'auth.jwt': {
    type: String,
    optional: true,
    custom: function () {
      if (this.siblingField('type').value === 'secret' && !this.isSet) {
        return SimpleSchema.ErrorTypes.REQUIRED
      }
    },
  },
  'auth.tenant': {
    type: String,
    optional: true,
    custom: function () {
      if (this.siblingField('type').value === 'aad' && !this.isSet) {
        return SimpleSchema.ErrorTypes.REQUIRED
      }
    },
  },
  'auth.authorityHostUrl': {
    type: String,
    regEx: /^http(s{0,1}):\/\/.*$/,
    optional: true,
    custom: function () {
      if (this.siblingField('type').value === 'aad' && !this.isSet) {
        return SimpleSchema.ErrorTypes.REQUIRED
      }
    },
  },
  'auth.clientId': {
    type: String,
    optional: true,
    custom: function () {
      if (this.siblingField('type').value === 'aad' && !this.isSet) {
        return SimpleSchema.ErrorTypes.REQUIRED
      }
    },
  },
  'auth.clientSecret': {
    type: String,
    optional: true,
    custom: function () {
      if (this.siblingField('type').value === 'aad' && !this.isSet) {
        return SimpleSchema.ErrorTypes.REQUIRED
      }
    },
  },
  'auth.resource': {
    type: String,
    optional: true,
    custom: function () {
      if (this.siblingField('type').value === 'aad' && !this.isSet) {
        return SimpleSchema.ErrorTypes.REQUIRED
      }
    },
  },
});

const sessionSchema = new SimpleSchema({
  secret: String,
  encryptionSecret: String,
});

const userCodesSchema = new SimpleSchema({
  type: {
    type: String,
    allowedValues: ['static', 'usercodesapi'],
  },
});

const cryptoSchema = new SimpleSchema({
  signing: Object,
  'signing.publicKey': String,
  'signing.privateKey': String,
});

const cacheSchema = new SimpleSchema({
  type: {
    type: String,
    allowedValues: ['memory', 'redis'],
  },
  params: {
    type: Object,
    optional: true,
    custom: function () {
      if (this.field('type').value === 'redis' && !this.isSet) {
        return SimpleSchema.ErrorTypes.REQUIRED;
      }
    },
  },
  'params.connectionString': {
    type: String,
    regEx: patterns.redis,
    optional: true,
    custom: function () {
      if (this.field('type').value === 'redis' && !this.isSet) {
        return SimpleSchema.ErrorTypes.REQUIRED;
      }
    },
  },
});

const notificationsSchema = new SimpleSchema({
  connectionString: patterns.redis,
});

const togglesSchema = new SimpleSchema({
  useSelfRegister: {
    type: Boolean,
    optional: true,
    defaultValue: false,
  },
});

const coronaVirusFormSchema = new SimpleSchema({
  redirect: String,
});


const schema = new SimpleSchema({
  loggerSettings: schemas.loggerSettings,
  hostingEnvironment: schemas.hostingEnvironment.extend(hostingEnvironmentSchema),
  directories: schemas.apiClient,
  oidcService: oidcServiceSchema,
  devices: schemas.apiClient,
  osaApi: schemas.apiClient,
  organisations: schemas.apiClient,
  access: schemas.apiClient,
  applications: schemas.apiClient,
  session: sessionSchema,
  userCodes: userCodesSchema,
  crypto: cryptoSchema,
  cache: cacheSchema,
  notifications: notificationsSchema,
  toggles: togglesSchema,
  coronaVirusForm: coronaVirusFormSchema,
  assets: schemas.assets
});

module.exports.validate = () => {
  validateConfigAgainstSchema(config(), schema, logger);
};

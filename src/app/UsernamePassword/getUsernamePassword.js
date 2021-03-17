'use strict';

const applicationsApi = require('./../../infrastructure/applications');
const oidc = require('./../../infrastructure/oidc');
const moment = require('moment');
const { markdown } = require('markdown');
const { services } = require('login.dfe.dao');
const logger = require('./../../infrastructure/logger');
const config = require('./../../infrastructure/Config')();

const convertMarkdownToHtml = (content) => {
  return markdown.toHTML(content);
};

const buildBanner = async (serviceId, correlationId) => {
  let header;
  let headerMessage;
  let timeLimitedBanner;
  let alwaysOnBanner;

  const allBannersForService = await applicationsApi.listAllBannersForService(serviceId, correlationId);

  if (allBannersForService) {
    const now = moment();
    timeLimitedBanner = allBannersForService.find((banner) => moment(now).isBetween(banner.validFrom, banner.validTo) === true);
    alwaysOnBanner = allBannersForService.find((banner) => banner.isActive === true);
  }

  if (timeLimitedBanner && timeLimitedBanner !== null) {
    header = timeLimitedBanner.title;
    headerMessage = convertMarkdownToHtml(timeLimitedBanner.message);
  } else if (alwaysOnBanner && alwaysOnBanner !== null) {
    header = alwaysOnBanner.title;
    headerMessage = convertMarkdownToHtml(alwaysOnBanner.message);
  }
  return { header, headerMessage };
};

const get = async (req, res) => {
  const interactionDetails = await oidc.getInteractionById(req.params.uuid);
  let clientId = req.query.clientid;
  if(!clientId){
    clientId = interactionDetails.client_id;
  }
  logger.info('In getUsernamePassword :: check for client and redirect');

  const service = await services.getServiceWithRedirectUris(clientId);
  if(service && service.clientId === clientId){
    logger.info('In getUsernamePassword :: inside service check');
    const redirecturi = service.redirects.find((uri)=>uri.redirectUrl === req.query.redirect_uri);
    if(!redirecturi){
      logger.info('In getUsernamePassword :: wrong redirecr uri');
      throw new Error('Invalid redirect uri provided in the request');
    }
  }else{
    logger.info('In getUsernamePassword :: invalid client');
    throw new Error('Invalid client configuration provided in the request');
  }
  if (!interactionDetails) {
    return res.redirect(`${req.query.redirect_uri}?error=sessionexpired`);
  }

  const client = await applicationsApi.getServiceById(clientId, req.id);
  if (!client) {
    const details = `Invalid redirect_uri (clientid: ${req.query.clientid}, redirect_uri: ${req.query.redirect_uri}) - `;
    throw new Error(details);
  }

  const dsiClient = await applicationsApi.getServiceById(config.hostingEnvironment.servicesClient, req.id);
  if (!dsiClient) {
    const details = 'Invalid redirect_uri (clientid: services)';
    throw new Error(details);
  }

  const headersInternal = await buildBanner(dsiClient.id, req.id);
  const headersExternal = await buildBanner(client.id, req.id);

  let headerInternal = headersInternal.header;
  let headerMessageInternal = headersInternal.headerMessage;
  const headerExternal = headersExternal.header;
  const headerMessageExternal = headersExternal.headerMessage;

  if (client.id === dsiClient.id) {
    headerInternal = null;
    headerMessageInternal = null;
  }

  req.migrationUser = null;
  req.session.redirectUri = null;

  res.render('UsernamePassword/views/index', {
    isFailedLogin: false,
    message: '',
    title: 'DfE Sign-in',
    clientId,
    uuid: req.params.uuid,
    csrfToken: req.csrfToken(),
    redirectUri: req.query.redirect_uri,
    validationMessages: {},
    headerInternal,
    headerMessageInternal,
    headerExternal,
    headerMessageExternal,
    supportsUsernameLogin: !client.relyingParty.params || client.relyingParty.params.supportsUsernameLogin,
  });
};

module.exports = get;

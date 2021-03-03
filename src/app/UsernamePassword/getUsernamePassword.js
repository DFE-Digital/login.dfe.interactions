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
    let details = `Invalid redirect_uri (clientid: ${req.query.clientid}, redirect_uri: ${req.query.redirect_uri}) - `;
    if (!client) {
      details += 'no client by that id';
    } else {
      details += 'redirect_uri not in list of specified redirect_uris';
    }
    throw new Error(details);
  }

  const dsiClient = await applicationsApi.getServiceById(config.hostingEnvironment.servicesClient, req.id);
  if (!dsiClient) {
    let details = 'Invalid redirect_uri (clientid: services)';
    if (!dsiClient) {
      details += 'no client by that id';
    } else {
      details += 'redirect_uri not in list of specified redirect_uris';
    }
    throw new Error(details);
  }

  let header1;
  let header2;
  let headerMessage1;
  let headerMessage2;
  let now;
  let timeLimitedBannerServices;
  let alwaysOnBannerServices;
  let timeLimitedBannerEndService;
  let alwaysOnBannerEndService;

  const allBannersForService = await applicationsApi.listAllBannersForService(client.id, req.id);
  const allBannersForDSI = await applicationsApi.listAllBannersForService(dsiClient.id, req.id);

  if (allBannersForDSI && client.id !== dsiClient.id) {
    now = moment();
    timeLimitedBannerServices = allBannersForDSI.find((banner) => moment(now).isBetween(banner.validFrom, banner.validTo) === true);
    alwaysOnBannerServices = allBannersForDSI.find((banner) => banner.isActive === true);
  }

  if (allBannersForService) {
    now = moment();
    timeLimitedBannerEndService = allBannersForService.find((banner) => moment(now).isBetween(banner.validFrom, banner.validTo) === true);
    alwaysOnBannerEndService = allBannersForService.find((banner) => banner.isActive === true);
  }

  if (timeLimitedBannerServices && timeLimitedBannerServices !== null) {
    header1 = timeLimitedBannerServices.title;
    headerMessage1 = convertMarkdownToHtml(timeLimitedBannerServices.message);
  } else if (alwaysOnBannerServices && alwaysOnBannerServices !== null) {
    header1 = alwaysOnBannerServices.title;
    headerMessage1 = convertMarkdownToHtml(alwaysOnBannerServices.message);
  }

  if (timeLimitedBannerEndService && timeLimitedBannerEndService !== null) {
    header2 = timeLimitedBannerEndService.title;
    headerMessage2 = convertMarkdownToHtml(timeLimitedBannerEndService.message);
  } else if (alwaysOnBannerEndService && alwaysOnBannerEndService !== null) {
    header2 = alwaysOnBannerEndService.title;
    headerMessage2 = convertMarkdownToHtml(alwaysOnBannerEndService.message);
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
    header1,
    headerMessage1,
    header2,
    headerMessage2,
    supportsUsernameLogin: !client.relyingParty.params || client.relyingParty.params.supportsUsernameLogin,
  });
};

module.exports = get;

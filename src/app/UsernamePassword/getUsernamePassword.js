'use strict';

const applicationsApi = require('./../../infrastructure/applications');
const oidc = require('./../../infrastructure/oidc');
const moment = require('moment');
const { markdown } = require('markdown');
const { services } = require('login.dfe.dao');


const convertMarkdownToHtml = (content) => {
  return markdown.toHTML(content);
};

const get = async (req, res) => {
  const interactionDetails = await oidc.getInteractionById(req.params.uuid);
  let clientId = req.query.clientid;
  if(!clientId){
    clientId = interactionDetails.client_id;
  }
  const service = await services.getServiceWithRedirectUris(clientId);
  if(service && service.clientId === clientId){
    const redirecturi = service.redirects.find((uri)=>uri.redirectUrl === req.query.redirect_uri);
    if(!redirecturi){
      throw new Error('Invalid redirect uri provided in the request');
    }
  }else{
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

  const allBannersForService = await applicationsApi.listAllBannersForService(client.id, req.id);
  let header;
  let headerMessage;
  if (allBannersForService) {
    const now = moment();
    const timeLimitedBanner = allBannersForService.find(x => moment(now).isBetween(x.validFrom, x.validTo) === true);
    const alwaysOnBanner = allBannersForService.find(x => x.isActive === true);
    if (timeLimitedBanner) {
      header = timeLimitedBanner.title;
      headerMessage = convertMarkdownToHtml(timeLimitedBanner.message);
    } else if (alwaysOnBanner) {
      header = alwaysOnBanner.title;
      headerMessage = convertMarkdownToHtml(alwaysOnBanner.message);
    }
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
    header,
    headerMessage,
    supportsUsernameLogin: !client.relyingParty.params || client.relyingParty.params.supportsUsernameLogin,
  });
};

module.exports = get;

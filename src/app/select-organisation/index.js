'use strict';

const express = require('express');
const logger = require('./../../infrastructure/logger');
const { asyncWrapper } = require('login.dfe.express-error-handling');
const organisationApi = require('./../../infrastructure/Organisations');
const InteractionComplete = require('./../InteractionComplete');
const appendInteractionDetails = require('./../utils/appendInteractionDetails');
const { getServiceById } = require('./../../infrastructure/applications');
const { getRolesOfService, listUserServices } = require('./../../infrastructure/access');
const router = express.Router({ mergeParams: true });
const config = require('./../../infrastructure/Config')();

const getNaturalIdentifiers = (orgsForUser) => {
  for (let i = 0; i < orgsForUser.length; i++) {
    const org = orgsForUser[i];
    if (org.organisation) {
      org.naturalIdentifiers = [];
      const urn = org.organisation.urn;
      const uidOrg = org.organisation.uid;
      const ukprn = org.organisation.ukprn;
      if (urn) {
        org.naturalIdentifiers.push(`URN: ${urn}`);
      }
      if (uidOrg) {
        org.naturalIdentifiers.push(`UID: ${uidOrg}`);
      }
      if (ukprn) {
        org.naturalIdentifiers.push(`UKPRN: ${ukprn}`);
      }
    }
  }
};

const getAction = async (req, res) => {
  const correlationId = req.id;
  if (!req.interaction) {
    logger.warn(`Request to select org with expired session (uuid: ${req.params.uuid})`, { correlationId });
    return res.redirect(`${req.query.redirect_uri}?error=sessionexpired`);
  }

  const uid = req.query.uid;
  if (!uid) {
    return InteractionComplete.process(req.params.uuid, { status: 'failed', uid: req.query.uid, type: 'select-organisation', reason: "Missing uid"}, req, res);
  }

  let orgsForUser = await organisationApi.associatedWithUserV2(uid);

  const coronaVirusFormRedirectUri = config.coronaVirusForm ? config.coronaVirusForm.redirect : null;
  logger.info('corona virus form redirect_uri =' + req.query.redirect_uri +' config.coronavirusform.redirect::' + coronaVirusFormRedirectUri);
  if(req.query.redirect_uri !== coronaVirusFormRedirectUri) {
    const application = await getServiceById(req.interaction.client_id, req.id);
    if (application) {
      const serviceRoles = await getRolesOfService(application.id, req.id);
      if (serviceRoles && serviceRoles.length > 0) {
        const allUserServices = await listUserServices(req.query.uid, req.id);
        if (allUserServices && allUserServices.length > 0) {
          const userAccessToService = allUserServices.filter(x => x.serviceId === application.id);
          if (userAccessToService && userAccessToService.length > 0) {
            orgsForUser = orgsForUser.filter(x => userAccessToService.find(y => y.organisationId === x.organisation.id));
          }
        }
      }
    }
  }
  if (!orgsForUser || orgsForUser.length === 0) {
    return InteractionComplete.process(req.params.uuid, { status: 'success', uid: req.query.uid, type: 'select-organisation', organisation: JSON.stringify({}) }, req, res);
  }

  if (orgsForUser.length === 1) {
    return InteractionComplete.process(req.params.uuid, { status: 'success', uid: req.query.uid, type: 'select-organisation', organisation: JSON.stringify(orgsForUser[0].organisation) }, req, res);
  }
  getNaturalIdentifiers(orgsForUser);

  return res.render('select-organisation/views/index', {
    orgsForUser,
    csrfToken: req.csrfToken(),
    code: '',
    validationMessages: {},
    backLink: true,
    requestOrgLink: `${config.hostingEnvironment.servicesUrl}/request-organisation/search`,
  });
};

const postAction = async (req, res) => {
  const uid = req.query.uid;
  if (!req.body['selected-organisation']) {
    let orgsForUser = await organisationApi.associatedWithUserV2(uid);

    const coronaVirusFormRedirectUri = config.coronaVirusForm? config.coronaVirusForm.redirect : null;
    logger.info('corona virus form redirect_uri =' + req.query.redirect_uri +' config.coronaVirusForm.redirect::' + coronaVirusFormRedirectUri);
    if(req.query.redirect_uri !== coronaVirusFormRedirectUri) {
      const application = await getServiceById(req.interaction.client_id, req.id);
      if (application) {
        const serviceRoles = await getRolesOfService(application.id, req.id);
        if (serviceRoles && serviceRoles.length > 0) {
          const allUserServices = await listUserServices(req.query.uid, req.id);
          if (allUserServices && allUserServices.length > 0) {
            const userAccessToService = allUserServices.filter(x => x.serviceId === application.id);
            if (userAccessToService && userAccessToService.length > 0) {
              orgsForUser = orgsForUser.filter(x => userAccessToService.find(y => y.organisationId === x.organisation.id));
            }
          }
        }
      }
    }
    getNaturalIdentifiers(orgsForUser);
    return res.render('select-organisation/views/index', {
      orgsForUser,
      csrfToken: req.csrfToken(),
      code: '',
      validationMessages: {
        organisation: 'Please select an organisation',
      },
      backLink: true,
    });
  }
  const organisation = req.body['selected-organisation'];

  return InteractionComplete.process(req.params.uuid, { status: 'success', uid: req.query.uid, type: 'select-organisation', organisation }, req, res);
};

const registerRoutes = (csrf) => {
  logger.info('Mounting Select Organisation routes');

  router.use(asyncWrapper(appendInteractionDetails));
  router.get('/', csrf, asyncWrapper(getAction));
  router.post('/', csrf, asyncWrapper(postAction));

  return router;
};

module.exports = registerRoutes;

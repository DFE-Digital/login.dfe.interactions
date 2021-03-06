'use strict';

const get = (req, res) => {
  res.render('migration/views/complete', {
    title: 'DfE Sign-in',
    uuid: req.params.uuid,
    csrfToken: req.csrfToken(),
    validationMessages: {},
    redirectUri: req.session.redirectUri,
    clientId: req.session.clientId,
  });
};

module.exports = get;

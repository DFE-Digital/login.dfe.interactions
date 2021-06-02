'use strict';

const action = (req, res) => {
  res.render('ResetPassword/views/newpassword', {
    csrfToken: req.csrfToken(),
    title: 'Set your password',
    newPassword: '',
    confirmPassword: '',
    validationFailed: false,
    validationMessages: {},
    redirectUri: req.query.redirect_uri,
  });
};

module.exports = action;

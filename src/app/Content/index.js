'use strict';

const express = require('express');
const logger = require('./../../infrastructure/logger');

const router = express.Router({ mergeParams: true });

module.exports = () => {
  logger.info('Mounting static content routes');
  router.get('/welcome', (req, res) => {
    res.render('Content/views/start', {
      title: 'DfE Sign-in',
    });
  });
  router.get('/terms', (req, res) => {
    res.render('Content/views/terms', {
      title: 'Terms and Conditions',
    });
  });
  router.get('/cookies', (req, res) => {
    res.render('Content/views/cookies', {
      title: 'Cookies',
    });
  });
  router.get('/privacy', (req, res) => {
    res.render('Content/views/privacy', {
      title: 'Privacy Notice',
    });
  });

  return router;
};

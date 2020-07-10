'use strict';

const logger = require('./../../infrastructure/logger');

//array to keep track of number of calls to this endpoint with same uid
let counter = [];

//remove all expired items from the counter every 5 seconds
setInterval(() => {
  counter = counter.filter((item) => {
    return !isExpiredRequest(item.expiresOn)
  });
}, 5000);

//returns true if request has expired based on received expiry in headers
const isExpiredRequest = (expiry) => {
  const expiresOn = new Date(expiry);
  const currentTime = new Date();

  return currentTime > expiresOn;
}

//returns number of times this token has made the request
const countRequest = (token) => {
  let found = counter.find((item) => {
    return item.token === token;
  });

  if (!found) {
    logger.info(`Not found, adding it to counter store`);

    let expiry = new Date();

    // expiresOn.setHours(expiresOn.getHours() + 24);
    //testing with 10 minutes for now
    expiry.setMinutes(expiry.getMinutes() + 10);
    logger.info(`expires on: ${expiry}`)

    //add the request details (headers) to array that counts number of requests
    counter.push({
      count: 1,
      token: token,
      expiresOn: expiry
    });
    return 1;
  } else {
    found.count++;
    logger.info(`Item found, count: ${found.count}`);
    return found.count;
  }
}

const action = async (req, res) => {

  if (!req.body || !req.body.id_token_hint || !req.body.redirect_url) {
    res.status(500).send("Invalid details provided with the request").end();
    return;
  }

  const token = req.body.id_token_hint;

  logger.info(`__token: ${token}`);

  //check this token hasn't been used too many times
  if (countRequest(token) > 10) {
    res.status(500).send("Change email endpoint called too many times").end();
    return;
  }

  //all good, redirect to redirect URL from request
  logger.info(`__redirectng to: ${req.body.redirect_url}`);

  res.redirect(req.body.redirect_url);

};

module.exports = action;

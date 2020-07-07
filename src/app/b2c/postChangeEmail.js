'use strict';

const http = require('https');
const Config = require('./../../infrastructure/Config')();
const RequestVerification = require('login.dfe.request-verification');

//array to keep track of number of calls to this endpoint with same uid
let counter = [];

//remove all expired items from the counter every 5 seconds
setInterval(() => {
  counter = counter.filter((item) => {
    return !isExpiredRequest(item.headers.api_sec_expiry)
  });
}, 5000);

//returns true if request is valid based on received uid, expiry and signature
const isValidRequest = (headers) => {

  const apiSecurityObject = {
    uid: headers.api_sec_uid,
    expiry: headers.api_sec_expiry
  };

  const requestVerification = new RequestVerification();
  const verified = requestVerification.verifyRequest(
    JSON.stringify(apiSecurityObject), Config.crypto.signing.publicKey, headers.api_sec_signature);

  return verified;
}

//returns true if request has expired based on received expiry in headers
const isExpiredRequest = (expiry) => {
  const expiresOn = new Date(expiry);
  const currentTime = new Date();

  return currentTime > expiresOn;
}

//returns number of times this uid has made the request
const countRequest = (headers) => {
  let found = counter.find((item) => {
    return item.headers.api_sec_uid === headers.api_sec_uid;
  });

  if (!found) {
    //add the request details (headers) to array that counts number of requests
    counter.push({
      count: 1,
      headers: headers
    });
    return 1;
  } else {
    found.count++;
    return found.count;
  }
}

const action = async (req, res) => {

  const securedEndpointUrl = process.env.B2C_SECURED_CHANGE_EMAIL_ENDPOINT;

  //based on security params added in headers, verify signature
  if (!isValidRequest(req.headers)) {
    res.writeHead(403);
    res.write("Change email call did not pass security checks");
    res.end();
    return;
  }

  //based on security params added in headers, verify request is not expired
  if (isExpiredRequest(req.headers.api_sec_expiry)) {
    res.writeHead(500);
    res.write("Change email endpoint not called, verification details expired");
    res.end();
    return;
  }

  //make sure we have a URL from env config to redirect the request to
  if (!securedEndpointUrl) {
    res.writeHead(404);
    res.write("Change email endpoint not configured properly");
    res.end();
    return;
  }

  //check this uid hasn't been used too many times
  if (countRequest(req.headers) > 5) {
    res.writeHead(500);
    res.write("Change email endpoint called too many times");
    res.end();
    return;
  }

  //all good, send request to the secured endpoint
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(JSON.stringify(req.body))
    }
  }

  const proxiedReq = http
    .request(securedEndpointUrl, options, proxiedRes => {
      // set encoding
      proxiedRes.setEncoding('utf8');

      // set http status code based on proxied response
      res.writeHead(proxiedRes.statusCode);

      // wait for data
      proxiedRes.on('data', chunk => {
        res.write(chunk);
      });

      proxiedRes.on('close', () => {
        // closed, let's end client request as well
        res.end();
      });


      proxiedRes.on('end', () => {
        // finished, let's finish client request as well
        res.end();
      });
    })
    .on('error', e => {
      try {
        // attempt to set error message and http status
        res.writeHead(500);
        res.write(e.message);
      } catch (e) {
        //no need to do anything else
      }
      finally {
        res.end();
      }
    });

  proxiedReq.write(JSON.stringify(req.body));
  proxiedReq.end();

};

module.exports = action;

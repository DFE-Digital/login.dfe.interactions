const crypto = require('crypto');
const Config = require('../Config')();

const signData = (data) => {
  const sign = crypto.createSign('RSA-SHA256');

  sign.write(JSON.stringify(data));
  sign.end();

  return sign.sign(Config.crypto.signing.privateKey, 'base64');
};

module.exports = signData;

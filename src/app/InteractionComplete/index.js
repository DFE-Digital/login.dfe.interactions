const Config = require('./../../infrastructure/Config')();
const logger = require('../../../../login.dfe.oidc/src/infrastructure/logger');
const { sendResult } = require('./../../infrastructure/utils');
const { signData } = require('./../../infrastructure/utils');


const buildPostbackData = (uuid, data) => {
  const postbackData = { uuid };

  if (data !== null) {
    Object.keys(data).forEach((key) => {
      postbackData[key] = data[key];
    });
  }

  postbackData.sig = signData(postbackData);

  return postbackData;
};


class InteractionComplete {
  static getPostbackDetails(uuid, data) {
    const postbackData = { uuid };
    const validateUser = { uuid, uid: data.uid };
    if (data !== null) {
      Object.keys(data).forEach((key) => {
        postbackData[key] = data[key];
      });
    }
    logger.info('About to sign signature and sSignature');
    logger.debug(`postBack Data is + ${JSON.stringify(postbackData)}`);
    postbackData.sig = signData(postbackData);
    postbackData.sSig = signData(validateUser);

    return {
      destination: `${Config.oidcService.url}/${uuid}/complete`,
      data: postbackData,
    };
  }

  static process(uuid, data, req, res) {
    const postbackDetails = InteractionComplete.getPostbackDetails(uuid, data);
    logger.info('Process after interaction Complete')
    sendResult(req, res, 'InteractionComplete/views/index', {
      destination: postbackDetails.destination,
      postbackData: postbackDetails.data,
    });
  }
}

module.exports = InteractionComplete;

const Config = require('./../../infrastructure/Config')();
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
    const postbackData = {};

    if (data !== null) {
      Object.keys(data).forEach((key) => {
        postbackData[key] = data[key];
      });
    }

    postbackData.sig = signData(postbackData);

    const validateUser = { uuid, uid: data.uid };
    postbackData.sSig = signData(validateUser);

    return {
      destination: `${Config.oidcService.url}/${uuid}/complete`,
      data: postbackData,
    };
  }

  static process(uuid, data, req, res) {
    const postbackDetails = InteractionComplete.getPostbackDetails(uuid, data);

    sendResult(req, res, 'InteractionComplete/views/index', {
      destination: postbackDetails.destination,
      postbackData: postbackDetails.data,
    });
  }
}

module.exports = InteractionComplete;

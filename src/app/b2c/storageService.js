'use strict';

const logger = require('../../infrastructure/logger');

let secureStorageBySessionId = [];

const addTokenHintToStorage = (token, sessionId) => {

    logger.info(`__setting token in storage. __token: ${token} __session: ${sessionId}`);

    let existingRecord = getTokenHintFromStorage(sessionId);

    if (!existingRecord) {
        secureStorageBySessionId.push({
            sessionId: sessionId,
            id_token_hint: token
        });
    } else {
        existingRecord.id_token_hint = token;
    }
}

const getTokenHintFromStorage = (sessionId) => {

    logger.info(`__getting token from storage. __session: ${sessionId}`);

    return secureStorageBySessionId.find((item) => {
        return item.sessionId = sessionId;
    });
}


module.exports = {
    addTokenHintToStorage,
    getTokenHintFromStorage,
};
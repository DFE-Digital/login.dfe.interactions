'use strict';

let secureStorageBySessionId = [];

const addTokenHintToStorage = (token, sessionId) => {
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
    return secureStorageBySessionId.find((item) => {
        return item.sessionId = sessionId;
    });
}


module.exports = {
    addTokenHintToStorage,
    getTokenHintFromStorage,
};
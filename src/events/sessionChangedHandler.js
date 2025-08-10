// src/events/sessionChangedHandler.js
let lastSessionData = null;
let messageIndex = 0;

function diffSessions(oldData, newData) {
    if (!oldData) return newData; // first run → full data

    const diff = {};
    for (const key in newData) {
        if (JSON.stringify(newData[key]) !== JSON.stringify(oldData[key])) {
            diff[key] = newData[key];
        }
    }
    return diff;
}

function handleSessionChanged(newData, sendToResonite) {
    messageIndex++;

    const diff = diffSessions(lastSessionData, newData);
    const isFullSync = !lastSessionData || Object.keys(diff).length === 0;

    sendToResonite({
        type: "sessionChanged",
        fullSync: isFullSync,
        messageIndex,
        data: diff
    });

    lastSessionData = newData;
}

module.exports = { handleSessionChanged };

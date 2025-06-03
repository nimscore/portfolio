"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSessionState = getSessionState;
const sessionMap = new Map();
const TOTAL = 1000000;
function getSessionState(sessionId) {
    if (!sessionMap.has(sessionId)) {
        sessionMap.set(sessionId, {
            order: Array.from({ length: TOTAL }, (_, i) => i + 1),
            selected: new Set(),
        });
    }
    return sessionMap.get(sessionId);
}

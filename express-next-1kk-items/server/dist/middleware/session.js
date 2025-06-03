"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = sessionMiddleware;
const uuid_1 = require("uuid");
const SESSION_COOKIE = 'sessionId';
function sessionMiddleware(req, res, next) {
    let sessionId = req.cookies[SESSION_COOKIE];
    if (!sessionId) {
        sessionId = (0, uuid_1.v4)();
        res.cookie(SESSION_COOKIE, sessionId, { httpOnly: true });
    }
    ;
    req.sessionId = sessionId;
    next();
}

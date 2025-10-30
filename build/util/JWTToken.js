"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAndDecode = verifyAndDecode;
const jwt = require('jsonwebtoken');
function verifyAndDecode(token, execContext) {
    const config = execContext.config;
    return jwt.verify(token, config.getSigningKey());
}

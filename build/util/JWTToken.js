"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAndDecode = verifyAndDecode;
const jwt = require('jsonwebtoken');
const { config } = require('../config');
function verifyAndDecode(token) {
    return jwt.verify(token, config.getJWTSigningKey());
}

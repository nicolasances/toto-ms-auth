const jwt = require('jsonwebtoken');
const {config} = require('../config');

export function verifyAndDecode(token: string) {

    return jwt.verify(token, config.getJWTSigningKey());

}
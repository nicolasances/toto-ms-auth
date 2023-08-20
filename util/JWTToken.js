const jwt = require('jsonwebtoken');
const {config} = require('../config');

exports.verifyAndDecode = (token) => {

    return jwt.verify(token, config.getJWTSigningKey());

}
const jwt = require('jsonwebtoken');
const moment = require('moment-timezone')
const { config } = require('../config');

exports.generateTotoJWTToken = (email) => {

    let exp = moment().tz("Europe/Rome").add(1, "months").unix();

    let token = jwt.sign({ user: email, authProvider: "toto", exp: exp}, config.getJWTSigningKey());

    return token;
}
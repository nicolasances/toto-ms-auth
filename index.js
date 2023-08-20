const Controller = require('toto-api-controller');
const config = require('./config');

const getTotoToken = require('./dlg/GetTotoToken');
const verifyToken = require('./dlg/VerifyToken');

let apiName = 'auth';

let api = new Controller(apiName, config.config);

api.path('GET', "/token", getTotoToken);
api.path('POST', "/verify", verifyToken);

api.listen();

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const toto_api_controller_1 = require("toto-api-controller");
const config_1 = require("./config");
const GetTotoToken_1 = require("./dlg/GetTotoToken");
const VerifyToken_1 = require("./dlg/VerifyToken");
const api = new toto_api_controller_1.TotoAPIController("tome-ms-auth", new config_1.ControllerConfig());
api.path('GET', "/token", new GetTotoToken_1.GetTotoToken());
api.path('POST', "/verify", new VerifyToken_1.VerifyToken());
api.init().then(() => {
    api.listen();
});

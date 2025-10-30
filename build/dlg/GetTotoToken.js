"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetTotoToken = void 0;
const toto_api_controller_1 = require("toto-api-controller");
const TokenExtract_1 = require("../util/TokenExtract");
const TokenSwap_1 = require("../util/TokenSwap");
class GetTotoToken {
    async do(req, userContext, execContext) {
        // 1. Get the Google Token from the HTTP Header
        const googleToken = (0, TokenExtract_1.extractTokenFromHeader)(req);
        if (!googleToken)
            throw new toto_api_controller_1.ValidationError(400, "No Google Token provided in Authorization Header");
        // 2. Exchange it with a Toto Token
        const totoToken = await (0, TokenSwap_1.exchangeGoogleToken)(googleToken, execContext);
        // 3. Return the token
        return { token: totoToken };
    }
}
exports.GetTotoToken = GetTotoToken;

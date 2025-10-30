"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyToken = void 0;
const toto_api_controller_1 = require("toto-api-controller");
const TokenExtract_1 = require("../util/TokenExtract");
const JWTToken_1 = require("../util/JWTToken");
class VerifyToken {
    async do(req, userContext, execContext) {
        const logger = execContext.logger;
        const cid = execContext.cid;
        // 1. Extract the token from HTTP header
        const token = (0, TokenExtract_1.extractTokenFromHeader)(req);
        if (!token)
            throw new toto_api_controller_1.ValidationError(400, "No Token provided in Authorization Header");
        // 2. Verify and unpack the JWT token
        const unpackedToken = (0, JWTToken_1.verifyAndDecode)(token, execContext);
        if (!unpackedToken) {
            logger.compute(cid, `[VerifyToken] - Token ${token} verification failed.`, "error");
            return { valid: false };
        }
        return { valid: true, email: unpackedToken.user, user: unpackedToken.user, authProvider: unpackedToken.authProvider, exp: unpackedToken.exp, iat: unpackedToken.iat };
    }
}
exports.VerifyToken = VerifyToken;

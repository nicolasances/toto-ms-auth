"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exchangeGoogleToken = exchangeGoogleToken;
const VerifyGoogleToken_1 = require("./VerifyGoogleToken");
const GenerateTotoJWTToken_1 = require("./GenerateTotoJWTToken");
/**
 * Exchanges a valid Google Id Token for a Toto Id Token
 *
 * @param {string} token the google id token
 */
async function exchangeGoogleToken(token, execContext) {
    const logger = execContext.logger;
    const cid = execContext.cid;
    // 1. Verify that the Google token is indeed valid
    const { valid, email } = await (0, VerifyGoogleToken_1.verifyGoogleToken)(token, execContext);
    if (!valid) {
        logger.compute(cid, `Token not valid. Cannot swap with Toto Token.`, "error");
        return { cid: cid, success: false, message: "Google Token not valid. Toto cannot issue a JWT Token." };
    }
    // 2. Generate a JWT Token
    const totoToken = (0, GenerateTotoJWTToken_1.generateTotoJWTToken)(email, execContext.config);
    return totoToken;
}


const { verifyGoogleToken } = require('./VerifyGoogleToken')
const { generateTotoJWTToken } = require('./GenerateTotoJWTToken');
const { context } = require('./Context')

/**
 * Exchanges a valid Google Id Token for a Toto Id Token
 * 
 * @param {string} token the google id token
 */
exports.exchangeGoogleToken = async (token, httpHeaders) => {

    const logger = context.getLogger();
    const cid = context.getCid();

    // 1. Verify that the Google token is indeed valid
    const { valid, email } = await verifyGoogleToken(token, httpHeaders);

    if (context.isDebugEnabled()) logger.compute(cid, `[exchangeGoogleToken] - Outcome of the validation for email ${email}: ${valid}`, "info");

    if (!valid) {

        logger.compute(cid, `Token not valid. Cannot swap with Toto Token.`, "error");

        return { cid: cid, success: false, message: "Google Token not valid. Toto cannot issue a JWT Token." }
    }

    // 2. Generate a JWT Token
    const totoToken = generateTotoJWTToken(email);

    if (context.isDebugEnabled()) logger.compute(cid, `[exchangeGoogleToken] - Generated Toto Token: ${totoToken}`, "info");

    return totoToken;

}
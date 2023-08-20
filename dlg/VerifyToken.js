const { verifyAndDecode } = require('../util/JWTToken');
const { context } = require('../util/Context');
const { extractTokenFromHeader } = require('../util/TokenExtract');

exports.do = async (req, userContext, execContext) => {

    const logger = execContext.logger;
    const cid = execContext.cid;

    // Set the context
    context.setExecutionContext(execContext);

    // 1. Extract the token from HTTP header
    const token = extractTokenFromHeader(req.headers);

    // 2. Verify and unpack the JWT token
    const unpackedToken = verifyAndDecode(token);

    if (!unpackedToken) {

        logger.compute(cid, `[VerifyToken] - Token ${token} verification failed.`, "error");

        return { valid: false }

    }

    return { valid: true, email: unpackedToken.user, user: unpackedToken.user, authProvider: unpackedToken.authProvider, exp: unpackedToken.exp, iat: unpackedToken.iat }

}

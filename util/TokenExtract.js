
const { context } = require('./Context');

exports.extractTokenFromHeader = (headers) => {

    const cid = context.getCid();
    const logger = context.getLogger();

    // Authorization
    let authorizationHeader = httpHeaders['authorization'];
    if (!authorizationHeader) authorizationHeader = httpHeaders['Authorization'];

    if (context.isDebugEnabled()) logger.compute(cid, `[extractTokenFromHeader] - Authorization header provided: ${authorizationHeader}`, "info");

    if (!authorizationHeader || authorizationHeader.indexOf("Bearer") == -1) return null;

    let token = authorizationHeader.substring('Bearer'.length + 1);

    if (context.isDebugEnabled()) logger.compute(cid, `[extractTokenFromHeader] - Extracted token from header: ${token}`, "info");

    return token;

}
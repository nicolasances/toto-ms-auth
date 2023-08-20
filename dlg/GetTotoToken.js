const { exchangeGoogleToken } = require('../util/TokenSwap');
const { extractTokenFromHeader } = require('../util/TokenExtract');
const { context } = require('../util/Context');

exports.do = async (req, userContext, execContext) => {

    // Set the context
    context.setExecutionContext(execContext);

    // 1. Get the Google Token from the HTTP Header
    const googleToken = extractTokenFromHeader(req.headers);

    // 2. Exchange it with a Toto Token
    const totoToken = await exchangeGoogleToken(googleToken, req.headers);

    // 3. Return the token
    return { token: totoToken };

}
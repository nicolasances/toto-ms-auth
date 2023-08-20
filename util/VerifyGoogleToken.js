const { OAuth2Client } = require('google-auth-library');
const { context } = require('./Context')
const { config } = require('../config')

const decodeJWT = (token) => {
    if (token !== null || token !== undefined) {
        const base64String = token.split(`.`)[1];
        const decodedValue = JSON.parse(Buffer.from(base64String, `base64`).toString(`ascii`));
        return decodedValue;
    }
    return null;
}

/**
 * @param {string} cid the correlation ID
 * @param {string} token the Bearer JWT token. 
 * Will typically be an express request.headers. 
 * Note that HTTPHeaders should contain a header "x-client" that specifies the code of the client that wants to access the API. See authorizedClientId notes below. Here you would pass (referring to the example below), something like "clientABC"
 * If the "x-client" header is not provided, the "web" is assumed to be the default. 
 * @returns 
 */
exports.verifyGoogleToken = async (token, httpHeaders) => {

    const logger = context.getLogger();
    const cid = context.getCid();
    const authorizedClientIds = config.getAuthorizedClientIDs().google;

    const clientIdentifier = httpHeaders ? httpHeaders['x-client'] : null;

    let authorizedClientId;
    if (clientIdentifier) authorizedClientId = authorizedClientIds[clientIdentifier] ? authorizedClientIds[clientIdentifier] : authorizedClientIds; // Older versions only had one authorized client ID for each provider
    else authorizedClientId = authorizedClientIds['anyClient'] ? authorizedClientIds['anyClient'] : authorizedClientIds; // Older versions only had one authorized client ID for each provider

    const client = new OAuth2Client(authorizedClientId);

    const decodedToken = decodeJWT(token)

    // Useful for debugging audience-related issues
    if (decodedToken.aud != authorizedClientId && logger) {
        logger.compute(cid, `Payload Audience: ${decodedToken.aud}`, "info");
        logger.compute(cid, `Target Audience: ${authorizedClientId}`, "info");
    }

    try {

        const ticket = await client.verifyIdToken({ idToken: token, audience: authorizedClientId });

        return { valid: true, email: ticket.payload.email }

    } catch (error) {

        console.log(error);

        return { valid: false }

    }

}
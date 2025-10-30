import { OAuth2Client } from 'google-auth-library';
import { ExecutionContext } from 'toto-api-controller';
import { ControllerConfig } from '../config';

const decodeJWT = (token?: string) => {
    if (token !== null && token !== undefined) {
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
export async function verifyGoogleToken(token: string, execContext: ExecutionContext): Promise<any> {

    const logger = execContext.logger;
    const cid = execContext.cid;
    const googleOAuthClientId = (execContext.config as ControllerConfig).googleOAuthClientId;

    const client = new OAuth2Client(googleOAuthClientId);

    const decodedToken = decodeJWT(token)

    // Useful for debugging audience-related issues
    if (decodedToken.aud != googleOAuthClientId && logger) {
        logger.compute(cid, `Payload Audience: ${decodedToken.aud}`, "info");
        logger.compute(cid, `Target Audience: ${googleOAuthClientId}`, "info");
    }

    try {

        const ticket = await client.verifyIdToken({ idToken: token, audience: googleOAuthClientId });

        return { valid: true, email: ticket.getPayload()?.email };

    } catch (error) {

        console.log(error);

        return { valid: false }

    }

}
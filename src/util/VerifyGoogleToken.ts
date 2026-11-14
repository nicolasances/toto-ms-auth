import { IncomingHttpHeaders } from 'http';
import { OAuth2Client } from 'google-auth-library';
import { Logger } from 'totoms';
import { ControllerConfig, GoogleClientIDs } from '../Config';

/**
 * Decodes the payload of a JWT token, without verifying it.
 *
 * @param {string | null} token - the JWT token
 *
 * @returns {any} the decoded payload
 *
 * @throws {TypeError} if the token is null or malformed (kept as is, see bug #3.2)
 */
function decodeJWT(token: string | null): any {

    if (token !== null || token !== undefined) {

        const base64String = token!.split(`.`)[1];

        return JSON.parse(Buffer.from(base64String, `base64`).toString(`ascii`));
    }

    return null;
}

/**
 * Verifies a Google ID token against the Google client ID of the calling client.
 *
 * Rules:
 * - the calling client is identified by the "x-client" header (e.g. "totoMoneyWeb", "totoMoneyiOS")
 * - if the "x-client" header is not provided, the default client ("anyClient") is used
 * - if the client is unknown, all client IDs are passed as audience (legacy behaviour, see bug #3.5)
 *
 * @param {string | null} token - the Google ID token
 * @param {IncomingHttpHeaders} httpHeaders - the HTTP headers of the request
 * @param {ControllerConfig} config - the service configuration, holding the authorized client IDs
 * @param {string} cid - the correlation id, used for logging
 *
 * @returns {Promise<GoogleTokenVerification>} the result of the verification
 */
export async function verifyGoogleToken(token: string | null, httpHeaders: IncomingHttpHeaders | Record<string, any>, config: ControllerConfig, cid: string): Promise<GoogleTokenVerification> {

    const logger = Logger.getInstance();
    const authorizedClientIds = config.getAuthorizedClientIDs().google;

    const clientIdentifier = httpHeaders ? httpHeaders['x-client'] as keyof GoogleClientIDs : null;

    let authorizedClientId: string | GoogleClientIDs;

    if (clientIdentifier) authorizedClientId = authorizedClientIds[clientIdentifier] ? authorizedClientIds[clientIdentifier]! : authorizedClientIds;
    else authorizedClientId = authorizedClientIds['anyClient'] ? authorizedClientIds['anyClient'] : authorizedClientIds;

    const client = new OAuth2Client(authorizedClientId as string);

    const decodedToken = decodeJWT(token);

    // Useful for debugging audience-related issues
    if (decodedToken.aud != authorizedClientId) {
        logger.compute(cid, `Payload Audience: ${decodedToken.aud}`, "info");
        logger.compute(cid, `Target Audience: ${authorizedClientId}`, "info");
    }

    try {

        const ticket = await client.verifyIdToken({ idToken: token!, audience: authorizedClientId as string });

        return { valid: true, email: ticket.getPayload()?.email };

    } catch (error) {

        console.log(error);

        return { valid: false };
    }
}

export interface GoogleTokenVerification {
    valid: boolean;             // True if the Google ID token is valid for the authorized client ID
    email?: string;             // The email of the user, if the token is valid
}

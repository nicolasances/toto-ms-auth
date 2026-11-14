import { IncomingHttpHeaders } from 'http';
import { Logger } from 'totoms';
import { ControllerConfig } from '../Config';
import { verifyGoogleToken } from './VerifyGoogleToken';
import { generateTotoJWTToken } from './GenerateTotoJWTToken';

/**
 * Exchanges a valid Google ID token for a Toto token.
 *
 * Rules:
 * - if the Google token is not valid, a failure object is returned instead of a token (legacy behaviour, see bug #3.1)
 *
 * @param {string | null} token - the Google ID token
 * @param {IncomingHttpHeaders} httpHeaders - the HTTP headers of the request (used to identify the calling client)
 * @param {ControllerConfig} config - the service configuration
 * @param {string} cid - the correlation id, used for logging
 *
 * @returns {Promise<string | TokenSwapFailure>} the Toto token, or a failure object if the Google token is not valid
 */
export async function exchangeGoogleToken(token: string | null, httpHeaders: IncomingHttpHeaders | Record<string, any>, config: ControllerConfig, cid: string): Promise<string | TokenSwapFailure> {

    const logger = Logger.getInstance();

    // 1. Verify that the Google token is indeed valid
    const { valid, email } = await verifyGoogleToken(token, httpHeaders, config, cid);

    logger.compute(cid, `[exchangeGoogleToken] - Outcome of the validation for email ${email}: ${valid}`, "info");

    if (!valid) {

        logger.compute(cid, `Token not valid. Cannot swap with Toto Token.`, "error");

        return { cid: cid, success: false, message: "Google Token not valid. Toto cannot issue a JWT Token." };
    }

    // 2. Generate a Toto token
    const totoToken = generateTotoJWTToken(email!, config.getSigningKey());

    logger.compute(cid, `[exchangeGoogleToken] - Generated Toto Token: ${totoToken}`, "info");

    return totoToken;
}

export interface TokenSwapFailure {
    cid: string;                // The correlation id of the request
    success: false;             // Always false
    message: string;            // Why the token could not be exchanged
}

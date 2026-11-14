import { Request } from 'express';
import { IncomingHttpHeaders } from 'http';
import { Logger, TotoDelegate, TotoRuntimeError, UserContext } from 'totoms';
import { ControllerConfig } from '../Config';
import { extractTokenFromHeader } from '../util/TokenExtract';
import { exchangeGoogleToken, TokenSwapFailure } from '../util/TokenSwap';

/**
 * Exchanges a Google ID token (Authorization: Bearer <token>) for a Toto token.
 */
export class GetTotoToken extends TotoDelegate<GetTotoTokenRequest, GetTotoTokenResponse> {

    /**
     * Exchanges the Google ID token for a Toto token.
     *
     * Rules:
     * - any error is turned into a 500 "Unexpected error" (legacy behaviour, see bug #3.2)
     *
     * @param {GetTotoTokenRequest} req - the parsed request
     * @param {UserContext} [userContext] - not used (no auth on this endpoint)
     *
     * @returns {Promise<GetTotoTokenResponse>} the Toto token
     */
    async do(req: GetTotoTokenRequest, userContext?: UserContext): Promise<GetTotoTokenResponse> {

        const cid = String(this.cid);

        try {

            const totoToken = await exchangeGoogleToken(req.googleToken, req.headers, this.config as ControllerConfig, cid);

            return { token: totoToken };

        } catch (error) {

            Logger.getInstance().compute(cid, `[GetTotoToken] - ${error}`, "error");

            throw new TotoRuntimeError(500, "Unexpected error");
        }
    }

    /**
     * Extracts the Google ID token and the headers from the request.
     *
     * @param {Request} req - the Express request
     *
     * @returns {GetTotoTokenRequest} the parsed request
     */
    parseRequest(req: Request): GetTotoTokenRequest {

        return { googleToken: extractTokenFromHeader(req.headers, String(this.cid)), headers: req.headers };
    }

}

interface GetTotoTokenRequest {
    googleToken: string | null;         // The Google ID token from the Authorization header, or null if not provided
    headers: IncomingHttpHeaders;       // The HTTP headers, used to identify the calling client (x-client)
}

interface GetTotoTokenResponse {
    token: string | TokenSwapFailure;   // The Toto token, or a failure object if the Google token is not valid (legacy behaviour, see bug #3.1)
}

import { Request } from 'express';
import { Logger, TotoDelegate, UserContext } from 'totoms';
import { extractTokenFromHeader } from '../util/TokenExtract';
import { verifyAndDecode } from '../util/JWTToken';

/**
 * Verifies a Toto token (Authorization: Bearer <token>) and returns its claims.
 */
export class VerifyToken extends TotoDelegate<VerifyTokenRequest, VerifyTokenResponse> {

    /**
     * Verifies the Toto token and returns its claims.
     *
     * Rules:
     * - an invalid or expired token makes the verification throw, which results in a 500 (legacy behaviour, see bug #3.3)
     *
     * @param {VerifyTokenRequest} req - the parsed request
     * @param {UserContext} [userContext] - not used (no auth on this endpoint)
     *
     * @returns {Promise<VerifyTokenResponse>} the verification result and the token claims
     */
    async do(req: VerifyTokenRequest, userContext?: UserContext): Promise<VerifyTokenResponse> {

        const unpackedToken = verifyAndDecode(req.token!, this.config.getSigningKey());

        if (!unpackedToken) {

            Logger.getInstance().compute(String(this.cid), `[VerifyToken] - Token ${req.token} verification failed.`, "error");

            return { valid: false };
        }

        return { valid: true, email: unpackedToken.user, user: unpackedToken.user, authProvider: unpackedToken.authProvider, exp: unpackedToken.exp, iat: unpackedToken.iat };
    }

    /**
     * Extracts the Toto token from the request.
     *
     * @param {Request} req - the Express request
     *
     * @returns {VerifyTokenRequest} the parsed request
     */
    parseRequest(req: Request): VerifyTokenRequest {

        return { token: extractTokenFromHeader(req.headers, String(this.cid)) };
    }

}

interface VerifyTokenRequest {
    token: string | null;       // The Toto token from the Authorization header, or null if not provided
}

interface VerifyTokenResponse {
    valid: boolean;             // True if the token is valid
    email?: string;             // The email of the user (same as user)
    user?: string;              // The email of the user
    authProvider?: string;      // The auth provider of the token ("toto")
    exp?: number;               // Expiration time (seconds since epoch)
    iat?: number;               // Issued-at time (seconds since epoch)
}

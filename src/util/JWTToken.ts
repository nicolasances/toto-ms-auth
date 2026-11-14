import jwt from 'jsonwebtoken';

/**
 * Verifies a Toto token and returns its claims.
 *
 * @param {string} token - the Toto token
 * @param {string} signingKey - the Toto JWT signing key
 *
 * @returns {TotoTokenPayload} the claims of the token
 *
 * @throws {jwt.JsonWebTokenError} if the token is invalid (e.g. wrong signature, malformed) or expired (jwt.TokenExpiredError)
 */
export function verifyAndDecode(token: string, signingKey: string): TotoTokenPayload {

    return jwt.verify(token, signingKey) as TotoTokenPayload;
}

export interface TotoTokenPayload {
    user: string;               // The email of the user the token was issued to
    authProvider: string;       // The auth provider that issued the token. Always "toto" for tokens issued by this service.
    exp: number;                // Expiration time (seconds since epoch)
    iat: number;                // Issued-at time (seconds since epoch)
}

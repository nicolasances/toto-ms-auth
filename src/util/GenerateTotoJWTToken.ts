import jwt from 'jsonwebtoken';
import moment from 'moment-timezone';
import { AUTH_PROVIDERS } from 'totoms';

/**
 * Generates a Toto token (JWT) for the given user.
 *
 * Rules:
 * - the token is valid for 3 months
 * - the token is signed with HS256 (jsonwebtoken default) using the Toto signing key
 *
 * @param {string} email - the email of the user, stored in the "user" claim
 * @param {string} signingKey - the Toto JWT signing key
 *
 * @returns {string} the signed Toto token
 */
export function generateTotoJWTToken(email: string, signingKey: string): string {

    const exp = moment().tz("Europe/Rome").add(3, "months").unix();

    return jwt.sign({ user: email, authProvider: AUTH_PROVIDERS.toto, exp: exp }, signingKey);
}

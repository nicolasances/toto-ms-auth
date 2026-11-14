import { IncomingHttpHeaders } from 'http';
import { Logger } from 'totoms';

/**
 * Extracts the Bearer token from the Authorization header.
 *
 * Rules:
 * - both "authorization" and "Authorization" headers are supported
 * - returns null if there is no header or if it is not a Bearer header
 *
 * @param {IncomingHttpHeaders} httpHeaders - the HTTP headers of the request
 * @param {string} cid - the correlation id, used for logging
 *
 * @returns {string | null} the token, or null if no Bearer token was provided
 */
export function extractTokenFromHeader(httpHeaders: IncomingHttpHeaders | Record<string, any>, cid: string): string | null {

    const logger = Logger.getInstance();

    const authorizationHeader: string | undefined = httpHeaders['authorization'] ?? httpHeaders['Authorization'];

    logger.compute(cid, `[extractTokenFromHeader] - Authorization header provided: ${authorizationHeader}`, "info");

    if (!authorizationHeader || authorizationHeader.indexOf("Bearer") == -1) return null;

    const token = authorizationHeader.substring('Bearer'.length + 1);

    logger.compute(cid, `[extractTokenFromHeader] - Extracted token from header: ${token}`, "info");

    return token;
}

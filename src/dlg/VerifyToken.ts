import { Request } from "express";
import { ExecutionContext, TotoDelegate, UserContext, ValidationError } from "toto-api-controller";
import { extractTokenFromHeader } from "../util/TokenExtract";
import { verifyAndDecode } from "../util/JWTToken";

export class VerifyToken implements TotoDelegate {

    async do(req: Request, userContext: UserContext, execContext: ExecutionContext): Promise<any> {

        const logger = execContext.logger;
        const cid = execContext.cid;

        // 1. Extract the token from HTTP header
        const token = extractTokenFromHeader(req);

        if (!token) throw new ValidationError(400, "No Token provided in Authorization Header");

        // 2. Verify and unpack the JWT token
        const unpackedToken = verifyAndDecode(token);

        if (!unpackedToken) {

            logger.compute(cid, `[VerifyToken] - Token ${token} verification failed.`, "error");

            return { valid: false }

        }

        return { valid: true, email: unpackedToken.user, user: unpackedToken.user, authProvider: unpackedToken.authProvider, exp: unpackedToken.exp, iat: unpackedToken.iat }
    }
}

import { Request } from "express";
import { ExecutionContext, FakeRequest, TotoDelegate, UserContext, ValidationError } from "toto-api-controller";
import { extractTokenFromHeader } from "../util/TokenExtract";
import { exchangeGoogleToken } from "../util/TokenSwap";

export class GetTotoToken implements TotoDelegate {

    async do(req: Request, userContext: UserContext, execContext: ExecutionContext): Promise<any> {

        // 1. Get the Google Token from the HTTP Header
        const googleToken = extractTokenFromHeader(req);

        if (!googleToken) throw new ValidationError(400, "No Google Token provided in Authorization Header");

        // 2. Exchange it with a Toto Token
        const totoToken = await exchangeGoogleToken(googleToken, execContext);

        // 3. Return the token
        return { token: totoToken };

    }

}
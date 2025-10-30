import { ExecutionContext } from "toto-api-controller";
import { verifyGoogleToken } from "./VerifyGoogleToken";
import { generateTotoJWTToken } from "./GenerateTotoJWTToken";
import { ControllerConfig } from "../config";


/**
 * Exchanges a valid Google Id Token for a Toto Id Token
 * 
 * @param {string} token the google id token
 */
export async function exchangeGoogleToken(token: string, execContext: ExecutionContext) {

    const logger = execContext.logger;
    const cid = execContext.cid;

    // 1. Verify that the Google token is indeed valid
    const { valid, email } = await verifyGoogleToken(token, execContext);

    if (!valid) {

        logger.compute(cid, `Token not valid. Cannot swap with Toto Token.`, "error");

        return { cid: cid, success: false, message: "Google Token not valid. Toto cannot issue a JWT Token." }
    }

    // 2. Generate a JWT Token
    const totoToken = generateTotoJWTToken(email, execContext.config as ControllerConfig);

    return totoToken;

}
import { ExecutionContext } from "toto-api-controller";
import { ControllerConfig } from "../config";

const jwt = require('jsonwebtoken');

export function verifyAndDecode(token: string, execContext: ExecutionContext) {

    const config = execContext.config as ControllerConfig;

    return jwt.verify(token, config.getSigningKey());

}
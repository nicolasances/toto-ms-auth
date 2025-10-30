import jwt from 'jsonwebtoken';
import moment from 'moment-timezone';
import { ControllerConfig } from '../config';


export function generateTotoJWTToken(email: string, config: ControllerConfig) {

    let exp = moment().tz("Europe/Rome").add(3, "months").unix();

    let token = jwt.sign({ user: email, authProvider: "toto", exp: exp}, config.getSigningKey());

    return token;
}
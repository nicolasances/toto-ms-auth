"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTotoJWTToken = generateTotoJWTToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
function generateTotoJWTToken(email, config) {
    let exp = (0, moment_timezone_1.default)().tz("Europe/Rome").add(3, "months").unix();
    let token = jsonwebtoken_1.default.sign({ user: email, authProvider: "toto", exp: exp }, config.getSigningKey());
    return token;
}

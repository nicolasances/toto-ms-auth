"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractTokenFromHeader = extractTokenFromHeader;
function extractTokenFromHeader(httpRequest) {
    // Authorization
    let authorizationHeader = httpRequest.get('authorization');
    if (!authorizationHeader)
        authorizationHeader = httpRequest.get('Authorization');
    if (!authorizationHeader || authorizationHeader.indexOf("Bearer") == -1)
        return null;
    let token = authorizationHeader.substring('Bearer'.length + 1);
    return token;
}

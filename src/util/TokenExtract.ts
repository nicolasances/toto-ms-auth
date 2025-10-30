import { Request } from "express";

export function extractTokenFromHeader (httpRequest: Request): string | null {

    // Authorization
    let authorizationHeader: string | undefined = httpRequest.get('authorization');
    if (!authorizationHeader) authorizationHeader = httpRequest.get('Authorization');

    if (!authorizationHeader || authorizationHeader.indexOf("Bearer") == -1) return null;

    let token = authorizationHeader.substring('Bearer'.length + 1);

    return token;

}
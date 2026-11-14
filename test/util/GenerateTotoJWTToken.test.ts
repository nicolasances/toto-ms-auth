import assert from "assert";
import jwt from "jsonwebtoken";
import { generateTotoJWTToken } from "../../src/util/GenerateTotoJWTToken";

describe("generateTotoJWTToken", () => {

    it("signs a Toto token for the user, valid for about 3 months", () => {

        const token = generateTotoJWTToken("user@example.com", "key");

        const payload = jwt.verify(token, "key") as jwt.JwtPayload;
        const nowSeconds = Math.floor(Date.now() / 1000);
        const validityDays = (payload.exp! - nowSeconds) / 86400;

        assert.strictEqual(payload.user, "user@example.com");
        assert.strictEqual(payload.authProvider, "toto");
        assert.ok(payload.iat);
        assert.ok(validityDays >= 88 && validityDays <= 93, `unexpected validity: ${validityDays} days`);
    });

    it("uses HS256, so tokens stay compatible with the tokens issued so far", () => {

        const token = generateTotoJWTToken("user@example.com", "key");

        assert.strictEqual(jwt.decode(token, { complete: true })!.header.alg, "HS256");
    });
});

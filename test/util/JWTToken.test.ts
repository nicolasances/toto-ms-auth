import assert from "assert";
import jwt from "jsonwebtoken";
import { verifyAndDecode } from "../../src/util/JWTToken";
import { generateTotoJWTToken } from "../../src/util/GenerateTotoJWTToken";

describe("verifyAndDecode", () => {

    it("decodes a token signed with the same key", () => {

        const token = generateTotoJWTToken("user@example.com", "key");

        const payload = verifyAndDecode(token, "key");

        assert.strictEqual(payload.user, "user@example.com");
        assert.strictEqual(payload.authProvider, "toto");
    });

    it("throws when the token is signed with another key", () => {

        const token = generateTotoJWTToken("user@example.com", "another-key");

        assert.throws(() => verifyAndDecode(token, "key"), jwt.JsonWebTokenError);
    });

    it("throws when the token is expired", () => {

        const token = jwt.sign({ user: "user@example.com", authProvider: "toto", exp: Math.floor(Date.now() / 1000) - 60 }, "key");

        assert.throws(() => verifyAndDecode(token, "key"), jwt.TokenExpiredError);
    });
});

import assert from "assert";
import { Request } from "express";
import { TotoMessageBus } from "totoms";
import { VerifyToken } from "../../src/dlg/VerifyToken";
import { generateTotoJWTToken } from "../../src/util/GenerateTotoJWTToken";
import { loadedTestConfig, TEST_SIGNING_KEY } from "../helpers/TestConfig";

/**
 * Creates a VerifyToken delegate backed by a loaded test configuration.
 *
 * @returns {Promise<VerifyToken>} the delegate
 */
async function newDelegate(): Promise<VerifyToken> {

    const config = await loadedTestConfig();

    return new VerifyToken(null as unknown as TotoMessageBus, config);
}

/**
 * Builds a fake Express request carrying the given Authorization header.
 *
 * @param {string} [authorization] - the value of the Authorization header, if any
 *
 * @returns {Request} the fake request
 */
function requestWithAuth(authorization?: string): Request {

    return { headers: authorization ? { authorization } : {} } as Request;
}

describe("VerifyToken", () => {

    it("returns the token claims for a valid Toto token", async () => {

        const delegate = await newDelegate();
        const token = generateTotoJWTToken("user@example.com", TEST_SIGNING_KEY);

        const response = await delegate.processRequest(delegate.parseRequest(requestWithAuth(`Bearer ${token}`)));

        assert.strictEqual(response.valid, true);
        assert.strictEqual(response.email, "user@example.com");
        assert.strictEqual(response.user, "user@example.com");
        assert.strictEqual(response.authProvider, "toto");
        assert.ok(response.exp);
        assert.ok(response.iat);
    });

    it("throws (500 as before the migration) for a token signed with another key", async () => {

        const delegate = await newDelegate();
        const token = generateTotoJWTToken("user@example.com", "another-key");

        await assert.rejects(() => delegate.processRequest(delegate.parseRequest(requestWithAuth(`Bearer ${token}`))));
    });

    it("throws (500 as before the migration) when no Authorization header is provided", async () => {

        const delegate = await newDelegate();

        await assert.rejects(() => delegate.processRequest(delegate.parseRequest(requestWithAuth())));
    });
});

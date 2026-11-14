import assert from "assert";
import { Request } from "express";
import { TotoMessageBus, TotoRuntimeError } from "totoms";
import { GetTotoToken } from "../../src/dlg/GetTotoToken";
import { loadedTestConfig } from "../helpers/TestConfig";

/**
 * Creates a GetTotoToken delegate backed by a loaded test configuration.
 *
 * @returns {Promise<GetTotoToken>} the delegate
 */
async function newDelegate(): Promise<GetTotoToken> {

    const config = await loadedTestConfig();

    return new GetTotoToken(null as unknown as TotoMessageBus, config);
}

describe("GetTotoToken", () => {

    it("extracts the Google token and the headers from the request", async () => {

        const delegate = await newDelegate();
        const headers = { authorization: "Bearer google.id.token", "x-client": "totoMoneyWeb" };

        const request = delegate.parseRequest({ headers } as unknown as Request);

        assert.strictEqual(request.googleToken, "google.id.token");
        assert.strictEqual(request.headers, headers);
    });

    it("fails with a 500 'Unexpected error' when no Authorization header is provided (behaviour kept 1:1, see #3)", async () => {

        const delegate = await newDelegate();

        await assert.rejects(() => delegate.processRequest(delegate.parseRequest({ headers: {} } as Request)), (error: unknown) => {

            assert.ok(error instanceof TotoRuntimeError);
            assert.strictEqual(error.code, 500);
            assert.strictEqual(error.message, "Unexpected error");

            return true;
        });
    });
});

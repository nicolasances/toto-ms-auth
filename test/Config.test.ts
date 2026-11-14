import assert from "assert";
import { Logger } from "totoms";
import { ControllerConfig } from "../src/Config";
import { fakeSecretsManager, TEST_IOS_CLIENT_ID, TEST_SIGNING_KEY, TEST_WEB_CLIENT_ID } from "./helpers/TestConfig";

describe("ControllerConfig", () => {

    before(() => Logger.init("toto-ms-auth"));

    it("loads the base Toto secrets and the Google client IDs", async () => {

        const { secretsManager, requestedSecrets } = fakeSecretsManager();
        const config = new ControllerConfig(secretsManager);

        await config.load();

        assert.deepStrictEqual([...requestedSecrets].sort(), [
            "client-id-google-toto-money-ios",
            "client-id-google-toto-money-web",
            "jwt-signing-key",
            "mongo-host",
            "toto-expected-audience",
            "toto-registry-endpoint",
        ]);
        assert.strictEqual(config.getSigningKey(), TEST_SIGNING_KEY);
    });

    it("fails to load when a secret is missing", async () => {

        const { secretsManager } = fakeSecretsManager({ "jwt-signing-key": TEST_SIGNING_KEY });
        const config = new ControllerConfig(secretsManager);

        await assert.rejects(() => config.load());
    });

    it("exposes the Google client IDs with the web client as default (anyClient)", async () => {

        const config = new ControllerConfig(fakeSecretsManager().secretsManager);

        await config.load();

        assert.deepStrictEqual(config.getAuthorizedClientIDs(), { google: { totoMoneyiOS: TEST_IOS_CLIENT_ID, totoMoneyWeb: TEST_WEB_CLIENT_ID, anyClient: TEST_WEB_CLIENT_ID } });
    });

    it("disables Toto auth validation and keeps the correlation id setting", () => {

        const config = new ControllerConfig(fakeSecretsManager().secretsManager);

        assert.deepStrictEqual(config.getProps(), { noAuth: true, noCorrelationId: false });
        assert.strictEqual(config.getMongoSecretNames(), null);
    });
});

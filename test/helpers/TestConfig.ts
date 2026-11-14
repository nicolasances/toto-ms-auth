import { Logger, SecretsManager } from "totoms";
import { ControllerConfig } from "../../src/Config";

export const TEST_SIGNING_KEY = "test-signing-key";
export const TEST_WEB_CLIENT_ID = "web-client-id.apps.googleusercontent.com";
export const TEST_IOS_CLIENT_ID = "ios-client-id.apps.googleusercontent.com";

/**
 * Default secrets returned by the fake Secrets Manager, keyed by secret name.
 */
export const DEFAULT_TEST_SECRETS: Record<string, string> = {
    "mongo-host": "fake-mongo-host",
    "jwt-signing-key": TEST_SIGNING_KEY,
    "toto-expected-audience": "fake-audience",
    "toto-registry-endpoint": "https://fake-registry",
    "client-id-google-toto-money-web": TEST_WEB_CLIENT_ID,
    "client-id-google-toto-money-ios": TEST_IOS_CLIENT_ID,
};

/**
 * Creates a fake Secrets Manager that serves secrets from an in-memory map and records which secrets were requested.
 *
 * @param {Record<string, string>} secrets - the secrets to serve, keyed by secret name
 *
 * @returns {FakeSecretsManager} the fake Secrets Manager and the list of requested secret names
 */
export function fakeSecretsManager(secrets: Record<string, string> = DEFAULT_TEST_SECRETS): FakeSecretsManager {

    const requestedSecrets: string[] = [];

    const secretsManager = {
        getSecret: async (secretName: string): Promise<string> => {

            requestedSecrets.push(secretName);

            if (!(secretName in secrets)) throw new Error(`Secret ${secretName} not found`);

            return secrets[secretName];
        }
    } as unknown as SecretsManager;

    return { secretsManager, requestedSecrets };
}

/**
 * Creates a loaded ControllerConfig backed by the fake Secrets Manager and initializes the Toto Logger.
 *
 * @returns {Promise<ControllerConfig>} a loaded configuration
 */
export async function loadedTestConfig(): Promise<ControllerConfig> {

    Logger.init("toto-ms-auth");

    const config = new ControllerConfig(fakeSecretsManager().secretsManager);

    await config.load();

    return config;
}

export interface FakeSecretsManager {
    secretsManager: SecretsManager;     // The fake Secrets Manager, to be passed to the ControllerConfig
    requestedSecrets: string[];         // The names of the secrets requested so far, in order of request
}

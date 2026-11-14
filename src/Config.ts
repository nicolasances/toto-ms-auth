import { APIOptions, TotoControllerConfig } from 'totoms';

const GOOGLE_CLIENT_ID_SECRETS = {
    totoMoneyWeb: 'client-id-google-toto-money-web',
    totoMoneyiOS: 'client-id-google-toto-money-ios',
};

export class ControllerConfig extends TotoControllerConfig {

    googleAuthorizedClientIDs: GoogleAuthorizedClientIDs = {};     // The Google OAuth client IDs whose ID tokens can be exchanged for a Toto token. Loaded from the Secrets Manager.

    /**
     * Loads the configuration.
     *
     * Loads the standard Toto secrets (through the base configuration: mongo-host, jwt-signing-key, toto-expected-audience, toto-registry-endpoint)
     * and, in addition, the Google client IDs of the clients that are authorized to exchange a Google ID token for a Toto token.
     *
     * @returns {Promise<void>} resolves when all secrets are loaded. Rejects if any secret cannot be loaded.
     */
    async load(): Promise<void> {

        const [, totoMoneyWeb, totoMoneyiOS] = await Promise.all([
            super.load(),
            this.secretsManager.getSecret(GOOGLE_CLIENT_ID_SECRETS.totoMoneyWeb),
            this.secretsManager.getSecret(GOOGLE_CLIENT_ID_SECRETS.totoMoneyiOS),
        ]);

        this.googleAuthorizedClientIDs = { totoMoneyWeb, totoMoneyiOS };
    }

    /**
     * This service has no database.
     *
     * @returns {null} always null
     */
    getMongoSecretNames(): { userSecretName: string; pwdSecretName: string; } | null {

        return null;
    }

    /**
     * Returns the API options used by the Toto Validator.
     *
     * Rules:
     * - noAuth must be true: the endpoints of this service receive Google ID tokens (GET /token) or validate Toto tokens themselves (POST /verify),
     *   so the standard Toto authorization check must not run before the delegates.
     *
     * @returns {APIOptions} the API options
     */
    getProps(): APIOptions {

        return { noAuth: true, noCorrelationId: false };
    }

    /**
     * Returns the client IDs authorized to exchange their tokens, per auth provider.
     *
     * Rules:
     * - anyClient is the client ID used when the caller does not specify a client (x-client header). It is the Toto Money web client.
     *
     * @returns {AuthorizedClientIDs} the authorized client IDs
     */
    getAuthorizedClientIDs(): AuthorizedClientIDs {

        return { google: { ...this.googleAuthorizedClientIDs, anyClient: this.googleAuthorizedClientIDs.totoMoneyWeb } };
    }

}

export interface GoogleAuthorizedClientIDs {
    totoMoneyWeb?: string;      // Google OAuth client ID of the Toto Money web app
    totoMoneyiOS?: string;      // Google OAuth client ID of the Toto Money iOS app (not used anymore)
}

export interface GoogleClientIDs extends GoogleAuthorizedClientIDs {
    anyClient?: string;         // Google OAuth client ID to use when the caller does not specify a client (x-client header)
}

export interface AuthorizedClientIDs {
    google: GoogleClientIDs;    // Authorized client IDs for Google as auth provider
}

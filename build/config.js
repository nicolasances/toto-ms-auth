"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ControllerConfig = void 0;
const toto_api_controller_1 = require("toto-api-controller");
class ControllerConfig {
    async load() {
        const env = process.env.HYPERSCALER == 'aws' ? (process.env.ENVIRONMENT ?? 'dev') : process.env.GCP_PID;
        const hyperscaler = process.env.HYPERSCALER == 'aws' ? 'aws' : 'gcp';
        if (!process.env.ENVIRONMENT)
            this.logger?.compute("", `No environment provided, loading default configuration`);
        if (!process.env.HYPERSCALER)
            this.logger?.compute("", `No hyperscaler provided, loading default configuration`);
        this.logger?.compute("", `Loading configuration for environment [${env}] on hyperscaler [${hyperscaler}]`);
        const secretsManager = new toto_api_controller_1.SecretsManager(hyperscaler, env, this.logger);
        let promises = [];
        promises.push(secretsManager.getSecret('toto-expected-audience').then((value) => {
            this.expectedAudience = value;
        }));
        promises.push(secretsManager.getSecret('jwt-signing-key').then((value) => {
            this.jwtSigningKey = value;
        }));
        promises.push(secretsManager.getSecret('client-id-google-toto-money-web').then((value) => {
            this.googleOAuthClientId = value;
        }));
        // Other possible secrets to load:
        // mongo-host
        // mongo-user
        // mongo-pswd
        await Promise.all(promises);
    }
    getSigningKey() {
        return String(this.jwtSigningKey);
    }
    getProps() {
        return {
            noCorrelationId: false,
            noAuth: true
        };
    }
    getExpectedAudience() {
        return String(this.expectedAudience);
    }
}
exports.ControllerConfig = ControllerConfig;

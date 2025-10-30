import { Logger, SecretsManager, TotoControllerConfig, ValidatorProps } from "toto-api-controller";

export class ControllerConfig implements TotoControllerConfig {

    logger: Logger | undefined;

    expectedAudience: string | undefined;
    totoAuthEndpoint: string | undefined;
    jwtSigningKey: string | undefined;
    googleOAuthClientId: string | undefined;


    async load(): Promise<any> {

        const env = process.env.HYPERSCALER == 'aws' ? (process.env.ENVIRONMENT ?? 'dev') : process.env.GCP_PID;
        const hyperscaler = process.env.HYPERSCALER == 'aws' ? 'aws' : 'gcp';

        if (!process.env.ENVIRONMENT) this.logger?.compute("", `No environment provided, loading default configuration`);
        if (!process.env.HYPERSCALER) this.logger?.compute("", `No hyperscaler provided, loading default configuration`);

        this.logger?.compute("", `Loading configuration for environment [${env}] on hyperscaler [${hyperscaler}]`);

        const secretsManager = new SecretsManager(hyperscaler, env!, this.logger!);

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

    getSigningKey(): string {
        return String(this.jwtSigningKey);
    }

    getProps(): ValidatorProps {
        return {
            noCorrelationId: false,
            noAuth: true
        }
    }
    
    getExpectedAudience(): string {
        
        return String(this.expectedAudience)
        
    }

}

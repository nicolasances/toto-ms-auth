import { getHyperscalerConfiguration, SupportedHyperscalers, TotoMicroservice, TotoMicroserviceConfiguration } from 'totoms';
import { ControllerConfig } from './Config';
import { GetTotoToken } from './dlg/GetTotoToken';
import { VerifyToken } from './dlg/VerifyToken';

const config: TotoMicroserviceConfiguration = {
    serviceName: "toto-ms-auth",
    basePath: '/auth',
    environment: {
        hyperscaler: process.env.HYPERSCALER as SupportedHyperscalers || "gcp",
        hyperscalerConfiguration: getHyperscalerConfiguration()
    },
    customConfiguration: ControllerConfig,
    apiConfiguration: {
        apiEndpoints: [
            { method: 'GET', path: '/token', delegate: GetTotoToken },
            { method: 'POST', path: '/verify', delegate: VerifyToken },
            // TEMPORARY - legacy paths without base path, kept until all consumers use the /auth base path. Remove after the cutover (see issue #2, step 10).
            { method: 'GET', path: '/token', delegate: GetTotoToken, options: { ignoreBasePath: true } },
            { method: 'POST', path: '/verify', delegate: VerifyToken, options: { ignoreBasePath: true } },
        ],
    },
};

TotoMicroservice.init(config).then(microservice => {
    microservice.start();
});

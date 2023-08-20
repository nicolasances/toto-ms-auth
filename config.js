// Imports the Secret Manager library
const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');
const { MongoClient, ServerApiVersion } = require('mongodb');

// Instantiates a client
const client = new SecretManagerServiceClient();

exports.dbName = 'awsinc';
exports.collections = {
    giftcards: 'giftcards',
};

class Config {

    load() {

        console.log("Loading configuration...");

        return new Promise((success, failure) => {

            let promises = [];

            promises.push(client.accessSecretVersion({ name: 'projects/' + process.env.GCP_PID + '/secrets/client-id-google-toto-money-ios/versions/latest' }).then(([version]) => {

                this.googleAuthorizedClientIDs.totoMoneyiOS = version.payload.data.toString();

            }));

            promises.push(client.accessSecretVersion({ name: 'projects/' + process.env.GCP_PID + '/secrets/client-id-google-toto-money-web/versions/latest' }).then(([version]) => {

                this.googleAuthorizedClientIDs.totoMoneyWeb = version.payload.data.toString();

            }));

            promises.push(client.accessSecretVersion({ name: 'projects/' + process.env.GCP_PID + '/secrets/jwt-signing-key/versions/latest' }).then(([version]) => {

                this.jwtSigningKey = version.payload.data.toString();

            }));

            Promise.all(promises).then(success, failure);

        })
    }

    getProps() {
        return {
            noCorrelationId: false,
            noAuth: true
        }
    }

    setJWTSigningKey(key) { this.jwtSigningKey = key }
    getJWTSigningKey() { return this.jwtSigningKey }

    setAuthorizedClientIDs(googleAuthorizedClientIDs) {
        this.googleAuthorizedClientIDs = googleAuthorizedClientIDs;
    }

    getAuthorizedClientIDs() {
        return {
            "google": this.googleAuthorizedClientIDs,
        }
    }

}

exports.config = new Config();
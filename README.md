# Toto Auth service
This service is responsible for manaing the authentication in Toto.

## Endpoints
It comes with two endpoints: 
 * `GET /token`: exchanges a Google Id Token for a Toto Token
 * `POST /verify`: verifies the Toto Token

## Installation
### GCP Configuration
1. Create a GCP Service Account.<br>
This account must have the following roles: 
    * `roles/secretmanager.secretAccessor`

### Github secrets
Github must contain two environments: 
 * `dev`
 * `prod`

Secrets are configured for each environment.

Github must contain the following secrets:
| Secret                    | Desc |  
| ------------------------- | ---- |
| `GCP_PID`                 | The id of the GCP project | 
| `MICROSERVICE_ACCOUNT`    | The email of the GCP Service Account that has been created and associated with this service | 
| `SERVICE_ACCOUNT`         | The content of the json file containing the CI-CD service account information. That can be extracted from GCP, under Service Accounts, by creating and downloading a key |

### GCP Secrets
The service needs the following secrets to be configured in GCP (in Secret Manager). 
| Secret                            | Desc | 
| --------------------------------- | ---- |
| `client-id-google-toto-money-web` | Client ID for the webapp |
| `client-id-google-toto-money-ios` | Client ID for the app (not used anymore) | 
| `jwt-signing-key`                 | Key used to sign Toto JWT tokens |
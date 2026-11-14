# Toto Auth service
This service manages authentication in Toto:
 * it exchanges a **Google ID token** for a **Toto token** (a JWT signed by Toto, valid for 3 months)
 * it **verifies** Toto tokens

It is a TypeScript microservice built on the [`totoms`](https://www.npmjs.com/package/totoms) SDK ([source](https://github.com/nicolasances/toto-microservice-sdk/tree/main/node)), following the [Toto NodeJS template](https://github.com/nicolasances/toto-node-template). It runs on GCP Cloud Run.

## Documentation
 * [API Endpoints](./docs/interfaces/api-endpoints.md)
 * [Coding conventions](./AGENTS.md)

## Development
```bash
npm install
npm test        # unit tests (Mocha)
npm run dev     # run locally with nodemon + ts-node
npm run build   # compile to ./build
npm run start   # run the compiled service (port 8080)
```

To run locally against a GCP project, use gcloud Application Default Credentials and set:

| Env var | Desc |
| ------- | ---- |
| `HYPERSCALER` | `gcp` (default for this service) |
| `GCP_PID` | The id of the GCP project to read the secrets from |

## Installation

### GCP Secrets
The service reads these secrets from GCP Secret Manager at startup. Startup fails if one is missing.

| Secret | Desc |
| ------ | ---- |
| `jwt-signing-key` | Key used to sign and verify Toto tokens |
| `client-id-google-toto-money-web` | Google client ID of the web clients. Default audience for Google ID tokens |
| `client-id-google-toto-money-ios` | Google client ID of the iOS app (not used anymore) |
| `mongo-host` | Standard Toto secret, loaded by `totoms` (not used: no database) |
| `toto-expected-audience` | Standard Toto secret, loaded by `totoms` |
| `toto-registry-endpoint` | Standard Toto secret, loaded by `totoms` |

The service account of the service needs `roles/secretmanager.secretAccessor`.

### Infrastructure and CI/CD
The infrastructure is defined in [`toto-terra`](https://github.com/nicolasances/toto-terra) (`toto-ms-auth.tf`): service account, Artifact Registry repository `toto-ms-auth`, GitHub environments and their variables and secrets.

The GitHub Actions workflows build the Docker image, push it to Artifact Registry (`europe-west1-docker.pkg.dev/<GCP_PID>/toto-ms-auth/toto-ms-auth:<package.json version>`) and deploy it to Cloud Run:

| Workflow | Branches | GitHub environment |
| -------- | -------- | ------------------ |
| `release-dev.yml` | `main`, `feature/**` | `totoexperiments` |
| `release-prod.yml` | `release/**` | `totolive` |

Each GitHub environment needs:

| Name | Type | Desc |
| ---- | ---- | ---- |
| `GCP_PID` | variable | The id of the GCP project |
| `CICD_SERVICE_ACCOUNT` | secret | JSON key of the CI/CD service account (push to Artifact Registry, deploy to Cloud Run) |
| `SERVICE_ACCOUNT` | secret | Email of the service account the Cloud Run service runs as |

**Bump the `version` in `package.json`** for every release: it is the image tag.

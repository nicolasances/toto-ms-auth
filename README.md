# Toto Auth service
This service manages authentication in Toto:
 * it exchanges a **Google ID token** for a **Toto token** (a JWT signed by Toto, valid for 3 months)
 * it **verifies** Toto tokens

It is a TypeScript microservice built on the [`totoms`](https://www.npmjs.com/package/totoms) SDK ([source](https://github.com/nicolasances/toto-microservice-sdk/tree/main/node)), following the [Toto NodeJS template](https://github.com/nicolasances/toto-node-template). It runs on GCP Cloud Run and on GKE.

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

The GitHub Actions workflows build the Docker image, push it to Artifact Registry (`europe-west1-docker.pkg.dev/<GCP_PID>/toto-ms-auth/toto-ms-auth:<tag>`) and deploy it to both **Cloud Run** and **GKE**:

| Workflow | Branches | GitHub environment | GKE namespace | Image tag |
| -------- | -------- | ------------------ | ------------- | --------- |
| `release-dev.yml` | `feature/**` | `totoexperiments` | `dev` | `<package.json version>-<short sha>` |
| `release-prod.yml` | `main` | `totolive` | `prod` | `<package.json version>` |

`main` deploys to prod only, not to dev.

On GKE, [`toto-terra-gke`](https://github.com/nicolasances/toto-terra-gke) (Terraform) owns the shape of the Deployment `toto-ms-auth`, and CI owns which image runs: the workflow runs `kubectl set image` and waits for `kubectl rollout status` (5 minutes). The job fails if the rollout doesn't complete. There is no automatic rollback: push a fix or run `kubectl rollout undo`.

**Version bump:** dev tags include the commit sha, so feature branches need no bump. The prod tag is the bare version, so **every merge to `main` needs a bump of the `version` in `package.json`**. The prod workflow fails before building if that tag already exists in Artifact Registry. Re-running the dev workflow for the same commit skips the build and push and redeploys the existing image.

Each GitHub environment needs:

| Name | Type | Desc |
| ---- | ---- | ---- |
| `GCP_PID` | variable | The id of the GCP project |
| `GKE_PROJECT_ID` | variable | The id of the GCP project hosting the GKE cluster |
| `GKE_CLUSTER_NAME` | variable | Name of the GKE cluster |
| `GKE_CLUSTER_LOCATION` | variable | Location (region or zone) of the GKE cluster |
| `GKE_NAMESPACE` | variable | Namespace of the Deployment (`dev` or `prod`) |
| `CICD_SERVICE_ACCOUNT` | secret | JSON key of the CI/CD service account (push to Artifact Registry, deploy to Cloud Run and to its own GKE namespace) |
| `SERVICE_ACCOUNT` | secret | Email of the service account the Cloud Run service runs as |

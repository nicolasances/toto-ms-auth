# API Endpoints

- [Tokens](#tokens)
    - [GET /auth/token](#get-authtoken)
    - [POST /auth/verify](#post-authverify)
- [Health](#health)

All endpoints are served under the base path `/auth`.

> **Transition:** `GET /token` and `POST /verify` (without base path) are still served, with the same behaviour, until all consumers have moved to `/auth` (see [#2](https://github.com/nicolasances/toto-ms-auth/issues/2), step 10). They will be removed afterwards.

No Toto authorization is required on these endpoints: the token to exchange or verify is passed in the `Authorization` header and handled by the endpoint itself.

## Tokens
| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| `GET` | `/auth/token` | Exchanges a Google ID token for a Toto token |
| `POST` | `/auth/verify` | Verifies a Toto token and returns its claims |

### GET /auth/token
**Used for:** logging in to Toto apps. A client that signed the user in with Google exchanges the Google ID token for a Toto token (JWT, valid for 3 months), and uses the Toto token to call Toto microservices.

**Request:**
| Header | Required | Description |
| ------ | -------- | ----------- |
| `Authorization` | yes | `Bearer <Google ID token>` |
| `x-client` | no | The calling client: `totoMoneyWeb` or `totoMoneyiOS`. Determines the Google client ID (audience) the token is verified against. Defaults to the web client. |

**Response:** `200` with `{ "token": "<Toto token>" }`.

The Toto token is signed with the `jwt-signing-key` secret (HS256) and contains `{ user: <email>, authProvider: "toto", exp, iat }`.

**Known issues** (see [#3](https://github.com/nicolasances/toto-ms-auth/issues/3)):
- an invalid Google token returns `200` with `{ "token": { "cid", "success": false, "message" } }`
- a missing `Authorization` header returns `500` `{ "code": 500, "message": "Unexpected error" }`

**Request & Response:** [`src/dlg/GetTotoToken.ts`](../../src/dlg/GetTotoToken.ts) (`GetTotoTokenRequest`, `GetTotoTokenResponse`)

### POST /auth/verify
**Used for:** checking a Toto token. Called by Toto microservices (custom auth verifier, endpoint from the `toto-auth-endpoint` secret) and by the Toto frontends.

**Request:**
| Header | Required | Description |
| ------ | -------- | ----------- |
| `Authorization` | yes | `Bearer <Toto token>` |

**Response:** `200` with `{ "valid": true, "email", "user", "authProvider", "exp", "iat" }`.

**Known issues** (see [#3](https://github.com/nicolasances/toto-ms-auth/issues/3)): an invalid or expired token, or a missing header, returns `500` with the verification error (e.g. `{ "name": "TokenExpiredError", "message": "jwt expired", ... }`) instead of `{ "valid": false }`.

**Request & Response:** [`src/dlg/VerifyToken.ts`](../../src/dlg/VerifyToken.ts) (`VerifyTokenRequest`, `VerifyTokenResponse`)

## Health
Provided by `totoms`.

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| `GET` | `/health` | Health check: `{ "api": "toto-ms-auth", "status": "running" }` |
| `GET` | `/auth/` | Same as `/health`, under the base path |
| `GET` | `/` | Same as `/health` |

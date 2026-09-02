# CyberProof Chain Deployment

CyberProof Chain is a React/Vite SPA with an Express API. The current backend keeps demo data in memory, uses a simulated local ledger, and hashes uploaded content in memory. It does not connect to `DATABASE_URL`, `BLOCKCHAIN_RPC_URL`, or cloud object storage yet.

## A. Install and build

```bash
npm install
npm run typecheck
npm run lint
npm run build
```

Deploy the generated `dist/` directory as the frontend static artifact.

## B. Deploy the backend

Deploy the repository as a Node service on Render, Railway, Fly.io, or a similar platform.

- Build command: `npm install`
- Start command: `npm start`
- Health check: `/api/health`
- The service listens on `0.0.0.0` and uses the platform-provided `PORT`.

## C. Backend environment variables

Set these in the backend service. Do not commit `.env` or paste secrets into frontend variables.

```text
PORT=<platform-provided-port-or-3001>
FRONTEND_URL=https://YOUR-FRONTEND-DOMAIN
JWT_SECRET=<long-random-secret>
ADMIN_PASSWORD=<strong-admin-password>
SESSION_SECRET=<long-random-secret>
DATABASE_URL=<optional-future-database-url>
GEMINI_API_KEY=<optional>
OPENAI_API_KEY=<optional>
BLOCKCHAIN_RPC_URL=<optional-future-rpc-url>
PRIVATE_KEY=<optional-future-server-only-key>
```

`FRONTEND_URL` may contain a comma-separated list of explicitly allowed origins. For local development use `http://localhost:5173`.

## D. Get the backend URL

After deployment, record the public HTTPS URL, for example:

```text
https://cyberproof-chain-api.example.com
```

## E. Set the frontend API URL

Configure the frontend build environment before building:

```text
VITE_API_URL=https://cyberproof-chain-api.example.com
```

`VITE_` variables are public build-time values. Never put API keys, private keys, JWT secrets, or database credentials in them.

## F. Build the frontend

```bash
npm run build
```

The API utility uses `VITE_API_URL` for every request. When it is empty locally, requests stay on `/api` and use the Vite proxy to `http://localhost:3001`.

## G. Deploy the frontend

Publish `dist/` with your static hosting provider. Configure the provider to rewrite every non-file route to `/index.html`, preserving `/api` only when the frontend and backend share a host. For example:

- Netlify: add `/* /index.html 200` to `dist/_redirects`.
- Vercel: add a rewrite from `/(.*)` to `/index.html` in `vercel.json`.
- Nginx: use `try_files $uri $uri/ /index.html`.

This is required for refreshes on `/dashboard`, `/investigations`, `/evidence`, `/forensics`, `/blockchain`, `/custody`, `/threat-intelligence`, `/alerts`, `/admin`, `/verification`, and `/reports`.

## H. Configure CORS

Set the exact deployed frontend origin in the backend's `FRONTEND_URL`, including scheme and port when applicable. Do not use `*` with credentials.

## I. Test the API

```bash
curl https://YOUR-BACKEND-DOMAIN/api/health
curl https://YOUR-BACKEND-DOMAIN/api/demo
```

Health should return:

```json
{"status":"ok","service":"cyberproof-chain-api"}
```

## J. Test the complete application

Open the deployed frontend, refresh each SPA route, log in, load the dashboard, inspect evidence and alerts, run the verification demo, and confirm browser requests target the backend HTTPS URL.

## Current limitations

- Demo users and all application data are in memory and reset when the backend restarts.
- Evidence upload hashes request content but does not persist files to durable storage.
- The blockchain ledger is explicitly simulated; it is not a public-chain transaction.
- `DATABASE_URL`, AI keys, RPC URL, and private key are reserved for future server-side integrations and are not read by the current demo implementation.

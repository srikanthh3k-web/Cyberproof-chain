# CYBERPROOF CHAIN

AI-Powered Digital Evidence Integrity & Blockchain Chain-of-Custody Platform

## Overview

CYBERPROOF CHAIN is a working, demo-ready cybersecurity investigation platform designed to demonstrate how blockchain-inspired immutable evidence records, SHA-256 hashing, AI forensic analysis, and chain-of-custody tracking can strengthen digital evidence integrity during cybercrime investigations.

The project is intentionally structured as a prototype that can be extended to a real backend, database, deployed smart contracts, and external AI services. It includes working demo logic, live workflow actions, and realistic simulated blockchain data for SIH-style presentations.

## Problem Statement

Digital evidence can be manipulated, replaced, or mishandled during collection, transfer, and analysis. Without tamper-evident controls, investigators struggle to show authenticity, custody continuity, and independent verification.

## Solution

CYBERPROOF CHAIN provides:

- evidence upload and validation
- SHA-256 fingerprint generation
- evidence verification with hash comparison
- blockchain-style immutable ledger entries
- AI-assisted forensic classification and reasoning
- chain-of-custody tracking
- tampering detection workflow
- role-based access for investigators and auditors
- forensic report generation
- SIH demo mode for presentations

## Architecture

Frontend:
- React + TypeScript + Vite
- Tailwind CSS
- Framer Motion
- Recharts

Backend:
- Express.js REST API
- Local simulation for authentication and proof-of-concept workflows

Blockchain:
- Solidity-ready evidence registry contract in blockchain/contracts/EvidenceRegistry.sol
- Local demo network labeling for safe demonstration

Security:
- SHA-256 hashing
- simulated evidence verification
- role-based access patterns
- environment variables for external integration

## Features

- premium SOC dashboard
- interactive navigation and pages
- evidence vault with upload workflow
- investigation management
- AI forensics dashboard
- blockchain explorer
- threat intelligence search
- chain-of-custody timeline
- verification portal
- alerts and notifications
- admin panel
- SIH demo mode
- responsive enterprise design

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Express
- Node.js
- Recharts
- Framer Motion
- Solidity
- SHA-256 cryptography

## Folder Structure

- src/
  - components
  - pages
  - data
  - lib
  - App.tsx
  - main.tsx
  - styles.css
  - types.ts
- backend/
  - server.js
  - services/
  - data/
- blockchain/
  - contracts/

## Environment Variables

Create a .env file based on .env.example:

PORT=3001
CLIENT_URL=http://localhost:5173
GEMINI_API_KEY=
OPENAI_API_KEY=
BLOCKCHAIN_RPC_URL=
PRIVATE_KEY=
DATABASE_URL=postgresql://localhost:5432/cyberproof_chain
SESSION_SECRET=change_me_in_production

## Initial Admin Credential

The application seeds an initial admin account on the backend using a secure password hash.

- Email: admin@cyberproof.local
- Password: Aurexa@Admin#2026

This is a local development credential only. Do not expose it in frontend UI or public documentation beyond the secured backend configuration file.

Additional local demo accounts for the prototype:

- investigator@cyberproof.local / investigator123
- analyst@cyberproof.local / analyst123
- auditor@cyberproof.local / auditor123
- viewer@cyberproof.local / viewer123

## Installation

1. Clone the repository
2. Install dependencies:

npm install

3. Start the frontend and backend together:

npm run dev

4. Or run separately:

npm run server
npm run frontend

## Running the Backend

npm run server

## Running the Frontend

npm run frontend

## Running the Blockchain Simulation

This prototype uses a local demonstration architecture instead of a live network. The Solidity contract is included in:

blockchain/contracts/EvidenceRegistry.sol

It is designed for future deployment to a compatible EVM environment.

## API Endpoints

- POST /api/auth/login
- GET /api/dashboard
- GET /api/investigations
- POST /api/investigations
- GET /api/evidence
- POST /api/evidence/upload
- GET /api/evidence/:id
- POST /api/evidence/:id/verify
- GET /api/evidence/:id/custody
- POST /api/evidence/:id/transfer
- GET /api/blockchain/blocks
- GET /api/blockchain/transactions
- POST /api/forensics/analyze
- GET /api/threat-intelligence/:indicator
- POST /api/reports/generate
- GET /api/audit-logs
- GET /api/alerts
- GET /api/verification/:identifier

## Demo Mode

The application includes a Run Live Demonstration flow in the backend demo endpoint and SIH presentation flow in the landing system. It demonstrates:

1. evidence upload
2. hash generation
3. AI analysis
4. blockchain registration
5. verification
6. tampering simulation
7. tampering detection

## Future Improvements

- real PostgreSQL or MongoDB persistence
- secure JWT sessions and refresh tokens
- actual blockchain network deployment
- OpenAI/Gemini AI integration
- smart contract deployment automation with Hardhat
- PDF generation for forensic reports
- zero-knowledge style privacy-preserving verification
- enterprise SSO and RBAC integration

## Security Notes

This is a prototype and local-demo environment. It clearly labels non-production architecture and keeps actual secret material in environment variables. Do not use the demo credentials in a production deployment.

## License

Prototype project for SIH demonstration.

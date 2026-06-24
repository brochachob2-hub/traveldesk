# TravelDesk

Multi-tenant travel SaaS for Philippine travel businesses. Each organization gets a branded, installable storefront and an operations dashboard connected to one backend.

## Current foundation

- Next.js installable PWA with marketing, tenant storefront, and dashboard shells
- NestJS API with strict request validation and CORS configuration
- PostgreSQL/Prisma multi-tenant data model
- Public tenant catalog endpoint
- Capacity-safe tour reservation endpoint using an atomic database update
- Provider-neutral flight search contract with clearly labeled mock inventory
- Rotating refresh-token sessions stored as hashes in HttpOnly cookies
- Organization onboarding with owner membership and tenant-scoped authorization
- Operator tour/departure CRUD API and working PWA forms
- Private booking access tokens, idempotent payment initialization, and provider-neutral checkout
- Scheduled cancellation of expired unpaid bookings with automatic seat release
- Monorepo builds and focused backend unit tests

## Run locally

Requirements: Node.js 22+, npm 11+, Docker.

1. Copy `.env.example` to `.env` and `.env.local` as appropriate.
2. Start PostgreSQL: `docker compose up -d postgres`
3. Install packages: `npm install`
4. Create the database: `npm run db:migrate`
5. Start the apps: `npm run dev`

Web: `http://localhost:3000`  
API: `http://localhost:4000/api`  
Demo storefront: `http://localhost:3000/demo-travel`

For local subdomain testing, set `NEXT_PUBLIC_ROOT_DOMAIN=localhost:3000` and open `http://demo-travel.localhost:3000`.

## API foundation

- `GET /api/health`
- `GET /api/public/organizations/:slug`
- `POST /api/public/bookings`
- `GET /api/public/flights/search?origin=MNL&destination=CEB&departureDate=2030-07-18&adults=1`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `GET|POST /api/operator/organizations`
- `GET|POST /api/operator/organizations/:organizationId/products`
- `POST /api/public/bookings/:reference/payments/checkout`

The flight endpoint is test-only until a supplier contract is approved and credentials are configured. It must never be presented as live inventory.

## Required next work

1. Email verification, password reset, MFA, and transactional email
2. Approved live payment provider, signed webhooks, refunds, and reconciliation
3. Approved flight supplier adapter and webhook handling
4. Booking changes, cancellations, audit logs, and notifications
5. Staff invitations, granular permissions, and super-admin approval
6. Philippine privacy, DOT accreditation, support, and settlement workflows

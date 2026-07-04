# Le Piaje

Le Piaje is an Italian agriturismo website for Montefiascone / Lake Bolsena (Tuscia). It offers direct booking for two properties, a farm shop, bilingual marketing (EN/IT), and an admin panel.

## Tech Stack

- **Next.js 15** (App Router) + React 19 + TypeScript
- **MongoDB** + Mongoose
- **Stripe** (bookings + shop)
- **Resend** (transactional email)
- **next-intl** (English / Italian)
- **Tailwind CSS** + shadcn/ui
- **MapLibre GL** + OpenFreeMap (`/tuscia` and property maps; no API key)

## Getting Started

```bash
pnpm install
cp .env.example .env.local
pnpm run db:up              # start MongoDB (Docker Desktop must be running)
pnpm run seed               # seed MongoDB (dev only)
pnpm run dev
```

MongoDB must be running before `pnpm run seed`. The easiest local setup is Docker:

```bash
pnpm run db:up
```

If you prefer Homebrew instead: `brew install mongodb-community@7` then `brew services start mongodb-community@7`.

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm run dev` | Start development server |
| `pnpm run build` | Production build |
| `pnpm run start` | Start production server |
| `pnpm run db:up` | Start local MongoDB via Docker Compose |
| `pnpm run db:down` | Stop local MongoDB container |
| `pnpm run seed` | Seed properties, rooms, beds, products |
| `pnpm run lint` | ESLint |
| `pnpm run test` | All Vitest tests (unit + mocked + MongoDB memory-server) |
| `pnpm run test:unit` | Unit and mocked integration tests only |
| `pnpm run test:integration` | MongoDB memory-server integration tests |
| `pnpm run test:e2e` | Playwright E2E smoke tests (optional locally) |

## Third-party integrations

Each integration below lists what Le Piaje uses it for, what is **not** in scope, required env vars, and the test file that covers it.

### Integration scope

| Integration | Scope in Le Piaje | Env vars | Not in scope | Tests |
|-------------|-------------------|----------|--------------|-------|
| **MongoDB** | Properties, rooms, beds, bookings, payments, purchases, contact forms, error logs | `DB_CONNECTION_STRING` | Analytics, backups, replication (ops) | `src/lib/booking/*.integration.test.ts` |
| **Stripe** | PaymentIntent for direct bookings and farm shop; webhook confirms orders and assigns beds | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Subscriptions, invoicing, Connect | `src/lib/payments/handleStripeWebhook.test.ts` |
| **Resend** | Admin booking/purchase alerts and guest confirmation emails via React Email templates | `RESEND_API_KEY`, `NEXT_PUBLIC_SENDER_EMAIL`, `ADMIN_EMAIL_ONE_RECEIVER` | Marketing campaigns, mailing lists | `src/lib/email/sendBookingEmails.test.ts` |
| **MapLibre / OpenFreeMap** | Client-side interactive maps on `/tuscia` (regional POIs) and property location maps | None (free tiles) | Geocoding, directions API, server-side tiles | `src/lib/integrations/maps.test.ts` |
| **WhatsApp** | Floating `wa.me` chat link on all pages (no API) | `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp Business API, automated templates | `src/lib/integrations/whatsapp.test.ts` |
| **Admin auth (JWT)** | Signed session cookie after env credential login; protects `/admin/auth/*` | `USERNAME`, `USER_PASSWORD`, `AUTH_SECRET` | Multi-user accounts, OAuth, RBAC | `src/lib/auth/session.test.ts` |

## Testing

Tests run in CI **without live third-party credentials**. External SDKs (Stripe, Resend) are mocked; MongoDB uses an in-memory server.

```
pnpm run test              # full suite (CI)
pnpm run test:unit         # fast unit + mocked tests
pnpm run test:integration  # MongoDB memory-server only
pnpm run test:e2e          # Playwright smoke (needs dev server)
```

| Layer | What it covers |
|-------|----------------|
| Unit | Pricing, availability logic, WhatsApp URL builder, map config, JWT session |
| Mocked integration | Stripe webhook handler, Resend email dispatch |
| MongoDB integration | Booking lifecycle, bed assignment, availability data shape |

## Architecture

```
Guest booking flow:
  Select dates → POST /api/payment (pending booking + PaymentIntent)
  → Stripe checkout → Webhook confirms booking + assigns beds + emails

Admin:
  /admin — login
  /admin/auth — block dates, view bookings/orders

Shop:
  /shop → POST /api/purchase/payment → Stripe → Webhook saves Purchase
```

Availability is served by `GET /api/availability?propertyId=`.

## Deployment

Designed for **Vercel**. Configure Stripe webhook to `https://your-domain/api/webhook`.

## Properties

- **La Villa Perlata** — whole-property countryside villa (`/property/villa-perlata`)
- **Al Centesimo Chilometro** — pilgrim hostel with gender-segregated dorms (`/property/centesimo-chilometro`)

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
| **Stripe** | PaymentIntent for direct bookings and farm shop; webhook confirms orders and assigns beds | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Subscriptions, invoicing, Connect | `src/lib/payments/*.test.ts`, `src/app/api/payment/route.test.ts`, `src/app/api/purchase/payment/route.test.ts`, `src/app/api/webhook/route.test.ts` |
| **Resend** | Admin booking/purchase alerts and guest confirmation emails via React Email templates | `RESEND_API_KEY`, `NEXT_PUBLIC_SENDER_EMAIL`, `ADMIN_EMAIL_ONE_RECEIVER` | Marketing campaigns, mailing lists | `src/lib/email/sendBookingEmails.test.ts` |
| **MapLibre / OpenFreeMap** | Client-side interactive maps on `/tuscia` (regional POIs) and property location maps | None (free tiles) | Geocoding, directions API, server-side tiles | `src/lib/integrations/maps.test.ts` |
| **WhatsApp** | Floating `wa.me` chat link on all pages (no API) | `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp Business API, automated templates | `src/lib/integrations/whatsapp.test.ts` |
| **Admin auth (JWT)** | Signed session cookie after env credential login; protects `/admin/auth/*` | `USERNAME`, `USER_PASSWORD`, `AUTH_SECRET` | Multi-user accounts, OAuth, RBAC | `src/lib/auth/session.test.ts` |
| **Calendar sync (iCal)** | Import Airbnb/Booking.com `.ics` feeds into bed occupancy; export Le Piaje blocks for OTAs | `CRON_SECRET`, `NEXT_PUBLIC_BASE_URL` | Real-time OTA APIs, channel managers | `src/lib/calendar/*.test.ts` |

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
| Unit | Pricing, availability logic, WhatsApp URL builder, map config, JWT session, Stripe PaymentIntent creation |
| Mocked integration | Stripe webhook handler + API routes, Resend email dispatch |
| MongoDB integration | Booking lifecycle, bed assignment, webhook confirmation path, availability data shape |

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

## Calendar sync (Airbnb + Booking.com)

Le Piaje acts as the **iCal sync hub** to reduce overbooking across the webapp, Airbnb, and Booking.com.

1. In **Admin → property page**, paste each OTA **import URL** (`.ics` from Airbnb/Booking.com extranet).
2. Copy the Le Piaje **export URL** into each OTA’s calendar import settings.
3. Le Piaje polls import feeds **once per day** via Vercel cron (`vercel.json` → `GET /api/cron/sync-calendars`). Use **Sync now** in admin for immediate updates.

| Direction | Endpoint |
|-----------|----------|
| Export (OTAs pull) | `GET /api/calendar/{propertyId}/export?token=...` |
| Import (Le Piaje polls) | Configured import URLs in admin |
| Manual sync | Admin **Sync now** or cron route |

**Env vars**

| Variable | Purpose |
|----------|---------|
| `CRON_SECRET` | Bearer token for `/api/cron/sync-calendars` |
| `NEXT_PUBLIC_BASE_URL` | Used to build export URLs shown in admin |

**Vercel cron limits:** [Hobby plans](https://vercel.com/docs/cron-jobs/usage-and-pricing) allow at most **one run per day** (`0 6 * * *` in `vercel.json` = daily at 06:00 UTC, ±59 min). Expressions like `*/15 * * * *` fail Hobby deployment. On **Pro**, you can change `vercel.json` to `*/15 * * * *` for 15-minute polling.

**Setup guides:** [Airbnb calendar sync](https://www.airbnb.com/help/article/99) · [Booking.com sync calendars](https://partner.booking.com/en-gb/help/rates-availability/extranet-calendar/how-synchronise-your-calendars-across-channels)

**Limitations:** OTA platforms refresh imported calendars on their own schedule (often 2–4 hours). Centesimo OTA bookings block all beds for the date range (whole-property iCal). Pending webapp checkouts do not block OTAs until payment confirms.

## Stripe payments

Le Piaje uses **Stripe PaymentIntents** for direct property bookings and farm shop orders. Fulfillment happens via webhook — the success page is informational only.

### Production setup

1. In the [Stripe Dashboard](https://dashboard.stripe.com/) (test or live mode), create a webhook endpoint:
   - **URL:** `{NEXT_PUBLIC_BASE_URL}/api/webhook` (e.g. `https://your-domain.com/api/webhook`)
   - **Events:** `payment_intent.succeeded`, `payment_intent.payment_failed`
2. Copy the endpoint **signing secret** (`whsec_...`) into `STRIPE_WEBHOOK_SECRET`.
   - This is the webhook signing secret for that endpoint — **not** your `STRIPE_SECRET_KEY`.
3. Set `STRIPE_SECRET_KEY` (`sk_test_...` or `sk_live_...`) and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (`pk_test_...` or `pk_live_...`).

Test cards and flows: [Stripe testing docs](https://docs.stripe.com/testing).

### Local development

Use the [Stripe CLI](https://docs.stripe.com/stripe-cli) to forward webhooks to your dev server (no live charges):

```bash
stripe listen --forward-to localhost:3000/api/webhook
```

Copy the `whsec_...` signing secret printed by the CLI into `.env.local` as `STRIPE_WEBHOOK_SECRET`. Use Stripe test cards (e.g. `4242 4242 4242 4242`) when checking out.

All Vitest tests mock the Stripe SDK via `src/__tests__/mocks/stripe.ts` — no live Stripe API calls in CI.

**Env vars**

| Variable | Purpose |
|----------|---------|
| `STRIPE_SECRET_KEY` | Server-side PaymentIntent creation (`sk_test_...` in dev) |
| `STRIPE_WEBHOOK_SECRET` | Webhook signing secret from Dashboard or `stripe listen` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Client-side Stripe.js (`pk_test_...`) |

## Deployment

Designed for **Vercel**. Configure the Stripe webhook to `{NEXT_PUBLIC_BASE_URL}/api/webhook` and subscribe to `payment_intent.succeeded` and `payment_intent.payment_failed`.

## Properties

- **La Villa Perlata** — whole-property countryside villa (`/property/villa-perlata`)
- **Al Centesimo Chilometro** — pilgrim hostel with gender-segregated dorms (`/property/centesimo-chilometro`)

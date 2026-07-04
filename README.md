# Le Piaje

Le Piaje is an Italian agriturismo website for Montefiascone / Lake Bolsena (Tuscia). It offers direct booking for two properties, a farm shop, bilingual marketing (EN/IT), and an admin panel.

## Tech Stack

- **Next.js 15** (App Router) + React 19 + TypeScript
- **MongoDB** + Mongoose
- **Stripe** (bookings + shop)
- **Resend** (transactional email)
- **next-intl** (English / Italian)
- **Tailwind CSS** + shadcn/ui
- **Mapbox** (reach-us and property maps)

## Getting Started

```bash
npm install
cp .env.example .env.local
npm run seed                # seed MongoDB (dev only)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run seed` | Seed properties, rooms, beds, products |
| `npm run lint` | ESLint |
| `npm run test` | All Vitest tests (unit + mocked + MongoDB memory-server) |
| `npm run test:unit` | Unit and mocked integration tests only |
| `npm run test:integration` | MongoDB memory-server integration tests |
| `npm run test:e2e` | Playwright E2E smoke tests (optional locally) |

## Third-party integrations

Each integration below lists what Le Piaje uses it for, what is **not** in scope, required env vars, and the test file that covers it.

### App config (not a third party)

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_BASE_URL` | Base URL for client-side API fetches (trailing slash required) |

### Integration scope

| Integration | Scope in Le Piaje | Env vars | Not in scope | Tests |
|-------------|-------------------|----------|--------------|-------|
| **MongoDB** | Properties, rooms, beds, bookings, payments, purchases, contact forms, error logs | `DB_CONNECTION_STRING` | Analytics, backups, replication (ops) | `src/lib/booking/*.integration.test.ts` |
| **Stripe** | PaymentIntent for direct bookings and farm shop; webhook confirms orders and assigns beds | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Subscriptions, invoicing, Connect | `src/lib/payments/handleStripeWebhook.test.ts` |
| **Resend** | Admin booking/purchase alerts and guest confirmation emails via React Email templates | `RESEND_API_KEY`, `NEXT_PUBLIC_SENDER_EMAIL`, `ADMIN_EMAIL_ONE_RECEIVER`, `ADMIN_EMAIL_TWO_RECEIVER` | Marketing campaigns, mailing lists | `src/lib/email/sendBookingEmails.test.ts` |
| **Mapbox** | Client-side interactive maps on `/reach-us` (regional POIs) and property location maps | `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` | Geocoding, directions API, server-side tiles | `src/lib/integrations/mapbox.test.ts` |
| **WhatsApp** | Floating `wa.me` chat link on all pages (no API) | `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp Business API, automated templates | `src/lib/integrations/whatsapp.test.ts` |
| **Admin auth (JWT)** | Signed session cookie after env credential login; protects `/admin/auth/*` | `USERNAME`, `USER_PASSWORD`, `AUTH_SECRET` | Multi-user accounts, OAuth, RBAC | `src/lib/auth/session.test.ts` |

## Testing

Tests run in CI **without live third-party credentials**. External SDKs (Stripe, Resend) are mocked; MongoDB uses an in-memory server.

```
npm run test              # full suite (CI)
npm run test:unit         # fast unit + mocked tests
npm run test:integration  # MongoDB memory-server only
npm run test:e2e          # Playwright smoke (needs dev server)
```

| Layer | What it covers |
|-------|----------------|
| Unit | Pricing, availability logic, WhatsApp URL builder, Mapbox token guard, JWT session |
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

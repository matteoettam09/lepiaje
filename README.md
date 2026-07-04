# Le Piaje

Le Piaje is an Italian agriturismo website for Montefiascone / Lake Bolsena (Tuscia). It offers direct booking for two properties, a farm shop, bilingual marketing (EN/IT), and an admin panel.

## Tech Stack

- **Next.js 15** (App Router) + React 19 + TypeScript
- **MongoDB** + Mongoose
- **Stripe** (bookings + shop)
- **Resend** (transactional email)
- **next-intl** (English / Italian)
- **Tailwind CSS** + shadcn/ui
- **Mapbox** (reach-us map)

## Getting Started

```bash
npm install
cp .env.example .env.local  # create and fill in env vars
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
| `npm run test` | Vitest unit tests |
| `npm run test:e2e` | Playwright E2E tests |

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_BASE_URL` | Site URL (with trailing slash), e.g. `http://localhost:3000/` |
| `DB_CONNECTION_STRING` | MongoDB connection string |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `RESEND_API_KEY` | Resend API key |
| `NEXT_PUBLIC_SENDER_EMAIL` | From address for emails |
| `ADMIN_EMAIL_ONE_RECEIVER` | Admin notification email |
| `ADMIN_EMAIL_TWO_RECEIVER` | Secondary admin email (optional) |
| `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` | Mapbox token |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp contact number |
| `USERNAME` / `USER_PASSWORD` | Admin login credentials |
| `AUTH_SECRET` | JWT signing secret (optional; falls back to `USER_PASSWORD`) |

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

Availability is served by `GET /api/availability?propertyId=` (replaces external WebSocket).

## Deployment

Designed for **Vercel**. Configure Stripe webhook to `https://your-domain/api/webhook`.

## Properties

- **La Villa Perlata** — whole-property countryside villa (`/property/villa-perlata`)
- **Al Centesimo Chilometro** — pilgrim hostel with gender-segregated dorms (`/property/centesimo-chilometro`)

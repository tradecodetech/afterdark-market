# AfterDark Market

An adult-products marketplace/dropshipping storefront — think Temu, but
18+. Customers browse a multi-vendor catalog, checkout, and orders are
routed to the manufacturer/vendor who owns each item. Vendors can connect
a product feed via API or manage inventory manually; admins manage
vendors, categories, and moderation.

`AfterDark Market` is a placeholder brand name — rename it via
`NEXT_PUBLIC_SITE_NAME` in `.env` (and the `name` field in
`package.json`) once you've settled on real branding.

## Stack

- **Next.js 16** (App Router, Server Actions, TypeScript)
- **Prisma** + **SQLite** for local dev (see [Switching to Postgres](#switching-to-postgres))
- **Auth.js (NextAuth v5)**, credentials-based, with `CUSTOMER` / `VENDOR` / `ADMIN` roles
- **Tailwind CSS**
- A pluggable **payment provider** interface (mock processor included — see [Payments](#payments))
- A pluggable **vendor adapter** interface (API-feed adapter + manual/CSV entry — see [Vendor integrations](#vendor-integrations))

## Getting started

```bash
npm install
npx prisma migrate dev   # creates prisma/dev.db and applies the schema
npm run db:seed          # demo categories, vendors, products, and accounts
npm run dev
```

Open http://localhost:3000. You'll hit the 18+ age gate first (any
visitor, cookie-based, independent of login).

### Demo accounts

Seeded by `npm run db:seed`:

| Role                | Email                        | Password      |
| ------------------- | ----------------------------- | -------------- |
| Admin                | admin@afterdark.market        | Admin123!      |
| Customer             | customer@afterdark.market     | Customer123!   |
| Vendor (manual entry)| velvet@afterdark.market       | Vendor123!     |
| Vendor (API feed)    | pulse@afterdark.market        | Vendor123!     |

At checkout, use any card number except `4000000000000002` (that one
simulates a decline) — see [Payments](#payments).

## Core flows

- **Storefront**: `/`, `/products`, `/products/[slug]`, `/cart`, `/checkout` — age-gated, discreet-shipping messaging throughout.
- **Customer account**: `/account` — order history and fulfillment status per item.
- **Vendor dashboard** (`/vendor/*`, role `VENDOR`): manage products (manual form + CSV bulk import), view/fulfill assigned orders, trigger API feed syncs.
- **Admin dashboard** (`/admin/*`, role `ADMIN`): create/suspend vendors (including provisioning their login), manage categories, moderate products, view all orders and users.

Orders split into per-vendor `OrderItem`s at checkout, so a single
customer order can be fulfilled by several vendors independently, each
seeing only their own line items in their dashboard.

## Payments

Stripe and PayPal both prohibit adult products, so this ships with a
**pluggable payment-provider interface**
(`src/lib/payments/types.ts`) and a working **mock processor**
(`src/lib/payments/mock-provider.ts`) — checkout, orders, and refunds are
fully exercisable with zero external credentials.

To go live, implement `PaymentProvider` for a high-risk-friendly
processor (e.g. CCBill, Segpay, Epoch) in a new file under
`src/lib/payments/`, register it in `src/lib/payments/index.ts`, and set
`PAYMENT_PROVIDER` in `.env`. No other application code changes.

## Vendor integrations

Two integration types per vendor (`Vendor.integrationType`):

- **`API`** — `src/lib/vendors/api-adapter.ts` polls a vendor's JSON
  product feed and upserts products. Field names it doesn't recognize are
  remapped via the vendor's `fieldMapping` (JSON: `{ ourField: "theirKey" }`).
  `src/app/api/mock-vendor-feed/route.ts` stands in for a real vendor feed
  for local dev/demo — point `Vendor.apiBaseUrl` at a real feed URL in
  production. Trigger a sync from `/vendor/integrations` ("Sync now") or
  by calling `syncVendorFromApi(vendorId)`.
- **`MANUAL`** — vendors add products one at a time from `/vendor/products`,
  or bulk-import via CSV (`src/lib/vendors/csv-import.ts`). Expected CSV
  header: `title,description,price,stock,sku,imageUrl,categorySlug`
  (price in dollars, e.g. `24.99`).

## Switching to Postgres

Local dev uses SQLite (zero external services). For production:

1. In `prisma/schema.prisma`, change `datasource db { provider = "sqlite" }` to `provider = "postgresql"`.
2. Set `DATABASE_URL` to a Postgres connection string in `.env`.
3. Run `npx prisma migrate dev` to regenerate migrations against Postgres.

## Compliance notes

This is a starting point, not legal advice — adult-product e-commerce has
jurisdiction-specific age-verification and payment-processing
requirements. Before launch, have counsel review:

- Age verification beyond the self-attestation cookie gate + DOB-at-signup implemented here (some jurisdictions require ID-based verification).
- Your payment processor's adult-content policy and required statement descriptors.
- Shipping/customs restrictions for adult products in states/countries you ship to.

## Project structure

```
src/
  app/                 routes (storefront, auth, checkout, /vendor, /admin)
  components/           shared UI (Header, Footer, AgeGate, ProductCard)
  lib/
    actions/            server actions (cart, checkout, vendor, admin, auth)
    payments/            payment-provider interface + mock implementation
    vendors/              vendor-adapter interface, API adapter, CSV import, sync
    auth.ts / auth.config.ts   NextAuth setup (split for Edge-safe middleware)
  proxy.ts              route protection for /admin and /vendor (Next 16's middleware)
prisma/
  schema.prisma          data model
  seed.ts                 demo data
```

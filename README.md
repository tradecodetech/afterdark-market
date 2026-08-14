# Pikaboo

An adult-products marketplace/dropshipping storefront — think Temu, but
18+. Customers browse a multi-vendor catalog, checkout, and orders are
routed to the manufacturer/vendor who owns each item. Vendors can connect
a product feed via API or manage inventory manually; admins manage
vendors, categories, and moderation.

The brand name lives in `NEXT_PUBLIC_SITE_NAME` in `.env` (and the `name`
field in `package.json`) if it ever needs to change again.

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
npm run setup             # creates .env (if missing) and generates AUTH_SECRET
npx prisma migrate dev    # creates prisma/dev.db and applies the schema
npm run db:seed           # demo categories, vendors, products, and accounts
npm run dev
```

`npm run setup` is idempotent — safe to re-run any time (e.g. after
pulling an update); it only fills in `AUTH_SECRET` if it's missing or
empty, it won't touch one you've already set.

Open http://localhost:3000. You'll hit the 18+ age gate first (any
visitor, cookie-based, independent of login).

### Demo accounts

Seeded by `npm run db:seed`:

| Role                | Email                        | Password      |
| ------------------- | ----------------------------- | -------------- |
| Admin                | admin@pikaboo.app             | Admin123!      |
| Customer             | customer@pikaboo.app          | Customer123!   |
| Vendor (manual entry)| velvet@pikaboo.app            | Vendor123!     |
| Vendor (API feed)    | pulse@pikaboo.app              | Vendor123!     |

At checkout, use any card number except `4000000000000002` (that one
simulates a decline) — see [Payments](#payments).

## Core flows

- **Storefront**: `/`, `/products`, `/products/[slug]`, `/cart`, `/checkout` — age-gated, discreet-shipping messaging throughout.
- **Feed**: `/feed` — TikTok-Shop-style vertical swipe feed (CSS scroll-snap), one product per screen with an inline add-to-cart.
- **Spin & win**: `/spin` — one free spin/day, prizes (% off, free shipping) land in the signed-in user's account and apply at checkout.
- **Customer account**: `/account` — order history and fulfillment status per item.
- **Vendor dashboard** (`/vendor/*`, role `VENDOR`): manage products (manual form + CSV bulk import), view/fulfill assigned orders, trigger API feed syncs.
- **Admin dashboard** (`/admin/*`, role `ADMIN`): create/suspend vendors (including provisioning their login), manage categories, moderate products, view all orders and users.

Orders split into per-vendor `OrderItem`s at checkout, so a single
customer order can be fulfilled by several vendors independently, each
seeing only their own line items in their dashboard.

## Growth features

- **Phone verification** — required at signup (`src/lib/actions/phone-actions.ts`, `PhoneVerificationCode` model). No real SMS gateway is wired up here, so the OTP is shown on screen instead of texted (same transparent-mock approach as payments) — swap in Twilio/Vonage/etc. by replacing the "send" step; the rest of the flow (model, `/auth/verify-phone` page) doesn't change. It's a nudge, not a hard gate — the app still works if a user skips it.
- **Spin-to-win** — `src/lib/rewards.ts` (weighted prize table) + `src/lib/actions/reward-actions.ts`. One spin per calendar day per user; results land as `Reward` rows and show up as a discount option at checkout (`src/app/checkout/CheckoutClient.tsx`).
- **Group buy** — `Product.groupBuyEnabled/groupBuyTarget/groupBuyPrice`, `GroupBuySession`/`GroupBuyParticipant` models, `src/lib/actions/group-buy-actions.ts`. Joining a session is idempotent; once enough people join, everyone's cart gets the discounted price automatically (`CartItem.unitPriceOverride`). No invite links yet — anyone who visits the product page and clicks "Join" counts toward the target.

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

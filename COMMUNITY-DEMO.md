# Creator community demo

This update adds a non-explicit creator community to the existing site.

## Available features

- Creator profile editing and membership pricing at `/creator/studio`.
- Public and members-only text posts, reviewed by administrators before publication.
- 30-day demo memberships, immediate cancellation, and server-side content access checks.
- Member community chat with manual refresh, message length limits, and a basic send cooldown.
- Demo tips kept separate from payable creator earnings, with duplicate-submission protection.
- Livestream scheduling and cancellation. Broadcasting is intentionally disabled.
- Post approval and content reports at `/admin/community`.

Open a creator profile and choose **Explore posts, membership & community chat**.

## Enable the demo

1. Install dependencies with `npm ci`.
2. Configure the existing Postgres `DATABASE_URL` and `AUTH_SECRET`.
3. Set `COMMUNITY_DEMO_PAYMENTS=true` in the environment for the demo deployment.
4. Run `npx prisma migrate deploy` and `npx prisma generate`.
5. Run `npm run build` and `npm start`, or `npm run dev` locally.

Use existing approved creator, customer, and administrator accounts. Creator studio requires a creator profile that is approved, age-verified, and identity-verified. This update does not mark anyone verified automatically.

No payment details are collected by the new membership or tip forms. No money moves, renewals are not scheduled, and demo tips never create payout entries. Turning off `COMMUNITY_DEMO_PAYMENTS` disables new demo purchases and access through demo memberships.

## Manual acceptance check

1. As a creator, edit the profile, submit one public and one members-only post, and schedule a future session using a date with timezone.
2. As an administrator, approve both posts in Community moderation.
3. As a signed-out visitor, verify the public post is readable but the member-only body and chat are absent.
4. As a customer, join the demo membership and confirm the locked post and chat become available.
5. Send a message, refresh as another member, and report the message. Hide it as an administrator and confirm it disappears.
6. Send a demo tip. Confirm no actual creator earning or payment record is created.
7. Cancel the membership and confirm the protected body and chat disappear.
8. Cancel the scheduled session from the studio and confirm it leaves the upcoming list.

## Validation and limits

Production build and TypeScript checks passed during development. Automated tests cover membership expiry, cancellation, disabling demo access, and amount validation. The repository's pre-existing Windows button filename conflict was corrected by renaming the shared style helper to `button-styles.ts`.

Chat is manually refreshed, not a realtime transport. Posts are text-only. Actual recurring billing, payouts, video broadcasting, media uploads, and automated content screening are not connected. This is a demo implementation, not a claim that those services are live.

The database migration is included. Test it against a staging database before deployment. This change was prepared locally; it has not been pushed to GitHub or deployed to Vercel.

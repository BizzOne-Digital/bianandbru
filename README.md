# BIAN&BRU — INTERPAAB LLC

Baby keepsakes & essentials store. Next.js 16 (App Router) + TypeScript + Tailwind 4 + MongoDB Atlas (Mongoose). Built to run on Vercel.

## Setup

1. Copy `.env.example` to `.env.local` and fill in:
   - `MONGODB_URI`: MongoDB Atlas connection string
   - `ADMIN_SESSION_SECRET`: random string, 32+ characters (`node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
   - `NEXT_PUBLIC_SITE_URL`: e.g. `https://bianbru.com`
   - `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`: first admin login (password must be 10+ characters)
2. `npm install`
3. `npm run seed` to create the admin user, the two collections, 6 products, testimonials, FAQs and an offer. It is safe to re-run. `npm run seed -- --reset` wipes catalog and content first.
4. `npm run dev`, then open http://localhost:3000. The admin portal is at `/admin`.

## Deploy to Vercel

- Add the same 3 env vars (`MONGODB_URI`, `ADMIN_SESSION_SECRET`, `NEXT_PUBLIC_SITE_URL`) in Vercel → Settings → Environment Variables.
- In Atlas → Network Access, allow Vercel (`0.0.0.0/0`, or Vercel's static IPs on paid plans).
- Run the seed once from your machine against the production `MONGODB_URI`.

## Image uploads (single architecture)

Admin upload → `POST /api/upload` (auth, folder whitelist, MIME + magic-byte check, 8MB max) → binary stored in MongoDB `StoredUpload` → returns `/api/uploads/{folder}/{filename}` → only that URL is saved on records → `GET /api/uploads/...` serves it with immutable caching.

- Nothing is written to disk, so images survive redeploys.
- When an image is replaced or removed, the old upload is deleted only *after* the record saves successfully. Deleting a product, collection or other record deletes its uploads.
- Legacy `/uploads/...` paths and unknown hosts render a placeholder via `getSafeImageUrl()`.
- Note: MongoDB documents cap at 16MB, and the 8MB limit stays well under that.

## Checkout

Checkout creates an **order request** using server-verified prices (`paymentStatus: "unpaid"`). No payment is collected or faked. To add Stripe, create a Checkout Session in `app/api/orders/route.ts` and mark the order paid from a webhook.

## Admin modules

Dashboard · Products (multi-image, main image, ordering) · Collections · Categories · Special Offers · Order Requests · Home & Pages (hero, trust strip, story cards, collections, featured, offers panel, testimonials, newsletter, About, Services, Pricing, page headings, each with Save / Preview / Publish) · Team · Testimonials · FAQs · Images/Uploads · Bookings (status, notes, delete) · Newsletter (CSV export) · Site Settings (logo, favicon, contacts, socials, header/footer text, SEO).

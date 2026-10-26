# COMMON LIGHT - Photographer & Creative Studio Portfolio

An editorial portfolio concept in warm off-white, charcoal, and vermilion. Built with React, TypeScript, Vinext, Cloudflare Workers, and D1.

## Features

- Eight filterable project studies with category filters, search, clear states, full project stories, photo navigation, and next-story navigation.
- Portrait, brand, wedding, place, and motion categories. Each story explains a concept idea, approach, and proposed output.
- Two actual local MP4 stock motion studies with poster images, native player controls, muted playback after explicit user action, caption descriptions, source credits, and an error fallback.
- Four sample service packages, compatible optional add-ons, and a live starting estimate.
- Clearly labeled illustrative testimonial carousel, studio approach, process, and FAQ.
- Booking inquiry form with inspiration carried from a project, flexible or preferred dates, contact details, location, budget, and consent.
- D1 persistence, server-calculated estimates, package/add-on validation, and date validation.
- Owner-private `/studio` inquiry inbox with status updates and JSON export.
- Responsive mobile navigation, native modal focus handling, keyboard controls, and reduced-motion support.

## Development

Requires Node 22.13+ and npm. Use `npm run install:ci`, `npm run dev`, and `npm run build` for standalone work. When working through Sites, use its installed setup, dependency, build, and source helpers. `npm start -- --port 8794` serves the built Worker locally.

On Windows, npm lifecycle scripts may fail when a path contains `&`. The local mapping used here is `subst Y: "C:\Users\primo\Desktop\Photographer & Creative Studio Portfolio"`. Run npm commands from `Y:\`; run source synchronization from the real absolute folder path, not the substituted drive.

After the first build, apply each pending local database migration once:

```text
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_bouncy_giant_man.sql
```

Do not replay applied migrations. Hosted publication applies migrations to the hosted database separately. Local test records and database state are excluded from Git.

## Inquiry and access behavior

The hosted Site is owner-private. The studio page and GET/PATCH inquiry APIs require ChatGPT identity and rely on the platform owner-private boundary. **Before changing the Site to public, add an explicit server-side administrator ID allowlist to the studio page and both inbox APIs.** Identity alone does not establish administrator authorization for a public Site.

The inquiry POST validates same-origin requests, input sizes, contact details, consent, package ID, compatible unique add-ons, inspiration project ID, budget, date mode, and project notes. A preferred date must be a real date from today through 365 days ahead using the Philippines calendar day. Flexible dates are normalized to an empty date. Submitted price fields are ignored; estimates are recalculated from server-owned package data.

Inquiries are briefs for review, not confirmed bookings, availability, signed contracts, or final quotes. No payment, date reservation, calendar inventory, email delivery, SMS, licensing transfer, or fulfillment integration is configured.

## Photography and films

All photographs and video clips are independent Pexels references, not COMMON LIGHT original work. Exact sources and contributor credits are linked at `/credits`. The pictured people, couples, buildings, products, and brands are not claimed clients or endorsers. Concept story titles and briefs are illustrative. Testimonial quotes are explicitly labeled demo copy, not real client feedback.

Local video sources:

- `public/videos/tide.mp4`: Pexels video 12657904, Edward Ng / #edwardng.raw. 720p motion reference, approximately 43 seconds. Credit appears beside the video, in the film section, and in source notes.
- `public/videos/city.mp4`: Pexels video 10822505, Amar Preciado. 1080p motion reference, approximately 2 seconds; described as a short study rather than a complete film.

Posters come from the respective Pexels video pages. Files remain below the 25 MiB single-asset limit. Films load only when the visitor opens a player; there is no autoplaying background media. Video dialogs unmount the player when closed. Caption tracks provide visual study descriptions. No external video account is needed at runtime.

Sample package prices do not include travel, location, styling, talent, permits, music licensing, tax, or additional production expenses. Delivery counts, capture time, and revisions are concepts requiring a written brief. No stock media rights are sold through these packages. Replace all sample projects, media, pricing, and testimonials with approved original business content before public business use.

## Validation

```text
npx tsc --noEmit
node scripts/test-portfolio.mjs
node scripts/test-bookings.mjs
```

The API test requires a running local preview on port 8794 and a migrated local D1 database. It refuses non-loopback hosts and writes explicitly named local test records. Checks cover package math, add-on compatibility, date boundaries, media signatures and sizes, API validation and authentication, server price calculation, persistence, and status updates. Delivery also includes production build and desktop/mobile browser review with real video playback.

Dependency folders, build output, local databases, private exports, credentials, and publication archives are excluded from source. `.openai/hosting.json` retains the Sites project identity.

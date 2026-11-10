# Truephase AI — website

The public site at https://truephase.co.uk. Next.js 16 (App Router), React 19,
GSAP and Lenis for motion, no backend, no cookies, no analytics.

## Run it

```bash
npm install
NEXT_PUBLIC_PORTAL_URL=https://truephase-portal-app.vercel.app npm run dev
```

Production builds fail on purpose if `NEXT_PUBLIC_PORTAL_URL` is unset, so a
localhost link can never ship.

## Where things are

- `app/page.tsx` — the home page; `app/_data/services.ts` — the six services
  (cards and detail pages read from it).
- `app/privacy`, `app/terms`, `app/cookies`, `app/accessibility` — legal
  pages, built on `app/_components/legal-doc.tsx`. Each carries a version and
  date; change both when the wording changes.
- `app/_components/chrome.tsx` — nav, footer, `CONTACT_EMAIL` and the
  `COMPANY` details the footer and legal pages print.
- `next.config.ts` — security headers (CSP and friends).
- `blender/` — the Blender scenes and pipelines that render the hero loop in
  `public/`. Excluded from deployment by `.vercelignore`.

## Deploy

Vercel project `truephase-demo`, scope `truephases-projects`:

```bash
npx vercel@latest --prod --yes --scope truephases-projects --build-env NEXT_PUBLIC_PORTAL_URL=https://truephase-portal-app.vercel.app
```

## Rights

See `COPYRIGHT` and `THIRD-PARTY-NOTICES.md`.

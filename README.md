# Halftone — barbershop site

A production-quality barbershop website built as a reskinnable template.

**Halftone** is a fictional shop. The brand concept is a print metaphor: a fade
is a tonal gradient, and a tonal gradient on press is a halftone screen. That
idea drives the wordmark (one solid half, one screened half), the imagery, the
section rules and the accent.

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Motion ·
Lenis. Every route is statically generated.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm start
npm run lint
```

---

## Reskinning it for a real shop

Everything business-specific lives in `src/data/`. You should not need to touch
a component to launch a different barbershop.

| File | What it holds |
| --- | --- |
| `data/business.ts` | Name, wordmark, address, phone, hours, geo, socials, booking URL, social proof |
| `data/services.ts` | The full menu — names, copy, prices, durations, groups |
| `data/barbers.ts` | The roster — bios, specialities, schedules, portraits, socials |
| `data/work.ts` | The lookbook — categories, attribution, before/after pairs |
| `data/reviews.ts` | Testimonials |
| `data/media.ts` | Hero and atmosphere media slots |
| `data/nav.ts` | Primary navigation |

The design tokens — colour, type scale, the halftone screens, motion easings —
are all defined at the top of `src/app/globals.css`.

### Photography

Every image on the site goes through one component, `components/ui/Plate.tsx`.

- Give it a `src` and it renders an optimised `next/image`.
- Leave the source `null` and it renders a generated duotone halftone plate at
  the same crop: a tonal gradient resolved into three dot screens rotated to
  the classic press angles (15° / 45° / 75°), with crop marks.

So the placeholders are part of the art direction rather than grey boxes, and
real photography drops into the identical slot with no layout change. To swap
one in, set `image` on the record in `data/work.ts`, or `portrait` in
`data/barbers.ts`, and point it at a file in `/public`.

Each `alt` string is written as the art-direction brief for the shot it stands
in for, so it doubles as real alt text once the photograph exists.

### Booking

The site is not coupled to any booking vendor. Every BOOK control on every page
funnels through `components/booking/BookingProvider.tsx`.

- Set `business.booking.url` to the shop's real platform — Booksy, Square,
  Fresha, Boulevard, GlossGenius, Acuity — and every control opens it, with
  optional per-barber deep links via `business.booking.barberUrls`.
- Leave it `null` and the built-in drawer opens instead: a complete
  service → barber → time → review flow that is labelled as a demonstration at
  every step and **never** submits anywhere or claims a reservation was made.

---

## Launch checklist

The template ships with demo content for a fictional shop. In development, a
red-bordered checklist renders at the bottom of every page with the same list;
it never appears in a production build.

- [ ] **`data/business.ts`** — real name, address, phone, hours, geo
      coordinates, email and social URLs. The bundled phone number is in the
      reserved `555-01xx` range and is deliberately not dialable.
- [ ] **`business.url`** — set to the production origin. It drives canonicals,
      Open Graph URLs, the sitemap and the JSON-LD.
- [ ] **`socialProof`** — the 4.9 rating and review count are demo values. Set
      `verified: true` only with the real, current figures from the client's
      Google Business Profile. While it is false the trust strip carries a
      visible DEMO badge, and `AggregateRating` is **withheld from the JSON-LD
      entirely** — publishing an invented rating breaks Google's
      structured-data policy.
- [ ] **`data/reviews.ts`** — every review is written demo copy. Replace with
      genuine reviews and set `verified: true` on each. Unverified reviews
      render with a visible "demo copy" marker.
- [ ] **`business.booking.url`** — connect the real booking platform.
- [ ] **`components/sections/FirstVisit.tsx`** — the form is not wired to
      anything. There is a single marked integration point for a CRM (Klaviyo,
      Mailchimp, HubSpot, GoHighLevel, Square, Boulevard, Fresha…). **Before
      collecting any address or phone number, supply marketing-consent wording
      that satisfies the client's jurisdiction and channels** — TCPA / A2P 10DLC
      for SMS in the US, CAN-SPAM for email, plus any state requirements — and a
      privacy-policy link. The bundled checkbox label is plain English, not
      legal copy.
- [ ] **Photography** — replace the generated plates (see above).
- [ ] **`components/ui/MapPanel.tsx`** — the map graphic is an abstract,
      explicitly labelled illustration, not a real street layout. GET DIRECTIONS
      already links to Google Maps from the configured address. To embed a live
      map, swap the SVG for a Maps Embed iframe or a Mapbox static image and
      load it lazily or behind a click.
- [ ] Replace `src/app/favicon.ico`.

Set `NEXT_PUBLIC_HIDE_PLACEHOLDERS=true` to suppress all unverified demo
content instead of labelling it — useful for a soft launch before the real
reviews are collected.

---

## Structure

```
src/
  app/            routes, sitemap, robots, OG image
  components/
    booking/      provider + demo drawer
    barbers/      roster card
    services/     service row
    work/         lookbook grid, card, before/after
    sections/     homepage sections
    layout/       header, footer, mobile action bar, smooth scroll
    ui/           plate, buttons, reveals, wordmark, map
  data/           all business content
  lib/            seo, json-ld, hours, content gates, helpers
```

Routes: `/`, `/services`, `/barbers`, `/barbers/[slug]`, `/work`, `/visit`.

The architecture is ready for membership, gift cards, shop, multiple locations,
editorial and local service-landing pages (`/skin-fade-new-haven` and similar)
without restructuring. Those are deliberately not built — SEO landing pages are
only worth adding when they carry genuinely useful local information.

---

## Notes on the build

A few decisions worth knowing before you change them.

**The hero entrance is CSS, not JavaScript.** The headline is the LCP element.
Animating it with Motion left it clipped behind its mask until React hydrated,
which measured LCP at 4.3s on a throttled phone and left the headline invisible
entirely with JS disabled. As a CSS animation it starts on the browser's first
paint. Measured after the change: LCP 272ms desktop, 1.9s on a 4× CPU-throttled
1.6Mbps phone profile, CLS ~0.

**Nothing branches its render tree on `useReducedMotion()`.** That hook is null
during SSR, so branching renders a motion element on the server and a plain one
on the client — and the server's `opacity: 0` can survive hydration and hide the
content permanently. Reduced motion is handled once, globally, by
`<MotionConfig reducedMotion="user">` in `components/layout/MotionRoot.tsx`.
Scroll parallax is the exception, and `lib/useParallax.ts` collapses its output
range to zero rather than changing the markup.

**Viewport triggers never sit on a clipped element.** A masked line reveal
starts translated fully outside its `overflow: hidden` wrapper, so an
IntersectionObserver on the moving element reports zero intersection forever and
the text never arrives. The trigger lives on the heading; children animate off it
via variants. `components/ui/Reveal.tsx` exists to enforce this.

**The page works without JavaScript.** Motion serialises `initial` states into
the server HTML, so a `<noscript>` rule in the root layout forces `[data-reveal]`
elements to their finished state.

**Contrast is measured, not eyeballed.** Ember (`#e2512b`) carries ink text, not
bone — bone on ember is 3.1:1 and the CTA labels are 11–14px. Buttons darken
*and* invert on hover so both states clear 4.5:1. On the bone ground, secondary
text uses the `ink-soft` / `ink-mute` tokens rather than `text-ink/70`, because
Tailwind mixes alpha in oklab and every mid alpha measured below AA.

**Lenis runs on fine pointers only.** Touch scrolling stays native; hijacking it
on a phone costs more than it gives, and phones are the primary audience here.

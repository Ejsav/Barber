# Halftone — a barbershop platform

A production-quality barbershop website, built as a reskinnable platform rather
than a one-off site. One codebase covers a single-chair shop and a two-location
business; a different barbershop is a data change, not a rebuild.

**Halftone** is a fictional shop. The brand concept is a print metaphor: a fade
is a tonal gradient, and a tonal gradient on press is a halftone screen. That
idea drives the wordmark (one solid half, one screened half), the imagery, the
section rules and the accent.

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Motion ·
Lenis. Every route is statically generated. No analytics SDK, no embed widgets,
no UI library.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm start
npm run lint
```

---

## What it does

The site exists to turn visitors into booked appointments, so the feature set
is organised around that and nothing else.

| | |
| --- | --- |
| **Cut Explorer** | The signature feature. Plain language in — "short sides, sharp", "growing it out" — the trade name, price, upkeep, the barbers who specialise, their work and a booking button out. Includes a "not sure what to book" branch that always explains *why* it is pointing you somewhere. `/find-your-cut`, and a section on the homepage. |
| **Booking** | Never implemented, always routed. One provider config drives every BOOK control on the site, deep-linking per barber and per service where the provider supports it, with a branded barber chooser only when it removes a step. |
| **Barbers** | A roster page, an individual profile per barber with their own social card, their work, their reviews and their booking link. |
| **Services** | The full menu with prices and durations, plus a real page for the seven services worth explaining. |
| **The Book** | A filterable lookbook, before/after comparisons, and BOOK THIS LOOK on every frame carrying that frame's barber *and* service into the booking flow. |
| **Reviews** | A homepage wall and a filterable `/reviews` page — filtered by what a first-time customer is actually checking: fade quality, textured hair, kids, the room. |
| **Locations** | Multi-shop from the ground up. Per-location hours, phone, roster, parking, booking link and schema. Delete the second shop and every multi-shop affordance disappears on its own. |
| **Announcements & offers** | Date-gated against the *visitor's* clock, so a statically generated page cannot advertise last month's hours. |
| **Weddings, careers, gift cards** | Each behind a single flag. Off means the route 404s and the links vanish — no page advertising a service the shop will decline. |
| **FAQ** | Written against conversion objections, not keywords, and emitted as `FAQPage` structured data from the same source the page renders. |
| **Measurement** | Named conversion events on every booking, phone, directions, review and social action, wired from day one into whatever tag manager the shop installs later. |

Routes: `/`, `/services`, `/services/[slug]`, `/barbers`, `/barbers/[slug]`,
`/work`, `/find-your-cut`, `/visit`, `/reviews`, `/faq`, `/locations`,
`/locations/[slug]`, `/weddings`, `/careers`, `/privacy`.

---

## Reskinning it for a real shop

Everything business-specific lives in `src/data/`. You should not need to touch
a component to launch a different barbershop.

| File | What it holds |
| --- | --- |
| `data/business.ts` | Name, wordmark, address, phone, hours, geo, socials, booking config, gift cards, social proof |
| `data/locations.ts` | Every shop. The flagship reads from `business.ts`; additional shops are declared in full |
| `data/services.ts` | The full menu — names, copy, prices, durations, groups |
| `data/serviceDetail.ts` | Which services get a page of their own, and what is on it |
| `data/barbers.ts` | The roster — bios, specialities, schedules, portraits, socials |
| `data/looks.ts` | The Cut Explorer taxonomy: plain language → service → barbers → work |
| `data/work.ts` | The lookbook — categories, attribution, before/after pairs |
| `data/reviews.ts` | Testimonials and their filter tags |
| `data/faq.ts` | Questions, answers and categories (also feeds the FAQ schema) |
| `data/announcements.ts` | The announcement bar and promotions, with expiry dates |
| `data/events.ts` | Weddings and group grooming, and the flag that removes them |
| `data/careers.ts` | Positions, terms and the flag that removes them |
| `data/media.ts` | Hero and atmosphere media slots |
| `data/nav.ts` | Navigation, assembled from the feature flags |

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
funnels through `lib/booking.ts` and `components/booking/BookingProvider.tsx`,
which resolve an intent most-specific-first:

```
barber link  →  service link  →  location link  →  shop link
```

Anything left unset falls through to the next rung, so a shop can launch with
one URL and add per-barber deep links months later without a component
changing. Three outcomes, decided by configuration rather than by the call
site:

1. The intent already names a barber → straight to that barber's page. The
   visitor is never asked something they have already answered.
2. No barber named, but the provider has per-barber pages → the shop's own
   chooser opens first, showing faces and specialities, then redirects. One
   question, asked in the shop's design instead of the vendor's list.
3. No provider configured → the built-in drawer opens: a complete
   service → barber → time → review flow that is labelled as a demonstration at
   every step and **never** submits anywhere or claims a reservation was made.

### Measurement

`lib/analytics.ts` pushes named events onto `window.dataLayer` and forwards to
`gtag` if present. With no tag manager installed it is a no-op — nothing is
queued, no request is made, no cookie is written. Installing GTM is the only
change needed to start collecting:

`book_click` · `barber_book_click` · `service_book_click` ·
`booking_modal_open` · `booking_modal_choice` · `phone_click` ·
`directions_click` · `gift_card_click` · `barber_profile_view` ·
`cut_explorer_select` · `instagram_click` · `tiktok_click` · `review_click`

Every event carries the barber, service, location and placement where they
apply, which is what makes "which barber gets the most clicks" and "which
surface converts" answerable rather than guessed at. Scroll depth and hovers
are deliberately not tracked.

---

## Launch checklist

The template ships with demo content for a fictional shop. In development, a
red-bordered checklist renders at the bottom of every page with the same list;
it never appears in a production build.

- [ ] **`data/business.ts`** — real name, address, phone, hours, geo
      coordinates, email and social URLs. Both bundled phone numbers are in the
      reserved `555-01xx` range and are deliberately not dialable.
- [ ] **`business.url`** — set to the production origin. It drives canonicals,
      Open Graph URLs, the sitemap and the JSON-LD.
- [ ] **`data/locations.ts`** — the Whitney Avenue shop is a fictional second
      address, present so the multi-location paths stay exercised. Delete it
      for a single-shop client; replace it in full for a client with two.
- [ ] **`socialProof`** — the 4.9 rating and review count are demo values. Set
      `verified: true` only with the real, current figures from the client's
      Google Business Profile. While it is false the trust strip carries a
      visible DEMO badge, and `AggregateRating` is **withheld from the JSON-LD
      entirely** — publishing an invented rating breaks Google's
      structured-data policy.
- [ ] **`data/reviews.ts`** — every review is written demo copy. Replace with
      genuine reviews and set `verified: true` on each. Unverified reviews
      render with a visible "demo copy" marker.
- [ ] **`business.booking`** — connect the real booking platform, then add
      `barberUrls` so BOOK MARCUS lands on Marcus.
- [ ] **`data/announcements.ts`** — announcements and promotions expire on
      their own dates. Check none are stale at launch.
- [ ] **`data/faq.ts`** — the answers are emitted as `FAQPage` structured data,
      which Google treats as factual claims. They must be true for this shop.
- [ ] **`data/events.ts` / `data/careers.ts`** — set `enabled: false` unless the
      shop genuinely offers wedding work or is genuinely hiring.
- [ ] **`components/sections/FirstVisit.tsx`** — the form is not wired to
      anything. There is a single marked integration point for a CRM (Klaviyo,
      Mailchimp, HubSpot, GoHighLevel, Square, Boulevard, Fresha…). **Before
      collecting any address or phone number, supply marketing-consent wording
      that satisfies the client's jurisdiction and channels** — TCPA / A2P 10DLC
      for SMS in the US, CAN-SPAM for email, plus any state requirements — and a
      privacy-policy link. The bundled checkbox label is plain English, not
      legal copy.
- [ ] **`app/privacy/page.tsx`** — written from what this build actually does
      (no cookies, no analytics vendor, nothing submitted). It stops being
      accurate the moment a tag manager, pixel, CRM or chat widget is added.
      Update it in the same commit, and have the client's counsel review it.
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
qa/               browser audit — a11y, console, overflow, vitals
src/
  app/            routes, sitemap, robots, OG images
  components/
    analytics/    tracked anchor + view tracker
    booking/      provider, barber chooser, demo drawer
    barbers/      roster card
    explorer/     the Cut Explorer
    faq/          accordion
    reviews/      filterable review wall
    services/     service row
    work/         lookbook grid, card, before/after
    sections/     homepage + shared page sections
    layout/       header, announcement bar, footer, mobile action bar
    ui/           plate, buttons, reveals, wordmark, map
  data/           all business content
  lib/            booking, analytics, seo, json-ld, hours, looks, promotions
```

---

## Notes on the build

A few decisions worth knowing before you change them.

**Above the fold, entrances are CSS. Below it, they are JavaScript.** The
headline and standfirst in a page header are the LCP element. Animated with
Motion they sit translated outside their mask, or at `opacity: 0`, until React
hydrates — measured at **3.7s LCP** on a 4× CPU-throttled 1.6Mbps phone
profile, with the booking CTA unpaintable for the same three seconds. Moved to
CSS animations (`components/ui/HeroLines.tsx`, `.anim-line` / `.anim-rise`) they
start on the browser's first paint and need no JavaScript at all: **1.6–1.9s
LCP** on the same profile, CLS ~0.0002. `qa/audit.mjs` fails the run if any
route regresses past 2.5s, so this cannot quietly come back. `Reveal` is still
the right component for anything triggered by scroll position.

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

**Time-sensitive content is resolved twice.** Every page is statically
generated, so "is this offer still running?" and "are we open?" cannot be
answered at build time without freezing the answer into the HTML. The server
renders the build-time answer, the first client render reuses it verbatim so
hydration is byte-identical, and from the next render on the visitor's own
clock decides — read as external state through `useSyncExternalStore`, never
copied into component state by an effect.

**The announcement bar does not shift the page.** Its height is carried by
`--announce-h`, which `--header-h` is composed from, so the hero rail, the
mobile sheet and every in-page anchor adjust on their own. An inline script in
the root layout sets `data-announce="dismissed"` before first paint, so a bar
the visitor already dismissed is never drawn rather than drawn and removed.

**Contrast is measured, not eyeballed.** Ember (`#e2512b`) carries ink text, not
bone — bone on ember is 3.1:1 and the CTA labels are 11–14px. Buttons darken
*and* invert on hover so both states clear 4.5:1. On the bone ground, ember is
used for rules and dots but never for type: `ember-deep` (4.5:1) carries the
accent text, and secondary text uses the `ink-soft` / `ink-mute` tokens rather
than `text-ink/70`, because Tailwind mixes alpha in oklab and every mid alpha
measured below AA.

**No third-party embeds.** An Instagram feed widget is 300–600KB of JavaScript,
blocks the main thread while it hydrates, hands every visitor's IP to a third
party on page load, and breaks silently when the shop's token expires — to show
four squares that are already on this site. `components/sections/SocialRail.tsx`
uses the shop's own imagery and links out, and the clicks are measured, which
the widget would never have reported.

**There is no loading screen.** A branded preloader is only honest when the
page genuinely is not ready, and this one is: first contentful paint lands
under a second on a throttled phone and the headline is painted from static
HTML before any JavaScript runs. Holding that behind an animated logo would be
adding a delay in order to have something to show during it — the one thing a
loader must never do. The brand moment is the hero itself.

**Lenis runs on fine pointers only.** Touch scrolling stays native; hijacking it
on a phone costs more than it gives, and phones are the primary audience here.

**Broken data fails loudly in development and quietly in production.** A Cut
Explorer look pointing at a service that does not exist throws by name during
development (`lib/looks.ts`); in a production build the look is dropped from the
explorer instead. A tile fewer is recoverable; a tile that books a service the
shop does not sell is not.

---

## Verified

`qa/audit.mjs` drives the production build in a real browser. Playwright and
axe are not project dependencies — install them for the run and throw them
away:

```bash
npm run build && npx next start -p 3100 &
npm i --no-save playwright @axe-core/playwright
node qa/audit.mjs
```

What it checks, and what it currently reports:

- 15 routes × 4 viewports (375 / 430 / 820 / 1440): zero console errors, zero
  horizontal overflow, correct status codes, 404 renders.
- axe-core WCAG 2.1 A/AA + best-practice: **zero violations** across every
  route at mobile and desktop.
- Keyboard: explorer arrow/Home/End navigation, FAQ accordion state, modal
  focus trap and Escape, mobile menu Escape.
- Reduced motion: no reveal element left below full opacity.
- Every internal link on every generated page resolves to a generated route.
- Core Web Vitals on a 4× CPU-throttled 1.6Mbps phone profile: LCP 1.6–1.9s,
  CLS 0.0002–0.04, ~128KB transferred. The audit fails the run if any route
  crosses LCP 2.5s or CLS 0.1.

import Link from 'next/link';

import { Wordmark } from '@/components/ui/Wordmark';
import { TodayStatus } from '@/components/ui/TodayStatus';
import { BookButton } from '@/components/ui/BookButton';
import { TrackedAnchor } from '@/components/analytics/TrackedAnchor';
import { GiftCardLink } from '@/components/ui/GiftCardLink';
import { business, fullAddress } from '@/data/business';
import { barbers } from '@/data/barbers';
import {
  isMultiLocation,
  locationDirectionsUrl,
  locations,
} from '@/data/locations';
import { weekScheduleFor } from '@/lib/hours';
import { isDev } from '@/lib/content';
import { NAV } from '@/data/nav';
import { SECONDARY_NAV } from '@/data/nav';

export function Footer() {
  return (
    <footer className="relative border-t border-ink-line bg-ink pb-[calc(var(--spacing-bar)+1rem)] lg:pb-0">
      <div className="shell pt-16 lg:pt-24">
        {/* Booking is the point of the site; the footer is the last chance. */}
        <div className="flex flex-col gap-6 border-b border-ink-line pb-12 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="label text-steel">Still deciding?</p>
            <p className="display-md mt-3 max-w-lg text-bone">
              Chairs open up daily. Take one.
            </p>
          </div>
          <BookButton size="lg" placement="footer" className="w-full sm:w-auto">
            Book your chair
          </BookButton>
        </div>

        <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Addresses */}
          <div className="lg:col-span-5">
            <p className="label text-steel">
              {isMultiLocation ? 'The shops' : 'The shop'}
            </p>
            <div className="mt-5 space-y-8">
              {locations.map((location) => (
                <div key={location.slug}>
                  {isMultiLocation && (
                    <p className="label-sm mb-2 text-ember">{location.name}</p>
                  )}
                  <address className="not-italic">
                    <p className="display-sm text-bone">
                      {location.address.street}
                      <br />
                      {location.address.city}, {location.address.region}{' '}
                      {location.address.postalCode}
                    </p>
                  </address>
                  <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
                    <TrackedAnchor
                      href={location.phoneHref}
                      event="phone_click"
                      payload={{ placement: 'footer', location: location.slug }}
                      className="link-draw num text-lg text-bone"
                    >
                      {location.phone}
                    </TrackedAnchor>
                    <TrackedAnchor
                      href={locationDirectionsUrl(location)}
                      external
                      event="directions_click"
                      payload={{ placement: 'footer', location: location.slug }}
                      className="link-draw label text-ember"
                    >
                      Get directions
                    </TrackedAnchor>
                  </div>
                  <div className="mt-4">
                    <TodayStatus hours={location.hours} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hours — the primary shop; each location page carries its own. */}
          <div className="lg:col-span-3">
            <p className="label text-steel">
              Hours{isMultiLocation && ` · ${locations[0].shortName}`}
            </p>
            <dl className="mt-5 space-y-2.5">
              {weekScheduleFor(locations[0].hours).map((d) => (
                <div key={d.key} className="flex items-baseline justify-between gap-4">
                  <dt className="label-sm text-steel-light">{d.short}</dt>
                  <dd
                    className={`num text-sm ${
                      d.display === 'Closed' ? 'text-steel-dark' : 'text-bone'
                    }`}
                  >
                    {d.display}
                  </dd>
                </div>
              ))}
            </dl>
            {isMultiLocation && (
              <Link
                href={`/locations/${locations[1].slug}`}
                className="link-draw label mt-5 inline-block text-ember"
              >
                {locations[1].shortName} hours
              </Link>
            )}
          </div>

          {/* Navigation */}
          <div className="grid grid-cols-2 gap-8 lg:col-span-4">
            <div>
              <p className="label text-steel">Site</p>
              <ul className="mt-5 space-y-3">
                {[...NAV, ...SECONDARY_NAV].map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="link-draw text-sm text-bone">
                      {l.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <GiftCardLink
                    placement="footer"
                    className="link-draw text-sm text-bone"
                  />
                </li>
              </ul>
            </div>
            <div>
              <p className="label text-steel">Chairs</p>
              <ul className="mt-5 space-y-3">
                {barbers.map((b) => (
                  <li key={b.slug}>
                    <Link
                      href={`/barbers/${b.slug}`}
                      className="link-draw text-sm text-bone"
                    >
                      {b.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Oversized wordmark, cropped by the viewport edge */}
        <div className="mt-16 overflow-hidden lg:mt-24">
          <Wordmark className="block w-full whitespace-nowrap text-[clamp(3.5rem,34vw,30rem)] leading-[0.78]" />
        </div>
      </div>

      <div className="mt-10 border-t border-ink-line">
        <div className="shell flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="label-sm text-steel-dark">
            © {new Date().getFullYear()} {business.legalName} · {fullAddress}
            <span className="mx-2">·</span>
            <Link href="/privacy" className="transition-colors hover:text-bone">
              Privacy
            </Link>
          </p>
          <div className="flex items-center gap-6">
            <TrackedAnchor
              href={business.social.instagram}
              external
              event="instagram_click"
              payload={{ placement: 'footer' }}
              className="label-sm text-steel-light transition-colors hover:text-bone"
            >
              Instagram
            </TrackedAnchor>
            <TrackedAnchor
              href={business.social.tiktok}
              external
              event="tiktok_click"
              payload={{ placement: 'footer' }}
              className="label-sm text-steel-light transition-colors hover:text-bone"
            >
              TikTok
            </TrackedAnchor>
            <TrackedAnchor
              href={business.social.google}
              external
              event="review_click"
              payload={{ placement: 'footer' }}
              className="label-sm text-steel-light transition-colors hover:text-bone"
            >
              Google
            </TrackedAnchor>
          </div>
        </div>
      </div>

      {isDev && <DevNotice />}
    </footer>
  );
}

/**
 * Development-only launch checklist. Never renders in a production build, so
 * it costs nothing at runtime — it exists so nobody ships the demo values.
 */
function DevNotice() {
  return (
    <div className="border-t border-dashed border-ember/40 bg-ember/5">
      <div className="shell py-6">
        <p className="label text-ember">Developer note — not shown in production</p>
        <ul className="mt-3 space-y-1.5 text-xs leading-relaxed text-ember-tint">
          <li>
            · <code>data/business.ts</code> — replace address, phone, hours,
            geo and social links. Both phone numbers are reserved 555 numbers.
          </li>
          <li>
            · <code>data/locations.ts</code> — the Whitney Avenue shop is a
            fictional second address, present so the multi-location routes stay
            exercised. Delete it for a single-shop client and every multi-shop
            affordance disappears on its own.
          </li>
          <li>
            · <code>socialProof</code> — the 4.9 rating and review count are
            demo values. Set <code>verified: true</code> only with real figures
            from the Google Business Profile, or the trust strip and
            AggregateRating stay hidden.
          </li>
          <li>
            · <code>data/reviews.ts</code> — every review is written demo copy.
            Replace with genuine reviews and set <code>verified: true</code>.
          </li>
          <li>
            · <code>business.booking.url</code> — set the real booking platform
            URL to retire the demo drawer, then add <code>barberUrls</code> so
            BOOK MARCUS lands on Marcus.
          </li>
          <li>
            · <code>data/announcements.ts</code> — announcements and promotions
            expire on their own dates. Check none are stale at launch.
          </li>
          <li>
            · Photography — set <code>image</code> in <code>data/work.ts</code>{' '}
            and <code>portrait</code> in <code>data/barbers.ts</code> to swap
            generated plates for real shots.
          </li>
          <li>
            · <code>app/privacy/page.tsx</code> — describes what this build
            actually does. It must be reviewed by the client&rsquo;s counsel and
            updated the moment analytics, pixels or a CRM are added.
          </li>
          <li>
            · <code>components/sections/FirstVisit.tsx</code> — marketing
            consent copy must be written for the client&rsquo;s jurisdiction
            before collecting anything.
          </li>
        </ul>
      </div>
    </div>
  );
}

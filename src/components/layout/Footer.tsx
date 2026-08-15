import Link from 'next/link';

import { Wordmark } from '@/components/ui/Wordmark';
import { TodayStatus } from '@/components/ui/TodayStatus';
import { business, directionsUrl, fullAddress } from '@/data/business';
import { barbers } from '@/data/barbers';
import { weekSchedule } from '@/lib/hours';
import { isDev } from '@/lib/content';

const SITE_LINKS = [
  { href: '/services', label: 'Services & prices' },
  { href: '/barbers', label: 'The barbers' },
  { href: '/work', label: 'The Book' },
  { href: '/visit', label: 'Visit the shop' },
];

export function Footer() {
  return (
    <footer className="relative border-t border-ink-line bg-ink pb-[calc(var(--spacing-bar)+1rem)] lg:pb-0">
      <div className="shell pt-16 lg:pt-24">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Address block */}
          <div className="lg:col-span-5">
            <p className="label text-steel">The shop</p>
            <address className="mt-5 not-italic">
              <p className="display-sm text-bone">
                {business.address.street}
                <br />
                {business.address.city}, {business.address.region}{' '}
                {business.address.postalCode}
              </p>
            </address>
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2">
              <a
                href={business.phoneHref}
                className="link-draw num text-lg text-bone"
              >
                {business.phone}
              </a>
              <a
                href={directionsUrl}
                target="_blank"
                rel="noreferrer"
                className="link-draw label text-ember"
              >
                Get directions
              </a>
            </div>
            <div className="mt-6">
              <TodayStatus />
            </div>
          </div>

          {/* Hours */}
          <div className="lg:col-span-3">
            <p className="label text-steel">Hours</p>
            <dl className="mt-5 space-y-2.5">
              {weekSchedule.map((d) => (
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
          </div>

          {/* Navigation */}
          <div className="grid grid-cols-2 gap-8 lg:col-span-4">
            <div>
              <p className="label text-steel">Site</p>
              <ul className="mt-5 space-y-3">
                {SITE_LINKS.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="link-draw text-sm text-bone">
                      {l.label}
                    </Link>
                  </li>
                ))}
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
          <Wordmark className="block w-full text-[clamp(4.5rem,20vw,20rem)] leading-[0.8]" />
        </div>
      </div>

      <div className="mt-10 border-t border-ink-line">
        <div className="shell flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="label-sm text-steel-dark">
            © {new Date().getFullYear()} {business.legalName} · {fullAddress}
          </p>
          <div className="flex items-center gap-6">
            <a
              href={business.social.instagram}
              target="_blank"
              rel="noreferrer"
              className="label-sm text-steel-light transition-colors hover:text-bone"
            >
              Instagram
            </a>
            <a
              href={business.social.tiktok}
              target="_blank"
              rel="noreferrer"
              className="label-sm text-steel-light transition-colors hover:text-bone"
            >
              TikTok
            </a>
            <a
              href={business.social.google}
              target="_blank"
              rel="noreferrer"
              className="label-sm text-steel-light transition-colors hover:text-bone"
            >
              Google
            </a>
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
            geo and social links. Phone is a reserved 555 number.
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
            URL to retire the demo drawer.
          </li>
          <li>
            · Photography — set <code>image</code> in <code>data/work.ts</code>{' '}
            and <code>portrait</code> in <code>data/barbers.ts</code> to swap
            generated plates for real shots.
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

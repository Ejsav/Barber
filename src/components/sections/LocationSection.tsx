import { MapPanel } from '@/components/ui/MapPanel';
import { TodayStatus } from '@/components/ui/TodayStatus';
import { RevealLines, Reveal } from '@/components/ui/Reveal';
import Link from 'next/link';

import { business } from '@/data/business';
import { isMultiLocation, locations } from '@/data/locations';
import { openDaysSummary, weekSchedule } from '@/lib/hours';

/* ----------------------------------------------------------------------------
 * FINDING US
 *
 * Everything a visitor needs before they set off — address, today's hours, the
 * full week, parking, transit, the walk-in policy and step-free access — on the
 * page, not behind a contact form.
 * -------------------------------------------------------------------------- */

const NOTES = [
  ['Parking', business.parking],
  ['Transit', business.transit],
  ['Walk-ins', business.walkIns],
  ['Access', business.accessibility],
];

export function LocationSection() {
  return (
    <section
      className="on-bone relative bg-bone py-20 text-ink lg:py-32"
      aria-labelledby="location-heading"
    >
      <div className="shell">
        <div className="flex items-baseline gap-4 border-b border-bone-line pb-4">
          <span className="label-sm text-ink-mute">09</span>
          <span className="label text-ink-mute">Finding us</span>
          <TodayStatus size="sm" className="ml-auto [&_span]:!text-ink-mute" />
        </div>

        <div className="mt-8 lg:mt-12 lg:grid lg:grid-cols-12 lg:gap-10">
          <RevealLines
            as="h2"
            id="location-heading"
            lines={['912 Chapel.', 'Two blocks', 'off the Green.']}
            className="display-xl text-ink lg:col-span-7"
          />
          <Reveal delay={0.12} className="mt-6 lg:col-span-4 lg:col-start-9 lg:mt-2">
            <address className="not-italic">
              <p className="body-lg text-ink-mute">
                {business.address.street}, {business.address.unit}
                <br />
                {business.address.city}, {business.address.region}{' '}
                {business.address.postalCode}
              </p>
              <a
                href={business.phoneHref}
                className="link-draw num mt-4 inline-block text-xl text-ink"
              >
                {business.phone}
              </a>
            </address>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-8 lg:mt-20 lg:grid-cols-12 lg:gap-10">
          {/* Map */}
          <Reveal className="lg:col-span-7">
            <MapPanel className="min-h-[22rem] lg:min-h-[30rem]" />
          </Reveal>

          {/* Hours */}
          <Reveal delay={0.1} className="lg:col-span-5">
            <p className="label border-b border-bone-line pb-3 text-ink-mute">
              Opening hours
            </p>
            <dl className="mt-1">
              {weekSchedule.map((d) => {
                const closed = d.display === 'Closed';
                return (
                  <div
                    key={d.key}
                    className="flex items-baseline justify-between gap-4 border-b border-bone-line py-3.5"
                  >
                    <dt className="label text-ink-mute">{d.label}</dt>
                    <dd
                      className={`num text-sm ${closed ? 'text-ink-mute' : 'text-ink'}`}
                    >
                      {d.display}
                    </dd>
                  </div>
                );
              })}
            </dl>
            <p className="mt-4 text-xs leading-relaxed text-ink-mute">
              Last appointment starts one service-length before close. Holiday
              hours are posted on the door and on Google.
            </p>
          </Reveal>
        </div>

        {/* The other shops. Renders only when there is more than one address —
            a "second location" strip on a single-shop site is a dead frame. */}
        {isMultiLocation && (
          <div className="mt-14 border-t border-bone-line pt-8">
            <p className="label text-ink-mute">Also cutting at</p>
            <ul className="mt-5 grid gap-6 sm:grid-cols-2">
              {locations
                .filter((l) => !l.isPrimary)
                .map((l) => (
                  <li key={l.slug}>
                    <Link
                      href={`/locations/${l.slug}`}
                      className="group flex items-baseline justify-between gap-6 border-b border-bone-line pb-4"
                    >
                      <span>
                        <span className="display-sm block text-ink transition-colors group-hover:text-ember-deep">
                          {l.name}
                        </span>
                        <span className="mt-2 block text-sm text-ink-mute">
                          {l.address.street}, {l.city}
                        </span>
                      </span>
                      <span className="num shrink-0 text-sm text-ink-mute">
                        {openDaysSummary(l.hours)}
                      </span>
                    </Link>
                  </li>
                ))}
            </ul>
            <Link
              href="/locations"
              className="link-draw label mt-6 inline-block text-ember-deep"
            >
              All {locations.length} shops
            </Link>
          </div>
        )}

        {/* Practicalities */}
        <div className="mt-14 grid gap-px border-t border-bone-line bg-bone-line sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
          {NOTES.map(([k, v], i) => (
            <Reveal key={k} delay={i * 0.06} className="bg-bone py-6 pr-6 sm:px-6 sm:first:pl-0">
              <p className="label text-ink-mute">{k}</p>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-soft">
                {v}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

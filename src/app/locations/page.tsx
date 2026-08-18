import { notFound } from 'next/navigation';
import Link from 'next/link';

import { PageHero } from '@/components/layout/PageHero';
import { Plate } from '@/components/ui/Plate';
import { TodayStatus } from '@/components/ui/TodayStatus';
import { BookButton } from '@/components/ui/BookButton';
import { TrackedAnchor } from '@/components/analytics/TrackedAnchor';
import { FinalCta } from '@/components/sections/FinalCta';
import { JsonLd } from '@/components/seo/JsonLd';

import { pageMetadata, breadcrumbJsonLd } from '@/lib/seo';
import { openDaysSummary } from '@/lib/hours';
import {
  isMultiLocation,
  locationDirectionsUrl,
  locations,
} from '@/data/locations';
import { barbers } from '@/data/barbers';
import { business } from '@/data/business';

export const metadata = pageMetadata({
  title: 'Locations',
  description: `${business.name} has ${locations.length} shops: ${locations
    .map((l) => `${l.name} in ${l.city}`)
    .join(', ')}. Hours, parking and booking for each.`,
  path: '/locations',
});

export default function LocationsPage() {
  /* One shop needs no index page, and an index page listing one thing looks
   * like a mistake. Delete the second entry in data/locations.ts and this
   * route stops existing. */
  if (!isMultiLocation) notFound();

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Locations', path: '/locations' },
        ])}
        id="ld-crumbs-locations"
      />

      <PageHero
        index="00"
        label="Where we are"
        lines={['Two rooms.', 'One standard.']}
        standfirst="Same chairs, same training, same consultation. Different parking, different evenings, and a different set of hands in each."
        meta={[
          { k: 'Shops', v: String(locations.length) },
          { k: 'Barbers', v: String(barbers.length) },
        ]}
      />

      <section className="bg-ink pb-8" aria-label="All locations">
        {locations.map((location, i) => {
          const roster = barbers.filter((b) =>
            location.barberSlugs.includes(b.slug),
          );

          return (
            <div
              key={location.slug}
              className="shell border-t border-ink-line py-14 lg:py-20"
            >
              <div className="lg:grid lg:grid-cols-12 lg:gap-10">
                <div className="lg:col-span-5">
                  <Link href={`/locations/${location.slug}`} className="group block">
                    <Plate
                      src={location.media.image}
                      alt={location.media.alt}
                      aspect="landscape"
                      seed={location.media.seed}
                      sizes="(max-width: 1024px) 92vw, 40vw"
                      className="transition-opacity group-hover:opacity-85"
                    />
                  </Link>
                </div>

                <div className="mt-8 lg:col-span-6 lg:col-start-7 lg:mt-0">
                  <div className="flex items-baseline gap-4 border-b border-ink-line pb-4">
                    <span className="label-sm text-steel-dark">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="label text-steel">{location.city}</span>
                    <span className="ml-auto">
                      <TodayStatus size="sm" hours={location.hours} compact />
                    </span>
                  </div>

                  <h2 className="display-lg mt-6 text-bone">
                    <Link
                      href={`/locations/${location.slug}`}
                      className="transition-colors hover:text-ember"
                    >
                      {location.name}
                    </Link>
                  </h2>

                  <p className="body-lg mt-5 max-w-xl text-bone/70">
                    {location.standfirst}
                  </p>

                  <address className="mt-7 not-italic">
                    <p className="text-steel-light">
                      {location.address.street}
                      {location.address.unit ? `, ${location.address.unit}` : ''}
                      <br />
                      {location.address.city}, {location.address.region}{' '}
                      {location.address.postalCode}
                    </p>
                  </address>

                  <dl className="mt-6 flex flex-wrap gap-x-10 gap-y-4">
                    <div>
                      <dt className="label-sm text-steel-dark">Open</dt>
                      <dd className="num mt-1.5 text-sm text-bone">
                        {openDaysSummary(location.hours)}
                      </dd>
                    </div>
                    <div>
                      <dt className="label-sm text-steel-dark">Chairs</dt>
                      <dd className="num mt-1.5 text-sm text-bone">
                        {roster.length}
                      </dd>
                    </div>
                    <div>
                      <dt className="label-sm text-steel-dark">Phone</dt>
                      <dd className="mt-1.5">
                        <TrackedAnchor
                          href={location.phoneHref}
                          event="phone_click"
                          payload={{
                            placement: 'locations_index',
                            location: location.slug,
                          }}
                          className="link-draw num text-sm text-bone"
                        >
                          {location.phone}
                        </TrackedAnchor>
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <BookButton
                      intent={{ locationSlug: location.slug }}
                      placement="locations_index"
                      size="md"
                      className="w-full sm:w-auto"
                    >
                      Book {location.shortName}
                    </BookButton>
                    <TrackedAnchor
                      href={locationDirectionsUrl(location)}
                      external
                      event="directions_click"
                      payload={{
                        placement: 'locations_index',
                        location: location.slug,
                      }}
                      className="link-draw label text-ember"
                    >
                      Get directions
                    </TrackedAnchor>
                    <Link
                      href={`/locations/${location.slug}`}
                      className="link-draw label text-steel-light"
                    >
                      Shop details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      <FinalCta />
    </>
  );
}

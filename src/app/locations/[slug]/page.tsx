import { notFound } from 'next/navigation';
import Link from 'next/link';

import { PageHero } from '@/components/layout/PageHero';
import { MapPanel } from '@/components/ui/MapPanel';
import { Plate } from '@/components/ui/Plate';
import { TodayStatus } from '@/components/ui/TodayStatus';
import { BookButton } from '@/components/ui/BookButton';
import { BarberCard } from '@/components/barbers/BarberCard';
import { TrackedAnchor } from '@/components/analytics/TrackedAnchor';
import { FaqList } from '@/components/faq/FaqList';
import { FinalCta } from '@/components/sections/FinalCta';
import { JsonLd } from '@/components/seo/JsonLd';

import { pageMetadata, breadcrumbJsonLd } from '@/lib/seo';
import { locationJsonLd } from '@/lib/jsonld';
import { openDaysSummary, weekScheduleFor } from '@/lib/hours';
import {
  getLocation,
  isMultiLocation,
  locationDirectionsUrl,
  locations,
} from '@/data/locations';
import { barbers } from '@/data/barbers';
import { business } from '@/data/business';
import { featuredFaqs } from '@/data/faq';

export function generateStaticParams() {
  return isMultiLocation ? locations.map((l) => ({ slug: l.slug })) : [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const location = getLocation(slug);
  if (!location) return {};

  return pageMetadata({
    title: `${location.name}, ${location.city}`,
    description: `${business.name} on ${location.address.street}, ${location.locality}. ${location.standfirst} Hours, parking and booking.`,
    path: `/locations/${slug}`,
  });
}

export default async function LocationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const location = getLocation(slug);
  if (!location || !isMultiLocation) notFound();

  const roster = barbers.filter((b) => location.barberSlugs.includes(b.slug));
  const others = locations.filter((l) => l.slug !== location.slug);
  const week = weekScheduleFor(location.hours);

  const NOTES: [string, string][] = [
    ['Parking', location.parking],
    ['Transit', location.transit],
    ['Walk-ins', location.walkIns],
    ['Access', location.accessibility],
  ];

  return (
    <>
      <JsonLd data={locationJsonLd(location)} id="ld-location" />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Locations', path: '/locations' },
          { name: location.name, path: `/locations/${location.slug}` },
        ])}
        id="ld-crumbs-location"
      />

      <PageHero
        index={location.city}
        label={location.neighborhood}
        lines={[location.address.street, `${location.city}, ${location.address.region}`]}
        standfirst={location.standfirst}
        meta={[
          { k: 'Open', v: openDaysSummary(location.hours) },
          { k: 'Chairs', v: String(roster.length) },
          { k: 'Since', v: location.opened },
        ]}
        crumb={{ href: '/locations', label: 'All locations' }}
      >
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <BookButton
            intent={{ locationSlug: location.slug }}
            placement="location_page"
            size="lg"
            className="w-full sm:w-auto"
          >
            Book at {location.shortName}
          </BookButton>
          <TrackedAnchor
            href={location.phoneHref}
            event="phone_click"
            payload={{ placement: 'location_page', location: location.slug }}
            className="link-draw num text-lg text-bone"
          >
            {location.phone}
          </TrackedAnchor>
        </div>
      </PageHero>

      {/* ---- Map, hours, practicalities ------------------------------------ */}
      <section className="bg-ink py-14 lg:py-20" aria-labelledby="visit-heading">
        <div className="shell">
          <h2 id="visit-heading" className="sr-only">
            Finding {location.name}
          </h2>

          <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-7">
              <MapPanel location={location} className="aspect-[4/3] w-full" />
            </div>

            <div className="lg:col-span-5">
              <div className="flex items-baseline gap-4 border-b border-ink-line pb-4">
                <span className="label text-steel">Hours</span>
                <span className="ml-auto">
                  <TodayStatus size="sm" hours={location.hours} compact />
                </span>
              </div>
              <dl className="mt-6 space-y-3">
                {week.map((d) => (
                  <div
                    key={d.key}
                    className="flex items-baseline justify-between gap-4 border-b border-ink-line/60 pb-3"
                  >
                    <dt className="label text-steel-light">{d.label}</dt>
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

              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                <TrackedAnchor
                  href={locationDirectionsUrl(location)}
                  external
                  event="directions_click"
                  payload={{ placement: 'location_page', location: location.slug }}
                  className="link-draw label text-ember"
                >
                  Get directions
                </TrackedAnchor>
                <TrackedAnchor
                  href={location.phoneHref}
                  event="phone_click"
                  payload={{
                    placement: 'location_page_hours',
                    location: location.slug,
                  }}
                  className="link-draw label text-steel-light"
                >
                  Call this shop
                </TrackedAnchor>
              </div>
            </div>
          </div>

          <dl className="mt-14 grid gap-x-10 gap-y-8 border-t border-ink-line pt-10 sm:grid-cols-2 lg:grid-cols-4">
            {NOTES.map(([k, v]) => (
              <div key={k}>
                <dt className="label text-steel">{k}</dt>
                <dd className="mt-3 text-sm leading-relaxed text-steel-light">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ---- Who cuts here ------------------------------------------------- */}
      {roster.length > 0 && (
        <section
          className="on-bone bg-bone py-16 text-ink lg:py-24"
          aria-labelledby="roster-heading"
        >
          <div className="shell">
            <div className="flex items-baseline gap-4 border-b border-bone-line pb-4">
              <span className="label-sm text-ink-mute">
                {String(roster.length).padStart(2, '0')}
              </span>
              <span className="label text-ink-mute" id="roster-heading">
                Cutting at {location.shortName}
              </span>
              <Link href="/barbers" className="link-draw label ml-auto text-ink">
                Everyone
              </Link>
            </div>

            <ul className="mt-10 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {roster.map((barber) => (
                <li key={barber.slug}>
                  <BarberCard
                    barber={barber}
                    aspect="portrait"
                    tone="bone"
                    sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 30vw"
                  />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ---- The other shop ------------------------------------------------ */}
      {others.length > 0 && (
        <section className="bg-ink py-16 lg:py-24" aria-labelledby="others-heading">
          <div className="shell">
            <h2
              id="others-heading"
              className="label border-b border-ink-line pb-4 text-steel"
            >
              The other {others.length === 1 ? 'shop' : 'shops'}
            </h2>
            <ul className="mt-8 grid gap-8 sm:grid-cols-2">
              {others.map((other) => (
                <li key={other.slug}>
                  <Link href={`/locations/${other.slug}`} className="group block">
                    <Plate
                      src={other.media.image}
                      alt={other.media.alt}
                      aspect="landscape"
                      seed={other.media.seed}
                      sizes="(max-width: 640px) 92vw, 45vw"
                      className="transition-opacity group-hover:opacity-85"
                    />
                    <p className="display-sm mt-5 text-bone transition-colors group-hover:text-ember">
                      {other.name}
                    </p>
                    <p className="mt-2 text-sm text-steel-light">
                      {other.address.street}, {other.city} ·{' '}
                      {openDaysSummary(other.hours)}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ---- Practical questions ------------------------------------------ */}
      <section
        className="on-bone bg-bone py-16 text-ink lg:py-24"
        aria-labelledby="location-faq-heading"
      >
        <div className="shell">
          <h2 id="location-faq-heading" className="display-lg text-ink">
            Before you come.
          </h2>
          <div className="mt-10">
            <FaqList items={featuredFaqs} tone="bone" />
          </div>
          <Link href="/faq" className="link-draw label mt-8 inline-block text-ember-deep">
            All questions
          </Link>
        </div>
      </section>

      <FinalCta />
    </>
  );
}

import { PageHero } from '@/components/layout/PageHero';
import { MapPanel } from '@/components/ui/MapPanel';
import { TodayStatus } from '@/components/ui/TodayStatus';
import { FinalCta } from '@/components/sections/FinalCta';
import { JsonLd } from '@/components/seo/JsonLd';
import { Plate } from '@/components/ui/Plate';
import { Reveal, Stagger, StaggerItem } from '@/components/ui/Reveal';
import { BookButton } from '@/components/ui/BookButton';

import { pageMetadata, breadcrumbJsonLd } from '@/lib/seo';
import { business, fullAddress } from '@/data/business';
import { visitMedia } from '@/data/media';
import { weekSchedule } from '@/lib/hours';

export const metadata = pageMetadata({
  title: 'Visit the shop',
  description: `${business.name} is at ${fullAddress} — opening hours, parking, transit, walk-in policy and step-free access, plus what happens on a first visit. Call ${business.phone} or book online.`,
  path: '/visit',
});

const PRACTICAL = [
  {
    k: 'Parking',
    v: business.parking,
  },
  {
    k: 'Getting here',
    v: business.transit,
  },
  {
    k: 'Walk-ins',
    v: business.walkIns,
  },
  {
    k: 'Access',
    v: business.accessibility,
  },
];

const POLICIES = [
  {
    k: 'Running late',
    v: 'Call us. Under ten minutes is usually fine. Past that we may shorten the service rather than push everyone behind you.',
  },
  {
    k: 'Cancelling',
    v: 'Twelve hours notice, and there is no charge. Repeated no-shows mean we will ask for a card on file next time.',
  },
  {
    k: 'Bringing a kid',
    v: 'Book a Junior Cut so the chair is timed for it. Booster seat and a keepsake envelope for a first haircut.',
  },
  {
    k: 'Paying',
    v: 'Card, tap or cash. Tips on the card are fine and go to your barber.',
  },
  {
    k: 'Not happy',
    v: 'Tell us before you leave the chair, or call within a week. We will fix it, and we will not charge you to fix it.',
  },
  {
    k: 'Products',
    v: 'Four things on the shelf, all used on the floor. Nobody works on commission.',
  },
];

export default function VisitPage() {
  return (
    <>
      <JsonLd
        id="ld-breadcrumb-visit"
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Visit', path: '/visit' },
        ])}
      />

      <PageHero
        index="04"
        label="Visit"
        lines={['912 Chapel.', 'Ninth Square.', 'Door on the left.']}
        standfirst="Everything you might phone up to ask, answered here instead."
        meta={[
          { k: 'Address', v: business.address.street },
          { k: 'Phone', v: business.phone },
          { k: 'Neighbourhood', v: business.neighborhood },
        ]}
      >
        <Reveal delay={0.26}>
          <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
            <BookButton size="lg" className="w-full sm:w-auto">
              Book your chair
            </BookButton>
            <a
              href={business.phoneHref}
              className="label flex h-14 items-center justify-center border border-ink-line px-6 text-bone transition-colors hover:border-bone"
            >
              Call {business.phone}
            </a>
            <TodayStatus size="sm" className="sm:ml-2" />
          </div>
        </Reveal>
      </PageHero>

      {/* ---- Map + hours ---------------------------------------------------- */}
      <section className="bg-ink py-14 lg:py-20" aria-labelledby="where-heading">
        <div className="shell">
          <h2 id="where-heading" className="sr-only">
            Location and opening hours
          </h2>
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
            <Reveal className="lg:col-span-7">
              <MapPanel className="min-h-[24rem] lg:min-h-[32rem]" />
            </Reveal>

            <Reveal delay={0.1} className="lg:col-span-5">
              <p className="label border-b border-ink-line pb-3 text-steel">
                Opening hours
              </p>
              <dl className="mt-1">
                {weekSchedule.map((d) => {
                  const closed = d.display === 'Closed';
                  return (
                    <div
                      key={d.key}
                      className="flex items-baseline justify-between gap-4 border-b border-ink-line py-3.5"
                    >
                      <dt className={`label ${closed ? 'text-steel-dark' : 'text-bone'}`}>
                        {d.label}
                      </dt>
                      <dd
                        className={`num text-sm ${
                          closed ? 'text-steel-dark' : 'text-steel-light'
                        }`}
                      >
                        {d.display}
                      </dd>
                    </div>
                  );
                })}
              </dl>
              <p className="mt-4 text-xs leading-relaxed text-steel">
                Last appointment starts one service-length before close.
                Holiday hours go on the door and on the Google listing.
              </p>

              <address className="mt-8 not-italic">
                <p className="label text-steel">Address</p>
                <p className="display-sm mt-3 text-bone">
                  {business.address.street}, {business.address.unit}
                  <br />
                  {business.address.city}, {business.address.region}{' '}
                  {business.address.postalCode}
                </p>
                <a
                  href={`mailto:${business.email}`}
                  className="link-draw mt-4 inline-block text-sm text-steel-light"
                >
                  {business.email}
                </a>
              </address>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---- Practicalities -------------------------------------------------- */}
      <section
        className="on-bone bg-bone py-16 text-ink lg:py-24"
        aria-labelledby="practical-heading"
      >
        <div className="shell">
          <div className="flex items-baseline gap-4 border-b border-bone-line pb-4">
            <span className="label-sm text-ink-mute">Getting in</span>
            <span className="label text-ink-mute" id="practical-heading">
              Practicalities
            </span>
          </div>

          <Stagger className="mt-10 grid gap-px bg-bone-line sm:grid-cols-2 lg:grid-cols-4">
            {PRACTICAL.map((p) => (
              <StaggerItem key={p.k} className="bg-bone py-6 pr-6 sm:px-6 sm:first:pl-0">
                <p className="label text-ink-mute">{p.k}</p>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-soft">
                  {p.v}
                </p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ---- First visit + policies ------------------------------------------ */}
      <section className="bg-ink py-16 lg:py-24" aria-labelledby="first-heading">
        <div className="shell lg:grid lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <Plate
              src={visitMedia.image}
              alt={visitMedia.alt}
              aspect="landscape"
              variant="scene"
              seed={visitMedia.seed}
              sizes="(max-width: 1024px) 100vw, 40vw"
              caption="Shopfront"
            />
            <div className="mt-8">
              <h2 id="first-heading" className="display-lg text-bone">
                Your first time
              </h2>
              <p className="mt-5 text-[0.9375rem] leading-relaxed text-steel-light">
                Arrive five minutes early if you can. Your barber will look at
                your hair dry, ask how you wear it and what has annoyed you
                about the last few cuts, and tell you what will and will not
                work before anything is picked up.
              </p>
              <p className="mt-4 text-[0.9375rem] leading-relaxed text-steel-light">
                If you are not sure what to book, book The Cut. It is the
                easiest thing to adjust in the chair.
              </p>
            </div>
          </div>

          <div className="mt-14 lg:col-span-6 lg:col-start-7 lg:mt-0">
            <p className="label border-b border-ink-line pb-4 text-steel">
              Good to know
            </p>
            <dl className="mt-1">
              {POLICIES.map((p) => (
                <Reveal key={p.k} as="div" className="border-b border-ink-line py-5">
                  <dt className="display-sm text-bone">{p.k}</dt>
                  <dd className="mt-2.5 max-w-lg text-[0.9375rem] leading-relaxed text-steel-light">
                    {p.v}
                  </dd>
                </Reveal>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <FinalCta />
    </>
  );
}

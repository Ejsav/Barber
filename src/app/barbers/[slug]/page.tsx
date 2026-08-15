import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import { Plate } from '@/components/ui/Plate';
import { BookButton } from '@/components/ui/BookButton';
import { WorkCard } from '@/components/work/WorkCard';
import { ServiceRow } from '@/components/services/ServiceRow';
import { FinalCta } from '@/components/sections/FinalCta';
import { JsonLd } from '@/components/seo/JsonLd';
import { Reveal, RevealLines } from '@/components/ui/Reveal';

import { pageMetadata, breadcrumbJsonLd } from '@/lib/seo';
import { barberJsonLd } from '@/lib/jsonld';
import { business, weekdayLabels, weekdayOrder } from '@/data/business';
import { barbers, getBarber, specialtyLabels } from '@/data/barbers';
import { getService } from '@/data/services';
import { workByBarber } from '@/data/work';
import { reviewsForBarber } from '@/data/reviews';
import { visibleReviews } from '@/lib/content';
import { formatDayHours } from '@/lib/hours';

export function generateStaticParams() {
  return barbers.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const barber = getBarber(slug);
  if (!barber) return {};

  return pageMetadata({
    title: `${barber.name} — ${barber.role}`,
    description: `${barber.name} cuts at ${business.name} in ${business.locality}. ${barber.specialties
      .map((s) => specialtyLabels[s])
      .join(', ')}. ${barber.yearsCutting} years behind the chair, from $${barber.startingPrice}. See their work and book directly.`,
    path: `/barbers/${barber.slug}`,
  });
}

export default async function BarberPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const barber = getBarber(slug);
  if (!barber) notFound();

  const firstName = barber.name.split(' ')[0];
  const portfolio = workByBarber(barber.slug);
  const services = barber.serviceIds
    .map((id) => getService(id))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));
  const { items: barberReviews, isPlaceholder } = visibleReviews(
    reviewsForBarber(barber.slug),
  );
  const others = barbers.filter((b) => b.slug !== barber.slug);
  const jsonld = barberJsonLd(barber.slug);

  return (
    <>
      {jsonld && <JsonLd id={`ld-barber-${barber.slug}`} data={jsonld} />}
      <JsonLd
        id={`ld-breadcrumb-${barber.slug}`}
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Barbers', path: '/barbers' },
          { name: barber.name, path: `/barbers/${barber.slug}` },
        ])}
      />

      {/* ---- Hero --------------------------------------------------------- */}
      <header className="relative bg-ink">
        <div
          className="shell"
          style={{ paddingTop: 'calc(var(--header-h) + 2rem)' }}
        >
          <div className="flex items-baseline gap-4 border-b border-ink-line pb-4">
            <span className="label-sm text-steel-dark">Chair</span>
            <span className="label text-steel">{barber.role}</span>
            <Link href="/barbers" className="link-draw label ml-auto text-ember">
              ← All barbers
            </Link>
          </div>
        </div>

        <div className="shell mt-8 lg:mt-12 lg:grid lg:grid-cols-12 lg:gap-10">
          {/* Portrait */}
          <div className="lg:col-span-5">
            <Plate
              src={barber.portrait}
              alt={barber.portraitAlt}
              aspect="portrait"
              variant="portrait"
              seed={barber.seed}
              priority
              sizes="(max-width: 1024px) 100vw, 40vw"
              caption={`${firstName} — portrait`}
            />
          </div>

          {/* Identity + actions */}
          <div className="mt-8 lg:col-span-6 lg:col-start-7 lg:mt-0">
            <RevealLines
              as="h1"
              lines={[firstName, barber.name.split(' ').slice(1).join(' ')]}
              className="display-xl text-bone"
            />

            <Reveal delay={0.1}>
              <p className="body-lg mt-6 max-w-xl text-bone/80">
                “{barber.statement}”
              </p>
            </Reveal>

            <Reveal delay={0.18}>
              <dl className="mt-9 grid grid-cols-2 gap-x-8 gap-y-6 border-y border-ink-line py-6 sm:grid-cols-4">
                <div>
                  <dt className="label-sm text-steel-dark">Cutting</dt>
                  <dd className="num mt-1.5 text-base text-bone">
                    {barber.yearsCutting} yrs
                  </dd>
                </div>
                <div>
                  <dt className="label-sm text-steel-dark">From</dt>
                  <dd className="num mt-1.5 text-base text-bone">
                    ${barber.startingPrice}
                  </dd>
                </div>
                <div>
                  <dt className="label-sm text-steel-dark">In the shop</dt>
                  <dd className="num mt-1.5 text-base text-bone">
                    {barber.daysIn.length} days
                  </dd>
                </div>
                {barber.languages && (
                  <div>
                    <dt className="label-sm text-steel-dark">Also cuts in</dt>
                    <dd className="mt-1.5 text-base text-bone">
                      {barber.languages.join(', ')}
                    </dd>
                  </div>
                )}
              </dl>
            </Reveal>

            <Reveal delay={0.24}>
              <p className="label mt-6 text-steel">Specialities</p>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-steel-light">
                {barber.specialties.map((s) => specialtyLabels[s]).join(' · ')}
              </p>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
                <BookButton
                  intent={{ barberSlug: barber.slug }}
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  Book with {firstName}
                </BookButton>
                {barber.instagram && (
                  <a
                    href={barber.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="label flex h-14 items-center justify-center gap-2 border border-ink-line px-6 text-bone transition-colors hover:border-bone"
                  >
                    {barber.instagramHandle ?? 'Instagram'}
                  </a>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </header>

      {/* ---- Bio + schedule ------------------------------------------------ */}
      <section className="bg-ink py-16 lg:py-24" aria-labelledby="about-heading">
        <div className="shell lg:grid lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <h2
              id="about-heading"
              className="label border-b border-ink-line pb-4 text-steel"
            >
              About {firstName}
            </h2>
            <div className="mt-8 space-y-6">
              {barber.bio.map((para, i) => (
                <Reveal key={i} delay={i * 0.06}>
                  <p
                    className={
                      i === 0
                        ? 'text-lg leading-relaxed text-bone lg:text-xl'
                        : 'text-[0.9375rem] leading-relaxed text-steel-light'
                    }
                  >
                    {para}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>

          <div className="mt-12 lg:col-span-4 lg:col-start-9 lg:mt-0">
            <h3 className="label border-b border-ink-line pb-4 text-steel">
              Usually in the shop
            </h3>
            <dl className="mt-1">
              {weekdayOrder.map((day) => {
                const inShop = barber.daysIn.includes(day);
                const shopHours = business.hours[day];
                return (
                  <div
                    key={day}
                    className="flex items-baseline justify-between gap-4 border-b border-ink-line py-3"
                  >
                    <dt
                      className={`label ${inShop ? 'text-bone' : 'text-steel-dark'}`}
                    >
                      {weekdayLabels[day]}
                    </dt>
                    <dd
                      className={`num text-sm ${
                        inShop ? 'text-steel-light' : 'text-steel-dark'
                      }`}
                    >
                      {inShop ? formatDayHours(shopHours) : '—'}
                    </dd>
                  </div>
                );
              })}
            </dl>
            <p className="mt-4 text-xs leading-relaxed text-steel">
              Days in the shop, not live availability. Actual open slots appear
              in booking once the shop&rsquo;s scheduling system is connected.
            </p>
          </div>
        </div>
      </section>

      {/* ---- Their work ---------------------------------------------------- */}
      {portfolio.length > 0 && (
        <section className="bg-ink py-16 lg:py-24" aria-labelledby="work-heading">
          <div className="shell">
            <div className="flex items-baseline gap-4 border-b border-ink-line pb-4">
              <span className="label-sm text-steel-dark">
                {String(portfolio.length).padStart(2, '0')}
              </span>
              <span className="label text-steel">{firstName}&rsquo;s work</span>
              <Link href="/work" className="link-draw label ml-auto text-ember">
                The full book
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {portfolio.map((item, i) => (
                <Reveal key={item.id} delay={i * 0.06}>
                  <WorkCard
                    item={item}
                    aspect="portrait"
                    sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 23vw"
                  />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---- What they charge ---------------------------------------------- */}
      <section className="bg-ink py-16 lg:py-24" aria-labelledby="pricing-heading">
        <div className="shell">
          <div className="flex items-baseline gap-4 border-b border-ink-line pb-4">
            <span className="label-sm text-steel-dark">Menu</span>
            <span className="label text-steel" id="pricing-heading">
              What {firstName} takes
            </span>
            <Link href="/services" className="link-draw label ml-auto text-ember">
              Full menu
            </Link>
          </div>
          <ul className="mt-8 border-t border-ink-line">
            {services.map((service, i) => (
              <ServiceRow
                key={service.id}
                service={service}
                index={String(i + 1).padStart(2, '0')}
                size="md"
              />
            ))}
          </ul>
        </div>
      </section>

      {/* ---- Reviews naming them -------------------------------------------- */}
      {barberReviews.length > 0 && (
        <section
          className="on-bone bg-bone py-16 text-ink lg:py-24"
          aria-labelledby="barber-reviews"
        >
          <div className="shell">
            <div className="flex items-baseline gap-4 border-b border-bone-line pb-4">
              <span className="label-sm text-ink-mute">Words</span>
              <span className="label text-ink-mute" id="barber-reviews">
                People who booked {firstName}
              </span>
              {isPlaceholder && (
                <span className="label-sm ml-auto border border-ember-deep px-2 py-1 text-ember-deep">
                  Demo copy
                </span>
              )}
            </div>

            <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:gap-12">
              {barberReviews.map((r, i) => (
                <Reveal key={r.id} delay={i * 0.08}>
                  <figure>
                    <blockquote className="display-md text-ink">
                      {r.pull}
                    </blockquote>
                    {r.body && (
                      <p className="mt-4 max-w-lg text-[0.9375rem] leading-relaxed text-ink-mute">
                        {r.body}
                      </p>
                    )}
                    <figcaption className="label mt-5 text-ink-mute">
                      {r.author} · {r.source}
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---- Other barbers --------------------------------------------------- */}
      <section className="bg-ink py-16 lg:py-24" aria-labelledby="others-heading">
        <div className="shell">
          <h2
            id="others-heading"
            className="label border-b border-ink-line pb-4 text-steel"
          >
            Other chairs
          </h2>
          <ul className="mt-2">
            {others.map((b) => (
              <li key={b.slug} className="border-b border-ink-line">
                <Link
                  href={`/barbers/${b.slug}`}
                  className="group flex items-baseline gap-5 py-5 transition-colors hover:text-ember"
                >
                  <span className="display-md flex-1 text-bone transition-colors group-hover:text-ember">
                    {b.name}
                  </span>
                  <span className="label-sm hidden text-steel sm:block">
                    {b.specialties.map((s) => specialtyLabels[s]).join(' · ')}
                  </span>
                  <span className="num w-16 shrink-0 text-right text-sm text-steel-light">
                    ${b.startingPrice}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <FinalCta />
    </>
  );
}

import { notFound } from 'next/navigation';
import Link from 'next/link';

import { PageHero } from '@/components/layout/PageHero';
import { Plate } from '@/components/ui/Plate';
import { BookButton } from '@/components/ui/BookButton';
import { Reveal } from '@/components/ui/Reveal';
import { Rise } from '@/components/ui/HeroLines';
import { FinalCta } from '@/components/sections/FinalCta';
import { JsonLd } from '@/components/seo/JsonLd';

import { pageMetadata, breadcrumbJsonLd } from '@/lib/seo';
import { serviceJsonLd } from '@/lib/jsonld';
import { serviceHref } from '@/lib/services';
import { serviceDetail, detailedServiceIds } from '@/data/serviceDetail';
import {
  formatDuration,
  formatPrice,
  getService,
  serviceGroups,
  services,
} from '@/data/services';
import { barbers, specialtyLabels } from '@/data/barbers';
import { work, workSeed } from '@/data/work';
import { business } from '@/data/business';

/* Static params come from the detail file, not from the service list: a page
 * exists only where there is something worth reading on it. Everything else
 * links to its section of the menu instead — see lib/services.ts. */
export function generateStaticParams() {
  return detailedServiceIds.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getService(slug);
  const detail = serviceDetail[slug];
  if (!service || !detail) return {};

  return pageMetadata({
    title: `${service.name} — ${business.locality}`,
    description: detail.metaDescription,
    path: `/services/${slug}`,
  });
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getService(slug);
  const detail = serviceDetail[slug];
  if (!service || !detail) notFound();

  const group = serviceGroups.find((g) => g.id === service.group);
  const roster = barbers.filter((b) => b.serviceIds.includes(service.id));
  const gallery = work.filter((w) => w.category === detail.workCategory).slice(0, 3);
  const related = services
    .filter(
      (s) =>
        s.id !== service.id &&
        s.group === service.group &&
        s.id in serviceDetail,
    )
    .slice(0, 3);

  const structured = serviceJsonLd(slug);

  return (
    <>
      {structured && <JsonLd data={structured} id="ld-service" />}
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Services', path: '/services' },
          { name: service.name, path: `/services/${slug}` },
        ])}
        id="ld-crumbs-service"
      />

      <PageHero
        index={group?.name ?? 'Service'}
        label={service.name}
        lines={detail.lines}
        standfirst={detail.standfirst}
        meta={[
          { k: 'Price', v: formatPrice(service) },
          { k: 'Time', v: formatDuration(service.duration) },
          { k: 'Barbers', v: `${roster.length} of ${barbers.length}` },
        ]}
        crumb={{ href: '/services', label: 'Full menu' }}
      >
        <Rise delay={0.44}>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <BookButton
              intent={{ serviceId: service.id }}
              placement="service_page"
              size="lg"
              className="w-full sm:w-auto"
            >
              Book {service.name}
            </BookButton>
            <Link href="/find-your-cut" className="link-draw label text-steel-light">
              Not sure this is the one?
            </Link>
          </div>
          {service.note && (
            <p className="mt-6 max-w-xl text-sm text-steel">{service.note}</p>
          )}
        </Rise>
      </PageHero>

      {/* ---- What happens ------------------------------------------------- */}
      <section className="bg-ink py-16 lg:py-24" aria-labelledby="how-heading">
        <div className="shell lg:grid lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <div className="flex items-baseline gap-4 border-b border-ink-line pb-4">
              <span className="label-sm text-steel-dark">01</span>
              <span className="label text-steel" id="how-heading">
                The appointment
              </span>
            </div>
            <div className="mt-8 lg:sticky lg:top-32">
              <Plate
                src={null}
                alt={`${service.name} — reference plate`}
                aspect="portrait"
                variant="detail"
                seed={detail.seed}
                sizes="(max-width: 1024px) 100vw, 40vw"
                caption={`${formatPrice(service)} · ${formatDuration(service.duration)}`}
              />
            </div>
          </div>

          <div className="mt-10 lg:col-span-6 lg:col-start-7 lg:mt-0">
            <ol className="border-t border-ink-line">
              {detail.steps.map((step, i) => (
                <Reveal
                  as="li"
                  key={i}
                  delay={i * 0.06}
                  className="flex gap-6 border-b border-ink-line py-6"
                >
                  <span className="label-sm shrink-0 pt-1 text-ember">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="flex-1 leading-relaxed text-steel-light">{step}</p>
                </Reveal>
              ))}
            </ol>

            <div className="mt-12 grid gap-10 sm:grid-cols-2">
              <div>
                <p className="label text-steel">Book this if</p>
                <ul className="mt-4 space-y-3">
                  {detail.suits.map((line) => (
                    <li key={line} className="flex gap-3 text-sm leading-relaxed text-bone">
                      <span aria-hidden="true" className="text-ember">
                        ·
                      </span>
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="label text-steel">Worth knowing</p>
                <ul className="mt-4 space-y-3">
                  {detail.honest.map((line) => (
                    <li
                      key={line}
                      className="text-sm leading-relaxed text-steel-light"
                    >
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Who cuts it -------------------------------------------------- */}
      {roster.length > 0 && (
        <section
          className="on-bone bg-bone py-16 text-ink lg:py-24"
          aria-labelledby="who-heading"
        >
          <div className="shell">
            <div className="flex items-baseline gap-4 border-b border-bone-line pb-4">
              <span className="label-sm text-ink-mute">02</span>
              <span className="label text-ink-mute" id="who-heading">
                Who takes it
              </span>
              <Link href="/barbers" className="link-draw label ml-auto text-ink">
                The roster
              </Link>
            </div>

            <ul className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
              {roster.map((barber) => (
                <li key={barber.slug}>
                  <Link href={`/barbers/${barber.slug}`} className="group block">
                    <Plate
                      src={barber.portrait}
                      alt={barber.portraitAlt}
                      aspect="portrait"
                      variant="portrait"
                      seed={barber.seed}
                      sizes="(max-width: 640px) 92vw, (max-width: 1024px) 45vw, 22vw"
                      className="transition-opacity group-hover:opacity-85"
                    />
                    <p className="display-sm mt-4 text-ink transition-colors group-hover:text-ember-deep">
                      {barber.name}
                    </p>
                  </Link>
                  <p className="label-sm mt-2 text-ink-mute">
                    {barber.specialties.map((s) => specialtyLabels[s]).join(' · ')}
                  </p>
                  <div className="mt-4">
                    <BookButton
                      intent={{ barberSlug: barber.slug, serviceId: service.id }}
                      placement="service_page_barber"
                      size="sm"
                      flat
                    >
                      Book {barber.name.split(' ')[0]}
                    </BookButton>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ---- The work ----------------------------------------------------- */}
      {gallery.length > 0 && (
        <section className="bg-ink py-16 lg:py-24" aria-labelledby="proof-heading">
          <div className="shell">
            <div className="flex items-baseline gap-4 border-b border-ink-line pb-4">
              <span className="label-sm text-steel-dark">03</span>
              <span className="label text-steel" id="proof-heading">
                Recent work
              </span>
              <Link href="/work" className="link-draw label ml-auto text-ember">
                The full book
              </Link>
            </div>
            <ul className="mt-10 grid gap-6 sm:grid-cols-3">
              {gallery.map((item) => (
                <li key={item.id}>
                  <Plate
                    src={item.image}
                    alt={item.alt}
                    aspect="portrait"
                    seed={workSeed(item)}
                    sizes="(max-width: 640px) 92vw, 30vw"
                  />
                  <p className="label-sm mt-3 text-steel">{item.title}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ---- Related ------------------------------------------------------ */}
      {related.length > 0 && (
        <section className="bg-ink pb-16 lg:pb-24" aria-labelledby="related-heading">
          <div className="shell">
            <h2
              id="related-heading"
              className="label border-b border-ink-line pb-4 text-steel"
            >
              Also on the menu
            </h2>
            <ul>
              {related.map((s) => (
                <li key={s.id} className="border-b border-ink-line">
                  <Link
                    href={serviceHref(s)}
                    className="group flex items-baseline gap-5 py-5 transition-colors hover:text-ember"
                  >
                    <span className="display-sm flex-1 text-bone transition-colors group-hover:text-ember">
                      {s.name}
                    </span>
                    <span className="num text-sm text-steel">
                      {formatPrice(s)} · {formatDuration(s.duration)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <FinalCta />
    </>
  );
}

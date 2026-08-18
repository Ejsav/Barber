import { notFound } from 'next/navigation';
import Link from 'next/link';

import { PageHero } from '@/components/layout/PageHero';
import { Plate } from '@/components/ui/Plate';
import { Reveal } from '@/components/ui/Reveal';
import { JsonLd } from '@/components/seo/JsonLd';

import { pageMetadata, breadcrumbJsonLd } from '@/lib/seo';
import { careers, openPositions } from '@/data/careers';
import { business } from '@/data/business';
import { barbers } from '@/data/barbers';
import { shopMedia } from '@/data/media';

export const metadata = pageMetadata({
  title: 'Join the shop',
  description: `Chair rental, commission and apprenticeship openings at ${business.name} in ${business.locality}. What the shop gives a barber, and how to apply.`,
  path: '/careers',
});

export default function CareersPage() {
  /* The flag is the whole gate: a shop that is not hiring should not have a
   * page telling barbers it might be. */
  if (!careers.enabled) notFound();

  const email = careers.apply.email ?? business.email;

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Join the shop', path: '/careers' },
        ])}
        id="ld-crumbs-careers"
      />

      <PageHero
        index="00"
        label="Join the shop"
        lines={[...careers.headline]}
        standfirst={careers.standfirst}
        meta={[
          { k: 'Open now', v: String(openPositions.length) },
          { k: 'Team', v: String(barbers.length) },
          { k: 'Since', v: business.founded },
        ]}
      />

      {/* ---- What you get -------------------------------------------------- */}
      <section className="bg-ink py-16 lg:py-24" aria-labelledby="offer-heading">
        <div className="shell lg:grid lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <div className="flex items-baseline gap-4 border-b border-ink-line pb-4">
              <span className="label-sm text-steel-dark">01</span>
              <span className="label text-steel" id="offer-heading">
                What the shop gives you
              </span>
            </div>
            <ul className="mt-8 space-y-5">
              {careers.offers.map((line) => (
                <li key={line} className="flex gap-4 leading-relaxed text-bone">
                  <span aria-hidden="true" className="text-ember">
                    ·
                  </span>
                  {line}
                </li>
              ))}
            </ul>

            <div className="mt-12">
              <p className="label text-steel">Who it suits</p>
              <ul className="mt-5 space-y-4">
                {careers.looksLike.map((line) => (
                  <li key={line} className="text-sm leading-relaxed text-steel-light">
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 lg:col-span-6 lg:col-start-7 lg:mt-0">
            <Plate
              src={shopMedia[0].image}
              alt={shopMedia[0].alt}
              aspect="portrait"
              seed={shopMedia[0].seed}
              sizes="(max-width: 1024px) 92vw, 45vw"
              caption="The floor"
            />
          </div>
        </div>
      </section>

      {/* ---- Positions ----------------------------------------------------- */}
      <section
        className="on-bone bg-bone py-16 text-ink lg:py-24"
        aria-labelledby="positions-heading"
      >
        <div className="shell">
          <div className="flex items-baseline gap-4 border-b border-bone-line pb-4">
            <span className="label-sm text-ink-mute">02</span>
            <span className="label text-ink-mute" id="positions-heading">
              Positions
            </span>
          </div>

          <ul className="mt-4">
            {careers.positions.map((position, i) => (
              <Reveal
                as="li"
                key={position.id}
                delay={i * 0.06}
                className="border-b border-bone-line py-8 lg:py-10"
              >
                <div className="lg:grid lg:grid-cols-12 lg:gap-10">
                  <div className="lg:col-span-5">
                    <div className="flex items-center gap-4">
                      <h2 className="display-md text-ink">{position.title}</h2>
                      {!position.open && (
                        <span className="label-sm border border-ink-mute px-2 py-1 text-ink-mute">
                          Not open
                        </span>
                      )}
                    </div>
                    <p className="mt-3 max-w-md text-ink-mute">{position.summary}</p>
                    {position.terms && (
                      <p className="num mt-4 text-sm text-ink">{position.terms}</p>
                    )}
                  </div>
                  <ul className="mt-6 space-y-3 lg:col-span-6 lg:col-start-7 lg:mt-0">
                    {position.details.map((d) => (
                      <li key={d} className="flex gap-4 text-sm leading-relaxed text-ink">
                        <span aria-hidden="true" className="text-ember-deep">
                          ·
                        </span>
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ---- Apply ---------------------------------------------------------- */}
      <section className="bg-ink py-16 lg:py-24" aria-labelledby="apply-heading">
        <div className="shell lg:grid lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <h2 id="apply-heading" className="display-lg text-bone">
              How to apply.
            </h2>
          </div>
          <div className="mt-6 lg:col-span-6 lg:col-start-7 lg:mt-2">
            <p className="body-lg text-bone/70">{careers.apply.intro}</p>
            {/* Recruitment is not a conversion event — the analytics layer
                measures bookings, not job applications. A plain link. */}
            <a
              href={`mailto:${email}?subject=${encodeURIComponent(
                `Barber application — ${business.name}`,
              )}`}
              className="link-draw mt-8 inline-block text-xl text-ember"
            >
              {email}
            </a>
            <p className="mt-5 text-sm text-steel">{careers.apply.note}</p>
            <p className="mt-10 text-sm text-steel-light">
              Not a barber but want a chair?{' '}
              <Link href="/find-your-cut" className="link-draw text-bone">
                Find your cut
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

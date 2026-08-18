import { notFound } from 'next/navigation';
import Link from 'next/link';

import { PageHero } from '@/components/layout/PageHero';
import { Plate } from '@/components/ui/Plate';
import { Reveal } from '@/components/ui/Reveal';
import { BookButton } from '@/components/ui/BookButton';
import { JsonLd } from '@/components/seo/JsonLd';

import { pageMetadata, breadcrumbJsonLd } from '@/lib/seo';
import { heroTone } from '@/lib/heroTone';
import { events } from '@/data/events';
import { business } from '@/data/business';
import { shopMedia } from '@/data/media';

export const metadata = pageMetadata({
  title: 'Weddings & groups',
  description: `Groom and groomsmen grooming at ${business.name}, ${business.locality} — private shop mornings, group bookings and on-location barbering across greater New Haven.`,
  path: '/weddings',
});

export default function WeddingsPage() {
  /* Advertising a service the shop will then decline is worse than not
   * advertising it at all. One flag, one gate. */
  if (!events.enabled) notFound();

  const email = events.enquiry.email ?? business.email;

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Weddings & groups', path: '/weddings' },
        ])}
        id="ld-crumbs-weddings"
      />

      <PageHero
        index="00"
        label="Weddings & groups"
        lines={[...events.headline]}
        standfirst={events.standfirst}
        meta={[
          { k: 'Packages', v: String(events.packages.length) },
          { k: 'Lead time', v: '6–8 weeks' },
          { k: 'Travel', v: '40 min radius' },
        ]}
        tone={heroTone('/weddings')}
      />

      {/* ---- Packages ------------------------------------------------------ */}
      <section
        className="on-bone bg-bone pb-16 text-ink lg:pb-24"
        aria-labelledby="packages-heading"
      >
        <div className="shell">
          <h2 id="packages-heading" className="sr-only">
            Packages
          </h2>
          <ul className="border-t border-bone-line">
            {events.packages.map((pkg, i) => (
              <Reveal
                as="li"
                key={pkg.id}
                delay={i * 0.06}
                className="border-b border-bone-line py-10 lg:py-14"
              >
                <div className="lg:grid lg:grid-cols-12 lg:gap-10">
                  <div className="lg:col-span-5">
                    <span className="label-sm text-ink-mute">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="display-lg mt-4 text-ink">{pkg.name}</h3>
                    <p className="mt-4 max-w-md text-ink-mute">{pkg.summary}</p>

                    <dl className="mt-7 flex flex-wrap gap-x-10 gap-y-4">
                      <div>
                        <dt className="label-sm text-ink-mute">Party</dt>
                        <dd className="num mt-1.5 text-sm text-ink">{pkg.people}</dd>
                      </div>
                      <div>
                        <dt className="label-sm text-ink-mute">Time</dt>
                        <dd className="num mt-1.5 text-sm text-ink">{pkg.duration}</dd>
                      </div>
                      <div>
                        <dt className="label-sm text-ink-mute">Price</dt>
                        <dd className="num mt-1.5 text-sm text-ink">
                          {/* A price nobody can quote sight unseen is quoted as
                              exactly that, not as a number with an asterisk. */}
                          {pkg.price === null
                            ? 'On enquiry'
                            : `${pkg.from ? 'from ' : ''}$${pkg.price}${
                                pkg.perPerson ? ' pp' : ''
                              }`}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <ul className="mt-8 space-y-3 lg:col-span-6 lg:col-start-7 lg:mt-0">
                    {pkg.includes.map((line) => (
                      <li
                        key={line}
                        className="flex gap-4 border-b border-bone-line pb-3 text-sm leading-relaxed text-ink"
                      >
                        <span aria-hidden="true" className="text-ember-deep">
                          ·
                        </span>
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ---- How it runs --------------------------------------------------- */}
      <section className="bg-ink py-16 lg:py-24" aria-labelledby="notes-heading">
        <div className="shell lg:grid lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <Plate
              src={shopMedia[1].image}
              alt={shopMedia[1].alt}
              aspect="landscape"
              seed={shopMedia[1].seed}
              sizes="(max-width: 1024px) 92vw, 45vw"
              caption="Before opening"
            />
          </div>
          <div className="mt-10 lg:col-span-5 lg:col-start-8 lg:mt-0">
            <div className="flex items-baseline gap-4 border-b border-ink-line pb-4">
              <span className="label-sm text-steel-dark">◆</span>
              <span className="label text-steel" id="notes-heading">
                How it runs
              </span>
            </div>
            <ul className="mt-8 space-y-6">
              {events.notes.map((note) => (
                <li key={note} className="leading-relaxed text-bone/80">
                  {note}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ---- Enquire -------------------------------------------------------- */}
      <section
        className="bg-ember py-16 text-ink lg:py-24"
        aria-labelledby="enquire-heading"
      >
        <div className="shell lg:grid lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <h2 id="enquire-heading" className="display-xl text-ink">
              Tell us the date.
            </h2>
          </div>
          <div className="mt-6 lg:col-span-5 lg:col-start-8 lg:mt-2">
            <p className="body-lg text-ink">{events.enquiry.intro}</p>
            <a
              href={`mailto:${email}?subject=${encodeURIComponent(
                `Wedding enquiry — ${business.name}`,
              )}`}
              className="link-draw mt-8 inline-block text-xl text-ink"
            >
              {email}
            </a>
            <p className="num mt-4 text-lg text-ink">{business.phone}</p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <BookButton
                intent={{ serviceId: 'cut-royal' }}
                placement="weddings"
                size="md"
                className="w-full border border-ink bg-ink text-bone hover:bg-bone hover:text-ink sm:w-auto"
              >
                Book the groom&rsquo;s cut
              </BookButton>
              <Link href="/services" className="link-draw label text-ink">
                Full menu
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

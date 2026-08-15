import { PageHero } from '@/components/layout/PageHero';
import { BarberCard } from '@/components/barbers/BarberCard';
import { FinalCta } from '@/components/sections/FinalCta';
import { JsonLd } from '@/components/seo/JsonLd';
import { Stagger, StaggerItem, Reveal } from '@/components/ui/Reveal';

import { pageMetadata, breadcrumbJsonLd, siteUrl } from '@/lib/seo';
import { business } from '@/data/business';
import { barbers, specialtyLabels, type SpecialtyId } from '@/data/barbers';

export const metadata = pageMetadata({
  title: 'The barbers',
  description: `Meet the ${barbers.length} barbers at ${business.name} in ${business.locality}. Skin fades, textured and coily hair, classic scissor work, straight-razor shaves and kids' cuts — book the barber whose work fits what you want.`,
  path: '/barbers',
});

/* Which specialities exist across the roster, and who covers each. */
const specialtyIndex = (Object.keys(specialtyLabels) as SpecialtyId[])
  .map((id) => ({
    id,
    label: specialtyLabels[id],
    people: barbers.filter((b) => b.specialties.includes(id)),
  }))
  .filter((s) => s.people.length > 0);

const PLACEMENT = [
  'lg:col-span-4',
  'lg:col-span-4 lg:mt-16',
  'lg:col-span-4 lg:mt-32',
  'lg:col-span-4 lg:-mt-8',
  'lg:col-span-4 lg:mt-8',
];

export default function BarbersPage() {
  return (
    <>
      <JsonLd
        id="ld-breadcrumb-barbers"
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Barbers', path: '/barbers' },
        ])}
      />
      <JsonLd
        id="ld-roster"
        data={{
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: `Barbers at ${business.name}`,
          itemListElement: barbers.map((b, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            url: `${siteUrl}/barbers/${b.slug}`,
            name: b.name,
          })),
        }}
      />

      <PageHero
        index="02"
        label="The roster"
        lines={['Five hands.', 'Pick the one', 'that fits.']}
        standfirst="A barbershop is not interchangeable staff behind interchangeable chairs. Here is what each of them is actually good at, in their own words."
        meta={[
          { k: 'Barbers', v: String(barbers.length) },
          {
            k: 'Combined',
            v: `${barbers.reduce((n, b) => n + b.yearsCutting, 0)} yrs`,
          },
          { k: 'From', v: `$${Math.min(...barbers.map((b) => b.startingPrice))}` },
        ]}
      />

      {/* Speciality index — an at-a-glance answer to "who does my hair?" */}
      <section className="bg-ink pb-6" aria-labelledby="specialty-index">
        <div className="shell">
          <h2 id="specialty-index" className="label border-b border-ink-line pb-4 text-steel">
            By speciality
          </h2>
          <Stagger className="grid gap-px border-b border-ink-line bg-ink-line sm:grid-cols-2 lg:grid-cols-3">
            {specialtyIndex.map((s) => (
              <StaggerItem key={s.id} className="bg-ink py-5 pr-6 sm:px-6 sm:first:pl-0">
                <p className="display-sm text-bone">{s.label}</p>
                <p className="label-sm mt-2.5 text-steel-light">
                  {s.people.map((p) => p.name.split(' ')[0]).join(' · ')}
                </p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="bg-ink py-14 lg:py-20" aria-label="Barber profiles">
        <div className="shell">
          <Stagger
            className="grid grid-cols-1 gap-x-6 gap-y-16 sm:grid-cols-2 lg:grid-cols-12 lg:gap-y-20"
            amount={0.08}
          >
            {barbers.map((barber, i) => (
              <StaggerItem
                key={barber.slug}
                className={PLACEMENT[i % PLACEMENT.length]}
              >
                <BarberCard
                  barber={barber}
                  aspect={i % 3 === 0 ? 'tall' : 'portrait'}
                  tone="ink"
                  priority={i < 2}
                  sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 31vw"
                />
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal className="mt-20 border-t border-ink-line pt-10">
            <p className="max-w-2xl text-[0.9375rem] leading-relaxed text-steel-light">
              Booking with a specific barber sometimes means waiting a few more
              days. It is usually worth it — but if you need a cut this week,
              call the shop and we will tell you honestly who has time and who
              is right for what you are after.
            </p>
          </Reveal>
        </div>
      </section>

      <FinalCta />
    </>
  );
}

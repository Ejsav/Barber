import Link from 'next/link';

import { PageHero } from '@/components/layout/PageHero';
import { ServiceRow } from '@/components/services/ServiceRow';
import { FinalCta } from '@/components/sections/FinalCta';
import { PromotionsSection } from '@/components/sections/PromotionsSection';
import { GiftCardLink } from '@/components/ui/GiftCardLink';
import { JsonLd } from '@/components/seo/JsonLd';
import { Reveal } from '@/components/ui/Reveal';

import { pageMetadata, breadcrumbJsonLd } from '@/lib/seo';
import { business } from '@/data/business';
import {
  formatDuration,
  priceFloor,
  serviceGroups,
  services,
  servicesByGroup,
} from '@/data/services';

export const metadata = pageMetadata({
  title: 'Services & prices',
  description: `Full barbering menu at ${business.name} in ${business.locality} — haircuts from $${priceFloor}, skin fades, scissor work, beard sculpting, straight-razor shaves, kids and grey blending. Prices and durations listed in full.`,
  path: '/services',
});

export default function ServicesPage() {
  const longest = Math.max(...services.map((s) => s.duration));

  return (
    <>
      <JsonLd
        id="ld-breadcrumb-services"
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Services', path: '/services' },
        ])}
      />

      <PageHero
        index="01"
        label="Services & prices"
        lines={['Everything', 'we do, and', 'what it costs.']}
        standfirst="No consultation fee, no surprise add-ons at the till, and nothing here you have to phone up to find the price of."
        meta={[
          { k: 'Services', v: String(services.length) },
          { k: 'From', v: `$${priceFloor}` },
          { k: 'Longest', v: formatDuration(longest) },
          { k: 'Consultation', v: 'Included' },
        ]}
      />

      <div className="bg-ink pb-8">
        {serviceGroups.map((group, gi) => {
          const list = servicesByGroup(group.id);
          if (list.length === 0) return null;

          return (
            <section
              key={group.id}
              id={group.id}
              className="shell scroll-mt-28 py-14 lg:py-20"
              aria-labelledby={`group-${group.id}`}
            >
              <div className="lg:grid lg:grid-cols-12 lg:gap-10">
                <div className="lg:col-span-4 lg:sticky lg:top-32 lg:self-start">
                  <div className="flex items-baseline gap-4 border-b border-ink-line pb-4">
                    <span className="label-sm text-steel-dark">
                      {String(gi + 1).padStart(2, '0')}
                    </span>
                    <span className="label text-steel">{group.name}</span>
                  </div>
                  <h2
                    id={`group-${group.id}`}
                    className="display-lg mt-6 text-bone"
                  >
                    {group.name}
                  </h2>
                  <p className="mt-5 max-w-sm text-[0.9375rem] leading-relaxed text-steel-light">
                    {group.blurb}
                  </p>
                </div>

                <ul className="mt-10 border-t border-ink-line lg:col-span-8 lg:mt-0">
                  {list.map((service, i) => (
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
          );
        })}

        <div className="shell pb-16">
          <Reveal className="grid gap-8 border-t border-ink-line pt-10 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <p className="label text-ember">Not sure what to book</p>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-steel-light">
                Book The Cut. Your barber will tell you in the chair if a fade
                or scissor work suits you better and adjust the booking there —
                you are not locked into what you clicked.{' '}
                <Link href="/find-your-cut" className="link-draw text-bone">
                  Or let the explorer name it
                </Link>
                .
              </p>
            </div>
            <div>
              <p className="label text-ember">Running late</p>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-steel-light">
                Call the shop. Under ten minutes we will usually still fit you
                in; past that we may need to shorten the service so the next
                appointment is not pushed.
              </p>
            </div>
            <div>
              <p className="label text-ember">Who cuts what</p>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-steel-light">
                Not every barber takes every service. The{' '}
                <Link href="/barbers" className="link-draw text-bone">
                  roster
                </Link>{' '}
                lists what each of them does, and booking filters to the right
                people once you pick a service.
              </p>
            </div>
            <div>
              <p className="label text-ember">Gift cards</p>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-steel-light">
                {business.giftCards.blurb}
              </p>
              <GiftCardLink
                placement="services"
                label="Gift cards"
                className="link-draw label mt-3 inline-block text-bone"
              />
            </div>
          </Reveal>
        </div>
      </div>

      <PromotionsSection />

      <FinalCta />
    </>
  );
}

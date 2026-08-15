import Link from 'next/link';

import { SectionHead } from '@/components/ui/SectionHead';
import { ServiceRow } from '@/components/services/ServiceRow';
import { Reveal } from '@/components/ui/Reveal';
import { featuredServices, services } from '@/data/services';

export function ServiceSelector() {
  return (
    <section className="relative bg-ink py-20 lg:py-32" aria-labelledby="services-heading">
      <div className="shell">
        <SectionHead
          index="01"
          label="The menu"
          lines={['Three ways', 'to sit down.']}
          standfirst="Most visits are one of these. The full menu runs longer — kids, seniors, grey blending, razor work and the ninety-minute reset."
          link={{ href: '/services', label: `All ${services.length} services` }}
        />

        <ul className="mt-14 border-t border-ink-line lg:mt-20">
          {featuredServices.map((service, i) => (
            <ServiceRow
              key={service.id}
              service={service}
              index={String(i + 1).padStart(2, '0')}
            />
          ))}
        </ul>

        <Reveal className="mt-10 flex flex-wrap items-center justify-between gap-6">
          <p className="max-w-md text-sm leading-relaxed text-steel-light">
            Not sure which one? Book The Cut. Your barber will tell you in the
            chair if something else fits better, and adjust it there.
          </p>
          <Link href="/services" className="link-draw label text-ember">
            See the full menu and prices
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

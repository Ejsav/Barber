import { SectionHead } from '@/components/ui/SectionHead';
import { BarberCard } from '@/components/barbers/BarberCard';
import { Stagger, StaggerItem } from '@/components/ui/Reveal';
import { barbers } from '@/data/barbers';

/* Explicit placement on a twelve-column grid. The columns each barber lands in
 * are chosen rather than flowed: two rows that deliberately do not fill, with
 * different widths, heights and vertical offsets, so the roster reads as a
 * spread instead of a row of equal tiles. */
const PLACEMENT = [
  { span: 'lg:col-start-1 lg:col-span-4', aspect: 'tall' as const, offset: '' },
  { span: 'lg:col-start-6 lg:col-span-3', aspect: 'portrait' as const, offset: 'lg:mt-28' },
  { span: 'lg:col-start-10 lg:col-span-3', aspect: 'portrait' as const, offset: 'lg:mt-10' },
  { span: 'lg:col-start-2 lg:col-span-3', aspect: 'portrait' as const, offset: 'lg:mt-16' },
  { span: 'lg:col-start-6 lg:col-span-4', aspect: 'tall' as const, offset: '' },
];

export function BarberSelection() {
  return (
    <section
      className="on-bone relative bg-bone py-20 text-ink lg:py-32"
      aria-labelledby="barbers-heading"
    >
      <div className="shell">
        <SectionHead
          index="03"
          label="The roster"
          lines={['Who cuts your', 'hair matters.']}
          standfirst="Five barbers, five different hands. Read how they work, then book the one who fits what you want — not whoever happens to be free."
          link={{ href: '/barbers', label: 'All barbers' }}
          tone="bone"
        />

        <Stagger
          className="mt-14 grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:mt-20 lg:grid-cols-12 lg:gap-y-16"
          amount={0.1}
        >
          {barbers.map((barber, i) => {
            const p = PLACEMENT[i] ?? PLACEMENT[PLACEMENT.length - 1];
            return (
              <StaggerItem key={barber.slug} className={`${p.span} ${p.offset}`}>
                <BarberCard
                  barber={barber}
                  aspect={p.aspect}
                  tone="bone"
                  sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 30vw"
                />
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}

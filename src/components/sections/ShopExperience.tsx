import { Plate } from '@/components/ui/Plate';
import { RevealLines, Reveal, Stagger, StaggerItem } from '@/components/ui/Reveal';
import { shopMedia } from '@/data/media';

/* ----------------------------------------------------------------------------
 * THE ROOM
 *
 * What it is like to be here, told with pictures and specifics rather than a
 * paragraph claiming the shop is comfortable. The plates sit at five different
 * sizes and vertical offsets and two of them break the container — the grid is
 * deliberately not square here.
 * -------------------------------------------------------------------------- */

const DETAILS = [
  ['Sound', 'Records, not a playlist. Ask and we will change it.'],
  ['Drink', 'Espresso, seltzer, or a beer after four on Fridays.'],
  ['Wait', 'A bench by the window and no pressure to fill the silence.'],
  ['Retail', 'Four products on the shelf. Nobody will mention them.'],
  ['Kids', 'Booster seat, patience, and a keepsake envelope for a first cut.'],
  ['Cash', 'Card, tap or cash. Tips on the card are fine.'],
];

/* Uneven by design: sizes, spans and offsets all differ. */
const FRAMES = [
  { cls: 'col-span-2 lg:col-span-7', aspect: 'landscape' as const, off: '' },
  { cls: 'col-span-1 lg:col-span-5 lg:mt-20', aspect: 'tall' as const, off: '' },
  { cls: 'col-span-1 lg:col-span-4 lg:-mt-24', aspect: 'portrait' as const, off: '' },
  { cls: 'col-span-2 lg:col-span-5 lg:mt-8', aspect: 'square' as const, off: '' },
  { cls: 'col-span-2 lg:col-span-3 lg:mt-32', aspect: 'tall' as const, off: '' },
];

export function ShopExperience() {
  return (
    <section className="relative bg-ink py-20 lg:py-32" aria-labelledby="room-heading">
      <div className="shell">
        <div className="flex items-baseline gap-4 border-b border-ink-line pb-4">
          <span className="label-sm text-steel-dark">08</span>
          <span className="label text-steel">The room</span>
        </div>

        <div className="mt-8 lg:mt-12 lg:grid lg:grid-cols-12 lg:gap-10">
          <RevealLines
            as="h2"
            id="room-heading"
            lines={['Clippers, records,', 'and nobody selling', 'you pomade.']}
            className="display-lg text-bone lg:col-span-7"
          />
          <Reveal delay={0.15} className="mt-6 lg:col-span-4 lg:col-start-9 lg:mt-2">
            <p className="body-lg text-bone/70">
              Twelve hundred square feet on Chapel Street: five chairs, a long
              mirror, a bench by the window and a room that stays warm in
              February.
            </p>
          </Reveal>
        </div>

        {/* Plate wall */}
        <div className="mt-14 grid grid-cols-2 gap-4 lg:mt-20 lg:grid-cols-12 lg:gap-6">
          {shopMedia.map((m, i) => {
            const f = FRAMES[i % FRAMES.length];
            return (
              <Reveal
                key={m.seed}
                delay={(i % 3) * 0.08}
                className={`${f.cls} ${f.off}`}
              >
                <Plate
                  src={m.image}
                  alt={m.alt}
                  aspect={f.aspect}
                  variant={i % 2 === 0 ? 'scene' : 'detail'}
                  seed={m.seed}
                  sizes="(max-width: 640px) 46vw, (max-width: 1024px) 46vw, 40vw"
                  caption={['Chairs', 'Tools', 'Floor', 'Records', 'Window'][i]}
                />
              </Reveal>
            );
          })}
        </div>

        {/* Specifics */}
        <Stagger className="mt-16 grid gap-px border-t border-ink-line bg-ink-line sm:grid-cols-2 lg:mt-20 lg:grid-cols-3">
          {DETAILS.map(([k, v]) => (
            <StaggerItem key={k} className="bg-ink py-6 pr-6 sm:px-6 sm:first:pl-0">
              <p className="label text-ember">{k}</p>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-steel-light">
                {v}
              </p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

import Link from 'next/link';

import { Plate, type PlateAspect } from '@/components/ui/Plate';
import { BookLink } from '@/components/ui/BookLink';
import { getBarber } from '@/data/barbers';
import { workCategories, workSeed, type WorkItem } from '@/data/work';
import { cn } from '@/lib/cn';

/* ----------------------------------------------------------------------------
 * One frame in the lookbook. Attribution is part of the composition, not a
 * caption bolted underneath — the barber's name is a link, because a customer
 * who likes a cut should be one tap from the person who did it.
 *
 * And every frame ends in an action. Browsing a gallery is the single easiest
 * place on a barbershop site to run out of road, so BOOK THIS LOOK carries the
 * frame's barber AND its service into the booking flow: the cut you pointed at
 * is the appointment you get.
 * -------------------------------------------------------------------------- */

export function WorkCard({
  item,
  aspect,
  sizes = '(max-width: 768px) 92vw, (max-width: 1280px) 46vw, 31vw',
  priority = false,
  className,
}: {
  item: WorkItem;
  aspect?: PlateAspect;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  const barber = getBarber(item.barber);
  const category = workCategories.find((c) => c.id === item.category);

  return (
    <figure className={cn('group relative', className)}>
      <div className="relative overflow-hidden bg-ink-panel">
        <div className="transition-transform duration-[1200ms] ease-[var(--ease-out-expo)] motion-safe:group-hover:scale-[1.04]">
          <Plate
            src={item.image}
            alt={item.alt}
            aspect={aspect ?? (item.aspect as PlateAspect)}
            variant="detail"
            seed={workSeed(item)}
            sizes={sizes}
            priority={priority}
          />
        </div>

        {/* Category tick — one small mark, no pill. It sits over photography,
            so it carries its own scrim rather than relying on a blend mode to
            land on a light enough part of the frame. */}
        <span className="label-sm pointer-events-none absolute left-3 top-3 bg-ink/75 px-2 py-1.5 text-bone">
          {category?.label}
        </span>
      </div>

      <figcaption className="mt-3 border-t border-ink-line pt-3">
        <div className="flex items-baseline justify-between gap-4">
          <span className="min-w-0">
            <span className="display-sm block text-balance text-bone">{item.title}</span>
            {item.note && (
              <span className="mt-1.5 block text-xs leading-snug text-steel">
                {item.note}
              </span>
            )}
          </span>
          {barber && (
            <Link
              href={`/barbers/${barber.slug}`}
              className="link-draw label-sm shrink-0 text-steel-light"
            >
              {barber.name.split(' ')[0]}
            </Link>
          )}
        </div>
        <BookLink
          className="mt-3"
          intent={{
            serviceId: item.serviceId,
            barberSlug: item.barber,
            placement: 'work_card',
          }}
        />
      </figcaption>
    </figure>
  );
}

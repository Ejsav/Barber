'use client';

import Link from 'next/link';

import { Plate, type PlateAspect } from '@/components/ui/Plate';
import { useBooking } from '@/components/booking/BookingProvider';
import { specialtyLabels, type Barber } from '@/data/barbers';
import { cn } from '@/lib/cn';

/* ----------------------------------------------------------------------------
 * A barber, presented as a person rather than a tile.
 *
 * The name is set large inside the base of the portrait, and specialities are a
 * plain line of text rather than a row of pills — three pills say less than one
 * sentence and cost more room.
 *
 * Two actions, always: read about them, or book them. Booking never requires
 * visiting the profile first.
 * -------------------------------------------------------------------------- */

export function BarberCard({
  barber,
  aspect = 'portrait',
  tone = 'bone',
  priority = false,
  sizes = '(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 30vw',
  className,
}: {
  barber: Barber;
  aspect?: PlateAspect;
  tone?: 'ink' | 'bone';
  priority?: boolean;
  sizes?: string;
  className?: string;
}) {
  const { open } = useBooking();
  const onBone = tone === 'bone';

  return (
    <article className={cn('group relative flex flex-col', className)}>
      <div className="relative overflow-hidden bg-ink">
        <div className="transition-transform duration-[1100ms] ease-[var(--ease-out-expo)] motion-safe:group-hover:scale-[1.05]">
          <Plate
            src={barber.portrait}
            alt={barber.portraitAlt}
            aspect={aspect}
            variant="portrait"
            seed={barber.seed}
            sizes={sizes}
            priority={priority}
            bare
          />
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink via-ink/70 to-transparent" />

        {/* The name is set inside the frame, over the plate's own shadow end.
            It stays bone on ink whichever ground the card is placed on — an
            overhang below the frame would be bone-on-bone, and invisible, in
            every light section. */}
        <h3 className="absolute inset-x-0 bottom-0 px-4 pb-3">
          <Link
            href={`/barbers/${barber.slug}`}
            className="display-md text-bone transition-colors duration-500 group-hover:text-ember"
          >
            {barber.name.split(' ')[0]}
            <span className="sr-only">
              {' '}
              {barber.name.split(' ').slice(1).join(' ')}
            </span>
          </Link>
        </h3>
      </div>

      <div className="mt-4 flex flex-1 flex-col">
        <p className={cn('label', onBone ? 'text-ink-mute' : 'text-steel')}>
          {barber.role}
        </p>

        <p
          className={cn(
            'mt-3 text-sm leading-relaxed',
            onBone ? 'text-ink-mute' : 'text-steel-light',
          )}
        >
          {barber.specialties.map((s) => specialtyLabels[s]).join(' · ')}
        </p>

        <p
          className={cn(
            'mt-4 flex-1 text-[0.9375rem] leading-relaxed',
            onBone ? 'text-ink' : 'text-bone/85',
          )}
        >
          <span className={onBone ? 'text-ink-mute' : 'text-steel-dark'}>“</span>
          {barber.statement}
          <span className={onBone ? 'text-ink-mute' : 'text-steel-dark'}>”</span>
        </p>

        <div
          className={cn(
            'mt-6 flex items-center gap-3 border-t pt-4',
            onBone ? 'border-bone-line' : 'border-ink-line',
          )}
        >
          <button
            type="button"
            onClick={() => open({ barberSlug: barber.slug })}
            className={cn(
              'label h-12 flex-1 transition-colors',
              onBone
                ? 'bg-ink text-bone hover:bg-ember hover:text-ink'
                : 'bg-ember text-ink hover:bg-ember-deep hover:text-bone',
            )}
          >
            Book {barber.name.split(' ')[0]}
          </button>
          <Link
            href={`/barbers/${barber.slug}`}
            className={cn(
              'label flex h-12 items-center justify-center border px-4 transition-colors',
              onBone
                ? 'border-bone-line text-ink hover:border-ink'
                : 'border-ink-line text-bone hover:border-bone',
            )}
          >
            Profile
          </Link>
        </div>

        <p
          className={cn(
            'label-sm mt-3',
            onBone ? 'text-ink-mute' : 'text-steel-dark',
          )}
        >
          From ${barber.startingPrice}
          <span className="mx-2">·</span>
          {barber.yearsCutting} years cutting
        </p>
      </div>
    </article>
  );
}

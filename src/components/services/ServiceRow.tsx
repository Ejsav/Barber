'use client';

import Link from 'next/link';

import { Plate } from '@/components/ui/Plate';
import { useBooking } from '@/components/booking/BookingProvider';
import { formatDuration, formatPrice, type Service } from '@/data/services';
import { serviceHasPage } from '@/data/serviceDetail';
import { cn } from '@/lib/cn';

/* ----------------------------------------------------------------------------
 * A service is presented as a product line, not a card.
 *
 * The whole row is the target. On hover a screened plate wipes in from the
 * left behind the type — the same tonal-gradient device as the wordmark — and
 * the row inverts. On touch there is no hover, so the row is simply a large,
 * unambiguous tap target with the price visible without interaction.
 *
 * Where a service has a page of its own, a second link sits under the row —
 * outside the button, because a link nested inside a button is invalid markup
 * and unreliable for keyboard and assistive users alike. Booking stays the
 * primary action; reading about it is the quieter one.
 * -------------------------------------------------------------------------- */

export function ServiceRow({
  service,
  index,
  tone = 'ink',
  size = 'lg',
}: {
  service: Service;
  /** Display index, e.g. '01'. */
  index: string;
  tone?: 'ink' | 'bone';
  size?: 'lg' | 'md';
}) {
  const { open } = useBooking();
  const onBone = tone === 'bone';

  return (
    <li
      className={cn(
        'group relative isolate border-b',
        onBone ? 'border-bone-line' : 'border-ink-line',
      )}
    >
      {/* Wipe layer — pointer devices only; harmless and invisible on touch */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 origin-left scale-x-0 transition-transform duration-[850ms] ease-[var(--ease-out-expo)] motion-safe:group-hover:scale-x-100 motion-safe:group-focus-within:scale-x-100"
      >
        <Plate
          alt=""
          aspect="fill"
          variant="detail"
          seed={service.name.length * 13 + service.price}
          className="h-full w-full"
          bare
        />
        <div className="absolute inset-0 bg-ink/55" />
      </div>

      <button
        type="button"
        onClick={() => open({ serviceId: service.id, placement: 'service_row' })}
        className={cn(
          'flex w-full items-start gap-4 py-6 text-left transition-colors duration-500 sm:items-center sm:gap-8 lg:py-8',
          onBone
            ? 'text-ink motion-safe:group-hover:text-bone'
            : 'text-bone',
        )}
      >
        <span
          className={cn(
            'label-sm mt-2 w-6 shrink-0 transition-colors duration-500 sm:mt-0',
            onBone
              ? 'text-ink-mute motion-safe:group-hover:text-ember'
              : 'text-steel-dark group-hover:text-ember',
          )}
        >
          {index}
        </span>

        <span className="min-w-0 flex-1">
          <span
            className={cn(
              'block',
              size === 'lg' ? 'display-lg' : 'display-md',
            )}
          >
            {service.name}
          </span>
          <span
            className={cn(
              'mt-2 block max-w-lg text-sm leading-relaxed transition-colors duration-500 sm:text-[0.9375rem]',
              onBone
                ? 'text-ink-mute motion-safe:group-hover:text-bone/70'
                : 'text-steel-light',
            )}
          >
            {service.description}
          </span>
          {service.note && (
            <span
              className={cn(
                'label-sm mt-3 block transition-colors duration-500',
                onBone
                  ? 'text-ink-mute motion-safe:group-hover:text-bone/50'
                  : 'text-steel-dark',
              )}
            >
              {service.note}
            </span>
          )}
        </span>

        <span className="flex shrink-0 flex-col items-end gap-1.5 pt-1 sm:flex-row sm:items-center sm:gap-10 sm:pt-0">
          <span
            className={cn(
              'label-sm order-2 transition-colors duration-500 sm:order-1 sm:w-20 sm:text-right',
              onBone
                ? 'text-ink-mute motion-safe:group-hover:text-bone/60'
                : 'text-steel',
            )}
          >
            {formatDuration(service.duration)}
          </span>
          <span className="num order-1 text-xl sm:order-2 sm:w-24 sm:text-right sm:text-2xl">
            {formatPrice(service)}
          </span>
          <span
            className={cn(
              'label-sm order-3 hidden items-center gap-2 transition-colors duration-500 sm:flex',
              onBone
                ? 'text-ink-mute motion-safe:group-hover:text-ember'
                : 'text-steel group-hover:text-ember',
            )}
          >
            Book
            <svg
              className="h-2.5 w-2.5 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-1"
              viewBox="0 0 12 12"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M1 6h10M7 2l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="square"
              />
            </svg>
          </span>
        </span>
      </button>

      {serviceHasPage(service.id) && (
        <Link
          href={`/services/${service.id}`}
          className={cn(
            'link-draw label-sm relative -mt-2 mb-6 ml-10 inline-block transition-colors duration-500 sm:ml-12',
            onBone
              ? 'text-ink-mute motion-safe:group-hover:text-bone/70'
              : 'text-steel',
          )}
        >
          What&rsquo;s involved
        </Link>
      )}
    </li>
  );
}

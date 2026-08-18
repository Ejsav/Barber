'use client';

import { useSyncExternalStore } from 'react';

import { activePromotions } from '@/lib/promotions';
import type { Promotion } from '@/data/announcements';
import { BookButton } from '@/components/ui/BookButton';
import { cn } from '@/lib/cn';

/* ----------------------------------------------------------------------------
 * OFFERS
 *
 * Deliberately not a banner, a countdown or a pop-up. A shop that discounts
 * loudly reads cheap, and this one is selling craft — so the offers sit where
 * someone is already reading prices, set in the same type as everything else,
 * and they say the terms in full rather than hiding them behind an asterisk.
 *
 * Every promotion expires on its own date. The server renders whatever was
 * live at build time and the first client render reuses it verbatim, so
 * hydration is byte-identical; from the next render on, the visitor's own
 * clock decides. With no live offers the section renders nothing at all — no
 * empty frame, no "check back soon".
 * -------------------------------------------------------------------------- */

const DAY_MS = 24 * 60 * 60 * 1000;
const getDay = () => Math.floor(Date.now() / DAY_MS);
const getServerDay = () => null;
function subscribe(onChange: () => void) {
  const id = window.setInterval(onChange, 60 * 60 * 1000);
  return () => window.clearInterval(id);
}

export function Promotions({
  initial,
  tone = 'ink',
}: {
  /** Resolved on the server so the markup matches on hydration. */
  initial: Promotion[];
  tone?: 'ink' | 'bone';
}) {
  const day = useSyncExternalStore(subscribe, getDay, getServerDay);
  const onBone = tone === 'bone';

  const live = day === null ? initial : activePromotions(new Date());

  if (live.length === 0) return null;

  return (
    <section
      className={cn(
        'py-16 lg:py-24',
        onBone ? 'on-bone bg-bone text-ink' : 'bg-ink-raised text-bone',
      )}
      aria-labelledby="offers-heading"
    >
      <div className="shell">
        <div
          className={cn(
            'flex items-baseline gap-4 border-b pb-4',
            onBone ? 'border-bone-line' : 'border-ink-line',
          )}
        >
          <span className={cn('label-sm', onBone ? 'text-ink-mute' : 'text-steel-dark')}>
            ◆
          </span>
          <h2
            id="offers-heading"
            className={cn('label', onBone ? 'text-ink-mute' : 'text-steel')}
          >
            Running right now
          </h2>
        </div>

        <ul className="mt-10 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {live.map((promo) => (
            <li key={promo.id}>
              <h3
                className={cn(
                  'display-sm',
                  onBone ? 'text-ink' : 'text-bone',
                )}
              >
                {promo.headline}
              </h3>
              <p
                className={cn(
                  'mt-3 text-sm leading-relaxed',
                  onBone ? 'text-ink-mute' : 'text-steel-light',
                )}
              >
                {promo.detail}
              </p>
              {promo.serviceId && (
                <div className="mt-5">
                  <BookButton
                    intent={{ serviceId: promo.serviceId }}
                    placement="promotion"
                    size="sm"
                    flat
                  >
                    Book it
                  </BookButton>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

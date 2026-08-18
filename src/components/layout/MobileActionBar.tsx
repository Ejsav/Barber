'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, useReducedMotion } from 'motion/react';

import { useBooking } from '@/components/booking/BookingProvider';
import {
  locationDirectionsUrl,
  locations,
  primaryLocation,
} from '@/data/locations';
import { track } from '@/lib/analytics';

/* ----------------------------------------------------------------------------
 * Persistent thumb-reach action bar.
 *
 * Appears once the hero has scrolled past so it never covers the hero CTA, and
 * hides while the booking drawer is open. BOOK takes roughly half the bar and
 * is the only filled element — the hierarchy is not up for debate.
 * -------------------------------------------------------------------------- */

export function MobileActionBar() {
  const { open, isOpen } = useBooking();
  const reduce = useReducedMotion();
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  /* On a location page, CALL and DIRECTIONS have to mean THAT shop. Reading it
   * off the path costs nothing and avoids threading a provider through the
   * whole tree for one bar. */
  const location =
    locations.find((l) => pathname === `/locations/${l.slug}`) ?? primaryLocation;

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setVisible(window.scrollY > window.innerHeight * 0.55);
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const show = visible && !isOpen;

  return (
    <motion.div
      className="fixed inset-x-0 bottom-0 z-[110] border-t border-ink-line bg-ink/95 backdrop-blur-xl lg:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      initial={false}
      animate={
        reduce
          ? { opacity: show ? 1 : 0 }
          : { y: show ? 0 : '110%', opacity: show ? 1 : 0 }
      }
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      aria-hidden={!show}
      inert={!show ? true : undefined}
    >
      <div className="flex items-stretch gap-px bg-ink-line p-px">
        <a
          href={location.phoneHref}
          onClick={() =>
            track('phone_click', {
              placement: 'mobile_bar',
              location: location.slug,
            })
          }
          className="label flex h-14 flex-1 items-center justify-center gap-2 bg-ink text-steel-light active:bg-ink-panel"
        >
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path
              d="M1 2.5c0 5.8 4.7 10.5 10.5 10.5l1.5-3-3-1.5L8.5 10A9 9 0 014 5.5L6 4.5 4.5 1.5 1.5 1 1 2.5z"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
          </svg>
          Call
        </a>
        <a
          href={locationDirectionsUrl(location)}
          target="_blank"
          rel="noreferrer"
          onClick={() =>
            track('directions_click', {
              placement: 'mobile_bar',
              location: location.slug,
            })
          }
          className="label flex h-14 flex-1 items-center justify-center gap-2 bg-ink text-steel-light active:bg-ink-panel"
        >
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path
              d="M7 13s5-5.2 5-8.2A5 5 0 002 4.8C2 7.8 7 13 7 13z"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
            <circle cx="7" cy="4.8" r="1.6" stroke="currentColor" strokeWidth="1.2" />
          </svg>
          Directions
        </a>
        <button
          type="button"
          onClick={() =>
            open({ placement: 'mobile_bar', locationSlug: location.slug })
          }
          className="label flex h-14 flex-[1.35] items-center justify-center gap-2 bg-ember text-ink active:bg-ember-deep active:text-bone"
        >
          Book
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path
              d="M1 6h10M7 2l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="square"
            />
          </svg>
        </button>
      </div>
    </motion.div>
  );
}

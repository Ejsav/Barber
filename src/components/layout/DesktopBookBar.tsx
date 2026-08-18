'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, useReducedMotion } from 'motion/react';

import { useBooking } from '@/components/booking/BookingProvider';
import { TodayStatus } from '@/components/ui/TodayStatus';
import {
  locationDirectionsUrl,
  locations,
  primaryLocation,
} from '@/data/locations';
import { priceFloor } from '@/data/services';
import { track } from '@/lib/analytics';

/* ----------------------------------------------------------------------------
 * The desktop counterpart to the mobile action bar.
 *
 * The phone has had a persistent BOOK since the first build and the desktop
 * has not, which meant a visitor three sections deep on a large screen had to
 * scroll back to the header to act. This closes that: the same four controls,
 * the same hierarchy, in a rail slim enough not to argue with the page.
 *
 * Two pieces of restraint keep it from feeling like a banner:
 *
 *  · it stays away until the hero is behind you, so the hero's own CTA is
 *    never competing with a duplicate of itself, and
 *  · it leaves once the closing CTA is on screen. Two BOOK buttons visible at
 *    once is worse than either alone, and the big one should win.
 * -------------------------------------------------------------------------- */

export function DesktopBookBar() {
  const { open, isOpen } = useBooking();
  const reduce = useReducedMotion();
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  const location =
    locations.find((l) => pathname === `/locations/${l.slug}`) ?? primaryLocation;

  useEffect(() => {
    let ticking = false;

    const evaluate = () => {
      const y = window.scrollY;
      const pastHero = y > window.innerHeight * 0.7;

      /* The closing CTA owns the bottom of every page. Once it is in view the
       * rail has nothing left to add. */
      const closer = document.getElementById('final-cta');
      const closerVisible = closer
        ? closer.getBoundingClientRect().top < window.innerHeight
        : y + window.innerHeight > document.body.scrollHeight - 320;

      setVisible(pastHero && !closerVisible);
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        evaluate();
        ticking = false;
      });
    };

    evaluate();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [pathname]);

  const show = visible && !isOpen;

  return (
    <motion.div
      className="fixed inset-x-0 bottom-0 z-[105] hidden border-t border-ink-line bg-ink/90 backdrop-blur-xl lg:block"
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
      <div className="shell flex h-16 items-center justify-between gap-8">
        <div className="flex min-w-0 items-center gap-6">
          <TodayStatus size="sm" hours={location.hours} />
          <span aria-hidden="true" className="label-sm text-steel-dark">
            /
          </span>
          <p className="label truncate text-steel-light">
            {location.address.street}, {location.city}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-6">
          <a
            href={location.phoneHref}
            onClick={() =>
              track('phone_click', {
                placement: 'desktop_bar',
                location: location.slug,
              })
            }
            className="link-draw label text-steel-light transition-colors hover:text-bone"
          >
            {location.phone}
          </a>
          <a
            href={locationDirectionsUrl(location)}
            target="_blank"
            rel="noreferrer"
            onClick={() =>
              track('directions_click', {
                placement: 'desktop_bar',
                location: location.slug,
              })
            }
            className="link-draw label text-steel-light transition-colors hover:text-bone"
          >
            Directions
          </a>
          <button
            type="button"
            onClick={() =>
              open({ placement: 'desktop_bar', locationSlug: location.slug })
            }
            className="label inline-flex h-11 items-center gap-3 bg-ember px-7 text-ink transition-colors hover:bg-ember-deep hover:text-bone"
          >
            Book — from ${priceFloor}
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
      </div>
    </motion.div>
  );
}

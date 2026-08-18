'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { motion, useScroll } from 'motion/react';

import { RevealLine } from '@/components/ui/Reveal';
import { useParallaxValue } from '@/lib/useParallax';
import { BookButton } from '@/components/ui/BookButton';
import { TodayStatus } from '@/components/ui/TodayStatus';
import { business } from '@/data/business';
import { priceFloor } from '@/data/services';
import { isMultiLocation, locations } from '@/data/locations';
import { track } from '@/lib/analytics';

/* ----------------------------------------------------------------------------
 * The last thing on the page is the thing we want them to do.
 *
 * Two words at the largest type size on the site, a dot screen resolving out of
 * the dark behind them, and one button. Nothing else competes.
 * -------------------------------------------------------------------------- */

export function FinalCta() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end end'],
  });

  /* The screen behind the type resolves as the section arrives. */
  const screenOpacity = useParallaxValue(
    scrollYProgress,
    [0, 0.85],
    [0.03, 0.16],
    0.12,
  );
  const screenScale = useParallaxValue(scrollYProgress, [0, 1], [1.15, 1], 1);

  return (
    <section
      ref={ref}
      id="final-cta"
      className="relative isolate overflow-hidden bg-ink py-24 lg:py-40"
      aria-labelledby="final-cta-heading"
    >
      <motion.div
        aria-hidden="true"
        className="screen-dots-coarse pointer-events-none absolute inset-0 text-bone"
        style={{ opacity: screenOpacity, scale: screenScale }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_50%,rgba(226,81,43,0.12),transparent_70%)]"
      />

      <div className="shell relative text-center">
        <p className="label text-steel">Last call</p>

        <RevealLine
          id="final-cta-heading"
          as="h2"
          className="display-hero mt-6 text-bone"
        >
          You’re due.
        </RevealLine>

        <p className="body-lg mx-auto mt-8 max-w-lg text-bone/70">
          Pick a service, pick a barber, pick a time. Two minutes now, three
          weeks of not thinking about your hair.
        </p>

        <div className="mt-10 flex flex-col items-center gap-6">
          <BookButton size="xl" placement="final_cta" className="w-full sm:w-auto">
            Book your chair
          </BookButton>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            <TodayStatus size="sm" />
            <span className="label-sm text-steel-dark" aria-hidden="true">
              /
            </span>
            <a
              href={business.phoneHref}
              onClick={() => track('phone_click', { placement: 'final_cta' })}
              className="link-draw label text-steel-light"
            >
              Or call {business.phone}
            </a>
            <span className="label-sm text-steel-dark" aria-hidden="true">
              /
            </span>
            <span className="label text-steel-light">
              From <span className="num text-ember">${priceFloor}</span>
            </span>
          </div>

          {/* The last thing anyone should have to hunt for is where we are. */}
          <address className="label-sm not-italic text-steel-dark">
            {locations
              .map((l) => `${l.address.street}, ${l.city}`)
              .join('   ·   ')}
            {isMultiLocation && (
              <Link href="/locations" className="link-draw ml-3 text-steel-light">
                Both shops
              </Link>
            )}
          </address>
        </div>
      </div>
    </section>
  );
}

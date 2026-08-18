'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { motion, useScroll } from 'motion/react';

import { BookButton } from '@/components/ui/BookButton';
import { TodayStatus } from '@/components/ui/TodayStatus';
import { HeroMedia } from '@/components/sections/HeroMedia';
import { useParallax, useParallaxValue } from '@/lib/useParallax';
import { business } from '@/data/business';
import { heroMedia } from '@/data/media';
import { priceFloor } from '@/data/services';

/* ----------------------------------------------------------------------------
 * THE HERO
 *
 * The entrance is CSS (`.anim-line` / `.anim-rise` in globals.css), not Motion.
 * The headline is the LCP element, and animating it in JavaScript meant it sat
 * clipped behind its mask until React had hydrated — on a throttled phone that
 * pushed LCP past four seconds, and with JS disabled the headline never
 * appeared at all. A CSS animation runs on the browser's first paint and needs
 * neither hydration nor JavaScript.
 *
 * JS is left to do only what CSS cannot: the scroll-linked parallax, which is
 * pure enhancement and starts from a zero offset.
 * -------------------------------------------------------------------------- */

/* Deliberate line breaks — the rag is an art-direction decision, and these
 * three lines are measured to sit inside the type column at every width. */
const HEADLINE = ['Nobody asks', 'who cut it', 'when it’s bad.'];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  /* Slow drift on the plate, faster on the type — depth, not a scroll hijack.
   * Both collapse to zero under prefers-reduced-motion (see useParallax). */
  const plateY = useParallax(scrollYProgress, '0%', '12%');
  const typeY = useParallax(scrollYProgress, '0%', '-16%');
  const railFade = useParallaxValue(scrollYProgress, [0, 0.6], [1, 0], 1);

  return (
    <section
      ref={ref}
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-ink"
      aria-labelledby="hero-heading"
    >
      {/* ---- Media -------------------------------------------------------- */}
      {/* Mobile: full-bleed behind the type. Desktop: a tall plate anchored to
          the right edge that the headline crosses over. Two art directions,
          not one collapsing into the other. */}
      <motion.div
        className="absolute inset-0 lg:inset-y-[-6%] lg:left-auto lg:right-0 lg:w-[44vw]"
        style={{ y: plateY }}
      >
        <HeroMedia />
        {/* Mobile scrim — heavy enough to hold contrast under the headline */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/80 to-ink/40 lg:hidden" />
        {/* Desktop: feather the plate's left edge into the ground */}
        <div className="absolute inset-y-0 left-0 hidden w-1/2 bg-gradient-to-r from-ink via-ink/70 to-transparent lg:block" />
      </motion.div>

      {/* ---- Top meta rail ------------------------------------------------ */}
      <div
        className="shell anim-rise relative z-10 flex shrink-0 items-center justify-between gap-4"
        style={{
          paddingTop: 'calc(var(--header-h) + 1.25rem)',
          animationDelay: '0.5s',
        }}
      >
        <p className="label whitespace-nowrap text-steel-light">
          {business.locality}
          {/* The founding year is a nicety; on a narrow screen it would wrap
              the rail onto two lines and collide with the hours. */}
          <span className="hidden sm:inline">
            <span className="mx-2 text-steel-dark">/</span>
            Est. {business.founded}
          </span>
        </p>
        <TodayStatus size="sm" compact />
      </div>

      {/* ---- Headline ----------------------------------------------------- */}
      <motion.div
        className="shell relative z-10 flex flex-1 flex-col justify-end py-8 lg:justify-center lg:py-6"
        style={{ y: typeY }}
      >
        <div className="lg:max-w-[min(78vw,72rem)]">
          <h1 id="hero-heading" className="display-hero text-bone">
            {HEADLINE.map((line, i) => (
              <span key={line} className="block overflow-hidden pb-[0.04em]">
                <span
                  className="anim-line block whitespace-nowrap"
                  style={{ animationDelay: `${0.04 + i * 0.075}s` }}
                >
                  {line}
                  {/* Keeps words apart in the accessible name; the trailing
                      space collapses at the end of the line box. */}
                  {i < HEADLINE.length - 1 ? ' ' : ''}
                </span>
              </span>
            ))}
          </h1>

          <p
            className="body-lg anim-rise mt-6 max-w-xl text-bone/85 lg:mt-8"
            style={{ animationDelay: '0.34s' }}
          >
            Precision barbering on {business.address.street}. Cuts, skin fades,
            beard work and the straight razor — booked by the chair, never
            rushed.
          </p>

          {/* ---- Actions -------------------------------------------------- */}
          <div
            className="anim-rise mt-7 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-5 lg:mt-9"
            style={{ animationDelay: '0.42s' }}
          >
            <BookButton size="xl" placement="hero" className="w-full sm:w-auto">
              Book your chair
            </BookButton>

            <Link
              href="/barbers"
              className="group label flex h-14 items-center justify-center gap-3 px-2 text-bone sm:h-[4.5rem] sm:justify-start"
            >
              <span className="link-draw">Meet the barbers</span>
              <svg
                className="h-3 w-3 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-1.5"
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
            </Link>
          </div>
        </div>
      </motion.div>

      {/* ---- Bottom rail --------------------------------------------------- */}
      <motion.div
        className="shell anim-rise relative z-10 shrink-0 pb-5 lg:pb-7"
        style={{ opacity: railFade, animationDelay: '0.56s' }}
      >
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-ink-line pt-5">
          <p className="label text-steel-light">
            Cuts <span className="text-steel-dark">·</span> Fades{' '}
            <span className="text-steel-dark">·</span> Beards{' '}
            <span className="text-steel-dark">·</span> Straight razor
          </p>
          <p className="label ml-auto text-bone">
            From <span className="num text-ember">${priceFloor}</span>
          </p>
        </div>
      </motion.div>

      {/* Screened bleed across the seam into the next section */}
      <div
        aria-hidden="true"
        className="screen-dots pointer-events-none absolute inset-x-0 bottom-0 h-40 text-bone opacity-[0.07]"
        style={{
          maskImage: 'linear-gradient(to top, #000, transparent)',
          WebkitMaskImage: 'linear-gradient(to top, #000, transparent)',
        }}
      />

      {/* The plate carries no <img>, so name the intended shot for AT */}
      <span className="sr-only">{heroMedia.alt}</span>
    </section>
  );
}

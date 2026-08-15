'use client';

import { useRef } from 'react';
import { motion, useScroll } from 'motion/react';

import { Plate } from '@/components/ui/Plate';
import { RevealLines, Reveal } from '@/components/ui/Reveal';
import { useParallax } from '@/lib/useParallax';
import { manifestoMedia } from '@/data/media';

/* ----------------------------------------------------------------------------
 * THE STANDARD
 *
 * Four rules, set at editorial scale, with a plate running behind them that
 * moves slower than the page. No "our story", no founding-year paragraph — the
 * philosophy is the content.
 * -------------------------------------------------------------------------- */

const RULES = [
  {
    n: '01',
    rule: 'Consult first.',
    body: 'Dry hair, in the mirror, before anything is picked up. Half of a bad haircut is a conversation that never happened.',
  },
  {
    n: '02',
    rule: 'Rush nothing.',
    body: 'Appointments are timed for the work, not for turnover. If it needs ten more minutes it gets ten more minutes.',
  },
  {
    n: '03',
    rule: 'Cut for the person.',
    body: 'A photograph is a starting point. Your hair, your face and how you actually wear it decide the rest.',
  },
  {
    n: '04',
    rule: 'Details finish it.',
    body: 'The line at the neck, the weight behind the ear, the last pass with the razor. That is the part you notice in three weeks.',
  },
];

export function Manifesto() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const plateY = useParallax(scrollYProgress, '-10%', '10%');

  return (
    <section
      ref={ref}
      className="relative isolate overflow-hidden bg-ink py-20 lg:py-32"
      aria-labelledby="standard-heading"
    >
      {/* Plate anchored to the left, cropped by the viewport edge */}
      <motion.div
        className="pointer-events-none absolute inset-y-[-10%] left-0 hidden w-[38vw] lg:block"
        style={{ y: plateY }}
        aria-hidden="true"
      >
        <Plate
          src={manifestoMedia.image}
          alt={manifestoMedia.alt}
          aspect="fill"
          variant="detail"
          seed={manifestoMedia.seed}
          className="h-full w-full opacity-80"
          bare
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/25 via-ink/45 to-ink" />
      </motion.div>

      <div className="shell relative">
        <div className="lg:ml-[34%]">
          <div className="flex items-baseline gap-4 border-b border-ink-line pb-4">
            <span className="label-sm text-steel-dark">04</span>
            <span className="label text-steel">The standard</span>
          </div>

          <RevealLines
            as="h2"
            lines={['Four rules.', 'No exceptions.']}
            className="display-xl mt-8 text-bone lg:mt-12"
          />

          <ol className="mt-12 lg:mt-16">
            {RULES.map((r, i) => (
              <Reveal
                as="li"
                key={r.n}
                delay={i * 0.06}
                className="group border-t border-ink-line py-7 last:border-b lg:py-9"
              >
                <div className="flex items-baseline gap-5 lg:gap-8">
                  <span className="label-sm w-6 shrink-0 text-ember">{r.n}</span>
                  <div className="min-w-0 flex-1 lg:flex lg:items-baseline lg:gap-10">
                    <h3 className="display-md shrink-0 text-bone lg:w-[15rem]">
                      {r.rule}
                    </h3>
                    <p className="mt-3 max-w-lg text-[0.9375rem] leading-relaxed text-steel-light lg:mt-0">
                      {r.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

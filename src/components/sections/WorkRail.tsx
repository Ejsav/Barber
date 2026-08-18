'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { motion, useScroll } from 'motion/react';

import { WorkCard } from '@/components/work/WorkCard';
import { RevealLines, Reveal } from '@/components/ui/Reveal';
import { useParallax } from '@/lib/useParallax';
import { TrackedAnchor } from '@/components/analytics/TrackedAnchor';
import { business } from '@/data/business';
import { featuredWork } from '@/data/work';
import type { PlateAspect } from '@/components/ui/Plate';

/* ----------------------------------------------------------------------------
 * THE BOOK — homepage rail
 *
 * A horizontal, snap-scrolling wall rather than a grid, so it reads as a
 * lookbook spread and gives the page one axis of movement it does not have
 * anywhere else. The /work page presents the same material as a masonry wall —
 * two different treatments so the pages never feel like the same layout twice.
 *
 * Native overflow scrolling: it drags on touch, wheels sideways on trackpads,
 * arrow-keys with the scroller focused, and costs no scroll-jacking.
 * -------------------------------------------------------------------------- */

/* Varied frame sizes are what stop this reading as a carousel of equal cards. */
const FRAMES: { w: string; aspect: PlateAspect; offset: string }[] = [
  { w: 'w-[78vw] sm:w-[42vw] lg:w-[27vw]', aspect: 'tall', offset: 'lg:mt-0' },
  { w: 'w-[68vw] sm:w-[34vw] lg:w-[21vw]', aspect: 'portrait', offset: 'lg:mt-20' },
  { w: 'w-[86vw] sm:w-[52vw] lg:w-[34vw]', aspect: 'landscape', offset: 'lg:mt-8' },
  { w: 'w-[70vw] sm:w-[36vw] lg:w-[23vw]', aspect: 'portrait', offset: 'lg:mt-32' },
  { w: 'w-[80vw] sm:w-[44vw] lg:w-[28vw]', aspect: 'tall', offset: 'lg:mt-4' },
];

export function WorkRail() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  /* The rail drifts a little against the page — depth, not a scroll hijack. */
  const railX = useParallax(scrollYProgress, '3%', '-5%');

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-ink py-20 lg:py-32"
      aria-labelledby="work-heading"
    >
      <div className="shell">
        <div className="flex items-baseline gap-4 border-b border-ink-line pb-4">
          <span className="label-sm text-steel-dark">03</span>
          <span className="label text-steel">The Book</span>
          <div className="ml-auto flex items-center gap-6">
            {/* The handle, not an embedded feed — see SocialRail for why. */}
            <TrackedAnchor
              href={business.social.instagram}
              external
              event="instagram_click"
              payload={{ placement: 'work_rail' }}
              className="link-draw label hidden text-steel-light sm:inline-block"
            >
              {business.social.instagramHandle}
            </TrackedAnchor>
            <Link href="/work" className="link-draw label text-ember">
              Open the full book
            </Link>
          </div>
        </div>

        <div className="mt-7 lg:mt-10 lg:flex lg:items-end lg:gap-10">
          <RevealLines
            id="work-heading"
            lines={['Proof,', 'not promises.']}
            className="display-xl flex-1 text-bone"
          />
          <Reveal delay={0.15} className="mt-6 max-w-md lg:mt-0 lg:w-[24rem] lg:pb-2">
            <p className="body-lg text-bone/70">
              Every cut here was done in this shop, by the barber credited under
              it. Tap a name to book the person who did the work.
            </p>
          </Reveal>
        </div>
      </div>

      {/* Rail breaks out of the shell and bleeds off both edges */}
      <motion.div
        className="mt-12 lg:mt-16"
        style={{ x: railX }}
      >
        <ul
          className="rail flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 lg:gap-8"
          style={{
            paddingInline: 'var(--spacing-gutter)',
            scrollPaddingInline: 'var(--spacing-gutter)',
          }}
          tabIndex={0}
          aria-label="Recent work, scroll sideways"
        >
          {featuredWork.map((item, i) => {
            const frame = FRAMES[i % FRAMES.length];
            return (
              <li
                key={item.id}
                className={`shrink-0 snap-start ${frame.w} ${frame.offset}`}
              >
                <WorkCard
                  item={item}
                  aspect={frame.aspect}
                  sizes="(max-width: 640px) 86vw, (max-width: 1024px) 52vw, 34vw"
                />
              </li>
            );
          })}

          {/* End cap — the rail resolves into an action rather than dead space */}
          <li className="w-[70vw] shrink-0 snap-start sm:w-[34vw] lg:mt-20 lg:w-[21vw]">
            <Link
              href="/work"
              className="group flex h-full min-h-[18rem] flex-col justify-between border border-ink-line p-6 transition-colors hover:border-bone"
            >
              <span className="label text-steel">Keep looking</span>
              <span>
                <span className="display-md block text-bone">
                  The full book
                </span>
                <span className="label mt-4 flex items-center gap-2 text-ember">
                  All work
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
            </Link>
          </li>
        </ul>
      </motion.div>

      <div className="shell mt-2">
        <p className="label-sm text-steel-dark">Scroll sideways →</p>
      </div>
    </section>
  );
}

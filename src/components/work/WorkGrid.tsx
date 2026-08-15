'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

import { WorkCard } from '@/components/work/WorkCard';
import { work, workCategories, type WorkCategory } from '@/data/work';
import { cn } from '@/lib/cn';

type Filter = WorkCategory | 'all';

/* ----------------------------------------------------------------------------
 * The lookbook wall.
 *
 * CSS columns rather than a JS masonry: the browser balances the heights, the
 * varied aspect ratios in data/work.ts supply the rhythm, and there is no
 * measure-then-position pass to jank on resize.
 *
 * Filtering animates opacity and transform only. The count is announced in a
 * live region so the filter is not a silent change for screen-reader users.
 * -------------------------------------------------------------------------- */

export function WorkGrid({ initial = 'all' }: { initial?: Filter }) {
  const [filter, setFilter] = useState<Filter>(initial);
  const reduce = useReducedMotion();

  const items = useMemo(
    () => (filter === 'all' ? work : work.filter((w) => w.category === filter)),
    [filter],
  );

  const tabs: { id: Filter; label: string }[] = [
    { id: 'all', label: 'Everything' },
    ...workCategories.map((c) => ({ id: c.id as Filter, label: c.label })),
  ];

  return (
    <div>
      <div className="rail -mx-[var(--spacing-gutter)] overflow-x-auto px-[var(--spacing-gutter)]">
        <div
          className="flex min-w-max items-center gap-7 border-b border-ink-line pb-4"
          role="tablist"
          aria-label="Filter the lookbook"
        >
          {tabs.map((t) => {
            const active = filter === t.id;
            return (
              <button
                key={t.id}
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(t.id)}
                className={cn(
                  'label relative -mb-4 pb-4 transition-colors duration-300',
                  active ? 'text-bone' : 'text-steel hover:text-bone',
                )}
              >
                {t.label}
                <span className="ml-1.5 text-[0.5625rem] text-steel-dark">
                  {t.id === 'all'
                    ? work.length
                    : work.filter((w) => w.category === t.id).length}
                </span>
                {active && (
                  <motion.span
                    layoutId="work-filter-underline"
                    className="absolute inset-x-0 bottom-0 h-px bg-ember"
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <p className="sr-only" role="status">
        {items.length} results shown
      </p>

      <div className="mt-10 columns-1 gap-5 sm:columns-2 sm:gap-6 xl:columns-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              data-reveal=""
              className="mb-5 break-inside-avoid sm:mb-6"
              initial={reduce ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
              transition={{
                duration: 0.6,
                delay: reduce ? 0 : Math.min(i * 0.035, 0.3),
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <WorkCard item={item} priority={i < 3} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {items.length === 0 && (
        <p className="py-20 text-center text-steel">
          Nothing in this category yet.
        </p>
      )}
    </div>
  );
}

'use client';

import { useId, useState } from 'react';

import { type FaqItem } from '@/data/faq';
import { cn } from '@/lib/cn';

/* ----------------------------------------------------------------------------
 * Accordion, built the way the pattern is specified rather than the way it is
 * usually shipped:
 *
 *  · the control is a <button> inside the heading, so screen-reader users can
 *    jump between questions with the heading shortcut and still activate them;
 *  · aria-expanded and aria-controls are wired both ways;
 *  · the answer stays in the accessibility tree only while it is open —
 *    `hidden` rather than a zero height, so a collapsed answer cannot be
 *    reached by Tab or read out;
 *  · more than one can be open at once. Forcing a single open panel makes
 *    people re-open the answer they were already reading.
 *
 * The panel opens instantly rather than sliding. A height animation on a block
 * of text someone is trying to read is decoration that costs them time, and
 * `hidden` is the only state that reliably keeps a closed answer out of both
 * the tab order and the accessibility tree.
 * -------------------------------------------------------------------------- */

export function FaqList({
  items,
  tone = 'ink',
  headingLevel = 3,
}: {
  items: FaqItem[];
  tone?: 'ink' | 'bone';
  headingLevel?: 2 | 3;
}) {
  const baseId = useId();
  const [open, setOpen] = useState<string[]>([]);
  const onBone = tone === 'bone';
  const Heading = (headingLevel === 2 ? 'h2' : 'h3') as 'h2' | 'h3';

  const toggle = (id: string) =>
    setOpen((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  if (items.length === 0) return null;

  return (
    <ul className={cn('border-t', onBone ? 'border-bone-line' : 'border-ink-line')}>
      {items.map((item) => {
        const isOpen = open.includes(item.id);
        return (
          <li
            key={item.id}
            className={cn('border-b', onBone ? 'border-bone-line' : 'border-ink-line')}
          >
            <Heading>
              <button
                type="button"
                onClick={() => toggle(item.id)}
                aria-expanded={isOpen}
                aria-controls={`${baseId}-${item.id}`}
                className="group flex w-full items-start gap-5 py-5 text-left lg:py-6"
              >
                <span
                  className={cn(
                    'display-sm flex-1 transition-colors',
                    isOpen
                      ? 'text-ember'
                      : onBone
                        ? 'text-ink group-hover:text-ember-deep'
                        : 'text-bone group-hover:text-ember',
                  )}
                >
                  {item.question}
                </span>
                <span
                  aria-hidden="true"
                  className={cn(
                    'relative mt-2 block h-3 w-3 shrink-0 transition-transform duration-500 ease-[var(--ease-out-expo)]',
                    isOpen && 'rotate-45',
                  )}
                >
                  <span
                    className={cn(
                      'absolute left-0 top-1/2 h-px w-full -translate-y-1/2',
                      onBone ? 'bg-ink' : 'bg-bone',
                    )}
                  />
                  <span
                    className={cn(
                      'absolute left-1/2 top-0 h-full w-px -translate-x-1/2',
                      onBone ? 'bg-ink' : 'bg-bone',
                    )}
                  />
                </span>
              </button>
            </Heading>

            <div
              id={`${baseId}-${item.id}`}
              hidden={!isOpen}
              className="pb-6"
            >
              <div className="max-w-2xl space-y-4 pr-8">
                {item.answer.map((paragraph, i) => (
                  <p
                    key={i}
                    className={cn(
                      'leading-relaxed',
                      onBone ? 'text-ink-mute' : 'text-steel-light',
                    )}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

import { Reveal, RevealLines } from '@/components/ui/Reveal';
import { visibleReviews } from '@/lib/content';
import { getBarber } from '@/data/barbers';
import { cn } from '@/lib/cn';
import type { Review } from '@/data/reviews';

/* ----------------------------------------------------------------------------
 * WHAT PEOPLE SAY
 *
 * Not a three-card carousel. Reviews are set at three different weights and
 * laid into an asymmetric grid, so the wall reads the way a spread does — one
 * quotation dominates, the rest support it.
 *
 * Nothing renders in production until reviews are marked verified in
 * data/reviews.ts. In development the demo copy shows with a DEMO badge.
 * -------------------------------------------------------------------------- */

export function Reviews() {
  const { items, isPlaceholder } = visibleReviews();
  if (items.length === 0) return null;

  const big = items.filter((r) => r.weight === 1);
  const mid = items.filter((r) => r.weight === 2);
  const small = items.filter((r) => r.weight === 3);

  return (
    <section
      className="on-bone relative bg-bone py-20 text-ink lg:py-32"
      aria-labelledby="reviews-heading"
    >
      <div className="shell">
        <div className="flex items-baseline gap-4 border-b border-bone-line pb-4">
          <span className="label-sm text-ink-mute">05</span>
          <span className="label text-ink-mute">In their words</span>
          {isPlaceholder && (
            <span className="label-sm ml-auto border border-ember-deep px-2 py-1 text-ember-deep">
              Demo copy — replace before launch
            </span>
          )}
        </div>

        <RevealLines
          as="h2"
          lines={['The part we', 'can’t write', 'ourselves.']}
          className="display-xl mt-8 text-ink lg:mt-12"
        />

        {/* Lead quotation */}
        {big[0] && (
          <Reveal className="mt-14 lg:mt-20">
            <Quote review={big[0]} size="lead" />
          </Reveal>
        )}

        {/* Two supporting quotations */}
        <div className="mt-12 grid gap-10 border-t border-bone-line pt-12 lg:mt-16 lg:grid-cols-12 lg:gap-8 lg:pt-16">
          {mid.slice(0, 2).map((r, i) => (
            <Reveal
              key={r.id}
              delay={i * 0.08}
              className={cn(
                'lg:col-span-5',
                i === 1 && 'lg:col-start-8 lg:mt-16',
              )}
            >
              <Quote review={r} size="mid" />
            </Reveal>
          ))}
        </div>

        {/* Fragments */}
        {small.length > 0 && (
          <ul className="mt-14 grid gap-px border-t border-bone-line bg-bone-line sm:grid-cols-2 lg:mt-20 lg:grid-cols-3">
            {small.map((r, i) => (
              <Reveal as="li" key={r.id} delay={i * 0.05} className="bg-bone p-6 lg:p-8">
                <Quote review={r} size="small" />
              </Reveal>
            ))}
            {big[1] && (
              <Reveal as="li" delay={0.15} className="bg-ink p-6 text-bone lg:p-8">
                <Quote review={big[1]} size="small" tone="ink" />
              </Reveal>
            )}
          </ul>
        )}
      </div>
    </section>
  );
}

function Quote({
  review,
  size,
  tone = 'bone',
}: {
  review: Review;
  size: 'lead' | 'mid' | 'small';
  tone?: 'bone' | 'ink';
}) {
  const barber = review.barber ? getBarber(review.barber) : undefined;
  const onInk = tone === 'ink';

  return (
    <figure className="flex h-full flex-col">
      <blockquote
        className={cn(
          size === 'lead' && 'display-lg max-w-5xl',
          size === 'mid' && 'display-md',
          size === 'small' && 'text-[0.9375rem] leading-relaxed',
          onInk ? 'text-bone' : 'text-ink',
        )}
      >
        {size === 'small' ? `“${review.pull}”` : review.pull}
      </blockquote>

      {review.body && size !== 'small' && (
        <p
          className={cn(
            'mt-5 max-w-xl text-[0.9375rem] leading-relaxed',
            onInk ? 'text-steel-light' : 'text-ink-mute',
          )}
        >
          {review.body}
        </p>
      )}

      <figcaption
        className={cn(
          'label mt-auto flex flex-wrap items-center gap-x-3 gap-y-2 pt-6',
          onInk ? 'text-steel-light' : 'text-ink-mute',
        )}
      >
        <span className={onInk ? 'text-bone' : 'text-ink'}>{review.author}</span>
        <span aria-hidden="true">·</span>
        <span>{review.source}</span>
        {barber && (
          <>
            <span aria-hidden="true">·</span>
            <span className={onInk ? 'text-ember' : 'text-ember-deep'}>
              {barber.name.split(' ')[0]}
            </span>
          </>
        )}
      </figcaption>
    </figure>
  );
}

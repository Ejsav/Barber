import { Reveal, RevealLines } from '@/components/ui/Reveal';
import { visibleReviews } from '@/lib/content';
import { getBarber } from '@/data/barbers';
import { cn } from '@/lib/cn';
import type { Review } from '@/data/reviews';

/* ----------------------------------------------------------------------------
 * WHAT PEOPLE SAY
 *
 * Not a three-card carousel. Reviews are set at three different weights and
 * laid out asymmetrically, so the wall reads the way a spread does — one
 * quotation dominates, the rest support it, and a full-bleed ink band closes
 * the section on the opposite ground.
 *
 * Until reviews are marked verified in data/reviews.ts, the demo copy renders
 * with a visible "replace before launch" marker rather than being hidden — a
 * hole in the page is easy to forget about, a red badge is not. What is hard
 * -gated is the structured data: no Review markup is emitted while unverified.
 * -------------------------------------------------------------------------- */

export function Reviews() {
  const { items, isPlaceholder } = visibleReviews();
  if (items.length === 0) return null;

  const big = items.filter((r) => r.weight === 1);
  const mid = items.filter((r) => r.weight === 2);
  const small = items.filter((r) => r.weight === 3);

  return (
    <section
      className={cn(
        'on-bone relative bg-bone pt-20 text-ink lg:pt-32',
        // The closing ink band forms the section's bottom edge; padding below
        // it would leave a stripe of bone under the band.
        !big[1] && 'pb-20 lg:pb-32',
      )}
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

        {/* Fragments.
            Ruled by row rather than by a `gap-px` grid painted over a coloured
            container: with an arbitrary number of reviews, the leftover cells
            in the last row would show through as blank coloured blocks at any
            breakpoint where the count did not divide evenly. Row rules work at
            every count. */}
        {small.length > 0 && (
          <ul className="mt-14 grid border-t border-bone-line sm:grid-cols-2 sm:gap-x-8 lg:mt-20 lg:grid-cols-3 lg:gap-x-10">
            {small.map((r, i) => (
              <Reveal
                as="li"
                key={r.id}
                delay={i * 0.05}
                className="border-b border-bone-line py-6 lg:py-8"
              >
                <Quote review={r} size="small" />
              </Reveal>
            ))}
          </ul>
        )}
      </div>

      {/* The section closes on a full-bleed ink band — the one review set
          against the opposite ground, so the wall resolves rather than
          trailing off. */}
      {big[1] && (
        <Reveal className="mt-14 bg-ink py-12 lg:mt-20 lg:py-16">
          <div className="shell">
            <Quote review={big[1]} size="mid" tone="ink" />
          </div>
        </Reveal>
      )}
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

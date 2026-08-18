'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

import { TrackedAnchor } from '@/components/analytics/TrackedAnchor';
import { business } from '@/data/business';
import { getBarber } from '@/data/barbers';
import {
  reviewTagLabels,
  usedReviewTags,
  type Review,
  type ReviewTag,
} from '@/data/reviews';
import { cn } from '@/lib/cn';

/* ----------------------------------------------------------------------------
 * THE FULL WALL, FILTERED
 *
 * A first-time customer is not reading reviews in general. They are checking
 * one specific worry: will they know what to do with my hair, is it good with
 * children, is the fade actually sharp. The filters are those worries, and
 * nothing else — a tag only appears if a review genuinely carries it.
 *
 * Filtering is a client concern and stays one: the whole wall is in the HTML,
 * so it reads and indexes complete with JavaScript off, and the controls only
 * narrow what is already there.
 * -------------------------------------------------------------------------- */

export function ReviewWall({
  reviews,
  isPlaceholder,
}: {
  reviews: Review[];
  isPlaceholder: boolean;
}) {
  const [tag, setTag] = useState<ReviewTag | 'all'>('all');
  const [barberSlug, setBarberSlug] = useState<string | 'all'>('all');

  const tags = useMemo(() => usedReviewTags(reviews), [reviews]);
  const barberSlugs = useMemo(
    () =>
      Array.from(
        new Set(reviews.map((r) => r.barber).filter((s): s is string => Boolean(s))),
      ),
    [reviews],
  );

  const shown = reviews.filter(
    (r) =>
      (tag === 'all' || r.tags?.includes(tag)) &&
      (barberSlug === 'all' || r.barber === barberSlug),
  );

  return (
    <div>
      {/* -- Filters ------------------------------------------------------- */}
      <div className="border-b border-bone-line pb-8">
        <fieldset>
          <legend className="label text-ink-mute">What are you checking?</legend>
          <div className="mt-4 flex flex-wrap gap-2">
            <Chip active={tag === 'all'} onClick={() => setTag('all')}>
              Everything
            </Chip>
            {tags.map((t) => (
              <Chip key={t} active={tag === t} onClick={() => setTag(t)}>
                {reviewTagLabels[t]}
              </Chip>
            ))}
          </div>
        </fieldset>

        {barberSlugs.length > 1 && (
          <fieldset className="mt-6">
            <legend className="label text-ink-mute">Barber</legend>
            <div className="mt-4 flex flex-wrap gap-2">
              <Chip
                active={barberSlug === 'all'}
                onClick={() => setBarberSlug('all')}
              >
                Anyone
              </Chip>
              {barberSlugs.map((slug) => (
                <Chip
                  key={slug}
                  active={barberSlug === slug}
                  onClick={() => setBarberSlug(slug)}
                >
                  {getBarber(slug)?.name.split(' ')[0] ?? slug}
                </Chip>
              ))}
            </div>
          </fieldset>
        )}
      </div>

      {/* -- The wall ------------------------------------------------------ */}
      <p className="label mt-8 text-ink-mute" role="status">
        {shown.length} {shown.length === 1 ? 'review' : 'reviews'}
        {tag !== 'all' && ` · ${reviewTagLabels[tag]}`}
      </p>

      {shown.length === 0 ? (
        <p className="mt-8 max-w-lg text-ink-mute">
          Nothing under that combination yet. Clear a filter, or read the rest on{' '}
          <TrackedAnchor
            href={business.social.google}
            external
            event="review_click"
            payload={{ placement: 'reviews_empty' }}
            className="link-draw text-ink"
          >
            Google
          </TrackedAnchor>
          .
        </p>
      ) : (
        <ul className="mt-8 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((review) => {
            const barber = review.barber ? getBarber(review.barber) : undefined;
            return (
              <li
                key={review.id}
                className="border-b border-bone-line py-7 lg:py-9"
              >
                <figure className="flex h-full flex-col">
                  <blockquote className="display-sm text-ink">
                    {review.pull}
                  </blockquote>
                  {review.body && (
                    <p className="mt-4 text-[0.9375rem] leading-relaxed text-ink-mute">
                      {review.body}
                    </p>
                  )}
                  <figcaption className="label mt-auto flex flex-wrap items-center gap-x-3 gap-y-2 pt-6 text-ink-mute">
                    <span className="text-ink">{review.author}</span>
                    <span aria-hidden="true">·</span>
                    <span>{review.source}</span>
                    {barber && (
                      <>
                        <span aria-hidden="true">·</span>
                        <Link
                          href={`/barbers/${barber.slug}`}
                          className="link-draw text-ember-deep"
                        >
                          {barber.name.split(' ')[0]}
                        </Link>
                      </>
                    )}
                    {isPlaceholder && (
                      <span className="label-sm border border-ember-deep px-2 py-1 text-ember-deep">
                        Demo
                      </span>
                    )}
                  </figcaption>
                </figure>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'label h-10 border px-4 transition-colors',
        active
          ? 'border-ink bg-ink text-bone'
          : 'border-bone-line text-ink-mute hover:border-ink hover:text-ink',
      )}
    >
      {children}
    </button>
  );
}

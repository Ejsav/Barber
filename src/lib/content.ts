/* ============================================================================
 * CONTENT GATES
 * ----------------------------------------------------------------------------
 * Guard rails that stop demo content being passed off as fact.
 *
 * The approach is LABEL, don't hide. Demo reviews and the sample rating render
 * so the layout is complete and reviewable, but every one of them carries a
 * visible marker saying it is sample content. Hiding them instead would leave
 * a hole in the page and make it easy to forget they were ever there.
 *
 * The one thing that IS hard-gated is structured data: AggregateRating and
 * Review markup are only emitted once `verified` is true, because a rating in
 * JSON-LD is a machine-readable factual claim to search engines and inventing
 * one violates Google's structured-data policy.
 *
 * Set NEXT_PUBLIC_HIDE_PLACEHOLDERS=true to suppress unverified content
 * entirely — useful for a soft launch before the real reviews are collected.
 * ========================================================================== */

import { reviews, type Review } from '@/data/reviews';
import { socialProof } from '@/data/business';

const hide = process.env.NEXT_PUBLIC_HIDE_PLACEHOLDERS === 'true';

export const isDev = process.env.NODE_ENV === 'development';

/** Whether unverified demo content may render (always with a visible badge). */
export const showPlaceholders = !hide;

export function visibleReviews(list: Review[] = reviews) {
  const verified = list.filter((r) => r.verified);
  if (verified.length > 0) return { items: verified, isPlaceholder: false };
  if (showPlaceholders) return { items: list, isPlaceholder: true };
  return { items: [] as Review[], isPlaceholder: false };
}

/**
 * Trust-strip figures. `isPlaceholder` drives the visible DEMO badge; callers
 * must render it. The rating never reaches JSON-LD while unverified — see
 * lib/jsonld.ts.
 */
export function trustFigures() {
  if (socialProof.verified) {
    return { ...socialProof, show: true, isPlaceholder: false };
  }
  return { ...socialProof, show: showPlaceholders, isPlaceholder: true };
}

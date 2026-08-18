/* ============================================================================
 * REVIEWS
 * ----------------------------------------------------------------------------
 * ⚠️  EVERY REVIEW BELOW IS WRITTEN DEMO CONTENT FOR A FICTIONAL SHOP.  ⚠️
 *
 * They exist so the layout can be designed against realistic copy. They are
 * NOT real customers and must never be published as if they were.
 *
 * Before launch, either:
 *   1. Replace each entry with a genuine review (with the reviewer's consent
 *      where required) and set `verified: true` on it, or
 *   2. Delete the entries you cannot verify.
 *
 * The Reviews section only renders entries where `verified === true` when
 * `NEXT_PUBLIC_SHOW_PLACEHOLDER_REVIEWS` is not set — see lib/content.ts. In
 * development the placeholders render with a visible DEMO badge so nobody
 * ships them by accident.
 * ========================================================================== */

/* Themes a first-time customer actually filters by. Only add a tag where the
 * review genuinely speaks to it — a filter that returns a review which does not
 * answer the question is worse than no filter. */
export type ReviewTag =
  | 'first-visit'
  | 'fade'
  | 'beard'
  | 'textured'
  | 'kids'
  | 'longer'
  | 'atmosphere';

export const reviewTagLabels: Record<ReviewTag, string> = {
  'first-visit': 'First visit',
  fade: 'Fade quality',
  beard: 'Beard & razor',
  textured: 'Textured hair',
  kids: 'Kids',
  longer: 'Longer hair',
  atmosphere: 'The room',
};

export interface Review {
  id: string;
  /** The line that gets set large. Keep it to one sentence. */
  pull: string;
  /** The rest of the review, if any. */
  body?: string;
  author: string;
  /** Where the review came from. Only fill in for real reviews. */
  source: string;
  /** Barber slug, when the review names one. */
  barber?: string;
  rating: 1 | 2 | 3 | 4 | 5;
  /** MUST be true before this can be shown in production. */
  verified: false;
  /** Visual weight in the review wall: 1 = large pull quote. */
  weight: 1 | 2 | 3;
  /** Themes this review actually speaks to. */
  tags?: ReviewTag[];
}

export const reviews: Review[] = [
  {
    id: 'r-01',
    pull: 'I have been chasing this haircut for six years and someone finally just gave it to me.',
    body: 'Marcus spent ten minutes asking questions before he picked anything up. That has never happened to me in a barbershop.',
    author: 'Andre T.',
    source: 'Google',
    barber: 'marcus-reyes',
    rating: 5,
    verified: false,
    weight: 1,
    tags: ['first-visit'],
  },
  {
    id: 'r-02',
    pull: 'Dez is the first barber who did not treat my hair like a problem to solve.',
    body: 'Came in with a grown-out taper and a bad experience behind me. Left with the best shape I have had.',
    author: 'Kwame O.',
    source: 'Google',
    barber: 'desmond-whitfield',
    rating: 5,
    verified: false,
    weight: 2,
    tags: ['textured', 'first-visit'],
  },
  {
    id: 'r-03',
    pull: 'Booked a shave to kill an hour before a wedding. Nearly fell asleep in the chair.',
    author: 'Rob M.',
    source: 'Google',
    barber: 'yusuf-amari',
    rating: 5,
    verified: false,
    weight: 3,
    tags: ['beard', 'atmosphere'],
  },
  {
    id: 'r-04',
    pull: 'My son is four and has never once sat still. June got it done in twenty minutes.',
    body: 'She talked to him the whole way through. We are going back every month.',
    author: 'Priya N.',
    source: 'Google',
    barber: 'june-park',
    rating: 5,
    verified: false,
    weight: 2,
    tags: ['kids', 'first-visit'],
  },
  {
    id: 'r-05',
    pull: 'Nina is the only person in this city I trust with long curly hair.',
    author: 'Sam D.',
    source: 'Google',
    barber: 'nina-castellanos',
    rating: 5,
    verified: false,
    weight: 3,
    tags: ['longer', 'textured'],
  },
  {
    id: 'r-06',
    pull: 'Three weeks later it still looks like it did walking out. That is the whole point.',
    author: 'Ellis W.',
    source: 'Google',
    rating: 5,
    verified: false,
    weight: 1,
    tags: ['fade'],
  },
  {
    id: 'r-07',
    pull: 'The shop plays good records and nobody tries to sell you anything. Rare combination.',
    author: 'Toby R.',
    source: 'Google',
    rating: 5,
    verified: false,
    weight: 3,
    tags: ['atmosphere'],
  },
  {
    id: 'r-08',
    pull: 'I moved to Branford and still drive in. Say what you want about that.',
    author: 'Chris B.',
    source: 'Google',
    barber: 'marcus-reyes',
    rating: 5,
    verified: false,
    weight: 2,
    tags: ['fade'],
  },
];

export const reviewsForBarber = (slug: string) =>
  reviews.filter((r) => r.barber === slug);

/** Only tags that at least one review carries — never render an empty filter. */
export const usedReviewTags = (list: Review[] = reviews): ReviewTag[] =>
  (Object.keys(reviewTagLabels) as ReviewTag[]).filter((tag) =>
    list.some((r) => r.tags?.includes(tag)),
  );

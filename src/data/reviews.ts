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
  },
  {
    id: 'r-06',
    pull: 'Three weeks later it still looks like it did walking out. That is the whole point.',
    author: 'Ellis W.',
    source: 'Google',
    rating: 5,
    verified: false,
    weight: 1,
  },
  {
    id: 'r-07',
    pull: 'The shop plays good records and nobody tries to sell you anything. Rare combination.',
    author: 'Toby R.',
    source: 'Google',
    rating: 5,
    verified: false,
    weight: 3,
  },
  {
    id: 'r-08',
    pull: 'I moved to Hamden and still drive in. Say what you want about that.',
    author: 'Chris B.',
    source: 'Google',
    barber: 'marcus-reyes',
    rating: 5,
    verified: false,
    weight: 2,
  },
];

export const reviewsForBarber = (slug: string) =>
  reviews.filter((r) => r.barber === slug);

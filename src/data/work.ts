/* ============================================================================
 * THE BOOK — portfolio / lookbook
 * ----------------------------------------------------------------------------
 * Each entry is a photographic slot. Until real photography exists, `image`
 * stays `null` and an art-directed placeholder plate renders in its place.
 *
 * TO GO LIVE: drop optimised images into /public/work/ and set `image` (and
 * `beforeImage` where a before/after pair exists). Nothing else changes.
 *
 * `alt` is written as the art direction for the shot — it doubles as the real
 * alt text once the photograph is in place, so keep it descriptive.
 * ========================================================================== */

export type WorkCategory =
  | 'fade'
  | 'textured'
  | 'classic'
  | 'beard'
  | 'longer';

export const workCategories: { id: WorkCategory; label: string }[] = [
  { id: 'fade', label: 'Fades' },
  { id: 'textured', label: 'Textured' },
  { id: 'classic', label: 'Classic' },
  { id: 'beard', label: 'Beard' },
  { id: 'longer', label: 'Longer' },
];

/** Controls the shape of the slot in the lookbook grid. */
export type Aspect = 'portrait' | 'tall' | 'square' | 'landscape' | 'wide';

export interface WorkItem {
  id: string;
  /** Short editorial name for the cut. Not a hashtag. */
  title: string;
  category: WorkCategory;
  /** Barber slug. */
  barber: string;
  /** Service id, used for the "book this" shortcut. */
  serviceId: string;
  aspect: Aspect;
  image: string | null;
  alt: string;
  /** Present only on true before/after sets. */
  beforeImage?: string | null;
  beforeAlt?: string;
  /** Optional one-line note about what the cut solves. */
  note?: string;
  /** Pulls the item into the homepage rail. */
  featured?: boolean;
}

export const work: WorkItem[] = [
  {
    id: 'w-01',
    title: 'Zero Skin, Hard Part',
    category: 'fade',
    barber: 'marcus-reyes',
    serviceId: 'the-fade',
    aspect: 'tall',
    image: '/work/w-01.jpg',
    alt: 'Close crop of a zero skin fade with a razored hard part, shot from behind at the nape',
    beforeImage: '/work/w-01-before.jpg',
    beforeAlt: 'The same client before the cut, grown out roughly five weeks',
    note: 'Five weeks of growth, taken back to skin without losing the shape on top.',
    featured: true,
  },
  {
    id: 'w-02',
    title: 'Sponge Set, Mid Taper',
    category: 'textured',
    barber: 'desmond-whitfield',
    serviceId: 'the-fade',
    aspect: 'portrait',
    image: '/work/w-02.jpg',
    alt: 'Profile of a sponge-set coil pattern above a clean mid taper',
    featured: true,
  },
  {
    id: 'w-03',
    title: 'Grown-Out Fringe',
    category: 'longer',
    barber: 'nina-castellanos',
    serviceId: 'scissor-work',
    aspect: 'landscape',
    image: '/work/w-03.jpg',
    alt: 'Scissor-cut fringe falling past the brow, dried and unstyled',
    note: 'Cut entirely dry so the weight sits where it actually falls.',
    featured: true,
  },
  {
    id: 'w-04',
    title: 'Square Line, Full Beard',
    category: 'beard',
    barber: 'marcus-reyes',
    serviceId: 'cut-beard',
    aspect: 'square',
    image: '/work/w-04.jpg',
    alt: 'Three-quarter view of a full beard squared to the jaw with a razored cheek line',
    featured: true,
  },
  {
    id: 'w-05',
    title: 'Waves, Low Fade',
    category: 'textured',
    barber: 'desmond-whitfield',
    serviceId: 'the-fade',
    aspect: 'portrait',
    image: '/work/w-05.jpg',
    alt: 'Overhead detail of a 360 wave pattern above a low fade',
  },
  {
    id: 'w-06',
    title: 'Curtain, Soft Layers',
    category: 'longer',
    barber: 'nina-castellanos',
    serviceId: 'scissor-work',
    aspect: 'tall',
    image: '/work/w-06.jpg',
    alt: 'Long layered curtain cut on wavy hair, shot in window light',
    featured: true,
  },
  {
    id: 'w-07',
    title: 'Drop Fade, Textured Top',
    category: 'fade',
    barber: 'marcus-reyes',
    serviceId: 'the-fade',
    aspect: 'square',
    image: '/work/w-07.jpg',
    alt: 'Side profile of a drop fade curving behind the ear with a point-cut top',
  },
  {
    id: 'w-08',
    title: 'The Side Part',
    category: 'classic',
    barber: 'yusuf-amari',
    serviceId: 'scissor-work',
    aspect: 'portrait',
    image: '/work/w-08.jpg',
    alt: 'Classic scissor side part with a soft taper, combed and dressed with tonic',
    featured: true,
  },
  {
    id: 'w-09',
    title: 'Freehand Line Work',
    category: 'fade',
    barber: 'desmond-whitfield',
    serviceId: 'design-work',
    aspect: 'wide',
    image: '/work/w-09.jpg',
    alt: 'Detail of two freehand razor lines cut through a skin fade at the temple',
    note: 'Drawn freehand. No stencil, no guide.',
  },
  {
    id: 'w-10',
    title: 'Straight Razor Finish',
    category: 'beard',
    barber: 'yusuf-amari',
    serviceId: 'royal-shave',
    aspect: 'landscape',
    image: '/work/w-10.jpg',
    alt: 'Hot towel lifted from a shaved jaw, steam visible against a dark background',
  },
  {
    id: 'w-11',
    title: 'Burst Fade',
    category: 'fade',
    barber: 'marcus-reyes',
    serviceId: 'the-fade',
    aspect: 'portrait',
    image: '/work/w-11.jpg',
    alt: 'Burst fade radiating around the ear into a longer back',
  },
  {
    id: 'w-12',
    title: 'Blunt Bob, Barber Cut',
    category: 'longer',
    barber: 'nina-castellanos',
    serviceId: 'scissor-work',
    aspect: 'square',
    image: '/work/w-12.jpg',
    alt: 'Blunt jaw-length bob cut with scissors over comb, shot from behind',
  },
  {
    id: 'w-13',
    title: 'Taper, Twist Out',
    category: 'textured',
    barber: 'desmond-whitfield',
    serviceId: 'the-cut',
    aspect: 'tall',
    image: '/work/w-13.jpg',
    alt: 'Twist-out curl definition over a clean taper at the nape',
    beforeImage: '/work/w-13-before.jpg',
    beforeAlt: 'The same client before, with an uneven grown-out taper',
  },
  {
    id: 'w-14',
    title: 'Grey, Blended',
    category: 'classic',
    barber: 'yusuf-amari',
    serviceId: 'grey-blend',
    aspect: 'square',
    image: '/work/w-14.jpg',
    alt: 'Temple detail showing softened grey blended into natural dark hair',
    note: 'Half the grey taken down. No line when it grows out.',
  },
  {
    id: 'w-15',
    title: 'The Crop',
    category: 'classic',
    barber: 'june-park',
    serviceId: 'the-cut',
    aspect: 'portrait',
    image: '/work/w-15.jpg',
    alt: 'Short textured crop with a blunt fringe over a mid fade',
    featured: true,
  },
  {
    id: 'w-16',
    title: 'First Chair',
    category: 'classic',
    barber: 'june-park',
    serviceId: 'junior',
    aspect: 'landscape',
    image: '/work/w-16.jpg',
    alt: 'A child’s first haircut, cape on, booster in the chair',
    note: 'First haircuts get a keepsake envelope and a photograph if you want one.',
  },
];

export const featuredWork = work.filter((w) => w.featured);

export const workByBarber = (slug: string) =>
  work.filter((w) => w.barber === slug);

export const getWork = (id: string) => work.find((w) => w.id === id);

/**
 * Deterministic plate seed for a lookbook item.
 *
 * Every generated plate varies with its seed, so this has to be derived from
 * the WHOLE id — reading a single character out of "w-01" yields two distinct
 * values across sixteen frames and the grid renders as the same picture over
 * and over. One helper, so no call site can get that wrong again.
 */
export const workSeed = (item: Pick<WorkItem, 'id'>) =>
  Number(item.id.replace(/\D/g, '')) * 7 + 3;

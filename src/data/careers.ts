/* ============================================================================
 * JOIN THE SHOP
 * ----------------------------------------------------------------------------
 * Recruitment is a real revenue problem for barbershops — an empty chair earns
 * nothing — so it gets a real page rather than a mailto in the footer.
 *
 * `enabled: false` removes the page, the navigation entry and the sitemap
 * entry in one move: the route 404s rather than sitting there advertising jobs
 * that do not exist. Do not leave stale openings up.
 *
 * ⚠️  DEMO CONTENT for a fictional shop. Replace before launch.  ⚠️
 * ========================================================================== */

export type PositionType = 'chair-rental' | 'commission' | 'apprenticeship';

export interface Position {
  id: string;
  title: string;
  type: PositionType;
  /** One line under the title. */
  summary: string;
  /** Bullets. Concrete facts, not culture-deck adjectives. */
  details: string[];
  /** Shown as a small mono line — rate, split, hours. Omit if not fixed. */
  terms?: string;
  open: boolean;
}

export const careers = {
  enabled: true,

  headline: ['Good chairs', 'are worth', 'waiting for.'],
  standfirst:
    'We hire slowly and we keep people. If you cut well and you turn up, this is a room where you can build a book that is yours.',

  /** What the shop actually gives a barber. Written as facts, not perks. */
  offers: [
    'Your own chair, your own station, your own key.',
    'Booking, deposits and no-show handling run by the shop, not by you.',
    'Products, towels, laundry and sharpening covered.',
    'Your name and your work on the site, with a profile page and booking link that are yours to share.',
    'Two paid education days a year, at a course you choose.',
  ],

  /** Honest about who this suits. Saves everyone a wasted interview. */
  looksLike: [
    'You can fade to skin and blend it clean, or you can cut long hair properly with scissors. Ideally both.',
    'You consult before you cut, and you say no to a cut that will not work.',
    'You keep your own book, answer your own messages and show up when you said you would.',
  ],

  positions: [
    {
      id: 'chair-rental',
      title: 'Chair rental',
      type: 'chair-rental',
      summary:
        'A full-time chair for an established barber with a following.',
      details: [
        'Weekly rate, no commission split, keep everything you take.',
        'Your own key and your own hours inside the shop’s opening times.',
        'Listed on the site with a profile page and your own booking link.',
      ],
      terms: 'Weekly rate · discussed in person',
      open: true,
    },
    {
      id: 'commission',
      title: 'Commission barber',
      type: 'commission',
      summary:
        'For a barber building a book, with the shop feeding you walk-ins.',
      details: [
        'Percentage split, reviewed at six months.',
        'Walk-in traffic and shop bookings routed to your chair while you build.',
        'Full-time or four days — say which when you write.',
      ],
      open: true,
    },
    {
      id: 'apprenticeship',
      title: 'Apprenticeship',
      type: 'apprenticeship',
      summary:
        'One place a year, for someone serious about learning the trade properly.',
      details: [
        'Paid, on the floor from week one, licensed hours logged.',
        'Two years, structured, with cutting time under supervision every week.',
        'We take applications year-round and fill the place when the right person turns up.',
      ],
      open: false,
    },
  ] satisfies Position[],

  /** How to apply. A person, not a form. */
  apply: {
    intro:
      'Send a short note and a few photographs of your work. No CV template, no cover letter — tell us where you cut now and what you are good at.',
    /** Falls back to the shop email in data/business.ts when null. */
    email: null as string | null,
    note: 'We answer everyone, usually within a week.',
  },
} as const;

export const openPositions = careers.positions.filter((p) => p.open);

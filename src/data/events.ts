/* ============================================================================
 * WEDDINGS & GROUP GROOMING
 * ----------------------------------------------------------------------------
 * A high-value service that most shops offer and almost none advertise well.
 *
 * ⚠️  Set `enabled: false` unless the shop genuinely does this.  ⚠️  Every
 * package below is a commitment — early opening, the shop closed to the
 * public, travel to a venue. Advertising it and then declining the booking is
 * worse than not advertising it. With the flag off the route 404s and the
 * links disappear.
 *
 * ⚠️  DEMO CONTENT for a fictional shop. Replace before launch.  ⚠️
 * ========================================================================== */

export interface EventPackage {
  id: string;
  name: string;
  /** One line for the card. */
  summary: string;
  /** What is actually included. */
  includes: string[];
  /** Group size this is built for. */
  people: string;
  /** Per-person or flat price. `null` where it genuinely depends. */
  price: number | null;
  from?: boolean;
  /** True when the price is per head rather than for the whole party. */
  perPerson?: boolean;
  duration: string;
}

export const events = {
  enabled: true,

  headline: ['One morning', 'you don’t get', 'to redo.'],
  standfirst:
    'Weddings, groomsmen, graduations and the photographs that outlive all of it. We open early, close the shop, or come to you.',

  /** Honest constraints stated up front — these prevent bad bookings. */
  notes: [
    'Book six to eight weeks out for a Saturday. Four is usually possible; two rarely is.',
    'We recommend the groom comes in two weeks before as well, so the shape is settled rather than brand new on the day.',
    'A deposit holds the date. It comes off the final bill.',
  ],

  packages: [
    {
      id: 'groom',
      name: 'The Groom',
      summary:
        'A cut two weeks out to set the shape, and the finish on the morning itself.',
      includes: [
        'Consultation with photographs of the suit and the venue light',
        'Full cut and beard sculpt at the fitting appointment',
        'Hot-towel finish, straight-razor detailing and styling on the day',
        'Product to take with you for the afternoon',
      ],
      people: 'One',
      price: 150,
      duration: 'Two appointments',
    },
    {
      id: 'party',
      name: 'The Party',
      summary:
        'The shop, before it opens, for you and the people standing next to you.',
      includes: [
        'Private use of the shop before opening hours',
        'Up to six cuts, run in parallel across three chairs',
        'Beard work and hot towels included',
        'Coffee, and something stronger if it is that kind of morning',
      ],
      people: 'Up to six',
      price: 65,
      from: true,
      perPerson: true,
      duration: 'Two hours',
    },
    {
      id: 'on-location',
      name: 'On Location',
      summary:
        'Two barbers, a chair and a kit, at the hotel or the house.',
      includes: [
        'Two barbers travelling to you inside forty minutes of New Haven',
        'Cuts, beard work and finishing for the whole party',
        'Everything set up and cleared without a trace',
      ],
      people: 'Four to twelve',
      price: null,
      duration: 'Half day',
    },
  ] satisfies EventPackage[],

  enquiry: {
    intro:
      'Tell us the date, the venue and how many of you there are. We will come back with what is possible and what it costs.',
    /** Falls back to the shop email in data/business.ts when null. */
    email: null as string | null,
  },
} as const;

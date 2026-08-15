/* ============================================================================
 * BUSINESS CONFIGURATION
 * ----------------------------------------------------------------------------
 * This is the single source of truth for every business-specific value on the
 * site. To reskin this template for a different barbershop, edit THIS FILE
 * first — name, address, hours, phone, booking provider, social links and
 * social-proof numbers all flow from here into the UI, the metadata and the
 * LocalBusiness JSON-LD.
 *
 * Anything marked `PLACEHOLDER` is demo content for a fictional shop and MUST
 * be replaced with verified client data before launch.
 * ========================================================================== */

export type WeekdayKey =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export interface DayHours {
  /** 24h "HH:MM". `null` on both fields means closed. */
  open: string | null;
  close: string | null;
}

export const business = {
  /* -- Identity ----------------------------------------------------------- */
  name: 'Halftone',
  legalName: 'Halftone Barbers LLC', // PLACEHOLDER — fictional entity
  /** Rendered in the wordmark as two tonal halves. */
  wordmark: { first: 'HALF', second: 'TONE' },
  descriptor: 'Barbers',
  city: 'New Haven',
  region: 'CT',
  regionName: 'Connecticut',
  /** Used in headlines and SEO copy. */
  locality: 'New Haven, CT',
  neighborhood: 'Ninth Square',
  tagline: 'Precision barbering on Chapel Street.',
  founded: '2016', // PLACEHOLDER

  /* -- Contact ------------------------------------------------------------ */
  address: {
    street: '912 Chapel Street', // PLACEHOLDER
    unit: 'Suite 2',
    city: 'New Haven',
    region: 'CT',
    postalCode: '06510',
    country: 'US',
  },
  /** Reserved 555-01xx range — deliberately non-dialable. REPLACE. */
  phone: '+1 (203) 555-0142',
  phoneHref: 'tel:+12035550142',
  email: 'front-desk@halftonebarbers.com', // PLACEHOLDER
  geo: { lat: 41.3062, lng: -72.9257 }, // PLACEHOLDER — approximate

  /* -- Hours (24h, local) ------------------------------------------------- */
  hours: {
    monday: { open: null, close: null },
    tuesday: { open: '10:00', close: '19:00' },
    wednesday: { open: '10:00', close: '19:00' },
    thursday: { open: '10:00', close: '20:00' },
    friday: { open: '09:00', close: '20:00' },
    saturday: { open: '09:00', close: '18:00' },
    sunday: { open: '11:00', close: '16:00' },
  } satisfies Record<WeekdayKey, DayHours>,

  /* -- Visiting ----------------------------------------------------------- */
  walkIns:
    'Walk-ins are taken when a chair is open — most days that means a short wait or none at all. Appointments are always served first.',
  parking:
    'Metered street parking on Chapel and Orange. Temple Street Garage is a four-minute walk and validates after 6pm.',
  transit: 'Ten minutes on foot from Union Station. The Green is two blocks west.',
  accessibility:
    'Street-level entry, no step. Accessible restroom in the building lobby.',

  /* -- Booking ------------------------------------------------------------ */
  booking: {
    /**
     * Drop the client's live booking URL here (Booksy, Square, Fresha,
     * Boulevard, GlossGenius, Acuity…) and every BOOK control on the site
     * routes straight to it in a new tab.
     *
     * While this is `null`, the site opens the built-in booking drawer, which
     * is clearly labelled as a demo and never confirms a real appointment.
     */
    url: null as string | null,
    provider: null as string | null, // e.g. 'Booksy'
    /** Per-barber deep links, if the provider supports them. Keyed by slug. */
    barberUrls: {} as Record<string, string>,
  },

  /* -- Social ------------------------------------------------------------- */
  social: {
    instagram: 'https://instagram.com/', // PLACEHOLDER
    instagramHandle: '@halftonebarbers',
    tiktok: 'https://tiktok.com/', // PLACEHOLDER
    google: 'https://maps.google.com/', // PLACEHOLDER — Google Business Profile
  },

  /* -- Site --------------------------------------------------------------- */
  url: 'https://halftonebarbers.com', // PLACEHOLDER — set to the production origin
  twitterHandle: '@halftonebarbers', // PLACEHOLDER
} as const;

/* ============================================================================
 * SOCIAL PROOF
 * ----------------------------------------------------------------------------
 * ⚠️  DEVELOPER NOTE — READ BEFORE LAUNCH  ⚠️
 *
 * The rating and review count below are DEMO VALUES for a fictional shop.
 * Publishing invented ratings is deceptive and, for review snippets, against
 * Google's structured-data policy.
 *
 * Before this site goes live you MUST either
 *   (a) replace these with the real, current figures from the client's Google
 *       Business Profile (and keep them updated), or
 *   (b) set `verified: false`, which hides the whole trust strip and strips
 *       AggregateRating out of the JSON-LD automatically.
 *
 * Nothing here is rendered as fact while `verified` is false.
 * ========================================================================== */
export const socialProof = {
  /** Flip to `true` ONLY once the numbers below are real and sourced. */
  verified: false,
  rating: 4.9,
  reviewCount: 312,
  source: 'Google',
  sourceUrl: business.social.google,
} as const;

/* -- Derived helpers --------------------------------------------------------*/

export const fullAddress = `${business.address.street}${
  business.address.unit ? `, ${business.address.unit}` : ''
}, ${business.address.city}, ${business.address.region} ${business.address.postalCode}`;

export const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
  `${business.name} ${fullAddress}`,
)}`;

export const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  fullAddress,
)}`;

export const weekdayOrder: WeekdayKey[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

export const weekdayLabels: Record<WeekdayKey, string> = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
};

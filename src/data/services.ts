/* ============================================================================
 * SERVICE MENU
 * ----------------------------------------------------------------------------
 * Prices and durations are DEMO VALUES for a fictional shop — replace with the
 * client's real menu before launch. Order within a group is the order shown.
 * `featured` services surface on the homepage selector (keep it to three).
 * ========================================================================== */

export type ServiceGroupId = 'cuts' | 'beard' | 'combinations' | 'extras';

export interface Service {
  id: string;
  name: string;
  /** One line, written for a customer deciding — not a spec sheet. */
  description: string;
  /** USD, whole dollars. */
  price: number;
  /** `true` renders as "from $X" for variable work. */
  from?: boolean;
  /** Minutes. */
  duration: number;
  group: ServiceGroupId;
  featured?: boolean;
  /** Ordering index within the featured rail. */
  featuredIndex?: number;
  /** Shown as a small note under the price where it prevents a bad booking. */
  note?: string;
}

export interface ServiceGroup {
  id: ServiceGroupId;
  name: string;
  /** Editorial standfirst for the group. */
  blurb: string;
}

export const serviceGroups: ServiceGroup[] = [
  {
    id: 'cuts',
    name: 'Cuts',
    blurb:
      'Every cut opens with a consultation. We look at your hair dry, talk about how you actually wear it, then start.',
  },
  {
    id: 'beard',
    name: 'Beard & Razor',
    blurb:
      'Hot towel, sharp steel, no rushing. Beard work is its own craft and we treat it that way.',
  },
  {
    id: 'combinations',
    name: 'Combinations',
    blurb:
      'Booked together, timed properly. The full appointment costs less than the parts and gives the barber room to work.',
  },
  {
    id: 'extras',
    name: 'Add-ons',
    blurb:
      'Add to any appointment at booking, or ask in the chair if there is time.',
  },
];

export const services: Service[] = [
  /* -- Cuts --------------------------------------------------------------- */
  {
    id: 'the-cut',
    name: 'The Cut',
    description:
      'Consultation, scissor-and-clipper cut, wash and finish. The one most people book.',
    price: 40,
    duration: 45,
    group: 'cuts',
    featured: true,
    featuredIndex: 1,
  },
  {
    id: 'the-fade',
    name: 'The Fade',
    description:
      'Skin, low, mid or drop — blended clean into the length on top and detailed at the line.',
    price: 45,
    duration: 45,
    group: 'cuts',
    featured: true,
    featuredIndex: 2,
  },
  {
    id: 'scissor-work',
    name: 'Scissor Work',
    description:
      'Longer hair cut entirely by hand. Layering, texture and weight removal without clipper lines.',
    price: 50,
    duration: 55,
    group: 'cuts',
  },
  {
    id: 'the-reset',
    name: 'The Reset',
    description:
      'One length all over, edges cleaned, neck shaved. Fast, sharp, no fade.',
    price: 30,
    duration: 30,
    group: 'cuts',
  },
  {
    id: 'junior',
    name: 'Junior Cut',
    description:
      'Twelve and under. Same care, shorter attention span — we work around it.',
    price: 30,
    duration: 30,
    group: 'cuts',
    note: 'First haircuts welcome. Tell us at booking.',
  },
  {
    id: 'senior',
    name: 'Senior Cut',
    description: 'Sixty-five and over. Cut, edge-up and hot towel finish.',
    price: 32,
    duration: 35,
    group: 'cuts',
  },

  /* -- Beard & Razor ------------------------------------------------------ */
  {
    id: 'beard-sculpt',
    name: 'Beard Sculpt',
    description:
      'Shaped to your jaw, not to a stencil. Trimmed, razor-lined, oiled.',
    price: 28,
    duration: 30,
    group: 'beard',
  },
  {
    id: 'royal-shave',
    name: 'The Royal Shave',
    description:
      'Two hot towels, pre-shave oil, straight razor, cold finish. Forty-five minutes of nothing else.',
    price: 45,
    duration: 45,
    group: 'beard',
  },
  {
    id: 'line-up',
    name: 'Line-Up',
    description:
      'Hairline, temples and neck re-cut between appointments. In and out.',
    price: 20,
    duration: 20,
    group: 'beard',
    note: 'Best booked two to three weeks after a cut.',
  },

  /* -- Combinations ------------------------------------------------------- */
  {
    id: 'cut-beard',
    name: 'Cut + Beard',
    description:
      'Haircut, beard sculpting and razor detailing in one sitting. The complete look.',
    price: 60,
    duration: 60,
    group: 'combinations',
    featured: true,
    featuredIndex: 3,
  },
  {
    id: 'cut-royal',
    name: 'Cut + Royal Shave',
    description:
      'A full cut followed by the straight-razor shave. Book it before something that matters.',
    price: 80,
    duration: 80,
    group: 'combinations',
  },
  {
    id: 'full-reset',
    name: 'The Full Reset',
    description:
      'Cut, beard sculpt, straight-razor shave, scalp treatment and style. Ninety minutes, start to finish.',
    price: 105,
    duration: 90,
    group: 'combinations',
    note: 'Limited chairs per day — book ahead.',
  },

  /* -- Add-ons ------------------------------------------------------------ */
  {
    id: 'hot-towel',
    name: 'Hot Towel Finish',
    description: 'Eucalyptus towel and neck shave to close out any service.',
    price: 8,
    duration: 10,
    group: 'extras',
  },
  {
    id: 'grey-blend',
    name: 'Grey Blending',
    description:
      'Softens grey by about half. Reads natural, grows out without a line.',
    price: 25,
    duration: 25,
    group: 'extras',
  },
  {
    id: 'design-work',
    name: 'Design Work',
    description: 'Freehand parts, lines and patterns cut into the fade.',
    price: 15,
    from: true,
    duration: 15,
    group: 'extras',
    note: 'Price depends on detail. Bring a reference.',
  },
  {
    id: 'scalp-treatment',
    name: 'Scalp Treatment',
    description: 'Exfoliating massage and tonic for flaking or tightness.',
    price: 18,
    duration: 15,
    group: 'extras',
  },
  {
    id: 'style-tonic',
    name: 'Style & Tonic',
    description:
      'Blow-dry and product so you leave wearing it the way it should sit.',
    price: 10,
    duration: 10,
    group: 'extras',
  },
];

export const featuredServices = services
  .filter((s) => s.featured)
  .sort((a, b) => (a.featuredIndex ?? 0) - (b.featuredIndex ?? 0));

export const getService = (id: string) => services.find((s) => s.id === id);

export const servicesByGroup = (group: ServiceGroupId) =>
  services.filter((s) => s.group === group);

/**
 * Cheapest haircut — the number used for "from $X" throughout the site.
 * Deliberately scoped to the `cuts` group: a $20 line-up is not a haircut, and
 * advertising it as the entry price would be a bait figure.
 */
export const priceFloor = Math.min(
  ...services.filter((s) => s.group === 'cuts').map((s) => s.price),
);

export const formatPrice = (service: Pick<Service, 'price' | 'from'>) =>
  `${service.from ? 'from ' : ''}$${service.price}`;

export const formatDuration = (minutes: number) =>
  minutes >= 60 && minutes % 60 === 0
    ? `${minutes / 60} hr`
    : minutes > 60
      ? `${Math.floor(minutes / 60)} hr ${minutes % 60} min`
      : `${minutes} min`;

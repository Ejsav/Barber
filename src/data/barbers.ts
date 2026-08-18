/* ============================================================================
 * THE ROSTER
 * ----------------------------------------------------------------------------
 * Fictional barbers for demo purposes. Replace names, bios, portraits, socials
 * and schedules with the real team before launch.
 *
 * PORTRAITS: set `portrait` to a path in /public (e.g. '/team/marcus.jpg') and
 * the generated placeholder plate is swapped for the real photograph
 * automatically. Leave it `null` to keep the placeholder.
 * ========================================================================== */

import type { WeekdayKey } from './business';

export type SpecialtyId =
  | 'skin-fade'
  | 'textured'
  | 'scissor'
  | 'beards'
  | 'long-hair'
  | 'kids'
  | 'design'
  | 'grey-blending'
  | 'straight-razor';

export const specialtyLabels: Record<SpecialtyId, string> = {
  'skin-fade': 'Skin fades',
  textured: 'Textured & coily hair',
  scissor: 'Classic scissor work',
  beards: 'Beards',
  'long-hair': 'Longer hair',
  kids: 'Kids',
  design: 'Design work',
  'grey-blending': 'Grey blending',
  'straight-razor': 'Straight razor',
};

export interface Barber {
  slug: string;
  name: string;
  /** Shown under the name — one short line. */
  role: string;
  /** Two or three. More than that says nothing. */
  specialties: SpecialtyId[];
  /** First person, one sentence, in their own voice. */
  statement: string;
  /** Two or three short paragraphs for the profile page. */
  bio: string[];
  /** Lowest price they charge — powers "from $X". */
  startingPrice: number;
  yearsCutting: number;
  /** Service ids this barber takes. */
  serviceIds: string[];
  /** Days they are in the shop. Availability itself lives in the booking system. */
  daysIn: WeekdayKey[];
  instagram?: string;
  instagramHandle?: string;
  /** Real photograph path in /public, or null for the placeholder plate. */
  portrait: string | null;
  /** Alt text describing the intended photograph. */
  portraitAlt: string;
  /** Deterministic variation seed for the placeholder plate. */
  seed: number;
  /** Ids from work.ts attributed to this barber. */
  workIds: string[];
  /** Language, beyond English, they cut in. Genuinely useful locally. */
  languages?: string[];
}

export const barbers: Barber[] = [
  {
    slug: 'marcus-reyes',
    name: 'Marcus Reyes',
    role: 'Owner · Master Barber',
    specialties: ['skin-fade', 'beards', 'design'],
    statement:
      'I would rather take ten more minutes than send you out with a line that is nearly right.',
    bio: [
      'Marcus opened the shop on Chapel Street after eleven years behind other people’s chairs, most of them in Bridgeport and Brooklyn. He built Halftone around the thing he kept not finding: a room where the cut gets the time it needs.',
      'His work is built on the blend. Skin fades that hold their gradient for three weeks, beard lines squared to the jaw rather than to a template, and freehand design work when someone asks for it.',
      'He takes the first appointment of the day and the last one, and he still cuts his father’s hair on Sundays.',
    ],
    startingPrice: 45,
    yearsCutting: 16,
    serviceIds: [
      'the-cut',
      'the-fade',
      'the-reset',
      'beard-sculpt',
      'royal-shave',
      'line-up',
      'cut-beard',
      'cut-royal',
      'full-reset',
      'design-work',
      'grey-blend',
    ],
    daysIn: ['tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
    instagram: 'https://instagram.com/',
    instagramHandle: '@marcus.halftone',
    portrait: '/team/marcus-reyes.jpg',
    portraitAlt:
      'Portrait of Marcus Reyes, owner and master barber at Halftone, at his chair',
    seed: 11,
    workIds: ['w-01', 'w-04', 'w-07', 'w-11'],
    languages: ['Spanish'],
  },
  {
    slug: 'desmond-whitfield',
    name: 'Desmond Whitfield',
    role: 'Senior Barber',
    specialties: ['textured', 'design', 'skin-fade'],
    statement:
      'Coily hair is not a difficulty. It is a different set of rules, and I know them.',
    bio: [
      'Dez came up cutting in his aunt’s kitchen in Hamden before it was ever a job. Fifteen years later he is the person other barbers in the shop ask when a texture pattern is not behaving.',
      'He works fast without looking like he is rushing — tapers, sponge-set curls, waves, and freehand design work that he sketches on paper first if the pattern is complicated.',
      'Ask him about the Yankees at your own risk.',
    ],
    startingPrice: 45,
    yearsCutting: 15,
    serviceIds: [
      'the-cut',
      'the-fade',
      'the-reset',
      'junior',
      'beard-sculpt',
      'line-up',
      'cut-beard',
      'design-work',
      'scalp-treatment',
    ],
    daysIn: ['tuesday', 'thursday', 'friday', 'saturday', 'sunday'],
    instagram: 'https://instagram.com/',
    instagramHandle: '@dezcuts',
    portrait: '/team/desmond-whitfield.jpg',
    portraitAlt:
      'Portrait of Desmond Whitfield, senior barber at Halftone, holding clippers',
    seed: 27,
    workIds: ['w-02', 'w-05', 'w-09', 'w-13'],
  },
  {
    slug: 'nina-castellanos',
    name: 'Nina Castellanos',
    role: 'Barber · Scissor Specialist',
    specialties: ['scissor', 'long-hair', 'textured'],
    statement:
      'If your hair has grown past your ears and nobody has known what to do with it, sit down.',
    bio: [
      'Nina trained in salon cutting before crossing over to barbering, which is why she is the one to see if your hair is long, curly, fine, or all three. She cuts almost entirely with scissors.',
      'Her consultations are the longest in the shop on purpose. She wants to know how you dry it, how often you actually style it, and what you hated about the last cut.',
      'She teaches a cutting workshop for apprentices two Mondays a month.',
    ],
    startingPrice: 40,
    yearsCutting: 9,
    serviceIds: [
      'the-cut',
      'scissor-work',
      'the-fade',
      'junior',
      'style-tonic',
      'cut-beard',
      'grey-blend',
      'scalp-treatment',
    ],
    daysIn: ['wednesday', 'thursday', 'friday', 'saturday'],
    instagram: 'https://instagram.com/',
    instagramHandle: '@nina.cuts.hair',
    portrait: '/team/nina-castellanos.jpg',
    portraitAlt:
      'Portrait of Nina Castellanos, scissor specialist at Halftone, mid-cut',
    seed: 43,
    workIds: ['w-03', 'w-06', 'w-12'],
    languages: ['Spanish'],
  },
  {
    slug: 'yusuf-amari',
    name: 'Yusuf Amari',
    role: 'Barber',
    specialties: ['straight-razor', 'scissor', 'grey-blending'],
    statement:
      'A shave should be the calmest forty-five minutes of your week. That is the whole job.',
    bio: [
      'Yusuf learned the straight razor from his uncle in Casablanca and has been shaving professionally for twelve years, the last five of them here.',
      'He handles the classic end of the menu — side parts, tapers that sit under a hat, grey blending that nobody can spot, and the Royal Shave, which he refuses to do quickly.',
      'He keeps the shop’s espresso machine running, which makes him structurally important.',
    ],
    startingPrice: 40,
    yearsCutting: 12,
    serviceIds: [
      'the-cut',
      'scissor-work',
      'the-reset',
      'senior',
      'beard-sculpt',
      'royal-shave',
      'cut-royal',
      'full-reset',
      'grey-blend',
      'hot-towel',
    ],
    daysIn: ['tuesday', 'wednesday', 'friday', 'saturday', 'sunday'],
    instagram: 'https://instagram.com/',
    instagramHandle: '@yusuf.razor',
    portrait: '/team/yusuf-amari.jpg',
    portraitAlt:
      'Portrait of Yusuf Amari, barber at Halftone, stropping a straight razor',
    seed: 58,
    workIds: ['w-08', 'w-10', 'w-14'],
    languages: ['Arabic', 'French'],
  },
  {
    slug: 'june-park',
    name: 'June Park',
    role: 'Barber',
    specialties: ['kids', 'skin-fade', 'textured'],
    statement:
      'I have cut hair through screaming, wriggling and one full escape attempt. Bring the kid.',
    bio: [
      'June finished her apprenticeship here and stayed. She takes the majority of the shop’s junior appointments and has the patience to prove it.',
      'On adults she does sharp modern crops, mid fades and textured tops — clean work with a light hand.',
      'Saturday mornings are hers. Book early; they go.',
    ],
    startingPrice: 30,
    yearsCutting: 5,
    serviceIds: [
      'the-cut',
      'the-fade',
      'the-reset',
      'junior',
      'line-up',
      'style-tonic',
      'scalp-treatment',
    ],
    daysIn: ['wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
    instagram: 'https://instagram.com/',
    instagramHandle: '@junecutshair',
    portrait: '/team/june-park.jpg',
    portraitAlt:
      'Portrait of June Park, barber at Halftone, at the window of the shop',
    seed: 72,
    workIds: ['w-15', 'w-16'],
    languages: ['Korean'],
  },
];

export const getBarber = (slug: string) => barbers.find((b) => b.slug === slug);

export const barberSlugs = barbers.map((b) => b.slug);

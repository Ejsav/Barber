/* ============================================================================
 * THE CUT EXPLORER
 * ----------------------------------------------------------------------------
 * The single biggest reason a first-time customer does not book is that they
 * do not know the words. They know what they want their head to look like;
 * they do not know whether that is a taper, a mid fade or a scissor cut, and a
 * price list does not tell them.
 *
 * This maps plain language onto the menu:
 *
 *      what you want  →  what it is called  →  what to book  →  who cuts it
 *
 * Nothing here gives styling advice or promises a result — it translates
 * vocabulary and then hands over to a barber. The `unsure` path exists because
 * "I don't know" is the most common honest answer and it should not be a
 * dead end.
 *
 * Every look must point at a real service id and at barbers who genuinely take
 * that work, or the recommendation is a lie. lib/looks.ts enforces that: in
 * development a broken reference throws by name, and in production the look is
 * dropped rather than shown pointing at nothing.
 * ========================================================================== */

import type { WorkCategory } from './work';

export interface Look {
  id: string;
  /** How a customer says it, not how a barber says it. */
  label: string;
  /** The trade name, when it differs. Shown as a small caption. */
  alias?: string;
  /** Two sentences, maximum. What it is and what it asks of you. */
  description: string;
  /** The honest maintenance answer. This prevents disappointed rebookings. */
  upkeep: string;
  /** Service to book. Must exist in data/services.ts. */
  serviceId: string;
  /** Also worth considering. */
  alsoConsider?: string[];
  /** Which lookbook category to pull imagery from. */
  workCategory: WorkCategory;
  /**
   * The lookbook frame that leads the panel — the one photograph someone sees
   * before they read a word of it. Named explicitly rather than taken as the
   * first of the category, because "the first one in the array" is not an art
   * direction decision. Must exist in data/work.ts.
   */
  heroWorkId: string;
  /** Barbers who genuinely specialise. Must exist in data/barbers.ts. */
  barberSlugs: string[];
  seed: number;
}

export const looks: Look[] = [
  {
    id: 'skin-fade',
    label: 'Short sides, sharp',
    alias: 'Skin fade',
    description:
      'The sides go down to skin and blend up into whatever length you keep on top. It is the cleanest possible finish and the most exact — a fade is either blended or it is not.',
    upkeep: 'Looks its best for about two weeks, still sharp at three.',
    serviceId: 'the-fade',
    alsoConsider: ['cut-beard'],
    workCategory: 'fade',
    heroWorkId: 'w-07',
    barberSlugs: ['marcus-reyes', 'desmond-whitfield', 'june-park'],
    seed: 121,
  },
  {
    id: 'taper',
    label: 'Tidy up, keep the length',
    alias: 'Taper',
    description:
      'The same graduated blend as a fade, but stopped short of skin — it tightens the neckline and around the ears without changing how the cut reads.',
    upkeep: 'Grows out softly. Four to six weeks between visits.',
    serviceId: 'the-cut',
    alsoConsider: ['line-up'],
    workCategory: 'classic',
    heroWorkId: 'w-08',
    barberSlugs: ['yusuf-amari', 'nina-castellanos', 'marcus-reyes'],
    seed: 134,
  },
  {
    id: 'textured',
    label: 'Curls, coils or waves',
    alias: 'Textured cut',
    description:
      'Cut to the pattern your hair already has rather than against it — shaped dry, so what you see in the chair is what you get at home.',
    upkeep: 'Three to five weeks depending on how tight the sides are kept.',
    serviceId: 'the-cut',
    alsoConsider: ['the-fade', 'scalp-treatment'],
    workCategory: 'textured',
    heroWorkId: 'w-02',
    barberSlugs: ['desmond-whitfield', 'nina-castellanos', 'june-park'],
    seed: 147,
  },
  {
    id: 'longer',
    label: 'Growing it out',
    alias: 'Scissor work',
    description:
      'Weight taken out by hand so length sits properly instead of stacking up and flicking. No clipper lines anywhere in it.',
    upkeep: 'Six to eight weeks. Growing out well is mostly about timing.',
    serviceId: 'scissor-work',
    alsoConsider: ['style-tonic'],
    workCategory: 'longer',
    heroWorkId: 'w-03',
    barberSlugs: ['nina-castellanos', 'yusuf-amari'],
    seed: 158,
  },
  {
    id: 'beard',
    label: 'Beard sorted out',
    alias: 'Beard sculpt or shave',
    description:
      'Shaped to your jawline and razor-lined at the edges. If you would rather it came off entirely, the straight-razor shave is forty-five minutes of hot towels and nothing else.',
    upkeep: 'Two to three weeks to hold a line.',
    serviceId: 'beard-sculpt',
    alsoConsider: ['royal-shave', 'cut-beard'],
    workCategory: 'beard',
    heroWorkId: 'w-04',
    barberSlugs: ['marcus-reyes', 'yusuf-amari'],
    seed: 169,
  },
  {
    id: 'design',
    label: 'Something cut into it',
    alias: 'Design work',
    description:
      'Freehand parts, lines and patterns cut into a fade. Bring a reference photograph — it is the only way to be sure you and the barber mean the same thing.',
    upkeep: 'Two weeks, and it wants a line-up after one.',
    serviceId: 'the-fade',
    alsoConsider: ['design-work'],
    workCategory: 'fade',
    heroWorkId: 'w-09',
    barberSlugs: ['desmond-whitfield', 'marcus-reyes'],
    seed: 181,
  },
];

/* ----------------------------------------------------------------------------
 * "NOT SURE WHAT TO BOOK?"
 *
 * One question, plain language, five honest answers. Each lands on a look
 * above rather than on a service id directly, so the visitor still sees what
 * the thing is called and who cuts it before they commit.
 * -------------------------------------------------------------------------- */

export interface UnsureOption {
  id: string;
  /** How someone actually describes the problem. */
  prompt: string;
  /** Look id this resolves to. */
  lookId: string;
  /** Why we are pointing you there. Keeps the recommendation honest. */
  because: string;
}

export const unsurePrompt = 'What are you actually dealing with?';

export const unsureOptions: UnsureOption[] = [
  {
    id: 'sides-heavy',
    prompt: 'The sides have got heavy and it looks bulky.',
    lookId: 'taper',
    because:
      'That is weight, not length. A taper takes it down without changing the shape you already have.',
  },
  {
    id: 'want-sharp',
    prompt: 'I want it properly short and sharp.',
    lookId: 'skin-fade',
    because:
      'That is a fade. How high it goes and whether it hits skin is decided in the chair.',
  },
  {
    id: 'hair-and-beard',
    prompt: 'Hair and beard both need doing.',
    lookId: 'beard',
    because:
      'Book them together — it is cheaper than the two separately and gives the barber time to balance one against the other.',
  },
  {
    id: 'growing',
    prompt: 'I’m growing it out and it’s at the awkward stage.',
    lookId: 'longer',
    because:
      'Scissor work, not clippers. The awkward stage is mostly weight in the wrong place.',
  },
  {
    id: 'first-time',
    prompt: 'It’s my first time here and I just want a good haircut.',
    lookId: 'taper',
    because:
      'Book The Cut. Your barber will tell you in the chair if something else suits you better, and adjust it there.',
  },
];

export const getLook = (id: string) => looks.find((l) => l.id === id);

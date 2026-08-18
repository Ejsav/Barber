/* ============================================================================
 * THE FADE DIAL
 * ----------------------------------------------------------------------------
 * "How short do you want the sides?" is the question every barber asks and
 * almost nobody can answer, because the answer has two axes and the customer
 * has only ever heard one word for it:
 *
 *   HEIGHT  — how far UP the head the blend starts. Taper, low, mid, high.
 *   FINISH  — how close it gets at the BOTTOM. Skin, very short, short.
 *
 * "Mid fade" describes the first. "Skin fade" describes the second. They are
 * not alternatives and a person can want any combination of the two, which is
 * exactly why asking for "a mid skin fade" and getting something else is the
 * most common bad haircut in the trade.
 *
 * Every combination below is a real cut a barber will recognise, and the
 * sentence in `say` is the thing to actually say out loud in the chair.
 * ========================================================================== */

export interface FadeHeight {
  id: string;
  name: string;
  /** How a customer describes it before they know the word. */
  plain: string;
  /**
   * Where the blend begins, as a fraction of head height from the crown:
   * 0 is the crown, 1 is the neckline. Drives the drawing.
   */
  start: number;
  description: string;
}

export interface FadeFinish {
  id: string;
  name: string;
  plain: string;
  /** How much scalp shows at the bottom, 0–1. Drives the drawing. */
  exposure: number;
  upkeep: string;
  description: string;
}

export const fadeHeights: FadeHeight[] = [
  {
    id: 'taper',
    name: 'Taper',
    plain: 'Just the neckline and around the ears',
    start: 0.86,
    description:
      'The blend never leaves the neckline and the area round the ear. From the front almost nothing looks different — it just stops looking heavy.',
  },
  {
    id: 'low',
    name: 'Low',
    plain: 'Starts about level with the ear',
    start: 0.72,
    description:
      'Begins at the top of the ear and works down. The most forgiving height: it grows out softly and suits almost every head shape.',
  },
  {
    id: 'mid',
    name: 'Mid',
    plain: 'Starts halfway up the side',
    start: 0.56,
    description:
      'Halfway between the ear and the temple. The default modern fade — enough contrast to read as deliberate from across a room.',
  },
  {
    id: 'high',
    name: 'High',
    plain: 'Starts up near the corner of the head',
    start: 0.38,
    description:
      'Up at the parietal ridge, where the side of the head turns into the top. Maximum contrast, and the shortest window before it needs redoing.',
  },
];

export const fadeFinishes: FadeFinish[] = [
  {
    id: 'skin',
    name: 'To skin',
    plain: 'Bare at the bottom',
    exposure: 1,
    upkeep: 'Sharp for about two weeks.',
    description:
      'Razored down to bare scalp at the lowest point. The cleanest possible finish and the least forgiving — there is nowhere for a mistake to hide.',
  },
  {
    id: 'very-short',
    name: 'Very short',
    plain: 'Almost bare, but not shaved',
    exposure: 0.62,
    upkeep: 'Holds three weeks.',
    description:
      'A number half or one at the bottom. Reads nearly as sharp as skin from a step away and grows out without a hard line.',
  },
  {
    id: 'short',
    name: 'Short',
    plain: 'Short, with hair left on',
    exposure: 0.32,
    upkeep: 'Four to six weeks.',
    description:
      'A number two or so. The softest of the three, and the one to pick if you cannot get back in every fortnight.',
  },
];

/** The service each combination should be booked as. */
export function fadeServiceId(heightId: string) {
  /* A taper is a haircut with a tidy neckline, not a fade, and booking it as
   * one buys time the barber does not need. */
  return heightId === 'taper' ? 'the-cut' : 'the-fade';
}

/** The sentence to say in the chair. */
export function fadeSentence(height: FadeHeight, finish: FadeFinish) {
  if (height.id === 'taper') {
    return finish.id === 'skin'
      ? 'A taper, taken to skin at the neckline.'
      : `A taper, ${finish.name.toLowerCase()} at the neckline.`;
  }
  return finish.id === 'skin'
    ? `A ${height.name.toLowerCase()} skin fade.`
    : `A ${height.name.toLowerCase()} fade, ${finish.name.toLowerCase()} at the bottom.`;
}

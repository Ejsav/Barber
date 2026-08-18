/* ============================================================================
 * SERVICE PAGES
 * ----------------------------------------------------------------------------
 * A dedicated page only exists for a service someone would genuinely search
 * for and genuinely need explaining. Everything else lives on the menu.
 *
 * That restraint is the point: fifteen near-identical pages built to catch
 * fifteen keyword variants is exactly the thin content Google discounts and
 * customers bounce off. Seven pages that answer a real question each are worth
 * more than the whole set.
 *
 * A service with no entry here is linked to its section of the menu instead —
 * see `serviceHref` in lib/services.ts. Nothing 404s either way.
 *
 * ⚠️  DEMO COPY for a fictional shop, though it is written the way the real
 *     thing should be: specific, honest about upkeep, and no promises about a
 *     result nobody can guarantee sight unseen.  ⚠️
 * ========================================================================== */

import type { WorkCategory } from './work';

export interface ServiceDetail {
  /** Headline, pre-split into deliberate lines. */
  lines: string[];
  standfirst: string;
  /** What actually happens, in order. The appointment, not a spec sheet. */
  steps: string[];
  /** Who this is the right booking for. */
  suits: string[];
  /** What it will not do, or what it needs from you. Prevents bad bookings. */
  honest: string[];
  /** Which lookbook category illustrates it. */
  workCategory: WorkCategory;
  seed: number;
  /** Search-facing description. One sentence, no keyword stuffing. */
  metaDescription: string;
}

export const serviceDetail: Record<string, ServiceDetail> = {
  'the-cut': {
    lines: ['The one', 'most people', 'should book.'],
    standfirst:
      'A full consultation, a cut worked with both scissors and clippers, a wash, and a finish you can actually repeat at home.',
    steps: [
      'We look at your hair dry, before anything is picked up, and talk about how you wear it on an ordinary Tuesday rather than how it looks the day of a cut.',
      'The shape is cut in first — length, weight and outline — then the detail work: the neckline, around the ears, the corners.',
      'Wash and towel, then styled with something matched to your hair rather than whatever is nearest.',
      'Before you get up, we show you the back and say plainly how to keep it that way.',
    ],
    suits: [
      'A first visit, when you are not sure what to ask for',
      'Any length that is not being kept short with a fade',
      'Anyone who wants the barber to decide the detail, in the chair',
    ],
    honest: [
      'If what you actually want is skin-tight sides, book The Fade instead — same care, more time set aside for the blend.',
      'Bring a photograph if you have one. The same haircut name means five different things to five different people.',
    ],
    workCategory: 'classic',
    seed: 205,
    metaDescription:
      'A consultation, scissor-and-clipper cut, wash and finish — the standard appointment at Halftone, and the right first booking if you are not sure what to ask for.',
  },

  'the-fade': {
    lines: ['A fade is', 'either blended', 'or it isn’t.'],
    standfirst:
      'Skin, low, mid or drop. The sides graduate cleanly into the length on top and the line is cut, not sprayed on.',
    steps: [
      'We agree how high the fade goes and whether it finishes at skin — on your head, with your hand on it, not from a photograph on the wall.',
      'The guard work builds the gradient from the bottom up, then it is blended by hand until no line shows in any light.',
      'The top is cut to sit with the fade rather than on top of it.',
      'Hairline, temples and neck are razored last, so the edge is sharp on the day.',
    ],
    suits: [
      'Short sides you want looking deliberate rather than grown-in',
      'Coily, curly and straight hair alike — the blend is the same craft',
      'Anyone who is between cuts every two to three weeks',
    ],
    honest: [
      'A skin fade looks its best for about two weeks and stays sharp for three. If you cannot get back inside a month, a taper will grow out better.',
      'Design work — parts, lines, patterns — is priced on top of this. Bring a reference.',
    ],
    workCategory: 'fade',
    seed: 214,
    metaDescription:
      'Skin, low, mid and drop fades cut and blended by hand, finished with a razored line. Book a fade with a barber who specialises in it.',
  },

  'scissor-work': {
    lines: ['Longer hair,', 'cut entirely', 'by hand.'],
    standfirst:
      'Layering, texture and weight removal with no clipper anywhere in it — for hair past the ears that nobody has known what to do with.',
    steps: [
      'A long consultation, on purpose. How you dry it, how often you really style it, and what you disliked about the last cut.',
      'Cut dry first so the shape is judged as it will actually sit, then refined wet where the length needs precision.',
      'Weight is taken out from underneath rather than thinned through the surface, which is what causes the flick.',
      'Finished with product chosen for your texture, and shown how to get it back with two minutes and a towel.',
    ],
    suits: [
      'Hair growing past the ears, or being grown out on purpose',
      'Curly, wavy and fine hair that goes shapeless when clipped',
      'Anyone told their hair is "difficult" by someone who reached for clippers',
    ],
    honest: [
      'This takes fifty-five minutes and cannot be rushed into a thirty-minute slot.',
      'Growing out well is mostly timing. We would rather book you every eight weeks and take less off each time.',
    ],
    workCategory: 'longer',
    seed: 223,
    metaDescription:
      'Scissor cutting for longer, curly and fine hair — layering and weight removal by hand, with no clipper lines. Book with a scissor specialist.',
  },

  'beard-sculpt': {
    lines: ['Shaped to', 'your jaw.', 'Not a stencil.'],
    standfirst:
      'Trimmed to the shape of your face, razor-lined at the cheek and neck, and oiled. Twenty minutes that changes how the whole cut reads.',
    steps: [
      'The shape is set against your jawline and your neck, which is where most beards go wrong.',
      'Length is taken down with scissors or clippers depending on how it grows and how much you want left.',
      'Cheek line and neck line are cut with a straight razor, so the edge is a real edge.',
      'Hot towel, oil, and a note on where to trim it yourself between visits.',
    ],
    suits: [
      'Any beard past a fortnight of growth',
      'Patchy growth that needs shaping rather than cutting back',
      'Booking alongside a cut — the two shapes should be decided together',
    ],
    honest: [
      'A beard line holds for two to three weeks. After that it is a new shape, not a tidy-up.',
      'We will not take a beard off entirely on a whim in a twenty-minute slot. If that is the plan, book the Royal Shave and enjoy it.',
    ],
    workCategory: 'beard',
    seed: 232,
    metaDescription:
      'Beard shaping and straight-razor lining, cut to your jawline rather than a template. Book a beard sculpt in New Haven.',
  },

  'royal-shave': {
    lines: ['Forty-five', 'minutes of', 'nothing else.'],
    standfirst:
      'Two hot towels, pre-shave oil, a straight razor worked with the grain and then across it, and a cold finish. The oldest thing on the menu and still the best hour in the shop.',
    steps: [
      'Two hot towels and pre-shave oil to soften everything before steel touches skin.',
      'The first pass goes with the grain, the second across it. Never against it — that is where the irritation comes from.',
      'A second towel, then a cold one to close everything down.',
      'Balm chosen for your skin rather than whatever is loudest on the shelf.',
    ],
    suits: [
      'The morning of something that matters',
      'Anyone who has never had a straight-razor shave and should',
      'Skin that reacts badly to a cartridge razor',
    ],
    honest: [
      'This is not a fast shave and it is not meant to be. Book it when you have the time to enjoy it.',
      'If you have active acne or a skin condition on the face, tell us at booking. Sometimes the right answer is a beard trim instead, and we will say so.',
    ],
    workCategory: 'beard',
    seed: 241,
    metaDescription:
      'A traditional straight-razor shave with hot towels, pre-shave oil and a cold finish. Forty-five minutes, booked by the appointment.',
  },

  'cut-beard': {
    lines: ['One sitting.', 'Both shapes.', 'Balanced.'],
    standfirst:
      'A full haircut and beard sculpt booked together, timed properly, and cheaper than the two separately.',
    steps: [
      'Both shapes are planned at once — the beard line answers the hairline, and neither is decided in isolation.',
      'The cut is worked first, then the beard is shaped against the finished outline.',
      'Razor detailing across hairline, cheeks and neck in a single pass at the end.',
      'Hot towel to close, and both shapes shown in the mirror before you get up.',
    ],
    suits: [
      'Anyone who wears a beard and gets both done anyway',
      'A first visit where the whole look needs resetting',
      'Before a wedding, a shoot, or anything photographed',
    ],
    honest: [
      'Booked separately, these two run to seventy minutes of chair time and cost more. Book them together.',
      'If you want the beard off rather than shaped, book Cut + Royal Shave instead.',
    ],
    workCategory: 'beard',
    seed: 250,
    metaDescription:
      'Haircut and beard sculpting in one appointment, planned together and priced below the two separately. Book the full look.',
  },

  junior: {
    lines: ['Twelve and', 'under. Same', 'standard.'],
    standfirst:
      'A proper haircut for children, from barbers who are not fazed by wriggling, and thirty minutes that does not depend on them sitting still for all of it.',
    steps: [
      'We talk to them, not over them. What they want counts.',
      'Cut in stages with breaks if the stages are what it takes.',
      'Clippers introduced slowly for a first haircut, or not at all if they are not having it.',
      'Finished quickly once the shape is there. Nobody is held in a chair for the sake of the clock.',
    ],
    suits: [
      'First haircuts — tell us at booking and we set aside more time',
      'Children who have had a bad experience elsewhere',
      'Booking back-to-back with your own cut',
    ],
    honest: [
      'Thirteen and over is a full-price adult cut. It is the same work by then.',
      'If they are having a genuinely terrible day we will stop, charge you nothing, and try again another time.',
    ],
    workCategory: 'classic',
    seed: 259,
    metaDescription:
      'Kids’ haircuts for twelve and under, including first haircuts, with barbers who work around a short attention span.',
  },
};

export const serviceHasPage = (id: string) => id in serviceDetail;

export const detailedServiceIds = Object.keys(serviceDetail);

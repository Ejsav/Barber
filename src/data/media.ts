/* ============================================================================
 * HERO & ATMOSPHERE MEDIA
 * ----------------------------------------------------------------------------
 * Drop real assets in /public and point these at them. Everything degrades to
 * a generated halftone plate while they are null, at the same crop, so the
 * layout never changes when the photography lands.
 *
 * VIDEO: supply `poster` as well as `src`. The hero only fetches the video on
 * a wide viewport, on a connection that has not asked to save data, and never
 * under prefers-reduced-motion — the poster/plate carries it otherwise. Never
 * ship a hero video without a poster.
 * ========================================================================== */

export interface MediaSlot {
  image: string | null;
  alt: string;
  seed: number;
}

export const heroMedia = {
  /** e.g. '/hero/chair.mp4' — H.264/HEVC, under ~3MB, 8–12s, silent loop. */
  video: null as string | null,
  videoPoster: null as string | null,
  image: '/shop/hero.jpg' as string | null,
  alt: 'Barber mid-fade at the chair, clippers against the nape, shop lit low behind',
  seed: 3,
};

/** The Room — atmosphere set. Varied crops on purpose. */
export const shopMedia: MediaSlot[] = [
  {
    image: '/shop/chairs.jpg',
    alt: 'The row of chairs down the length of the shop, mirrors facing mirrors',
    seed: 21,
  },
  {
    image: '/shop/tools.jpg',
    alt: 'Chrome clippers, combs and shears laid out on a folded towel',
    seed: 34,
  },
  {
    image: '/shop/floor.jpg',
    alt: 'Cut hair on the floor beneath a chair at the end of the day',
    seed: 47,
  },
  {
    image: '/shop/records.jpg',
    alt: 'Record player and shelf of LPs beside the waiting bench',
    seed: 55,
  },
  {
    image: '/shop/window.jpg',
    alt: 'Front window looking out onto Chapel Street in late afternoon light',
    seed: 63,
  },
];

export const manifestoMedia: MediaSlot = {
  image: '/shop/fade-detail.jpg',
  alt: 'Close detail of a fade blending from skin into length, shot in raking light',
  seed: 88,
};

export const visitMedia: MediaSlot = {
  image: '/shop/chapel-street.jpg',
  alt: 'The shopfront on Chapel Street at dusk, sign lit',
  seed: 96,
};

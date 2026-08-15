import Image from 'next/image';
import { cn } from '@/lib/cn';

/* ============================================================================
 * PLATE — the photographic slot
 * ----------------------------------------------------------------------------
 * Every image on this site goes through <Plate>. When `src` is supplied it
 * renders a real, optimised next/image. When it is null it renders a generated
 * duotone halftone plate instead: a tonal gradient resolved into dot screens,
 * with press registration marks in the corners.
 *
 * That is not a grey box standing in for art direction — the screened plate IS
 * the brand's visual language (a fade is a tonal gradient; a tonal gradient on
 * press is a halftone). Real photography drops straight into the same slot at
 * the same crop with no layout change.
 *
 *   TO USE REAL PHOTOGRAPHY
 *   1. Put optimised files in /public (e.g. /public/work/fade-01.jpg)
 *   2. Set `image` on the record in data/work.ts or `portrait` in data/barbers.ts
 *   3. Nothing else changes.
 *
 * `alt` doubles as the art direction brief for the shot until then.
 * ========================================================================== */

export type PlateAspect =
  | 'portrait'
  | 'tall'
  | 'square'
  | 'landscape'
  | 'wide'
  | 'fill';

export type PlateVariant = 'scene' | 'portrait' | 'detail';

const ASPECT: Record<PlateAspect, string> = {
  portrait: '4 / 5',
  tall: '2 / 3',
  square: '1 / 1',
  landscape: '4 / 3',
  wide: '16 / 9',
  fill: '',
};

interface PlateProps {
  src?: string | null;
  alt: string;
  aspect?: PlateAspect;
  variant?: PlateVariant;
  /** Deterministic variation — same seed always renders the same plate. */
  seed?: number;
  /** Small mono caption burned into the plate, press-sheet style. */
  caption?: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  /** Hides registration marks + caption for small thumbnails. */
  bare?: boolean;
}

/* Deterministic pseudo-random in [0,1) from an integer seed. */
function rand(seed: number, salt: number) {
  const x = Math.sin(seed * 127.1 + salt * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

export function Plate({
  src,
  alt,
  aspect = 'portrait',
  variant = 'scene',
  seed = 7,
  caption,
  className,
  priority = false,
  sizes = '(max-width: 768px) 100vw, 50vw',
  bare = false,
}: PlateProps) {
  const style = aspect === 'fill' ? undefined : { aspectRatio: ASPECT[aspect] };

  if (src) {
    return (
      <div
        className={cn('relative overflow-hidden bg-ink-panel', className)}
        style={style}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      </div>
    );
  }

  /* -- Generated plate ----------------------------------------------------
   * A real halftone: dot SIZE tracks tone. Big dots resolve the highlight,
   * they shrink through the midtones and vanish into the shadow — which is
   * exactly the gradient a fade is, rendered the way a press would render it.
   * Opacity alone would just produce a grey haze, which is what a placeholder
   * looks like; varying the dot radius is what makes it read as an image.
   * -------------------------------------------------------------------- */

  // Angle of the tonal sweep — the direction of the fade.
  const angle =
    variant === 'portrait'
      ? 158 + rand(seed, 1) * 34
      : variant === 'detail'
        ? 62 + rand(seed, 2) * 56
        : 108 + rand(seed, 3) * 84;

  // Where the light mass sits.
  const lx = 26 + rand(seed, 4) * 48;
  const ly = variant === 'portrait' ? 22 + rand(seed, 5) * 16 : 30 + rand(seed, 6) * 38;
  const core = variant === 'detail' ? 26 : 34;

  // Band offsets so no two plates screen identically.
  const b1 = 24 + rand(seed, 7) * 12;
  const b2 = 54 + rand(seed, 8) * 14;

  // A single hard tonal step, the way a strong side light cuts across a frame.
  const stepAt = 38 + rand(seed, 10) * 26;

  const code = `${String(Math.floor(rand(seed, 9) * 89) + 10)}`;

  /* The three screens overlap into one continuous tonal ramp: coarse dots hold
   * a small bright core, mid dots carry the falloff, fine dots close up into
   * the shadow — and roughly a third of every frame stays genuinely empty, so
   * the plate reads as a composition rather than a swatch of pattern. */
  const highlightMask = `radial-gradient(${core + 8}% ${core}% at ${lx}% ${ly}%, #000 0%, rgba(0,0,0,0.45) 44%, transparent 74%)`;
  const midMask = `radial-gradient(${core + 34}% ${core + 26}% at ${lx}% ${ly}%, transparent 0%, rgba(0,0,0,0.75) ${b1 + 14}%, #000 ${b2}%, transparent 88%)`;
  const shadowMask = `radial-gradient(${core + 62}% ${core + 50}% at ${lx}% ${ly}%, transparent 0%, rgba(0,0,0,0.9) 42%, rgba(0,0,0,0.5) 68%, transparent 90%)`;

  return (
    <div
      className={cn(
        'group/plate relative isolate overflow-hidden bg-ink',
        className,
      )}
      style={style}
      role="img"
      aria-label={alt}
    >
      {/* Base tone — the underlying exposure, kept low so the dots carry it */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(${angle}deg, #3b322a 0%, #16130f 44%, #080807 82%)`,
        }}
      />

      {/* The hard tonal step — a strong side light cutting across the frame */}
      <div
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage: `linear-gradient(${angle + 34}deg, transparent 0%, transparent ${stepAt}%, rgba(10,9,8,0.92) ${stepAt + 1.5}%, rgba(10,9,8,0.98) 100%)`,
        }}
      />

      {/* Screens 1–3 — the tonal ramp.
          Each is rotated to a classic press screen angle (15°/45°/75°) so the
          rosette reads like a printed separation instead of a CSS grid, and
          the dot rows never line up with the layout. Blend mode sits on the
          masked wrapper; the rotation happens on an oversized child inside it,
          because a mask creates its own stacking context. */}
      <Screen radius={4} pitch={12} angle={45} mask={highlightMask} />
      <Screen
        radius={1.9}
        pitch={8}
        angle={15}
        mask={midMask}
        className="opacity-90"
      />
      <Screen
        radius={0.75}
        pitch={5}
        angle={75}
        mask={shadowMask}
        className="opacity-70"
      />

      {/* Subject mass — an abstract head-and-shoulders weight, never a
          depiction of a person. It gives portrait crops something to hold. */}
      {variant === 'portrait' && (
        <div
          className="absolute inset-0 mix-blend-screen"
          style={{
            backgroundImage: `radial-gradient(19% 14% at 50% 26%, rgba(236,229,217,0.30) 0%, transparent 72%), radial-gradient(44% 34% at 50% 101%, rgba(236,229,217,0.26) 0%, transparent 76%)`,
          }}
        />
      )}

      {/* Ember bleed — one warm edge so the plate is never neutral grey */}
      <div
        className="absolute inset-0 opacity-35 mix-blend-soft-light"
        style={{
          backgroundImage: `linear-gradient(${angle + 90}deg, var(--color-ember) 0%, transparent 52%)`,
        }}
      />

      {/* Vignette keeps type legible over the plate */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-ink/20" />

      {!bare && (
        <>
          <RegistrationMarks />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between p-3 sm:p-4">
            <span className="label-sm text-bone/80">{caption}</span>
            <span className="label-sm text-bone/60" aria-hidden="true">
              H/T·{code}
            </span>
          </div>
        </>
      )}
    </div>
  );
}

/** One rotated halftone screen, masked to the tonal band it belongs to. */
function Screen({
  radius,
  pitch,
  angle,
  mask,
  className,
}: {
  radius: number;
  pitch: number;
  /** Screen angle in degrees — 15/45/75 are the classic separation angles. */
  angle: number;
  mask: string;
  className?: string;
}) {
  return (
    <div
      className={cn('absolute inset-0 mix-blend-screen', className)}
      style={{ maskImage: mask, WebkitMaskImage: mask }}
    >
      <div
        className="absolute inset-[-45%]"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, var(--color-bone) ${radius}px, transparent ${radius + 0.6}px)`,
          backgroundSize: `${pitch}px ${pitch}px`,
          transform: `rotate(${angle}deg)`,
        }}
      />
    </div>
  );
}

/** Press crop marks — two corners only, so it reads as craft rather than decoration. */
function RegistrationMarks() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      <svg
        className="absolute left-3 top-3 text-steel/40"
        width="22"
        height="22"
        viewBox="0 0 22 22"
        fill="none"
      >
        <path d="M11 0 V22 M0 11 H22" stroke="currentColor" strokeWidth="0.75" />
        <circle
          cx="11"
          cy="11"
          r="5.5"
          stroke="currentColor"
          strokeWidth="0.75"
          opacity="0.55"
        />
      </svg>
      <svg
        className="absolute right-3 top-3 text-steel/25"
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
      >
        <path d="M14 0 H4 M14 0 V10" stroke="currentColor" strokeWidth="0.75" />
      </svg>
    </div>
  );
}

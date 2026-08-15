import { business } from '@/data/business';
import { cn } from '@/lib/cn';

/* ----------------------------------------------------------------------------
 * The wordmark is the brand argument in one object: the first half sits solid,
 * the second half breaks into a dot screen — a tonal gradient resolved on
 * press. Which is exactly what a fade is.
 *
 * The screened half is layered: opaque dots over a low-opacity flat fill, so
 * the letterforms stay readable at 16px while still reading as a screen.
 * -------------------------------------------------------------------------- */

const TONES = {
  bone: { solid: 'text-bone', dot: '#ece5d9', flat: 'rgba(236,229,217,0.34)' },
  ink: { solid: 'text-ink', dot: '#0b0a09', flat: 'rgba(11,10,9,0.34)' },
} as const;

export function Wordmark({
  className,
  tone = 'bone',
}: {
  className?: string;
  tone?: keyof typeof TONES;
}) {
  const t = TONES[tone];

  return (
    <span
      className={cn(
        'font-display inline-flex select-none items-baseline uppercase leading-none tracking-[-0.01em]',
        className,
      )}
    >
      <span className={t.solid}>{business.wordmark.first}</span>
      <span
        aria-hidden="true"
        className="bg-clip-text text-transparent"
        style={{
          backgroundImage: `radial-gradient(${t.dot} 0.85px, transparent 1.05px), linear-gradient(${t.flat}, ${t.flat})`,
          backgroundSize: '2.5px 2.5px, 100% 100%',
          WebkitBackgroundClip: 'text',
        }}
      >
        {business.wordmark.second}
      </span>
      <span className="sr-only">{business.wordmark.second}</span>
    </span>
  );
}

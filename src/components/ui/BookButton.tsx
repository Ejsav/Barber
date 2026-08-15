'use client';

import { useBooking, type BookingIntent } from '@/components/booking/BookingProvider';
import { cn } from '@/lib/cn';
import { Magnetic } from '@/components/ui/Magnetic';

type Variant = 'ember' | 'bone' | 'ink' | 'ghost' | 'ghost-bone';
type Size = 'sm' | 'md' | 'lg' | 'xl';

const VARIANTS: Record<Variant, string> = {
  // Ink on ember clears AA (5.0:1); bone on ember does not (3.1:1). The
  // hover state darkens AND inverts so it stays legible at 4.5:1.
  ember:
    'bg-ember text-ink hover:bg-ember-deep hover:text-bone border border-transparent',
  bone: 'bg-bone text-ink hover:bg-bone-raised border border-transparent',
  ink: 'bg-ink text-bone hover:bg-ink-panel border border-transparent',
  ghost:
    'bg-transparent text-bone border border-ink-line hover:border-bone hover:bg-bone hover:text-ink',
  'ghost-bone':
    'bg-transparent text-ink border border-bone-line hover:border-ink hover:bg-ink hover:text-bone',
};

const SIZES: Record<Size, string> = {
  sm: 'h-10 px-4 text-[0.6875rem] tracking-[0.16em]',
  md: 'h-12 px-6 text-[0.6875rem] tracking-[0.16em]',
  lg: 'h-14 px-8 text-xs tracking-[0.18em]',
  xl: 'h-16 px-10 text-xs tracking-[0.2em] sm:h-[4.5rem] sm:px-14 sm:text-sm',
};

interface BookButtonProps {
  intent?: BookingIntent;
  children?: React.ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  /** Disables the magnetic pull (e.g. inside a scrolling rail). */
  flat?: boolean;
}

export function BookButton({
  intent,
  children = 'Book your chair',
  variant = 'ember',
  size = 'lg',
  className,
  flat = false,
}: BookButtonProps) {
  const { open, isLive } = useBooking();

  const button = (
    <button
      type="button"
      onClick={() => open(intent)}
      className={cn(
        'group relative inline-flex items-center justify-center gap-3 font-mono uppercase',
        'transition-colors duration-300 ease-[var(--ease-out-expo)]',
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
    >
      <span className="relative z-10">{children}</span>
      <svg
        className="relative z-10 h-3 w-3 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-1"
        viewBox="0 0 12 12"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M1 6h10M7 2l4 4-4 4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="square"
        />
      </svg>
      {!isLive && <span className="sr-only"> (opens a demonstration booking flow)</span>}
    </button>
  );

  return flat ? button : <Magnetic>{button}</Magnetic>;
}

'use client';

import { useBooking, type BookingIntent } from '@/components/booking/BookingProvider';
import { cn } from '@/lib/cn';
import { Magnetic } from '@/components/ui/Magnetic';

type Size = 'sm' | 'md' | 'lg' | 'xl';

/**
 * One treatment, everywhere. BOOK is the single action this business runs on,
 * so it looks identical on every page and every ground — a visitor never has
 * to work out which button is the one that matters.
 *
 * Ink on ember clears AA at 5.0:1; bone on ember does not (3.1:1), and these
 * labels are 11–14px. The hover state darkens AND inverts so both states stay
 * above 4.5:1.
 */
const SURFACE =
  'bg-ember text-ink hover:bg-ember-deep hover:text-bone border border-transparent';

const SIZES: Record<Size, string> = {
  sm: 'h-10 px-4 text-[0.6875rem] tracking-[0.16em]',
  md: 'h-12 px-6 text-[0.6875rem] tracking-[0.16em]',
  lg: 'h-14 px-8 text-xs tracking-[0.18em]',
  xl: 'h-16 px-10 text-xs tracking-[0.2em] sm:h-[4.5rem] sm:px-14 sm:text-sm',
};

interface BookButtonProps {
  intent?: BookingIntent;
  /** Reported to analytics so the shop can see which surface converts. */
  placement?: string;
  children?: React.ReactNode;
  size?: Size;
  className?: string;
  /** Disables the magnetic pull (e.g. inside a scrolling rail). */
  flat?: boolean;
}

export function BookButton({
  intent,
  placement,
  children = 'Book your chair',
  size = 'lg',
  className,
  flat = false,
}: BookButtonProps) {
  const { open, isLive } = useBooking();

  const button = (
    <button
      type="button"
      onClick={() => open({ ...intent, ...(placement ? { placement } : null) })}
      className={cn(
        'group relative inline-flex items-center justify-center gap-3 font-mono uppercase',
        'transition-colors duration-300 ease-[var(--ease-out-expo)]',
        SURFACE,
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

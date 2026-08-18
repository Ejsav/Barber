'use client';

import { useBooking } from '@/components/booking/BookingProvider';
import type { BookingIntent } from '@/lib/booking';
import { cn } from '@/lib/cn';

/**
 * The quiet form of BOOK.
 *
 * The filled ember button is the one action on the page that shouts, and it
 * only works because nothing else does. In a dense grid — sixteen lookbook
 * frames, a list of services — sixteen filled buttons would flatten the
 * hierarchy and make none of them read as the action. This is the same intent
 * in text: available on every frame, loud on none.
 */
export function BookLink({
  intent,
  children = 'Book this look',
  className,
}: {
  intent?: BookingIntent;
  children?: React.ReactNode;
  className?: string;
}) {
  const { open, isLive } = useBooking();

  return (
    <button
      type="button"
      onClick={() => open(intent)}
      className={cn(
        'link-draw label-sm text-ember transition-opacity hover:opacity-75',
        className,
      )}
    >
      {children}
      {!isLive && <span className="sr-only"> (opens a demonstration booking flow)</span>}
    </button>
  );
}

'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { business } from '@/data/business';

/* ============================================================================
 * BOOKING
 * ----------------------------------------------------------------------------
 * Every BOOK control on the site funnels through this one provider, so the
 * site is never coupled to a booking vendor.
 *
 *  • business.booking.url set   → the control opens the client's real booking
 *                                 system (deep-linked per barber where the
 *                                 provider supports it).
 *  • business.booking.url null  → the built-in demo drawer opens, which walks
 *                                 the flow but explicitly books nothing.
 * ========================================================================== */

export interface BookingIntent {
  serviceId?: string;
  barberSlug?: string;
}

interface BookingContextValue {
  isOpen: boolean;
  intent: BookingIntent;
  /** True when a real external provider is wired up. */
  isLive: boolean;
  open: (intent?: BookingIntent) => void;
  close: () => void;
  setIntent: (intent: BookingIntent) => void;
}

const BookingContext = createContext<BookingContextValue | null>(null);

function externalUrl(intent: BookingIntent): string | null {
  const { url, barberUrls } = business.booking;
  if (!url) return null;
  if (intent.barberSlug && barberUrls[intent.barberSlug]) {
    return barberUrls[intent.barberSlug];
  }
  return url;
}

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [intent, setIntentState] = useState<BookingIntent>({});

  const open = useCallback((next: BookingIntent = {}) => {
    const href = externalUrl(next);
    if (href) {
      window.open(href, '_blank', 'noopener,noreferrer');
      return;
    }
    setIntentState(next);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);
  const setIntent = useCallback(
    (next: BookingIntent) => setIntentState((prev) => ({ ...prev, ...next })),
    [],
  );

  const value = useMemo(
    () => ({
      isOpen,
      intent,
      isLive: Boolean(business.booking.url),
      open,
      close,
      setIntent,
    }),
    [isOpen, intent, open, close, setIntent],
  );

  return (
    <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking must be used inside <BookingProvider>');
  return ctx;
}

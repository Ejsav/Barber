'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import {
  bookingEventFor,
  isBookingLive,
  resolveBookingUrl,
  shouldChooseBarber,
  type BookingIntent,
} from '@/lib/booking';
import { track } from '@/lib/analytics';

/* ============================================================================
 * BOOKING
 * ----------------------------------------------------------------------------
 * Every BOOK control on the site funnels through this one provider, so the
 * site is never coupled to a booking vendor, and every booking click is
 * measured in exactly one place.
 *
 * Three outcomes, decided by configuration rather than by the call site:
 *
 *   1. A provider is wired up and the intent already names a barber →
 *      straight out to that barber's page. No extra question.
 *   2. A provider is wired up, it has per-barber pages, and the visitor has
 *      not named one → the shop's own chooser opens first, then redirects.
 *      One question, asked in the shop's design instead of the vendor's.
 *   3. No provider configured → the built-in demo drawer opens, which walks
 *      the whole flow but explicitly books nothing.
 * ========================================================================== */

export type { BookingIntent };

type Mode = 'drawer' | 'chooser';

interface BookingContextValue {
  isOpen: boolean;
  /** Which surface is open. */
  mode: Mode;
  intent: BookingIntent;
  /** True when a real external provider is wired up. */
  isLive: boolean;
  open: (intent?: BookingIntent) => void;
  close: () => void;
  setIntent: (intent: BookingIntent) => void;
  /** Called from the chooser: routes on to the chosen barber's page. */
  chooseBarber: (slug: string | null) => void;
}

const BookingContext = createContext<BookingContextValue | null>(null);

function go(url: string) {
  window.open(url, '_blank', 'noopener,noreferrer');
}

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<Mode>('drawer');
  const [intent, setIntentState] = useState<BookingIntent>({});

  const open = useCallback((next: BookingIntent = {}) => {
    /* Fired before anything navigates, so the record exists even if the tab
     * is replaced on the very next tick. */
    track(bookingEventFor(next), {
      barber: next.barberSlug,
      service: next.serviceId,
      location: next.locationSlug,
      placement: next.placement,
    });

    if (shouldChooseBarber(next)) {
      setIntentState(next);
      setMode('chooser');
      setIsOpen(true);
      track('booking_modal_open', { placement: next.placement });
      return;
    }

    const href = resolveBookingUrl(next);
    if (href) {
      go(href);
      return;
    }

    setIntentState(next);
    setMode('drawer');
    setIsOpen(true);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  const setIntent = useCallback(
    (next: BookingIntent) => setIntentState((prev) => ({ ...prev, ...next })),
    [],
  );

  const chooseBarber = useCallback(
    (slug: string | null) => {
      const next = { ...intent, ...(slug ? { barberSlug: slug } : {}) };
      track('booking_modal_choice', {
        barber: slug ?? undefined,
        item: slug ? undefined : 'no-preference',
      });
      const href = resolveBookingUrl(next);
      setIsOpen(false);
      if (href) go(href);
    },
    [intent],
  );

  const value = useMemo(
    () => ({
      isOpen,
      mode,
      intent,
      isLive: isBookingLive,
      open,
      close,
      setIntent,
      chooseBarber,
    }),
    [isOpen, mode, intent, open, close, setIntent, chooseBarber],
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

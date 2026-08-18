/* ============================================================================
 * BOOKING ROUTING
 * ----------------------------------------------------------------------------
 * The site never implements scheduling. It routes to whatever the shop already
 * runs on — Booksy, Square, Fresha, Vagaro, TheCut, Boulevard, a bare Calendly.
 *
 * The one rule: a visitor who has already told us something must never be
 * asked it again. "BOOK MARCUS" opens Marcus's page, not a barber picker.
 *
 * Resolution runs most-specific-first and falls through every rung, so a shop
 * can launch with a single URL and add per-barber deep links months later
 * without a component changing.
 * ========================================================================== */

import { business } from '@/data/business';

export interface BookingIntent {
  serviceId?: string;
  barberSlug?: string;
  locationSlug?: string;
  /** Where the click came from — carried into analytics, not into the URL. */
  placement?: string;
}

/**
 * The external URL for an intent, or null when no provider is configured (in
 * which case the built-in demo drawer takes over).
 */
export function resolveBookingUrl(intent: BookingIntent = {}): string | null {
  const { url, barberUrls, serviceUrls, locationUrls } = business.booking;
  if (!url) return null;

  if (intent.barberSlug && barberUrls[intent.barberSlug]) {
    return barberUrls[intent.barberSlug];
  }
  if (intent.serviceId && serviceUrls[intent.serviceId]) {
    return serviceUrls[intent.serviceId];
  }
  if (intent.locationSlug && locationUrls[intent.locationSlug]) {
    return locationUrls[intent.locationSlug];
  }
  return url;
}

/** True once a real provider is wired up. */
export const isBookingLive = Boolean(business.booking.url);

/** True when the provider has per-barber pages worth routing to. */
export const hasBarberRouting =
  Object.keys(business.booking.barberUrls).length > 0;

/**
 * Whether a generic BOOK should open the shop's own barber chooser before
 * redirecting. Only worth it when it removes a step: a provider with per-barber
 * links, a visitor who has not named one, and the shop wanting the choice made
 * in its own design rather than in a vendor list.
 */
export function shouldChooseBarber(intent: BookingIntent = {}): boolean {
  return (
    isBookingLive &&
    hasBarberRouting &&
    business.booking.chooseBarberFirst &&
    !intent.barberSlug
  );
}

/** The analytics event a booking click represents. */
export function bookingEventFor(intent: BookingIntent = {}) {
  if (intent.barberSlug) return 'barber_book_click' as const;
  if (intent.serviceId) return 'service_book_click' as const;
  return 'book_click' as const;
}

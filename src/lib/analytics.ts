/* ============================================================================
 * CONVERSION MEASUREMENT
 * ----------------------------------------------------------------------------
 * The business question this site exists to answer is "how many people who
 * landed here ended up in a chair?". That cannot be answered retroactively, so
 * the events are wired from day one — even though no analytics vendor is
 * installed yet.
 *
 * This module is deliberately vendor-neutral and dependency-free:
 *
 *   • It pushes a normalised object onto `window.dataLayer`, which is what
 *     Google Tag Manager, Segment and most server-side tagging setups read.
 *   • If a global `gtag` exists (GA4 loaded directly), it forwards there too.
 *   • With neither present it is a no-op — nothing is queued, nothing leaks,
 *     no requests are made, and no cookie is written. Installing GTM later is
 *     the only change needed to start collecting.
 *
 * Only actions that indicate intent are tracked. Scroll depth, hovers and
 * section views are not events; they are vanity and they cost the visitor
 * bandwidth to report.
 * ========================================================================== */

export type AnalyticsEvent =
  /* Booking intent — the events that matter most. */
  | 'book_click'
  | 'barber_book_click'
  | 'service_book_click'
  | 'booking_modal_open'
  | 'booking_modal_choice'
  /* Contact intent. */
  | 'phone_click'
  | 'directions_click'
  | 'gift_card_click'
  /* Discovery — which barber and which work people actually look at. */
  | 'barber_profile_view'
  | 'cut_explorer_select'
  /* Off-site. */
  | 'instagram_click'
  | 'tiktok_click'
  | 'review_click';

export interface AnalyticsPayload {
  /** Barber slug, where the action names one. */
  barber?: string;
  /** Service id, where the action names one. */
  service?: string;
  /** Location slug, for multi-location shops. */
  location?: string;
  /** Where on the site the action was taken — 'hero', 'mobile_bar', 'footer'… */
  placement?: string;
  /** Cut Explorer look id, promotion id, or similar. */
  item?: string;
  /** Destination for outbound clicks. */
  destination?: string;
}

type DataLayerRecord = AnalyticsPayload & { event: AnalyticsEvent };

declare global {
  interface Window {
    dataLayer?: DataLayerRecord[];
    gtag?: (command: string, event: string, params?: AnalyticsPayload) => void;
  }
}

/**
 * Record a conversion-relevant action.
 *
 * Safe to call from anywhere: it never throws, never blocks the interaction it
 * describes, and does nothing at all when no tag manager is installed. Call it
 * BEFORE the navigation it measures — the push is synchronous, so the record
 * exists in the queue even if the page unloads immediately afterwards.
 */
export function track(event: AnalyticsEvent, payload: AnalyticsPayload = {}) {
  if (typeof window === 'undefined') return;

  const record: DataLayerRecord = { event, ...payload };

  try {
    if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push(record);
    }
    if (typeof window.gtag === 'function') {
      window.gtag('event', event, payload);
    }
    if (process.env.NODE_ENV === 'development') {
      // Visible while building so a miswired CTA is obvious in the console.
      console.debug('[analytics]', event, payload);
    }
  } catch {
    /* Measurement must never break a booking. */
  }
}

/**
 * Handler for outbound links. Fires the event, then lets the browser follow
 * the link normally — no preventDefault, no artificial delay, no beacon race.
 */
export function trackOutbound(
  event: AnalyticsEvent,
  payload: AnalyticsPayload = {},
) {
  return () => track(event, payload);
}

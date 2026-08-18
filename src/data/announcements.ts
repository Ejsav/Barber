/* ============================================================================
 * ANNOUNCEMENTS & PROMOTIONS
 * ----------------------------------------------------------------------------
 * Two related things, deliberately kept apart:
 *
 *   ANNOUNCEMENTS are operational and temporary — holiday hours, a new barber,
 *   Sunday opening. One shows at a time, in a thin bar above the header, and
 *   it is dismissible.
 *
 *   PROMOTIONS are offers. They appear where someone is already deciding
 *   (the menu, the first-visit section), never as a pop-up over the page.
 *
 * BOTH EXPIRE BY THEMSELVES. `endsAt` is an ISO date; once it is past, the
 * item stops rendering with no code change and no stale "Father's Day offer"
 * still up in September. Expiry is evaluated against the VISITOR's clock, not
 * the build machine's, so a statically generated page cannot go stale.
 *
 * Leave both arrays empty and every trace of the system disappears — no bar,
 * no offer strip, no layout gap.
 * ========================================================================== */

export interface Announcement {
  id: string;
  /** Kept short. It sits in a 40px bar next to a dismiss control. */
  message: string;
  /** Optional in-site destination. External URLs are fine too. */
  href?: string;
  linkLabel?: string;
  /** ISO date. Before this, it does not show. */
  startsAt?: string;
  /** ISO date, inclusive. After this, it stops showing on its own. */
  endsAt?: string;
  /** Only one announcement renders; the lowest number wins. */
  priority?: number;
}

export interface Promotion {
  id: string;
  /** The offer, set large. */
  headline: string;
  /** The terms, in plain English. No asterisks. */
  detail: string;
  /** Service this applies to, when it is service-specific. */
  serviceId?: string;
  href?: string;
  linkLabel?: string;
  startsAt?: string;
  endsAt?: string;
}

/* ⚠️  DEMO CONTENT — replace with the shop's real notices before launch. ⚠️
 * Anything with a date in the past is already invisible; that is the point. */

export const announcements: Announcement[] = [
  {
    id: 'walk-ins',
    message: 'Walk-ins taken all week — chairs open most weekday mornings.',
    href: '/visit',
    linkLabel: 'Visit',
    priority: 2,
  },
  {
    id: 'sundays',
    message: 'Now cutting Sundays, 11am to 4pm on Chapel Street.',
    href: '/visit',
    linkLabel: 'Hours',
    priority: 1,
  },
];

export const promotions: Promotion[] = [
  {
    id: 'first-cut',
    headline: 'First cut with us? $5 off.',
    detail:
      'Mention it at the chair on your first visit. One per person, any service, no card needed.',
  },
  {
    id: 'student-tuesday',
    headline: 'Student Tuesdays — $5 off any cut.',
    detail:
      'Valid student ID at the chair. Tuesdays only, all barbers, no appointment needed.',
  },
  {
    id: 'father-son',
    headline: 'Father + son, booked together.',
    detail:
      'Book a cut and a junior cut back-to-back and the junior cut is $10 off.',
    serviceId: 'junior',
  },
];

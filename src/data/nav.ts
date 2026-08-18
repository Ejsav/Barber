/* Navigation. Kept out of the client Header component so server components
 * (the 404 page, the footer) can import the same lists without pulling a
 * client-module reference across the boundary.
 *
 * The secondary list is built from the feature flags, so a shop that does not
 * do weddings, is not hiring, or has one address never renders a link to a
 * page that does not exist. */

import { isMultiLocation } from './locations';
import { careers } from './careers';
import { events } from './events';

export interface NavItem {
  href: string;
  label: string;
  index: string;
}

/** Primary navigation — the header and the mobile sheet. */
export const NAV: NavItem[] = [
  { href: '/services', label: 'Services', index: '01' },
  { href: '/barbers', label: 'Barbers', index: '02' },
  { href: '/work', label: 'The Book', index: '03' },
  { href: '/find-your-cut', label: 'Find your cut', index: '04' },
  { href: '/visit', label: 'Visit', index: '05' },
];

/** Everything else worth linking, but not worth a header slot. */
export const SECONDARY_NAV: NavItem[] = [
  { href: '/reviews', label: 'Reviews', index: '06' },
  { href: '/faq', label: 'Questions', index: '07' },
  ...(isMultiLocation
    ? [{ href: '/locations', label: 'Locations', index: '08' }]
    : []),
  ...(events.enabled
    ? [{ href: '/weddings', label: 'Weddings & groups', index: '09' }]
    : []),
  ...(careers.enabled
    ? [{ href: '/careers', label: 'Join the shop', index: '10' }]
    : []),
];

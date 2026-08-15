/* Primary navigation. Kept out of the client Header component so server
 * components (the 404 page, the footer) can import the same list without
 * pulling a client-module reference across the boundary. */

export interface NavItem {
  href: string;
  label: string;
  index: string;
}

export const NAV: NavItem[] = [
  { href: '/services', label: 'Services', index: '01' },
  { href: '/barbers', label: 'Barbers', index: '02' },
  { href: '/work', label: 'The Book', index: '03' },
  { href: '/visit', label: 'Visit', index: '04' },
];

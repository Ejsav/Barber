/* ============================================================================
 * LOCATIONS
 * ----------------------------------------------------------------------------
 * One brand, any number of shops. Everything that can differ between two
 * addresses of the same business lives here — hours, phone, chairs, parking,
 * booking link, photography — so a second shop is a new object in this array
 * and nothing else.
 *
 * THE FLAGSHIP IS NOT DUPLICATED. `locations[0]` reads its address, hours,
 * phone and geo straight out of `data/business.ts`, which stays the single
 * source of truth for the primary shop and for the site-wide LocalBusiness
 * schema. Additional shops are declared in full below it.
 *
 * SINGLE-SHOP BEHAVIOUR: with one entry in this array, `isMultiLocation` is
 * false and every multi-shop affordance disappears on its own — the /locations
 * routes 404, the location switcher never renders, the footer shows one
 * address. Delete the Whitney Avenue entry and the site becomes a
 * single-location site with no other edit.
 *
 * ⚠️  Both entries below are DEMO DATA for a fictional business.  ⚠️
 * ========================================================================== */

import {
  business,
  type DayHours,
  type WeekdayKey,
} from './business';
import type { MediaSlot } from './media';

export interface LocationAddress {
  street: string;
  unit?: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
}

export interface Location {
  slug: string;
  /** How the shop is referred to in running text: "Chapel Street". */
  name: string;
  /** Two or three words for tight spaces: nav, chips, the switcher. */
  shortName: string;
  city: string;
  /** "New Haven, CT" — used in headlines and metadata. */
  locality: string;
  neighborhood: string;
  /** One line, editorial, specific to this address. */
  standfirst: string;
  address: LocationAddress;
  phone: string;
  phoneHref: string;
  geo: { lat: number; lng: number };
  hours: Record<WeekdayKey, DayHours>;
  /** Slugs from data/barbers.ts who cut here. */
  barberSlugs: string[];
  /** Overrides the shop-wide booking URL for this address. */
  bookingUrl: string | null;
  parking: string;
  transit: string;
  walkIns: string;
  accessibility: string;
  opened: string;
  media: MediaSlot;
  /** The address the rest of the site treats as "the shop". */
  isPrimary: boolean;
}

/* -- The flagship — mirrors data/business.ts, never restates it ------------- */

const chapelStreet: Location = {
  slug: 'chapel-street',
  name: 'Chapel Street',
  shortName: 'Chapel St',
  city: business.address.city,
  locality: business.locality,
  neighborhood: business.neighborhood,
  standfirst:
    'The original room. Five chairs, a record player and the front window onto Chapel.',
  address: { ...business.address },
  phone: business.phone,
  phoneHref: business.phoneHref,
  geo: { ...business.geo },
  hours: { ...business.hours },
  barberSlugs: [
    'marcus-reyes',
    'desmond-whitfield',
    'nina-castellanos',
    'yusuf-amari',
    'june-park',
  ],
  bookingUrl: null,
  parking: business.parking,
  transit: business.transit,
  walkIns: business.walkIns,
  accessibility: business.accessibility,
  opened: business.founded,
  media: {
    image: null,
    alt: 'The shopfront on Chapel Street at dusk, sign lit',
    seed: 96,
  },
  isPrimary: true,
};

/* -- Second shop -----------------------------------------------------------
 * PLACEHOLDER — a fictional second address, here to keep the multi-location
 * paths exercised. Delete this object for a single-shop client; replace it in
 * full for a client with two.
 * ------------------------------------------------------------------------- */

const whitneyAvenue: Location = {
  slug: 'whitney-avenue',
  name: 'Whitney Avenue',
  shortName: 'Whitney Ave',
  city: 'Hamden',
  locality: 'Hamden, CT',
  neighborhood: 'Spring Glen',
  standfirst:
    'Two chairs, longer evenings and easier parking. The same standard, ten minutes up Whitney.',
  address: {
    street: '1284 Whitney Avenue', // PLACEHOLDER
    city: 'Hamden',
    region: 'CT',
    postalCode: '06517',
    country: 'US',
  },
  /** Reserved 555-01xx range — deliberately non-dialable. REPLACE. */
  phone: '+1 (203) 555-0177',
  phoneHref: 'tel:+12035550177',
  geo: { lat: 41.3559, lng: -72.9098 }, // PLACEHOLDER — approximate
  hours: {
    monday: { open: null, close: null },
    tuesday: { open: '11:00', close: '20:00' },
    wednesday: { open: '11:00', close: '20:00' },
    thursday: { open: '11:00', close: '20:00' },
    friday: { open: '10:00', close: '20:00' },
    saturday: { open: '09:00', close: '17:00' },
    sunday: { open: null, close: null },
  },
  barberSlugs: ['desmond-whitfield', 'june-park'],
  bookingUrl: null,
  parking: 'Free lot behind the building, entrance off Waite Street.',
  transit: 'The 229 and 265 both stop at Whitney and Putnam, one block south.',
  walkIns:
    'Two chairs, so walk-ins depend on the day. Call ahead and we will tell you honestly.',
  accessibility: 'Step-free entry from the rear lot. Accessible restroom.',
  opened: '2023', // PLACEHOLDER
  media: {
    image: null,
    alt: 'The Whitney Avenue shopfront in the morning, awning out, lot behind',
    seed: 112,
  },
  isPrimary: false,
};

export const locations: Location[] = [chapelStreet, whitneyAvenue];

/** The address the site defaults to everywhere a single shop is implied. */
export const primaryLocation =
  locations.find((l) => l.isPrimary) ?? locations[0];

export const isMultiLocation = locations.length > 1;

export const getLocation = (slug: string) =>
  locations.find((l) => l.slug === slug);

export const locationsForBarber = (slug: string) =>
  locations.filter((l) => l.barberSlugs.includes(slug));

export function locationFullAddress(location: Location) {
  const { street, unit, city, region, postalCode } = location.address;
  return `${street}${unit ? `, ${unit}` : ''}, ${city}, ${region} ${postalCode}`;
}

export function locationDirectionsUrl(location: Location) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    `${business.name} ${locationFullAddress(location)}`,
  )}`;
}

export function locationMapUrl(location: Location) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    locationFullAddress(location),
  )}`;
}

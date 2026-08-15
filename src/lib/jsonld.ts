import {
  business,
  fullAddress,
  socialProof,
} from '@/data/business';
import { barbers } from '@/data/barbers';
import { services, serviceGroups } from '@/data/services';
import { openingHoursSpecification } from '@/lib/hours';
import { siteUrl } from '@/lib/seo';

const shopId = `${siteUrl}/#barbershop`;

/**
 * LocalBusiness (HairSalon) graph.
 *
 * NOTE: aggregateRating is emitted ONLY when socialProof.verified is true.
 * Publishing an invented rating breaks Google's structured-data policy and is
 * dishonest, so the gate is deliberate — see data/business.ts.
 */
export function localBusinessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'HairSalon',
    '@id': shopId,
    name: business.name,
    legalName: business.legalName,
    description: `${business.name} is a precision barbershop in ${business.locality} offering haircuts, skin fades, beard sculpting and straight-razor shaves.`,
    url: siteUrl,
    telephone: business.phone,
    email: business.email,
    image: `${siteUrl}/opengraph-image`,
    priceRange: '$$',
    currenciesAccepted: 'USD',
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${business.address.street}${
        business.address.unit ? `, ${business.address.unit}` : ''
      }`,
      addressLocality: business.address.city,
      addressRegion: business.address.region,
      postalCode: business.address.postalCode,
      addressCountry: business.address.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: business.geo.lat,
      longitude: business.geo.lng,
    },
    hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`,
    openingHoursSpecification: openingHoursSpecification(),
    sameAs: [
      business.social.instagram,
      business.social.tiktok,
      business.social.google,
    ].filter(Boolean),
    areaServed: [
      { '@type': 'City', name: 'New Haven' },
      { '@type': 'City', name: 'Hamden' },
      { '@type': 'City', name: 'West Haven' },
      { '@type': 'City', name: 'East Haven' },
    ],
    employee: barbers.map((b) => ({
      '@type': 'Person',
      name: b.name,
      jobTitle: b.role,
      url: `${siteUrl}/barbers/${b.slug}`,
    })),
    makesOffer: services.map((s) => ({
      '@type': 'Offer',
      name: s.name,
      description: s.description,
      priceCurrency: 'USD',
      price: s.price,
      category:
        serviceGroups.find((g) => g.id === s.group)?.name ?? 'Barbering',
    })),
    ...(socialProof.verified
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: socialProof.rating,
            reviewCount: socialProof.reviewCount,
            bestRating: 5,
          },
        }
      : {}),
  };
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    url: siteUrl,
    name: business.name,
    publisher: { '@id': shopId },
    inLanguage: 'en-US',
  };
}

export function barberJsonLd(slug: string) {
  const barber = barbers.find((b) => b.slug === slug);
  if (!barber) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${siteUrl}/barbers/${barber.slug}/#person`,
    name: barber.name,
    jobTitle: barber.role,
    url: `${siteUrl}/barbers/${barber.slug}`,
    worksFor: { '@id': shopId },
    knowsAbout: barber.specialties,
    ...(barber.instagram ? { sameAs: [barber.instagram] } : {}),
  };
}

/** Serialiser used by the <JsonLd> component. */
export function jsonLdScript(data: object) {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

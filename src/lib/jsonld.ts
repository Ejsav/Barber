import {
  business,
  fullAddress,
  socialProof,
} from '@/data/business';
import { barbers } from '@/data/barbers';
import { services, serviceGroups } from '@/data/services';
import { faqs } from '@/data/faq';
import {
  locations,
  locationMapUrl,
  type Location,
} from '@/data/locations';
import { serviceDetail } from '@/data/serviceDetail';
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
    ...(locations.length > 1
      ? {
          subOrganization: locations
            .filter((l) => !l.isPrimary)
            .map((l) => ({
              '@type': 'HairSalon',
              name: `${business.name} — ${l.name}`,
              url: `${siteUrl}/locations/${l.slug}`,
              telephone: l.phone,
              address: {
                '@type': 'PostalAddress',
                streetAddress: l.address.street,
                addressLocality: l.address.city,
                addressRegion: l.address.region,
                postalCode: l.address.postalCode,
                addressCountry: l.address.country,
              },
            })),
        }
      : {}),
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

/* ----------------------------------------------------------------------------
 * FAQPage.
 *
 * Google reads these as factual claims about the business, so they are emitted
 * verbatim from the same source the page renders — never a summarised or
 * keyword-tuned second copy.
 * -------------------------------------------------------------------------- */
export function faqJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${siteUrl}/faq/#faq`,
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer.join(' '),
      },
    })),
  };
}

/** A single service, for the pages that have one. */
export function serviceJsonLd(id: string) {
  const service = services.find((s) => s.id === id);
  const detail = serviceDetail[id];
  if (!service || !detail) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${siteUrl}/services/${service.id}/#service`,
    name: service.name,
    serviceType: serviceGroups.find((g) => g.id === service.group)?.name,
    description: detail.metaDescription,
    provider: { '@id': shopId },
    areaServed: { '@type': 'City', name: business.city },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'USD',
      price: service.price,
      /* `from` prices are a range, not a price. Marking a variable price as
       * exact would be a false claim in machine-readable form. */
      ...(service.from ? { priceSpecification: { '@type': 'PriceSpecification', minPrice: service.price, priceCurrency: 'USD' } } : {}),
      availability: 'https://schema.org/InStock',
      url: `${siteUrl}/services/${service.id}`,
    },
  };
}

/**
 * A branch. The flagship is already described by localBusinessJsonLd(), so a
 * second entity is only emitted for the other addresses, each pointing back at
 * the parent with branchOf rather than claiming to be its own business.
 */
export function locationJsonLd(location: Location) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HairSalon',
    '@id': `${siteUrl}/locations/${location.slug}/#branch`,
    name: `${business.name} — ${location.name}`,
    ...(location.isPrimary ? {} : { branchOf: { '@id': shopId } }),
    url: `${siteUrl}/locations/${location.slug}`,
    telephone: location.phone,
    image: `${siteUrl}/opengraph-image`,
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${location.address.street}${
        location.address.unit ? `, ${location.address.unit}` : ''
      }`,
      addressLocality: location.address.city,
      addressRegion: location.address.region,
      postalCode: location.address.postalCode,
      addressCountry: location.address.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: location.geo.lat,
      longitude: location.geo.lng,
    },
    hasMap: locationMapUrl(location),
    openingHoursSpecification: openingHoursSpecification(location.hours),
    employee: barbers
      .filter((b) => location.barberSlugs.includes(b.slug))
      .map((b) => ({
        '@type': 'Person',
        name: b.name,
        url: `${siteUrl}/barbers/${b.slug}`,
      })),
  };
}

/** Every additional address, referenced from the flagship. */
export const branchLocations = locations.filter((l) => !l.isPrimary);

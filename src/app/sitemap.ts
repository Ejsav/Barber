import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/seo';
import { barbers } from '@/data/barbers';
import { detailedServiceIds } from '@/data/serviceDetail';
import { isMultiLocation, locations } from '@/data/locations';
import { careers } from '@/data/careers';
import { events } from '@/data/events';

/**
 * The sitemap is generated from the same flags the routes are gated on, so it
 * can never advertise a page that 404s: turn off weddings and the entry goes
 * with it, delete the second shop and the /locations URLs go with it.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const routes: MetadataRoute.Sitemap = (
    [
      { url: siteUrl, changeFrequency: 'monthly', priority: 1 },
      { url: `${siteUrl}/services`, changeFrequency: 'monthly', priority: 0.9 },
      { url: `${siteUrl}/barbers`, changeFrequency: 'monthly', priority: 0.9 },
      {
        url: `${siteUrl}/find-your-cut`,
        changeFrequency: 'monthly',
        priority: 0.9,
      },
      { url: `${siteUrl}/work`, changeFrequency: 'weekly', priority: 0.8 },
      { url: `${siteUrl}/visit`, changeFrequency: 'monthly', priority: 0.8 },
      { url: `${siteUrl}/reviews`, changeFrequency: 'weekly', priority: 0.7 },
      { url: `${siteUrl}/faq`, changeFrequency: 'monthly', priority: 0.6 },
      { url: `${siteUrl}/privacy`, changeFrequency: 'yearly', priority: 0.1 },
      ...(events.enabled
        ? [
            {
              url: `${siteUrl}/weddings`,
              changeFrequency: 'monthly' as const,
              priority: 0.6,
            },
          ]
        : []),
      ...(careers.enabled
        ? [
            {
              url: `${siteUrl}/careers`,
              changeFrequency: 'monthly' as const,
              priority: 0.4,
            },
          ]
        : []),
      ...(isMultiLocation
        ? [
            {
              url: `${siteUrl}/locations`,
              changeFrequency: 'monthly' as const,
              priority: 0.8,
            },
          ]
        : []),
    ] satisfies MetadataRoute.Sitemap
  ).map((r) => ({ ...r, lastModified: now }));

  const profiles: MetadataRoute.Sitemap = barbers.map((b) => ({
    url: `${siteUrl}/barbers/${b.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const servicePages: MetadataRoute.Sitemap = detailedServiceIds.map((id) => ({
    url: `${siteUrl}/services/${id}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const locationPages: MetadataRoute.Sitemap = isMultiLocation
    ? locations.map((l) => ({
        url: `${siteUrl}/locations/${l.slug}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.8,
      }))
    : [];

  return [...routes, ...profiles, ...servicePages, ...locationPages];
}

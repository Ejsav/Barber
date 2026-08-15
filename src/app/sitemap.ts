import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/seo';
import { barbers } from '@/data/barbers';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const routes: MetadataRoute.Sitemap = (
    [
      { url: siteUrl, changeFrequency: 'monthly', priority: 1 },
      { url: `${siteUrl}/services`, changeFrequency: 'monthly', priority: 0.9 },
      { url: `${siteUrl}/barbers`, changeFrequency: 'monthly', priority: 0.9 },
      { url: `${siteUrl}/work`, changeFrequency: 'weekly', priority: 0.8 },
      { url: `${siteUrl}/visit`, changeFrequency: 'monthly', priority: 0.8 },
    ] satisfies MetadataRoute.Sitemap
  ).map((r) => ({ ...r, lastModified: now }));

  const profiles: MetadataRoute.Sitemap = barbers.map((b) => ({
    url: `${siteUrl}/barbers/${b.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...routes, ...profiles];
}

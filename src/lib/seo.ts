import type { Metadata } from 'next';
import { business } from '@/data/business';

export const siteUrl = business.url;

export const defaultOgImage = {
  url: '/opengraph-image',
  width: 1200,
  height: 630,
  alt: `${business.name} — ${business.descriptor}, ${business.locality}`,
};

interface PageMetaInput {
  title: string;
  description: string;
  /** Path with leading slash, e.g. '/barbers'. */
  path: string;
  /** Set false on pages that should not be indexed. */
  index?: boolean;
  /**
   * Pass `null` on a route that has its own `opengraph-image` file — naming an
   * image here would override the generated one and every barber would share
   * the shop's card.
   */
  ogImage?: { url: string; width: number; height: number; alt: string } | null;
}

export function pageMetadata({
  title,
  description,
  path,
  index = true,
  ogImage = defaultOgImage,
}: PageMetaInput): Metadata {
  const url = `${siteUrl}${path === '/' ? '' : path}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    robots: index
      ? { index: true, follow: true }
      : { index: false, follow: true },
    openGraph: {
      type: 'website',
      url,
      siteName: business.name,
      title,
      description,
      locale: 'en_US',
      ...(ogImage ? { images: [ogImage] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      site: business.twitterHandle,
      title,
      description,
      ...(ogImage ? { images: [ogImage.url] } : {}),
    },
  };
}

export interface Crumb {
  name: string;
  path: string;
}

export function breadcrumbJsonLd(crumbs: Crumb[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: `${siteUrl}${c.path === '/' ? '' : c.path}`,
    })),
  };
}

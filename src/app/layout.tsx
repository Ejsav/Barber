import type { Metadata, Viewport } from 'next';
import { Big_Shoulders, Schibsted_Grotesk, DM_Mono } from 'next/font/google';
import './globals.css';

import { business } from '@/data/business';
import { siteUrl, defaultOgImage } from '@/lib/seo';
import { localBusinessJsonLd, websiteJsonLd } from '@/lib/jsonld';
import { JsonLd } from '@/components/seo/JsonLd';
import { MotionRoot } from '@/components/layout/MotionRoot';
import { SmoothScroll } from '@/components/layout/SmoothScroll';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileActionBar } from '@/components/layout/MobileActionBar';
import { BookingProvider } from '@/components/booking/BookingProvider';
import { activeAnnouncement } from '@/lib/promotions';
import { BookingDrawer } from '@/components/booking/BookingDrawer';
import { BarberChooser } from '@/components/booking/BarberChooser';

/* Display: condensed, editorial, built for extreme scale.
 * Variable on both weight and optical size — the display utilities in
 * globals.css push `opsz` up as the type gets larger, which is what keeps the
 * huge headlines tight rather than merely scaled-up text type. */
const display = Big_Shoulders({
  subsets: ['latin'],
  variable: '--font-display',
  axes: ['opsz'],
  display: 'swap',
  // Next has no metric-override data for this family, so name the fallbacks
  // explicitly: condensed grotesques that hold a similar width while swapping.
  fallback: ['Haettenschweiler', 'Arial Narrow', 'Impact', 'sans-serif'],
});

/* Body: a quiet modern grotesk that stays legible at 13px. */
const sans = Schibsted_Grotesk({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

/* Mono: prices, durations, times, labels. */
const mono = DM_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['300', '400', '500'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${business.name} — ${business.descriptor}, ${business.locality}`,
    template: `%s · ${business.name}`,
  },
  description: `Precision barbering in ${business.locality}. Cuts, skin fades, beard sculpting and straight-razor shaves on ${business.address.street}. Book a chair online.`,
  applicationName: business.name,
  authors: [{ name: business.legalName }],
  creator: business.legalName,
  keywords: [
    'barbershop New Haven',
    'haircut New Haven CT',
    'skin fade New Haven',
    'beard trim New Haven',
    'straight razor shave Connecticut',
    'barber Chapel Street',
  ],
  // No canonical here on purpose: each page sets its own via pageMetadata(),
  // and a blanket value would put a canonical to "/" on the 404 page too.
  openGraph: {
    type: 'website',
    url: siteUrl,
    siteName: business.name,
    locale: 'en_US',
    images: [defaultOgImage],
  },
  twitter: { card: 'summary_large_image', site: business.twitterHandle },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  category: 'Barbershop',
  formatDetection: { telephone: true, address: true },
};

export const viewport: Viewport = {
  themeColor: '#0b0a09',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  /* Resolved at build time so the bar is in the server HTML and reserves its
   * own height before first paint. AnnouncementBar re-resolves it against the
   * visitor's clock on mount, which is what stops a statically generated page
   * advertising last month's hours. */
  const announcement = activeAnnouncement(new Date());

  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable}${
        announcement ? ' has-announcement' : ''
      }`}
      suppressHydrationWarning
    >
      <head>
        {/*
          Runs before first paint: an announcement the visitor already
          dismissed is never drawn, rather than drawn and then removed on
          hydration. Two hundred bytes, and it is the difference between a
          polished header and a flicker on every page.
        */}
        {announcement && (
          <script
            dangerouslySetInnerHTML={{
              __html: `try{if(sessionStorage.getItem('ht:announce-dismissed')===${JSON.stringify(
                announcement.id,
              )})document.documentElement.dataset.announce='dismissed'}catch(e){}`,
            }}
          />
        )}
      </head>
      <body className="bg-ink text-bone antialiased">
        {/*
          Motion serialises each entrance animation's `initial` state into the
          server HTML as an inline opacity/transform. Without JavaScript those
          never resolve, so every section below the hero would render invisible
          even though the content is right there in the markup. This forces the
          finished state when scripting is off. The hero needs no help — its
          entrance is a CSS animation.
        */}
        <noscript
          dangerouslySetInnerHTML={{
            __html:
              '<style>[data-reveal]{opacity:1!important;transform:none!important}</style>',
          }}
        />

        <JsonLd data={localBusinessJsonLd()} id="ld-localbusiness" />
        <JsonLd data={websiteJsonLd()} id="ld-website" />

        <a
          href="#main"
          className="label fixed left-4 top-4 z-[200] -translate-y-24 bg-ember px-4 py-3 text-ink transition-transform focus-visible:translate-y-0"
        >
          Skip to content
        </a>

        <MotionRoot>
          <BookingProvider>
            <SmoothScroll />
            <Header announcement={announcement} />
            <main id="main" className="relative">
              {children}
            </main>
            <Footer />
            <MobileActionBar />
            <BookingDrawer />
            <BarberChooser />
          </BookingProvider>
        </MotionRoot>

        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}

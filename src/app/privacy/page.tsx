import Link from 'next/link';

import { PageHero } from '@/components/layout/PageHero';
import { pageMetadata } from '@/lib/seo';
import { business, fullAddress } from '@/data/business';

export const metadata = pageMetadata({
  title: 'Privacy',
  description: `How ${business.name} handles information collected through this website.`,
  path: '/privacy',
});

/* ============================================================================
 * PRIVACY
 * ----------------------------------------------------------------------------
 * This describes what THIS BUILD actually does, which is unusually little: no
 * cookies are set, no analytics vendor is installed, and nothing on the site
 * submits anywhere. It is written from the code rather than from a template,
 * so it is accurate as shipped.
 *
 * ⚠️  DEVELOPER: it stops being accurate the moment any of these are added —
 *     a tag manager, a pixel, a CRM behind the first-visit form, a live
 *     booking embed, a chat widget. Update this page in the same commit, and
 *     have the client's counsel review it before launch. It is a description,
 *     not legal advice.
 * ========================================================================== */

const SECTIONS: { heading: string; body: string[] }[] = [
  {
    heading: 'What this site collects',
    body: [
      'Nothing, as it is built. This website is a set of static pages. It sets no cookies, it does not ask you to sign in, and it has no analytics or advertising scripts installed.',
      'The site is measured only in the sense that it is ready to be: it emits named events (a booking click, a phone tap, a directions tap) into whichever tag manager the shop chooses to install later. Until one is installed, those events go nowhere and no request leaves your browser.',
    ],
  },
  {
    heading: 'Your web host still sees requests',
    body: [
      'Like any website, the server that delivers these pages receives the ordinary technical information a browser sends to fetch them — an IP address, a user agent, which page was requested and when. That is a function of how the web works and is handled by the shop’s hosting provider.',
    ],
  },
  {
    heading: 'Booking happens somewhere else',
    body: [
      'The BOOK buttons hand you over to the shop’s booking provider, which is a separate company with its own privacy policy and its own cookies. Anything you type into a booking — your name, your number, your appointment — is held by that provider and by the shop, not by this website.',
    ],
  },
  {
    heading: 'The map',
    body: [
      'The location pages draw their own map graphic and contact nobody. Press “Show map” and a Google Maps embed loads in its place — at that point, and only then, Google receives your IP address and sets its own cookies under its own privacy policy.',
      'Nothing on this site loads that embed for you. Getting directions is a plain link and shares nothing until you follow it.',
    ],
  },
  {
    heading: 'Links out',
    body: [
      'Instagram, TikTok, Google Maps and the shop’s Google Business Profile are third-party services. Following a link to one puts you under their terms and their tracking, not this site’s.',
    ],
  },
  {
    heading: 'If you contact the shop',
    body: [
      'Calling or emailing the shop shares whatever you choose to share, and it is used to answer you and to run your appointment. It is not sold, and it is not passed to anyone who is not needed to do those two things.',
    ],
  },
  {
    heading: 'Asking about your information',
    body: [
      `Write to ${business.email} or call ${business.phone}, or come into the shop at ${fullAddress}. Connecticut residents have rights over personal data held about them under the Connecticut Data Privacy Act, and the shop will answer requests made under it.`,
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        index="00"
        label="Privacy"
        lines={['What this', 'site knows', 'about you.']}
        standfirst="Almost nothing, and this page says exactly what. Written from what the site actually does rather than from a template."
      />

      <section className="bg-ink pb-20 lg:pb-28" aria-label="Privacy notice">
        <div className="shell">
          <div className="max-w-2xl">
            {SECTIONS.map((section, i) => (
              <div key={section.heading} className="border-t border-ink-line py-8">
                <div className="flex items-baseline gap-4">
                  <span className="label-sm text-steel-dark">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h2 className="display-sm text-bone">{section.heading}</h2>
                </div>
                <div className="mt-5 space-y-4 pl-9">
                  {section.body.map((paragraph) => (
                    <p key={paragraph} className="leading-relaxed text-steel-light">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            ))}

            <p className="mt-10 text-sm text-steel-dark">
              Last reviewed when this site was built. If the shop adds analytics,
              advertising pixels, a mailing list or an embedded booking widget,
              this page is updated at the same time.
            </p>
            <Link href="/" className="link-draw label mt-8 inline-block text-ember">
              Back to the shop
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

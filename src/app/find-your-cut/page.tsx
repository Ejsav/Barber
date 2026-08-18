import { PageHero } from '@/components/layout/PageHero';
import { CutExplorer } from '@/components/explorer/CutExplorer';
import { FaqList } from '@/components/faq/FaqList';
import { FinalCta } from '@/components/sections/FinalCta';
import { JsonLd } from '@/components/seo/JsonLd';

import { pageMetadata, breadcrumbJsonLd } from '@/lib/seo';
import { resolvedLooks } from '@/lib/looks';
import { faqs } from '@/data/faq';
import { business } from '@/data/business';
import { priceFloor } from '@/data/services';

export const metadata = pageMetadata({
  title: 'Find your cut',
  description: `Not sure what to book? Say what you want in plain language and we will tell you what it is called, what it costs and which ${business.name} barber is best at it.`,
  path: '/find-your-cut',
});

/* The three questions this page exists to answer, kept out of the general FAQ
 * so the page closes on the specific doubt that brought someone here. */
const RELEVANT = ['what-to-book', 'choose-barber', 'hair-types'];

export default function FindYourCutPage() {
  const items = faqs.filter((f) => RELEVANT.includes(f.id));

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Find your cut', path: '/find-your-cut' },
        ])}
        id="ld-crumbs-explorer"
      />

      <PageHero
        index="00"
        label="Cut explorer"
        lines={['What are', 'you getting?']}
        standfirst="Most people know what they want their head to look like and not what it is called. This translates one into the other — then tells you who cuts it best and books them."
        meta={[
          { k: 'Looks', v: String(resolvedLooks.length) },
          { k: 'From', v: `$${priceFloor}` },
          { k: 'Takes', v: 'About a minute' },
        ]}
        crumb={{ href: '/services', label: 'Full menu' }}
      />

      <section className="bg-ink pb-16 lg:pb-24" aria-label="Cut explorer">
        <div className="shell">
          <CutExplorer headingLevel={2} />
        </div>
      </section>

      <section
        className="on-bone bg-bone py-16 text-ink lg:py-24"
        aria-labelledby="explorer-faq-heading"
      >
        <div className="shell">
          <h2 id="explorer-faq-heading" className="display-lg text-ink">
            Still deciding.
          </h2>
          <div className="mt-10">
            <FaqList items={items} tone="bone" />
          </div>
        </div>
      </section>

      <FinalCta />
    </>
  );
}

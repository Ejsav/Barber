import Link from 'next/link';

import { PageHero } from '@/components/layout/PageHero';
import { FaqList } from '@/components/faq/FaqList';
import { FinalCta } from '@/components/sections/FinalCta';
import { JsonLd } from '@/components/seo/JsonLd';
import { TrackedAnchor } from '@/components/analytics/TrackedAnchor';

import { pageMetadata, breadcrumbJsonLd } from '@/lib/seo';
import { faqJsonLd } from '@/lib/jsonld';
import { faqCategories, faqs, faqsInCategory } from '@/data/faq';
import { business } from '@/data/business';

export const metadata = pageMetadata({
  title: 'Questions',
  description: `Walk-ins, appointments, what to book, parking, kids, payment and being late — the practical answers before your first visit to ${business.name} in ${business.locality}.`,
  path: '/faq',
});

export default function FaqPage() {
  return (
    <>
      <JsonLd data={faqJsonLd()} id="ld-faq" />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Questions', path: '/faq' },
        ])}
        id="ld-crumbs-faq"
      />

      <PageHero
        index="00"
        label="Questions"
        lines={['Ask before', 'you sit down.']}
        standfirst="Everything people actually ask at the counter, answered here so you do not have to ask it. If yours is not here, call the shop — someone will pick up."
        meta={[
          { k: 'Answers', v: String(faqs.length) },
          { k: 'Phone', v: business.phone },
        ]}
      />

      <div className="bg-ink pb-10">
        {faqCategories.map((category, i) => {
          const items = faqsInCategory(category.id);
          if (items.length === 0) return null;

          return (
            <section
              key={category.id}
              id={category.id}
              className="shell scroll-mt-28 py-12 lg:py-16"
              aria-labelledby={`faq-${category.id}`}
            >
              <div className="lg:grid lg:grid-cols-12 lg:gap-10">
                <div className="lg:col-span-4 lg:sticky lg:top-32 lg:self-start">
                  <div className="flex items-baseline gap-4 border-b border-ink-line pb-4">
                    <span className="label-sm text-steel-dark">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="label text-steel">{category.label}</span>
                  </div>
                  <h2
                    id={`faq-${category.id}`}
                    className="display-lg mt-6 text-bone"
                  >
                    {category.label}
                  </h2>
                </div>

                <div className="mt-8 lg:col-span-8 lg:mt-0">
                  <FaqList items={items} />
                </div>
              </div>
            </section>
          );
        })}
      </div>

      <section
        className="on-bone bg-bone py-14 text-ink lg:py-20"
        aria-labelledby="faq-contact-heading"
      >
        <div className="shell flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 id="faq-contact-heading" className="display-md text-ink">
              Something else?
            </h2>
            <p className="mt-3 max-w-lg text-ink-mute">
              The shop phone is answered during opening hours by whoever is
              nearest to it.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <TrackedAnchor
              href={business.phoneHref}
              event="phone_click"
              payload={{ placement: 'faq' }}
              className="link-draw num text-xl text-ink"
            >
              {business.phone}
            </TrackedAnchor>
            <Link href="/visit" className="link-draw label text-ember-deep">
              Hours &amp; directions
            </Link>
          </div>
        </div>
      </section>

      <FinalCta />
    </>
  );
}

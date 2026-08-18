import { PageHero } from '@/components/layout/PageHero';
import { ReviewWall } from '@/components/reviews/ReviewWall';
import { FinalCta } from '@/components/sections/FinalCta';
import { JsonLd } from '@/components/seo/JsonLd';
import { TrackedAnchor } from '@/components/analytics/TrackedAnchor';

import { pageMetadata, breadcrumbJsonLd } from '@/lib/seo';
import { heroTone } from '@/lib/heroTone';
import { visibleReviews, trustFigures } from '@/lib/content';
import { business } from '@/data/business';
import { barbers } from '@/data/barbers';

export const metadata = pageMetadata({
  title: 'Reviews',
  description: `What people say after sitting in the chair at ${business.name}, ${business.locality} — filtered by what you actually want to check.`,
  path: '/reviews',
});

export default function ReviewsPage() {
  const { items, isPlaceholder } = visibleReviews();
  const figures = trustFigures();

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Reviews', path: '/reviews' },
        ])}
        id="ld-crumbs-reviews"
      />

      <PageHero
        index="00"
        label="In their words"
        lines={['The part we', 'can’t write', 'ourselves.']}
        standfirst="Reviews are the only page on this site the shop does not get to phrase. Filter them by the thing you are actually checking."
        meta={[
          ...(figures.show
            ? [
                { k: 'Rating', v: `${figures.rating} / 5` },
                { k: 'Reviews', v: `${figures.reviewCount}+` },
                { k: 'Source', v: figures.source },
              ]
            : []),
          { k: 'Barbers', v: String(barbers.length) },
        ]}
        tone={heroTone('/reviews')}
      >
        {figures.isPlaceholder && figures.show && (
          <p className="label-sm mt-8 inline-block border border-ember-deep px-3 py-2 text-ember-deep">
            Demo figures — replace with the real Google Business Profile numbers
            before launch
          </p>
        )}
      </PageHero>

      <section
        className="on-bone bg-bone pb-16 text-ink lg:pb-24"
        aria-label="All reviews"
      >
        <div className="shell">
          {items.length > 0 ? (
            <ReviewWall reviews={items} isPlaceholder={isPlaceholder} />
          ) : (
            <p className="max-w-xl text-ink-mute">
              Reviews are collected on the shop&rsquo;s Google Business Profile.
            </p>
          )}

          <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-bone-line pt-8">
            <TrackedAnchor
              href={business.social.google}
              external
              event="review_click"
              payload={{ placement: 'reviews_page' }}
              className="link-draw label text-ink"
            >
              Read more on Google
            </TrackedAnchor>
            <TrackedAnchor
              href={business.social.google}
              external
              event="review_click"
              payload={{ placement: 'reviews_page_leave' }}
              className="link-draw label text-ember-deep"
            >
              Leave a review
            </TrackedAnchor>
          </div>
        </div>
      </section>

      <FinalCta />
    </>
  );
}

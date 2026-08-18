import Link from 'next/link';

import { PageHero } from '@/components/layout/PageHero';
import { WorkGrid } from '@/components/work/WorkGrid';
import { BeforeAfter } from '@/components/work/BeforeAfter';
import { FinalCta } from '@/components/sections/FinalCta';
import { SocialRail } from '@/components/sections/SocialRail';
import { JsonLd } from '@/components/seo/JsonLd';
import { Reveal, RevealLines } from '@/components/ui/Reveal';

import { pageMetadata, breadcrumbJsonLd } from '@/lib/seo';
import { business } from '@/data/business';
import { work, workCategories } from '@/data/work';
import { barbers } from '@/data/barbers';

export const metadata = pageMetadata({
  title: 'The Book — recent work',
  description: `Recent cuts from ${business.name} in ${business.locality}: skin fades, textured and coily hair, classic scissor work, beard sculpting and longer cuts. Every frame credited to the barber who did it.`,
  path: '/work',
});

export default function WorkPage() {
  const pairs = work.filter((w) => 'beforeImage' in w);

  return (
    <>
      <JsonLd
        id="ld-breadcrumb-work"
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'The Book', path: '/work' },
        ])}
      />

      <PageHero
        index="03"
        label="The Book"
        lines={['Work, credited', 'to the person', 'who did it.']}
        standfirst="No stock photography and no cuts borrowed from someone else's feed. Find something you like, then book the barber underneath it."
        meta={[
          { k: 'Frames', v: String(work.length) },
          { k: 'Categories', v: String(workCategories.length) },
          { k: 'Barbers', v: String(barbers.length) },
        ]}
      />

      <section className="bg-ink pb-16 lg:pb-24" aria-label="Lookbook">
        <div className="shell">
          <WorkGrid />
        </div>
      </section>

      {/* Before / after — a separate treatment, not another grid */}
      {pairs.length > 0 && (
        <section
          className="relative bg-ink py-16 lg:py-24"
          aria-labelledby="ba-heading"
        >
          <div
            aria-hidden="true"
            className="screen-dots pointer-events-none absolute inset-0 text-bone opacity-[0.05]"
          />
          <div className="shell relative">
            <div className="flex items-baseline gap-4 border-b border-ink-line pb-4">
              <span className="label-sm text-steel-dark">B/A</span>
              <span className="label text-steel">Before &amp; after</span>
            </div>

            <div className="mt-8 lg:mt-12 lg:flex lg:items-end lg:gap-10">
              <RevealLines
                as="h2"
                id="ba-heading"
                lines={['Five weeks', 'of growth,', 'undone.']}
                className="display-xl flex-1 text-bone"
              />
              <Reveal delay={0.12} className="mt-6 max-w-md lg:mt-0 lg:w-[24rem] lg:pb-2">
                <p className="body-lg text-bone/70">
                  Drag the divider. Same client, same light, same chair — half
                  an hour apart.
                </p>
              </Reveal>
            </div>

            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:mt-16 lg:gap-10">
              {pairs.map((item, i) => (
                <Reveal key={item.id} delay={i * 0.08}>
                  <BeforeAfter item={item} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-ink pb-20">
        <div className="shell">
          <Reveal className="border-t border-ink-line pt-10">
            <p className="max-w-2xl text-[0.9375rem] leading-relaxed text-steel-light">
              Bring a reference photograph if you have one — it is genuinely
              useful. Your barber will tell you honestly whether your hair will
              do that, and what it will do instead if it will not.{' '}
              <Link href="/barbers" className="link-draw text-bone">
                Pick a barber
              </Link>{' '}
              or{' '}
              <Link href="/services" className="link-draw text-bone">
                see the menu
              </Link>
              . If you like a frame but do not know what to ask for,{' '}
              <Link href="/find-your-cut" className="link-draw text-bone">
                the cut explorer
              </Link>{' '}
              will name it for you.
            </p>
          </Reveal>
        </div>
      </section>

      <SocialRail />

      <FinalCta />
    </>
  );
}

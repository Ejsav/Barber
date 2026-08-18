import Link from 'next/link';

import { Plate } from '@/components/ui/Plate';
import { TrackedAnchor } from '@/components/analytics/TrackedAnchor';
import { Stagger, StaggerItem } from '@/components/ui/Reveal';
import { business } from '@/data/business';
import { work, workSeed } from '@/data/work';
import { getBarber } from '@/data/barbers';

/* ============================================================================
 * FROM THE CHAIR
 * ----------------------------------------------------------------------------
 * Social proof without the social embed.
 *
 * An Instagram or TikTok feed widget costs 300–600KB of third-party
 * JavaScript, blocks the main thread while it hydrates, hands every visitor's
 * IP to a third party on page load, and breaks silently the day the shop's
 * token expires — all to show four squares that are already on this site.
 *
 * So this is curated: the shop's own imagery, optimised and served from the
 * shop's own origin, with real links out to the accounts. It loads instantly,
 * it cannot break, and the clicks that go to Instagram are measured, which the
 * widget would never have told anyone.
 * ========================================================================== */

export function SocialRail() {
  /* Newest first, capped — a rail is a taste of the feed, not the feed. */
  const items = work.slice(0, 6);
  if (items.length === 0) return null;

  return (
    <section className="bg-ink py-16 lg:py-24" aria-labelledby="social-heading">
      <div className="shell">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2 border-b border-ink-line pb-4">
          <span className="label-sm text-steel-dark">◆</span>
          <h2 className="label text-steel" id="social-heading">
            From the chair
          </h2>
          <div className="ml-auto flex items-center gap-6">
            <TrackedAnchor
              href={business.social.instagram}
              external
              event="instagram_click"
              payload={{ placement: 'social_rail' }}
              className="link-draw label text-ember"
            >
              {business.social.instagramHandle}
            </TrackedAnchor>
            <TrackedAnchor
              href={business.social.tiktok}
              external
              event="tiktok_click"
              payload={{ placement: 'social_rail' }}
              className="link-draw label text-steel-light"
            >
              TikTok
            </TrackedAnchor>
          </div>
        </div>
      </div>

      {/* Full-bleed rail: the imagery runs off the edge of the viewport rather
          than stopping politely inside the grid. Native scroll on touch, so it
          behaves the way a phone expects. */}
      <Stagger
        className="rail mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-[var(--spacing-gutter)] pb-2 lg:mt-12 lg:gap-6"
        amount={0.05}
      >
        {items.map((item) => {
          const barber = getBarber(item.barber);
          return (
            <StaggerItem
              key={item.id}
              className="w-[62vw] shrink-0 snap-start sm:w-[38vw] lg:w-[22vw] xl:w-[18vw]"
            >
              <Link href="/work" className="group block">
                <Plate
                  src={item.image}
                  alt={item.alt}
                  aspect="square"
                  seed={workSeed(item)}
                  sizes="(max-width: 640px) 62vw, (max-width: 1024px) 38vw, 20vw"
                  bare
                  className="transition-opacity group-hover:opacity-80"
                />
                <p className="label-sm mt-3 text-steel-light">{item.title}</p>
                {barber && (
                  <p className="label-sm mt-1.5 text-steel-dark">{barber.name}</p>
                )}
              </Link>
            </StaggerItem>
          );
        })}
      </Stagger>
    </section>
  );
}

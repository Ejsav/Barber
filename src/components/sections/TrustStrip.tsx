import { business } from '@/data/business';
import { barbers } from '@/data/barbers';
import { trustFigures } from '@/lib/content';
import { Stagger, StaggerItem } from '@/components/ui/Reveal';

/* ----------------------------------------------------------------------------
 * TRUST STRIP
 *
 * The rating cluster only renders once the operator has confirmed the figures
 * are real (data/business.ts → socialProof.verified). Until then it shows in
 * development with a DEMO badge and is omitted from production entirely.
 *
 * The four facts to its right are structural truths about the shop taken from
 * config, not claims — so this band never becomes an empty gap when the rating
 * is withheld.
 * -------------------------------------------------------------------------- */

const FACTS = [
  { k: 'Chairs', v: `${barbers.length} barbers`, sub: 'Book by name' },
  { k: 'Walk-ins', v: 'Taken daily', sub: 'Appointments first' },
  { k: 'Where', v: business.neighborhood, sub: business.address.street },
  { k: 'Booking', v: 'Online', sub: 'Or call the shop' },
];

export function TrustStrip() {
  const trust = trustFigures();

  return (
    <section className="on-bone relative z-10 bg-bone text-ink" aria-label="At a glance">
      <div className="shell py-8 lg:py-10">
        <Stagger className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4 lg:flex lg:items-stretch lg:gap-0">
          {trust.show && (
            <StaggerItem className="col-span-2 sm:col-span-4 lg:mr-10 lg:w-[19rem] lg:shrink-0 lg:border-r lg:border-bone-line lg:pr-10">
              <div className="flex items-center gap-3">
                <Stars rating={trust.rating} />
                <span className="num text-2xl leading-none text-ink">
                  {trust.rating.toFixed(1)}
                </span>
                {trust.isPlaceholder && (
                  <span className="label-sm border border-ember-deep px-1.5 py-1 text-ember-deep">
                    Demo
                  </span>
                )}
              </div>
              <p className="label mt-3 text-ink-mute">
                {trust.reviewCount}+ reviews on {trust.source}
              </p>
              {trust.isPlaceholder && (
                <p className="mt-2 text-[0.6875rem] leading-snug text-ember-deep">
                  Sample figures — replace with the real Google Business Profile
                  rating before launch. Hidden in production until verified.
                </p>
              )}
            </StaggerItem>
          )}

          {FACTS.map((f) => (
            <StaggerItem
              key={f.k}
              className="lg:flex-1 lg:border-r lg:border-bone-line lg:px-8 lg:first-of-type:pl-0 lg:last:border-r-0"
            >
              <p className="label-sm text-ink-mute">{f.k}</p>
              <p className="display-sm mt-2 text-ink">{f.v}</p>
              <p className="mt-1.5 text-xs text-ink-mute">{f.sub}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex gap-1" aria-label={`${rating} out of 5`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <svg
          key={i}
          width="15"
          height="15"
          viewBox="0 0 16 16"
          aria-hidden="true"
          className={i < Math.round(rating) ? 'text-ember' : 'text-ink-mute'}
        >
          <path
            fill="currentColor"
            d="M8 0.8l2.1 4.7 5.1.5-3.8 3.4 1.1 5-4.5-2.6L3.5 14.4l1.1-5L0.8 6l5.1-.5z"
          />
        </svg>
      ))}
    </span>
  );
}

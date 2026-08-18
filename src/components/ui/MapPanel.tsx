import { TrackedAnchor } from '@/components/analytics/TrackedAnchor';
import {
  locationDirectionsUrl,
  primaryLocation,
  type Location,
} from '@/data/locations';

/* ============================================================================
 * MAP PANEL
 * ----------------------------------------------------------------------------
 * An abstract, deliberately non-literal graphic — it is NOT a representation
 * of the real street layout and is labelled as illustrative so nobody mistakes
 * it for navigation. GET DIRECTIONS is a live link to Google Maps built from
 * the address in data/business.ts, so the panel is functional as it stands.
 *
 * TO EMBED A REAL MAP: replace the <svg> below with a Google Maps Embed API
 * iframe or a Mapbox static image. Load it lazily (`loading="lazy"`) or behind
 * a click-to-load — a maps iframe is a third-party request that will otherwise
 * cost you LCP and hand the visitor's IP to a third party on page load.
 * ========================================================================== */

export function MapPanel({
  className,
  location = primaryLocation,
}: {
  className?: string;
  /** Any shop. Defaults to the primary address. */
  location?: Location;
}) {
  return (
    <div className={`relative isolate overflow-hidden bg-ink ${className ?? ''}`}>
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 400 400"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <rect width="400" height="400" fill="#0d0c0b" />
        <g stroke="#2b2724" strokeWidth="1">
          {[40, 96, 152, 208, 264, 320, 376].map((y) => (
            <line key={`h${y}`} x1="0" y1={y} x2="400" y2={y} />
          ))}
          {[46, 118, 190, 262, 334].map((x) => (
            <line key={`v${x}`} x1={x} y1="0" x2={x} y2="400" />
          ))}
        </g>
        {/* The through-street the shop sits on */}
        <line x1="0" y1="208" x2="400" y2="208" stroke="#3a3531" strokeWidth="7" />
        <line x1="190" y1="0" x2="190" y2="400" stroke="#3a3531" strokeWidth="5" />
        {/* Green */}
        <rect x="46" y="96" width="72" height="56" fill="#171513" />
        <circle cx="190" cy="208" r="34" fill="#e2512b" opacity="0.1" />
        <circle cx="190" cy="208" r="17" fill="#e2512b" opacity="0.18" />
        <circle cx="190" cy="208" r="5" fill="#e2512b" />
      </svg>

      <div
        aria-hidden="true"
        className="screen-dots pointer-events-none absolute inset-0 text-bone opacity-[0.07]"
      />

      <div className="absolute inset-0 flex flex-col justify-between p-5 sm:p-7">
        <p className="label-sm text-steel">Illustrative — not to scale</p>
        <div>
          <p className="display-sm text-bone">{location.address.street}</p>
          <p className="label mt-2 text-steel-light">
            {location.neighborhood} · {location.locality}
          </p>
          <TrackedAnchor
            href={locationDirectionsUrl(location)}
            external
            event="directions_click"
            payload={{ placement: 'map_panel', location: location.slug }}
            className="label mt-5 inline-flex h-14 items-center gap-3 bg-bone px-7 text-ink transition-colors hover:bg-ember"
          >
            Get directions
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path
                d="M1 6h10M7 2l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="square"
              />
            </svg>
          </TrackedAnchor>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';

import { TrackedAnchor } from '@/components/analytics/TrackedAnchor';
import { track } from '@/lib/analytics';
import {
  locationDirectionsUrl,
  locationFullAddress,
  primaryLocation,
  type Location,
} from '@/data/locations';
import { business } from '@/data/business';
import { cn } from '@/lib/cn';

/* ============================================================================
 * MAP PANEL
 * ----------------------------------------------------------------------------
 * A real Google map, loaded on request rather than on page load.
 *
 * WHY CLICK-TO-LOAD RATHER THAN AN IFRAME IN THE MARKUP
 *
 * A Maps embed is ~900KB across 30+ third-party requests, it runs its own
 * main-thread work while the page is still settling, and it hands every
 * visitor's IP address to Google before they have asked for a map or done
 * anything at all. On the location pages that iframe would sit above the fold
 * and compete with the booking CTA for the network.
 *
 * So the panel paints instantly as a designed graphic — the shop's own
 * typography over the brand's dot screen — and the map arrives the moment
 * someone asks for it, which is the only moment they want it. That also keeps
 * the claim on /privacy true: nothing third-party is contacted until you press
 * something.
 *
 * GET DIRECTIONS is a plain link and works either way, with or without the
 * embed, with or without JavaScript.
 *
 * CONFIGURATION: set NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY to use the official
 * Embed API (styled, supported, needs a key restricted to your domain).
 * Without a key it falls back to Google's keyless embed endpoint, so the
 * feature works out of the box and the key is an upgrade rather than a
 * prerequisite.
 * ========================================================================== */

function embedSrc(location: Location) {
  const query = encodeURIComponent(
    `${business.name} ${locationFullAddress(location)}`,
  );
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY;

  return key
    ? `https://www.google.com/maps/embed/v1/place?key=${key}&q=${query}&zoom=16`
    : `https://maps.google.com/maps?q=${query}&z=16&output=embed`;
}

export function MapPanel({
  className,
  location = primaryLocation,
}: {
  className?: string;
  /** Any shop. Defaults to the primary address. */
  location?: Location;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={cn('relative isolate overflow-hidden bg-ink', className)}>
      {loaded ? (
        <iframe
          src={embedSrc(location)}
          title={`Map to ${business.name}, ${locationFullAddress(location)}`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
          /* Google's tiles are bright; the site is not. This is the same
             treatment the plates get, so an embedded map still belongs to the
             page rather than sitting on it like a browser window. */
          style={{ filter: 'grayscale(1) invert(0.92) contrast(0.86) sepia(0.14)' }}
        />
      ) : (
        <>
          {/* The pre-load state is a designed graphic, not a grey box: the
              street grid is abstract and labelled as such, so nobody mistakes
              it for navigation before the real map is there. */}
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
            <line x1="0" y1="208" x2="400" y2="208" stroke="#3a3531" strokeWidth="7" />
            <line x1="190" y1="0" x2="190" y2="400" stroke="#3a3531" strokeWidth="5" />
            <rect x="46" y="96" width="72" height="56" fill="#171513" />
            <circle cx="190" cy="208" r="34" fill="#e2512b" opacity="0.1" />
            <circle cx="190" cy="208" r="17" fill="#e2512b" opacity="0.18" />
            <circle cx="190" cy="208" r="5" fill="#e2512b" />
          </svg>

          <div
            aria-hidden="true"
            className="screen-dots pointer-events-none absolute inset-0 text-bone opacity-[0.07]"
          />
        </>
      )}

      {/* Controls sit above either state. */}
      <div
        className={cn(
          'absolute inset-x-0 bottom-0 flex flex-col justify-end gap-4 p-5 sm:p-7',
          loaded
            ? 'bg-gradient-to-t from-ink via-ink/80 to-transparent pt-16'
            : 'top-0',
        )}
      >
        {!loaded && (
          <p className="label-sm text-steel">Illustrative — not to scale</p>
        )}

        <div className="mt-auto">
          <p className="display-sm text-bone">{location.address.street}</p>
          <p className="label mt-2 text-steel-light">
            {location.neighborhood} · {location.locality}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <TrackedAnchor
              href={locationDirectionsUrl(location)}
              external
              event="directions_click"
              payload={{ placement: 'map_panel', location: location.slug }}
              className="label inline-flex h-14 items-center gap-3 bg-bone px-7 text-ink transition-colors hover:bg-ember"
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

            {!loaded && (
              <button
                type="button"
                onClick={() => {
                  setLoaded(true);
                  track('directions_click', {
                    placement: 'map_load',
                    location: location.slug,
                  });
                }}
                className="label inline-flex h-14 items-center border border-ink-line px-6 text-bone transition-colors hover:border-bone"
              >
                Show map
              </button>
            )}
          </div>

          {!loaded && (
            <p className="mt-4 max-w-xs text-xs leading-relaxed text-steel-dark">
              Loads Google Maps, which sets its own cookies.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

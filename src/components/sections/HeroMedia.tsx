'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

import { Plate } from '@/components/ui/Plate';
import { heroMedia } from '@/data/media';

/* ----------------------------------------------------------------------------
 * Hero media, with a deliberate loading strategy.
 *
 * The still (real photograph or generated plate) renders immediately and is
 * what LCP measures. Video is an enhancement that is only fetched when all of
 * these hold:
 *
 *   · a wide viewport            — a 3MB loop is not worth it on a phone
 *   · pointer: fine              — proxy for "not a handset on cell data"
 *   · no Save-Data / 2g / 3g     — respects the Network Information API
 *   · no prefers-reduced-motion  — a looping video is motion
 *
 * Otherwise nothing is downloaded at all. There is no filmstrip fallback and
 * no autoplay fight; the still simply stays.
 * -------------------------------------------------------------------------- */

interface NetworkInformation {
  saveData?: boolean;
  effectiveType?: string;
}

export function HeroMedia() {
  const [playVideo, setPlayVideo] = useState(false);

  useEffect(() => {
    if (!heroMedia.video) return;

    const wide = window.matchMedia('(min-width: 1024px) and (pointer: fine)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const conn = (
      navigator as Navigator & { connection?: NetworkInformation }
    ).connection;

    const cheapConnection =
      conn?.saveData === true ||
      (conn?.effectiveType != null && /2g|3g/.test(conn.effectiveType));

    const decide = () =>
      setPlayVideo(wide.matches && !reduced.matches && !cheapConnection);

    decide();
    wide.addEventListener('change', decide);
    reduced.addEventListener('change', decide);
    return () => {
      wide.removeEventListener('change', decide);
      reduced.removeEventListener('change', decide);
    };
  }, []);

  return (
    <div className="relative h-full w-full">
      {heroMedia.image ? (
        <Image
          src={heroMedia.image}
          alt={heroMedia.alt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 46vw"
          className="object-cover"
        />
      ) : (
        <Plate
          alt={heroMedia.alt}
          aspect="fill"
          variant="scene"
          seed={heroMedia.seed}
          className="h-full w-full"
          bare
        />
      )}

      {playVideo && heroMedia.video && (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={heroMedia.video}
          poster={heroMedia.videoPoster ?? undefined}
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
          tabIndex={-1}
        />
      )}
    </div>
  );
}

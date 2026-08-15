'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/* ----------------------------------------------------------------------------
 * Momentum scrolling.
 *
 * Enabled only where it is an improvement: fine pointers, no reduced-motion
 * preference. Touch scrolling stays native — hijacking it on a phone costs more
 * than it gives, and this site's primary audience is on a phone.
 * -------------------------------------------------------------------------- */

export function SmoothScroll() {
  useEffect(() => {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!finePointer.matches || reduced.matches) return;

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 0.95,
    });

    window.__lenis = lenis;

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  return null;
}

/** Locks page scroll for modals, including Lenis when it is running. */
export function lockScroll(locked: boolean) {
  if (typeof window === 'undefined') return;
  const lenis = window.__lenis;
  if (locked) {
    lenis?.stop();
    document.documentElement.style.setProperty(
      '--scrollbar-gap',
      `${window.innerWidth - document.documentElement.clientWidth}px`,
    );
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = 'var(--scrollbar-gap)';
  } else {
    lenis?.start();
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  }
}

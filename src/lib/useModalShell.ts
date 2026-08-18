'use client';

import { useEffect, useRef } from 'react';
import { lockScroll } from '@/components/layout/SmoothScroll';

/* ----------------------------------------------------------------------------
 * The three things every modal on this site owes a keyboard user, in one place
 * so no dialog can be built that forgets one of them:
 *
 *   · the page behind stops scrolling while it is open,
 *   · Tab cycles inside the panel rather than escaping into the page behind,
 *   · Escape closes it, and focus returns to whatever opened it.
 *
 * Attach the returned ref to the element carrying role="dialog", and mark the
 * control that should receive focus on open with `data-autofocus`.
 * -------------------------------------------------------------------------- */

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

export function useModalShell<T extends HTMLElement = HTMLDivElement>(
  close: () => void,
) {
  const panelRef = useRef<T>(null);
  const lastFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    lastFocused.current = document.activeElement as HTMLElement;
    lockScroll(true);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== 'Tab') return;

      const nodes = panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (!nodes || nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKey);

    /* One frame after the entrance starts: focusing an element that is still
     * translated off-screen makes the browser scroll to it mid-animation. */
    const t = window.setTimeout(() => {
      panelRef.current?.querySelector<HTMLElement>('[data-autofocus]')?.focus();
    }, 60);

    const restoreTo = lastFocused.current;
    return () => {
      document.removeEventListener('keydown', onKey);
      window.clearTimeout(t);
      lockScroll(false);
      restoreTo?.focus?.();
    };
  }, [close]);

  return panelRef;
}

'use client';

import Link from 'next/link';
import { useEffect, useSyncExternalStore } from 'react';

import { activeAnnouncement } from '@/lib/promotions';
import type { Announcement } from '@/data/announcements';

/* ----------------------------------------------------------------------------
 * The announcement bar.
 *
 * Three things make this worth more than a coloured strip:
 *
 * 1. IT CANNOT GO STALE. Every page here is statically generated, so a build
 *    in June would otherwise still be advertising June's hours in December.
 *    The server renders whichever announcement was live at build time; the
 *    client re-resolves against the VISITOR's clock. The clock and the
 *    dismissal flag are external state, so they are read as external state —
 *    one snapshot, and the visible announcement is derived from it during
 *    render rather than copied into component state by an effect.
 *
 * 2. IT DOES NOT SHIFT THE PAGE. The bar lives inside the fixed header stack
 *    and its height is carried by `--announce-h`, which `--header-h` is
 *    composed from. Everything that offsets against the header — the hero
 *    rail, the mobile sheet, in-page anchors — adjusts on its own.
 *
 * 3. DISMISSAL DOES NOT FLASH. The inline script in the root layout sets
 *    data-announce="dismissed" on <html> before first paint, so on the second
 *    page the bar is never drawn at all rather than drawn and then removed.
 * -------------------------------------------------------------------------- */

const KEY = 'ht:announce-dismissed';

/* -- The store: an hourly clock bucket plus the dismissal flag -------------- */

const SSR = 'ssr';
const BUCKET_MS = 60 * 60 * 1000;

let snapshot = SSR;
let timer: number | undefined;
const listeners = new Set<() => void>();

function compute() {
  let dismissed = '';
  try {
    dismissed = sessionStorage.getItem(KEY) ?? '';
  } catch {
    /* Storage disabled (private mode): the bar simply stays dismissible for
     * this page view only. */
  }
  return `${Math.floor(Date.now() / BUCKET_MS)}|${dismissed}`;
}

function refresh() {
  const next = compute();
  if (next === snapshot) return;
  snapshot = next;
  listeners.forEach((l) => l());
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  /* One interval for the page, not one per subscriber, and it only notifies
   * when the hour bucket actually rolls over. */
  timer ??= window.setInterval(refresh, 60_000);
  return () => {
    listeners.delete(onChange);
    if (listeners.size === 0) {
      window.clearInterval(timer);
      timer = undefined;
    }
  };
}

function getSnapshot() {
  if (snapshot === SSR) snapshot = compute();
  return snapshot;
}

const getServerSnapshot = () => SSR;

/* -------------------------------------------------------------------------- */

export function AnnouncementBar({ initial }: { initial: Announcement | null }) {
  const snap = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const onServer = snap === SSR;

  /* Before hydration the server's choice stands, so the first client render is
   * byte-identical to the HTML. After it, the visitor's clock decides. */
  const announcement = onServer ? initial : activeAnnouncement(new Date());
  const dismissedId = onServer ? '' : snap.split('|')[1];
  const visible = Boolean(announcement) && announcement!.id !== dismissedId;

  /* Keep the document in step: `--announce-h` collapses the moment the bar
   * goes, so the header height and every offset derived from it follow. This
   * is a genuine external system — the <html> element — not derived state. */
  useEffect(() => {
    if (visible) delete document.documentElement.dataset.announce;
    else document.documentElement.dataset.announce = 'dismissed';
  }, [visible]);

  if (!announcement || !visible) return null;

  const dismiss = () => {
    try {
      sessionStorage.setItem(KEY, announcement.id);
    } catch {
      /* Then the dismissal lasts for this page view. Acceptable. */
    }
    refresh();
  };

  return (
    <div
      className="announce relative z-10 bg-ember text-ink"
      style={{ height: 'var(--announce-h)' }}
    >
      {/* Aligned to the page grid rather than the viewport: the dismiss control
          used to sit hard against the window edge, a long way from the message
          it belonged to, which read as two unrelated things. */}
      <div className="shell flex h-full items-center justify-between gap-4">
        <p className="label-sm truncate">
        {announcement.message}
        {announcement.href && (
          <Link
            href={announcement.href}
            className="ml-3 underline underline-offset-4 hover:no-underline"
          >
            {announcement.linkLabel ?? 'More'}
          </Link>
        )}
        </p>
        <button
          type="button"
          onClick={dismiss}
          className="-mr-2 shrink-0 p-2 transition-opacity hover:opacity-70"
          aria-label="Dismiss announcement"
        >
          <svg width="9" height="9" viewBox="0 0 9 9" aria-hidden="true">
            <path
              d="M1 1l7 7M8 1L1 8"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="square"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

'use client';

import { useSyncExternalStore } from 'react';
import { resolveToday, type WeekHours } from '@/lib/hours';
import { cn } from '@/lib/cn';

/* ----------------------------------------------------------------------------
 * "Open until 8pm" — resolved against the VISITOR's clock, not the build
 * machine's, so it cannot go stale on a statically generated page.
 *
 * The clock is an external store, so that is how it is read: the snapshot is a
 * five-minute bucket, which keeps the value referentially stable between ticks,
 * and the server snapshot is null so the first paint matches the HTML exactly.
 * A long-lived tab re-renders when its bucket rolls over rather than lying.
 * -------------------------------------------------------------------------- */

const BUCKET_MS = 5 * 60 * 1000;

function subscribe(onChange: () => void) {
  const id = window.setInterval(onChange, BUCKET_MS);
  return () => window.clearInterval(id);
}

const getSnapshot = () => Math.floor(Date.now() / BUCKET_MS);
const getServerSnapshot = () => null;

export function TodayStatus({
  className,
  size = 'md',
  compact = false,
  hours,
}: {
  className?: string;
  size?: 'sm' | 'md';
  /** Drops the weekday. Used where horizontal room is tight, e.g. the hero. */
  compact?: boolean;
  /** Another shop's week. Defaults to the primary address. */
  hours?: WeekHours;
}) {
  const bucket = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const today = bucket === null ? null : resolveToday(hours);

  return (
    <p
      className={cn(
        'flex items-center gap-2.5',
        size === 'sm' ? 'label-sm' : 'label',
        className,
      )}
    >
      <span className="relative flex h-1.5 w-1.5 shrink-0">
        {today?.isOpen && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ember opacity-60" />
        )}
        <span
          className={cn(
            'relative inline-flex h-1.5 w-1.5 rounded-full',
            today?.isOpen ? 'bg-ember' : 'bg-steel-dark',
          )}
        />
      </span>
      <span className="whitespace-nowrap text-steel-light">
        {today ? (
          <>
            {!compact && (
              <>
                <span className="text-bone">{today.label}</span>
                <span aria-hidden="true"> · </span>
              </>
            )}
            {today.display}
            {today.closingSoon && (
              <span className="text-ember"> · closing soon</span>
            )}
          </>
        ) : (
          'Hours below'
        )}
      </span>
    </p>
  );
}

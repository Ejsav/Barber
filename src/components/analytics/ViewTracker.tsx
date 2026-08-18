'use client';

import { useEffect } from 'react';
import { track, type AnalyticsEvent, type AnalyticsPayload } from '@/lib/analytics';

/**
 * Reports that a page was actually viewed — used on barber profiles, so the
 * shop can see which chairs get attention and not only which get booked.
 *
 * Renders nothing and fires exactly once per mount.
 */
export function ViewTracker({
  event,
  payload,
}: {
  event: AnalyticsEvent;
  payload?: AnalyticsPayload;
}) {
  useEffect(() => {
    track(event, payload);
    // The payload is a literal at every call site; re-firing on identity
    // change would double-count.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

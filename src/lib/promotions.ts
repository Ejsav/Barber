/* ----------------------------------------------------------------------------
 * Date gating for announcements and promotions.
 *
 * Every page on this site is statically generated, so "is this offer still
 * running?" cannot be answered at build time — the answer would be frozen into
 * the HTML on the day it was deployed. These helpers take an explicit `now`
 * and the components that use them read the visitor's clock, which is the only
 * clock that can be right.
 * -------------------------------------------------------------------------- */

import {
  announcements,
  promotions,
  type Announcement,
  type Promotion,
} from '@/data/announcements';

interface Dated {
  startsAt?: string;
  endsAt?: string;
}

/** An ISO date is inclusive of its whole last day, local time. */
function isRunning(item: Dated, now: Date): boolean {
  if (item.startsAt && now < new Date(`${item.startsAt}T00:00:00`)) return false;
  if (item.endsAt && now > new Date(`${item.endsAt}T23:59:59`)) return false;
  return true;
}

export function activeAnnouncement(
  now: Date,
  list: Announcement[] = announcements,
): Announcement | null {
  const live = list
    .filter((a) => isRunning(a, now))
    .sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99));
  return live[0] ?? null;
}

export function activePromotions(
  now: Date,
  list: Promotion[] = promotions,
): Promotion[] {
  return list.filter((p) => isRunning(p, now));
}

export function promotionForService(
  serviceId: string,
  now: Date,
): Promotion | null {
  return activePromotions(now).find((p) => p.serviceId === serviceId) ?? null;
}

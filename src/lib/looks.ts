/* ----------------------------------------------------------------------------
 * Resolving a Cut Explorer look into the real records it points at.
 *
 * A look is a promise: "book this service, these barbers do it, here is their
 * work". If any part of that is missing the promise is broken, so:
 *
 *   · in development the mismatch throws immediately, naming the look and the
 *     id it could not find — a typo in data/looks.ts should not be something
 *     you discover from a customer;
 *   · in production the look is dropped from the explorer instead. A tile
 *     fewer is recoverable. A tile that books a service the shop does not sell
 *     is not.
 * -------------------------------------------------------------------------- */

import { looks, type Look } from '@/data/looks';
import { getService, type Service } from '@/data/services';
import { barbers, type Barber } from '@/data/barbers';
import { work, type WorkItem } from '@/data/work';

export interface ResolvedLook {
  look: Look;
  service: Service;
  alsoConsider: Service[];
  barbers: Barber[];
  work: WorkItem[];
}

const isDev = process.env.NODE_ENV === 'development';

function resolve(look: Look): ResolvedLook | null {
  const service = getService(look.serviceId);
  if (!service) {
    if (isDev) {
      throw new Error(
        `data/looks.ts: look "${look.id}" points at service "${look.serviceId}", which does not exist in data/services.ts`,
      );
    }
    return null;
  }

  const roster = look.barberSlugs
    .map((slug) => {
      const barber = barbers.find((b) => b.slug === slug);
      if (!barber && isDev) {
        throw new Error(
          `data/looks.ts: look "${look.id}" lists barber "${slug}", who is not in data/barbers.ts`,
        );
      }
      return barber;
    })
    .filter((b): b is Barber => Boolean(b))
    /* A barber who does not perform the service cannot be recommended for it,
     * however well they cut the look in general. */
    .filter((b) => b.serviceIds.includes(service.id));

  if (roster.length === 0) {
    if (isDev) {
      throw new Error(
        `data/looks.ts: no barber listed on look "${look.id}" performs service "${service.id}". Fix the roster or the service.`,
      );
    }
    return null;
  }

  return {
    look,
    service,
    alsoConsider: (look.alsoConsider ?? [])
      .map(getService)
      .filter((s): s is Service => Boolean(s)),
    barbers: roster,
    work: work.filter((w) => w.category === look.workCategory).slice(0, 4),
  };
}

export const resolvedLooks: ResolvedLook[] = looks
  .map(resolve)
  .filter((l): l is ResolvedLook => Boolean(l));

export const getResolvedLook = (id: string) =>
  resolvedLooks.find((l) => l.look.id === id) ?? null;

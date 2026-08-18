import { serviceHasPage } from '@/data/serviceDetail';
import type { Service } from '@/data/services';

/**
 * Where a service name should link to.
 *
 * Only some services earn a page of their own (see data/serviceDetail.ts).
 * Everything else links to its section of the menu, which is a real
 * destination with the same price and description on it — so no link on the
 * site can point at a page that was never built.
 */
export function serviceHref(service: Pick<Service, 'id' | 'group'>) {
  return serviceHasPage(service.id)
    ? `/services/${service.id}`
    : `/services#${service.group}`;
}

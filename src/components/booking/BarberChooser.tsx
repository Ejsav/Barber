'use client';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

import { useBooking } from '@/components/booking/BookingProvider';
import { useModalShell } from '@/lib/useModalShell';
import { Plate } from '@/components/ui/Plate';
import { barbers } from '@/data/barbers';
import { specialtyLabels } from '@/data/barbers';
import { getService } from '@/data/services';
import { cn } from '@/lib/cn';

/* ============================================================================
 * WHO'S CUTTING YOU?
 * ----------------------------------------------------------------------------
 * The one screen that stands between a generic BOOK and the shop's booking
 * provider — and only when it saves the visitor a step.
 *
 * It renders exclusively when (a) a real provider is configured, (b) that
 * provider has per-barber pages, and (c) the visitor has not already named a
 * barber. In every other case the provider opens directly; see lib/booking.ts.
 * The point is not to add a screen, it is to move the one question the vendor
 * would ask anyway into a surface that can show faces, specialities and
 * prices.
 *
 * NO PREFERENCE is a first-class answer, sized like the others. A visitor who
 * does not know the roster should not have to guess to get through.
 * ========================================================================== */

export function BarberChooser() {
  const { isOpen, mode, close } = useBooking();

  return (
    <AnimatePresence>
      {isOpen && mode === 'chooser' && (
        <div className="fixed inset-0 z-[120]" role="presentation">
          <motion.button
            type="button"
            aria-label="Close"
            onClick={close}
            className="absolute inset-0 bg-ink/80 backdrop-blur-[3px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
          <ChooserPanel />
        </div>
      )}
    </AnimatePresence>
  );
}

function ChooserPanel() {
  const { close, intent, chooseBarber } = useBooking();
  const reduce = useReducedMotion();
  const panelRef = useModalShell<HTMLDivElement>(close);

  const service = intent.serviceId ? getService(intent.serviceId) : undefined;

  /* When a service is already chosen, only barbers who perform it are offered
   * — routing someone to a chair that does not do the work is worse than
   * asking the question twice. */
  const eligible = service
    ? barbers.filter((b) => b.serviceIds.includes(service.id))
    : barbers;

  return (
    <motion.div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="chooser-title"
      className={cn(
        'absolute inset-x-0 bottom-0 flex max-h-[92dvh] flex-col border-t border-ink-line bg-ink-raised',
        'sm:inset-x-auto sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:max-h-[86dvh] sm:w-[min(46rem,92vw)]',
        'sm:-translate-x-1/2 sm:-translate-y-1/2 sm:border',
      )}
      initial={reduce ? { opacity: 0 } : { y: '100%' }}
      animate={reduce ? { opacity: 1 } : { y: 0 }}
      exit={reduce ? { opacity: 0 } : { y: '100%' }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-start justify-between gap-6 border-b border-ink-line px-5 py-5 sm:px-8">
        <div>
          <p className="label-sm text-steel-dark">
            {service ? service.name : 'Booking'}
          </p>
          <h2 id="chooser-title" className="display-md mt-2 text-bone">
            Who&rsquo;s cutting you?
          </h2>
        </div>
        <button
          type="button"
          onClick={close}
          className="label -mr-2 -mt-1 shrink-0 p-2 text-steel-light transition-colors hover:text-bone"
        >
          Close
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto" data-lenis-prevent>
        <ul className="divide-y divide-ink-line">
          {eligible.map((barber, i) => (
            <li key={barber.slug}>
              <button
                type="button"
                data-autofocus={i === 0 ? true : undefined}
                onClick={() => chooseBarber(barber.slug)}
                className="group flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-ink-panel sm:px-8"
              >
                <div className="w-14 shrink-0 sm:w-16">
                  <Plate
                    src={barber.portrait}
                    alt=""
                    aspect="square"
                    variant="portrait"
                    seed={barber.seed}
                    sizes="64px"
                    bare
                  />
                </div>
                <span className="min-w-0 flex-1">
                  <span className="display-sm block text-bone">
                    {barber.name}
                  </span>
                  <span className="mt-1 block truncate text-[0.8125rem] text-steel-light">
                    {barber.specialties
                      .map((s) => specialtyLabels[s])
                      .join(' · ')}
                  </span>
                </span>
                <span className="label shrink-0 text-ember opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                  Book
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-ink-line p-5 sm:p-8">
        <button
          type="button"
          onClick={() => chooseBarber(null)}
          className="label flex h-14 w-full items-center justify-center border border-ink-line text-bone transition-colors hover:border-steel-dark hover:bg-ink-panel"
        >
          No preference — first available
        </button>
        <p className="mt-3 text-center text-xs leading-relaxed text-steel-dark">
          Opens the shop&rsquo;s booking system in a new tab.
        </p>
      </div>
    </motion.div>
  );
}

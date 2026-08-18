'use client';

import Link from 'next/link';
import { useCallback, useId, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

import { Plate } from '@/components/ui/Plate';
import { BookButton } from '@/components/ui/BookButton';
import { useBooking } from '@/components/booking/BookingProvider';
import { resolvedLooks, type ResolvedLook } from '@/lib/looks';
import { unsureOptions, unsurePrompt } from '@/data/looks';
import { formatDuration, formatPrice, priceFloor } from '@/data/services';
import { serviceHref } from '@/lib/services';
import { barbers, specialtyLabels } from '@/data/barbers';
import { workSeed } from '@/data/work';
import { track } from '@/lib/analytics';
import { cn } from '@/lib/cn';

/* ============================================================================
 * THE CUT EXPLORER  —  the signature interaction
 * ----------------------------------------------------------------------------
 * Every barbershop site lists services. Almost none of them answer the
 * question a first-time customer is actually stuck on, which is not "how much
 * is a fade" but "is a fade the thing I want?".
 *
 * So this is not a quiz and there is no funnel. It is a translation table with
 * a fast interface: pick the head you want in plain language, and it tells you
 * what the trade calls it, what it costs, how long it lasts, whose hands are
 * best at it, and what their work looks like — then books it. Four taps from
 * "I don't know" to a chair.
 *
 * IMPLEMENTATION NOTES
 *
 * · The list is a real tablist: arrow keys move between looks, Home/End jump
 *   to the ends, and the panel is wired with aria-controls. A picker built out
 *   of divs would have been half the code and unusable without a mouse.
 * · The panel's copy is keyed by look id so Motion cross-fades between states;
 *   the plate above it is not, so the imagery holds position while the text
 *   changes rather than the whole column flickering.
 * · "Not sure" is a first-class branch, not a link to a contact form. It asks
 *   one question, in the words people actually use, and always explains WHY it
 *   is pointing you somewhere — a recommendation without a reason is just an
 *   upsell.
 * ========================================================================== */

export function CutExplorer({
  tone = 'ink',
  headingLevel = 3,
}: {
  tone?: 'ink' | 'bone';
  /** The answer panel's heading. 2 where the explorer is the page's own
   * section; 3 where a section heading already sits above it. */
  headingLevel?: 2 | 3;
}) {
  const onBone = tone === 'bone';
  const baseId = useId();

  const [selectedId, setSelectedId] = useState(resolvedLooks[0]?.look.id ?? '');
  const [asking, setAsking] = useState(false);
  const [because, setBecause] = useState<string | null>(null);
  const tabsRef = useRef<HTMLDivElement>(null);

  const selected = useMemo(
    () => resolvedLooks.find((l) => l.look.id === selectedId) ?? resolvedLooks[0],
    [selectedId],
  );

  const choose = useCallback((id: string, reason: string | null = null) => {
    setSelectedId(id);
    setBecause(reason);
    setAsking(false);
    track('cut_explorer_select', { item: id });
  }, []);

  /* Roving arrow-key navigation, the behaviour a tablist is expected to have. */
  const onTabKey = (e: React.KeyboardEvent) => {
    const keys = ['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft', 'Home', 'End'];
    if (!keys.includes(e.key)) return;
    e.preventDefault();

    const index = resolvedLooks.findIndex((l) => l.look.id === selectedId);
    const last = resolvedLooks.length - 1;
    const next =
      e.key === 'Home' ? 0
      : e.key === 'End' ? last
      : e.key === 'ArrowDown' || e.key === 'ArrowRight'
        ? (index + 1) % resolvedLooks.length
        : (index - 1 + resolvedLooks.length) % resolvedLooks.length;

    choose(resolvedLooks[next].look.id);
    tabsRef.current
      ?.querySelector<HTMLElement>(`[data-look="${resolvedLooks[next].look.id}"]`)
      ?.focus();
  };

  if (!selected) return null;

  return (
    <div className="lg:grid lg:grid-cols-12 lg:gap-10">
      {/* ---- The picker ---------------------------------------------------- */}
      <div className="lg:col-span-5">
        <div
          ref={tabsRef}
          role="tablist"
          aria-orientation="vertical"
          aria-label="What are you getting?"
          onKeyDown={onTabKey}
          className={cn('border-t', onBone ? 'border-bone-line' : 'border-ink-line')}
        >
          {resolvedLooks.map((entry, i) => {
            const active = entry.look.id === selected.look.id && !asking;
            return (
              <button
                key={entry.look.id}
                role="tab"
                type="button"
                data-look={entry.look.id}
                id={`${baseId}-tab-${entry.look.id}`}
                aria-selected={active}
                aria-controls={`${baseId}-panel`}
                tabIndex={active ? 0 : -1}
                onClick={() => choose(entry.look.id)}
                className={cn(
                  'group flex w-full items-baseline gap-4 border-b py-4 text-left transition-colors lg:py-5',
                  onBone ? 'border-bone-line' : 'border-ink-line',
                )}
              >
                <span
                  className={cn(
                    'label-sm w-5 shrink-0 transition-colors',
                    /* Ember on bone measures 3.1:1 — fine for a rule or a dot,
                     * under AA for text. Ember-deep is the same accent at
                     * 4.5:1 and is what carries type on the light ground. */
                    active
                      ? onBone
                        ? 'text-ember-deep'
                        : 'text-ember'
                      : onBone
                        ? 'text-ink-mute'
                        : 'text-steel-dark',
                  )}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="min-w-0 flex-1">
                  <span
                    className={cn(
                      'display-sm block transition-colors',
                      active
                        ? onBone
                          ? 'text-ember-deep'
                          : 'text-ember'
                        : onBone
                          ? 'text-ink group-hover:text-ember-deep'
                          : 'text-bone group-hover:text-ember',
                    )}
                  >
                    {entry.look.label}
                  </span>
                  {entry.look.alias && (
                    <span
                      className={cn(
                        'label-sm mt-2 block',
                        onBone ? 'text-ink-mute' : 'text-steel-dark',
                      )}
                    >
                      {entry.look.alias}
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </div>

        {/* ---- The "I don't know" branch ---------------------------------- */}
        <div className="mt-6">
          <button
            type="button"
            onClick={() => setAsking((v) => !v)}
            aria-expanded={asking}
            aria-controls={`${baseId}-unsure`}
            className={cn(
              'label flex w-full items-center justify-between gap-4 border px-5 py-4 text-left transition-colors',
              asking
                ? onBone
                  ? 'border-ember-deep text-ember-deep'
                  : 'border-ember text-ember'
                : onBone
                  ? 'border-bone-line text-ink hover:border-ink'
                  : 'border-ink-line text-bone hover:border-steel-dark',
            )}
          >
            Not sure what to book?
            <span aria-hidden="true">{asking ? '−' : '+'}</span>
          </button>

          <div id={`${baseId}-unsure`} hidden={!asking}>
            <p className={cn('label mt-6', onBone ? 'text-ink-mute' : 'text-steel')}>
              {unsurePrompt}
            </p>
            <ul className="mt-3">
              {unsureOptions.map((option) => (
                <li key={option.id}>
                  <button
                    type="button"
                    onClick={() => choose(option.lookId, option.because)}
                    className={cn(
                      'flex w-full items-center gap-3 border-b py-3.5 text-left text-[0.9375rem] leading-snug transition-colors',
                      onBone
                        ? 'border-bone-line text-ink hover:text-ember-deep'
                        : 'border-ink-line text-bone hover:text-ember',
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={onBone ? 'text-ember-deep' : 'text-ember'}
                    >
                      →
                    </span>
                    {option.prompt}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* On a wide screen the picker ends well above the answer panel beside
            it, leaving a hole. Three facts fill it — and they are the three a
            first-timer is weighing while they read the list. */}
        <dl
          className={cn(
            'mt-10 hidden gap-x-10 gap-y-4 border-t pt-6 lg:flex lg:flex-wrap',
            onBone ? 'border-bone-line' : 'border-ink-line',
          )}
        >
          {[
            ['From', `$${priceFloor}`],
            ['Barbers', String(barbers.length)],
            ['Consultation', 'Included'],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className={cn('label-sm', onBone ? 'text-ink-mute' : 'text-steel-dark')}>
                {k}
              </dt>
              <dd className={cn('num mt-2 text-base', onBone ? 'text-ink' : 'text-bone')}>
                {v}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {/* ---- The answer ---------------------------------------------------- */}
      <div
        role="tabpanel"
        id={`${baseId}-panel`}
        aria-labelledby={`${baseId}-tab-${selected.look.id}`}
        tabIndex={-1}
        className="mt-12 lg:col-span-7 lg:mt-0"
      >
        <LookPanel
          entry={selected}
          because={because}
          tone={tone}
          headingLevel={headingLevel}
        />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function LookPanel({
  entry,
  because,
  tone,
  headingLevel,
}: {
  entry: ResolvedLook;
  because: string | null;
  tone: 'ink' | 'bone';
  headingLevel: 2 | 3;
}) {
  const onBone = tone === 'bone';
  const Heading = (headingLevel === 2 ? 'h2' : 'h3') as 'h2' | 'h3';
  const { open } = useBooking();
  const { look, service, barbers: roster, work, alsoConsider, hero } = entry;

  return (
    <div>
      <div className="relative">
        {/* The lead frame is a real photograph of the look, not a plate: this
            is the largest thing in the panel and the whole section is an
            argument that we can cut the thing you just pointed at. Landscape
            rather than 16:9 so a portrait-shot frame crops through the head
            instead of a narrow band across it. Falls back to the generated
            plate if the photograph is not on disk. */}
        <Plate
          src={hero?.image ?? null}
          alt={hero?.alt ?? `Reference plate for ${look.alias ?? look.label}`}
          aspect="landscape"
          variant="detail"
          seed={look.seed}
          sizes="(max-width: 1024px) 100vw, 55vw"
        />
        <span className="label-sm absolute left-4 top-4 bg-ink/80 px-2.5 py-2 text-bone backdrop-blur-sm">
          {look.alias ?? look.label}
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={look.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          {because && (
            <p
              className={cn(
                'mt-6 border-l-2 pl-4 text-[0.9375rem] leading-relaxed',
                onBone ? 'border-ember-deep text-ink' : 'border-ember text-bone',
              )}
            >
              {because}
            </p>
          )}

          <Heading className={cn('display-md mt-7', onBone ? 'text-ink' : 'text-bone')}>
            {look.label}
          </Heading>

          <p
            className={cn(
              'mt-4 max-w-2xl leading-relaxed',
              onBone ? 'text-ink-mute' : 'text-steel-light',
            )}
          >
            {look.description}
          </p>

          <dl
            className={cn(
              'mt-7 flex flex-wrap gap-x-10 gap-y-5 border-t pt-6',
              onBone ? 'border-bone-line' : 'border-ink-line',
            )}
          >
            <div>
              <dt className={cn('label-sm', onBone ? 'text-ink-mute' : 'text-steel-dark')}>
                Book
              </dt>
              <dd className={cn('mt-2', onBone ? 'text-ink' : 'text-bone')}>
                <Link href={serviceHref(service)} className="link-draw display-sm">
                  {service.name}
                </Link>
              </dd>
            </div>
            <div>
              <dt className={cn('label-sm', onBone ? 'text-ink-mute' : 'text-steel-dark')}>
                Price
              </dt>
              <dd className={cn('num mt-2 text-lg', onBone ? 'text-ink' : 'text-bone')}>
                {formatPrice(service)}
                <span className={onBone ? 'text-ink-mute' : 'text-steel'}>
                  {' '}
                  · {formatDuration(service.duration)}
                </span>
              </dd>
            </div>
            <div className="min-w-[12rem] flex-1">
              <dt className={cn('label-sm', onBone ? 'text-ink-mute' : 'text-steel-dark')}>
                How long it holds
              </dt>
              <dd
                className={cn(
                  'mt-2 text-sm leading-relaxed',
                  onBone ? 'text-ink-mute' : 'text-steel-light',
                )}
              >
                {look.upkeep}
              </dd>
            </div>
          </dl>

          {alsoConsider.length > 0 && (
            <p className={cn('mt-5 text-sm', onBone ? 'text-ink-mute' : 'text-steel')}>
              Also worth a look:{' '}
              {alsoConsider.map((s, i) => (
                <span key={s.id}>
                  {i > 0 && ', '}
                  <Link
                    href={serviceHref(s)}
                    className={cn('link-draw', onBone ? 'text-ink' : 'text-bone')}
                  >
                    {s.name}
                  </Link>
                </span>
              ))}
            </p>
          )}

          {/* -- Who cuts it -------------------------------------------------- */}
          <div className="mt-9">
            <p className={cn('label', onBone ? 'text-ink-mute' : 'text-steel')}>
              Best hands for it
            </p>
            <ul className="mt-4 flex flex-wrap gap-3">
              {roster.map((barber) => (
                <li
                  key={barber.slug}
                  className={cn(
                    'flex items-center gap-3 border p-2 pr-4',
                    onBone ? 'border-bone-line' : 'border-ink-line',
                  )}
                >
                  <Link
                    href={`/barbers/${barber.slug}`}
                    className="flex items-center gap-3"
                  >
                    <span className="block w-10 shrink-0">
                      <Plate
                        src={barber.portrait}
                        alt=""
                        aspect="square"
                        variant="portrait"
                        seed={barber.seed}
                        sizes="40px"
                        bare
                      />
                    </span>
                    <span>
                      <span
                        className={cn(
                          'block text-sm font-medium',
                          onBone ? 'text-ink' : 'text-bone',
                        )}
                      >
                        {barber.name.split(' ')[0]}
                      </span>
                      <span
                        className={cn(
                          'label-sm mt-1 block',
                          onBone ? 'text-ink-mute' : 'text-steel-dark',
                        )}
                      >
                        {specialtyLabels[barber.specialties[0]]}
                      </span>
                    </span>
                  </Link>
                  <button
                    type="button"
                    onClick={() =>
                      open({
                        barberSlug: barber.slug,
                        serviceId: service.id,
                        placement: 'cut_explorer',
                      })
                    }
                    className={cn(
                      'label ml-1 transition-opacity hover:opacity-70',
                      onBone ? 'text-ember-deep' : 'text-ember',
                    )}
                  >
                    Book
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* -- Their work --------------------------------------------------- */}
          {work.length > 0 && (
            <div className="mt-9">
              <p className={cn('label', onBone ? 'text-ink-mute' : 'text-steel')}>
                What it looks like
              </p>
              <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {work.map((item) => (
                  <li key={item.id}>
                    <Link href="/work" className="group block">
                      <Plate
                        src={item.image}
                        alt={item.alt}
                        aspect="square"
                        seed={workSeed(item)}
                        sizes="(max-width: 640px) 45vw, 14vw"
                        bare
                        className="transition-opacity group-hover:opacity-80"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-9">
            <BookButton
              intent={{ serviceId: service.id }}
              placement="cut_explorer"
              size="lg"
              className="w-full sm:w-auto"
            >
              Book {service.name}
            </BookButton>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

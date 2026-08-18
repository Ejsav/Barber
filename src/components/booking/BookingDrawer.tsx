'use client';

import { useCallback, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

import { useBooking } from '@/components/booking/BookingProvider';
import { useModalShell } from '@/lib/useModalShell';
import { business, weekdayOrder } from '@/data/business';
import { barbers } from '@/data/barbers';
import { formatDuration, formatPrice, services } from '@/data/services';
import { formatTime } from '@/lib/hours';
import { cn } from '@/lib/cn';

/* ============================================================================
 * DEMO BOOKING DRAWER
 * ----------------------------------------------------------------------------
 * A complete, honest demonstration of the booking flow: service → barber →
 * time → review. It NEVER submits anywhere and never claims a reservation was
 * made. Times shown are illustrative openings generated from the shop's posted
 * hours, and are labelled as such at every step.
 *
 * Setting `business.booking.url` retires this entirely — BookingProvider will
 * send every BOOK control straight to the real system instead.
 * ========================================================================== */

const STEPS = ['Service', 'Barber', 'Time', 'Review'] as const;

interface Slot {
  time: string;
  available: boolean;
}

interface DayOption {
  date: Date;
  key: string;
  weekday: string;
  dayNum: string;
  month: string;
  slots: Slot[];
}

/* Deterministic per-day pseudo-randomness so slots do not reshuffle on render */
function hash(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

function buildDays(barberSlug: string | undefined, durationMin: number): DayOption[] {
  const out: DayOption[] = [];
  const now = new Date();
  const barber = barbers.find((b) => b.slug === barberSlug);

  for (let i = 0; i < 21 && out.length < 10; i++) {
    const date = new Date(now);
    date.setDate(now.getDate() + i);
    const key = weekdayOrder[(date.getDay() + 6) % 7];
    const hours = business.hours[key];
    if (!hours.open || !hours.close) continue;
    if (barber && !barber.daysIn.includes(key)) continue;

    const [oh, om] = hours.open.split(':').map(Number);
    const [ch] = hours.close.split(':').map(Number);
    const step = Math.max(30, Math.min(60, durationMin));
    const slots: Slot[] = [];
    const iso = date.toISOString().slice(0, 10);

    for (let m = oh * 60 + om; m + durationMin <= ch * 60; m += step) {
      const t = `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
      const seed = hash(`${iso}${t}${barberSlug ?? 'any'}`);
      // Same-day slots earlier than now are gone; the rest are ~65% open.
      const past = i === 0 && m <= now.getHours() * 60 + now.getMinutes() + 45;
      slots.push({ time: t, available: !past && seed % 100 > 34 });
    }

    if (slots.some((s) => s.available)) {
      out.push({
        date,
        key: iso,
        weekday: date.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNum: date.toLocaleDateString('en-US', { day: 'numeric' }),
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        slots,
      });
    }
  }
  return out;
}

export function BookingDrawer() {
  const { isOpen, mode, close } = useBooking();

  /* The panel is mounted only while the drawer is open, so its step/date/time
   * state initialises straight from the visitor's intent and is discarded on
   * close. That removes the reset-on-open effect entirely — no cascading
   * render, and no chance of the drawer reopening on a stale step. */
  return (
    <AnimatePresence>
      {isOpen && mode === 'drawer' && (
        <div className="fixed inset-0 z-[120]" role="presentation">
          <motion.button
            type="button"
            aria-label="Close booking"
            onClick={close}
            className="absolute inset-0 bg-ink/80 backdrop-blur-[3px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          />
          <BookingPanel />
        </div>
      )}
    </AnimatePresence>
  );
}

function BookingPanel() {
  const { close, intent, setIntent } = useBooking();
  const reduce = useReducedMotion();
  const panelRef = useModalShell<HTMLDivElement>(close);

  const [step, setStep] = useState(() =>
    intent.serviceId ? (intent.barberSlug ? 2 : 1) : 0,
  );
  const [dayKey, setDayKey] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);

  const service = services.find((s) => s.id === intent.serviceId);
  const barber = barbers.find((b) => b.slug === intent.barberSlug);

  const eligibleBarbers = useMemo(
    () =>
      intent.serviceId
        ? barbers.filter((b) => b.serviceIds.includes(intent.serviceId!))
        : barbers,
    [intent.serviceId],
  );

  const days = useMemo(
    () => buildDays(intent.barberSlug, service?.duration ?? 45),
    [intent.barberSlug, service?.duration],
  );

  const activeDay = days.find((d) => d.key === dayKey) ?? days[0];

  const canAdvance =
    step === 0 ? Boolean(intent.serviceId)
    : step === 1 ? Boolean(intent.barberSlug)
    : step === 2 ? Boolean(time)
    : true;

  const goNext = useCallback(() => setStep((s) => Math.min(3, s + 1)), []);
  const goBack = useCallback(() => setStep((s) => Math.max(0, s - 1)), []);

  return (
    <motion.div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-title"
      className={cn(
        'absolute inset-x-0 bottom-0 flex max-h-[94dvh] flex-col border-t border-ink-line bg-ink-raised',
        'sm:inset-y-0 sm:left-auto sm:right-0 sm:max-h-none sm:w-[min(34rem,100vw)] sm:border-l sm:border-t-0',
      )}
      initial={reduce ? { opacity: 0 } : { y: '100%' }}
      animate={reduce ? { opacity: 1 } : { y: 0 }}
      exit={reduce ? { opacity: 0 } : { y: '100%' }}
      transition={{ duration: 0.62, ease: [0.16, 1, 0.3, 1] }}
    >
      <Header step={step} onClose={close} />

      <div className="flex-1 overflow-y-auto overscroll-contain" data-lenis-prevent>
        {step === 0 && (
          <ServiceStep
            selected={intent.serviceId}
            onSelect={(id) => {
              setIntent({ serviceId: id });
              setTime(null);
              goNext();
            }}
          />
        )}
        {step === 1 && (
          <BarberStep
            list={eligibleBarbers}
            selected={intent.barberSlug}
            onSelect={(slug) => {
              setIntent({ barberSlug: slug });
              setDayKey(null);
              setTime(null);
              goNext();
            }}
          />
        )}
        {step === 2 && (
          <TimeStep
            days={days}
            activeDay={activeDay}
            onPickDay={(k) => {
              setDayKey(k);
              setTime(null);
            }}
            time={time}
            onPickTime={setTime}
          />
        )}
        {step === 3 && (
          <ReviewStep
            serviceName={service?.name}
            price={service ? formatPrice(service) : undefined}
            duration={service ? formatDuration(service.duration) : undefined}
            barberName={barber?.name}
            day={activeDay}
            time={time}
          />
        )}
      </div>

      <Footer
        step={step}
        canAdvance={canAdvance}
        onBack={goBack}
        onNext={goNext}
        onClose={close}
        summary={
          service
            ? `${service.name}${barber ? ` · ${barber.name.split(' ')[0]}` : ''}`
            : 'Nothing selected'
        }
        price={service ? formatPrice(service) : ''}
      />
    </motion.div>
  );
}

/* -- Chrome ---------------------------------------------------------------- */

function Header({ step, onClose }: { step: number; onClose: () => void }) {
  return (
    <div className="shrink-0 border-b border-ink-line">
      <div className="flex items-start justify-between gap-4 px-5 pb-4 pt-5 sm:px-7 sm:pt-7">
        <div>
          <p className="label text-ember">Demonstration</p>
          <h2 id="booking-title" className="display-md mt-2 text-bone">
            Book a chair
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="-mr-1 -mt-1 flex h-11 w-11 items-center justify-center border border-ink-line text-steel-light transition-colors hover:border-bone hover:text-bone"
          aria-label="Close booking"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </button>
      </div>

      <ol className="flex gap-px bg-ink-line px-5 pb-0 sm:px-7" aria-label="Booking steps">
        {STEPS.map((s, i) => (
          <li key={s} className="flex-1 bg-ink-raised pb-3 pt-1">
            <span
              className={cn(
                'label block border-t-2 pt-3 transition-colors',
                i < step && 'border-ember text-steel-light',
                i === step && 'border-ember text-bone',
                i > step && 'border-ink-line text-steel-dark',
              )}
            >
              <span aria-hidden="true">{String(i + 1).padStart(2, '0')} </span>
              <span className="hidden sm:inline">{s}</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Footer({
  step,
  canAdvance,
  onBack,
  onNext,
  onClose,
  summary,
  price,
}: {
  step: number;
  canAdvance: boolean;
  onBack: () => void;
  onNext: () => void;
  onClose: () => void;
  summary: string;
  price: string;
}) {
  return (
    <div className="shrink-0 border-t border-ink-line bg-ink px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4 sm:px-7">
      <div className="mb-3 flex items-baseline justify-between gap-4">
        <span className="label truncate text-steel-light">{summary}</span>
        <span className="num text-lg text-bone">{price}</span>
      </div>
      <div className="flex gap-3">
        {step > 0 && (
          <button
            type="button"
            onClick={onBack}
            className="label h-14 shrink-0 border border-ink-line px-5 text-steel-light transition-colors hover:border-bone hover:text-bone"
          >
            Back
          </button>
        )}
        {step < 3 ? (
          <button
            type="button"
            onClick={onNext}
            disabled={!canAdvance}
            className="label h-14 flex-1 bg-ember text-ink transition-colors hover:bg-ember-deep hover:text-bone disabled:cursor-not-allowed disabled:bg-ink-panel disabled:text-steel-light"
          >
            Continue
          </button>
        ) : (
          <a
            href={business.phoneHref}
            onClick={onClose}
            className="label flex h-14 flex-1 items-center justify-center bg-bone text-ink transition-colors hover:bg-bone-raised"
          >
            Call the shop to confirm
          </a>
        )}
      </div>
    </div>
  );
}

/* -- Steps ----------------------------------------------------------------- */

function StepShell({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="px-5 py-6 sm:px-7">
      <p className="label text-steel">{eyebrow}</p>
      <h3 className="display-sm mt-2 text-bone">{title}</h3>
      <div className="mt-5">{children}</div>
    </div>
  );
}

function ServiceStep({
  selected,
  onSelect,
}: {
  selected?: string;
  onSelect: (id: string) => void;
}) {
  const bookable = services.filter((s) => s.group !== 'extras');
  return (
    <StepShell eyebrow="Step 01" title="What are you booking?">
      <ul className="divide-y divide-ink-line border-y border-ink-line">
        {bookable.map((s, i) => (
          <li key={s.id}>
            <button
              type="button"
              data-autofocus={i === 0 ? '' : undefined}
              onClick={() => onSelect(s.id)}
              aria-pressed={selected === s.id}
              className={cn(
                'group flex w-full items-baseline gap-4 py-4 text-left transition-colors',
                selected === s.id ? 'text-ember' : 'text-bone hover:text-ember',
              )}
            >
              <span className="flex-1">
                <span className="display-sm block">{s.name}</span>
                <span className="mt-1 block text-sm leading-snug text-steel-light">
                  {s.description}
                </span>
              </span>
              <span className="shrink-0 text-right">
                <span className="num block text-base">{formatPrice(s)}</span>
                <span className="label-sm mt-1 block text-steel">
                  {formatDuration(s.duration)}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </StepShell>
  );
}

function BarberStep({
  list,
  selected,
  onSelect,
}: {
  list: typeof barbers;
  selected?: string;
  onSelect: (slug: string) => void;
}) {
  return (
    <StepShell eyebrow="Step 02" title="Who is cutting?">
      <ul className="divide-y divide-ink-line border-y border-ink-line">
        {list.map((b, i) => (
          <li key={b.slug}>
            <button
              type="button"
              data-autofocus={i === 0 ? '' : undefined}
              onClick={() => onSelect(b.slug)}
              aria-pressed={selected === b.slug}
              className={cn(
                'flex w-full items-center gap-4 py-4 text-left transition-colors',
                selected === b.slug ? 'text-ember' : 'text-bone hover:text-ember',
              )}
            >
              <span className="flex-1">
                <span className="display-sm block">{b.name}</span>
                <span className="label-sm mt-1.5 block text-steel">{b.role}</span>
              </span>
              <span className="num shrink-0 text-sm text-steel-light">
                from ${b.startingPrice}
              </span>
            </button>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm text-steel">
        No preference? Any of them can take this service — pick whoever has the
        time that suits you.
      </p>
    </StepShell>
  );
}

function TimeStep({
  days,
  activeDay,
  onPickDay,
  time,
  onPickTime,
}: {
  days: DayOption[];
  activeDay?: DayOption;
  onPickDay: (key: string) => void;
  time: string | null;
  onPickTime: (t: string) => void;
}) {
  return (
    <StepShell eyebrow="Step 03" title="When suits you?">
      <p className="mb-5 border border-dashed border-ember/40 bg-ember/5 p-3 text-xs leading-relaxed text-ember-tint">
        Illustrative openings generated from the shop&rsquo;s posted hours. Live
        availability arrives when the booking system is connected.
      </p>

      <div className="rail -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:-mx-7 sm:px-7">
        {days.map((d, i) => {
          const active = (activeDay?.key ?? days[0]?.key) === d.key;
          return (
            <button
              key={d.key}
              type="button"
              data-autofocus={i === 0 ? '' : undefined}
              onClick={() => onPickDay(d.key)}
              aria-pressed={active}
              className={cn(
                'flex h-20 w-16 shrink-0 flex-col items-center justify-center gap-1 border transition-colors',
                active
                  ? 'border-ember bg-ember text-ink'
                  : 'border-ink-line text-steel-light hover:border-bone hover:text-bone',
              )}
            >
              <span className="label-sm">{d.weekday}</span>
              <span className="num text-xl leading-none">{d.dayNum}</span>
              <span className="label-sm opacity-70">{d.month}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-6 grid grid-cols-3 gap-2 sm:grid-cols-4">
        {activeDay?.slots.map((s) => (
          <button
            key={s.time}
            type="button"
            disabled={!s.available}
            onClick={() => onPickTime(s.time)}
            aria-pressed={time === s.time}
            className={cn(
              'num h-12 border text-sm transition-colors',
              !s.available &&
                'cursor-not-allowed border-ink-line/50 text-steel-dark line-through',
              s.available &&
                time === s.time &&
                'border-ember bg-ember text-ink',
              s.available &&
                time !== s.time &&
                'border-ink-line text-bone hover:border-bone',
            )}
          >
            {formatTime(s.time)}
          </button>
        ))}
      </div>
    </StepShell>
  );
}

function ReviewStep({
  serviceName,
  price,
  duration,
  barberName,
  day,
  time,
}: {
  serviceName?: string;
  price?: string;
  duration?: string;
  barberName?: string;
  day?: DayOption;
  time: string | null;
}) {
  const rows = [
    ['Service', serviceName ?? '—'],
    ['Barber', barberName ?? '—'],
    [
      'When',
      day && time
        ? `${day.date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
          })} at ${formatTime(time)}`
        : '—',
    ],
    ['Length', duration ?? '—'],
    ['Price', price ?? '—'],
  ];

  return (
    <StepShell eyebrow="Step 04" title="This is a demo">
      <div className="border border-ember/40 bg-ember/5 p-4">
        <p className="label text-ember">Nothing has been booked</p>
        <p className="mt-3 text-sm leading-relaxed text-bone">
          This drawer demonstrates the flow a customer would follow. It is not
          connected to a scheduling system, so no appointment has been created
          and no details have been sent anywhere.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-steel-light">
          Point <code className="text-ember-tint">business.booking.url</code> at
          the shop&rsquo;s real platform — Booksy, Square, Fresha, Boulevard,
          GlossGenius — and every BOOK control on this site opens it instead.
        </p>
      </div>

      <dl className="mt-6 divide-y divide-ink-line border-y border-ink-line">
        {rows.map(([k, v]) => (
          <div key={k} className="flex items-baseline justify-between gap-4 py-3.5">
            <dt className="label text-steel">{k}</dt>
            <dd className="text-right text-sm text-bone">{v}</dd>
          </div>
        ))}
      </dl>
    </StepShell>
  );
}

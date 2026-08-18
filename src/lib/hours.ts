import {
  business,
  weekdayLabels,
  weekdayOrder,
  type DayHours,
  type WeekdayKey,
} from '@/data/business';

export type WeekHours = Record<WeekdayKey, DayHours>;

/** "09:00" -> "9am", "19:30" -> "7:30pm" */
export function formatTime(value: string): string {
  const [h, m] = value.split(':').map(Number);
  const suffix = h >= 12 ? 'pm' : 'am';
  const hour = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${hour}${suffix}` : `${hour}:${String(m).padStart(2, '0')}${suffix}`;
}

export function formatDayHours(day: DayHours): string {
  if (!day.open || !day.close) return 'Closed';
  return `${formatTime(day.open)} — ${formatTime(day.close)}`;
}

/** The week as rows, for any shop's hours. */
export function weekScheduleFor(hours: WeekHours) {
  return weekdayOrder.map((key) => ({
    key,
    label: weekdayLabels[key],
    short: weekdayLabels[key].slice(0, 3),
    hours: hours[key],
    display: formatDayHours(hours[key]),
  }));
}

/** The primary shop's week — the default everywhere one shop is implied. */
export const weekSchedule = weekScheduleFor(business.hours);

/**
 * Today's hours, resolved on the client so the answer matches the visitor's
 * clock rather than the build machine's. Rendering this on the server would
 * bake a stale day into the static HTML.
 */
export function resolveToday(
  hours: WeekHours = business.hours,
  now: Date = new Date(),
) {
  const index = (now.getDay() + 6) % 7; // JS weeks start Sunday; ours start Monday
  const key = weekdayOrder[index] as WeekdayKey;
  const day = hours[key];
  const label = weekdayLabels[key];

  if (!day.open || !day.close) {
    return { key, label, isOpen: false, display: 'Closed today', hours: day };
  }

  const minutes = now.getHours() * 60 + now.getMinutes();
  const toMinutes = (t: string) => {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  };
  const open = toMinutes(day.open);
  const close = toMinutes(day.close);
  const isOpen = minutes >= open && minutes < close;
  const closingSoon = isOpen && close - minutes <= 60;

  return {
    key,
    label,
    isOpen,
    closingSoon,
    display: isOpen
      ? `Open until ${formatTime(day.close)}`
      : minutes < open
        ? `Opens ${formatTime(day.open)}`
        : 'Closed for the day',
    hours: day,
  };
}

/** Schema.org openingHours specification for any shop's hours. */
export function openingHoursSpecification(hours: WeekHours = business.hours) {
  const map: Record<WeekdayKey, string> = {
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday',
  };
  return weekdayOrder
    .filter((d) => hours[d].open && hours[d].close)
    .map((d) => ({
      '@type': 'OpeningHoursSpecification' as const,
      dayOfWeek: `https://schema.org/${map[d]}`,
      opens: hours[d].open as string,
      closes: hours[d].close as string,
    }));
}

/** Compact summary like "Tue–Sat" for a shop's open days. */
export function openDaysSummary(hours: WeekHours): string {
  const open = weekdayOrder.filter((d) => hours[d].open && hours[d].close);
  if (open.length === 0) return 'Closed';
  if (open.length === 7) return 'Every day';

  const short = (d: WeekdayKey) => weekdayLabels[d].slice(0, 3);
  const runs: WeekdayKey[][] = [];
  let run: WeekdayKey[] = [];
  weekdayOrder.forEach((d) => {
    if (hours[d].open && hours[d].close) {
      run.push(d);
    } else if (run.length) {
      runs.push(run);
      run = [];
    }
  });
  if (run.length) runs.push(run);

  return runs
    .map((r) => (r.length === 1 ? short(r[0]) : `${short(r[0])}–${short(r[r.length - 1])}`))
    .join(', ');
}

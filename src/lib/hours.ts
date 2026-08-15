import {
  business,
  weekdayLabels,
  weekdayOrder,
  type DayHours,
  type WeekdayKey,
} from '@/data/business';

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

export const weekSchedule = weekdayOrder.map((key) => ({
  key,
  label: weekdayLabels[key],
  short: weekdayLabels[key].slice(0, 3),
  hours: business.hours[key],
  display: formatDayHours(business.hours[key]),
}));

/**
 * Today's hours, resolved on the client so the answer matches the visitor's
 * clock rather than the build machine's. Rendering this on the server would
 * bake a stale day into the static HTML.
 */
export function resolveToday(now: Date = new Date()) {
  const index = (now.getDay() + 6) % 7; // JS weeks start Sunday; ours start Monday
  const key = weekdayOrder[index] as WeekdayKey;
  const hours = business.hours[key];
  const label = weekdayLabels[key];

  if (!hours.open || !hours.close) {
    return { key, label, isOpen: false, display: 'Closed today', hours };
  }

  const minutes = now.getHours() * 60 + now.getMinutes();
  const toMinutes = (t: string) => {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  };
  const open = toMinutes(hours.open);
  const close = toMinutes(hours.close);
  const isOpen = minutes >= open && minutes < close;
  const closingSoon = isOpen && close - minutes <= 60;

  return {
    key,
    label,
    isOpen,
    closingSoon,
    display: isOpen
      ? `Open until ${formatTime(hours.close)}`
      : minutes < open
        ? `Opens ${formatTime(hours.open)}`
        : 'Closed for the day',
    hours,
  };
}

/** Schema.org openingHours strings, e.g. "Tu,We 10:00-19:00". */
export function openingHoursSpecification() {
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
    .filter((d) => business.hours[d].open && business.hours[d].close)
    .map((d) => ({
      '@type': 'OpeningHoursSpecification' as const,
      dayOfWeek: `https://schema.org/${map[d]}`,
      opens: business.hours[d].open as string,
      closes: business.hours[d].close as string,
    }));
}

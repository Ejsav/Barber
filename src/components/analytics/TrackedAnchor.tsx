'use client';

import { track, type AnalyticsEvent, type AnalyticsPayload } from '@/lib/analytics';

/**
 * An ordinary anchor that reports the click before following it.
 *
 * It exists so server components (the footer, the location panels, the barber
 * profiles) can measure outbound intent without becoming client components
 * themselves — only this leaf ships JavaScript.
 *
 * The href is a real href: the link works with JS disabled, opens in a new tab
 * on middle click, and is copyable. Nothing about the navigation is
 * synthesised.
 */
export function TrackedAnchor({
  event,
  payload,
  external,
  children,
  ...props
}: {
  event: AnalyticsEvent;
  payload?: AnalyticsPayload;
  /** Opens in a new tab with the correct rel. */
  external?: boolean;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      {...props}
      {...(external ? { target: '_blank', rel: 'noreferrer' } : null)}
      onClick={(e) => {
        track(event, payload);
        props.onClick?.(e);
      }}
    >
      {children}
    </a>
  );
}

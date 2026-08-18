import type { ElementType, ReactNode } from 'react';

/* ----------------------------------------------------------------------------
 * Masked line reveal, driven by CSS instead of JavaScript.
 *
 * WHY THIS EXISTS SEPARATELY FROM RevealLines
 *
 * On every interior page the <h1> in the page header is the LCP element. Run
 * through Motion it starts translated fully outside its `overflow: hidden`
 * mask and stays there until React has hydrated — so the browser has nothing
 * to paint as "largest contentful" until the JavaScript lands. Measured on a
 * 4× CPU-throttled 1.6Mbps phone profile that put interior LCP at 3.7s.
 *
 * As a CSS animation it runs on the browser's first paint, needs no hydration,
 * ships no client JavaScript at all, and works with scripting disabled. The
 * same reasoning already governs the homepage hero — see the note at the
 * bottom of globals.css.
 *
 * RevealLines is still the right component for headings BELOW the fold, where
 * the reveal has to be triggered by the scroll position rather than by load.
 * -------------------------------------------------------------------------- */

export function HeroLines({
  lines,
  className,
  as: Tag = 'h1',
  id,
  delay = 0.08,
  stagger = 0.07,
}: {
  /** Pre-split. Deliberate line breaks are art direction, not a runtime job. */
  lines: ReactNode[];
  className?: string;
  as?: ElementType;
  id?: string;
  /** Seconds before the first line rises. */
  delay?: number;
  stagger?: number;
}) {
  return (
    <Tag id={id} className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.06em]">
          <span
            className="anim-line block"
            style={{ animationDelay: `${delay + i * stagger}s` }}
          >
            {line}
            {/* Keeps words apart in the accessible name and in copied text —
                block-level lines otherwise concatenate into "askswho". */}
            {i < lines.length - 1 ? ' ' : ''}
          </span>
        </span>
      ))}
    </Tag>
  );
}

/* ----------------------------------------------------------------------------
 * The same argument, for everything else in a page header.
 *
 * A standfirst, a stat row and a BOOK button sitting behind a scroll-triggered
 * JavaScript reveal are invisible until hydration. On an interior page the
 * standfirst is frequently the LCP element — measured at 3.7s on a throttled
 * phone — and, worse, the booking CTA is not paintable either. Above the fold
 * the entrance is CSS; below it, `Reveal` is still the right tool.
 * -------------------------------------------------------------------------- */

export function Rise({
  children,
  className,
  delay = 0.2,
  as: Tag = 'div',
}: {
  children: ReactNode;
  className?: string;
  /** Seconds. */
  delay?: number;
  as?: ElementType;
}) {
  return (
    <Tag className={`anim-rise ${className ?? ''}`} style={{ animationDelay: `${delay}s` }}>
      {children}
    </Tag>
  );
}

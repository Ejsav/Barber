'use client';

import { business } from '@/data/business';
import { track } from '@/lib/analytics';
import { cn } from '@/lib/cn';

/* ----------------------------------------------------------------------------
 * Gift cards, told the truth about.
 *
 *   · An external checkout is configured  →  a link that opens it.
 *   · Sold at the counter only            →  plain text saying exactly that,
 *                                            because a link to nothing is
 *                                            worse than no link.
 *   · Neither                             →  nothing renders at all.
 *
 * Configured in `business.giftCards` (data/business.ts).
 * -------------------------------------------------------------------------- */

export function GiftCardLink({
  placement,
  className,
  label = 'Gift cards',
}: {
  placement: string;
  className?: string;
  label?: string;
}) {
  const { url, inShop } = business.giftCards;

  if (url) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        onClick={() => track('gift_card_click', { placement })}
        className={className}
      >
        {label}
      </a>
    );
  }

  if (inShop) {
    return (
      <span className={cn('text-steel-light', className)}>
        {label} — at the counter
      </span>
    );
  }

  return null;
}

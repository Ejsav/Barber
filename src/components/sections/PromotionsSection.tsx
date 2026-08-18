import { activePromotions } from '@/lib/promotions';
import { Promotions } from '@/components/sections/Promotions';

/**
 * Server half of the offers section: resolves what is live at build time so
 * the client half has something to hydrate against. Splitting it this way
 * keeps the date logic on the server for the first paint and on the visitor's
 * clock thereafter.
 */
export function PromotionsSection({ tone = 'ink' }: { tone?: 'ink' | 'bone' }) {
  return <Promotions initial={activePromotions(new Date())} tone={tone} />;
}

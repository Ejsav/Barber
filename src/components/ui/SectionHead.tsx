import Link from 'next/link';
import { RevealLines, Reveal } from '@/components/ui/Reveal';
import { cn } from '@/lib/cn';

/* ----------------------------------------------------------------------------
 * Section opener. One component, so numbering, rules and rhythm stay identical
 * across the site — the variation between sections comes from layout, not from
 * every heading being drawn differently.
 * -------------------------------------------------------------------------- */

export function SectionHead({
  index,
  label,
  lines,
  standfirst,
  link,
  tone = 'ink',
  align = 'left',
  as = 'h2',
  className,
}: {
  /** Two-digit section number, e.g. '02'. */
  index: string;
  label: string;
  /** Headline pre-split into deliberate lines. */
  lines: string[];
  standfirst?: string;
  link?: { href: string; label: string };
  /** Which ground the section sits on. */
  tone?: 'ink' | 'bone';
  align?: 'left' | 'right';
  as?: 'h1' | 'h2';
  className?: string;
}) {
  const onBone = tone === 'bone';

  return (
    <div className={cn('relative', className)}>
      <div
        className={cn(
          'flex items-baseline gap-4 border-b pb-4',
          onBone ? 'border-bone-line' : 'border-ink-line',
        )}
      >
        <span className={cn('label-sm', onBone ? 'text-ink-mute' : 'text-steel-dark')}>
          {index}
        </span>
        <span className={cn('label', onBone ? 'text-ink-mute' : 'text-steel')}>
          {label}
        </span>
        {link && (
          <Link
            href={link.href}
            className={cn(
              'link-draw label ml-auto shrink-0',
              onBone ? 'text-ink' : 'text-ember',
            )}
          >
            {link.label}
          </Link>
        )}
      </div>

      <div
        className={cn(
          'mt-7 gap-8 lg:mt-10 lg:flex lg:items-end',
          align === 'right' && 'lg:flex-row-reverse',
        )}
      >
        <RevealLines
          as={as}
          lines={lines}
          className={cn(
            'display-xl flex-1',
            onBone ? 'text-ink' : 'text-bone',
          )}
        />
        {standfirst && (
          <Reveal
            delay={0.15}
            className={cn(
              'mt-6 max-w-md lg:mt-0 lg:w-[26rem] lg:shrink-0 lg:pb-2',
            )}
          >
            <p
              className={cn(
                'body-lg',
                onBone ? 'text-ink-mute' : 'text-bone/70',
              )}
            >
              {standfirst}
            </p>
          </Reveal>
        )}
      </div>
    </div>
  );
}

import Link from 'next/link';

import { RevealLines, Reveal } from '@/components/ui/Reveal';
import { cn } from '@/lib/cn';

/* ----------------------------------------------------------------------------
 * Interior page opener.
 *
 * Deliberately a different shape from the homepage hero — no full-bleed media,
 * no viewport-height claim. Interior pages are places people arrive with a
 * question, so the headline sits high and the content starts sooner.
 * -------------------------------------------------------------------------- */

export function PageHero({
  index,
  label,
  lines,
  standfirst,
  meta,
  crumb,
  tone = 'ink',
  children,
}: {
  index: string;
  label: string;
  lines: string[];
  standfirst?: string;
  /** Small facts set in mono under the headline. */
  meta?: { k: string; v: string }[];
  crumb?: { href: string; label: string };
  tone?: 'ink' | 'bone';
  children?: React.ReactNode;
}) {
  const onBone = tone === 'bone';

  return (
    <header
      className={cn(
        'relative isolate overflow-hidden',
        onBone ? 'on-bone bg-bone text-ink' : 'bg-ink text-bone',
      )}
    >
      {/* Screened field, cropped to the top-right corner */}
      <div
        aria-hidden="true"
        className={cn(
          'screen-dots-coarse pointer-events-none absolute inset-0',
          onBone ? 'text-ink opacity-[0.07]' : 'text-bone opacity-[0.07]',
        )}
        style={{
          maskImage: 'radial-gradient(90% 100% at 100% 0%, #000, transparent 70%)',
          WebkitMaskImage:
            'radial-gradient(90% 100% at 100% 0%, #000, transparent 70%)',
        }}
      />

      <div
        className="shell relative pb-14 lg:pb-20"
        style={{ paddingTop: 'calc(var(--header-h) + 3.5rem)' }}
      >
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
          {crumb && (
            <Link
              href={crumb.href}
              className={cn(
                'link-draw label ml-auto',
                onBone ? 'text-ink' : 'text-ember',
              )}
            >
              ← {crumb.label}
            </Link>
          )}
        </div>

        <RevealLines
          as="h1"
          lines={lines}
          className={cn('display-xl mt-8 lg:mt-12', onBone ? 'text-ink' : 'text-bone')}
        />

        {standfirst && (
          <Reveal delay={0.12}>
            <p
              className={cn(
                'body-lg mt-7 max-w-2xl',
                onBone ? 'text-ink-mute' : 'text-bone/70',
              )}
            >
              {standfirst}
            </p>
          </Reveal>
        )}

        {meta && meta.length > 0 && (
          <Reveal delay={0.2}>
            <dl
              className={cn(
                'mt-10 flex flex-wrap gap-x-10 gap-y-4 border-t pt-6',
                onBone ? 'border-bone-line' : 'border-ink-line',
              )}
            >
              {meta.map((m) => (
                <div key={m.k}>
                  <dt className={cn('label-sm', onBone ? 'text-ink-mute' : 'text-steel-dark')}>
                    {m.k}
                  </dt>
                  <dd className={cn('num mt-1.5 text-base', onBone ? 'text-ink' : 'text-bone')}>
                    {m.v}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        )}

        {children}
      </div>
    </header>
  );
}

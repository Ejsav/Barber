'use client';

import { useId, useState } from 'react';

import { BookButton } from '@/components/ui/BookButton';
import {
  fadeFinishes,
  fadeHeights,
  fadeSentence,
  fadeServiceId,
  type FadeFinish,
  type FadeHeight,
} from '@/data/fades';
import { getService } from '@/data/services';
import { formatDuration, formatPrice } from '@/data/services';
import { track } from '@/lib/analytics';
import { cn } from '@/lib/cn';

/* ============================================================================
 * THE FADE DIAL
 * ----------------------------------------------------------------------------
 * The site's second signature interaction, and the one that goes furthest into
 * the trade: it draws the haircut while you describe it.
 *
 * The two controls are the two axes a barber actually works on — how far up
 * the blend starts, and how close it gets at the bottom — and the drawing
 * updates live from both. The output is not a booking, it is a SENTENCE: the
 * exact words to say in the chair. That is the thing a first-timer is missing,
 * and no price list has ever supplied it.
 *
 * WHY IT IS DRAWN RATHER THAN PHOTOGRAPHED
 *
 * Twelve combinations would need twelve photographs of twelve different heads,
 * and the differences between adjacent ones would be swamped by the difference
 * between the models. Drawn, the head is constant and the only thing that
 * changes is the cut — which is the entire point of the control.
 *
 * And the blend is rendered as a halftone screen: dots that grow as the hair
 * gets shorter. That is not decoration. The brand is built on the observation
 * that a fade IS a tonal gradient, and a tonal gradient on press IS a halftone
 * screen — so here the logo's idea and the product's mechanics are the same
 * drawing.
 * ========================================================================== */

const VIEW_W = 300;
const VIEW_H = 380;

/* Head geometry, in view units. The silhouette is deliberately stylised —
 * a rendered-realistic head would invite comparison with a photograph and
 * lose; a graphic one reads as a diagram, which is what it is. */
const CROWN_Y = 34;
const NECK_Y = 300;

const HEAD_PATH = `
  M 148 34
  C 196 34 230 68 236 116
  C 240 128 244 134 252 142
  C 258 148 258 153 249 156
  C 246 165 248 169 241 173
  C 245 181 243 187 235 193
  C 239 203 235 213 221 221
  C 205 235 182 243 160 243
  L 124 243 L 122 300
  L 92 300 L 92 237
  C 68 215 58 163 76 119
  C 92 75 116 34 148 34 Z
`;

/* The guide line stops short of the face. A fade is cut on the back and sides,
 * so a rule drawn straight through the nose is not just ugly — it describes a
 * haircut nobody has ever had. */
const GUIDE_X2 = 208;

export function FadeDial({ tone = 'ink' }: { tone?: 'ink' | 'bone' }) {
  const onBone = tone === 'bone';
  const uid = useId().replace(/:/g, '');

  const [height, setHeight] = useState<FadeHeight>(fadeHeights[2]); // Mid
  const [finish, setFinish] = useState<FadeFinish>(fadeFinishes[0]); // To skin

  const service = getService(fadeServiceId(height.id));
  const sentence = fadeSentence(height, finish);

  /* Where the blend begins and ends on the drawing. */
  const startY = CROWN_Y + (NECK_Y - CROWN_Y) * height.start;

  const choose = (next: { height?: FadeHeight; finish?: FadeFinish }) => {
    if (next.height) setHeight(next.height);
    if (next.finish) setFinish(next.finish);
    track('cut_explorer_select', {
      item: `fade:${next.height?.id ?? height.id}/${next.finish?.id ?? finish.id}`,
    });
  };

  return (
    <div className="lg:grid lg:grid-cols-12 lg:gap-10">
      {/* ---- The drawing ---------------------------------------------------- */}
      <div className="lg:col-span-5">
        <div
          className={cn(
            'relative border',
            onBone ? 'border-bone-line bg-bone-raised' : 'border-ink-line bg-ink-raised',
          )}
        >
          <svg
            viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
            className="h-auto w-full"
            role="img"
            aria-label={`Side view of a head showing ${sentence.toLowerCase()}`}
          >
            <defs>
              {/* The blend, as a real halftone: dot radius grows toward the
                  neckline exactly as the hair gets shorter. */}
              <radialGradient id={`${uid}-dot`}>
                <stop offset="0" stopColor="currentColor" />
                <stop offset="1" stopColor="currentColor" />
              </radialGradient>

              <pattern
                id={`${uid}-screen`}
                width="7"
                height="7"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="3.5" cy="3.5" r="2.4" fill={onBone ? '#e2dacc' : '#0b0a09'} />
              </pattern>

              {/* Mask: nothing above where the fade starts, rising to the
                  chosen exposure at the neckline. */}
              <linearGradient
                id={`${uid}-blend`}
                x1="0"
                y1={startY}
                x2="0"
                y2={NECK_Y}
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0" stopColor="#000" />
                <stop offset="0.55" stopColor="#fff" stopOpacity={finish.exposure * 0.55} />
                <stop offset="1" stopColor="#fff" stopOpacity={finish.exposure} />
              </linearGradient>

              <mask id={`${uid}-mask`}>
                <rect width={VIEW_W} height={VIEW_H} fill={`url(#${uid}-blend)`} />
              </mask>

              <clipPath id={`${uid}-head`}>
                <path d={HEAD_PATH} />
              </clipPath>
            </defs>

            {/* Hair / head mass */}
            <path
              d={HEAD_PATH}
              className={onBone ? 'fill-ink' : 'fill-ink-panel'}
              stroke={onBone ? '#cdc3b1' : '#2b2724'}
              strokeWidth="1.5"
            />

            {/* The fade itself — screen dots revealing the ground beneath */}
            <g clipPath={`url(#${uid}-head)`}>
              <rect
                width={VIEW_W}
                height={VIEW_H}
                fill={`url(#${uid}-screen)`}
                mask={`url(#${uid}-mask)`}
              />
            </g>

            {/* Ear — the landmark every fade height is described against */}
            <path
              d="M 150 168 C 140 158 128 162 128 176 C 128 190 138 200 148 198"
              fill="none"
              stroke={onBone ? '#6b6459' : '#6b6459'}
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* Where the blend starts — the whole teaching point of the panel */}
            <g>
              <line
                x1="46"
                y1={startY}
                x2={GUIDE_X2}
                y2={startY}
                stroke="#e2512b"
                strokeWidth="1.25"
                strokeDasharray="5 4"
              />
              <circle cx="46" cy={startY} r="3" fill="#e2512b" />
              <text
                x="52"
                y={startY - 10}
                fill="#e2512b"
                fontSize="10.5"
                letterSpacing="2.4"
                style={{ textTransform: 'uppercase' }}
              >
                Blend starts
              </text>
            </g>
          </svg>

          <p
            className={cn(
              'label-sm border-t px-5 py-4',
              onBone ? 'border-bone-line text-ink-mute' : 'border-ink-line text-steel',
            )}
          >
            Diagram — proportions are stylised
          </p>
        </div>
      </div>

      {/* ---- The controls --------------------------------------------------- */}
      <div className="mt-10 lg:col-span-7 lg:mt-0">
        <Group
          label="How far up does it start?"
          tone={tone}
          options={fadeHeights}
          selected={height.id}
          onSelect={(o) => choose({ height: o as FadeHeight })}
          caption={(o) => (o as FadeHeight).plain}
        />

        <div className="mt-9">
          <Group
            label="How close at the bottom?"
            tone={tone}
            options={fadeFinishes}
            selected={finish.id}
            onSelect={(o) => choose({ finish: o as FadeFinish })}
            caption={(o) => (o as FadeFinish).plain}
          />
        </div>

        {/* ---- The answer --------------------------------------------------- */}
        <div
          className={cn(
            'mt-10 border-t pt-8',
            onBone ? 'border-bone-line' : 'border-ink-line',
          )}
        >
          <p className={cn('label', onBone ? 'text-ink-mute' : 'text-steel')}>
            Say this in the chair
          </p>
          <p
            className={cn(
              'display-md mt-4',
              onBone ? 'text-ink' : 'text-bone',
            )}
            /* Announced on change so the sentence — the actual output of the
               control — reaches a screen reader without moving focus. */
            aria-live="polite"
          >
            &ldquo;{sentence}&rdquo;
          </p>

          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <p
              className={cn(
                'text-sm leading-relaxed',
                onBone ? 'text-ink-mute' : 'text-steel-light',
              )}
            >
              {height.description}
            </p>
            <p
              className={cn(
                'text-sm leading-relaxed',
                onBone ? 'text-ink-mute' : 'text-steel-light',
              )}
            >
              {finish.description}
            </p>
          </div>

          {service && (
            <dl
              className={cn(
                'mt-8 flex flex-wrap gap-x-10 gap-y-5 border-t pt-6',
                onBone ? 'border-bone-line' : 'border-ink-line',
              )}
            >
              <div>
                <dt className={cn('label-sm', onBone ? 'text-ink-mute' : 'text-steel-dark')}>
                  Book
                </dt>
                <dd className={cn('display-sm mt-2', onBone ? 'text-ink' : 'text-bone')}>
                  {service.name}
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
              <div className="min-w-[10rem] flex-1">
                <dt className={cn('label-sm', onBone ? 'text-ink-mute' : 'text-steel-dark')}>
                  How long it holds
                </dt>
                <dd
                  className={cn(
                    'mt-2 text-sm',
                    onBone ? 'text-ink-mute' : 'text-steel-light',
                  )}
                >
                  {finish.upkeep}
                </dd>
              </div>
            </dl>
          )}

          <div className="mt-8">
            <BookButton
              intent={{ serviceId: service?.id }}
              placement="fade_dial"
              size="lg"
              className="w-full sm:w-auto"
            >
              Book {service?.name ?? 'your cut'}
            </BookButton>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

interface Option {
  id: string;
  name: string;
}

/**
 * A radiogroup rendered as a rail. Native radios would carry the semantics for
 * free but cannot be styled to this without fighting the browser, so the roles
 * are declared and the roving tabindex is implemented — arrow keys move the
 * selection, which is what a radiogroup is expected to do.
 */
function Group({
  label,
  options,
  selected,
  onSelect,
  caption,
  tone,
}: {
  label: string;
  options: readonly Option[];
  selected: string;
  onSelect: (option: Option) => void;
  caption: (option: Option) => string;
  tone: 'ink' | 'bone';
}) {
  const onBone = tone === 'bone';
  const index = options.findIndex((o) => o.id === selected);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const keys = ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'];
    if (!keys.includes(e.key)) return;
    e.preventDefault();
    const forward = e.key === 'ArrowRight' || e.key === 'ArrowDown';
    const next = forward
      ? (index + 1) % options.length
      : (index - 1 + options.length) % options.length;
    onSelect(options[next]);
    (e.currentTarget as HTMLElement)
      .querySelectorAll<HTMLElement>('[role="radio"]')
      [next]?.focus();
  };

  return (
    <div>
      <p className={cn('label', onBone ? 'text-ink-mute' : 'text-steel')}>{label}</p>
      <div
        role="radiogroup"
        aria-label={label}
        onKeyDown={onKeyDown}
        className={cn('mt-4 border-t', onBone ? 'border-bone-line' : 'border-ink-line')}
      >
        {options.map((option) => {
          const active = option.id === selected;
          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={active}
              tabIndex={active ? 0 : -1}
              onClick={() => onSelect(option)}
              className={cn(
                'flex w-full items-baseline gap-4 border-b py-4 text-left transition-colors',
                onBone ? 'border-bone-line' : 'border-ink-line',
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  'mt-1 block h-2.5 w-2.5 shrink-0 rounded-full border transition-colors',
                  active
                    ? 'border-ember bg-ember'
                    : onBone
                      ? 'border-ink-mute'
                      : 'border-steel-dark',
                )}
              />
              <span className="min-w-0 flex-1">
                <span
                  className={cn(
                    'display-sm block transition-colors',
                    active
                      ? onBone
                        ? 'text-ember-deep'
                        : 'text-ember'
                      : onBone
                        ? 'text-ink'
                        : 'text-bone',
                  )}
                >
                  {option.name}
                </span>
                <span
                  className={cn(
                    'mt-1.5 block text-sm',
                    onBone ? 'text-ink-mute' : 'text-steel',
                  )}
                >
                  {caption(option)}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

'use client';

import { useCallback, useRef, useState } from 'react';

import { Plate } from '@/components/ui/Plate';
import type { WorkItem } from '@/data/work';

/* ----------------------------------------------------------------------------
 * Before / after comparison.
 *
 * Driven by a real <input type="range">, so it is keyboard-operable and
 * announced correctly with zero extra ARIA plumbing; pointer drag just writes
 * to the same value. The divider is transform-only, so dragging stays on the
 * compositor.
 * -------------------------------------------------------------------------- */

export function BeforeAfter({ item }: { item: WorkItem }) {
  const [value, setValue] = useState(55);
  const frameRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const setFromClientX = useCallback((clientX: number) => {
    const el = frameRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const pct = ((clientX - r.left) / r.width) * 100;
    setValue(Math.max(0, Math.min(100, pct)));
  }, []);

  return (
    <figure className="relative">
      <div
        ref={frameRef}
        className="relative select-none overflow-hidden bg-ink-panel"
        style={{ aspectRatio: '4 / 5' }}
        onPointerDown={(e) => {
          dragging.current = true;
          (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
          setFromClientX(e.clientX);
        }}
        onPointerMove={(e) => dragging.current && setFromClientX(e.clientX)}
        onPointerUp={() => (dragging.current = false)}
        onPointerCancel={() => (dragging.current = false)}
      >
        {/* After — the full frame */}
        <Plate
          src={item.image}
          alt={item.alt}
          aspect="fill"
          variant="detail"
          seed={Number(item.id.replace(/\D/g, '')) * 9}
          className="absolute inset-0 h-full w-full"
          bare
        />

        {/* Before — clipped to the left of the divider */}
        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 ${100 - value}% 0 0)` }}
        >
          <Plate
            src={item.beforeImage ?? null}
            alt={item.beforeAlt ?? 'Before the cut'}
            aspect="fill"
            variant="scene"
            seed={Number(item.id.replace(/\D/g, '')) * 9 + 41}
            className="h-full w-full"
            bare
          />
          <span className="label-sm absolute left-4 top-4 bg-ink/70 px-2 py-1.5 text-bone">
            Before
          </span>
        </div>

        <span className="label-sm absolute right-4 top-4 bg-ember px-2 py-1.5 text-ink">
          After
        </span>

        {/* Divider */}
        <div
          className="pointer-events-none absolute inset-y-0 w-px bg-bone"
          style={{ left: `${value}%` }}
        >
          <span className="absolute top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-bone bg-ink/80 backdrop-blur">
            <svg width="16" height="10" viewBox="0 0 16 10" fill="none" aria-hidden="true">
              <path
                d="M5 1L1 5l4 4M11 1l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.3"
                className="text-bone"
              />
            </svg>
          </span>
        </div>

        <input
          type="range"
          min={0}
          max={100}
          value={Math.round(value)}
          onChange={(e) => setValue(Number(e.target.value))}
          aria-label={`Reveal the finished cut: ${item.title}`}
          className="absolute inset-x-0 bottom-0 h-14 w-full cursor-ew-resize opacity-0"
        />
      </div>

      <figcaption className="mt-3 flex items-baseline justify-between gap-4 border-t border-ink-line pt-3">
        <span className="display-sm text-bone">{item.title}</span>
        <span className="label-sm text-steel">Drag to compare</span>
      </figcaption>
    </figure>
  );
}

'use client';

import { useReducedMotion, useTransform, type MotionValue } from 'motion/react';

/* ----------------------------------------------------------------------------
 * Scroll-linked parallax that respects prefers-reduced-motion without ever
 * changing the shape of the render tree.
 *
 * The `style` prop is always present and always a MotionValue; only the output
 * range changes. Both ranges start at the same value, so the server HTML and
 * the first client frame are identical and there is no hydration mismatch — the
 * trap that branching on useReducedMotion() falls into.
 * -------------------------------------------------------------------------- */

export function useParallax(
  progress: MotionValue<number>,
  from: string,
  to: string,
) {
  const reduce = useReducedMotion();
  return useTransform(progress, [0, 1], reduce ? [from, from] : [from, to]);
}

/** Numeric variant, for opacity and scale. */
export function useParallaxValue(
  progress: MotionValue<number>,
  input: number[],
  output: number[],
  reducedValue?: number,
) {
  const reduce = useReducedMotion();
  const flat = output.map(() => reducedValue ?? output[0]);
  return useTransform(progress, input, reduce ? flat : output);
}

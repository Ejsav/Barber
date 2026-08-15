'use client';

import { MotionConfig } from 'motion/react';

/* ----------------------------------------------------------------------------
 * One global motion policy.
 *
 * `reducedMotion="user"` makes Motion drop transform and layout animations for
 * anyone whose OS asks for reduced motion, while keeping opacity so content
 * still resolves rather than snapping. Handling it here — rather than
 * branching component trees on useReducedMotion() — keeps the server and
 * client markup identical, which matters: a mismatched branch can leave the
 * server's `opacity: 0` stranded on the element and hide the content for good.
 *
 * Scroll-linked parallax is the one thing this cannot cover, because those are
 * bound MotionValues rather than animations. Those components collapse their
 * own output range to zero under reduced motion.
 * -------------------------------------------------------------------------- */

export function MotionRoot({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={{ ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </MotionConfig>
  );
}

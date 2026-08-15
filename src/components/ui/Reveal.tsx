'use client';

import { motion, type Variants } from 'motion/react';
import type { ReactNode, ElementType } from 'react';

/* ----------------------------------------------------------------------------
 * Entrance motion primitives.
 *
 * Three shapes, used consistently across the site so the whole page feels
 * authored by one hand:
 *
 *   <Reveal>      — content rises and fades in as it enters the viewport
 *   <RevealLines> — display type wipes up line by line from behind a mask
 *   <Stagger>     — a container whose <StaggerItem> children arrive in sequence
 *
 * TWO RULES THESE COMPONENTS EXIST TO ENFORCE:
 *
 * 1. The viewport trigger goes on an element that is NOT clipped by an
 *    ancestor. A masked line reveal starts translated fully outside its
 *    `overflow: hidden` wrapper, so an IntersectionObserver on the moving
 *    element itself reports zero intersection forever and the text never
 *    arrives. The trigger therefore lives on the heading; the children animate
 *    off it via variants.
 *
 * 2. The element tree never branches on `useReducedMotion()`. That hook is
 *    null during SSR, so branching renders a motion element on the server and
 *    a plain one on the client — and the server's `style="opacity:0"` can
 *    survive hydration, leaving content permanently invisible for exactly the
 *    users who can least afford it. Reduced motion is handled once, globally,
 *    by <MotionConfig reducedMotion="user"> in MotionRoot: transforms are
 *    dropped, opacity is kept, the markup is identical either way.
 *
 * Every animated element also carries `data-reveal`. Motion serialises its
 * `initial` state into the server HTML as an inline `opacity: 0`, so without
 * JavaScript the whole page below the hero would render invisible. A
 * <noscript> rule in the root layout targets that attribute and forces the
 * finished state — the content is in the HTML either way, and this makes sure
 * it is actually seen.
 * -------------------------------------------------------------------------- */

const EASE = [0.16, 1, 0.3, 1] as const;

export function Reveal({
  children,
  delay = 0,
  y = 28,
  duration = 0.9,
  className,
  as = 'div',
  once = true,
  amount = 0.25,
  id,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  duration?: number;
  className?: string;
  as?: ElementType;
  once?: boolean;
  amount?: number;
  id?: string;
}) {
  const MotionTag = motion[as as 'div'] ?? motion.div;

  return (
    <MotionTag
      id={id}
      data-reveal=""
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </MotionTag>
  );
}

const lineParent: Variants = {
  hidden: {},
  show: {},
};

/**
 * Masked line reveal for display type.
 *
 * Lines are passed pre-split — deliberate line breaks are an art-direction
 * decision, not something to hand to a text-splitting library at runtime.
 */
export function RevealLines({
  lines,
  className,
  lineClassName,
  delay = 0,
  stagger = 0.085,
  as = 'h2',
  once = true,
  amount = 0.2,
  id,
}: {
  lines: ReactNode[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  stagger?: number;
  as?: ElementType;
  once?: boolean;
  amount?: number;
  /** So the heading can be the target of aria-labelledby. */
  id?: string;
}) {
  const MotionTag = motion[as as 'h2'] ?? motion.h2;

  return (
    <MotionTag
      id={id}
      className={className}
      variants={lineParent}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
    >
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.06em]">
          <motion.span
            data-reveal=""
            className={`block will-change-transform ${lineClassName ?? ''}`}
            variants={{ hidden: { y: '108%' }, show: { y: '0%' } }}
            transition={{
              duration: 1.05,
              delay: delay + i * stagger,
              ease: EASE,
            }}
          >
            {line}
            {/* Keeps words apart in the accessible name and in copied text —
                block-level lines otherwise concatenate into "askswho". The
                trailing space collapses at the end of a line box, so it costs
                nothing visually. */}
            {i < lines.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}

/**
 * Single masked line — same trigger discipline as RevealLines, for one-off
 * headlines that are not part of a multi-line block.
 */
export function RevealLine({
  children,
  className,
  lineClassName,
  delay = 0,
  as = 'h2',
  id,
}: {
  children: ReactNode;
  className?: string;
  lineClassName?: string;
  delay?: number;
  as?: ElementType;
  id?: string;
}) {
  return (
    <RevealLines
      id={id}
      as={as}
      lines={[children]}
      className={className}
      lineClassName={lineClassName}
      delay={delay}
      amount={0.4}
    />
  );
}

const staggerParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const staggerChild: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: EASE } },
};

export function Stagger({
  children,
  className,
  amount = 0.15,
  as = 'div',
}: {
  children: ReactNode;
  className?: string;
  amount?: number;
  as?: ElementType;
}) {
  const MotionTag = motion[as as 'div'] ?? motion.div;

  return (
    <MotionTag
      className={className}
      variants={staggerParent}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
    >
      {children}
    </MotionTag>
  );
}

export function StaggerItem({
  children,
  className,
  as = 'div',
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}) {
  const MotionTag = motion[as as 'div'] ?? motion.div;

  return (
    <MotionTag data-reveal="" className={className} variants={staggerChild}>
      {children}
    </MotionTag>
  );
}

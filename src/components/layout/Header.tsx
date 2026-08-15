'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

import { Wordmark } from '@/components/ui/Wordmark';
import { useBooking } from '@/components/booking/BookingProvider';
import { lockScroll } from '@/components/layout/SmoothScroll';
import { business, directionsUrl } from '@/data/business';
import { priceFloor } from '@/data/services';
import { NAV } from '@/data/nav';
import { cn } from '@/lib/cn';

export function Header() {
  const pathname = usePathname();
  const { open } = useBooking();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  /* Solid chrome once the hero is behind us. rAF-throttled, passive. */
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 24);
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Close the menu on navigation. Adjusting state during render — rather than
   * in an effect — is the supported pattern for "reset when a prop changes",
   * and avoids the extra commit an effect would cost on every route change. */
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMenuOpen(false);
  }

  useEffect(() => {
    lockScroll(menuOpen);
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-[100] transition-[background-color,border-color,backdrop-filter] duration-500',
          scrolled || menuOpen
            ? 'border-b border-ink-line bg-ink/85 backdrop-blur-xl'
            : 'border-b border-transparent bg-transparent',
        )}
        style={{ height: 'var(--header-h)' }}
      >
        {/* Scrim for the transparent state: the hero plate is bright behind the
            right-hand controls, and the phone number has to stay readable. */}
        <div
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute inset-x-0 top-0 h-[200%] bg-gradient-to-b from-ink/85 via-ink/45 to-transparent transition-opacity duration-500',
            scrolled || menuOpen ? 'opacity-0' : 'opacity-100',
          )}
        />
        <div className="shell relative flex h-full items-center justify-between gap-6">
          <Link
            href="/"
            className="group relative -ml-1 flex items-center px-1 py-2"
            aria-label={`${business.name} — home`}
          >
            <Wordmark className="text-[1.35rem] lg:text-[1.6rem]" />
          </Link>

          <nav
            className="hidden items-center gap-8 lg:flex"
            aria-label="Primary"
          >
            {NAV.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'label group h-8 leading-8 transition-colors',
                    active ? 'text-ember' : 'text-steel-light hover:text-bone',
                  )}
                >
                  <span className="roll">
                    <span data-text={item.label}>{item.label}</span>
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={business.phoneHref}
              className="label hidden text-steel-light transition-colors hover:text-bone xl:inline-block"
            >
              {business.phone}
            </a>
            <button
              type="button"
              onClick={() => open()}
              className="label hidden h-11 items-center bg-ember px-6 text-ink transition-colors hover:bg-ember-deep hover:text-bone lg:inline-flex"
            >
              Book
            </button>

            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="-mr-2 flex h-12 w-12 flex-col items-center justify-center gap-[5px] lg:hidden"
            >
              <span className="sr-only">{menuOpen ? 'Close menu' : 'Open menu'}</span>
              <span
                className={cn(
                  'block h-px w-6 bg-bone transition-transform duration-400 ease-[var(--ease-out-expo)]',
                  menuOpen && 'translate-y-[3px] rotate-45',
                )}
              />
              <span
                className={cn(
                  'block h-px w-6 bg-bone transition-transform duration-400 ease-[var(--ease-out-expo)]',
                  menuOpen && '-translate-y-[3px] -rotate-45',
                )}
              />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}

/* -------------------------------------------------------------------------- */

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { open: openBooking } = useBooking();
  const reduce = useReducedMotion();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-menu"
          className="fixed inset-0 z-[95] flex flex-col bg-ink lg:hidden"
          initial={reduce ? { opacity: 0 } : { clipPath: 'inset(0 0 100% 0)' }}
          animate={reduce ? { opacity: 1 } : { clipPath: 'inset(0 0 0% 0)' }}
          exit={reduce ? { opacity: 0 } : { clipPath: 'inset(0 0 100% 0)' }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Screened field so the menu is a designed surface, not a black sheet */}
          <div
            aria-hidden="true"
            className="screen-dots-coarse pointer-events-none absolute inset-0 text-bone opacity-[0.06]"
            style={{
              maskImage:
                'radial-gradient(120% 80% at 100% 0%, #000 0%, transparent 70%)',
              WebkitMaskImage:
                'radial-gradient(120% 80% at 100% 0%, #000 0%, transparent 70%)',
            }}
          />

          <div
            /* Bottom-weighted rather than centred: every target lands in
               thumb reach, and the empty upper third reads as deliberate. */
            className="relative flex flex-1 flex-col justify-end gutter pb-10"
            style={{ paddingTop: 'var(--header-h)' }}
          >
            <nav aria-label="Mobile">
              <ul>
                {NAV.map((item, i) => (
                  <li key={item.href} className="overflow-hidden">
                    <motion.div
                      initial={reduce ? undefined : { y: '105%' }}
                      animate={reduce ? undefined : { y: 0 }}
                      transition={{
                        duration: 0.75,
                        delay: 0.16 + i * 0.06,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    >
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className="group flex items-baseline gap-4 border-b border-ink-line py-4"
                      >
                        <span className="label-sm w-6 shrink-0 text-steel-dark">
                          {item.index}
                        </span>
                        <span className="display-lg text-bone transition-colors group-active:text-ember">
                          {item.label}
                        </span>
                      </Link>
                    </motion.div>
                  </li>
                ))}
              </ul>
            </nav>

            <motion.div
              className="mt-8 flex flex-col gap-3"
              initial={reduce ? undefined : { opacity: 0, y: 16 }}
              animate={reduce ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
            >
              <button
                type="button"
                onClick={() => {
                  onClose();
                  openBooking();
                }}
                className="label flex h-16 items-center justify-center bg-ember text-ink"
              >
                Book your chair — from ${priceFloor}
              </button>
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={business.phoneHref}
                  className="label flex h-14 items-center justify-center border border-ink-line text-bone"
                >
                  Call
                </a>
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="label flex h-14 items-center justify-center border border-ink-line text-bone"
                >
                  Directions
                </a>
              </div>
              <p className="label-sm mt-2 text-steel">
                {business.address.street} · {business.locality}
              </p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

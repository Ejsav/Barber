import Link from 'next/link';

import { BookButton } from '@/components/ui/BookButton';
import { NAV } from '@/data/nav';
import { business } from '@/data/business';

export const metadata = {
  title: 'Page not found',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="relative isolate flex min-h-[80svh] flex-col justify-center overflow-hidden bg-ink">
      <div
        aria-hidden="true"
        className="screen-dots-coarse pointer-events-none absolute inset-0 text-bone opacity-[0.08]"
        style={{
          maskImage: 'radial-gradient(70% 60% at 70% 30%, #000, transparent 75%)',
          WebkitMaskImage:
            'radial-gradient(70% 60% at 70% 30%, #000, transparent 75%)',
        }}
      />

      <div
        className="shell relative"
        style={{ paddingTop: 'calc(var(--header-h) + 3rem)' }}
      >
        <p className="label text-ember">404</p>
        <h1 className="display-xl mt-6 max-w-4xl text-bone">
          Nothing here. Grown out and cut off.
        </h1>
        <p className="body-lg mt-7 max-w-lg text-bone/70">
          The page you were after does not exist. The shop is still on{' '}
          {business.address.street} and the chairs are still open.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
          <BookButton size="lg" className="w-full sm:w-auto" />
          <Link
            href="/"
            className="label flex h-14 items-center justify-center border border-ink-line px-6 text-bone transition-colors hover:border-bone"
          >
            Back to the homepage
          </Link>
        </div>

        <nav className="mt-16 border-t border-ink-line pt-8" aria-label="Site sections">
          <ul className="grid gap-px bg-ink-line sm:grid-cols-2 lg:grid-cols-4">
            {NAV.map((item) => (
              <li key={item.href} className="bg-ink">
                <Link
                  href={item.href}
                  className="group flex items-baseline gap-3 py-5 pr-5 sm:px-5 sm:first:pl-0"
                >
                  <span className="label-sm text-steel-dark">{item.index}</span>
                  <span className="display-sm text-bone transition-colors group-hover:text-ember">
                    {item.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}

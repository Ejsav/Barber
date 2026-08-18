'use client';

import { useState } from 'react';
import { RevealLines, Reveal } from '@/components/ui/Reveal';
import { business } from '@/data/business';
import { isDev } from '@/lib/content';
import { cn } from '@/lib/cn';

/* ============================================================================
 * FIRST-VISIT CAPTURE
 * ----------------------------------------------------------------------------
 * ⚠️  NOT CONNECTED TO ANYTHING. ⚠️
 *
 * `handleSubmit` deliberately does not POST. It is the single seam where a CRM
 * goes in — Klaviyo, Mailchimp, HubSpot, GoHighLevel, Square, Boulevard,
 * Booksy or Fresha — via a route handler at /api/subscribe. Until that exists
 * the form says plainly that nothing was sent, and points at the phone number.
 *
 * ⚠️  CONSENT COPY  ⚠️
 * The checkbox label below states in plain language what the visitor is
 * agreeing to. It is NOT legal wording. Before collecting a single address or
 * phone number, the operator must supply consent language that satisfies their
 * jurisdiction and channels — TCPA/A2P 10DLC for SMS in the US, CAN-SPAM for
 * email, plus any Connecticut state requirements — along with a privacy policy
 * URL. Do not invent that text.
 * ========================================================================== */

type Status = 'idle' | 'submitting' | 'demo';

export function FirstVisit() {
  const [status, setStatus] = useState<Status>('idle');
  const [consent, setConsent] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');

    /* ---- CRM INTEGRATION POINT -------------------------------------------
     * const data = Object.fromEntries(new FormData(e.currentTarget));
     * await fetch('/api/subscribe', {
     *   method: 'POST',
     *   headers: { 'Content-Type': 'application/json' },
     *   body: JSON.stringify(data),
     * });
     * -------------------------------------------------------------------- */

    // Nothing leaves the browser. Short delay so the state change is legible.
    await new Promise((r) => setTimeout(r, 450));
    setStatus('demo');
  }

  return (
    <section
      className="on-bone relative overflow-hidden bg-ember text-ink"
      aria-labelledby="first-visit-heading"
    >
      {/* Screened field so the accent block has texture rather than flat fill */}
      <div
        aria-hidden="true"
        className="screen-dots-coarse pointer-events-none absolute inset-0 text-ink opacity-[0.13]"
        style={{
          maskImage: 'linear-gradient(135deg, #000 0%, transparent 65%)',
          WebkitMaskImage: 'linear-gradient(135deg, #000 0%, transparent 65%)',
        }}
      />

      <div className="shell relative py-20 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <div className="flex items-baseline gap-4 border-b border-ink/40 pb-4">
              <span className="label-sm text-ink">07</span>
              <span className="label text-ink">First visit</span>
            </div>

            <RevealLines
              as="h2"
              id="first-visit-heading"
              lines={['First cut?', 'Take $10 off.']}
              className="display-xl mt-8 text-ink lg:mt-12"
            />

            <Reveal delay={0.12}>
              <p className="body-lg mt-6 max-w-md text-ink">
                New to the shop. One-time, on any service over $30. We will send
                the code, then leave you alone until you want us.
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-5 lg:col-start-8">
            {status === 'demo' ? (
              <DemoResult onReset={() => setStatus('idle')} />
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <Field
                  id="fv-name"
                  name="firstName"
                  label="First name"
                  autoComplete="given-name"
                  required
                />
                <Field
                  id="fv-email"
                  name="email"
                  type="email"
                  label="Email"
                  autoComplete="email"
                  required
                />
                <Field
                  id="fv-phone"
                  name="phone"
                  type="tel"
                  label="Phone"
                  autoComplete="tel"
                  hint="Only if you want appointment reminders by text."
                />

                <label className="flex cursor-pointer items-start gap-3 pt-1">
                  <input
                    type="checkbox"
                    name="consent"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    required
                    className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer appearance-none border border-ink bg-transparent checked:bg-ink checked:after:block checked:after:pl-[3px] checked:after:text-[0.8rem] checked:after:leading-[1.05rem] checked:after:text-ember checked:after:content-['✓']"
                  />
                  <span className="text-[0.8125rem] leading-relaxed text-ink">
                    Email me the code and occasional shop news. I can
                    unsubscribe at any time.
                  </span>
                </label>

                {isDev && (
                  <p className="border border-dashed border-ink/40 p-3 text-[0.6875rem] leading-relaxed text-ink">
                    <strong>Developer note:</strong> this wording is plain
                    English, not legal consent copy. Supply jurisdiction-correct
                    email and SMS consent language and a privacy-policy link
                    before collecting anything. The form does not submit.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="label h-16 bg-ink text-bone transition-colors hover:bg-ink-panel disabled:opacity-60"
                >
                  {status === 'submitting' ? 'One moment…' : 'Claim it'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  id,
  name,
  label,
  type = 'text',
  hint,
  required,
  autoComplete,
}: {
  id: string;
  name: string;
  label: string;
  type?: string;
  hint?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="label block text-ink">
        {label}
        {!required && <span className="ml-2 text-ink">Optional</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        aria-describedby={hint ? `${id}-hint` : undefined}
        className={cn(
          'mt-2 h-14 w-full border-b border-ink/50 bg-transparent px-0 text-lg text-ink',
          'placeholder:text-ink focus:border-ink focus:outline-none',
          'transition-colors',
        )}
      />
      {hint && (
        <p id={`${id}-hint`} className="mt-2 text-xs text-ink">
          {hint}
        </p>
      )}
    </div>
  );
}

function DemoResult({ onReset }: { onReset: () => void }) {
  return (
    <div className="border border-ink/30 bg-ink p-6 text-bone lg:p-8">
      <p className="label text-ember">Nothing was sent</p>
      <h3 className="display-md mt-3 text-bone">This form is a demo</h3>
      <p className="mt-4 text-[0.9375rem] leading-relaxed text-steel-light">
        No details left your browser and no list received them. The form is
        wired to a single integration point so a CRM can be connected without
        touching the design.
      </p>
      <p className="mt-4 text-[0.9375rem] leading-relaxed text-steel-light">
        To actually book, call{' '}
        <a href={business.phoneHref} className="link-draw text-bone">
          {business.phone}
        </a>{' '}
        or use the BOOK button anywhere on this page.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="label mt-6 border border-ink-line px-5 py-3 text-bone transition-colors hover:border-bone"
      >
        Back to the form
      </button>
    </div>
  );
}

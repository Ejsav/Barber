import { ImageResponse } from 'next/og';
import { business } from '@/data/business';

export const alt = `${business.name} — ${business.descriptor}, ${business.locality}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/* ----------------------------------------------------------------------------
 * Social card, generated at build time. Uses the same ink/bone/ember palette
 * and the dot screen, so a shared link looks like the site rather than a
 * generic preview. No external fonts are fetched — Satori's built-in stack
 * keeps this dependency-free and fast.
 * -------------------------------------------------------------------------- */

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#0b0a09',
          padding: '64px 72px',
          position: 'relative',
        }}
      >
        {/* Dot screen resolving from the right */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'radial-gradient(#ece5d9 1.4px, transparent 1.6px)',
            backgroundSize: '10px 10px',
            opacity: 0.13,
            maskImage: 'linear-gradient(100deg, transparent 35%, #000 100%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(70% 60% at 85% 30%, rgba(226,81,43,0.28), transparent 70%)',
          }}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span
            style={{
              fontSize: 22,
              letterSpacing: 6,
              color: '#8b857c',
              textTransform: 'uppercase',
            }}
          >
            {business.locality}
          </span>
          <span
            style={{
              fontSize: 22,
              letterSpacing: 6,
              color: '#8b857c',
              textTransform: 'uppercase',
            }}
          >
            Est. {business.founded}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span
            style={{
              fontSize: 132,
              lineHeight: 0.9,
              color: '#ece5d9',
              fontWeight: 800,
              letterSpacing: -4,
              textTransform: 'uppercase',
            }}
          >
            Nobody asks who
          </span>
          <span
            style={{
              fontSize: 132,
              lineHeight: 0.9,
              color: '#ece5d9',
              fontWeight: 800,
              letterSpacing: -4,
              textTransform: 'uppercase',
            }}
          >
            cut it when it&rsquo;s bad.
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            borderTop: '1px solid #2b2724',
            paddingTop: 28,
          }}
        >
          <span
            style={{
              fontSize: 44,
              color: '#ece5d9',
              fontWeight: 700,
              letterSpacing: -1,
              textTransform: 'uppercase',
            }}
          >
            {business.wordmark.first}
            <span style={{ color: '#8b857c' }}>{business.wordmark.second}</span>
          </span>
          <span style={{ fontSize: 24, color: '#e2512b', letterSpacing: 4 }}>
            {business.address.street.toUpperCase()}
          </span>
        </div>
      </div>
    ),
    size,
  );
}

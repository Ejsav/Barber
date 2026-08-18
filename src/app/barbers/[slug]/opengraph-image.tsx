import { ImageResponse } from 'next/og';
import { barbers, getBarber, specialtyLabels } from '@/data/barbers';
import { business } from '@/data/business';

export const alt = 'Barber profile';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export function generateStaticParams() {
  return barbers.map((b) => ({ slug: b.slug }));
}

/* ----------------------------------------------------------------------------
 * Shareable barber card.
 *
 * The point of a per-barber profile is that a customer can text it to a friend
 * — "this is who cuts my hair". A generic shop card in the preview wastes that
 * entirely, so each profile gets its own: the barber's name at display size,
 * their specialities, the shop and the city.
 *
 * Same palette, same dot screen and same type hierarchy as the site, and no
 * external font is fetched, so the card renders at build time with no network
 * call and no runtime cost.
 * -------------------------------------------------------------------------- */

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const barber = getBarber(slug);

  const name = barber?.name ?? business.name;
  const role = barber?.role ?? business.descriptor;
  const specialties = barber
    ? barber.specialties.map((s) => specialtyLabels[s]).join('  ·  ')
    : '';

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
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(#ece5d9 1.4px, transparent 1.6px)',
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
            {role}
          </span>
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
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span
            style={{
              fontSize: 148,
              lineHeight: 0.88,
              color: '#ece5d9',
              fontWeight: 800,
              letterSpacing: -5,
              textTransform: 'uppercase',
            }}
          >
            {name}
          </span>
          {specialties && (
            <span
              style={{
                marginTop: 28,
                fontSize: 30,
                color: '#a8a29a',
                letterSpacing: 1,
              }}
            >
              {specialties}
            </span>
          )}
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
            BOOK ONLINE
          </span>
        </div>
      </div>
    ),
    size,
  );
}

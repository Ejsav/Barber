import { Hero } from '@/components/sections/Hero';
import { TrustStrip } from '@/components/sections/TrustStrip';
import { ServiceSelector } from '@/components/sections/ServiceSelector';
import { WorkRail } from '@/components/sections/WorkRail';
import { BarberSelection } from '@/components/sections/BarberSelection';
import { Manifesto } from '@/components/sections/Manifesto';
import { Reviews } from '@/components/sections/Reviews';
import { FirstVisit } from '@/components/sections/FirstVisit';
import { ShopExperience } from '@/components/sections/ShopExperience';
import { LocationSection } from '@/components/sections/LocationSection';
import { FinalCta } from '@/components/sections/FinalCta';

import { pageMetadata } from '@/lib/seo';
import { business } from '@/data/business';
import { barbers } from '@/data/barbers';
import { priceFloor } from '@/data/services';

export const metadata = pageMetadata({
  title: `${business.name} — Barbershop in ${business.locality}`,
  description: `Precision barbering on ${business.address.street}, ${business.locality}. Skin fades, scissor work, beard sculpting and straight-razor shaves. ${barbers.length} barbers, book by name from $${priceFloor}.`,
  path: '/',
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <ServiceSelector />
      <WorkRail />
      <BarberSelection />
      <Manifesto />
      <Reviews />
      <FirstVisit />
      <ShopExperience />
      <LocationSection />
      <FinalCta />
    </>
  );
}

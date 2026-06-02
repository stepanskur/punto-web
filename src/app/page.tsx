import { BannerCarousel } from '@/components/home/BannerCarousel';
import { FlightSearchWidget } from '@/components/home/FlightSearchWidget';
import { NewsSection } from '@/components/home/NewsSection';

export default function Home() {
  return (
    <>
      <BannerCarousel />
      <FlightSearchWidget />
      <NewsSection />
    </>
  );
}

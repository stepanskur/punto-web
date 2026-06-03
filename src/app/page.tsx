import { BannerCarousel } from '@/components/home/BannerCarousel';
import { FlightSearchWidget } from '@/components/home/FlightSearchWidget';
import { NewsSection } from '@/components/home/NewsSection';
import { Suspense } from 'react';

export default function Home() {
  return (
    <>
      <BannerCarousel />
      <Suspense fallback={<div className="h-[200px]" />}>
        <FlightSearchWidget />
      </Suspense>
      <NewsSection />
    </>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import Link from 'next/link';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

interface Banner {
  id: string;
  imageUrl: string;
  linkUrl: string;
  title: string;
}

export const BannerCarousel = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/banners')
      .then(res => res.json())
      .then(data => {
        setBanners(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load banners', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section className="relative w-full h-[350px] bg-brand-red animate-pulse flex items-center justify-center">
        <div className="text-white opacity-50">Loading banners...</div>
      </section>
    );
  }

  if (banners.length === 0) {
    return (
      <section className="relative bg-brand-red pt-24 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-bold font-heading text-white mb-6 tracking-tight">
            Simply. Fly.
          </h1>
          <p className="text-xl md:text-2xl text-white/90 font-body max-w-2xl mx-auto font-medium">
            Connect the points, fly the world.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full h-[350px] md:h-[450px] bg-neutral-black">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={banners.length > 1}
        className="w-full h-full"
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id}>
            <Link href={banner.linkUrl} className="block w-full h-full relative group">
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
                style={{ backgroundImage: `url(${banner.imageUrl})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-24 md:bottom-32 left-0 right-0 p-8 md:p-16 max-w-7xl mx-auto">
                <h2 className="text-4xl md:text-6xl font-bold font-heading text-white mb-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                  {banner.title}
                </h2>
                <span className="inline-block bg-brand-red text-white px-6 py-2 rounded font-ui font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                  Explore Now
                </span>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
      
      <style jsx global>{`
        .swiper-pagination {
          display: flex;
          justify-content: center;
          gap: 8px;
          bottom: 100px !important;
          z-index: 20;
        }
        .swiper-pagination-bullet {
          width: 48px !important;
          height: 4px !important;
          border-radius: 2px !important;
          background: rgba(255, 255, 255, 0.3) !important;
          opacity: 1 !important;
          margin: 0 !important;
          position: relative;
          overflow: hidden;
        }
        .swiper-pagination-bullet-active::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: 100%;
          background: #e93d3d;
          animation: fillProgress 5s linear forwards;
        }
        @keyframes fillProgress {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </section>
  );
};

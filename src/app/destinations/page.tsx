'use client';

import { useTranslation } from '@/lib/i18n';
import { RouteMap } from '@/components/destinations/RouteMap';

export default function DestinationsPage() {
  const { t } = useTranslation();

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl md:text-5xl font-bold font-heading text-brand-red mb-4">{t('Hubs & Destinations')}</h1>
        <p className="text-xl text-neutral-gray font-body mb-8">{t('Connecting Russia and Europe through our primary hubs.')}</p>
        
        <div className="mb-16">
          <RouteMap />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          <div className="bg-neutral-light/5 rounded-3xl p-10 border border-neutral-light/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 text-brand-red opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="font-heading text-8xl">SVO</span>
            </div>
            <h2 className="text-3xl font-bold font-heading text-neutral-black mb-4">{t('Moscow Sheremetyevo (SVO)')}</h2>
            <p className="font-body text-neutral-gray mb-6">
              {t('Our primary hub located in the heart of Russia. Offering seamless connections to domestic destinations across the country and the CIS region.')}
            </p>
            <ul className="font-ui text-sm space-y-2 text-neutral-black">
              <li>✓ {t('Fast Track Security')}</li>
              <li>✓ {t('Premium Lounges')}</li>
              <li>✓ {t('Direct connection to Belorusskiy Station')}</li>
            </ul>
          </div>

          <div className="bg-brand-red/5 rounded-3xl p-10 border border-brand-red/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 text-brand-red opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="font-heading text-8xl">ZRH</span>
            </div>
            <h2 className="text-3xl font-bold font-heading text-brand-red mb-4">{t('Zurich (ZRH)')}</h2>
            <p className="font-body text-neutral-gray mb-6">
              {t('Our newest European gateway. Connect through Switzerland to major European capitals with our partners, enjoying the renowned Swiss efficiency.')}
            </p>
            <ul className="font-ui text-sm space-y-2 text-neutral-black">
              <li>✓ {t('Gateway to Europe')}</li>
              <li>✓ {t('Business Class Service')}</li>
              <li>✓ {t('Priority Transfer')}</li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}

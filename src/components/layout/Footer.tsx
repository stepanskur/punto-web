import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { useTranslation } from '@/lib/i18n';

export const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="bg-neutral-black text-white py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Logo width={126} height={24} />
            <p className="mt-4 text-sm text-neutral-light font-body">
              {t('Connect the points, fly the world.')} <br />
              {t('Dynamic modern airline serving Russia and Europe.')}
            </p>
          </div>
          <div>
            <h4 className="font-ui font-semibold mb-4 text-lg">{t('Quick Links')}</h4>
            <ul className="space-y-2 text-sm text-neutral-light font-body">
              <li><Link href="/fares" className="hover:text-brand-red transition-colors">{t('Fares & Classes')}</Link></li>
              <li><Link href="/destinations" className="hover:text-brand-red transition-colors">{t('Hubs & Destinations')}</Link></li>
              <li><Link href="/fleet" className="hover:text-brand-red transition-colors">{t('Our Fleet')}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-ui font-semibold mb-4 text-lg">{t('Company')}</h4>
            <ul className="space-y-2 text-sm text-neutral-light font-body">
              <li><Link href="/about" className="hover:text-brand-red transition-colors">{t('About Us')}</Link></li>
              <li><Link href="/news" className="hover:text-brand-red transition-colors">{t('News & Media')}</Link></li>
              <li><Link href="/contact" className="hover:text-brand-red transition-colors">{t('Contact Us')}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-ui font-semibold mb-4 text-lg">{t('Legal')}</h4>
            <ul className="space-y-2 text-sm text-neutral-light font-body">
              <li><Link href="/legal#terms" className="hover:text-brand-red transition-colors">{t('Terms & Conditions')}</Link></li>
              <li><Link href="/legal#privacy" className="hover:text-brand-red transition-colors">{t('Privacy Policy')}</Link></li>
              <li><Link href="/legal#carriage" className="hover:text-brand-red transition-colors">{t('Conditions of Carriage')}</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-neutral-gray text-center text-sm text-neutral-light font-body">
          &copy; {new Date().getFullYear()} {t('punto.fly Airlines. All rights reserved.')}
        </div>
      </div>
    </footer>
  );
};

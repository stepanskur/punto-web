'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';
import { useState, useEffect, useRef } from 'react';
import { Globe } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

export const Header = () => {
  const pathname = usePathname();
  const isSearchPage = pathname === '/search';
  const { t, lang: defaultLang } = useTranslation();
  const [lang, setLang] = useState(defaultLang);
  const [currency, setCurrency] = useState('USD');
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedLang = localStorage.getItem('punto_lang') || 'EN';
      const storedCur = localStorage.getItem('punto_currency') || 'USD';
      setLang(storedLang);
      setCurrency(storedCur);
      
      const handleLang = () => setLang(localStorage.getItem('punto_lang') || 'EN');
      window.addEventListener('lang-change', handleLang);
      
      const handleClickOutside = (e: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
          setIsOpen(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      
      return () => {
        window.removeEventListener('lang-change', handleLang);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, []);

  const handleLangChange = (newLang: string) => {
    setLang(newLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('punto_lang', newLang);
      window.dispatchEvent(new Event('lang-change'));
    }
  };

  const handleCurrencyChange = (newCur: string) => {
    setCurrency(newCur);
    if (typeof window !== 'undefined') {
      localStorage.setItem('punto_currency', newCur);
      window.dispatchEvent(new Event('currency-change'));
    }
  };

  const Selectors = () => (
    <div className="relative font-ui" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-neutral-gray hover:text-brand-red transition-colors p-2 rounded-full hover:bg-neutral-light/10"
      >
        <Globe className="w-5 h-5" />
        <span className="text-sm font-bold uppercase">{lang} / {currency}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-neutral-light/30 rounded-2xl shadow-xl p-4 z-50">
          <div className="mb-4">
            <div className="text-xs font-bold text-neutral-gray uppercase tracking-wider mb-2">Language</div>
            <div className="flex gap-2">
              <button onClick={() => handleLangChange('EN')} className={`flex-1 py-1 text-sm font-bold rounded-lg transition-colors ${lang === 'EN' ? 'bg-brand-red/10 text-brand-red' : 'text-neutral-gray hover:bg-neutral-light/20'}`}>EN</button>
              <button onClick={() => handleLangChange('RU')} className={`flex-1 py-1 text-sm font-bold rounded-lg transition-colors ${lang === 'RU' ? 'bg-brand-red/10 text-brand-red' : 'text-neutral-gray hover:bg-neutral-light/20'}`}>RU</button>
            </div>
          </div>
          <div>
            <div className="text-xs font-bold text-neutral-gray uppercase tracking-wider mb-2">Currency</div>
            <div className="grid grid-cols-3 gap-1">
              <button onClick={() => handleCurrencyChange('USD')} className={`py-1 text-sm font-bold rounded-lg transition-colors ${currency === 'USD' ? 'bg-brand-red/10 text-brand-red' : 'text-neutral-gray hover:bg-neutral-light/20'}`}>USD</button>
              <button onClick={() => handleCurrencyChange('EUR')} className={`py-1 text-sm font-bold rounded-lg transition-colors ${currency === 'EUR' ? 'bg-brand-red/10 text-brand-red' : 'text-neutral-gray hover:bg-neutral-light/20'}`}>EUR</button>
              <button onClick={() => handleCurrencyChange('RUB')} className={`py-1 text-sm font-bold rounded-lg transition-colors ${currency === 'RUB' ? 'bg-brand-red/10 text-brand-red' : 'text-neutral-gray hover:bg-neutral-light/20'}`}>RUB</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (isSearchPage) {
    return (
      <header className="bg-white border-b border-neutral-light/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Logo width={100} height={20} />
          </Link>
          <Selectors />
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white border-b border-neutral-light/30 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Logo />
        </Link>
        <nav className="hidden md:flex items-center gap-8 font-ui text-neutral-gray">
          <Link href="/fares" className="hover:text-brand-red transition-colors">{t('Fares & Classes')}</Link>
          <Link href="/destinations" className="hover:text-brand-red transition-colors">{t('Destinations')}</Link>
          <Link href="/news" className="hover:text-brand-red transition-colors">{t('News')}</Link>
          <Link href="/about" className="hover:text-brand-red transition-colors">{t('About Us')}</Link>
        </nav>
        <div className="flex items-center gap-4">
          <Selectors />
          <Button variant="primary">{t('Search your flight')}</Button>
        </div>
      </div>
    </header>
  );
};

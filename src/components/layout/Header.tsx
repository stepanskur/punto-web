'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';

export const Header = () => {
  const pathname = usePathname();
  const isSearchPage = pathname === '/search';

  if (isSearchPage) {
    return (
      <header className="bg-white border-b border-neutral-light/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <Logo width={100} height={20} />
          </Link>
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
          <Link href="/fares" className="hover:text-brand-red transition-colors">Fares & Classes</Link>
          <Link href="/destinations" className="hover:text-brand-red transition-colors">Destinations</Link>
          <Link href="/news" className="hover:text-brand-red transition-colors">News</Link>
          <Link href="/about" className="hover:text-brand-red transition-colors">About Us</Link>
        </nav>
        <div className="flex items-center gap-4">
          <Button variant="primary">Search your flight</Button>
        </div>
      </div>
    </header>
  );
};

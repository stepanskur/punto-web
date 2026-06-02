'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface NewsItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  content: string;
  createdAt: string;
}

export const NewsSection = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/news')
      .then(res => res.json())
      .then(data => {
        setNews(data.slice(0, 3)); // show latest 3
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading || news.length === 0) {
    return null; // hide section if no news
  }

  return (
    <section className="py-20 bg-neutral-light/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold font-heading text-neutral-black mb-2">Latest Updates</h2>
            <p className="text-neutral-gray font-body">Discover new destinations and services.</p>
          </div>
          <Link href="/news" className="text-brand-red font-ui font-medium hover:text-brand-red-hover transition-colors hidden md:block">
            View all news &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {news.map((item) => (
            <Link key={item.id} href={`/news/${item.id}`} className="bg-white rounded-xl shadow-sm border border-neutral-light/30 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all group flex flex-col h-full">
              <div className="h-48 bg-neutral-light/20 relative overflow-hidden">
                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-4 left-4">
                  <span className="inline-block px-3 py-1 bg-brand-red rounded-full text-xs font-bold font-ui text-white">
                    {item.category}
                  </span>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-bold font-heading text-neutral-black mb-3 group-hover:text-brand-red transition-colors">
                  {item.title}
                </h3>
                <p className="text-neutral-gray font-body text-sm flex-1 line-clamp-3">
                  {item.content.substring(0, 150)}...
                </p>
                <div className="mt-6 pt-4 border-t border-neutral-light/20 flex justify-between items-center">
                  <span className="text-neutral-gray text-xs">{new Date(item.createdAt).toLocaleDateString()}</span>
                  <span className="text-brand-red text-sm font-ui font-medium">Read more &rarr;</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

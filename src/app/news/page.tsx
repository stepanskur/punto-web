'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface NewsItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  content: string;
  createdAt: string;
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/news')
      .then(res => res.json())
      .then(data => {
        setNews(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen pt-24 pb-12 bg-neutral-light/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4">Latest News & Updates</h1>
        <p className="text-neutral-gray text-lg mb-12">Stay informed about our newest destinations, services, and special offers.</p>

        {loading ? (
          <div className="text-center py-20 text-neutral-gray">Loading news...</div>
        ) : news.length === 0 ? (
          <div className="text-center py-20 text-neutral-gray bg-white rounded-2xl border border-neutral-light/30">
            No news available at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {news.map((item) => (
              <Link key={item.id} href={`/news/${item.id}`} className="bg-white rounded-xl shadow-sm border border-neutral-light/30 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all group flex flex-col h-full">
                <div className="h-56 bg-neutral-light/20 relative overflow-hidden">
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
        )}
      </div>
    </main>
  );
}

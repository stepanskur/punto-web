'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useParams } from 'next/navigation';

interface NewsItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  content: string;
  createdAt: string;
}

export default function NewsArticlePage() {
  const { id } = useParams();
  const [article, setArticle] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch('/api/news')
      .then(res => res.json())
      .then((data: NewsItem[]) => {
        const found = data.find(item => item.id === id);
        setArticle(found || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen pt-32 pb-12 bg-neutral-light/5 flex justify-center">
        <div className="text-neutral-gray animate-pulse">Loading article...</div>
      </main>
    );
  }

  if (!article) {
    return (
      <main className="min-h-screen pt-32 pb-12 bg-neutral-light/5 text-center">
        <h1 className="text-4xl font-bold font-heading mb-4">Article Not Found</h1>
        <p className="text-neutral-gray mb-8">The news article you are looking for does not exist.</p>
        <Link href="/news" className="text-brand-red hover:underline font-bold">
          &larr; Back to News
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-24 pb-20 bg-neutral-light/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/news" className="inline-flex items-center text-neutral-gray hover:text-brand-red transition-colors font-medium mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to all news
        </Link>

        <article className="bg-white rounded-3xl shadow-sm border border-neutral-light/30 overflow-hidden">
          <div className="h-64 md:h-[400px] w-full relative">
            <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
            <div className="absolute top-6 left-6">
              <span className="px-4 py-2 bg-brand-red rounded-full text-sm font-bold font-ui text-white shadow-lg">
                {article.category}
              </span>
            </div>
          </div>
          
          <div className="p-8 md:p-12">
            <div className="text-sm text-neutral-gray mb-4 font-medium">
              Published on {new Date(article.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            
            <h1 className="text-3xl md:text-5xl font-bold font-heading text-neutral-black mb-8 leading-tight">
              {article.title}
            </h1>

            <div className="prose prose-lg prose-neutral max-w-none">
              <ReactMarkdown>{article.content}</ReactMarkdown>
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';
import Link from 'next/link';

interface Banner {
  id: string;
  imageUrl: string;
  linkUrl: string;
  title: string;
}

export default function AdminPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/banners')
      .then(res => res.json())
      .then(data => {
        setBanners(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleSave = async (updatedBanners: Banner[]) => {
    try {
      await fetch('/api/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedBanners),
      });
      setBanners(updatedBanners);
    } catch (err) {
      console.error(err);
      alert('Failed to save banners');
    }
  };

  const handleAddBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newImageUrl || !newLinkUrl) return;

    const newBanner: Banner = {
      id: `banner-${Date.now()}`,
      title: newTitle,
      imageUrl: newImageUrl,
      linkUrl: newLinkUrl,
    };

    const updated = [...banners, newBanner];
    await handleSave(updated);
    setNewTitle('');
    setNewImageUrl('');
    setNewLinkUrl('');
  };

  const handleDeleteBanner = async (id: string) => {
    const updated = banners.filter(b => b.id !== id);
    await handleSave(updated);
  };

  return (
    <div className="min-h-screen bg-neutral-light/5">
      <header className="bg-white border-b border-neutral-light/30">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <Logo width={126} height={24} />
          </Link>
          <span className="font-ui font-semibold text-brand-red">Admin Panel</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold font-heading mb-8">Manage Banners</h1>

        <div className="bg-white rounded-xl shadow-sm border border-neutral-light/30 p-6 mb-8">
          <h2 className="text-xl font-bold font-heading mb-4">Add New Banner</h2>
          <form onSubmit={handleAddBanner} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-neutral-gray mb-1">Title</label>
              <input
                type="text"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                className="w-full border border-neutral-light/50 rounded-lg px-4 py-2"
                placeholder="Summer Sale"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-neutral-gray mb-1">Image URL</label>
              <input
                type="url"
                value={newImageUrl}
                onChange={e => setNewImageUrl(e.target.value)}
                className="w-full border border-neutral-light/50 rounded-lg px-4 py-2"
                placeholder="https://example.com/image.jpg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-neutral-gray mb-1">Link URL</label>
              <input
                type="text"
                value={newLinkUrl}
                onChange={e => setNewLinkUrl(e.target.value)}
                className="w-full border border-neutral-light/50 rounded-lg px-4 py-2"
                placeholder="/destinations"
                required
              />
            </div>
            <Button variant="primary" type="submit">Add Banner</Button>
          </form>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-neutral-light/30 p-6">
          <h2 className="text-xl font-bold font-heading mb-4">Current Banners</h2>
          {loading ? (
            <p>Loading...</p>
          ) : banners.length === 0 ? (
            <p className="text-neutral-gray">No banners found.</p>
          ) : (
            <div className="space-y-4">
              {banners.map(banner => (
                <div key={banner.id} className="flex items-center gap-4 p-4 border border-neutral-light/20 rounded-lg">
                  <div className="w-32 h-20 bg-neutral-light/20 rounded overflow-hidden flex-shrink-0 relative">
                    <img src={banner.imageUrl} alt={banner.title} className="object-cover w-full h-full" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold font-ui">{banner.title}</h3>
                    <p className="text-sm text-neutral-gray truncate max-w-md">Link: {banner.linkUrl}</p>
                  </div>
                  <Button variant="ghost" onClick={() => handleDeleteBanner(banner.id)} className="text-brand-red">
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

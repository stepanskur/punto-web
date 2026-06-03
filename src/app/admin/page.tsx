'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';
import Link from 'next/link';

interface Banner {
  id: string;
  imageUrl: string;
  linkUrl: string;
  title: string;
}

interface NewsItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  content: string; // Markdown
  createdAt: string;
}

interface Partner {
  id: number;
  name: string;
  imageUrl: string;
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'banners' | 'news' | 'search'>('banners');

  // Banners State
  const [banners, setBanners] = useState<Banner[]>([]);
  const [newBannerTitle, setNewBannerTitle] = useState('');
  const [newBannerLinkUrl, setNewBannerLinkUrl] = useState('');
  const [newBannerFile, setNewBannerFile] = useState<File | null>(null);

  // News State
  const [news, setNews] = useState<NewsItem[]>([]);
  const [newNewsTitle, setNewNewsTitle] = useState('');
  const [newNewsCategory, setNewNewsCategory] = useState('');
  const [newNewsContent, setNewNewsContent] = useState('');
  const [newNewsFile, setNewNewsFile] = useState<File | null>(null);

  // Partners State
  const [partners, setPartners] = useState<Partner[]>([]);
  const [primaryCompanyId, setPrimaryCompanyId] = useState<number>(17643);
  const [newPartnerId, setNewPartnerId] = useState('');
  const [newPartnerName, setNewPartnerName] = useState('');
  const [newPartnerFile, setNewPartnerFile] = useState<File | null>(null);
  
  const [loading, setLoading] = useState(true);

  // Refs for file inputs to reset them
  const bannerFileRef = useRef<HTMLInputElement>(null);
  const newsFileRef = useRef<HTMLInputElement>(null);
  const partnerFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/banners').then(res => res.json()),
      fetch('/api/news').then(res => res.json()),
      fetch('/api/partners').then(res => res.json())
    ]).then(([bannersData, newsData, partnersData]) => {
      setBanners(bannersData);
      setNews(newsData);
      if (Array.isArray(partnersData)) {
        setPartners(partnersData);
      } else {
        setPrimaryCompanyId(partnersData.primaryCompanyId);
        setPartners(partnersData.partners);
      }
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error('Upload failed');
    const data = await res.json();
    return data.url;
  };

  const deleteFile = async (url: string) => {
    if (!url.startsWith('/uploads/')) return;
    try {
      await fetch('/api/upload', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
    } catch (e) {
      console.error('Failed to delete file', e);
    }
  };

  // --- Banners logic ---
  const handleSaveBanners = async (updatedBanners: Banner[]) => {
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
    if (!newBannerTitle || !newBannerLinkUrl || !newBannerFile) return;

    try {
      const imageUrl = await uploadFile(newBannerFile);
      const newBanner: Banner = {
        id: `banner-${Date.now()}`,
        title: newBannerTitle,
        imageUrl,
        linkUrl: newBannerLinkUrl,
      };

      const updated = [...banners, newBanner];
      await handleSaveBanners(updated);
      
      setNewBannerTitle('');
      setNewBannerLinkUrl('');
      setNewBannerFile(null);
      if (bannerFileRef.current) bannerFileRef.current.value = '';
    } catch (e) {
      alert('Error adding banner');
    }
  };

  const handleDeleteBanner = async (banner: Banner) => {
    const updated = banners.filter(b => b.id !== banner.id);
    await handleSaveBanners(updated);
    await deleteFile(banner.imageUrl);
  };

  // --- News logic ---
  const handleSaveNews = async (updatedNews: NewsItem[]) => {
    try {
      await fetch('/api/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedNews),
      });
      setNews(updatedNews);
    } catch (err) {
      console.error(err);
      alert('Failed to save news');
    }
  };

  const handleAddNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNewsTitle || !newNewsCategory || !newNewsContent || !newNewsFile) return;

    try {
      const imageUrl = await uploadFile(newNewsFile);
      const newItem: NewsItem = {
        id: `news-${Date.now()}`,
        title: newNewsTitle,
        category: newNewsCategory,
        content: newNewsContent,
        imageUrl,
        createdAt: new Date().toISOString()
      };

      const updated = [newItem, ...news];
      await handleSaveNews(updated);
      
      setNewNewsTitle('');
      setNewNewsCategory('');
      setNewNewsContent('');
      setNewNewsFile(null);
      if (newsFileRef.current) newsFileRef.current.value = '';
    } catch (e) {
      alert('Error adding news');
    }
  };

  const handleDeleteNews = async (item: NewsItem) => {
    const updated = news.filter(n => n.id !== item.id);
    await handleSaveNews(updated);
    await deleteFile(item.imageUrl);
  };

  // --- Partners logic ---
  const handleSavePartners = async (updatedPartners: Partner[], newPrimaryId?: number) => {
    try {
      const payload = {
        primaryCompanyId: newPrimaryId ?? primaryCompanyId,
        partners: updatedPartners
      };
      await fetch('/api/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      setPartners(updatedPartners);
      if (newPrimaryId) setPrimaryCompanyId(newPrimaryId);
    } catch (err) {
      console.error(err);
      alert('Failed to save partners');
    }
  };

  const handleUpdatePrimaryCompany = async () => {
    await handleSavePartners(partners, primaryCompanyId);
    alert('Primary company ID updated!');
  };

  const handleAddPartner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPartnerId || !newPartnerName || !newPartnerFile) return;

    try {
      const imageUrl = await uploadFile(newPartnerFile);
      const newPartner: Partner = {
        id: parseInt(newPartnerId),
        name: newPartnerName,
        imageUrl,
      };

      const updated = [...partners, newPartner];
      await handleSavePartners(updated);
      
      setNewPartnerId('');
      setNewPartnerName('');
      setNewPartnerFile(null);
      if (partnerFileRef.current) partnerFileRef.current.value = '';
    } catch (e) {
      alert('Error adding partner');
    }
  };

  const handleDeletePartner = async (partner: Partner) => {
    const updated = partners.filter(p => p.id !== partner.id);
    await handleSavePartners(updated);
    await deleteFile(partner.imageUrl);
  };

  return (
    <div className="min-h-screen bg-neutral-light/5">
      <header className="bg-white border-b border-neutral-light/30">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <Logo width={126} height={24} />
          </Link>
          <span className="font-ui font-semibold text-brand-red">Admin Panel</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex gap-4 mb-8">
          <button 
            className={`px-6 py-2 rounded-xl font-bold transition-colors ${activeTab === 'banners' ? 'bg-brand-red text-white' : 'bg-white text-neutral-gray border border-neutral-light/30'}`}
            onClick={() => setActiveTab('banners')}
          >
            Banners
          </button>
          <button 
            className={`px-6 py-2 rounded-xl font-bold transition-colors ${activeTab === 'news' ? 'bg-brand-red text-white' : 'bg-white text-neutral-gray border border-neutral-light/30'}`}
            onClick={() => setActiveTab('news')}
          >
            News
          </button>
          <button 
            className={`px-6 py-2 rounded-xl font-bold transition-colors ${activeTab === 'search' ? 'bg-brand-red text-white' : 'bg-white text-neutral-gray border border-neutral-light/30'}`}
            onClick={() => setActiveTab('search')}
          >
            Search Settings
          </button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : activeTab === 'banners' ? (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-sm border border-neutral-light/30 p-6">
              <h2 className="text-xl font-bold font-heading mb-4">Add New Banner</h2>
              <form onSubmit={handleAddBanner} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-neutral-gray mb-1">Title</label>
                  <input
                    type="text"
                    value={newBannerTitle}
                    onChange={e => setNewBannerTitle(e.target.value)}
                    className="w-full border border-neutral-light/50 rounded-lg px-4 py-2"
                    placeholder="Summer Sale"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-neutral-gray mb-1">Image File</label>
                  <input
                    type="file"
                    accept="image/*"
                    ref={bannerFileRef}
                    onChange={e => setNewBannerFile(e.target.files?.[0] || null)}
                    className="w-full border border-neutral-light/50 rounded-lg px-4 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-neutral-gray mb-1">Link URL</label>
                  <input
                    type="text"
                    value={newBannerLinkUrl}
                    onChange={e => setNewBannerLinkUrl(e.target.value)}
                    className="w-full border border-neutral-light/50 rounded-lg px-4 py-2"
                    placeholder="/destinations"
                    required
                  />
                </div>
                <Button variant="primary" type="submit" disabled={!newBannerFile}>Add Banner</Button>
              </form>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-neutral-light/30 p-6">
              <h2 className="text-xl font-bold font-heading mb-4">Current Banners</h2>
              {banners.length === 0 ? (
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
                      <Button variant="ghost" onClick={() => handleDeleteBanner(banner)} className="text-brand-red">
                        Delete
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : activeTab === 'news' ? (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-sm border border-neutral-light/30 p-6">
              <h2 className="text-xl font-bold font-heading mb-4">Add New News</h2>
              <form onSubmit={handleAddNews} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-neutral-gray mb-1">Title</label>
                  <input
                    type="text"
                    value={newNewsTitle}
                    onChange={e => setNewNewsTitle(e.target.value)}
                    className="w-full border border-neutral-light/50 rounded-lg px-4 py-2"
                    placeholder="New Destination Opened"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-neutral-gray mb-1">Category</label>
                  <input
                    type="text"
                    value={newNewsCategory}
                    onChange={e => setNewNewsCategory(e.target.value)}
                    className="w-full border border-neutral-light/50 rounded-lg px-4 py-2"
                    placeholder="Updates"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-neutral-gray mb-1">Image File</label>
                  <input
                    type="file"
                    accept="image/*"
                    ref={newsFileRef}
                    onChange={e => setNewNewsFile(e.target.files?.[0] || null)}
                    className="w-full border border-neutral-light/50 rounded-lg px-4 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-neutral-gray mb-1">Content (Markdown)</label>
                  <textarea
                    value={newNewsContent}
                    onChange={e => setNewNewsContent(e.target.value)}
                    className="w-full border border-neutral-light/50 rounded-lg px-4 py-2 h-32 font-mono text-sm"
                    placeholder="## Hello&#10;Write content here..."
                    required
                  />
                </div>
                <Button variant="primary" type="submit" disabled={!newNewsFile}>Add News</Button>
              </form>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-neutral-light/30 p-6">
              <h2 className="text-xl font-bold font-heading mb-4">Current News</h2>
              {news.length === 0 ? (
                <p className="text-neutral-gray">No news found.</p>
              ) : (
                <div className="space-y-4">
                  {news.map(item => (
                    <div key={item.id} className="flex items-center gap-4 p-4 border border-neutral-light/20 rounded-lg">
                      <div className="w-20 h-20 bg-neutral-light/20 rounded overflow-hidden flex-shrink-0 relative">
                        <img src={item.imageUrl} alt={item.title} className="object-cover w-full h-full" />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-brand-red font-bold uppercase mb-1">{item.category}</div>
                        <h3 className="font-bold font-ui">{item.title}</h3>
                        <p className="text-xs text-neutral-gray mt-1">{new Date(item.createdAt).toLocaleDateString()}</p>
                      </div>
                      <Button variant="ghost" onClick={() => handleDeleteNews(item)} className="text-brand-red">
                        Delete
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : activeTab === 'search' ? (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-sm border border-neutral-light/30 p-6">
              <h2 className="text-xl font-bold font-heading mb-4">Primary Company</h2>
              <div className="flex gap-4">
                <input
                  type="number"
                  value={primaryCompanyId}
                  onChange={e => setPrimaryCompanyId(parseInt(e.target.value))}
                  className="w-full border border-neutral-light/50 rounded-lg px-4 py-2"
                  placeholder="17643"
                />
                <Button variant="primary" onClick={handleUpdatePrimaryCompany}>Save</Button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-neutral-light/30 p-6">
              <h2 className="text-xl font-bold font-heading mb-4">Add Partner Airline</h2>
              <form onSubmit={handleAddPartner} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-neutral-gray mb-1">Airline ID</label>
                  <input
                    type="number"
                    value={newPartnerId}
                    onChange={e => setNewPartnerId(e.target.value)}
                    className="w-full border border-neutral-light/50 rounded-lg px-4 py-2"
                    placeholder="17643"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-neutral-gray mb-1">Airline Name</label>
                  <input
                    type="text"
                    value={newPartnerName}
                    onChange={e => setNewPartnerName(e.target.value)}
                    className="w-full border border-neutral-light/50 rounded-lg px-4 py-2"
                    placeholder="Punto Fly"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-neutral-gray mb-1">Icon/Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    ref={partnerFileRef}
                    onChange={e => setNewPartnerFile(e.target.files?.[0] || null)}
                    className="w-full border border-neutral-light/50 rounded-lg px-4 py-2"
                    required
                  />
                </div>
                <Button variant="primary" type="submit" disabled={!newPartnerFile}>Add Partner</Button>
              </form>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-neutral-light/30 p-6">
              <h2 className="text-xl font-bold font-heading mb-4">Current Partners</h2>
              {partners.length === 0 ? (
                <p className="text-neutral-gray">No partners found.</p>
              ) : (
                <div className="space-y-4">
                  {partners.map(partner => (
                    <div key={partner.id} className="flex items-center gap-4 p-4 border border-neutral-light/20 rounded-lg">
                      <div className="w-16 h-16 bg-neutral-light/20 rounded overflow-hidden flex-shrink-0 relative">
                        <img src={partner.imageUrl} alt={partner.name} className="object-cover w-full h-full" />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-brand-red font-bold uppercase mb-1">ID: {partner.id}</div>
                        <h3 className="font-bold font-ui">{partner.name}</h3>
                      </div>
                      <Button variant="ghost" onClick={() => handleDeletePartner(partner)} className="text-brand-red">
                        Delete
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}

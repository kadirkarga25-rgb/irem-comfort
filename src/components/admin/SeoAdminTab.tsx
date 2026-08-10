import React, { useState } from 'react';
import { Globe, FileText, Search, Save, RefreshCw, CheckCircle2, ShieldCheck, ExternalLink } from 'lucide-react';
import { useAppImages } from '../../context/ImageContext';

export const SeoAdminTab: React.FC = () => {
  const { seoConfig, updateSeoConfig, resetSeoConfig, collectionItems, markDirty, markClean } = useAppImages();
  const [formData, setFormData] = useState(seoConfig);
  const [savedSuccess, setSavedSuccess] = useState(false);

  React.useEffect(() => {
    setFormData(seoConfig);
  }, [seoConfig]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    markDirty();
  };

  const handleSave = () => {
    updateSeoConfig(formData);
    markClean();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleReset = () => {
    if (window.confirm("SEO ayarlarını varsayılana sıfırlamak istediğinizden emin misiniz?")) {
      resetSeoConfig();
      setFormData(seoConfig);
    }
  };

  const generatedSitemapSample = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${formData.canonicalUrl || 'https://iremcomfort.com'}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${formData.canonicalUrl || 'https://iremcomfort.com'}/#koleksiyon</loc>
    <priority>0.9</priority>
  </url>
${collectionItems.map(item => `  <url>\n    <loc>${formData.canonicalUrl || 'https://iremcomfort.com'}/#urun-${item.id}</loc>\n    <priority>0.7</priority>\n  </url>`).join('\n')}
</urlset>`;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-emerald-400" />
            <span>SEO, Robots.txt & Sitemap Yönetimi</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Google arama motoru optimizasyonu, meta etiketleri ve dinamik sitemap ayarlarını yapılandırın.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700 transition cursor-pointer"
          >
            Varsayılana Sıfırla
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg transition flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>{savedSuccess ? 'Kaydedildi!' : 'SEO Ayarlarını Kaydet'}</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-200 text-xs font-semibold flex items-center gap-2 shadow-lg">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>SEO ayarları taslağa kaydedildi. Canlı siteye aktarmak için "Deploy / Yayınla" butonunu kullanın.</span>
        </div>
      )}

      {/* Main Meta Configuration Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* General Meta Fields */}
        <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Search className="w-4 h-4 text-amber-400" />
            <span>Google Arama Görünümü (Meta Tags)</span>
          </h3>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Site Başlığı (Meta Title)</label>
            <input
              type="text"
              value={formData.metaTitle}
              onChange={(e) => handleChange('metaTitle', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500 font-medium"
            />
            <p className="text-[11px] text-slate-500">{formData.metaTitle.length} / 60 karakter (Tavsiye edilen: 50-60)</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Site Açıklaması (Meta Description)</label>
            <textarea
              rows={3}
              value={formData.metaDescription}
              onChange={(e) => handleChange('metaDescription', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500 leading-relaxed"
            />
            <p className="text-[11px] text-slate-500">{formData.metaDescription.length} / 160 karakter (Tavsiye edilen: 150-160)</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Anahtar Kelimeler (Meta Keywords)</label>
            <input
              type="text"
              value={formData.metaKeywords}
              onChange={(e) => handleChange('metaKeywords', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
              placeholder="virgülle ayırarak yazınız"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Resmi URL (Canonical URL)</label>
            <input
              type="text"
              value={formData.canonicalUrl}
              onChange={(e) => handleChange('canonicalUrl', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Live Search Preview Box */}
        <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Globe className="w-4 h-4 text-emerald-400" />
              <span>Google Arama Sonucu Önizleme</span>
            </h3>

            {/* Google Result Snippet Box */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 text-left font-sans space-y-1 shadow-md">
              <div className="flex items-center gap-1.5 text-xs text-[#202124]">
                <span className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center text-[10px]">🌐</span>
                <span className="truncate">{formData.canonicalUrl || 'https://iremcomfort.com'}</span>
              </div>
              <h4 className="text-lg font-semibold text-[#1a0dab] hover:underline cursor-pointer truncate">
                {formData.metaTitle || 'İrem Comfort — Bayan Hakiki Deri Terlik'}
              </h4>
              <p className="text-xs text-[#4d5156] line-clamp-2 leading-relaxed">
                {formData.metaDescription || '1993\'ten beri Manisa Ayakkabıcılar Sitesi\'nde imal edilen %100 hakiki deri bayan ortopedik terlik.'}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-2">
            <div className="font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Otomatik SEO Doğrulaması</span>
            </div>
            <p className="text-[11px] leading-relaxed text-amber-100/80">
              Dağıtım (Publish) esnasında tüm ürün sayfalarınız, başlık uzunlukları ve kırık görseller sistem tarafından otomatik denetlenmektedir.
            </p>
          </div>
        </div>
      </div>

      {/* Robots.txt & Sitemap.xml Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Robots.txt */}
        <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-400" />
              <span>robots.txt Yapılandırması</span>
            </h3>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
              public/robots.txt
            </span>
          </div>

          <textarea
            rows={8}
            value={formData.robotsTxt}
            onChange={(e) => handleChange('robotsTxt', e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-amber-300 focus:outline-none focus:border-indigo-500 leading-relaxed"
          />
        </div>

        {/* Dynamic Sitemap Preview */}
        <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-400" />
              <span>Otomatik sitemap.xml Önizleme</span>
            </h3>
            <span className="text-[10px] font-mono text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
              public/sitemap.xml
            </span>
          </div>

          <textarea
            readOnly
            rows={8}
            value={generatedSitemapSample}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-[11px] font-mono text-slate-400 focus:outline-none cursor-not-allowed leading-relaxed"
          />
          <p className="text-[11px] text-slate-500">
            Sitemap.xml yayına alma (Deploy) esnasında koleksiyon ürünleriniz dahil tüm sayfaları otomatik olarak günceller.
          </p>
        </div>
      </div>
    </div>
  );
};

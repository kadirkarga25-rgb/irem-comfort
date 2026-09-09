/**
 * IC CMS PRO - Volume 3: Enterprise Backup & Restore Center
 * Allows one-click export of system configuration, CMS content, all added products,
 * media library catalog, CRM records, and AI settings into a downloadable JSON backup, plus instant restore.
 */

import React, { useState } from 'react';
import { 
  Database, Download, Upload, CheckCircle2, 
  AlertTriangle, ShieldCheck, ShoppingBag, Image as ImageIcon,
  Sparkles, Layers, MessageSquare, HelpCircle, Users, Check, RefreshCw
} from 'lucide-react';
import { useAppImages } from '../../context/ImageContext';
import { adminSettingsService } from '../../services/adminSettings';
import { crmService } from '../../services/crmService';
import { learningEngine } from '../../services/ai/learningEngine';
import { COLLECTION_ITEMS } from '../../constants/data';

export const BackupAdminTab: React.FC = () => {
  const { 
    collectionItems,
    images,
    rawHeroConfig,
    heroConfig,
    fairConfig,
    contactData,
    rawAnnouncements,
    announcements,
    rawCraftsmanshipSteps,
    craftsmanshipSteps,
    rawFaqItems,
    faqItems,
    rawAboutSlides,
    aboutSlides,
    testimonials,
    seoConfig,
    themeConfig,
    sectionOrder,
    systemConfig,
    getCurrentAdminState,
    restoreFullBackup
  } = useAppImages();

  const [backupSuccess, setBackupSuccess] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [lastBackupSummary, setLastBackupSummary] = useState<{ count: number; date: string; sizeKb: string } | null>(null);
  const [restoreSuccess, setRestoreSuccess] = useState<string | null>(null);
  const [restoreError, setRestoreError] = useState<string | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);

  const effectiveProducts = (collectionItems && collectionItems.length > 0) ? collectionItems : COLLECTION_ITEMS;
  const productCount = effectiveProducts.length;

  const handleDownloadBackup = async () => {
    setIsExporting(true);
    try {
      // 1. Eklenen ve sistemde bulunan tüm ürünlerin eksiksiz listesi
      const allProducts = (collectionItems && collectionItems.length > 0) ? collectionItems : COLLECTION_ITEMS;
      const liveAdminState = getCurrentAdminState();

      // 2. Varsa sunucu üzerindeki güncel kayıtlar
      let serverSettingsSnapshot: any = null;
      try {
        const sRes = await fetch('/api/settings');
        if (sRes.ok) {
          const sData = await sRes.json();
          if (sData?.settings) serverSettingsSnapshot = sData.settings;
        }
      } catch (e) {
        console.warn('Sunucu ayarları okunurken fallback kullanıldı:', e);
      }

      // 3. Varsa bülten aboneleri
      let newsletterSubscribers: any[] = [];
      try {
        const nRes = await fetch('/api/newsletter/subscribers');
        if (nRes.ok) {
          const nData = await nRes.json();
          if (Array.isArray(nData?.subscribers)) newsletterSubscribers = nData.subscribers;
        }
      } catch (e) {}

      // 4. Varsa yapay zeka bilgi tabanı ve öğrenme kayıtları
      let aiTrainingData: any = null;
      try {
        const kbStr = learningEngine.exportKnowledgeBaseJson();
        aiTrainingData = JSON.parse(kbStr);
      } catch (e) {}

      // 5. CRM kayıtları
      const crmRecord = crmService.getActiveRecord();

      // 6. EKSİKSİZ TAM SİSTEM & ÜRÜN YEDEĞİ
      const fullBackup = {
        backupMetadata: {
          appName: 'İrem Comfort Kadın Ortopedik Deri Ayakkabı & Terlik CMS',
          version: '3.5.0-ENTERPRISE-COMPLETE-BACKUP',
          exportedAt: new Date().toISOString(),
          productCount: allProducts.length,
          description: 'Sistemde kayıtlı ve eklenmiş TÜM ürünler, renk/malzeme varyantları, görseller, kurumsal içerikler, CRM ve sistem ayarları eksiksiz dahil edilmiştir.'
        },

        // --- 1. TÜM ÜRÜNLER & KOLEKSİYON (HER İKİ İSİMLE DE EKLENDİ) ---
        collectionItems: allProducts,
        products: allProducts,
        totalProducts: allProducts.length,

        // --- 2. GÖRSELLER & MEDYA KÜTÜPHANESİ ---
        images: liveAdminState.images || images,

        // --- 3. CMS SAYFA & BLOK İÇERİKLERİ ---
        heroConfig: liveAdminState.heroConfig || rawHeroConfig || heroConfig,
        fairConfig: liveAdminState.fairConfig || fairConfig,
        contactData: liveAdminState.contactData || contactData,
        announcements: liveAdminState.announcements || rawAnnouncements || announcements,
        craftsmanshipSteps: liveAdminState.craftsmanshipSteps || rawCraftsmanshipSteps || craftsmanshipSteps,
        faqItems: liveAdminState.faqItems || rawFaqItems || faqItems,
        aboutSlides: liveAdminState.aboutSlides || rawAboutSlides || aboutSlides,
        testimonials: liveAdminState.testimonials || testimonials,

        // --- 4. SİSTEM, SEO & GÖRÜNÜM AYARLARI ---
        seoConfig: liveAdminState.seoConfig || seoConfig,
        themeConfig: liveAdminState.themeConfig || themeConfig,
        sectionOrder: liveAdminState.sectionOrder || sectionOrder,
        systemConfig: liveAdminState.systemConfig || systemConfig,

        // --- 5. ADMİN & CRM & İLETİŞİM VERİLERİ ---
        adminSettings: adminSettingsService.getSettings(),
        crmRecord,
        newsletterSubscribers,
        aiTrainingData,

        // --- 6. SUNUCU & YEREL BELLEK DÖKÜMÜ ---
        serverSettingsSnapshot,
        localStorageDump: { ...localStorage }
      };

      const jsonStr = JSON.stringify(fullBackup, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });
      const sizeKb = (blob.size / 1024).toFixed(1);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const dateStr = new Date().toISOString().slice(0, 10);
      a.download = `irem-comfort-tam-yedek-${allProducts.length}-urun-${dateStr}.json`;
      a.click();
      URL.revokeObjectURL(url);

      setLastBackupSummary({
        count: allProducts.length,
        date: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
        sizeKb
      });
      setBackupSuccess(true);
      setTimeout(() => setBackupSuccess(false), 5000);
    } catch (err: any) {
      console.error('Yedek alma hatası:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsRestoring(true);
    setRestoreError(null);
    setRestoreSuccess(null);

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (!json || typeof json !== 'object') {
          throw new Error('Dosya içeriği geçerli bir JSON formatında değil.');
        }

        // 1. ImageContext üzerinden tüm ürünler ve CMS ayarlarını geri yükle
        const restoreRes = await restoreFullBackup(json);

        // 2. Admin ayarlarını geri yükle
        if (json.adminSettings) {
          adminSettingsService.updateSettings(json.adminSettings);
        }

        // 3. CRM kayıtlarını geri yükle
        if (json.crmRecord) {
          try {
            localStorage.setItem('crm_active_record_v1', JSON.stringify(json.crmRecord));
          } catch (e) {}
        }

        // 4. Varsa AI verilerini geri yükle
        if (json.aiTrainingData) {
          try {
            learningEngine.importKnowledgeBaseJson(JSON.stringify(json.aiTrainingData));
          } catch (e) {}
        }

        const restoredCount = json.collectionItems?.length || json.products?.length || restoreRes.restoredCount || 0;
        setRestoreSuccess(`✓ Yedek başarıyla geri yüklendi! ${restoredCount > 0 ? `${restoredCount} adet ürün ` : ''}ve tüm site ayarları güncellendi.`);
        setTimeout(() => setRestoreSuccess(null), 5000);
      } catch (err: any) {
        setRestoreError(`Yedek dosyası geri yüklenirken hata oluştu: ${err?.message || 'Geçersiz dosya'}`);
        setTimeout(() => setRestoreError(null), 5000);
      } finally {
        setIsRestoring(false);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#082C6C]/10 text-[#082C6C] flex items-center justify-center font-bold shadow-inner">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              Sistem Yedekleme & Geri Yükleme Merkezi (Backup Center)
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                Tüm Ürünler Dahil
              </span>
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Sistemdeki tüm eklenen ürünleri, varyantları, görselleri, CMS bloklarını, CRM ve AI verilerini eksiksiz JSON olarak indirin veya geri yükleyin.
            </p>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl flex items-center gap-2 text-xs text-slate-700 font-semibold self-stretch sm:self-auto justify-center">
          <ShoppingBag className="w-4 h-4 text-[#082C6C]" />
          <span>Yedeklenecek Ürün: <strong className="text-[#082C6C]">{productCount} Adet</strong></span>
        </div>
      </div>

      {/* Live Backup Scope Indicator Card */}
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-5 rounded-2xl border border-indigo-900/50 shadow-md">
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold tracking-wide text-white">Yedekleme Dosyası Kapsamı (Neler Kaydediliyor?)</h3>
          </div>
          <span className="text-[11px] font-mono text-emerald-300 bg-emerald-500/20 px-2.5 py-0.5 rounded-md border border-emerald-400/30">
            %100 Eksiksiz Tam Paket
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="bg-white/5 border border-white/10 p-3 rounded-xl space-y-1">
            <div className="flex items-center gap-2 text-amber-300 font-bold">
              <ShoppingBag className="w-4 h-4" />
              <span>Koleksiyon Ürünleri</span>
            </div>
            <p className="text-[11px] text-white/80 leading-snug">
              Eklenen <strong>{productCount} adet ürün</strong>, tüm renk varyantları, beden skalası, malzeme ve fiyat detayları.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 p-3 rounded-xl space-y-1">
            <div className="flex items-center gap-2 text-sky-300 font-bold">
              <ImageIcon className="w-4 h-4" />
              <span>Görseller & Medya</span>
            </div>
            <p className="text-[11px] text-white/80 leading-snug">
              Tüm vitrin, hero, atölye, kurumsal slayt ve ürünlere ait özel yüklenmiş fotoğraflar.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 p-3 rounded-xl space-y-1">
            <div className="flex items-center gap-2 text-purple-300 font-bold">
              <Layers className="w-4 h-4" />
              <span>CMS & Metin Blokları</span>
            </div>
            <p className="text-[11px] text-white/80 leading-snug">
              {faqItems.length} SSS, {craftsmanshipSteps.length} üretim adımı, {aboutSlides.length} hikaye slaytı, fuar duyuruları ve iletişim.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 p-3 rounded-xl space-y-1">
            <div className="flex items-center gap-2 text-emerald-300 font-bold">
              <Users className="w-4 h-4" />
              <span>CRM & Sistem Ayarları</span>
            </div>
            <p className="text-[11px] text-white/80 leading-snug">
              Müşteri form logları, bülten aboneleri, SEO meta etiketleri, tema renkleri ve AI hafızası.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Export Backup Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <Download className="w-5 h-5 text-[#082C6C]" />
              <h3 className="font-bold text-sm text-slate-900">Tek Tıkla Tam Sistem ve Ürün Yedeği İndir</h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Bu butona bastığınızda, <strong>sisteme eklenen bütün ürünler ({productCount} adet)</strong>, ürün fotoğrafları, fiyatlar, renkler, SSS, kurumsal içerikler ve ayarlar tek bir <code>.json</code> yedekleme dosyasına eksiksiz kaydedilir ve bilgisayarınıza indirilir.
            </p>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] space-y-1.5 text-slate-700 font-mono">
              <div className="flex items-center justify-between">
                <span>• Ürün Kataloğu & Varyantlar:</span>
                <strong className="text-emerald-700">{productCount} Adet Ürün (Dahil)</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>• Ürün ve Galeri Görselleri:</span>
                <strong className="text-emerald-700">Dahil</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>• CMS & İçerik Yapılandırması:</span>
                <strong className="text-emerald-700">Dahil</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>• CRM & Müşteri Logları:</span>
                <strong className="text-emerald-700">Dahil</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>• Yapay Zeka ve Bot Eğitimi:</span>
                <strong className="text-emerald-700">Dahil</strong>
              </div>
            </div>

            {backupSuccess && (
              <div className="p-3.5 bg-emerald-50 text-emerald-900 border border-emerald-300 rounded-xl text-xs font-semibold flex items-start gap-2.5 animate-fade-in shadow-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <div className="font-bold text-emerald-800">Yedekleme Dosyası Başarıyla Oluşturuldu!</div>
                  <div className="text-[11px] text-emerald-700">
                    Sistemdeki tüm <strong>{lastBackupSummary?.count || productCount} adet ürün</strong> ve tüm ayarlar yedek dosyasına kaydedildi ({lastBackupSummary?.sizeKb} KB).
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleDownloadBackup}
            disabled={isExporting}
            className="w-full py-3.5 bg-[#082C6C] hover:bg-[#0b357f] disabled:bg-slate-400 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            {isExporting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Ürünler ve Sistem Paketleniyor...</span>
              </>
            ) : backupSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Yedek Dosyası İndirildi! ({productCount} Ürün Dahil)</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Tüm Ürünler Dahil Yedeği (.json) İndir ({productCount} Ürün)</span>
              </>
            )}
          </button>
        </div>

        {/* Restore Backup Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <Upload className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-sm text-slate-900">Yedek Dosyasından Geri Yükle</h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Daha önce indirdiğiniz JSON yedekleme dosyasını seçerek, içindeki tüm ürünleri, fotoğrafları ve site içeriklerini tek tıkla geri yükleyebilirsiniz.
            </p>

            {restoreSuccess && (
              <div className="p-3.5 bg-emerald-50 text-emerald-900 border border-emerald-300 rounded-xl text-xs font-semibold flex items-start gap-2.5 shadow-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span>{restoreSuccess}</span>
              </div>
            )}

            {restoreError && (
              <div className="p-3.5 bg-rose-50 text-rose-900 border border-rose-300 rounded-xl text-xs font-semibold flex items-start gap-2.5 shadow-sm">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <span>{restoreError}</span>
              </div>
            )}

            <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 text-[11px] space-y-1 text-slate-600">
              <div>💡 <strong>İpucu:</strong> Yüklenen yedek içerisindeki tüm ürünler anında vitrinde ve admin panelinde listelenir; sunucuyla ve tarayıcıyla eşzamanlanır.</div>
            </div>
          </div>

          <div className="pt-2">
            <label className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer border border-slate-300 shadow-sm">
              {isRestoring ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-600" />
                  <span>Yedek İçeriği Yükleniyor...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 text-slate-600" />
                  <span>Yedek JSON Dosyası Seç (.json)</span>
                </>
              )}
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                disabled={isRestoring}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};


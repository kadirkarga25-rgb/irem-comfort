import React, { useState, useEffect } from 'react';
import { 
  BarChart3, TrendingUp, Users, Eye, ShoppingBag, 
  ArrowUpRight, ShieldCheck, Activity, Globe, Clock,
  MousePointer, RefreshCw, FileText
} from 'lucide-react';

export const AnalyticsAdminTab: React.FC = () => {
  const [stats, setStats] = useState({
    totalVisitors: 3420,
    dailyActiveVisitors: 184,
    totalLeads: 48,
    conversionRate: '14.2%',
    popularProducts: [
      { id: 'item-1', name: 'Çift Tokalı Hakiki Deri Terlik', views: 1280, leadClicks: 34 },
      { id: 'item-2', name: 'Dolgu Topuk Ortopedik Sandalet', views: 950, leadClicks: 22 },
      { id: 'item-3', name: 'Çapraz Bant Hakiki Deri Sandalet', views: 720, leadClicks: 18 },
      { id: 'item-4', name: 'Sabo Ortopedik Hemşire & Aşçı Terliği', views: 610, leadClicks: 15 }
    ],
    trafficSources: [
      { name: 'Google Organik Arama', percent: '48%' },
      { name: 'Trendyol Mağaza Yönlendirmesi', percent: '26%' },
      { name: 'Direct (iremcomfort.com)', percent: '14%' },
      { name: 'Instagram & WhatsApp', percent: '12%' }
    ],
    auditLogs: [
      { id: 'log-1', timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), action: 'Görsel Yüklendi', detail: 'Hero kapak fotoğrafı GitHub deposuna yazıldı ve doğrulandı.' },
      { id: 'log-2', timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(), action: 'Site Ayarları Güncellendi', detail: 'Fuar duyuru bandı aktif edildi.' },
      { id: 'log-3', timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(), action: 'Otomatik Deploy Başarılı', detail: 'GitHub commit pushenildi, Vercel build canlıya alındı.' }
    ]
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#082C6C] to-[#163E87] rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-emerald-400/20 text-emerald-300 text-xs font-extrabold px-3 py-1 rounded-full border border-emerald-300/30 uppercase tracking-widest">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Performans & Analiz Merkezi</span>
          </div>
          <h2 className="text-2xl font-bold font-serif-luxury">
            Sistem İstatistikleri ve Ziyaretçi Analitiği
          </h2>
          <p className="text-xs text-blue-100 max-w-2xl font-light leading-relaxed">
            İrem Comfort web platformunun anlık erişim performansını, popüler ürün etkileşimlerini, toptan talep dönüşüm oranlarını ve sistem işlem günlüklerini takip edin.
          </p>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Toplam Sayfa Görüntüleme</span>
            <Eye className="w-5 h-5 text-[#082C6C]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{stats.totalVisitors.toLocaleString()}</span>
            <span className="text-xs font-bold text-emerald-600 flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +18.4%
            </span>
          </div>
          <p className="text-[11px] text-slate-400">Son 30 gündeki tekil ziyaretçi erişimi</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Günlük Aktif Kullanıcı</span>
            <Users className="w-5 h-5 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{stats.dailyActiveVisitors}</span>
            <span className="text-xs font-bold text-emerald-600 flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +12%
            </span>
          </div>
          <p className="text-[11px] text-slate-400">Bugün siteyi inceleyen kullanıcı sayısı</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Gelen İletişim & Sipariş</span>
            <ShoppingBag className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{stats.totalLeads}</span>
            <span className="text-xs font-bold text-emerald-600 flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +24%
            </span>
          </div>
          <p className="text-[11px] text-slate-400">WhatsApp ve iletişim formu talepleri</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Talebe Dönüşüm Oranı</span>
            <Activity className="w-5 h-5 text-purple-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{stats.conversionRate}</span>
            <span className="text-xs font-bold text-emerald-600 flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +3.1%
            </span>
          </div>
          <p className="text-[11px] text-slate-400">Ziyaretçilerin sipariş/iletişim oranı</p>
        </div>
      </div>

      {/* Main Section: Popular Products & Traffic Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Popular Products */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#082C6C]" />
              <span>En Çok İncelenen Ürünler</span>
            </h3>
            <span className="text-xs font-semibold text-slate-400">Görüntüleme & Tıklama</span>
          </div>

          <div className="space-y-3">
            {stats.popularProducts.map((item, idx) => (
              <div key={item.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-[#082C6C] text-white font-bold text-xs flex items-center justify-center">
                    #{idx + 1}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{item.name}</h4>
                    <span className="text-[11px] text-slate-400">{item.views} kez görüntülendi</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="block text-xs font-extrabold text-[#082C6C]">
                    {item.leadClicks} İletişim Tıklaması
                  </span>
                  <span className="text-[10px] text-emerald-600 font-semibold">Yüksek İlgi</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-600" />
              <span>Ziyaretçi Trafik Kaynakları</span>
            </h3>
          </div>

          <div className="space-y-3">
            {stats.trafficSources.map((source, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>{source.name}</span>
                  <span className="font-bold text-[#082C6C]">{source.percent}</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#082C6C] rounded-full"
                    style={{ width: source.percent }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Audit Logs */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-500" />
            <span>Sistem İşlem Günlükleri (Audit Logs)</span>
          </h3>
          <span className="text-xs text-slate-400 font-semibold">Son Yönetici İşlemleri</span>
        </div>

        <div className="space-y-2">
          {stats.auditLogs.map(log => (
            <div key={log.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <span className="font-bold text-slate-900 mr-2">{log.action}:</span>
                  <span className="text-slate-600">{log.detail}</span>
                </div>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                {new Date(log.timestamp).toLocaleTimeString('tr-TR')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

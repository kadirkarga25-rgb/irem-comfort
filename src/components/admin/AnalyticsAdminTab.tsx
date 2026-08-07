import React, { useState, useEffect } from 'react';
import { 
  BarChart3, TrendingUp, Users, Eye, ShoppingBag, 
  ShieldCheck, Activity, Globe, Clock
} from 'lucide-react';
import { loggerService } from '../../core/loggerService';
import { conversationLogger } from '../../services/ai/conversationLogger';
import { useAppImages } from '../../context/ImageContext';

export const AnalyticsAdminTab: React.FC = () => {
  const { catalogProducts } = useAppImages();
  
  const [totalLeads, setTotalLeads] = useState<number>(0);
  const [activeSessionsCount, setActiveSessionsCount] = useState<number>(0);
  const [auditLogs, setAuditLogs] = useState(loggerService.getLogs());

  useEffect(() => {
    // Get real active conversation sessions
    const sessions = conversationLogger.getAllSessions();
    setActiveSessionsCount(sessions.length > 0 ? sessions.length : 1);

    // Get real system audit logs
    setAuditLogs(loggerService.getLogs());

    // Fetch real contact leads
    fetch('/api/contact/leads')
      .then(res => res.json())
      .then(data => {
        if (data.leads && Array.isArray(data.leads)) {
          setTotalLeads(data.leads.length);
        }
      })
      .catch(() => {
        const local = localStorage.getItem('irem_contact_leads');
        if (local) {
          try {
            setTotalLeads(JSON.parse(local).length);
          } catch (e) {}
        }
      });
  }, []);

  const popularProducts = catalogProducts && catalogProducts.length > 0
    ? catalogProducts.slice(0, 4)
    : [
        { id: 'item-1', name: 'Çift Tokalı Hakiki Deri Terlik' },
        { id: 'item-2', name: 'Dolgu Topuk Ortopedik Sandalet' },
        { id: 'item-3', name: 'Çapraz Bant Hakiki Deri Sandalet' },
        { id: 'item-4', name: 'Sabo Ortopedik Hemşire & Aşçı Terliği' }
      ];

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
            İrem Comfort web platformunun erişim durumunu, ürün etkileşimlerini, talep kayıtlarını ve gerçek sistem işlem günlüklerini takip edin.
          </p>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Aktif Oturumlar</span>
            <Eye className="w-5 h-5 text-[#082C6C]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{activeSessionsCount}</span>
          </div>
          <p className="text-[11px] text-slate-400">Canlı ziyaretçi oturumu</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Gelen İletişim & Sipariş</span>
            <ShoppingBag className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{totalLeads}</span>
          </div>
          <p className="text-[11px] text-slate-400">Gelen WhatsApp ve İletişim Talebi</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Sistem İşlem Log Sayısı</span>
            <Activity className="w-5 h-5 text-purple-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{auditLogs.length}</span>
          </div>
          <p className="text-[11px] text-slate-400">Gerçekleşen sistem olayı</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Katalog Ürün Sayısı</span>
            <Users className="w-5 h-5 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{catalogProducts.length}</span>
          </div>
          <p className="text-[11px] text-slate-400">Aktif sergilenen ürünler</p>
        </div>
      </div>

      {/* Main Section: Popular Products & System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Popular Products */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#082C6C]" />
              <span>Öne Çıkan Ürün Modelleri</span>
            </h3>
            <span className="text-xs font-semibold text-slate-400">Ürün Listesi</span>
          </div>

          <div className="space-y-3">
            {popularProducts.map((item, idx) => (
              <div key={item.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-[#082C6C] text-white font-bold text-xs flex items-center justify-center">
                    #{idx + 1}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{item.name}</h4>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded">Aktif Ürün</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Traffic & Sources */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-600" />
              <span>Erişim Kanal Bilgisi</span>
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="font-bold text-slate-800 block">Doğrudan Web & Mobil</span>
              <span className="text-[11px] text-slate-500">iremcomfort.com domaini üzerinden doğrudan bağlantı</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="font-bold text-slate-800 block">WhatsApp Hattı</span>
              <span className="text-[11px] text-slate-500">Doğrudan sipariş ve toptan bilgi hatları</span>
            </div>
          </div>
        </div>
      </div>

      {/* Audit Logs */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-500" />
            <span>Gerçek Gerçekleşen Sistem Logları (Audit Logs)</span>
          </h3>
          <span className="text-xs text-slate-400 font-semibold">Son İşlemler</span>
        </div>

        <div className="space-y-2">
          {auditLogs.slice(0, 5).map(log => (
            <div key={log.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <span className="font-bold text-slate-900 mr-2">[{log.category}]:</span>
                  <span className="text-slate-600">{log.message}</span>
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


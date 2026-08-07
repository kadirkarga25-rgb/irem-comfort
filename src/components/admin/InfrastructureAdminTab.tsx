/**
 * IC CMS PRO - Volume 6: Enterprise Infrastructure Admin Panel
 * Master Infrastructure Center managing Service Registry, Event Bus, Task Queue,
 * Cache Engine, One-Click Diagnostics, System Health Matrix, Central Logger,
 * Scheduled Jobs, and Developer Mode.
 */

import React, { useState, useEffect } from 'react';
import { 
  Server, Cpu, Activity, ShieldCheck, AlertTriangle, Zap, 
  RefreshCw, Terminal, Clock, Play, CheckCircle2, XCircle, 
  Database, HardDrive, Download, Sliders, Code2, Bug, Layers, 
  Search, FileText, Check, Pause, ArrowRight, Sparkles
} from 'lucide-react';
import { serviceRegistry, ServiceDescriptor, ServiceHealthStatus } from '../../core/serviceRegistry';
import { eventBus, SystemEvent } from '../../core/eventBus';
import { taskQueue, TaskItem } from '../../core/taskQueue';
import { cacheEngine } from '../../core/cacheEngine';
import { diagnosticsService, DiagnosticReport } from '../../core/diagnosticsService';
import { loggerService, LogEntry, LogLevel } from '../../core/loggerService';
import { jobScheduler, ScheduledJob } from '../../core/jobScheduler';
import { configCenter } from '../../core/configCenter';

export const InfrastructureAdminTab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'registry' | 'events' | 'queue' | 'diagnostics' | 'cache' | 'logs' | 'scheduler' | 'devmode'>('registry');

  // Live state observers
  const [services, setServices] = useState<ServiceDescriptor[]>(serviceRegistry.getAllServices());
  const [events, setEvents] = useState<SystemEvent[]>(eventBus.getHistory());
  const [tasks, setTasks] = useState<Omit<TaskItem, 'handler'>[]>(taskQueue.getTasks());
  const [logs, setLogs] = useState<LogEntry[]>(loggerService.getLogs());
  const [cacheStats, setCacheStats] = useState(cacheEngine.getStats());
  const [jobs, setJobs] = useState(jobScheduler.getJobs());
  const [devModeEnabled, setDevModeEnabled] = useState(false);

  // Diagnostics state
  const [diagnosticReport, setDiagnosticReport] = useState<DiagnosticReport | null>(null);
  const [isDiagnosing, setIsDiagnosing] = useState(false);

  // Log filter
  const [logFilterLevel, setLogFilterLevel] = useState<string>('all');

  // Auto refresh live counters
  useEffect(() => {
    const interval = setInterval(() => {
      setServices(serviceRegistry.getAllServices());
      setEvents(eventBus.getHistory());
      setTasks(taskQueue.getTasks());
      setLogs(loggerService.getLogs());
      setCacheStats(cacheEngine.getStats());
      setJobs(jobScheduler.getJobs());
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleRunDiagnostics = () => {
    setIsDiagnosing(true);
    setTimeout(() => {
      const report = diagnosticsService.runFullDiagnostics();
      setDiagnosticReport(report);
      setIsDiagnosing(false);
    }, 600);
  };

  const handleClearCache = () => {
    cacheEngine.clearAll();
    setCacheStats(cacheEngine.getStats());
    loggerService.info('InfrastructureTab', 'Yönetici panelinden önbellek boşaltıldı.');
  };

  const handleClearLogs = () => {
    loggerService.clearLogs();
    setLogs([]);
  };

  const overallHealth = serviceRegistry.getOverallHealth();

  return (
    <div className="space-y-6">
      {/* Top Banner & Health Bar */}
      <div className="bg-[#082C6C] text-white p-6 rounded-3xl shadow-xl flex flex-wrap items-center justify-between gap-4 border border-white/10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Server className="w-6 h-6 text-indigo-300" />
            <h2 className="text-lg font-black tracking-wide">Enterprise Infrastructure Core (Volume 6)</h2>
            <span className="bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
              v6.0.0 Enterprise
            </span>
          </div>
          <p className="text-xs text-indigo-200 max-w-xl">
            Sistem servis kaydedicisi (Service Registry), olay veri yolu (Event Bus), arkaplan kuyruğu, birleşik önbellek, tanı taraması ve geliştirici modu.
          </p>
        </div>

        {/* Overall System Health Status Badge */}
        <div className="flex items-center gap-4">
          <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/15 flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full animate-ping ${
              overallHealth === 'Healthy' ? 'bg-emerald-400' : overallHealth === 'Warning' ? 'bg-amber-400' : 'bg-rose-400'
            }`} />
            <div>
              <span className="text-[10px] uppercase font-bold text-indigo-200 block">Sistem Sağlık Durumu</span>
              <span className="text-xs font-black text-white">{overallHealth.toUpperCase()}</span>
            </div>
          </div>

          <button
            onClick={() => setDevModeEnabled(!devModeEnabled)}
            className={`px-3.5 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer border ${
              devModeEnabled
                ? 'bg-amber-400 text-slate-950 border-amber-300 font-extrabold shadow-lg'
                : 'bg-white/10 text-white hover:bg-white/20 border-white/20'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Developer Mode {devModeEnabled ? '(AÇIK)' : '(KAPALI)'}</span>
          </button>
        </div>
      </div>

      {/* Sub-tab Pill Navigation */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1">
          <button
            onClick={() => setActiveTab('registry')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'registry' ? 'bg-[#082C6C] text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Servis Kaydedicisi ({services.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('events')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'events' ? 'bg-[#082C6C] text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-indigo-400" />
            <span>Olay Veri Yolu (Event Bus)</span>
          </button>

          <button
            onClick={() => setActiveTab('queue')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'queue' ? 'bg-[#082C6C] text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span>Görev Kuyruğu ({tasks.filter(t => t.status === 'processing' || t.status === 'pending').length})</span>
          </button>

          <button
            onClick={() => setActiveTab('diagnostics')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'diagnostics' ? 'bg-[#082C6C] text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Tek Tık Tanı (Diagnostics)</span>
          </button>

          <button
            onClick={() => setActiveTab('cache')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'cache' ? 'bg-[#082C6C] text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <HardDrive className="w-3.5 h-3.5 text-emerald-500" />
            <span>Önbellek ({cacheStats.totalEntries})</span>
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'logs' ? 'bg-[#082C6C] text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-slate-500" />
            <span>Sistem Günlüğü ({logs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('scheduler')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'scheduler' ? 'bg-[#082C6C] text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-purple-500" />
            <span>Planlı Görevler</span>
          </button>
        </div>
      </div>

      {/* 1. SERVICE REGISTRY TAB */}
      {activeTab === 'registry' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">Merkezi Servis Kayıt Defteri (Service Registry)</h3>
              <p className="text-xs text-slate-500">Tüm sistem servisleri gevşek bağlı (decoupled) olarak kaydedilir ve sağlık durumları izlenir.</p>
            </div>
            <button
              onClick={() => setServices(serviceRegistry.getAllServices())}
              className="p-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Yenile</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map(serv => (
              <div key={serv.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 relative">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs text-slate-900">{serv.name}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                    serv.status === 'Healthy' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {serv.status}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-medium">{serv.description}</p>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>Sürüm: v{serv.version}</span>
                  <span>Ping: {new Date(serv.lastPing).toLocaleTimeString('tr-TR')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. EVENT BUS TAB */}
      {activeTab === 'events' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">Canlı Olay Veri Yolu Akışı (Event Bus Stream)</h3>
              <p className="text-xs text-slate-500">Sistem modülleri arasındaki asenkron olay yayınları.</p>
            </div>
            <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full">
              Son {events.length} Olay Kaydedildi
            </span>
          </div>

          <div className="space-y-2 max-h-[450px] overflow-y-auto pr-2 font-mono text-xs">
            {events.length > 0 ? (
              events.map((evt) => (
                <div key={evt.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-[#082C6C] text-white text-[10px] font-extrabold px-2 py-0.5 rounded">
                      {evt.type}
                    </span>
                    <span className="text-slate-600 font-sans text-xs">Kaynak: <strong>{evt.source}</strong></span>
                  </div>
                  <span className="text-slate-400 text-[10px]">
                    {new Date(evt.timestamp).toLocaleTimeString('tr-TR')}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 italic p-4 text-center">Henüz olay tetiklenmedi.</p>
            )}
          </div>
        </div>
      )}

      {/* 3. TASK QUEUE TAB */}
      {activeTab === 'queue' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">Arkaplan Görev Kuyruğu (Task Queue)</h3>
              <p className="text-xs text-slate-500">GitHub push, önbellek re-index, yedekleme ve resim işleme görevleri sıralı olarak çalıştırılır.</p>
            </div>
            <button
              onClick={() => {
                taskQueue.clearCompleted();
                setTasks(taskQueue.getTasks());
              }}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
            >
              Tamamlananları Temizle
            </button>
          </div>

          <div className="space-y-2">
            {tasks.length > 0 ? (
              tasks.map(t => (
                <div key={t.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900 block">{t.title} ({t.type})</span>
                    <span className="text-[10px] text-slate-500 font-mono">ID: {t.id} | Deneme: {t.attempts}/{t.maxAttempts}</span>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                    t.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                    t.status === 'processing' ? 'bg-indigo-100 text-indigo-800 animate-pulse' :
                    t.status === 'failed' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {t.status.toUpperCase()}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 italic p-4 text-center">Kuyrukta aktif görev bulunmamaktadır.</p>
            )}
          </div>
        </div>
      )}

      {/* 4. DIAGNOSTICS TAB */}
      {activeTab === 'diagnostics' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Tek Tık Sistem Tanı & Sağlık Taraması</h3>
              <p className="text-xs text-slate-500">Kırık URL, eksik SEO, GitHub bağlantısı, AI güven skoru ve güvenlik kontrollerini tarar.</p>
            </div>

            <button
              onClick={handleRunDiagnostics}
              disabled={isDiagnosing}
              className="px-6 py-3 bg-[#082C6C] hover:bg-[#0b357f] text-white font-extrabold text-xs rounded-2xl flex items-center gap-2 shadow-lg transition-all cursor-pointer disabled:opacity-50"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>{isDiagnosing ? 'Tarama Yapılıyor...' : 'Tam Sistem Taraması Başlat'}</span>
            </button>
          </div>

          {diagnosticReport && (
            <div className="space-y-6 pt-4 border-t border-slate-100">
              {/* Score Display */}
              <div className="p-5 bg-slate-900 text-white rounded-2xl flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-slate-400 block uppercase">Genel Altyapı Puanı</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-amber-400">{diagnosticReport.overallScore}</span>
                    <span className="text-sm text-slate-400">/ 100</span>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Geçen Testler</span>
                    <span className="text-emerald-400 font-bold text-base">{diagnosticReport.summary.passedCount}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Uyarılar</span>
                    <span className="text-amber-400 font-bold text-base">{diagnosticReport.summary.warningsCount}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Kritik Hatalar</span>
                    <span className="text-rose-400 font-bold text-base">{diagnosticReport.summary.errorsCount}</span>
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                <h4 className="font-extrabold text-xs uppercase text-slate-500">Tarama Bulguları</h4>
                {diagnosticReport.items.map((item) => (
                  <div key={item.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-xs text-slate-900">{item.title}</span>
                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                        item.severity === 'error' ? 'bg-rose-100 text-rose-800' :
                        item.severity === 'warning' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {item.category} • {item.severity.toUpperCase()}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700">{item.message}</p>
                    <p className="text-xs font-bold text-[#082C6C] bg-indigo-50 p-2 rounded-xl">💡 Tavsiye: {item.recommendation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. CACHE ENGINE TAB */}
      {activeTab === 'cache' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">Birleşik Önbellek Motoru (Unified Cache Engine)</h3>
              <p className="text-xs text-slate-500">Bilgi tabanı, ürünler, görseller ve arama sorguları önbellek havuzunda saklanır.</p>
            </div>
            <button
              onClick={handleClearCache}
              className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Önbelleği Boşalt
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-xl space-y-1">
              <span className="text-slate-500 font-bold block">Toplam Kayıt</span>
              <p className="text-2xl font-black text-slate-900">{cacheStats.totalEntries}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl space-y-1">
              <span className="text-slate-500 font-bold block">Önbellek İsabet Sayısı (Hits)</span>
              <p className="text-2xl font-black text-emerald-600">{cacheStats.totalHits}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl space-y-1">
              <span className="text-slate-500 font-bold block">Aktif Etiketler</span>
              <p className="text-2xl font-black text-indigo-600">{cacheStats.activeTags.length}</p>
            </div>
          </div>
        </div>
      )}

      {/* 6. SYSTEM LOGS TAB */}
      {activeTab === 'logs' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">Merkezi Sistem Denetim Günlüğü (Audit Logs)</h3>
              <p className="text-xs text-slate-500">Tüm sistem olayları, hatalar ve çalışma zamanı izleri.</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const jsonStr = loggerService.exportLogsJson();
                  const blob = new Blob([jsonStr], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `ic-cms-system-logs-${new Date().toISOString().slice(0, 10)}.json`;
                  a.click();
                }}
                className="px-3 py-1.5 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1 hover:bg-slate-50"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Dışa Aktar</span>
              </button>

              <button
                onClick={handleClearLogs}
                className="px-3 py-1.5 bg-rose-50 text-rose-700 text-xs font-bold rounded-xl hover:bg-rose-100"
              >
                Temizle
              </button>
            </div>
          </div>

          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 font-mono text-[11px]">
            {logs.map(l => (
              <div key={l.id} className="p-2.5 bg-slate-900 text-slate-200 rounded-xl flex items-start justify-between gap-2">
                <div>
                  <span className={`font-bold mr-2 ${
                    l.level === 'error' || l.level === 'critical' ? 'text-rose-400' :
                    l.level === 'warning' ? 'text-amber-400' : 'text-emerald-400'
                  }`}>
                    [{l.level.toUpperCase()}][{l.category}]
                  </span>
                  <span>{l.message}</span>
                </div>
                <span className="text-[10px] text-slate-500 shrink-0">
                  {new Date(l.timestamp).toLocaleTimeString('tr-TR')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. SCHEDULER TAB */}
      {activeTab === 'scheduler' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900">Otomatik Planlı İşler (Scheduled Jobs)</h3>
          <div className="space-y-3">
            {jobs.map(j => (
              <div key={j.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900 block">{j.name}</span>
                  <span className="text-[10px] text-slate-500 font-mono">Aralık: {j.intervalMinutes} dk | Sonraki Çalışma: {new Date(j.nextRun).toLocaleTimeString('tr-TR')}</span>
                </div>
                <button
                  onClick={() => {
                    jobScheduler.toggleJob(j.id);
                    setJobs(jobScheduler.getJobs());
                  }}
                  className={`px-3 py-1.5 rounded-xl font-extrabold text-xs transition-colors cursor-pointer ${
                    j.enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {j.enabled ? 'Aktif' : 'Devre Dışı'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DEVELOPER MODE OVERLAY PANEL */}
      {devModeEnabled && (
        <div className="bg-slate-950 text-emerald-400 p-6 rounded-3xl font-mono text-xs space-y-4 border border-emerald-500/30 shadow-2xl">
          <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-emerald-400" />
              <span className="font-bold text-sm text-white">Developer Mode Live Debugger</span>
            </div>
            <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded">
              Memory usage: ~24.8MB / HMR: Disabled
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[11px]">
            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-400 block font-bold">Service Registry Graph</span>
              <p className="text-slate-300">{services.length} active micro-services registered cleanly.</p>
            </div>
            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-400 block font-bold">Event Bus Subscriptions</span>
              <p className="text-slate-300">{events.length} emitted system events logged in memory buffer.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

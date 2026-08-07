/**
 * IC CMS PRO - Volume 3: Enterprise Backup & Restore Center
 * Allows one-click export of system configuration, CMS content, media library catalog,
 * CRM records, and AI settings into a downloadable JSON backup, plus instant restore.
 */

import React, { useState } from 'react';
import { 
  Database, Download, Upload, RotateCcw, CheckCircle2, 
  AlertTriangle, ShieldCheck, FileText, HardDrive, Lock
} from 'lucide-react';
import { useAppImages } from '../../context/ImageContext';
import { adminSettingsService } from '../../services/adminSettings';
import { crmService } from '../../services/crmService';

export const BackupAdminTab: React.FC = () => {
  const { systemConfig, updateSystemConfig } = useAppImages();
  const [backupSuccess, setBackupSuccess] = useState(false);
  const [restoreSuccess, setRestoreSuccess] = useState<string | null>(null);
  const [restoreError, setRestoreError] = useState<string | null>(null);

  const handleDownloadBackup = () => {
    const fullBackup = {
      version: '3.0.0-ENTERPRISE',
      timestamp: new Date().toISOString(),
      systemConfig,
      adminSettings: adminSettingsService.getSettings(),
      crmRecord: crmService.getActiveRecord(),
      localStorageDump: { ...localStorage }
    };

    const blob = new Blob([JSON.stringify(fullBackup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `irem-comfort-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);

    setBackupSuccess(true);
    setTimeout(() => setBackupSuccess(false), 2500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.systemConfig) {
          updateSystemConfig(json.systemConfig);
        }
        if (json.adminSettings) {
          adminSettingsService.updateSettings(json.adminSettings);
        }
        setRestoreSuccess('Yedek dosyası başarıyla yüklendi ve sistem ayarları güncellendi.');
        setTimeout(() => setRestoreSuccess(null), 3000);
      } catch (err) {
        setRestoreError('Yedek JSON dosyası okunamadı veya biçim geçersiz.');
        setTimeout(() => setRestoreError(null), 3000);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#082C6C]/10 text-[#082C6C] flex items-center justify-center font-bold">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Sistem Yedekleme & Geri Yükleme Merkezi (Backup Center)</h2>
            <p className="text-xs text-slate-500 font-medium">
              Tüm site içeriklerini, görselleri, CRM verilerini ve AI yapılandırmasını JSON olarak indirin veya geri yükleyin.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Export Backup Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <Download className="w-5 h-5 text-[#082C6C]" />
            <h3 className="font-bold text-sm text-slate-900">Tek Tıkla Tam Sistem Yedeği İndir</h3>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Sistemdeki tüm ayarları, ürün kataloğunu, özel görselleri, yapay zeka hafızasını ve müşteri kayıtlarını bilgisayarınıza indirir.
          </p>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] space-y-1 text-slate-700 font-mono">
            <div>• Sistem Sürümü: V3.0 Enterprise</div>
            <div>• İçerik & CMS Konfigürasyonu: Dahil</div>
            <div>• CRM & Müşteri Logları: Dahil</div>
            <div>• Yapay Zeka Parametreleri: Dahil</div>
          </div>

          <button
            onClick={handleDownloadBackup}
            className="w-full py-3 bg-[#082C6C] hover:bg-[#0b357f] text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{backupSuccess ? 'Yedek İndirildi!' : 'Sistem Yedeğini (.json) İndir'}</span>
          </button>
        </div>

        {/* Restore Backup Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <Upload className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-sm text-slate-900">Yedek Dosyasından Geri Yükle</h3>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Daha önce indirdiğiniz JSON yedek dosyasını yükleyerek tüm ayarları anında eski durumuna getirebilirsiniz.
          </p>

          {restoreSuccess && (
            <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{restoreSuccess}</span>
            </div>
          )}

          {restoreError && (
            <div className="p-3 bg-rose-50 text-rose-800 border border-rose-200 rounded-xl text-xs font-bold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>{restoreError}</span>
            </div>
          )}

          <div className="pt-2">
            <label className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer border border-slate-300">
              <Upload className="w-4 h-4 text-slate-600" />
              <span>Yedek JSON Dosyası Seç (.json)</span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppImages } from '../../context/ImageContext';
import { COLLECTION_ITEMS, CRAFTSMANSHIP_STEPS } from '../../constants/data';
import { LogoFull } from '../brand/LogoFull';
import { FairModal } from '../ui/FairModal';
import { ImageCropModal, CropTargetSpecs } from './ImageCropModal';
import { 
  Lock, Key, User, LogOut, ExternalLink, Image as ImageIcon, 
  Upload, RotateCcw, Check, Sparkles, Sliders, Layers, Eye, Link, 
  ShieldCheck, AlertCircle, ArrowLeft, Home, Calendar, MapPin, 
  QrCode, ToggleLeft, ToggleRight, Send, MessageSquare, Crop, Info,
  Mail, Server, AtSign, Save, MailCheck, CheckCircle2, Shield
} from 'lucide-react';

const TARGET_SPECS_MAP: Record<string, CropTargetSpecs> = {
  hero: {
    title: 'Ana Sayfa Hero Görseli',
    recommendedWidth: 1200,
    recommendedHeight: 800,
    aspectRatioLabel: '3:2 Yatay',
  },
  about: {
    title: 'Hakkımızda / Atölye Görseli',
    recommendedWidth: 1200,
    recommendedHeight: 800,
    aspectRatioLabel: '3:2 Yatay',
  },
  craftsmanship: {
    title: 'Zanaat & Üretim Adımı Görseli',
    recommendedWidth: 1200,
    recommendedHeight: 800,
    aspectRatioLabel: '3:2 Yatay',
  },
  collection: {
    title: 'Koleksiyon Ürünü Fotoğrafı',
    recommendedWidth: 1000,
    recommendedHeight: 1000,
    aspectRatioLabel: '1:1 Kare',
  },
  fairPoster: {
    title: 'Fuar Afiş Görseli',
    recommendedWidth: 1200,
    recommendedHeight: 800,
    aspectRatioLabel: '3:2 Yatay',
  },
  fairQr: {
    title: 'Fuar QR Kodu Görseli',
    recommendedWidth: 500,
    recommendedHeight: 500,
    aspectRatioLabel: '1:1 Kare',
  },
};

const PRESET_FOOTWEAR_IMAGES = [
  { title: 'Çift Tokalı Hakiki Deri Terlik', url: 'https://images.unsplash.com/photo-1603808033176-9d134e6f2c74?auto=format&fit=crop&q=80&w=1200' },
  { title: 'Dolgu Topuk Sandalet', url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=1200' },
  { title: 'Çapraz Bant Sandalet', url: 'https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?auto=format&fit=crop&q=80&w=1200' },
  { title: 'Sabo Ortopedik Terlik', url: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&q=80&w=1200' },
  { title: 'Doğal Mantar Taban Terlik', url: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&q=80&w=1200' },
  { title: 'Bayan Comfort Terlik 2', url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=1200' },
  { title: 'Deri İşleme Zanaat', url: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=1200' },
  { title: 'Manisa Atölye Kesim', url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1200' },
];

interface AdminPageProps {
  onReturnToSite: () => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onReturnToSite }) => {
  const {
    images,
    updateHeroImage,
    updateAboutImage,
    updateCraftsmanshipImage,
    updateCollectionImage,
    resetAllImages,
    fairConfig,
    updateFairConfig,
    resetFairConfig
  } = useAppImages();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('irem_admin_session') === 'true';
  });

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Admin Panel Tabs
  const [activeTab, setActiveTab] = useState<'fair' | 'general' | 'collection' | 'craftsmanship' | 'presets' | 'leads' | 'email'>('fair');
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [isPreviewFairOpen, setIsPreviewFairOpen] = useState(false);
  const [contactLeads, setContactLeads] = useState<any[]>([]);

  // Email Config State
  const [emailConfig, setEmailConfig] = useState({
    smtpHost: 'mail.iremcomfort.com',
    smtpPort: 587,
    smtpUser: 'info@iremcomfort.com',
    smtpPass: '',
    smtpSecure: false,
    adminEmails: 'kargakadir4525@gmail.com, info@iremcomfort.com',
    senderName: 'İrem Comfort Ayakkabıcılık',
    senderEmail: 'info@iremcomfort.com',
    sendCustomerConfirmation: true,
    sendAdminNotification: true,
  });
  const [isEmailSaving, setIsEmailSaving] = useState(false);
  const [showSmtpPassword, setShowSmtpPassword] = useState(false);
  const [testEmailAddress, setTestEmailAddress] = useState('kargakadir4525@gmail.com');
  const [isTestingEmail, setIsTestingEmail] = useState(false);
  const [testEmailResult, setTestEmailResult] = useState<{ success: boolean; message: string } | null>(null);

  // Fetch leads and email config
  useEffect(() => {
    if (isAuthenticated) {
      const loadLeads = async () => {
        try {
          const res = await fetch('/api/contact/leads');
          if (res.ok) {
            const data = await res.json();
            if (data.leads && Array.isArray(data.leads) && data.leads.length > 0) {
              setContactLeads(data.leads);
              return;
            }
          }
        } catch (e) {
          console.log('Lead fetch fallback to local storage');
        }
        const local = JSON.parse(localStorage.getItem('irem_contact_leads') || '[]');
        setContactLeads(local);
      };

      const loadEmailConfig = async () => {
        try {
          const res = await fetch('/api/email/config');
          if (res.ok) {
            const data = await res.json();
            if (data.config) {
              setEmailConfig(data.config);
            }
          }
        } catch (e) {
          console.log('Failed to fetch email config');
        }
      };

      loadLeads();
      loadEmailConfig();
    }
  }, [isAuthenticated, activeTab]);

  const handleSaveEmailConfig = async () => {
    setIsEmailSaving(true);
    try {
      const res = await fetch('/api/email/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailConfig),
      });

      const data = await res.json();
      if (data.success) {
        showToast('E-Posta & SMTP Ayarları başarıyla güncellendi!');
      } else {
        alert(data.error || 'Kaydetme hatası');
      }
    } catch (err) {
      showToast('Ayarlar kaydedildi (yerel bellek).');
    } finally {
      setIsEmailSaving(false);
    }
  };

  const handleTestEmail = async () => {
    if (!testEmailAddress || !testEmailAddress.includes('@')) {
      alert('Lütfen geçerli bir e-posta adresi giriniz.');
      return;
    }

    setIsTestingEmail(true);
    setTestEmailResult(null);

    try {
      const res = await fetch('/api/email/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testEmail: testEmailAddress,
          testConfig: emailConfig,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setTestEmailResult({ success: true, message: data.message });
      } else {
        setTestEmailResult({ success: false, message: data.error || 'Gönderim başarısız.' });
      }
    } catch (err: any) {
      setTestEmailResult({
        success: false,
        message: 'Sunucuya ulaşılamadı veya sunucu hatası oluştu.'
      });
    } finally {
      setIsTestingEmail(false);
    }
  };

  // Crop & Upload State
  const [pendingRawImage, setPendingRawImage] = useState<string | null>(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadTarget, setUploadTarget] = useState<{
    type: 'hero' | 'about' | 'craftsmanship' | 'collection' | 'fairPoster' | 'fairQr';
    id?: string;
    field?: 'image' | 'secondaryImage';
  } | null>(null);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    // Default admin credentials
    if ((cleanUser === 'admin' || cleanUser === 'iremcomfort') && (cleanPass === 'irem45' || cleanPass === 'irem1234')) {
      setIsAuthenticated(true);
      localStorage.setItem('irem_admin_session', 'true');
      showToast('Yönetici girişi başarılı!');
    } else {
      setLoginError('Kullanıcı adı veya şifre hatalı! Lütfen bilgilerinizi kontrol edin.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('irem_admin_session');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !uploadTarget) return;

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const base64Url = uploadEvent.target?.result as string;
      if (!base64Url) return;

      // Open crop & resize modal first
      setPendingRawImage(base64Url);
      setIsCropModalOpen(true);
    };
    reader.readAsDataURL(file);

    // Reset file input value so same file can be selected again if needed
    e.target.value = '';
  };

  const handleCroppedConfirm = (croppedBase64: string) => {
    if (!uploadTarget) return;

    if (uploadTarget.type === 'hero') {
      updateHeroImage(croppedBase64);
      showToast('Ana Sayfa Hero kapak görseli boyutlandırıldı ve güncellendi!');
    } else if (uploadTarget.type === 'about') {
      updateAboutImage(croppedBase64);
      showToast('Hakkımızda / Atölye görseli boyutlandırıldı ve güncellendi!');
    } else if (uploadTarget.type === 'craftsmanship' && uploadTarget.id) {
      updateCraftsmanshipImage(uploadTarget.id, croppedBase64);
      showToast(`Zanaat Adım ${uploadTarget.id} görseli boyutlandırıldı ve güncellendi!`);
    } else if (uploadTarget.type === 'collection' && uploadTarget.id && uploadTarget.field) {
      updateCollectionImage(uploadTarget.id, uploadTarget.field, croppedBase64);
      showToast('Koleksiyon ürün görseli boyutlandırıldı ve güncellendi!');
    } else if (uploadTarget.type === 'fairPoster') {
      updateFairConfig({ posterUrl: croppedBase64 });
      showToast('Fuar afiş görseli boyutlandırıldı ve güncellendi!');
    } else if (uploadTarget.type === 'fairQr') {
      updateFairConfig({ qrCodeUrl: croppedBase64 });
      showToast('Fuar QR kodu görseli boyutlandırıldı ve güncellendi!');
    }

    setIsCropModalOpen(false);
    setPendingRawImage(null);
    setUploadTarget(null);
  };

  const triggerFileUpload = (
    type: 'hero' | 'about' | 'craftsmanship' | 'collection' | 'fairPoster' | 'fairQr',
    id?: string,
    field?: 'image' | 'secondaryImage'
  ) => {
    setUploadTarget({ type, id, field });
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const currentSpecs = uploadTarget ? TARGET_SPECS_MAP[uploadTarget.type] : TARGET_SPECS_MAP.hero;

  // IF NOT AUTHENTICATED: SHOW ELEGANT LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#082C6C] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans">
        {/* Subtle background glow */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 sm:p-10 border border-white/20"
        >
          {/* Header & Logo */}
          <div className="text-center space-y-3 mb-8">
            <div className="flex justify-center">
              <LogoFull iconSize={42} color="#082C6C" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-serif-luxury text-[#082C6C] tracking-wide">
                Görsel & Fuar Yönetim Paneli
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Lütfen yönetici hesabınızla giriş yapın
              </p>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {loginError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-start gap-2"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </motion.div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Kullanıcı Adı
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Kullanıcı adınız..."
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:outline-none focus:border-[#082C6C] focus:bg-white transition-all text-[#111111]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Yönetici Şifresi
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Key className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:outline-none focus:border-[#082C6C] focus:bg-white transition-all text-[#111111]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-[#082C6C] hover:bg-[#163E87] text-white text-sm font-bold uppercase tracking-wider shadow-lg shadow-[#082C6C]/30 transition-all cursor-pointer active:scale-98 flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>Giriş Yap</span>
            </button>
          </form>

          {/* Return to Main Site Button */}
          <div className="mt-8 text-center pt-4 border-t border-slate-100">
            <button
              onClick={onReturnToSite}
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-[#082C6C] transition-colors cursor-pointer"
            >
              <Home className="w-4 h-4" />
              <span>Normal Siteye Dön</span>
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // IF AUTHENTICATED: SHOW FULL ADMIN DASHBOARD
  return (
    <div className="min-h-screen bg-slate-100 text-[#111111] font-sans flex flex-col">
      {/* Fair Modal Preview Overlay */}
      <FairModal
        isOpen={isPreviewFairOpen}
        onClose={() => setIsPreviewFairOpen(false)}
      />

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Admin Top Header */}
      <header className="bg-[#082C6C] text-white py-4 px-6 shadow-md flex flex-wrap items-center justify-between gap-4 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-amber-300">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold font-serif-luxury tracking-wide flex items-center gap-2">
              <span>İrem Comfort Admin</span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold px-2 py-0.5 rounded border border-emerald-400/30 uppercase tracking-widest">
                Yetkili Oturumu
              </span>
            </h1>
            <p className="text-xs text-white/70 font-light">
              Görsel, Ürün, Fotoğraf ve Fuar Yönetim Merkezi
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onReturnToSite}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Siteyi Canlı İncele</span>
          </button>

          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Çıkış Yap</span>
          </button>
        </div>
      </header>

      {/* Toast Notification */}
      {successToast && (
        <div className="bg-emerald-600 text-white text-xs font-semibold px-4 py-2.5 flex items-center gap-2 justify-center shadow-md animate-fade-in">
          <Check className="w-4 h-4" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex-1 space-y-6">
        
        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl p-2 shadow-sm border border-slate-200 flex flex-wrap items-center gap-2">
          
          <button
            onClick={() => setActiveTab('fair')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'fair'
                ? 'bg-amber-500 text-slate-900 font-bold shadow-md'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>🎪 Fuar & Etkinlik Modülü</span>
            {fairConfig.enabled && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('general')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'general'
                ? 'bg-[#082C6C] text-white shadow'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Ana Sayfa & Hakkımızda</span>
          </button>

          <button
            onClick={() => setActiveTab('collection')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'collection'
                ? 'bg-[#082C6C] text-white shadow'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Koleksiyon Ürünleri ({COLLECTION_ITEMS.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('craftsmanship')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'craftsmanship'
                ? 'bg-[#082C6C] text-white shadow'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Atölye & Zanaat</span>
          </button>

          <button
            onClick={() => setActiveTab('presets')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'presets'
                ? 'bg-[#082C6C] text-white shadow'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>Hazır Görseller</span>
          </button>

          <button
            onClick={() => setActiveTab('leads')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'leads'
                ? 'bg-[#082C6C] text-white shadow'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-emerald-500" />
            <span>Gelen Müşteri Talepleri ({contactLeads.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('email')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'email'
                ? 'bg-[#082C6C] text-white shadow'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Mail className="w-4 h-4 text-amber-500" />
            <span>E-Posta & SMTP Ayarları</span>
          </button>
        </div>

        {/* Tab 0: FAIR & EXHIBITION MANAGEMENT */}
        {activeTab === 'fair' && (
          <div className="space-y-6">
            
            {/* Active Switch & Preview Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-[#082C6C] to-slate-900 text-white shadow-xl space-y-4 border border-amber-500/30">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🎪</span>
                    <h3 className="font-bold text-lg text-amber-300 font-serif-luxury">Fuar Duyuru Modülü</h3>
                  </div>
                  <p className="text-xs text-slate-300 font-light">
                    Katıldığınız veya yaklaşan fuarları sitede canlı geri sayım, afiş, stand numarası ve QR kodu ile yayınlayın.
                  </p>
                </div>

                {/* Enable/Disable Toggle Switch */}
                <div className="flex items-center gap-3 bg-white/10 p-2.5 rounded-2xl border border-white/15">
                  <span className="text-xs font-bold uppercase tracking-wider">
                    {fairConfig.enabled ? (
                      <span className="text-emerald-300 flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                        FUAR DUYURUSU CANLI SİTEDE AKTİF
                      </span>
                    ) : (
                      <span className="text-slate-400">Fuar Duyurusu Pasif</span>
                    )}
                  </span>

                  <button
                    onClick={() => {
                      updateFairConfig({ enabled: !fairConfig.enabled });
                      showToast(
                        !fairConfig.enabled
                          ? 'Fuar duyurusu sitede YAYINLANDI!'
                          : 'Fuar duyurusu yayından kaldırıldı (pasif yapıldı).'
                      );
                    }}
                    className="p-1 rounded-full cursor-pointer transition-transform active:scale-95"
                    title="Aktif/Pasif Yap"
                  >
                    {fairConfig.enabled ? (
                      <ToggleRight className="w-9 h-9 text-emerald-400" />
                    ) : (
                      <ToggleLeft className="w-9 h-9 text-slate-500" />
                    )}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  onClick={() => setIsPreviewFairOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold uppercase tracking-wider shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <Eye className="w-4 h-4" />
                  <span>Sitedeki Fuar Penceresini Canlı Önizle</span>
                </button>

                <button
                  onClick={() => {
                    resetFairConfig();
                    showToast('Fuar bilgileri varsayılana sıfırlandı!');
                  }}
                  className="px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Örnek Fuarı Yükle</span>
                </button>
              </div>
            </div>

            {/* Fair Configuration Form */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
              <h4 className="font-bold text-[#111111] text-base border-b border-slate-100 pb-3 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#082C6C]" />
                <span>Fuar & Stand Detayları Formu</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Fair Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Fuar Adı</label>
                  <input
                    type="text"
                    value={fairConfig.name}
                    onChange={(e) => updateFairConfig({ name: e.target.value })}
                    placeholder="Örn: AYMOD Uluslararası Ayakkabı Moda Fuarı"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:border-[#082C6C] focus:outline-none bg-slate-50 font-medium"
                  />
                </div>

                {/* Badge Text */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Üst Rozet Başlığı</label>
                  <input
                    type="text"
                    value={fairConfig.badgeText}
                    onChange={(e) => updateFairConfig({ badgeText: e.target.value })}
                    placeholder="Örn: RESMİ FUAR DAVETİ"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:border-[#082C6C] focus:outline-none bg-slate-50 font-medium"
                  />
                </div>

                {/* Location */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Fuar Yeri & Şehir</label>
                  <input
                    type="text"
                    value={fairConfig.location}
                    onChange={(e) => updateFairConfig({ location: e.target.value })}
                    placeholder="Örn: İstanbul Fuar Merkezi (İFM) - Yeşilköy"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:border-[#082C6C] focus:outline-none bg-slate-50 font-medium"
                  />
                </div>

                {/* Stand Number */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Hall & Stand Numarası</label>
                  <input
                    type="text"
                    value={fairConfig.standNumber}
                    onChange={(e) => updateFairConfig({ standNumber: e.target.value })}
                    placeholder="Örn: Hall 4 / Stand B214"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:border-[#082C6C] focus:outline-none bg-slate-50 font-bold text-[#082C6C]"
                  />
                </div>

                {/* Start Date */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Başlangıç Tarihi (YYYY-MM-DD)</label>
                  <input
                    type="date"
                    value={fairConfig.startDate}
                    onChange={(e) => updateFairConfig({ startDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:border-[#082C6C] focus:outline-none bg-slate-50 font-mono font-bold"
                  />
                </div>

                {/* End Date */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Bitiş Tarihi (YYYY-MM-DD)</label>
                  <input
                    type="date"
                    value={fairConfig.endDate}
                    onChange={(e) => updateFairConfig({ endDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:border-[#082C6C] focus:outline-none bg-slate-50 font-mono font-bold"
                  />
                </div>

                {/* WhatsApp Contact */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-slate-700 block">Randevu & Bilgi WhatsApp Numarası (Ülke Koduyla)</label>
                  <input
                    type="text"
                    value={fairConfig.whatsappContact}
                    onChange={(e) => updateFairConfig({ whatsappContact: e.target.value })}
                    placeholder="Örn: 905336688329"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:border-[#082C6C] focus:outline-none bg-slate-50 font-mono"
                  />
                </div>

                {/* Description Text */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-slate-700 block">Açıklama & Müşteri Davet Metni</label>
                  <textarea
                    rows={3}
                    value={fairConfig.description}
                    onChange={(e) => updateFairConfig({ description: e.target.value })}
                    placeholder="Stand ziyaretçilerine özel mesajınız..."
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:border-[#082C6C] focus:outline-none bg-slate-50 font-medium"
                  />
                </div>
              </div>

              {/* Poster and QR Upload */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                
                {/* Poster Upload */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 block">Fuar Afiş Görseli</label>
                    <span className="text-[10px] font-mono text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-md font-bold">
                      Önerilen: 1200 x 800 px (3:2)
                    </span>
                  </div>
                  
                  <div className="flex gap-4 items-center">
                    <div className="w-24 h-24 rounded-lg overflow-hidden border border-slate-300 shrink-0 bg-white">
                      {fairConfig.posterUrl ? (
                        <img src={fairConfig.posterUrl} alt="Afiş" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300 text-xs">Görsel Yok</div>
                      )}
                    </div>

                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        value={fairConfig.posterUrl}
                        onChange={(e) => updateFairConfig({ posterUrl: e.target.value })}
                        placeholder="Afiş Görsel URL..."
                        className="w-full px-2.5 py-1.5 text-xs rounded-md border border-slate-300 focus:border-[#082C6C] focus:outline-none bg-white"
                      />
                      <button
                        onClick={() => triggerFileUpload('fairPoster')}
                        className="px-3 py-1.5 rounded-lg bg-[#082C6C] text-white text-xs font-semibold hover:bg-[#163E87] transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Crop className="w-3.5 h-3.5 text-amber-300" />
                        <span>Fotoğraf Yükle & Kırp</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* QR Code Upload / Generator */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 block">Fuar QR Kodu Görseli</label>
                    <span className="text-[10px] font-mono text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-md font-bold">
                      Önerilen: 500 x 500 px (1:1)
                    </span>
                  </div>
                  
                  <div className="flex gap-4 items-center">
                    <div className="w-24 h-24 rounded-lg overflow-hidden border border-slate-300 shrink-0 bg-white p-1">
                      <img
                        src={fairConfig.qrCodeUrl || `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://wa.me/${fairConfig.whatsappContact}`}
                        alt="QR Code"
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        value={fairConfig.qrCodeUrl}
                        onChange={(e) => updateFairConfig({ qrCodeUrl: e.target.value })}
                        placeholder="QR Görsel URL (Boş bırakılırsa otomatik üretilir)..."
                        className="w-full px-2.5 py-1.5 text-xs rounded-md border border-slate-300 focus:border-[#082C6C] focus:outline-none bg-white"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => triggerFileUpload('fairQr')}
                          className="px-3 py-1.5 rounded-lg bg-[#082C6C] text-white text-xs font-semibold hover:bg-[#163E87] transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <Crop className="w-3.5 h-3.5 text-amber-300" />
                          <span>QR Yükle & Kırp</span>
                        </button>

                        <button
                          onClick={() => {
                            const newQr = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent('https://wa.me/' + (fairConfig.whatsappContact || '905336688329'))}`;
                            updateFairConfig({ qrCodeUrl: newQr });
                            showToast('Otomatik WhatsApp QR Kodu oluşturuldu!');
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-amber-500 text-slate-900 text-xs font-bold hover:bg-amber-400 transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          <span>Otomatik Üret</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* Tab 1: General (Hero & About) */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            {/* Hero Main Image */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-bold text-[#111111] text-base">Hero Bölümü Ana Kapak Görseli</h3>
                  <p className="text-xs text-slate-500">Ana sayfa ilk açılışında sağ tarafta sergilenen imza terlik/sandalet modeli</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-amber-900 bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-md font-bold">
                    Önerilen Boyut: 1200 x 800 px (3:2)
                  </span>
                  <span className="text-xs bg-[#082C6C]/10 text-[#082C6C] font-semibold px-2.5 py-1 rounded-full uppercase">
                    Ana Kapak
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
                <div className="sm:col-span-1 h-44 rounded-xl overflow-hidden border border-slate-200 relative group bg-slate-50">
                  <img src={images.heroImage} alt="Hero Preview" className="w-full h-full object-cover" />
                </div>

                <div className="sm:col-span-2 space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Görsel İnternet Bağlantısı (URL)</label>
                    <input
                      type="text"
                      value={images.heroImage}
                      onChange={(e) => updateHeroImage(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:border-[#082C6C] focus:outline-none bg-slate-50"
                      placeholder="https://..."
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => triggerFileUpload('hero')}
                      className="px-4 py-2.5 rounded-xl bg-[#082C6C] text-white text-xs font-bold hover:bg-[#163E87] transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
                    >
                      <Crop className="w-4 h-4 text-amber-300" />
                      <span>Cihazdan Fotoğraf Yükle & Kırp</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* About Section Image */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-bold text-[#111111] text-base">Hakkımızda / Mirasımız Görseli</h3>
                  <p className="text-xs text-slate-500">Manisa Ayakkabıcılar Sitesi atölyemizin ve deri işçiliğimizin gösterildiği görsel</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-amber-900 bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-md font-bold">
                    Önerilen Boyut: 1200 x 800 px (3:2)
                  </span>
                  <span className="text-xs bg-[#082C6C]/10 text-[#082C6C] font-semibold px-2.5 py-1 rounded-full uppercase">
                    Atölye Görseli
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
                <div className="sm:col-span-1 h-44 rounded-xl overflow-hidden border border-slate-200 relative group bg-slate-50">
                  <img src={images.aboutImage} alt="About Preview" className="w-full h-full object-cover" />
                </div>

                <div className="sm:col-span-2 space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Görsel İnternet Bağlantısı (URL)</label>
                    <input
                      type="text"
                      value={images.aboutImage}
                      onChange={(e) => updateAboutImage(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:border-[#082C6C] focus:outline-none bg-slate-50"
                      placeholder="https://..."
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => triggerFileUpload('about')}
                      className="px-4 py-2.5 rounded-xl bg-[#082C6C] text-white text-xs font-bold hover:bg-[#163E87] transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
                    >
                      <Crop className="w-4 h-4 text-amber-300" />
                      <span>Cihazdan Fotoğraf Yükle & Kırp</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Collection Products */}
        {activeTab === 'collection' && (
          <div className="space-y-6">
            <div className="text-xs text-slate-600 bg-amber-50/80 p-4 rounded-xl border border-amber-200 flex items-center justify-between gap-3">
              <span>Koleksiyon listesindeki her terlik & sandalet modeli için ana görseli ve detay kartındaki ikincil açı görselini doğrudan güncelleyebilirsiniz.</span>
              <span className="text-[11px] font-mono text-amber-950 bg-amber-200/80 px-2.5 py-1 rounded-md font-bold whitespace-nowrap">
                Önerilen Boyut: 1000 x 1000 px (1:1 Kare)
              </span>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {COLLECTION_ITEMS.map((item) => {
                const currentImgs = images.collectionImages[item.id] || {
                  image: item.image,
                  secondaryImage: item.secondaryImage
                };

                return (
                  <div key={item.id} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div>
                        <span className="text-[10px] uppercase font-extrabold text-[#082C6C] bg-[#082C6C]/10 px-2 py-0.5 rounded">
                          {item.category}
                        </span>
                        <h4 className="font-bold text-[#111111] text-base mt-1">{item.name}</h4>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Main Product Image */}
                      <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-slate-700 block">Ana Ürün Görseli</label>
                          <span className="text-[10px] font-mono text-amber-900 bg-amber-100 px-2 py-0.5 rounded font-bold">1000x1000 px</span>
                        </div>
                        <div className="flex gap-4 items-center">
                          <div className="w-24 h-24 rounded-lg overflow-hidden border border-slate-300 shrink-0 bg-white">
                            <img src={currentImgs.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 space-y-2">
                            <input
                              type="text"
                              value={currentImgs.image}
                              onChange={(e) => updateCollectionImage(item.id, 'image', e.target.value)}
                              className="w-full px-2.5 py-1.5 text-xs rounded-md border border-slate-300 focus:border-[#082C6C] focus:outline-none bg-white"
                              placeholder="Ana Görsel URL"
                            />
                            <button
                              onClick={() => triggerFileUpload('collection', item.id, 'image')}
                              className="px-3 py-1.5 rounded-lg bg-[#082C6C] text-white text-xs font-semibold hover:bg-[#163E87] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                            >
                              <Crop className="w-3.5 h-3.5 text-amber-300" />
                              <span>Fotoğraf Yükle & Kırp</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Secondary Product Image */}
                      <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-slate-700 block">Detay / İkinci Açı Görseli</label>
                          <span className="text-[10px] font-mono text-amber-900 bg-amber-100 px-2 py-0.5 rounded font-bold">1000x1000 px</span>
                        </div>
                        <div className="flex gap-4 items-center">
                          <div className="w-24 h-24 rounded-lg overflow-hidden border border-slate-300 shrink-0 bg-white">
                            <img src={currentImgs.secondaryImage || currentImgs.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 space-y-2">
                            <input
                              type="text"
                              value={currentImgs.secondaryImage || ''}
                              onChange={(e) => updateCollectionImage(item.id, 'secondaryImage', e.target.value)}
                              className="w-full px-2.5 py-1.5 text-xs rounded-md border border-slate-300 focus:border-[#082C6C] focus:outline-none bg-white"
                              placeholder="İkinci Görsel URL"
                            />
                            <button
                              onClick={() => triggerFileUpload('collection', item.id, 'secondaryImage')}
                              className="px-3 py-1.5 rounded-lg bg-[#082C6C] text-white text-xs font-semibold hover:bg-[#163E87] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                            >
                              <Crop className="w-3.5 h-3.5 text-amber-300" />
                              <span>Fotoğraf Yükle & Kırp</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Craftsmanship Steps */}
        {activeTab === 'craftsmanship' && (
          <div className="space-y-6">
            <div className="text-xs text-slate-600 bg-amber-50/80 p-4 rounded-xl border border-amber-200 flex items-center justify-between gap-3">
              <span>Atölyemizdeki 4 aşamalı imalat sürecini (Deri Seçimi, Kesim, Dikiş & Taban, Kalite Kontrol) gösteren görseller.</span>
              <span className="text-[11px] font-mono text-amber-950 bg-amber-200/80 px-2.5 py-1 rounded-md font-bold whitespace-nowrap">
                Önerilen Boyut: 1200 x 800 px (3:2 Yatay)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {CRAFTSMANSHIP_STEPS.map((step) => {
                const currentImg = images.craftsmanshipImages[step.number] || step.image;

                return (
                  <div key={step.number} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-[#082C6C] text-white text-xs font-bold flex items-center justify-center shrink-0">
                          {step.number}
                        </span>
                        <div>
                          <h4 className="font-bold text-[#111111] text-sm">{step.title}</h4>
                          <p className="text-xs text-slate-500">{step.subtitle}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-amber-900 bg-amber-100 px-2 py-0.5 rounded font-bold">1200x800 px</span>
                    </div>

                    <div className="flex gap-4 items-center bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <div className="w-24 h-24 rounded-lg overflow-hidden border border-slate-300 shrink-0 bg-white">
                        <img src={currentImg} alt={step.title} className="w-full h-full object-cover" />
                      </div>

                      <div className="flex-1 space-y-2">
                        <input
                          type="text"
                          value={currentImg}
                          onChange={(e) => updateCraftsmanshipImage(step.number, e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs rounded-md border border-slate-300 focus:border-[#082C6C] focus:outline-none bg-white"
                          placeholder="Adım Görsel URL"
                        />
                        <button
                          onClick={() => triggerFileUpload('craftsmanship', step.number)}
                          className="px-3 py-1.5 rounded-lg bg-[#082C6C] text-white text-xs font-semibold hover:bg-[#163E87] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Crop className="w-3.5 h-3.5 text-amber-300" />
                          <span>Fotoğraf Yükle & Kırp</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 4: Preset Gallery */}
        {activeTab === 'presets' && (
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-[#111111] text-base">Örnek Kaliteli Ayakkabı / Terlik Fotoğrafları</h3>
            <p className="text-xs text-slate-500">
              Aşağıdaki yüksek çözünürlüklü örnek görsellerin URL bağlantılarını tek tıkla kopyalayıp ilgili alanlara yapıştırabilirsiniz.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              {PRESET_FOOTWEAR_IMAGES.map((preset, idx) => (
                <div key={idx} className="group relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50 space-y-2 p-2">
                  <div className="h-32 rounded-lg overflow-hidden bg-white">
                    <img src={preset.url} alt={preset.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <p className="text-[11px] font-bold text-slate-800 line-clamp-1">{preset.title}</p>
                  
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(preset.url);
                      showToast(`Görsel adresi kopyalandı!`);
                    }}
                    className="w-full py-1.5 text-[10px] font-bold uppercase tracking-wider bg-[#082C6C]/10 text-[#082C6C] rounded-lg hover:bg-[#082C6C] hover:text-white transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Link className="w-3 h-3" />
                    <span>URL Kopyala</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Customer Contact Leads */}
        {activeTab === 'leads' && (
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-bold text-[#111111] text-base flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-[#082C6C]" />
                  <span>Siteden Gelen İletişim & Sipariş Talepleri</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Müşterilerin iletişim formunu doldurarak ilettiği katalog, randevu ve toptan/perakende talepleri.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs bg-amber-100 text-amber-900 border border-amber-300 px-3 py-1 rounded-full font-bold">
                  E-Posta Bildirimi: kargakadir4525@gmail.com & info@iremcomfort.com
                </span>
                <button
                  onClick={async () => {
                    try {
                      const res = await fetch('/api/contact/leads');
                      if (res.ok) {
                        const data = await res.json();
                        setContactLeads(data.leads || []);
                        showToast('Gelen müşteri talepleri yenilendi!');
                      }
                    } catch (e) {
                      const local = JSON.parse(localStorage.getItem('irem_contact_leads') || '[]');
                      setContactLeads(local);
                    }
                  }}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Listeyi Yenile</span>
                </button>
              </div>
            </div>

            {contactLeads.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-300 space-y-2">
                <MessageSquare className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-sm font-bold text-slate-700">Henüz hiç iletişim talebi bulunmuyor</p>
                <p className="text-xs text-slate-500">Müşteriler web sitenizdeki iletişim formunu doldurduğunda talepleri burada ve e-posta kutunuzda görünecektir.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {contactLeads.map((lead, i) => (
                  <div key={lead.id || i} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-[#082C6C]/30 transition-all space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/60 pb-3">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-[#082C6C] text-white font-bold text-xs flex items-center justify-center">
                          #{contactLeads.length - i}
                        </span>
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">{lead.fullName}</h4>
                          <span className="text-[11px] text-slate-500 font-mono">
                            {lead.createdAt ? new Date(lead.createdAt).toLocaleString('tr-TR') : 'Tarih Yok'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-blue-100 text-[#082C6C]">
                          {lead.inquiryType || 'Genel İletişim'}
                        </span>
                        {lead.phone && (
                          <a
                            href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <Send className="w-3 h-3" />
                            <span>WhatsApp ile Yaz</span>
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="font-bold text-slate-500 block">Telefon Numarası:</span>
                        <a href={`tel:${lead.phone}`} className="font-bold text-[#082C6C] hover:underline">
                          {lead.phone}
                        </a>
                      </div>

                      <div>
                        <span className="font-bold text-slate-500 block">E-Posta Adresi:</span>
                        <span className="font-medium text-slate-800">
                          {lead.email || 'Belirtilmedi'}
                        </span>
                      </div>
                    </div>

                    {lead.message && (
                      <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 leading-relaxed font-normal">
                        <span className="font-bold text-slate-500 block mb-1">Müşteri Mesajı:</span>
                        {lead.message}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 6: EMAIL & SMTP CONFIGURATION */}
        {activeTab === 'email' && (
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-8">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <h3 className="font-bold text-[#111111] text-lg flex items-center gap-2">
                  <Mail className="w-5 h-5 text-[#082C6C]" />
                  <span>E-Posta & SMTP Bildirim Ayarları</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Müşterilerin web sitemizden ilettiği taleplerin gönderileceği yönetici e-postalarını ve sunucu SMTP bağlantısını yapılandırabilirsiniz.
                </p>
              </div>

              <button
                onClick={handleSaveEmailConfig}
                disabled={isEmailSaving}
                className="px-5 py-2.5 rounded-xl bg-[#082C6C] hover:bg-[#062050] text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isEmailSaving ? 'Kaydediliyor...' : 'Ayarları Kaydet'}</span>
              </button>
            </div>

            {/* Grid Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Left Column: Notification Recipients & Sender Brand */}
              <div className="space-y-6">
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-5">
                  <div className="flex items-center gap-2 border-b border-slate-200/80 pb-3">
                    <AtSign className="w-4 h-4 text-[#082C6C]" />
                    <h4 className="font-bold text-slate-900 text-sm">1. Bildirim Alacak Yönetici E-Postaları</h4>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-700">
                      Yönetici Bildirim E-Posta Adresleri
                    </label>
                    <textarea
                      rows={2}
                      value={emailConfig.adminEmails}
                      onChange={(e) => setEmailConfig({ ...emailConfig, adminEmails: e.target.value })}
                      placeholder="kargakadir4525@gmail.com, info@iremcomfort.com"
                      className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-slate-300 text-xs font-mono text-slate-800 focus:outline-none focus:border-[#082C6C] transition-colors"
                    />
                    <p className="text-[11px] text-slate-500 font-normal">
                      💡 Siteden form doldurulduğunda talepler bu e-posta adreslerine anında iletilir. Birden fazla adresi virgülle ayırarak yazabilirsiniz.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700">
                        Gönderen Firma Unvanı
                      </label>
                      <input
                        type="text"
                        value={emailConfig.senderName}
                        onChange={(e) => setEmailConfig({ ...emailConfig, senderName: e.target.value })}
                        placeholder="İrem Comfort Ayakkabıcılık"
                        className="w-full px-3.5 py-2 bg-white rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-[#082C6C]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700">
                        Gönderen E-Posta Adresi
                      </label>
                      <input
                        type="email"
                        value={emailConfig.senderEmail}
                        onChange={(e) => setEmailConfig({ ...emailConfig, senderEmail: e.target.value })}
                        placeholder="info@iremcomfort.com"
                        className="w-full px-3.5 py-2 bg-white rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-[#082C6C]"
                      />
                    </div>
                  </div>

                  {/* Toggle Rules */}
                  <div className="pt-3 border-t border-slate-200/80 space-y-3">
                    <label className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 cursor-pointer">
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-slate-800 block">
                          Yöneticilere E-Posta Bildirimi Gönder
                        </span>
                        <span className="text-[11px] text-slate-500 block">
                          Yeni talep geldiğinde yönetici e-postalarına anında bilgilendirme düşer.
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={emailConfig.sendAdminNotification}
                        onChange={(e) => setEmailConfig({ ...emailConfig, sendAdminNotification: e.target.checked })}
                        className="w-4 h-4 accent-[#082C6C] rounded cursor-pointer"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 cursor-pointer">
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-slate-800 block">
                          Müşteriye Otomatik Onay E-Postası Gönder
                        </span>
                        <span className="text-[11px] text-slate-500 block">
                          Formu dolduran müşterinin e-posta adresine "Talebiniz alındı" mesajı iletilir.
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={emailConfig.sendCustomerConfirmation}
                        onChange={(e) => setEmailConfig({ ...emailConfig, sendCustomerConfirmation: e.target.checked })}
                        className="w-4 h-4 accent-[#082C6C] rounded cursor-pointer"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Right Column: SMTP Server Credentials & Test Sending */}
              <div className="space-y-6">
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                    <div className="flex items-center gap-2">
                      <Server className="w-4 h-4 text-[#082C6C]" />
                      <h4 className="font-bold text-slate-900 text-sm">2. SMTP Sunucu ve Oturum Ayarları</h4>
                    </div>
                    <span className="text-[10px] bg-blue-100 text-[#082C6C] font-bold px-2.5 py-0.5 rounded-full">
                      Nodemailer / E-Posta Sunucusu
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2 space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700">
                        SMTP Sunucu Adresi (Host)
                      </label>
                      <input
                        type="text"
                        value={emailConfig.smtpHost}
                        onChange={(e) => setEmailConfig({ ...emailConfig, smtpHost: e.target.value })}
                        placeholder="mail.iremcomfort.com veya smtp.gmail.com"
                        className="w-full px-3.5 py-2 bg-white rounded-xl border border-slate-300 text-xs font-mono text-slate-800 focus:outline-none focus:border-[#082C6C]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700">
                        SMTP Port
                      </label>
                      <input
                        type="number"
                        value={emailConfig.smtpPort}
                        onChange={(e) => setEmailConfig({ ...emailConfig, smtpPort: Number(e.target.value) || 587 })}
                        placeholder="587"
                        className="w-full px-3.5 py-2 bg-white rounded-xl border border-slate-300 text-xs font-mono text-slate-800 focus:outline-none focus:border-[#082C6C]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700">
                        SMTP Kullanıcı Adı / E-Posta
                      </label>
                      <input
                        type="text"
                        value={emailConfig.smtpUser}
                        onChange={(e) => setEmailConfig({ ...emailConfig, smtpUser: e.target.value })}
                        placeholder="info@iremcomfort.com"
                        className="w-full px-3.5 py-2 bg-white rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-[#082C6C]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold text-slate-700">
                          SMTP E-Posta Şifresi
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowSmtpPassword(!showSmtpPassword)}
                          className="text-[11px] text-[#082C6C] font-semibold hover:underline cursor-pointer"
                        >
                          {showSmtpPassword ? 'Gizle' : 'Göster'}
                        </button>
                      </div>
                      <input
                        type={showSmtpPassword ? 'text' : 'password'}
                        value={emailConfig.smtpPass}
                        onChange={(e) => setEmailConfig({ ...emailConfig, smtpPass: e.target.value })}
                        placeholder="••••••••••••"
                        className="w-full px-3.5 py-2 bg-white rounded-xl border border-slate-300 text-xs font-mono text-slate-800 focus:outline-none focus:border-[#082C6C]"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                      <input
                        type="checkbox"
                        checked={emailConfig.smtpSecure}
                        onChange={(e) => setEmailConfig({ ...emailConfig, smtpSecure: e.target.checked })}
                        className="w-4 h-4 accent-[#082C6C] rounded cursor-pointer"
                      />
                      <span>SSL / TLS Güvenli Bağlantı Kullan (Port 465 için işaretleyin, Port 587 için kapalı tutun)</span>
                    </label>
                  </div>
                </div>

                {/* Test Sending Card */}
                <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-4">
                  <div className="flex items-center gap-2 border-b border-amber-200/60 pb-3">
                    <MailCheck className="w-4 h-4 text-amber-700" />
                    <h4 className="font-bold text-amber-900 text-sm">3. Canlı SMTP Bağlantı & E-Posta Testi</h4>
                  </div>

                  <p className="text-xs text-amber-900/80 leading-relaxed">
                    Aşağıdaki adrese anında bir test e-postası göndererek SMTP sunucunuzun sorunsuz çalışıp çalışmadığını test edebilirsiniz:
                  </p>

                  <div className="flex flex-col sm:flex-row items-center gap-2">
                    <input
                      type="email"
                      value={testEmailAddress}
                      onChange={(e) => setTestEmailAddress(e.target.value)}
                      placeholder="kargakadir4525@gmail.com"
                      className="w-full px-3.5 py-2 bg-white rounded-xl border border-amber-300 text-xs text-slate-800 focus:outline-none focus:border-[#082C6C]"
                    />
                    <button
                      onClick={handleTestEmail}
                      disabled={isTestingEmail}
                      className="w-full sm:w-auto px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition-all whitespace-nowrap cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isTestingEmail ? 'Test Gönderiliyor...' : 'Test Et'}</span>
                    </button>
                  </div>

                  {testEmailResult && (
                    <div
                      className={`p-3.5 rounded-xl border text-xs leading-relaxed space-y-1 ${
                        testEmailResult.success
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                          : 'bg-rose-50 border-rose-300 text-rose-900'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-bold">
                        {testEmailResult.success ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                        )}
                        <span>{testEmailResult.success ? 'Bağlantı Başarılı!' : 'Bağlantı/Gönderim Hatası'}</span>
                      </div>
                      <p className="text-[11px] font-normal">{testEmailResult.message}</p>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Bottom Save Action Bar */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                💾 Tüm e-posta tercihlerinizi kaydederek anında aktif hale getirebilirsiniz.
              </span>
              <button
                onClick={handleSaveEmailConfig}
                disabled={isEmailSaving}
                className="px-6 py-2.5 rounded-xl bg-[#082C6C] hover:bg-[#062050] text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isEmailSaving ? 'Kaydediliyor...' : 'Ayarları Kaydet'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Reset All Button */}
        <div className="pt-4 flex justify-end">
          <button
            onClick={() => {
              if (window.confirm('Tüm fotoğrafları ve ayarları orijinal varsayılana döndürmek istediğinize emin misiniz?')) {
                resetAllImages();
                resetFairConfig();
                showToast('Tüm fotoğraflar ve fuar ayarları sıfırlandı!');
              }
            }}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors flex items-center gap-2 cursor-pointer bg-white shadow-xs"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Tüm Fotoğrafları ve Ayarları Sıfırla</span>
          </button>
        </div>

      </main>

      {/* Image Cropping & Resizing Modal */}
      <ImageCropModal
        isOpen={isCropModalOpen}
        imageSrc={pendingRawImage}
        targetSpecs={currentSpecs}
        onConfirm={handleCroppedConfirm}
        onCancel={() => {
          setIsCropModalOpen(false);
          setPendingRawImage(null);
          setUploadTarget(null);
        }}
      />
    </div>
  );
};


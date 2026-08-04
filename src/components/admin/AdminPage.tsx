import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppImages } from '../../context/ImageContext';
import { COLLECTION_ITEMS, CRAFTSMANSHIP_STEPS } from '../../constants/data';
import { LogoFull } from '../brand/LogoFull';
import { FairModal } from '../ui/FairModal';
import { ImageCropModal, CropTargetSpecs } from './ImageCropModal';
import { FaqAdminTab } from './FaqAdminTab';
import { EMAIL_TEMPLATES, renderEmailHtml } from '../../utils/emailTemplates';
import { 
  Lock, Key, User, LogOut, ExternalLink, Image as ImageIcon, 
  Upload, RotateCcw, Check, Sparkles, Sliders, Layers, Eye, Link, 
  ShieldCheck, AlertCircle, ArrowLeft, Home, Calendar, MapPin, 
  QrCode, ToggleLeft, ToggleRight, Send, MessageSquare, Crop, Info,
  Mail, Server, AtSign, Save, MailCheck, CheckCircle2, Shield,
  Users, Download, Copy, Trash2, Plus, Search, Phone, HelpCircle
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
  aboutSlide: {
    title: 'Mirasımız & Atölyemiz Slayt Görseli',
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
    heroConfig,
    updateHeroConfig,
    resetHeroConfig,
    fairConfig,
    updateFairConfig,
    resetFairConfig,
    contactData,
    updateContactData,
    resetContactData,
    announcements,
    updateAnnouncements,
    resetAnnouncements,
    collectionItems,
    updateCollectionItem,
    addCollectionItem,
    deleteCollectionItem,
    resetCollectionItems,
    craftsmanshipSteps,
    updateCraftsmanshipStep,
    resetCraftsmanshipSteps,
    aboutSlides,
    updateAboutSlide,
    addAboutSlide,
    deleteAboutSlide,
    moveAboutSlide,
    resetAboutSlides
  } = useAppImages();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('irem_admin_session') === 'true';
  });

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Admin Panel Tabs
  const [activeTab, setActiveTab] = useState<'fair' | 'general' | 'collection' | 'craftsmanship' | 'faq' | 'contact' | 'presets' | 'leads' | 'newsletter' | 'email'>('fair');

  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [isPreviewFairOpen, setIsPreviewFairOpen] = useState(false);
  const [contactLeads, setContactLeads] = useState<any[]>([]);

  // Newsletter Subscribers & Builder State
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [subscriberSearch, setSubscriberSearch] = useState('');
  const [newSubEmail, setNewSubEmail] = useState('');
  const [isSubscribersLoading, setIsSubscribersLoading] = useState(false);

  // Newsletter Template Builder State
  const [newsletterSubTab, setNewsletterSubTab] = useState<'builder' | 'subscribers'>('builder');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('catalog');
  const [newsletterSubject, setNewsletterSubject] = useState('');
  const [newsletterBadge, setNewsletterBadge] = useState('');
  const [newsletterTitle, setNewsletterTitle] = useState('');
  const [newsletterSubtitle, setNewsletterSubtitle] = useState('');
  const [newsletterBody, setNewsletterBody] = useState('');
  const [newsletterCtaText, setNewsletterCtaText] = useState('');
  const [newsletterCtaUrl, setNewsletterCtaUrl] = useState('');
  const [newsletterBanner, setNewsletterBanner] = useState('');
  const [newsletterOfferBox, setNewsletterOfferBox] = useState('');
  const [isSendingBulk, setIsSendingBulk] = useState(false);
  const [bulkSendResult, setBulkSendResult] = useState<any>(null);
  const [previewTab, setPreviewTab] = useState<'edit' | 'html_preview'>('edit');

  // Announcement Ticker Input State
  const [newAnnouncementText, setNewAnnouncementText] = useState('');

  // Function to apply default values for selected email template
  const applyTemplateDefaults = (tplId: string) => {
    const tpl = EMAIL_TEMPLATES.find(t => t.id === tplId) || EMAIL_TEMPLATES[0];
    setSelectedTemplateId(tpl.id);
    setNewsletterSubject(tpl.defaultSubject);
    setNewsletterBadge(tpl.defaultBadge || '');
    setNewsletterTitle(tpl.defaultTitle);
    setNewsletterSubtitle(tpl.defaultSubtitle || '');
    setNewsletterBody(tpl.defaultBody);
    setNewsletterCtaText(tpl.defaultCtaText || '');
    setNewsletterCtaUrl(tpl.defaultCtaUrl || '');
    setNewsletterBanner(tpl.defaultBanner || '');
    setNewsletterOfferBox(tpl.defaultSpecialOfferBox || '');
  };

  useEffect(() => {
    applyTemplateDefaults('catalog');
  }, []);

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

      const loadSubscribers = async () => {
        setIsSubscribersLoading(true);
        try {
          const res = await fetch('/api/newsletter/subscribers');
          if (res.ok) {
            const data = await res.json();
            if (data.subscribers && Array.isArray(data.subscribers)) {
              setSubscribers(data.subscribers);
              setIsSubscribersLoading(false);
              return;
            }
          }
        } catch (e) {
          console.log('Subscriber fetch fallback');
        }
        const local = JSON.parse(localStorage.getItem('irem_newsletter_subscribers') || '[]');
        const formatted = local.map((email: string, i: number) => ({
          id: `local-${i}`,
          email,
          createdAt: new Date().toISOString(),
          source: 'Web Form'
        }));
        setSubscribers(formatted);
        setIsSubscribersLoading(false);
      };

      loadLeads();
      loadEmailConfig();
      loadSubscribers();
    }
  }, [isAuthenticated, activeTab]);

  const handleAddSubscriber = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubEmail || !newSubEmail.includes('@')) {
      alert('Lütfen geçerli bir e-posta yazınız.');
      return;
    }
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newSubEmail, source: 'Admin Panel' })
      });
      const data = await res.json();
      if (data.success) {
        showToast('E-posta abonesi eklendi!');
        setNewSubEmail('');
        if (data.subscriber) {
          setSubscribers(prev => [data.subscriber, ...prev.filter(s => s.email !== data.subscriber.email)]);
        }
      }
    } catch (e) {
      alert('Ekleme işlemi başarısız.');
    }
  };

  const handleDeleteSubscriber = async (id: string) => {
    try {
      await fetch(`/api/newsletter/subscribers/${id}`, { method: 'DELETE' });
      setSubscribers(prev => prev.filter(s => s.id !== id && s.email !== id));
      showToast('Abone silindi.');
    } catch (e) {
      console.error('Silme hatası', e);
    }
  };

  const handleCopyEmails = () => {
    const emailsStr = subscribers.map(s => s.email).join(', ');
    navigator.clipboard.writeText(emailsStr);
    showToast(`${subscribers.length} adet e-posta adresi panoya kopyalandı!`);
  };

  const handleDownloadCSV = () => {
    const headers = 'ID,E-Posta,Kayıt Tarihi,Kaynak\n';
    const rows = subscribers.map(s => `"${s.id}","${s.email}","${new Date(s.createdAt).toLocaleString('tr-TR')}","${s.source || 'Web'}"`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `irem_comfort_bulten_aboneleri_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Aboneler CSV dosyası olarak indirildi.');
  };

  const handleSendBulkNewsletter = async () => {
    setIsSendingBulk(true);
    setBulkSendResult(null);

    let currentSubscribers = subscribers;

    // Fetch latest subscribers list directly from server API
    try {
      const res = await fetch('/api/newsletter/subscribers');
      if (res.ok) {
        const data = await res.json();
        if (data.subscribers && Array.isArray(data.subscribers) && data.subscribers.length > 0) {
          currentSubscribers = data.subscribers;
          setSubscribers(data.subscribers);
        }
      }
    } catch (err) {
      console.error('Failed to fetch subscribers dynamically:', err);
    }

    const targetEmails = currentSubscribers.map(s => s.email).filter(Boolean);

    if (targetEmails.length === 0) {
      setIsSendingBulk(false);
      showToast('Gönderilecek kayıtlı e-bülten abonesi bulunamadı. Lütfen en az 1 e-posta abonesi ekleyin.');
      return;
    }

    if (!newsletterSubject.trim()) {
      setIsSendingBulk(false);
      showToast('Lütfen e-posta konu başlığını giriniz.');
      return;
    }

    const compiledHtml = renderEmailHtml({
      title: newsletterTitle,
      subtitle: newsletterSubtitle,
      bodyText: newsletterBody,
      ctaText: newsletterCtaText,
      ctaUrl: newsletterCtaUrl,
      bannerImage: newsletterBanner,
      badgeText: newsletterBadge,
      specialOfferBox: newsletterOfferBox,
      contactPhone: contactData.phoneDisplay,
      contactEmail: contactData.email,
      contactAddress: contactData.address
    });

    try {
      const response = await fetch('/api/newsletter/send-bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: newsletterSubject,
          htmlBody: compiledHtml,
          targetEmails
        })
      });

      const data = await response.json();
      setIsSendingBulk(false);
      setBulkSendResult(data);

      if (data.success) {
        showToast(data.message || 'Toplu e-posta gönderimi tamamlandı!');
      } else {
        showToast(`Gönderim hatası: ${data.error || 'Ayrıntı alınamadı'}`);
      }
    } catch (e: any) {
      setIsSendingBulk(false);
      showToast('Sunucu hatası: Gönderim isteği iletilemedi.');
    }
  };

  const handleSendTestNewsletter = async () => {
    if (!testEmailAddress || !testEmailAddress.includes('@')) {
      alert('Lütfen geçerli bir test e-posta adresi yazınız.');
      return;
    }
    if (!newsletterSubject.trim()) {
      alert('Lütfen e-posta konu başlığını giriniz.');
      return;
    }

    const compiledHtml = renderEmailHtml({
      title: newsletterTitle,
      subtitle: newsletterSubtitle,
      bodyText: newsletterBody,
      ctaText: newsletterCtaText,
      ctaUrl: newsletterCtaUrl,
      bannerImage: newsletterBanner,
      badgeText: newsletterBadge,
      specialOfferBox: newsletterOfferBox,
      contactPhone: contactData.phoneDisplay,
      contactEmail: contactData.email,
      contactAddress: contactData.address
    });

    setIsTestingEmail(true);
    setBulkSendResult(null);

    try {
      const response = await fetch('/api/newsletter/send-bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: `[TEST] ${newsletterSubject}`,
          htmlBody: compiledHtml,
          targetEmails: [testEmailAddress]
        })
      });

      const data = await response.json();
      setIsTestingEmail(false);
      setBulkSendResult(data);

      if (data.success) {
        showToast(`Test bülteni '${testEmailAddress}' adresine gönderildi!`);
      } else {
        alert(`Test gönderimi başarısız: ${data.error || 'Ayrıntı alınamadı'}`);
      }
    } catch (e) {
      setIsTestingEmail(false);
      alert('Sunucu hatası: Test e-postası iletilemedi.');
    }
  };

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
    type: 'hero' | 'about' | 'craftsmanship' | 'collection' | 'fairPoster' | 'fairQr' | 'aboutSlide';
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
    } else if (uploadTarget.type === 'aboutSlide' && uploadTarget.id) {
      updateAboutSlide(uploadTarget.id, { image: croppedBase64 });
      showToast('Mirasımız slayt görseli boyutlandırıldı ve güncellendi!');
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
    type: 'hero' | 'about' | 'craftsmanship' | 'collection' | 'fairPoster' | 'fairQr' | 'aboutSlide',
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
            onClick={() => setActiveTab('faq')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'faq'
                ? 'bg-[#082C6C] text-white shadow'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <span>Sıkça Sorulan Sorular (SSS)</span>
          </button>

          <button
            onClick={() => setActiveTab('contact')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'contact'
                ? 'bg-[#082C6C] text-white shadow'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >

            <Phone className="w-4 h-4 text-emerald-400" />
            <span>İletişim & Duyuru Bandı</span>
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
            onClick={() => setActiveTab('newsletter')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'newsletter'
                ? 'bg-[#082C6C] text-white shadow'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4 text-blue-400" />
            <span>📧 Haber Bülteni & Şablonlar ({subscribers.length})</span>
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
            
            {/* Hero Text & Headline Editor */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-bold text-[#111111] text-base flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Ana Sayfa Manşet Metinleri & Başlık Yönetimi</span>
                  </h3>
                  <p className="text-xs text-slate-500">Ana sayfa açılış manşetindeki rozet, başlık, açıklama ve buton yazılarını düzenleyin.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    resetHeroConfig();
                    showToast('Hero metinleri varsayılan değerlerine sıfırlandı!');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Sıfırla</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Üst Rozet Yazısı (Pill Badge)</label>
                  <input
                    type="text"
                    value={heroConfig.badgeText}
                    onChange={(e) => updateHeroConfig({ badgeText: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:border-[#082C6C] focus:outline-none bg-slate-50 font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Ana Manşet Başlığı</label>
                  <input
                    type="text"
                    value={heroConfig.title}
                    onChange={(e) => updateHeroConfig({ title: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:border-[#082C6C] focus:outline-none bg-slate-50 font-bold text-[#082C6C]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Açıklama Paragrafı</label>
                  <textarea
                    rows={3}
                    value={heroConfig.description}
                    onChange={(e) => updateHeroConfig({ description: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:border-[#082C6C] focus:outline-none bg-slate-50 font-normal leading-relaxed"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">1. Buton Yazısı (Sol)</label>
                  <input
                    type="text"
                    value={heroConfig.primaryBtnText}
                    onChange={(e) => updateHeroConfig({ primaryBtnText: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:border-[#082C6C] focus:outline-none bg-slate-50 font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">2. Buton Yazısı (Sağ)</label>
                  <input
                    type="text"
                    value={heroConfig.secondaryBtnText}
                    onChange={(e) => updateHeroConfig({ secondaryBtnText: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:border-[#082C6C] focus:outline-none bg-slate-50 font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Sağ Kapak Kartı Başlığı</label>
                  <input
                    type="text"
                    value={heroConfig.signatureModelTitle}
                    onChange={(e) => updateHeroConfig({ signatureModelTitle: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:border-[#082C6C] focus:outline-none bg-slate-50 font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Sağ Kapak Kartı Alt Yazısı</label>
                  <input
                    type="text"
                    value={heroConfig.signatureModelSub}
                    onChange={(e) => updateHeroConfig({ signatureModelSub: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:border-[#082C6C] focus:outline-none bg-slate-50 font-medium"
                  />
                </div>
              </div>
            </div>

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

            {/* Mirasımız & Atölyemiz Carousel / Slider Yönetimi */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-3">
                <div>
                  <h3 className="font-bold text-[#111111] text-base flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#082C6C]" />
                    <span>Mirasımız & Atölyemiz Slayt Galerisi (Slider) Yönetimi</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    "Mirasımız & Atölyemiz" bölümünde otomatik dönen premium görsel slaytlarının resimlerini, yazılarını ve sıralamasını yönetin.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      addAboutSlide({
                        badge: 'YENİ SEZON',
                        title: 'Hakiki Deri Konfor',
                        subtitle: 'Atölyemizden Mükemmel Dikiş İşçiliği',
                        image: 'https://images.unsplash.com/photo-1603808033176-9d134e6f2c74?auto=format&fit=crop&q=80&w=1200',
                        alt: 'İrem Comfort Yeni Slayt Görseli'
                      });
                      showToast('Yeni slayt başarıyla eklendi!');
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-[#082C6C] text-white text-xs font-bold hover:bg-[#163E87] transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Yeni Slayt Ekle</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Tüm slaytlar varsayılan atölye fotoğrafları ve metinlerine sıfırlansın mı?')) {
                        resetAboutSlides();
                        showToast('Slaytlar varsayılan değerlerine sıfırlandı!');
                      }
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Sıfırla</span>
                  </button>
                </div>
              </div>

              {/* Slide Items List */}
              <div className="space-y-4">
                {aboutSlides.map((slide, index) => (
                  <div
                    key={slide.id}
                    className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 relative group"
                  >
                    {/* Item Top Bar */}
                    <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#082C6C] text-white text-xs font-bold flex items-center justify-center font-mono">
                          {index + 1}
                        </span>
                        <span className="text-xs font-bold text-slate-800">
                          {slide.title || `Slayt #${index + 1}`}
                        </span>
                        {slide.badge && (
                          <span className="text-[10px] bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full font-bold">
                            {slide.badge}
                          </span>
                        )}
                      </div>

                      {/* Action buttons: Move Up, Move Down, Delete */}
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => moveAboutSlide(slide.id, 'up')}
                          disabled={index === 0}
                          title="Yukarı Taşı"
                          className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer text-xs"
                        >
                          ▲
                        </button>
                        <button
                          type="button"
                          onClick={() => moveAboutSlide(slide.id, 'down')}
                          disabled={index === aboutSlides.length - 1}
                          title="Aşağı Taşı"
                          className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer text-xs"
                        >
                          ▼
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (aboutSlides.length <= 1) {
                              alert('En az 1 slayt bulunmalıdır!');
                              return;
                            }
                            deleteAboutSlide(slide.id);
                            showToast('Slayt silindi.');
                          }}
                          title="Slaytı Sil"
                          className="p-1.5 rounded-lg bg-red-50 border border-red-200 hover:bg-red-100 text-red-600 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Image & Field inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start">
                      {/* Image Preview & Upload Button */}
                      <div className="sm:col-span-4 space-y-2">
                        <div className="h-36 rounded-xl overflow-hidden border border-slate-300 relative bg-slate-900 group shadow-sm">
                          <img
                            src={slide.image}
                            alt={slide.alt || slide.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
                            <span className="text-[10px] font-semibold text-white/90 truncate">
                              {slide.title}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => triggerFileUpload('aboutSlide', slide.id)}
                            className="w-full px-3 py-1.5 rounded-lg bg-[#082C6C] text-white text-xs font-semibold hover:bg-[#163E87] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Crop className="w-3.5 h-3.5 text-amber-300" />
                            <span>Fotoğraf Yükle & Kırp</span>
                          </button>
                        </div>
                      </div>

                      {/* Text Fields */}
                      <div className="sm:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] font-bold text-slate-700 block mb-1">
                            Rozet Metni (Üst Etiket)
                          </label>
                          <input
                            type="text"
                            value={slide.badge}
                            onChange={(e) => updateAboutSlide(slide.id, { badge: e.target.value })}
                            placeholder="Örn: İREM COMFORT • MANİSA"
                            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:border-[#082C6C] focus:outline-none bg-white font-semibold text-amber-900"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-slate-700 block mb-1">
                            Ana Başlık (Overlay)
                          </label>
                          <input
                            type="text"
                            value={slide.title}
                            onChange={(e) => updateAboutSlide(slide.id, { title: e.target.value })}
                            placeholder="Örn: Hakiki Deri."
                            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:border-[#082C6C] focus:outline-none bg-white font-bold text-[#082C6C]"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="text-[11px] font-bold text-slate-700 block mb-1">
                            Alt Başlık / Açıklama
                          </label>
                          <input
                            type="text"
                            value={slide.subtitle}
                            onChange={(e) => updateAboutSlide(slide.id, { subtitle: e.target.value })}
                            placeholder="Örn: Doğal Konfor."
                            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:border-[#082C6C] focus:outline-none bg-white font-medium"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-slate-700 block mb-1">
                            Görsel Bağlantısı (URL)
                          </label>
                          <input
                            type="text"
                            value={slide.image}
                            onChange={(e) => updateAboutSlide(slide.id, { image: e.target.value })}
                            placeholder="https://..."
                            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:border-[#082C6C] focus:outline-none bg-white text-slate-600 font-mono text-[11px]"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-slate-700 block mb-1">
                            SEO Alt Görsel Etiketi
                          </label>
                          <input
                            type="text"
                            value={slide.alt}
                            onChange={(e) => updateAboutSlide(slide.id, { alt: e.target.value })}
                            placeholder="Örn: Manisa Atölyesi Hakiki Deri..."
                            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:border-[#082C6C] focus:outline-none bg-white font-normal"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Collection Products */}
        {activeTab === 'collection' && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-amber-50/90 border border-amber-200 text-xs text-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
              <div>
                <p className="font-bold text-amber-950 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Koleksiyon Ürünleri, Trendyol Yönlendirme Linkleri ve Detay Yönetimi</span>
                </p>
                <p className="text-[#111111]/70 text-[11px] mt-0.5">
                  "Detayları İncele" penceresinde görünen tüm başlık, açıklama, renk seçenekleri, özellikler ve **ürüne özel Trendyol satın alma linklerini** buradan yönetebilirsiniz.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    addCollectionItem({
                      name: 'İrem Comfort Yeni Model Terlik',
                      subtitle: 'Hakiki Deri Konfor Taban',
                      category: 'Bayan Comfort Terlik',
                      tagline: 'Yeni sezon özel el işçiliği',
                      description: 'Atölyemizde yüksek kaliteli hakiki deriden özenle üretilmiştir.',
                      image: 'https://images.unsplash.com/photo-1603808033176-9d134e6f2c74?auto=format&fit=crop&q=80&w=1200',
                      secondaryImage: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=1200',
                      materials: ['%100 Hakiki Deri', 'Anatomik Taban'],
                      dimensions: '36 - 41 Numara',
                      leatherGrades: ['Nappa Hakiki Deri'],
                      colors: [
                        { name: 'Siyah Klasik', hex: '#1C1C1C' },
                        { name: 'Taba Bronz', hex: '#8B5A2B' }
                      ],
                      features: ['Anatomik taban desteği', '%100 Hakiki deri saya'],
                      trendyolUrl: ''
                    });
                    showToast('Yeni ürün koleksiyona başarıyla eklendi!');
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-[#082C6C] text-white text-xs font-bold hover:bg-[#163E87] transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Yeni Ürün Ekle</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Tüm ürün koleksiyonu varsayılan fabrika verilerine sıfırlansın mı?')) {
                      resetCollectionItems();
                      showToast('Ürün koleksiyonu sıfırlandı.');
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-200/80 hover:bg-slate-300/80 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Sıfırla</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
              {collectionItems.map((item, itemIdx) => {
                const currentImgs = images.collectionImages[item.id] || {
                  image: item.image,
                  secondaryImage: item.secondaryImage
                };

                return (
                  <div key={item.id} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6 relative">
                    {/* Item Card Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-3">
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-full bg-[#082C6C] text-white text-xs font-bold flex items-center justify-center font-mono shrink-0">
                          {itemIdx + 1}
                        </span>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] uppercase font-extrabold text-[#082C6C] bg-[#082C6C]/10 px-2 py-0.5 rounded">
                              {item.category}
                            </span>
                            {item.trendyolUrl && (
                              <span className="text-[10px] uppercase font-bold text-[#F27A1A] bg-[#F27A1A]/10 px-2 py-0.5 rounded flex items-center gap-1">
                                <ExternalLink className="w-2.5 h-2.5" />
                                Trendyol Linki Var
                              </span>
                            )}
                          </div>
                          <h4 className="font-bold text-[#111111] text-base mt-0.5">{item.name}</h4>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <span className="text-[11px] text-slate-400 font-mono bg-slate-100 px-2 py-1 rounded">
                          ID: {item.id}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            if (collectionItems.length <= 1) {
                              alert('Koleksiyonda en az 1 ürün bulunmalıdır.');
                              return;
                            }
                            if (confirm(`'${item.name}' ürününü silmek istediğinize emin misiniz?`)) {
                              deleteCollectionItem(item.id);
                              showToast('Ürün silindi.');
                            }
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Sil</span>
                        </button>
                      </div>
                    </div>

                    {/* Section 1: Main Text Details & Direct Trendyol Link */}
                    <div className="space-y-4">
                      <h5 className="text-xs font-bold uppercase tracking-wider text-[#082C6C] flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>1. Temel Bilgiler & Trendyol Satın Alma Linki</span>
                      </h5>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50/70 p-4 rounded-xl border border-slate-200">
                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">Ürün Adı / Başlık</label>
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => updateCollectionItem(item.id, { name: e.target.value })}
                            className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:border-[#082C6C] focus:outline-none bg-white font-semibold text-[#111111]"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">Kategori</label>
                          <input
                            type="text"
                            value={item.category}
                            onChange={(e) => updateCollectionItem(item.id, { category: e.target.value })}
                            className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:border-[#082C6C] focus:outline-none bg-white font-medium"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">Alt Başlık (Slogan)</label>
                          <input
                            type="text"
                            value={item.subtitle || ''}
                            onChange={(e) => updateCollectionItem(item.id, { subtitle: e.target.value })}
                            className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:border-[#082C6C] focus:outline-none bg-white"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">Öne Çıkan Vurgu (Tagline)</label>
                          <input
                            type="text"
                            value={item.tagline || ''}
                            onChange={(e) => updateCollectionItem(item.id, { tagline: e.target.value })}
                            className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:border-[#082C6C] focus:outline-none bg-white"
                          />
                        </div>

                        {/* Direct Trendyol Purchase Link */}
                        <div className="sm:col-span-2 p-3.5 rounded-xl bg-orange-50/80 border border-orange-200 space-y-1.5">
                          <label className="text-xs font-bold text-orange-950 flex items-center justify-between">
                            <span className="flex items-center gap-1.5">
                              <span className="px-2 py-0.5 rounded bg-[#F27A1A] text-white text-[10px] font-black tracking-wider uppercase">
                                TRENDYOL
                              </span>
                              <span>Doğrudan Ürün Trendyol Satın Alma Linki (URL)</span>
                            </span>
                            <span className="text-[10px] font-normal text-orange-800 italic">
                              (Detayları İncele butonundaki 'Trendyol'dan Satın Al' buraya yönlendirir)
                            </span>
                          </label>
                          <input
                            type="text"
                            value={item.trendyolUrl || ''}
                            onChange={(e) => updateCollectionItem(item.id, { trendyolUrl: e.target.value })}
                            placeholder="https://www.trendyol.com/irem-comfort/..."
                            className="w-full px-3 py-2 text-xs rounded-lg border border-orange-300 focus:border-[#F27A1A] focus:outline-none bg-white text-orange-950 font-mono text-[11px]"
                          />
                          <p className="text-[11px] text-orange-800">
                            * Bu alanı doldurursanız müşteriler modal pencereden doğrudan bu özel ürünün Trendyol sayfasına yönlendirilir. Boş bırakılırsa genel Trendyol mağaza linkine gider.
                          </p>
                        </div>

                        <div className="sm:col-span-2">
                          <label className="text-xs font-bold text-slate-700 block mb-1">Ürün Detay Açıklaması</label>
                          <textarea
                            rows={3}
                            value={item.description || ''}
                            onChange={(e) => updateCollectionItem(item.id, { description: e.target.value })}
                            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:border-[#082C6C] focus:outline-none bg-white font-normal leading-relaxed"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Section 2: Color Options Management */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h5 className="text-xs font-bold uppercase tracking-wider text-[#082C6C] flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-[#082C6C]" />
                          <span>2. Deri Renk Seçenekleri ({item.colors?.length || 0} Renk)</span>
                        </h5>

                        <button
                          type="button"
                          onClick={() => {
                            const currentColors = item.colors || [];
                            const updatedColors = [
                              ...currentColors,
                              { name: 'Yeni Deri Tonu', hex: '#8B5A2B' }
                            ];
                            updateCollectionItem(item.id, { colors: updatedColors });
                            showToast('Yeni renk seçeneği eklendi.');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-[#082C6C]/10 hover:bg-[#082C6C]/20 text-[#082C6C] text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Renk Ekle</span>
                        </button>
                      </div>

                      <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 space-y-3">
                        {item.colors && item.colors.length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {item.colors.map((col, colorIdx) => (
                              <div
                                key={colorIdx}
                                className="flex items-center gap-2 bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs"
                              >
                                {/* Color Picker Circle */}
                                <input
                                  type="color"
                                  value={col.hex || '#000000'}
                                  onChange={(e) => {
                                    const nextColors = [...item.colors];
                                    nextColors[colorIdx] = { ...nextColors[colorIdx], hex: e.target.value };
                                    updateCollectionItem(item.id, { colors: nextColors });
                                  }}
                                  className="w-8 h-8 rounded-full border border-slate-300 cursor-pointer p-0.5 bg-transparent shrink-0"
                                  title="Renk Kodu Seç"
                                />

                                <div className="flex-1 min-w-0 space-y-1">
                                  <input
                                    type="text"
                                    value={col.name}
                                    onChange={(e) => {
                                      const nextColors = [...item.colors];
                                      nextColors[colorIdx] = { ...nextColors[colorIdx], name: e.target.value };
                                      updateCollectionItem(item.id, { colors: nextColors });
                                    }}
                                    placeholder="Renk Adı (Örn: Siyah)"
                                    className="w-full px-2 py-1 text-xs rounded border border-slate-200 focus:border-[#082C6C] focus:outline-none font-semibold text-slate-800"
                                  />
                                  <input
                                    type="text"
                                    value={col.hex}
                                    onChange={(e) => {
                                      const nextColors = [...item.colors];
                                      nextColors[colorIdx] = { ...nextColors[colorIdx], hex: e.target.value };
                                      updateCollectionItem(item.id, { colors: nextColors });
                                    }}
                                    placeholder="#1C1C1C"
                                    className="w-full px-2 py-0.5 text-[10px] rounded border border-slate-200 focus:border-[#082C6C] focus:outline-none font-mono text-slate-500"
                                  />
                                </div>

                                <button
                                  type="button"
                                  onClick={() => {
                                    const nextColors = item.colors.filter((_, idx) => idx !== colorIdx);
                                    updateCollectionItem(item.id, { colors: nextColors });
                                  }}
                                  className="p-1.5 rounded bg-red-50 text-red-600 hover:bg-red-100 transition-colors shrink-0 cursor-pointer"
                                  title="Rengi Sil"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-3 text-xs text-slate-400">
                            Henüz renk seçeneği eklenmemiş. Yukarıdaki "Renk Ekle" butonunu kullanın.
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Section 3: Materials, Dimensions, Features */}
                    <div className="space-y-3">
                      <h5 className="text-xs font-bold uppercase tracking-wider text-[#082C6C] flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#082C6C]" />
                        <span>3. Malzemeler, Ölçüler & Ergonomik Özellikler</span>
                      </h5>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50/70 p-4 rounded-xl border border-slate-200">
                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">
                            Kullanılan Malzemeler (Virgülle ayırın)
                          </label>
                          <input
                            type="text"
                            value={Array.isArray(item.materials) ? item.materials.join(', ') : (item.materials || '')}
                            onChange={(e) => {
                              const raw = e.target.value;
                              const parsed = raw.split(',').map(s => s.trim()).filter(Boolean);
                              updateCollectionItem(item.id, { materials: parsed });
                            }}
                            placeholder="Örn: %100 Hakiki Deri, Anatomik Taban, Deri Astar"
                            className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:border-[#082C6C] focus:outline-none bg-white font-medium"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">
                            Numara Aralığı & Ölçüler
                          </label>
                          <input
                            type="text"
                            value={item.dimensions || ''}
                            onChange={(e) => updateCollectionItem(item.id, { dimensions: e.target.value })}
                            placeholder="Örn: Numara Aralığı: 36 - 41 | Topuk Yüksekliği: 3.5 cm"
                            className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:border-[#082C6C] focus:outline-none bg-white font-medium"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="text-xs font-bold text-slate-700 block mb-1">
                            Ergonomik Özellikler (Her satıra 1 madde yazın)
                          </label>
                          <textarea
                            rows={3}
                            value={(item.features || []).join('\n')}
                            onChange={(e) => {
                              const parsed = e.target.value.split('\n').filter(Boolean);
                              updateCollectionItem(item.id, { features: parsed });
                            }}
                            placeholder="Anatomik kavisli özel taban desteği&#10;%100 Nefes alan hakiki deri iç kaplama&#10;Hafif poliüretan taban"
                            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:border-[#082C6C] focus:outline-none bg-white font-normal leading-relaxed"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Section 4: Product Image Management */}
                    <div className="space-y-3">
                      <h5 className="text-xs font-bold uppercase tracking-wider text-[#082C6C] flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-[#082C6C]" />
                        <span>4. Ürün Fotoğrafları</span>
                      </h5>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Main Product Image */}
                        <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-slate-700 block">Ana Ürün Görseli</label>
                            <span className="text-[10px] font-mono text-amber-900 bg-amber-100 px-2 py-0.5 rounded font-bold">1000x1000 px</span>
                          </div>
                          <div className="flex gap-4 items-center">
                            <div className="w-24 h-24 rounded-lg overflow-hidden border border-slate-300 shrink-0 bg-white shadow-xs">
                              <img src={currentImgs.image} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 space-y-2">
                              <input
                                type="text"
                                value={currentImgs.image}
                                onChange={(e) => updateCollectionImage(item.id, 'image', e.target.value)}
                                className="w-full px-2.5 py-1.5 text-xs rounded-md border border-slate-300 focus:border-[#082C6C] focus:outline-none bg-white font-mono text-[11px]"
                                placeholder="Ana Görsel URL"
                              />
                              <button
                                type="button"
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
                            <div className="w-24 h-24 rounded-lg overflow-hidden border border-slate-300 shrink-0 bg-white shadow-xs">
                              <img src={currentImgs.secondaryImage || currentImgs.image} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 space-y-2">
                              <input
                                type="text"
                                value={currentImgs.secondaryImage || ''}
                                onChange={(e) => updateCollectionImage(item.id, 'secondaryImage', e.target.value)}
                                className="w-full px-2.5 py-1.5 text-xs rounded-md border border-slate-300 focus:border-[#082C6C] focus:outline-none bg-white font-mono text-[11px]"
                                placeholder="İkinci Görsel URL"
                              />
                              <button
                                type="button"
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
              {craftsmanshipSteps.map((step) => {
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

                    {/* Step Text Fields */}
                    <div className="space-y-3 bg-slate-50/70 p-3.5 rounded-xl border border-slate-200">
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">Aşama Başlığı</label>
                        <input
                          type="text"
                          value={step.title}
                          onChange={(e) => updateCraftsmanshipStep(step.number, { title: e.target.value })}
                          className="w-full px-2.5 py-1.5 text-xs rounded-md border border-slate-300 focus:border-[#082C6C] focus:outline-none bg-white font-semibold"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">Alt Başlık / Vurgu</label>
                        <input
                          type="text"
                          value={step.subtitle}
                          onChange={(e) => updateCraftsmanshipStep(step.number, { subtitle: e.target.value })}
                          className="w-full px-2.5 py-1.5 text-xs rounded-md border border-slate-300 focus:border-[#082C6C] focus:outline-none bg-white"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">Aşama Açıklama Metni</label>
                        <textarea
                          rows={2}
                          value={step.description}
                          onChange={(e) => updateCraftsmanshipStep(step.number, { description: e.target.value })}
                          className="w-full px-2.5 py-1.5 text-xs rounded-md border border-slate-300 focus:border-[#082C6C] focus:outline-none bg-white"
                        />
                      </div>
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

        {/* Tab 4.4: FAQ MANAGEMENT */}
        {activeTab === 'faq' && (
          <FaqAdminTab showToast={showToast} />
        )}

        {/* Tab 4.5: CONTACT INFO & ANNOUNCEMENT TICKER MANAGEMENT */}
        {activeTab === 'contact' && (

          <div className="space-y-6">
            
            {/* Site Contact Details Form */}
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-bold text-[#111111] text-lg flex items-center gap-2">
                    <Phone className="w-5 h-5 text-[#082C6C]" />
                    <span>İletişim, Adres & Sosyal Medya Bağlantıları</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Header, Footer ve İletişim sayfasında görüntülenen telefon, adres ve Trendyol mağaza bilgileri.
                  </p>
                </div>
                <button
                  onClick={resetContactData}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                  <span>Sıfırla</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Müşteri Danışma Hattı (Görünür Metin)</label>
                  <input
                    type="text"
                    value={contactData.phoneDisplay}
                    onChange={(e) => updateContactData({ phoneDisplay: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:border-[#082C6C] focus:outline-none bg-slate-50 font-semibold"
                    placeholder="0533 029 71 25"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Arama Linki Telefonu (Ülke Kodlu)</label>
                  <input
                    type="text"
                    value={contactData.phone}
                    onChange={(e) => updateContactData({ phone: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:border-[#082C6C] focus:outline-none bg-slate-50 font-mono"
                    placeholder="+905330297125"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">WhatsApp Sipariş Hattı (Görünür Metin)</label>
                  <input
                    type="text"
                    value={contactData.whatsappDisplay}
                    onChange={(e) => updateContactData({ whatsappDisplay: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:border-[#082C6C] focus:outline-none bg-slate-50 font-semibold"
                    placeholder="0533 029 71 25"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">WhatsApp Numarası (Rakamlar)</label>
                  <input
                    type="text"
                    value={contactData.whatsapp}
                    onChange={(e) => updateContactData({ whatsapp: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:border-[#082C6C] focus:outline-none bg-slate-50 font-mono"
                    placeholder="905330297125"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Kurumsal E-Posta Adresi</label>
                  <input
                    type="email"
                    value={contactData.email}
                    onChange={(e) => updateContactData({ email: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:border-[#082C6C] focus:outline-none bg-slate-50"
                    placeholder="info@iremcomfort.com"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Showroom & Atölye Çalışma Saatleri</label>
                  <input
                    type="text"
                    value={contactData.showroomHours}
                    onChange={(e) => updateContactData({ showroomHours: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:border-[#082C6C] focus:outline-none bg-slate-50"
                    placeholder="Hafta İçi: 08:30 - 19:00"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Trendyol Mağaza Bağlantısı (URL)</label>
                  <input
                    type="text"
                    value={contactData.trendyolUrl}
                    onChange={(e) => updateContactData({ trendyolUrl: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:border-[#082C6C] focus:outline-none bg-slate-50"
                    placeholder="https://www.trendyol.com/..."
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Instagram Profil URL</label>
                  <input
                    type="text"
                    value={contactData.instagramUrl || ''}
                    onChange={(e) => updateContactData({ instagramUrl: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:border-[#082C6C] focus:outline-none bg-slate-50"
                    placeholder="https://www.instagram.com/irem.comfort"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Google Haritalar Yol Tarifi / Konum Bağlantısı (URL)</label>
                  <input
                    type="text"
                    value={contactData.googleMapsUrl || ''}
                    onChange={(e) => updateContactData({ googleMapsUrl: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:border-[#082C6C] focus:outline-none bg-slate-50 font-mono text-[11px]"
                    placeholder="https://maps.google.com/?q=..."
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 block mb-1">Manisa Atölye & Showroom Açık Adresi</label>
                  <textarea
                    rows={2}
                    value={contactData.address}
                    onChange={(e) => updateContactData({ address: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:border-[#082C6C] focus:outline-none bg-slate-50 font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Announcement Ticker Editor */}
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-bold text-[#111111] text-lg flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    <span>En Üstteki Akıcı Duyuru Bandı Metinleri</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Sitenin en üstündeki lacivert bantta sürekli kayan duyuru ve haber mesajları.
                  </p>
                </div>
                <button
                  onClick={resetAnnouncements}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                  <span>Sıfırla</span>
                </button>
              </div>

              {/* Add New Announcement Form */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newAnnouncementText}
                  onChange={(e) => setNewAnnouncementText(e.target.value)}
                  placeholder="Yeni kayan duyuru satırı ekleyin..."
                  className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:border-[#082C6C] focus:outline-none bg-slate-50 font-medium"
                />
                <button
                  onClick={() => {
                    if (newAnnouncementText.trim()) {
                      updateAnnouncements([...announcements, newAnnouncementText.trim()]);
                      setNewAnnouncementText('');
                      showToast('Duyuru eklendi!');
                    }
                  }}
                  className="px-4 py-2 bg-[#082C6C] hover:bg-[#163E87] text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4 text-amber-300" />
                  <span>Duyuru Ekle</span>
                </button>
              </div>

              {/* Announcements List */}
              <div className="space-y-3">
                {announcements.map((line, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <span className="w-6 h-6 rounded-full bg-[#082C6C]/10 text-[#082C6C] text-[11px] font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <input
                      type="text"
                      value={line}
                      onChange={(e) => {
                        const updated = [...announcements];
                        updated[idx] = e.target.value;
                        updateAnnouncements(updated);
                      }}
                      className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:border-[#082C6C] focus:outline-none bg-white font-medium"
                    />
                    <button
                      onClick={() => {
                        const updated = announcements.filter((_, i) => i !== idx);
                        updateAnnouncements(updated);
                        showToast('Duyuru satırı silindi.');
                      }}
                      className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                      title="Sil"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
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

        {/* Tab 5.5: NEWSLETTER BUILDER & SUBSCRIBERS */}
        {activeTab === 'newsletter' && (
          <div className="space-y-6">
            
            {/* Sub-navigation bar between Builder and Subscribers List */}
            <div className="flex items-center gap-2 p-1.5 bg-slate-200/70 rounded-2xl w-fit">
              <button
                onClick={() => setNewsletterSubTab('builder')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  newsletterSubTab === 'builder'
                    ? 'bg-[#082C6C] text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-300/60'
                }`}
              >
                <Send className="w-3.5 h-3.5 text-amber-300" />
                <span>🚀 E-Bülten Hazırla & Toplu Gönder</span>
              </button>

              <button
                onClick={() => setNewsletterSubTab('subscribers')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  newsletterSubTab === 'subscribers'
                    ? 'bg-[#082C6C] text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-300/60'
                }`}
              >
                <Users className="w-3.5 h-3.5 text-blue-300" />
                <span>👥 Aboneler Listesi ({subscribers.length})</span>
              </button>
            </div>

            {/* SECTION 1: E-NEWSLETTER BUILDER */}
            {newsletterSubTab === 'builder' && (
              <div className="space-y-6">
                
                {/* 1. Template Chooser Cards */}
                <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <div>
                    <h3 className="font-bold text-[#111111] text-base flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-amber-500" />
                      <span>Hazır HTML E-Posta Şablonları</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Aşağıdaki hazır şablonlardan birini seçerek metinlerini, ürün başlıklarını ve bağlantılarını düzenleyebilirsiniz.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {EMAIL_TEMPLATES.map((tpl) => {
                      const isSelected = selectedTemplateId === tpl.id;
                      return (
                        <div
                          key={tpl.id}
                          onClick={() => applyTemplateDefaults(tpl.id)}
                          className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                            isSelected
                              ? 'bg-blue-50/70 border-[#082C6C] shadow-md ring-2 ring-[#082C6C]/20'
                              : 'bg-white border-slate-200 hover:border-[#082C6C]/40 hover:bg-slate-50'
                          }`}
                        >
                          <div>
                            <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{tpl.name}</h4>
                            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{tpl.description}</p>
                          </div>
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded w-fit ${
                            isSelected ? 'bg-[#082C6C] text-white' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {isSelected ? '✓ Seçili Şablon' : 'Şablonu Seç'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Editor & Live Preview Split */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Left Column: Form Controls */}
                  <div className="lg:col-span-6 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                      <h4 className="font-bold text-[#111111] text-sm flex items-center gap-2">
                        <Sliders className="w-4 h-4 text-[#082C6C]" />
                        <span>E-Posta Metin & İçerik Düzenleyici</span>
                      </h4>
                      <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-bold">
                        Dinamik HTML
                      </span>
                    </div>

                    <div className="space-y-3.5 text-xs">
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">E-Posta Konu Başlığı (Subject)</label>
                        <input
                          type="text"
                          value={newsletterSubject}
                          onChange={(e) => setNewsletterSubject(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-[#082C6C] focus:outline-none bg-slate-50 font-semibold text-xs"
                          placeholder="E-posta gelen kutusunda görünecek başlık..."
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="font-bold text-slate-700 block mb-1">Üst Rozet Metni</label>
                          <input
                            type="text"
                            value={newsletterBadge}
                            onChange={(e) => setNewsletterBadge(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-[#082C6C] focus:outline-none bg-slate-50 text-xs font-medium"
                            placeholder="Örn: YENİ SEZON KATALOĞU"
                          />
                        </div>

                        <div>
                          <label className="font-bold text-slate-700 block mb-1">Afiş Görsel URL</label>
                          <input
                            type="text"
                            value={newsletterBanner}
                            onChange={(e) => setNewsletterBanner(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-[#082C6C] focus:outline-none bg-slate-50 text-xs"
                            placeholder="https://..."
                          />
                        </div>
                      </div>

                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Ana Başlık (H1)</label>
                        <input
                          type="text"
                          value={newsletterTitle}
                          onChange={(e) => setNewsletterTitle(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-[#082C6C] focus:outline-none bg-slate-50 text-xs font-bold text-[#082C6C]"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Alt Başlık (H2)</label>
                        <input
                          type="text"
                          value={newsletterSubtitle}
                          onChange={(e) => setNewsletterSubtitle(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-[#082C6C] focus:outline-none bg-slate-50 text-xs"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Gövde Metni / Paragraflar</label>
                        <textarea
                          rows={6}
                          value={newsletterBody}
                          onChange={(e) => setNewsletterBody(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-[#082C6C] focus:outline-none bg-slate-50 text-xs font-normal leading-relaxed"
                          placeholder="Paragraf araları için boş satır bırakabilirsiniz..."
                        />
                      </div>

                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Vurgu Kutusu / Özel Fırsat Metni (İsteğe Bağlı)</label>
                        <input
                          type="text"
                          value={newsletterOfferBox}
                          onChange={(e) => setNewsletterOfferBox(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-[#082C6C] focus:outline-none bg-blue-50/50 text-xs font-semibold text-blue-900"
                          placeholder="Örn: ⚡ Bu ay verilen siparişlerde kargo ücretsiz..."
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="font-bold text-slate-700 block mb-1">Buton Üzerindeki Yazı</label>
                          <input
                            type="text"
                            value={newsletterCtaText}
                            onChange={(e) => setNewsletterCtaText(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-[#082C6C] focus:outline-none bg-slate-50 text-xs font-bold"
                          />
                        </div>

                        <div>
                          <label className="font-bold text-slate-700 block mb-1">Buton Yönlendirme Linki (URL)</label>
                          <input
                            type="text"
                            value={newsletterCtaUrl}
                            onChange={(e) => setNewsletterCtaUrl(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-[#082C6C] focus:outline-none bg-slate-50 text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Live HTML Preview & Send Action */}
                  <div className="lg:col-span-6 space-y-4">
                    
                    {/* Bulk Send Action Box */}
                    <div className="p-6 bg-[#082C6C] text-white rounded-2xl shadow-xl space-y-4 border border-white/10">
                      <div className="flex items-center justify-between border-b border-white/10 pb-3">
                        <div>
                          <h4 className="font-bold text-base flex items-center gap-2">
                            <Send className="w-5 h-5 text-amber-300" />
                            <span>Toplu Gönderim Merkezi</span>
                          </h4>
                          <p className="text-xs text-white/70 mt-0.5">
                            Hazırladığınız bu bülten sistemdeki tüm e-posta abonelerine iletilecektir.
                          </p>
                        </div>
                        <span className="bg-amber-400 text-slate-900 font-extrabold text-xs px-3 py-1 rounded-full">
                          {subscribers.length} Abone
                        </span>
                      </div>

                      {bulkSendResult && (
                        <div className={`p-4 rounded-xl text-xs font-medium border ${
                          bulkSendResult.success ? 'bg-emerald-500/20 text-emerald-200 border-emerald-500/30' : 'bg-rose-500/20 text-rose-200 border-rose-500/30'
                        }`}>
                          <p className="font-bold">{bulkSendResult.message || (bulkSendResult.success ? 'Gönderim tamamlandı' : 'Gönderim başarısız')}</p>
                          {bulkSendResult.isSimulation && (
                            <p className="mt-1 text-[11px] opacity-80">
                              ℹ️ SMTP bilgileri henüz tanımlanmadığı için gönderim simülasyon olarak günlüğe kaydedildi. Gerçek gönderim için "E-Posta & SMTP Ayarları" sekmesinden SMTP bilgilerinizi giriniz.
                            </p>
                          )}
                        </div>
                      )}

                      <button
                        onClick={handleSendBulkNewsletter}
                        disabled={isSendingBulk}
                        className="w-full py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-sm rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        {isSendingBulk ? (
                          <>
                            <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                            <span>Toplu E-Postalar Gönderiliyor...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            <span>Tüm Abonelere ({subscribers.length > 0 ? subscribers.length : 'Kayıtlı'}) Bülteni Gönder</span>
                          </>
                        )}
                      </button>

                      <div className="pt-3 border-t border-white/10 space-y-2">
                        <label className="text-xs font-bold text-amber-200 block">
                          🧪 Kendine Test E-Postası Gönder (Önizlemeyi E-Postana At)
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="email"
                            value={testEmailAddress}
                            onChange={(e) => setTestEmailAddress(e.target.value)}
                            placeholder="Örn: info@iremcomfort.com"
                            className="flex-1 px-3 py-2 text-xs bg-white/10 text-white rounded-xl border border-white/20 focus:outline-none focus:border-amber-300 placeholder:text-white/50"
                          />
                          <button
                            type="button"
                            onClick={handleSendTestNewsletter}
                            disabled={isTestingEmail || !testEmailAddress}
                            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold text-xs rounded-xl border border-amber-400/40 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                          >
                            {isTestingEmail ? 'Gönderiliyor...' : 'Test Et'}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Live HTML Preview Box */}
                    <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                          <Eye className="w-4 h-4 text-[#082C6C]" />
                          <span>E-Posta Canlı Önizlemesi (Müşteri Ekranı)</span>
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">Görüntüleme Modu</span>
                      </div>

                      <div className="w-full h-[500px] border border-slate-200 rounded-xl overflow-hidden bg-slate-100">
                        <iframe
                          title="HTML Newsletter Preview"
                          srcDoc={renderEmailHtml({
                            title: newsletterTitle,
                            subtitle: newsletterSubtitle,
                            bodyText: newsletterBody,
                            ctaText: newsletterCtaText,
                            ctaUrl: newsletterCtaUrl,
                            bannerImage: newsletterBanner,
                            badgeText: newsletterBadge,
                            specialOfferBox: newsletterOfferBox,
                            contactPhone: contactData.phoneDisplay,
                            contactEmail: contactData.email,
                            contactAddress: contactData.address
                          })}
                          className="w-full h-full border-none"
                        />
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            )}

            {/* SECTION 2: SUBSCRIBERS LIST TABLE */}
            {newsletterSubTab === 'subscribers' && (
              <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-6">
                
                {/* Header & Quick Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
                  <div>
                    <h3 className="font-bold text-[#111111] text-lg flex items-center gap-2">
                      <Users className="w-5 h-5 text-[#082C6C]" />
                      <span>Haber Bülteni & Katalog Aboneleri Listesi</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Sitedeki e-bülten ve katalog formundan veya fuar kayıtlarından aboneliğe kaydolan tüm e-posta adresleri.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyEmails}
                      disabled={subscribers.length === 0}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <Copy className="w-3.5 h-3.5 text-[#082C6C]" />
                      <span>Tüm E-Postaları Kopyala</span>
                    </button>

                    <button
                      onClick={handleDownloadCSV}
                      disabled={subscribers.length === 0}
                      className="px-3.5 py-2 rounded-xl bg-[#082C6C] hover:bg-[#163E87] text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-50"
                    >
                      <Download className="w-3.5 h-3.5 text-amber-300" />
                      <span>CSV İndir</span>
                    </button>
                  </div>
                </div>

                {/* Add New Subscriber & Search Bar */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                  {/* Manual Add Form */}
                  <form onSubmit={handleAddSubscriber} className="lg:col-span-6 flex gap-2">
                    <input
                      type="email"
                      required
                      value={newSubEmail}
                      onChange={(e) => setNewSubEmail(e.target.value)}
                      placeholder="Manuel yeni e-posta abonesi ekle..."
                      className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:border-[#082C6C] focus:outline-none bg-slate-50 font-medium"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1 cursor-pointer shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Abone Ekle</span>
                    </button>
                  </form>

                  {/* Filter Search */}
                  <div className="lg:col-span-6 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Search className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={subscriberSearch}
                      onChange={(e) => setSubscriberSearch(e.target.value)}
                      placeholder="E-postaya göre filtrele..."
                      className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 focus:border-[#082C6C] focus:outline-none bg-slate-50 font-medium"
                    />
                  </div>
                </div>

                {/* Subscribers Table */}
                {isSubscribersLoading ? (
                  <div className="p-8 text-center text-xs text-slate-500 font-medium">
                    Aboneler yükleniyor...
                  </div>
                ) : subscribers.length === 0 ? (
                  <div className="p-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-500 space-y-2">
                    <Mail className="w-8 h-8 text-slate-400 mx-auto" />
                    <p className="text-sm font-semibold">Henüz e-bülten abonesi bulunmuyor.</p>
                    <p className="text-xs">Sitedeki e-bülten alanından abone olan müşteriler burada listelenecektir.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto border border-slate-200 rounded-xl">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                        <tr>
                          <th className="p-3">#</th>
                          <th className="p-3">E-Posta Adresi</th>
                          <th className="p-3">Kayıt Tarihi</th>
                          <th className="p-3">Kaynak</th>
                          <th className="p-3 text-right">İşlem</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {subscribers
                          .filter(s => s.email.toLowerCase().includes(subscriberSearch.toLowerCase()))
                          .map((sub, idx) => (
                            <tr key={sub.id || idx} className="hover:bg-slate-50 transition-colors">
                              <td className="p-3 font-mono text-slate-400">{idx + 1}</td>
                              <td className="p-3 font-semibold text-[#082C6C]">
                                <a href={`mailto:${sub.email}`} className="hover:underline">
                                  {sub.email}
                                </a>
                              </td>
                              <td className="p-3 text-slate-600 font-mono">
                                {sub.createdAt ? new Date(sub.createdAt).toLocaleString('tr-TR') : 'Bugün'}
                              </td>
                              <td className="p-3">
                                <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-bold uppercase border border-blue-200">
                                  {sub.source || 'Web Form'}
                                </span>
                              </td>
                              <td className="p-3 text-right">
                                <button
                                  onClick={() => handleDeleteSubscriber(sub.id)}
                                  className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                                  title="Aboneyi Sil"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}

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


import React, { useState } from 'react';
import { 
  ShieldCheck, 
  UploadCloud, 
  CheckCircle2, 
  KeyRound, 
  Image as ImageIcon, 
  ArrowRight, 
  ArrowLeft, 
  Lock, 
  Sparkles, 
  Loader2, 
  AlertCircle,
  Eye,
  EyeOff,
  Github
} from 'lucide-react';
import { useAppImages } from '../../context/ImageContext';

interface FirstTimeSetupModalProps {
  sessionToken: string | null;
  onCompleted: () => void;
}

export const FirstTimeSetupModal: React.FC<FirstTimeSetupModalProps> = ({ sessionToken, onCompleted }) => {
  const { 
    images, 
    updateHeroImage, 
    updateAboutImage, 
    updateCollectionImage,
    updateSystemConfig,
    aboutSlides,
    updateAboutSlide,
    publishSettings,
    isDeploying
  } = useAppImages();

  const [activeStep, setActiveStep] = useState<number>(1); // Step 1: Password, Step 2: Upload Images, Step 3: Finish & Deploy

  // Step 1: Password State
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [passError, setPassError] = useState<string | null>(null);
  const [isChangingPass, setIsChangingPass] = useState(false);

  // Step 2: Photo Upload Statuses
  const [uploadingTarget, setUploadingTarget] = useState<string | null>(null);
  const [heroImageFile, setHeroImageFile] = useState<string>(images.heroImage || '');
  const [aboutImageFile, setAboutImageFile] = useState<string>(images.aboutImage || '');
  
  // Finish Step
  const [isFinishing, setIsFinishing] = useState(false);
  const [finishError, setFinishError] = useState<string | null>(null);

  // Handle Password Change
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError(null);

    if (!newPassword || newPassword.length < 4) {
      setPassError('Yeni şifreniz en az 4 karakter olmalıdır.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPassError('Girilen şifreler eşleşmiyor. Lütfen kontrol edin.');
      return;
    }

    setIsChangingPass(true);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionToken || ''}`
        },
        body: JSON.stringify({ newPassword })
      });
      const data = await res.json();
      if (data.success) {
        setPasswordChanged(true);
        setPassError(null);
      } else {
        setPassError(data.error || 'Şifre değiştirilemedi.');
      }
    } catch (err: any) {
      setPassError(err?.message || 'Bağlantı hatası oluştu.');
    } finally {
      setIsChangingPass(false);
    }
  };

  // Helper for FileReader image upload
  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    onSuccess: (base64Url: string) => void,
    targetKey: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('Seçilen dosya çok büyük. Lütfen 10MB altı bir fotoğraf seçin.');
      return;
    }

    setUploadingTarget(targetKey);
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        onSuccess(result);
      }
      setUploadingTarget(null);
    };
    reader.onerror = () => {
      alert('Dosya okunamadı. Lütfen başka bir resim deneyin.');
      setUploadingTarget(null);
    };
    reader.readAsDataURL(file);
  };

  // Finish Setup & Commit to GitHub
  const handleCompleteSetupAndPublish = async () => {
    setIsFinishing(true);
    setFinishError(null);

    try {
      // 1. Set onboarding as completed in system config
      updateSystemConfig({ isOnboardingCompleted: true });

      // 2. Trigger automatic GitHub publication of all uploaded photos and settings
      const publishRes = await publishSettings();

      if (publishRes && publishRes.success) {
        onCompleted();
      } else {
        setFinishError(publishRes?.error || 'GitHub kayıt işlemi tamamlanamadı. Lütfen tekrar deneyin.');
      }
    } catch (err: any) {
      setFinishError(err?.message || 'Bir hata oluştu.');
    } finally {
      setIsFinishing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#030F26]/90 backdrop-blur-xl z-[99999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in font-sans">
      <div className="bg-[#062050] border border-[#D4AF37]/30 rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden text-white my-auto flex flex-col max-h-[92vh]">
        
        {/* Header Section */}
        <div className="bg-gradient-to-r from-[#0A2D6F] via-[#062050] to-[#0A2D6F] px-6 py-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#D4AF37] to-amber-200 p-0.5 shadow-lg flex items-center justify-center">
              <div className="w-full h-full bg-[#062050] rounded-[14px] flex items-center justify-center text-[#D4AF37]">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold tracking-widest uppercase bg-[#D4AF37]/20 text-[#D4AF37] px-2.5 py-0.5 rounded-full border border-[#D4AF37]/30">
                  Zorunlu İlk Kurulum
                </span>
              </div>
              <h2 className="text-lg font-serif font-bold text-white tracking-wide mt-0.5">
                İrem Comfort Yönetim Paneli Kurulum Sihirbazı
              </h2>
            </div>
          </div>

          {/* Stepper Indicator */}
          <div className="hidden sm:flex items-center gap-2 bg-black/20 p-1.5 rounded-2xl border border-white/10">
            <div className={`px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeStep === 1 ? 'bg-[#D4AF37] text-[#062050]' : passwordChanged ? 'text-emerald-400' : 'text-slate-400'
            }`}>
              <KeyRound className="w-3.5 h-3.5" />
              <span>1. Şifre</span>
            </div>
            <span className="text-slate-600 text-xs">•</span>
            <div className={`px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeStep === 2 ? 'bg-[#D4AF37] text-[#062050]' : 'text-slate-400'
            }`}>
              <ImageIcon className="w-3.5 h-3.5" />
              <span>2. Fotoğraflar</span>
            </div>
            <span className="text-slate-600 text-xs">•</span>
            <div className={`px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeStep === 3 ? 'bg-[#D4AF37] text-[#062050]' : 'text-slate-400'
            }`}>
              <Github className="w-3.5 h-3.5" />
              <span>3. GitHub Kayıt</span>
            </div>
          </div>
        </div>

        {/* Modal Body / Scrollable Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">

          {/* STEP 1: PASSWORD CHANGE */}
          {activeStep === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-[#0A2D6F]/50 border border-amber-500/30 rounded-2xl p-4 flex items-start gap-3.5 text-amber-200">
                <Lock className="w-6 h-6 text-[#D4AF37] shrink-0 mt-0.5" />
                <div className="text-sm leading-relaxed">
                  <strong className="text-white font-semibold block mb-0.5">1. Adım: Zorunlu Güvenlik Şifresi Değişikliği</strong>
                  Site yayınlandıktan sonra sistem güvenliğiniz için ilk girişte varsayılan şifreyi değiştirmeniz gerekmektedir. Lütfen yeni yönetici şifrenizi belirleyin.
                </div>
              </div>

              {passwordChanged ? (
                <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-2xl p-6 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-bold text-emerald-300">Şifreniz Başarıyla Değiştirildi!</h3>
                  <p className="text-xs text-emerald-200/80 max-w-md mx-auto">
                    Yeni şifreniz sisteme kaydedildi. Artık yönetim paneline yeni belirlediğiniz şifreniz ile giriş yapabilirsiniz.
                  </p>
                  <button
                    onClick={() => setActiveStep(2)}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#D4AF37] text-[#062050] font-bold rounded-xl text-sm hover:bg-amber-300 transition-all shadow-lg mt-2"
                  >
                    <span>Fotoğraf Yükleme Adımına Geç</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleChangePassword} className="space-y-4 max-w-lg mx-auto bg-black/20 p-6 rounded-2xl border border-white/10">
                  {passError && (
                    <div className="bg-rose-950/60 border border-rose-500/40 text-rose-200 px-4 py-3 rounded-xl text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>{passError}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      Yeni Yönetici Şifresi
                    </label>
                    <div className="relative">
                      <input
                        type={showPass ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="En az 4 karakter yeni şifreniz"
                        required
                        className="w-full bg-[#030F26] border border-white/20 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#D4AF37] transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                      >
                        {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      Yeni Şifre Tekrar
                    </label>
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Yeni şifrenizi tekrar girin"
                      required
                      className="w-full bg-[#030F26] border border-white/20 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#D4AF37] transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isChangingPass}
                    className="w-full py-3 bg-gradient-to-r from-[#D4AF37] to-amber-300 text-[#062050] font-bold rounded-xl text-sm hover:brightness-110 transition-all shadow-xl flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isChangingPass ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Şifre Kaydediliyor...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Şifreyi Değiştir & Devam Et</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* STEP 2: IMAGE UPLOAD WIZARD */}
          {activeStep === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-[#0A2D6F]/50 border border-[#D4AF37]/30 rounded-2xl p-4 flex items-start gap-3.5 text-amber-200">
                <ImageIcon className="w-6 h-6 text-[#D4AF37] shrink-0 mt-0.5" />
                <div className="text-sm leading-relaxed">
                  <strong className="text-white font-semibold block mb-0.5">2. Adım: Kendi Fotoğraflarınızı Ekleyin</strong>
                  Sitedeki tüm örnek stok fotoğraflar kaldırılmıştır. Lütfen işletmenize ait hakiki deri terlik, sandalet ve atölye fotoğraflarınızı aşağıdan yükleyin.
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* 1. Hero Main Image */}
                <div className="bg-black/30 border border-white/10 rounded-2xl p-4 space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
                        Ana Sayfa Karşılama (Hero Banner)
                      </span>
                      {images.heroImage ? (
                        <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-md border border-emerald-500/30">
                          Yüklendi
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-md border border-amber-500/30">
                          Fotoğraf Bekleniyor
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-300">Ana sayfanın sağındaki en büyük ön plana çıkan ürün görseli.</p>
                  </div>

                  <div className="relative rounded-xl overflow-hidden bg-black/40 border border-white/10 h-36 flex items-center justify-center">
                    {images.heroImage ? (
                      <img src={images.heroImage} alt="Hero Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center p-3 text-slate-400 space-y-1">
                        <UploadCloud className="w-8 h-8 mx-auto text-[#D4AF37]/60" />
                        <p className="text-xs font-medium">Fotoğraf Seçin veya Sürükleyin</p>
                      </div>
                    )}
                  </div>

                  <label className="cursor-pointer block">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, (url) => {
                        updateHeroImage(url);
                        setHeroImageFile(url);
                      }, 'hero')}
                      className="hidden"
                    />
                    <div className="w-full py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-center text-xs font-semibold transition-all flex items-center justify-center gap-2">
                      {uploadingTarget === 'hero' ? (
                        <Loader2 className="w-4 h-4 animate-spin text-[#D4AF37]" />
                      ) : (
                        <UploadCloud className="w-4 h-4 text-[#D4AF37]" />
                      )}
                      <span>{images.heroImage ? 'Fotoğrafı Değiştir' : 'Hero Fotoğrafı Yükle'}</span>
                    </div>
                  </label>
                </div>

                {/* 2. About Image */}
                <div className="bg-black/30 border border-white/10 rounded-2xl p-4 space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
                        Hakkımızda / Atölye Görseli
                      </span>
                      {images.aboutImage ? (
                        <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-md border border-emerald-500/30">
                          Yüklendi
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-md border border-amber-500/30">
                          Fotoğraf Bekleniyor
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-300">Manisa atölyeniz veya marka kimliğiniz için görsel.</p>
                  </div>

                  <div className="relative rounded-xl overflow-hidden bg-black/40 border border-white/10 h-36 flex items-center justify-center">
                    {images.aboutImage ? (
                      <img src={images.aboutImage} alt="About Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center p-3 text-slate-400 space-y-1">
                        <UploadCloud className="w-8 h-8 mx-auto text-[#D4AF37]/60" />
                        <p className="text-xs font-medium">Fotoğraf Seçin veya Sürükleyin</p>
                      </div>
                    )}
                  </div>

                  <label className="cursor-pointer block">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, (url) => {
                        updateAboutImage(url);
                        setAboutImageFile(url);
                      }, 'about')}
                      className="hidden"
                    />
                    <div className="w-full py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-center text-xs font-semibold transition-all flex items-center justify-center gap-2">
                      {uploadingTarget === 'about' ? (
                        <Loader2 className="w-4 h-4 animate-spin text-[#D4AF37]" />
                      ) : (
                        <UploadCloud className="w-4 h-4 text-[#D4AF37]" />
                      )}
                      <span>{images.aboutImage ? 'Fotoğrafı Değiştir' : 'Atölye Fotoğrafı Yükle'}</span>
                    </div>
                  </label>
                </div>

                {/* 3. Slider Gallery First Slide */}
                <div className="bg-black/30 border border-white/10 rounded-2xl p-4 space-y-3 md:col-span-2">
                  <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider block">
                    Galeri & Slayt Görselleri (Sırayla Yükleyebilirsiniz)
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {aboutSlides.slice(0, 4).map((slide, idx) => (
                      <div key={slide.id} className="bg-black/40 border border-white/10 rounded-xl p-2 space-y-2 text-center">
                        <div className="h-20 bg-black/50 rounded-lg overflow-hidden flex items-center justify-center relative">
                          {slide.image ? (
                            <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-[10px] text-slate-400">Slayt {idx + 1}</span>
                          )}
                        </div>
                        <label className="cursor-pointer block">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, (url) => {
                              updateAboutSlide(slide.id, { image: url });
                            }, `slide_${slide.id}`)}
                            className="hidden"
                          />
                          <div className="py-1 px-2 bg-white/10 hover:bg-white/20 rounded text-[10px] font-semibold text-amber-200 transition-all flex items-center justify-center gap-1">
                            <UploadCloud className="w-3 h-3" />
                            <span>Yükle</span>
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <button
                  onClick={() => setActiveStep(1)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-slate-200 rounded-xl text-xs font-semibold transition-all flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Önceki Adıma Dön</span>
                </button>

                <button
                  onClick={() => setActiveStep(3)}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#D4AF37] to-amber-300 text-[#062050] font-bold rounded-xl text-sm hover:brightness-110 transition-all shadow-lg flex items-center gap-2"
                >
                  <span>Son Adıma Geç (İncele & Kaydet)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: FINISH & COMMIT TO GITHUB */}
          {activeStep === 3 && (
            <div className="space-y-6 animate-fade-in text-center max-w-xl mx-auto py-2">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#D4AF37] to-amber-200 p-1 shadow-2xl flex items-center justify-center mx-auto">
                <div className="w-full h-full bg-[#062050] rounded-full flex items-center justify-center text-[#D4AF37]">
                  <Github className="w-8 h-8 animate-bounce" />
                </div>
              </div>

              <div>
                <h3 className="text-xl font-serif font-bold text-white">Kurulumu Tamamlayın & GitHub'a Gönderin</h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Girdiğiniz yeni şifreniz ve yüklediğiniz fotoğraflar otomatik olarak site dosyalarına güncellenip GitHub deponuza kalıcı olarak kaydedilecektir. Bundan sonra site her açıldığında doğrudan sizin yüklediğiniz fotoğraflar yer alacaktır.
                </p>
              </div>

              <div className="bg-black/30 border border-white/10 rounded-2xl p-4 text-left space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-300">
                  <span>Yönetici Şifre Durumu:</span>
                  <span className={passwordChanged ? 'text-emerald-400 font-bold' : 'text-amber-300 font-bold'}>
                    {passwordChanged ? '✓ Şifre Değiştirildi' : 'Varsayılan Şifre'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Hero Fotoğrafı:</span>
                  <span className={images.heroImage ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
                    {images.heroImage ? '✓ Yüklendi' : 'Eksik (Daha sonra eklenebilir)'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Atölye / Hakkımızda Görseli:</span>
                  <span className={images.aboutImage ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
                    {images.aboutImage ? '✓ Yüklendi' : 'Eksik (Daha sonra eklenebilir)'}
                  </span>
                </div>
              </div>

              {finishError && (
                <div className="bg-rose-950/60 border border-rose-500/40 text-rose-200 px-4 py-3 rounded-xl text-xs flex items-center gap-2 text-left">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{finishError}</span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setActiveStep(2)}
                  disabled={isFinishing || isDeploying}
                  className="w-full sm:w-auto px-5 py-2.5 bg-white/10 hover:bg-white/20 text-slate-200 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Fotoğraflara Geri Dön</span>
                </button>

                <button
                  onClick={handleCompleteSetupAndPublish}
                  disabled={isFinishing || isDeploying}
                  className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[#D4AF37] via-amber-300 to-[#D4AF37] text-[#062050] font-extrabold rounded-2xl text-sm hover:brightness-110 transition-all shadow-2xl flex items-center justify-center gap-2.5 disabled:opacity-50"
                >
                  {isFinishing || isDeploying ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>GitHub'a Güncelleniyor & Kaydediliyor...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-[#062050]" />
                      <span>Kurulumu Tamamla & GitHub'a Gönder</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

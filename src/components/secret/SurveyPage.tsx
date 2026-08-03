import React, { useState } from 'react';
import { 
  Star, Heart, ThumbsUp, Check, ArrowLeft, ArrowRight, 
  Upload, Phone, MessageCircle, ExternalLink, Sparkles, 
  AlertCircle, ShoppingBag, CheckCircle2, RotateCcw
} from 'lucide-react';

interface SurveyPageProps {
  onReturnToSite?: () => void;
}

const STEP_ORDER = [
  'welcome', 'product', 'overall', 'details', 'fit', 
  'likes', 'comment', 'photo', 'nps', 'contact'
];

const STEP_LABELS: Record<string, string> = {
  welcome: 'Hoş Geldiniz',
  product: 'Ürün Bilgileri',
  overall: 'Genel Memnuniyet',
  details: 'Detaylı Değerlendirme',
  fit: 'Kalıp Değerlendirmesi',
  likes: 'Beğendiğiniz Özellikler',
  comment: 'Yorumunuz',
  photo: 'Fotoğraf Ekle',
  nps: 'Tavsiye Puanı',
  contact: 'İletişim Bilgileri'
};

const DETAIL_CRITERIA = [
  { key: 'comfort', label: 'Ayak Rahatlığı & Konfor' },
  { key: 'quality', label: 'Hakiki Deri / Malzeme Kalitesi' },
  { key: 'ortho', label: 'Ortopedik Taban Desteği' },
  { key: 'light', label: 'Hafiflik & Esneklik' },
  { key: 'design', label: 'Şıklık & Tasarım' },
  { key: 'price', label: 'Fiyat / Performans Dengesi' },
  { key: 'packaging', label: 'Özel Kutu & Paketleme' },
  { key: 'shipping', label: 'Kargo ve Teslimat Hızı' }
];

const LIKE_OPTIONS = [
  'Ayak Rahatlığı', 'Hakiki Deri Kalitesi', 'Hafifliği', 
  'Taban Yumuşaklığı', 'Şık Tasarımı', 'Renk Uyumu', 
  'Özenli Paketleme', 'Fiyat Avantajı'
];

export function SurveyPage({ onReturnToSite }: SurveyPageProps) {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  // Survey Form Data
  const [formData, setFormData] = useState<{
    platform: string;
    model: string;
    color: string;
    size: string;
    overall: number;
    comfort: number;
    quality: number;
    ortho: number;
    light: number;
    design: number;
    price: number;
    packaging: number;
    shipping: number;
    fit: string;
    likes: string[];
    comment: string;
    photoBase64: string;
    npsScore: number | null;
    name: string;
    phone: string;
    email: string;
    honeypot: string;
  }>({
    platform: '',
    model: '',
    color: '',
    size: '',
    overall: 0,
    comfort: 0,
    quality: 0,
    ortho: 0,
    light: 0,
    design: 0,
    price: 0,
    packaging: 0,
    shipping: 0,
    fit: '',
    likes: [],
    comment: '',
    photoBase64: '',
    npsScore: null,
    name: '',
    phone: '',
    email: '',
    honeypot: ''
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [thanksType, setThanksType] = useState<'good' | 'mid' | 'low' | null>(null);

  const currentStep = STEP_ORDER[currentStepIdx];

  // Navigation helpers
  const goNext = () => {
    setErrorMsg('');
    if (currentStepIdx < STEP_ORDER.length - 1) {
      setCurrentStepIdx((prev) => prev + 1);
    }
  };

  const goBack = () => {
    setErrorMsg('');
    if (currentStepIdx > 0) {
      setCurrentStepIdx((prev) => prev - 1);
    }
  };

  // Step validations
  const validateProduct = () => {
    if (!formData.platform || !formData.model.trim() || !formData.size) {
      setErrorMsg('Lütfen platform, ürün modeli ve numara alanlarını doldurunuz.');
      return;
    }
    goNext();
  };

  const validateOverall = () => {
    if (!formData.overall) {
      setErrorMsg('Lütfen genel memnuniyetinizi yıldızlarla puanlayınız.');
      return;
    }
    goNext();
  };

  const validateDetails = () => {
    const unrated = DETAIL_CRITERIA.filter((c) => (formData as any)[c.key] < 1);
    if (unrated.length > 0) {
      setErrorMsg(`Lütfen tüm başlıkları puanlayınız (${unrated.map((u) => u.label).join(', ')})`);
      return;
    }
    goNext();
  };

  const validateFit = () => {
    if (!formData.fit) {
      setErrorMsg('Lütfen kalıp değerlendirmesi seçiniz.');
      return;
    }
    goNext();
  };

  const validateLikes = () => {
    if (formData.likes.length === 0) {
      setErrorMsg('Lütfen en az bir beğendiğiniz özelliği seçiniz.');
      return;
    }
    goNext();
  };

  const validateNps = () => {
    if (formData.npsScore === null) {
      setErrorMsg('Lütfen 0 ile 10 arasında bir tavsiye puanı seçiniz.');
      return;
    }
    goNext();
  };

  // Calculate Average Score
  const calculateAverage = () => {
    const detailScores = [
      formData.comfort, formData.quality, formData.ortho, formData.light,
      formData.design, formData.price, formData.packaging, formData.shipping
    ].filter((v) => v > 0);

    const all = [formData.overall, ...detailScores];
    const sum = all.reduce((a, b) => a + b, 0);
    return Math.round((sum / all.length) * 10) / 10;
  };

  // Photo handle
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Fotoğraf boyutu 5MB altında olmalıdır.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setFormData((prev) => ({ ...prev, photoBase64: ev.target?.result as string }));
    };
    reader.readAsDataURL(file);
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.honeypot) {
      setThanksType('good');
      return;
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrorMsg('Lütfen geçerli bir e-posta adresi giriniz.');
      return;
    }

    setIsSubmitting(true);
    const avgScore = calculateAverage();

    try {
      await fetch('/api/survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.name || 'Anket Müşterisi',
          phone: formData.phone,
          email: formData.email,
          platform: formData.platform,
          model: formData.model,
          color: formData.color,
          size: formData.size,
          overall: formData.overall,
          comfort: formData.comfort,
          quality: formData.quality,
          ortho: formData.ortho,
          light: formData.light,
          design: formData.design,
          price: formData.price,
          packaging: formData.packaging,
          shipping: formData.shipping,
          fit: formData.fit,
          likes: formData.likes,
          comment: formData.comment,
          npsScore: formData.npsScore,
          avgScore: avgScore
        })
      });
    } catch (err) {
      console.error('Survey submission API error:', err);
    } finally {
      setIsSubmitting(false);
      if (avgScore >= 4) setThanksType('good');
      else if (avgScore >= 3) setThanksType('mid');
      else setThanksType('low');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col items-center justify-center p-4 font-sans selection:bg-[#082C6C] selection:text-white">
      
      {/* Container */}
      <div className="w-full max-w-lg bg-white border border-slate-200/80 rounded-3xl shadow-xl overflow-hidden transition-all duration-300 relative my-6">
        
        {/* Brand Header */}
        <div className="bg-[#082C6C] text-white p-6 sm:p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#062050] via-[#082C6C] to-[#0A3888] opacity-90" />
          <div className="relative z-10">
            <span className="text-[10px] tracking-[6px] text-[#C8A96E] uppercase font-bold block mb-1">
              İrem Comfort Ayakkabıcılık
            </span>
            <h1 className="text-xl sm:text-2xl font-bold font-serif tracking-wide text-white">
              Müşteri Deneyim Anketi
            </h1>
            <div className="w-12 h-0.5 bg-[#C8A96E] mx-auto mt-2.5 opacity-80" />
          </div>
        </div>

        {/* Progress Bar */}
        {!thanksType && (
          <div className="bg-slate-100 border-b border-slate-200 px-6 py-3 flex items-center justify-between text-xs text-slate-600 font-medium">
            <span className="text-[#082C6C] font-bold">
              Adım {currentStepIdx + 1} / {STEP_ORDER.length}: {STEP_LABELS[currentStep]}
            </span>
            <div className="w-24 h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#082C6C] transition-all duration-300"
                style={{ width: `${((currentStepIdx + 1) / STEP_ORDER.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Step Body */}
        <div className="p-6 sm:p-8">

          {/* 1. WELCOME STEP */}
          {!thanksType && currentStep === 'welcome' && (
            <div className="text-center space-y-6 py-2">
              <div className="w-16 h-16 rounded-full bg-[#082C6C]/10 text-[#082C6C] flex items-center justify-center mx-auto border border-[#082C6C]/20 shadow-xs">
                <Heart className="w-8 h-8 fill-[#082C6C]/20" />
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-bold text-slate-900 font-serif">
                  İrem Comfort'u Tercih Ettiğiniz İçin Teşekkür Ederiz
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
                  Görüşleriniz ve deneyiminiz bizim için çok değerlidir. Bu kısa anket yaklaşık 1 dakika sürmektedir ve ayakkabı kalitemizi geliştirmemize doğrudan katkı sağlar.
                </p>
              </div>

              <button
                type="button"
                onClick={goNext}
                className="w-full py-3.5 bg-[#082C6C] hover:bg-[#062050] text-white font-bold text-xs uppercase tracking-[2px] rounded-xl transition-all shadow-md active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Ankete Başla</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* 2. PRODUCT STEP */}
          {!thanksType && currentStep === 'product' && (
            <div className="space-y-5">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C8A96E]">1. Adım</span>
                <h2 className="text-lg font-bold text-slate-900">Satın Aldığınız Ürün Bilgileri</h2>
              </div>

              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">Satın Alınan Platform *</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Trendyol', 'Web Sitesi', 'Diğer'].map((plat) => (
                      <button
                        key={plat}
                        type="button"
                        onClick={() => setFormData((p) => ({ ...p, platform: plat }))}
                        className={`py-2.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                          formData.platform === plat
                            ? 'bg-[#082C6C] text-white border-[#082C6C]'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-[#082C6C]'
                        }`}
                      >
                        {plat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">Ürün Modeli Adı *</label>
                  <input
                    type="text"
                    value={formData.model}
                    onChange={(e) => setFormData((p) => ({ ...p, model: e.target.value }))}
                    placeholder="Örn: Pera Comfort Hakiki Deri Bot"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#082C6C]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">Renk</label>
                    <input
                      type="text"
                      value={formData.color}
                      onChange={(e) => setFormData((p) => ({ ...p, color: e.target.value }))}
                      placeholder="Örn: Taba / Siyah"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#082C6C]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">Numara *</label>
                    <select
                      value={formData.size}
                      onChange={(e) => setFormData((p) => ({ ...p, size: e.target.value }))}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#082C6C]"
                    >
                      <option value="">Seçiniz</option>
                      {['36', '37', '38', '39', '40', '41'].map((sz) => (
                        <option key={sz} value={sz}>{sz} Numara</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={goBack}
                  className="px-4 py-3 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-all"
                >
                  Geri
                </button>
                <button
                  type="button"
                  onClick={validateProduct}
                  className="flex-1 py-3 bg-[#082C6C] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#062050] transition-all cursor-pointer"
                >
                  Devam Et
                </button>
              </div>
            </div>
          )}

          {/* 3. OVERALL RATING */}
          {!thanksType && currentStep === 'overall' && (
            <div className="space-y-6 text-center">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C8A96E]">2. Adım</span>
                <h2 className="text-lg font-bold text-slate-900">Genel Memnuniyet Puanınız</h2>
                <p className="text-xs text-slate-500 mt-1">Ürünümüzden genel olarak ne kadar memnun kaldınız?</p>
              </div>

              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center justify-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="flex justify-center items-center gap-2 py-4">
                {[1, 2, 3, 4, 5].map((starIdx) => (
                  <button
                    key={starIdx}
                    type="button"
                    onClick={() => setFormData((p) => ({ ...p, overall: starIdx }))}
                    className="p-1 hover:scale-110 transition-transform cursor-pointer"
                  >
                    <Star
                      className={`w-10 h-10 ${
                        starIdx <= formData.overall
                          ? 'fill-[#C8A96E] text-[#C8A96E]'
                          : 'text-slate-200 fill-slate-100'
                      }`}
                    />
                  </button>
                ))}
              </div>

              {formData.overall > 0 && (
                <span className="text-xs font-bold text-[#082C6C] block">
                  {formData.overall === 5 && '🌟 Harika! Çok Memnun Kaldım'}
                  {formData.overall === 4 && '👍 Çok İyi / Beklentimi Karşıladı'}
                  {formData.overall === 3 && '😐 Orta / İdare Eder'}
                  {formData.overall === 2 && '👎 Beklentimin Altında'}
                  {formData.overall === 1 && '😞 Memnun Kalmadım'}
                </span>
              )}

              <div className="flex gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={goBack}
                  className="px-4 py-3 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-all"
                >
                  Geri
                </button>
                <button
                  type="button"
                  onClick={validateOverall}
                  className="flex-1 py-3 bg-[#082C6C] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#062050] transition-all cursor-pointer"
                >
                  Devam Et
                </button>
              </div>
            </div>
          )}

          {/* 4. DETAILS CRITERIA */}
          {!thanksType && currentStep === 'details' && (
            <div className="space-y-5">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C8A96E]">3. Adım</span>
                <h2 className="text-lg font-bold text-slate-900">Detaylı Özellik Değerlendirmesi</h2>
                <p className="text-xs text-slate-500">Her bir kriter için 1 ile 5 yıldız arasında değerlendiriniz.</p>
              </div>

              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {DETAIL_CRITERIA.map((crit) => {
                  const val = (formData as any)[crit.key] || 0;
                  return (
                    <div key={crit.key} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-slate-800">{crit.label}</span>
                      <div className="flex items-center gap-1 shrink-0">
                        {[1, 2, 3, 4, 5].map((st) => (
                          <button
                            key={st}
                            type="button"
                            onClick={() => setFormData((p) => ({ ...p, [crit.key]: st }))}
                            className="p-0.5 cursor-pointer"
                          >
                            <Star
                              className={`w-5 h-5 ${
                                st <= val ? 'fill-[#C8A96E] text-[#C8A96E]' : 'text-slate-300 fill-slate-100'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={goBack}
                  className="px-4 py-3 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-all"
                >
                  Geri
                </button>
                <button
                  type="button"
                  onClick={validateDetails}
                  className="flex-1 py-3 bg-[#082C6C] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#062050] transition-all cursor-pointer"
                >
                  Devam Et
                </button>
              </div>
            </div>
          )}

          {/* 5. FIT */}
          {!thanksType && currentStep === 'fit' && (
            <div className="space-y-5">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C8A96E]">4. Adım</span>
                <h2 className="text-lg font-bold text-slate-900">Numara Kalıp Değerlendirmesi</h2>
                <p className="text-xs text-slate-500">Ayakkabının kalıbı ayağınıza nasıl oturdu?</p>
              </div>

              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="space-y-2.5">
                {[
                  { id: 'Küçük Geldi', label: 'Küçük Geldi (Bir numara büyük alınmalı)' },
                  { id: 'Tam Kalıp', label: 'Tam Kalıp (Kendi numaranızı alabilirsiniz)' },
                  { id: 'Büyük Geldi', label: 'Büyük Geldi (Bir numara küçük alınmalı)' }
                ].map((fitOpt) => (
                  <button
                    key={fitOpt.id}
                    type="button"
                    onClick={() => setFormData((p) => ({ ...p, fit: fitOpt.id }))}
                    className={`w-full p-3.5 text-xs font-semibold text-left rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      formData.fit === fitOpt.id
                        ? 'bg-[#082C6C] text-white border-[#082C6C]'
                        : 'bg-slate-50 text-slate-800 border-slate-200 hover:border-[#082C6C]'
                    }`}
                  >
                    <span>{fitOpt.label}</span>
                    {formData.fit === fitOpt.id && <Check className="w-4 h-4 text-[#C8A96E]" />}
                  </button>
                ))}
              </div>

              <div className="flex gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={goBack}
                  className="px-4 py-3 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-all"
                >
                  Geri
                </button>
                <button
                  type="button"
                  onClick={validateFit}
                  className="flex-1 py-3 bg-[#082C6C] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#062050] transition-all cursor-pointer"
                >
                  Devam Et
                </button>
              </div>
            </div>
          )}

          {/* 6. LIKES */}
          {!thanksType && currentStep === 'likes' && (
            <div className="space-y-5">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C8A96E]">5. Adım</span>
                <h2 className="text-lg font-bold text-slate-900">En Çok Beğendiğiniz Özellikler</h2>
                <p className="text-xs text-slate-500">Birden fazla seçenek işaretleyebilirsiniz.</p>
              </div>

              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2.5">
                {LIKE_OPTIONS.map((opt) => {
                  const isChecked = formData.likes.includes(opt);
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        setFormData((p) => ({
                          ...p,
                          likes: isChecked ? p.likes.filter((l) => l !== opt) : [...p.likes, opt]
                        }));
                      }}
                      className={`p-3 text-xs font-semibold rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
                        isChecked
                          ? 'bg-[#082C6C]/10 border-[#082C6C] text-[#082C6C]'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                        isChecked ? 'bg-[#082C6C] border-[#082C6C] text-white' : 'border-slate-300 bg-white'
                      }`}>
                        {isChecked && <Check className="w-3 h-3" />}
                      </div>
                      <span className="truncate">{opt}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={goBack}
                  className="px-4 py-3 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-all"
                >
                  Geri
                </button>
                <button
                  type="button"
                  onClick={validateLikes}
                  className="flex-1 py-3 bg-[#082C6C] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#062050] transition-all cursor-pointer"
                >
                  Devam Et
                </button>
              </div>
            </div>
          )}

          {/* 7. COMMENT */}
          {!thanksType && currentStep === 'comment' && (
            <div className="space-y-5">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C8A96E]">6. Adım</span>
                <h2 className="text-lg font-bold text-slate-900">Müşteri Yorumu & Önerileriniz</h2>
                <p className="text-xs text-slate-500">Deneyiminizi ve fikirlerinizi detaylıca paylaşabilirsiniz.</p>
              </div>

              <textarea
                rows={4}
                value={formData.comment}
                onChange={(e) => setFormData((p) => ({ ...p, comment: e.target.value }))}
                placeholder="Ürün hakkındaki görüşlerinizi, konforunu veya geliştirilmesini istediğiniz detayları yazabilirsiniz..."
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#082C6C]"
              />

              <div className="flex gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={goBack}
                  className="px-4 py-3 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-all"
                >
                  Geri
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  className="flex-1 py-3 bg-[#082C6C] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#062050] transition-all cursor-pointer"
                >
                  Devam Et
                </button>
              </div>
            </div>
          )}

          {/* 8. PHOTO */}
          {!thanksType && currentStep === 'photo' && (
            <div className="space-y-5">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C8A96E]">7. Adım (İsteğe Bağlı)</span>
                <h2 className="text-lg font-bold text-slate-900">Ürün Fotoğrafı Ekleyin</h2>
                <p className="text-xs text-slate-500">Ayağınızdaki duruşunu veya kutu açılımı görselini paylaşabilirsiniz.</p>
              </div>

              <label className="block p-6 border-2 border-dashed border-slate-300 hover:border-[#082C6C] bg-slate-50 rounded-2xl text-center cursor-pointer transition-all">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <Upload className="w-8 h-8 text-[#082C6C] mx-auto mb-2" />
                <span className="text-xs font-bold text-slate-700 block">
                  {formData.photoBase64 ? 'Fotoğraf Değiştir' : 'Fotoğraf Yüklemek İçin Dokunun'}
                </span>
                <span className="text-[11px] text-slate-400 block mt-1">Maksimum 5MB (JPG, PNG)</span>
              </label>

              {formData.photoBase64 && (
                <img
                  src={formData.photoBase64}
                  alt="Önizleme"
                  className="w-full h-36 object-contain rounded-xl border border-slate-200 bg-white p-2"
                />
              )}

              <div className="flex gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={goBack}
                  className="px-4 py-3 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-all"
                >
                  Geri
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  className="flex-1 py-3 bg-[#082C6C] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#062050] transition-all cursor-pointer"
                >
                  {formData.photoBase64 ? 'Devam Et' : 'Geç / Devam Et'}
                </button>
              </div>
            </div>
          )}

          {/* 9. NPS */}
          {!thanksType && currentStep === 'nps' && (
            <div className="space-y-5 text-center">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C8A96E]">8. Adım</span>
                <h2 className="text-lg font-bold text-slate-900">Bizi Yakınlarınıza Tavsiye Eder misiniz?</h2>
                <p className="text-xs text-slate-500">0 (Kesinlikle Etmem) ile 10 (Kesinlikle Ederim) arası puan veriniz.</p>
              </div>

              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center justify-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-11 gap-1">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setFormData((p) => ({ ...p, npsScore: num }))}
                    className={`aspect-square rounded-lg border text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                      formData.npsScore === num
                        ? 'bg-[#082C6C] text-white border-[#082C6C]'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-[#082C6C]'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>

              <div className="flex justify-between text-[10px] text-slate-400 font-medium px-1">
                <span>0 - Hiç Olası Değil</span>
                <span>10 - Kesinlikle Tavsiye Ederim</span>
              </div>

              <div className="flex gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={goBack}
                  className="px-4 py-3 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-all"
                >
                  Geri
                </button>
                <button
                  type="button"
                  onClick={validateNps}
                  className="flex-1 py-3 bg-[#082C6C] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#062050] transition-all cursor-pointer"
                >
                  Devam Et
                </button>
              </div>
            </div>
          )}

          {/* 10. CONTACT & SUBMIT */}
          {!thanksType && currentStep === 'contact' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C8A96E]">Son Adım (İsteğe Bağlı)</span>
                <h2 className="text-lg font-bold text-slate-900">İletişim Bilgileriniz</h2>
                <p className="text-xs text-slate-500">Gerektiğinde size geri bildirimde bulunabilmemiz için doldurabilirsiniz.</p>
              </div>

              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Ad Soyad</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                    placeholder="Adınız ve Soyadınız"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#082C6C]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Telefon Numarası</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                    placeholder="05XX XXX XX XX"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#082C6C]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">E-Posta Adresi</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                    placeholder="ornek@email.com"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#082C6C]"
                  />
                </div>
              </div>

              {/* Honeypot */}
              <input
                type="text"
                value={formData.honeypot}
                onChange={(e) => setFormData((p) => ({ ...p, honeypot: e.target.value }))}
                className="hidden"
                tabIndex={-1}
              />

              <div className="flex gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={goBack}
                  className="px-4 py-3 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-all"
                >
                  Geri
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3.5 bg-[#082C6C] hover:bg-[#062050] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Gönderiliyor...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-[#C8A96E]" />
                      <span>Anketi Tamamla</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* THANKS SCREENS */}
          {thanksType === 'good' && (
            <div className="text-center space-y-5 py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-slate-900 font-serif">
                  İrem Comfort Ailesi Olarak Çok Mutlu Olduk! 🌟
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
                  Ürünümüzden ve kalitemizden memnun kalmanıza çok sevindik. Değerli vaktiniz ve geri bildiriminiz için yürekten teşekkür ederiz.
                </p>
              </div>

              {/* 50 TL Discount Coupon Box */}
              <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl text-center space-y-1 my-3 shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-800 block">
                  🎁 Teşekkür Hediyeniz — 50 TL İndirim Kodunuz
                </span>
                <span className="text-2xl font-black font-mono text-[#082C6C] bg-white px-4 py-1 rounded-lg border border-amber-400 inline-block tracking-wider my-1">
                  THANKS50
                </span>
                <p className="text-[11px] text-amber-900 font-medium">
                  <strong>Trendyol Mağazamızda</strong>, web sitemizde ve WhatsApp sipariş hattımızda geçerlidir.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <a
                  href="https://www.trendyol.com/magaza/irem-comfort-m-1286942?sst=0&channelId=1"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 bg-[#f27a1a] hover:bg-[#d6650d] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-md shadow-orange-500/20"
                >
                  <ShoppingBag className="w-4 h-4 text-white" />
                  <span>Trendyol Mağazamıza Git ve Alışveriş Yap</span>
                </a>

                <a
                  href="https://www.trendyol.com/magaza/irem-comfort-m-1286942?sst=0&channelId=1"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 bg-[#082C6C] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4 text-[#C8A96E]" />
                  <span>Trendyol'da Değerlendirme Yap</span>
                </a>

                <a
                  href="https://www.instagram.com/irem.comfort"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <span>Instagram Sayfamızı Ziyaret Et</span>
                </a>

                {onReturnToSite && (
                  <button
                    onClick={onReturnToSite}
                    className="w-full py-2.5 text-xs text-slate-500 font-semibold hover:underline"
                  >
                    Ana Sayfaya Dön
                  </button>
                )}
              </div>
            </div>
          )}

          {thanksType === 'mid' && (
            <div className="text-center space-y-5 py-4">
              <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
                <Sparkles className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-slate-900 font-serif">
                  Değerli Görüşleriniz İçin Teşekkür Ederiz
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
                  Ürünlerimizi ve hizmetimizi daha mükemmel hale getirmek için paylaştığınız detayları dikkatle inceleyeceğiz.
                </p>
              </div>

              {/* 50 TL Discount Coupon Box */}
              <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl text-center space-y-1 my-3 shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-800 block">
                  🎁 Teşekkür Hediyeniz — 50 TL İndirim Kodunuz
                </span>
                <span className="text-2xl font-black font-mono text-[#082C6C] bg-white px-4 py-1 rounded-lg border border-amber-400 inline-block tracking-wider my-1">
                  THANKS50
                </span>
                <p className="text-[11px] text-amber-900 font-medium">
                  <strong>Trendyol Mağazamızda</strong>, web sitemizde ve WhatsApp sipariş hattımızda geçerlidir.
                </p>
              </div>

              <div className="pb-2">
                <a
                  href="https://www.trendyol.com/magaza/irem-comfort-m-1286942?sst=0&channelId=1"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 bg-[#f27a1a] hover:bg-[#d6650d] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <ShoppingBag className="w-4 h-4 text-white" />
                  <span>Trendyol Mağazamıza Git</span>
                </a>
              </div>

              {onReturnToSite && (
                <div className="pt-2">
                  <button
                    onClick={onReturnToSite}
                    className="px-6 py-3 bg-[#082C6C] text-white font-bold text-xs uppercase tracking-wider rounded-xl"
                  >
                    Ana Sayfaya Dön
                  </button>
                </div>
              )}
            </div>
          )}

          {thanksType === 'low' && (
            <div className="text-center space-y-5 py-4">
              <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
                <AlertCircle className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-slate-900 font-serif">
                  Beklentinizi Karşılayamadığımız İçin Üzgünüz
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
                  Lütfen bize yaşadığınız sorunu iletiniz. Müşteri temsilcilerimiz size yardımcı olmak ve telafi etmek için hazır beklemektedir.
                </p>
              </div>

              {/* 50 TL Discount Coupon Box */}
              <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl text-center space-y-1 my-3 shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-800 block">
                  🎁 Teşekkür Hediyeniz — 50 TL İndirim Kodunuz
                </span>
                <span className="text-2xl font-black font-mono text-[#082C6C] bg-white px-4 py-1 rounded-lg border border-amber-400 inline-block tracking-wider my-1">
                  THANKS50
                </span>
                <p className="text-[11px] text-amber-900 font-medium">
                  <strong>Trendyol Mağazamızda</strong>, web sitemizde ve WhatsApp sipariş hattımızda geçerlidir.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <a
                  href="https://wa.me/905330297125?text=Merhaba,%20anket%20üzerinden%20geri%20bildirimde%20bulundum.%20İletişime%20geçmek%20istiyorum."
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Canlı Destek Hattı</span>
                </a>

                {onReturnToSite && (
                  <button
                    onClick={onReturnToSite}
                    className="w-full py-2.5 text-xs text-slate-500 font-semibold hover:underline"
                  >
                    Ana Sayfaya Dön
                  </button>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Card Footer */}
        <div className="p-3 bg-slate-100 border-t border-slate-200 text-center text-[10px] text-slate-500 uppercase tracking-widest font-semibold">
          İrem Comfort — Müşteri Deneyimi Ekibi
        </div>
      </div>

    </div>
  );
}

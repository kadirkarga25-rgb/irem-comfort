import React from 'react';
import { Image as ImageIcon, Layers, MessageSquare, Phone, Save, Star, Wrench, FileText } from 'lucide-react';
import { useAppImages } from '../../context/ImageContext';

export const SiteContentAdminTab: React.FC = () => {
  const {
    images, heroConfig, rawHeroConfig, updateHeroConfig, updateHeroImage,
    announcements, rawAnnouncements, updateAnnouncements,
    collectionItems, updateCollectionItem,
    aboutSlides, rawAboutSlides, updateAboutSlide,
    craftsmanshipSteps, rawCraftsmanshipSteps, updateCraftsmanshipStep,
    faqItems, rawFaqItems, updateFaqItem,
    contactData, updateContactData,
    markDirty
  } = useAppImages();

  const hero = rawHeroConfig || heroConfig;
  const ann = rawAnnouncements || announcements || [];
  const brandSlides = (rawAboutSlides || aboutSlides || []).slice(0,4);
  const workshopSteps = (rawCraftsmanshipSteps || craftsmanshipSteps || []).slice(0,4);
  const faqs = (rawFaqItems || faqItems || []).slice(0,6);
  const selected = collectionItems.filter(i => i.isFeatured);

  const toggleFeatured = async (id: string, checked: boolean) => {
    if (checked && selected.length >= 6) {
      window.alert('Ana sayfada en fazla 6 öne çıkan ürün seçebilirsiniz.');
      return;
    }
    await updateCollectionItem(id, { isFeatured: checked });
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-[#062050] to-[#0A3680] text-white rounded-2xl p-5 shadow-lg">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-[10px] uppercase tracking-[0.22em] text-amber-300 font-black">Site İçerik Merkezi</div>
            <h2 className="text-xl font-bold mt-1">Ana Sayfa ve Toptan Satış Yönetimi</h2>
            <p className="text-xs text-white/75 mt-2 max-w-3xl leading-relaxed">
              Sitede ziyaretçinin gördüğü ana içerikleri tek merkezden yönetin. Ana sayfa için 1 hero görseli,
              6 öne çıkan ürün, Markamız galerisi, atölye adımları, duyuru, SSS ve iletişim bilgileri burada düzenlenir.
            </p>
          </div>
          <div className="shrink-0 px-3 py-2 rounded-xl bg-white/10 border border-white/15 text-[11px] font-bold">
            {selected.length}/6 Öne Çıkan Ürün
          </div>
        </div>
      </div>

      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <ImageIcon className="w-4 h-4 text-[#082C6C]" />
          <div><h3 className="font-bold text-sm text-slate-900">Ana Sayfa Hero Görseli</h3><p className="text-[11px] text-slate-500">Artık 6 ayrı ana sayfa fotoğrafı yerine tek güçlü hero görseli kullanılır.</p></div>
        </div>
        <div className="grid md:grid-cols-[180px_1fr] gap-4 items-center">
          <div className="h-28 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">{images.heroImage ? <img src={images.heroImage} className="w-full h-full object-cover" alt="Hero"/> : <div className="h-full flex items-center justify-center text-[10px] text-slate-400">Hero görseli yok</div>}</div>
          <div><input value={images.heroImage || ''} onChange={e=>updateHeroImage(e.target.value)} className="w-full border rounded-xl px-3 py-2 text-xs font-mono" placeholder="Hero görsel URL"/><p className="text-[10px] text-slate-500 mt-2">Yeni fotoğrafı Medya Kütüphanesi'ne yükleyip URL'sini buraya bağlayabilirsiniz.</p></div>
        </div>
      </section>

      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-5">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <FileText className="w-4 h-4 text-[#082C6C]" />
          <div><h3 className="font-bold text-sm text-slate-900">Ana Sayfa Manşet Metinleri</h3><p className="text-[11px] text-slate-500">Hero alanında görünen bütün ana metinler.</p></div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            ['badgeText','Üst Etiket'], ['title','Ana Başlık'], ['description','Açıklama'],
            ['primaryBtnText','Ana Buton'], ['secondaryBtnText','İkinci Buton'],
            ['signatureModelTitle','Öne Çıkan Model Başlığı'], ['signatureModelSub','Öne Çıkan Model Alt Metni']
          ].map(([key,label]) => (
            <label key={key} className="block">
              <span className="block text-[11px] font-bold text-slate-600 mb-1">{label}</span>
              {key === 'description' ? (
                <textarea rows={3} value={(hero as any)?.[key] || ''} onChange={e => updateHeroConfig({ [key]: e.target.value } as any)} className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs outline-none focus:border-[#082C6C]" />
              ) : (
                <input value={(hero as any)?.[key] || ''} onChange={e => updateHeroConfig({ [key]: e.target.value } as any)} className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs outline-none focus:border-[#082C6C]" />
              )}
            </label>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Star className="w-4 h-4 text-amber-500" />
          <div><h3 className="font-bold text-sm text-slate-900">Ana Sayfa / Toptan Öne Çıkan Ürünler</h3><p className="text-[11px] text-slate-500">En fazla 6 ürün seçin. Seçilen ürünler ana sayfadaki vitrin ve toptan yönlendirmelerinde kullanılır.</p></div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {collectionItems.map(item => (
            <label key={item.id} className={`flex gap-3 p-3 rounded-xl border cursor-pointer transition ${item.isFeatured ? 'border-[#082C6C] bg-blue-50/60' : 'border-slate-200 bg-white'}`}>
              <input type="checkbox" checked={!!item.isFeatured} onChange={e => toggleFeatured(item.id, e.target.checked)} className="mt-1 accent-[#082C6C]" />
              <div className="min-w-0">
                <div className="font-bold text-xs text-slate-900 truncate">{item.name}</div>
                <div className="text-[10px] text-slate-500 mt-1">{item.category}</div>
              </div>
            </label>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <ImageIcon className="w-4 h-4 text-[#082C6C]" />
          <div><h3 className="font-bold text-sm text-slate-900">Markamız — 4 Görsellik Galeri</h3><p className="text-[11px] text-slate-500">Markamız sayfasındaki görseller ve kısa metinler.</p></div>
        </div>
        <div className="grid lg:grid-cols-2 gap-4">
          {brandSlides.map((slide, index) => (
            <div key={slide.id} className="border border-slate-200 rounded-xl p-3 space-y-2">
              <div className="flex gap-3">
                <div className="w-28 h-20 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                  {slide.image ? <img src={slide.image} className="w-full h-full object-cover" alt="" /> : <div className="h-full flex items-center justify-center text-[10px] text-slate-400">Görsel yok</div>}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] uppercase font-black text-slate-400">Görsel {index+1}</div>
                  <input value={slide.badge || ''} onChange={e => updateAboutSlide(slide.id,{badge:e.target.value})} className="w-full mt-1 border rounded-lg px-2 py-1.5 text-xs" placeholder="Etiket" />
                  <input value={slide.title || ''} onChange={e => updateAboutSlide(slide.id,{title:e.target.value})} className="w-full mt-1 border rounded-lg px-2 py-1.5 text-xs" placeholder="Başlık" />
                  <input value={slide.subtitle || ''} onChange={e => updateAboutSlide(slide.id,{subtitle:e.target.value})} className="w-full mt-1 border rounded-lg px-2 py-1.5 text-xs" placeholder="Alt başlık" />
                </div>
              </div>
              <input value={slide.image || ''} onChange={e => updateAboutSlide(slide.id,{image:e.target.value})} className="w-full border rounded-lg px-2 py-1.5 text-[11px] font-mono" placeholder="Görsel URL" />
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Wrench className="w-4 h-4 text-[#082C6C]" />
          <div><h3 className="font-bold text-sm text-slate-900">Atölye & Üretim — 4 Aşama</h3><p className="text-[11px] text-slate-500">Her aşamanın başlık, açıklama ve görselini buradan düzenleyin.</p></div>
        </div>
        <div className="grid lg:grid-cols-2 gap-4">
          {workshopSteps.map(step => (
            <div key={step.number} className="border border-slate-200 rounded-xl p-3 space-y-2">
              <div className="text-[10px] font-black text-[#082C6C]">AŞAMA {step.number}</div>
              <input value={step.title || ''} onChange={e => updateCraftsmanshipStep(step.number,{title:e.target.value})} className="w-full border rounded-lg px-2 py-1.5 text-xs" />
              <input value={step.subtitle || ''} onChange={e => updateCraftsmanshipStep(step.number,{subtitle:e.target.value})} className="w-full border rounded-lg px-2 py-1.5 text-xs" />
              <textarea rows={3} value={step.description || ''} onChange={e => updateCraftsmanshipStep(step.number,{description:e.target.value})} className="w-full border rounded-lg px-2 py-1.5 text-xs" />
              <input value={step.image || ''} onChange={e => updateCraftsmanshipStep(step.number,{image:e.target.value})} className="w-full border rounded-lg px-2 py-1.5 text-[11px] font-mono" placeholder="Görsel URL" />
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <MessageSquare className="w-4 h-4 text-[#082C6C]" />
          <div><h3 className="font-bold text-sm text-slate-900">Duyuru & SSS</h3><p className="text-[11px] text-slate-500">Duyuru bandını ve kısa SSS cevaplarını yönetin.</p></div>
        </div>
        <div className="space-y-2">
          {ann.slice(0,5).map((text, i) => <input key={i} value={text} onChange={e => { const next=[...ann]; next[i]=e.target.value; updateAnnouncements(next); }} className="w-full border rounded-lg px-3 py-2 text-xs" placeholder={`Duyuru ${i+1}`} />)}
        </div>
        <div className="grid lg:grid-cols-2 gap-3">
          {faqs.map(faq => <div key={faq.id} className="border rounded-xl p-3 space-y-2"><input value={faq.question} onChange={e=>updateFaqItem(faq.id,{question:e.target.value})} className="w-full border rounded-lg px-2 py-1.5 text-xs font-bold"/><textarea rows={3} value={faq.answer} onChange={e=>updateFaqItem(faq.id,{answer:e.target.value})} className="w-full border rounded-lg px-2 py-1.5 text-xs"/></div>)}
        </div>
      </section>

      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3"><Phone className="w-4 h-4 text-[#082C6C]"/><div><h3 className="font-bold text-sm text-slate-900">İletişim Bilgileri</h3><p className="text-[11px] text-slate-500">Telefon, WhatsApp, e-posta, adres ve çalışma saatleri.</p></div></div>
        <div className="grid md:grid-cols-2 gap-3">
          {([['phoneDisplay','Telefon'],['whatsappDisplay','WhatsApp'],['email','E-posta'],['address','Adres'],['showroomHours','Çalışma Saatleri']] as const).map(([key,label]) => <label key={key} className="block"><span className="text-[11px] font-bold text-slate-600">{label}</span><textarea rows={key==='address'?2:1} value={(contactData as any)[key]||''} onChange={e=>updateContactData({[key]:e.target.value} as any)} className="w-full mt-1 border rounded-lg px-2.5 py-2 text-xs"/></label>)}
        </div>
      </section>

      <div className="text-[11px] text-slate-500 flex items-center gap-2"><Save className="w-3.5 h-3.5"/> Değişiklikler mevcut CMS kayıtlarına yazılır; son aşamada Admin'deki <b>Yayınla / Kaydet</b> işlemini kullanın.</div>
    </div>
  );
};

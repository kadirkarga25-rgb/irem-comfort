import React, { useMemo, useState } from 'react';
import { useAppImages } from '../../context/ImageContext';
import { Check, Image as ImageIcon, Save, Star, Trash2 } from 'lucide-react';

type SitePage = 'home' | 'brand' | 'workshop' | 'wholesale' | 'contact';

const PAGE_META: Record<SitePage, { title: string; description: string }> = {
  home: { title: 'Ana Sayfa', description: 'Hero metinleri, ana görsel ve mağazanın öne çıkaracağı en fazla 6 ürünü yönetin.' },
  brand: { title: 'Markamız', description: 'Marka hikâyesi ve sayfadaki görsel kartları buradan yönetin.' },
  workshop: { title: 'Atölye', description: 'Üretim aşamalarını, metinlerini ve görsellerini ayrı ayrı yönetin.' },
  wholesale: { title: 'Toptan Satış', description: 'Toptan satış mesajlarını ve öne çıkan ürünleri seçin.' },
  contact: { title: 'İletişim', description: 'İletişim bilgileri ve kısa SSS listesini yönetin.' }
};

interface Props { page: SitePage; }

const Field = ({ label, value, onChange, multiline=false, placeholder='' }: {label:string;value:string;onChange:(v:string)=>void;multiline?:boolean;placeholder?:string}) => (
  <label className="block space-y-1.5">
    <span className="text-xs font-bold text-slate-700">{label}</span>
    {multiline ? <textarea value={value || ''} onChange={e=>onChange(e.target.value)} rows={4} placeholder={placeholder} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#082C6C] focus:ring-2 focus:ring-[#082C6C]/10" />
      : <input value={value || ''} onChange={e=>onChange(e.target.value)} placeholder={placeholder} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#082C6C] focus:ring-2 focus:ring-[#082C6C]/10" />}
  </label>
);

export const SitePageEditorAdminTab: React.FC<Props> = ({ page }) => {
  const {
    heroConfig, updateHeroConfig,
    aboutSlides, updateAboutSlide, deleteAboutSlide,
    craftsmanshipSteps, updateCraftsmanshipStep,
    collectionItems, updateCollectionItem,
    contactData, updateContactData,
    images,
    faqItems, updateFaqItem, deleteFaqItem,
  } = useAppImages();
  const [saved, setSaved] = useState(false);
  const meta = PAGE_META[page];
  const featured = useMemo(() => collectionItems.filter(p => p.isFeatured).slice(0, 6), [collectionItems]);

  const flash = () => { setSaved(true); window.setTimeout(() => setSaved(false), 1600); };
  const uploadAsDataUrl = (file: File, cb: (url:string)=>void) => {
    const reader = new FileReader();
    reader.onload = () => cb(String(reader.result || ''));
    reader.readAsDataURL(file);
  };

  if (page === 'home') return <div className="space-y-6">
    <Header title={meta.title} description={meta.description} saved={saved} />
    <section className="grid lg:grid-cols-2 gap-5">
      <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
        <h3 className="font-bold text-slate-900">Hero Metinleri</h3>
        <Field label="Üst etiket" value={heroConfig.badgeText || ''} onChange={v=>updateHeroConfig({badgeText:v})}/>
        <Field label="Ana başlık" value={heroConfig.title || ''} onChange={v=>updateHeroConfig({title:v})}/>
        <Field label="Açıklama" value={heroConfig.description || ''} onChange={v=>updateHeroConfig({description:v})} multiline/>
        <div className="grid sm:grid-cols-2 gap-3"><Field label="Birincil buton" value={heroConfig.primaryBtnText || ''} onChange={v=>updateHeroConfig({primaryBtnText:v})}/><Field label="İkincil buton" value={heroConfig.secondaryBtnText || ''} onChange={v=>updateHeroConfig({secondaryBtnText:v})}/></div>
        <button onClick={flash} className="px-4 py-2 rounded-xl bg-[#082C6C] text-white text-xs font-bold flex items-center gap-2"><Save className="w-4 h-4"/>Kaydet</button>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
        <h3 className="font-bold text-slate-900">Ana Sayfa Hero Görseli</h3>
        <div className="aspect-[16/9] rounded-xl overflow-hidden bg-slate-100 border border-slate-200"><img src={images.heroImage} className="w-full h-full object-cover" /></div>
        <p className="text-xs text-slate-500">Hero görselini mevcut Medya Kütüphanesi üzerinden değiştirin.</p>
      </div>
    </section>
    <FeaturedProducts collectionItems={collectionItems} updateCollectionItem={updateCollectionItem} featured={featured} />
  </div>;

  if (page === 'brand') return <div className="space-y-6"><Header title={meta.title} description={meta.description} saved={saved}/><div className="grid gap-4">{aboutSlides.slice(0,4).map((slide,i)=><div key={slide.id} className="bg-white rounded-2xl border border-slate-200 p-5 grid md:grid-cols-[220px_1fr] gap-5"><div><div className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-100"><img src={slide.image} className="w-full h-full object-cover"/></div><label className="mt-2 block text-xs font-bold text-[#082C6C]">Görsel yükle<input type="file" accept="image/*" className="block w-full mt-1 text-xs" onChange={e=>{const f=e.target.files?.[0]; if(f) uploadAsDataUrl(f,url=>updateAboutSlide(slide.id,{image:url}));}}/></label></div><div className="space-y-3"><h3 className="font-bold">Marka kartı {i+1}</h3><Field label="Etiket" value={slide.badge} onChange={v=>updateAboutSlide(slide.id,{badge:v})}/><Field label="Başlık" value={slide.title} onChange={v=>updateAboutSlide(slide.id,{title:v})}/><Field label="Alt başlık" value={slide.subtitle} onChange={v=>updateAboutSlide(slide.id,{subtitle:v})} multiline/><button onClick={()=>{updateAboutSlide(slide.id,{alt:slide.title});flash();}} className="px-4 py-2 rounded-xl bg-[#082C6C] text-white text-xs font-bold">Kaydet</button></div></div>)}</div></div>;

  if (page === 'workshop') return <div className="space-y-6"><Header title={meta.title} description={meta.description} saved={saved}/><div className="grid gap-4">{craftsmanshipSteps.map(step=><div key={step.number} className="bg-white rounded-2xl border border-slate-200 p-5 grid md:grid-cols-[220px_1fr] gap-5"><div><div className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-100"><img src={step.image} className="w-full h-full object-cover"/></div><input type="file" accept="image/*" className="mt-2 w-full text-xs" onChange={e=>{const f=e.target.files?.[0]; if(f) uploadAsDataUrl(f,url=>updateCraftsmanshipStep(step.number,{image:url}));}}/></div><div className="space-y-3"><h3 className="font-bold">Üretim adımı {step.number}</h3><Field label="Başlık" value={step.title} onChange={v=>updateCraftsmanshipStep(step.number,{title:v})}/><Field label="Alt başlık" value={step.subtitle} onChange={v=>updateCraftsmanshipStep(step.number,{subtitle:v})}/><Field label="Açıklama" value={step.description} onChange={v=>updateCraftsmanshipStep(step.number,{description:v})} multiline/><button onClick={flash} className="px-4 py-2 rounded-xl bg-[#082C6C] text-white text-xs font-bold">Kaydet</button></div></div>)}</div></div>;

  if (page === 'wholesale') return <div className="space-y-6"><Header title={meta.title} description={meta.description} saved={saved}/><div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3"><h3 className="font-bold">Öne Çıkan Toptan Ürünler</h3><p className="text-xs text-slate-500">En fazla 6 ürün seçin. Seçilenler ana sayfada ve toptan satış sayfasında öne çıkar.</p><FeaturedProducts collectionItems={collectionItems} updateCollectionItem={updateCollectionItem} featured={featured}/></div></div>;

  return <div className="space-y-6"><Header title={meta.title} description={meta.description} saved={saved}/><div className="bg-white rounded-2xl border border-slate-200 p-5 grid md:grid-cols-2 gap-4"><Field label="Telefon" value={contactData.phoneDisplay || contactData.phone} onChange={v=>updateContactData({phoneDisplay:v,phone:v})}/><Field label="E-posta" value={contactData.email} onChange={v=>updateContactData({email:v})}/><Field label="WhatsApp" value={contactData.whatsappDisplay || contactData.whatsapp} onChange={v=>updateContactData({whatsappDisplay:v,whatsapp:v})}/><Field label="Adres" value={contactData.address} onChange={v=>updateContactData({address:v})} multiline/></div><div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4"><div><h3 className="font-bold">Kısa SSS</h3><p className="text-xs text-slate-500">İletişim sayfasında 4–6 kısa soru kullanın; uzun listeyi burada tutmayın.</p></div>{faqItems.slice(0,6).map(f=><div key={f.id} className="grid md:grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl"><Field label="Soru" value={f.question} onChange={v=>updateFaqItem(f.id,{question:v})}/><Field label="Cevap" value={f.answer} onChange={v=>updateFaqItem(f.id,{answer:v})} multiline/></div>)}<button onClick={()=>{faqItems.slice(6).forEach(f=>deleteFaqItem(f.id));flash();}} className="px-4 py-2 rounded-xl bg-[#082C6C] text-white text-xs font-bold">Kısa SSS'yi Kaydet</button></div></div>;
};

const Header = ({title,description,saved}:{title:string;description:string;saved:boolean}) => <div className="bg-[#062050] text-white rounded-2xl p-6 flex items-center justify-between gap-4"><div><h2 className="text-xl font-bold">{title}</h2><p className="text-xs text-blue-100 mt-1">{description}</p></div>{saved && <span className="text-xs font-bold flex items-center gap-1"><Check className="w-4 h-4"/> Kaydedildi</span>}</div>;

const FeaturedProducts = ({collectionItems,updateCollectionItem,featured}:{collectionItems:any[];updateCollectionItem:(id:string,data:any)=>void;featured:any[]}) => <div className="bg-white rounded-2xl border border-slate-200 p-5"><div className="flex items-center justify-between mb-4"><div><h3 className="font-bold">Ana Sayfa / Toptan Öne Çıkanlar</h3><p className="text-xs text-slate-500">{featured.length}/6 ürün seçili</p></div><Star className="w-5 h-5 text-[#D4AF37]"/></div><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">{collectionItems.map(item=>{const active=!!item.isFeatured; const disabled=!active&&featured.length>=6; return <button key={item.id} disabled={disabled} onClick={()=>updateCollectionItem(item.id,{isFeatured:!active})} className={`text-left rounded-xl border overflow-hidden transition-all ${active?'border-[#D4AF37] ring-2 ring-[#D4AF37]/20':'border-slate-200'} ${disabled?'opacity-40 cursor-not-allowed':'cursor-pointer'}`}><div className="aspect-[4/3] bg-slate-100"><img src={item.image} className="w-full h-full object-cover"/></div><div className="p-3"><div className="font-bold text-xs text-slate-800">{item.name}</div><div className="text-[10px] text-slate-500 mt-1">{active?'Öne çıkarılıyor':'Öne çıkar'}</div></div></button>})}</div></div>;

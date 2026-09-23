import React from 'react';
import { Award, Factory, HeartHandshake, ShieldCheck } from 'lucide-react';
import { SitePageShell } from './SitePageShell';
import { useAppImages } from '../context/ImageContext';


export const BrandPage: React.FC<{onAdminClick?:()=>void;openLegal?:(d:any)=>void}> = ({onAdminClick,openLegal}) => {
 const {aboutSlides, images, craftsmanshipSteps} = useAppImages();
 const brandSlides = (aboutSlides || []).filter(x => x?.image).slice(0, 4);
 const workshop = brandSlides[0]?.image || images.aboutImage || 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=1400';
 const processSteps = (craftsmanshipSteps || []).filter(x => x?.image).slice(0, 3);
 return <SitePageShell title="İrem Comfort: konforun üretildiği yer" eyebrow="MARKAMIZ" intro="Kadın comfort ayakkabısında hakiki deri, doğru taban ve üretim disiplinini bir araya getiriyoruz." activePath="/markamiz" onAdminClick={onAdminClick} legal={{open:openLegal!}}>
   <section className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-12 sm:py-20">
    <div className="grid lg:grid-cols-2 gap-8 items-stretch"><div className="rounded-[2rem] overflow-hidden min-h-[420px]"><img src={workshop} className="w-full h-full object-cover"/></div><div className="bg-[#102f59] rounded-[2rem] text-white p-8 sm:p-12 flex flex-col justify-center"><div className="text-[11px] uppercase tracking-[.22em] text-[#d6b46a] font-bold">MANİSA · ÜRETİM</div><h2 className="mt-4 text-4xl font-serif-luxury font-semibold">Mağaza müşterisinin ayağındaki konforu, üretimde başlatıyoruz.</h2><p className="mt-6 text-white/75 leading-relaxed">Koleksiyonlarımızı mağazaların satış ritmini, model çeşitliliğini ve sezon ihtiyaçlarını düşünerek hazırlıyoruz.</p></div></div>
    {brandSlides.length > 1 && <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">{brandSlides.slice(1).map((s:any)=><div key={s.id} className="bg-white border border-slate-200 rounded-3xl overflow-hidden"><img src={s.image} alt={s.alt || s.title || 'İrem Comfort'} className="w-full h-48 object-cover"/><div className="p-5"><div className="text-[10px] uppercase tracking-[.18em] text-[#8b6a2b] font-bold">{s.badge}</div><h3 className="mt-2 text-lg font-serif-luxury font-bold text-[#102f59]">{s.title}</h3><p className="mt-2 text-sm text-slate-600">{s.subtitle}</p></div></div>)}</div>}
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">{[[Factory,'Üretim','Manisa merkezli üretim altyapısı'],[ShieldCheck,'Malzeme','Hakiki deri ve konfor odaklı taban'],[Award,'Koleksiyon','Sezonluk kadın comfort modelleri'],[HeartHandshake,'İş ortaklığı','Toptan iletişim ve satış desteği']].map(([I,t,d]:any)=><div className="bg-white border border-slate-200 rounded-3xl p-6" key={t}><I className="w-7 h-7 text-[#8b6a2b]"/><h3 className="mt-5 font-bold text-[#102f59]">{t}</h3><p className="mt-2 text-sm text-slate-600">{d}</p></div>)}</div>
    <div className="mt-16"><div className="text-[11px] uppercase tracking-[.22em] text-[#8b6a2b] font-bold">NASIL ÜRETİYORUZ?</div><h2 className="mt-2 text-3xl sm:text-4xl font-serif-luxury font-bold text-[#102f59]">Ürünün arkasındaki süreç</h2><div className="grid md:grid-cols-3 gap-6 mt-7">{processSteps.map((s:any)=><div key={s.number} className="bg-white border border-slate-200 rounded-3xl overflow-hidden"><img src={s.image || workshop} className="w-full h-52 object-cover"/><div className="p-6"><div className="text-xs text-[#8b6a2b] font-bold">{s.number}</div><h3 className="mt-2 text-xl font-serif-luxury font-bold text-[#102f59]">{s.title}</h3><p className="mt-2 text-sm text-slate-600 leading-relaxed">{s.description}</p></div></div>)}</div></div>
   </section>
 </SitePageShell>
}

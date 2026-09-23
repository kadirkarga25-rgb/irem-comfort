import React from 'react';
import { Award, Factory, HeartHandshake, ShieldCheck } from 'lucide-react';
import { SitePageShell } from './SitePageShell';
import { useAppImages } from '../context/ImageContext';

export const BrandPage: React.FC<{onAdminClick?:()=>void;openLegal?:(d:any)=>void}> = ({onAdminClick,openLegal}) => {
 const {aboutSlides, images} = useAppImages();
 const brandSlides = (aboutSlides || []).filter(x => x?.image);
 const brandHero = brandSlides[0]?.image || images.aboutImage || '';
 const brandCards = brandSlides.slice(1, 4);
 return <SitePageShell title="İrem Comfort: konforun üretildiği yer" eyebrow="MARKAMIZ" intro="Kadın comfort ayakkabısında hakiki deri, doğru taban ve üretim disiplinini bir araya getiriyoruz." activePath="/markamiz" onAdminClick={onAdminClick} legal={{open:openLegal!}}>
   <section className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-12 sm:py-20">
    <div className="grid lg:grid-cols-2 gap-8 items-stretch"><div className="rounded-[2rem] overflow-hidden min-h-[420px] bg-slate-100">{brandHero ? <img src={brandHero} className="w-full h-full object-cover"/> : <div className="w-full h-full min-h-[420px] flex items-center justify-center text-sm text-slate-400">Markamız görseli eklenmedi.</div>}</div><div className="bg-[#102f59] rounded-[2rem] text-white p-8 sm:p-12 flex flex-col justify-center"><div className="text-[11px] uppercase tracking-[.22em] text-[#d6b46a] font-bold">MANİSA · ÜRETİM</div><h2 className="mt-4 text-4xl font-serif-luxury font-semibold">Mağaza müşterisinin ayağındaki konforu, üretimde başlatıyoruz.</h2><p className="mt-6 text-white/75 leading-relaxed">Koleksiyonlarımızı mağazaların satış ritmini, model çeşitliliğini ve sezon ihtiyaçlarını düşünerek hazırlıyoruz.</p></div></div>
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">{[[Factory,'Üretim','Manisa merkezli üretim altyapısı'],[ShieldCheck,'Malzeme','Hakiki deri ve konfor odaklı taban'],[Award,'Koleksiyon','Sezonluk kadın comfort modelleri'],[HeartHandshake,'İş ortaklığı','Toptan iletişim ve satış desteği']].map(([I,t,d]:any)=><div className="bg-white border border-slate-200 rounded-3xl p-6" key={t}><I className="w-7 h-7 text-[#8b6a2b]"/><h3 className="mt-5 font-bold text-[#102f59]">{t}</h3><p className="mt-2 text-sm text-slate-600">{d}</p></div>)}</div>
    <div className="mt-16"><div className="text-[11px] uppercase tracking-[.22em] text-[#8b6a2b] font-bold">MARKA HİKÂYEMİZ</div><h2 className="mt-2 text-3xl sm:text-4xl font-serif-luxury font-bold text-[#102f59]">İrem Comfort'un yaklaşımı</h2><div className="grid md:grid-cols-3 gap-6 mt-7">{brandCards.map((s:any)=><div key={s.id} className="bg-white border border-slate-200 rounded-3xl overflow-hidden"><img src={s.image} className="w-full h-52 object-cover"/><div className="p-6"><div className="text-xs text-[#8b6a2b] font-bold">{s.badge}</div><h3 className="mt-2 text-xl font-serif-luxury font-bold text-[#102f59]">{s.title}</h3><p className="mt-2 text-sm text-slate-600 leading-relaxed">{s.subtitle}</p></div></div>)}</div></div>
   </section>
 </SitePageShell>
}

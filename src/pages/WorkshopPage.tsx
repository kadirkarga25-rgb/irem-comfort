import React from 'react';
import { ArrowRight } from 'lucide-react';
import { SitePageShell } from './SitePageShell';
import { useAppImages } from '../context/ImageContext';

export const WorkshopPage: React.FC<{onAdminClick?:()=>void;openLegal?:(d:any)=>void}> = ({onAdminClick,openLegal}) => {
 const {craftsmanshipSteps, images} = useAppImages();
 const steps = craftsmanshipSteps || [];
 const workshopHero = images.craftsmanshipHeroImage || steps.find(s => s?.image)?.image || '';
 return <SitePageShell title="Zanaat, deri ve konfor" eyebrow="ATÖLYE" intro="Bir modelin mağazaya ulaşmadan önce geçtiği üretim adımlarını yakından inceleyin." activePath="/atolye" onAdminClick={onAdminClick} legal={{open:openLegal!}}>
 <section className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-12 sm:py-20"><div className="rounded-[2rem] overflow-hidden relative min-h-[360px] bg-[#102f59]">{workshopHero ? <img src={workshopHero} className="absolute inset-0 w-full h-full object-cover"/> : null}<div className="absolute inset-0 bg-gradient-to-r from-[#102f59]/90 via-[#102f59]/50 to-transparent"/><div className="relative max-w-2xl p-8 sm:p-12 text-white"><div className="text-[11px] uppercase tracking-[.22em] text-[#d6b46a] font-bold">ÜRETİM FELSEFEMİZ</div><h2 className="mt-4 text-4xl sm:text-5xl font-serif-luxury font-semibold">Doğru deri + doğru kalıp + doğru taban.</h2><p className="mt-5 text-white/75 leading-relaxed">Toptan koleksiyonun sürekliliği için üretimde standardı korumaya odaklanıyoruz.</p></div></div><div className="mt-10 space-y-5">{steps.map((s:any)=><article key={s.number} className="grid lg:grid-cols-[110px_1fr_1fr] gap-6 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 items-center"><div className="text-4xl font-serif-luxury font-bold text-[#d6b46a]">{s.number}</div><div><h3 className="text-2xl font-serif-luxury font-bold text-[#102f59]">{s.title}</h3><p className="mt-2 text-sm font-semibold text-slate-500">{s.subtitle}</p><p className="mt-3 text-sm text-slate-600 leading-relaxed">{s.description}</p></div>{s.image ? <img src={s.image} className="w-full h-48 rounded-2xl object-cover"/> : <div className="w-full h-48 rounded-2xl bg-slate-100 flex items-center justify-center text-xs text-slate-400">Görsel eklenmedi</div>}</article>)}</div><a href="/toptan-satis" className="mt-10 inline-flex items-center gap-2 rounded-full bg-[#102f59] text-white px-6 py-3 font-bold">Toptan iş ortaklığı <ArrowRight className="w-4 h-4"/></a></section>
 </SitePageShell>
}

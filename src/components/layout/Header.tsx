import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogoFull } from '../brand/LogoFull';
import { Menu, X, PhoneCall, ChevronRight, Globe } from 'lucide-react';
import { CONTACT_DATA } from '../../constants/data';
import { AnnouncementTicker } from './AnnouncementTicker';
import { FairInvitationStrip } from './FairInvitationStrip';
import { useAppImages } from '../../context/ImageContext';
import { Language } from '../../types';

interface HeaderProps { scrollY:number; activeSection:string; onNavigate:(path:string)=>void; onOpenFairModal?:()=>void; }

const links = [
  ['/','Ana Sayfa'], ['/koleksiyonlar','Koleksiyonlar'], ['/urunler','Ürünler'], ['/markamiz','Markamız'], ['/toptan-satis','Toptan Satış'], ['/atolye','Atölye'], ['/katalog','Katalog'], ['/iletisim','İletişim']
] as const;

export const Header: React.FC<HeaderProps> = ({activeSection,onNavigate,onOpenFairModal}) => {
 const {language,setLanguage}=useAppImages();
 const [open,setOpen]=useState(false);
 const cycleLanguage=()=>{const next:Record<Language,Language>={tr:'en',en:'ar',ar:'tr'};setLanguage(next[language]);};
 const go=(path:string)=>{setOpen(false); if(path!==window.location.pathname){window.history.pushState({},'',path);} onNavigate(path); window.scrollTo({top:0,behavior:'smooth'});};
 return <>
  <motion.header initial={{y:-80,opacity:0}} animate={{y:0,opacity:1}} className="fixed top-0 left-0 right-0 z-40">
   <div className="ic-premium-header bg-white/95 backdrop-blur-xl border-b border-[#102f59]/10 shadow-sm">
    <div className="max-w-7xl mx-auto px-4 sm:px-7 lg:px-10 h-20 flex items-center justify-between gap-4">
      <button onClick={()=>go('/')} className="shrink-0" aria-label="İrem Comfort Ana Sayfa"><LogoFull iconSize={34} color="#102f59" showText/></button>
      <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">{links.map(([path,label])=><button key={path} onClick={()=>go(path)} className={`px-3 py-2 text-[11px] xl:text-xs font-bold uppercase tracking-[.08em] rounded-lg transition ${activeSection===path?'text-[#102f59] bg-[#102f59]/6':'text-slate-600 hover:text-[#102f59] hover:bg-slate-50'}`}>{label}</button>)}</nav>
      <div className="flex items-center gap-2 shrink-0">
       <button onClick={cycleLanguage} className="hidden sm:flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-2 text-[11px] font-bold text-[#102f59]"><Globe className="w-3.5 h-3.5"/>{language.toUpperCase()}</button>
       <button onClick={()=>go('/toptan-satis')} className="hidden md:inline-flex items-center gap-2 rounded-full bg-[#102f59] text-white px-4 py-2.5 text-[11px] font-extrabold shadow-md">Toptan Teklif <ChevronRight className="w-4 h-4"/></button>
       <button onClick={()=>setOpen(!open)} className="lg:hidden p-2.5 rounded-xl bg-[#102f59]/5 text-[#102f59]" aria-label="Menü">{open?<X/>:<Menu/>}</button>
      </div>
    </div>
   </div>
   <AnnouncementTicker onContactClick={()=>go('/iletisim')}/>
   {onOpenFairModal && <FairInvitationStrip onOpenFairModal={onOpenFairModal}/>} 
  </motion.header>
  <AnimatePresence>{open&&<motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}} className="fixed top-20 inset-x-0 z-30 bg-white border-b border-slate-200 shadow-xl lg:hidden max-h-[80vh] overflow-y-auto"><div className="p-5 grid gap-2">{links.map(([path,label])=><button key={path} onClick={()=>go(path)} className={`flex items-center justify-between rounded-2xl px-4 py-3.5 text-left font-bold ${activeSection===path?'bg-[#102f59] text-white':'bg-slate-50 text-[#102f59]'}`}>{label}<ChevronRight className="w-4 h-4"/></button>)}<button onClick={cycleLanguage} className="rounded-2xl px-4 py-3.5 bg-[#f7f5f1] text-left font-bold text-[#102f59]">Dil: {language.toUpperCase()}</button><a href={`tel:${CONTACT_DATA.phone}`} className="rounded-2xl px-4 py-3.5 bg-[#102f59] text-white font-bold flex items-center gap-2"><PhoneCall className="w-4 h-4"/>{CONTACT_DATA.phoneDisplay}</a></div></motion.div>}</AnimatePresence>
 </>;
};

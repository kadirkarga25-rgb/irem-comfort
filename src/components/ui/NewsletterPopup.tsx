import React,{useEffect,useState} from 'react';
import {Mail,X,ArrowRight,CheckCircle2} from 'lucide-react';

interface NewsletterPopupProps { forceOpen?: boolean; onClose?: () => void; }

export const NewsletterPopup:React.FC<NewsletterPopupProps>=({forceOpen=false,onClose})=>{
 const [open,setOpen]=useState(false); const [email,setEmail]=useState(''); const [busy,setBusy]=useState(false); const [done,setDone]=useState(false); const [error,setError]=useState('');
 useEffect(()=>{ if(forceOpen){setOpen(true);return;} const t=window.setTimeout(()=>setOpen(true),7000); return()=>window.clearTimeout(t); },[forceOpen]);
 if(!open) return null;
 const close=()=>{setOpen(false);onClose?.()};
 const submit=async(e:React.FormEvent)=>{e.preventDefault(); if(!email.includes('@')){setError('Geçerli bir e-posta adresi yazın.');return;} setBusy(true);setError(''); try{const r=await fetch('/api/newsletter/subscribe',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,source:'Ana sayfa teklif ve katalog bildirimi'})}); const d=await r.json().catch(()=>({})); if(!r.ok||d.success===false) throw new Error(d.error||'Kayıt tamamlanamadı.'); setDone(true); setTimeout(close,1800);}catch(err:any){setError(err?.message||'Kayıt tamamlanamadı.');}finally{setBusy(false)}};
 return <div className="fixed right-4 bottom-24 sm:right-6 sm:bottom-28 z-[55] w-[min(92vw,380px)]">
  <div className="relative overflow-hidden rounded-3xl border border-[#102f59]/10 bg-white shadow-[0_24px_70px_rgba(16,47,89,.22)]">
   <button onClick={close} className="absolute right-3 top-3 z-10 rounded-full p-2 text-slate-400 hover:bg-slate-100" aria-label="Kapat"><X className="w-4 h-4"/></button>
   <div className="bg-[#102f59] px-6 py-5 text-white"><div className="text-[10px] uppercase tracking-[.2em] text-[#d6b46a] font-bold">MAĞAZANIZ İÇİN</div><h3 className="mt-2 text-xl font-serif-luxury font-semibold">Yeni sezon fırsatlarını kaçırmayın.</h3><p className="mt-2 text-xs leading-relaxed text-white/70">Yeni kataloglar, sezon seçkileri ve toptan çalışma fırsatları yayınlandığında önce siz haberdar olun.</p></div>
   {done?<div className="p-6 text-center"><CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600"/><strong className="mt-3 block text-[#102f59]">Kaydınız alındı.</strong><p className="mt-1 text-xs text-slate-500">Yeni katalog yayınlandığında size e-posta göndereceğiz.</p></div>:<form onSubmit={submit} className="p-5"><div className="relative"><Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400"/><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="E-posta adresiniz" className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-[#102f59]"/></div>{error&&<div className="mt-2 text-xs text-rose-600">{error}</div>}<button disabled={busy} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#102f59] px-4 py-3 text-sm font-bold text-white disabled:opacity-50">{busy?'Kaydediliyor…':'Bültene Katıl'}<ArrowRight className="w-4 h-4"/></button><p className="mt-2 text-[10px] leading-relaxed text-slate-400">İstediğiniz zaman listeden ayrılabilirsiniz.</p></form>}
  </div>
 </div>
}

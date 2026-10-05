import React,{useState} from 'react';
import {Building2,CheckCircle2,MapPin,MessageCircle,Send,Store,Users,Package,ArrowLeft} from 'lucide-react';
import {SitePageShell} from './SitePageShell';
import {CONTACT_DATA} from '../constants/data';

export const WholesaleApplicationPage:React.FC<{onAdminClick?:()=>void;openLegal?:(d:any)=>void}>=({onAdminClick,openLegal})=>{
 const [form,setForm]=useState({fullName:'',company:'',phone:'',email:'',city:'',country:'Türkiye',storeCount:'',volume:'',models:'',message:''});
 const [busy,setBusy]=useState(false),[done,setDone]=useState(false),[error,setError]=useState('');
 const set=(k:string,v:string)=>setForm(x=>({...x,[k]:v}));
 const submit=async(e:React.FormEvent)=>{e.preventDefault();setBusy(true);setError('');
  try{const message=[
   'TOPTAN BAŞVURU','Firma: '+form.company,'Yetkili: '+form.fullName,'Telefon: '+form.phone,'E-posta: '+form.email,
   'Şehir / Ülke: '+form.city+' / '+form.country,'Mağaza sayısı: '+form.storeCount,'Tahmini sipariş: '+form.volume,
   'İlgilendiği modeller: '+form.models,'Not: '+form.message
  ].join('\n');
   const r=await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({fullName:form.fullName,email:form.email,phone:form.phone,inquiryType:'Toptan Başvuru',message})});
   const d=await r.json().catch(()=>({})); if(!r.ok)throw Error(d.error||'Başvuru gönderilemedi.');
   setDone(true);
  }catch(e:any){setError(e?.message||'Başvuru gönderilemedi.')}finally{setBusy(false)}
 };
 return <SitePageShell title="Toptan iş ortaklığı başvurusu" eyebrow="B2B BAŞVURU" intro="Mağazanızın ürün gamına uygun modelleri, seri planını ve sevkiyat ihtiyaçlarınızı birlikte oluşturalım." activePath="/toptan-basvuru" onAdminClick={onAdminClick} legal={{open:openLegal!}}>
  <section className="w-full max-w-7xl mx-auto px-3 sm:px-5 lg:px-7 py-6 sm:py-10">
   <div className="grid lg:grid-cols-[.78fr_1.22fr] gap-5 items-start">
    <aside className="rounded-[2rem] bg-[#102f59] text-white p-6 sm:p-8 lg:sticky lg:top-24">
     <div className="text-[10px] tracking-[.22em] text-[#d6b46a] font-black">İREM COMFORT B2B</div>
     <h2 className="mt-3 text-3xl font-serif-luxury font-bold">Mağazanız için koleksiyonu birlikte seçelim.</h2>
     <p className="mt-4 text-sm leading-relaxed text-white/70">Başvurunuz satış ekibimize ulaşır. Model, renk, numara ve tahmini sipariş ihtiyacınıza göre sizinle iletişime geçeriz.</p>
     <div className="mt-7 space-y-3">{[[Store,'Mağaza / butik bilgileri'],[Package,'Model ve sipariş planı'],[Users,'Yetkili iletişim bilgileri'],[MapPin,'Şehir ve sevkiyat planı']].map(([I,t]:any)=><div key={t} className="flex items-center gap-3 rounded-2xl bg-white/8 p-3 text-sm font-semibold"><I className="w-5 h-5 text-[#d6b46a]"/>{t}</div>)}</div>
     <a href={'https://wa.me/'+CONTACT_DATA.whatsapp+'?text='+encodeURIComponent('Merhaba İrem Comfort, toptan iş ortaklığı hakkında bilgi almak istiyorum.')} target="_blank" rel="noreferrer" className="mt-7 inline-flex items-center gap-2 rounded-full bg-white text-[#102f59] px-5 py-3 text-sm font-extrabold"><MessageCircle className="w-4 h-4"/> WhatsApp'tan Yaz</a>
    </aside>
    <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-5 sm:p-7">
     {done?<div className="py-16 text-center"><div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center"><CheckCircle2/></div><h2 className="mt-5 text-2xl font-serif-luxury font-bold text-[#102f59]">Başvurunuz alındı.</h2><p className="mt-2 text-sm text-slate-600">Satış ekibimiz bilgilerinizi inceleyip sizinle iletişime geçecektir.</p><div className="mt-6 flex justify-center gap-2"><a href="/randevu" className="rounded-full bg-[#102f59] text-white px-5 py-3 text-sm font-bold">Randevu Oluştur</a><a href={'https://wa.me/'+CONTACT_DATA.whatsapp} className="rounded-full border px-5 py-3 text-sm font-bold text-[#102f59]">WhatsApp</a></div></div>:
     <form onSubmit={submit} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
       {([['fullName','Yetkili Ad Soyad *'],['company','Firma / Mağaza Adı *'],['phone','Telefon / WhatsApp *'],['email','E-posta *'],['city','Şehir *'],['country','Ülke']]).map(([k,l])=><label key={k} className="text-xs font-bold text-slate-700">{l}<input required={k!=='country'} value={(form as any)[k]} onChange={e=>set(k,e.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-3 text-sm outline-none focus:border-[#102f59]" /></label>)}
       <label className="text-xs font-bold text-slate-700">Mağaza Sayısı<input value={form.storeCount} onChange={e=>set('storeCount',e.target.value)} placeholder="Örn. 3" className="mt-1.5 w-full rounded-xl border px-3.5 py-3 text-sm"/></label>
       <label className="text-xs font-bold text-slate-700">Tahmini Sipariş Miktarı<input value={form.volume} onChange={e=>set('volume',e.target.value)} placeholder="Örn. 100 çift / sezon" className="mt-1.5 w-full rounded-xl border px-3.5 py-3 text-sm"/></label>
      </div>
      <label className="block text-xs font-bold text-slate-700">İlgilendiğiniz Model / Koleksiyonlar<textarea value={form.models} onChange={e=>set('models',e.target.value)} rows={3} placeholder="Model numarası, katalog sayfası, terlik/sandalet grubu..." className="mt-1.5 w-full rounded-xl border px-3.5 py-3 text-sm"/></label>
      <label className="block text-xs font-bold text-slate-700">Ek Not<textarea value={form.message} onChange={e=>set('message',e.target.value)} rows={4} placeholder="Numara, renk, teslimat veya mağazanızla ilgili özel notlar..." className="mt-1.5 w-full rounded-xl border px-3.5 py-3 text-sm"/></label>
      {error&&<div className="rounded-xl bg-rose-50 text-rose-700 border border-rose-200 p-3 text-sm font-semibold">{error}</div>}
      <button disabled={busy} className="w-full rounded-xl bg-[#102f59] text-white py-3.5 font-extrabold flex items-center justify-center gap-2 disabled:opacity-50">{busy?'Gönderiliyor...':<>Toptan Başvuru Gönder <Send className="w-4 h-4"/></>}</button>
     </form>}
    </div>
   </div>
  </section>
 </SitePageShell>
}
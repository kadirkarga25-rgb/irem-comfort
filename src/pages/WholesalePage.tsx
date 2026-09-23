import React from 'react';
import { ArrowRight, Boxes, CheckCircle2, Factory, MessageCircle, PackageCheck, Phone, ShieldCheck } from 'lucide-react';
import { CONTACT_DATA, PREMIUM_PRODUCT_IMAGE_FALLBACKS } from '../constants/data';
import { SitePageShell } from './SitePageShell';
import { useAppImages } from '../context/ImageContext';

export const WholesalePage: React.FC<{ onAdminClick?:()=>void; openLegal?:(d:any)=>void }> = ({ onAdminClick, openLegal }) => {
  const { collectionItems } = useAppImages();
  const products = collectionItems?.length ? collectionItems : [];
  return <SitePageShell title="Mağazanız için güçlü bir toptan çözüm ortağı" eyebrow="TOPTAN SATIŞ" intro="İrem Comfort; kadın comfort terlik ve sandalet koleksiyonlarını mağazalara, butiklere ve profesyonel satış noktalarına üreticiden ulaştırır." activePath="/toptan-satis" onAdminClick={onAdminClick} legal={{open:openLegal!}}>
    <section className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-12 sm:py-20">
      <div className="grid lg:grid-cols-3 gap-5">
        {[
          [Factory,'Üreticiden doğrudan','Manisa Ayakkabıcılar Sitesindeki üretim altyapımızla doğrudan iletişim ve tedarik.'],
          [Boxes,'Seri ve koleksiyon düzeni','Mağazanızın ürün gamına uygun sezonluk seri ve model seçimi.'],
          [PackageCheck,'Planlı sevkiyat','Sipariş planlamasına göre üretim, hazırlık ve sevkiyat koordinasyonu.'],
        ].map(([Icon,heading,text]:any)=><div key={heading} className="bg-white border border-slate-200 rounded-3xl p-7 shadow-sm"><Icon className="w-8 h-8 text-[#8b6a2b] mb-6"/><h2 className="text-xl font-serif-luxury font-bold text-[#102f59]">{heading}</h2><p className="mt-3 text-sm text-slate-600 leading-relaxed">{text}</p></div>)}
      </div>
      <div className="mt-8 grid lg:grid-cols-[1.15fr_.85fr] gap-8">
        <div className="rounded-[2rem] bg-[#102f59] text-white p-8 sm:p-10">
          <div className="text-[11px] uppercase tracking-[.2em] text-[#d6b46a] font-bold">MAĞAZA İŞ ORTAKLIĞI</div>
          <h2 className="mt-3 text-3xl sm:text-4xl font-serif-luxury font-semibold">Koleksiyonunuzu birlikte oluşturalım.</h2>
          <p className="mt-5 text-sm sm:text-base text-white/75 leading-relaxed">Koleksiyonları inceleyin, beğendiğiniz modelleri ürün bağlantılarıyla paylaşın ve mağazanız için toptan teklif isteyin.</p>
          <div className="mt-7 flex flex-wrap gap-3"><a href="/urunler" className="rounded-full bg-white text-[#102f59] px-5 py-3 font-bold text-sm">Ürünleri İncele</a><a href={`https://wa.me/${CONTACT_DATA.whatsapp}`} className="rounded-full border border-white/30 px-5 py-3 font-bold text-sm inline-flex gap-2 items-center"><MessageCircle className="w-4 h-4"/> Toptan WhatsApp</a></div>
        </div>
        <div className="bg-white rounded-[2rem] border border-slate-200 p-8 sm:p-10">
          <h2 className="text-2xl font-serif-luxury font-bold text-[#102f59]">Toptan süreç</h2>
          <ol className="mt-6 space-y-5">{['Koleksiyondan modelleri seçin','Toptan talebinizi iletin','Seri / numara / renk detaylarını netleştirelim','Üretim ve sevkiyat planını oluşturalım'].map((x,i)=><li key={x} className="flex gap-4"><span className="w-8 h-8 rounded-full bg-[#102f59] text-white flex items-center justify-center text-xs font-bold">{i+1}</span><span className="pt-1 text-sm font-semibold text-slate-700">{x}</span></li>)}</ol>
          <div className="mt-8 pt-6 border-t border-slate-100 text-sm text-slate-600"><Phone className="inline w-4 h-4 mr-2 text-[#102f59]"/>{CONTACT_DATA.phoneDisplay} · {CONTACT_DATA.email}</div>
        </div>
      </div>
      <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[ShieldCheck,'Güvenilir tedarik','Geniş model seçeneği','Toptan iletişim desteği'].map((x:any,i)=><div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-[#8b6a2b]"/><span className="text-sm font-bold text-[#102f59]">{typeof x==='string'?x:'Güvenilir üretim'}</span></div>)}
      </div>
      {products.length>0 && <div className="mt-14"><div className="flex items-end justify-between gap-4 mb-6"><div><div className="text-[11px] uppercase tracking-[.2em] text-[#8b6a2b] font-bold">ÖNE ÇIKAN MODELLER</div><h2 className="text-3xl font-serif-luxury font-bold text-[#102f59]">Mağazanız için seçtiklerimiz</h2></div><a href="/urunler" className="text-sm font-bold text-[#102f59] inline-flex items-center gap-1">Tüm ürünler <ArrowRight className="w-4 h-4"/></a></div><div className="grid md:grid-cols-3 gap-5">{products.slice(0,3).map(p=><a key={p.id} href={`/urunler/${encodeURIComponent(p.id)}`} className="group bg-white rounded-3xl overflow-hidden border border-slate-200"><img src={p.image||PREMIUM_PRODUCT_IMAGE_FALLBACKS[p.id]} className="w-full h-64 object-cover group-hover:scale-[1.03] transition"/><div className="p-5"><div className="text-[10px] uppercase tracking-wider text-[#8b6a2b] font-bold">{p.category}</div><h3 className="mt-2 font-serif-luxury font-bold text-[#102f59]">{p.name}</h3></div></a>)}</div></div>}
    </section>
  </SitePageShell>
};

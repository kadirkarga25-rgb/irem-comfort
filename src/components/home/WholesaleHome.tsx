import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Check, ChevronRight, Factory, Layers3, PackageCheck, Phone, ShieldCheck, Store, Truck, Users, MessageCircle } from 'lucide-react';
import { useAppImages } from '../../context/ImageContext';
import { CONTACT_DATA } from '../../constants/data';

interface WholesaleHomeProps {
  onDiscover: () => void;
  onProducts: () => void;
  onInquireProduct: (productName: string) => void;
  onContact: () => void;
}

const fallbackImages = [
  'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=82&w=1400',
  'https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&q=82&w=1000',
  'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&q=82&w=1000',
  'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&q=82&w=1000'
];

const safeImage = (src: string | undefined, fallback: string) => src && src.trim() ? src : fallback;

export const WholesaleHome: React.FC<WholesaleHomeProps> = ({ onDiscover, onProducts, onInquireProduct, onContact }) => {
  const { images, collectionItems, craftsmanshipSteps, language } = useAppImages();
  const isTr = language === 'tr';
  const items = (collectionItems || []).slice(0, 4);
  const productionImage = safeImage(craftsmanshipSteps?.[0]?.image, fallbackImages[0]);

  const metrics = [
    { value: '150+', label: isTr ? 'Model Seçeneği' : 'Models' },
    { value: '36–41', label: isTr ? 'Numara Aralığı' : 'Size Range' },
    { value: '%100', label: isTr ? 'Hakiki Deri' : 'Genuine Leather' },
    { value: 'Manisa', label: isTr ? 'Doğrudan Üretim' : 'Direct Production' },
  ];

  return (
    <div className="wholesale-home bg-[#f7f5f1] text-[#15243a] overflow-hidden">
      {/* HERO */}
      <section id="hero" className="relative min-h-[760px] flex items-end pt-24 bg-[#efeae2]">
        <div className="absolute inset-0">
          <img
            src={safeImage(images.heroImage, fallbackImages[0])}
            alt="İrem Comfort yeni sezon kadın comfort ayakkabı"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#f7f5f1]/98 via-[#f7f5f1]/78 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#f7f5f1]/55 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 w-full max-w-[1500px] mx-auto px-6 lg:px-12 pb-20 lg:pb-24">
          <div className="max-w-2xl">
            <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-[11px] font-bold tracking-[.28em] uppercase text-[#173d70] mb-5">
              2026 / 2027 · {isTr ? 'YENİ SEZON TOPTAN KOLEKSİYON' : 'NEW SEASON WHOLESALE COLLECTION'}
            </motion.p>
            <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .08 }} className="text-5xl sm:text-6xl lg:text-[78px] leading-[.98] font-light tracking-[-.045em] text-[#14243a]">
              {isTr ? <>Konforu<br /><span className="font-serif-luxury italic text-[#123968]">mağazanıza</span><br />taşıyoruz.</> : <>Comfort<br /><span className="font-serif-luxury italic text-[#123968]">for your store.</span></>}
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .18 }} className="mt-7 max-w-xl text-base sm:text-lg leading-8 text-[#26364a]/80">
              {isTr
                ? 'İrem Comfort; kadın comfort terlik, sandalet ve sabo koleksiyonlarını doğrudan üreticiden mağazalara sunar. Sezon planlaması, model çeşitliliği ve düzenli tedarik için yanınızdayız.'
                : 'A direct manufacturing partner for women’s comfort footwear, seasonal collections and reliable wholesale supply.'}
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .26 }} className="flex flex-wrap gap-3 mt-9">
              <button onClick={onDiscover} className="inline-flex items-center gap-3 rounded-none bg-[#123968] px-7 py-4 text-sm font-bold text-white hover:bg-[#0c2a50] transition-colors">
                {isTr ? 'Koleksiyonu İncele' : 'Explore Collection'} <ArrowRight className="w-4 h-4" />
              </button>
              <button onClick={onContact} className="inline-flex items-center gap-3 rounded-none border border-[#123968]/35 bg-white/60 px-7 py-4 text-sm font-bold text-[#123968] hover:bg-white transition-colors">
                {isTr ? 'Toptan Teklif Al' : 'Request Wholesale'}
              </button>
            </motion.div>
          </div>
        </div>

        <div className="absolute right-7 bottom-10 hidden lg:block text-right text-white drop-shadow-lg">
          <div className="font-serif-luxury italic text-3xl">Her adımda</div>
          <div className="font-serif-luxury italic text-3xl">daha iyi bir sen.</div>
          <div className="mt-3 text-[10px] tracking-[.3em] uppercase">İrem Comfort</div>
        </div>
      </section>

      {/* B2B TRUST STRIP */}
      <section className="bg-white border-y border-[#15243a]/10">
        <div className="max-w-[1500px] mx-auto grid grid-cols-2 lg:grid-cols-4">
          {[
            [ShieldCheck, isTr ? 'Doğal Malzeme' : 'Natural Materials', isTr ? '%100 hakiki deri üst yüzey.' : 'Genuine leather uppers.'],
            [Factory, isTr ? 'Doğrudan Üretim' : 'Direct Manufacturing', isTr ? 'Manisa atölyesinden mağazanıza.' : 'From our Manisa workshop.'],
            [PackageCheck, isTr ? 'Düzenli Tedarik' : 'Reliable Supply', isTr ? 'Sezon ve model planlamasına uygun.' : 'Planned seasonal supply.'],
            [Store, isTr ? 'Mağaza Odaklı' : 'Retailer Focused', isTr ? 'Toptan satış ve profesyonel destek.' : 'Wholesale support for retailers.'],
          ].map(([Icon, title, desc]: any, i) => (
            <div key={i} className="px-6 py-8 lg:px-10 border-r last:border-r-0 border-[#15243a]/10 flex gap-4 items-start">
              <Icon className="w-7 h-7 text-[#123968] shrink-0" strokeWidth={1.5} />
              <div><div className="font-semibold text-[#15243a]">{title}</div><div className="text-xs leading-5 text-[#15243a]/60 mt-1">{desc}</div></div>
            </div>
          ))}
        </div>
      </section>

      {/* COLLECTIONS */}
      <section id="collection" className="max-w-[1500px] mx-auto px-6 lg:px-12 py-24 lg:py-28">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-[10px] tracking-[.28em] uppercase text-[#7a5b31] font-bold">01 · {isTr ? 'KOLEKSİYON' : 'COLLECTION'}</p>
            <h2 className="mt-3 text-4xl lg:text-6xl font-light tracking-[-.035em]">{isTr ? 'Mağazanız için seçildi.' : 'Curated for your store.'}</h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-[#15243a]/60">{isTr ? 'Her sezon farklı müşteri profillerine hitap eden, rafınızda birlikte çalışan model grupları.' : 'Model groups designed to work together across your retail floor.'}</p>
          </div>
          <button onClick={onProducts} className="self-start lg:self-auto inline-flex items-center gap-2 text-sm font-bold text-[#123968] border-b border-[#123968]/30 pb-2">{isTr ? 'Tüm ürünleri gör' : 'View all products'} <ArrowRight className="w-4 h-4" /></button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {(items.length ? items : Array.from({ length: 4 }, (_, i) => ({ id: String(i), name: ['Günlük Konfor', 'Şehir & Yaşam', 'Soft Comfort', 'Yeni Sezon'][i], subtitle: '', category: '', image: '' } as any))).map((item: any, i) => {
            const src = safeImage(item.image || images.collectionImages?.[item.id]?.image, fallbackImages[i]);
            return (
              <motion.article key={item.id} whileHover={{ y: -5 }} className="group bg-white border border-[#15243a]/10 overflow-hidden cursor-pointer" onClick={() => item.name && onInquireProduct(item.name)}>
                <div className="aspect-[4/4.5] overflow-hidden bg-[#ebe6de]"><img src={src} alt={item.name} className="w-full h-full object-cover group-hover:scale-[1.035] transition-transform duration-700" /></div>
                <div className="p-5">
                  <div className="text-[10px] tracking-[.2em] uppercase text-[#7a5b31]">0{i + 1}</div>
                  <h3 className="mt-2 text-xl font-semibold tracking-tight">{item.name}</h3>
                  <p className="mt-2 text-xs leading-5 text-[#15243a]/60 line-clamp-2">{item.subtitle || item.tagline}</p>
                  <div className="mt-5 text-xs font-bold text-[#123968] inline-flex items-center gap-2">{isTr ? 'Toptan bilgi al' : 'Wholesale details'} <ChevronRight className="w-3.5 h-3.5" /></div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </section>

      {/* WHY WHOLESALE */}
      <section id="why-us" className="bg-[#123968] text-white">
        <div className="max-w-[1500px] mx-auto grid lg:grid-cols-2">
          <div className="px-6 lg:px-16 py-20 lg:py-24 flex flex-col justify-center">
            <p className="text-[10px] tracking-[.28em] uppercase text-[#d7bb8a] font-bold">02 · {isTr ? 'TOPTAN ÇALIŞMA MODELİ' : 'WHOLESALE MODEL'}</p>
            <h2 className="mt-5 text-4xl lg:text-6xl font-light tracking-[-.035em]">{isTr ? 'Sadece ürün değil, düzenli tedarik sunuyoruz.' : 'More than products. A reliable supply partner.'}</h2>
            <div className="grid sm:grid-cols-2 gap-5 mt-10">
              {[
                [Users, isTr ? 'Mağaza odaklı iletişim' : 'Retailer-focused service'],
                [Truck, isTr ? 'Planlı sevkiyat' : 'Planned dispatch'],
                [Layers3, isTr ? 'Geniş model seçeneği' : 'Broad assortment'],
                [MessageCircle, isTr ? 'Hızlı sipariş desteği' : 'Fast order support'],
              ].map(([Icon, text]: any) => <div key={text} className="flex gap-3 items-center border-t border-white/15 pt-4"><Icon className="w-5 h-5 text-[#d7bb8a]" /><span className="text-sm text-white/85">{text}</span></div>)}
            </div>
            <button onClick={onContact} className="mt-10 self-start inline-flex items-center gap-3 bg-white text-[#123968] px-6 py-3.5 text-sm font-bold hover:bg-[#f1eee8]">{isTr ? 'Toptan çalışma koşullarını sor' : 'Ask about wholesale terms'} <ArrowRight className="w-4 h-4" /></button>
          </div>
          <div className="min-h-[500px] relative"><img src={productionImage} alt="İrem Comfort Manisa üretim" className="absolute inset-0 w-full h-full object-cover" /><div className="absolute inset-0 bg-[#123968]/20" /></div>
        </div>
      </section>

      {/* TECHNOLOGY */}
      <section id="craftsmanship" className="bg-white py-24 lg:py-28">
        <div className="max-w-[1500px] mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <p className="text-[10px] tracking-[.28em] uppercase text-[#7a5b31] font-bold">03 · {isTr ? 'KONFOR TEKNOLOJİSİ' : 'COMFORT TECHNOLOGY'}</p>
            <h2 className="mt-4 text-4xl lg:text-6xl font-light tracking-[-.035em]">{isTr ? 'Rahatlığın arkasındaki yapı.' : 'The structure behind comfort.'}</h2>
            <p className="mt-5 max-w-lg text-sm leading-7 text-[#15243a]/65">{isTr ? 'Ürünlerimizi sadece görünüşüyle değil; saya, konfor katmanı, destek katmanı ve dış taban uyumuyla değerlendiriyoruz.' : 'We design for the complete relationship between upper, comfort layer, support layer and outsole.'}</p>
            <div className="mt-9 space-y-4">
              {[['%100 Dana Derisi', 'Üst yüzey'], ['Konfor Katmanı', 'PET'], ['Destek Katmanı', 'EVA'], ['Dış Taban', 'Güvenli tutuş']].map(([a,b]) => <div key={a} className="flex items-center justify-between border-b border-[#15243a]/10 py-3"><span className="font-semibold">{a}</span><span className="text-xs text-[#15243a]/55">{b}</span></div>)}
            </div>
          </div>
          <div className="relative flex justify-center py-8">
            <div className="w-[86%] max-w-[560px] aspect-[1.2] rounded-[40%] bg-[#8b5f36] shadow-[0_25px_50px_rgba(21,36,58,.14)] rotate-[-5deg]" />
            <div className="absolute w-[78%] max-w-[510px] aspect-[1.2] rounded-[40%] bg-[#f5f3ef] border border-[#d5d0c7] top-[23%] rotate-[3deg] shadow-[0_18px_35px_rgba(21,36,58,.12)]" />
            <div className="absolute w-[70%] max-w-[460px] aspect-[1.2] rounded-[40%] bg-[#dfe2df] border border-[#cbd0cc] top-[38%] rotate-[-2deg] shadow-[0_14px_30px_rgba(21,36,58,.12)]" />
            <div className="absolute w-[64%] max-w-[420px] aspect-[1.2] rounded-[40%] bg-[#171d24] top-[53%] rotate-[4deg] shadow-[0_20px_35px_rgba(21,36,58,.2)]" />
          </div>
        </div>
      </section>

      {/* PRODUCTION */}
      <section className="max-w-[1500px] mx-auto px-6 lg:px-12 pb-24">
        <div className="grid lg:grid-cols-[1.15fr_.85fr] bg-[#eee9e1]">
          <img src={productionImage} alt="Manisa atölye" className="w-full h-full min-h-[360px] object-cover" />
          <div className="p-9 lg:p-14 flex flex-col justify-center">
            <p className="text-[10px] tracking-[.28em] uppercase text-[#7a5b31] font-bold">04 · {isTr ? 'TASARIMDAN ÜRETİME' : 'FROM DESIGN TO PRODUCTION'}</p>
            <h2 className="mt-4 text-4xl lg:text-5xl font-light tracking-[-.035em]">{isTr ? 'Kalite her adımda.' : 'Quality in every step.'}</h2>
            <p className="mt-5 text-sm leading-7 text-[#15243a]/65">{isTr ? 'Manisa Ayakkabıcılar Sitesindeki üretim deneyimimizi, mağazaların sezon ihtiyaçlarına cevap veren koleksiyon anlayışıyla birleştiriyoruz.' : 'Our Manisa manufacturing experience meets a collection approach built around retail seasonality.'}</p>
            <div className="mt-7 space-y-3">{['Koleksiyon planlama', 'Model ve renk çeşitliliği', 'Toptan sipariş desteği', 'Doğrudan üretici iletişimi'].map(x => <div key={x} className="flex gap-2 text-sm"><Check className="w-4 h-4 mt-0.5 text-[#7a5b31]" />{x}</div>)}</div>
          </div>
        </div>
      </section>

      {/* CATALOG CTA */}
      <section className="bg-[#f0ece5] border-y border-[#15243a]/10">
        <div className="max-w-[1500px] mx-auto px-6 lg:px-12 py-16 lg:py-20 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div><p className="text-[10px] tracking-[.28em] uppercase text-[#7a5b31] font-bold">05 · KATALOG</p><h2 className="mt-3 text-4xl lg:text-5xl font-light">{isTr ? 'Yeni sezonu tek yerde inceleyin.' : 'Explore the new season in one place.'}</h2><p className="mt-3 text-sm text-[#15243a]/60">{isTr ? 'Koleksiyonlar, ürün grupları ve sezon detayları dijital katalogda.' : 'Collections and season details in the digital catalog.'}</p></div>
          <a href="/katalog" className="inline-flex items-center gap-3 bg-[#123968] text-white px-7 py-4 text-sm font-bold hover:bg-[#0c2a50]">{isTr ? 'Kataloğu İncele' : 'Open Catalog'} <ArrowRight className="w-4 h-4" /></a>
        </div>
      </section>

      {/* FINAL WHOLESALE CTA */}
      <section id="contact" className="relative bg-[#18222d] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_80%_20%,#d7bb8a,transparent_40%)]" />
        <div className="relative max-w-[1500px] mx-auto px-6 lg:px-12 py-20 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-[10px] tracking-[.3em] uppercase text-[#d7bb8a] font-bold">{isTr ? 'TOPTAN İŞ ORTAKLIĞI' : 'WHOLESALE PARTNERSHIP'}</p>
            <h2 className="mt-4 text-4xl lg:text-6xl font-light tracking-[-.035em]">{isTr ? 'Mağazanız için doğru koleksiyonu birlikte oluşturalım.' : 'Let’s build the right collection for your store.'}</h2>
            <p className="mt-5 text-sm sm:text-base leading-7 text-white/65 max-w-2xl">{isTr ? 'Model, numara, renk ve sezon ihtiyaçlarınızı paylaşın. Toptan satış ekibimiz size uygun koleksiyon ve sipariş seçenekleri konusunda yardımcı olsun.' : 'Tell us your model, size, color and season needs. Our wholesale team will help you build the right assortment.'}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <button onClick={onContact} className="inline-flex items-center gap-3 bg-white text-[#18222d] px-7 py-4 text-sm font-bold"><MessageCircle className="w-4 h-4" /> {isTr ? 'Toptan iletişime geç' : 'Contact wholesale'}</button>
              <a href={`tel:${CONTACT_DATA.phone}`} className="inline-flex items-center gap-3 border border-white/25 px-7 py-4 text-sm font-bold hover:bg-white/10"><Phone className="w-4 h-4" /> {CONTACT_DATA.phoneDisplay}</a>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-14 pt-8 border-t border-white/15">{metrics.map(m => <div key={m.label}><div className="text-3xl lg:text-4xl font-light">{m.value}</div><div className="mt-1 text-[10px] tracking-[.15em] uppercase text-white/50">{m.label}</div></div>)}</div>
        </div>
      </section>
    </div>
  );
};

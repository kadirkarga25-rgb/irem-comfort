# İrem Comfort Katalog Sistemi — v2

İrem Comfort katalog arşivi için `/katalog` altında çalışan dijital katalog deneyimi.

## Bu sürümde

- Yıllara göre katalog arşivi: Güncel Sezon / Geçen Sezon / Daha Önceki Sezon
- Her katalog için koleksiyon sayısı ve sayfa aralıkları
- PDF tarama + sayfa görselleri + metin çıkarımı
- Tarama sonucunu yayınlamadan önce koleksiyonları düzenleme
- Koleksiyon ekleme/silme/sıralama ve sayfa aralığı düzenleme
- Katalog içi metin arama
- İçindekiler ve tek tıkla sayfaya gitme
- Kitap benzeri katalog okuyucu
- Alt sabit sayfa önizlemeleri; ana ekranı aşağı kaydırmadan kullanım
- Sağ koleksiyon paneli; mobilde açılır koleksiyon paneli
- Gerçek fullscreen + ESC ile çıkış
- Sayfa paylaşımı ve katalog paylaşımı
- PDF indirme
- Katalog ve tekil sayfa favorileri
- Mobil / tablet / masaüstü düzeni
- Yönetim paneli ve gerçek oturum kontrolü
- Taslak / yayınlama / yayından kaldırma
- İrem Comfort IC loader animasyonu

## Önemli: mevcut iremcomfort.com sitesine entegrasyon

Katalog bölümü özellikle **`/katalog`** yolu altında hazırlandı. Mevcut sitenin ana sayfası korunarak bu modülün `https://www.iremcomfort.com/katalog` altında çalışması hedeflenmiştir.

Mevcut public site kontrol edildiğinde ana site erişilebilir durumdaydı; katalog bölümü için bu projede ayrı `/katalog` route ağacı hazırlanmıştır.

Mevcut sitenin kaynak kodu bu pakete dahil değilse, entegrasyonda aşağıdakiler mevcut projenin yapısına birleştirilmelidir:

- `app/katalog/**`
- `components/CatalogViewer.tsx`, `CatalogCard.tsx`, `Header.tsx`, `Loader.tsx`
- `lib/db.ts`, `lib/pdf.ts`, `lib/search.ts`
- `app/api/admin/**`
- `app/admin/**`
- `proxy.ts` (mevcut sitede zaten proxy/middleware varsa tek dosyada birleştirilmeli)
- `public/assets/**`
- ilgili `globals.css` stilleri

## Yönetici girişi

Admin alanı normal menülerde gösterilmez. `/admin` adresine doğrudan gidildiğinde giriş ekranına yönlenir.

`.env.local` oluşturup:

```env
ADMIN_PASSWORD=guclu-bir-sifre
ADMIN_SESSION_SECRET=uzun-rastgele-bir-secret
```

değerlerini tanımlayın.

## Çalıştırma

```bash
npm install
npm run dev
```

Public katalog:

`/katalog`

Admin:

`/admin`

## Veri saklama notu

Katalog verileri artık tarayıcı IndexedDB'sine bağlı değildir. Public katalog verileri ve admin kayıtları ana İrem Comfort `/api/catalogs` API'si üzerinden alınır. PDF dosyaları ana GitHub repository'sindeki `public/katalog-assets/` altında saklanır; katalog metadata `public/site_settings.json` içindeki `catalogs` alanında tutulur. Katalog kaydı sonrasında ana publish akışı Vercel deploy hook'unu tetikler.

## Next.js

Proje Next.js 16.3.3 Active LTS çizgisine göre hazırlanmıştır. Next.js 14.x artık desteklenen sürümler arasında değildir; mevcut İrem Comfort uygulaması 14.x ise entegrasyon sırasında kontrollü şekilde yükseltilmelidir.

## Son düzeltmeler
- PDF yükleme/analiz akışı daha dayanıklı hale getirildi; PDF.js worker engellenirse worker'sız geri dönüş bulunuyor.
- PDF seçim alanı gerçek sürükle-bırak ve dosya doğrulaması içeriyor.
- Depolama kotası gibi hatalar kullanıcıya açık şekilde gösteriliyor.
- Katalog okuyucuda üstte yalnızca tek Favori butonu var; bu buton açık olan sayfayı favorilere ekliyor.
- Mobil/tablet okuyucuda sağdan sola kaydırma sonraki sayfaya, soldan sağa kaydırma önceki sayfaya götürüyor.
- Sayfa görsellerinde mobilde yanlışlıkla sürükleme yerine kitap geçişi korunuyor.
- Sonraki entegrasyon aşamasında proje mevcut `iremcomfort.com/katalog` route'una taşınacak.

## v4 fixes
- PDF upload/storage path hardened against browser quota: stores page renders first and falls back to PDF-on-demand rendering when page images cannot fit.
- PDF viewer can render pages and thumbnails directly from the stored PDF when pre-rendered page images are unavailable.
- Favorites page now has two sections in the same place: Katalog Favorileri and Sayfa Favorileri.
- Viewer page changing supports pointer swipes/drags on desktop as well as touch devices: right-to-left = next, left-to-right = previous.
- Page area disables native image dragging to keep the book gesture reliable.

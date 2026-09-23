# İrem Comfort — Premium Toptan B2B 2026

Bu sürüm, İrem Comfort web sitesini son kullanıcı/pazar yeri odaklı yapıdan üretici ve toptan iş ortaklığı odaklı premium B2B yapıya geçirir.

## Yeni sayfalar
- `/` — Ana Sayfa
- `/koleksiyonlar` — Koleksiyonlar
- `/urunler` — Ürünler
- `/urunler/:id` — Paylaşılabilir tekil ürün sayfası
- `/markamiz` — Markamız
- `/toptan-satis` — Toptan Satış
- `/atolye` — Atölye / Zanaat
- `/katalog` — Katalog Modülü
- `/iletisim` — İletişim / teklif
- `/admin` — Yönetim

## Ürün paylaşımı
Her ürünün kendi URL'si vardır:
`/urunler/URUN-ID`

Ürün detayındaki "Ürün linkini paylaş" butonu bu URL'yi paylaşır.

## Canlı destek
Canlı destek talebi `/api/contact` üzerinden mevcut SMTP sistemiyle gönderilir. Admin alıcıları mevcut e-posta yapılandırmasından kullanılır.

## AI satış danışmanı
`GEMINI_API_KEY` (veya `GOOGLE_API_KEY`) Vercel ortam değişkenine eklenirse `/api/assistant/chat` Gemini 2.5 Flash ile doğal satış danışmanı yanıtları üretir. Anahtar yoksa mevcut yerel bilgi motoru otomatik yedek olarak çalışır.

İsteğe bağlı:
`GEMINI_MODEL=gemini-2.5-flash`

## Önemli
- `site_settings.json` içindeki yalnızca artık kullanılmayan Trendyol verileri temizlenmiştir.
- Ürünler korunmuştur.
- Katalog modülü korunmuştur.
- PDF Kütüphanesi / GitHub altyapısına dokunulmamıştır.
- `node_modules` dağıtım ZIP'ine dahil edilmemiştir; Vercel/npm kurulum sırasında bağımlılıkları kurar.

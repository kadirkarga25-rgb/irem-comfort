# İrem Comfort — Premium Toptan Satış Tasarım + Trendyol Temizliği

Bu patch mevcut ana site tasarımını daha kurumsal/toptan satış odaklı hale getirir.

## Değişiklikler
- Trendyol header/footer/mobile/product CTA referansları kaldırıldı.
- Ürünler korunur; ürün görselleri ve ürün kayıtları silinmez.
- Hero alanı B2B/toptan satış odaklı hale getirildi.
- Ana CTA: Toptan Koleksiyonu İncele / Toptan Teklif Al.
- Ürün detay CTA: Toptan Fiyat & Stok Bilgisi Al.
- Footer daha kurumsal toptan satış diliyle düzenlendi.
- `site_settings.json` doğrudan patch içinde değiştirilmez.

## Site ayarlarındaki eski Trendyol metinlerini temizleme
PowerShell: `node scripts/remove-trendyol-from-settings.mjs`
Ardından kontrol: `git diff -- public/site_settings.json`

## Git
`git add src scripts`
`git commit -m "Premium toptan satis tasarimi ve Trendyol temizligi"`
`git push origin HEAD:main`

Not: `public/site_settings.json` üzerinde değişiklik oluşursa commit etmeden önce diff'i kontrol edin.

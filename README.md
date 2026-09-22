# İrem Comfort — Trendyol Kaldırma + Katalog Modülü UX Fix

Bu patch:
- Sitedeki Trendyol yönlendirmelerini, butonlarını ve metinlerini kaldırır.
- Ürünleri ve toptan fiyat/sipariş akışını korur.
- Admin'deki Katalog Arşivi adını Katalog Modülü yapar.
- Katalog viewer'a sağdan sola / soldan sağa kaydırma ile sayfa değiştirme ekler.
- Aktif sayfa değiştiğinde alttaki küçük sayfa önizlemesini otomatik ortalar.
- Viewer içindeki dikey kaydırma davranışını iyileştirir.
- `site_settings.json` dosyasını patch ile ezmez.

İstersen mevcut `public/site_settings.json` içindeki eski Trendyol alanlarını bir kere temizlemek için:

    node scripts/remove-trendyol.mjs

Sonra kontrol:

    git diff -- public/site_settings.json
    git grep -ni -E "Trendyol|trendyol|TRENDYOL"

Patch'i uyguladıktan sonra:

    git add .
    git commit -m "Trendyol kaldirildi ve katalog modulu UX duzeltildi"
    git push origin HEAD:main

`public/site_settings.json` için diff'i özellikle kontrol et; ana site ayarlarının başka alanlarının değişmediğinden emin olmadan commit etme.

# İrem Comfort — Katalog Arşivi Entegrasyonu

## Tek uygulama mimarisi
- Katalog public sayfası: `/katalog`
- Katalog yönetimi: ana `/admin` panelindeki **Katalog Arşivi** sekmesi
- Ayrı katalog admin girişi yoktur.
- Ayrı katalog domaini / Vercel projesi yoktur.
- Katalog verileri ana uygulamanın GitHub/Vercel kalıcı kayıt sistemini kullanır.
- PDF ve kapak dosyaları `public/katalog-assets/` altında GitHub'a kaydedilir.

## Yönetim akışı
Ana Admin → Katalog Arşivi → Yeni Katalog → PDF Analizi → Analiz Sonucunu Kontrol Et → Analizi Onayla ve Kaydet → Düzenle / Yayınla.

PDF analizinde toplam sayfa, metin bulunan sayfa, tespit edilen koleksiyonlar, içindekiler ve analiz uyarıları gösterilir. Otomatik sonuçlar yayınlanmadan önce kontrol edilebilir.

## Oturum
Ana admin oturumu katalog API'leri tarafından da kullanılır. Vercel serverless instance değişikliklerinde oturumun kaybolmaması için imzalı, stateless admin oturumu desteklenir. `ADMIN_SESSION_SECRET` tanımlıysa oturum imzalama için o kullanılır; yoksa `ADMIN_PASSWORD` kullanılır.

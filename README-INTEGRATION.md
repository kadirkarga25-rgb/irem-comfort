# İrem Comfort — Katalog Entegrasyonu

Bu paket iki parçayı birlikte içerir:

- `main/` — mevcut İrem Comfort ana site + mevcut persistence/dil sistemi + katalog backend
- `catalog/` — katalog arşivi Next.js uygulaması

## Mimari

`www.iremcomfort.com/katalog` → katalog uygulaması

`Ana Admin → Katalog Arşivi` → aynı admin oturumu ile katalog yönetimi

Katalog metadata → `public/site_settings.json` → GitHub App → Vercel

Katalog PDF/kapak → `public/katalog-assets/...` → GitHub → Vercel

## Vercel

Katalog uygulamasını ayrı bir Vercel projesi olarak `catalog.iremcomfort.com` adresine deploy edin.

Ana Vercel projesinin `vercel.json` dosyası `/katalog/*` isteklerini bu deployment'a yönlendirir.

`catalog.iremcomfort.com` DNS'i katalog Vercel projesine bağlanmalıdır.

Katalog uygulamasında ayrıca GitHub token gerekmez; kayıt işlemleri ana sitenin `/api/catalogs/*` API'si üzerinden yapılır.

## Önemli

Ana site Vercel ortam değişkenleri mevcut persistence sistemindeki GitHub App ve Deploy Hook değişkenleriyle aynı kalır. Katalog uygulamasına GitHub secret koymayın.

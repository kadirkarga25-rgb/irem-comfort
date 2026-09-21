# İrem Comfort — Katalog Entegrasyonu

Katalog sistemi artık **ana İrem Comfort React/Vite uygulamasının içinde** çalışır.

## Tek uygulama mimarisi

- Tek GitHub repository
- Tek Vercel deployment
- Tek domain: `www.iremcomfort.com`
- Public katalog: `/katalog`
- Katalog yönetimi: `/katalog/admin`
- Ana admin: `/admin` → **Katalog Arşivi**

`catalog.iremcomfort.com` veya ayrı bir Vercel projesi kullanılmaz.

## Kalıcılık

Katalog metadata bilgileri ana sitenin `public/site_settings.json` kaydındaki `catalogs` alanında tutulur.

PDF ve kapak dosyaları ana sitenin GitHub deposunda `public/katalog-assets/<catalog-id>/` altında tutulur.

Katalog kaydetme/yayınlama işlemi mevcut GitHub App + Vercel Deploy Hook persistence altyapısını kullanır.

## Yönetici oturumu

Ana admin panelindeki **Katalog Arşivi → Katalog Yönetimini Aç** butonu mevcut admin session token'ını aynı origin'deki sessionStorage'a aktarır. Katalog yönetimi ayrı bir kullanıcı sistemi veya ayrı deployment kullanmaz.

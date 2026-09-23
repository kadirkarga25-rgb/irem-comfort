# İrem Comfort V14 — GitHub / Vercel Deployment

Bu paket lokal kontrolden sonra GitHub + Vercel'e yüklenmek üzere hazırlanmıştır.

## Kritik düzeltme
`ProductCard.tsx` ve ilgili sayfalar `PREMIUM_PRODUCT_IMAGE_FALLBACKS` isimli export'u kullanıyordu.
Bu export `src/constants/data.ts` içine güvenli bir boş mapping olarak eklendi. Gerçek galeri görselleri önceliklidir.

## Vercel Environment Variables
Vercel > Project > Settings > Environment Variables bölümüne:

### Zorunlu / mevcut sistem için
- `GITHUB_APP_ID`
- `GITHUB_APP_INSTALLATION_ID`
- `GITHUB_APP_PRIVATE_KEY`
- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_SECURE`

### AI danışman için
- `GEMINI_API_KEY`

`GEMINI_API_KEY` yoksa AI danışman API üzerinden Gemini yanıtı alamaz; ana site yine çalışır, ancak AI özelliği çalışmaz.

### Yayın otomasyonu kullanılıyorsa
- `VERCEL_DEPLOY_HOOK_URL`

## Vercel ayarı
Framework: Vite
Build command: `npm run build`
Output directory: `dist`

`vercel.json` API ve SPA rewrite'larını içerir.

## Güvenlik
`.env` dosyası pakete dahil değildir. Şifre/API anahtarlarını GitHub'a koymayın.

## GitHub'a geçmeden önce
1. `npm install`
2. `npm run build`
3. `public/site_settings.json` diff kontrolü
4. `git status`
5. Sonra commit/push

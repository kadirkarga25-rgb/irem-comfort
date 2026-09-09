# İrem Comfort — Yönetim Paneli & Akıllı Yayın Sistemi

İrem Comfort web sitesi için React/Vite tabanlı yönetim paneli, içerik yönetimi ve kalıcı yayın altyapısı.

Bu sürümde amaç; siteyi mümkün olduğunca **Admin Paneli üzerinden yönetmek**, değişiklikleri **GitHub App ile güvenli şekilde GitHub'a kaydetmek** ve **Vercel Production yayınını Deploy Hook ile doğrudan tetiklemek**tir.

## Yayın Akışı

```text
Admin Paneli
    ↓
GitHub App
    ↓
GitHub main
    ↓
Vercel Deploy Hook
    ↓
Vercel Build
    ↓
Production
    ↓
www.iremcomfort.com
```

Bu yapı, GitHub'a commit gönderildikten sonra Vercel webhook'unun gecikmesine veya kaçırmasına bağımlılığı azaltır.

---

## Temel Özellikler

- Ürün ekleme, düzenleme ve silme
- Ürün görselleri ve renk varyantları yönetimi
- Medya kütüphanesi
- Hero ve site görselleri yönetimi
- Hakkımızda, SSS ve müşteri yorumları yönetimi
- SEO ayarları
- Tema ve görünüm ayarları
- JSON tam yedek alma
- JSON yedekten geri yükleme
- GitHub App ile kalıcı kayıt
- GitHub commit doğrulaması
- Vercel Production Deploy Hook ile yayın tetikleme
- Persistence Diagnostics ile kaynak/commit kontrolü

---

# GitHub App

Tarayıcı içinde Personal Access Token (PAT) kullanılması yerine GitHub App kullanılır.

Vercel Production Environment Variables:

```env
GITHUB_APP_ID=
GITHUB_APP_INSTALLATION_ID=
GITHUB_APP_PRIVATE_KEY=
```

GitHub App'in ilgili repository üzerinde en azından gerekli Contents yazma yetkisine sahip olması gerekir.

### Güvenlik

Private key ve diğer gizli değerler:

- GitHub repository'sine commit edilmemelidir.
- Frontend koduna yazılmamalıdır.
- `localStorage` içine konulmamalıdır.
- Yalnızca güvenli sunucu ortamında tutulmalıdır.

---

# Vercel Deploy Hook

Admin yayın sisteminin Vercel'i doğrudan tetiklemesi için Vercel'de bir Deploy Hook oluşturulur.

Önerilen:

```text
Name: admin-publish
Branch: main
```

Vercel'de oluşturulan hook URL'si **gizli tutulmalıdır**.

Vercel Production Environment Variables içine:

```env
VERCEL_DEPLOY_HOOK_URL=
```

olarak eklenir.

### Yayın sırasında

1. Admin güncel site verisini hazırlar.
2. GitHub App ile GitHub'a commit gönderilir.
3. Commit GitHub'dan doğrulanır.
4. `VERCEL_DEPLOY_HOOK_URL` üzerinden Vercel Production deploy tetiklenir.
5. Vercel build işlemini gerçekleştirir.
6. Production deployment oluşur.

---

# Site Ayarlarının Kalıcı Kaydı

Ana kalıcı kaynak GitHub'daki:

```text
public/site_settings.json
```

dosyasıdır.

Genel akış:

```text
Admin State
    ↓
/api/settings veya /api/publish-settings
    ↓
sanitize + doğrulama
    ↓
GitHub App
    ↓
public/site_settings.json
```

SEO için oluşturulan dosyalar da yayın sırasında güncellenebilir:

```text
public/robots.txt
public/sitemap.xml
```

---

# JSON Yedekleme ve Geri Yükleme

Admin panelindeki yedekleme sistemi site verilerini JSON formatında dışarı aktarır.

Yedekte bulunabilen veriler:

- Ürünler
- Ürün açıklamaları
- Görsel yolları
- Renkler
- Malzemeler
- Ürün özellikleri
- Hero bilgileri
- Site içerikleri
- Bölüm sıralaması
- Müşteri yorumları
- SEO ayarları
- Tema ayarları
- İletişim ve sistem ayarları

Örnek:

```text
irem-comfort-tam-yedek-12-urun-2026-09-09.json
```

## Geri Yükleme

Admin Paneli → Yedekleme → **Yedek JSON Dosyası Seç**

işlemiyle yedek seçilir.

Sistem JSON'u doğrular ve site verilerini geri yükler.

> JSON dosyası görsellerin kendisini taşımaz. Görsellerin site üzerindeki yollarını taşır. İlgili görseller repository içindeki `public/uploads` yapısında mevcutsa ürünler bu yolları kullanır.

---

# Persistence Diagnostics

Admin panelindeki **Site Ayarları Kalıcılık Teşhisi** bölümü, verinin gerçekten nereden geldiğini kontrol etmek için kullanılır.

Kontrol edilen bilgiler:

```text
Veri Kaynağı
Son Commit SHA
Son Yayınlanma Zamanı
Repository
Branch
Hero görseli doğrulaması
Taslak değişiklik durumu
```

Örnek:

```text
VERİ KAYNAĞI
GitHub

DEPO
kadirkarga25-rgb/irem-comfort

BRANCH
main
```

Bu bölüm özellikle farklı cihazlarda eski ve yeni verilerin karışması durumunda teşhis için kullanılmalıdır.

---

# Admin Yayın Sistemi

Ana yayın endpoint'i:

```text
POST /api/publish-settings
```

Uyumluluk amacıyla:

```text
POST /api/sync-github
```

endpoint'i de kullanılabilir.

Yeni yayın akışında medya klasörünün tamamı her kaydetme işleminde yeniden taranmaz.

Bu önemlidir çünkü `public/uploads` içindeki yüzlerce dosyanın her yayın işleminde tekrar işlenmesi:

- Gereksiz GitHub API çağrılarına
- Uzun bekleme sürelerine
- Admin panelinin takılı kalmasına
- Gereksiz medya commitlerine

neden olabilir.

Medya dosyaları yüklendikleri aşamada GitHub'a gönderilir; site ayarları yayınında ise ayar ve SEO dosyaları atomik olarak commit edilir.

---

# Yayın Durumu

Başarılı bir Admin yayınının mantıksal akışı:

```text
✓ Admin verisi hazırlandı
✓ GitHub App doğrulandı
✓ GitHub commit oluşturuldu
✓ GitHub read-back doğrulandı
✓ Vercel Deploy Hook tetiklendi
⏳ Vercel build
✓ Production
```

Vercel build sonucu Vercel panelinden kontrol edilebilir.

---

# Önemli Dosyalar

```text
api/
└── index.ts
    GitHub App authentication
    GitHub kalıcı kayıt
    Deploy Hook
    API endpointleri

src/
├── context/
│   └── ImageContext.tsx
│       Merkezi site state'i
│       kayıt
│       yedek geri yükleme
│
└── components/
    └── admin/
        ├── AdminPage.tsx
        ├── BackupAdminTab.tsx
        └── ...
```

---

# Ortam Değişkenleri

Örnek Production değişkenleri:

```env
GITHUB_APP_ID=
GITHUB_APP_INSTALLATION_ID=
GITHUB_APP_PRIVATE_KEY=

VERCEL_DEPLOY_HOOK_URL=

GITHUB_REPO=kadirkarga25-rgb/irem-comfort
GITHUB_BRANCH=main

GEMINI_API_KEY=

SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
SMTP_SECURE=true
```

Gerçek değerler bu README'ye yazılmamalıdır.

---

# Yerel Çalıştırma

Gereksinimler:

- Node.js
- npm

Kurulum:

```bash
npm install
```

Geliştirme:

```bash
npm run dev
```

Production build:

```bash
npm run build
```

---

# Güvenli Çalışma Sırası

Büyük değişikliklerden önce:

```text
1. JSON yedeği al
2. Değişiklikleri yap
3. Admin'den kaydet/yayınla
4. GitHub commitini kontrol et
5. Vercel deploymentını kontrol et
6. Canlı siteyi kontrol et
7. Gerekirse yeni yedek al
```

GitHub'daki commit başarılı olsa bile Vercel deploymentının `Ready` olduğunu kontrol etmek iyi bir uygulamadır.

---

# Sorun Giderme

## GitHub'a kaydoluyor ama Vercel yayınlamıyorsa

Kontrol edin:

```text
VERCEL_DEPLOY_HOOK_URL
```

Production Environment Variables içinde mevcut mu?

Ardından Deploy Hook'un:

```text
Branch = main
```

olduğunu kontrol edin.

---

## "H is not a function"

Bu hata, geri yükleme sırasında çağrılan fonksiyonun React Context tarafından sağlanmaması durumunda oluşur.

Yedek geri yükleme sistemi `restoreFullBackup` fonksiyonunu merkezi Context üzerinden kullanır.

---

## Veriler başka cihazda görünmüyorsa

Admin panelindeki Persistence Diagnostics bölümünü kontrol edin.

Özellikle:

```text
Veri Kaynağı = GitHub
```

olmalı ve son commit SHA GitHub'daki son ilgili commit ile uyumlu olmalıdır.

---

# Teknoloji

- React
- TypeScript
- Vite
- Express
- Vercel
- GitHub API
- GitHub App
- GitHub Contents / Git Data API
- Tailwind CSS
- Lucide React
- Motion
- GSAP
- Nodemailer

---

# Projenin Ana Prensibi

Bu projenin temel amacı:

> **İrem Comfort web sitesini mümkün olduğunca Admin Paneli üzerinden yönetmek; değişiklikleri güvenli şekilde GitHub'a kaydetmek ve Vercel Production'a doğrudan yayınlatmak.**

Böylece günlük site yönetimi için manuel GitHub düzenlemesi veya harici bir yapay zekâ geliştirme ortamına bağımlılık azaltılır.

**İrem Comfort — Yönetim Paneli & Akıllı Yayın Sistemi**

# İrem Comfort — Yönetim Paneli & Akıllı Deploy Sistemi

İrem Comfort resmi web sitesi için geliştirilmiş React/Vite tabanlı yönetim paneli ve içerik yönetim sistemidir.

Bu sürümün ana amacı; site içeriklerinin, ürünlerin, görsellerin ve ayarların **tek merkezden yönetilmesi**, yapılan değişikliklerin **GitHub üzerinde kalıcı olarak saklanması** ve Vercel üzerinden güvenli şekilde yayınlanmasıdır.

---

## 🚀 Sistem Özeti

Bu projede yönetim paneli üzerinden:

- Ürün ekleme / düzenleme / silme
- Ürün görselleri ve renk varyantları yönetimi
- Hero ve site görselleri yönetimi
- Hakkımızda, SSS, müşteri yorumları ve diğer site içeriklerinin yönetimi
- SEO ayarları
- Tema ve görünüm ayarları
- Medya kütüphanesi
- CRM ve iletişim ayarları
- Site yedeği oluşturma
- JSON yedeğinden tam geri yükleme
- GitHub kalıcı kayıt
- Vercel Production deploy
- Sistem ve yayın durumu kontrolü

işlemleri yapılabilir.

---

# 🔐 GitHub App ile Kalıcı Kayıt

Sistem eski tarayıcı içi Personal Access Token (PAT) yöntemine bağlı değildir.

Yeni yapıda GitHub işlemleri sunucu tarafında **GitHub App** üzerinden gerçekleştirilir.

### Kullanılan değişkenler

```env
GITHUB_APP_ID=
GITHUB_APP_INSTALLATION_ID=
GITHUB_APP_PRIVATE_KEY=
```

GitHub App, repository üzerinde gerekli izinlere sahip olmalıdır.

Özellikle:

- Contents → Read and write

izni gereklidir.

### Neden GitHub App?

GitHub App kullanımı sayesinde:

- PAT'i tarayıcıda saklamaya gerek kalmaz.
- GitHub erişim anahtarı kullanıcıya gösterilmez.
- Yönetim panelinden yapılan kayıtlar sunucu üzerinden GitHub'a gönderilir.
- Installation Token otomatik olarak oluşturulur.
- Token süresi dolduğunda sistem yeni token oluşturabilir.

---

# 💾 Site Ayarlarının Kalıcı Kaydı

Yönetim panelinde yapılan değişiklikler yalnızca tarayıcı belleğinde tutulmaz.

Kalıcı kayıt akışı:

```text
Yönetim Paneli
      ↓
ImageContext
      ↓
/api/settings
      ↓
GitHub App Authentication
      ↓
GitHub Repository
      ↓
public/site_settings.json
      ↓
Vercel
      ↓
Canlı Site
```

Bu yapı sayesinde farklı bilgisayardan veya telefondan site açıldığında kayıtlı site ayarlarının kaybolmaması hedeflenir.

---

# 🛡️ Yedekleme Sistemi

Yönetim panelinde bulunan yedekleme sistemi, site verilerini JSON formatında dışarı aktarabilir.

Yedek içerisinde aşağıdaki veriler bulunabilir:

- Ürünler
- Ürün açıklamaları
- Ürün görselleri
- Renkler
- Malzeme bilgileri
- Ürün özellikleri
- Site içerikleri
- Bölüm sıralaması
- Müşteri yorumları
- SEO ayarları
- Tema ayarları
- İletişim bilgileri
- Sistem ayarları

Örnek tam yedek:

```text
irem-comfort-tam-yedek-12-urun-2026-09-09.json
```

Bu yedekte 12 ürün bulunmaktadır.

---

# ♻️ JSON Yedeğinden Geri Yükleme

Yedek dosyası:

**Admin Paneli → Yedekleme → Yedek Dosyasından Geri Yükle**

alanından seçilir.

Geri yükleme sırasında sistem:

1. JSON dosyasını okur.
2. Yedek formatını kontrol eder.
3. Ürün ve site verilerini çıkarır.
4. Mevcut yönetim verileriyle birleştirir.
5. Uygulama belleğini günceller.
6. Kalıcı kayıt işlemini başlatır.
7. GitHub'a gönderir.
8. Gerekli durumda Vercel deploy sürecini başlatır.

> Görsellerin kendisi JSON dosyasının içinde bulunmaz; JSON içerisinde görsellerin site üzerindeki yolları tutulur. Görseller GitHub/public/uploads yapısında bulunuyorsa geri yüklenen ürünler bu yollar üzerinden görsellerini kullanır.

---

# 📦 Deploy Sistemi

Yeni deploy sistemi, yönetim panelinden yapılan değişikliklerin yayınlanma sürecini daha anlaşılır hale getirmek için tasarlanmıştır.

Temel akış:

```text
Değişiklik Yap
      ↓
Kaydet
      ↓
GitHub'a Gönder
      ↓
Commit Oluştur
      ↓
Vercel Build
      ↓
Production Deploy
      ↓
Canlı Site
```

Admin panelindeki yayın durumu bölümünden GitHub kaynak durumu ve son commit bilgileri takip edilebilir.

---

# 🔎 Persistence Diagnostics

Yönetim panelindeki **Site Ayarları Kalıcılık Teşhisi** bölümü, sistemin gerçekten hangi kaynaktan veri okuduğunu kontrol etmek için kullanılır.

Kontrol edilen başlıca bilgiler:

- Veri kaynağı
- Son commit SHA
- Son yayınlanma zamanı
- GitHub repository
- GitHub branch
- Kritik görsellerin GitHub ve uygulama belleğindeki yolları
- Taslak değişiklik durumu

Örneğin:

```text
VERİ KAYNAĞI
GitHub

SON COMMIT SHA
xxxxxxxx

DEPO
kadirkarga25-rgb/irem-comfort
```

Bu bölüm, özellikle farklı cihazlarda eski/yeni verilerin karışması durumunda teşhis amacıyla kullanılmalıdır.

---

# 🧩 Önemli Dosyalar

```text
api/
└── index.ts
    Sunucu API'leri, GitHub App authentication,
    ayar kayıtları ve deploy işlemleri

src/
├── context/
│   └── ImageContext.tsx
│       Site verilerinin merkezi yönetimi,
│       kayıt ve geri yükleme işlemleri
│
└── components/
    └── admin/
        ├── AdminPage.tsx
        ├── BackupAdminTab.tsx
        ├── DeploymentExperienceAdminTab.tsx
        ├── MediaLibraryAdminTab.tsx
        └── ...
```

---

# 🌐 Teknoloji Altyapısı

- React 19
- TypeScript
- Vite
- Express
- Vercel
- GitHub Contents API
- GitHub App Authentication
- Tailwind CSS
- Lucide React
- Motion
- GSAP
- Nodemailer
- Google Gemini API entegrasyonu

---

# ⚙️ Yerel Çalıştırma

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

TypeScript kontrolü:

```bash
npm run lint
```

Production build:

```bash
npm run build
```

---

# 🔑 Ortam Değişkenleri

Örnek:

```env
GITHUB_APP_ID=
GITHUB_APP_INSTALLATION_ID=
GITHUB_APP_PRIVATE_KEY=

GITHUB_REPO=irem-comfort
GITHUB_BRANCH=main

GEMINI_API_KEY=

SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
SMTP_SECURE=true
```

Gerçek gizli anahtarlar hiçbir zaman GitHub repository'sine commit edilmemelidir.

GitHub App private key yalnızca güvenli sunucu ortamında tutulmalıdır.

---

# ☁️ Vercel

Production deployment GitHub repository üzerinden Vercel tarafından yapılır.

Önerilen yapı:

```text
GitHub
  ↓
main branch
  ↓
Vercel
  ↓
Production
```

Bir değişiklikten sonra Vercel panelinden ilgili deployment'ın:

```text
Ready
```

durumuna gelmesi beklenmelidir.

Build sırasında oluşan kırmızı **Error** kayıtları kontrol edilmeden canlı sistemde yedek geri yükleme veya büyük veri değişikliği yapılmamalıdır.

---

# 🆘 Sorun Giderme

## "H is not a function"

Bu hata genellikle bir fonksiyonun çağrıldığı halde React Context içerisinde bulunmaması durumunda oluşur.

Özellikle JSON yedeği geri yükleme sisteminde `restoreFullBackup` gibi fonksiyonların Context tarafından gerçekten export edilmesi gerekir.

---

## Veriler geri geliyor ama başka cihazda görünmüyor

Şunlar kontrol edilmelidir:

1. Admin panelindeki Persistence Diagnostics bölümü açılır.
2. Veri kaynağının GitHub olduğu kontrol edilir.
3. Son commit SHA kontrol edilir.
4. GitHub repository kontrol edilir.
5. Vercel'deki son deployment kontrol edilir.
6. Tarayıcıdaki eski localStorage taslağı varsa temizlenip sayfa yenilenir.

---

## GitHub'a kayıt olmuyor

Kontrol listesi:

```text
GITHUB_APP_ID
GITHUB_APP_INSTALLATION_ID
GITHUB_APP_PRIVATE_KEY
```

Vercel Production Environment Variables içerisinde mevcut olmalıdır.

GitHub App'in ilgili repository için:

```text
Contents → Read and write
```

yetkisi bulunmalıdır.

---

# 🔄 Güvenli Çalışma Kuralı

Büyük değişikliklerden önce mutlaka JSON yedeği alınmalıdır.

Önerilen sıra:

```text
1. Yedek Al
2. Değişiklik Yap
3. Kaydet
4. GitHub Commit Kontrol Et
5. Vercel Deployment Kontrol Et
6. Canlı Siteyi Kontrol Et
7. Yeni Yedek Al
```

---

# 📌 Proje Hakkında

Bu proje İrem Comfort web sitesinin yönetim, içerik, ürün, medya ve yayın süreçlerini tek bir sistem altında toplamak amacıyla geliştirilmiştir.

Ana hedef:

> **Siteyi değiştirmek için harici bir yapay zekâ aracına veya manuel GitHub düzenlemesine mümkün olduğunca az ihtiyaç duymak.**

Yönetim paneli üzerinden yapılan değişikliklerin güvenli şekilde kaydedilmesi, yedeklenmesi ve yayınlanması temel sistem prensibidir.

---

## 🏷️ Sürüm Notu

Bu sürüm özellikle:

- GitHub App tabanlı kimlik doğrulama
- Kalıcı site ayarları
- Yeni deploy sistemi
- JSON tam yedekleme
- JSON yedekten geri yükleme
- Persistence Diagnostics
- Admin paneli hata düzeltmeleri

üzerine kurulmuştur.

**İrem Comfort — Yönetim Sistemi**

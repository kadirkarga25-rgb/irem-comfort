# Gizli katalog grupları — GitHub depolaması

Bu özellik mevcut İrem Comfort deposuna eklenmiştir. Vercel Blob kullanılmaz. Özel katalog PDF parçaları ve grup kayıtları, aynı GitHub deposundaki ayrı `${PRIVATE_CATALOG_DATA_BRANCH}` dalında **AES-256-GCM ile şifrelenmiş** olarak tutulur. Bu veri dalı public depoda görünse bile içerikler şifreleme anahtarı olmadan okunamaz. Dosya adları ve grup kayıtları da şifrelenir.

## Vercel ortam değişkenleri

Vercel > Project > Settings > Environment Variables bölümüne ekle:

- `GITHUB_PRIVATE_CATALOG_TOKEN`: GitHub fine-grained personal access token. Yalnızca `kadirkarga25-rgb/irem-comfort` deposuna **Contents: Read and write** izni ver. Token'ı asla istemci koduna ekleme.
- `PRIVATE_CATALOG_ENCRYPTION_KEY`: 32 rastgele baytın Base64 karşılığı. Güvenli bir yerde üretip sakla; kaybolursa şifrelenmiş PDF'ler geri açılamaz. Örnek üretim komutu: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`
- `ADMIN_SESSION_SECRET`: mevcut yönetici oturum tokenini imzalamakta kullanılan değerle aynı olmalı. Uygulama `ADMIN_PASSWORD` üzerinden imza atıyorsa mevcut fallback kullanılabilir.
- İsteğe bağlı: `PRIVATE_CATALOG_GITHUB_OWNER=kadirkarga25-rgb`, `PRIVATE_CATALOG_GITHUB_REPO=irem-comfort`, `PRIVATE_CATALOG_DATA_BRANCH=private-catalog-data`.

İlk API çağrısında uygulama `private-catalog-data` dalını (yoksa) `main` dalından oluşturur. Vercel ortam değişkenlerini kaydettikten sonra Preview ve Production deployment'larını yeniden dağıt.

## Özellikler

- Yönetici panelinden grup oluşturma ve birden fazla PDF ekleme/kaldırma.
- Her grup için ayrı paylaşım bağlantısı; bağlantıyı yenileme, kapatma/açma ve grubu silme.
- Müşteri sayfası: `/katalog-ozel/<token>`.
- PDF'ler public `public/` klasörüne veya açık PDF olarak GitHub'a konmaz; küçük parçalara bölünüp şifrelenerek GitHub'a kaydedilir.
- PDF indirme endpoint'i aktif paylaşım tokenini doğrular ve sunucu tarafında şifreyi çözer.
- Yükleme sınırı: PDF başına 80 MB.

## Önemli güvenlik notları

- Public GitHub deposunda yalnızca şifreli dosyalar yer alır. Güvenlik, `PRIVATE_CATALOG_ENCRYPTION_KEY` değerinin yalnızca Vercel sunucusunda tutulmasına bağlıdır.
- Paylaşım bağlantısı bir erişim anahtarıdır. Linki alan kişi PDF'yi görüntüleyebilir/kaydedebilir.
- Git geçmişine daha önce yazılmış şifreli parçalar silme işleminden sonra geçmişte kalabilir; şifreleme anahtarı korunmalı, asla GitHub'a commit edilmemeli.
- Bu özellik gerçek Vercel ortamında henüz uçtan uca doğrulanmadı. Önce Preview'da grup oluşturma, PDF yükleme/görüntüleme, link yenileme ve silme testleri yapılmalı.

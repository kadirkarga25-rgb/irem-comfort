# Gizli katalog grupları

Bu değişiklik mevcut İrem Comfort deposunda ayrı bir dalda hazırlanmıştır; ana `main` dalına doğrudan gönderilmemiştir.

## Vercel ortam ayarları
1. Vercel projesinde Storage bölümünden bir **Blob** store oluşturup projeye bağla. `BLOB_READ_WRITE_TOKEN` ortam değişkeni tanımlı olmalı.
2. `ADMIN_SESSION_SECRET` değerini yönetici oturum tokenini imzalarken kullanılan değerle aynı ayarla. Proje `ADMIN_PASSWORD` üzerinden imza atıyorsa bu değer yedek olarak okunur.
3. Projede paketler `@vercel/blob` ve `@vercel/node` olarak eklenmiştir. Lockfile kullanıyorsan `npm install` çalıştırıp lockfile değişikliğini de ekle.
4. Preview ortamına deploy edip yönetici panelinden test etmeden Production'a alma.

## Özellikler
- Yönetici panelinden gizli grup oluşturma.
- Her grup için ayrı paylaşım bağlantısı.
- Bir gruba birden fazla PDF yükleme ve PDF kaldırma.
- Paylaşımı kapatma/açma, bağlantıyı yenileme ve grubu silme.
- Müşteri sayfası: `/katalog-ozel/<token>`.
- Gizli PDF'ler `public/` klasörüne veya GitHub deposuna eklenmez; Blob private depolamasına yüklenir.
- PDF sunma endpoint'i, her istekte aktif paylaşım tokenini doğrular ve doğrudan Blob URL'si müşteriye gösterilmez.

## Güvenlik ve test notu
Paylaşım linki bir erişim anahtarı gibi davranır. Linki alan kişiler PDF'yi görüntüleyebilir ve dosyayı kaydedebilir; bunu tamamen engellemek mümkün değildir. Bu özellik henüz gerçek Vercel Blob store ve yönetici oturumuyla Preview ortamında doğrulanmalıdır. Özellikle Blob private `get`/upload callback davranışı ve mevcut oturum tokeninin süresi deployment öncesi test edilmelidir.

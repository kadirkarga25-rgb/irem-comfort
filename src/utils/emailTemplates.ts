export interface EmailTemplateParams {
  title: string;
  subtitle?: string;
  bodyText: string;
  ctaText?: string;
  ctaUrl?: string;
  bannerImage?: string;
  badgeText?: string;
  standInfo?: string;
  contactPhone?: string;
  contactEmail?: string;
  contactAddress?: string;
  specialOfferBox?: string;
}

export const EMAIL_TEMPLATES = [
  {
    id: 'catalog',
    name: '👠 Yeni Sezon Koleksiyonu & Katalog Bülteni',
    description: 'En son çıkan deri terlik ve sandalet modellerini müşterilerinize ve bayilerinize duyurmak için şık katalog e-postası.',
    defaultSubject: 'İrem Comfort 2026-2027 Yeni Sezon Hakiki Deri Koleksiyon Kataloğu Yayınlandı!',
    defaultBadge: 'YENİ SEZON KATALOĞU',
    defaultTitle: '2026-2027 Bayan Comfort Sandalet & Terlik Koleksiyonumuzu Keşfedin!',
    defaultSubtitle: 'Manisa Ayakkabıcılar Sitesi İmalat Atölyemizden %100 Hakiki Deri Kalitesi',
    defaultBody: `Değerli Müşterimiz ve İş Ortağımız,\n\nİrem Comfort olarak Manisa Ayakkabıcılar Sitesindeki atölyemizde özenle imal ettiğimiz %100 hakiki deri, anatomik yumuşak tabanlı bayan comfort terlik ve sandalet koleksiyonumuzun yeni sezon kataloğu hazırlandı.\n\nUzun saatler ayakta kalan kadınlar için geliştirilen ortopedik sabo modellerimiz, çift tokalı zamansız klasiklerimiz ve şık yazlık sandaletlerimizi incelemek için sizleri online kataloğumuza bekliyoruz.`,
    defaultCtaText: 'Koleksiyonu & Kataloğu İnceleyin',
    defaultCtaUrl: 'https://iremcomfort.com/#collection',
    defaultBanner: 'https://images.unsplash.com/photo-1603808033176-9d134e6f2c74?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'fair',
    name: '🏛️ Fuar Davetiyesi & Stand Ziyareti (AYMOD / İFM)',
    description: 'Sektör fuarları için bayilerinizi ve müşterilerinizi standınıza davet eden resmi fuar e-postası.',
    defaultSubject: 'Davetiye: AYMOD Uluslararası Ayakkabı Moda Fuarı - İrem Comfort Standı',
    defaultBadge: 'RESMİ FUAR DAVETİYESİ',
    defaultTitle: 'AYMOD Fuarı Standımıza Davetlisiniz!',
    defaultSubtitle: 'İstanbul Fuar Merkezi (İFM) Yeşilköy | Hall 4 - Stand B214',
    defaultBody: `Sayın Sektör Temsilcisi ve Değerli Müşterimiz,\n\n20-23 Ağustos 2026 tarihlerinde İstanbul Fuar Merkezi (İFM) Yeşilköy'de düzenlenecek olan AYMOD Uluslararası Ayakkabı Moda Fuarı'nda sizleri ağırlamaktan onur duyarız.\n\n2026-2027 Sezonu Kadın & Erkek Hakiki Deri Terlik, Sandalet ve Ortopedik Comfort ürünlerimizi canlı incelemek, özel toptan sipariş şartlarımızı görüşmek üzere sizleri standımıza bekliyoruz.`,
    defaultCtaText: 'Fuar Stand Konumu & Ücretsiz Davetiye',
    defaultCtaUrl: 'https://iremcomfort.com/#fair',
    defaultBanner: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1200',
    defaultStandInfo: 'Hall 4 - Stand B214 | İstanbul Fuar Merkezi'
  },
  {
    id: 'wholesale',
    name: '💼 Toptan Sipariş & Özel Bayi İndirimi Bülteni',
    description: 'Mağaza sahipleri ve toptan alıcılar için özel serili seri sipariş ve toptan fiyat avantajı duyurusu.',
    defaultSubject: 'Toptan Bayi Fırsatı: İrem Comfort Hakiki Deri Terlik & Sandalet İmalat Fiyatları',
    defaultBadge: 'TOPTAN & BAYİ ÖZEL DANIŞMA',
    defaultTitle: 'Doğrudan İmalatçıdan Mağazanıza Özel Toptan Fiyatlar',
    defaultSubtitle: 'Aracısız Üretim Güvencesi | Seri Sipariş & Özel Etiket İmalatı',
    defaultBody: `Sayın Mağaza Yetkilisi,\n\nİrem Comfort olarak Manisa atölyemizden doğrudan mağazanıza yüksek marjlı ve yüksek kaliteli %100 hakiki deri bayan terlik ve sandalet tedariği sağlıyoruz.\n\nBu aya özel toptan koli siparişlerinde avantajlı nakliye ve özel seri indirimlerimiz başlamıştır. Detaylı ürün kataloğu ve toptan fiyat listemiz için doğrudan WhatsApp hattımızdan bizimle iletişime geçebilirsiniz.`,
    defaultCtaText: 'WhatsApp Toptan İletişim Hattı',
    defaultCtaUrl: 'https://wa.me/905330297125?text=Merhaba,%20toptan%20fiyat%20listesi%20almak%20istiyorum.',
    defaultBanner: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=1200',
    defaultSpecialOfferBox: '⚡ Bu Ay Verilecek Toptan Seri Siparişlerinde Ücretsiz Kargo & Özel Mağaza Teşhir Standı Hediye!'
  },
  {
    id: 'custom',
    name: '📝 Serbest Duyuru & Özel Müşteri E-Postası',
    description: 'Konu, içerik ve butonunu tamamen özgürce yazabileceğiniz kurumsal şablon.',
    defaultSubject: 'İrem Comfort - Önemli Duyuru & Bilgilendirme',
    defaultBadge: 'İREM COMFORT DUYURU',
    defaultTitle: 'İrem Comfort Özel Bilgilendirme',
    defaultSubtitle: 'Hakiki Deri Bayan Comfort Terlik & Sandalet İmalatı',
    defaultBody: `Değerli Müşterilerimiz,\n\nAtölyemiz ve koleksiyonumuzla ilgili en güncel gelişmeleri paylaşmaktan mutluluk duyuyoruz. Tüm soru, görüş ve sipariş talepleriniz için iletişim kanallarımızdan bize dilediğiniz zaman ulaşabilirsiniz.`,
    defaultCtaText: 'Web Sitemizi Ziyaret Edin',
    defaultCtaUrl: 'https://iremcomfort.com',
    defaultBanner: 'https://images.unsplash.com/photo-1603808033176-9d134e6f2c74?auto=format&fit=crop&q=80&w=1200'
  }
];

export function renderEmailHtml(params: EmailTemplateParams): string {
  const {
    title,
    subtitle,
    bodyText,
    ctaText,
    ctaUrl,
    bannerImage,
    badgeText,
    specialOfferBox,
    contactPhone = '0533 029 71 25',
    contactEmail = 'info@iremcomfort.com',
    contactAddress = 'Manisa Ayakkabıcılar Sitesi 5757.Sk No:21/A Yunusemre/Manisa'
  } = params;

  // Convert plain text line breaks to HTML paragraphs
  const paragraphsHtml = bodyText
    .split('\n\n')
    .map(p => p.trim())
    .filter(Boolean)
    .map(p => `<p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.6; color: #334155;">${p.replace(/\n/g, '<br/>')}</p>`)
    .join('');

  return `
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f1f5f9; padding: 20px 10px;">
    <tr>
      <td align="center">
        
        <!-- Main Card Container -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 620px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.08); border: 1px solid #e2e8f0;">
          
          <!-- Header Banner -->
          <tr>
            <td style="background-color: #082C6C; padding: 28px 32px; text-align: center;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center">
                    <span style="font-size: 22px; font-weight: 800; color: #ffffff; letter-spacing: 1.5px; text-transform: uppercase; font-family: 'Georgia', serif;">İREM COMFORT</span>
                    <div style="font-size: 11px; color: #fcd34d; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; margin-top: 4px;">HAKİKİ DERİ BAYAN COMFORT TERLİK & SANDALET</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          ${bannerImage ? `
          <!-- Image Banner -->
          <tr>
            <td>
              <img src="${bannerImage}" alt="${title}" style="width: 100%; max-height: 280px; object-fit: cover; display: block;" />
            </td>
          </tr>
          ` : ''}

          <!-- Body Content Area -->
          <tr>
            <td style="padding: 36px 32px 28px 32px;">
              
              ${badgeText ? `
              <div style="display: inline-block; background-color: #fef3c7; color: #92400e; font-size: 11px; font-weight: 800; padding: 5px 12px; border-radius: 6px; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 16px; border: 1px solid #fde68a;">
                ${badgeText}
              </div>
              ` : ''}

              <h1 style="margin: 0 0 8px 0; font-size: 22px; font-weight: 800; color: #0a2d6f; line-height: 1.3;">
                ${title}
              </h1>

              ${subtitle ? `
              <h2 style="margin: 0 0 20px 0; font-size: 14px; font-weight: 600; color: #64748b; line-height: 1.4;">
                ${subtitle}
              </h2>
              ` : ''}

              <div style="border-bottom: 2px solid #f1f5f9; margin-bottom: 24px;"></div>

              <!-- Paragraphs -->
              ${paragraphsHtml}

              ${specialOfferBox ? `
              <!-- Special Highlight Box -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #eff6ff; border-left: 4px solid #082C6C; border-radius: 8px; margin: 24px 0;">
                <tr>
                  <td style="padding: 16px 20px; font-size: 13px; font-weight: 700; color: #1e3a8a; line-height: 1.5;">
                    ${specialOfferBox}
                  </td>
                </tr>
              </table>
              ` : ''}

              ${(ctaText && ctaUrl) ? `
              <!-- CTA Button -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 28px; margin-bottom: 12px;">
                <tr>
                  <td align="center">
                    <a href="${ctaUrl}" target="_blank" style="display: inline-block; background-color: #082C6C; color: #ffffff; font-size: 14px; font-weight: 800; text-decoration: none; padding: 14px 28px; border-radius: 10px; box-shadow: 0 4px 12px rgba(8, 44, 108, 0.25); letter-spacing: 0.5px;">
                      ${ctaText} &rarr;
                    </a>
                  </td>
                </tr>
              </table>
              ` : ''}

            </td>
          </tr>

          <!-- Footer Area -->
          <tr>
            <td style="background-color: #0f172a; padding: 28px 32px; color: #94a3b8; font-size: 12px; line-height: 1.6; text-align: center;">
              <div style="font-size: 13px; font-weight: 700; color: #ffffff; margin-bottom: 6px;">İrem Comfort Deri San. ve Tic.</div>
              <div>📍 ${contactAddress}</div>
              <div style="margin-top: 4px;">📞 Bilgi Hattı: <a href="tel:${contactPhone.replace(/\s+/g, '')}" style="color: #fcd34d; text-decoration: none; font-weight: bold;">${contactPhone}</a> | ✉️ ${contactEmail}</div>
              <div style="margin-top: 16px; pt-12; border-top: 1px solid #334155; font-size: 11px; color: #64748b;">
                Bu e-posta, İrem Comfort e-bülten veya katalog listesine kayıtlı e-posta adresinize gönderilmiştir.
              </div>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
  `.trim();
}

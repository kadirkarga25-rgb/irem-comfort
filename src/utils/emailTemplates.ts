export interface FairTemplateConfig {
  enabled?: boolean;
  name?: string;
  location?: string;
  standNumber?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  posterUrl?: string;
  qrCodeUrl?: string;
  badgeText?: string;
  whatsappContact?: string;
}

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
  fairConfig?: FairTemplateConfig;
}

const FALLBACK_BANNER = 'https://www.iremcomfort.com/images/irem-comfort-logo-full.svg';

const formatDate = (value?: string) => {
  if (!value) return '';
  const parsed = new Date(`${value}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return value;
  return new Intl.DateTimeFormat('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' }).format(parsed);
};

const dateRange = (start?: string, end?: string) => {
  const a = formatDate(start);
  const b = formatDate(end);
  if (a && b) return `${a} – ${b}`;
  return a || b || '';
};

const fairWhatsappUrl = (phone?: string) => {
  const clean = (phone || '').replace(/\D/g, '');
  return clean ? `https://wa.me/${clean}` : 'https://www.iremcomfort.com/#iletisim';
};

export interface EmailTemplateDefinition {
  id: string;
  name: string;
  description: string;
  category: string;
  accent: string;
  defaultSubject: string;
  defaultBadge: string;
  defaultTitle: string;
  defaultSubtitle: string;
  defaultBody: string;
  defaultCtaText: string;
  defaultCtaUrl: string;
  defaultBanner: string;
  defaultSpecialOfferBox?: string;
}

export const EMAIL_TEMPLATES: EmailTemplateDefinition[] = [
  {
    id: 'catalog',
    name: 'Yeni Sezon • Katalog',
    category: 'Koleksiyon',
    accent: 'blue',
    description: 'Yeni sezonu, koleksiyonları ve dijital kataloğu premium bir vitrin düzeninde duyurur.',
    defaultSubject: 'İrem Comfort | 2026–2027 Yeni Sezon Koleksiyonu Yayında',
    defaultBadge: 'YENİ SEZON',
    defaultTitle: 'Mağazanızın yeni comfort koleksiyonu hazır.',
    defaultSubtitle: 'Hakiki deri • Konfor odaklı üretim • Manisa',
    defaultBody: `Değerli Müşterimiz ve İş Ortağımız,\n\nİrem Comfort 2026–2027 yeni sezon koleksiyonumuzu sizlerle buluşturuyoruz. Hakiki deri terlik, sandalet ve comfort modellerimizi mağazanız için tek bir dijital katalogda inceleyebilirsiniz.\n\nYeni modelleri, koleksiyon detaylarını ve üretim yaklaşımımızı keşfetmek için sizi kataloğumuza bekliyoruz.`,
    defaultCtaText: 'Yeni Sezon Kataloğunu Aç',
    defaultCtaUrl: 'https://www.iremcomfort.com/katalog',
    defaultBanner: 'https://images.unsplash.com/photo-1603808033176-9d134e6f2c74?auto=format&fit=crop&q=85&w=1400'
  },
  {
    id: 'fair',
    name: 'Fuar • Davetiye',
    category: 'Fuar',
    accent: 'gold',
    description: 'Fuar modülündeki güncel isim, tarih, salon/stand, konum, açıklama, afiş ve WhatsApp bilgilerini otomatik kullanır.',
    defaultSubject: 'İrem Comfort | Fuar Standımıza Davetlisiniz',
    defaultBadge: 'FUAR DAVETİYESİ',
    defaultTitle: 'Yeni sezonu fuarda birlikte keşfedelim.',
    defaultSubtitle: 'Güncel fuar bilgileri otomatik olarak buraya gelir.',
    defaultBody: `Değerli İş Ortağımız,\n\nİrem Comfort olarak yeni sezon koleksiyonumuzu fuarda sizlerle buluşturuyoruz. Standımızda modellerimizi yakından inceleyebilir, toptan sipariş ve iş birliği detaylarını ekibimizle görüşebilirsiniz.\n\nSizi standımızda ağırlamaktan memnuniyet duyarız.`,
    defaultCtaText: 'Fuar Bilgilerini Gör',
    defaultCtaUrl: 'https://www.iremcomfort.com/#fair',
    defaultBanner: FALLBACK_BANNER
  },
  {
    id: 'wholesale',
    name: 'Toptan • İş Ortaklığı',
    category: 'B2B',
    accent: 'navy',
    description: 'Mağaza sahiplerine yönelik üretici, toptan sipariş ve WhatsApp iletişim odaklı profesyonel duyuru.',
    defaultSubject: 'İrem Comfort | Mağazanız için Toptan Comfort Koleksiyonu',
    defaultBadge: 'TOPTAN İŞ ORTAKLIĞI',
    defaultTitle: 'Üreticiden mağazanıza, düzenli comfort tedariki.',
    defaultSubtitle: 'Manisa merkezli üretim • Mağaza odaklı çalışma',
    defaultBody: `Sayın Mağaza Yetkilisi,\n\nİrem Comfort olarak kadın comfort terlik ve sandalet koleksiyonlarımızı üreticiden doğrudan mağazalara sunuyoruz. Koleksiyon, seri sipariş ve tedarik planlaması hakkında ekibimizden bilgi alabilirsiniz.\n\nSize uygun modelleri birlikte belirlemek için bizimle iletişime geçmeniz yeterli.`,
    defaultCtaText: 'Toptan Bilgi Al',
    defaultCtaUrl: 'https://wa.me/905330297125?text=Merhaba%2C%20toptan%20koleksiyon%20hakkında%20bilgi%20almak%20istiyorum.',
    defaultBanner: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=85&w=1400'
  },
  {
    id: 'collection',
    name: 'Koleksiyon • Vitrin',
    category: 'Ürün',
    accent: 'ivory',
    description: 'Tek bir koleksiyonu veya seçili modelleri sade, ürün odaklı bir vitrin mantığında öne çıkarır.',
    defaultSubject: 'İrem Comfort | Mağazanız için Yeni Modeller',
    defaultBadge: 'KOLEKSİYON SEÇKİSİ',
    defaultTitle: 'Mağazanızın vitrinine yeni modeller.',
    defaultSubtitle: 'Seçili comfort modellerini şimdi inceleyin.',
    defaultBody: `Değerli İş Ortağımız,\n\nBu bültende mağazanız için öne çıkan modellerimizi bir araya getirdik. Ürünleri inceleyerek koleksiyonunuz için uygun modelleri seçebilir, sipariş detayları için bizimle iletişime geçebilirsiniz.`,
    defaultCtaText: 'Modelleri İncele',
    defaultCtaUrl: 'https://www.iremcomfort.com/urunler',
    defaultBanner: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=85&w=1400'
  },
  {
    id: 'announcement',
    name: 'Duyuru • Kurumsal',
    category: 'Duyuru',
    accent: 'slate',
    description: 'Firma duyuruları, çalışma takvimi, önemli bilgilendirmeler ve özel haberler için temiz kurumsal şablon.',
    defaultSubject: 'İrem Comfort | Önemli Duyuru',
    defaultBadge: 'İREM COMFORT DUYURU',
    defaultTitle: 'Sizin için önemli bir gelişmemiz var.',
    defaultSubtitle: 'Güncel bilgilendirmeler ve iş ortaklarımız için notlar.',
    defaultBody: `Değerli Müşterilerimiz ve İş Ortaklarımız,\n\nİrem Comfort ile ilgili önemli gelişmeleri, çalışma takvimimizi veya yeni hizmetlerimizi sizlerle paylaşmak istiyoruz.\n\nSorularınız ve talepleriniz için iletişim kanallarımızdan bize ulaşabilirsiniz.`,
    defaultCtaText: 'İletişime Geç',
    defaultCtaUrl: 'https://www.iremcomfort.com/iletisim',
    defaultBanner: FALLBACK_BANNER
  },
  {
    id: 'custom',
    name: 'Özel • Serbest Şablon',
    category: 'Özel',
    accent: 'dark',
    description: 'Başlık, metin, görsel ve butonları tamamen sizin belirlediğiniz boş ama premium kurumsal temel.',
    defaultSubject: 'İrem Comfort | Yeni Bilgilendirme',
    defaultBadge: 'İREM COMFORT',
    defaultTitle: 'İrem Comfort’tan size özel bir bilgilendirme.',
    defaultSubtitle: 'Hakiki deri comfort ürünleri • Manisa',
    defaultBody: `Değerli Müşterimiz,\n\nBu alanı kendi duyurunuz için özgürce düzenleyebilirsiniz.`,
    defaultCtaText: 'Web Sitesini Ziyaret Et',
    defaultCtaUrl: 'https://www.iremcomfort.com',
    defaultBanner: FALLBACK_BANNER
  }
];

export const getFairTemplateDefaults = (fair: FairTemplateConfig): Partial<EmailTemplateDefinition> => {
  const name = fair.name?.trim() || 'İrem Comfort Fuar Katılımı';
  const location = fair.location?.trim() || 'Fuar bilgileri yönetim panelinden güncellenecek.';
  const stand = fair.standNumber?.trim() || '';
  const dates = dateRange(fair.startDate, fair.endDate);
  const badge = fair.badgeText?.trim() || 'FUAR DAVETİYESİ';
  const description = fair.description?.trim();
  const title = `${name} • Standımıza Davetlisiniz`;
  const subtitleParts = [location, stand, dates].filter(Boolean);
  const whatsapp = fairWhatsappUrl(fair.whatsappContact);

  return {
    defaultSubject: `İrem Comfort | ${name} - Standımıza Davetlisiniz`,
    defaultBadge: badge,
    defaultTitle: title,
    defaultSubtitle: subtitleParts.join(' • '),
    defaultBody: `Değerli İş Ortağımız,\n\nİrem Comfort olarak ${name} kapsamında sizleri standımıza davet ediyoruz.\n\n${description || 'Yeni sezon koleksiyonumuzu yakından inceleyebilir, modellerimiz ve toptan iş birliği seçeneklerimiz hakkında ekibimizden bilgi alabilirsiniz.'}\n\nSizi standımızda ağırlamaktan memnuniyet duyarız.`,
    defaultCtaText: 'Fuar Detayları & Standımız',
    defaultCtaUrl: 'https://www.iremcomfort.com/#fair',
    defaultBanner: fair.posterUrl?.trim() || FALLBACK_BANNER,
    defaultSpecialOfferBox: [
      dates ? `📅 ${dates}` : '',
      location ? `📍 ${location}` : '',
      stand ? `📌 ${stand}` : ''
    ].filter(Boolean).join('   •   '),
    fairConfig: fair as any,
    whatsappUrl: whatsapp
  } as any;
};

export const getEmailTemplateDefaults = (tplId: string, fair?: FairTemplateConfig) => {
  const tpl = EMAIL_TEMPLATES.find(t => t.id === tplId) || EMAIL_TEMPLATES[0];
  if (tpl.id !== 'fair' || !fair) return tpl;
  return { ...tpl, ...getFairTemplateDefaults(fair) };
};

const escapeHtml = (value: string = '') => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;');

export function renderEmailHtml(params: EmailTemplateParams): string {
  const {
    title,
    subtitle,
    bodyText,
    ctaText,
    ctaUrl,
    bannerImage,
    badgeText,
    standInfo,
    contactPhone = '0533 029 71 25',
    contactEmail = 'info@iremcomfort.com',
    contactAddress = 'Manisa Ayakkabıcılar Sitesi 5757.Sk No:21/A Yunusemre/Manisa',
    specialOfferBox,
    fairConfig
  } = params;

  const paragraphsHtml = bodyText
    .split('\n\n')
    .map(p => p.trim())
    .filter(Boolean)
    .map(p => `<p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#334155;">${escapeHtml(p).replace(/\n/g, '<br/>')}</p>`)
    .join('');

  const fairDates = dateRange(fairConfig?.startDate, fairConfig?.endDate);
  const fairWhatsapp = fairWhatsappUrl(fairConfig?.whatsappContact);
  const hasFairDetails = Boolean(fairConfig && (fairConfig.name || fairConfig.location || fairConfig.standNumber || fairDates));
  const heroImage = bannerImage || FALLBACK_BANNER;

  return `
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background:#eef2f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;color:#0f172a;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#eef2f6;padding:22px 10px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:680px;background:#fff;border:1px solid #e2e8f0;border-radius:22px;overflow:hidden;">
        <tr>
          <td style="background:#082C6C;padding:22px 28px 20px;text-align:center;">
            <div style="font-family:Georgia,serif;font-size:23px;line-height:1;font-weight:800;letter-spacing:2px;color:#fff;">İREM COMFORT</div>
            <div style="margin-top:8px;font-size:10px;letter-spacing:2px;color:#f3c969;font-weight:800;">HAKİKİ DERİ • COMFORT • MANİSA</div>
          </td>
        </tr>
        <tr><td><img src="${heroImage}" alt="${escapeHtml(title)}" style="display:block;width:100%;height:260px;object-fit:cover;background:#f8fafc;" /></td></tr>
        <tr><td style="padding:34px 34px 28px;">
          ${badgeText ? `<div style="display:inline-block;padding:7px 11px;border-radius:999px;background:#f7ecd1;color:#72520b;border:1px solid #e7cf91;font-size:10px;font-weight:900;letter-spacing:1.2px;">${escapeHtml(badgeText)}</div>` : ''}
          <h1 style="margin:16px 0 9px;font-size:29px;line-height:1.18;color:#082C6C;font-weight:850;">${escapeHtml(title)}</h1>
          ${subtitle ? `<div style="font-size:14px;line-height:1.6;color:#64748b;font-weight:650;">${escapeHtml(subtitle)}</div>` : ''}
          <div style="height:1px;background:#e8edf3;margin:25px 0 24px;"></div>
          ${paragraphsHtml}

          ${hasFairDetails ? `
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:24px 0;background:#f8fafc;border:1px solid #e2e8f0;border-radius:16px;">
            <tr><td style="padding:18px 18px 14px;">
              <div style="font-size:10px;letter-spacing:1.5px;color:#9a741d;font-weight:900;margin-bottom:8px;">FUAR BİLGİLERİ</div>
              ${fairConfig?.name ? `<div style="font-size:17px;font-weight:850;color:#082C6C;margin-bottom:8px;">${escapeHtml(fairConfig.name)}</div>` : ''}
              ${fairDates ? `<div style="font-size:13px;color:#334155;margin-top:5px;">📅 <strong>${escapeHtml(fairDates)}</strong></div>` : ''}
              ${fairConfig?.location ? `<div style="font-size:13px;color:#334155;margin-top:5px;">📍 ${escapeHtml(fairConfig.location)}</div>` : ''}
              ${fairConfig?.standNumber ? `<div style="font-size:13px;color:#334155;margin-top:5px;">📌 <strong>${escapeHtml(fairConfig.standNumber)}</strong></div>` : ''}
              ${fairConfig?.whatsappContact ? `<div style="font-size:13px;color:#334155;margin-top:5px;">💬 WhatsApp: ${escapeHtml(fairConfig.whatsappContact)}</div>` : ''}
              ${fairConfig?.qrCodeUrl ? `<div style="margin-top:14px;text-align:center;"><img src="${escapeHtml(fairConfig.qrCodeUrl)}" alt="Fuar WhatsApp QR" width=120 height=120 style="display:inline-block;width:120px;height:120px;object-fit:contain;background:#fff;padding:6px;border:1px solid #e2e8f0;border-radius:12px;" /><div style="font-size:10px;color:#64748b;margin-top:5px;">WhatsApp / Fuar Bilgi QR</div></div>` : ''}
            </td></tr>
          </table>` : ''}

          ${specialOfferBox ? `<div style="margin:22px 0;padding:15px 17px;background:#fff9eb;border:1px solid #ead39b;border-left:4px solid #b58a2b;border-radius:12px;font-size:13px;line-height:1.6;color:#62480c;font-weight:750;">${escapeHtml(specialOfferBox)}</div>` : ''}

          ${ctaText && ctaUrl ? `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:28px 0 4px;"><tr><td align="center"><a href="${escapeHtml(ctaUrl)}" target="_blank" style="display:inline-block;background:#082C6C;color:#fff;text-decoration:none;padding:15px 28px;border-radius:12px;font-size:14px;font-weight:850;letter-spacing:.2px;">${escapeHtml(ctaText)} &nbsp;→</a></td></tr></table>` : ''}
          ${fairConfig?.whatsappContact ? `<div style="text-align:center;margin-top:14px;"><a href="${fairWhatsapp}" target="_blank" style="font-size:12px;color:#082C6C;text-decoration:none;font-weight:750;">WhatsApp ile bilgi al →</a></div>` : ''}
        </td></tr>
        <tr><td style="background:#0b1728;padding:25px 28px;text-align:center;color:#9eacbd;font-size:11px;line-height:1.7;">
          <div style="font-size:13px;color:#fff;font-weight:800;margin-bottom:5px;">İrem Comfort</div>
          <div>📍 ${escapeHtml(contactAddress)}</div>
          <div style="margin-top:4px;">📞 ${escapeHtml(contactPhone)} &nbsp;•&nbsp; ✉️ ${escapeHtml(contactEmail)}</div>
          ${standInfo ? `<div style="margin-top:9px;color:#d8b56a;font-weight:700;">${escapeHtml(standInfo)}</div>` : ''}
          <div style="margin-top:15px;padding-top:12px;border-top:1px solid #263447;color:#66758a;">Bu e-posta İrem Comfort haber bülteni listenizde kayıtlı adresinize gönderilmiştir.</div>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`.trim();
}

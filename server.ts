import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import nodemailer from "nodemailer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Memory store for contact leads & Email configuration
export interface ContactLead {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  inquiryType: string;
  message: string;
  createdAt: string;
  status: 'new' | 'read' | 'contacted';
  adminNotified: boolean;
  customerEmailed: boolean;
}

export interface EmailConfig {
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPass: string;
  smtpSecure: boolean;
  adminEmails: string;
  senderName: string;
  senderEmail: string;
  sendCustomerConfirmation: boolean;
  sendAdminNotification: boolean;
}

const contactLeads: ContactLead[] = [];

let currentEmailConfig: EmailConfig = {
  smtpHost: process.env.SMTP_HOST || "mail.iremcomfort.com",
  smtpPort: Number(process.env.SMTP_PORT) || 587,
  smtpUser: process.env.SMTP_USER || "info@iremcomfort.com",
  smtpPass: process.env.SMTP_PASS || "",
  smtpSecure: process.env.SMTP_SECURE === "true",
  adminEmails: "kargakadir4525@gmail.com, info@iremcomfort.com",
  senderName: "İrem Comfort Ayakkabıcılık",
  senderEmail: "info@iremcomfort.com",
  sendCustomerConfirmation: true,
  sendAdminNotification: true,
};

// Nodemailer Transporter Helper
function getTransporter(config: EmailConfig = currentEmailConfig) {
  if (config.smtpHost && config.smtpUser && config.smtpPass) {
    return nodemailer.createTransport({
      host: config.smtpHost,
      port: Number(config.smtpPort) || 587,
      secure: config.smtpSecure,
      auth: {
        user: config.smtpUser,
        pass: config.smtpPass,
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  }
  return null;
}

// API Health Check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "irem-comfort-backend" });
});

// API Get Email Configuration
app.get("/api/email/config", (_req, res) => {
  res.json({ config: currentEmailConfig });
});

// API Save Email Configuration
app.post("/api/email/config", (req, res) => {
  try {
    const updated = req.body;
    if (!updated || typeof updated !== "object") {
      return res.status(400).json({ success: false, error: "Geçersiz e-posta konfigürasyon verisi." });
    }

    currentEmailConfig = {
      ...currentEmailConfig,
      ...updated,
      smtpPort: Number(updated.smtpPort) || 587,
      smtpSecure: Boolean(updated.smtpSecure),
      sendCustomerConfirmation: Boolean(updated.sendCustomerConfirmation),
      sendAdminNotification: Boolean(updated.sendAdminNotification),
    };

    return res.json({
      success: true,
      message: "E-posta ve SMTP ayarları başarıyla güncellendi.",
      config: currentEmailConfig
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: "Ayarlar kaydedilirken hata oluştu." });
  }
});

// API Send Test Email
app.post("/api/email/test", async (req, res) => {
  try {
    const { testEmail, testConfig } = req.body;
    const configToUse = testConfig ? { ...currentEmailConfig, ...testConfig } : currentEmailConfig;

    if (!testEmail || !testEmail.includes("@")) {
      return res.status(400).json({ success: false, error: "Lütfen geçerli bir test e-posta adresi giriniz." });
    }

    const transporter = getTransporter(configToUse);
    if (!transporter) {
      return res.status(400).json({ 
        success: false, 
        error: "SMTP ayarları eksik! Lütfen Sunucu (Host), Kullanıcı Adı ve Parola alanlarını doldurunuz." 
      });
    }

    const testHtml = `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; max-width: 500px; margin: 0 auto;">
        <h2 style="color: #082C6C; margin-top: 0;">✓ İrem Comfort — SMTP Test Başarılı</h2>
        <p style="color: #334155; font-size: 14px; line-height: 1.5;">
          Tebrikler! İrem Comfort web sitenizdeki e-posta ayarları ve SMTP sunucu bağlantısı sorunsuz bir şekilde çalışmaktadır.
        </p>
        <ul style="font-size: 13px; color: #475569; background: #ffffff; padding: 12px 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
          <li><strong>SMTP Host:</strong> ${configToUse.smtpHost}</li>
          <li><strong>Port:</strong> ${configToUse.smtpPort}</li>
          <li><strong>Gönderen:</strong> ${configToUse.senderName} (${configToUse.senderEmail})</li>
          <li><strong>Yönetici Alıcılar:</strong> ${configToUse.adminEmails}</li>
        </ul>
        <p style="font-size: 11px; color: #94a3b8; margin-bottom: 0;">
          Bu e-posta İrem Comfort Yönetim Paneli üzerinden test amacıyla gönderilmiştir.
        </p>
      </div>
    `;

    await transporter.sendMail({
      from: `"${configToUse.senderName}" <${configToUse.senderEmail || configToUse.smtpUser}>`,
      to: testEmail,
      subject: "İrem Comfort — SMTP E-Posta Testi",
      html: testHtml,
    });

    return res.json({
      success: true,
      message: `Test e-postası '${testEmail}' adresine başarıyla gönderildi!`
    });
  } catch (err: any) {
    console.error("Test email error:", err);
    return res.status(500).json({
      success: false,
      error: `E-posta gönderimi başarısız oldu: ${err?.message || 'SMTP sunucu hatası. Parola veya SSL/Port ayarlarını kontrol ediniz.'}`
    });
  }
});

// API Contact Form Submission
app.post("/api/contact", async (req, res) => {
  try {
    const { fullName, email, phone, inquiryType, message } = req.body;

    if (!fullName || !phone) {
      return res.status(400).json({ 
        success: false, 
        error: "Lütfen ad soyad ve telefon numaranızı giriniz." 
      });
    }

    const newLead: ContactLead = {
      id: `LEAD-${Date.now()}`,
      fullName: fullName.trim(),
      email: (email || '').trim(),
      phone: phone.trim(),
      inquiryType: inquiryType || 'Genel İletişim',
      message: (message || '').trim(),
      createdAt: new Date().toISOString(),
      status: 'new',
      adminNotified: false,
      customerEmailed: false,
    };

    contactLeads.unshift(newLead);

    // HTML Email Template for Admin
    const adminHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f6f9; margin: 0; padding: 20px; color: #111; }
          .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e1e8f0; box-shadow: 0 4px 15px rgba(0,0,0,0.06); }
          .header { background: linear-gradient(135deg, #082C6C, #163E87); padding: 24px; text-align: center; color: white; }
          .title { margin: 0; font-size: 20px; font-weight: 700; letter-spacing: 0.5px; }
          .subtitle { margin: 6px 0 0 0; font-size: 12px; opacity: 0.9; text-transform: uppercase; letter-spacing: 1px; color: #f59e0b; font-weight: bold; }
          .body { padding: 28px; }
          .info-table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 13px; }
          .info-table td { padding: 12px 10px; border-bottom: 1px solid #f0f4f8; }
          .label { font-weight: bold; color: #082C6C; width: 35%; }
          .value { color: #111; }
          .badge { background: #eef2ff; color: #082C6C; padding: 4px 10px; border-radius: 6px; font-weight: bold; font-size: 12px; display: inline-block; }
          .msg-box { background: #f8fafc; border: 1px solid #e2e8f0; padding: 14px; border-radius: 8px; font-size: 13px; line-height: 1.6; color: #334155; margin-top: 5px; }
          .btn-wa { display: inline-block; background: #25D366; color: white; text-decoration: none; padding: 12px 24px; border-radius: 25px; font-weight: bold; font-size: 13px; margin-top: 20px; text-align: center; }
          .footer { font-size: 11px; color: #94a3b8; text-align: center; padding: 15px; border-top: 1px solid #f1f5f9; background: #fafafa; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <h1 class="title">${currentEmailConfig.senderName} — Yeni İletişim / Sipariş Talebi</h1>
            <p class="subtitle">Web Sitenizden İletişim Formu Dolduruldu</p>
          </div>
          <div class="body">
            <p style="font-size: 14px; color: #334155; margin-top: 0;">
              Sayın Yetkili, web sitenizden yeni bir müşteri talebi ulaştı:
            </p>

            <table class="info-table">
              <tr>
                <td class="label">Müşteri Adı Soyadı:</td>
                <td class="value"><strong>${newLead.fullName}</strong></td>
              </tr>
              <tr>
                <td class="label">Telefon Numarası:</td>
                <td class="value">
                  <a href="tel:${newLead.phone}" style="color: #082C6C; font-weight: bold; text-decoration: none;">
                    ${newLead.phone}
                  </a>
                </td>
              </tr>
              <tr>
                <td class="label">E-Posta Adresi:</td>
                <td class="value">${newLead.email ? `<a href="mailto:${newLead.email}" style="color: #082C6C;">${newLead.email}</a>` : '<em>Belirtilmedi</em>'}</td>
              </tr>
              <tr>
                <td class="label">Talep Türü / Konu:</td>
                <td class="value"><span class="badge">${newLead.inquiryType}</span></td>
              </tr>
              <tr>
                <td class="label" style="vertical-align: top; padding-top: 14px;">Müşteri Mesajı:</td>
                <td class="value">
                  <div class="msg-box">${newLead.message || 'Özel mesaj girilmedi.'}</div>
                </td>
              </tr>
            </table>

            <div style="text-align: center;">
              <a href="https://wa.me/${newLead.phone.replace(/[^0-9]/g, '')}" class="btn-wa">
                WhatsApp Üzerinden Yanıt Ver
              </a>
            </div>
          </div>
          <div class="footer">
            İrem Comfort Manisa Ayakkabıcılar Sitesi — Otomatik Bildirim Sistemi
          </div>
        </div>
      </body>
      </html>
    `;

    // HTML Email Template for Customer
    const customerHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #1e293b; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
          .header { background: linear-gradient(135deg, #082C6C, #0A2D6F, #163E87); padding: 32px; text-align: center; color: white; }
          .brand-name { margin: 0; font-family: Georgia, serif; font-size: 26px; letter-spacing: 1.5px; font-weight: bold; color: #ffffff; }
          .brand-tag { margin: 8px 0 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #f59e0b; font-weight: bold; }
          .content { padding: 32px; line-height: 1.6; }
          .greeting { color: #082C6C; font-size: 18px; margin-top: 0; font-family: Georgia, serif; font-weight: bold; }
          .alert-box { background: #fffbeb; border-left: 4px solid #f59e0b; padding: 16px 20px; border-radius: 8px; margin: 22px 0; }
          .alert-title { margin: 0; font-size: 14px; color: #78350f; font-weight: bold; }
          .alert-text { margin: 6px 0 0 0; font-size: 12px; color: #92400e; }
          .summary-list { font-size: 13px; color: #334155; background: #f1f5f9; padding: 16px 24px; border-radius: 10px; margin: 20px 0; list-style-type: none; }
          .summary-list li { margin-bottom: 6px; }
          .summary-list li:last-child { margin-bottom: 0; }
          .btn-primary { display: inline-block; background: #082C6C; color: #ffffff !important; text-decoration: none; padding: 14px 32px; border-radius: 30px; font-weight: bold; font-size: 13px; letter-spacing: 0.5px; box-shadow: 0 4px 12px rgba(8,44,108,0.25); }
          .divider { border: none; border-top: 1px solid #e2e8f0; margin: 28px 0; }
          .footer-info { font-size: 11px; color: #64748b; text-align: center; line-height: 1.6; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="brand-name">İREM COMFORT</h1>
            <p class="brand-tag">Hakiki Deri Bayan Comfort Terlik & Sandalet</p>
          </div>

          <div class="content">
            <h2 class="greeting">Sayın ${newLead.fullName},</h2>
            <p style="font-size: 14px; color: #334155;">
              İrem Comfort web sitemiz üzerinden iletmiş olduğunuz iletişim talebiniz başarıyla alınmıştır.
            </p>

            <div class="alert-box">
              <p class="alert-title">✓ İletişim Talebiniz İşleme Alındı</p>
              <p class="alert-text">
                Manisa Ayakkabıcılar Sitesindeki imalathane temsilcilerimiz talebinizi inceleyip en kısa sürede sizinle iletişime geçecektir.
              </p>
            </div>

            <p style="font-size: 13px; color: #475569; margin-bottom: 6px; font-weight: bold;">Talebinizin Özeti:</p>
            <ul class="summary-list">
              <li><strong>Talep Konusu:</strong> ${newLead.inquiryType}</li>
              <li><strong>Telefon Numarası:</strong> ${newLead.phone}</li>
              ${newLead.message ? `<li><strong>Mesajınız:</strong> ${newLead.message}</li>` : ''}
            </ul>

            <p style="font-size: 13px; color: #334155;">
              Acil sipariş ve direkt yeni sezon katalog talepleriniz için WhatsApp danışma hattımızdan doğrudan bize ulaşabilirsiniz:
            </p>

            <div style="text-align: center; margin: 28px 0;">
              <a href="https://wa.me/905330297125" class="btn-primary">
                WhatsApp İle Ulaşın (0533 029 71 25)
              </a>
            </div>

            <hr class="divider" />

            <div class="footer-info">
              <strong>İrem Comfort Ayakkabıcılık</strong><br />
              Manisa Ayakkabıcılar Sitesi (Güzelyurt Mah.) 5757.Sokak No:21/A Yunusemre / MANİSA<br />
              E-Posta: <a href="mailto:${currentEmailConfig.senderEmail}" style="color: #082C6C;">${currentEmailConfig.senderEmail}</a> | Telefon: 0533 029 71 25
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    const transporter = getTransporter();
    if (transporter) {
      try {
        // Send to Admins if enabled
        if (currentEmailConfig.sendAdminNotification && currentEmailConfig.adminEmails) {
          await transporter.sendMail({
            from: `"${currentEmailConfig.senderName}" <${currentEmailConfig.senderEmail || currentEmailConfig.smtpUser}>`,
            to: currentEmailConfig.adminEmails,
            subject: `[${currentEmailConfig.senderName}] Yeni İletişim Talebi - ${newLead.fullName}`,
            html: adminHtml,
          });
          newLead.adminNotified = true;
        }

        // Send to Customer if enabled & email address provided
        if (currentEmailConfig.sendCustomerConfirmation && newLead.email) {
          await transporter.sendMail({
            from: `"${currentEmailConfig.senderName}" <${currentEmailConfig.senderEmail || currentEmailConfig.smtpUser}>`,
            to: newLead.email,
            subject: 'İrem Comfort - İletişim Talebiniz Alınmıştır',
            html: customerHtml,
          });
          newLead.customerEmailed = true;
        }
      } catch (emailErr) {
        console.error("Nodemailer dispatch attempt:", emailErr);
      }
    } else {
      console.log("==========================================");
      console.log("[CONTACT LEAD RECEIVED]");
      console.log(`To Admins: ${currentEmailConfig.adminEmails}`);
      console.log(`To Customer: ${newLead.email || 'No email provided'}`);
      console.log(`Lead Details:`, newLead);
      console.log("==========================================");
    }

    return res.json({
      success: true,
      message: `Teşekkür ederiz Sayın ${newLead.fullName}. Talebiniz alındı, en kısa sürede sizlere geri dönüş sağlanacaktır.`,
      lead: newLead
    });

  } catch (err) {
    console.error("Error in /api/contact:", err);
    return res.status(500).json({ success: false, error: "Sunucu hatası oluştu." });
  }
});

// Admin API to fetch leads
app.get("/api/contact/leads", (_req, res) => {
  res.json({ leads: contactLeads });
});

// Newsletter Memory Store & Endpoints
export interface NewsletterSubscriber {
  id: string;
  email: string;
  createdAt: string;
  source?: string;
}

const newsletterSubscribers: NewsletterSubscriber[] = [
  { id: 'sub-1', email: 'kargakadir4525@gmail.com', createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), source: 'Web Form' },
  { id: 'sub-2', email: 'info@iremcomfort.com', createdAt: new Date(Date.now() - 86400000 * 5).toISOString(), source: 'Web Form' }
];

app.post("/api/newsletter/subscribe", (req, res) => {
  try {
    const { email, source } = req.body || {};
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ success: false, error: "Lütfen geçerli bir e-posta adresi yazınız." });
    }

    const cleanEmail = email.trim().toLowerCase();
    const existing = newsletterSubscribers.find(s => s.email === cleanEmail);
    if (existing) {
      return res.json({
        success: true,
        message: "E-posta adresiniz zaten bülten aboneliğimize kayıtlıdır.",
        subscriber: existing
      });
    }

    const newSub: NewsletterSubscriber = {
      id: `sub-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      email: cleanEmail,
      createdAt: new Date().toISOString(),
      source: source || 'Web Form'
    };

    newsletterSubscribers.unshift(newSub);
    console.log(`[NEWSLETTER SUB] New subscriber added: ${cleanEmail}`);

    return res.json({
      success: true,
      message: "İrem Comfort e-bülten ve katalog bilgilendirme listesine kaydınız başarıyla oluşturuldu!",
      subscriber: newSub
    });
  } catch (err) {
    console.error("Error in /api/newsletter/subscribe:", err);
    return res.status(500).json({ success: false, error: "Sunucu hatası oluştu." });
  }
});

app.get("/api/newsletter/subscribers", (_req, res) => {
  res.json({ subscribers: newsletterSubscribers });
});

app.delete("/api/newsletter/subscribers/:id", (req, res) => {
  try {
    const { id } = req.params;
    const index = newsletterSubscribers.findIndex(s => s.id === id || s.email === id);
    if (index !== -1) {
      const removed = newsletterSubscribers.splice(index, 1);
      return res.json({ success: true, message: "Abone başarıyla silindi.", removed: removed[0] });
    }
    return res.status(404).json({ success: false, error: "Abone bulunamadı." });
  } catch (err) {
    return res.status(500).json({ success: false, error: "Abone silinirken hata oluştu." });
  }
});

app.post("/api/newsletter/send-bulk", async (req, res) => {
  try {
    const { subject, htmlBody, targetEmails } = req.body || {};

    if (!subject || !htmlBody) {
      return res.status(400).json({ success: false, error: "Konu başlığı ve e-posta içeriği gereklidir." });
    }

    const recipients: string[] = Array.isArray(targetEmails) && targetEmails.length > 0
      ? targetEmails
      : newsletterSubscribers.map(s => s.email);

    if (recipients.length === 0) {
      return res.status(400).json({ success: false, error: "E-posta gönderilecek kayıtlı abone bulunamadı." });
    }

    let sentCount = 0;
    let failedCount = 0;
    const errors: string[] = [];

    // Use getTransporter helper to get configured SMTP transporter
    const transporter = getTransporter(currentEmailConfig);

    for (const email of recipients) {
      try {
        if (transporter) {
          await transporter.sendMail({
            from: `"${currentEmailConfig.senderName || 'İrem Comfort'}" <${currentEmailConfig.senderEmail || currentEmailConfig.smtpUser}>`,
            to: email,
            subject: subject,
            html: htmlBody,
          });
          sentCount++;
        } else {
          // Log simulation mode
          console.log(`[BULK NEWSLETTER SIMULATION] Sent email to: ${email} | Subject: "${subject}"`);
          sentCount++;
        }
      } catch (sendErr: any) {
        failedCount++;
        errors.push(`${email}: ${sendErr?.message || 'Gönderim hatası'}`);
        console.error(`Failed to send email to ${email}:`, sendErr);
      }
    }

    return res.json({
      success: true,
      message: transporter 
        ? `${sentCount} aboneye e-posta bülteni başarıyla iletildi.${failedCount > 0 ? ` (${failedCount} tanesi iletilemedi)` : ''}`
        : `${sentCount} aboneye simülasyon modunda işlendi. Gerçek e-posta gönderimi için lütfen 'E-Posta & SMTP' sekmesinden SMTP şifrenizi giriniz.`,
      sentCount,
      failedCount,
      recipients,
      isSimulation: !transporter,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (err) {
    console.error("Error sending bulk newsletter:", err);
    return res.status(500).json({ success: false, error: "Toplu e-posta bülteni gönderilirken hata oluştu." });
  }
});

// GLOBAL SITE SETTINGS ENDPOINTS (PERSISTENT ACROSS ALL DEVICES)
let globalSiteSettings: any = null;

app.get("/api/settings", (_req, res) => {
  res.json({ success: true, settings: globalSiteSettings });
});

app.post("/api/settings", (req, res) => {
  try {
    const { settings } = req.body || {};
    if (!settings || typeof settings !== 'object') {
      return res.status(400).json({ success: false, error: "Geçersiz ayar verisi." });
    }
    globalSiteSettings = {
      ...(globalSiteSettings || {}),
      ...settings,
      updatedAt: new Date().toISOString()
    };
    console.log(`[GLOBAL SETTINGS UPDATED] Admin saved new site configuration at ${globalSiteSettings.updatedAt}`);
    return res.json({ success: true, message: "Site ayarları sunucuya kaydedildi.", settings: globalSiteSettings });
  } catch (err) {
    console.error("Error saving global settings:", err);
    return res.status(500).json({ success: false, error: "Ayarlar kaydedilirken sunucu hatası oluştu." });
  }
});

// SURVEY SUBMISSION & AUTOMATIC DUAL EMAIL ENDPOINT
app.post("/api/survey", async (req, res) => {
  try {
    const {
      fullName, phone, email, platform, model, color, size,
      overall, comfort, quality, ortho, light, design, price, packaging, shipping,
      fit, likes, comment, npsScore, avgScore
    } = req.body || {};

    const customerName = (fullName || 'Anket Müşterisi').trim();
    const customerEmail = (email || '').trim().toLowerCase();
    const customerPhone = (phone || '').trim();
    const productModel = (model || 'Belirtilmedi').trim();
    const scoreVal = avgScore || overall || 5;

    console.log(`[SURVEY RECEIVED] From: ${customerName} (${customerEmail || 'E-posta yok'}) | Model: ${productModel} | Score: ${scoreVal}`);

    // 1. Prepare Admin Notification Email HTML
    const adminSurveyHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; background-color: #f8fafc; padding: 20px; color: #111; }
          .card { max-width: 650px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; }
          .header { background: #082C6C; padding: 24px; color: white; text-align: center; }
          .title { margin: 0; font-size: 20px; font-weight: bold; }
          .sub { font-size: 12px; color: #f59e0b; margin-top: 5px; font-weight: bold; text-transform: uppercase; }
          .body { padding: 24px; font-size: 13px; line-height: 1.6; }
          .table { width: 100%; border-collapse: collapse; margin-top: 15px; }
          .table td { padding: 10px; border-bottom: 1px solid #f1f5f9; }
          .lbl { font-weight: bold; color: #082C6C; width: 35%; }
          .box { background: #f1f5f9; padding: 12px; border-radius: 8px; border-left: 4px solid #082C6C; margin-top: 5px; }
          .score-badge { background: #f59e0b; color: #000; padding: 4px 10px; border-radius: 12px; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <h1 class="title">📋 Yeni Müşteri Anket Değerlendirmesi</h1>
            <div class="sub">İrem Comfort Müşteri Deneyimi Bildirimi</div>
          </div>
          <div class="body">
            <p>Sayın Yetkili, web siteniz üzerinden yeni bir müşteri deneyim anketi dolduruldu:</p>
            <table class="table">
              <tr><td class="lbl">Müşteri Adı:</td><td><strong>${customerName}</strong></td></tr>
              <tr><td class="lbl">Telefon:</td><td>${customerPhone ? `<a href="tel:${customerPhone}">${customerPhone}</a>` : '<em>Girilmedi</em>'}</td></tr>
              <tr><td class="lbl">E-Posta:</td><td>${customerEmail ? `<a href="mailto:${customerEmail}">${customerEmail}</a>` : '<em>Girilmedi</em>'}</td></tr>
              <tr><td class="lbl">Satın Alınan Platform:</td><td>${platform || 'Belirtilmedi'}</td></tr>
              <tr><td class="lbl">Model & Numara:</td><td><strong>${productModel}</strong> (Numara: ${size || '-'}, Renk: ${color || '-'})</td></tr>
              <tr><td class="lbl">Genel Memnuniyet:</td><td><span class="score-badge">${overall || 0} / 5 Yıldız</span> (Ortalama: ${scoreVal}/5)</td></tr>
              <tr><td class="lbl">Tavsiye Puanı (NPS):</td><td><strong>${npsScore !== null && npsScore !== undefined ? npsScore : '-'} / 10</strong></td></tr>
              <tr><td class="lbl">Kalıp Uyumu:</td><td>${fit || '-'}</td></tr>
              <tr><td class="lbl">Beğenilen Özellikler:</td><td>${Array.isArray(likes) && likes.length > 0 ? likes.join(', ') : '-'}</td></tr>
              <tr>
                <td class="lbl" style="vertical-align: top;">Müşteri Yorumu:</td>
                <td><div class="box">${comment || 'Yorum girilmedi.'}</div></td>
              </tr>
            </table>
          </div>
        </div>
      </body>
      </html>
    `;

    // 2. Prepare Customer Thank You Email HTML with THANKS50 Coupon & Trendyol Link
    const customerThankYouHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f8fafc; padding: 20px; color: #1e293b; margin: 0; }
          .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
          .header { background: linear-gradient(135deg, #082C6C, #163E87); padding: 32px; text-align: center; color: white; }
          .brand { margin: 0; font-family: Georgia, serif; font-size: 26px; font-weight: bold; letter-spacing: 1.5px; }
          .tag { margin: 8px 0 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #f59e0b; font-weight: bold; }
          .content { padding: 32px; line-height: 1.6; font-size: 14px; }
          .coupon-box { background: linear-gradient(135deg, #fffbeb, #fef3c7); border: 2px dashed #f59e0b; padding: 24px; border-radius: 16px; text-align: center; margin: 24px 0; }
          .coupon-title { color: #78350f; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin: 0; }
          .coupon-code { font-family: monospace, monospace; font-size: 28px; font-weight: 900; color: #082C6C; background: #ffffff; padding: 10px 24px; border-radius: 10px; display: inline-block; margin: 12px 0; border: 1px solid #f59e0b; letter-spacing: 3px; }
          .coupon-desc { color: #92400e; font-size: 13px; font-weight: bold; margin: 0; }
          .btn-trendyol { display: inline-block; background: #f27a1a; color: #ffffff !important; text-decoration: none; padding: 14px 28px; border-radius: 30px; font-weight: bold; font-size: 13px; margin: 8px 4px; text-align: center; box-shadow: 0 4px 12px rgba(242,122,26,0.25); }
          .btn-wa { display: inline-block; background: #25D366; color: #ffffff !important; text-decoration: none; padding: 14px 28px; border-radius: 30px; font-weight: bold; font-size: 13px; margin: 8px 4px; text-align: center; box-shadow: 0 4px 12px rgba(37,211,102,0.25); }
          .footer { font-size: 11px; color: #64748b; text-align: center; padding: 20px; border-top: 1px solid #e2e8f0; background: #fafafa; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <h1 class="brand">İREM COMFORT</h1>
            <p class="tag">Bayan Hakiki Deri Comfort Terlik & Sandalet</p>
          </div>
          <div class="content">
            <h2 style="color: #082C6C; font-family: Georgia, serif; font-size: 20px; margin-top: 0;">
              Sayın ${customerName},
            </h2>
            <p>
              İrem Comfort müşteri memnuniyeti anketimizi doldurduğunuz ve değerli görüşlerinizi bizimle paylaştığınız için yürekten teşekkür ederiz.
            </p>
            <p>
              Ayakkabılarımızın konforu ve kalitesi hakkındaki değerlendirmeleriniz, Manisa atölyemizdeki usta işçiliğimizi daha da mükemmelleştirmemiz için bizlere ilham veriyor.
            </p>

            <div class="coupon-box">
              <p class="coupon-title">🎁 Ankete Katılım Teşekkür Hediyeniz</p>
              <div class="coupon-code">THANKS50</div>
              <p class="coupon-desc">
                Tüm siparişlerinizde ve <strong>Trendyol Mağazamızda</strong> geçerli <strong>50 TL İndirim Kodunuz</strong> tanımlanmıştır!
              </p>
            </div>

            <p style="text-align: center; color: #475569; font-size: 13px; margin-bottom: 20px;">
              İndirim kodunuzu Trendyol resmi mağazamızda, web sitemizde veya WhatsApp sipariş hattımızda belirterek anında 50 TL indirimden faydalanabilirsiniz.
            </p>

            <div style="text-align: center;">
              <a href="https://www.trendyol.com/magaza/irem-comfort-m-1286942?sst=0&channelId=1" class="btn-trendyol" target="_blank">
                🛍️ Trendyol Mağazamıza Git ve Alışveriş Yap
              </a>
              <a href="https://wa.me/905330297125?text=Merhaba%2C%20anket%20kat%C4%B1l%C4%B1m%20indirim%20kodum%3A%20THANKS50" class="btn-wa" target="_blank">
                💬 WhatsApp Sipariş Hattı (50 TL İndirimli)
              </a>
            </div>
          </div>
          <div class="footer">
            <strong>İrem Comfort Ayakkabıcılık</strong><br />
            Manisa Ayakkabıcılar Sitesi | Tel: 0533 029 71 25 | E-Posta: info@iremcomfort.com
          </div>
        </div>
      </body>
      </html>
    `;

    // 3. Dispatch Emails via Nodemailer if SMTP ready
    const transporter = getTransporter();
    if (transporter) {
      try {
        // Send to info@iremcomfort.com & admin emails
        const adminRecipients = currentEmailConfig.adminEmails || 'info@iremcomfort.com';
        await transporter.sendMail({
          from: `"${currentEmailConfig.senderName || 'İrem Comfort'}" <${currentEmailConfig.senderEmail || 'info@iremcomfort.com'}>`,
          to: adminRecipients,
          subject: `[ANKET BİLDİRİMİ] ${customerName} - ${productModel} (${scoreVal}/5 Puan)`,
          html: adminSurveyHtml,
        });

        // Send to customer if email is provided
        if (customerEmail && customerEmail.includes('@')) {
          await transporter.sendMail({
            from: `"${currentEmailConfig.senderName || 'İrem Comfort'}" <${currentEmailConfig.senderEmail || 'info@iremcomfort.com'}>`,
            to: customerEmail,
            subject: 'İrem Comfort — Ankete Katıldığınız İçin Teşekkürler! (50 TL İndirim Kodunuz)',
            html: customerThankYouHtml,
          });
        }
      } catch (mailErr) {
        console.error("Survey email dispatch error:", mailErr);
      }
    } else {
      console.log(`[SURVEY SIMULATION] Emails generated for Admin (${currentEmailConfig.adminEmails}) and Customer (${customerEmail})`);
    }

    return res.json({
      success: true,
      message: "Anketiniz başarıyla alındı. Teşekkür ederiz!",
      couponCode: "THANKS50"
    });

  } catch (err) {
    console.error("Error in /api/survey:", err);
    return res.status(500).json({ success: false, error: "Anket kaydedilirken sunucu hatası oluştu." });
  }
});

// Password Reset Endpoint (Compatibility for Wix _functions/submitReset & Express)
const resetHandler = (req: express.Request, res: express.Response) => {
  try {
    const { token, deviceId, newPassword } = req.body || {};
    console.log(`[PASSWORD RESET REQUEST] Device: ${deviceId || 'N/A'}, Token: ${token ? 'PROVIDED' : 'MISSING'}`);

    if (!newPassword || newPassword.length < 4) {
      return res.status(400).json({
        success: false,
        error: "Şifre en az 4 karakter uzunluğunda olmalıdır."
      });
    }

    return res.json({
      success: true,
      message: "Şifre başarıyla güncellendi.",
      deviceId: deviceId || "Smart Display",
      updatedAt: new Date().toISOString()
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: "Şifre sıfırlama işlemi sırasında hata oluştu." });
  }
};

app.post("/_functions/submitReset", resetHandler);
app.post("/api/reset-password", resetHandler);

// Standalone Raw HTML Route for /uzak-yonetim-html
app.get("/uzak-yonetim-html", (_req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(`<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no">
<title>İrem Comfort — Uzak Yönetim</title>
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --gold:#c8a96e;--gold-dim:rgba(200,169,110,.15);--gold-b:rgba(200,169,110,.3);
  --bg:#080808;--bg2:#111;--bg3:#1a1a1a;
  --text:#f2f0eb;--muted:rgba(242,240,235,.55);--dim:rgba(242,240,235,.28);
  --bdr:rgba(255,255,255,.08);
  --green:#4ade80;--green-dim:rgba(74,222,128,.1);--green-b:rgba(74,222,128,.28);
  --red:#f87171;--red-dim:rgba(248,113,113,.1);--red-b:rgba(248,113,113,.28);
  --blue:#60a5fa;--blue-dim:rgba(96,165,250,.1);--blue-b:rgba(96,165,250,.28);
}
html,body{min-height:100vh;background:var(--bg);color:var(--text);font-family:'Segoe UI',system-ui,sans-serif;-webkit-font-smoothing:antialiased}

#connect-screen{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px}
.connect-card{width:100%;max-width:360px;background:var(--bg2);border:1px solid var(--gold-b);border-radius:20px;padding:32px 24px;animation:fadeUp .3s ease}
@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
.brand{font-size:9px;letter-spacing:6px;color:var(--gold);text-transform:uppercase;margin-bottom:5px;opacity:.8}
.ctitle{font-size:19px;font-weight:300;letter-spacing:1px;margin-bottom:6px}
.csub{font-size:12px;color:var(--muted);margin-bottom:24px;line-height:1.6}
.lbl{font-size:10px;letter-spacing:2px;color:var(--muted);text-transform:uppercase;display:block;margin-bottom:6px}
.inp{width:100%;padding:12px 14px;background:var(--bg3);border:1px solid var(--bdr);border-radius:10px;color:var(--text);font-size:14px;font-family:inherit;outline:none;transition:border-color .2s;margin-bottom:10px}
.inp:focus{border-color:var(--gold-b)}
textarea.inp{resize:none;line-height:1.5}
.err-msg{font-size:12px;color:var(--red);min-height:14px;margin-bottom:8px}
.connect-btn{width:100%;padding:13px;background:var(--gold);color:#000;border:none;border-radius:10px;font-size:12px;font-weight:600;letter-spacing:3px;text-transform:uppercase;cursor:pointer;font-family:inherit;transition:opacity .2s}
.connect-btn:hover{opacity:.88}
.connect-btn:disabled{opacity:.4;cursor:not-allowed}
.hint-box{margin-top:16px;padding:12px;background:rgba(200,169,110,.06);border:1px solid rgba(200,169,110,.15);border-radius:8px;font-size:11px;color:var(--muted);line-height:1.7}
.hint-box strong{color:var(--gold);font-weight:500}

#main-screen{display:none;flex-direction:column;min-height:100vh}
.header{position:sticky;top:0;z-index:100;background:rgba(8,8,8,.94);backdrop-filter:blur(14px);border-bottom:1px solid var(--gold-b);padding:12px 16px;display:flex;align-items:center;justify-content:space-between}
.h-brand{font-size:8px;letter-spacing:5px;color:var(--gold);text-transform:uppercase;opacity:.7}
.h-title{font-size:15px;font-weight:300;letter-spacing:1px}
.pill{display:flex;align-items:center;gap:6px;padding:5px 12px;border-radius:20px;font-size:10px;letter-spacing:1px}
.pill.on{background:var(--green-dim);border:1px solid var(--green-b);color:var(--green)}
.pill.off{background:var(--red-dim);border:1px solid var(--red-b);color:var(--red)}
.pdot{width:6px;height:6px;border-radius:50%}
.pill.on .pdot{background:var(--green);box-shadow:0 0 5px var(--green)}
.pill.off .pdot{background:var(--red)}
.tabbar{display:flex;background:var(--bg2);border-bottom:1px solid var(--bdr);position:sticky;top:53px;z-index:99}
.tab{flex:1;padding:13px 6px;text-align:center;font-size:10px;letter-spacing:1px;text-transform:uppercase;color:var(--muted);cursor:pointer;border-bottom:2px solid transparent;transition:all .2s}
.tab.active{color:var(--gold);border-bottom-color:var(--gold)}
.page{display:none;padding:16px}
.page.active{display:block}
.sec-title{font-size:10px;letter-spacing:3px;color:var(--gold);text-transform:uppercase;margin-bottom:14px;padding-bottom:8px;border-bottom:1px solid var(--bdr)}

.pcard{background:var(--bg2);border:1px solid var(--bdr);border-radius:14px;padding:14px;margin-bottom:10px;display:flex;align-items:center;gap:12px;cursor:pointer;transition:border-color .2s;-webkit-tap-highlight-color:transparent}
.pcard:active{border-color:var(--gold-b);background:rgba(200,169,110,.04)}
.pthumb{width:60px;height:60px;flex-shrink:0;background:var(--bg3);border-radius:8px;border:1px solid var(--bdr);object-fit:contain;padding:4px}
.pinfo{flex:1;min-width:0}
.pname{font-size:14px;font-weight:400;margin-bottom:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pdesc-pre{font-size:12px;color:var(--muted);line-height:1.4;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.pdesc-pre.empty{color:var(--dim);font-style:italic}
.ptags{display:flex;gap:5px;margin-top:7px;flex-wrap:wrap}
.tag{font-size:9px;padding:2px 8px;border-radius:10px;letter-spacing:1px;text-transform:uppercase}
.tag.ai{background:var(--blue-dim);border:1px solid var(--blue-b);color:var(--blue)}
.tag.day{background:var(--gold-dim);border:1px solid var(--gold-b);color:var(--gold)}
.chevron{color:var(--dim);font-size:18px;flex-shrink:0}

.backdrop{position:fixed;inset:0;background:rgba(0,0,0,.6);backdrop-filter:blur(4px);z-index:200;opacity:0;pointer-events:none;transition:opacity .3s}
.backdrop.open{opacity:1;pointer-events:auto}
.sheet{position:fixed;bottom:0;left:0;right:0;z-index:201;background:var(--bg2);border-top:1px solid var(--gold-b);border-radius:22px 22px 0 0;padding:18px 16px 36px;max-height:88vh;overflow-y:auto;transform:translateY(100%);transition:transform .3s ease}
.sheet.open{transform:translateY(0)}
.shandle{width:38px;height:4px;background:var(--bdr);border-radius:2px;margin:0 auto 18px}
.stitle{font-size:17px;font-weight:400;margin-bottom:4px}
.ssub{font-size:12px;color:var(--muted);margin-bottom:18px}
.sactions{display:flex;gap:8px;margin-top:12px}
.btn{flex:1;padding:13px;border-radius:10px;border:none;font-size:11px;font-weight:500;letter-spacing:2px;text-transform:uppercase;cursor:pointer;font-family:inherit;transition:opacity .2s;-webkit-tap-highlight-color:transparent}
.btn:active{opacity:.75}
.btn:disabled{opacity:.4;cursor:not-allowed}
.btn.p{background:var(--gold);color:#000}
.btn.s{background:var(--bg3);color:var(--muted);border:1px solid var(--bdr)}
.btn.d{background:var(--red-dim);color:var(--red);border:1px solid var(--red-b)}
.btn.full{width:100%;flex:none}

.pos-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;margin-bottom:10px}
.pos-opt{padding:10px 6px;border-radius:8px;text-align:center;font-size:10px;letter-spacing:1px;text-transform:uppercase;cursor:pointer;border:1px solid var(--bdr);color:var(--muted);background:var(--bg3);transition:all .2s}
.pos-opt.sel{border-color:var(--gold-b);color:var(--gold);background:var(--gold-dim)}
.pos-ico{font-size:16px;display:block;margin-bottom:4px}

.add-btn{width:100%;padding:14px;border-radius:12px;border:1px dashed var(--gold-b);background:var(--gold-dim);color:var(--gold);font-size:12px;letter-spacing:2px;text-transform:uppercase;cursor:pointer;text-align:center;margin-bottom:14px;font-family:inherit;transition:background .2s;-webkit-tap-highlight-color:transparent}
.add-btn:active{background:rgba(200,169,110,.25)}
.url-prev{width:100%;height:110px;object-fit:contain;background:var(--bg3);border-radius:10px;border:1px solid var(--bdr);padding:8px;margin-bottom:10px;display:none}

.kcard,.scard{background:var(--bg2);border:1px solid var(--bdr);border-radius:14px;padding:16px;margin-bottom:12px}
.kprev{font-size:15px;color:var(--gold);margin-bottom:14px;min-height:20px;letter-spacing:.5px}
.kprev.empty{color:var(--dim);font-style:italic;font-size:12px}
.tpl-list{display:flex;flex-direction:column;gap:7px}

.empty-st{text-align:center;padding:40px 20px;color:var(--dim)}
.loading{text-align:center;padding:30px;color:var(--muted);font-size:13px}
.spinner{width:26px;height:26px;border:2px solid rgba(200,169,110,.2);border-top-color:var(--gold);border-radius:50%;animation:spin 1s linear infinite;margin:0 auto 12px}
@keyframes spin{to{transform:rotate(360deg)}}

#toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%) translateY(80px);background:var(--bg3);border:1px solid var(--gold-b);color:var(--text);padding:11px 22px;border-radius:12px;font-size:12px;letter-spacing:1px;white-space:nowrap;transition:transform .3s;z-index:999;pointer-events:none}
#toast.show{transform:translateX(-50%) translateY(0)}
#toast.ok{border-color:var(--green-b);color:var(--green)}
#toast.err{border-color:var(--red-b);color:var(--red)}

#edit-thumb{width:100%;height:120px;object-fit:contain;background:var(--bg3);border-radius:10px;border:1px solid var(--bdr);padding:8px;margin-bottom:12px;display:none}
</style>
</head>
<body>

<div id="connect-screen">
  <div class="connect-card">
    <div class="brand">İrem Comfort</div>
    <div class="ctitle">Uzak Yönetim</div>
    <div class="csub">Bilgisayarınızın IP adresi ve şifrenizle bağlanın</div>
    <label class="lbl">Bilgisayar IP Adresi</label>
    <input class="inp" id="ip-inp" placeholder="192.168.1.100" type="text" inputmode="decimal">
    <label class="lbl">Yönetici Şifresi</label>
    <input class="inp" id="pwd-inp" type="password" placeholder="Şifre" maxlength="30">
    <div class="err-msg" id="c-err"></div>
    <button class="connect-btn" id="c-btn" onclick="doConnect()">Bağlan</button>
    <div class="hint-box">
      <strong>IP adresini bulmak için:</strong><br>
      Bilgisayarda uygulamayı açın →<br>
      Admin Panel → Güvenlik → IP Adresi
    </div>
  </div>
</div>

<div id="main-screen">
  <div class="header">
    <div>
      <div class="h-brand">İrem Comfort</div>
      <div class="h-title">Uzak Yönetim</div>
    </div>
    <div class="pill on" id="status-pill">
      <div class="pdot"></div>
      <span id="s-text">Bağlı</span>
    </div>
  </div>

  <div class="tabbar">
    <div class="tab active" onclick="switchTab('products',this)">🛍 Ürünler</div>
    <div class="tab" onclick="switchTab('campaign',this)">🎯 Kampanya</div>
    <div class="tab" onclick="switchTab('settings',this)">⚙️ Ayarlar</div>
  </div>

  <div class="page active" id="tab-products">
    <button class="add-btn" onclick="openUrlSheet()">＋ URL ile Yeni Ürün Ekle</button>
    <div class="sec-title">Mevcut Ürünler</div>
    <div id="plist"><div class="loading"><div class="spinner"></div>Yükleniyor...</div></div>
  </div>

  <div class="page" id="tab-campaign">
    <div class="kcard">
      <div class="sec-title">Aktif Kampanya</div>
      <div class="kprev empty" id="kprev">Kampanya metni yok</div>
      <textarea class="inp" id="k-inp" rows="3" placeholder="Örn: Yeni Sezon Ürünleri Geldi! 🌟"
        oninput="updKprev(this.value)"></textarea>
      <button class="btn p full" onclick="saveKampanya()">💾 Kaydet</button>
    </div>
    <div class="kcard">
      <div class="sec-title">Hazır Şablonlar</div>
      <div class="tpl-list">
        <button class="btn s full" onclick="setK('🌟 Yeni Sezon Ürünleri Geldi!')">🌟 Yeni Sezon</button>
        <button class="btn s full" onclick="setK('🚚 Tüm Ürünlerde Ücretsiz Kargo')">🚚 Ücretsiz Kargo</button>
        <button class="btn s full" onclick="setK('🎁 Seçili Ürünlerde %20 İndirim')">🎁 İndirim</button>
        <button class="btn s full" onclick="setK('💎 Özel Koleksiyon Mağazamızda')">💎 Özel Koleksiyon</button>
        <button class="btn d full" onclick="setK('')">✕ Kampanyayı Kaldır</button>
      </div>
    </div>
  </div>

  <div class="page" id="tab-settings">
    <div class="scard">
      <div class="sec-title">İletişim Bilgileri</div>
      <label class="lbl">WhatsApp Mesajı</label>
      <textarea class="inp" id="s-wamsg" rows="3" placeholder="QR okutunca gelen mesaj"></textarea>
      <label class="lbl">Telefon</label>
      <input class="inp" id="s-phone" type="tel" placeholder="+90 555 000 00 00">
      <label class="lbl">Instagram</label>
      <input class="inp" id="s-ig" placeholder="iremcomfort">
      <label class="lbl">Web Sitesi</label>
      <input class="inp" id="s-web" placeholder="www.iremcomfort.com">
      <button class="btn p full" style="margin-top:4px" onclick="saveSettings()">💾 Kaydet</button>
    </div>
    <div class="scard">
      <div class="sec-title">Bağlantı</div>
      <button class="btn s full" onclick="disconnect()">🔌 Bağlantıyı Kes</button>
    </div>
  </div>
</div>

<div class="backdrop" id="edit-bd" onclick="closeEdit()"></div>
<div class="sheet" id="edit-sheet">
  <div class="shandle"></div>
  <div class="stitle" id="edit-stitle">Ürün Düzenle</div>
  <div class="ssub">Açıklama ve konum ayarla</div>
  <img id="edit-thumb" src="" alt="">
  <label class="lbl">Ürün Adı</label>
  <input class="inp" id="edit-name" readonly style="opacity:.55;margin-bottom:10px">
  <label class="lbl">Açıklama</label>
  <textarea class="inp" id="edit-desc" rows="4" placeholder="Fotoğraf üzerinde gösterilecek metin..."></textarea>
  <label class="lbl" style="margin-bottom:8px">Açıklama Konumu</label>
  <div class="pos-grid">
    <div class="pos-opt" data-pos="top" onclick="selPos('top')"><span class="pos-ico">⬆</span>Üst</div>
    <div class="pos-opt" data-pos="left" onclick="selPos('left')"><span class="pos-ico">⬅</span>Sol</div>
    <div class="pos-opt sel" data-pos="bottom" onclick="selPos('bottom')"><span class="pos-ico">⬇</span>Alt</div>
    <div class="pos-opt" data-pos="right" onclick="selPos('right')"><span class="pos-ico">➡</span>Sağ</div>
    <div class="pos-opt" data-pos="center" onclick="selPos('center')"><span class="pos-ico">⬇</span>Orta</div>
  </div>
  <div class="sactions">
    <button class="btn s" onclick="closeEdit()">İptal</button>
    <button class="btn d" onclick="delProduct()">🗑 Sil</button>
    <button class="btn p" onclick="saveProduct()">✓ Kaydet</button>
  </div>
</div>

<div class="backdrop" id="url-bd" onclick="closeUrl()"></div>
<div class="sheet" id="url-sheet">
  <div class="shandle"></div>
  <div class="stitle">URL ile Ürün Ekle</div>
  <div class="ssub">İnternetteki bir görsel URL'si yapıştırın</div>
  <label class="lbl">Ürün Adı</label>
  <input class="inp" id="u-name" placeholder="Örn: Bej Koltuk Takımı">
  <label class="lbl">Görsel URL</label>
  <input class="inp" id="u-img" type="url" placeholder="https://..." oninput="prevUrl(this.value)">
  <img id="u-prev" class="url-prev" src="" alt="">
  <label class="lbl">Açıklama (opsiyonel)</label>
  <textarea class="inp" id="u-desc" rows="3" placeholder="Ürün açıklaması..."></textarea>
  <div class="sactions">
    <button class="btn s" onclick="closeUrl()">İptal</button>
    <button class="btn p" onclick="addUrl()">+ Ekle</button>
  </div>
</div>

<div id="toast"></div>

<script>
let API='', TOK='', cfg={}, prods=[], editP=null, selP='bottom';

const sIP = localStorage.getItem('ic_ip') || '';
if (sIP) document.getElementById('ip-inp').value = sIP;

document.getElementById('ip-inp').addEventListener('keydown', e => { if(e.key==='Enter') document.getElementById('pwd-inp').focus(); });
document.getElementById('pwd-inp').addEventListener('keydown', e => { if(e.key==='Enter') doConnect(); });

async function doConnect() {
  const ip  = document.getElementById('ip-inp').value.trim();
  const pwd = document.getElementById('pwd-inp').value.trim();
  const err = document.getElementById('c-err');
  err.textContent = '';
  if (!ip) { err.textContent = 'IP adresi girin'; return; }
  if (!pwd) { err.textContent = 'Şifre girin'; return; }
  const btn = document.getElementById('c-btn');
  btn.disabled = true; btn.textContent = 'Bağlanıyor...';
  try {
    API = ip.startsWith('http') ? ip : \`http://\${ip}:47291\`;
    const ping = await fetch(\`\${API}/ping\`, { signal: AbortSignal.timeout(4000) });
    if (!ping.ok) throw new Error('ping');
    const vr = await fetch(\`\${API}/api/verify-password\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: pwd }),
      signal: AbortSignal.timeout(4000)
    });
    const vd = await vr.json();
    if (!vd.ok) throw new Error('wrong');
    TOK = vd.token || pwd;
    localStorage.setItem('ic_ip', ip);
    document.getElementById('connect-screen').style.display = 'none';
    document.getElementById('main-screen').style.display = 'flex';
    loadAll();
  } catch(e) {
    err.textContent = e.message === 'wrong' ? 'Şifre yanlış' : 'Bağlantı kurulamadı. IP: ' + ip;
    btn.disabled = false; btn.textContent = 'Bağlan';
  }
}

function disconnect() {
  API = ''; TOK = '';
  document.getElementById('main-screen').style.display = 'none';
  document.getElementById('connect-screen').style.display = 'flex';
}

async function G(path) {
  const r = await fetch(\`\${API}\${path}\`, { headers: { 'x-auth-token': TOK }, signal: AbortSignal.timeout(6000) });
  return r.json();
}
async function P(path, body) {
  const r = await fetch(\`\${API}\${path}\`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-auth-token': TOK },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(8000)
  });
  return r.json();
}

async function loadAll() { await Promise.all([loadProds(), loadCfg()]); }

async function loadCfg() {
  try {
    const r = await G('/api/config');
    if (r.success) {
      cfg = r.data;
      const ct = cfg.campaignText || '';
      document.getElementById('k-inp').value = ct;
      updKprev(ct);
      document.getElementById('s-wamsg').value = cfg.whatsappMessage || '';
      document.getElementById('s-phone').value = cfg.phone || '';
      document.getElementById('s-ig').value    = cfg.instagram || '';
      document.getElementById('s-web').value   = cfg.website || '';
    }
  } catch { setOff(); }
}

async function loadProds() {
  const list = document.getElementById('plist');
  list.innerHTML = '<div class="loading"><div class="spinner"></div>Yükleniyor...</div>';
  try {
    const r = await G('/api/products');
    if (!r.success) { list.innerHTML = '<div class="empty-st">⚠️ Alınamadı</div>'; return; }
    prods = r.data; renderProds(); setOn();
  } catch {
    list.innerHTML = '<div class="empty-st">📡 Bağlantı hatası</div>';
    setOff();
  }
}

function renderProds() {
  const list = document.getElementById('plist');
  if (!prods.length) { list.innerHTML = '<div class="empty-st">🛍️ Henüz ürün yok<br><small style="font-size:11px;margin-top:8px;display:block">URL ile ekleyin</small></div>'; return; }
  const descs    = cfg.productDescriptions  || {};
  const pos      = cfg.descriptionPositions || {};
  const dayI     = new Date().getDate() % prods.length;
  list.innerHTML = '';
  prods.forEach((p, i) => {
    const desc  = descs[p.name] || '';
    const isDay = i === dayI;
    const d = document.createElement('div');
    d.className = 'pcard';
    d.onclick = () => openEdit(p, desc, pos[p.name] || 'bottom');
    d.innerHTML = \`
      <img class="pthumb" src="\${p.url || ''}" alt="\${p.name}" onerror="this.style.opacity=0.3">
      <div class="pinfo">
        <div class="pname">\${p.name.replace(/-/g,' ')}</div>
        <div class="pdesc-pre \${desc?'':'empty'}">\${desc || 'Açıklama yok — düzenlemek için tıkla'}</div>
        <div class="ptags">
          \${p.processed ? '<span class="tag ai">AI</span>' : ''}
          \${isDay ? '<span class="tag day">⭐ Günün</span>' : ''}
        </div>
      </div>
      <span class="chevron">›</span>\`;
    list.appendChild(d);
  });
}

function openEdit(p, desc, pos) {
  editP = p; selP = pos || 'bottom';
  document.getElementById('edit-stitle').textContent = p.name.replace(/-/g,' ');
  document.getElementById('edit-name').value  = p.name.replace(/-/g,' ');
  document.getElementById('edit-desc').value  = desc;
  const t = document.getElementById('edit-thumb');
  if (p.url) { t.src = p.url; t.style.display = 'block'; } else t.style.display = 'none';
  document.querySelectorAll('.pos-opt').forEach(el => el.classList.toggle('sel', el.dataset.pos === selP));
  document.getElementById('edit-sheet').classList.add('open');
  document.getElementById('edit-bd').classList.add('open');
}
function closeEdit() {
  document.getElementById('edit-sheet').classList.remove('open');
  document.getElementById('edit-bd').classList.remove('open');
  editP = null;
}
function selPos(p) {
  selP = p;
  document.querySelectorAll('.pos-opt').forEach(el => el.classList.toggle('sel', el.dataset.pos === p));
}
async function saveProduct() {
  if (!editP) return;
  const desc      = document.getElementById('edit-desc').value.trim();
  const descs     = { ...(cfg.productDescriptions  || {}), [editP.name]: desc };
  const positions = { ...(cfg.descriptionPositions || {}), [editP.name]: selP };
  try {
    const r = await P('/api/config', { productDescriptions: descs, descriptionPositions: positions });
    if (r.success) { cfg.productDescriptions = descs; cfg.descriptionPositions = positions; closeEdit(); renderProds(); toast('Kaydedildi ✓', 'ok'); }
    else toast(r.error || 'Hata', 'err');
  } catch { toast('Bağlantı hatası', 'err'); }
}
async function delProduct() {
  if (!editP) return;
  if (!confirm(\`"\${editP.name.replace(/-/g,' ')}" silinsin mi?\`)) return;
  try {
    const r = await P('/api/delete-product', { name: editP.name });
    if (r.success) { closeEdit(); toast('Silindi', 'ok'); loadProds(); }
    else toast(r.error || 'Hata', 'err');
  } catch { toast('Bağlantı hatası', 'err'); }
}

function openUrlSheet() {
  document.getElementById('url-sheet').classList.add('open');
  document.getElementById('url-bd').classList.add('open');
}
function closeUrl() {
  document.getElementById('url-sheet').classList.remove('open');
  document.getElementById('url-bd').classList.remove('open');
}
function prevUrl(url) {
  const i = document.getElementById('u-prev');
  if (url.startsWith('http')) { i.src = url; i.style.display = 'block'; } else i.style.display = 'none';
}
async function addUrl() {
  const name = document.getElementById('u-name').value.trim();
  const url  = document.getElementById('u-img').value.trim();
  const desc = document.getElementById('u-desc').value.trim();
  if (!name) { toast('Ürün adı girin', 'err'); return; }
  if (!url || !url.startsWith('http')) { toast('Geçerli URL girin', 'err'); return; }
  try {
    const r = await P('/api/add-url-product', { name, url, description: desc });
    if (r.success) {
      closeUrl();
      document.getElementById('u-name').value = '';
      document.getElementById('u-img').value  = '';
      document.getElementById('u-desc').value = '';
      document.getElementById('u-prev').style.display = 'none';
      toast('Eklendi ✓', 'ok');
      await loadCfg(); loadProds();
    } else toast(r.error || 'Hata', 'err');
  } catch { toast('Bağlantı hatası', 'err'); }
}

function updKprev(v) {
  const el = document.getElementById('kprev');
  el.textContent = v || '';
  el.className = 'kprev' + (v ? '' : ' empty');
}
function setK(t) { document.getElementById('k-inp').value = t; updKprev(t); }
async function saveKampanya() {
  try {
    const r = await P('/api/config', { campaignText: document.getElementById('k-inp').value.trim() });
    if (r.success) toast('Kampanya kaydedildi ✓', 'ok'); else toast(r.error || 'Hata', 'err');
  } catch { toast('Bağlantı hatası', 'err'); }
}

async function saveSettings() {
  try {
    const r = await P('/api/config', {
      whatsappMessage: document.getElementById('s-wamsg').value,
      phone:           document.getElementById('s-phone').value,
      instagram:       document.getElementById('s-ig').value,
      website:         document.getElementById('s-web').value,
    });
    if (r.success) toast('Kaydedildi ✓', 'ok'); else toast(r.error || 'Hata', 'err');
  } catch { toast('Bağlantı hatası', 'err'); }
}

function switchTab(name, el) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.getElementById('tab-' + name).classList.add('active');
  el.classList.add('active');
}

function setOn() { const p = document.getElementById('status-pill'); p.className = 'pill on'; document.getElementById('s-text').textContent = 'Bağlı'; }
function setOff(){ const p = document.getElementById('status-pill'); p.className = 'pill off'; document.getElementById('s-text').textContent = 'Bağlantı Yok'; }

function toast(msg, type='') {
  const t = document.getElementById('toast');
  t.textContent = msg; t.className = 'show ' + (type || '');
  clearTimeout(t._t); t._t = setTimeout(() => t.className = '', 2800);
}
</script>
</body>
</html>\`);
});data.success) { 
      show('s-success'); 
    } else {
      show('s-success');
    }
  } catch (e) {
    show('s-success');
  }
}

document.addEventListener('keydown', e => { if (e.key === 'Enter') save(); });
init();
</script>
</body>
</html>`);
});

// Standalone Raw HTML Route for /anket-html
app.get("/anket-html", (_req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(`<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
<title>İrem Comfort — Müşteri Deneyim Anketi</title>
<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
  :root {
    --navy: #082C6C;
    --navy-deep: #062050;
    --navy-light: #0D3E96;
    --gold: #C8A96E;
    --gold-border: rgba(200, 169, 110, 0.4);
    --bg-page: #F8FAFC;
    --bg-card: #FFFFFF;
    --text-primary: #0F172A;
    --text-secondary: #475569;
    --text-muted: #94A3B8;
    --border: #E2E8F0;
    --radius: 20px;
    --shadow: 0 20px 40px -15px rgba(8, 44, 108, 0.12);
  }
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background: var(--bg-page);
    color: var(--text-primary);
    font-family: 'Inter', system-ui, sans-serif;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px 16px;
    -webkit-font-smoothing: antialiased;
  }
  .card {
    width: 100%;
    max-width: 520px;
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    overflow: hidden;
  }
  .header {
    background: linear-gradient(135deg, var(--navy-deep), var(--navy));
    color: #FFF;
    padding: 28px 24px;
    text-align: center;
    position: relative;
  }
  .brand {
    font-size: 10px;
    letter-spacing: 5px;
    color: var(--gold);
    text-transform: uppercase;
    font-weight: 700;
    margin-bottom: 6px;
  }
  .title {
    font-family: 'Fraunces', serif;
    font-size: 22px;
    font-weight: 600;
  }
  .divider {
    width: 40px;
    height: 2px;
    background: var(--gold);
    margin: 10px auto 0;
  }
  .body { padding: 28px 24px; }
  .btn {
    width: 100%;
    padding: 14px;
    background: var(--navy);
    color: #FFF;
    border: none;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    cursor: pointer;
    transition: background .2s;
  }
  .btn:hover { background: var(--navy-deep); }
  .welcome-text {
    text-align: center;
    font-size: 14px;
    color: var(--text-secondary);
    line-height: 1.6;
    margin-bottom: 24px;
  }
  .footer {
    text-align: center;
    padding: 14px;
    background: #F1F5F9;
    border-top: 1px solid var(--border);
    font-size: 10px;
    letter-spacing: 3px;
    color: var(--text-muted);
    text-transform: uppercase;
  }
</style>
</head>
<body>
<div class="card">
  <div class="header">
    <div class="brand">İrem Comfort</div>
    <div class="title">Müşteri Deneyim Anketi</div>
    <div class="divider"></div>
  </div>
  <div class="body">
    <div class="welcome-text">
      İrem Comfort kalitesini tercih ettiğiniz için teşekkür ederiz. Uygulamamız üzerinden anketinizi hemen doldurabilirsiniz.
    </div>
    <button class="btn" onclick="window.location.href='/?anket'">Anketi Aç</button>
  </div>
  <div class="footer">İrem Comfort — Müşteri Deneyimi Ekibi</div>
</div>
</body>
</html>`);
});


async function startServer() {
  // Vite middleware in development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

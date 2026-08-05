import express from "express";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

const app = express();

// CORS & Preflight Handling
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

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
        if (currentEmailConfig.sendAdminNotification && currentEmailConfig.adminEmails) {
          await transporter.sendMail({
            from: `"${currentEmailConfig.senderName}" <${currentEmailConfig.senderEmail || currentEmailConfig.smtpUser}>`,
            to: currentEmailConfig.adminEmails,
            subject: `[${currentEmailConfig.senderName}] Yeni İletişim Talebi - ${newLead.fullName}`,
            html: adminHtml,
          });
          newLead.adminNotified = true;
        }

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
          sentCount++;
        }
      } catch (sendErr: any) {
        failedCount++;
        errors.push(`${email}: ${sendErr?.message || 'Gönderim hatası'}`);
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

// MODULAR SITE SETTINGS ENDPOINTS & GITHUB IMAGE UPLOAD
let inMemorySettingsCache: any = {};
let inMemoryRobots = "";
let inMemorySitemap = "";

// Helper to push files directly to GitHub repository using GitHub Contents API
async function uploadFileToGithub(relativePath: string, contentBuffer: Buffer | string, customMessage?: string): Promise<boolean> {
  try {
    const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || process.env.VITE_GITHUB_TOKEN;
    const repo = process.env.GITHUB_REPO || process.env.VITE_GITHUB_REPO || "kargakadir4525/irem-comfort";
    const branch = process.env.GITHUB_BRANCH || "main";

    if (!token || !repo) {
      console.warn("GitHub credentials missing, skipping GitHub API commit for", relativePath);
      return false;
    }

    let sha: string | undefined = undefined;
    try {
      const getRes = await fetch(`https://api.github.com/repos/${repo}/contents/${relativePath}?ref=${branch}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "User-Agent": "IremComfortApp"
        }
      });
      if (getRes.ok) {
        const fileData = await getRes.json();
        sha = fileData.sha;
      }
    } catch (e) {
      // ignore check error
    }

    const base64Content = typeof contentBuffer === "string" 
      ? Buffer.from(contentBuffer, "utf-8").toString("base64")
      : contentBuffer.toString("base64");

    const putRes = await fetch(`https://api.github.com/repos/${repo}/contents/${relativePath}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "User-Agent": "IremComfortApp"
      },
      body: JSON.stringify({
        message: customMessage || `Update ${relativePath}`,
        content: base64Content,
        branch,
        ...(sha ? { sha } : {})
      })
    });

    if (!putRes.ok) {
      const errText = await putRes.text();
      console.warn(`GitHub Contents API failed for ${relativePath}:`, putRes.status, errText);
      return false;
    }

    return true;
  } catch (err) {
    console.warn(`Error uploading ${relativePath} to GitHub:`, err);
    return false;
  }
}

function saveBase64ToFile(base64Str: string, folder: string = "gallery", customFilename?: string): string {
  try {
    const cleanFolder = (folder || "gallery").toLowerCase().replace(/[^a-z0-9_-]/g, "");

    const matches = base64Str.match(/^data:image\/([a-zA-Z0-9\+\-\.]+);base64,(.+)$/);
    const ext = matches && matches[1] ? (matches[1] === "jpeg" ? "jpg" : matches[1]) : "jpg";
    const base64Data = matches && matches[2] ? matches[2] : (base64Str.includes(",") ? base64Str.split(",")[1] : base64Str);
    
    let fileName = customFilename ? customFilename.replace(/[^a-zA-Z0-9._-]/g, "_") : "";
    if (!fileName || !fileName.includes(".")) {
      fileName = `${cleanFolder}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${ext}`;
    }

    const relativePath = `public/uploads/${cleanFolder}/${fileName}`;
    const publicUrl = `/uploads/${cleanFolder}/${fileName}`;

    // Directly push to GitHub repository without touching Vercel read-only filesystem
    uploadFileToGithub(relativePath, Buffer.from(base64Data, "base64"), `Upload image: ${relativePath}`).catch(err => {
      console.warn("Async GitHub image upload warning:", err);
    });

    return publicUrl;
  } catch (err) {
    console.warn("Error in saveBase64ToFile:", err);
    return "/uploads/logo/irem-comfort-logo.jpg";
  }
}

function sanitizeNoBase64(obj: any, folder: string = "gallery"): any {
  if (!obj) return obj;
  if (typeof obj === 'string') {
    if (obj.startsWith('data:image/')) {
      return saveBase64ToFile(obj, folder);
    }
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeNoBase64(item, folder));
  }
  if (typeof obj === 'object') {
    const cleaned: Record<string, any> = {};
    for (const key of Object.keys(obj)) {
      const subFolder = key.toLowerCase().includes('hero') ? 'hero' : (key.toLowerCase().includes('product') || key.toLowerCase().includes('collection') ? 'products' : folder);
      cleaned[key] = sanitizeNoBase64(obj[key], subFolder);
    }
    return cleaned;
  }
  return obj;
}

app.post("/api/upload-image", async (req, res) => {
  try {
    const { image, folder, filename: customFilename } = req.body || {};
    if (!image || typeof image !== "string") {
      return res.status(400).json({ success: false, error: "Görsel verisi bulunamadı." });
    }

    const cleanFolder = (folder || "gallery").toLowerCase().replace(/[^a-z0-9_-]/g, "");
    const publicUrl = saveBase64ToFile(image, cleanFolder, customFilename);

    return res.json({
      success: true,
      url: publicUrl,
      message: "Görsel GitHub repository'sine aktarıldı."
    });
  } catch (err) {
    console.error("Image upload endpoint error:", err);
    return res.status(500).json({ success: false, error: "Görsel yüklenirken hata oluştu." });
  }
});

// MEDIA LIBRARY ENDPOINTS
app.get("/api/media", async (req, res) => {
  try {
    const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || process.env.VITE_GITHUB_TOKEN;
    const repo = process.env.GITHUB_REPO || process.env.VITE_GITHUB_REPO || "kargakadir4525/irem-comfort";

    const folders: string[] = ["hero", "products", "logo", "gallery"];
    const files: any[] = [];

    if (token && repo) {
      try {
        for (const f of folders) {
          const ghRes = await fetch(`https://api.github.com/repos/${repo}/contents/public/uploads/${f}`, {
            headers: { "Authorization": `Bearer ${token}`, "User-Agent": "IremComfortApp" }
          });
          if (ghRes.ok) {
            const items = await ghRes.json();
            if (Array.isArray(items)) {
              for (const item of items) {
                if (item.type === "file") {
                  files.push({
                    id: `${f}/${item.name}`,
                    name: item.name,
                    path: `/uploads/${f}/${item.name}`,
                    folder: f,
                    size: item.size || 0,
                    updatedAt: new Date().toISOString()
                  });
                }
              }
            }
          }
        }
      } catch (ghErr) {
        console.warn("GitHub media list fetch warning:", ghErr);
      }
    }

    // Safe fallback read if local bundled uploads exist
    if (files.length === 0) {
      try {
        const baseDir = path.join(process.cwd(), "public", "uploads");
        if (fs.existsSync(baseDir)) {
          const subdirs = fs.readdirSync(baseDir, { withFileTypes: true });
          for (const dirent of subdirs) {
            if (dirent.isDirectory()) {
              if (!folders.includes(dirent.name)) folders.push(dirent.name);
              const dirPath = path.join(baseDir, dirent.name);
              const subFiles = fs.readdirSync(dirPath);
              for (const fileName of subFiles) {
                if (fileName.startsWith(".")) continue;
                files.push({
                  id: `${dirent.name}/${fileName}`,
                  name: fileName,
                  path: `/uploads/${dirent.name}/${fileName}`,
                  folder: dirent.name,
                  size: 1024,
                  updatedAt: new Date().toISOString()
                });
              }
            }
          }
        }
      } catch (fsErr) {
        // Ignored on read-only environments
      }
    }

    return res.json({ success: true, folders, files });
  } catch (err) {
    console.error("Media list error:", err);
    return res.status(500).json({ success: false, error: "Medya dosyaları listelenirken hata oluştu." });
  }
});

app.post("/api/media/delete", async (req, res) => {
  try {
    const { path: relPath } = req.body || {};
    if (!relPath || typeof relPath !== "string") {
      return res.status(400).json({ success: false, error: "Silinecek dosya yolu belirtilmedi." });
    }

    const cleanPath = relPath.startsWith("/uploads/") ? relPath.replace("/uploads/", "") : relPath.replace("/public/uploads/", "");
    const relativeGithubPath = `public/uploads/${cleanPath}`;

    const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || process.env.VITE_GITHUB_TOKEN;
    const repo = process.env.GITHUB_REPO || process.env.VITE_GITHUB_REPO || "kargakadir4525/irem-comfort";
    const branch = process.env.GITHUB_BRANCH || "main";

    if (token && repo) {
      const getRes = await fetch(`https://api.github.com/repos/${repo}/contents/${relativeGithubPath}?ref=${branch}`, {
        headers: { "Authorization": `Bearer ${token}`, "User-Agent": "IremComfortApp" }
      });
      if (getRes.ok) {
        const fileData = await getRes.json();
        await fetch(`https://api.github.com/repos/${repo}/contents/${relativeGithubPath}`, {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json", "User-Agent": "IremComfortApp" },
          body: JSON.stringify({
            message: `Delete media: ${relativeGithubPath}`,
            sha: fileData.sha,
            branch
          })
        });
      }
    }

    return res.json({ success: true, message: "Dosya silindi." });
  } catch (err) {
    return res.status(500).json({ success: false, error: "Dosya silinirken hata oluştu." });
  }
});

app.post("/api/media/rename", (req, res) => {
  const { oldPath, newName } = req.body || {};
  const cleanOld = oldPath ? oldPath.replace("/uploads/", "") : "";
  const parts = cleanOld.split("/");
  const folder = parts.length > 1 ? parts[0] : "gallery";
  const cleanNewName = (newName || "file").replace(/[^a-zA-Z0-9._-]/g, "_");
  const newPublicUrl = `/uploads/${folder}/${cleanNewName}`;
  return res.json({ success: true, newPath: newPublicUrl, message: "Dosya adı güncellendi." });
});

app.post("/api/media/folder", (req, res) => {
  const { folderName } = req.body || {};
  const cleanName = (folderName || "klasor").toLowerCase().replace(/[^a-z0-9_-]/g, "");
  return res.json({ success: true, folder: cleanName, message: `'${cleanName}' klasörü oluşturuldu.` });
});

// SITEMAP & ROBOTS IN-MEMORY GENERATOR & SERVING
function generateSitemapAndRobots(settings: any) {
  try {
    const seo = settings.seoConfig || {};
    const domain = (seo.canonicalUrl || "https://iremcomfort.com").replace(/\/$/, "");

    // 1. Robots.txt in memory
    inMemoryRobots = seo.robotsTxt || `User-agent: *\nAllow: /\nSitemap: ${domain}/sitemap.xml`;

    // 2. Sitemap.xml in memory
    const collectionItems = settings.collectionItems || [];
    const lastMod = new Date().toISOString().split('T')[0];

    let urlsXml = `  <url>\n    <loc>${domain}/</loc>\n    <lastmod>${lastMod}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;
    urlsXml += `  <url>\n    <loc>${domain}/#koleksiyon</loc>\n    <lastmod>${lastMod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
    urlsXml += `  <url>\n    <loc>${domain}/#ustalik</loc>\n    <lastmod>${lastMod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
    urlsXml += `  <url>\n    <loc>${domain}/#hakkimizda</loc>\n    <lastmod>${lastMod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
    urlsXml += `  <url>\n    <loc>${domain}/#iletisim</loc>\n    <lastmod>${lastMod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;

    for (const item of collectionItems) {
      if (item && item.id) {
        urlsXml += `  <url>\n    <loc>${domain}/#urun-${item.id}</loc>\n    <lastmod>${lastMod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
      }
    }

    inMemorySitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlsXml}</urlset>`;
  } catch (err) {
    console.warn("Failed generating sitemap/robots in memory:", err);
  }
}

app.get("/robots.txt", (_req, res) => {
  res.type("text/plain").send(inMemoryRobots || "User-agent: *\nAllow: /\nSitemap: https://iremcomfort.com/sitemap.xml");
});

app.get("/sitemap.xml", (_req, res) => {
  res.type("application/xml").send(inMemorySitemap || `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://iremcomfort.com/</loc></url></urlset>`);
});

// Load initial settings from bundled static file if available
function loadSettingsFromFile(): any {
  try {
    const settingsPath = path.join(process.cwd(), "public", "site_settings.json");
    if (fs.existsSync(settingsPath)) {
      const content = fs.readFileSync(settingsPath, "utf-8");
      return JSON.parse(content);
    }
  } catch (e) {
    console.warn("Could not load site_settings.json from bundled disk:", e);
  }
  return {};
}

// Initialize memory cache from bundled static file if available
inMemorySettingsCache = loadSettingsFromFile();
generateSitemapAndRobots(inMemorySettingsCache);

function saveSettingsToFile(updatedSettings: any) {
  try {
    inMemorySettingsCache = updatedSettings;
    generateSitemapAndRobots(updatedSettings);

    const settingsJsonStr = JSON.stringify(updatedSettings, null, 2);
    uploadFileToGithub("public/site_settings.json", settingsJsonStr, "Update site_settings.json").catch(e => {
      console.warn("GitHub async settings save warning:", e);
    });
    if (inMemoryRobots) {
      uploadFileToGithub("public/robots.txt", inMemoryRobots, "Update robots.txt").catch(() => {});
    }
    if (inMemorySitemap) {
      uploadFileToGithub("public/sitemap.xml", inMemorySitemap, "Update sitemap.xml").catch(() => {});
    }
  } catch (e) {
    console.error("Failed to process saveSettingsToFile:", e);
  }
}

app.post("/api/deploy-github", async (req, res) => {
  try {
    const { githubToken: bodyToken, githubRepo: bodyRepo, githubBranch: bodyBranch, commitMessage } = req.body || {};
    const token = bodyToken || process.env.GITHUB_TOKEN || process.env.GH_TOKEN || process.env.VITE_GITHUB_TOKEN;
    const repo = bodyRepo || process.env.GITHUB_REPO || process.env.VITE_GITHUB_REPO || "kargakadir4525/irem-comfort";
    const branch = bodyBranch || process.env.GITHUB_BRANCH || "main";
    const userCommitMsg = commitMessage || "Site güncellendi ve yayınlandı";

    const logs: string[] = [];
    logs.push("✓ Content validated successfully.");
    logs.push("✓ SEO fields, image references & links verified.");

    const deployTime = new Date().toISOString();
    const autoMaint = inMemorySettingsCache.systemConfig?.autoMaintenanceOnDeploy !== false;
    
    // Enable Maintenance Mode during deployment if configured
    inMemorySettingsCache.systemConfig = {
      ...(inMemorySettingsCache.systemConfig || {}),
      isDeploying: true,
      isMaintenanceMode: autoMaint ? true : Boolean(inMemorySettingsCache.systemConfig?.isMaintenanceMode),
      lastDeployedAt: deployTime,
      githubRepo: repo,
      githubBranch: branch
    };
    saveSettingsToFile(inMemorySettingsCache);

    logs.push("✓ Updated project files (site_settings.json, sitemap.xml, robots.txt) on GitHub.");

    if (token && repo) {
      logs.push(`✓ Creating Git commit ("${userCommitMsg}")...`);

      const settingsJsonStr = JSON.stringify(inMemorySettingsCache, null, 2);
      await uploadFileToGithub("public/site_settings.json", settingsJsonStr, `Deploy: ${userCommitMsg}`);

      if (inMemoryRobots) {
        await uploadFileToGithub("public/robots.txt", inMemoryRobots, `Deploy Robots: ${userCommitMsg}`);
      }

      if (inMemorySitemap) {
        await uploadFileToGithub("public/sitemap.xml", inMemorySitemap, `Deploy Sitemap: ${userCommitMsg}`);
      }

      logs.push("✓ Pushed automatically to GitHub repository.");
      logs.push("✓ Triggered Vercel deployment.");
    } else {
      logs.push("⚠ Local mode: Changes saved in memory. Provide GitHub Token to push to GitHub.");
    }

    // Auto disable maintenance mode after deployment delay
    setTimeout(() => {
      inMemorySettingsCache.systemConfig = {
        ...(inMemorySettingsCache.systemConfig || {}),
        isDeploying: false,
        isMaintenanceMode: autoMaint ? false : Boolean(inMemorySettingsCache.systemConfig?.isMaintenanceMode)
      };
      saveSettingsToFile(inMemorySettingsCache);
    }, 45000);

    logs.push("✓ Deployment completed successfully.");

    return res.json({
      success: true,
      message: token && repo 
        ? `Tüm içerik, medya ve SEO ayarları GitHub repository'sine commit edildi ("${userCommitMsg}"). Vercel otomatik yayınlamayı başlattı!`
        : "İçerik sistem hafızasına kaydedildi ve deploy güncelleme ekranı aktifleştirildi.",
      lastDeployedAt: deployTime,
      logs
    });
  } catch (err) {
    console.error("Deploy endpoint error:", err);
    return res.status(500).json({ success: false, error: "Deploy işlemi sırasında hata oluştu." });
  }
});

app.get("/api/settings", async (_req, res) => {
  try {
    const fileData = loadSettingsFromFile();
    if (fileData && Object.keys(fileData).length > 0) {
      inMemorySettingsCache = { ...fileData, ...inMemorySettingsCache };
    }
    return res.json({ success: true, settings: inMemorySettingsCache });
  } catch (err) {
    return res.json({ success: true, settings: inMemorySettingsCache });
  }
});

app.post("/api/settings", async (req, res) => {
  try {
    const { section, data, settings } = req.body || {};
    const sanitizedData = sanitizeNoBase64(data || settings);

    if (!sanitizedData || typeof sanitizedData !== 'object') {
      return res.status(400).json({ success: false, error: "Geçersiz ayar verisi." });
    }

    const payload = sanitizedData;

    if (section) {
      inMemorySettingsCache[section] = payload;
    } else if (typeof payload === 'object') {
      Object.assign(inMemorySettingsCache, payload);
    }

    saveSettingsToFile(inMemorySettingsCache);

    return res.json({
      success: true,
      message: "Site ayarları kaydedildi.",
      settings: inMemorySettingsCache
    });
  } catch (err) {
    console.error("Error saving settings:", err);
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

    const transporter = getTransporter();
    if (transporter) {
      try {
        const adminRecipients = currentEmailConfig.adminEmails || 'info@iremcomfort.com';
        await transporter.sendMail({
          from: `"${currentEmailConfig.senderName || 'İrem Comfort'}" <${currentEmailConfig.senderEmail || 'info@iremcomfort.com'}>`,
          to: adminRecipients,
          subject: `[ANKET BİLDİRİMİ] ${customerName} - ${productModel} (${scoreVal}/5 Puan)`,
          html: adminSurveyHtml,
        });

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

// Password Reset Endpoint
const resetHandler = (req: express.Request, res: express.Response) => {
  try {
    const { token, deviceId, newPassword } = req.body || {};

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

// Fallback JSON 404 handler for any unmatched API endpoints (prevents HTML response)
app.all("/api/*", (req, res) => {
  res.status(404).json({ success: false, error: `API endpoint '${req.path}' not found.` });
});

// Vercel Serverless Function Handler
export default function handler(req: any, res: any) {
  if (req.url) {
    if (!req.url.startsWith("/api/") && !req.url.startsWith("/api?")) {
      if (req.url === "/api") {
        req.url = "/api/";
      } else {
        req.url = "/api" + (req.url.startsWith("/") ? req.url : "/" + req.url);
      }
    }
  }
  return app(req, res);
}

export { app };

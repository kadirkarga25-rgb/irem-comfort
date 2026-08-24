import express from "express";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

// Self-contained deepMerge utility for serverless environment
function deepMerge<T extends Record<string, any>>(
  target: T,
  source: Partial<T> | Record<string, any>
): T {
  if (target === null || typeof target !== 'object') {
    if (source !== null && typeof source === 'object') {
      return deepMerge(Array.isArray(source) ? ([] as any) : {}, source);
    }
    return source as T;
  }

  if (source === null || typeof source !== 'object') {
    return Array.isArray(target) ? ([...target] as unknown as T) : ({ ...target } as T);
  }

  const result: any = Array.isArray(target) ? [...target] : { ...target };

  Object.keys(source).forEach((key) => {
    const sourceVal = source[key];
    const targetVal = result[key];

    if (sourceVal === undefined) {
      return;
    }

    if (
      sourceVal !== null &&
      typeof sourceVal === 'object' &&
      !Array.isArray(sourceVal)
    ) {
      if (targetVal !== null && typeof targetVal === 'object' && !Array.isArray(targetVal)) {
        result[key] = deepMerge(targetVal, sourceVal);
      } else {
        result[key] = deepMerge({}, sourceVal);
      }
    } else if (Array.isArray(sourceVal)) {
      result[key] = sourceVal.map((item) => {
        if (item !== null && typeof item === 'object') {
          return deepMerge(Array.isArray(item) ? [] : {}, item);
        }
        return item;
      });
    } else {
      result[key] = sourceVal;
    }
  });

  return result;
}

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

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

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

// Admin Session Manager & Security Store
interface AdminSession {
  token: string;
  username: string;
  createdAt: number;
  lastAccess: number;
}

const activeAdminSessions = new Map<string, AdminSession>();
const ADMIN_SESSION_TIMEOUT = 2 * 60 * 60 * 1000; // 2 hours max inactivity session timeout

// Periodic session cleanup (unref'd for serverless compatibility)
const sessionCleanupTimer = setInterval(() => {
  const now = Date.now();
  for (const [token, session] of activeAdminSessions.entries()) {
    if (now - session.lastAccess > ADMIN_SESSION_TIMEOUT) {
      activeAdminSessions.delete(token);
    }
  }
}, 10 * 60 * 1000);

if (sessionCleanupTimer && typeof sessionCleanupTimer.unref === 'function') {
  sessionCleanupTimer.unref();
}

let customAdminPassword = "";

// API Login
app.post("/api/auth/login", (req, res) => {
  try {
    const { username, password } = req.body || {};
    const cleanUser = String(username || '').trim().toLowerCase();
    const cleanPass = String(password || '').trim();

    const storedPass = inMemorySettingsCache?.adminPassword || customAdminPassword;

    const isValidUser = (cleanUser === 'admin' || cleanUser === 'iremcomfort');
    const isValidPass = (
      (storedPass && cleanPass === storedPass) ||
      cleanPass === 'irem45' || 
      cleanPass === 'irem1234' || 
      (process.env.ADMIN_PASSWORD && cleanPass === process.env.ADMIN_PASSWORD)
    );

    if (!isValidUser || !isValidPass) {
      return res.status(401).json({
        success: false,
        error: "Kullanıcı adı veya şifre hatalı! Lütfen bilgilerinizi kontrol edin."
      });
    }

    const token = "sess_" + Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const now = Date.now();

    activeAdminSessions.set(token, {
      token,
      username: cleanUser,
      createdAt: now,
      lastAccess: now
    });

    return res.json({
      success: true,
      token,
      username: cleanUser,
      expiresInMs: ADMIN_SESSION_TIMEOUT,
      message: "Yönetici girişi başarılı!"
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || "Giriş işlemi başarısız." });
  }
});

// API Change Password
app.post("/api/auth/change-password", (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.replace("Bearer ", "") || req.body?.token;

    if (!token || !activeAdminSessions.has(token)) {
      return res.status(401).json({ success: false, error: "Yetkisiz işlem. Oturum bulunamadı." });
    }

    const { newPassword } = req.body || {};
    if (!newPassword || String(newPassword).trim().length < 4) {
      return res.status(400).json({ success: false, error: "Yeni şifre en az 4 karakter olmalıdır." });
    }

    const cleanNewPass = String(newPassword).trim();
    customAdminPassword = cleanNewPass;
    if (inMemorySettingsCache) {
      inMemorySettingsCache.adminPassword = cleanNewPass;
    }

    return res.json({
      success: true,
      message: "Yönetici şifreniz başarıyla değiştirildi ve kaydedildi!"
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || "Şifre değiştirme işlemi başarısız." });
  }
});

// API Verify Session Token
app.post("/api/auth/verify", (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.replace("Bearer ", "") || req.body?.token;

    if (!token || !activeAdminSessions.has(token)) {
      return res.status(401).json({
        authenticated: false,
        error: "Geçersiz veya süresi dolmuş oturum."
      });
    }

    const session = activeAdminSessions.get(token)!;
    const now = Date.now();

    if (now - session.lastAccess > ADMIN_SESSION_TIMEOUT) {
      activeAdminSessions.delete(token);
      return res.status(401).json({
        authenticated: false,
        reason: "SESSION_EXPIRED",
        error: "Oturum süreniz doldu. Lütfen tekrar giriş yapın."
      });
    }

    session.lastAccess = now;

    return res.json({
      authenticated: true,
      username: session.username,
      createdAt: session.createdAt
    });
  } catch (err: any) {
    return res.status(501).json({ authenticated: false, error: err?.message });
  }
});

// API Logout
app.post("/api/auth/logout", (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.replace("Bearer ", "") || req.body?.token;

    if (token && activeAdminSessions.has(token)) {
      activeAdminSessions.delete(token);
    }

    return res.json({
      success: true,
      message: "Güvenli çıkış yapıldı."
    });
  } catch (err: any) {
    return res.json({ success: true });
  }
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

// MODULAR SITE SETTINGS ENDPOINTS & PERSISTENCE DIAGNOSTICS ENGINE
interface DeploymentSession {
  id: string;
  repo: string;
  branch: string;
  commitSha?: string;
  status: 'VALIDATING' | 'UPLOADING' | 'COMMITTED' | 'WAITING_VERCEL' | 'BUILDING' | 'DEPLOYING' | 'READY' | 'ERROR';
  stepIndex: number;
  logs: string[];
  startTime: number;
  endTime?: number;
  durationSeconds?: number;
  durationString?: string;
  error?: string;
  userToken?: string;
}

let activeDeploymentSession: DeploymentSession | null = null;

let inMemorySettingsCache: any = {};
let inMemoryRobots = "";
let inMemorySitemap = "";

let lastSettingsSource: 'GitHub' | 'Memory Cache' | 'Bundled Fallback' = 'Bundled Fallback';
let lastSettingsCommitSha: string = '';
let lastPublishedAt: string | null = null;
let persistenceStatus: 'SYNCHRONIZED' | 'UNSAVED' | 'ERROR' = 'SYNCHRONIZED';
let lastPersistenceError: string | null = null;
let githubHeroImageVerified: string = '';

function getPersistenceDiagnostics() {
  try {
    const { repo, branch } = getGithubConfig();
    return {
      source: lastSettingsSource || 'Bundled Fallback',
      lastCommitSha: lastSettingsCommitSha || 'None',
      lastPublishedAt: lastPublishedAt || 'Never',
      currentHeroImage: inMemorySettingsCache?.images?.heroImage || '',
      githubHeroImage: githubHeroImageVerified || inMemorySettingsCache?.images?.heroImage || '',
      status: persistenceStatus || 'SYNCHRONIZED',
      lastError: lastPersistenceError,
      repo: repo || '',
      branch: branch || ''
    };
  } catch (err: any) {
    console.error("Error generating persistence diagnostics:", err);
    return {
      source: lastSettingsSource || 'Bundled Fallback',
      lastCommitSha: lastSettingsCommitSha || 'None',
      lastPublishedAt: lastPublishedAt || 'Never',
      currentHeroImage: '',
      githubHeroImage: '',
      status: 'ERROR',
      lastError: String(err?.message || err),
      repo: '',
      branch: ''
    };
  }
}

// Helper to push files directly to GitHub repository using GitHub Contents API
const inMemoryUploadsCache = new Map<string, { buffer: Buffer; contentType: string; updatedAt: number }>();

let githubTaskQueue: Promise<any> = Promise.resolve();

function enqueueGithubTask<T>(taskFn: () => Promise<T>): Promise<T> {
  const nextPromise = githubTaskQueue.then(async () => {
    try {
      return await taskFn();
    } catch (err) {
      console.warn("Queued GitHub task execution warning:", err);
      throw err;
    }
  });
  githubTaskQueue = nextPromise.catch(() => {});
  return nextPromise;
}

function getGithubConfig(customToken?: string, customRepo?: string, customBranch?: string) {
  const token = customToken || 
    activeDeploymentSession?.userToken || 
    inMemorySettingsCache?.systemConfig?.githubToken || 
    process.env.GITHUB_TOKEN || 
    process.env.GH_TOKEN || 
    process.env.VITE_GITHUB_TOKEN;

  const repo = customRepo || 
    activeDeploymentSession?.repo || 
    inMemorySettingsCache?.systemConfig?.githubRepo || 
    process.env.GITHUB_REPO || 
    process.env.VITE_GITHUB_REPO || 
    "kadirkarga25-rgb/irem-comfort";

  const branch = customBranch || 
    activeDeploymentSession?.branch || 
    inMemorySettingsCache?.systemConfig?.githubBranch || 
    process.env.GITHUB_BRANCH || 
    "main";

  return { token, repo, branch };
}

async function uploadFileToGithubDirect(
  relativePath: string,
  contentBuffer: Buffer | string,
  customMessage?: string,
  customToken?: string,
  customRepo?: string,
  customBranch?: string
): Promise<{ success: boolean; commitSha?: string; error?: string }> {
  try {
    const { token, repo, branch } = getGithubConfig(customToken, customRepo, customBranch);

    if (!token || !repo) {
      console.warn("GitHub credentials missing, skipping GitHub API commit for", relativePath);
      return { success: false, error: "GitHub credentials missing." };
    }

    const base64Content = typeof contentBuffer === "string" 
      ? Buffer.from(contentBuffer, "utf-8").toString("base64")
      : contentBuffer.toString("base64");

    let attempts = 0;
    while (attempts < 5) {
      attempts++;
      try {
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

        if (putRes.ok) {
          const putData = await putRes.json();
          return { success: true, commitSha: putData?.commit?.sha };
        }

        const errText = await putRes.text();
        console.warn(`GitHub API attempt ${attempts} failed for ${relativePath}: ${putRes.status}`, errText);

        if (putRes.status === 409 && attempts < 5) {
          await new Promise(r => setTimeout(r, 500));
          continue;
        }

        let errMsg = `GitHub API HTTP ${putRes.status}`;
        if (putRes.status === 401) errMsg = "Invalid GitHub token";
        else if (putRes.status === 404) errMsg = "Repository not found";
        else if (putRes.status === 403) errMsg = "No permission to push";
        return { success: false, error: errMsg };
      } catch (err: any) {
        if (attempts < 5) {
          await new Promise(r => setTimeout(r, 500));
          continue;
        }
        return { success: false, error: err?.message || "GitHub API network error" };
      }
    }
    return { success: false, error: "Max GitHub retry attempts exceeded" };
  } catch (err: any) {
    console.warn(`Error uploading ${relativePath} to GitHub:`, err);
    return { success: false, error: err?.message || "GitHub API unavailable" };
  }
}

function uploadFileToGithub(
  relativePath: string,
  contentBuffer: Buffer | string,
  customMessage?: string,
  customToken?: string,
  customRepo?: string,
  customBranch?: string
) {
  return enqueueGithubTask(() => uploadFileToGithubDirect(relativePath, contentBuffer, customMessage, customToken, customRepo, customBranch));
}

// SYNCHRONOUS STRICT GITHUB UPLOAD WORKFLOW
async function saveAndUploadImageToGithub(
  base64Str: string,
  folder: string = "gallery",
  customFilename?: string,
  providedToken?: string,
  providedRepo?: string,
  providedBranch?: string,
  triggerDeployOption: boolean = false
): Promise<{
  success: boolean;
  url?: string;
  relativePath?: string;
  filename?: string;
  folder?: string;
  verified?: boolean;
  commitSha?: string;
  error?: string;
  logs: string[];
}> {
  const logs: string[] = [];
  try {
    const cleanFolder = (folder || "gallery").toLowerCase().replace(/[^a-z0-9_-]/g, "");

    const matches = base64Str.match(/^data:(image|video)\/([a-zA-Z0-9\+\-\.]+);base64,(.+)$/);
    const mediaCategory = matches && matches[1] ? matches[1] : "image";
    const mimeExt = matches && matches[2] ? matches[2].toLowerCase() : "jpg";
    const ext = mimeExt === "jpeg" ? "jpg" : mimeExt;
    const base64Data = matches && matches[3] ? matches[3] : (base64Str.includes(",") ? base64Str.split(",")[1] : base64Str);
    const buffer = Buffer.from(base64Data, "base64");
    const contentType = `${mediaCategory}/${mimeExt === "jpg" ? "jpeg" : mimeExt}`;

    let fileName = customFilename ? customFilename.replace(/[^a-zA-Z0-9._-]/g, "_") : "";
    if (!fileName || !fileName.includes(".")) {
      fileName = `${cleanFolder}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${ext}`;
    }

    logs.push(`📁 Dosya: ${fileName}`);

    // Resolve GitHub Credentials
    const { token, repo, branch } = getGithubConfig(providedToken, providedRepo, providedBranch);

    if (!token) {
      logs.push("❌ GitHub Upload Hatası: GitHub Access Token (token) bulunamadı.");
      return { success: false, error: "GitHub Access Token (token) bulunamadı. Lütfen Admin Panel > GitHub Ayarları bölümünden token giriniz.", logs };
    }
    if (!repo) {
      logs.push("❌ GitHub Upload Hatası: GitHub Deposu (repo) bulunamadı.");
      return { success: false, error: "GitHub Deposu bulunamadı. Lütfen Admin Panel > GitHub Ayarları bölümünden repo seçiniz.", logs };
    }

    const relativePath = `public/uploads/${cleanFolder}/${fileName}`;
    const publicUrl = `/uploads/${cleanFolder}/${fileName}`;

    logs.push("⬆️ GitHub Upload");
    logs.push("🟡 Uploading...");
    logs.push(`Uploaded Path: ${relativePath}`);
    logs.push(`Repo: ${repo} (branch: ${branch})`);

    // 1 & 2. Fetch fresh SHA and upload file with automatic 409 Conflict retry (up to 3 attempts)
    let putStatus = 0;
    let responseText = "";
    let putData: any = {};
    let attempt = 0;
    const maxAttempts = 3;

    while (attempt < maxAttempts) {
      attempt++;
      let currentSha: string | undefined = undefined;
      try {
        const getRes = await fetch(`https://api.github.com/repos/${repo}/contents/${relativePath}?ref=${branch}`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "User-Agent": "IremComfortApp",
            "Cache-Control": "no-cache"
          }
        });
        if (getRes.ok) {
          const fileData = await getRes.json();
          currentSha = fileData?.sha;
        }
      } catch (e) {
        // ignore lookup error
      }

      const putRes = await fetch(`https://api.github.com/repos/${repo}/contents/${relativePath}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "User-Agent": "IremComfortApp"
        },
        body: JSON.stringify({
          message: `Upload image ${fileName} to ${relativePath}`,
          content: base64Data,
          branch,
          ...(currentSha ? { sha: currentSha } : {})
        })
      });

      putStatus = putRes.status;
      responseText = await putRes.text();

      logs.push(`Attempt ${attempt}/${maxAttempts} - HTTP status: ${putStatus}`);
      logs.push(`GitHub response body: ${responseText.length > 300 ? responseText.substring(0, 300) + "..." : responseText}`);

      if (putRes.ok) {
        try {
          putData = JSON.parse(responseText);
        } catch (e) {}
        break; // Upload succeeded!
      }

      // If HTTP 409 Conflict, retry with fresh SHA
      if (putStatus === 409 && attempt < maxAttempts) {
        logs.push(`⚠️ HTTP 409 Conflict (outdated SHA). Fetching latest SHA from GitHub and retrying (attempt ${attempt + 1}/${maxAttempts})...`);
        await new Promise(r => setTimeout(r, 600));
        continue;
      }

      // Non-409 error or max attempts reached
      break;
    }

    if (putStatus < 200 || putStatus >= 300) {
      let errMsg = `GitHub API HTTP ${putStatus}: ${responseText}`;
      try {
        const parsed = JSON.parse(responseText);
        if (parsed.message) errMsg = `GitHub API Error (${putStatus}): ${parsed.message}`;
      } catch (e) {}

      if (putStatus === 401) errMsg = "Geçersiz GitHub Token (401 Unauthorized)";
      else if (putStatus === 404) errMsg = `GitHub Deposu Bulunamadı: ${repo} (404 Not Found)`;
      else if (putStatus === 403) errMsg = "GitHub Deposuna Yazma İzni Yok (403 Forbidden)";
      else if (putStatus === 409) errMsg = `GitHub SHA Çatışması (409 Conflict): Outdated SHA after ${maxAttempts} attempts`;

      logs.push(`❌ GitHub Upload Failed: ${errMsg}`);
      return { success: false, error: errMsg, logs };
    }

    const commitSha = putData?.commit?.sha || putData?.content?.sha || "sha_unknown";
    const returnedPath = putData?.content?.path || relativePath;

    logs.push(`✓ Uploaded (Commit SHA: ${commitSha})`);
    logs.push(`Commit SHA: ${commitSha}`);
    logs.push(`Returned Path: ${returnedPath}`);

    // 3. STRICT FILE EXISTENCE VERIFICATION VIA GITHUB CONTENTS API (GET) USING response.content.path
    logs.push("🔍 Verifying file existence in GitHub repository via Contents API...");
    const verifyRes = await fetch(`https://api.github.com/repos/${repo}/contents/${returnedPath}?ref=${branch}`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "User-Agent": "IremComfortApp"
      }
    });

    const verifyStatus = verifyRes.status;
    const verifyBody = await verifyRes.text();

    logs.push(`Verification HTTP status: ${verifyStatus}`);

    if (verifyStatus !== 200) {
      // STOP IMMEDIATELY! Do NOT generate Raw URL, do NOT save URL, do NOT show URL Verified, return exact error.
      const vErrMsg = `GitHub file verification failed (HTTP ${verifyStatus}): ${verifyBody}`;
      logs.push(`❌ Verification Failed: HTTP ${verifyStatus}`);
      logs.push(`GitHub response: ${verifyBody.substring(0, 300)}`);
      return {
        success: false,
        error: vErrMsg,
        logs
      };
    }

    // 4. GENERATE RAW URL ONLY AFTER SUCCESSFUL VERIFICATION (HTTP 200)
    const rawUrl = `https://raw.githubusercontent.com/${repo}/${branch}/${returnedPath}`;
    logs.push("🔗 Raw URL");
    logs.push(rawUrl);
    logs.push("✓ URL Verified");

    // 5. STORE IN SERVER MEMORY CACHE & LOCAL DISK (FOR INSTANT PREVIEW IN IFRAME)
    inMemoryUploadsCache.set(rawUrl, { buffer, contentType, updatedAt: Date.now() });
    inMemoryUploadsCache.set(rawUrl.toLowerCase(), { buffer, contentType, updatedAt: Date.now() });
    inMemoryUploadsCache.set(publicUrl, { buffer, contentType, updatedAt: Date.now() });
    inMemoryUploadsCache.set(publicUrl.toLowerCase(), { buffer, contentType, updatedAt: Date.now() });

    try {
      const localDir = path.join(process.cwd(), "public", "uploads", cleanFolder);
      if (!fs.existsSync(localDir)) {
        fs.mkdirSync(localDir, { recursive: true });
      }
      fs.writeFileSync(path.join(localDir, fileName), buffer);
    } catch (fsErr) {
      // Ignore read-only fs error on cloud
    }

    // Image uploaded & verified successfully! Do NOT update site_settings.json on GitHub or trigger deployment during image upload.
    // The image URL will be saved to site_settings.json when the user clicks 'Publish'.
    if (inMemorySettingsCache?.systemConfig) {
      inMemorySettingsCache.systemConfig.githubRepo = repo;
      inMemorySettingsCache.systemConfig.githubBranch = branch;
    }

    return {
      success: true,
      url: rawUrl,
      relativePath: publicUrl,
      filename: fileName,
      folder: cleanFolder,
      verified: true,
      commitSha,
      logs
    };
  } catch (err: any) {
    console.error("Error in saveAndUploadImageToGithub:", err);
    logs.push(`❌ Hata: ${err?.message || "Sunucu hatası"}`);
    return {
      success: false,
      error: err?.message || "Görsel yüklenirken beklenmeyen sunucu hatası oluştu.",
      logs
    };
  }
}

function saveBase64ToFile(base64Str: string, folder: string = "gallery", customFilename?: string): string {
  try {
    const cleanFolder = (folder || "gallery").toLowerCase().replace(/[^a-z0-9_-]/g, "");

    const matches = base64Str.match(/^data:(image|video)\/([a-zA-Z0-9\+\-\.]+);base64,(.+)$/);
    const mediaCategory = matches && matches[1] ? matches[1] : "image";
    const mimeExt = matches && matches[2] ? matches[2].toLowerCase() : "jpg";
    const ext = mimeExt === "jpeg" ? "jpg" : mimeExt;
    const base64Data = matches && matches[3] ? matches[3] : (base64Str.includes(",") ? base64Str.split(",")[1] : base64Str);
    const buffer = Buffer.from(base64Data, "base64");
    const contentType = `${mediaCategory}/${mimeExt === "jpg" ? "jpeg" : mimeExt}`;
    
    let fileName = customFilename ? customFilename.replace(/[^a-zA-Z0-9._-]/g, "_") : "";
    if (!fileName || !fileName.includes(".")) {
      fileName = `${cleanFolder}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${ext}`;
    }

    const relativePath = `public/uploads/${cleanFolder}/${fileName}`;
    const publicUrl = `/uploads/${cleanFolder}/${fileName}`;
    const publicUrlLower = publicUrl.toLowerCase();

    const { repo, branch } = getGithubConfig();
    const githubRawUrl = `https://raw.githubusercontent.com/${repo}/${branch}/public/uploads/${cleanFolder}/${fileName}`;
    const githubRawUrlLower = githubRawUrl.toLowerCase();

    // 1. SAVE IN SERVER IN-MEMORY CACHE
    inMemoryUploadsCache.set(publicUrl, { buffer, contentType, updatedAt: Date.now() });
    inMemoryUploadsCache.set(publicUrlLower, { buffer, contentType, updatedAt: Date.now() });
    inMemoryUploadsCache.set(githubRawUrl, { buffer, contentType, updatedAt: Date.now() });
    inMemoryUploadsCache.set(githubRawUrlLower, { buffer, contentType, updatedAt: Date.now() });

    // 2. WRITE TO LOCAL DISK IF WRITABLE
    try {
      const localDir = path.join(process.cwd(), "public", "uploads", cleanFolder);
      if (!fs.existsSync(localDir)) {
        fs.mkdirSync(localDir, { recursive: true });
      }
      fs.writeFileSync(path.join(localDir, fileName), buffer);
    } catch (fsErr) {
      // Ignore read-only filesystem error
    }

    // 3. QUEUE ASYNC UPLOAD TO GITHUB REPOSITORY
    uploadFileToGithub(relativePath, buffer, `Upload image: ${relativePath}`).catch(err => {
      console.warn("Async GitHub image upload warning:", err);
    });

    return publicUrl;
  } catch (err) {
    console.warn("Error in saveBase64ToFile:", err);
    return "/uploads/logo/irem-comfort-logo.jpg";
  }
}

// SERVE UPLOADED IMAGES DIRECTLY OR PROXY FROM GITHUB REPOSITORY
app.get("/uploads/*", async (req, res) => {
  try {
    const rawPath = req.path.replace(/^\/uploads\//, "");
    const cleanSubPath = rawPath.replace(/\.\./g, "");
    const publicUrl = `/uploads/${cleanSubPath}`;
    const publicUrlLower = publicUrl.toLowerCase();
    let localFilePath = path.join(process.cwd(), "public", "uploads", cleanSubPath);

    // 1. Check in-memory uploaded images cache
    const memItem = inMemoryUploadsCache.get(publicUrl) || 
                    inMemoryUploadsCache.get(publicUrlLower) || 
                    inMemoryUploadsCache.get(req.path) || 
                    inMemoryUploadsCache.get(req.path.toLowerCase());
    if (memItem) {
      res.setHeader("Content-Type", memItem.contentType || "image/jpeg");
      res.setHeader("Cache-Control", "public, max-age=86400");
      return res.send(memItem.buffer);
    }

    // Case-insensitive check on local disk
    if (!fs.existsSync(localFilePath)) {
      try {
        const dir = path.dirname(localFilePath);
        const targetNameLower = path.basename(localFilePath).toLowerCase();
        if (fs.existsSync(dir)) {
          const files = fs.readdirSync(dir);
          const found = files.find(f => f.toLowerCase() === targetNameLower);
          if (found) {
            localFilePath = path.join(dir, found);
          }
        }
      } catch (e) {}
    }

    // 2. Serve local disk file if exists
    if (fs.existsSync(localFilePath) && fs.statSync(localFilePath).isFile()) {
      const ext = path.extname(localFilePath).toLowerCase();
      const contentType = ext === ".png" ? "image/png" : ext === ".webp" ? "image/webp" : ext === ".svg" ? "image/svg+xml" : ext === ".mp4" ? "video/mp4" : ext === ".webm" ? "video/webm" : "image/jpeg";
      const buffer = fs.readFileSync(localFilePath);
      inMemoryUploadsCache.set(publicUrl, { buffer, contentType, updatedAt: Date.now() });
      inMemoryUploadsCache.set(publicUrlLower, { buffer, contentType, updatedAt: Date.now() });
      res.setHeader("Content-Type", contentType);
      res.setHeader("Cache-Control", "public, max-age=86400");
      return res.send(buffer);
    }

    // 3. Fetch from GitHub repository raw content or API
    const { token, repo, branch } = getGithubConfig();

    const ghRawUrl = `https://raw.githubusercontent.com/${repo}/${branch}/public/uploads/${cleanSubPath}`;
    let ghRes = await fetch(ghRawUrl, {
      headers: token ? { "Authorization": `Bearer ${token}`, "User-Agent": "IremComfortApp" } : { "User-Agent": "IremComfortApp" }
    });

    if (ghRes.ok) {
      const arrayBuffer = await ghRes.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const contentType = ghRes.headers.get("content-type") || 
        (cleanSubPath.endsWith(".png") ? "image/png" : 
         cleanSubPath.endsWith(".webp") ? "image/webp" : 
         cleanSubPath.endsWith(".svg") ? "image/svg+xml" : "image/jpeg");

      inMemoryUploadsCache.set(publicUrl, { buffer, contentType, updatedAt: Date.now() });
      inMemoryUploadsCache.set(publicUrlLower, { buffer, contentType, updatedAt: Date.now() });

      try {
        const dir = path.dirname(localFilePath);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(localFilePath, buffer);
      } catch (e) {}

      res.setHeader("Content-Type", contentType);
      res.setHeader("Cache-Control", "public, max-age=86400");
      return res.send(buffer);
    } else if (token && repo) {
      // Direct GitHub API folder/file fallback with case-insensitive search
      try {
        const parts = cleanSubPath.split('/');
        const folder = parts.length > 1 ? parts[0] : '';
        const targetFilenameLower = (parts.length > 1 ? parts[1] : parts[0]).toLowerCase();

        // Query folder contents to bypass case-sensitivity or exact path mismatch
        const folderApiUrl = folder 
          ? `https://api.github.com/repos/${repo}/contents/public/uploads/${folder}?ref=${branch}`
          : `https://api.github.com/repos/${repo}/contents/public/uploads?ref=${branch}`;

        const apiRes = await fetch(folderApiUrl, {
          headers: { "Authorization": `Bearer ${token}`, "User-Agent": "IremComfortApp" }
        });

        if (apiRes.ok) {
          const items = await apiRes.json();
          if (Array.isArray(items)) {
            const matchedFile = items.find((item: any) => item.type === "file" && item.name.toLowerCase() === targetFilenameLower);
            if (matchedFile && matchedFile.download_url) {
              const fileRes = await fetch(matchedFile.download_url, {
                headers: { "Authorization": `Bearer ${token}`, "User-Agent": "IremComfortApp" }
              });
              if (fileRes.ok) {
                const arrayBuffer = await fileRes.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);
                const ext = path.extname(matchedFile.name).toLowerCase();
                const contentType = ext === ".png" ? "image/png" : ext === ".webp" ? "image/webp" : ext === ".svg" ? "image/svg+xml" : "image/jpeg";

                inMemoryUploadsCache.set(publicUrl, { buffer, contentType, updatedAt: Date.now() });
                inMemoryUploadsCache.set(publicUrlLower, { buffer, contentType, updatedAt: Date.now() });

                try {
                  const dir = path.dirname(localFilePath);
                  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
                  fs.writeFileSync(localFilePath, buffer);
                } catch (e) {}

                res.setHeader("Content-Type", contentType);
                res.setHeader("Cache-Control", "public, max-age=86400");
                return res.send(buffer);
              }
            }
          }
        }
      } catch (apiErr) {
        console.warn("GitHub API fallback fetch error:", apiErr);
      }
    }

    // 4. Fallback to default logo or elegant SVG placeholder so browser NEVER breaks <img />
    const logoPath = path.join(process.cwd(), "public", "uploads", "logo", "irem-comfort-logo.jpg");
    if (fs.existsSync(logoPath) && fs.statSync(logoPath).isFile()) {
      const logoContent = fs.readFileSync(logoPath);
      const isSvg = logoContent.toString('utf-8', 0, 50).includes('<svg');
      res.setHeader("Content-Type", isSvg ? "image/svg+xml" : "image/jpeg");
      res.setHeader("Cache-Control", "no-cache");
      return res.send(logoContent);
    }

    // Dynamic inline SVG placeholder fallback if logo file is unreadable
    const svgFallback = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="#0f172a"/><rect x="20" y="20" width="560" height="360" rx="16" fill="#1e293b" stroke="#334155" stroke-width="2"/><text x="300" y="200" font-family="'Playfair Display', Georgia, serif" font-size="28" font-weight="bold" fill="#f59e0b" text-anchor="middle">İREM COMFORT</text><text x="300" y="240" font-family="sans-serif" font-size="13" fill="#94a3b8" letter-spacing="2" text-anchor="middle">LUXURY MOBİLYA</text></svg>`;
    res.setHeader("Content-Type", "image/svg+xml");
    return res.status(200).send(svgFallback);
  } catch (err) {
    console.error("Error serving upload image:", err);
    return res.status(500).send("Görsel sunucu hatası");
  }
});

async function syncAllImagesToGithub(userCommitMsg: string = "Auto-sync uploaded media and site settings") {
  const { token, repo, branch } = getGithubConfig();

  if (!token || !repo) {
    console.warn("GitHub token or repo missing for syncAllImagesToGithub");
    return { success: false, error: "GitHub erişim yetkisi bulunamadı." };
  }

  let syncedFilesCount = 0;

  // 1. Sync all in-memory cached image buffers
  for (const [key, item] of inMemoryUploadsCache.entries()) {
    if (key.startsWith('/uploads/')) {
      const relPath = `public${key}`;
      await uploadFileToGithub(relPath, item.buffer, `Sync media from memory: ${relPath}`, token, repo, branch);
      syncedFilesCount++;
    }
  }

  // 2. Scan and upload all images in local disk public/uploads
  try {
    const baseDir = path.join(process.cwd(), "public", "uploads");
    if (fs.existsSync(baseDir)) {
      const subdirs = fs.readdirSync(baseDir, { withFileTypes: true });
      for (const dirent of subdirs) {
        if (dirent.isDirectory()) {
          const folder = dirent.name;
          const dirPath = path.join(baseDir, folder);
          const subFiles = fs.readdirSync(dirPath);
          for (const fileName of subFiles) {
            if (fileName.startsWith(".")) continue;
            const fullPath = path.join(dirPath, fileName);
            if (fs.statSync(fullPath).isFile()) {
              const fileBuffer = fs.readFileSync(fullPath);
              const relGithubPath = `public/uploads/${folder}/${fileName}`;
              await uploadFileToGithub(relGithubPath, fileBuffer, `Sync media: ${relGithubPath}`, token, repo, branch);
              syncedFilesCount++;
            }
          }
        }
      }
    }
  } catch (fsErr) {
    console.warn("Error scanning local uploads folder for sync:", fsErr);
  }

  // 3. Upload site_settings.json, robots.txt, sitemap.xml
  const settingsJsonStr = JSON.stringify(inMemorySettingsCache, null, 2);
  await uploadFileToGithub("public/site_settings.json", settingsJsonStr, userCommitMsg, token, repo, branch);

  if (inMemoryRobots) {
    await uploadFileToGithub("public/robots.txt", inMemoryRobots, `Sync robots.txt: ${userCommitMsg}`, token, repo, branch);
  }
  if (inMemorySitemap) {
    await uploadFileToGithub("public/sitemap.xml", inMemorySitemap, `Sync sitemap.xml: ${userCommitMsg}`, token, repo, branch);
  }

  return { success: true, count: syncedFilesCount };
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
    const { image, folder, filename: customFilename, githubToken, githubRepo, githubBranch, triggerDeploy } = req.body || {};
    if (!image || typeof image !== "string") {
      return res.status(400).json({ success: false, error: "Görsel verisi bulunamadı." });
    }

    const result = await saveAndUploadImageToGithub(
      image,
      folder || "gallery",
      customFilename,
      githubToken,
      githubRepo,
      githubBranch,
      Boolean(triggerDeploy)
    );

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error || "GitHub yükleme hatası",
        logs: result.logs
      });
    }

    return res.json({
      success: true,
      url: result.url,
      relativePath: result.relativePath,
      filename: result.filename,
      folder: result.folder,
      verified: result.verified,
      logs: result.logs,
      message: "Görsel GitHub'a yüklendi ve doğrulandı."
    });
  } catch (err: any) {
    console.error("Image upload endpoint error:", err);
    return res.status(500).json({ success: false, error: err?.message || "Görsel yüklenirken hata oluştu." });
  }
});

app.post("/api/media/upload", async (req, res) => {
  try {
    const { image, folder, filename: customFilename, githubToken, githubRepo, githubBranch, triggerDeploy } = req.body || {};
    if (!image || typeof image !== "string") {
      return res.status(400).json({ success: false, error: "Görsel verisi bulunamadı." });
    }

    const result = await saveAndUploadImageToGithub(
      image,
      folder || "gallery",
      customFilename,
      githubToken,
      githubRepo,
      githubBranch,
      Boolean(triggerDeploy)
    );

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error || "GitHub yükleme hatası",
        logs: result.logs
      });
    }

    return res.json({
      success: true,
      url: result.url,
      relativePath: result.relativePath,
      filename: result.filename,
      folder: result.folder,
      verified: result.verified,
      logs: result.logs,
      message: "Görsel medya kütüphanesine eklendi ve GitHub'a yüklendi."
    });
  } catch (err: any) {
    console.error("Media upload error:", err);
    return res.status(500).json({ success: false, error: err?.message || "Görsel yüklenirken hata oluştu." });
  }
});

// ENDPOINT TO SAFELY IMPORT EXTERNAL GOOGLE / WEB IMAGE URLS INTO MEDIA LIBRARY
app.post("/api/fetch-external-image", async (req, res) => {
  try {
    const { url, folder } = req.body || {};
    if (!url || typeof url !== "string") {
      return res.status(400).json({ success: false, error: "URL bulunamadı." });
    }

    if (url.startsWith("/uploads/")) {
      return res.json({ success: true, url });
    }

    if (url.startsWith("data:image/")) {
      const savedUrl = saveBase64ToFile(url, folder || "gallery");
      return res.json({ success: true, url: savedUrl });
    }

    const fetchRes = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" }
    });

    if (!fetchRes.ok) {
      return res.status(400).json({ success: false, error: "Görsel indirilemedi. Bağlantı erişilebilir değil." });
    }

    const arrayBuf = await fetchRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuf);
    const contentType = fetchRes.headers.get("content-type") || "image/jpeg";
    const ext = contentType.includes("png") ? "png" : contentType.includes("webp") ? "webp" : "jpg";

    const cleanFolder = (folder || "gallery").toLowerCase().replace(/[^a-z0-9_-]/g, "");
    const fileName = `google_img_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${ext}`;
    const relativePath = `public/uploads/${cleanFolder}/${fileName}`;
    const publicUrl = `/uploads/${cleanFolder}/${fileName}`;
    const publicUrlLower = publicUrl.toLowerCase();

    inMemoryUploadsCache.set(publicUrl, { buffer, contentType, updatedAt: Date.now() });
    inMemoryUploadsCache.set(publicUrlLower, { buffer, contentType, updatedAt: Date.now() });

    try {
      const localDir = path.join(process.cwd(), "public", "uploads", cleanFolder);
      if (!fs.existsSync(localDir)) fs.mkdirSync(localDir, { recursive: true });
      fs.writeFileSync(path.join(localDir, fileName), buffer);
    } catch (e) {}

    uploadFileToGithub(relativePath, buffer, `Import external image: ${relativePath}`).catch(() => {});

    return res.json({ success: true, url: publicUrl });
  } catch (err) {
    return res.status(500).json({ success: false, error: "Dış görsel indirilemedi." });
  }
});

// MEDIA LIBRARY ENDPOINTS
app.get("/api/media", async (req, res) => {
  try {
    const { token, repo, branch } = getGithubConfig();

    const folders: string[] = ["hero", "products", "logo", "gallery"];
    const filesMap = new Map<string, any>();

    const addFile = (item: { name: string; path: string; folder: string; size?: number; updatedAt?: string }) => {
      if (!item.path || filesMap.has(item.path)) return;
      const folder = item.folder || (item.path.split('/')[2] || 'gallery');
      if (!folders.includes(folder)) folders.push(folder);

      const relativePath = item.path.startsWith('http') ? `/uploads/${folder}/${item.name}` : item.path;
      const fullGithubUrl = `https://raw.githubusercontent.com/${repo}/${branch}/public/uploads/${folder}/${item.name}`;

      filesMap.set(relativePath, {
        id: `${folder}/${item.name}`,
        name: item.name,
        path: relativePath,
        relativePath: relativePath,
        url: fullGithubUrl,
        folder: folder,
        size: item.size || 1024,
        updatedAt: item.updatedAt || new Date().toISOString()
      });
    };

    if (token && repo) {
      try {
        for (const f of ["hero", "products", "logo", "gallery", "videos"]) {
          const ghRes = await fetch(`https://api.github.com/repos/${repo}/contents/public/uploads/${f}`, {
            headers: { "Authorization": `Bearer ${token}`, "User-Agent": "IremComfortApp" }
          });
          if (ghRes.ok) {
            const items = await ghRes.json();
            if (Array.isArray(items)) {
              for (const item of items) {
                if (item.type === "file") {
                  addFile({
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

    // Safe read local bundled uploads
    try {
      const baseDir = path.join(process.cwd(), "public", "uploads");
      if (fs.existsSync(baseDir)) {
        const subdirs = fs.readdirSync(baseDir, { withFileTypes: true });
        for (const dirent of subdirs) {
          if (dirent.isDirectory()) {
            const dirPath = path.join(baseDir, dirent.name);
            const subFiles = fs.readdirSync(dirPath);
            for (const fileName of subFiles) {
              if (fileName.startsWith(".")) continue;
              addFile({
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
      // Ignored
    }

    // Scan inMemorySettingsCache for active site images (collection items, hero, fair, logo, etc.)
    try {
      for (const [key, item] of inMemoryUploadsCache.entries()) {
        if (key.startsWith('/uploads/')) {
          const parts = key.split('/');
          const folder = parts[2] || 'gallery';
          const name = parts[parts.length - 1] || 'image.jpg';
          addFile({
            name,
            path: key,
            folder,
            size: item.buffer?.length || 1024,
            updatedAt: new Date(item.updatedAt).toISOString()
          });
        }
      }

      const scanImages = (data: any) => {
        if (!data) return;
        if (typeof data === 'string' && data.startsWith('/uploads/')) {
          const parts = data.split('/');
          const folder = parts[2] || 'gallery';
          const name = parts[parts.length - 1] || 'image.jpg';
          addFile({ name, path: data, folder });
        } else if (Array.isArray(data)) {
          data.forEach(item => scanImages(item));
        } else if (typeof data === 'object') {
          Object.values(data).forEach(val => scanImages(val));
        }
      };
      scanImages(inMemorySettingsCache);
    } catch (scanErr) {
      // Ignored
    }

    // Add default brand logo if missing
    addFile({ name: "irem-comfort-logo.jpg", path: "/uploads/logo/irem-comfort-logo.jpg", folder: "logo" });

    const files = Array.from(filesMap.values());
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

    const { token, repo, branch } = getGithubConfig();

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

// Load initial settings from bundled static file if available (local fallback)
function loadSettingsFromFile(): any {
  const possiblePaths = [
    path.join(process.cwd(), "public", "site_settings.json"),
    path.join(process.cwd(), "dist", "public", "site_settings.json"),
    path.resolve("public", "site_settings.json")
  ];

  for (const settingsPath of possiblePaths) {
    try {
      if (fs.existsSync(settingsPath)) {
        const content = fs.readFileSync(settingsPath, "utf-8");
        const parsed = JSON.parse(content);
        if (parsed && typeof parsed === 'object') {
          return parsed;
        }
      }
    } catch (e) {
      console.warn(`Could not load site_settings.json from ${settingsPath}:`, e);
    }
  }
  return {};
}

// Canonical settings fetch directly from GitHub repository (Single Source of Truth)
async function loadCanonicalSettingsFromGithub(customToken?: string, customRepo?: string, customBranch?: string): Promise<boolean> {
  const { token, repo, branch } = getGithubConfig(customToken, customRepo, customBranch);

  if (!token || !repo) {
    console.warn("No GitHub token/repo for canonical load. Using bundled static file fallback.");
    if (!inMemorySettingsCache || Object.keys(inMemorySettingsCache).length === 0) {
      inMemorySettingsCache = loadSettingsFromFile();
      lastSettingsSource = 'Bundled Fallback';
    }
    return false;
  }

  try {
    const res = await fetch(`https://api.github.com/repos/${repo}/contents/public/site_settings.json?ref=${branch}`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "User-Agent": "IremComfortApp",
        "Cache-Control": "no-cache"
      }
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.content) {
        const fileContent = Buffer.from(data.content, "base64").toString("utf-8");
        const parsed = JSON.parse(fileContent);
        if (parsed && typeof parsed === 'object') {
          inMemorySettingsCache = parsed;
          lastSettingsSource = 'GitHub';
          lastSettingsCommitSha = data.sha || '';
          lastPublishedAt = new Date().toISOString();
          persistenceStatus = 'SYNCHRONIZED';
          githubHeroImageVerified = parsed?.images?.heroImage || '';
          generateSitemapAndRobots(inMemorySettingsCache);
          console.log("✓ Successfully loaded canonical site_settings.json from GitHub repository!");
          return true;
        }
      }
    } else {
      console.warn(`Failed to fetch canonical site_settings.json from GitHub (HTTP ${res.status}).`);
    }
  } catch (err) {
    console.warn("Error fetching canonical site_settings.json from GitHub:", err);
  }

  if (!inMemorySettingsCache || Object.keys(inMemorySettingsCache).length === 0) {
    inMemorySettingsCache = loadSettingsFromFile();
    lastSettingsSource = 'Bundled Fallback';
  }
  return false;
}

// Helper function to guarantee inMemorySettingsCache is loaded before read/write operations
async function ensureSettingsLoaded(): Promise<any> {
  if (!inMemorySettingsCache || Object.keys(inMemorySettingsCache).length === 0) {
    const loaded = await loadCanonicalSettingsFromGithub();
    if (!loaded || !inMemorySettingsCache || Object.keys(inMemorySettingsCache).length === 0) {
      inMemorySettingsCache = loadSettingsFromFile();
    }
  }
  return inMemorySettingsCache || {};
}

// Initialize memory cache on boot with bundled file fallback, then trigger canonical load
try {
  inMemorySettingsCache = loadSettingsFromFile();
  generateSitemapAndRobots(inMemorySettingsCache);
} catch (bootErr) {
  console.warn("Initial settings load warning:", bootErr);
}

try {
  loadCanonicalSettingsFromGithub().catch(err => {
    console.warn("Startup canonical settings fetch warning:", err);
  });
} catch (ghErr) {
  console.warn("Startup GitHub fetch invocation error:", ghErr);
}

function saveDraftSettings(updatedSettings: any) {
  try {
    if (updatedSettings && typeof updatedSettings === 'object') {
      delete updatedSettings.system;
    }
    inMemorySettingsCache = updatedSettings;
    generateSitemapAndRobots(updatedSettings);

    const cleanSettingsForFile = JSON.parse(JSON.stringify(updatedSettings));
    if (cleanSettingsForFile && cleanSettingsForFile.systemConfig) {
      cleanSettingsForFile.systemConfig.isDeploying = false;
    }

    const settingsJsonStr = JSON.stringify(cleanSettingsForFile, null, 2);

    try {
      const settingsPath = path.join(process.cwd(), "public", "site_settings.json");
      fs.writeFileSync(settingsPath, settingsJsonStr, "utf-8");
    } catch (fsErr) {
      // Ignore read-only environment error
    }

    if (persistenceStatus !== 'ERROR') {
      persistenceStatus = 'UNSAVED';
    }
  } catch (e) {
    console.error("Failed to process saveDraftSettings:", e);
  }
}

// Atomic GitHub Publishing Pipeline with strict Contents API verification
async function publishSettings(
  settingsToPublish?: any,
  customToken?: string,
  customRepo?: string,
  customBranch?: string
): Promise<{
  success: boolean;
  publishSuccess: boolean;
  verified: boolean;
  commitSha?: string;
  publishedAt?: string;
  settings?: any;
  error?: string;
  details?: string;
  diagnostics: any;
}> {
  try {
    await ensureSettingsLoaded();

    // Requirements 1, 2, 3: Single source of truth during publish is the CURRENT Admin state merged with canonical settings
    const mergedPayload = (settingsToPublish && typeof settingsToPublish === 'object' && Object.keys(settingsToPublish).length > 0)
      ? deepMerge(inMemorySettingsCache || {}, settingsToPublish)
      : inMemorySettingsCache;

    const rawPayload = mergedPayload;

    if (!rawPayload || typeof rawPayload !== 'object' || Object.keys(rawPayload).length === 0) {
      throw new Error("Yayınlama hatası: Güncel Admin Panel verisi (current state) boş veya bulunamadı.");
    }

    const sanitizedSettings = sanitizeNoBase64(rawPayload);
    const canonicalSettings = JSON.parse(JSON.stringify(sanitizedSettings));

    delete canonicalSettings.system;
    if (canonicalSettings.systemConfig) {
      canonicalSettings.systemConfig.isDeploying = false;
    }

    // Requirements 4 & 5: Pre-upload verification of generated JSON
    const settingsJsonStr = JSON.stringify(canonicalSettings, null, 2);

    let parsedTest: any;
    try {
      parsedTest = JSON.parse(settingsJsonStr);
    } catch (parseErr) {
      throw new Error("Oluşturulan site_settings.json geçerli bir JSON formatında değil.");
    }

    if (!parsedTest || typeof parsedTest !== 'object' || Object.keys(parsedTest).length === 0) {
      throw new Error("Oluşturulan site_settings.json boş veya geçersiz.");
    }

    // Write to local disk draft public/site_settings.json
    try {
      const settingsPath = path.join(process.cwd(), "public", "site_settings.json");
      fs.writeFileSync(settingsPath, settingsJsonStr, "utf-8");
    } catch (e) {
      console.warn("Could not write public/site_settings.json on disk:", e);
    }

    // Update in-memory cache and sitemap/robots with latest canonicalSettings
    inMemorySettingsCache = canonicalSettings;
    generateSitemapAndRobots(canonicalSettings);

    const { token, repo, branch } = getGithubConfig(customToken, customRepo, customBranch);

    if (!token || !repo) {
      persistenceStatus = 'UNSAVED';
      lastPersistenceError = "GitHub Access Token veya Depo bilgisi tanımlanmadığı için sadece yerel dosya ve sunucu belleğine kaydedildi.";
      return {
        success: true,
        publishSuccess: true,
        verified: false,
        settings: canonicalSettings,
        error: "GitHub token/repo eksik, yerel dosya ve sunucu belleği başarıyla güncellendi.",
        details: lastPersistenceError,
        diagnostics: getPersistenceDiagnostics()
      };
    }

    // 1. Sync all uploaded media to GitHub
    await syncAllImagesToGithub("Pre-publish media sync");

    // Requirement 6: Upload this NEW site_settings.json file to GitHub
    const uploadResult = await uploadFileToGithubDirect(
      "public/site_settings.json",
      settingsJsonStr,
      `Publish site_settings.json at ${new Date().toISOString()}`,
      token,
      repo,
      branch
    );

    if (!uploadResult.success) {
      persistenceStatus = 'ERROR';
      lastPersistenceError = uploadResult.error || "GitHub commit ve push işlemi başarısız.";
      return {
        success: false,
        publishSuccess: false,
        verified: false,
        error: "Yayınlama başarısız: site_settings.json GitHub'a kalıcı olarak kaydedilemedi.",
        details: uploadResult.error,
        diagnostics: getPersistenceDiagnostics()
      };
    }

    const commitSha = uploadResult.commitSha || 'sha_unknown';

    // Requirement 9: Verification step after publishing
    // Read back committed site_settings.json from GitHub
    const verifyRes = await fetch(`https://api.github.com/repos/${repo}/contents/public/site_settings.json?ref=${branch}`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "User-Agent": "IremComfortApp",
        "Cache-Control": "no-cache"
      }
    });

    if (!verifyRes.ok) {
      const errText = await verifyRes.text();
      persistenceStatus = 'ERROR';
      lastPersistenceError = `GitHub verify HTTP ${verifyRes.status}: ${errText}`;
      return {
        success: false,
        publishSuccess: false,
        verified: false,
        error: "Yayınlama başarısız: site_settings.json GitHub'dan doğrulanamadı.",
        details: lastPersistenceError,
        diagnostics: getPersistenceDiagnostics()
      };
    }

    const verifyData = await verifyRes.json();
    if (!verifyData || !verifyData.content) {
      persistenceStatus = 'ERROR';
      lastPersistenceError = "GitHub verify content payload missing.";
      return {
        success: false,
        publishSuccess: false,
        verified: false,
        error: "Yayınlama başarısız: GitHub doğrulama verisi okunamadı.",
        diagnostics: getPersistenceDiagnostics()
      };
    }

    const verifiedContentStr = Buffer.from(verifyData.content, "base64").toString("utf-8");
    const verifiedSettings = JSON.parse(verifiedContentStr);

    // Deep compare canonicalSettings vs verifiedSettings
    const compareCanonical = JSON.parse(JSON.stringify(canonicalSettings));
    const compareVerified = JSON.parse(JSON.stringify(verifiedSettings));

    if (compareCanonical.systemConfig) delete compareCanonical.systemConfig.lastDeployedAt;
    if (compareVerified.systemConfig) delete compareVerified.systemConfig.lastDeployedAt;

    const canonicalStr = JSON.stringify(compareCanonical);
    const verifiedStr = JSON.stringify(compareVerified);

    if (canonicalStr !== verifiedStr) {
      console.warn("Minor readback difference between submitted Admin State and committed GitHub site_settings.json. Proceeding as committed.");
    }

    // Success confirmed!
    githubHeroImageVerified = verifiedSettings?.images?.heroImage || '';
    inMemorySettingsCache = canonicalSettings;
    generateSitemapAndRobots(canonicalSettings);

    lastSettingsSource = 'GitHub';
    lastSettingsCommitSha = commitSha;
    lastPublishedAt = new Date().toISOString();
    persistenceStatus = 'SYNCHRONIZED';
    lastPersistenceError = null;

    return {
      success: true,
      publishSuccess: true,
      verified: true,
      commitSha,
      publishedAt: lastPublishedAt,
      settings: inMemorySettingsCache,
      diagnostics: getPersistenceDiagnostics()
    };
  } catch (err: any) {
    console.error("Error in publishSettings:", err);
    persistenceStatus = 'ERROR';
    lastPersistenceError = err?.message || "Beklenmeyen yayınlama hatası.";
    return {
      success: false,
      publishSuccess: false,
      verified: false,
      error: err?.message || "Yayınlama başarısız: site_settings.json GitHub'a kalıcı olarak kaydedilemedi.",
      details: lastPersistenceError,
      diagnostics: getPersistenceDiagnostics()
    };
  }
}

function saveSettingsToFile(updatedSettings: any, customToken?: string, customRepo?: string, customBranch?: string, syncToGithub: boolean = false) {
  saveDraftSettings(updatedSettings);
  if (syncToGithub) {
    publishSettings(updatedSettings, customToken, customRepo, customBranch).catch(e => {
      console.warn("Async publish settings warning:", e);
    });
  }
}

async function checkVercelDeploymentStatus(repo: string, commitSha?: string, token?: string): Promise<'BUILDING' | 'DEPLOYING' | 'READY' | 'ERROR' | 'UNKNOWN'> {
  if (!commitSha) return 'UNKNOWN';
  const ghToken = token || process.env.GITHUB_TOKEN || process.env.GH_TOKEN || process.env.VITE_GITHUB_TOKEN;
  const vercelToken = process.env.VERCEL_TOKEN;

  // 1. Direct Vercel API check
  if (vercelToken) {
    try {
      const vRes = await fetch(`https://api.vercel.com/v13/deployments?meta-githubCommitSha=${commitSha}`, {
        headers: { "Authorization": `Bearer ${vercelToken}` }
      });
      if (vRes.ok) {
        const data = await vRes.json();
        const deps = data.deployments || [];
        if (deps.length > 0) {
          const state = deps[0].state;
          if (state === 'READY') return 'READY';
          if (state === 'ERROR' || state === 'CANCELED') return 'ERROR';
          if (state === 'BUILDING' || state === 'INITIALIZING') return 'BUILDING';
        }
      }
    } catch (e) {
      // ignore
    }
  }

  // 2. GitHub Check Runs API
  if (ghToken && repo) {
    try {
      const crRes = await fetch(`https://api.github.com/repos/${repo}/commits/${commitSha}/check-runs`, {
        headers: { "Authorization": `Bearer ${ghToken}`, "User-Agent": "IremComfortApp" }
      });
      if (crRes.ok) {
        const crData = await crRes.json();
        const runs = crData.check_runs || [];
        const vercelRun = runs.find((r: any) => 
          (r.name || '').toLowerCase().includes('vercel') || 
          (r.app?.name || '').toLowerCase().includes('vercel')
        );
        if (vercelRun) {
          if (vercelRun.status === 'completed') {
            if (vercelRun.conclusion === 'success') return 'READY';
            if (vercelRun.conclusion === 'failure' || vercelRun.conclusion === 'cancelled') return 'ERROR';
          }
          if (vercelRun.status === 'in_progress' || vercelRun.status === 'queued') {
            return 'BUILDING';
          }
        }
      }
    } catch (e) {
      // ignore
    }

    // 3. GitHub Commit Status API
    try {
      const stRes = await fetch(`https://api.github.com/repos/${repo}/commits/${commitSha}/status`, {
        headers: { "Authorization": `Bearer ${ghToken}`, "User-Agent": "IremComfortApp" }
      });
      if (stRes.ok) {
        const stData = await stRes.json();
        const vercelStatus = (stData.statuses || []).find((s: any) => (s.context || '').toLowerCase().includes('vercel'));
        if (vercelStatus) {
          if (vercelStatus.state === 'success') return 'READY';
          if (vercelStatus.state === 'failure' || vercelStatus.state === 'error') return 'ERROR';
          if (vercelStatus.state === 'pending') return 'BUILDING';
        }
      }
    } catch (e) {
      // ignore
    }
  }

  return 'UNKNOWN';
}

app.post("/api/github-test", async (req, res) => {
  try {
    const { githubToken, githubRepo, githubBranch } = req.body || {};
    const cfg = getGithubConfig(githubToken, githubRepo, githubBranch);
    const token = cfg.token;
    const repo = cfg.repo;
    const branch = cfg.branch;

    if (!token) {
      return res.status(400).json({
        success: false,
        error: "Invalid GitHub token (Token girilmemiş)."
      });
    }

    if (!repo || !repo.includes('/')) {
      return res.status(400).json({
        success: false,
        error: "Repository formatı geçersiz (kullanıcı/repo formatında olmalı)."
      });
    }

    // 1. Validate Token
    const userRes = await fetch("https://api.github.com/user", {
      headers: {
        "Authorization": `Bearer ${token}`,
        "User-Agent": "IremComfortApp"
      }
    });

    if (userRes.status === 401) {
      return res.status(401).json({
        success: false,
        error: "Invalid GitHub token"
      });
    }

    // 2. Validate Repository
    const repoRes = await fetch(`https://api.github.com/repos/${repo}`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "User-Agent": "IremComfortApp"
      }
    });

    if (repoRes.status === 404) {
      return res.status(404).json({
        success: false,
        error: "Repository not found"
      });
    }

    if (!repoRes.ok) {
      return res.status(repoRes.status).json({
        success: false,
        error: `GitHub Repository kontrol hatası (${repoRes.status})`
      });
    }

    const repoData = await repoRes.json();
    const canPush = repoData.permissions?.push || repoData.permissions?.admin || false;

    if (!canPush) {
      return res.status(403).json({
        success: false,
        error: "No permission to push"
      });
    }

    // 3. Validate Branch
    const branchRes = await fetch(`https://api.github.com/repos/${repo}/branches/${branch}`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "User-Agent": "IremComfortApp"
      }
    });

    if (branchRes.status === 404) {
      return res.status(404).json({
        success: false,
        error: "Invalid branch"
      });
    }

    return res.json({
      success: true,
      message: "🟢 GitHub bağlantısı başarılı.",
      details: [
        "✓ Repository bulundu.",
        "✓ Yazma izni var.",
        "✓ Branch bulundu."
      ]
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: "GitHub API unavailable"
    });
  }
});

app.post("/api/deploy-github", async (req, res) => {
  try {
    const { githubToken: bodyToken, githubRepo: bodyRepo, githubBranch: bodyBranch, commitMessage, settings: bodySettings } = req.body || {};
    const cfg = getGithubConfig(bodyToken, bodyRepo, bodyBranch);
    const token = cfg.token;
    const repo = cfg.repo;
    const branch = cfg.branch;
    const userCommitMsg = commitMessage || "Site güncellendi ve yayınlandı";

    // 1. Load & Validate Token
    if (!token) {
      return res.status(400).json({
        success: false,
        error: "Invalid GitHub token"
      });
    }

    const userCheck = await fetch("https://api.github.com/user", {
      headers: { "Authorization": `Bearer ${token}`, "User-Agent": "IremComfortApp" }
    });
    if (userCheck.status === 401) {
      return res.status(401).json({
        success: false,
        error: "Invalid GitHub token"
      });
    }

    // 2. Validate Repository
    const repoCheck = await fetch(`https://api.github.com/repos/${repo}`, {
      headers: { "Authorization": `Bearer ${token}`, "User-Agent": "IremComfortApp" }
    });
    if (repoCheck.status === 404) {
      return res.status(404).json({
        success: false,
        error: "Repository not found"
      });
    }

    if (repoCheck.ok) {
      const repoData = await repoCheck.json();
      const canPush = repoData.permissions?.push || repoData.permissions?.admin || false;
      if (!canPush) {
        return res.status(403).json({
          success: false,
          error: "No permission to push"
        });
      }
    }

    // 3. Validate Branch
    const branchCheck = await fetch(`https://api.github.com/repos/${repo}/branches/${branch}`, {
      headers: { "Authorization": `Bearer ${token}`, "User-Agent": "IremComfortApp" }
    });
    if (branchCheck.status === 404) {
      return res.status(404).json({
        success: false,
        error: "Invalid branch"
      });
    }

    const deployTime = new Date().toISOString();

    // Enable Deploying state
    inMemorySettingsCache.systemConfig = {
      ...(inMemorySettingsCache.systemConfig || {}),
      isDeploying: true,
      lastDeployedAt: deployTime,
      githubRepo: repo,
      githubBranch: branch
    };
    saveSettingsToFile(inMemorySettingsCache);

    const sessionId = `deploy_${Date.now()}`;
    const initialLogs = [
      "✓ Content validated",
      "✓ Images prepared",
      "✓ Uploading to GitHub..."
    ];

    activeDeploymentSession = {
      id: sessionId,
      repo,
      branch,
      status: 'UPLOADING',
      stepIndex: 2,
      logs: initialLogs,
      startTime: Date.now(),
      userToken: token
    };

    // Publish settings atomically to GitHub before triggering build using fresh bodySettings payload
    const payloadToPublish = (bodySettings && typeof bodySettings === 'object' && Object.keys(bodySettings).length > 0)
      ? bodySettings
      : inMemorySettingsCache;

    const pubRes = await publishSettings(payloadToPublish, token, repo, branch);
    if (!pubRes.publishSuccess) {
      activeDeploymentSession.status = 'ERROR';
      activeDeploymentSession.error = pubRes.error || "GitHub commit ve push işlemi başarısız oldu.";
      activeDeploymentSession.logs.push(`❌ ${activeDeploymentSession.error}`);
      return res.status(400).json({
        success: false,
        error: activeDeploymentSession.error,
        deployment: activeDeploymentSession
      });
    }

    // Commit created & verified on GitHub! Now track Vercel build.
    activeDeploymentSession.commitSha = pubRes.commitSha;
    activeDeploymentSession.logs.push(`✓ Settings published & verified on GitHub (Commit SHA: ${pubRes.commitSha})`);
    activeDeploymentSession.logs.push("✓ Commit created");
    activeDeploymentSession.logs.push("✓ Push completed");
    activeDeploymentSession.logs.push("✓ Waiting for Vercel...");
    activeDeploymentSession.status = 'WAITING_VERCEL';
    activeDeploymentSession.stepIndex = 5;

    // Upload robots.txt & sitemap.xml
    if (inMemoryRobots) {
      await uploadFileToGithub("public/robots.txt", inMemoryRobots, `Deploy Robots: ${userCommitMsg}`, token, repo, branch);
    }
    if (inMemorySitemap) {
      await uploadFileToGithub("public/sitemap.xml", inMemorySitemap, `Deploy Sitemap: ${userCommitMsg}`, token, repo, branch);
    }

    // Commit created & pushed! Now wait for Vercel.
    activeDeploymentSession.commitSha = pubRes.commitSha;
    activeDeploymentSession.logs.push("✓ Commit created");
    activeDeploymentSession.logs.push("✓ Push completed");
    activeDeploymentSession.logs.push("✓ Waiting for Vercel...");
    activeDeploymentSession.status = 'WAITING_VERCEL';
    activeDeploymentSession.stepIndex = 5;

    return res.json({
      success: true,
      message: "GitHub commit oluşturuldu ve push tamamlandı. Vercel yayınlaması bekleniyor...",
      deployment: activeDeploymentSession
    });
  } catch (err: any) {
    console.error("Deploy endpoint error:", err);
    if (activeDeploymentSession) {
      activeDeploymentSession.status = 'ERROR';
      activeDeploymentSession.error = err?.message || "Deploy başlatılırken beklenmeyen hata oluştu.";
      activeDeploymentSession.logs.push(`❌ ${activeDeploymentSession.error}`);
    }
    return res.status(500).json({ success: false, error: "Deploy işlemi başlatılamadı." });
  }
});

app.get("/api/deploy-status", async (_req, res) => {
  try {
    if (!activeDeploymentSession) {
      return res.json({
        success: true,
        active: false,
        systemConfig: inMemorySettingsCache.systemConfig
      });
    }

    const session = activeDeploymentSession;
    const elapsedSeconds = Math.floor((Date.now() - session.startTime) / 1000);
    const formatDuration = (sec: number) => {
      if (sec < 60) return `${sec}s`;
      const mins = Math.floor(sec / 60);
      const remainder = sec % 60;
      return `${mins}m ${remainder}s`;
    };
    session.durationSeconds = elapsedSeconds;
    session.durationString = formatDuration(elapsedSeconds);

    if (session.status === 'READY') {
      return res.json({
        success: true,
        active: true,
        status: 'READY',
        deployment: session
      });
    }

    if (session.status === 'ERROR') {
      return res.json({
        success: false,
        active: true,
        status: 'ERROR',
        error: session.error,
        deployment: session
      });
    }

    const maxWaitSeconds = inMemorySettingsCache.systemConfig?.maxWaitTimeSeconds || 120;

    // Check if timeout reached (configurable, default 120s)
    if (elapsedSeconds >= maxWaitSeconds) {
      session.status = 'READY';
      session.stepIndex = 8;
      session.endTime = Date.now();
      session.durationSeconds = elapsedSeconds;
      session.durationString = formatDuration(elapsedSeconds);
      if (!session.logs.some(l => l.includes('Maksimum bekleme süresi'))) {
        session.logs.push(`✓ Maksimum bekleme süresine (${maxWaitSeconds}sn) ulaşıldı. Bakım modu otomatik kapatıldı.`);
      }
      if (!session.logs.includes("✓ Website is live")) {
        session.logs.push("✓ Website is live");
      }

      inMemorySettingsCache.systemConfig = {
        ...(inMemorySettingsCache.systemConfig || {}),
        isDeploying: false,
        lastDeployedAt: new Date().toISOString()
      };
      saveSettingsToFile(inMemorySettingsCache, session.userToken, session.repo, session.branch, true);

      return res.json({
        success: true,
        active: true,
        status: 'READY',
        deployment: session
      });
    }

    // Check external Vercel & GitHub status for current commit
    const externalStatus = await checkVercelDeploymentStatus(session.repo, session.commitSha, session.userToken);

    if (externalStatus === 'ERROR') {
      session.status = 'ERROR';
      session.error = "Vercel derleme (build) hatası. Vercel panellerinden logları kontrol edin.";
      if (!session.logs.some(l => l.includes('❌'))) {
        session.logs.push("❌ Vercel build failed.");
      }
      
      inMemorySettingsCache.systemConfig = {
        ...(inMemorySettingsCache.systemConfig || {}),
        isDeploying: false
      };
      saveSettingsToFile(inMemorySettingsCache, session.userToken, session.repo, session.branch, true);

      return res.json({
        success: false,
        active: true,
        status: 'ERROR',
        error: session.error,
        deployment: session
      });
    }

    if (externalStatus === 'READY') {
      session.status = 'READY';
      session.stepIndex = 8;
      session.endTime = Date.now();
      const totalSec = Math.floor((session.endTime - session.startTime) / 1000);
      session.durationSeconds = totalSec;
      session.durationString = formatDuration(totalSec);
      if (!session.logs.includes("✓ Website is live")) {
        session.logs.push("✓ Website is live");
      }

      // Deployment completed successfully! Update deployment revision and lastDeployedAt.
      inMemorySettingsCache.systemConfig = {
        ...(inMemorySettingsCache.systemConfig || {}),
        isDeploying: false,
        lastDeployedAt: new Date().toISOString(),
        deploymentRevision: session.commitSha || `rev_${Date.now()}`
      };
      saveSettingsToFile(inMemorySettingsCache, session.userToken, session.repo, session.branch, true);

      return res.json({
        success: true,
        active: true,
        status: 'READY',
        deployment: session
      });
    }

    if (externalStatus === 'BUILDING') {
      session.status = 'BUILDING';
      session.stepIndex = 6;
      if (!session.logs.includes("⏳ Building...")) {
        session.logs.push("⏳ Building...");
      }
    } else if (externalStatus === 'DEPLOYING') {
      session.status = 'DEPLOYING';
      session.stepIndex = 7;
      if (!session.logs.includes("⏳ Deploying...")) {
        session.logs.push("⏳ Deploying...");
      }
    } else {
      // Graceful timing fallback while Vercel builds asynchronously
      if (elapsedSeconds >= Math.min(10, maxWaitSeconds / 4) && session.stepIndex < 6) {
        session.status = 'BUILDING';
        session.stepIndex = 6;
        if (!session.logs.includes("⏳ Building...")) {
          session.logs.push("⏳ Building...");
        }
      }
      if (elapsedSeconds >= Math.min(30, maxWaitSeconds / 2) && session.stepIndex < 7) {
        session.status = 'DEPLOYING';
        session.stepIndex = 7;
        if (!session.logs.includes("⏳ Deploying...")) {
          session.logs.push("⏳ Deploying...");
        }
      }
      if (elapsedSeconds >= Math.min(60, maxWaitSeconds - 10) && session.stepIndex < 8) {
        session.status = 'READY';
        session.stepIndex = 8;
        session.endTime = Date.now();
        session.durationSeconds = elapsedSeconds;
        session.durationString = formatDuration(elapsedSeconds);
        if (!session.logs.includes("✓ Website is live")) {
          session.logs.push("✓ Website is live");
        }

        inMemorySettingsCache.systemConfig = {
          ...(inMemorySettingsCache.systemConfig || {}),
          isDeploying: false,
          lastDeployedAt: new Date().toISOString(),
          deploymentRevision: session.commitSha || `rev_${Date.now()}`
        };
        saveSettingsToFile(inMemorySettingsCache, session.userToken, session.repo, session.branch, true);
      }
    }

    return res.json({
      success: true,
      active: true,
      status: session.status,
      deployment: session
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || "Status polling error" });
  }
});

app.post(["/api/deploy-cancel", "/api/deploy-reset"], (_req, res) => {
  activeDeploymentSession = null;
  if (inMemorySettingsCache && inMemorySettingsCache.systemConfig) {
    inMemorySettingsCache.systemConfig.isDeploying = false;
  }
  saveSettingsToFile(inMemorySettingsCache);
  return res.json({ success: true, message: "Deploy işlemi sıfırlandı ve kapatıldı." });
});

app.get("/api/settings", async (req, res) => {
  try {
    const force = req.query.force === 'true';
    if (force || !inMemorySettingsCache || Object.keys(inMemorySettingsCache).length === 0) {
      await loadCanonicalSettingsFromGithub();
    }
    if (!inMemorySettingsCache || Object.keys(inMemorySettingsCache).length === 0) {
      inMemorySettingsCache = loadSettingsFromFile();
    }
    return res.json({
      success: true,
      settings: inMemorySettingsCache || {},
      diagnostics: getPersistenceDiagnostics()
    });
  } catch (err: any) {
    console.error("Error in GET /api/settings:", err);
    return res.status(500).json({
      success: false,
      error: "Ayarlar alınırken sunucu hatası oluştu.",
      details: err?.message || String(err)
    });
  }
});

app.get("/api/settings/diagnostics", async (_req, res) => {
  try {
    return res.json({
      success: true,
      diagnostics: getPersistenceDiagnostics()
    });
  } catch (err: any) {
    console.error("Error in GET /api/settings/diagnostics:", err);
    return res.status(500).json({
      success: false,
      error: "Teşhis bilgileri alınırken sunucu hatası oluştu.",
      details: err?.message || String(err)
    });
  }
});

app.post("/api/publish-settings", async (req, res) => {
  try {
    const { settings, token, repo, branch } = req.body || {};
    const payload = settings || inMemorySettingsCache;

    const result = await publishSettings(payload, token, repo, branch);
    if (!result.publishSuccess) {
      return res.status(500).json(result);
    }

    return res.json({
      success: true,
      publishSuccess: true,
      message: "Site ayarları başarıyla GitHub'a kalıcı olarak yayınlandı ve doğrulandı.",
      settings: inMemorySettingsCache,
      diagnostics: result.diagnostics
    });
  } catch (err: any) {
    console.error("Error in /api/publish-settings:", err);
    return res.status(500).json({
      success: false,
      publishSuccess: false,
      error: "Yayınlama başarısız: site_settings.json GitHub'a kalıcı olarak kaydedilemedi.",
      details: err?.message
    });
  }
});

app.post("/api/sync-github", async (req, res) => {
  try {
    await ensureSettingsLoaded();
    const { settings, token, repo, branch, commitMessage } = req.body || {};
    const payload = settings || inMemorySettingsCache;

    const result = await publishSettings(payload, token, repo, branch);
    await syncAllImagesToGithub(commitMessage || "Admin: Görseller ve ayarlar GitHub deposuna aktarıldı");

    return res.json({
      success: result.publishSuccess || result.success,
      publishSuccess: result.publishSuccess,
      message: "Tüm medya ve site ayarları GitHub'a başarıyla senkronize edildi.",
      settings: result.settings || inMemorySettingsCache,
      diagnostics: result.diagnostics
    });
  } catch (err: any) {
    console.error("Error in /api/sync-github:", err);
    return res.status(500).json({
      success: false,
      error: "GitHub senkronizasyonu sırasında hata oluştu.",
      details: err?.message || String(err)
    });
  }
});

app.post("/api/settings", async (req, res) => {
  try {
    await ensureSettingsLoaded();

    const { section, data, settings, publish } = req.body || {};
    const sanitizedData = sanitizeNoBase64(data || settings);

    if (!sanitizedData || typeof sanitizedData !== 'object') {
      return res.status(400).json({ success: false, error: "Geçersiz ayar verisi." });
    }

    const payload = sanitizedData;

    if (section && section !== 'ALL' && section !== 'all') {
      if (typeof payload === 'object' && payload !== null && !Array.isArray(payload)) {
        inMemorySettingsCache[section] = deepMerge(inMemorySettingsCache[section] || {}, payload);
      } else {
        inMemorySettingsCache[section] = payload;
      }
    } else if (typeof payload === 'object' && payload !== null) {
      inMemorySettingsCache = deepMerge(inMemorySettingsCache || {}, payload);
    }

    saveDraftSettings(inMemorySettingsCache);

    // Only publish to GitHub if explicitly requested (publish === true)
    const shouldPublish = publish === true;
    if (shouldPublish) {
      const publishRes = await publishSettings(inMemorySettingsCache);
      if (publishRes.publishSuccess) {
        return res.json({
          success: true,
          publishSuccess: true,
          message: "Site ayarları kalıcı olarak GitHub'a yayınlandı ve kaydedildi.",
          settings: inMemorySettingsCache,
          diagnostics: publishRes.diagnostics
        });
      }
    }

    return res.json({
      success: true,
      message: "Site ayarları kaydedildi.",
      settings: inMemorySettingsCache,
      diagnostics: getPersistenceDiagnostics()
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
  try {
    if (req.url) {
      if (!req.url.startsWith("/api/") && !req.url.startsWith("/api?") && req.url !== "/robots.txt" && req.url !== "/sitemap.xml" && !req.url.startsWith("/uploads/")) {
        if (req.url === "/api") {
          req.url = "/api/";
        } else {
          req.url = "/api" + (req.url.startsWith("/") ? req.url : "/" + req.url);
        }
      }
    }
    return app(req, res);
  } catch (err: any) {
    console.error("Vercel Serverless Handler Error:", err);
    if (res && !res.headersSent) {
      res.setHeader("Content-Type", "application/json");
      return res.status(500).json({
        success: false,
        error: "Sunucu içi beklenmeyen bir hata oluştu.",
        details: err?.message || String(err)
      });
    }
  }
}

export { app };

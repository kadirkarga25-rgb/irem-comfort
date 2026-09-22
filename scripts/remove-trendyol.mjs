import fs from 'node:fs';
const path = 'public/site_settings.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));
function walk(v) {
  if (Array.isArray(v)) return v.map(walk);
  if (v && typeof v === 'object') {
    const out = {};
    for (const [k, value] of Object.entries(v)) {
      if (k.toLowerCase() === 'trendyolurl') continue;
      out[k] = walk(value);
    }
    return out;
  }
  if (typeof v === 'string') {
    return v
      .replace(/TRENDYOL'DA ANAVELLE MAĞAZAMIZ AÇILDI\s*[—-]\s*ONLİNE ALIŞVERİŞ İÇİN BİZE ULAŞIN/gi, 'YENİ SEZON KOLEKSİYONUMUZ YAYINDA — TOPTAN SİPARİŞLER İÇİN BİZE ULAŞIN')
      .replace(/Trendyol/gi, '');
  }
  return v;
}
fs.writeFileSync(path, JSON.stringify(walk(data), null, 2) + '\n', 'utf8');
console.log('Trendyol kayıtları temizlendi:', path);

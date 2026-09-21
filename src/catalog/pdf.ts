import * as pdfjsLib from 'pdfjs-dist';
import type { Collection } from './db';

let configured = false;

function setup() {
  if (configured) return;
  if (typeof window !== 'undefined') {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
  }
  configured = true;
}

async function openPdf(data: ArrayBuffer) {
  setup();
  try {
    return await pdfjsLib.getDocument({ data }).promise;
  } catch (workerError) {
    // Bazı kurumsal ağlar/CDN politikaları worker dosyasını engelleyebilir.
    // Böyle bir durumda PDF.js'i worker olmadan ana iş parçacığında açıyoruz.
    try {
      return await pdfjsLib.getDocument({ data, disableWorker: true }).promise;
    } catch {
      const message = workerError instanceof Error ? workerError.message : 'PDF açılamadı.';
      throw new Error(`PDF okunamadı. Dosyanın bozuk, şifreli veya desteklenmeyen bir PDF olmadığından emin ol. Ayrıntı: ${message}`);
    }
  }
}

export async function readPdf(file: File, onProgress?: (n: number) => void) {
  if (!file || file.size === 0) throw new Error('Seçilen PDF dosyası boş.');
  if (file.type && file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
    throw new Error('Lütfen yalnızca PDF dosyası yükleyin.');
  }

  const data = await file.arrayBuffer();
  const pdf = await openPdf(data);
  const pages: string[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 0.74 });
    const canvas = document.createElement('canvas');
    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas context oluşturulamadı.');
    await page.render({ canvasContext: ctx, viewport }).promise;
    pages.push(canvas.toDataURL('image/jpeg', 0.56));
    onProgress?.(Math.round((i / pdf.numPages) * 100));
  }

  return {
    pages,
    data: new Blob([data], { type: 'application/pdf' }),
    count: pdf.numPages,
  };
}

export async function extractText(file: File) {
  if (!file || file.size === 0) throw new Error('PDF dosyası boş.');
  const data = await file.arrayBuffer();
  const pdf = await openPdf(data);
  const pageTexts: string[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    pageTexts.push(
      content.items
        .map((item: unknown) => ('str' in (item as object) ? String((item as { str: string }).str) : ''))
        .join(' '),
    );
  }

  return { fullText: pageTexts.join('\n'), pageTexts };
}

function cleanTitle(value: string) {
  return value.replace(/\s+/g, ' ').replace(/[|•·]+/g, ' ').trim();
}

export function detectStructure(pageTexts: string[], pageCount: number) {
  const headings: { title: string; page: number }[] = [];
  const collectionCandidates: { title: string; page: number }[] = [];

  pageTexts.forEach((raw, index) => {
    const lines = raw.split(/\n+/).map(cleanTitle).filter(Boolean);
    const candidates = lines.filter(
      (line) =>
        line.length >= 4 &&
        line.length <= 80 &&
        (/^[A-ZÇĞİÖŞÜ0-9][A-ZÇĞİÖŞÜ0-9\s&\-/.]+$/.test(line) || /Koleksiyon|Collection/i.test(line)),
    );

    const pageCandidates = [...new Set(candidates)].slice(0, 8);
    pageCandidates.forEach((title) => {
      const page = index + 1;
      if (/Koleksiyon|Collection/i.test(title)) collectionCandidates.push({ title, page });
      else headings.push({ title, page });
    });
  });

  const uniqueCollections = collectionCandidates.filter(
    (item, index, arr) => arr.findIndex((x) => x.title.toLocaleLowerCase('tr-TR') === item.title.toLocaleLowerCase('tr-TR')) === index,
  );

  const fallbackCount = Math.min(8, Math.max(1, Math.ceil(pageCount / 25)));
  const detected = uniqueCollections.length
    ? uniqueCollections.slice(0, 20)
    : Array.from({ length: fallbackCount }, (_, i) => ({
        title: `Koleksiyon ${i + 1}`,
        page: Math.max(1, Math.round((i * pageCount) / fallbackCount) + 1),
      }));

  const collections: Collection[] = detected.map((item, index) => {
    const next = detected[index + 1];
    return {
      id: `collection-${index + 1}-${Date.now()}`,
      name: item.title,
      startPage: item.page,
      endPage: Math.max(item.page, next ? next.page - 1 : pageCount),
    };
  });

  const contentsSource = [...uniqueCollections, ...headings]
    .filter((item, index, arr) => arr.findIndex((x) => x.title.toLocaleLowerCase('tr-TR') === item.title.toLocaleLowerCase('tr-TR')) === index)
    .slice(0, 30);

  return {
    collections,
    contents: contentsSource.length ? contentsSource.map((x) => ({ title: x.title, page: x.page })) : [{ title: 'Katalog', page: 1 }],
  };
}


const documentCache = new WeakMap<Blob, any>();

export async function renderPdfPage(blob: Blob, pageNumber: number, scale = 1) {
  if (typeof window === 'undefined') throw new Error('PDF sayfası yalnızca tarayıcıda oluşturulabilir.');
  let pdf = documentCache.get(blob);
  if (!pdf) {
    const data = await blob.arrayBuffer();
    pdf = await openPdf(data);
    documentCache.set(blob, pdf);
  }
  const page = await pdf.getPage(pageNumber);
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement('canvas');
  canvas.width = Math.ceil(viewport.width);
  canvas.height = Math.ceil(viewport.height);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context oluşturulamadı.');
  await page.render({ canvasContext: ctx, viewport }).promise;
  return canvas.toDataURL('image/jpeg', scale < 0.5 ? 0.5 : 0.72);
}

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
  try { return await pdfjsLib.getDocument({ data }).promise; }
  catch (workerError) {
    try { return await pdfjsLib.getDocument({ data, disableWorker: true }).promise; }
    catch {
      const message = workerError instanceof Error ? workerError.message : 'PDF açılamadı.';
      throw new Error(`PDF okunamadı. Dosyanın bozuk, şifreli veya desteklenmeyen bir PDF olmadığından emin ol. Ayrıntı: ${message}`);
    }
  }
}

export async function readPdf(file: File, onProgress?: (n: number) => void) {
  if (!file || file.size === 0) throw new Error('Seçilen PDF dosyası boş.');
  if (file.type && file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) throw new Error('Lütfen yalnızca PDF dosyası yükleyin.');
  const data = await file.arrayBuffer();
  const pdf = await openPdf(data);
  const pages: string[] = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 0.74 });
    const canvas = document.createElement('canvas');
    canvas.width = Math.ceil(viewport.width); canvas.height = Math.ceil(viewport.height);
    const ctx = canvas.getContext('2d'); if (!ctx) throw new Error('Canvas context oluşturulamadı.');
    await page.render({ canvasContext: ctx, viewport }).promise;
    pages.push(canvas.toDataURL('image/jpeg', 0.56));
    onProgress?.(Math.round((i / pdf.numPages) * 100));
  }
  return { pages, data: new Blob([data], { type: 'application/pdf' }), count: pdf.numPages };
}

export async function extractText(file: File) {
  if (!file || file.size === 0) throw new Error('PDF dosyası boş.');
  const data = await file.arrayBuffer();
  const pdf = await openPdf(data);
  const pageTexts: string[] = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    pageTexts.push(content.items.map((item: unknown) => ('str' in (item as object) ? String((item as {str:string}).str) : '')).join(' '));
  }
  return { fullText: pageTexts.join('\n'), pageTexts };
}

const clean = (v:string) => v.replace(/[\u0000-\u001F]+/g,' ').replace(/\s+/g,' ').replace(/[|•·]+/g,' ').trim();
const norm = (v:string) => clean(v).toLocaleLowerCase('tr-TR').replace(/[^a-z0-9çğıöşü]+/gi,' ').trim();

function candidateScore(line:string) {
  const x=clean(line); if(x.length<4||x.length>90) return -1;
  let score=0;
  if(/\b(koleksiyon|collection)\b/i.test(x)) score+=8;
  if(/\b(01|02|03|04|05|06|07|08|09|10)\b/.test(x)) score+=2;
  if(x===x.toLocaleUpperCase('tr-TR')) score+=4;
  if(/^[A-ZÇĞİÖŞÜ0-9][A-ZÇĞİÖŞÜ0-9\s&\-/.:'’]+$/.test(x)) score+=3;
  if(/\b(ürün|product|sayfa|page|içindekiler|contents)\b/i.test(x)) score-=3;
  if(x.split(' ').length>10) score-=2;
  return score;
}

export function detectStructure(pageTexts:string[], pageCount:number) {
  const headingMap=new Map<string,{title:string;page:number;score:number}>();
  const collectionMap=new Map<string,{title:string;page:number;score:number}>();
  let pagesWithText=0;
  pageTexts.forEach((raw,index)=>{
    const page=index+1;
    const lines=raw.split(/(?:\n|(?<=[.!?])\s{2,})/).map(clean).filter(Boolean);
    if(lines.length) pagesWithText++;
    const seen=new Set<string>();
    for(const line of lines){
      const key=norm(line); if(!key||seen.has(key)) continue; seen.add(key);
      const score=candidateScore(line); if(score<5) continue;
      const item={title:line,page,score};
      const target=/\b(koleksiyon|collection)\b/i.test(line)?collectionMap:headingMap;
      const prev=target.get(key); if(!prev||score>prev.score) target.set(key,item);
    }
  });
  const collectionsDetected=[...collectionMap.values()].sort((a,b)=>a.page-b.page||b.score-a.score).slice(0,24);
  const headings=[...headingMap.values()].sort((a,b)=>a.page-b.page||b.score-a.score).slice(0,40);
  const warnings:string[]=[];
  if(!pagesWithText) warnings.push('PDF metin katmanı içermiyor. Bu nedenle koleksiyon başlıkları görsel analiz olmadan otomatik kesinleştirilemedi.');
  else if(pagesWithText<Math.max(2,Math.ceil(pageCount*.35))) warnings.push(`Yalnızca ${pagesWithText}/${pageCount} sayfada okunabilir metin bulundu. Bazı başlıklar görsel olarak hazırlanmış olabilir.`);
  if(!collectionsDetected.length) warnings.push('Belirgin “Koleksiyon / Collection” başlığı bulunamadı. Sistem sayfa dağılımına göre taslak koleksiyonlar oluşturdu; yayınlamadan önce kontrol et.');

  const detected=collectionsDetected.length?collectionsDetected.map(x=>({title:x.title,page:x.page})):
    Array.from({length:Math.min(8,Math.max(1,Math.ceil(pageCount/20)))},(_,i)=>({title:`Koleksiyon ${String(i+1).padStart(2,'0')}`,page:Math.max(1,Math.round((i*pageCount)/Math.max(1,Math.ceil(pageCount/20)))+1)}));
  const collections:Collection[]=detected.map((x,i)=>({id:`collection-${i+1}-${Date.now()}`,name:x.title,startPage:x.page,endPage:Math.max(x.page,detected[i+1]?.page?detected[i+1].page-1:pageCount)}));
  const contents=[...collectionsDetected,...headings].filter((x,i,a)=>a.findIndex(y=>norm(y.title)===norm(x.title))===i).slice(0,40).map(x=>({title:x.title,page:x.page}));
  const confidence=Math.round(Math.min(99,Math.max(35,45+(collectionsDetected.length*6)+(pagesWithText/pageCount)*25)));
  return {collections,contents:contents.length?contents:[{title:'Katalog başlangıcı',page:1}],analysis:{pages:pageCount,pagesWithText,collectionsFound:collectionsDetected.length,contentsFound:contents.length,confidence,warnings}};
}

const documentCache=new WeakMap<Blob,any>();
export async function renderPdfPage(blob:Blob,pageNumber:number,scale=1){
  if(typeof window==='undefined')throw new Error('PDF sayfası yalnızca tarayıcıda oluşturulabilir.');
  let pdf=documentCache.get(blob); if(!pdf){pdf=await openPdf(await blob.arrayBuffer());documentCache.set(blob,pdf);}
  const page=await pdf.getPage(pageNumber); const viewport=page.getViewport({scale});
  const canvas=document.createElement('canvas'); canvas.width=Math.ceil(viewport.width);canvas.height=Math.ceil(viewport.height);
  const ctx=canvas.getContext('2d');if(!ctx)throw new Error('Canvas context oluşturulamadı.');
  await page.render({canvasContext:ctx,viewport}).promise; return canvas.toDataURL('image/jpeg',scale<.5?.5:.72);
}

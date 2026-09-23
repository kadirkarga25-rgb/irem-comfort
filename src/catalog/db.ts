export type Collection = { id:string; name:string; startPage:number; endPage:number; description?:string; coverPage?:number };
export type Catalog = { pdfLibraryId?:string; id:string; title:string; year:string; season:string; description:string; cover?:string; pdf?:Blob; pdfUrl?:string; pageImages?:string[]; pageTexts?:string[]; pages:number; collections:Collection[]; contents:{title:string;page:number}[]; tags?:string[]; createdAt:number; published:boolean; newsletterAnnouncementSentAt?:string; newsletterAnnouncementSentCount?:number; newsletterAnnouncementFailedCount?:number };
const TOKEN_KEY='ic_catalog_admin_token';
const API='/api';
function clean(raw:any):Catalog{return {...raw,year:String(raw?.year||''),pages:Number(raw?.pages)||raw?.pageImages?.length||1,collections:Array.isArray(raw?.collections)?raw.collections:[],contents:Array.isArray(raw?.contents)?raw.contents:[],tags:Array.isArray(raw?.tags)?raw.tags:[],pageTexts:Array.isArray(raw?.pageTexts)?raw.pageTexts:[]};}
export function getCatalogAdminToken(){return typeof window==='undefined'?'':sessionStorage.getItem(TOKEN_KEY)||'';}
export function setCatalogAdminToken(v:string){if(typeof window!=='undefined')sessionStorage.setItem(TOKEN_KEY,v);}
export function clearCatalogAdminToken(){if(typeof window!=='undefined')sessionStorage.removeItem(TOKEN_KEY);}
export async function listPdfLibraryForCatalog(){
  const r=await fetch(`${API}/pdf-library/admin/list`,{cache:'no-store',headers:{Authorization:`Bearer ${getCatalogAdminToken()}`}});
  if(!r.ok) throw new Error('PDF Kütüphanesi alınamadı.');
  const d=await r.json();
  return Array.isArray(d?.files)?d.files:[];
}
async function withPdf(c:Catalog){
  // PDF is stored as a real file in GitHub. Do not download it through the
  // Vercel API here; the viewer will let PDF.js read pdfUrl directly with
  // HTTP range requests. This keeps large PDFs out of the serverless memory
  // path and avoids the old 302/502/"PDF indirilemedi" failure mode.
  return c;
}
export async function listCatalogs(admin=false){const r=await fetch(admin?`${API}/catalogs/admin/list`:`${API}/catalogs`,{cache:'no-store',headers:admin?{Authorization:`Bearer ${getCatalogAdminToken()}`} : undefined});if(!r.ok)return [];const d=await r.json();return(d.catalogs||[]).map(clean).sort((a:Catalog,b:Catalog)=>Number(b.year)-Number(a.year)||b.createdAt-a.createdAt);}
export async function getCatalog(id:string,admin=false){const r=await fetch(`${API}/catalogs/${admin?`admin/${encodeURIComponent(id)}`:encodeURIComponent(id)}`,{cache:'no-store',headers:admin?{Authorization:`Bearer ${getCatalogAdminToken()}`} : undefined});if(!r.ok)return undefined;const d=await r.json();return d.catalog?withPdf(clean(d.catalog)):undefined;}
async function uploadData(id:string,data:Blob,filename:string){const bytes=new Uint8Array(await data.arrayBuffer());let binary='';const chunk=0x8000;for(let i=0;i<bytes.length;i+=chunk)binary+=String.fromCharCode(...bytes.subarray(i,i+chunk));const base64=btoa(binary);const r=await fetch(`${API}/catalogs/upload`,{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${getCatalogAdminToken()}`},body:JSON.stringify({id,data:`data:${data.type||'application/octet-stream'};base64,${base64}`,filename})});const d=await r.json();if(!r.ok||!d.success)throw new Error(d.error||'Dosya yüklenemedi.');return (d.rawUrl || d.url) as string;}
export async function saveCatalog(catalog:Catalog){const value:any={...catalog};if(value.pdfLibraryId){
  delete value.pdf;
} else if(value.pdf instanceof Blob){
  value.pdfUrl=await uploadData(catalog.id,value.pdf,`${catalog.id}.pdf`);
}if(typeof value.cover==='string'&&value.cover.startsWith('data:')){const blob=await fetch(value.cover).then(r=>r.blob());value.cover=await uploadData(catalog.id,blob,`${catalog.id}-cover.${blob.type.includes('png')?'png':'jpg'}`);}delete value.pdf;delete value.pageImages;const r=await fetch(`${API}/catalogs/save`,{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${getCatalogAdminToken()}`},body:JSON.stringify({catalog:value})});const d=await r.json();if(!r.ok||!d.success)throw new Error(d.error||'Katalog kalıcı olarak kaydedilemedi.');}
export async function deleteCatalog(id:string){const r=await fetch(`${API}/catalogs/delete`,{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${getCatalogAdminToken()}`},body:JSON.stringify({id})});const d=await r.json();if(!r.ok||!d.success)throw new Error(d.error||'Katalog silinemedi.');}

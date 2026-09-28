import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createHmac, timingSafeEqual, randomBytes, randomUUID, createCipheriv, createDecipheriv } from 'node:crypto';

type Pdf = { id:string; title:string; filename:string; size:number; chunks:number };
type Group = { id:string; name:string; description:string; enabled:boolean; shareToken:string; catalogs:Pdf[] };
type Store = { groups:Group[] };
const OWNER=process.env.PRIVATE_CATALOG_GITHUB_OWNER||'kadirkarga25-rgb';
const REPO=process.env.PRIVATE_CATALOG_GITHUB_REPO||'irem-comfort';
const DATA_BRANCH=process.env.PRIVATE_CATALOG_DATA_BRANCH||'private-catalog-data';
const GH_TOKEN=process.env.GITHUB_PRIVATE_CATALOG_TOKEN||process.env.GITHUB_TOKEN||'';
const ADMIN_SECRET=process.env.ADMIN_SESSION_SECRET||process.env.ADMIN_PASSWORD||'';
const ENC_KEY_RAW=process.env.PRIVATE_CATALOG_ENCRYPTION_KEY||'';
const STORE_PATH='private-catalog-data/store.enc';
const API='https://api.github.com';
const GH_HEADERS={Authorization:`Bearer ${GH_TOKEN}`,Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28','Content-Type':'application/json'};
function reply(res:VercelResponse,status:number,data:unknown){res.setHeader('Cache-Control','private, no-store, max-age=0');return res.status(status).json(data);}
function equal(a:string,b:string){const x=Buffer.from(a);const y=Buffer.from(b);return x.length===y.length&&timingSafeEqual(x,y);}
function isAdminToken(token:string){
 if(!ADMIN_SECRET||!token.startsWith('sess2_'))return false;
 const [payload,sig]=token.slice(6).split('.');if(!payload||!sig)return false;
 const expected=createHmac('sha256',ADMIN_SECRET).update(payload).digest('base64url');if(!equal(sig,expected))return false;
 try{const p=JSON.parse(Buffer.from(payload,'base64url').toString('utf8'));return Number(p.exp)>Date.now();}catch{return false;}
}
function isAdmin(req:VercelRequest){const h=String(req.headers.authorization||'');return h.startsWith('Bearer ')&&isAdminToken(h.slice(7));}
function keyBytes(){const b=Buffer.from(ENC_KEY_RAW,'base64');if(b.length!==32)throw new Error('PRIVATE_CATALOG_ENCRYPTION_KEY 32 baytlık Base64 anahtar olmalı.');return b;}
function seal(input:Buffer){const iv=randomBytes(12);const c=createCipheriv('aes-256-gcm',keyBytes(),iv);const data=Buffer.concat([c.update(input),c.final()]);return Buffer.from(JSON.stringify({iv:iv.toString('base64'),tag:c.getAuthTag().toString('base64'),data:data.toString('base64')}),'utf8');}
function unseal(input:Buffer){const x=JSON.parse(input.toString('utf8'));const d=createDecipheriv('aes-256-gcm',keyBytes(),Buffer.from(x.iv,'base64'));d.setAuthTag(Buffer.from(x.tag,'base64'));return Buffer.concat([d.update(Buffer.from(x.data,'base64')),d.final()]);}
function pathForChunk(groupId:string,fileId:string,index:number){return `private-catalog-data/objects/${groupId}/${fileId}/${String(index).padStart(5,'0')}.enc`;}
async function gh(path:string,init:RequestInit={}){if(!GH_TOKEN)throw new Error('GitHub depolaması için GITHUB_PRIVATE_CATALOG_TOKEN ayarlanmalı.');const r=await fetch(`${API}/repos/${OWNER}/${REPO}${path}`,{...init,headers:{...GH_HEADERS,...(init.headers||{})}});return r;}
async function ensureBranch(){
 const ref=await gh(`/git/ref/heads/${DATA_BRANCH}`);
 if(ref.ok)return;
 if(ref.status!==404)throw new Error(`GitHub dalı kontrol edilemedi (${ref.status}).`);
 const base=await gh('/git/ref/heads/main');if(!base.ok)throw new Error('GitHub main dalı okunamadı.');
 const j:any=await base.json();
 const created=await gh('/git/refs',{method:'POST',body:JSON.stringify({ref:`refs/heads/${DATA_BRANCH}`,sha:j.object.sha})});
 if(!created.ok&&created.status!==422)throw new Error('Özel katalog veri dalı oluşturulamadı.');
}
async function readFile(path:string):Promise<{bytes:Buffer;sha:string}|null>{
 const r=await gh(`/contents/${path}?ref=${encodeURIComponent(DATA_BRANCH)}`);
 if(r.status===404)return null;if(!r.ok)throw new Error(`GitHub dosyası okunamadı (${r.status}).`);
 const j:any=await r.json();if(!j.content)throw new Error('GitHub dosya içeriği boş.');
 return {bytes:Buffer.from(String(j.content).replace(/\n/g,''),'base64'),sha:j.sha};
}
async function writeFile(path:string,bytes:Buffer,message:string){
 const old=await readFile(path);
 const r=await gh(`/contents/${path}`,{method:'PUT',body:JSON.stringify({message,branch:DATA_BRANCH,content:bytes.toString('base64'),...(old?{sha:old.sha}:{})})});
 if(!r.ok){const j:any=await r.json().catch(()=>({}));throw new Error(j.message||`GitHub dosyası yazılamadı (${r.status}).`);}
}
async function readStore():Promise<Store>{
 const f=await readFile(STORE_PATH);if(!f)return{groups:[]};
 try{return JSON.parse(unseal(f.bytes).toString('utf8')) as Store;}catch{throw new Error('Özel katalog kayıtları çözülemedi. Şifreleme anahtarını kontrol et.');}
}
async function writeStore(store:Store){await writeFile(STORE_PATH,seal(Buffer.from(JSON.stringify(store),'utf8')),'Update encrypted private catalog metadata');}
async function readCatalogPdf(groupId:string,p:Pdf){
 const chunks:Buffer[]=[];
 for(let i=0;i<p.chunks;i++){const f=await readFile(pathForChunk(groupId,p.id,i));if(!f)throw new Error('PDF parçası eksik.');chunks.push(unseal(f.bytes));}
 return Buffer.concat(chunks);
}
function filenameSafe(s:string){return s.replace(/[^\w.\- ()ğüşöçıİĞÜŞÖÇ]/gi,'_').slice(0,180)||'catalog.pdf';}
export default async function handler(req:VercelRequest,res:VercelResponse){
 if(!GH_TOKEN)return reply(res,503,{error:'GitHub depolaması ayarlanmamış. Vercel ortam değişkenlerine GITHUB_PRIVATE_CATALOG_TOKEN ekle.'});
 if(!ENC_KEY_RAW)return reply(res,503,{error:'Özel katalog şifreleme anahtarı ayarlanmamış. PRIVATE_CATALOG_ENCRYPTION_KEY ekle.'});
 try{await ensureBranch();}catch(e:any){return reply(res,503,{error:e?.message||'GitHub veri dalına erişilemedi.'});}

 if(req.method==='GET'&&typeof req.query.share==='string'&&typeof req.query.pdf!=='string'){
  try{const store=await readStore();const g=store.groups.find(x=>x.enabled&&x.shareToken===req.query.share);if(!g)return reply(res,404,{error:'Bu paylaşım bağlantısı geçersiz veya kapatılmış.'});
   return reply(res,200,{group:{id:g.id,name:g.name,description:g.description,catalogs:g.catalogs.map(({id,title,filename,size})=>({id,title,filename,size}))}});
  }catch(e:any){return reply(res,500,{error:e?.message||'Katalog grubu okunamadı.'});}
 }
 if(req.method==='GET'&&typeof req.query.share==='string'&&typeof req.query.pdf==='string'){
  try{const store=await readStore();const g=store.groups.find(x=>x.enabled&&x.shareToken===req.query.share);const p=g?.catalogs.find(x=>x.id===req.query.pdf);if(!g||!p)return reply(res,404,{error:'Katalog bulunamadı veya bağlantı iptal edildi.'});
   const pdf=await readCatalogPdf(g.id,p);res.status(200);res.setHeader('Content-Type','application/pdf');res.setHeader('Content-Length',String(pdf.length));res.setHeader('Content-Disposition',`inline; filename*=UTF-8''${encodeURIComponent(p.filename)}`);res.setHeader('Cache-Control','private, no-store, max-age=0');return res.end(pdf);
  }catch(e:any){return reply(res,500,{error:e?.message||'PDF okunamadı.'});}
 }
 if(!isAdmin(req))return reply(res,401,{error:'Yönetici oturumu gerekli.'});
 try{
  const store=await readStore();
  if(req.method==='GET')return reply(res,200,{groups:store.groups});
  if(req.method==='POST'){
   const b=req.body||{};
   if(b.action==='create-group'){
    if(!String(b.name||'').trim())return reply(res,400,{error:'Grup adı gerekli.'});
    const g:Group={id:randomUUID(),name:String(b.name).trim().slice(0,120),description:String(b.description||'').trim().slice(0,500),enabled:true,shareToken:randomBytes(32).toString('base64url'),catalogs:[]};
    store.groups.unshift(g);await writeStore(store);return reply(res,201,{group:g});
   }
   if(b.action==='upload-init'){
    const g=store.groups.find(x=>x.id===b.groupId);if(!g)return reply(res,404,{error:'Grup bulunamadı.'});
    const filename=filenameSafe(String(b.filename||'Katalog.pdf'));if(!filename.toLowerCase().endsWith('.pdf'))return reply(res,400,{error:'Yalnızca PDF yüklenebilir.'});
    if(!Number.isFinite(Number(b.size))||Number(b.size)<=0||Number(b.size)>80*1024*1024)return reply(res,400,{error:'PDF 80 MB veya daha küçük olmalı.'});
    return reply(res,200,{fileId:randomUUID(),filename,size:Number(b.size),chunkSize:450*1024});
   }
   if(b.action==='upload-chunk'){
    const g=store.groups.find(x=>x.id===b.groupId);if(!g)return reply(res,404,{error:'Grup bulunamadı.'});
    const idx=Number(b.index),total=Number(b.total);if(!/^[a-f0-9-]{20,40}$/i.test(String(b.fileId||''))||!Number.isInteger(idx)||!Number.isInteger(total)||total<1||total>200||idx<0||idx>=total)return reply(res,400,{error:'Yükleme parçası geçersiz.'});
    const raw=Buffer.from(String(b.chunkBase64||''),'base64');if(!raw.length||raw.length>460*1024)return reply(res,400,{error:'Yükleme parçası boyutu geçersiz.'});
    await writeFile(pathForChunk(g.id,String(b.fileId),idx),seal(raw),`Upload private catalog chunk ${idx+1}/${total}`);
    return reply(res,200,{ok:true,index:idx});
   }
   if(b.action==='upload-finish'){
    const g=store.groups.find(x=>x.id===b.groupId);if(!g)return reply(res,404,{error:'Grup bulunamadı.'});
    const fileId=String(b.fileId||''),chunks=Number(b.chunks),size=Number(b.size),filename=filenameSafe(String(b.filename||'Katalog.pdf'));
    if(!/^[a-f0-9-]{20,40}$/i.test(fileId)||!Number.isInteger(chunks)||chunks<1||chunks>200||!Number.isFinite(size)||size<=0)return reply(res,400,{error:'Yükleme bilgileri geçersiz.'});
    for(let i=0;i<chunks;i++)if(!(await readFile(pathForChunk(g.id,fileId,i))))return reply(res,400,{error:`PDF parçası eksik: ${i+1}.`});
    g.catalogs.push({id:fileId,title:filename.replace(/\.pdf$/i,''),filename,size,chunks});await writeStore(store);return reply(res,201,{ok:true});
   }
   return reply(res,400,{error:'Bilinmeyen işlem.'});
  }
  if(req.method==='PATCH'){
   const {action,groupId}=req.body||{};const g=store.groups.find(x=>x.id===groupId);if(!g)return reply(res,404,{error:'Grup bulunamadı.'});
   if(action==='rotate-link')g.shareToken=randomBytes(32).toString('base64url');
   else if(action==='disable-group')g.enabled=false;
   else if(action==='enable-group')g.enabled=true;
   else if(action==='delete-group'){store.groups=store.groups.filter(x=>x.id!==groupId);await writeStore(store);return reply(res,200,{ok:true});}
   else if(typeof action==='string'&&action.startsWith('remove-pdf:'))g.catalogs=g.catalogs.filter(x=>x.id!==action.slice('remove-pdf:'.length));
   else return reply(res,400,{error:'Bilinmeyen işlem.'});
   await writeStore(store);return reply(res,200,{ok:true});
  }
  res.setHeader('Allow','GET, POST, PATCH');return reply(res,405,{error:'Method not allowed.'});
 }catch(e:any){return reply(res,500,{error:e?.message||'GitHub katalog işlemi başarısız.'});}
}

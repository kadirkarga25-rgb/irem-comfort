import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createHmac, timingSafeEqual, randomBytes, randomUUID } from 'node:crypto';
import { put, get, del } from '@vercel/blob';
import { handleUpload } from '@vercel/blob/client';

type Pdf = { id:string; title:string; filename:string; size:number; pathname:string; blobUrl:string };
type Group = { id:string; name:string; description:string; enabled:boolean; shareToken:string; catalogs:Pdf[] };
type Store = { groups:Group[] };
const STORE_PATH='irem-comfort-private-catalogs/groups.json';
const BLOB_TOKEN=process.env.BLOB_READ_WRITE_TOKEN||'';
const ADMIN_SECRET=process.env.ADMIN_SESSION_SECRET||process.env.ADMIN_PASSWORD||'';
function reply(res:VercelResponse,status:number,data:unknown){res.setHeader('Cache-Control','private, no-store, max-age=0');return res.status(status).json(data);}
function equal(a:string,b:string){const x=Buffer.from(a);const y=Buffer.from(b);return x.length===y.length&&timingSafeEqual(x,y);}
function isAdminToken(token:string){
 if(!ADMIN_SECRET||!token.startsWith('sess2_'))return false;
 const [payload,sig]=token.slice(6).split('.');if(!payload||!sig)return false;
 const expected=createHmac('sha256',ADMIN_SECRET).update(payload).digest('base64url');if(!equal(sig,expected))return false;
 try{const p=JSON.parse(Buffer.from(payload,'base64url').toString('utf8'));return Number(p.exp)>Date.now();}catch{return false;}
}
function isAdmin(req:VercelRequest){const h=String(req.headers.authorization||'');return h.startsWith('Bearer ')&&isAdminToken(h.slice(7));}
async function readStore():Promise<Store>{
 try{const blob=await get(STORE_PATH,{access:'private',token:BLOB_TOKEN});if(!blob||blob.statusCode!==200)return{groups:[]};const chunks:Buffer[]=[];for await(const c of blob.stream as any)chunks.push(Buffer.from(c));return JSON.parse(Buffer.concat(chunks).toString('utf8')) as Store;}catch{return{groups:[]};}
}
async function writeStore(store:Store){await put(STORE_PATH,JSON.stringify(store),{access:'private',token:BLOB_TOKEN,addRandomSuffix:false,allowOverwrite:true,contentType:'application/json'});}
function filenameSafe(s:string){return s.replace(/[^\w.\- ()ğüşöçıİĞÜŞÖÇ]/gi,'_').slice(0,180)||'catalog.pdf';}
export default async function handler(req:VercelRequest,res:VercelResponse){
 if(!BLOB_TOKEN)return reply(res,503,{error:'Vercel Blob bağlı değil. BLOB_READ_WRITE_TOKEN ortam değişkenini ayarla.'});
 if(req.method==='POST'&&req.body?.type==='blob.generate-client-token'){
   const payloadRaw=String(req.body.payload||'');let client:any={};try{client=JSON.parse(payloadRaw||'{}');}catch{}
   if(!isAdminToken(String(client.adminToken||'')))return reply(res,401,{error:'Yönetici oturumu gerekli.'});
   const store=await readStore();const group=store.groups.find(g=>g.id===client.groupId);
   if(!group||!group.enabled||!String(client.filename||'').toLowerCase().endsWith('.pdf'))return reply(res,400,{error:'Grup veya PDF dosyası geçersiz.'});
   try{
    const result=await handleUpload({body:req.body,request:req,token:BLOB_TOKEN,onBeforeGenerateToken:async(pathname,clientPayload)=>{
      let data:any={};try{data=JSON.parse(String(clientPayload||'{}'));}catch{}
      if(!isAdminToken(String(data.adminToken||'')))throw new Error('Yönetici oturumu gerekli.');
      const current=await readStore();if(!current.groups.some(g=>g.id===data.groupId&&g.enabled))throw new Error('Grup kapalı veya bulunamadı.');
      return{allowedContentTypes:['application/pdf'],maximumSizeInBytes:100*1024*1024,addRandomSuffix:true,tokenPayload:JSON.stringify({groupId:data.groupId,filename:filenameSafe(String(data.filename||'Katalog.pdf')),size:Number(data.size)||0})};
    },onUploadCompleted:async({blob,tokenPayload})=>{
      const meta=JSON.parse(tokenPayload||'{}');const current=await readStore();const groupNow=current.groups.find(g=>g.id===meta.groupId);
      if(!groupNow||!groupNow.enabled){try{await del(blob.url,{token:BLOB_TOKEN});}catch{}return;}
      groupNow.catalogs.push({id:randomUUID(),title:String(meta.filename||'Katalog.pdf').replace(/\.pdf$/i,''),filename:String(meta.filename||'Katalog.pdf'),size:Number(meta.size)||blob.size||0,pathname:blob.pathname,blobUrl:blob.url});
      await writeStore(current);
    }});
    return res.status(200).json(result);
   }catch(e:any){return reply(res,400,{error:e?.message||'PDF yükleme yetkisi oluşturulamadı.'});}
 }
 if(req.method==='GET'&&typeof req.query.share==='string'&&typeof req.query.pdf!=='string'){
   const store=await readStore();const g=store.groups.find(x=>x.enabled&&x.shareToken===req.query.share);
   if(!g)return reply(res,404,{error:'Bu paylaşım bağlantısı geçersiz veya kapatılmış.'});
   return reply(res,200,{group:{id:g.id,name:g.name,description:g.description,catalogs:g.catalogs.map(({id,title,filename,size})=>({id,title,filename,size}))}});
 }
 if(req.method==='GET'&&typeof req.query.share==='string'&&typeof req.query.pdf==='string'){
   const store=await readStore();const g=store.groups.find(x=>x.enabled&&x.shareToken===req.query.share);const p=g?.catalogs.find(x=>x.id===req.query.pdf);
   if(!p)return reply(res,404,{error:'Katalog bulunamadı veya bağlantı iptal edildi.'});
   try{const blob=await get(p.pathname,{access:'private',token:BLOB_TOKEN});if(!blob||blob.statusCode!==200)return reply(res,404,{error:'PDF bulunamadı.'});
    res.status(200);res.setHeader('Content-Type','application/pdf');res.setHeader('Content-Disposition',`inline; filename*=UTF-8''${encodeURIComponent(p.filename)}`);res.setHeader('Cache-Control','private, no-store, max-age=0');
    for await(const chunk of blob.stream as any)res.write(Buffer.from(chunk));return res.end();
   }catch{return reply(res,404,{error:'PDF okunamadı.'});}
 }
 if(!isAdmin(req))return reply(res,401,{error:'Yönetici oturumu gerekli.'});
 const store=await readStore();
 if(req.method==='GET')return reply(res,200,{groups:store.groups});
 if(req.method==='POST'){
  const b=req.body||{};
  if(b.action==='create-group'){if(!String(b.name||'').trim())return reply(res,400,{error:'Grup adı gerekli.'});const g:Group={id:randomUUID(),name:String(b.name).trim().slice(0,120),description:String(b.description||'').trim().slice(0,500),enabled:true,shareToken:randomBytes(32).toString('base64url'),catalogs:[]};store.groups.unshift(g);await writeStore(store);return reply(res,201,{group:g});}
  return reply(res,400,{error:'Bilinmeyen işlem.'});
 }
 if(req.method==='PATCH'){
  const {action,groupId}=req.body||{};const g=store.groups.find(x=>x.id===groupId);if(!g)return reply(res,404,{error:'Grup bulunamadı.'});
  if(action==='rotate-link')g.shareToken=randomBytes(32).toString('base64url');
  else if(action==='disable-group')g.enabled=false;
  else if(action==='enable-group')g.enabled=true;
  else if(action==='delete-group'){for(const p of g.catalogs){try{await del(p.pathname,{token:BLOB_TOKEN});}catch{}}store.groups=store.groups.filter(x=>x.id!==groupId);await writeStore(store);return reply(res,200,{ok:true});}
  else if(typeof action==='string'&&action.startsWith('remove-pdf:')){const id=action.slice('remove-pdf:'.length);const p=g.catalogs.find(x=>x.id===id);if(p){try{await del(p.pathname,{token:BLOB_TOKEN});}catch{}}g.catalogs=g.catalogs.filter(x=>x.id!==id);}
  else return reply(res,400,{error:'Bilinmeyen işlem.'});
  await writeStore(store);return reply(res,200,{ok:true});
 }
 res.setHeader('Allow','GET, POST, PATCH');return reply(res,405,{error:'Method not allowed.'});
}

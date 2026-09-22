export type PdfLibraryItem = { id:string; name:string; filename:string; path:string; rawUrl:string; size:number; createdAt:number; updatedAt:number; };
const API='/api';
const token=()=>typeof window==='undefined'?'':sessionStorage.getItem('ic_catalog_admin_token')||'';
async function readJsonOrText(r:Response){const text=await r.text();if(!text)return {};try{return JSON.parse(text)}catch{return{error:text.slice(0,500)}}}
export async function listPdfLibrary():Promise<PdfLibraryItem[]>{const r=await fetch(`${API}/pdf-library/admin/list`,{cache:'no-store',headers:{Authorization:`Bearer ${token()}`}});const d=await readJsonOrText(r);if(!r.ok)throw new Error(d?.error||`PDF kütüphanesi alınamadı (HTTP ${r.status}).`);return Array.isArray(d?.files)?d.files:[];}
function bytesToBase64(bytes:Uint8Array){let binary='';const chunk=0x8000;for(let i=0;i<bytes.length;i+=chunk)binary+=String.fromCharCode(...bytes.subarray(i,i+chunk));return btoa(binary)}
function githubContentUrl(repo:string,path:string){return`https://api.github.com/repos/${repo}/contents/${path.split('/').map(encodeURIComponent).join('/')}`}
export async function uploadPdfToLibrary(file:File):Promise<PdfLibraryItem>{
 if(file.size>100*1024*1024)throw new Error('GitHub PDF Kütüphanesi için tek dosya en fazla 100 MB olabilir.');
 const sessionRes=await fetch(`${API}/pdf-library/upload-session`,{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${token()}`},body:JSON.stringify({filename:file.name})});
 const session=await readJsonOrText(sessionRes);if(!sessionRes.ok||!session?.success)throw new Error(session?.error||`GitHub yükleme oturumu alınamadı (HTTP ${sessionRes.status}).`);
 const base64=bytesToBase64(new Uint8Array(await file.arrayBuffer()));
 const githubRes=await fetch(githubContentUrl(session.repo,session.path),{method:'PUT',headers:{Authorization:`Bearer ${session.token}`,Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28','Content-Type':'application/json'},body:JSON.stringify({message:`PDF Kütüphanesi: ${session.filename}`,content:base64,branch:session.branch})});
 const githubData=await readJsonOrText(githubRes);if(!githubRes.ok)throw new Error(githubData?.message||githubData?.error||`GitHub PDF yüklemesi başarısız (HTTP ${githubRes.status}).`);
 const registerRes=await fetch(`${API}/pdf-library/register`,{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${token()}`},body:JSON.stringify({id:session.id,filename:session.filename,path:session.path,size:file.size})});
 const registered=await readJsonOrText(registerRes);if(!registerRes.ok||!registered?.success)throw new Error(registered?.error||`PDF yüklendi ancak kütüphane kaydı oluşturulamadı (HTTP ${registerRes.status}).`);return registered.file;
}
export async function deletePdfFromLibrary(id:string):Promise<void>{const r=await fetch(`${API}/pdf-library/delete`,{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${token()}`},body:JSON.stringify({id})});const d=await readJsonOrText(r);if(!r.ok||!d?.success)throw new Error(d?.error||'PDF silinemedi.');}
export function getPdfLibraryAdminToken(){return token();}

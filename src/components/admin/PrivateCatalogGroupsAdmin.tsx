import React, { useEffect, useState } from 'react';
import { Copy, Link2, LockKeyhole, Plus, RefreshCw, Trash2, Upload, ShieldCheck } from 'lucide-react';

type Pdf = { id: string; title: string; filename: string; size: number };
type Group = { id: string; name: string; description: string; enabled: boolean; shareToken: string; catalogs: Pdf[] };

export function PrivateCatalogGroupsAdmin({ sessionToken }: { sessionToken: string | null }) {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const api = async (method = 'GET', body?: unknown) => {
    const r = await fetch('/api/private-catalogs', { method, headers: { ...(sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {}), ...(body ? {'Content-Type':'application/json'} : {}) }, body: body ? JSON.stringify(body) : undefined, cache:'no-store' });
    const d = await r.json().catch(()=>({})); if (!r.ok) throw new Error(d.error || `İstek başarısız (${r.status})`); return d;
  };
  const load = async () => { setLoading(true); setError(''); try { setGroups((await api()).groups || []); } catch(e:any) { setError(e?.message || 'Gruplar yüklenemedi.'); } finally { setLoading(false); } };
  useEffect(()=>{ void load(); },[sessionToken]);
  const create = async () => { if (!name.trim()) { setError('Grup adı gir.'); return; } setBusy(true); try { await api('POST',{action:'create-group',name:name.trim(),description:description.trim()}); setName('');setDescription('');await load(); } catch(e:any){setError(e?.message||'Grup oluşturulamadı.');} finally{setBusy(false);} };
  const mutate = async (action:string,groupId:string) => { setBusy(true);setError('');try{await api('PATCH',{action,groupId});await load();}catch(e:any){setError(e?.message||'İşlem tamamlanamadı.');}finally{setBusy(false);} };
  const shareUrl = (token:string) => `${window.location.origin}/katalog-ozel/${token}`;
  const copy = async (value:string) => { try { await navigator.clipboard.writeText(value); } catch { setError('Bağlantı kopyalanamadı.'); } };
  const uploadPdf = async (group:Group,file?:File) => {
    if(!file)return;
    if(!file.name.toLowerCase().endsWith('.pdf') || (file.type && file.type!=='application/pdf')) {setError('Yalnızca PDF yükleyebilirsin.');return;}
    if(!sessionToken){setError('Yönetici oturumu bulunamadı.');return;}
    if(file.size>80*1024*1024){setError('PDF en fazla 80 MB olabilir.');return;}
    setBusy(true);setError('');
    const call = async (body:unknown) => {
      const r=await fetch('/api/private-catalogs',{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${sessionToken}`},body:JSON.stringify(body),cache:'no-store'});
      const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d.error||`İstek başarısız (${r.status})`);return d;
    };
    try {
      const meta=await call({action:'upload-init',groupId:group.id,filename:file.name,size:file.size});
      const bytes=new Uint8Array(await file.arrayBuffer());
      const chunkSize=meta.chunkSize as number;
      const total=Math.ceil(bytes.length/chunkSize);
      for(let index=0;index<total;index++){
        const part=bytes.subarray(index*chunkSize,Math.min((index+1)*chunkSize,bytes.length));
        let binary='';for(let i=0;i<part.length;i++)binary+=String.fromCharCode(part[i]);
        await call({action:'upload-chunk',groupId:group.id,fileId:meta.fileId,index,total,chunkBase64:btoa(binary)});
      }
      await call({action:'upload-finish',groupId:group.id,fileId:meta.fileId,chunks:total,size:file.size,filename:meta.filename});
      await load();
    } catch(e:any) { setError(e?.message || 'PDF yüklenemedi. GitHub erişim ayarlarını kontrol et.'); }
    finally {setBusy(false);}
  };
  return <section style={{marginTop:24,padding:20,border:'1px solid #e7dfd5',borderRadius:16,background:'#fff'}}>
    <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:8}}><div style={{width:42,height:42,display:'grid',placeItems:'center',borderRadius:12,background:'#f3e8d0',color:'#7c5a22'}}><LockKeyhole size={21}/></div><div><div className="eyebrow">ÖZEL PAYLAŞIM</div><h3 style={{fontSize:21,fontWeight:650}}>Gizli Katalog Grupları</h3></div></div>
    <p style={{color:'#64748b',fontSize:13,marginBottom:18}}>Bu gruplar genel katalog arşivinde görünmez. PDF'ler şifrelenerek mevcut GitHub deposunda ayrı bir veri dalında saklanır.</p>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:10,marginBottom:18}}><input value={name} onChange={e=>setName(e.target.value)} placeholder="Grup adı (örn. Yeni Modeller)"/><input value={description} onChange={e=>setDescription(e.target.value)} placeholder="Kısa açıklama (isteğe bağlı)"/><button className="btn btn-primary" onClick={create} disabled={busy}><Plus size={16}/> Grup oluştur</button></div>
    {error && <div role="alert" style={{padding:12,borderRadius:8,background:'#fff1f2',color:'#be123c',marginBottom:14}}>{error}</div>}
    {loading ? <p>Gruplar yükleniyor…</p> : !groups.length ? <p style={{color:'#64748b'}}>Henüz gizli grup yok.</p> : <div style={{display:'grid',gap:14}}>{groups.map(g=><article key={g.id} style={{border:'1px solid #e2e8f0',borderRadius:14,padding:16}}>
      <div style={{display:'flex',gap:12,justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap'}}><div><h4 style={{fontWeight:650,fontSize:16}}>{g.name}</h4><p style={{color:'#64748b',fontSize:12}}>{g.description||'Açıklama yok'} · {g.catalogs.length} katalog</p><span style={{fontSize:11,color:g.enabled?'#15803d':'#b91c1c'}}>{g.enabled?'Paylaşım açık':'Devre dışı'}</span></div><div style={{display:'flex',gap:7,flexWrap:'wrap'}}><button className="btn btn-secondary" onClick={()=>copy(shareUrl(g.shareToken))}><Copy size={15}/> Bağlantıyı kopyala</button><button className="btn btn-secondary" onClick={()=>mutate('rotate-link',g.id)} disabled={busy}><RefreshCw size={15}/> Linki yenile</button><button className="btn btn-secondary" onClick={()=>mutate(g.enabled?'disable-group':'enable-group',g.id)} disabled={busy}>{g.enabled?'Paylaşımı kapat':'Paylaşımı aç'}</button><button className="btn btn-secondary" onClick={()=>mutate('delete-group',g.id)} disabled={busy}><Trash2 size={14}/> Sil</button></div></div>
      <div style={{marginTop:12,padding:10,background:'#f8fafc',borderRadius:9,display:'flex',gap:8,alignItems:'center',overflowWrap:'anywhere'}}><Link2 size={15}/><code style={{fontSize:12}}>{shareUrl(g.shareToken)}</code></div>
      <div style={{display:'flex',justifyContent:'space-between',gap:10,alignItems:'center',marginTop:14,flexWrap:'wrap'}}><strong style={{fontSize:13}}>Gruptaki kataloglar</strong><label className="btn btn-secondary" style={{cursor:busy?'wait':'pointer'}}><Upload size={15}/> PDF ekle<input type="file" accept="application/pdf,.pdf" hidden disabled={busy} onChange={e=>{void uploadPdf(g,e.target.files?.[0]);e.currentTarget.value='';}}/></label></div>
      {g.catalogs.length ? <ul style={{marginTop:8,display:'grid',gap:6}}>{g.catalogs.map(p=><li key={p.id} style={{display:'flex',justifyContent:'space-between',gap:8,alignItems:'center',fontSize:13,padding:'8px 0',borderBottom:'1px solid #f1f5f9'}}><span>{p.title} <small style={{color:'#64748b'}}>({(p.size/1024/1024).toFixed(1)} MB)</small></span><button className="btn btn-secondary" onClick={()=>mutate(`remove-pdf:${p.id}`,g.id)} disabled={busy}><Trash2 size={14}/> Kaldır</button></li>)}</ul> : <p style={{fontSize:12,color:'#64748b',marginTop:8}}>Henüz PDF eklenmedi.</p>}
    </article>)}</div>}
    <div style={{display:'flex',gap:8,alignItems:'flex-start',marginTop:18,fontSize:12,color:'#64748b'}}><ShieldCheck size={16}/><span>Bağlantıyı yenilemek eski linki iptal eder. PDF'ler şifreli saklanır; sunucu bağlantıyı her istekte kontrol eder.</span></div>
  </section>;
}

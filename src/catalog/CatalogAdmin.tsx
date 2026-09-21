import React, { useEffect, useRef, useState } from 'react';
import { Plus, Settings2, Eye, EyeOff, Check, Trash2, ArrowUp, ArrowDown, Upload, FileSearch, BookOpen } from 'lucide-react';
import { Catalog, Collection, clearCatalogAdminToken, getCatalog, getCatalogAdminToken, listCatalogs, saveCatalog, deleteCatalog, setCatalogAdminToken } from './db';
import { detectStructure, extractText, readPdf } from './pdf';
import { CatalogLink } from './router';

export function CatalogAdminLogin(){
  return <div className="catalog-admin-message"><strong>Ana yönetici panelinden açılmalıdır.</strong><span>Katalog yönetimi artık ayrı bir yönetici girişi kullanmaz.</span></div>;
}

function EmbeddedFrame({children}:{children:React.ReactNode}){
  return <div className="catalog-admin-embedded">{children}</div>;
}

export function CatalogAdminHome({ embedded=false, onNew, onEdit }:{embedded?:boolean;onNew?:()=>void;onEdit?:(id:string)=>void}){
  const [c,setC]=useState<Catalog[]>([]);
  const [loading,setLoading]=useState(true);
  const load=()=>{setLoading(true);listCatalogs(true).then(setC).finally(()=>setLoading(false));};
  useEffect(load,[]);
  const latest=Math.max(...c.map(x=>Number(x.year)||0),0);
  const body=<>
    <div className="catalog-admin-heading">
      <div><div className="eyebrow">KATALOG ARŞİVİ</div><h2 className="serif">Katalog Yönetimi</h2><p>PDF yükle, yapıyı kontrol et, koleksiyonları düzenle ve yayınla.</p></div>
      <button className="btn btn-primary" onClick={onNew}><Plus size={18}/> Yeni Katalog</button>
    </div>
    <div className="admin-summary"><div><strong>{c.length}</strong><span>Toplam katalog</span></div><div><strong>{c.filter(x=>x.published).length}</strong><span>Yayında</span></div><div><strong>{c.filter(x=>!x.published).length}</strong><span>Taslak</span></div><div><strong>{latest||'—'}</strong><span>Son yıl</span></div></div>
    <div className="panel">{loading?<div className="empty">Kataloglar yükleniyor…</div>:<table className="table"><thead><tr><th>Katalog</th><th>Sezon</th><th>Sayfa</th><th>Koleksiyon</th><th>Durum</th><th></th></tr></thead><tbody>{c.map(x=><tr key={x.id}><td><strong>{x.title}</strong><div className="meta">{x.year}</div></td><td>{x.season}</td><td>{x.pages}</td><td>{x.collections.length}</td><td><span className={`status-pill ${x.published?'published':'draft'}`}>{x.published?'Yayında':'Taslak'}</span></td><td><div style={{display:'flex',gap:7,flexWrap:'wrap'}}><CatalogLink className="btn btn-secondary" href={`/katalog/${x.id}`}><BookOpen size={16}/> Aç</CatalogLink><button className="btn btn-secondary" onClick={()=>onEdit?.(x.id)}><Settings2 size={16}/> Düzenle</button></div></td></tr>)}</tbody></table>}{!loading&&!c.length&&<div className="empty">Henüz katalog eklenmemiş.</div>}</div>
  </>;
  return embedded?body:<EmbeddedFrame>{body}</EmbeddedFrame>;
}

export function CatalogAdminNew({ embedded=false, onCancel, onSaved }:{embedded?:boolean;onCancel?:()=>void;onSaved?:(id:string)=>void}){
  const input=useRef<HTMLInputElement>(null);
  const [title,setTitle]=useState(''),[year,setYear]=useState(String(new Date().getFullYear())),[season,setSeason]=useState('Yeni Sezon'),[tags,setTags]=useState(''),[description,setDescription]=useState(''),[file,setFile]=useState<File>(),[cover,setCover]=useState(''),[busy,setBusy]=useState(false),[status,setStatus]=useState(''),[error,setError]=useState(''),[progress,setProgress]=useState(0),[analysis,setAnalysis]=useState<any>(null),[draft,setDraft]=useState<Catalog|null>(null);
  const selectCover=(f?:File)=>{if(!f)return;const r=new FileReader();r.onload=()=>setCover(String(r.result||''));r.readAsDataURL(f)};
  const analyze=async()=>{
    if(!file){setError('Önce PDF seç.');return;}
    setBusy(true);setError('');setStatus('PDF hazırlanıyor…');setAnalysis(null);setDraft(null);
    try{
      const id=`catalog-${Date.now()}`;
      setStatus('1/4 · PDF sayfaları okunuyor…');
      const r=await readPdf(file,setProgress);
      setStatus('2/4 · Metin katmanı çıkarılıyor…');
      const t=await extractText(file);
      setStatus('3/4 · Koleksiyon ve içindekiler analiz ediliyor…');
      const structure=detectStructure(t.pageTexts,r.count);
      const c:Catalog={id,title:title||file.name.replace(/\.pdf$/i,''),year,season,description,tags:tags.split(',').map(x=>x.trim()).filter(Boolean),cover,pdf:r.data,pages:r.count,collections:structure.collections,contents:structure.contents,pageTexts:t.pageTexts,createdAt:Date.now(),published:false};
      setDraft(c);setAnalysis(structure.analysis);setStatus('4/4 · Analiz tamamlandı. Yayınlamadan önce sonuçları kontrol edin.');
    }catch(e:any){setError(e?.message||'PDF analiz edilemedi.')}finally{setBusy(false)}
  };
  const saveAnalyzed=async()=>{if(!draft)return;setBusy(true);setError('');setStatus('Katalog GitHub kalıcı alanına yükleniyor…');try{await saveCatalog(draft);setStatus('Katalog başarıyla kaydedildi. Şimdi koleksiyonları tek tek düzenleyebilirsiniz.');onSaved?.(draft.id)}catch(e:any){setError(e?.message||'Katalog kalıcı olarak kaydedilemedi.')}finally{setBusy(false)}};
  const body=<div className="panel catalog-create-panel">
    <div className="catalog-create-intro"><div><div className="eyebrow">YENİ KATALOG</div><h2 className="serif">Kataloğu sisteme al</h2><p>PDF'yi yükle. Sistem sayfaları, metinleri, koleksiyon başlıklarını ve içindekileri analiz etsin. Sonuçları kontrol ettikten sonra kaydet.</p></div><div className="analysis-badge"><FileSearch size={17}/><span>Akıllı PDF Analizi</span></div></div>
    <div className="form-grid"><div className="field"><label>Katalog adı</label><input value={title} onChange={e=>setTitle(e.target.value)} placeholder="2026 / 2027 Yeni Sezon"/></div><div className="field"><label>Yıl</label><input value={year} onChange={e=>setYear(e.target.value)}/></div><div className="field"><label>Sezon</label><input value={season} onChange={e=>setSeason(e.target.value)}/></div><div className="field"><label>Etiketler</label><input value={tags} onChange={e=>setTags(e.target.value)} placeholder="Kadın, Comfort, Sabo"/></div><div className="field full"><label>Kapak görseli <span className="field-hint">İsteğe bağlı</span></label><input type="file" accept="image/*" onChange={e=>selectCover(e.target.files?.[0])}/></div><div className="field full"><label>Açıklama</label><textarea rows={3} value={description} onChange={e=>setDescription(e.target.value)} placeholder="Katalog hakkında kısa açıklama…"/></div><div className="field full"><label>PDF katalog</label><div className={`dropzone ${file?'has-file':''}`} onClick={()=>!busy&&input.current?.click()} onDragOver={e=>{e.preventDefault();e.currentTarget.classList.add('is-dragging')}} onDragLeave={e=>e.currentTarget.classList.remove('is-dragging')} onDrop={e=>{e.preventDefault();e.currentTarget.classList.remove('is-dragging');const f=e.dataTransfer.files?.[0];if(f)setFile(f)}}><input ref={input} hidden type="file" accept="application/pdf,.pdf" onChange={e=>setFile(e.target.files?.[0])}/>{file?<><FileSearch size={30}/><strong>{file.name}</strong><span>{(file.size/1024/1024).toFixed(1)} MB · Analize hazır</span></>:<><Upload size={30}/><strong>PDF'yi buraya bırak veya seç</strong><span>PDF sayfaları otomatik taranır.</span></>}</div></div></div>
    {busy&&<div className="analysis-progress"><div className="status">{status}</div><div className="progress-track"><div className="progress-fill" style={{width:`${progress}%`}}/></div><span>%{progress} · PDF işleniyor</span></div>}
    {!busy&&status&&<div className="status" style={{marginTop:18}}>{status}</div>}{error&&<div className="status error" style={{marginTop:12}}>{error}</div>}
    {analysis&&draft&&<div className="analysis-report"><div className="analysis-report-head"><div><div className="eyebrow">ANALİZ SONUCU</div><h3 className="serif">Katalog yapısı hazır</h3><p>Otomatik tespitleri yayınlamadan önce kontrol edebilirsiniz.</p></div><div className="confidence"><strong>%{analysis.confidence}</strong><span>analiz güveni</span></div></div><div className="analysis-metrics"><div><strong>{analysis.pages}</strong><span>Toplam sayfa</span></div><div><strong>{analysis.pagesWithText}</strong><span>Metin bulunan sayfa</span></div><div><strong>{analysis.collectionsFound}</strong><span>Tespit edilen koleksiyon</span></div><div><strong>{analysis.contentsFound}</strong><span>İçindekiler girdisi</span></div></div><div className="analysis-columns"><div><h4>Koleksiyonlar</h4><ol>{draft.collections.map((x,i)=><li key={x.id}><span>{String(i+1).padStart(2,'0')}</span><b>{x.name}</b><small>Sy. {x.startPage}–{x.endPage}</small></li>)}</ol></div><div><h4>İçindekiler</h4><ol>{draft.contents.slice(0,16).map((x,i)=><li key={`${x.title}-${i}`}><b>{x.title}</b><small>Sy. {x.page}</small></li>)}</ol></div></div>{analysis.warnings?.length>0&&<div className="analysis-warnings"><strong>Kontrol edilmesi gerekenler</strong>{analysis.warnings.map((w:string,i:number)=><div key={i}>• {w}</div>)}</div>}</div>}
    <div className="admin-actions">{analysis&&draft?<><button className="btn btn-primary" onClick={saveAnalyzed} disabled={busy}><Check size={18}/> Analizi Onayla ve Kaydet</button><button className="btn btn-secondary" onClick={()=>{setAnalysis(null);setDraft(null);setStatus('')}} disabled={busy}>Tekrar Analiz Et</button></>:<button className="btn btn-primary" onClick={analyze} disabled={busy||!file}><FileSearch size={18}/>{busy?'Analiz ediliyor…':'PDF Yükle ve Analiz Et'}</button>}<button className="btn btn-secondary" onClick={onCancel} disabled={busy}>İptal</button></div>
  </div>;
  return embedded?body:<EmbeddedFrame>{body}</EmbeddedFrame>;
}

export function CatalogAdminEdit({id, embedded=false, onBack }:{id:string;embedded?:boolean;onBack?:()=>void}){
  const [c,setC]=useState<Catalog>();const [cols,setCols]=useState<Collection[]>([]),[tags,setTags]=useState(''),[status,setStatus]=useState('');
  useEffect(()=>{getCatalog(id,true).then(x=>{setC(x);setCols(x?.collections||[]);setTags((x?.tags||[]).join(', '))})},[id]);
  if(!c)return <div className="empty">Katalog yükleniyor…</div>;
  const update=(i:number,p:Partial<Collection>)=>setCols(a=>a.map((x,n)=>n===i?{...x,...p}:x));
  const add=()=>setCols(a=>[...a,{id:`collection-${Date.now()}`,name:`Yeni Koleksiyon ${a.length+1}`,startPage:Math.min(c.pages,(a.at(-1)?.endPage||0)+1),endPage:c.pages}]);
  const move=(i:number,d:-1|1)=>setCols(a=>{const b=[...a],j=i+d;if(j<0||j>=b.length)return a;[b[i],b[j]]=[b[j],b[i]];return b});
  const save=async(pub=c.published)=>{const normalized=cols.map(x=>({...x,startPage:Math.max(1,Math.min(c.pages,Number(x.startPage)||1)),endPage:Math.max(1,Math.min(c.pages,Number(x.endPage)||c.pages))})).map(x=>({...x,endPage:Math.max(x.startPage,x.endPage)}));const next={...c,collections:normalized,tags:tags.split(',').map(x=>x.trim()).filter(Boolean),published:pub};try{await saveCatalog(next);setC(next);setCols(normalized);setStatus(pub?'Katalog yayınlandı.':'Taslak kaydedildi.')}catch(e:any){setStatus(e?.message||'Kaydetme başarısız.')}};
  const remove=async()=>{if(!confirm('Bu katalog silinsin mi?'))return;await deleteCatalog(c.id);onBack?.()};
  const body=<><div className="catalog-admin-heading"><div><div className="eyebrow">TARANAN YAPI · {c.year}</div><h2 className="serif">{c.title}</h2><p>Tarama sonucunu yayınlamadan önce düzenleyebilirsin.</p></div><span className={`status-pill ${c.published?'published':'draft'}`}>{c.published?'YAYINDA':'TASLAK'}</span></div><div className="panel"><div className="form-grid"><div className="field"><label>Katalog adı</label><input value={c.title} onChange={e=>setC({...c,title:e.target.value})}/></div><div className="field"><label>Yıl</label><input value={c.year} onChange={e=>setC({...c,year:e.target.value})}/></div><div className="field"><label>Sezon</label><input value={c.season} onChange={e=>setC({...c,season:e.target.value})}/></div><div className="field"><label>Etiketler</label><input value={tags} onChange={e=>setTags(e.target.value)}/></div><div className="field full"><label>Açıklama</label><textarea rows={3} value={c.description} onChange={e=>setC({...c,description:e.target.value})}/></div></div><div className="edit-toolbar"><div><strong>{cols.length} koleksiyon</strong><span className="meta"> · {c.pages} sayfa</span></div><button className="btn btn-secondary" onClick={add}><Plus size={17}/> Koleksiyon Ekle</button></div><div className="collection-editor">{cols.map((x,i)=><div className="collection-row" key={x.id}><div className="collection-index">{String(i+1).padStart(2,'0')}</div><div className="collection-fields"><div className="field"><label>Koleksiyon adı</label><input value={x.name} onChange={e=>update(i,{name:e.target.value})}/></div><div className="range-fields"><div className="field"><label>Başlangıç</label><input type="number" min={1} max={c.pages} value={x.startPage} onChange={e=>update(i,{startPage:Number(e.target.value)})}/></div><div className="field"><label>Bitiş</label><input type="number" min={1} max={c.pages} value={x.endPage} onChange={e=>update(i,{endPage:Number(e.target.value)})}/></div></div></div><div className="collection-actions"><button className="icon-btn" onClick={()=>move(i,-1)} disabled={!i}><ArrowUp size={16}/></button><button className="icon-btn" onClick={()=>move(i,1)} disabled={i===cols.length-1}><ArrowDown size={16}/></button></div></div>)}</div>{status&&<div className="status" style={{marginTop:18}}>{status}</div>}<div className="admin-actions"><button className="btn btn-secondary" onClick={()=>save(false)}><EyeOff size={17}/> Taslak Kaydet</button>{c.published?<button className="btn btn-secondary" onClick={()=>save(false)}>Yayından Kaldır</button>:<button className="btn btn-primary" onClick={()=>save(true)}><Eye size={17}/> Yayınla</button>}<button className="btn btn-secondary" onClick={()=>save(c.published)}><Check size={17}/> Değişiklikleri Kaydet</button><button className="btn btn-danger" onClick={remove}><Trash2 size={17}/> Kataloğu Sil</button><button className="btn btn-secondary" onClick={onBack}>Katalog Listesine Dön</button></div></div></>;
  return embedded?body:<EmbeddedFrame>{body}</EmbeddedFrame>;
}

export function CatalogAdminPanel({sessionToken}:{sessionToken:string|null}){
  const [view,setView]=useState<'home'|'new'|'edit'>('home');
  const [editId,setEditId]=useState<string>('');
  useEffect(()=>{if(sessionToken)setCatalogAdminToken(sessionToken);},[sessionToken]);
  if(!sessionToken)return <div className="catalog-admin-message"><strong>Yönetici oturumu bulunamadı.</strong><span>Admin paneline yeniden giriş yapın.</span></div>;
  return <EmbeddedFrame>
    {view==='home'&&<CatalogAdminHome embedded onNew={()=>setView('new')} onEdit={(id)=>{setEditId(id);setView('edit')}}/>}
    {view==='new'&&<CatalogAdminNew embedded onCancel={()=>setView('home')} onSaved={(id)=>{setEditId(id);setView('edit')}}/>}
    {view==='edit'&&editId&&<CatalogAdminEdit embedded id={editId} onBack={()=>setView('home')}/>} 
  </EmbeddedFrame>;
}

export function CatalogAdminEntry(){
  const token=getCatalogAdminToken();
  if(!token)return <CatalogAdminLogin/>;
  return <CatalogAdminHome/>;
}

import React, { useEffect, useState } from 'react';
import { ArrowLeft, Download, FileText, LockKeyhole } from 'lucide-react';

type PdfItem = { id: string; title: string; filename: string; size: number };
type Group = { id: string; name: string; description: string; catalogs: PdfItem[] };

export function PrivateCatalogViewer({ token }: { token: string }) {
  const [group, setGroup] = useState<Group | null>(null);
  const [selected, setSelected] = useState<PdfItem | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    fetch(`/api/private-catalogs?share=${encodeURIComponent(token)}`, { cache: 'no-store' })
      .then(async r => { const d = await r.json().catch(() => ({})); if (!r.ok) throw new Error(d.error || 'Paylaşım bağlantısı geçersiz.'); return d; })
      .then(d => { if (active) { setGroup(d.group); setSelected(d.group?.catalogs?.[0] || null); } })
      .catch(e => { if (active) setError(e?.message || 'Kataloglar yüklenemedi.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [token]);
  const pdfUrl = selected ? `/api/private-catalogs?share=${encodeURIComponent(token)}&pdf=${encodeURIComponent(selected.id)}` : '';
  return <main style={{minHeight:'100vh',background:'#f8f6f2',color:'#24150f'}}>
    <header style={{background:'#fff',borderBottom:'1px solid #e8e0d6',padding:'18px clamp(18px,5vw,64px)',display:'flex',alignItems:'center',justifyContent:'space-between',gap:16}}>
      <a href="/" style={{fontWeight:700,letterSpacing:'.12em',fontSize:13,textDecoration:'none',color:'inherit'}}>İREM COMFORT</a>
      <span style={{display:'inline-flex',gap:7,alignItems:'center',fontSize:12,color:'#7c5a22'}}><LockKeyhole size={15}/> Özel katalog paylaşımı</span>
    </header>
    <div style={{maxWidth:1200,margin:'0 auto',padding:'36px 20px 64px'}}>
      {loading ? <p>Kataloglar yükleniyor…</p> : error ? <section style={{background:'#fff',border:'1px solid #eadfd3',borderRadius:18,padding:28}}><h1 style={{fontSize:24,fontWeight:700}}>Kataloğa erişilemiyor</h1><p style={{marginTop:8,color:'#786b60'}}>{error}</p><a href="/" style={{display:'inline-flex',marginTop:18,gap:8,alignItems:'center'}}><ArrowLeft size={16}/> Ana sayfaya dön</a></section> : group && <>
        <div style={{marginBottom:26}}><div style={{fontSize:11,letterSpacing:'.18em',color:'#9a7437',fontWeight:700}}>MÜŞTERİYE ÖZEL</div><h1 style={{fontFamily:'Georgia,serif',fontSize:'clamp(30px,5vw,46px)',marginTop:8}}>{group.name}</h1>{group.description && <p style={{color:'#786b60',marginTop:10,maxWidth:700}}>{group.description}</p>}</div>
        {!group.catalogs.length ? <p>Bu grupta henüz katalog bulunmuyor.</p> : <div style={{display:'grid',gridTemplateColumns:'minmax(220px,300px) minmax(0,1fr)',gap:22}}>
          <aside style={{display:'grid',alignContent:'start',gap:8}}>{group.catalogs.map(p=><button key={p.id} onClick={()=>setSelected(p)} style={{textAlign:'left',padding:14,borderRadius:12,border:selected?.id===p.id?'1px solid #b8862f':'1px solid #e5ded5',background:selected?.id===p.id?'#fff8eb':'#fff',color:'inherit',cursor:'pointer'}}><span style={{display:'flex',gap:9,alignItems:'center'}}><FileText size={18}/><strong>{p.title}</strong></span><small style={{display:'block',color:'#887b70',marginTop:6}}>{(p.size/1024/1024).toFixed(1)} MB</small></button>)}</aside>
          <section style={{minWidth:0,background:'#fff',border:'1px solid #e8e0d6',borderRadius:14,overflow:'hidden'}}><div style={{padding:14,display:'flex',justifyContent:'space-between',alignItems:'center',gap:12,borderBottom:'1px solid #eee7df'}}><strong>{selected?.title || 'Katalog'}</strong>{selected && <a href={pdfUrl} target="_blank" rel="noreferrer" style={{display:'inline-flex',gap:7,alignItems:'center',fontSize:13,color:'#7c5a22'}}><Download size={16}/> PDF aç</a>}</div>{selected && <iframe key={selected.id} title={selected.title} src={pdfUrl} style={{width:'100%',height:'min(78vh,1000px)',border:0}}/>}</section>
        </div>}
      </>}
    </div>
  </main>;
}

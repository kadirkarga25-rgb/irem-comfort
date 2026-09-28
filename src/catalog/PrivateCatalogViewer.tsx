import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, ChevronLeft, ChevronRight, FileText, Layers3, LockKeyhole, MessageCircle } from 'lucide-react';
import { getPdfPageCount, renderPdfPage } from './pdf';

type PdfItem = { id: string; title: string; filename: string; size: number };
type Group = { id: string; name: string; description: string; catalogs: PdfItem[] };

const styles = `
.private-catalog-page{min-height:100vh;background:#f5f7f9;color:#132435;font-family:'DM Sans',Arial,sans-serif}
.private-catalog-header{height:68px;background:#071a2b;color:#fff;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:0 clamp(14px,4vw,42px);position:sticky;top:0;z-index:20}
.private-catalog-brand{color:#fff;text-decoration:none;font-size:12px;font-weight:800;letter-spacing:.13em;white-space:nowrap}
.private-catalog-container{width:min(1180px,100%);margin:0 auto;padding:clamp(18px,4vw,42px) clamp(12px,3vw,28px) 56px}
.private-catalog-title{font-family:'Playfair Display',Georgia,serif;font-size:clamp(30px,5vw,46px);line-height:1.08;margin:8px 0 10px;color:#071a2b}
.private-catalog-eyebrow{font-size:11px;letter-spacing:.17em;font-weight:800;color:#9a7437}
.private-catalog-muted{color:#708092;line-height:1.6}
.private-catalog-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px}
.private-catalog-card{padding:0;text-align:left;border:1px solid #dce4ea;border-radius:16px;background:#fff;overflow:hidden;color:inherit;box-shadow:0 8px 24px rgba(7,26,43,.06);transition:transform .18s,box-shadow .18s}
.private-catalog-card:hover{transform:translateY(-3px);box-shadow:0 18px 40px rgba(7,26,43,.13)}
.private-catalog-cover{aspect-ratio:3/4;background:linear-gradient(145deg,#071a2b,#31526b);display:flex;align-items:center;justify-content:center;overflow:hidden}
.private-catalog-cover img{width:100%;height:100%;object-fit:contain;background:#fff;display:block}
.private-catalog-cover-placeholder{color:#fff;text-align:center;padding:20px;font-family:Georgia,serif;font-size:23px}
.private-catalog-card-body{padding:15px 16px 17px}
.private-catalog-card-body h2{font-size:17px;line-height:1.35;margin:0 0 7px;color:#071a2b}
.private-catalog-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;border:1px solid #d5dee5;border-radius:10px;padding:10px 13px;background:#fff;color:#071a2b;text-decoration:none;font-size:13px;font-weight:700;cursor:pointer;min-height:42px}
.private-catalog-btn.primary{background:#071a2b;border-color:#071a2b;color:#fff}
.private-catalog-btn.whatsapp{background:#137a50;border-color:#137a50;color:#fff}
.private-catalog-btn:disabled{opacity:.4;cursor:not-allowed}
.private-catalog-actions{display:flex;gap:8px;flex-wrap:wrap}
.private-book-shell{background:#e7edf2;border:1px solid #d7e0e7;border-radius:18px;overflow:hidden}
.private-book-toolbar{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 14px;background:#fff;border-bottom:1px solid #dce4ea}
.private-book-stage{min-height:0;padding:18px;display:flex;align-items:center;justify-content:center;touch-action:pan-y}
.private-book-page{position:relative;background:transparent;width:min(680px,100%);height:auto;min-height:0;box-shadow:none;display:flex;align-items:center;justify-content:center;overflow:visible}
.private-book-page img{display:block;width:auto;height:auto;max-width:100%;max-height:calc(100dvh - 250px);object-fit:contain;background:#fff;box-shadow:0 18px 48px rgba(7,26,43,.18);user-select:none;-webkit-user-drag:none}
.private-book-page-turn{animation:privatePageTurn .22s ease}
@keyframes privatePageTurn{0%{opacity:.55;transform:rotateY(-5deg)}100%{opacity:1;transform:rotateY(0)}}
.private-book-controls{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:12px 14px;background:#fff;border-top:1px solid #dce4ea}
.private-book-count{font-size:13px;color:#607487;font-weight:700;white-space:nowrap}
.private-catalog-switcher{display:flex;gap:8px;overflow:auto;padding:12px;background:#fff;border-top:1px solid #dce4ea}
.private-catalog-switcher button{flex:0 0 auto;max-width:220px;text-align:left;border:1px solid #dce4ea;background:#fff;border-radius:10px;padding:9px 12px;font-size:12px;color:#132435}
.private-catalog-switcher button.active{border-color:#b8862f;background:#fff8eb}
.private-catalog-error{padding:18px;border:1px solid #fecdd3;background:#fff1f2;color:#be123c;border-radius:12px}
@media(max-width:760px){.private-catalog-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:11px}.private-catalog-container{padding:18px 12px 34px}.private-catalog-header{height:58px}.private-book-stage{padding:8px;min-height:0}.private-book-page{width:100%;height:auto;min-height:0}.private-book-page img{max-height:calc(100dvh - 230px)}.private-book-toolbar{padding:10px;align-items:flex-start}.private-book-toolbar strong{font-size:13px}.private-book-controls{padding:10px;gap:6px}.private-catalog-btn{padding:9px 10px;font-size:12px}.private-catalog-card-body{padding:11px}.private-catalog-card-body h2{font-size:14px}.private-catalog-title{font-size:32px}.private-catalog-card .private-catalog-cover{aspect-ratio:3/4}.private-catalog-switcher button{max-width:165px}}
@media(max-width:380px){.private-catalog-grid{grid-template-columns:1fr 1fr}.private-catalog-actions{gap:6px}.private-book-count{font-size:11px}}
`;

function dataUrlToFile(dataUrl:string,name:string){const [meta,b64]=dataUrl.split(',');const mime=meta.match(/data:(.*?);base64/)?.[1]||'image/jpeg';const raw=atob(b64);const bytes=new Uint8Array(raw.length);for(let i=0;i<raw.length;i++)bytes[i]=raw.charCodeAt(i);return new File([bytes],name,{type:mime});}

export function PrivateCatalogViewer({ token }: { token: string }) {
  const [group,setGroup]=useState<Group|null>(null);
  const [selected,setSelected]=useState<PdfItem|null>(null);
  const [page,setPage]=useState(1);
  const [pageCount,setPageCount]=useState(1);
  const [coverImages,setCoverImages]=useState<Record<string,string>>({});
  const [pageImage,setPageImage]=useState('');
  const [pageLoading,setPageLoading]=useState(false);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState('');
  const [pageError,setPageError]=useState('');
  const [turning,setTurning]=useState(false);
  const touchStart=useRef<{x:number;y:number}|null>(null);

  const pdfUrl=useMemo(()=>selected?'/api/private-catalogs?share='+encodeURIComponent(token)+'&pdf='+encodeURIComponent(selected.id):'',[selected,token]);

  useEffect(()=>{
    let active=true;
    setLoading(true);setError('');setGroup(null);setSelected(null);setPage(1);
    fetch('/api/private-catalogs?share='+encodeURIComponent(token),{cache:'no-store'})
      .then(async r=>{const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d.error||'Paylaşım bağlantısı geçersiz.');return d;})
      .then(d=>{if(active){setGroup(d.group);setSelected(null);}})
      .catch(e=>{if(active)setError(e?.message||'Kataloglar yüklenemedi.');})
      .finally(()=>{if(active)setLoading(false);});
    return()=>{active=false;};
  },[token]);

  useEffect(()=>{
    if(!group?.catalogs?.length)return;
    let active=true;
    group.catalogs.forEach(item=>{
      if(coverImages[item.id])return;
      renderPdfPage('/api/private-catalogs?share='+encodeURIComponent(token)+'&pdf='+encodeURIComponent(item.id),1,.75)
        .then(img=>{if(active)setCoverImages(old=>({...old,[item.id]:img}));})
        .catch(()=>{});
    });
    return()=>{active=false;};
  },[group?.id,token,group?.catalogs?.map(x=>x.id).join('|')]);

  useEffect(()=>{
    if(!selected||!pdfUrl)return;
    let active=true;
    setPageLoading(true);setPageError('');setPageImage('');
    getPdfPageCount(pdfUrl).then(n=>{if(active){setPageCount(n);setPage(p=>Math.min(p,n));}}).catch(()=>{if(active)setPageCount(1);});
    renderPdfPage(pdfUrl,page,1.25)
      .then(img=>{if(active)setPageImage(img);})
      .catch(e=>{if(active)setPageError(e?.message||'Sayfa açılamadı. Tekrar deneyin.');})
      .finally(()=>{if(active)setPageLoading(false);});
    return()=>{active=false;};
  },[selected?.id,pdfUrl,page]);

  const openCatalog=(item:PdfItem)=>{setSelected(item);setPage(1);setPageImage('');setPageError('');window.scrollTo({top:0,behavior:'instant' as ScrollBehavior});};
  const closeBook=()=>{setSelected(null);setPage(1);setPageImage('');setPageError('');};
  const movePage=(delta:number)=>{if(!selected)return;setTurning(true);setTimeout(()=>{setPage(p=>Math.max(1,p+delta));setTurning(false);},110);};
  const switchCatalog=(delta:number)=>{if(!group||!selected)return;const i=group.catalogs.findIndex(x=>x.id===selected.id);const next=group.catalogs[i+delta];if(next)openCatalog(next);};
  const requestPdf=async(item:PdfItem)=>{
    const message=`Merhaba İrem Comfort,\n\n“${item.title}” adlı özel kataloğun PDF halini talep ediyorum.\n\nKatalog grubu: ${group?.name||''}\nKatalog adı: ${item.title}\nÖzel katalog bağlantısı: ${location.href}\n\nPDF gönderimi konusunda yardımcı olabilir misiniz?\n\nTeşekkür ederim.`;
    const cover=coverImages[item.id];
    if(cover&&navigator.share){
      try{
        const file=dataUrlToFile(cover,`${item.title.replace(/[^a-z0-9-_]/gi,'_')}-kapak.jpg`);
        if(!navigator.canShare||navigator.canShare({files:[file]})){await navigator.share({title:item.title,text:message,files:[file]});return;}
      }catch(e:any){if(e?.name==='AbortError')return;}
    }
    window.open('https://wa.me/?text='+encodeURIComponent(message),'_blank','noopener,noreferrer');
  };

  const onTouchStart=(e:React.TouchEvent)=>{const t=e.touches[0];touchStart.current={x:t.clientX,y:t.clientY};};
  const onTouchEnd=(e:React.TouchEvent)=>{const s=touchStart.current;touchStart.current=null;if(!s)return;const t=e.changedTouches[0],dx=t.clientX-s.x,dy=t.clientY-s.y;if(Math.abs(dx)<50||Math.abs(dx)<Math.abs(dy)*1.2)return;if(dx<0)movePage(1);else movePage(-1);};

  return <div className="private-catalog-page"><style>{styles}</style>
    <header className="private-catalog-header"><a className="private-catalog-brand" href="/">İREM COMFORT</a><span style={{display:'inline-flex',alignItems:'center',gap:7,fontSize:12,color:'#e3c98d'}}><LockKeyhole size={15}/> Müşteriye özel kataloglar</span></header>
    <main className="private-catalog-container">
      {loading?<div style={{padding:60,textAlign:'center'}}>Özel kataloglar hazırlanıyor…</div>:error?<section className="private-catalog-error"><h1 style={{fontSize:23,fontWeight:800}}>Kataloğa erişilemiyor</h1><p style={{marginTop:8}}>{error}</p><a href="/" className="private-catalog-btn" style={{marginTop:14}}>Ana sayfaya dön</a></section>:group&&<>
        {!selected?<><div style={{marginBottom:24}}><div className="private-catalog-eyebrow">İREM COMFORT · ÖZEL PAYLAŞIM</div><h1 className="private-catalog-title">{group.name}</h1>{group.description&&<p className="private-catalog-muted" style={{maxWidth:760,margin:'0 0 14px'}}>{group.description}</p>}<div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:12,flexWrap:'wrap'}}><p className="private-catalog-muted" style={{margin:0}}>{group.catalogs.length} özel katalog · Kataloğu incelemek için kapağına dokunun.</p></div></div>
          {!group.catalogs.length?<div style={{padding:30,background:'#fff',borderRadius:14}}>Bu grupta henüz katalog bulunmuyor.</div>:<div className="private-catalog-grid">{group.catalogs.map(item=><button className="private-catalog-card" key={item.id} onClick={()=>openCatalog(item)} aria-label={item.title+' kataloğunu aç'}><div className="private-catalog-cover">{coverImages[item.id]?<img src={coverImages[item.id]} alt={item.title+' katalog kapağı'} loading="lazy"/>:<div className="private-catalog-cover-placeholder"><BookOpen size={30}/><div style={{marginTop:12}}>{item.title}</div><div style={{font:'11px Arial',marginTop:10,opacity:.8}}>İLK SAYFA YÜKLENİYOR</div></div>}</div><div className="private-catalog-card-body"><h2>{item.title}</h2><div className="private-catalog-muted" style={{fontSize:12,marginBottom:12}}>{(item.size/1024/1024).toFixed(1)} MB · Özel katalog</div><span className="private-catalog-btn primary" style={{width:'100%'}}><BookOpen size={15}/> Kataloğu aç</span></div></button>)}</div>}
        </>:<><div className="private-book-toolbar"><button className="private-catalog-btn" onClick={closeBook}><ArrowLeft size={16}/> Kataloglara dön</button><div style={{minWidth:0,flex:1,textAlign:'center'}}><strong style={{display:'block',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{selected.title}</strong><span style={{fontSize:11,color:'#708092'}}>Özel katalog görüntüleyici</span></div><button className="private-catalog-btn whatsapp" onClick={()=>void requestPdf(selected)}><MessageCircle size={15}/> PDF talep et</button></div>
          <section className="private-book-shell" style={{marginTop:12}}><div className="private-book-stage" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}><div className={'private-book-page '+(turning?'private-book-page-turn':'')}>{pageImage?<img src={pageImage} alt={selected.title+' - sayfa '+page} draggable={false} onContextMenu={e=>e.preventDefault()}/>:<div style={{textAlign:'center',padding:24,color:'#708092'}}>{pageLoading?'Sayfa hazırlanıyor…':pageError||'Sayfa görüntülenemedi.'}{pageError&&<div><button className="private-catalog-btn" style={{marginTop:12}} onClick={()=>setPage(p=>p)}>Tekrar dene</button></div>}</div>}</div></div>
            <div className="private-book-controls"><button className="private-catalog-btn" disabled={page<=1} onClick={()=>movePage(-1)}><ChevronLeft size={18}/> Önceki</button><span className="private-book-count">Sayfa {page} / {pageCount}</span><button className="private-catalog-btn" disabled={page>=pageCount} onClick={()=>movePage(1)}><span>Sonraki</span><ChevronRight size={18}/></button></div>
            <div className="private-catalog-switcher">{group.catalogs.map((item,i)=><button key={item.id} className={item.id===selected.id?'active':''} onClick={()=>openCatalog(item)}><span style={{display:'block',fontWeight:750}}>{i+1}. {item.title}</span><span style={{display:'block',marginTop:4,color:'#708092'}}>{item.id===selected.id?'Şu an görüntüleniyor':'Diğer kataloğa geç'}</span></button>)}</div>
          </section>
          <div style={{display:'flex',justifyContent:'space-between',gap:10,flexWrap:'wrap',marginTop:12}}><button className="private-catalog-btn" onClick={()=>switchCatalog(-1)} disabled={group.catalogs.findIndex(x=>x.id===selected.id)<=0}><ArrowLeft size={15}/> Önceki katalog</button><button className="private-catalog-btn" onClick={()=>switchCatalog(1)} disabled={group.catalogs.findIndex(x=>x.id===selected.id)>=group.catalogs.length-1}>Diğer kataloğa geç <ArrowRight size={15}/></button></div>
        </>}
      </>}
    </main>
    <footer style={{borderTop:'1px solid #dce4ea',padding:'18px 14px',textAlign:'center',fontSize:12,color:'#708092'}}>İrem Comfort · Her adımda daha iyi bir sen</footer>
  </div>;
}

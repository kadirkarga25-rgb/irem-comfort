'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, ZoomIn, ZoomOut, ArrowLeft, Layers3, Heart, Share2, Download } from 'lucide-react';
import { getCatalog, Catalog, Collection } from '../lib/db';
import { renderPdfPage } from '../lib/pdf';

export default function CatalogViewer({ id }: { id: string }) {
  const [catalog, setCatalog] = useState<Catalog>();
  const [page, setPage] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [full, setFull] = useState(false);
  const [turn, setTurn] = useState(false);
  const [collectionOpen, setCollectionOpen] = useState(false);
  const [favoritePages, setFavoritePages] = useState<number[]>([]);
  const [renderedPage, setRenderedPage] = useState<string>();
  const [renderedThumbs, setRenderedThumbs] = useState<Record<number,string>>({});
  const search = useSearchParams();
  const shellRef = useRef<HTMLDivElement>(null);
  const pointerStartRef = useRef<{ x: number; y: number; id: number } | null>(null);
  const pointerMovedRef = useRef(false);

  useEffect(() => {
    if (!id) return;
    getCatalog(id).then((x) => {
      setCatalog(x);
      try {
        setFavoritePages(JSON.parse(localStorage.getItem(`fav-pages-${id}`) || '[]'));
      } catch {
        setFavoritePages([]);
      }
      const requested = Number(search.get('page'));
      if (requested > 0) setPage(Math.min(requested - 1, Math.max(0, (x?.pages || 1) - 1)));
    });
  }, [id, search]);

  const next = () => {
    if (!catalog || page >= catalog.pages - 1) return;
    setTurn(true);
    window.setTimeout(() => {
      setPage((p) => Math.min(p + 1, catalog.pages - 1));
      setTurn(false);
    }, 180);
  };
  const prev = () => {
    if (!catalog || page <= 0) return;
    setTurn(true);
    window.setTimeout(() => {
      setPage((p) => Math.max(p - 1, 0));
      setTurn(false);
    }, 180);
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'Escape' && document.fullscreenElement) document.exitFullscreen().catch(() => undefined);
    };
    const handleFullscreen = () => setFull(Boolean(document.fullscreenElement));
    window.addEventListener('keydown', handleKey);
    document.addEventListener('fullscreenchange', handleFullscreen);
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.removeEventListener('fullscreenchange', handleFullscreen);
    };
  });

  const goTo = (target: number) => {
    if (!catalog) return;
    setPage(Math.max(0, Math.min(catalog.pages - 1, target - 1)));
  };

  const togglePageFavorite = () => {
    const n = favoritePages.includes(page + 1)
      ? favoritePages.filter((x) => x !== page + 1)
      : [...favoritePages, page + 1].sort((a, b) => a - b);
    setFavoritePages(n);
    localStorage.setItem(`fav-pages-${id}`, JSON.stringify(n));
  };

  const sharePage = async () => {
    const url = `${location.origin}/katalog/viewer/${id}?page=${page + 1}`;
    if (navigator.share) {
      await navigator.share({ title: `${catalog?.title || 'İrem Comfort'} · Sayfa ${page + 1}`, url });
    } else {
      await navigator.clipboard.writeText(url);
      alert('Bu sayfanın bağlantısı kopyalandı.');
    }
  };

  const downloadPdf = () => {
    if (!catalog?.pdf) return alert('Bu katalog için PDF indirme verisi bulunmuyor.');
    const url = URL.createObjectURL(catalog.pdf);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${catalog.title}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await shellRef.current?.requestFullscreen();
    } catch {
      setFull((v) => !v);
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    pointerStartRef.current = { x: e.clientX, y: e.clientY, id: e.pointerId };
    pointerMovedRef.current = false;
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch {}
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const start = pointerStartRef.current;
    if (!start || start.id !== e.pointerId) return;
    if (Math.abs(e.clientX - start.x) > 8 || Math.abs(e.clientY - start.y) > 8) pointerMovedRef.current = true;
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const start = pointerStartRef.current;
    pointerStartRef.current = null;
    if (!start || start.id !== e.pointerId) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    if (Math.abs(dx) < 70 || Math.abs(dx) < Math.abs(dy) * 1.15) return;
    if (dx < 0) next();
    else prev();
    pointerMovedRef.current = true;
  };

  useEffect(() => {
    let cancelled = false;
    if (!catalog?.pdf || catalog.pageImages?.length) return;
    renderPdfPage(catalog.pdf, page + 1, 1).then((src) => { if (!cancelled) setRenderedPage(src); }).catch((e) => console.error('PDF sayfası oluşturulamadı', e));
    return () => { cancelled = true; };
  }, [catalog, page]);

  useEffect(() => {
    let cancelled = false;
    if (!catalog?.pdf || catalog.pageImages?.length) return;
    const run = async () => {
      const next: Record<number,string> = {};
      for (let i = 1; i <= catalog.pages; i++) {
        if (cancelled) return;
        try { next[i] = await renderPdfPage(catalog.pdf!, i, 0.18); } catch { break; }
        setRenderedThumbs({ ...next });
      }
    };
    run();
    return () => { cancelled = true; };
  }, [catalog]);

  const currentCollection = useMemo(
    () => catalog?.collections.find((c) => page + 1 >= c.startPage && page + 1 <= c.endPage),
    [catalog, page],
  );

  if (!catalog) {
    return <div className="viewer-loading"><div className="loader-box"><div className="ic-loader"><div className="ic-ring"/><img src="/katalog/assets/logo-light.png" alt="İrem Comfort"/></div><p>KATALOG HAZIRLANIYOR</p></div></div>;
  }

  const image = catalog.pageImages?.[page] || renderedPage || catalog.cover;
  const collections = catalog.collections || [];
  const isPageFavorite = favoritePages.includes(page + 1);

  return <div ref={shellRef} className={`viewer-shell ${full ? 'is-fullscreen' : ''}`}>
    <div className="viewer-top">
      <Link href={`/katalog/${id}`}><img src="/katalog/assets/logo-light.png" alt="İrem Comfort"/></Link>
      <div className="viewer-title"><strong>{catalog.title}</strong><span>{catalog.year} · {catalog.season}</span></div>
      <div className="control-group">
        <button className="icon-btn viewer-btn" onClick={togglePageFavorite} title={isPageFavorite ? 'Favorilerden çıkar' : 'Bu sayfayı favorile'} aria-label={isPageFavorite ? 'Favorilerden çıkar' : 'Bu sayfayı favorile'}><Heart size={18} fill={isPageFavorite ? 'currentColor' : 'none'}/></button>
        <button className="icon-btn viewer-btn" onClick={sharePage} title="Sayfayı paylaş" aria-label="Sayfayı paylaş"><Share2 size={18}/></button>
        {catalog.pdf && <button className="icon-btn viewer-btn" onClick={downloadPdf} title="PDF indir" aria-label="PDF indir"><Download size={18}/></button>}
        <button className="icon-btn viewer-btn" onClick={() => setZoom((z) => Math.max(.7, z - .1))} title="Uzaklaştır" aria-label="Uzaklaştır"><ZoomOut size={18}/></button>
        <button className="icon-btn viewer-btn" onClick={() => setZoom((z) => Math.min(1.8, z + .1))} title="Yakınlaştır" aria-label="Yakınlaştır"><ZoomIn size={18}/></button>
        <button className="icon-btn viewer-btn mobile-collection-toggle" onClick={() => setCollectionOpen((v) => !v)} title="Koleksiyonlar" aria-label="Koleksiyonlar"><Layers3 size={18}/></button>
        <button className="icon-btn viewer-btn" onClick={toggleFullscreen} title="Tam ekran" aria-label="Tam ekran">{full ? <Minimize2 size={18}/> : <Maximize2 size={18}/>}</button>
      </div>
    </div>

    <div className="viewer-layout">
      <main className="viewer-stage" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerCancel={() => { pointerStartRef.current = null; }} onDragStart={(e) => e.preventDefault()}>
        <div className="book-wrap">
          <div className={`book ${turn ? 'page-turning' : ''}`} style={{ transform: `scale(${zoom})`, transition: '.2s' }}>
            <div className="page"><img src={image || '/katalog/assets/logo-light.png'} alt={`Sayfa ${page + 1}`} draggable={false}/><span className="page-number">{page + 1}</span></div>
          </div>
        </div>
        <div className="viewer-bottom">
          <div className="viewer-controls">
            <div className="control-group"><button className="icon-btn" onClick={prev} disabled={page === 0} title="Önceki sayfa"><ChevronLeft size={20}/></button><button className="icon-btn" onClick={next} disabled={page >= catalog.pages - 1} title="Sonraki sayfa"><ChevronRight size={20}/></button></div>
            <div className="page-status"><strong>{page + 1}</strong> / {catalog.pages}{currentCollection && <span> · {currentCollection.name}</span>}</div>
            <div className="control-group"><Link href={`/katalog/${id}`} className="icon-btn" title="Katalog detayına dön"><ArrowLeft size={18}/></Link></div>
          </div>
          <div className="thumbs">{Array.from({ length: catalog.pages }, (_, i) => { const src = catalog.pageImages?.[i] || renderedThumbs[i + 1]; return <button className={`thumb ${i === page ? 'active' : ''}`} key={i} onClick={() => setPage(i)} title={`Sayfa ${i + 1}`}>{src ? <img src={src} alt={`Sayfa ${i + 1}`} draggable={false}/> : <span className="thumb-number">{i + 1}</span>}</button>; })}</div>
        </div>
      </main>

      <aside className={`viewer-collections ${collectionOpen ? 'open' : ''}`}>
        <div className="collection-panel-head"><Layers3 size={17}/><div><strong>Koleksiyonlar</strong><span>{collections.length} bölüm</span></div></div>
        <div className="collection-panel-list">{collections.map((collection: Collection, index: number) => <button key={collection.id} className={`viewer-collection ${currentCollection?.id === collection.id ? 'active' : ''}`} onClick={() => { goTo(collection.startPage); setCollectionOpen(false); }}><span className="viewer-collection-number">{String(index + 1).padStart(2, '0')}</span><span className="viewer-collection-copy"><strong>{collection.name}</strong><small>Sayfa {collection.startPage} – {collection.endPage}</small></span><ChevronRight size={15}/></button>)}</div>
        {!collections.length && <div className="collection-panel-empty">Bu katalog için henüz koleksiyon tanımlanmamış.</div>}
      </aside>
    </div>
  </div>;
}

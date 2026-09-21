'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { Header } from '../../components/Header';
import { CatalogCard } from '../../components/CatalogCard';
import { Catalog, listCatalogs } from '../../lib/db';
import { searchCatalogs } from '../../lib/search';

function seasonLabel(year: number, latest: number) { if (year === latest) return 'Güncel Sezon'; if (year === latest - 1) return 'Geçen Sezon'; return 'Daha Önceki Sezon'; }

export default function KatalogHome() {
  const [catalogs, setCatalogs] = useState<Catalog[]>([]); const [query, setQuery] = useState('');
  useEffect(() => { listCatalogs().then(x => setCatalogs(x.filter(c => c.published))); }, []);
  const latest = Math.max(...catalogs.map(c => Number(c.year) || 0), 0);
  const groups = useMemo(() => { const map = new Map<string, Catalog[]>(); catalogs.forEach(c => map.set(c.year || 'Diğer', [...(map.get(c.year || 'Diğer') || []), c])); return [...map.entries()].sort((a,b)=>Number(b[0])-Number(a[0])).map(([year,items])=>({year,items,label:seasonLabel(Number(year),latest)})); }, [catalogs, latest]);
  const hits = useMemo(() => searchCatalogs(catalogs, query), [catalogs, query]);
  return <><Header basePath="/katalog"/><main>
    <section className="hero"><div className="container hero-grid"><div><div className="eyebrow">İREM COMFORT · DİJİTAL ARŞİV</div><h1 className="serif">Katalog<br/>Arşivi</h1><p>İrem Comfort kataloglarını yıllara, sezonlara ve koleksiyonlara göre sayfa sayfa keşfedin.</p><div className="hero-actions"><Link className="btn btn-primary" href="#arsiv">Arşivi Keşfet →</Link><Link className="btn btn-secondary" href="/katalog/koleksiyonlar">Koleksiyonlar</Link></div></div><div className="hero-art"><img src="/katalog/assets/logo-dark.png" alt="İrem Comfort"/></div></div></section>
    <section className="section" id="arsiv"><div className="container"><div className="section-head"><div><div className="eyebrow">ARŞİV</div><h2 className="serif">Yıllara Göre Kataloglar</h2><p>Yeni bir yıl eklendiğinde arşiv sıralaması otomatik güncellenir.</p></div></div>
      <div className="catalog-search"><Search size={18}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Katalog, koleksiyon veya ürün metni ara…"/></div>
      {query ? <div className="search-results">{hits.length ? hits.map((hit,i)=><Link key={`${hit.catalog.id}-${hit.page}-${i}`} href={`/katalog/viewer/${hit.catalog.id}?page=${hit.page}`} className="search-result"><div><strong>{hit.catalog.title}</strong><span>{hit.title}</span></div><small>{hit.catalog.year} · Sayfa {hit.page}</small></Link>) : <div className="empty">Aramanızla eşleşen bir sonuç bulunamadı.</div>}</div> : groups.length ? groups.map(group=><section className="year-section" key={group.year}><div className="year-heading"><div><span className="year-kicker">{group.label}</span><h2 className="serif">{group.year}</h2></div><span className="year-count">{group.items.length} katalog</span></div><div className="catalog-grid">{group.items.map(c=><CatalogCard c={c} basePath="/katalog" key={c.id}/>)}</div></section>) : <div className="empty">Henüz katalog eklenmemiş.</div>}
    </div></section>
  </main></>;
}

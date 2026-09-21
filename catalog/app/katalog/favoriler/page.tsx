'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';
import {Header} from '../../../components/Header';
import {Catalog,listCatalogs} from '../../../lib/db';
import {Heart, BookOpen, FileHeart} from 'lucide-react';

type Favorite={catalog:Catalog;pages:number[];catalogFavorite:boolean};

export default function Favorites(){
 const [items,setItems]=useState<Favorite[]>([]);
 useEffect(()=>{
  listCatalogs().then(catalogs=>{
   const out:Favorite[]=catalogs.map(c=>{
    let pages:number[]=[]; let catalogFavorite=false;
    try{pages=JSON.parse(localStorage.getItem(`fav-pages-${c.id}`)||'[]')}catch{}
    catalogFavorite=localStorage.getItem(`fav-catalog-${c.id}`)==='1';
    return {catalog:c,pages,catalogFavorite};
   }).filter(x=>x.pages.length||x.catalogFavorite);
   setItems(out);
  });
 },[]);
 const catalogItems=items.filter(x=>x.catalogFavorite);
 const pageItems=items.filter(x=>x.pages.length);
 return <><Header basePath="/katalog"/><main className="section"><div className="container">
  <div className="eyebrow">KİŞİSEL ARŞİV</div><h1 className="serif" style={{fontSize:52}}>Favorilerim</h1><p className="intro-copy">Kataloglarını ve beğendiğin katalog sayfalarını aynı yerde yönet.</p>
  <section className="favorites-section"><div className="favorites-heading"><div><div className="eyebrow">01</div><h2 className="serif"><FileHeart size={24}/> Katalog Favorileri</h2></div><span>{catalogItems.length} katalog</span></div>
   {catalogItems.length?<div className="catalog-grid">{catalogItems.map(({catalog})=><article className="catalog-card" key={catalog.id}><Link href={`/katalog/${catalog.id}`}><div className="cover">{catalog.cover?<img src={catalog.cover} alt=""/>:<div className="cover-placeholder"><small>İREM COMFORT</small><strong>{catalog.title}</strong></div>}</div></Link><div className="catalog-card-body"><span className="eyebrow">{catalog.year} · {catalog.season}</span><h3>{catalog.title}</h3><Link className="text-link" href={`/katalog/${catalog.id}`}>Kataloğu aç →</Link></div></article>)}</div>:<div className="empty">Henüz katalog favorin yok. Katalog detayındaki kalp butonundan ekleyebilirsin.</div>}
  </section>
  <section className="favorites-section"><div className="favorites-heading"><div><div className="eyebrow">02</div><h2 className="serif"><BookOpen size={24}/> Sayfa Favorileri</h2></div><span>{pageItems.reduce((n,x)=>n+x.pages.length,0)} sayfa</span></div>
   {pageItems.length?pageItems.map(({catalog,pages})=><section className="favorite-group" key={catalog.id}><div className="collection-catalog-head"><div><span className="eyebrow">{catalog.year} · {catalog.season}</span><h3 className="serif">{catalog.title}</h3></div><span className="year-count">{pages.length} favori sayfa</span></div><div className="favorite-pages">{pages.map(page=><Link key={page} href={`/katalog/viewer/${catalog.id}?page=${page}`} className="favorite-page"><img src={catalog.pageImages?.[page-1]||catalog.cover||'/katalog/assets/logo-light.png'} alt={`Sayfa ${page}`}/><span>Sayfa {page}</span></Link>)}</div></section>):<div className="empty">Henüz favori sayfan yok. Katalog okuyucudaki kalp butonuyla sayfaları kaydedebilirsin.</div>}
  </section>
 </div></main></>
}

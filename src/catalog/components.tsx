import React from 'react';
import {Catalog,Collection} from './db';
import {CatalogLink} from './router';
import {Header} from '../components/layout/Header';
import {Footer} from '../components/layout/Footer';

export function CatalogHeader(){return <Header activeSection="/katalog" onNavigate={(path)=>{window.history.pushState({},'',path);window.dispatchEvent(new PopStateEvent('popstate'));}}/>}
export function CatalogFooter(){return <Footer onNavigate={(path)=>{window.history.pushState({},'',path);window.dispatchEvent(new PopStateEvent('popstate'));}}/>}
export function CatalogCard({c}:{c:Catalog}){return <CatalogLink href={`/katalog/${c.id}`} style={{textDecoration:'none',color:'inherit'}}><article className="catalog-card"><div className="cover">{c.cover?<img src={c.cover} alt=""/>:<div className="cover-placeholder"><div><small>İREM COMFORT</small><h3 className="serif">{c.title}</h3><span>{c.year} · {c.season}</span></div></div>}</div><div className="card-body"><div className="eyebrow">{c.year} · {c.season}</div><h3>{c.title}</h3><div className="meta">{c.pages} sayfa · {c.collections.length} koleksiyon</div><div>{(c.tags||[]).slice(0,3).map(t=><span className="tag" key={t}>{t}</span>)}</div></div></article></CatalogLink>}
export function CollectionCard({catalog,col,index}:{catalog:Catalog;col:Collection;index:number}){return <CatalogLink href={`/katalog/viewer/${catalog.id}?page=${col.startPage}`} className="collection-card collection-link"><span className="collection-number">{String(index+1).padStart(2,'0')}</span><h3>{col.name}</h3><p>Sayfa {col.startPage} – {col.endPage}</p><span className="collection-go">Koleksiyona git →</span></CatalogLink>}

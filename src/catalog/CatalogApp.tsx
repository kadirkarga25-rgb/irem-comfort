import React from 'react';
import './catalog.css';
import {useCatalogLocation} from './router';
import {CatalogHome,CatalogDetail,CatalogCollections,CatalogFavorites,CatalogViewer} from './CatalogPublic';

export function CatalogApp(){
  const {pathname}=useCatalogLocation();
  if(pathname==='/katalog'||pathname==='/katalog/') return <CatalogHome/>;
  if(pathname==='/katalog/koleksiyonlar') return <CatalogCollections/>;
  if(pathname==='/katalog/favoriler') return <CatalogFavorites/>;
  const viewer=pathname.match(/^\/katalog\/viewer\/([^/]+)$/); if(viewer) return <CatalogViewer id={decodeURIComponent(viewer[1])}/>;
  const detail=pathname.match(/^\/katalog\/([^/]+)$/); if(detail) return <CatalogDetail id={decodeURIComponent(detail[1])}/>;
  return <CatalogHome/>;
}

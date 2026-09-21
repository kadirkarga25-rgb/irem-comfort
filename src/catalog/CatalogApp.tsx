import React from 'react';
import './catalog.css';
import {useCatalogLocation} from './router';
import {CatalogHome,CatalogDetail,CatalogCollections,CatalogFavorites,CatalogViewer} from './CatalogPublic';
import {CatalogAdminEntry,CatalogAdminHome,CatalogAdminNew,CatalogAdminEdit} from './CatalogAdmin';

export function CatalogApp(){const {pathname}=useCatalogLocation();
  if(pathname==='/katalog'||pathname==='/katalog/') return <CatalogHome/>;
  if(pathname==='/katalog/koleksiyonlar') return <CatalogCollections/>;
  if(pathname==='/katalog/favoriler') return <CatalogFavorites/>;
  if(pathname==='/katalog/admin'||pathname==='/katalog/admin/') return <CatalogAdminEntry/>;
  if(pathname==='/katalog/admin/new') return <CatalogAdminNew/>;
  if(pathname.startsWith('/katalog/admin/')) return <CatalogAdminEdit id={decodeURIComponent(pathname.split('/').pop()||'')}/>;
  const viewer=pathname.match(/^\/katalog\/viewer\/([^/]+)$/); if(viewer) return <CatalogViewer id={decodeURIComponent(viewer[1])}/>;
  const detail=pathname.match(/^\/katalog\/([^/]+)$/); if(detail) return <CatalogDetail id={decodeURIComponent(detail[1])}/>;
  return <CatalogHome/>;
}

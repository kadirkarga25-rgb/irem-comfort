import React from 'react';
import { BookOpen, ShieldCheck, ExternalLink } from 'lucide-react';
import { CatalogAdminPanel } from '../../catalog/CatalogAdmin';
import { PdfLibraryAdminTab } from './PdfLibraryAdminTab';
import '../../catalog/catalog.css';

interface Props { sessionToken: string | null; }

export const CatalogAdminTab: React.FC<Props> = ({ sessionToken }) => {
  return <div className="ic-catalog catalog-admin-tab">
    <div className="catalog-admin-tab-head">
      <div className="catalog-admin-tab-brand">
        <div className="catalog-admin-tab-icon"><BookOpen className="w-5 h-5" /></div>
        <div><div className="eyebrow">İREM COMFORT · YÖNETİM</div><h2>Katalog Arşivi</h2><p>Katalogların tamamını bu ana yönetici panelinden yönet.</p></div>
      </div>
      <a className="catalog-admin-public-link" href="/katalog" target="_blank" rel="noreferrer"><ExternalLink size={16}/> Katalog sayfasını aç</a>
    </div>
    <div className="catalog-admin-persistence"><ShieldCheck size={18}/><div><strong>Merkezi kalıcı kayıt</strong><span>Katalog bilgileri <code>catalog_settings.json</code>, PDF'ler ise ayrı <code>PDF Kütüphanesi</code> alanında GitHub üzerinde tutulur. Ana <code>site_settings.json</code> dosyasına dokunulmaz.</span></div></div>
    <div className="grid lg:grid-cols-2 gap-5">
      <div className="min-w-0"><CatalogAdminPanel sessionToken={sessionToken} /></div>
      <div className="min-w-0"><PdfLibraryAdminTab /></div>
    </div>
  </div>;
};

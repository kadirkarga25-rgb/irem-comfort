import React, { useEffect, useState } from 'react';
import { ImageProvider, useAppImages } from './context/ImageContext';
import { ConversationProvider } from './context/ConversationContext';
import { IcLoader } from './components/ui/IcLoader';
import { AdminPage } from './components/admin/AdminPage';
import { CatalogApp } from './catalog/CatalogApp';
import { SurveyPage } from './components/secret/SurveyPage';
import { PasswordResetPage } from './components/secret/PasswordResetPage';
import { RemoteManagementPage } from './components/secret/RemoteManagementPage';
import { NotFoundPage } from './components/ui/NotFoundPage';
import { LegalModal, LegalDocType } from './components/ui/LegalModal';
import { MaintenancePage } from './components/ui/MaintenancePage';
import { ProductsPage } from './components/pages/ProductsPage';
import { SitePageShell } from './pages/SitePageShell';
import { HomePage } from './pages/HomePage';
import { CollectionLandingPage } from './pages/CollectionLandingPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { WholesalePage } from './pages/WholesalePage';
import { BrandPage } from './pages/BrandPage';
import { WorkshopPage } from './pages/WorkshopPage';
import { ContactPage } from './pages/ContactPage';

function MainAppContent() {
  const { isSettingsLoaded, systemConfig } = useAppImages();
  const getPath = () => (typeof window === 'undefined' ? '/' : window.location.pathname.replace(/\/+$/, '') || '/');
  const [path, setPath] = useState(getPath);
  const [legalDoc, setLegalDoc] = useState<LegalDocType | null>(null);

  useEffect(() => {
    const onPop = () => setPath(getPath());
    window.addEventListener('popstate', onPop);
    window.addEventListener('hashchange', onPop);
    return () => { window.removeEventListener('popstate', onPop); window.removeEventListener('hashchange', onPop); };
  }, []);

  const navigate = (next: string) => {
    const clean = next || '/';
    if (window.location.pathname !== clean) window.history.pushState({}, '', clean);
    setPath(clean);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isSettingsLoaded) return <IcLoader fullscreen label="İrem Comfort yükleniyor" />;

  const isAdmin = path === '/admin' || window.location.hash === '#admin' || new URLSearchParams(window.location.search).has('admin');
  const isCatalog = path === '/katalog' || path.startsWith('/katalog/');
  if (isCatalog) return <CatalogApp />;
  if (isAdmin) return <AdminPage onReturnToSite={() => navigate('/')} />;
  if (systemConfig.isDeploying) return <MaintenancePage />;
  if (path.includes('sifre-sifirla')) return <PasswordResetPage onReturnToSite={() => navigate('/')} />;
  if (path.includes('uzak-yonetim')) return <RemoteManagementPage onReturnToSite={() => navigate('/')} />;
  if (path === '/toptananket' || path === '/toptananket.html') return <SurveyPage onReturnToSite={() => navigate('/')} />;
  if (path === '/anket' || path.startsWith('/anket/')) return <SurveyPage onReturnToSite={() => navigate('/')} />;

  const shared = { onAdminClick: () => navigate('/admin'), openLegal: (d:LegalDocType) => setLegalDoc(d) };
  let content: React.ReactNode;
  if (path === '/') content = <HomePage {...shared}/>;
  else if (path === '/koleksiyonlar') content = <CollectionLandingPage {...shared}/>;
  else if (path === '/urunler') content = <SitePageShell title="Kadın comfort ürün koleksiyonu" eyebrow="ÜRÜNLER" intro="Mağazanız için model, renk ve konfor seçeneklerini inceleyin." activePath="/urunler" {...shared}><ProductsPage onBackToHome={()=>navigate('/')} onInquireProduct={()=>navigate('/toptan-satis')}/></SitePageShell>;
  else if (path.startsWith('/urunler/')) content = <ProductDetailPage productId={decodeURIComponent(path.split('/').slice(2).join('/'))} {...shared}/>;
  else if (path === '/markamiz') content = <BrandPage {...shared}/>;
  else if (path === '/toptan-satis') content = <WholesalePage {...shared}/>;
  else if (path === '/atolye') content = <WorkshopPage {...shared}/>;
  else if (path === '/iletisim') content = <ContactPage {...shared}/>;
  else content = <NotFoundPage onReturnToSite={()=>navigate('/')}/>;

  return <>
    {content}
    <LegalModal isOpen={Boolean(legalDoc)} initialType={legalDoc || 'privacy'} onClose={()=>setLegalDoc(null)} />
  </>;
}

export default function App() {
  return <ImageProvider><ConversationProvider><MainAppContent/></ConversationProvider></ImageProvider>;
}

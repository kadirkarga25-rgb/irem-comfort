import './globals.css';
import { AppProviders } from '../components/AppProviders';
import { Loader } from '../components/Loader';
export const metadata={title:'İrem Comfort | Katalog Arşivi',description:'İrem Comfort dijital katalog arşivi'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="tr"><body><Loader/><AppProviders>{children}</AppProviders></body></html>}

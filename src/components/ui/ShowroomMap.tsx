import React, { useState } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow, useAdvancedMarkerRef } from '@vis.gl/react-google-maps';
import { MapPin, Navigation, Clock, Phone } from 'lucide-react';
import { useAppImages } from '../../context/ImageContext';

interface ShowroomMapProps {
  lat?: number;
  lng?: number;
  address: string;
  showroomHours?: string;
  phoneDisplay?: string;
  googleMapsUrl?: string;
}

const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  '';
const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

function InteractiveMap({ lat, lng, address, googleMapsUrl }: { lat: number; lng: number; address: string; googleMapsUrl: string }) {
  const { language } = useAppImages();
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [infoOpen, setInfoOpen] = useState(true);

  return (
    <Map
      defaultCenter={{ lat, lng }}
      defaultZoom={15}
      mapId="DEMO_MAP_ID"
      internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
      style={{ width: '100%', height: '100%' }}
      gestureHandling="cooperative"
    >
      <AdvancedMarker ref={markerRef} position={{ lat, lng }} onClick={() => setInfoOpen(prev => !prev)}>
        <Pin background="#0A2D6F" glyphColor="#FFFFFF" borderColor="#0A2D6F" />
      </AdvancedMarker>

      {infoOpen && (
        <InfoWindow anchor={marker} onCloseClick={() => setInfoOpen(false)}>
          <div className="p-2 max-w-xs space-y-2 text-[#111111]">
            <div className="flex items-center gap-1.5 text-[#0A2D6F] font-bold text-xs">
              <MapPin className="w-4 h-4 text-[#0A2D6F]" />
              <span>
                {language === 'tr'
                  ? 'İrem Comfort Showroom & Atölye'
                  : language === 'en'
                  ? 'İrem Comfort Showroom & Workshop'
                  : 'معرض وورشة إيرم كومفورت'}
              </span>
            </div>
            <p className="text-[11px] text-gray-700 leading-tight">{address}</p>
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0A2D6F] text-white text-[11px] font-bold rounded-lg hover:bg-[#163E87] transition-colors mt-1"
            >
              <Navigation className="w-3.5 h-3.5 text-amber-300" />
              <span>
                {language === 'tr'
                  ? "Google Haritalar'da Yol Tarifi Al"
                  : language === 'en'
                  ? 'Get Directions on Google Maps'
                  : 'الاتجاهات عبر خرائط جوجل'}
              </span>
            </a>
          </div>
        </InfoWindow>
      )}
    </Map>
  );
}

export const ShowroomMap: React.FC<ShowroomMapProps> = ({
  lat = 38.625,
  lng = 27.408,
  address = 'Manisa Ayakkabıcılar Sitesi, Manisa',
  showroomHours,
  phoneDisplay,
  googleMapsUrl
}) => {
  const { language } = useAppImages();
  const safeAddress = address || 'Manisa Ayakkabıcılar Sitesi, Manisa';
  const mapSearchTerm = (safeAddress || '').toLowerCase().includes('irem comfort')
    ? safeAddress
    : `İrem Comfort, ${safeAddress}`;

  const defaultNavUrl =
    googleMapsUrl ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapSearchTerm)}`;

  return (
    <div className="rounded-3xl overflow-hidden border border-[#0A2D6F]/15 bg-white shadow-xl flex flex-col h-full min-h-[380px]">
      {/* Map Header */}
      <div className="p-4 sm:p-5 bg-[#0A2D6F] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 text-amber-300 flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm sm:text-base font-serif-luxury text-white">
              {language === 'tr'
                ? 'Manisa Showroom & İmalat Atölyesi Konumu'
                : language === 'en'
                ? 'Manisa Showroom & Production Workshop Location'
                : 'موقع معرض وورشة إنتاج مانيسا'}
            </h4>
            <p className="text-xs text-white/80 font-light">
              {language === 'tr'
                ? 'Manisa Ayakkabıcılar Sitesi • Birebir Ziyaret & Toptan/Perakende'
                : language === 'en'
                ? 'Manisa Shoemakers Site • Visits, Wholesale & Retail'
                : 'مجمع مصنعي الأحذية بمانيسا • زيارات مباشرة وجملة وتجزئة'}
            </p>
          </div>
        </div>

        <a
          href={defaultNavUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#0A2D6F] text-xs font-bold transition-all flex items-center justify-center gap-1.5 shrink-0 shadow-sm cursor-pointer"
        >
          <Navigation className="w-4 h-4 text-[#0A2D6F]" />
          <span>{language === 'tr' ? 'Yol Tarifi Al' : language === 'en' ? 'Get Directions' : 'الاتجاهات'}</span>
        </a>
      </div>

      {/* Map Container */}
      <div className="relative flex-1 min-h-[320px] w-full bg-slate-100">
        {hasValidKey ? (
          <APIProvider apiKey={API_KEY} version="weekly">
            <InteractiveMap lat={lat} lng={lng} address={address} googleMapsUrl={defaultNavUrl} />
          </APIProvider>
        ) : (
          <div className="w-full h-full relative group min-h-[320px]">
            {/* Embedded Google Maps iFrame */}
            <iframe
              title="İrem Comfort Showroom Google Maps"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '320px' }}
              loading="lazy"
              allowFullScreen
              src={`https://maps.google.com/maps?q=${encodeURIComponent(mapSearchTerm)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
            />

            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 shadow-md flex items-center gap-2 text-[11px] font-medium text-slate-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{language === 'tr' ? 'Canlı Harita Servisi' : language === 'en' ? 'Live Map Service' : 'خدمة الخريطة الحية'}</span>
            </div>
          </div>
        )}
      </div>

      {/* Map Bottom Footer Info */}
      <div className="p-4 bg-slate-50 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#0A2D6F] shrink-0" />
          <span>
            <strong>{language === 'tr' ? 'Çalışma Saatleri:' : language === 'en' ? 'Working Hours:' : 'ساعات العمل:'}</strong>{' '}
            {showroomHours || (language === 'tr' ? 'Pzt - Cmt: 08:30 - 19:00' : language === 'en' ? 'Mon - Sat: 08:30 - 19:00' : 'الإثنين - السبت: 08:30 - 19:00')}
          </span>
        </div>
        {phoneDisplay && (
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-[#0A2D6F] shrink-0" />
            <span>
              <strong>{language === 'tr' ? 'Randevu Hattı:' : language === 'en' ? 'Appointment Line:' : 'خط المواعيد:'}</strong>{' '}
              {phoneDisplay}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

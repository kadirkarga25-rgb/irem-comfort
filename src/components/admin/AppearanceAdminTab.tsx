import React, { useState } from 'react';
import { useAppImages, THEME_PRESETS } from '../../context/ImageContext';
import { 
  Palette, 
  ArrowUp, 
  ArrowDown, 
  Eye, 
  EyeOff, 
  RotateCcw, 
  Check, 
  Sparkles, 
  Layout, 
  Sliders,
  Paintbrush,
  Move
} from 'lucide-react';

export const AppearanceAdminTab: React.FC = () => {
  const { 
    themeConfig, 
    updateThemeConfig, 
    resetThemeConfig, 
    sectionOrder, 
    moveSection, 
    toggleSectionEnabled, 
    resetSectionOrder 
  } = useAppImages();

  const [activeTabSub, setActiveTabSub] = useState<'theme' | 'sections'>('theme');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleApplyPreset = (presetId: string) => {
    const found = THEME_PRESETS.find(p => p.id === presetId);
    if (found) {
      updateThemeConfig({
        preset: found.id,
        primaryColor: found.primaryColor,
        accentColor: found.accentColor,
        backgroundColor: found.backgroundColor,
        textColor: found.textColor,
        headerBg: found.headerBg
      });
      showToast(`"${found.name}" teması uygulandı!`);
    }
  };

  const handleColorChange = (key: keyof typeof themeConfig, value: string) => {
    updateThemeConfig({
      preset: 'custom',
      [key]: value
    });
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0A2D6F] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-fade-in border border-amber-400/30">
          <Check className="w-5 h-5 text-amber-400 shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#062050] via-[#0A2D6F] to-[#124294] text-white p-6 sm:p-8 rounded-2xl shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider border border-amber-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Görsel Tasarım & Düzen Yönetimi</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide">
              Tema Renkleri ve Ana Ekran Sıralaması
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl">
              Web sitenizin marka renklerini özelleştirin, hazır lüks tema şablonlarından seçin ve ana sayfadaki içerik bölümlerinin sırasını kolayca değiştirin.
            </p>
          </div>

          {/* Sub Navigation Switcher */}
          <div className="flex items-center gap-1.5 p-1.5 bg-black/30 backdrop-blur-md rounded-xl border border-white/10 self-start md:self-auto">
            <button
              onClick={() => setActiveTabSub('theme')}
              className={`px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                activeTabSub === 'theme'
                  ? 'bg-amber-400 text-[#062050] shadow-md scale-[1.02]'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Palette className="w-4 h-4" />
              <span>Tema Renkleri</span>
            </button>
            <button
              onClick={() => setActiveTabSub('sections')}
              className={`px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                activeTabSub === 'sections'
                  ? 'bg-amber-400 text-[#062050] shadow-md scale-[1.02]'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Layout className="w-4 h-4" />
              <span>Bölüm Sıralaması</span>
            </button>
          </div>
        </div>
      </div>

      {/* SUB TAB 1: THEME COLORS & PRESETS */}
      {activeTabSub === 'theme' && (
        <div className="space-y-8 animate-fade-in">
          {/* Preset Cards Grid */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200/80 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200 shrink-0">
                  <Paintbrush className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Hazır Lüks Tema Şablonları</h3>
                  <p className="text-xs text-slate-500">Tek tıkla sitenizin tüm görünümünü ve atmosferini değiştirin</p>
                </div>
              </div>

              <button
                onClick={() => {
                  resetThemeConfig();
                  showToast("Tema renkleri varsayılana sıfırlandı.");
                }}
                className="px-3.5 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-2 self-start sm:self-auto cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Varsayılan Temaya Dön</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {THEME_PRESETS.map((preset) => {
                const isActive = themeConfig.preset === preset.id;
                return (
                  <div
                    key={preset.id}
                    onClick={() => handleApplyPreset(preset.id)}
                    className={`group relative p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between overflow-hidden ${
                      isActive 
                        ? 'border-amber-500 ring-2 ring-amber-500/30 bg-amber-50/20 shadow-md' 
                        : 'border-slate-200/90 hover:border-slate-300 hover:shadow-md bg-white'
                    }`}
                  >
                    {/* Badge if active */}
                    {isActive && (
                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-amber-500 text-white text-[10px] font-extrabold uppercase tracking-widest shadow-sm flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        <span>Aktif Şablon</span>
                      </div>
                    )}

                    <div className="space-y-3">
                      {/* Gradient Bar */}
                      <div className={`h-16 rounded-xl bg-gradient-to-r ${preset.previewGradient} p-3 flex items-end justify-between shadow-inner`}>
                        <div className="flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded-full border border-white/40 shadow-sm" style={{ backgroundColor: preset.primaryColor }} />
                          <span className="w-5 h-5 rounded-full border border-white/40 shadow-sm" style={{ backgroundColor: preset.accentColor }} />
                          <span className="w-5 h-5 rounded-full border border-white/40 shadow-sm" style={{ backgroundColor: preset.headerBg }} />
                        </div>
                        <span className="text-[10px] font-bold text-white uppercase tracking-wider bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full">
                          {preset.id}
                        </span>
                      </div>

                      <div>
                        <h4 className="font-bold text-slate-900 text-sm group-hover:text-amber-700 transition-colors">
                          {preset.name}
                        </h4>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                          {preset.description}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] font-medium text-slate-400">5 Renk Uyumlu Ton</span>
                      <button
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          isActive
                            ? 'bg-amber-500 text-white shadow-sm'
                            : 'bg-slate-100 group-hover:bg-amber-500 group-hover:text-white text-slate-700'
                        }`}
                      >
                        {isActive ? 'Uygulandı' : 'Şablonu Seç'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Custom Color Controls & Live Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Color Pickers Form (7 cols) */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200/80 space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0A2D6F] flex items-center justify-center border border-blue-200 shrink-0">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Özel Renk Paleti İnce Ayarları</h3>
                  <p className="text-xs text-slate-500">Her rengi kendi marka kimliğinize göre özelleştirebilirsiniz</p>
                </div>
              </div>

              <div className="space-y-5">
                {/* Primary Color */}
                <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Ana Marka Rengi (Primary)
                    </label>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Ana butonlar, logo vurguları ve aktif menü çizgileri
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <input
                      type="color"
                      value={themeConfig.primaryColor || '#0A2D6F'}
                      onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                      className="w-10 h-10 rounded-xl cursor-pointer border border-slate-300 p-0.5 bg-white shadow-sm"
                    />
                    <input
                      type="text"
                      value={themeConfig.primaryColor || '#0A2D6F'}
                      onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                      className="w-24 px-2.5 py-1.5 text-xs font-mono font-bold uppercase bg-white border border-slate-300 rounded-lg text-slate-800 text-center shadow-sm"
                    />
                  </div>
                </div>

                {/* Accent Color */}
                <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Vurgu & Altın Detay Rengi (Accent)
                    </label>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Fuar rozeti, yıldızlar, kelebek amblemleri ve altın kenarlıklar
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <input
                      type="color"
                      value={themeConfig.accentColor || '#D4AF37'}
                      onChange={(e) => handleColorChange('accentColor', e.target.value)}
                      className="w-10 h-10 rounded-xl cursor-pointer border border-slate-300 p-0.5 bg-white shadow-sm"
                    />
                    <input
                      type="text"
                      value={themeConfig.accentColor || '#D4AF37'}
                      onChange={(e) => handleColorChange('accentColor', e.target.value)}
                      className="w-24 px-2.5 py-1.5 text-xs font-mono font-bold uppercase bg-white border border-slate-300 rounded-lg text-slate-800 text-center shadow-sm"
                    />
                  </div>
                </div>

                {/* Header Background */}
                <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Üst Bar / Header Rengi (Header Background)
                    </label>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Fuar davet bandı, duyuru şeridi ve üst menü arka planı
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <input
                      type="color"
                      value={themeConfig.headerBg || '#062050'}
                      onChange={(e) => handleColorChange('headerBg', e.target.value)}
                      className="w-10 h-10 rounded-xl cursor-pointer border border-slate-300 p-0.5 bg-white shadow-sm"
                    />
                    <input
                      type="text"
                      value={themeConfig.headerBg || '#062050'}
                      onChange={(e) => handleColorChange('headerBg', e.target.value)}
                      className="w-24 px-2.5 py-1.5 text-xs font-mono font-bold uppercase bg-white border border-slate-300 rounded-lg text-slate-800 text-center shadow-sm"
                    />
                  </div>
                </div>

                {/* Background Color */}
                <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Genel Sayfa Arka Planı (Background)
                    </label>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Tüm bölümlerin ve ana sayfa zemin rengi
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <input
                      type="color"
                      value={themeConfig.backgroundColor || '#FFFFFF'}
                      onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
                      className="w-10 h-10 rounded-xl cursor-pointer border border-slate-300 p-0.5 bg-white shadow-sm"
                    />
                    <input
                      type="text"
                      value={themeConfig.backgroundColor || '#FFFFFF'}
                      onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
                      className="w-24 px-2.5 py-1.5 text-xs font-mono font-bold uppercase bg-white border border-slate-300 rounded-lg text-slate-800 text-center shadow-sm"
                    />
                  </div>
                </div>

                {/* Text Color */}
                <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Ana Metin Rengi (Text Color)
                    </label>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Başlıklar, paragraf metinleri ve ürün açıklamaları
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <input
                      type="color"
                      value={themeConfig.textColor || '#111111'}
                      onChange={(e) => handleColorChange('textColor', e.target.value)}
                      className="w-10 h-10 rounded-xl cursor-pointer border border-slate-300 p-0.5 bg-white shadow-sm"
                    />
                    <input
                      type="text"
                      value={themeConfig.textColor || '#111111'}
                      onChange={(e) => handleColorChange('textColor', e.target.value)}
                      className="w-24 px-2.5 py-1.5 text-xs font-mono font-bold uppercase bg-white border border-slate-300 rounded-lg text-slate-800 text-center shadow-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Live Interactive Preview Card (5 cols) */}
            <div className="lg:col-span-5 bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 space-y-5 flex flex-col">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xs">
                  👁️
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Canlı Tema Önizleme</h3>
                  <p className="text-[11px] text-slate-500">Seçtiğiniz renk kombinasyonunun mini simülasyonu</p>
                </div>
              </div>

              {/* Mock Container */}
              <div 
                className="flex-1 rounded-2xl border border-slate-200 overflow-hidden shadow-md p-4 space-y-4 transition-all"
                style={{ backgroundColor: themeConfig.backgroundColor || '#FFFFFF', color: themeConfig.textColor || '#111111' }}
              >
                {/* Mock Header */}
                <div 
                  className="px-4 py-2.5 rounded-xl shadow-sm flex items-center justify-between"
                  style={{ backgroundColor: themeConfig.headerBg || '#062050' }}
                >
                  <span className="text-xs font-bold text-white tracking-widest uppercase">İREM COMFORT</span>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: themeConfig.accentColor || '#D4AF37' }} />
                    <span className="text-[10px] font-semibold text-white/80">Koleksiyon</span>
                  </div>
                </div>

                {/* Mock Hero Card */}
                <div className="p-4 rounded-xl border border-black/5 bg-black/5 space-y-3 relative overflow-hidden">
                  <div 
                    className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-widest text-white shadow-sm"
                    style={{ backgroundColor: themeConfig.primaryColor || '#0A2D6F' }}
                  >
                    1993 • Manisa İmalatı
                  </div>
                  <h4 className="text-base font-serif font-bold" style={{ color: themeConfig.textColor || '#111111' }}>
                    Bayan Hakiki Deri Terlik
                  </h4>
                  <p className="text-xs opacity-75 leading-relaxed">
                    Orpedik anatomik taban ve yumuşak deri saya.
                  </p>

                  <div className="flex items-center gap-2 pt-2">
                    <button 
                      className="px-4 py-2 rounded-lg text-xs font-bold text-white shadow-sm"
                      style={{ backgroundColor: themeConfig.primaryColor || '#0A2D6F' }}
                    >
                      Koleksiyonu Keşfet
                    </button>
                    <button 
                      className="px-3 py-2 rounded-lg text-xs font-bold border"
                      style={{ borderColor: themeConfig.accentColor || '#D4AF37', color: themeConfig.accentColor || '#D4AF37' }}
                    >
                      ★ Kalite Belli
                    </button>
                  </div>
                </div>

                {/* Mock Card */}
                <div className="p-3.5 rounded-xl border border-slate-200/80 bg-white flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white text-xs shadow-xs"
                      style={{ backgroundColor: themeConfig.accentColor || '#D4AF37' }}
                    >
                      %100
                    </div>
                    <div>
                      <h5 className="text-xs font-bold">Hakiki Dana Derisi</h5>
                      <span className="text-[10px] opacity-60">Nefes alan kavisli saya</span>
                    </div>
                  </div>
                  <span 
                    className="text-xs font-bold px-2 py-1 rounded"
                    style={{ backgroundColor: `${themeConfig.primaryColor}15`, color: themeConfig.primaryColor }}
                  >
                    Atölye
                  </span>
                </div>
              </div>

              <div className="text-center pt-1">
                <p className="text-[11px] text-slate-400">
                  Değişiklikler anında kaydedilir ve tüm web sitesinde canlı aktif olur.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB TAB 2: HOMEPAGE SECTION ORDER */}
      {activeTabSub === 'sections' && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200/80 space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center border border-purple-200 shrink-0">
                <Move className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Ana Ekran Bölüm Sıralaması & Görünürlük</h3>
                <p className="text-xs text-slate-500">
                  Bölümleri yukarı/aşağı taşıyın (örneğin İletişim bölümünü SSS&apos;nin üstüne alın veya istemediğiniz bölümleri gizleyin)
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                resetSectionOrder();
                showToast("Bölüm sıralaması varsayılana sıfırlandı.");
              }}
              className="px-3.5 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-2 self-start sm:self-auto cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Sıralamayı Sıfırla</span>
            </button>
          </div>

          {/* List of Sections */}
          <div className="space-y-3">
            {sectionOrder.map((section, index) => {
              const isFirst = index === 0;
              const isLast = index === sectionOrder.length - 1;

              return (
                <div
                  key={section.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    section.enabled
                      ? 'bg-white border-slate-200 hover:border-amber-400/80 shadow-xs'
                      : 'bg-slate-50 border-slate-200/60 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Index Badge */}
                    <div className="w-8 h-8 rounded-lg bg-[#0A2D6F]/10 text-[#0A2D6F] font-bold text-xs flex items-center justify-center shrink-0">
                      {index + 1}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 text-sm">
                          {section.title}
                        </h4>
                        {!section.enabled && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-600 uppercase tracking-wider">
                            Gizlendi
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {section.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    {/* Move Up */}
                    <button
                      onClick={() => moveSection(section.id, 'up')}
                      disabled={isFirst}
                      title="Yukarı Taşı"
                      className="p-2 rounded-lg bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-800 disabled:opacity-30 disabled:hover:bg-slate-100 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>

                    {/* Move Down */}
                    <button
                      onClick={() => moveSection(section.id, 'down')}
                      disabled={isLast}
                      title="Aşağı Taşı"
                      className="p-2 rounded-lg bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-800 disabled:opacity-30 disabled:hover:bg-slate-100 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>

                    {/* Toggle Visibility */}
                    <button
                      onClick={() => toggleSectionEnabled(section.id)}
                      title={section.enabled ? "Bölümü Gizle" : "Bölümü Göster"}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        section.enabled
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                          : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                      }`}
                    >
                      {section.enabled ? (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          <span>Görünür</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          <span>Gizli</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200/80 text-amber-900 text-xs space-y-1">
            <p className="font-bold flex items-center gap-1.5 text-amber-800">
              <span>💡 İpucu:</span>
            </p>
            <p className="text-amber-900/80 leading-relaxed">
              Bölümlerin sırasını veya görünürlüğünü değiştirdiğinizde, ana sayfada üst menüdeki bağlantılar ve pürüzsüz kaydırma fonksiyonları otomatik olarak yeni sıraya göre güncellenir.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

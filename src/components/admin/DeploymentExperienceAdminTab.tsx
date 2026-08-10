import React, { useState, useEffect } from 'react';
import { 
  Play, Video, Volume2, VolumeX, Eye, Save, Sparkles, Check, 
  RotateCcw, Sliders, Monitor, AlertCircle, RefreshCw
} from 'lucide-react';
import { useAppImages } from '../../context/ImageContext';
import { MediaFile } from '../../types';

interface Props {
  onTestDeploymentExperience?: () => void;
}

export const DeploymentExperienceAdminTab: React.FC<Props> = ({ onTestDeploymentExperience }) => {
  const { systemConfig, updateSystemConfig, markClean } = useAppImages();
  const [mediaVideos, setMediaVideos] = useState<MediaFile[]>([]);
  const [loadingVideos, setLoadingVideos] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Form State initialized from systemConfig
  const [videoUrl, setVideoUrl] = useState(systemConfig.deploymentVideo || '');
  const [enableIntro, setEnableIntro] = useState(systemConfig.enableDeploymentIntro ?? false);
  const [volume, setVolume] = useState(systemConfig.videoVolume ?? 0.8);
  const [loop, setLoop] = useState(systemConfig.loopVideo ?? false);
  const [autoplay, setAutoplay] = useState(systemConfig.autoplayVideo ?? true);
  const [muted, setMuted] = useState(systemConfig.mutedVideo ?? true);
  const [showSkip, setShowSkip] = useState(systemConfig.skipButton ?? true);
  const [fadeDuration, setFadeDuration] = useState(systemConfig.fadeDuration ?? 800);
  const [minLoadingTime, setMinLoadingTime] = useState(systemConfig.minLoadingTime ?? 3);

  useEffect(() => {
    if (systemConfig) {
      setVideoUrl(systemConfig.deploymentVideo || '');
      setEnableIntro(systemConfig.enableDeploymentIntro ?? false);
      setVolume(systemConfig.videoVolume ?? 0.8);
      setLoop(systemConfig.loopVideo ?? false);
      setAutoplay(systemConfig.autoplayVideo ?? true);
      setMuted(systemConfig.mutedVideo ?? true);
      setShowSkip(systemConfig.skipButton ?? true);
      setFadeDuration(systemConfig.fadeDuration ?? 800);
      setMinLoadingTime(systemConfig.minLoadingTime ?? 3);
    }
  }, [systemConfig]);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    setLoadingVideos(true);
    try {
      const res = await fetch('/api/media');
      const data = await res.json();
      if (data.success && Array.isArray(data.files)) {
        const vids = data.files.filter((f: MediaFile) => {
          const p = (f.path || f.name).toLowerCase();
          return p.endsWith('.mp4') || p.endsWith('.webm') || f.folder === 'videos';
        });
        setMediaVideos(vids);
      }
    } catch (err) {
      console.error("Failed fetching media videos:", err);
    } finally {
      setLoadingVideos(false);
    }
  };

  const showNotification = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      updateSystemConfig({
        deploymentVideo: videoUrl,
        enableDeploymentIntro: enableIntro,
        videoVolume: volume,
        loopVideo: loop,
        autoplayVideo: autoplay,
        mutedVideo: muted,
        skipButton: showSkip,
        fadeDuration: Number(fadeDuration),
        minLoadingTime: Number(minLoadingTime)
      });
      markClean();
      showNotification('✅ Deployment Deneyimi ayarları başarıyla kaydedildi!');
    } catch (err) {
      showNotification('❌ Ayarlar kaydedilirken hata oluştu.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 text-slate-100">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-8 z-50 bg-amber-500 text-slate-950 font-bold px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-bounce">
          <Check className="w-5 h-5" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/80 p-6 rounded-3xl border border-indigo-500/20 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Modern Site Güncelleme Deneyimi</span>
          </div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Monitor className="w-6 h-6 text-amber-400" />
            <span>Deployment Deneyimi Ayarları</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Sitenize yeni bir güncelleme veya yayınlama (deploy) geldiğinde ziyaretçilere gösterilecek video ve karşılama deneyimini yapılandırın.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {onTestDeploymentExperience && (
            <button
              onClick={onTestDeploymentExperience}
              className="px-4 py-2.5 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Eye className="w-4 h-4 text-indigo-400" />
              <span>Canlı Test Et</span>
            </button>
          )}

          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 text-xs font-extrabold rounded-2xl shadow-lg transition flex items-center gap-2 cursor-pointer"
          >
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{saving ? 'Kaydediliyor...' : 'Ayarları Kaydet'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Active Video Selector */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-800 shadow-xl space-y-5">
            <h3 className="text-sm font-bold text-white flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Video className="w-4 h-4 text-amber-400" />
                <span>Aktif Deployment Videosu</span>
              </span>
              <button
                onClick={fetchVideos}
                disabled={loadingVideos}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingVideos ? 'animate-spin' : ''}`} />
                <span>Videoları Yenile</span>
              </button>
            </h3>

            {/* Video Selector Dropdown */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-400">
                Media Library Videosundan Seçin:
              </label>
              <select
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="">-- Video Seçilmedi (Sadece Yükleme Ekranı Gösterilir) --</option>
                {mediaVideos.map(v => {
                  const url = v.path.startsWith('http') ? v.path : `/uploads/${v.folder}/${v.name}`;
                  return (
                    <option key={v.id} value={url}>
                      🎬 {v.name} ({v.folder})
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Manual URL Input */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-400">
                veya Doğrudan Video URL Bağlantısı Girin:
              </label>
              <input
                type="text"
                placeholder="/uploads/videos/intro.mp4 veya https://..."
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>

            {/* Video Player Preview */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-medium text-slate-400 flex items-center justify-between">
                <span>Seçili Video Önizlemesi:</span>
                {videoUrl && <span className="text-[10px] text-emerald-400 font-mono">Ready to play</span>}
              </label>
              <div className="aspect-video bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center relative group">
                {videoUrl ? (
                  <video
                    key={videoUrl}
                    src={videoUrl}
                    controls
                    muted={muted}
                    loop={loop}
                    className="w-full h-full object-contain bg-black"
                  />
                ) : (
                  <div className="text-center p-8 text-slate-500 space-y-2">
                    <Video className="w-12 h-12 mx-auto text-slate-700" />
                    <p className="text-xs">Henüz yayınlama videosu seçilmedi.</p>
                    <p className="text-[10px] text-slate-600">
                      Medya Kütüphanesi &gt; Videos alanından bir video yükleyip seçebilirsiniz.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Experience Configuration & Toggles */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-800 shadow-xl space-y-5">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Sliders className="w-4 h-4 text-indigo-400" />
              <span>Oynatma & Deneyim Ayarları</span>
            </h3>

            {/* Enable Intro Toggle */}
            <div className="flex items-center justify-between p-3.5 bg-slate-950 rounded-2xl border border-slate-800">
              <div>
                <p className="text-xs font-bold text-white">Yayınlama Karşılama Ekranı</p>
                <p className="text-[10px] text-slate-400">Yeni versiyonlarda karşılama videosunu oynat</p>
              </div>
              <input
                type="checkbox"
                checked={enableIntro}
                onChange={(e) => setEnableIntro(e.target.checked)}
                className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
              />
            </div>

            {/* Skip Button Toggle */}
            <div className="flex items-center justify-between p-3.5 bg-slate-950 rounded-2xl border border-slate-800">
              <div>
                <p className="text-xs font-bold text-white">"Atla / Siteye Geç" Butonu</p>
                <p className="text-[10px] text-slate-400">Ziyaretçinin videoyu geçmesine izin ver</p>
              </div>
              <input
                type="checkbox"
                checked={showSkip}
                onChange={(e) => setShowSkip(e.target.checked)}
                className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
              />
            </div>

            {/* Autoplay & Muted */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <label className="text-xs font-bold text-white flex items-center justify-between cursor-pointer">
                  <span>Otomatik Başlat</span>
                  <input
                    type="checkbox"
                    checked={autoplay}
                    onChange={(e) => setAutoplay(e.target.checked)}
                    className="w-4 h-4 accent-amber-500 rounded"
                  />
                </label>
                <p className="text-[10px] text-slate-400">Videoyu otomatik oynatır</p>
              </div>

              <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <label className="text-xs font-bold text-white flex items-center justify-between cursor-pointer">
                  <span>Sessiz (Muted)</span>
                  <input
                    type="checkbox"
                    checked={muted}
                    onChange={(e) => setMuted(e.target.checked)}
                    className="w-4 h-4 accent-amber-500 rounded"
                  />
                </label>
                <p className="text-[10px] text-slate-400">Ses varsayılan kapalı</p>
              </div>
            </div>

            {/* Loop Option */}
            <div className="flex items-center justify-between p-3.5 bg-slate-950 rounded-2xl border border-slate-800">
              <div>
                <p className="text-xs font-bold text-white">Videoyu Döngüye Al (Loop)</p>
                <p className="text-[10px] text-slate-400">Video bittiğinde otomatik tekrar oynat</p>
              </div>
              <input
                type="checkbox"
                checked={loop}
                onChange={(e) => setLoop(e.target.checked)}
                className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
              />
            </div>

            {/* Volume Control */}
            <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="flex items-center gap-1.5 text-white">
                  {muted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
                  <span>Ses Seviyesi</span>
                </span>
                <span className="font-mono text-amber-400">{Math.round(volume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Timing Inputs */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5">
                <label className="text-xs font-bold text-white block">Geçiş Süresi (ms):</label>
                <input
                  type="number"
                  min="200"
                  max="3000"
                  step="100"
                  value={fadeDuration}
                  onChange={(e) => setFadeDuration(parseInt(e.target.value) || 800)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-white font-mono"
                />
                <p className="text-[10px] text-slate-500">Video bitiş fade efekti</p>
              </div>

              <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5">
                <label className="text-xs font-bold text-white block">Min. Bekleme (sn):</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={minLoadingTime}
                  onChange={(e) => setMinLoadingTime(parseInt(e.target.value) || 3)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-white font-mono"
                />
                <p className="text-[10px] text-slate-500">Minimum yükleme süresi</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

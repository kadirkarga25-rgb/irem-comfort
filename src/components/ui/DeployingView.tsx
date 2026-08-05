import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogoFull } from '../brand/LogoFull';
import { RefreshCw, CheckCircle2, Sparkles, Lock, Play, Pause, Volume2, VolumeX, ArrowRight, Video, Upload, AlertCircle } from 'lucide-react';
import { useAppImages, DeploymentProgress } from '../../context/ImageContext';

export const DeployingView: React.FC = () => {
  const { systemConfig, updateSystemConfig } = useAppImages();

  // Sequence Steps: 
  // 'stage1' -> "Sitemizin tamamlanmasına çok az kaldı, beklediğiniz için teşekkürler." (Live Deploy Polling)
  // 'stage2' -> "Sitemiz tamamlandı, beklediğiniz için teşekkürler." (Shows video launch option)
  // 'video'  -> Playing video / Start Website
  const [sequenceStep, setSequenceStep] = useState<'stage1' | 'stage2' | 'video'>('stage1');
  const [deployProgress, setDeployProgress] = useState<DeploymentProgress | null>(null);
  const [deployError, setDeployError] = useState<string | null>(null);
  
  // Video playback controls
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Custom uploaded video state
  const [customVideoUrl, setCustomVideoUrl] = useState<string>(systemConfig.introVideoUrl || '');

  // Poll real deployment status from backend
  useEffect(() => {
    let timer: any;
    const checkStatus = async () => {
      try {
        const res = await fetch('/api/deploy-status');
        const data = await res.json();
        if (data.deployment) {
          const dep = data.deployment as DeploymentProgress;
          setDeployProgress(dep);

          if (dep.status === 'READY') {
            setSequenceStep('stage2');
          } else if (dep.status === 'ERROR') {
            setDeployError(dep.error || 'Deployment failed');
          }
        }
      } catch (e) {
        console.warn('Status poll error:', e);
      }
    };

    checkStatus();
    timer = setInterval(checkStatus, 2500);

    return () => clearInterval(timer);
  }, []);

  const handleStartWebsite = () => {
    updateSystemConfig({ isDeploying: false });
    window.location.href = '/';
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const url = event.target?.result as string;
      setCustomVideoUrl(url);
      updateSystemConfig({ introVideoUrl: url });
    };
    reader.readAsDataURL(file);
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
  };

  const currentStepNum = (deployProgress?.stepIndex ?? 0) + 1;
  const progressPercent = Math.min(100, Math.round((currentStepNum / 9) * 100));

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between items-center p-6 relative overflow-hidden font-sans selection:bg-[#082C6C] selection:text-white">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#082C6C]/40 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[300px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Header */}
      <header className="w-full max-w-5xl flex items-center justify-between pt-4 z-10">
        <div className="bg-slate-900/80 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 shadow-lg">
          <LogoFull className="h-8 text-white" />
        </div>

        <a
          href="/admin"
          className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white text-xs font-semibold border border-white/10 transition-all flex items-center gap-2 cursor-pointer"
        >
          <Lock className="w-3.5 h-3.5 text-amber-400" />
          <span>Yönetici Paneli</span>
        </a>
      </header>

      {/* Main Container */}
      <main className="max-w-2xl w-full text-center my-auto py-12 space-y-8 z-10">
        <AnimatePresence mode="wait">
          {/* STAGE 1: REAL DEPLOYMENT PROGRESS & STEP LOGS */}
          {sequenceStep === 'stage1' && (
            <motion.div
              key="stage1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              {/* Spinner Icon */}
              <div className="relative inline-block">
                <div className={`w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr ${
                  deployError ? 'from-rose-950 via-rose-900 to-slate-900 border-rose-500/40' : 'from-[#082C6C] via-indigo-900 to-slate-900 border-blue-400/30'
                } border flex items-center justify-center shadow-2xl mx-auto`}>
                  {deployError ? (
                    <AlertCircle className="w-12 h-12 text-rose-400" />
                  ) : (
                    <RefreshCw className="w-12 h-12 text-blue-400 animate-spin" />
                  )}
                </div>
                <span className={`absolute -bottom-2 -right-2 px-3 py-1 rounded-full text-white text-[10px] font-extrabold uppercase tracking-widest shadow ${
                  deployError ? 'bg-rose-600' : 'bg-blue-500'
                }`}>
                  {deployError ? 'HATA' : 'YAYINLANIYOR'}
                </span>
              </div>

              {/* Text Message 1 */}
              <div className="space-y-4">
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white font-serif-luxury leading-tight">
                  {systemConfig.stage1Text || "Sitemizin tamamlanmasına çok az kaldı, beklediğiniz için teşekkürler."}
                </h1>
                <p className="text-sm text-slate-400 max-w-md mx-auto font-light">
                  Güncellenen dosyalar ve görseller Vercel üzerinde yayına alınıyor...
                </p>
              </div>

              {/* Live Progress Card */}
              <div className="bg-slate-900/90 p-6 rounded-2xl border border-white/10 backdrop-blur-md space-y-4 max-w-lg mx-auto text-left shadow-2xl">
                <div className="flex items-center justify-between text-xs font-mono font-bold">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                    {deployError ? 'Yayınlama Durduruldu' : 'Vercel Deployment Adımları'}
                  </span>
                  {deployProgress?.durationString && (
                    <span className="text-amber-400 font-bold">
                      Duration: {deployProgress.durationString}
                    </span>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden p-0.5 border border-white/10">
                  <motion.div
                    className={`h-full rounded-full ${deployError ? 'bg-rose-500' : 'bg-gradient-to-r from-blue-500 via-indigo-500 to-amber-400'}`}
                    initial={{ width: '0%' }}
                    animate={{ width: `${deployError ? 100 : progressPercent}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  />
                </div>

                {/* Step Logs Box */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs space-y-2 max-h-48 overflow-y-auto">
                  {deployProgress?.logs && deployProgress.logs.length > 0 ? (
                    deployProgress.logs.map((logStr, idx) => {
                      const isSuccess = logStr.startsWith('✓');
                      const isPending = logStr.startsWith('⏳');
                      const isFailed = logStr.startsWith('❌');

                      return (
                        <div
                          key={idx}
                          className={`flex items-center gap-2 font-medium ${
                            isFailed
                              ? 'text-rose-400 font-bold'
                              : isPending
                              ? 'text-amber-300 animate-pulse font-bold'
                              : 'text-emerald-300'
                          }`}
                        >
                          {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                          {isPending && <RefreshCw className="w-4 h-4 text-amber-400 animate-spin shrink-0" />}
                          {isFailed && <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />}
                          <span>{logStr}</span>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-slate-500 text-center py-2 italic">
                      ✓ Content validated<br />
                      ✓ Images prepared<br />
                      ⏳ Uploading to GitHub...
                    </div>
                  )}
                </div>

                {/* Real Error Box if deployment fails */}
                {deployError && (
                  <div className="p-3 bg-rose-950/80 border border-rose-500/50 rounded-xl text-rose-200 text-xs space-y-1">
                    <p className="font-bold flex items-center gap-1.5 text-rose-300">
                      <AlertCircle className="w-4 h-4 text-rose-400" />
                      Hata Detayı:
                    </p>
                    <p className="font-mono text-[11px] text-rose-200">{deployError}</p>
                    <p className="text-[10px] text-amber-300 font-sans pt-1">
                      Bakım modu aktif tutulmuştur. Yönetici panelinden hatayı inceleyebilirsiniz.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* STAGE 2 & 3: COMPLETED MESSAGE & VIDEO INTRO */}
          {(sequenceStep === 'stage2' || sequenceStep === 'video') && (
            <motion.div
              key="stage2"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              {/* Checkmark Icon */}
              <div className="relative inline-block">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-emerald-950 via-emerald-900 to-slate-900 border border-emerald-400/40 flex items-center justify-center shadow-2xl shadow-emerald-900/60 mx-auto">
                  <CheckCircle2 className="w-14 h-14 text-emerald-400" />
                </div>
                <span className="absolute -bottom-2 -right-2 px-3 py-1 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-extrabold uppercase tracking-widest shadow">
                  TAMAMLANDI
                </span>
              </div>

              {/* Text Message 2 */}
              <div className="space-y-4">
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white font-serif-luxury leading-tight">
                  {systemConfig.stage2Text || "Sitemiz tamamlandı, beklediğiniz için teşekkürler."}
                </h1>
                <p className="text-sm text-slate-300 max-w-md mx-auto font-light">
                  Aşağıdaki tanıtım videosunu izleyebilir veya doğrudan siteye giriş yapabilirsiniz.
                </p>
              </div>

              {/* Video Section Container */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl max-w-xl mx-auto space-y-4 text-left">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="text-xs font-bold text-amber-400 flex items-center gap-2">
                    <Video className="w-4 h-4 text-amber-400" />
                    <span>Tanıtım Videosu</span>
                  </span>

                  {/* Quick Video Upload Input for Admin/User */}
                  <label className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-semibold rounded-xl border border-slate-700 transition cursor-pointer flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Video Yükle (MP4)</span>
                    <input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={handleVideoUpload}
                    />
                  </label>
                </div>

                {/* Video Player Box */}
                <div className="relative aspect-video bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center group">
                  {customVideoUrl ? (
                    <>
                      <video
                        ref={videoRef}
                        src={customVideoUrl}
                        className="w-full h-full object-cover"
                        onEnded={handleVideoEnded}
                        playsInline
                      />

                      {/* Video Controls Overlay */}
                      <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                        <button
                          onClick={togglePlay}
                          className="p-4 rounded-full bg-amber-500 text-slate-950 hover:scale-110 transition shadow-xl cursor-pointer"
                        >
                          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
                        </button>
                        <button
                          onClick={toggleMute}
                          className="p-3 rounded-full bg-slate-800/80 text-white hover:bg-slate-700 transition cursor-pointer"
                        >
                          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-6 space-y-3">
                      <Video className="w-12 h-12 text-slate-700 mx-auto" />
                      <p className="text-xs text-slate-400">Henüz video yüklenmedi.</p>
                      <label className="inline-flex px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl cursor-pointer transition">
                        <span>Video Yükle (.mp4)</span>
                        <input
                          type="file"
                          accept="video/*"
                          className="hidden"
                          onChange={handleVideoUpload}
                        />
                      </label>
                    </div>
                  )}
                </div>

                {/* Launch Website Action Button */}
                <button
                  onClick={handleStartWebsite}
                  className="w-full py-4 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-extrabold text-sm rounded-2xl shadow-xl hover:shadow-amber-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <span>Siteyi Başlat</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="w-full text-center text-slate-500 text-[11px] font-light z-10 pb-4">
        <p>© {new Date().getFullYear()} İrem Comfort Ayakkabıcılık - Otomatik Yayınlama & Tanıtım Sistemi</p>
      </footer>
    </div>
  );
};


import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogoFull } from '../brand/LogoFull';
import { 
  RefreshCw, CheckCircle2, Sparkles, Lock, Play, Pause, Volume2, 
  VolumeX, ArrowRight, Video, AlertCircle, X, ChevronRight
} from 'lucide-react';
import { useAppImages, DeploymentProgress } from '../../context/ImageContext';

interface Props {
  onComplete?: () => void;
}

export const DeployingView: React.FC<Props> = ({ onComplete }) => {
  const { systemConfig, updateSystemConfig } = useAppImages();

  // Sequence Steps: 
  // 'building' -> Real-time Vercel & GitHub Build Polling
  // 'video_presentation' -> Auto playing selected deployment video or welcome presentation
  const [sequenceStep, setSequenceStep] = useState<'building' | 'video_presentation'>('building');
  const [deployProgress, setDeployProgress] = useState<DeploymentProgress | null>(null);
  const [deployError, setDeployError] = useState<string | null>(null);
  const [isFadingOut, setIsFadingOut] = useState(false);

  // Video playback controls
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(systemConfig.mutedVideo ?? true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const videoUrl = systemConfig.deploymentVideo || '';
  const fadeMs = systemConfig.fadeDuration ?? 800;

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
            setSequenceStep('video_presentation');
          } else if (dep.status === 'ERROR') {
            setDeployError(dep.error || 'Deployment failed');
          }
        } else if (!systemConfig.isDeploying) {
          setSequenceStep('video_presentation');
        }
      } catch (e) {
        console.warn('Status poll error:', e);
      }
    };

    checkStatus();
    timer = setInterval(checkStatus, 2000);

    return () => clearInterval(timer);
  }, [systemConfig.isDeploying]);

  // Handle video element setup once video presentation is mounted
  useEffect(() => {
    if (sequenceStep === 'video_presentation' && videoRef.current) {
      const vid = videoRef.current;
      vid.volume = systemConfig.videoVolume ?? 0.8;
      vid.muted = systemConfig.mutedVideo ?? true;
      setIsMuted(vid.muted);

      if (systemConfig.autoplayVideo !== false) {
        vid.play()
          .then(() => setIsPlaying(true))
          .catch((err) => {
            console.warn("Autoplay muted fallback:", err);
            vid.muted = true;
            setIsMuted(true);
            vid.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
          });
      }
    }
  }, [sequenceStep, videoUrl]);

  const finishDeploymentExperience = () => {
    setIsFadingOut(true);
    if (systemConfig.deploymentRevision) {
      localStorage.setItem('last_watched_deployment_revision', systemConfig.deploymentRevision);
    } else {
      localStorage.setItem('last_watched_deployment_revision', `rev_${Date.now()}`);
    }

    setTimeout(() => {
      updateSystemConfig({ isDeploying: false });
      if (onComplete) onComplete();
    }, fadeMs);
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
    if (!systemConfig.loopVideo) {
      // Smooth auto transition on video complete
      finishDeploymentExperience();
    }
  };

  const currentStepNum = (deployProgress?.stepIndex ?? 0) + 1;
  const progressPercent = Math.min(100, Math.round((currentStepNum / 9) * 100));

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col justify-between items-center p-4 sm:p-6 overflow-hidden font-sans selection:bg-[#082C6C] selection:text-white"
      style={{
        transition: `opacity ${fadeMs}ms ease-out`,
        opacity: isFadingOut ? 0 : 1,
        pointerEvents: isFadingOut ? 'none' : 'auto'
      }}
    >
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#082C6C]/40 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[300px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Header Bar */}
      <header className="w-full max-w-6xl flex items-center justify-between pt-2 z-20">
        <div className="bg-slate-900/80 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/10 shadow-lg">
          <LogoFull className="h-7 text-white" />
        </div>

        <div className="flex items-center gap-3">
          {systemConfig.skipButton !== false && sequenceStep === 'video_presentation' && (
            <button
              onClick={finishDeploymentExperience}
              className="px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold shadow-xl transition flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <span>Atla / Siteye Geç</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

          <a
            href="/admin"
            className="px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white text-xs font-semibold border border-white/10 transition flex items-center gap-2 cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>Yönetici Paneli</span>
          </a>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-3xl w-full text-center my-auto py-8 space-y-6 z-10">
        <AnimatePresence mode="wait">
          {/* STATE 1: BUILDING & DEPLOYMENT PROGRESS */}
          {sequenceStep === 'building' && (
            <motion.div
              key="building"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              {/* Spinner Icon */}
              <div className="relative inline-block">
                <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr ${
                  deployError ? 'from-rose-950 via-rose-900 to-slate-900 border-rose-500/40' : 'from-[#082C6C] via-indigo-900 to-slate-900 border-blue-400/30'
                } border flex items-center justify-center shadow-2xl mx-auto`}>
                  {deployError ? (
                    <AlertCircle className="w-10 h-10 text-rose-400" />
                  ) : (
                    <RefreshCw className="w-10 h-10 text-amber-400 animate-spin" />
                  )}
                </div>
                <span className={`absolute -bottom-2 -right-2 px-3 py-1 rounded-full text-white text-[10px] font-extrabold uppercase tracking-widest shadow ${
                  deployError ? 'bg-rose-600' : 'bg-amber-500 text-slate-950'
                }`}>
                  {deployError ? 'HATA' : 'YAYINLANIYOR'}
                </span>
              </div>

              {/* Message */}
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-serif-luxury leading-tight">
                  {systemConfig.stage1Text || "Sitemizin güncellenmesi tamamlanıyor, beklediğiniz için teşekkürler."}
                </h1>
                <p className="text-xs text-slate-400 max-w-md mx-auto font-light">
                  Yeni site ayarları ve içerikler canlı sunucuya aktarılıyor...
                </p>
              </div>

              {/* Progress Card */}
              <div className="bg-slate-900/90 p-5 rounded-3xl border border-white/10 backdrop-blur-md space-y-4 max-w-lg mx-auto text-left shadow-2xl">
                <div className="flex items-center justify-between text-xs font-mono font-bold">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                    {deployError ? 'Yayınlama Durduruldu' : 'Deployment İlerlemesi'}
                  </span>
                  {deployProgress?.durationString && (
                    <span className="text-amber-400 font-bold">
                      Süre: {deployProgress.durationString}
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

                {/* Step Logs Console */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-xs space-y-2 max-h-40 overflow-y-auto">
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
                    <div className="text-slate-500 text-center py-2 italic text-[11px]">
                      ✓ İçerik doğrulaması tamamlandı<br />
                      ✓ Görseller hazırlandı<br />
                      ⏳ GitHub & Vercel senkronizasyonu...
                    </div>
                  )}
                </div>

                {deployError && (
                  <div className="p-3 bg-rose-950/80 border border-rose-500/50 rounded-2xl text-rose-200 text-xs space-y-1">
                    <p className="font-bold flex items-center gap-1.5 text-rose-300">
                      <AlertCircle className="w-4 h-4 text-rose-400" />
                      Hata Bildirimi:
                    </p>
                    <p className="font-mono text-[11px] text-rose-200">{deployError}</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* STATE 2: VIDEO EXPERIENCE & WELCOME SCREEN */}
          {sequenceStep === 'video_presentation' && (
            <motion.div
              key="video_presentation"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold uppercase tracking-wider">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Site Güncellendi
                </span>
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white font-serif-luxury leading-tight">
                  {systemConfig.stage2Text || "Sitemiz güncellendi, hoş geldiniz!"}
                </h1>
              </div>

              {/* Video Player or Welcome Card */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl max-w-2xl mx-auto space-y-4">
                {videoUrl ? (
                  <div className="relative aspect-video bg-black rounded-2xl overflow-hidden border border-slate-800 group shadow-2xl">
                    <video
                      ref={videoRef}
                      src={videoUrl}
                      className="w-full h-full object-contain bg-black"
                      onEnded={handleVideoEnded}
                      loop={systemConfig.loopVideo}
                      playsInline
                    />

                    {/* Interactive Overlay */}
                    <div className="absolute inset-0 bg-slate-950/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                      <button
                        onClick={togglePlay}
                        className="p-4 rounded-full bg-amber-500 text-slate-950 hover:scale-110 transition shadow-2xl cursor-pointer"
                      >
                        {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
                      </button>
                      <button
                        onClick={toggleMute}
                        className="p-3.5 rounded-full bg-slate-800/80 text-white hover:bg-slate-700 transition cursor-pointer"
                      >
                        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center space-y-3 bg-slate-950 rounded-2xl border border-slate-800/80">
                    <Sparkles className="w-12 h-12 text-amber-400 mx-auto animate-pulse" />
                    <p className="text-sm font-semibold text-slate-200">En güncel ürünler ve koleksiyonlar hazır.</p>
                    <p className="text-xs text-slate-400">Yeni versiyon sitemizde gezintiye başlamak için butona tıklayın.</p>
                  </div>
                )}

                {/* Primary Action Button */}
                <button
                  onClick={finishDeploymentExperience}
                  className="w-full py-4 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-extrabold text-sm rounded-2xl shadow-xl hover:shadow-amber-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <span>Siteye Giriş Yap</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="w-full text-center text-slate-500 text-[11px] font-light z-20 pb-2">
        <p>© {new Date().getFullYear()} İrem Comfort Ayakkabıcılık — Deployment Experience System</p>
      </footer>
    </div>
  );
};

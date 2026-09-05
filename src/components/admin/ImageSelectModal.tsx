import React, { useState, useEffect } from 'react';
import { 
  ImageIcon, Upload, Search, Folder, Check, X, 
  Sparkles, RefreshCw, FileImage, Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MediaFile } from '../../types';

interface ImageSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSystemImage: (imageUrl: string) => void;
  onUploadFromComputer: () => void;
  targetTitle?: string;
  recommendedSpecs?: string;
}

export const ImageSelectModal: React.FC<ImageSelectModalProps> = ({
  isOpen,
  onClose,
  onSelectSystemImage,
  onUploadFromComputer,
  targetTitle = 'Görsel',
  recommendedSpecs = ''
}) => {
  const [activeTab, setActiveTab] = useState<'system' | 'upload'>('system');
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [folders, setFolders] = useState<string[]>(['all', 'products', 'hero', 'logo', 'gallery']);
  const [selectedFolder, setSelectedFolder] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);

  const fetchSystemMedia = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/media');
      const data = await res.json();
      if (data.success && Array.isArray(data.files)) {
        setMediaFiles(data.files);
        if (Array.isArray(data.folders)) {
          setFolders(['all', ...data.folders]);
        }
      }
    } catch (err) {
      console.error("Failed fetching media for picker:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchSystemMedia();
    }
  }, [isOpen]);

  const filteredFiles = mediaFiles.filter(file => {
    const matchesFolder = selectedFolder === 'all' || file.folder === selectedFolder;
    const sTerm = (searchQuery || '').toLowerCase();
    const matchesSearch = searchQuery.trim() === '' || 
      (file.name || '').toLowerCase().includes(sTerm) || 
      (file.path || '').toLowerCase().includes(sTerm);
    return matchesFolder && matchesSearch;
  });

  const handleDropzoneUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const base64Str = reader.result as string;
      try {
        const githubRepo = localStorage.getItem('irem_github_repo') || undefined;
        const githubToken = localStorage.getItem('irem_github_token') || undefined;

        const res = await fetch('/api/media/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            image: base64Str,
            folder: selectedFolder === 'all' ? 'gallery' : selectedFolder,
            filename: file.name,
            githubRepo,
            githubToken,
            triggerDeploy: false
          })
        });
        const data = await res.json();
        if (data.success && data.url) {
          onSelectSystemImage(data.url);
          onClose();
        } else {
          alert(`Görsel Yükleme Hatası:\n${data.error || 'GitHub yüklemesi başarısız oldu.'}`);
        }
      } catch (err: any) {
        console.error("Direct modal upload error:", err);
        alert(`Yükleme sırasında hata oluştu:\n${err?.message || 'Sunucu bağlantı hatası'}`);
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]"
        >
          {/* Header */}
          <div className="bg-[#082C6C] text-white p-5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-amber-300">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base font-serif-luxury tracking-wide flex items-center gap-2">
                  <span>Görsel Seç — {targetTitle}</span>
                  {recommendedSpecs && (
                    <span className="bg-amber-400 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full font-mono">
                      {recommendedSpecs}
                    </span>
                  )}
                </h3>
                <p className="text-xs text-white/70">
                  Sistemdeki mevcut görsellerden birini seçin veya bilgisayarınızdan yükleyin.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-slate-100 border-b border-slate-200 px-6 pt-3 flex gap-2 shrink-0">
            <button
              onClick={() => setActiveTab('system')}
              className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'system'
                  ? 'bg-white text-[#082C6C] border-t-2 border-[#082C6C] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-4 h-4 text-amber-600" />
              <span>Sistemdeki Görseller ({filteredFiles.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('upload')}
              className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'upload'
                  ? 'bg-white text-[#082C6C] border-t-2 border-[#082C6C] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Upload className="w-4 h-4 text-emerald-600" />
              <span>Cihazdan/Bilgisayardan Yükle</span>
            </button>
          </div>

          {/* Content Area */}
          <div className="p-6 overflow-y-auto flex-1 bg-slate-50/50">
            {activeTab === 'system' ? (
              <div className="space-y-4">
                {/* Search & Category Filter Bar */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  {/* Category Pills */}
                  <div className="flex flex-wrap gap-1.5 overflow-x-auto pb-1">
                    {folders.map((folder) => {
                      const labels: Record<string, string> = {
                        all: 'Tümü',
                        products: 'Ürünler',
                        hero: 'Hero / Banner',
                        logo: 'Logo',
                        gallery: 'Galeri'
                      };
                      return (
                        <button
                          key={folder}
                          onClick={() => setSelectedFolder(folder)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition cursor-pointer ${
                            selectedFolder === folder
                              ? 'bg-[#082C6C] text-white shadow-xs'
                              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {labels[folder] || folder}
                        </button>
                      );
                    })}
                  </div>

                  {/* Search Input & Refresh */}
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Görsel ara..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#082C6C] w-44"
                      />
                    </div>
                    <button
                      onClick={fetchSystemMedia}
                      className="p-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-[#082C6C] transition cursor-pointer"
                      title="Kütüphaneyi Yenile"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Grid View */}
                {loading ? (
                  <div className="py-16 text-center space-y-3">
                    <RefreshCw className="w-8 h-8 text-[#082C6C] animate-spin mx-auto" />
                    <p className="text-xs text-slate-500 font-medium">Sistemdeki görseller taranıyor...</p>
                  </div>
                ) : filteredFiles.length === 0 ? (
                  <div className="py-12 bg-white rounded-2xl border border-dashed border-slate-300 text-center space-y-3">
                    <FileImage className="w-10 h-10 text-slate-300 mx-auto" />
                    <p className="text-xs text-slate-500 font-medium">
                      Bu kategoride henüz sistem görseli bulunamadı.
                    </p>
                    <button
                      onClick={() => onUploadFromComputer()}
                      className="px-4 py-2 bg-[#082C6C] text-white text-xs font-bold rounded-xl hover:bg-[#113d8d] transition cursor-pointer"
                    >
                      Bilgisayardan Yeni Görsel Yükle
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {filteredFiles.map((file) => (
                      <div
                        key={file.path}
                        onClick={() => {
                          const cleanUrl = file.path.startsWith('http') ? file.path : `/uploads/${file.folder}/${file.name}`;
                          onSelectSystemImage(cleanUrl);
                          onClose();
                        }}
                        className="group relative bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md hover:border-[#082C6C] transition cursor-pointer flex flex-col"
                      >
                        <div className="aspect-square bg-slate-100 relative overflow-hidden flex items-center justify-center">
                          <img
                            src={file.path.startsWith('http') ? file.path : `/uploads/${file.folder}/${file.name}`}
                            alt={file.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              if (!target.src.includes('irem-comfort-logo')) {
                                target.src = '/uploads/logo/irem-comfort-logo.jpg';
                              }
                            }}
                          />
                          <div className="absolute inset-0 bg-[#082C6C]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2">
                            <span className="px-3 py-1.5 rounded-xl bg-amber-400 text-slate-950 text-xs font-bold shadow-lg flex items-center gap-1.5 scale-90 group-hover:scale-100 transition-transform">
                              <Check className="w-4 h-4" />
                              <span>Görseli Seç</span>
                            </span>
                          </div>
                        </div>

                        <div className="p-2.5 bg-white border-t border-slate-100">
                          <p className="text-[11px] font-semibold text-slate-800 truncate" title={file.name}>
                            {file.name}
                          </p>
                          <p className="text-[9px] font-mono text-slate-400 truncate mt-0.5">
                            {file.folder}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* Computer Upload Tab */
              <div className="py-8 px-4 space-y-6 max-w-lg mx-auto text-center">
                <div className="border-2 border-dashed border-slate-300 hover:border-[#082C6C] bg-white rounded-3xl p-8 transition space-y-4 group">
                  <div className="w-16 h-16 rounded-full bg-slate-100 group-hover:bg-blue-50 text-[#082C6C] flex items-center justify-center mx-auto transition">
                    <Upload className="w-8 h-8 text-[#082C6C]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">
                      Bilgisayarınızdan Görsel Seçin veya Sürükleyin
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      JPG, PNG, WEBP veya GIF formatları desteklenmektedir. Yükledikten sonra Kırpma & Boyutlandırma aracı açılacaktır.
                    </p>
                  </div>

                  <div className="pt-2 flex flex-col gap-2 items-center">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onUploadFromComputer();
                      }}
                      className="px-6 py-3 bg-[#082C6C] hover:bg-[#113d8d] text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Bilgisayardan Dosya Seç & Kırp</span>
                    </button>

                    <label className="text-[11px] text-slate-500 hover:text-[#082C6C] underline cursor-pointer font-medium mt-1">
                      <span>Veya Kırpmadan Doğrudan Yükle</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleDropzoneUpload}
                      />
                    </label>
                  </div>
                </div>

                {uploading && (
                  <div className="flex items-center justify-center gap-2 text-xs text-[#082C6C] font-semibold">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Görsel yükleniyor...</span>
                  </div>
                )}

                {/* Google / External Image Link Import */}
                <div className="border border-slate-200 bg-white rounded-2xl p-4 space-y-3 text-left shadow-xs">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Veya Google / Web Görsel Bağlantısı Yapıştırın:</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input 
                      type="url"
                      placeholder="https://... Google veya internetten kopyaladığınız resim adresini yapıştırın"
                      id="modalExternalUrlInput"
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#082C6C]"
                    />
                    <button
                      type="button"
                      onClick={async () => {
                        const inputEl = document.getElementById('modalExternalUrlInput') as HTMLInputElement;
                        const urlVal = inputEl?.value?.trim();
                        if (!urlVal) return;
                        setUploading(true);
                        try {
                          const res = await fetch('/api/fetch-external-image', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ url: urlVal, folder: selectedFolder === 'all' ? 'gallery' : selectedFolder })
                          });
                          const data = await res.json();
                          if (data.success && data.url) {
                            onSelectSystemImage(data.url);
                            onClose();
                          } else {
                            alert(data.error || "Dış görsel yüklenemedi.");
                          }
                        } catch (e) {
                          alert("Bağlantı hatası.");
                        } finally {
                          setUploading(false);
                        }
                      }}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-1.5 shrink-0 cursor-pointer"
                    >
                      <span>Aktar & Seç</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-slate-100 p-4 border-t border-slate-200 flex items-center justify-between shrink-0">
            <span className="text-xs text-slate-500 font-medium">
              Toplam <strong className="text-slate-800">{mediaFiles.length}</strong> sistem görseli hazır.
            </span>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
            >
              Vazgeç
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

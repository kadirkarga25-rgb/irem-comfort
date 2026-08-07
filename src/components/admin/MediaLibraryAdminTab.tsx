import React, { useState, useEffect } from 'react';
import { 
  Upload, Trash2, Edit3, FolderPlus, Folder, FileImage, 
  Copy, Check, Eye, RefreshCw, Search, FolderOpen, ArrowUpRight, Sparkles,
  Video, Play, CheckCircle2
} from 'lucide-react';
import { MediaFile } from '../../types';
import { useAppImages } from '../../context/ImageContext';

export const MediaLibraryAdminTab: React.FC = () => {
  const { systemConfig, updateSystemConfig } = useAppImages();
  const [folders, setFolders] = useState<string[]>(['hero', 'products', 'logo', 'gallery', 'videos']);
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Modals & Action States
  const [previewFile, setPreviewFile] = useState<MediaFile | null>(null);
  const [copiedPath, setCopiedPath] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [showFolderModal, setShowFolderModal] = useState(false);
  
  const [renameFile, setRenameFile] = useState<MediaFile | null>(null);
  const [newFileNameInput, setNewFileNameInput] = useState('');

  const [uploadFolder, setUploadFolder] = useState('gallery');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number } | null>(null);
  const [externalUrlInput, setExternalUrlInput] = useState('');
  const [importingUrl, setImportingUrl] = useState(false);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/media');
      const data = await res.json();
      if (data.success) {
        setFolders(data.folders || ['hero', 'products', 'logo', 'gallery', 'videos']);
        setFiles(data.files || []);
      }
    } catch (err) {
      console.error("Failed fetching media list:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const showToast = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const isVideo = (f: { name: string; path: string; folder: string }) => {
    const p = (f.path || f.name).toLowerCase();
    return p.endsWith('.mp4') || p.endsWith('.webm') || f.folder === 'videos';
  };

  const handleSelectDeploymentVideo = (file: MediaFile) => {
    const videoUrl = file.path.startsWith('http') ? file.path : `/uploads/${file.folder}/${file.name}`;
    updateSystemConfig({
      deploymentVideo: videoUrl,
      enableDeploymentIntro: true
    });
    showToast('success', `🎯 "${file.name}" aktif yayınlama (deployment) videosu olarak kaydedildi!`);
  };

  const [uploadLogs, setUploadLogs] = useState<string[]>([]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    setUploading(true);
    setUploadLogs([]);
    let successCount = 0;
    const total = fileList.length;

    const githubRepo = localStorage.getItem('irem_github_repo') || undefined;
    const githubToken = localStorage.getItem('irem_github_token') || undefined;

    for (let i = 0; i < total; i++) {
      setUploadProgress({ current: i + 1, total });
      const file = fileList[i];
      const reader = new FileReader();

      await new Promise((resolve) => {
        reader.onload = async () => {
          const base64Str = reader.result as string;
          try {
            const res = await fetch('/api/media/upload', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                image: base64Str,
                folder: uploadFolder,
                filename: file.name,
                githubRepo,
                githubToken,
                triggerDeploy: false
              })
            });
            const data = await res.json();
            if (data.logs && Array.isArray(data.logs)) {
              setUploadLogs(prev => [...prev, ...data.logs]);
            }
            if (data.success) {
              successCount++;
            } else {
              showToast('error', data.error || 'Görsel GitHub\'a yüklenemedi!');
            }
          } catch (err: any) {
            console.error("Upload error for file:", file.name, err);
            showToast('error', `Yükleme Hatası: ${err?.message || 'Sunucu hatası'}`);
          }
          resolve(null);
        };
        reader.readAsDataURL(file);
      });
    }

    setUploading(false);
    setUploadProgress(null);
    if (successCount > 0) {
      showToast('success', `${successCount} / ${total} dosya GitHub deposuna (${uploadFolder}) başarıyla yüklendi ve doğrulandı.`);
    }
    fetchMedia();
  };

  const handleImportExternalUrl = async () => {
    if (!externalUrlInput.trim()) return;

    setImportingUrl(true);
    try {
      const res = await fetch('/api/fetch-external-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: externalUrlInput.trim(),
          folder: uploadFolder
        })
      });
      const data = await res.json();
      if (data.success && data.url) {
        showToast('success', 'Görsel dış kaynaktan başarıyla indirildi ve kütüphaneye eklendi.');
        setExternalUrlInput('');
        fetchMedia();
      } else {
        showToast('error', data.error || 'Dış görsel indirilemedi.');
      }
    } catch (err) {
      showToast('error', 'Sunucuya bağlanırken hata oluştu.');
    } finally {
      setImportingUrl(false);
    }
  };

  const handleDelete = async (filePath: string) => {
    if (!window.confirm("Bu görseli silmek istediğinizden emin misiniz?")) return;

    try {
      const res = await fetch('/api/media/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: filePath })
      });
      const data = await res.json();
      if (data.success) {
        showToast('success', 'Dosya silindi.');
        if (previewFile?.path === filePath) setPreviewFile(null);
        fetchMedia();
      } else {
        showToast('error', data.error || 'Dosya silinemedi.');
      }
    } catch (err) {
      showToast('error', 'Sunucu hatası.');
    }
  };

  const handleRename = async () => {
    if (!renameFile || !newFileNameInput.trim()) return;

    try {
      const res = await fetch('/api/media/rename', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPath: renameFile.path, newName: newFileNameInput.trim() })
      });
      const data = await res.json();
      if (data.success) {
        showToast('success', 'Dosya adı güncellendi.');
        setRenameFile(null);
        setNewFileNameInput('');
        fetchMedia();
      } else {
        showToast('error', data.error || 'Ad değiştirilemedi.');
      }
    } catch (err) {
      showToast('error', 'Sunucu hatası.');
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;

    try {
      const res = await fetch('/api/media/folder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folderName: newFolderName.trim() })
      });
      const data = await res.json();
      if (data.success) {
        showToast('success', `'${data.folder}' klasörü oluşturuldu.`);
        setNewFolderName('');
        setShowFolderModal(false);
        fetchMedia();
      } else {
        showToast('error', data.error || 'Klasör oluşturulamadı.');
      }
    } catch (err) {
      showToast('error', 'Sunucu hatası.');
    }
  };

  const copyToClipboard = (pathStr: string) => {
    navigator.clipboard.writeText(pathStr);
    setCopiedPath(pathStr);
    setTimeout(() => setCopiedPath(null), 2500);
  };

  const filteredFiles = files.filter(f => {
    const matchesFolder = selectedFolder === 'all' || f.folder === selectedFolder;
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) || f.path.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFolder && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Toast Banner */}
      {message && (
        <div className={`p-4 rounded-xl text-sm font-semibold flex items-center justify-between shadow-md ${
          message.type === 'success' ? 'bg-emerald-950/80 text-emerald-200 border border-emerald-800' : 'bg-red-950/80 text-red-200 border border-red-800'
        }`}>
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)} className="text-xs opacity-70 hover:opacity-100">Kapat</button>
        </div>
      )}

      {/* Top Header Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FileImage className="w-5 h-5 text-amber-400" />
            <span>Medya & Görsel Kütüphanesi</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Görseller doğrudan Git deposuna (<code className="text-amber-300 font-mono">public/uploads/</code>) kaydedilir.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowFolderModal(true)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition flex items-center gap-2 cursor-pointer"
          >
            <FolderPlus className="w-4 h-4 text-indigo-400" />
            <span>Klasör Ekle</span>
          </button>

          <label className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl shadow-lg transition flex items-center gap-2 cursor-pointer active:scale-95">
            <Upload className="w-4 h-4" />
            <span>
              {uploading && uploadProgress 
                ? `Yükleniyor (${uploadProgress.current}/${uploadProgress.total})...` 
                : uploading ? 'Yükleniyor...' : 'Yeni Medya / Video Yükle'}
            </span>
            <input 
              type="file" 
              multiple 
              accept="image/*,video/mp4,video/webm" 
              className="hidden" 
              onChange={handleFileUpload}
              disabled={uploading}
            />
          </label>

          <button
            onClick={fetchMedia}
            disabled={loading}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition cursor-pointer"
            title="Yenile"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Live Upload Logs Console */}
      {uploadLogs.length > 0 && (
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-xs space-y-1.5 shadow-2xl">
          <div className="text-amber-400 font-bold mb-2 flex items-center justify-between text-xs tracking-wide">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
              ⬆️ GitHub Yükleme Adımları (Canlı İşlem Logu)
            </span>
            <button 
              onClick={() => setUploadLogs([])} 
              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] cursor-pointer"
            >
              Temizle
            </button>
          </div>
          <div className="max-h-60 overflow-y-auto space-y-1 pr-2">
            {uploadLogs.map((log, idx) => (
              <div 
                key={idx} 
                className={
                  log.startsWith('✓') ? 'text-emerald-400 font-bold' : 
                  log.startsWith('❌') ? 'text-red-400 font-bold' : 
                  log.startsWith('🔗') ? 'text-cyan-400 font-bold' : 
                  log.startsWith('📁') ? 'text-amber-300 font-bold' :
                  log.startsWith('🚀') ? 'text-indigo-400 font-bold' :
                  'text-slate-300'
                }
              >
                {log}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Automatic Image Link Converter Banner */}
      <div className="bg-slate-900/90 p-4 rounded-2xl border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3 text-xs text-slate-300">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold text-amber-400 text-xs">🚀 Otomatik İnternet Bağlantısı Dönüştürücü Active</p>
            <p className="text-[11px] text-slate-400">Yüklediğiniz tüm fotoğraflar otomatik olarak GitHub sunucusunda kalıcı görsele dönüştürülür ve sitenizde kesintisiz yayınlanır.</p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <input 
            type="url"
            placeholder="İsteğe bağlı web / Google resmi bağlantısı yapıştırın"
            value={externalUrlInput}
            onChange={(e) => setExternalUrlInput(e.target.value)}
            className="flex-1 sm:w-64 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
          <button
            onClick={handleImportExternalUrl}
            disabled={importingUrl || !externalUrlInput.trim()}
            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 text-xs font-bold rounded-xl transition flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            {importingUrl ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
            <span>{importingUrl ? 'İndiriliyor...' : 'İndir & Bağlantı Yap'}</span>
          </button>
        </div>
      </div>

      {/* Search & Folder Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div className="md:col-span-2 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Görsel veya dosya adıyla ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Folder Select for Filter */}
        <div>
          <select
            value={selectedFolder}
            onChange={(e) => setSelectedFolder(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
          >
            <option value="all">Tüm Klasörler ({files.length})</option>
            {folders.map(f => (
              <option key={f} value={f}>📂 {f} ({files.filter(x => x.folder === f).length})</option>
            ))}
          </select>
        </div>

        {/* Upload Target Folder */}
        <div>
          <select
            value={uploadFolder}
            onChange={(e) => setUploadFolder(e.target.value)}
            className="w-full bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-xl px-3 py-2.5 text-xs font-medium focus:outline-none"
            title="Yüklenecek Hedef Klasör"
          >
            <option value="gallery" className="bg-slate-900 text-white">Yükleme Hedefi: gallery</option>
            {folders.map(f => (
              <option key={f} value={f} className="bg-slate-900 text-white">Yükleme Hedefi: {f}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Media Grid */}
      <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800/80 min-h-[300px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <RefreshCw className="w-8 h-8 animate-spin text-amber-400 mb-3" />
            <p className="text-xs">Medya dosyaları taranıyor...</p>
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="text-center py-16 text-slate-500 space-y-3">
            <FolderOpen className="w-12 h-12 mx-auto text-slate-600" />
            <p className="text-sm font-medium text-slate-400">Seçilen filtrelere uygun görsel bulunamadı.</p>
            <p className="text-xs">Yukarıdaki 'Yeni Görsel Yükle' butonu ile repository'ye dosya ekleyebilirsiniz.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredFiles.map((file) => (
              <div 
                key={file.id} 
                className="group relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-amber-500/50 transition-all shadow-md flex flex-col justify-between"
              >
                {/* Media Thumbnail or Video Player */}
                <div className="relative aspect-square bg-slate-950 overflow-hidden flex items-center justify-center p-2">
                  {isVideo(file) ? (
                    <div className="relative w-full h-full flex items-center justify-center bg-slate-950 rounded-lg overflow-hidden group/vid">
                      <video 
                        src={file.path.startsWith('http') ? file.path : `/uploads/${file.folder}/${file.name}`} 
                        className="w-full h-full object-cover rounded-lg opacity-80 group-hover/vid:opacity-100 transition"
                        muted
                        preload="metadata"
                      />
                      <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center group-hover/vid:bg-slate-950/20 transition">
                        <div className="w-10 h-10 rounded-full bg-amber-500/90 text-slate-950 flex items-center justify-center shadow-lg group-hover/vid:scale-110 transition">
                          <Play className="w-5 h-5 ml-0.5 fill-current" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <img 
                      src={file.path.startsWith('http') ? file.path : `/uploads/${file.folder}/${file.name}`} 
                      alt={file.name} 
                      className="max-h-full max-w-full object-contain rounded-lg group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (!target.src.includes('irem-comfort-logo')) {
                          target.src = '/uploads/logo/irem-comfort-logo.jpg';
                        }
                      }}
                    />
                  )}
                  
                  <div className="absolute top-2 left-2 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-slate-950/80 text-[10px] font-mono text-amber-400 border border-white/10 uppercase">
                      {file.folder}
                    </span>
                    {isVideo(file) && (
                      <span className="px-1.5 py-0.5 rounded-md bg-indigo-500/90 text-[10px] font-bold text-white flex items-center gap-1">
                        <Video className="w-2.5 h-2.5" /> Video
                      </span>
                    )}
                  </div>

                  {systemConfig.deploymentVideo === (file.path.startsWith('http') ? file.path : `/uploads/${file.folder}/${file.name}`) && (
                    <span className="absolute bottom-2 left-2 right-2 px-2 py-1 bg-amber-500 text-slate-950 font-bold text-[10px] rounded-md text-center shadow-md flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Yayınlama Videosu
                    </span>
                  )}
                </div>

                {/* File Details */}
                <div className="p-3 bg-slate-900 border-t border-slate-800/80 flex flex-col gap-1.5">
                  <p className="text-xs font-semibold text-slate-200 truncate" title={file.name}>
                    {file.name}
                  </p>
                  
                  <p className="text-[10px] font-mono text-slate-500 truncate">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>

                  {/* Quick Action Buttons */}
                  <div className="flex items-center justify-between pt-1 border-t border-slate-800">
                    <button
                      onClick={() => setPreviewFile(file)}
                      className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition"
                      title="Önizle"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>

                    {isVideo(file) && (
                      <button
                        onClick={() => handleSelectDeploymentVideo(file)}
                        className={`p-1.5 rounded-lg transition ${
                          systemConfig.deploymentVideo === (file.path.startsWith('http') ? file.path : `/uploads/${file.folder}/${file.name}`)
                            ? 'bg-amber-500 text-slate-950 font-bold'
                            : 'hover:bg-slate-800 text-amber-400 hover:text-amber-300'
                        }`}
                        title="Yayınlama Videosu Yap"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                      </button>
                    )}

                    <button
                      onClick={() => copyToClipboard(file.path)}
                      className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-amber-400 rounded-lg transition"
                      title="Yolu Kopyala"
                    >
                      {copiedPath === file.path ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      onClick={() => {
                        setRenameFile(file);
                        setNewFileNameInput(file.name);
                      }}
                      className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-indigo-400 rounded-lg transition"
                      title="Yeniden Adlandır"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleDelete(file.path)}
                      className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-red-400 rounded-lg transition"
                      title="Sil"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CREATE FOLDER MODAL */}
      {showFolderModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FolderPlus className="w-4 h-4 text-indigo-400" />
              <span>Yeni Klasör Oluştur</span>
            </h3>
            <p className="text-xs text-slate-400">
              Klasör adını Türkçe karakter veya boşluk bırakmadan yazınız (örn: <code className="text-amber-300">sandaletler</code>)
            </p>
            <input
              type="text"
              placeholder="Klasör Adı..."
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowFolderModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-xl"
              >
                İptal
              </button>
              <button
                onClick={handleCreateFolder}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl"
              >
                Oluştur
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RENAME MODAL */}
      {renameFile && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-amber-400" />
              <span>Dosyayı Yeniden Adlandır</span>
            </h3>
            <input
              type="text"
              value={newFileNameInput}
              onChange={(e) => setNewFileNameInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setRenameFile(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-xl"
              >
                İptal
              </button>
              <button
                onClick={handleRename}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl"
              >
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PREVIEW MODAL */}
      {previewFile && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl space-y-4 p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white truncate max-w-md">{previewFile.name}</h3>
              <button 
                onClick={() => setPreviewFile(null)}
                className="text-slate-400 hover:text-white text-xs font-bold p-1"
              >
                ✕ Kapat
              </button>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl flex items-center justify-center min-h-[250px] max-h-[400px]">
              {isVideo(previewFile) ? (
                <video 
                  src={previewFile.path.startsWith('http') ? previewFile.path : `/uploads/${previewFile.folder}/${previewFile.name}`} 
                  controls
                  autoPlay
                  className="max-h-[350px] w-full rounded-lg bg-black"
                />
              ) : (
                <img 
                  src={previewFile.path.startsWith('http') ? previewFile.path : `/uploads/${previewFile.folder}/${previewFile.name}`} 
                  alt={previewFile.name} 
                  className="max-h-[350px] object-contain rounded-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (!target.src.includes('irem-comfort-logo')) {
                      target.src = '/uploads/logo/irem-comfort-logo.jpg';
                    }
                  }}
                />
              )}
            </div>

            {isVideo(previewFile) && (
              <button
                onClick={() => handleSelectDeploymentVideo(previewFile)}
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-sans font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg transition"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>🎯 Bu Videoyu Aktif Yayınlama (Deployment) Videosu Yap</span>
              </button>
            )}

            <div className="space-y-3 text-xs font-mono bg-slate-950 p-4 rounded-xl border border-slate-800 text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-500">Klasör:</span>
                <span className="text-amber-400 font-bold">{previewFile.folder}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Boyut:</span>
                <span>{(previewFile.size / 1024).toFixed(1)} KB</span>
              </div>

              {/* Full HTTPS Internet URL */}
              <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-amber-400 font-sans font-bold flex items-center gap-1">
                    🌐 Tam İnternet Görsel Bağlantısı (URL):
                  </span>
                  <button
                    onClick={() => {
                      const repo = localStorage.getItem('irem_github_repo') || 'kadirkarga25-rgb/irem-comfort';
                      const rawUrl = previewFile.path.startsWith('http') ? previewFile.path : `https://raw.githubusercontent.com/${repo}/main/public${previewFile.path}`;
                      copyToClipboard(rawUrl);
                    }}
                    className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-sans font-bold rounded-lg text-[11px] flex items-center gap-1 cursor-pointer transition shadow-xs"
                  >
                    <Copy className="w-3 h-3" /> Tam Linki Kopyala
                  </button>
                </div>
                <div className="bg-slate-900 p-2 rounded-lg text-[11px] text-emerald-400 break-all select-all border border-slate-800">
                  {previewFile.path.startsWith('http') ? previewFile.path : `https://raw.githubusercontent.com/${localStorage.getItem('irem_github_repo') || 'kadirkarga25-rgb/irem-comfort'}/main/public${previewFile.path}`}
                </div>
              </div>

              {/* Short Relative Path */}
              <div className="flex flex-col gap-1 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-sans text-[11px]">📁 Site İçi Kısa Yol:</span>
                  <button
                    onClick={() => copyToClipboard(previewFile.path.startsWith('http') ? `/uploads/${previewFile.folder}/${previewFile.name}` : previewFile.path)}
                    className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-sans rounded text-[10px] flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" /> Kısa Yolu Kopyala
                  </button>
                </div>
                <div className="text-[11px] text-slate-400 select-all font-mono">
                  {previewFile.path.startsWith('http') ? `/uploads/${previewFile.folder}/${previewFile.name}` : previewFile.path}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

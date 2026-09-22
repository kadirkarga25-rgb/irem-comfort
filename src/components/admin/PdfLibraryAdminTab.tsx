import React, { useEffect, useRef, useState } from 'react';
import { FileText, Upload, Search, Trash2, ExternalLink, Copy, RefreshCw, CheckCircle2 } from 'lucide-react';
import { deletePdfFromLibrary, listPdfLibrary, PdfLibraryItem, uploadPdfToLibrary } from '../../catalog/pdfLibrary';

export const PdfLibraryAdminTab: React.FC = () => {
  const [files, setFiles] = useState<PdfLibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    try { setFiles(await listPdfLibrary()); }
    catch (e:any) { setMessage(e?.message || 'PDF kütüphanesi yüklenemedi.'); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const upload = async (file?: File) => {
    if (!file) return;
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setMessage('Sadece PDF dosyaları yüklenebilir.'); return;
    }
    setUploading(true); setMessage(null);
    try {
      const item = await uploadPdfToLibrary(file);
      setFiles(prev => [item, ...prev.filter(x => x.id !== item.id)]);
      setMessage(`✓ ${item.name} GitHub PDF Kütüphanesine yüklendi.`);
    } catch (e:any) {
      setMessage(e?.message || 'PDF yüklenemedi.');
    } finally { setUploading(false); if (inputRef.current) inputRef.current.value = ''; }
  };

  const remove = async (item: PdfLibraryItem) => {
    if (!window.confirm(`"${item.name}" PDF'sini GitHub Kütüphanesinden silmek istiyor musunuz?`)) return;
    try {
      await deletePdfFromLibrary(item.id);
      setFiles(prev => prev.filter(x => x.id !== item.id));
      setMessage(`✓ ${item.name} silindi.`);
    } catch (e:any) { setMessage(e?.message || 'PDF silinemedi.'); }
  };

  const copy = async (url:string) => {
    try { await navigator.clipboard.writeText(url); setMessage('✓ PDF bağlantısı kopyalandı.'); }
    catch { setMessage('Bağlantı kopyalanamadı.'); }
  };

  const filtered = files.filter(x => `${x.name} ${x.filename}`.toLowerCase().includes(search.toLowerCase()));

  return <div className="space-y-6">
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#082C6C]/10 text-[#082C6C] flex items-center justify-center"><FileText className="w-6 h-6"/></div>
            <div><h2 className="text-base font-bold text-slate-900">PDF Kütüphanesi</h2><p className="text-xs text-slate-500">PDF'ler GitHub'da ayrı bir dosya kütüphanesinde saklanır.</p></div>
          </div>
        </div>
        <div>
          <button onClick={()=>inputRef.current?.click()} disabled={uploading} className="px-5 py-3 rounded-xl bg-[#082C6C] text-white text-xs font-extrabold flex items-center gap-2 disabled:opacity-50">
            {uploading?<RefreshCw className="w-4 h-4 animate-spin"/>:<Upload className="w-4 h-4"/>}
            {uploading?'GitHub’a yükleniyor…':'PDF Yükle'}
          </button>
          <input ref={inputRef} hidden type="file" accept="application/pdf,.pdf" onChange={e=>upload(e.target.files?.[0])}/>
        </div>
      </div>
      <div className="mt-5 flex items-center gap-3">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="PDF ara…" className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm"/></div>
        <button onClick={load} className="p-2.5 rounded-xl border border-slate-200 text-slate-600"><RefreshCw className={`w-4 h-4 ${loading?'animate-spin':''}`}/></button>
      </div>
      {message && <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0"/>{message}</div>}
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {loading ? <div className="col-span-full p-8 text-center text-sm text-slate-500">PDF Kütüphanesi yükleniyor…</div> :
       filtered.length === 0 ? <div className="col-span-full p-8 text-center text-sm text-slate-500 bg-white rounded-2xl border border-slate-200">Henüz PDF bulunmuyor.</div> :
       filtered.map(item => <div key={item.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
         <div className="flex items-start gap-3">
           <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0"><FileText className="w-6 h-6"/></div>
           <div className="min-w-0"><h3 className="font-bold text-sm text-slate-900 truncate">{item.name}</h3><p className="text-[11px] text-slate-500 mt-1 truncate">{item.filename}</p><p className="text-[11px] text-slate-400 mt-1">{item.size ? `${(item.size/1024/1024).toFixed(2)} MB` : 'Boyut bilinmiyor'}</p></div>
         </div>
         <div className="mt-4 grid grid-cols-3 gap-2">
           <a href={item.rawUrl} target="_blank" rel="noreferrer" className="py-2 rounded-lg bg-slate-50 text-slate-700 text-[11px] font-bold flex items-center justify-center gap-1"><ExternalLink className="w-3.5 h-3.5"/> Aç</a>
           <button onClick={()=>copy(item.rawUrl)} className="py-2 rounded-lg bg-slate-50 text-slate-700 text-[11px] font-bold flex items-center justify-center gap-1"><Copy className="w-3.5 h-3.5"/> Link</button>
           <button onClick={()=>remove(item)} className="py-2 rounded-lg bg-rose-50 text-rose-700 text-[11px] font-bold flex items-center justify-center gap-1"><Trash2 className="w-3.5 h-3.5"/> Sil</button>
         </div>
       </div>)}
    </div>
  </div>;
};

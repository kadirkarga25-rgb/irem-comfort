'use client';
import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { readPdf, extractText, detectStructure } from '../../../../lib/pdf';
import { saveCatalog } from '../../../../lib/db';
import { Upload, FileSearch, CheckCircle2, FileText, X } from 'lucide-react';

export default function NewCatalog() {
  const router = useRouter();
  useEffect(() => { if (!sessionStorage.getItem('ic_catalog_admin_token')) router.replace('/admin/login'); }, [router]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [season, setSeason] = useState('Yeni Sezon');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [file, setFile] = useState<File>();
  const [cover, setCover] = useState<string>();
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);

  const selectPdf = (f?: File) => {
    if (!f) return;
    setError('');
    if (!f.name.toLowerCase().endsWith('.pdf') && f.type !== 'application/pdf') {
      setFile(undefined);
      setError('Lütfen .pdf uzantılı bir dosya seçin.');
      return;
    }
    if (f.size === 0) {
      setFile(undefined);
      setError('Seçtiğin PDF dosyası boş.');
      return;
    }
    setFile(f);
    setStatus('PDF seçildi. Analiz Et butonuna basarak yüklemeyi başlatabilirsin.');
  };

  const handleCover = (f?: File) => {
    if (!f) return;
    const r = new FileReader();
    r.onload = () => setCover(String(r.result));
    r.readAsDataURL(f);
  };

  const analyze = async () => {
    if (!file) {
      setError('Önce PDF katalog dosyasını seçmelisin.');
      inputRef.current?.click();
      return;
    }
    setBusy(true);
    setError('');
    setProgress(0);
    try {
      setStatus('PDF sayfaları okunuyor…');
      const r = await readPdf(file, (p) => setProgress(p));
      setStatus('Metin ve koleksiyonlar analiz ediliyor…');
      const extracted = await extractText(file);
      const structure = detectStructure(extracted.pageTexts, r.count);
      const id = `catalog-${Date.now()}`;

      try {
        const baseCatalog = {
          id, title: title || file.name.replace(/\.pdf$/i, ''), year, season,
          description: description || 'İrem Comfort dijital katalog.', cover,
          pageImages: r.pages, pageTexts: extracted.pageTexts, pages: r.count,
          collections: structure.collections, contents: structure.contents,
          tags: tags.split(',').map((x) => x.trim()).filter(Boolean), createdAt: Date.now(), published: false,
        };
        try {
          await saveCatalog({ ...baseCatalog, pdf: r.data });
        } catch (storageError) {
          const message = storageError instanceof Error ? storageError.message : '';
          if (!/quota|storage|transaction|large|disk/i.test(message)) throw storageError;
          // Büyük PDF'lerde tarayıcı kotasına takılmamak için PDF'nin kendisini ayrı tutmadan katalog sayfalarını kaydet.
          try {
            await saveCatalog(baseCatalog);
            setStatus('Katalog sayfaları kaydedildi. PDF dosyası tarayıcı kotası nedeniyle indirme için saklanamadı.');
          } catch (secondError) {
            if (!/quota|storage|transaction|large|disk/i.test(secondError instanceof Error ? secondError.message : '')) throw secondError;
            await saveCatalog({ ...baseCatalog, pageImages: undefined });
            setStatus('Katalog ve analiz bilgileri kaydedildi. Sayfalar PDF üzerinden okuyucuda gerektiğinde oluşturulacak.');
          }
        }
      } catch (saveError) {
        const message = saveError instanceof Error ? saveError.message : '';
        if (/quota|storage|transaction|large|disk/i.test(message)) {
          throw new Error('Tarama tamamlandı ancak tarayıcı depolama alanı katalog için yetersiz kaldı. Daha küçük bir PDF deneyebilir veya tarayıcıdaki eski katalogları temizleyebilirsin.');
        }
        throw saveError;
      }

      setProgress(100);
      setStatus(`Analiz tamamlandı: ${r.count} sayfa, ${structure.collections.length} koleksiyon adayı. Kontrol ekranına geçiliyor…`);
      setTimeout(() => router.push(`/admin/catalogs/${id}`), 450);
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : 'PDF analizinde beklenmeyen bir hata oluştu.');
      setStatus('Katalog oluşturulamadı.');
    } finally {
      setBusy(false);
    }
  };

  return <main className="admin-wrap"><div className="container"><div className="admin-layout"><aside className="admin-side"><div className="admin-side-title">KATALOG YÖNETİMİ</div><a href="/admin">Genel Bakış</a><a href="/admin/catalogs/new">+ Katalog Ekle</a></aside><section><div className="panel"><div className="eyebrow">YENİ KATALOG</div><h1 className="serif" style={{fontSize:46,margin:'8px 0 26px'}}>Katalog Ekle</h1><div className="form-grid"><div className="field"><label>Katalog adı</label><input value={title} onChange={e=>setTitle(e.target.value)} placeholder="2026 / 2027 Yeni Sezon"/></div><div className="field"><label>Yıl</label><input value={year} onChange={e=>setYear(e.target.value)}/></div><div className="field"><label>Sezon</label><input value={season} onChange={e=>setSeason(e.target.value)}/></div><div className="field"><label>Etiketler</label><input value={tags} onChange={e=>setTags(e.target.value)} placeholder="Kadın, Comfort, Sabo"/></div><div className="field"><label>Kapak görseli</label><input type="file" accept="image/*" onChange={e=>handleCover(e.target.files?.[0])}/></div><div className="field full"><label>Açıklama</label><textarea rows={4} value={description} onChange={e=>setDescription(e.target.value)} placeholder="Katalog hakkında kısa açıklama…"/></div><div className="field full"><label>PDF katalog</label><div className={`dropzone ${dragging ? 'is-dragging' : ''} ${file ? 'has-file' : ''}`} onDragOver={e=>{e.preventDefault();setDragging(true)}} onDragLeave={()=>setDragging(false)} onDrop={e=>{e.preventDefault();setDragging(false);selectPdf(e.dataTransfer.files?.[0])}} onClick={()=>!busy&&inputRef.current?.click()} role="button" tabIndex={0} onKeyDown={e=>{if(e.key==='Enter'||e.key===' ')inputRef.current?.click()}}><input ref={inputRef} hidden type="file" accept="application/pdf,.pdf" onChange={e=>selectPdf(e.target.files?.[0])}/>{file ? <><FileText size={28}/><strong>{file.name}</strong><span>{(file.size/1024/1024).toFixed(1)} MB · PDF hazır</span><button type="button" className="dropzone-clear" onClick={e=>{e.stopPropagation();setFile(undefined);setStatus('PDF seçimi kaldırıldı.')}} title="PDF seçimini kaldır"><X size={16}/></button></> : <><Upload size={28}/><strong>PDF dosyanı seç</strong><span>Buraya sürükle veya tıklayarak seç.</span></>}</div></div></div>{busy&&<div style={{marginTop:18}}><div className="status">Analiz ilerlemesi: %{progress}</div><div style={{height:7,background:'#e8edf1',borderRadius:99,marginTop:8,overflow:'hidden'}}><div style={{height:'100%',width:`${progress}%`,background:'#071A2B',transition:'width .15s'}}/></div></div>}{status&&<div className="status" style={{marginTop:18}}>{status}</div>}{error&&<div className="status error" style={{marginTop:12}}>{error}</div>}<div style={{display:'flex',gap:10,marginTop:22}}><button className="btn btn-primary" onClick={analyze} disabled={busy}><FileSearch size={18}/>{busy?'Analiz ediliyor…':'PDF Yükle ve Analiz Et'}</button><button className="btn btn-secondary" onClick={()=>router.push('/admin')}>İptal</button></div><div className="notice" style={{marginTop:22}}><CheckCircle2 size={15} style={{verticalAlign:'middle',marginRight:6}}/>PDF taranır, sayfalar oluşturulur ve katalog önce taslak olarak kaydedilir. Taranan koleksiyonları kontrol edip düzenledikten sonra yayınlarsın.</div></div></section></div></div></main>;
}

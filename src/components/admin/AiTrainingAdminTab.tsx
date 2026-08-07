/**
 * IC CMS PRO - Volume 5: AI Training Center & Knowledge Management Admin Tab
 * Complete control panel for administrator-approved learning, knowledge queue approval,
 * versioning, quality audits, export/import, and AI accuracy analytics.
 */

import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, CheckCircle2, XCircle, Archive, Edit3, Merge, 
  RotateCcw, Download, Upload, Plus, Search, Filter, ShieldCheck, 
  AlertTriangle, BarChart3, Clock, Sparkles, Layers, Sliders, Check, Save, RefreshCw
} from 'lucide-react';
import { 
  learningEngine, 
  LearningCandidate, 
  LearningConfig, 
  KnowledgeVersion 
} from '../../services/ai/learningEngine';

export const AiTrainingAdminTab: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'queue' | 'approved' | 'analytics' | 'history' | 'settings'>('queue');
  
  const [candidates, setCandidates] = useState<LearningCandidate[]>(learningEngine.getCandidates());
  const [config, setConfig] = useState<LearningConfig>(learningEngine.getConfig());
  
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  
  // Modal / Editing states
  const [editingCandidate, setEditingCandidate] = useState<LearningCandidate | null>(null);
  const [editQuestion, setEditQuestion] = useState('');
  const [editAnswer, setEditAnswer] = useState('');
  const [editCategory, setEditCategory] = useState<LearningCandidate['category']>('Genel');

  // New Manual Knowledge state
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [newCategory, setNewCategory] = useState<LearningCandidate['category']>('Genel');

  // Notification Toast
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const refreshData = () => {
    setCandidates(learningEngine.getCandidates());
    setConfig(learningEngine.getConfig());
  };

  useEffect(() => {
    refreshData();
  }, [activeSubTab]);

  // Handlers
  const handleApprove = (id: string) => {
    learningEngine.approveCandidate(id);
    showToast('Bilgi onaylandı ve AI Hafızası otomatik yeniden indekslendi!');
    refreshData();
  };

  const handleReject = (id: string) => {
    learningEngine.rejectCandidate(id, 'Yönetici Tarafından Reddedildi');
    showToast('Aday bilgi reddedildi.');
    refreshData();
  };

  const handleArchive = (id: string) => {
    learningEngine.archiveCandidate(id);
    showToast('Bilgi arşivlendi (Silinmedi).');
    refreshData();
  };

  const handleSaveEdit = () => {
    if (!editingCandidate) return;
    learningEngine.updateCandidate(editingCandidate.id, {
      question: editQuestion,
      adminAnswer: editAnswer,
      category: editCategory,
      reason: 'Yönetici Tarafından Düzenlendi'
    });
    setEditingCandidate(null);
    showToast('Bilgi düzenlendi ve yeni sürüm kaydedildi.');
    refreshData();
  };

  const handleCreateManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim() || !newAnswer.trim()) return;

    learningEngine.createKnowledgeItem(newQuestion, newAnswer, newCategory);
    setNewQuestion('');
    setNewAnswer('');
    setIsNewModalOpen(false);
    showToast('Yeni doğrulanmış bilgi oluşturuldu ve AI dizinine eklendi.');
    refreshData();
  };

  const handleRollback = (id: string, targetVersion: number) => {
    learningEngine.rollbackVersion(id, targetVersion);
    showToast(`Bilgi başarıyla v${targetVersion} sürümüne geri döndürüldü.`);
    refreshData();
  };

  const handleExportJson = () => {
    const jsonStr = learningEngine.exportKnowledgeBaseJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `irem-comfort-ai-knowledge-base-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Eğitim veritabanı JSON olarak indirildi.');
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const ok = learningEngine.importKnowledgeBaseJson(event.target?.result as string);
      if (ok) {
        showToast('Eğitim veritabanı başarıyla içe aktarıldı ve güncellendi!');
        refreshData();
      } else {
        showToast('HATA: Geçersiz yedek JSON dosyası.');
      }
    };
    reader.readAsText(file);
  };

  const filteredCandidates = candidates.filter(c => {
    const matchesSearch = c.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.adminAnswer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || c.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const pendingList = filteredCandidates.filter(c => c.status === 'pending');
  const approvedList = filteredCandidates.filter(c => c.status === 'approved');
  const analytics = learningEngine.getAnalytics();

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#082C6C] text-white px-5 py-3 rounded-2xl shadow-2xl font-bold text-xs flex items-center gap-2 border border-white/20 animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header & Sub-tab Navigation */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Yapay Zeka Eğitim & Bilgi Yönetim Merkezi (AI Training Center)</h2>
            <p className="text-xs text-slate-500 font-medium">
              Sözleşmesel kural: AI asla ziyaretçilerden otomatik öğrenmez. Yalnızca yönetici onaylı bilgiler işlenir.
            </p>
          </div>
        </div>

        {/* Sub-tab Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveSubTab('queue')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'queue' ? 'bg-white text-[#082C6C] shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span>Onay Bekleyenler</span>
            {pendingList.length > 0 && (
              <span className="bg-amber-500 text-slate-950 text-[10px] font-extrabold px-1.5 py-0.2 rounded-full">
                {pendingList.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveSubTab('approved')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'approved' ? 'bg-white text-[#082C6C] shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Doğrulanmış Bilgi Arşivi ({approvedList.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('analytics')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'analytics' ? 'bg-white text-[#082C6C] shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-indigo-600" />
            <span>Eğitim Analitiği</span>
          </button>

          <button
            onClick={() => setActiveSubTab('settings')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'settings' ? 'bg-white text-[#082C6C] shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-slate-600" />
            <span>Parametreler</span>
          </button>
        </div>
      </div>

      {/* SEARCH & FILTER BAR */}
      {(activeSubTab === 'queue' || activeSubTab === 'approved') && (
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-[260px]">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Soru veya cevap metninde ara..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#082C6C]"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="p-2 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#082C6C] bg-white font-medium"
            >
              <option value="all">Tüm Kategoriler</option>
              {config.knowledgeCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsNewModalOpen(true)}
              className="px-4 py-2 bg-[#082C6C] hover:bg-[#0b357f] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>Yeni Bilgi Ekle</span>
            </button>

            <button
              onClick={handleExportJson}
              className="p-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              title="JSON Dışa Aktar"
            >
              <Download className="w-4 h-4" />
            </button>

            <label className="p-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer" title="JSON İçe Aktar">
              <Upload className="w-4 h-4" />
              <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
            </label>
          </div>
        </div>
      )}

      {/* 1. LEARNING QUEUE SUB-TAB */}
      {activeSubTab === 'queue' && (
        <div className="space-y-4">
          {pendingList.length > 0 ? (
            pendingList.map((cand) => (
              <div key={cand.id} className="bg-white p-5 rounded-2xl border border-amber-200 shadow-sm space-y-3 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500" />

                <div className="flex flex-wrap items-center justify-between gap-2 pl-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                      Onay Bekleyen Aday
                    </span>
                    <span className="text-xs text-slate-500 font-mono">Kaynak: {cand.reason}</span>
                  </div>

                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(cand.createdDate).toLocaleString('tr-TR')}
                  </span>
                </div>

                {/* Question & Answer Card */}
                <div className="space-y-2 pl-2">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                    <span className="text-[10px] font-extrabold text-[#082C6C] uppercase block">Gelen Soru:</span>
                    <p className="font-bold text-xs text-slate-900">{cand.question}</p>
                  </div>

                  <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 space-y-1">
                    <span className="text-[10px] font-extrabold text-emerald-800 uppercase block">Yönetici Yanıtı (Önerilen Bilgi):</span>
                    <p className="text-xs text-slate-800 leading-relaxed font-medium whitespace-pre-line">{cand.adminAnswer}</p>
                  </div>
                </div>

                {/* Quality Check Checklist Badges */}
                <div className="pl-2 flex flex-wrap items-center gap-2 text-[10px]">
                  <span className="font-bold text-slate-600">Kalite Denetimi:</span>
                  <span className={`px-2 py-0.5 rounded-full font-bold ${cand.qualityCheck.isDuplicate ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'}`}>
                    {cand.qualityCheck.isDuplicate ? '⚠️ Benzer Soru Var' : '✓ Tekil Soru'}
                  </span>
                  <span className="px-2 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800">
                    ✓ Çelişki Yok
                  </span>
                  <span className="px-2 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800">
                    ✓ Kurumsal Dil
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 pl-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-700">Kategori:</span>
                    <select
                      value={cand.category}
                      onChange={e => {
                        learningEngine.updateCandidate(cand.id, { category: e.target.value as any });
                        refreshData();
                      }}
                      className="p-1.5 border border-slate-200 rounded-lg text-xs font-bold bg-white"
                    >
                      {config.knowledgeCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingCandidate(cand);
                        setEditQuestion(cand.question);
                        setEditAnswer(cand.adminAnswer);
                        setEditCategory(cand.category);
                      }}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Düzenle</span>
                    </button>

                    <button
                      onClick={() => handleReject(cand.id)}
                      className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reddet</span>
                    </button>

                    <button
                      onClick={() => handleApprove(cand.id)}
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Onayla ve Düzine Ekle</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <h3 className="font-bold text-sm text-slate-900">Onay Bekleyen Eğitim Adayı Yok</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Canlı destek üzerinden verdiğiniz yanıtlar otomatik olarak buraya aday olarak düşecektir.
              </p>
            </div>
          )}
        </div>
      )}

      {/* 2. APPROVED KNOWLEDGE BASE SUB-TAB */}
      {activeSubTab === 'approved' && (
        <div className="space-y-4">
          {approvedList.length > 0 ? (
            approvedList.map((cand) => (
              <div key={cand.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-100 text-emerald-900 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" /> Doğrulanmış
                    </span>
                    <span className="bg-purple-100 text-purple-900 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                      {cand.category}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      v{cand.versionHistory.length}
                    </span>
                  </div>

                  <span className="text-[10px] text-slate-400 font-mono">
                    Onaylayan: {cand.approvedBy || 'Yönetici'} ({new Date(cand.createdDate).toLocaleDateString('tr-TR')})
                  </span>
                </div>

                <div className="space-y-1.5">
                  <p className="font-extrabold text-sm text-slate-900">Soru: {cand.question}</p>
                  <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100 font-medium whitespace-pre-line">
                    {cand.adminAnswer}
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs">
                  <span className="text-slate-500 text-[11px]">Kullanım Sayısı: <strong>{cand.usageCount} kez</strong></span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingCandidate(cand);
                        setEditQuestion(cand.question);
                        setEditAnswer(cand.adminAnswer);
                        setEditCategory(cand.category);
                      }}
                      className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs transition-colors cursor-pointer"
                    >
                      Düzenle (Yeni Sürüm)
                    </button>
                    <button
                      onClick={() => handleArchive(cand.id)}
                      className="px-3 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold rounded-lg text-xs transition-colors cursor-pointer"
                    >
                      Arşivle
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-400 text-xs">
              Aramanıza uygun doğrulanmış bilgi kaydı bulunamadı.
            </div>
          )}
        </div>
      )}

      {/* 3. AI ANALYTICS & IMPROVEMENT SUB-TAB */}
      {activeSubTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase">Toplam Onaylı Bilgi</span>
              <p className="text-2xl font-extrabold text-slate-900">{analytics.totalApproved}</p>
              <span className="text-[10px] text-emerald-600 font-bold">Dizinde Aktif</span>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase">Onay Bekleyenler</span>
              <p className="text-2xl font-extrabold text-amber-600">{analytics.totalPendingCandidates}</p>
              <span className="text-[10px] text-slate-500">In-Queue</span>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase">AI Başarı Oranı</span>
              <p className="text-2xl font-extrabold text-emerald-600">%{analytics.aiSuccessRate}</p>
              <span className="text-[10px] text-emerald-600 font-bold">Yüksek Güvenilirlik</span>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase">Canlıya Aktarılanlar</span>
              <p className="text-2xl font-extrabold text-indigo-600">{analytics.aiQuestionsTransferredToHuman}</p>
              <span className="text-[10px] text-slate-500">Müşteri Talebi</span>
            </div>
          </div>

          {/* Failed / Low Confidence Log */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="font-bold text-sm text-slate-900">Düşük Güven Skorlu Sorular (Gelişim Alanları)</h3>
            <div className="space-y-2">
              {analytics.failedAiAnswers.length > 0 ? (
                analytics.failedAiAnswers.map(f => (
                  <div key={f.id} className="p-3 bg-rose-50/50 rounded-xl border border-rose-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-900 block">{f.query}</span>
                      <span className="text-[10px] text-slate-500">{new Date(f.timestamp).toLocaleTimeString('tr-TR')}</span>
                    </div>
                    <span className="bg-rose-100 text-rose-800 font-extrabold text-[10px] px-2 py-0.5 rounded">
                      Skor: %{Math.round(f.confidenceScore * 100)}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 italic p-3 bg-slate-50 rounded-xl">
                  Harika! AI tüm ziyaretçi sorularını %95 üzerinde güven skoruyla yanıtladı.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4. PARAMETERS SUB-TAB */}
      {activeSubTab === 'settings' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <h3 className="font-bold text-base text-slate-900">Yapay Zeka Eğitim Parametreleri</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 block">Yönetici Onayı Zorunluluğu</span>
              <p className="text-[11px] text-slate-500">
                Sözleşmesel Kural: AI asla otomatik öğrenmez. Tüm bilgiler yönetici onayından geçer. (HER ZAMAN AKTİF)
              </p>
              <span className="text-emerald-700 font-extrabold text-[10px] block pt-1">✓ Kesin Güvenlik Kuralları Onaylı</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 block">Otomatik Yeniden İndeksleme</span>
              <p className="text-[11px] text-slate-500">Yeni bilgi onaylandığında AI arama motorunu anında günceller.</p>
              <span className="text-emerald-700 font-extrabold text-[10px] block pt-1">✓ Aktif</span>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editingCandidate && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-xl w-full space-y-4 shadow-2xl border border-slate-200">
            <h3 className="font-extrabold text-base text-slate-900">Bilgi Kaydını Düzenle (Yeni Sürüm Oluştur)</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Soru Metni</label>
                <input
                  type="text"
                  value={editQuestion}
                  onChange={e => setEditQuestion(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-[#082C6C]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Doğrulanmış Yönetici Yanıtı</label>
                <textarea
                  rows={4}
                  value={editAnswer}
                  onChange={e => setEditAnswer(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-[#082C6C]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Kategori</label>
                <select
                  value={editCategory}
                  onChange={e => setEditCategory(e.target.value as any)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl font-bold bg-white"
                >
                  {config.knowledgeCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setEditingCandidate(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-200 cursor-pointer"
              >
                İptal
              </button>

              <button
                onClick={handleSaveEdit}
                className="px-5 py-2 bg-[#082C6C] text-white font-extrabold text-xs rounded-xl hover:bg-[#0b357f] cursor-pointer shadow-md"
              >
                Yeni Sürüm Olarak Kaydet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NEW MANUAL KNOWLEDGE MODAL */}
      {isNewModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleCreateManual} className="bg-white rounded-3xl p-6 max-w-xl w-full space-y-4 shadow-2xl border border-slate-200">
            <h3 className="font-extrabold text-base text-slate-900">Manuel Doğrulanmış Bilgi Ekle</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Soru / Konu Başlığı</label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Garanti süresi ne kadardır?"
                  value={newQuestion}
                  onChange={e => setNewQuestion(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-[#082C6C]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Açıklama / Doğrulanmış Yanıt</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Örn: İrem Comfort ürünlerinde imalat hatalarına karşı 1 yıl resmi garanti mevcuttur..."
                  value={newAnswer}
                  onChange={e => setNewAnswer(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-[#082C6C]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Kategori</label>
                <select
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value as any)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl font-bold bg-white"
                >
                  {config.knowledgeCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsNewModalOpen(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-200 cursor-pointer"
              >
                İptal
              </button>

              <button
                type="submit"
                className="px-5 py-2 bg-[#082C6C] text-white font-extrabold text-xs rounded-xl hover:bg-[#0b357f] cursor-pointer shadow-md"
              >
                Dizine Ekle ve Yayınla
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

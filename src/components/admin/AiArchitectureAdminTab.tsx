import React, { useState } from 'react';
import { aiService, DEFAULT_AI_CONFIG } from '../../services/ai/aiService';
import { AIServiceConfig } from '../../services/ai/aiTypes';
import { knowledgeEngine, KnowledgeEngineAnswer, IndexedDocument } from '../../services/ai/knowledgeEngine';
import { 
  Sparkles, Bot, BrainCircuit, Database, Cpu, 
  CheckCircle2, Sliders, ShieldCheck, HelpCircle, FileText,
  Search, RefreshCw, MessageSquare, AlertTriangle, Layers, Tag
} from 'lucide-react';

export const AiArchitectureAdminTab: React.FC = () => {
  const [aiConfig, setAiConfig] = useState<AIServiceConfig>(() => aiService.getConfig());
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Knowledge Engine Live Testing State
  const [testQuery, setTestQuery] = useState('Toptan siparişlerde seri adedi kaçtır?');
  const [testResult, setTestResult] = useState<KnowledgeEngineAnswer | null>(null);
  const [indexedDocs, setIndexedDocs] = useState<IndexedDocument[]>(() => knowledgeEngine.getAllIndexedDocs());
  const [indexCount, setIndexCount] = useState<number>(() => knowledgeEngine.getIndexedCount());
  const [lastIndexedTime, setLastIndexedTime] = useState<string>(() => knowledgeEngine.getLastIndexTimestamp());

  // Filter state for Indexed Docs Browser
  const [docFilterCategory, setDocFilterCategory] = useState<string>('all');
  const [docSearchTerm, setDocSearchTerm] = useState('');

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    aiService.updateConfig(aiConfig);
    setSaveMessage('AI altyapı mimari parametreleri başarıyla güncellendi!');
    setTimeout(() => setSaveMessage(null), 3000);
  };

  const handleRunTestQuery = () => {
    if (!testQuery.trim()) return;
    const result = knowledgeEngine.queryKnowledgeBase(testQuery);
    setTestResult(result);
  };

  const handleTriggerReindex = () => {
    const count = knowledgeEngine.reindexAll();
    setIndexCount(count);
    setIndexedDocs(knowledgeEngine.getAllIndexedDocs());
    setLastIndexedTime(knowledgeEngine.getLastIndexTimestamp());
    setSaveMessage(`Tüm site verileri taranarak ${count} bilgi dokümanı başarıyla güncellendi.`);
    setTimeout(() => setSaveMessage(null), 3000);
  };

  const filteredDocs = indexedDocs.filter(doc => {
    const matchesCategory = docFilterCategory === 'all' || doc.category === docFilterCategory;
    const matchesSearch = doc.title.toLowerCase().includes(docSearchTerm.toLowerCase()) ||
                          doc.content.toLowerCase().includes(docSearchTerm.toLowerCase()) ||
                          doc.keywords.some(k => k.toLowerCase().includes(docSearchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-[#082C6C] rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-purple-400/20 text-purple-300 text-xs font-extrabold px-3 py-1 rounded-full border border-purple-300/30 uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Volume 2A: AI Knowledge Engine Active</span>
          </div>
          <h2 className="text-2xl font-bold font-serif-luxury">
            Yapay Zeka Bilgi İşleme (Knowledge Engine) Portalı
          </h2>
          <p className="text-xs text-purple-100 max-w-2xl font-light leading-relaxed">
            Sitenin tüm ürün, SSS, kargo, toptan ve zanaat içeriklerini otomatik tarayan, anlamsal eşleştirme ile sıfır-halüsinasyon yanıt üreten ve güven puanlayan arama ve bilgi yanıt motoru.
          </p>
        </div>

        <button
          onClick={handleTriggerReindex}
          className="px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl text-xs font-bold flex items-center gap-2 backdrop-blur transition-all cursor-pointer"
        >
          <RefreshCw className="w-4 h-4 text-purple-300" />
          <span>Şimdi Yeniden Endeksle ({indexCount} Öğe)</span>
        </button>
      </div>

      {/* AI Readiness & Knowledge Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-purple-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-purple-700">
            <span className="text-xs font-bold uppercase">Endekslenmiş Dokümanlar</span>
            <BrainCircuit className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{indexCount} Doküman</p>
          <p className="text-[11px] text-slate-500">Ürünler, SSS, kargo ve atölye verileri endeksli.</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-indigo-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-indigo-700">
            <span className="text-xs font-bold uppercase">Arama Algoritması</span>
            <Cpu className="w-5 h-5 text-indigo-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">N-Gram + TF-IDF</p>
          <p className="text-[11px] text-slate-500">Yerel Niyet Eşleştirici (Local Intent Matcher)</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-emerald-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-emerald-700">
            <span className="text-xs font-bold uppercase">Halüsinasyon Önleyici</span>
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">%100 Doğrulanmış</p>
          <p className="text-[11px] text-slate-500">Yanıtlar sadece sitedeki gerçek veriden üretilir.</p>
        </div>
      </div>

      {/* Interactive Knowledge Engine Tester */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <Bot className="w-4 h-4 text-purple-700" />
            <span>Knowledge Engine Canlı Yanıt ve Güven Test Laboratuvarı</span>
          </h3>
          <span className="text-xs text-slate-400 font-medium">Anlık Semantik Test</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              value={testQuery}
              onChange={(e) => setTestQuery(e.target.value)}
              placeholder="Örn: Toptan siparişlerde seri adedi nedir? / Taraklı ayak terlikler..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-purple-700"
            />
          </div>
          <button
            onClick={handleRunTestQuery}
            className="px-5 py-2.5 bg-purple-900 hover:bg-purple-800 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span>Yanıt Oluştur</span>
          </button>
        </div>

        {/* Quick Test Chips */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-semibold">Örnek Sorgular:</span>
          {[
            'Teslimat ve kargo süresi nedir?',
            'Taraklı ayaklar için terlik modelleri',
            'Siyah renk ortopedik sabo',
            'Manisa atölyesi adres ve telefon',
            'Fuar katılım bilgileri'
          ].map((sample, idx) => (
            <button
              key={idx}
              onClick={() => { setTestQuery(sample); const res = knowledgeEngine.queryKnowledgeBase(sample); setTestResult(res); }}
              className="px-2.5 py-1 bg-purple-50 text-purple-800 rounded-lg hover:bg-purple-100 font-medium transition-colors cursor-pointer"
            >
              {sample}
            </button>
          ))}
        </div>

        {/* Test Result Display */}
        {testResult && (
          <div className="mt-4 p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/60 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-600">Güven Puanı (Confidence Score):</span>
                <span className={`text-xs font-black px-3 py-1 rounded-full uppercase flex items-center gap-1 ${
                  testResult.confidenceLevel === 'High' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                  testResult.confidenceLevel === 'Medium' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                  'bg-rose-100 text-rose-800 border border-rose-300'
                }`}>
                  {testResult.confidenceLevel === 'High' && <CheckCircle2 className="w-3.5 h-3.5" />}
                  {testResult.confidenceLevel === 'Medium' && <HelpCircle className="w-3.5 h-3.5" />}
                  {testResult.confidenceLevel === 'Low' && <AlertTriangle className="w-3.5 h-3.5" />}
                  <span>{testResult.confidenceLevel} (%{Math.round(testResult.confidenceScore * 100)})</span>
                </span>
              </div>

              {testResult.suggestHumanHandoff && (
                <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                  ⚠️ WhatsApp Canlı Destek Önerildi
                </span>
              )}
            </div>

            {/* Generated Natural Answer */}
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Sentezlenen Doğal Yanıt (Zero Hallucination Response)
              </span>
              <div className="p-4 bg-white rounded-xl border border-slate-200 text-xs font-medium text-slate-800 leading-relaxed whitespace-pre-line shadow-inner">
                {testResult.answer}
              </div>
            </div>

            {/* Referenced Docs */}
            {testResult.relevantDocs.length > 0 && (
              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Eşleşen Bilgi Dokümanları ({testResult.relevantDocs.length})
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {testResult.relevantDocs.map(doc => (
                    <div key={doc.id} className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1">
                      <div className="flex items-center justify-between text-slate-500">
                        <span className="font-bold text-[#082C6C]">{doc.title}</span>
                        <span className="bg-slate-100 text-[10px] px-2 py-0.5 rounded font-mono">{doc.category}</span>
                      </div>
                      <p className="text-slate-600 line-clamp-2">{doc.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Indexed Documents Explorer */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#082C6C]" />
            <span>Endekslenmiş Bilgi Arşivi Tarayıcısı ({filteredDocs.length} Doküman)</span>
          </h3>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {[
              { id: 'all', label: 'Tümü' },
              { id: 'product', label: 'Ürünler' },
              { id: 'faq', label: 'SSS' },
              { id: 'brand_craft', label: 'Zanaat & Marka' },
              { id: 'contact_shipping', label: 'Kargo & İletişim' },
              { id: 'policy_legal', label: 'Politikalar' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setDocFilterCategory(tab.id)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                  docFilterCategory === tab.id
                    ? 'bg-[#082C6C] text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search input in explorer */}
        <input
          type="text"
          value={docSearchTerm}
          onChange={(e) => setDocSearchTerm(e.target.value)}
          placeholder="Endekslenmiş dokümanlarda ara..."
          className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#082C6C]"
        />

        {/* Docs List */}
        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
          {filteredDocs.map(doc => (
            <div key={doc.id} className="p-3.5 bg-slate-50/70 hover:bg-slate-50 rounded-xl border border-slate-200/80 text-xs space-y-1.5 transition-colors">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 flex items-center gap-2">
                  <span>{doc.title}</span>
                  <span className="text-[10px] font-mono text-slate-400">[{doc.id}]</span>
                </span>
                <span className="bg-purple-100 text-purple-800 font-extrabold text-[10px] px-2 py-0.5 rounded-md uppercase">
                  {doc.category}
                </span>
              </div>
              <p className="text-slate-600 leading-relaxed">{doc.content}</p>
              <div className="flex flex-wrap gap-1 pt-1">
                {(doc.keywords || []).slice(0, 6).map((kw, idx) => (
                  <span key={idx} className="bg-white border border-slate-200 text-slate-500 text-[10px] px-2 py-0.5 rounded">
                    #{kw}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

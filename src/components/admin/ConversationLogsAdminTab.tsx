/**
 * IC CMS PRO - Volume 6.1: Conversation History & AI Quality Review Admin Tab
 * Displays statistics, conversation transcripts, AI response review tool,
 * search/filter controls, export functionality, and live human operator takeover.
 */

import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, Search, Filter, Download, Star, CheckCircle, 
  AlertTriangle, XCircle, RefreshCw, Headset, User, Clock, 
  Send, Archive, Trash2, Shield, Award, Sparkles, BarChart2
} from 'lucide-react';
import { conversationLogger, ConversationLogSession, ReviewRating } from '../../services/ai/conversationLogger';
import { crmService } from '../../services/crmService';

export const ConversationLogsAdminTab: React.FC = () => {
  const [sessions, setSessions] = useState<ConversationLogSession[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [stats, setStats] = useState(conversationLogger.getDashboardStatistics());

  // Admin reply input when taking over
  const [adminReplyText, setAdminReplyText] = useState('');
  const [reviewNote, setReviewNote] = useState('');

  const reloadData = () => {
    const list = conversationLogger.getAllSessions({ status: statusFilter, searchKey: searchQuery });
    setSessions(list);
    setStats(conversationLogger.getDashboardStatistics());
    if (list.length > 0 && !selectedSessionId) {
      setSelectedSessionId(list[0].sessionId);
    }
  };

  useEffect(() => {
    reloadData();
  }, [statusFilter, searchQuery]);

  const activeSession = sessions.find(s => s.sessionId === selectedSessionId || s.id === selectedSessionId);

  const handleRateAnswer = (msgId: string, rating: ReviewRating) => {
    if (!activeSession) return;
    conversationLogger.rateAnswer(activeSession.sessionId, msgId, rating, reviewNote);
    setReviewNote('');
    reloadData();
  };

  const handleToggleAdminTakeover = () => {
    if (!activeSession) return;
    const isCurrentlyJoined = activeSession.status === 'admin_joined';
    crmService.setOperatorActive(!isCurrentlyJoined);
    conversationLogger.setAdminJoinedStatus(activeSession.sessionId, !isCurrentlyJoined);
    reloadData();
  };

  const handleSendAdminMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminReplyText.trim() || !activeSession) return;

    // Send admin message via CRM & Conversation Logger
    crmService.sendAdminTakeoverMessage(adminReplyText.trim());
    conversationLogger.logAdminMessage(activeSession.sessionId, adminReplyText.trim());
    setAdminReplyText('');
    reloadData();
  };

  const handleExportCSV = () => {
    const headers = ['Session ID', 'Visitor Name', 'Email', 'Start Time', 'Duration (s)', 'Status', 'Message Count', 'AI Success Rate'];
    const rows = sessions.map(s => [
      s.sessionId,
      `"${s.visitorName || 'Anonim Ziyaretçi'}"`,
      `"${s.visitorEmail || '-'}"`,
      s.startTime,
      s.durationSeconds,
      s.status,
      s.messages.length,
      `%${s.aiTotalCount > 0 ? Math.round((s.aiSuccessCount / s.aiTotalCount) * 100) : 100}`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `irem_comfort_conversations_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(sessions, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `irem_comfort_conversations_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleArchive = (sessionId: string) => {
    conversationLogger.archiveSession(sessionId);
    reloadData();
  };

  const handleDelete = (sessionId: string) => {
    if (window.confirm('Bu konuşma günlüğünü silmek istediğinize emin misiniz?')) {
      conversationLogger.deleteSession(sessionId);
      if (selectedSessionId === sessionId) setSelectedSessionId(null);
      reloadData();
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Header & Statistics Cards */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-[#082C6C] p-6 rounded-2xl text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-amber-400/20 border border-amber-300/40 text-amber-300 font-extrabold text-xs uppercase tracking-widest">
              BETA PROGRAM VOL 6.1
            </span>
            <h2 className="text-xl font-bold">Sohbet Günlükleri & AI Kalite İnceleme Center</h2>
          </div>
          <p className="text-xs text-slate-300">
            Ziyaretçi soruları, AI doğruluk skorları, Canlı Destek devirleri ve kalite inceleme raporları.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-white/20"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV İndir</span>
          </button>
          <button
            onClick={handleExportJSON}
            className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
          >
            <Download className="w-3.5 h-3.5" />
            <span>JSON Dışa Aktar</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-[#082C6C]">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 block">Toplam Konuşma</span>
            <span className="text-xl font-bold text-slate-800">{stats.totalConversations}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 block">AI Başarı Oranı</span>
            <span className="text-xl font-bold text-emerald-600">%{stats.aiSuccessRate}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 block">Ort. AI Güven Skoru</span>
            <span className="text-xl font-bold text-amber-600">%{stats.aiConfidenceAvg}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600">
            <Headset className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 block">Canlı Destek Talebi</span>
            <span className="text-xl font-bold text-purple-600">{stats.humanSupportRequests}</span>
          </div>
        </div>
      </div>

      {/* 2. Filters & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="İsim, e-posta veya mesaj ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:border-[#082C6C]"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="text-xs text-slate-500 font-medium shrink-0">Durum:</span>
          {[
            { id: 'all', label: 'Tümü' },
            { id: 'ai_active', label: 'AI Aktif' },
            { id: 'live_support_requested', label: 'Canlı Destek İstendi' },
            { id: 'admin_joined', label: 'Temsilci Katıldı' },
            { id: 'archived', label: 'Arşivlenmiş' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setStatusFilter(f.id)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors shrink-0 cursor-pointer ${
                statusFilter === f.id
                  ? 'bg-[#082C6C] text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Main Split View: Sessions List (Left) & Conversation Detail (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Sessions List */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col max-h-[650px]">
          <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs font-bold text-slate-700">
            <span>Konuşma Oturumları ({sessions.length})</span>
            <button onClick={reloadData} className="text-slate-400 hover:text-slate-600 cursor-pointer">
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {sessions.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                Arama kriterlerine uygun sohbet kaydı bulunamadı.
              </div>
            ) : (
              sessions.map(s => {
                const isSelected = s.sessionId === selectedSessionId || s.id === selectedSessionId;
                const lastMsg = s.messages[s.messages.length - 1];

                return (
                  <div
                    key={s.id}
                    onClick={() => setSelectedSessionId(s.sessionId)}
                    className={`p-3.5 transition-colors cursor-pointer border-l-4 ${
                      isSelected
                        ? 'bg-amber-50/50 border-[#082C6C]'
                        : 'hover:bg-slate-50 border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-slate-900 truncate">
                        {s.visitorName || `Ziyaretçi (${s.sessionId.slice(-6)})`}
                      </span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-extrabold ${
                        s.status === 'live_support_requested' ? 'bg-amber-100 text-amber-800' :
                        s.status === 'admin_joined' ? 'bg-emerald-100 text-emerald-800' :
                        s.status === 'archived' ? 'bg-slate-100 text-slate-600' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {s.status === 'live_support_requested' ? 'Canlı Destek Bekliyor' :
                         s.status === 'admin_joined' ? 'Temsilci Bağlandı' :
                         s.status === 'archived' ? 'Arşiv' : 'AI Aktif'}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 truncate font-medium mb-1.5">
                      {lastMsg ? lastMsg.text : 'Henüz mesaj yok'}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span>{new Date(s.lastActivity).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span>
                      <span>{s.messages.length} Mesaj • %{s.aiTotalCount > 0 ? Math.round((s.aiSuccessCount / s.aiTotalCount) * 100) : 100} AI</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Active Conversation Detail & Review Area */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col max-h-[650px] overflow-hidden">
          {activeSession ? (
            <>
              {/* Session Header */}
              <div className="p-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm">
                      {activeSession.visitorName || 'Anonim Ziyaretçi'} ({activeSession.sessionId})
                    </h3>
                    {activeSession.visitorEmail && (
                      <span className="text-xs text-amber-300 font-mono">
                        {activeSession.visitorEmail}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400">
                    Başlangıç: {new Date(activeSession.startTime).toLocaleString('tr-TR')} • Süre: {activeSession.durationSeconds} sn
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleToggleAdminTakeover}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      activeSession.status === 'admin_joined'
                        ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                        : 'bg-amber-500 hover:bg-amber-600 text-slate-950'
                    }`}
                  >
                    <Headset className="w-3.5 h-3.5" />
                    <span>{activeSession.status === 'admin_joined' ? 'AI Tekrar Aktif Et' : 'Canlı Desteğe Katıl (Mute AI)'}</span>
                  </button>

                  <button
                    onClick={() => handleArchive(activeSession.sessionId)}
                    className="p-1.5 text-slate-400 hover:text-white cursor-pointer"
                    title="Arşivle"
                  >
                    <Archive className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(activeSession.sessionId)}
                    className="p-1.5 text-red-400 hover:text-red-300 cursor-pointer"
                    title="Sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Messages History */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50">
                {activeSession.messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex flex-col ${
                      m.sender === 'visitor' ? 'items-end' : m.sender === 'system' ? 'items-center' : 'items-start'
                    }`}
                  >
                    {m.sender === 'system' ? (
                      <div className="my-1 py-1 px-3 bg-amber-100 text-amber-900 rounded-full text-[10px] font-bold border border-amber-300">
                        {m.text}
                      </div>
                    ) : (
                      <div
                        className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                          m.sender === 'visitor'
                            ? 'bg-[#082C6C] text-white rounded-br-none'
                            : m.sender === 'admin'
                            ? 'bg-emerald-700 text-white rounded-bl-none font-medium'
                            : 'bg-white text-slate-800 border border-slate-200 shadow-sm rounded-bl-none'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1 border-b border-slate-100/30 pb-1">
                          <span className="font-bold text-[10px] opacity-80">
                            {m.sender === 'visitor' ? 'Ziyaretçi' : m.sender === 'admin' ? 'Müşteri Temsilcisi' : 'İrem AI Asistan'}
                          </span>
                          {m.confidenceScore !== undefined && (
                            <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-extrabold">
                              %{m.confidenceScore} Güven
                            </span>
                          )}
                        </div>

                        <p className="whitespace-pre-line">{m.text}</p>

                        {/* Admin AI Answer Quality Review Controls */}
                        {m.sender === 'assistant' && (
                          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between gap-1 text-[10px]">
                            <span className="text-slate-400 font-semibold">AI İnceleme:</span>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleRateAnswer(m.id, 'excellent')}
                                className={`p-1 rounded cursor-pointer ${m.reviewRating === 'excellent' ? 'bg-emerald-500 text-white' : 'hover:bg-emerald-100 text-emerald-700'}`}
                                title="Mükemmel"
                              >
                                <CheckCircle className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleRateAnswer(m.id, 'good')}
                                className={`p-1 rounded cursor-pointer ${m.reviewRating === 'good' ? 'bg-blue-500 text-white' : 'hover:bg-blue-100 text-blue-700'}`}
                                title="İyi"
                              >
                                <Star className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleRateAnswer(m.id, 'needs_improvement')}
                                className={`p-1 rounded cursor-pointer ${m.reviewRating === 'needs_improvement' ? 'bg-amber-500 text-white' : 'hover:bg-amber-100 text-amber-700'}`}
                                title="Geliştirilmeli"
                              >
                                <AlertTriangle className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleRateAnswer(m.id, 'incorrect')}
                                className={`p-1 rounded cursor-pointer ${m.reviewRating === 'incorrect' ? 'bg-red-500 text-white' : 'hover:bg-red-100 text-red-700'}`}
                                title="Hatalı"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    <span className="text-[9px] text-slate-400 mt-0.5 px-1 font-mono">
                      {m.timestamp}
                    </span>
                  </div>
                ))}
              </div>

              {/* Admin Takeover Live Input */}
              {activeSession.status === 'admin_joined' && (
                <form onSubmit={handleSendAdminMessage} className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2 shrink-0">
                  <span className="text-xs text-emerald-400 font-bold shrink-0">🟢 Temsilci:</span>
                  <input
                    type="text"
                    value={adminReplyText}
                    onChange={(e) => setAdminReplyText(e.target.value)}
                    placeholder="Ziyaretçiye doğrudan mesaj yazın..."
                    className="flex-1 py-1.5 px-3 bg-slate-800 text-white border border-slate-700 rounded-xl text-xs font-medium focus:outline-none focus:border-emerald-400"
                  />
                  <button
                    type="submit"
                    disabled={!adminReplyText.trim()}
                    className="py-1.5 px-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <span>Gönder</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </>
          ) : (
            <div className="p-12 text-center text-slate-400 text-xs my-auto">
              Detaylarını ve mesaj geçmişini incelemek için sol listeden bir sohbet seçin.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

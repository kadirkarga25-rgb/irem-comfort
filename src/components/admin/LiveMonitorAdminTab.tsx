/**
 * IC CMS PRO - Volume 2D: Live Conversation Monitor & Admin Human Takeover Tab
 * Provides real-time conversation monitoring, human operator takeover ("Sohbete Katıl"),
 * and full configuration settings for AI, CRM, and Human Support.
 */

import React, { useState, useEffect } from 'react';
import { 
  Users, MessageSquare, ShieldCheck, Power, Settings, Send, 
  UserCheck, Sliders, ToggleLeft, ToggleRight, Radio, Eye, 
  Clock, Activity, AlertCircle, Save, CheckCircle2, RotateCcw
} from 'lucide-react';
import { adminSettingsService, AdminSettingsConfig } from '../../services/adminSettings';
import { crmService, VisitorCrmRecord } from '../../services/crmService';
import { learningEngine } from '../../services/ai/learningEngine';

export const LiveMonitorAdminTab: React.FC = () => {
  const [settings, setSettings] = useState<AdminSettingsConfig>(adminSettingsService.getSettings());
  const [activeVisitorRecord, setActiveVisitorRecord] = useState<VisitorCrmRecord>(crmService.getActiveRecord());
  const [adminMessageInput, setAdminMessageInput] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<'monitor' | 'settings'>('monitor');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Poll active visitor CRM record state
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveVisitorRecord(crmService.getActiveRecord());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleSetting = (key: keyof AdminSettingsConfig) => {
    if (typeof settings[key] === 'boolean') {
      const updated = adminSettingsService.updateSettings({ [key]: !settings[key] });
      setSettings(updated);
    }
  };

  const handleTextSettingChange = (key: keyof AdminSettingsConfig, value: string) => {
    const updated = adminSettingsService.updateSettings({ [key]: value });
    setSettings(updated);
  };

  const handleSaveSettings = () => {
    adminSettingsService.updateSettings(settings);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleJoinConversation = () => {
    const updated = crmService.setOperatorTakeover(true);
    setActiveVisitorRecord(updated);
  };

  const handleLeaveConversation = () => {
    const updated = crmService.setOperatorTakeover(false);
    setActiveVisitorRecord(updated);
  };

  const handleSendAdminMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminMessageInput.trim()) return;

    const time = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    const adminMsg = {
      id: `admin-${Date.now()}`,
      sender: 'assistant' as const,
      text: `[Canlı Müşteri Temsilcisi]: ${adminMessageInput.trim()}`,
      timestamp: time
    };

    // Find last visitor query to map with admin answer for Learning Candidate queue
    const lastVisitorMsg = [...activeVisitorRecord.conversationHistory].reverse().find(m => m.sender === 'visitor');
    learningEngine.addCandidateFromHumanResponse(
      lastVisitorMsg?.text || 'Müşteri Canlı Soru',
      adminMessageInput.trim(),
      activeVisitorRecord.sessionId
    );

    const updatedHistory = [...activeVisitorRecord.conversationHistory, adminMsg];
    crmService.updateRecord({ conversationHistory: updatedHistory });
    setAdminMessageInput('');
  };

  return (
    <div className="space-y-6">
      {/* Sub-tab Switcher */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-[#082C6C]/10 text-[#082C6C] flex items-center justify-center font-bold">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Müşteri Zekası & Canlı Sohbet Yönetimi</h2>
            <p className="text-xs text-slate-500 font-medium">
              Ziyaretçi davranış takibi, dinamik skorlama ve canlı operatör devralma (Human Handover) paneli.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveSubTab('monitor')}
            className={`px-3 py-1.5 rounded-md font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeSubTab === 'monitor' ? 'bg-white text-[#082C6C] shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            <span>Canlı Monitör</span>
          </button>
          <button
            onClick={() => setActiveSubTab('settings')}
            className={`px-3 py-1.5 rounded-md font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeSubTab === 'settings' ? 'bg-white text-[#082C6C] shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Sistem Ayarları</span>
          </button>
        </div>
      </div>

      {activeSubTab === 'monitor' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Visitor Session Card */}
          <div className="lg:col-span-1 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <h3 className="font-bold text-sm text-slate-900">Aktif Ziyaretçi Oturumu</h3>
              </div>
              <span className="text-[10px] font-mono bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded">
                {activeVisitorRecord.visitorId}
              </span>
            </div>

            {/* Dynamic Customer Scores */}
            <div className="space-y-2 text-xs">
              <span className="font-extrabold text-slate-700 block text-[11px]">Dinamik Müşteri Skorları:</span>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-slate-500 block">Alışveriş İlgisi:</span>
                  <span className="font-extrabold text-[#082C6C]">%{activeVisitorRecord.scores.shoppingInterestScore}</span>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-slate-500 block">Satın Alma İhtimali:</span>
                  <span className="font-extrabold text-emerald-700">%{activeVisitorRecord.scores.purchaseProbability}</span>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-slate-500 block">Toptan İhtimali:</span>
                  <span className="font-extrabold text-amber-700">%{activeVisitorRecord.scores.wholesaleProbability}</span>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-slate-500 block">Destek İhtiyacı:</span>
                  <span className="font-extrabold text-indigo-700">%{activeVisitorRecord.scores.supportRequirement}</span>
                </div>
              </div>
            </div>

            {/* Behaviour Journey */}
            <div className="space-y-1.5 text-xs">
              <span className="font-extrabold text-slate-700 block text-[11px]">İncelenen Modeller:</span>
              <div className="flex flex-wrap gap-1">
                {activeVisitorRecord.viewedProducts.length > 0 ? (
                  activeVisitorRecord.viewedProducts.map((p, i) => (
                    <span key={i} className="bg-amber-50 text-amber-900 border border-amber-200 text-[10px] font-bold px-2 py-0.5 rounded">
                      {p.name}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-400 text-[10px]">Henüz ürün detayına tıklanmadı</span>
                )}
              </div>
            </div>

            {/* Operator Control Button */}
            <div className="pt-3 border-t border-slate-100">
              {activeVisitorRecord.isHumanOperatorActive ? (
                <button
                  onClick={handleLeaveConversation}
                  className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
                >
                  <Power className="w-4 h-4" />
                  <span>Sohbeti AI'ya Devret (Çıkış Yap)</span>
                </button>
              ) : (
                <button
                  onClick={handleJoinConversation}
                  className="w-full py-2.5 bg-[#082C6C] hover:bg-[#0b357f] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
                >
                  <UserCheck className="w-4 h-4 text-amber-400" />
                  <span>Sohbete Katıl (Canlı Operatör Modu)</span>
                </button>
              )}
            </div>
          </div>

          {/* Live Chat & Takeover Control */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[520px] overflow-hidden">
            {/* Live Chat Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-xs">Canlı Sohbet İzleme & Müdahale Ekranı</h3>
              </div>
              <div className="flex items-center gap-2">
                {activeVisitorRecord.isHumanOperatorActive ? (
                  <span className="bg-amber-500 text-slate-950 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <UserCheck className="w-3 h-3" /> Canlı Operatör Aktif
                  </span>
                ) : (
                  <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                    AI Asistan Otopilot
                  </span>
                )}
              </div>
            </div>

            {/* Conversation Messages Feed */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/60">
              {activeVisitorRecord.conversationHistory.length > 0 ? (
                activeVisitorRecord.conversationHistory.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex flex-col ${msg.sender === 'visitor' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-xl text-xs ${
                        msg.sender === 'visitor'
                          ? 'bg-[#082C6C] text-white rounded-br-none'
                          : 'bg-white border border-slate-200 text-slate-900 rounded-bl-none shadow-sm'
                      }`}
                    >
                      <span className="font-bold block text-[10px] opacity-75 mb-0.5">
                        {msg.sender === 'visitor' ? 'Ziyaretçi' : msg.text.startsWith('[Canlı') ? 'Yönetici (Siz)' : 'AI Asistan'}
                      </span>
                      <p className="whitespace-pre-line">{msg.text}</p>
                    </div>
                    <span className="text-[9px] text-slate-400 mt-0.5 px-1">{msg.timestamp}</span>
                  </div>
                ))
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                  Henüz mesajlaşma geçmişi bulunmuyor.
                </div>
              )}
            </div>

            {/* Admin Input Panel (Only active when operator joins) */}
            <form onSubmit={handleSendAdminMessage} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
              <input
                type="text"
                disabled={!activeVisitorRecord.isHumanOperatorActive}
                placeholder={
                  activeVisitorRecord.isHumanOperatorActive
                    ? 'Mesajınızı doğrudan ziyaretçiye yazın...'
                    : 'Canlı müdahale için sol taraftan "Sohbete Katıl" butonuna tıklayınız.'
                }
                value={adminMessageInput}
                onChange={e => setAdminMessageInput(e.target.value)}
                className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#082C6C] outline-none disabled:bg-slate-100 disabled:cursor-not-allowed"
              />
              <button
                type="submit"
                disabled={!activeVisitorRecord.isHumanOperatorActive || !adminMessageInput.trim()}
                className="px-4 py-2 bg-[#082C6C] hover:bg-[#0b357f] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Gönder</span>
              </button>
            </form>
          </div>
        </div>
      ) : (
        /* Settings Sub-Tab */
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <div>
              <h3 className="font-bold text-base text-slate-900">Sistem & Müşteri Zekası Konfigürasyonu</h3>
              <p className="text-xs text-slate-500 font-medium">
                Tüm modülleri dinamik olarak aktif/pasif edin veya sistem yanıt metinlerini özelleştirin.
              </p>
            </div>

            <button
              onClick={handleSaveSettings}
              className="px-4 py-2 bg-[#082C6C] hover:bg-[#0b357f] text-white font-bold text-xs rounded-xl flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>{saveSuccess ? 'Kaydedildi!' : 'Değişiklikleri Kaydet'}</span>
            </button>
          </div>

          {/* Toggle Switches */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-xs text-slate-900 block">Canlı İnsan Desteği</span>
                <span className="text-[10px] text-slate-500">Human Handover Formunu aktif eder</span>
              </div>
              <button onClick={() => handleToggleSetting('enableHumanSupport')} className="cursor-pointer">
                {settings.enableHumanSupport ? <ToggleRight className="w-7 h-7 text-emerald-600" /> : <ToggleLeft className="w-7 h-7 text-slate-400" />}
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-xs text-slate-900 block">Yerel CRM Kaydı</span>
                <span className="text-[10px] text-slate-500">Ziyaretçi profillerini CRM'e işler</span>
              </div>
              <button onClick={() => handleToggleSetting('enableCRM')} className="cursor-pointer">
                {settings.enableCRM ? <ToggleRight className="w-7 h-7 text-emerald-600" /> : <ToggleLeft className="w-7 h-7 text-slate-400" />}
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-xs text-slate-900 block">Davranış Analiz Motoru</span>
                <span className="text-[10px] text-slate-500">Sayfa ve ürün tıklarını skorlar</span>
              </div>
              <button onClick={() => handleToggleSetting('enableBehaviourAnalysis')} className="cursor-pointer">
                {settings.enableBehaviourAnalysis ? <ToggleRight className="w-7 h-7 text-emerald-600" /> : <ToggleLeft className="w-7 h-7 text-slate-400" />}
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-xs text-slate-900 block">Canlı Sohbet Monitörü</span>
                <span className="text-[10px] text-slate-500">Yöneticinin müdahale etmesini sağlar</span>
              </div>
              <button onClick={() => handleToggleSetting('enableLiveMonitor')} className="cursor-pointer">
                {settings.enableLiveMonitor ? <ToggleRight className="w-7 h-7 text-emerald-600" /> : <ToggleLeft className="w-7 h-7 text-slate-400" />}
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-xs text-slate-900 block">E-Bülten Onay Checkbox</span>
                <span className="text-[10px] text-slate-500">Formda opsiyonel e-bülten sunar</span>
              </div>
              <button onClick={() => handleToggleSetting('enableNewsletter')} className="cursor-pointer">
                {settings.enableNewsletter ? <ToggleRight className="w-7 h-7 text-emerald-600" /> : <ToggleLeft className="w-7 h-7 text-slate-400" />}
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-xs text-slate-900 block">Kişiselleştirilmiş Hafıza</span>
                <span className="text-[10px] text-slate-500">Ziyaretçi tercihlerini hatırlar</span>
              </div>
              <button onClick={() => handleToggleSetting('enableVisitorMemory')} className="cursor-pointer">
                {settings.enableVisitorMemory ? <ToggleRight className="w-7 h-7 text-emerald-600" /> : <ToggleLeft className="w-7 h-7 text-slate-400" />}
              </button>
            </div>
          </div>

          {/* Text Settings Form */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Müşteri Temsilcisi Çalışma Saatleri</label>
              <input
                type="text"
                value={settings.supportWorkingHours}
                onChange={e => handleTextSettingChange('supportWorkingHours', e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-[#082C6C]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Canlı Destek Devir Çağrı Metni</label>
              <input
                type="text"
                value={settings.humanTransferMessage}
                onChange={e => handleTextSettingChange('humanTransferMessage', e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-[#082C6C]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Otomatik Temsilci Yanıt Metni</label>
              <input
                type="text"
                value={settings.automaticReplyMessage}
                onChange={e => handleTextSettingChange('automaticReplyMessage', e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-[#082C6C]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">E-Bülten Metni (Form İçi Checkbox)</label>
              <input
                type="text"
                value={settings.newsletterText}
                onChange={e => handleTextSettingChange('newsletterText', e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-[#082C6C]"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

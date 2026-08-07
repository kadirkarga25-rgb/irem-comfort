import React, { useState, useEffect } from 'react';
import { CustomerProfile, CustomerType, CustomerStatus } from '../../types/crm';
import { aiService } from '../../services/ai/aiService';
import { 
  Users, Search, UserPlus, Phone, Mail, MapPin, Tag, 
  MessageSquare, Calendar, Filter, Plus, ChevronRight, CheckCircle2,
  AlertCircle, ShieldCheck, Sparkles, Building2, UserCheck
} from 'lucide-react';

export const CrmAdminTab: React.FC = () => {
  const [customers, setCustomers] = useState<CustomerProfile[]>([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerProfile | null>(null);
  const [newNoteText, setNewNoteText] = useState('');
  const [newTagInput, setNewTagInput] = useState('');

  // Sync leads from server to CRM if available
  useEffect(() => {
    fetch('/api/contact/leads')
      .then(res => res.json())
      .then(data => {
        if (data.leads && Array.isArray(data.leads)) {
          const convertedLeads: CustomerProfile[] = data.leads.map((lead: any, index: number) => {
            const aiSentiment = aiService.analyzeLeadSentiment(lead.message || '', lead.inquiryType || '');
            return {
              id: `LEAD-CUST-${index + 1}`,
              fullName: lead.fullName,
              companyName: lead.inquiryType?.includes('Toptan') ? 'Potansiyel Toptan Bayi' : undefined,
              email: lead.email || '',
              phone: lead.phone,
              city: 'Manisa / TR',
              customerType: lead.inquiryType?.includes('Toptan') ? 'wholesale' : 'lead',
              status: lead.status === 'contacted' ? 'contacted' : 'prospect',
              totalOrdersOrInquiries: 1,
              tags: [lead.inquiryType || 'İletişim Formu', aiSentiment.intent === 'wholesale_inquiry' ? 'AI: Toptan Skoru Yüksek' : 'Perakende'],
              notes: [
                { id: `lead-n-${index}`, createdAt: lead.createdAt, author: 'Sistem', text: `Web Mesajı: ${lead.message || 'Mesaj bulunmuyor'}` }
              ],
              inquiriesHistory: [
                { id: `inq-${index}`, date: lead.createdAt.split('T')[0], type: lead.inquiryType || 'Genel İletişim', message: lead.message || '', channel: 'website' }
              ],
              createdAt: lead.createdAt,
              lastContactedAt: lead.createdAt
            };
          });

          setCustomers(convertedLeads);
          if (convertedLeads.length > 0) {
            setSelectedCustomer(convertedLeads[0]);
          }
        }
      })
      .catch(() => {});
  }, []);

  const filteredCustomers = customers.filter(c => {
    const matchesSearch = c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.phone.includes(searchTerm) ||
                          (c.companyName && c.companyName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = selectedType === 'all' || c.customerType === selectedType;
    return matchesSearch && matchesType;
  });

  const handleAddNote = () => {
    if (!selectedCustomer || !newNoteText.trim()) return;
    const newNote = {
      id: `note-${Date.now()}`,
      createdAt: new Date().toISOString(),
      author: 'Yönetici',
      text: newNoteText.trim()
    };

    const updated = {
      ...selectedCustomer,
      notes: [newNote, ...selectedCustomer.notes]
    };

    setCustomers(prev => prev.map(c => c.id === selectedCustomer.id ? updated : c));
    setSelectedCustomer(updated);
    setNewNoteText('');
  };

  const handleAddTag = () => {
    if (!selectedCustomer || !newTagInput.trim()) return;
    if (selectedCustomer.tags.includes(newTagInput.trim())) return;

    const updated = {
      ...selectedCustomer,
      tags: [...selectedCustomer.tags, newTagInput.trim()]
    };

    setCustomers(prev => prev.map(c => c.id === selectedCustomer.id ? updated : c));
    setSelectedCustomer(updated);
    setNewTagInput('');
  };

  const handleStatusChange = (newStatus: CustomerStatus) => {
    if (!selectedCustomer) return;
    const updated = { ...selectedCustomer, status: newStatus };
    setCustomers(prev => prev.map(c => c.id === selectedCustomer.id ? updated : c));
    setSelectedCustomer(updated);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#082C6C] to-[#163E87] rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 text-xs font-extrabold px-3 py-1 rounded-full border border-amber-300/30 uppercase tracking-widest">
            <Users className="w-3.5 h-3.5" />
            <span>Müşteri İlişkileri & CRM Altyapısı</span>
          </div>
          <h2 className="text-2xl font-bold font-serif-luxury">
            Müşteri ve Bayi Yönetim Portalı
          </h2>
          <p className="text-xs text-blue-100 max-w-2xl font-light leading-relaxed">
            Toptan bayilerinizin, perakende sipariş taleplerinizin ve müşteri etkileşimlerinizin merkezi arşivi. Müşteri notları ekleyin, iletişim geçmişini takip edin.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white/10 backdrop-blur px-4 py-3 rounded-2xl border border-white/15 text-center">
            <span className="block text-2xl font-black text-amber-300">{customers.length}</span>
            <span className="text-[10px] text-white/80 uppercase font-semibold">Kayıtlı Müşteri</span>
          </div>
          <div className="bg-white/10 backdrop-blur px-4 py-3 rounded-2xl border border-white/15 text-center">
            <span className="block text-2xl font-black text-emerald-400">
              {customers.filter(c => c.customerType === 'wholesale').length}
            </span>
            <span className="text-[10px] text-white/80 uppercase font-semibold">Toptan Bayi</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Customer List + Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Filter & Customer List */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 space-y-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="İsim, firma, e-posta veya telefon ile ara..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#082C6C]"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {[
                { id: 'all', label: 'Tümü' },
                { id: 'wholesale', label: 'Toptan Bayiler' },
                { id: 'retail', label: 'Perakende' },
                { id: 'lead', label: 'Talepler' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedType(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    selectedType === tab.id
                      ? 'bg-[#082C6C] text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Customer List Cards */}
          <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
            {filteredCustomers.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 text-slate-500 text-xs">
                Müşteri bulunamadı.
              </div>
            ) : (
              filteredCustomers.map(cust => {
                const isSelected = selectedCustomer?.id === cust.id;
                return (
                  <div
                    key={cust.id}
                    onClick={() => setSelectedCustomer(cust)}
                    className={`bg-white rounded-2xl p-4 border transition-all cursor-pointer space-y-2 ${
                      isSelected
                        ? 'border-[#082C6C] ring-2 ring-[#082C6C]/10 shadow-md bg-blue-50/20'
                        : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                          <span>{cust.fullName}</span>
                          {cust.customerType === 'wholesale' && (
                            <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                              TOPTAN
                            </span>
                          )}
                        </h4>
                        {cust.companyName && (
                          <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                            <Building2 className="w-3 h-3 text-slate-400" />
                            <span>{cust.companyName}</span>
                          </p>
                        )}
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${
                        cust.status === 'active' ? 'bg-emerald-100 text-emerald-800' :
                        cust.status === 'prospect' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {cust.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-600">
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{cust.phone}</span>
                      </span>
                      {cust.city && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{cust.city}</span>
                        </span>
                      )}
                    </div>

                    {/* Tags preview */}
                    {cust.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {cust.tags.slice(0, 3).map((tag, i) => (
                          <span key={i} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Detail View & Notes */}
        <div className="lg:col-span-7">
          {selectedCustomer ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
              {/* Top Banner */}
              <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-slate-900 font-serif-luxury">
                      {selectedCustomer.fullName}
                    </h3>
                    <span className="text-xs font-mono font-bold text-slate-400">
                      [{selectedCustomer.id}]
                    </span>
                  </div>
                  {selectedCustomer.companyName && (
                    <p className="text-xs font-semibold text-[#082C6C] mt-1">
                      🏢 {selectedCustomer.companyName}
                    </p>
                  )}
                </div>

                {/* Status Switcher */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500">Durum:</span>
                  <select
                    value={selectedCustomer.status}
                    onChange={(e) => handleStatusChange(e.target.value as CustomerStatus)}
                    className="text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-[#082C6C]"
                  >
                    <option value="active">Aktif Müşteri</option>
                    <option value="prospect">Potansiyel (Prospect)</option>
                    <option value="contacted">Görüşüldü</option>
                    <option value="inactive">Pasif</option>
                  </select>
                </div>
              </div>

              {/* Contact Information Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs space-y-0">
                <div className="space-y-1">
                  <span className="text-slate-400 font-semibold block">Telefon Numarası</span>
                  <a href={`tel:${selectedCustomer.phone}`} className="font-bold text-[#082C6C] flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5" />
                    <span>{selectedCustomer.phone}</span>
                  </a>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-400 font-semibold block">E-Posta Adresi</span>
                  <a href={`mailto:${selectedCustomer.email}`} className="font-bold text-[#082C6C] flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" />
                    <span>{selectedCustomer.email || 'Belirtilmedi'}</span>
                  </a>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-400 font-semibold block">Kayıt Tarihi</span>
                  <span className="font-medium text-slate-700 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{new Date(selectedCustomer.createdAt).toLocaleDateString('tr-TR')}</span>
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-400 font-semibold block">Hızlı İletişim</span>
                  <a
                    href={`https://wa.me/${selectedCustomer.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 font-bold text-emerald-600 hover:underline"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp İle Mesaj At</span>
                  </a>
                </div>
              </div>

              {/* Customer Tags */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-amber-500" />
                  <span>Müşteri Etiketleri & Kategoriler</span>
                </h4>

                <div className="flex flex-wrap items-center gap-2">
                  {selectedCustomer.tags.map((tag, idx) => (
                    <span key={idx} className="bg-blue-50 text-[#082C6C] text-xs font-bold px-3 py-1 rounded-xl border border-blue-100">
                      #{tag}
                    </span>
                  ))}

                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      value={newTagInput}
                      onChange={(e) => setNewTagInput(e.target.value)}
                      placeholder="Yeni etiket..."
                      className="text-xs px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#082C6C] w-28"
                    />
                    <button
                      onClick={handleAddTag}
                      className="p-1 bg-[#082C6C] text-white rounded-lg hover:bg-[#163E87]"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Inquiries Timeline */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  📋 İletişim ve Talep Geçmişi
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {selectedCustomer.inquiriesHistory.map((inq) => (
                    <div key={inq.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                      <div className="flex items-center justify-between text-slate-500">
                        <span className="font-bold text-slate-900">{inq.type}</span>
                        <span>{inq.date}</span>
                      </div>
                      <p className="text-slate-700 italic">"{inq.message}"</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Internal Admin Notes */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  ✍️ Özel Yönetici Notları
                </h4>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    placeholder="Müşteri hakkında özel not veya görüşme notu ekleyin..."
                    className="flex-1 text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#082C6C]"
                  />
                  <button
                    onClick={handleAddNote}
                    className="px-4 py-2 bg-[#082C6C] hover:bg-[#163E87] text-white text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer"
                  >
                    <span>Not Ekle</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {selectedCustomer.notes.map((note) => (
                    <div key={note.id} className="p-3 bg-amber-50/50 rounded-xl border border-amber-200/60 text-xs space-y-1">
                      <div className="flex items-center justify-between text-amber-900 font-bold">
                        <span>{note.author}</span>
                        <span className="text-[10px] text-slate-400 font-normal">
                          {new Date(note.createdAt).toLocaleString('tr-TR')}
                        </span>
                      </div>
                      <p className="text-slate-800">{note.text}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-sm">
              Detaylarını incelemek için soldan bir müşteri seçiniz.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

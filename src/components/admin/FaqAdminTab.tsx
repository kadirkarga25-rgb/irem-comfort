import React, { useState } from 'react';
import { useAppImages } from '../../context/ImageContext';
import { FaqItem } from '../../types';
import { 
  HelpCircle, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  RotateCcw, 
  Sparkles, 
  Search, 
  Eye, 
  EyeOff, 
  PackageCheck, 
  Truck, 
  Footprints, 
  Save,
  MessageCircle,
  AlertCircle
} from 'lucide-react';

export const FaqAdminTab: React.FC<{ showToast: (msg: string) => void }> = ({ showToast }) => {
  const { faqItems, updateFaqItem, addFaqItem, deleteFaqItem, resetFaqItems } = useAppImages();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('hepsi');
  
  // Modal / Form state for Add / Edit
  const [isEditingModalOpen, setIsEditingModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FaqItem | null>(null);

  // New item form state
  const [formData, setFormData] = useState<Omit<FaqItem, 'id'>>({
    category: 'toptan',
    question: '',
    answer: '',
    isPopular: false,
    isActive: true
  });

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormData({
      category: 'toptan',
      question: '',
      answer: '',
      isPopular: false,
      isActive: true
    });
    setIsEditingModalOpen(true);
  };

  const handleOpenEditModal = (item: FaqItem) => {
    setEditingItem(item);
    setFormData({
      category: item.category,
      question: item.question,
      answer: item.answer,
      isPopular: item.isPopular ?? false,
      isActive: item.isActive ?? true
    });
    setIsEditingModalOpen(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.question.trim() || !formData.answer.trim()) {
      alert('Lütfen hem soruyu hem de cevabı doldurunuz.');
      return;
    }

    if (editingItem) {
      updateFaqItem(editingItem.id, formData);
      showToast('Sıkça sorulan soru güncellendi!');
    } else {
      addFaqItem(formData);
      showToast('Yeni soru başarıyla eklendi!');
    }

    setIsEditingModalOpen(false);
  };

  const handleDelete = (id: string, question: string) => {
    if (window.confirm(`"${question}" sorusunu silmek istediğinize emin misiniz?`)) {
      deleteFaqItem(id);
      showToast('Soru silindi.');
    }
  };

  const handleToggleActive = (item: FaqItem) => {
    const nextState = !item.isActive;
    updateFaqItem(item.id, { isActive: nextState });
    showToast(nextState ? 'Soru yayına alındı.' : 'Soru gizlendi.');
  };

  const handleTogglePopular = (item: FaqItem) => {
    const nextState = !item.isPopular;
    updateFaqItem(item.id, { isPopular: nextState });
    showToast(nextState ? 'Popüler etiketi eklendi.' : 'Popüler etiketi kaldırıldı.');
  };

  const handleReset = () => {
    if (window.confirm('Tüm SSS maddelerini orijinal varsayılan listeye sıfırlamak istiyor musunuz?')) {
      resetFaqItems();
      showToast('SSS varsayılan verileri yüklendi.');
    }
  };

  const filteredItems = faqItems.filter(item => {
    if (categoryFilter !== 'hepsi' && item.category !== categoryFilter) return false;
    if (searchQuery.trim() !== '') {
      const q = (searchQuery || '').toLowerCase();
      const qText = (item?.question || '').toLowerCase();
      const aText = (item?.answer || '').toLowerCase();
      return qText.includes(q) || aText.includes(q);
    }
    return true;
  });

  const getCategoryBadge = (category: FaqItem['category']) => {
    switch (category) {
      case 'toptan':
        return <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded-full text-[11px] font-semibold">Toptan & Üretim</span>;
      case 'kargo':
        return <span className="bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-0.5 rounded-full text-[11px] font-semibold">Kargo & Teslimat</span>;
      case 'bakim':
        return <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5 rounded-full text-[11px] font-semibold">Hakiki Deri Bakımı</span>;
      case 'kalip':
        return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[11px] font-semibold">Numara & Kalıp</span>;
      default:
        return <span className="bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-0.5 rounded-full text-[11px] font-semibold">Genel</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Action Controls */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#0A2D6F]/10 text-[#0A2D6F] flex items-center justify-center font-bold">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Sıkça Sorulan Sorular (SSS) Yönetimi</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Müşterilerinizin toptan sipariş, kargo teslimatı ve deri bakımı hakkında sorduğu soruları ekleyin, düzenleyin veya gizleyin.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={handleReset}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 border border-slate-200 transition-all flex items-center gap-1.5 cursor-pointer"
            title="Varsayılan SSS listesini geri yükle"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Varsayılana Sıfırla</span>
          </button>

          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-[#0A2D6F] hover:bg-[#082C6C] text-white shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Soru Ekle</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Category Filter */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {[
            { id: 'hepsi', label: 'Tümü' },
            { id: 'toptan', label: 'Toptan' },
            { id: 'kargo', label: 'Kargo' },
            { id: 'bakim', label: 'Deri Bakımı' },
            { id: 'kalip', label: 'Kalıp & Numara' },
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                categoryFilter === cat.id
                  ? 'bg-[#0A2D6F] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Sorularda ara..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0A2D6F]"
          />
        </div>
      </div>

      {/* FAQ Items Grid/List */}
      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-2">
            <HelpCircle className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">Gösterilecek soru bulunamadı.</p>
            <p className="text-xs text-slate-500">Arama filtrenizi değiştirebilir veya yeni soru ekleyebilirsiniz.</p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-2xl p-5 border transition-all shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                item.isActive === false ? 'opacity-60 bg-slate-50 border-slate-200' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  {getCategoryBadge(item.category)}

                  {item.isPopular && (
                    <span className="bg-amber-100 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-600" />
                      Popüler Soru
                    </span>
                  )}

                  {item.isActive === false && (
                    <span className="bg-rose-100 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
                      <EyeOff className="w-3 h-3" />
                      Gizli (Pasif)
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-slate-900 leading-snug">
                  {item.question}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-light">
                  {item.answer}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5 shrink-0 self-end md:self-center bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                
                {/* Active Toggle Button */}
                <button
                  onClick={() => handleToggleActive(item)}
                  className={`p-2 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                    item.isActive !== false
                      ? 'text-emerald-700 bg-emerald-100/80 hover:bg-emerald-200'
                      : 'text-slate-500 hover:bg-slate-200'
                  }`}
                  title={item.isActive !== false ? 'Yayında (Gizlemek için tıklayın)' : 'Gizli (Yayına almak için tıklayın)'}
                >
                  {item.isActive !== false ? <Eye className="w-4 h-4 text-emerald-600" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
                </button>

                {/* Popular Toggle Button */}
                <button
                  onClick={() => handleTogglePopular(item)}
                  className={`p-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    item.isPopular
                      ? 'text-amber-700 bg-amber-100 hover:bg-amber-200'
                      : 'text-slate-400 hover:bg-slate-200 hover:text-slate-700'
                  }`}
                  title={item.isPopular ? 'Popüler Soru (İşareti kaldırmak için tıklayın)' : 'Popüler Olarak İşaretle'}
                >
                  <Sparkles className="w-4 h-4" />
                </button>

                {/* Edit Button */}
                <button
                  onClick={() => handleOpenEditModal(item)}
                  className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-all cursor-pointer"
                  title="Düzenle"
                >
                  <Edit3 className="w-4 h-4" />
                </button>

                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(item.id, item.question)}
                  className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                  title="Sil"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit / Add Modal */}
      {isEditingModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 relative border border-slate-200 animate-fade-in">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[#0A2D6F]" />
                <span>{editingItem ? 'Soruyu Düzenle' : 'Yeni Soru Ekle'}</span>
              </h3>
              <button
                onClick={() => setIsEditingModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-4">
              
              {/* Category Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Kategori
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0A2D6F]"
                >
                  <option value="toptan">Toptan & Üretim Süreçleri</option>
                  <option value="kargo">Kargo & Teslimat</option>
                  <option value="bakim">Hakiki Deri Bakımı & Temizliği</option>
                  <option value="kalip">Numara, Kalıp & Değişim</option>
                  <option value="genel">Genel Sorular</option>
                </select>
              </div>

              {/* Question Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Soru Başlığı / Metni
                </label>
                <input
                  type="text"
                  required
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  placeholder="ör. Toptan terlik siparişinde minimum seri adedi nedir?"
                  className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0A2D6F]"
                />
              </div>

              {/* Answer Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Detaylı Yanıt / Cevap Metni
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  placeholder="Müşterilerinize sunulacak yanıt açıklamasını yazın..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#0A2D6F]"
                />
              </div>

              {/* Toggles */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.isPopular}
                    onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                    className="w-4 h-4 rounded text-[#0A2D6F] focus:ring-[#0A2D6F]"
                  />
                  <span>✨ Popüler Soru Olarak Öne Çıkar</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 rounded text-[#0A2D6F] focus:ring-[#0A2D6F]"
                  />
                  <span>👁️ Web Sitesinde Yayında</span>
                </label>
              </div>

              {/* Submit / Cancel Actions */}
              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditingModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-100 cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#0A2D6F] hover:bg-[#082C6C] text-white font-bold text-xs shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingItem ? 'Değişiklikleri Kaydet' : 'Soruyu Ekle'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

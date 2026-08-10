import React, { useState } from 'react';
import { useAppImages } from '../../context/ImageContext';
import { TestimonialItem } from '../../types';
import { 
  MessageSquare, 
  Plus, 
  Trash2, 
  Edit3, 
  Star, 
  Sparkles, 
  RotateCcw, 
  ShoppingBag, 
  Check, 
  User, 
  X,
  Building2,
  Tag
} from 'lucide-react';

interface TestimonialsAdminTabProps {
  showToast: (msg: string) => void;
}

export const TestimonialsAdminTab: React.FC<TestimonialsAdminTabProps> = ({ showToast }) => {
  const { 
    testimonials, 
    addTestimonial, 
    updateTestimonial, 
    deleteTestimonial, 
    resetTestimonials,
    collectionItems
  } = useAppImages();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form State
  const [author, setAuthor] = useState('');
  const [role, setRole] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [selectedProductName, setSelectedProductName] = useState('');
  const [avatar, setAvatar] = useState('');

  const resetForm = () => {
    setAuthor('');
    setRole('');
    setRating(5);
    setComment('');
    setSelectedProductId('');
    setSelectedProductName('');
    setAvatar('');
    setEditingId(null);
    setIsFormOpen(false);
  };

  const handleOpenEdit = (t: TestimonialItem) => {
    setEditingId(t.id);
    setAuthor(t.author || '');
    setRole(t.role || '');
    setRating(t.rating || 5);
    setComment(t.comment || '');
    setSelectedProductId(t.productId || '');
    setSelectedProductName(t.productName || '');
    setAvatar(t.avatar || '');
    setIsFormOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !comment.trim()) {
      showToast('Lütfen müşteri adı ve yorum metnini doldurun.');
      return;
    }

    // Determine product association
    let pName = selectedProductName;
    if (selectedProductId) {
      const p = collectionItems.find(item => item.id === selectedProductId);
      if (p) pName = p.name;
    }

    if (editingId) {
      updateTestimonial(editingId, {
        author,
        name: author,
        role,
        rating,
        comment,
        productId: selectedProductId || undefined,
        productName: pName || undefined,
        avatar: avatar || undefined,
        avatarUrl: avatar || undefined
      });
      showToast('Müşteri yorumu başarıyla güncellendi!');
    } else {
      addTestimonial({
        author,
        name: author,
        role: role || 'Değerli Müşterimiz',
        rating,
        comment,
        productId: selectedProductId || undefined,
        productName: pName || undefined,
        avatar: avatar || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200`,
        avatarUrl: avatar || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200`,
        date: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }),
        type: 'perakende',
        verified: true
      });
      showToast('Yeni müşteri yorumu eklendi!');
    }

    resetForm();
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-extrabold text-[#082C6C] text-lg sm:text-xl flex items-center gap-2.5 font-serif-luxury">
            <MessageSquare className="w-6 h-6 text-[#D4AF37]" />
            <span>Müşteri Değerlendirmeleri & Yorum Yönetimi</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Sitede gösterilen gerçek müşteri yorumlarını yönetin, yeni yorum ekleyin veya yorumları ürünlerinizle bağdaştırın.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              resetTestimonials();
              showToast('Müşteri yorumları varsayılan listeye sıfırlandı.');
            }}
            className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
            <span>Sıfırla</span>
          </button>

          <button
            onClick={() => {
              resetForm();
              setIsFormOpen(true);
            }}
            className="px-4 py-2 bg-[#082C6C] hover:bg-[#163E87] text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-amber-300" />
            <span>Yeni Yorum Ekle</span>
          </button>
        </div>
      </div>

      {/* Add / Edit Form Modal or Card */}
      {isFormOpen && (
        <div className="p-6 bg-slate-50 rounded-2xl border-2 border-[#082C6C]/20 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h4 className="font-extrabold text-[#082C6C] text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span>{editingId ? 'Yorumu Düzenle' : 'Yeni Müşteri Yorumu & Ürün Bağdaştırması'}</span>
            </h4>
            <button
              onClick={resetForm}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Author Name */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Müşteri Adı & Soyadı *</label>
              <input
                type="text"
                required
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Örn: Ayşe Yılmaz"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:border-[#082C6C] focus:outline-none bg-white font-medium"
              />
            </div>

            {/* Role / City / Type */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Müşteri Ünvanı / Şehir</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Örn: Manisa Perakende Müşterisi veya Toptan Mağaza Sahibi"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:border-[#082C6C] focus:outline-none bg-white font-medium"
              />
            </div>

            {/* Product Association Selector (Ürün Bağdaştırması) */}
            <div>
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1 mb-1">
                <ShoppingBag className="w-3.5 h-3.5 text-[#082C6C]" />
                <span>İlişkili Ürün (Ürün Bağdaştırma)</span>
              </label>
              <select
                value={selectedProductId}
                onChange={(e) => {
                  setSelectedProductId(e.target.value);
                  const selected = collectionItems.find(i => i.id === e.target.value);
                  if (selected) setSelectedProductName(selected.name);
                }}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:border-[#082C6C] focus:outline-none bg-white font-medium text-slate-800"
              >
                <option value="">-- Ürün Seçiniz (Genel Mağaza Yorumu) --</option>
                {collectionItems.map((prod) => (
                  <option key={prod.id} value={prod.id}>
                    {prod.name} ({prod.category})
                  </option>
                ))}
              </select>
            </div>

            {/* Star Rating */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Puan (1 - 5 Yıldız)</label>
              <div className="flex items-center gap-1 py-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    className="p-1 cursor-pointer transition-transform hover:scale-125"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-slate-600 ml-2">{rating} / 5 Yıldız</span>
              </div>
            </div>

            {/* Custom Avatar URL */}
            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 block mb-1">Müşteri Profil Görseli / Avatar URL (İsteğe Bağlı)</label>
              <input
                type="text"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="https://..."
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:border-[#082C6C] focus:outline-none bg-white font-medium"
              />
            </div>

            {/* Review Comment Text */}
            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 block mb-1">Müşteri Yorum Metni *</label>
              <textarea
                required
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Müşterinin ayakkabı veya terlik hakkındaki değerlendirmesini girin..."
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:border-[#082C6C] focus:outline-none bg-white font-medium"
              />
            </div>

            {/* Form Actions */}
            <div className="sm:col-span-2 flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 text-xs font-bold cursor-pointer"
              >
                İptal
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-[#082C6C] hover:bg-[#163E87] text-white font-bold text-xs rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-4 h-4 text-amber-300" />
                <span>{editingId ? 'Güncelle' : 'Yorum Kaydet'}</span>
              </button>
            </div>

          </form>
        </div>
      )}

      {/* Testimonials List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {testimonials.length === 0 ? (
          <div className="col-span-2 text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300 space-y-2">
            <MessageSquare className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-700">Henüz kaydedilmiş yorum bulunmuyor</p>
            <p className="text-xs text-slate-500">Yukarıdaki "Yeni Yorum Ekle" butonuna tıklayarak ilk müşteri yorumunu oluşturabilirsiniz.</p>
          </div>
        ) : (
          testimonials.map((item) => {
            // Find linked product details if any
            const linkedProduct = collectionItems.find(p => p.id === item.productId || p.name === item.productName);

            return (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-[#082C6C]/40 transition-all shadow-xs space-y-3.5 relative flex flex-col justify-between"
              >
                {/* Top Row: Author Info & Rating */}
                <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3">
                    {item.avatar ? (
                      <img
                        src={item.avatar}
                        alt={item.author}
                        className="w-10 h-10 rounded-full object-cover border-2 border-[#082C6C]/20 shadow-xs shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[#082C6C]/10 text-[#082C6C] font-bold text-sm flex items-center justify-center shrink-0">
                        <User className="w-5 h-5" />
                      </div>
                    )}

                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm">{item.author}</h4>
                      <p className="text-[11px] text-slate-500 font-medium">{item.role || 'Değerli Müşterimiz'}</p>
                    </div>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-0.5 shrink-0 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                    {[...Array(5)].map((_, idx) => (
                      <Star
                        key={idx}
                        className={`w-3.5 h-3.5 ${
                          idx < (item.rating || 5) ? 'text-amber-400 fill-amber-400' : 'text-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Comment Text */}
                <p className="text-xs text-slate-700 leading-relaxed font-normal bg-slate-50/70 p-3 rounded-xl border border-slate-100 italic">
                  "{item.comment}"
                </p>

                {/* Product Association Badge (Ürün Bağdaştırma) */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <Tag className="w-3.5 h-3.5 text-[#082C6C]" />
                    <span className="text-[11px] font-bold text-slate-500">Bağlantılı Ürün:</span>
                    {linkedProduct ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-blue-50 text-[#082C6C] text-[11px] font-bold border border-blue-200">
                        {linkedProduct.image && (
                          <img src={linkedProduct.image} alt="" className="w-4 h-4 rounded-full object-cover" />
                        )}
                        <span>{linkedProduct.name}</span>
                      </span>
                    ) : item.productName ? (
                      <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-bold">
                        {item.productName}
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-medium">Genel Mağaza Yorumu</span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 rounded-lg text-slate-600 hover:text-[#082C6C] hover:bg-slate-100 transition-colors cursor-pointer"
                      title="Düzenle"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        deleteTestimonial(item.id);
                        showToast('Müşteri yorumu silindi.');
                      }}
                      className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};

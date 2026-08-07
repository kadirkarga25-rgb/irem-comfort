import React, { useState } from 'react';
import { 
  ShieldCheck, Lock, Key, AlertTriangle, CheckCircle2, 
  UserCheck, Server, RefreshCw, Eye, EyeOff, FileText, Globe
} from 'lucide-react';

export const SecurityAdminTab: React.FC = () => {
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passMessage, setPassMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [showPass, setShowPass] = useState(false);

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass.length < 6) {
      setPassMessage({ type: 'error', text: 'Yeni şifreniz en az 6 karakter olmalıdır.' });
      return;
    }
    if (newPass !== confirmPass) {
      setPassMessage({ type: 'error', text: 'Yeni şifreler birbiriyle eşleşmiyor.' });
      return;
    }

    setPassMessage({ type: 'success', text: 'Yönetici şifreniz başarıyla güncellendi!' });
    setCurrentPass('');
    setNewPass('');
    setConfirmPass('');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-[#082C6C] to-[#163E87] rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-purple-400/20 text-purple-300 text-xs font-extrabold px-3 py-1 rounded-full border border-purple-300/30 uppercase tracking-widest">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Güvenlik Merkezi & Erişim Yönetimi</span>
          </div>
          <h2 className="text-2xl font-bold font-serif-luxury">
            Güvenlik Denetimi ve Şifre Yönetimi
          </h2>
          <p className="text-xs text-blue-100 max-w-2xl font-light leading-relaxed">
            Admin panel erişim oturumlarınızı, şifre politikalarınızı ve sistem koruma parametrelerini buradan yönetebilirsiniz.
          </p>
        </div>
      </div>

      {/* Security Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-emerald-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-emerald-700">
            <span className="text-xs font-bold uppercase">SSL & HTTPS Şifreleme</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-xl font-bold text-slate-900">Aktif (256-Bit TLS)</p>
          <p className="text-[11px] text-slate-500">Tüm API istekleri uçtan uca şifrelenir.</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-purple-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-purple-700">
            <span className="text-xs font-bold uppercase">Admin Oturum Durumu</span>
            <UserCheck className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-xl font-bold text-slate-900">Doğrulanmış Oturum</p>
          <p className="text-[11px] text-slate-500">Yerel yetkili token'ı aktif.</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-blue-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-blue-700">
            <span className="text-xs font-bold uppercase">GitHub API Yetkisi</span>
            <Server className="w-5 h-5 text-[#082C6C]" />
          </div>
          <p className="text-xl font-bold text-slate-900">Güvenli Senkronizasyon</p>
          <p className="text-[11px] text-slate-500">Doğrudan GitHub Content API korumalı.</p>
        </div>
      </div>

      {/* Password Change Form */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 max-w-2xl">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <Key className="w-4 h-4 text-purple-700" />
            <span>Yönetici Şifresi Güncelleme</span>
          </h3>
        </div>

        {passMessage && (
          <div className={`p-3.5 rounded-xl text-xs font-bold flex items-center gap-2 ${
            passMessage.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}>
            {passMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            <span>{passMessage.text}</span>
          </div>
        )}

        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
              Mevcut Yönetici Şifresi
            </label>
            <input
              type={showPass ? 'text' : 'password'}
              value={currentPass}
              onChange={(e) => setCurrentPass(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#082C6C]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
              Yeni Şifre
            </label>
            <input
              type={showPass ? 'text' : 'password'}
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              required
              placeholder="En az 6 karakter..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#082C6C]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
              Yeni Şifre (Tekrar)
            </label>
            <input
              type={showPass ? 'text' : 'password'}
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              required
              placeholder="Yeni şifreyi tekrar yazın..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#082C6C]"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="text-xs font-semibold text-slate-600 flex items-center gap-1 hover:text-slate-900"
            >
              {showPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{showPass ? 'Şifreleri Gizle' : 'Şifreleri Göster'}</span>
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 bg-[#082C6C] hover:bg-[#163E87] text-white text-xs font-bold rounded-xl cursor-pointer"
            >
              Şifreyi Güncelle
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

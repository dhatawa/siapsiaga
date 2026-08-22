import React, { useState, useEffect } from 'react';
import {
  X,
  KeyRound,
  Eye,
  EyeOff,
  Lock,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ShieldCheck
} from 'lucide-react';
import Swal from 'sweetalert2';
import { authService } from '../services/authService';

export default function ChangePasswordModal({ isOpen, onClose }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Reset state ketika modal dibuka atau ditutup
  useEffect(() => {
    if (isOpen) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
      setErrorMessage('');
    }
  }, [isOpen]);

  // Tutup modal dengan tombol Esc
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !isLoading) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Validasi Sisi Klien
    if (!currentPassword) {
      setErrorMessage('Silakan masukkan password saat ini.');
      return;
    }

    if (!newPassword) {
      setErrorMessage('Silakan masukkan password baru.');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage('Password baru minimal terdiri dari 6 karakter.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Konfirmasi password tidak cocok dengan password baru.');
      return;
    }

    if (currentPassword === newPassword) {
      setErrorMessage('Password baru tidak boleh sama dengan password saat ini.');
      return;
    }

    try {
      setIsLoading(true);

      const res = await authService.changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });

      onClose();

      await Swal.fire({
        icon: 'success',
        title: 'Password Berhasil Diubah!',
        text: res.message || 'Kata sandi akun Anda telah berhasil diperbarui.',
        confirmButtonColor: '#b91c1c',
        confirmButtonText: 'Selesai',
      });
    } catch (err) {
      console.error('Change password error:', err);
      setErrorMessage(err.message || 'Gagal mengubah password. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const isMatching = newPassword && confirmPassword && newPassword === confirmPassword;
  const isMismatch = confirmPassword && newPassword !== confirmPassword;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isLoading) {
          onClose();
        }
      }}
    >
      <div 
        className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-gray-100 overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal */}
        <div className="px-6 py-4.5 border-b border-gray-100 flex items-center justify-between bg-red-50/40 mt-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center shadow-xs">
              <KeyRound size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 leading-tight">Ubah Password</h3>
              <p className="text-xs text-gray-500">Perbarui kata sandi akun Anda demi keamanan</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => !isLoading && onClose()}
            disabled={isLoading}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition disabled:opacity-50 cursor-pointer"
            title="Tutup"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4.5">
          {/* Alert Error Pesan */}
          {errorMessage && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-700 animate-in fade-in duration-150">
              <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-600" />
              <div className="flex-1 font-medium">{errorMessage}</div>
            </div>
          )}

          {/* 1. Field: Password Saat Ini */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-700">
              Password Saat Ini <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Lock size={16} />
              </div>
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => {
                  setCurrentPassword(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="Masukkan password saat ini"
                disabled={isLoading}
                className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 transition disabled:opacity-60"
                required
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                disabled={isLoading}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition cursor-pointer"
                title={showCurrentPassword ? 'Sembunyikan password' : 'Lihat password'}
              >
                {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* 2. Field: Password Baru */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-gray-700">
                Password Baru <span className="text-red-500">*</span>
              </label>
              <span className="text-[11px] text-gray-400">Min. 6 karakter</span>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <KeyRound size={16} />
              </div>
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="Buat password baru"
                disabled={isLoading}
                className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 transition disabled:opacity-60"
                required
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowNewPassword(!showNewPassword)}
                disabled={isLoading}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition cursor-pointer"
                title={showNewPassword ? 'Sembunyikan password' : 'Lihat password'}
              >
                {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* 3. Field: Konfirmasi Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-gray-700">
                Konfirmasi Password <span className="text-red-500">*</span>
              </label>
              {isMatching && (
                <span className="text-[11px] font-medium text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 size={12} /> Cocok
                </span>
              )}
              {isMismatch && (
                <span className="text-[11px] font-medium text-red-500">
                  Tidak cocok
                </span>
              )}
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <ShieldCheck size={16} />
              </div>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="Ulangi password baru"
                disabled={isLoading}
                className={`w-full pl-10 pr-10 py-2.5 bg-gray-50 border rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 transition disabled:opacity-60 ${
                  isMismatch
                    ? 'border-red-400 focus:border-red-600 focus:ring-red-600/20'
                    : isMatching
                    ? 'border-emerald-400 focus:border-emerald-600 focus:ring-emerald-600/20'
                    : 'border-gray-200 focus:border-red-600 focus:ring-red-600/20'
                }`}
                required
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isLoading}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition cursor-pointer"
                title={showConfirmPassword ? 'Sembunyikan password' : 'Lihat password'}
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2.5 border border-gray-200 text-xs font-semibold text-gray-600 rounded-xl hover:bg-gray-50 transition disabled:opacity-50 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 bg-red-700 hover:bg-red-800 text-white text-xs font-semibold rounded-xl shadow-sm hover:shadow transition flex items-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Menyimpan...
                </>
              ) : (
                'Simpan Password'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

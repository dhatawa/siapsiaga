import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    email: location.state?.email || '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(location.state?.successMessage || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.email.trim() || !form.password) {
      setError('Email dan kata sandi wajib diisi.');
      return;
    }

    setLoading(true);

    try {
      const data = await login(form.email.trim(), form.password);

      // Tampilkan SweetAlert sukses login
      await Swal.fire({
        icon: 'success',
        title: 'Login Berhasil!',
        text: `Selamat datang kembali, ${data?.user?.name || 'Pengguna'}!`,
        timer: 1500,
        showConfirmButton: false,
        timerProgressBar: true,
      });

      // Redirect sesuai role dan ganti riwayat browser (replace: true) agar tidak bisa backpage ke login
      if (data?.user?.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      const errorMsg = err.message || 'Gagal masuk. Periksa email dan password Anda.';
      setError(errorMsg);

      Swal.fire({
        icon: 'error',
        title: 'Gagal Masuk',
        text: errorMsg,
        confirmButtonColor: '#b91c1c',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Left illustration panel */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-indigo-200 via-gray-800 to-gray-900 relative items-end p-10 overflow-hidden">
        <img src="/image.png" alt="Illustration" className="absolute inset-0 w-full h-full object-cover opacity-40 z-0"/>        
        <div className="relative z-10 text-white">
          <p className="font-bold text-lg">Siap Siaga</p>
          <p className="text-sm text-white/90 mt-2 max-w-xs leading-relaxed">
            Sistem Informasi Mitigasi Bencana Indonesia. Platform terpercaya untuk informasi
            peringatan dini dan respons cepat darurat bencana.
          </p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center bg-white p-8">
        <form onSubmit={handleSubmit} className="w-full max-w-sm">
          <h2 className="text-xl font-bold text-gray-900">Masuk ke Akun Anda</h2>
          <p className="text-sm text-gray-500 mt-2">
            Silakan masukkan kredensial Anda untuk mengakses dashboard mitigasi.
          </p>

          {/* Alert Sukses dari Register */}
          {success && (
            <div className="mt-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-xs flex items-start gap-2 animate-in fade-in duration-200">
              <CheckCircle size={16} className="shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          {/* Alert Error */}
          {error && (
            <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2 animate-in fade-in duration-200">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <label className="block text-sm font-medium text-gray-700 mt-6 mb-1.5">Alamat Email</label>
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              required
              disabled={loading}
              value={form.email}
              onChange={(e) => {
                setForm({ ...form, email: e.target.value });
                if (error) setError('');
              }}
              placeholder="nama@email.com"
              className="input pl-9 pr-3 w-full border border-gray-300 rounded-lg py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-700/20"
            />
          </div>

          <div className="flex items-center justify-between mt-5 mb-1.5">
            <label className="text-sm font-medium text-gray-700">Kata Sandi</label>
            <a href="#" className="text-xs text-primary-700 hover:underline">Lupa Password?</a>
          </div>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              disabled={loading}
              value={form.password}
              onChange={(e) => {
                setForm({ ...form, password: e.target.value });
                if (error) setError('');
              }}
              placeholder="••••••••"
              className="input pl-9 pr-9 w-full border border-gray-300 rounded-lg py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-700/20"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-7 bg-primary-700 hover:bg-primary-800 disabled:opacity-70 text-white text-sm font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Memverifikasi...
              </>
            ) : (
              <>
                Masuk <LogIn size={15} />
              </>
            )}
          </button>

          <p className="text-center text-sm text-gray-500 mt-5">
            Belum memiliki akun?{' '}
            <Link to="/register" className="text-primary-700 font-medium hover:underline">
              Register Sekarang
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: connect to Node.js auth endpoint
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Left illustration panel */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-indigo-200 via-gray-00 to-gray-800 relative items-end p-10 overflow-hidden">
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

          <label className="block text-sm font-medium text-gray-700 mt-6 mb-1.5">Alamat Email</label>
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="nama@email.com"
              className="input pl-9 pr-3"
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
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              className="input pl-9 pr-9"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full mt-7 bg-primary-700 hover:bg-primary-800 text-white text-sm font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            Masuk <LogIn size={15} />
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

function ShieldIllustration() {
  return (
    <svg viewBox="0 0 300 300" className="w-64 h-64 text-white/70" fill="none">
      <circle cx="150" cy="150" r="120" stroke="currentColor" strokeWidth="1.5" strokeDasharray="6 6" opacity="0.4" />
      <path
        d="M150 60 L220 90 V150 C220 195 190 225 150 240 C110 225 80 195 80 150 V90 Z"
        fill="currentColor"
        opacity="0.35"
      />
      <path
        d="M150 90 L195 108 V150 C195 178 175 198 150 210 C125 198 105 178 105 150 V108 Z"
        fill="currentColor"
        opacity="0.55"
      />
    </svg>
  );
}

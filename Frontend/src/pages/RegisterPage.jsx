import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const navigate = useNavigate();

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: connect to Node.js register endpoint
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-indigo-200 via-gray-00 to-gray-800 relative items-end p-10 overflow-hidden">
        <img src="/image.png" alt="Illustration" className="absolute inset-0 w-full h-full object-cover opacity-40 z-0" />
        <div className="relative z-10 text-white">
          <p className="font-bold text-lg">Siap Siaga</p>
          <p className="text-sm text-white/90 mt-2 max-w-xs leading-relaxed">
            Sistem Informasi Mitigasi Bencana Indonesia. Bergabung sekarang untuk akses peringatan dini dan informasi respons cepat.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center bg-white p-8">
        <form onSubmit={handleSubmit} className="w-full max-w-sm">
          <h2 className="text-xl font-bold text-gray-900">Daftar Akun Baru</h2>
          <p className="text-sm text-gray-500 mt-2">
            Silakan isi data di bawah untuk membuat akun dan mulai menggunakan sistem mitigasi bencana.
          </p>

          <Field label="Nama Lengkap">
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                required
                value={form.name}
                onChange={update('name')}
                placeholder="Nama lengkap Anda"
                className="input pl-9 pr-3"
              />
            </div>
          </Field>

          <Field label="Email">
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                required
                value={form.email}
                onChange={update('email')}
                placeholder="nama@email.com"
                className="input pl-9 pr-3"
              />
            </div>
          </Field>

          <Field label="Password">
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={form.password}
                onChange={update('password')}
                placeholder="Buat password"
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
          </Field>

          <Field label="Konfirmasi Password">
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showConfirm ? 'text' : 'password'}
                required
                value={form.confirmPassword}
                onChange={update('confirmPassword')}
                placeholder="Ketik ulang password"
                className="input pl-9 pr-9"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </Field>

          <button
            type="submit"
            className="w-full mt-7 bg-primary-700 hover:bg-primary-800 text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
          >
            Daftar Sekarang
          </button>

          <p className="text-center text-sm text-gray-500 mt-5">
            Sudah punya akun?{' '}
            <Link to="/login" className="text-primary-700 font-medium hover:underline">
              Masuk di sini
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="mt-5">
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

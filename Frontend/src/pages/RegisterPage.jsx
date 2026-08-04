import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <h1 className="text-center text-2xl font-extrabold text-brand-red">Siap Siaga</h1>
        <p className="text-center text-sm text-gray-500 mt-2 mb-6">
          Bergabunglah untuk mitigasi bencana yang lebih baik.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Nama Lengkap">
            <input
              required
              value={form.name}
              onChange={update('name')}
              placeholder="Masukkan nama lengkap Anda"
              className="input"
            />
          </Field>

          <Field label="Email">
            <input
              type="email"
              required
              value={form.email}
              onChange={update('email')}
              placeholder="Masukkan alamat email Anda"
              className="input"
            />
          </Field>

          <Field label="No Telepon">
            <input
              required
              value={form.phone}
              onChange={update('phone')}
              placeholder="Masukkan nomor telepon Anda"
              className="input"
            />
          </Field>

          <Field label="Alamat">
            <textarea
              required
              rows={2}
              value={form.address}
              onChange={update('address')}
              placeholder="Masukkan alamat lengkap Anda"
              className="input resize-none"
            />
          </Field>

          <Field label="Password">
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={form.password}
                onChange={update('password')}
                placeholder="Buat password"
                className="input pr-9"
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
              <input
                type={showConfirm ? 'text' : 'password'}
                required
                value={form.confirmPassword}
                onChange={update('confirmPassword')}
                placeholder="Ketik ulang password"
                className="input pr-9"
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
            className="w-full mt-2 bg-primary-700 hover:bg-primary-800 text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
          >
            Daftar Sekarang
          </button>

          <p className="text-center text-sm text-gray-500">
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
    <div>
      <label className="block text-xs font-semibold text-gray-700 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

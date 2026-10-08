import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, ArrowLeft, ShieldCheck } from 'lucide-react';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import OtpInput, { OTP_LENGTH } from '../components/OtpInput';

const RESEND_COOLDOWN = 60;

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('form'); // 'form' | 'otp'
  const [otp, setOtp] = useState('');
  const [cooldown, setCooldown] = useState(0);

  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const sendOtp = async () => {
    await authService.requestOtp({
      email: form.email.trim(),
      name: form.name.trim(),
      purpose: 'register',
    });
    setOtp('');
    setCooldown(RESEND_COOLDOWN);
  };

  const handleResend = async () => {
    if (cooldown > 0 || loading) return;
    setError('');
    setLoading(true);
    try {
      await sendOtp();
      Swal.fire({
        icon: 'success',
        title: 'Kode OTP Dikirim Ulang',
        text: `Cek kotak masuk ${form.email.trim()}.`,
        timer: 1800,
        showConfirmButton: false,
      });
    } catch (err) {
      setError(err.message || 'Gagal mengirim ulang kode OTP.');
    } finally {
      setLoading(false);
    }
  };

  const update = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validasi form client-side
    if (!form.name.trim() || !form.email.trim() || !form.password) {
      const msg = 'Semua kolom wajib diisi.';
      setError(msg);
      Swal.fire({
        icon: 'warning',
        title: 'Form Belum Lengkap',
        text: msg,
        confirmButtonColor: '#b91c1c',
      });
      return;
    }

    if (form.password.length < 6) {
      const msg = 'Password minimal terdiri dari 6 karakter.';
      setError(msg);
      Swal.fire({
        icon: 'warning',
        title: 'Password Kurang Panjang',
        text: msg,
        confirmButtonColor: '#b91c1c',
      });
      return;
    }

    if (form.password !== form.confirmPassword) {
      const msg = 'Konfirmasi password tidak cocok.';
      setError(msg);
      Swal.fire({
        icon: 'error',
        title: 'Password Tidak Cocok',
        text: msg,
        confirmButtonColor: '#b91c1c',
      });
      return;
    }

    setLoading(true);

    try {
      await sendOtp();
      setStep('otp');
    } catch (err) {
      const errorMsg = err.message || 'Gagal mengirim kode OTP.';
      setError(errorMsg);

      Swal.fire({
        icon: 'error',
        title: 'Gagal Mengirim OTP',
        text: errorMsg,
        confirmButtonColor: '#b91c1c',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');

    if (otp.length !== OTP_LENGTH) {
      setError(`Masukkan ${OTP_LENGTH} digit kode OTP.`);
      return;
    }

    setLoading(true);

    try {
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        confirmPassword: form.confirmPassword,
        otp,
      });

      // Tampilkan SweetAlert sukses registrasi
      await Swal.fire({
        icon: 'success',
        title: 'Registrasi Berhasil!',
        text: 'Akun Anda berhasil dibuat. Silakan login.',
        timer: 2000,
        showConfirmButton: false,
        timerProgressBar: true,
      });

      // Redirect ke login dengan replace true
      navigate('/login', {
        replace: true,
        state: {
          successMessage: 'Registrasi berhasil! Silakan masuk dengan akun baru Anda.',
          email: form.email.trim(),
        },
      });
    } catch (err) {
      const errorMsg = err.message || 'Terjadi kesalahan saat pendaftaran.';
      setError(errorMsg);

      Swal.fire({
        icon: 'error',
        title: 'Registrasi Gagal',
        text: errorMsg,
        confirmButtonColor: '#b91c1c',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-indigo-200 via-gray-800 to-gray-900 relative items-end p-10 overflow-hidden">
        <img src="/image.png" alt="Illustration" className="absolute inset-0 w-full h-full object-cover opacity-40 z-0" />
        <div className="relative z-10 text-white">
          <p className="font-bold text-lg">Siap Siaga</p>
          <p className="text-sm text-white/90 mt-2 max-w-xs leading-relaxed">
            Sistem Informasi Mitigasi Bencana Indonesia. Bergabung sekarang untuk akses peringatan dini dan informasi respons cepat.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center bg-white p-8">
        {step === 'otp' ? (
          <form onSubmit={handleVerify} className="w-full max-w-sm">
            <button
              type="button"
              onClick={() => {
                setStep('form');
                setError('');
              }}
              disabled={loading}
              className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1 mb-5 cursor-pointer"
            >
              <ArrowLeft size={14} /> Ubah data pendaftaran
            </button>

            <div className="w-12 h-12 rounded-full bg-primary-50 text-primary-700 flex items-center justify-center mb-4">
              <ShieldCheck size={22} />
            </div>

            <h2 className="text-xl font-bold text-gray-900">Verifikasi Email</h2>
            <p className="text-sm text-gray-500 mt-2">
              Masukkan {OTP_LENGTH} digit kode OTP yang telah kami kirim ke{' '}
              <span className="font-semibold text-gray-800">{form.email.trim()}</span>.
            </p>

            {error && (
              <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2 animate-in fade-in duration-200">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="mt-6">
              <OtpInput
                value={otp}
                onChange={(v) => {
                  setOtp(v);
                  if (error) setError('');
                }}
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== OTP_LENGTH}
              className="w-full mt-7 bg-primary-700 hover:bg-primary-800 disabled:opacity-70 text-white text-sm font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Memverifikasi...
                </>
              ) : (
                'Verifikasi & Daftar'
              )}
            </button>

            <p className="text-center text-sm text-gray-500 mt-5">
              Tidak menerima kode?{' '}
              {cooldown > 0 ? (
                <span className="text-gray-400">Kirim ulang dalam {cooldown} detik</span>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={loading}
                  className="text-primary-700 font-medium hover:underline cursor-pointer"
                >
                  Kirim ulang
                </button>
              )}
            </p>
          </form>
        ) : (
        <form onSubmit={handleSubmit} className="w-full max-w-sm">
          <h2 className="text-xl font-bold text-gray-900">Daftar Akun Baru</h2>
          <p className="text-sm text-gray-500 mt-2">
            Silakan isi data di bawah untuk membuat akun dan mulai menggunakan sistem mitigasi bencana.
          </p>

          {/* Alert Error */}
          {error && (
            <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2 animate-in fade-in duration-200">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <Field label="Nama Lengkap">
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                required
                value={form.name}
                onChange={update('name')}
                placeholder="Nama lengkap Anda"
                className="input pl-9 pr-3 w-full border border-gray-300 rounded-lg py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-700/20"
                disabled={loading}
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
                className="input pl-9 pr-3 w-full border border-gray-300 rounded-lg py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-700/20"
                disabled={loading}
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
                placeholder="Minimal 6 karakter"
                className="input pl-9 pr-9 w-full border border-gray-300 rounded-lg py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-700/20"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
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
                className="input pl-9 pr-9 w-full border border-gray-300 rounded-lg py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-700/20"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </Field>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-7 bg-primary-700 hover:bg-primary-800 disabled:opacity-70 text-white text-sm font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Mengirim Kode OTP...
              </>
            ) : (
              'Daftar Sekarang'
            )}
          </button>

          <p className="text-center text-sm text-gray-500 mt-5">
            Sudah punya akun?{' '}
            <Link to="/login" className="text-primary-700 font-medium hover:underline">
              Masuk di sini
            </Link>
          </p>
        </form>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

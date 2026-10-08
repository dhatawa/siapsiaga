import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, ArrowLeft, KeyRound } from 'lucide-react';
import Swal from 'sweetalert2';
import { authService } from '../services/authService';
import OtpInput, { OTP_LENGTH } from '../components/OtpInput';

const RESEND_COOLDOWN = 60;

export default function ForgotPasswordPage() {
  const [step, setStep] = useState('email'); // 'email' | 'reset'
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const sendOtp = async () => {
    setError('');
    setLoading(true);
    try {
      await authService.requestOtp({ email: email.trim(), purpose: 'reset_password' });
      setOtp('');
      setCooldown(RESEND_COOLDOWN);
      setStep('reset');
    } catch (err) {
      setError(err.message || 'Gagal mengirim kode OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Email wajib diisi.');
      return;
    }
    sendOtp();
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setError('');

    if (otp.length !== OTP_LENGTH) {
      setError(`Masukkan ${OTP_LENGTH} digit kode OTP.`);
      return;
    }
    if (newPassword.length < 6) {
      setError('Password baru minimal terdiri dari 6 karakter.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Konfirmasi password tidak cocok.');
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword({
        email: email.trim(),
        otp,
        newPassword,
        confirmPassword,
      });

      await Swal.fire({
        icon: 'success',
        title: 'Password Diperbarui!',
        text: 'Silakan masuk dengan password baru Anda.',
        timer: 2000,
        showConfirmButton: false,
        timerProgressBar: true,
      });

      navigate('/login', {
        replace: true,
        state: {
          successMessage: 'Password berhasil diatur ulang. Silakan masuk dengan password baru.',
          email: email.trim(),
        },
      });
    } catch (err) {
      setError(err.message || 'Gagal mengatur ulang password.');
    } finally {
      setLoading(false);
    }
  };

  const errorAlert = error && (
    <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2 animate-in fade-in duration-200">
      <AlertCircle size={16} className="shrink-0 mt-0.5" />
      <span>{error}</span>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Left illustration panel */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-indigo-200 via-gray-800 to-gray-900 relative items-end p-10 overflow-hidden">
        <img src="/image.png" alt="Illustration" className="absolute inset-0 w-full h-full object-cover opacity-40 z-0" />
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
        {step === 'email' ? (
          <form onSubmit={handleRequest} className="w-full max-w-sm">
            <Link to="/login" className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1 mb-5">
              <ArrowLeft size={14} /> Kembali ke halaman masuk
            </Link>

            <div className="w-12 h-12 rounded-full bg-primary-50 text-primary-700 flex items-center justify-center mb-4">
              <KeyRound size={22} />
            </div>

            <h2 className="text-xl font-bold text-gray-900">Lupa Password</h2>
            <p className="text-sm text-gray-500 mt-2">
              Masukkan email akun Anda. Kami akan mengirimkan kode OTP untuk mengatur ulang password.
            </p>

            {errorAlert}

            <label className="block text-sm font-medium text-gray-700 mt-6 mb-1.5">Alamat Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                required
                disabled={loading}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
                placeholder="nama@email.com"
                className="input pl-9 pr-3 w-full border border-gray-300 rounded-lg py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-700/20"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-7 bg-primary-700 hover:bg-primary-800 disabled:opacity-70 text-white text-sm font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Mengirim Kode OTP...
                </>
              ) : (
                'Kirim Kode OTP'
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleReset} className="w-full max-w-sm">
            <button
              type="button"
              onClick={() => {
                setStep('email');
                setError('');
              }}
              disabled={loading}
              className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1 mb-5 cursor-pointer"
            >
              <ArrowLeft size={14} /> Ubah email
            </button>

            <h2 className="text-xl font-bold text-gray-900">Atur Ulang Password</h2>
            <p className="text-sm text-gray-500 mt-2">
              Jika <span className="font-semibold text-gray-800">{email.trim()}</span> terdaftar,
              kode OTP telah dikirim ke email tersebut.
            </p>

            {errorAlert}

            <label className="block text-sm font-medium text-gray-700 mt-6 mb-1.5">Kode OTP</label>
            <OtpInput
              value={otp}
              onChange={(v) => {
                setOtp(v);
                if (error) setError('');
              }}
              disabled={loading}
            />

            <label className="block text-sm font-medium text-gray-700 mt-5 mb-1.5">Password Baru</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                disabled={loading}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
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

            <label className="block text-sm font-medium text-gray-700 mt-4 mb-1.5">Konfirmasi Password Baru</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                disabled={loading}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ketik ulang password baru"
                className="input pl-9 pr-3 w-full border border-gray-300 rounded-lg py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-700/20"
              />
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== OTP_LENGTH}
              className="w-full mt-7 bg-primary-700 hover:bg-primary-800 disabled:opacity-70 text-white text-sm font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Menyimpan...
                </>
              ) : (
                'Simpan Password Baru'
              )}
            </button>

            <p className="text-center text-sm text-gray-500 mt-5">
              Tidak menerima kode?{' '}
              {cooldown > 0 ? (
                <span className="text-gray-400">Kirim ulang dalam {cooldown} detik</span>
              ) : (
                <button
                  type="button"
                  onClick={sendOtp}
                  disabled={loading}
                  className="text-primary-700 font-medium hover:underline cursor-pointer"
                >
                  Kirim ulang
                </button>
              )}
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

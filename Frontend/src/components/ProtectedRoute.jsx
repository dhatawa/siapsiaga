import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Route Guard untuk memproteksi rute privat dan memeriksa hak akses role
 * @param {object} props
 * @param {Array<string>} [props.allowedRoles] - Daftar role yang diizinkan (misal: ['admin'] atau ['user'])
 * @param {React.ReactNode} props.children
 */
export default function ProtectedRoute({ allowedRoles, children }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Tampilkan loading screen saat verifikasi sesi berlangsung
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-10 h-10 border-4 border-gray-200 border-t-brand-red rounded-full mx-auto" />
          <p className="text-sm text-gray-500 mt-4 font-medium">Memverifikasi sesi...</p>
        </div>
      </div>
    );
  }

  // Jika belum login, redirect ke halaman login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Jika ada pembatasan role dan role user tidak sesuai
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Jika user biasa mencoba masuk ke admin -> redirect ke /dashboard
    if (user.role === 'user') {
      return <Navigate to="/dashboard" replace />;
    }
    // Jika admin mencoba masuk ke halaman user -> redirect ke /admin/dashboard
    if (user.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children;
}

import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Route Guard khusus untuk halaman publik seperti Login & Register.
 * Jika user sudah login, akan dialihkan ke dashboard sesuai rolenya dan tidak bisa back ke login/register.
 */
export default function PublicOnlyRoute({ children }) {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-gray-300 border-t-primary-700 rounded-full" />
      </div>
    );
  }

  if (isAuthenticated && user) {
    if (user.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Inisialisasi auth dari localStorage
  useEffect(() => {
    async function initAuth() {
      const stored = authService.getStoredAuth();
      if (stored.token && stored.user) {
        setToken(stored.token);
        setUser(stored.user);

        // Verifikasi token ke backend secara silent
        try {
          const res = await authService.getMe(stored.token);
          if (res.success && res.data?.user) {
            setUser(res.data.user);
            authService.saveAuth({ token: stored.token, user: res.data.user });
          }
        } catch (err) {
          console.warn('Token tidak valid atau telah kadaluarsa:', err.message);
          authService.clearAuth();
          setUser(null);
          setToken(null);
        }
      }
      setIsLoading(false);
    }

    initAuth();
  }, []);

  /**
   * Fungsi Login
   */
  const login = async (email, password) => {
    const res = await authService.login(email, password);
    if (res.success && res.data) {
      setUser(res.data.user);
      setToken(res.data.token);
      authService.saveAuth(res.data);
      return res.data;
    }
    throw new Error(res.message || 'Login gagal.');
  };

  /**
   * Fungsi Register
   */
  const register = async (formData) => {
    const res = await authService.register(formData);
    return res;
  };

  /**
   * Fungsi Logout
   */
  const logout = () => {
    authService.clearAuth();
    setUser(null);
    setToken(null);
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

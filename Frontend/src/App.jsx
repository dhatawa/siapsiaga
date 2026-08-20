import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import PublicOnlyRoute from './components/PublicOnlyRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardUser from './pages/DashboardUser';
import EdukasiTipsPage from './pages/EdukasiTipsPage';
import PanduanLengkapPage from './pages/PanduanLengkapPage';
import VideoTutorialPage from './pages/VideoTutorialPage';
import BeritaPage from './pages/BeritaPage';
import BeritaDetailPage from './pages/BeritaDetailPage';
import SensorDetailPage from './pages/SensorDetailPage';
import WeatherForecastPage from './pages/WeatherForecastPage';

import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminLokasi from './pages/admin/AdminLokasi';
import AdminLaporan from './pages/admin/AdminLaporan';
import AdminIoT from './pages/admin/AdminIoT';
import AdminPeringatan from './pages/admin/AdminPeringatan';
import AdminKonten from './pages/admin/AdminKonten';
import AdminLogSistem from './pages/admin/AdminLogSistem';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Landing & Info Pages */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/edukasi" element={<EdukasiTipsPage />} />
          <Route path="/edukasi/video" element={<VideoTutorialPage />} />
          <Route path="/edukasi/:slug" element={<PanduanLengkapPage />} />
          <Route path="/berita" element={<BeritaPage />} />
          <Route path="/berita/:id" element={<BeritaDetailPage />} />
          <Route path="/sensor/:sensorId" element={<SensorDetailPage />} />
          <Route path="/prediksi-cuaca" element={<WeatherForecastPage />} />

          {/* Public Only Pages (Cannot access when already logged in) */}
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <LoginPage />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicOnlyRoute>
                <RegisterPage />
              </PublicOnlyRoute>
            }
          />

          {/* Protected User Dashboard (Only for 'user' role) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <DashboardUser />
              </ProtectedRoute>
            }
          />

          {/* Protected Admin Panel (Strictly for 'admin' role) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="pengguna" element={<AdminUsers />} />
            <Route path="lokasi" element={<AdminLokasi />} />
            <Route path="laporan" element={<AdminLaporan />} />
            <Route path="iot" element={<AdminIoT />} />
            <Route path="peringatan" element={<AdminPeringatan />} />
            <Route path="konten" element={<AdminKonten />} />
            <Route path="log" element={<AdminLogSistem />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

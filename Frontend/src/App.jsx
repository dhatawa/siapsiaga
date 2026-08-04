import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardUser />} />
        <Route path="/edukasi" element={<EdukasiTipsPage />} />
        <Route path="/edukasi/video" element={<VideoTutorialPage />} />
        <Route path="/edukasi/:slug" element={<PanduanLengkapPage />} />
        <Route path="/berita" element={<BeritaPage />} />
        <Route path="/berita/:id" element={<BeritaDetailPage />} />
        <Route path="/sensor/:sensorId" element={<SensorDetailPage />} />
        <Route path="/prediksi-cuaca" element={<WeatherForecastPage />} />

        {/* Admin panel */}
        <Route path="/admin" element={<AdminLayout />}>
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
  );
}

export default App;

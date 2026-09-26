import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutGrid,
  Users,
  MapPin,
  AlertTriangle,
  Radio,
  FileText,
  BellRing,
  History,
  Megaphone,
  LogOut,
} from 'lucide-react';
import Swal from 'sweetalert2';
import { useAuth } from '../../context/AuthContext';

const menu = [
  { to: '/admin/dashboard', label: 'Dasboard', icon: LayoutGrid },
  { to: '/admin/pengguna', label: 'Pengguna', icon: Users },
  { to: '/admin/lokasi', label: 'Lokasi', icon: MapPin },
  { to: '/admin/laporan', label: 'Laporan', icon: AlertTriangle },
  { to: '/admin/iot', label: 'Kesehatan IoT', icon: Radio },
  { to: '/admin/konten', label: 'Konten', icon: FileText },
  { to: '/admin/peringatan', label: 'Peringatan', icon: BellRing },
  // { to: '/admin/log', label: 'Log Sistem', icon: History },
];

export default function AdminSidebar({ mobileOpen, onClose }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Konfirmasi Keluar',
      text: 'Apakah Anda yakin ingin keluar dari Panel Admin?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#b91c1c',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Ya, Keluar',
      cancelButtonText: 'Batal',
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      logout();
      await Swal.fire({
        icon: 'success',
        title: 'Berhasil Keluar',
        text: 'Anda telah keluar dari sesi Admin.',
        timer: 1500,
        showConfirmButton: false,
        timerProgressBar: true,
      });
      navigate('/login', { replace: true });
    }
  };

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 h-screen w-64 bg-white border-r border-gray-100 shadow-sm flex flex-col z-50 transition-transform lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="px-5 py-6">
          <p className="font-bold text-brand-red text-lg leading-tight">Panel Admin</p>
          <p className="text-xs text-gray-400 mt-0.5">Mitigasi Bencana</p>
        </div>

        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {menu.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-red text-white'
                    : 'text-gray-600 hover:bg-white'
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-100 space-y-2">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-500 hover:text-gray-800 transition cursor-pointer text-left"
          >
            <LogOut size={16} /> Keluar
          </button>
        </div>
      </aside>
    </>
  );
}

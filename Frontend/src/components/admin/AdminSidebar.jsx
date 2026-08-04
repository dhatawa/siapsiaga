import { NavLink, Link } from 'react-router-dom';
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

const menu = [
  { to: '/admin/dashboard', label: 'Dasbor', icon: LayoutGrid },
  { to: '/admin/pengguna', label: 'Pengguna', icon: Users },
  { to: '/admin/lokasi', label: 'Lokasi', icon: MapPin },
  { to: '/admin/laporan', label: 'Laporan', icon: AlertTriangle },
  { to: '/admin/iot', label: 'Kesehatan IoT', icon: Radio },
  { to: '/admin/konten', label: 'Konten', icon: FileText },
  { to: '/admin/peringatan', label: 'Peringatan', icon: BellRing },
  { to: '/admin/log', label: 'Log Sistem', icon: History },
];

export default function AdminSidebar({ mobileOpen, onClose }) {
  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 h-screen w-64 bg-primary-50/40 border-r border-gray-100 flex flex-col z-50 transition-transform lg:translate-x-0 ${
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
          <Link
            to="/admin/peringatan"
            className="flex items-center justify-center gap-2 bg-brand-red hover:bg-red-700 text-white text-xs font-semibold rounded-lg py-2.5"
          >
            <Megaphone size={14} /> Kirim Peringatan Darurat
          </Link>
          <Link
            to="/login"
            className="flex items-center gap-3 px-3 py-2 text-sm text-gray-500 hover:text-gray-800"
          >
            <LogOut size={16} /> Keluar
          </Link>
        </div>
      </aside>
    </>
  );
}

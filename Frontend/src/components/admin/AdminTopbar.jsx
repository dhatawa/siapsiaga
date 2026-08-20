import { useState } from 'react';
import { Search, Bell, Settings, Menu } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import NotificationDropdown from '../NotificationDropdown';
import { useAuth } from '../../context/AuthContext';

const placeholders = {
  '/admin/dashboard': 'Cari...',
  '/admin/pengguna': 'Cari pengguna berdasarkan nama...',
  '/admin/lokasi': 'Cari lokasi...',
  '/admin/laporan': 'Cari laporan...',
  '/admin/iot': 'Cari sensor...',
  '/admin/konten': 'Cari konten...',
  '/admin/peringatan': 'Cari sistem...',
  '/admin/log': 'Cari log...',
};

export default function AdminTopbar({ onMenuClick }) {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const placeholder = placeholders[pathname] || 'Cari...';
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const toggleNotification = () => {
    setIsNotificationOpen((prev) => !prev);
  };

  const initial = user?.name ? user.name.charAt(0).toUpperCase() : 'A';

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-100">
      <div className="h-16 px-4 md:px-6 flex items-center gap-4">
        <button onClick={onMenuClick} className="lg:hidden text-gray-500">
          <Menu size={20} />
        </button>

        <div className="relative flex-1 max-w-md">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={placeholder}
            className="w-full bg-gray-50 border border-gray-100 rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-700/20"
          />
        </div>

        <div className="ml-auto flex items-center gap-4">
          <div className="relative">
            <button className="relative text-gray-400 hover:text-gray-600" onClick={toggleNotification}>
              <Bell size={18} />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-brand-red" />
            </button>
            <NotificationDropdown isOpen={isNotificationOpen} />
          </div>
          <button className="text-gray-400 hover:text-gray-600">
            <Settings size={18} />
          </button>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-700 to-primary-800 text-white flex items-center justify-center text-xs font-semibold" title={user?.name || 'Admin'}>
            {initial}
          </div>
        </div>
      </div>
    </header>
  );
}

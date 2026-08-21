import { useState } from 'react';
import { Bell, Settings, Menu } from 'lucide-react';
import NotificationDropdown from '../NotificationDropdown';
import { useAuth } from '../../context/AuthContext';

export default function AdminTopbar({ onMenuClick }) {
  const { user } = useAuth();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const toggleNotification = () => {
    setIsNotificationOpen((prev) => !prev);
  };

  const initial = user?.name ? user.name.charAt(0).toUpperCase() : 'A';

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm">
      <div className="h-16 px-4 md:px-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button onClick={onMenuClick} className="lg:hidden text-gray-500 p-1.5 rounded-lg hover:bg-gray-100 transition">
            <Menu size={20} />
          </button>
        </div>

        <div className="ml-auto flex items-center gap-4">
          <div className="relative">
            <button className="relative text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-50 transition" onClick={toggleNotification} title="Notifikasi">
              <Bell size={18} />
              <span className="absolute 1 top-1 right-1 w-2 h-2 rounded-full" />
            </button>
            <NotificationDropdown isOpen={isNotificationOpen} />
          </div>
          <button className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-50 transition" title="Pengaturan">
            <Settings size={18} />
          </button>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-700 to-primary-800 text-white flex items-center justify-center text-xs font-semibold shadow-sm" title={user?.name || 'Admin'}>
            {initial}
          </div>
        </div>
      </div>
    </header>
  );
}

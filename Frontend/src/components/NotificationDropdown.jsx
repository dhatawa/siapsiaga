import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  Newspaper,
  GraduationCap,
  ShieldAlert,
  Zap,
  Info,
  CheckCheck,
  Loader2,
  BellOff,
  ChevronRight
} from 'lucide-react';
import { notificationService } from '../services/notificationService';

export default function NotificationDropdown({ isOpen, onClose, onNotificationRead }) {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('Semua');

  // Load notifications from API
  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await notificationService.getNotifications(35);
      setNotifications(data || []);
    } catch (err) {
      console.warn('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleMarkAllRead = async () => {
    await notificationService.markAllRead();
    if (onNotificationRead) onNotificationRead();
  };

  const handleItemClick = (item) => {
    if (onClose) onClose();
    if (item.link) {
      navigate(item.link);
    }
  };

  const filteredNotifications =
    activeTab === 'Semua'
      ? notifications
      : notifications.filter((n) => n.category === activeTab);

  const getIconComponent = (iconType) => {
    switch (iconType) {
      case 'Zap':
        return Zap;
      case 'AlertTriangle':
        return AlertTriangle;
      case 'ShieldAlert':
        return ShieldAlert;
      case 'Newspaper':
        return Newspaper;
      case 'GraduationCap':
        return GraduationCap;
      default:
        return Info;
    }
  };

  const tabs = ['Semua', 'Peringatan', 'Laporan', 'Berita', 'Edukasi'];

  return (
    <div className="absolute right-0 top-12 w-84 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-left">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100 bg-white">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-gray-900 text-sm">Pusat Notifikasi</h3>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-brand-red">
            {notifications.length}
          </span>
        </div>
        <button
          type="button"
          onClick={handleMarkAllRead}
          className="text-xs text-primary-700 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
        >
          <CheckCheck size={14} /> Tandai dibaca
        </button>
      </div>

      {/* Tabs Filter */}
      <div className="flex items-center gap-1 px-3 py-2 bg-gray-50/80 border-b border-gray-100 overflow-x-auto text-xs no-scrollbar">
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 rounded-lg font-semibold transition shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-brand-red text-white shadow-xs'
                  : 'text-gray-500 hover:bg-gray-200/60'
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Notification List */}
      <div className="max-h-[380px] overflow-y-auto divide-y divide-gray-50">
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center text-gray-400 gap-2">
            <Loader2 size={24} className="animate-spin text-brand-red" />
            <span className="text-xs">Memuat notifikasi terbaru...</span>
          </div>
        ) : filteredNotifications.length > 0 ? (
          filteredNotifications.map((item) => {
            const Icon = getIconComponent(item.iconType);
            return (
              <div
                key={item.id}
                onClick={() => handleItemClick(item)}
                className="p-3.5 hover:bg-gray-50/80 transition flex gap-3 text-left cursor-pointer group relative"
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${item.iconBg || 'bg-gray-100 text-gray-600'}`}
                >
                  <Icon size={17} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5 gap-2">
                    <span className="text-[10px] font-bold tracking-wider text-gray-500 uppercase truncate">
                      {item.type}
                    </span>
                    <span className="text-[10px] text-gray-400 shrink-0">{item.time}</span>
                  </div>
                  <h4 className="text-xs font-bold text-gray-900 leading-snug mb-1 group-hover:text-brand-red transition-colors line-clamp-1 flex items-center justify-between">
                    <span>{item.title}</span>
                    <ChevronRight size={13} className="text-gray-300 group-hover:text-brand-red transition-transform group-hover:translate-x-0.5 shrink-0 ml-1" />
                  </h4>
                  <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-2">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-12 text-center text-gray-400">
            <BellOff size={32} className="mx-auto mb-2 text-gray-300" />
            <p className="text-xs font-medium">Tidak ada notifikasi dalam kategori ini.</p>
          </div>
        )}
      </div>
    </div>
  );
}

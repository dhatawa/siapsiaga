import React from 'react';
import { AlertTriangle, Newspaper, GraduationCap, ShieldAlert } from 'lucide-react';

export default function NotificationDropdown({ isOpen }) {
  if (!isOpen) return null;

  const notifications = [
    {
      id: 1,
      type: 'LAPORAN BENCANA',
      title: 'Peringatan Dini: Potensi Banjir di Jakarta Selatan',
      desc: 'Curah hujan tinggi terdeteksi di hulu. Mohon segera amankan dokumen penting dan waspada',
      time: '2 mnt yang lalu',
      icon: AlertTriangle,
      iconBg: 'bg-red-100 text-red-600',
    },
    {
      id: 2,
      type: 'BERITA BARU',
      title: 'Update Terkini: Pemulihan Pasca Gempa di Cianjur',
      desc: 'Pemerintah daerah mulai mendistribusikan bahan bangunan untuk renovasi rumah warga.',
      time: '45 mnt yang lalu',
      icon: Newspaper,
      iconBg: 'bg-blue-100 text-blue-600',
    },
    {
      id: 3,
      type: 'EDUKASI BARU',
      title: 'Tips: Cara Menghadapi Gempa Saat di Gedung Tinggi',
      desc: 'Pelajari langkah-langkah krusial untuk menyelamatkan diri saat berada di perkantoran...',
      time: '2 jam yang lalu',
      icon: GraduationCap,
      iconBg: 'bg-sky-100 text-sky-600',
    },
    {
      id: 4,
      type: 'PESAN ADMIN',
      title: 'Pembaruan Sistem Aplikasi Siap Siaga v2.4',
      desc: 'Kami telah menambahkan fitur peta evakuasi real-time untuk meningkatkan keamanan Anda.',
      time: 'Kemarin',
      icon: ShieldAlert,
      iconBg: 'bg-indigo-100 text-indigo-600',
    },
  ];

  return (
    <div className="absolute right-0 top-12 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-in fade-in duration-150">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white">
        <h3 className="font-bold text-gray-800 text-sm">Notifikasi</h3>
        <button className="text-xs text-blue-600 font-medium hover:underline">
          Tandai semua dibaca
        </button>
      </div>

      <div className="max-h-[380px] overflow-y-auto divide-y divide-gray-50">
        {notifications.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.id} className="p-3.5 hover:bg-gray-50 transition flex gap-3 text-left cursor-pointer">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${item.iconBg}`}>
                <Icon size={16} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[10px] font-bold tracking-wider text-gray-500 uppercase">
                    {item.type}
                  </span>
                  <span className="text-[10px] text-gray-400">{item.time}</span>
                </div>
                <h4 className="text-xs font-semibold text-gray-800 leading-tight mb-1">
                  {item.title}
                </h4>
                <p className="text-[11px] text-gray-500 leading-snug line-clamp-2">
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
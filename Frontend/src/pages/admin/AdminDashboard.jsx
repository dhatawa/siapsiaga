import { Link } from 'react-router-dom';
import { Users, Radio, AlertTriangle, ShieldAlert, TrendingUp } from 'lucide-react';
import { dashboardStats, recentActivity } from '../../data/adminData';

const statIcons = [Users, Radio, AlertTriangle, ShieldAlert];

export default function AdminDashboard() {
  return (
    <div>
      <div className="flex items-start justify-between flex-wrap gap-2 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ringkasan Dasbor</h1>
          <p className="text-sm text-gray-500 mt-1">Pemantauan waktu nyata dan status sistem.</p>
        </div>
        <p className="text-xs text-gray-400">Terakhir diperbarui: <span className="text-primary-700 font-medium">Baru saja</span></p>
      </div>

      {/* Stat cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardStats.map((s, i) => {
          const Icon = statIcons[i];
          return (
            <div
              key={s.label}
              className={`rounded-xl border p-5 ${
                s.highlight ? 'bg-red-50 border-red-100' : 'bg-white border-gray-100 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className={`w-9 h-9 rounded-lg ${s.color} text-white flex items-center justify-center`}>
                  <Icon size={16} />
                </span>
                {s.badge && (
                  <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                    <TrendingUp size={11} /> {s.badge}
                  </span>
                )}
                {s.dot && (
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />
                  </span>
                )}
              </div>
              <p className={`text-2xl font-extrabold ${s.highlight ? 'text-brand-red' : 'text-gray-900'}`}>
                {s.value}
                {s.suffixInline && <span className="text-sm text-gray-400 font-medium ml-0.5">{s.suffix}</span>}
              </p>
              <p className={`text-xs mt-1 ${s.highlight ? 'text-red-500' : 'text-gray-400'}`}>{s.label}</p>
              {s.suffix && !s.suffixInline && (
                <p className="text-[11px] text-gray-400 mt-0.5">{s.suffix}</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Map + activity */}
      <div className="grid lg:grid-cols-[1.6fr_1fr] gap-5 mt-6">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-gray-800">Lokasi Pemantauan Aktif</p>
            <Link to="/admin/lokasi" className="text-xs text-primary-700 font-medium hover:underline">
              Lihat Peta Penuh →
            </Link>
          </div>
          <div className="h-72 rounded-lg bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center text-gray-300 text-sm">
            Peta Pemantauan (Leaflet / Google Maps)
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <p className="text-sm font-semibold text-gray-800 mb-4">Aktivitas Terbaru</p>
          <div className="space-y-4">
            {recentActivity.map((a) => (
              <div key={a.id} className="flex gap-3">
                <span className={`w-7 h-7 rounded-full ${a.color} flex items-center justify-center shrink-0`}>
                  <AlertTriangle size={13} />
                </span>
                <div>
                  <p className="text-xs text-gray-700 leading-relaxed">
                    <span className="font-semibold">{a.title}</span> {a.desc}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-1">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Radio, AlertTriangle, ShieldAlert, TrendingUp, Layers, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { recentActivity } from '../../data/adminData';
import DisasterMap from '../../components/DisasterMap';
import { userService } from '../../services/userService';
import { reportService } from '../../services/reportService';

export default function AdminDashboard() {
  const [statsData, setStatsData] = useState({
    totalUsers: '3',
    activeSensors: '5/5',
    pendingReports: '0',
    activeAlerts: '2'
  });

  useEffect(() => {
    async function loadStats() {
      try {
        const users = await userService.getUsers();
        const reportsRes = await reportService.getAdminReports();

        setStatsData({
          totalUsers: users.length.toString(),
          activeSensors: '4/5',
          pendingReports: (reportsRes.stats?.menunggu || 0).toString(),
          activeAlerts: (reportsRes.stats?.divalidasi || 0).toString()
        });
      } catch (err) {
        console.warn('Stats fetch fallback:', err);
      }
    }
    loadStats();
  }, []);

  const dynamicStats = [
    { label: 'Total Pengguna', value: statsData.totalUsers, icon: Users, color: 'bg-brand-red', badge: '+12%' },
    { label: 'Sensor IoT Aktif', value: statsData.activeSensors, icon: Radio, color: 'bg-primary-700', dot: true },
    { label: 'Laporan Menunggu Validasi', value: statsData.pendingReports, icon: Clock, color: 'bg-amber-600', highlight: parseInt(statsData.pendingReports) > 0 },
    { label: 'Peringatan & Insiden Aktif', value: statsData.activeAlerts, icon: ShieldAlert, color: 'bg-brand-red', highlight: true },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Ringkasan Dasbor</h1>
          <p className="text-sm text-gray-500 mt-1">Pemantauan waktu nyata kejadian bencana, sensor IoT, dan status sistem.</p>
        </div>
        <p className="text-xs text-gray-400">
          Terakhir diperbarui: <span className="text-primary-700 font-medium">Baru saja</span>
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {dynamicStats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className={`rounded-2xl border p-5 transition-all ${s.highlight ? 'bg-red-50/70 border-red-200' : 'bg-white border-gray-100 shadow-sm'
                }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className={`w-10 h-10 rounded-xl ${s.color} text-white flex items-center justify-center shadow-2xs`}>
                  <Icon size={18} />
                </span>
                {s.badge && (
                  <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full flex items-center gap-0.5">
                    <TrendingUp size={11} /> {s.badge}
                  </span>
                )}
                {s.dot && (
                  <span className="flex items-center gap-1 bg-gray-50 px-2 py-0.5 rounded-full border">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                    <span className="text-[10px] text-gray-500 font-medium">Aktif</span>
                  </span>
                )}
              </div>
              <p className={`text-2xl font-extrabold ${s.highlight ? 'text-brand-red' : 'text-gray-900'}`}>
                {s.value}
              </p>
              <p className={`text-xs mt-1 font-medium ${s.highlight ? 'text-red-700' : 'text-gray-500'}`}>{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* Map + Activity Grid */}
      <div className="grid lg:grid-cols-[1.65fr_1fr] gap-5">
        {/* Interactive Map Box */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-bold text-gray-900">Peta Pemantauan Wilayah & Titik Laporan</p>
              <p className="text-xs text-gray-400">Titik laporan warga masyarakat dan stasiun sensor IoT</p>
            </div>
            <Link to="/admin/lokasi" className="text-xs font-semibold text-primary-700 hover:underline">
              Lihat Peta Penuh →
            </Link>
          </div>

          <DisasterMap mode="admin" height="340px" />
        </div>

        {/* Recent Activity Feed */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-bold text-gray-900">Aktivitas Sistem Terbaru</p>
            <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">Realtime</span>
          </div>

          <div className="space-y-4">
            {recentActivity.map((a) => (
              <div key={a.id} className="flex gap-3 items-start pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                <span className={`w-8 h-8 rounded-xl ${a.color} flex items-center justify-center shrink-0 shadow-2xs`}>
                  <AlertTriangle size={14} />
                </span>
                <div className="min-w-0">
                  <p className="text-xs text-gray-800 leading-relaxed">
                    <span className="font-bold">{a.title}</span> {a.desc}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

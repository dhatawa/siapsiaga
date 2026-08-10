import { Filter, Share2, Radio, Wifi, WifiOff, AlertTriangle } from 'lucide-react';
import { iotSummary, iotSensors } from '../../data/adminData';

const statusStyles = {
  Kritis: { badge: 'bg-brand-red text-white', border: 'border-red-200', banner: 'bg-red-50 text-brand-red', icon: WifiOff },
  Peringatan: { badge: 'bg-yellow-400 text-gray-900', border: 'border-gray-100', banner: 'text-yellow-600', icon: AlertTriangle },
  Daring: { badge: 'bg-emerald-500 text-white', border: 'border-gray-100', banner: 'text-emerald-600', icon: Wifi },
};

export default function AdminIoT() {
  return (
    <div>
      <div className="flex items-start justify-between flex-wrap gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pemantauan Kesehatan IoT</h1>
          <p className="text-sm text-gray-500 mt-1">
            Status waktu nyata dari semua sensor lingkungan yang disebarkan.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 text-xs font-medium bg-white border border-gray-200 px-3.5 py-2 rounded-lg text-gray-700 hover:bg-gray-50">
            <Filter size={13} /> Saring
          </button>
          <button className="flex items-center gap-1.5 text-xs font-medium bg-brand-red hover:bg-red-700 text-white px-3.5 py-2 rounded-lg">
            <Share2 size={13} /> Segarkan Tabel
          </button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {iotSummary.map((s) => (
          <div
            key={s.label}
            className={`rounded-xl border p-4 ${s.highlight ? 'bg-red-50 border-red-100' : 'bg-white border-gray-100 shadow-sm'}`}
          >
            <p className="text-[11px] text-gray-400 uppercase tracking-wide">{s.label}</p>
            <p className={`text-2xl font-extrabold mt-1 ${s.color || 'text-gray-900'}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {iotSensors.map((sensor) => {
          const style = statusStyles[sensor.status];
          const StatusIcon = style.icon;
          return (
            <div key={sensor.id} className={`bg-white rounded-xl border ${style.border} shadow-sm p-4`}>
              <div className="flex items-start justify-between mb-2">
                <span className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-gray-50 text-primary-700 flex items-center justify-center">
                    <Radio size={14} />
                  </span>
                  <span>
                    <p className="text-xs font-bold text-gray-900">{sensor.id}</p>
                    <p className="text-[11px] text-gray-400">{sensor.type}</p>
                  </span>
                </span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${style.badge}`}>
                  {sensor.status}
                </span>
              </div>

              <p className={`text-xs flex items-center gap-1.5 mt-3 ${sensor.status === 'Daring' ? 'text-emerald-600' : style.banner}`}>
                <StatusIcon size={12} /> {sensor.issue}
              </p>

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50">
                <p className="text-[11px] text-gray-400">Detak Jantung Terakhir<br />{sensor.lastPing}</p>
                <button className="text-xs text-primary-700 font-medium hover:underline shrink-0">Detail →</button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center mt-6">
        <button className="text-sm font-medium text-primary-700 bg-primary-50 hover:bg-primary-100 px-5 py-2 rounded-lg">
          Muat Lebih Banyak Sensor
        </button>
      </div>
    </div>
  );
}

import { Plus, Pencil, Trash2, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { adminStations } from '../../data/adminData';

const statusColors = {
  green: 'bg-emerald-50 text-emerald-600',
  yellow: 'bg-yellow-50 text-yellow-600',
  gray: 'bg-gray-100 text-gray-500',
  red: 'bg-red-50 text-brand-red',
};

const dotColors = {
  green: 'bg-emerald-500',
  yellow: 'bg-yellow-500',
  gray: 'bg-gray-400',
  red: 'bg-red-500',
};

export default function AdminLokasi() {
  return (
    <div>
      <div className="flex items-start justify-between flex-wrap gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pemantauan Lokasi</h1>
          <p className="text-sm text-gray-500 mt-1">Kelola dan pantau stasiun sensor lingkungan aktif.</p>
        </div>
        <button className="flex items-center gap-1.5 text-xs font-medium bg-brand-red hover:bg-red-700 text-white px-3.5 py-2 rounded-lg">
          <Plus size={14} /> Tambah Lokasi Baru
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 mb-5">
        <div className="h-56 rounded-lg bg-gray-100 relative flex items-center justify-center text-center">
          <div className="bg-white/95 rounded-lg px-6 py-4 shadow-sm">
            <MapPin size={20} className="text-brand-red mx-auto mb-1" />
            <p className="text-sm font-semibold text-gray-800">Tampilan Peta Interaktif</p>
            <p className="text-xs text-gray-400 mt-1">Pilih stasiun di bawah untuk memfokuskan peta.</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] text-gray-400 uppercase tracking-wide border-b border-gray-100">
                <th className="px-4 py-3 font-medium">Nama Stasiun</th>
                <th className="px-4 py-3 font-medium">Wilayah</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Sinkronisasi Terakhir</th>
                <th className="px-4 py-3 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {adminStations.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50/60">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${dotColors[s.statusColor]}`} />
                      <div>
                        <p className="font-medium text-gray-800">{s.name}</p>
                        <p className="text-[11px] text-gray-400">Lat: {s.lat}, Lng: {s.lng}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{s.area}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${statusColors[s.statusColor]}`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{s.lastSync}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <button className="text-primary-700 hover:text-primary-800">
                        <Pencil size={14} />
                      </button>
                      <button className="text-brand-red hover:text-red-700">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 text-xs text-gray-400">
          <span>Menampilkan {adminStations.length} dari 5 lokasi</span>
          <div className="flex items-center gap-1">
            <button className="w-7 h-7 rounded-md border border-gray-200 flex items-center justify-center hover:bg-gray-50">
              <ChevronLeft size={13} />
            </button>
            <button className="w-7 h-7 rounded-md border border-gray-200 flex items-center justify-center hover:bg-gray-50">
              <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

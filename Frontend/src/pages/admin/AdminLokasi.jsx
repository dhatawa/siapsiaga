import { useState } from 'react';
import { Plus, Pencil, Trash2, ChevronLeft, ChevronRight, MapPin, Radio, Compass } from 'lucide-react';
import { adminStations } from '../../data/adminData';
import DisasterMap from '../../components/DisasterMap';

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
  const [selectedStation, setSelectedStation] = useState(null);

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Pemantauan Lokasi & Peta Sensor</h1>
          <p className="text-sm text-gray-500 mt-1">Kelola dan pantau stasiun sensor lingkungan aktif serta sebaran insiden.</p>
        </div>
        <button className="flex items-center gap-1.5 text-xs font-semibold bg-brand-red hover:bg-red-700 text-white px-4 py-2.5 rounded-xl shadow-sm transition">
          <Plus size={15} /> Tambah Lokasi Stasiun
        </button>
      </div>

      {/* Interactive Leaflet Map */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Radio size={16} className="text-brand-red" />
            <span className="text-xs font-bold text-gray-800">
              Peta Pemantauan Geografis {selectedStation ? `• Fokus: ${selectedStation.name}` : ''}
            </span>
          </div>
          <span className="text-[11px] text-gray-400">Klik baris tabel di bawah untuk memusatkan peta ke stasiun</span>
        </div>

        <DisasterMap
          mode="admin"
          height="380px"
          focusLocation={selectedStation ? { lat: parseFloat(selectedStation.lat), lng: parseFloat(selectedStation.lng) } : null}
        />
      </div>

      {/* Stations Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50/70 border-b border-gray-100 text-gray-400 uppercase font-semibold text-[10px] tracking-wider">
                <th className="px-5 py-3.5">Nama Stasiun</th>
                <th className="px-4 py-3.5">Wilayah</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">Sinkronisasi Terakhir</th>
                <th className="px-5 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {adminStations.map((s) => {
                const isSelected = selectedStation?.id === s.id;
                return (
                  <tr
                    key={s.id}
                    onClick={() => setSelectedStation(s)}
                    className={`hover:bg-gray-50/80 transition-colors cursor-pointer ${
                      isSelected ? 'bg-red-50/30' : ''
                    }`}
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <span className={`w-2.5 h-2.5 rounded-full ${dotColors[s.statusColor]} shrink-0`} />
                        <div>
                          <p className="font-bold text-gray-900">{s.name}</p>
                          <p className="text-[11px] text-gray-400 font-mono">
                            Lat: {s.lat}, Lng: {s.lng}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-gray-600 font-medium">{s.area}</td>
                    <td className="px-4 py-3.5">
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border ${statusColors[s.statusColor]}`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-gray-500">{s.lastSync}</td>
                    <td className="px-5 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedStation(s)}
                          className="p-1.5 rounded-lg text-primary-700 hover:bg-red-50 transition"
                          title="Fokuskan Peta"
                        >
                          <Compass size={15} />
                        </button>
                        <button className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition" title="Edit">
                          <Pencil size={15} />
                        </button>
                        <button className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition" title="Hapus">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100 text-xs text-gray-400 bg-gray-50/50">
          <span>Menampilkan {adminStations.length} lokasi stasiun pemantau</span>
          <div className="flex items-center gap-1">
            <button className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-100 text-gray-500">
              <ChevronLeft size={13} />
            </button>
            <button className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-100 text-gray-500">
              <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

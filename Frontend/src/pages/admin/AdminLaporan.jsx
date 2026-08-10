import { Eye, Trash2, ChevronDown, Droplets, Flame, Mountain } from 'lucide-react';
import { incidentReports } from '../../data/adminData';

const typeIcons = { Banjir: Droplets, Kebakaran: Flame, Longsor: Mountain };

const statusColors = {
  Menunggu: 'bg-yellow-50 text-yellow-600',
  Divalidasi: 'bg-blue-50 text-primary-700',
  Ditolak: 'bg-red-50 text-brand-red',
};

export default function AdminLaporan() {
  return (
    <div>
      <div className="flex items-start justify-between flex-wrap gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Laporan Insiden</h1>
          <p className="text-sm text-gray-500 mt-1">
            Kelola dan validasi laporan bencana yang dikirimkan pengguna.
          </p>
        </div>
        <button className="flex items-center gap-2 text-xs font-medium bg-white border border-gray-200 px-3.5 py-2 rounded-lg text-gray-600 hover:bg-gray-50">
          Semua Status <ChevronDown size={14} />
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] text-gray-400 uppercase tracking-wide border-b border-gray-100">
                <th className="px-4 py-3 font-medium">Pelapor</th>
                <th className="px-4 py-3 font-medium">Jenis Insiden</th>
                <th className="px-4 py-3 font-medium">Lokasi</th>
                <th className="px-4 py-3 font-medium">Tanggal & Waktu</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {incidentReports.map((r) => {
                const TypeIcon = typeIcons[r.type];
                return (
                  <tr key={r.id} className="hover:bg-gray-50/60">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className={`w-8 h-8 rounded-full ${r.avatarColor} text-white text-xs font-semibold flex items-center justify-center shrink-0`}>
                          {r.initials}
                        </span>
                        <div>
                          <p className="font-medium text-gray-800">{r.name}</p>
                          <p className="text-[11px] text-gray-400">{r.contact}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1.5 text-xs text-gray-600">
                        <TypeIcon size={13} className="text-primary-600" /> {r.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{r.location}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{r.datetime}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${statusColors[r.status]}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <button className="text-primary-700 hover:text-primary-800">
                          <Eye size={15} />
                        </button>
                        <button className="text-brand-red hover:text-red-700">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 text-xs text-gray-400">
          <span>Menampilkan 1-{incidentReports.length} dari 45 laporan</span>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Download, UserPlus, Search, SlidersHorizontal, ChevronLeft, ChevronRight, MoreVertical } from 'lucide-react';
import { adminUsers } from '../../data/adminData';

export default function AdminUsers() {
  const [query, setQuery] = useState('');

  const filtered = adminUsers.filter((u) =>
    u.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-start justify-between flex-wrap gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Pengguna</h1>
          <p className="text-sm text-gray-500 mt-1">
            Kelola pengguna terdaftar, perbarui profil, dan pantau status akun.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 text-xs font-medium bg-white border border-gray-200 px-3.5 py-2 rounded-lg text-gray-700 hover:bg-gray-50">
            <Download size={14} /> Ekspor
          </button>
          <button className="flex items-center gap-1.5 text-xs font-medium bg-brand-red hover:bg-red-700 text-white px-3.5 py-2 rounded-lg">
            <UserPlus size={14} /> Tambah Pengguna
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between gap-3 p-4 border-b border-gray-100 flex-wrap">
          <div className="relative flex-1 min-w-[220px] max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari pengguna berdasarkan nama..."
              className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-xs outline-none focus:ring-2 focus:ring-primary-700/20"
            />
          </div>
          <div className="flex items-center gap-2">
            <select className="text-xs border border-gray-200 rounded-lg px-3 py-2 text-gray-600 outline-none">
              <option>Semua Status</option>
              <option>Aktif</option>
              <option>Tidak Aktif</option>
            </select>
            <button className="border border-gray-200 rounded-lg p-2 text-gray-400 hover:bg-gray-50">
              <SlidersHorizontal size={14} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] text-gray-400 uppercase tracking-wide border-b border-gray-100">
                <th className="px-4 py-3 font-medium">Nama Pengguna</th>
                <th className="px-4 py-3 font-medium">Alamat</th>
                <th className="px-4 py-3 font-medium">Jenis Kelamin</th>
                <th className="px-4 py-3 font-medium">Umur</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50/60">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className={`w-8 h-8 rounded-full ${u.avatarColor} text-white text-xs font-semibold flex items-center justify-center shrink-0`}>
                        {u.initials}
                      </span>
                      <div>
                        <p className="font-medium text-gray-800">{u.name}</p>
                        <p className="text-[11px] text-gray-400">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{u.address}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{u.gender}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{u.age}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${
                        u.status === 'Aktif'
                          ? 'bg-blue-50 text-primary-700'
                          : 'bg-red-50 text-brand-red'
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreVertical size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 text-xs text-gray-400">
          <span>Menampilkan 1 sampai {filtered.length} dari 42 entri</span>
          <div className="flex items-center gap-1">
            <button className="w-7 h-7 rounded-md border border-gray-200 flex items-center justify-center disabled:opacity-40" disabled>
              <ChevronLeft size={13} />
            </button>
            <button className="w-7 h-7 rounded-md bg-brand-red text-white flex items-center justify-center">1</button>
            <button className="w-7 h-7 rounded-md border border-gray-200 flex items-center justify-center hover:bg-gray-50">2</button>
            <button className="w-7 h-7 rounded-md border border-gray-200 flex items-center justify-center hover:bg-gray-50">3</button>
            <span className="px-1">...</span>
            <button className="w-7 h-7 rounded-md border border-gray-200 flex items-center justify-center hover:bg-gray-50">
              <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

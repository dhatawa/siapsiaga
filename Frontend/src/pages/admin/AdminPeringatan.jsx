import { useState } from 'react';
import { Info, AlertTriangle, Zap, MapPin, Megaphone } from 'lucide-react';
import { alertTargetAreas, alertLevels, recentBroadcasts } from '../../data/adminData';

const levelIcons = { info: Info, peringatan: AlertTriangle, bahaya: Zap };

export default function AdminPeringatan() {
  const [selectedAreas, setSelectedAreas] = useState(['Jakarta Pusat']);
  const [level, setLevel] = useState('bahaya');
  const [message, setMessage] = useState('');

  const toggleArea = (area) => {
    setSelectedAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  };

  return (
    <div>
      <h1 className="text-lg font-bold text-brand-red mb-6">Pusat Pengiriman Peringatan</h1>

      <div className="grid lg:grid-cols-[1.6fr_1fr] gap-5">
        {/* Left: form */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">

          <p className="text-xs font-semibold text-gray-600 mb-2">Tingkat Peringatan</p>
          <div className="grid grid-cols-3 gap-2 mb-5">
            {alertLevels.map(({ key, label }) => {
              const Icon = levelIcons[key];
              const active = level === key;
              const activeStyle =
                key === 'bahaya'
                  ? 'bg-brand-red border-brand-red text-white'
                  : key === 'peringatan'
                  ? 'bg-yellow-400 border-yellow-400 text-gray-900'
                  : 'bg-primary-700 border-primary-700 text-white';
              return (
                <button
                  key={key}
                  onClick={() => setLevel(key)}
                  className={`flex flex-col items-center gap-1.5 border rounded-lg py-3 text-xs font-medium transition-colors ${
                    active ? activeStyle : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={16} />
                  {label}
                </button>
              );
            })}
          </div>

          <p className="text-xs font-semibold text-gray-600 mb-2">Pesan Peringatan (SMS & Push)</p>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value.slice(0, 160))}
            rows={4}
            maxLength={160}
            placeholder="Masukkan instruksi darurat di sini..."
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-700/20 resize-none"
          />
          <div className="flex items-center justify-between mt-1.5 mb-6">
            <span className="text-[11px] text-gray-400">{message.length}/160 karakter</span>
            <button className="text-[11px] text-primary-700 font-medium hover:underline">Gunakan Template</button>
          </div>

          <button className="w-full bg-brand-red hover:bg-red-700 text-white text-sm font-semibold py-3 rounded-lg flex items-center justify-center gap-2">
            <Megaphone size={16} /> KIRIM PERINGATAN DARURAT
          </button>
        </div>

        {/* Right: preview + history */}
        <div className="flex flex-col gap-5">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <p className="text-sm font-semibold text-gray-800 flex items-center gap-1.5 mb-3">
              <MapPin size={14} className="text-primary-700" /> Pratinjau Zona Dampak
            </p>
            <div className="h-40 rounded-lg bg-gradient-to-br from-red-50 to-gray-100 flex items-center justify-center text-gray-300 text-xs">
              Peta Zona Dampak
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-gray-800">Pengiriman Terbaru</p>
              <button className="text-xs text-primary-700 font-medium hover:underline">Lihat Semua</button>
            </div>
            <div className="space-y-4">
              {recentBroadcasts.map((b) => (
                <div key={b.id}>
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${b.levelColor}`}>{b.level}</span>
                    <span className="text-[11px] text-gray-400">{b.time}</span>
                  </div>
                  <p className="text-xs font-medium text-gray-800 mt-1.5">{b.title}</p>
                  <p className="text-[11px] text-gray-400">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

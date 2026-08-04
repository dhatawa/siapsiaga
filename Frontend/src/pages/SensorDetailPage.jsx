import { useState } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { ChevronDown, Thermometer, Droplets, Sparkles } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import DashboardNavbar from '../components/DashboardNavbar';
import DashboardFooter from '../components/DashboardFooter';
import { sensors, sensorChartData, forecast24h, forecast7d } from '../data/cuacaData';

const rangeOptions = ['Hari Ini', '7 Hari Terakhir', '30 Hari Terakhir'];

export default function SensorDetailPage() {
  const { sensorId } = useParams();
  const sensor = sensors[sensorId];
  const [range, setRange] = useState('Hari Ini');
  const [rangeOpen, setRangeOpen] = useState(false);

  if (!sensor) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <DashboardNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        <div className="text-xs text-gray-400 mb-4">
          <Link to="/dashboard" className="hover:underline">Home</Link>
          <span className="mx-1.5">›</span>
          <span className="text-gray-600">Detail Sensor ({sensor.name.match(/\(([^)]+)\)/)?.[0]?.slice(1, -1) ?? sensor.id})</span>
        </div>

        <div className="grid lg:grid-cols-[1fr_320px] gap-6">
          {/* Main */}
          <div className="flex flex-col gap-5">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-start justify-between flex-wrap gap-3">
                <div>
                  <h1 className="text-lg font-bold text-gray-900">{sensor.name}</h1>
                  <p className="text-xs text-gray-400 mt-1">Update Terakhir: {sensor.updatedAt}</p>
                </div>

                <div className="relative">
                  <button
                    onClick={() => setRangeOpen((v) => !v)}
                    className="flex items-center gap-2 text-xs border border-gray-200 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-50"
                  >
                    {range} <ChevronDown size={14} />
                  </button>
                  {rangeOpen && (
                    <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-100 rounded-lg shadow-lg z-10 overflow-hidden">
                      {rangeOptions.map((r) => (
                        <button
                          key={r}
                          onClick={() => {
                            setRange(r);
                            setRangeOpen(false);
                          }}
                          className="w-full text-left text-xs px-3 py-2 hover:bg-gray-50 text-gray-600"
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-5">
                <div className="bg-red-50 rounded-lg p-4 flex items-center gap-3">
                  <span className="w-9 h-9 rounded-lg bg-brand-red text-white flex items-center justify-center">
                    <Thermometer size={16} />
                  </span>
                  <div>
                    <p className="text-[11px] text-gray-500 uppercase">Suhu</p>
                    <p className="text-xl font-bold text-gray-900">{sensor.suhu}</p>
                  </div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 flex items-center gap-3">
                  <span className="w-9 h-9 rounded-lg bg-primary-700 text-white flex items-center justify-center">
                    <Droplets size={16} />
                  </span>
                  <div>
                    <p className="text-[11px] text-gray-500 uppercase">Kelembapan</p>
                    <p className="text-xl font-bold text-gray-900">{sensor.kelembapan}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 mt-6 mb-2 text-[11px] text-gray-500">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-brand-red inline-block" /> Suhu (°C)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-primary-700 inline-block" /> Kelembapan (%)
                </span>
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sensorChartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Line type="monotone" dataKey="suhu" stroke="#C81E2C" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="kelembapan" stroke="#1E40AF" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* AI Recommendation */}
            <div className="bg-white rounded-xl border-l-4 border-brand-red shadow-sm p-5 flex gap-3">
              <span className="w-8 h-8 rounded-lg bg-brand-red text-white flex items-center justify-center shrink-0">
                <Sparkles size={15} />
              </span>
              <div>
                <p className="text-sm font-semibold text-gray-900 mb-1">Rekomendasi Siap Siaga AI</p>
                <p className="text-xs text-gray-500 leading-relaxed italic">"{sensor.recommendation}"</p>
                <Link to="/edukasi/banjir" className="text-xs text-primary-700 font-medium hover:underline mt-2 inline-block">
                  Pelajari Lebih Lanjut →
                </Link>
              </div>
            </div>
          </div>

          {/* Sidebar - Prediksi Cuaca */}
          <aside className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 h-fit">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-gray-800">Prediksi Cuaca</p>
              <Link to="/prediksi-cuaca" className="text-xs text-primary-700 font-medium hover:underline">
                Detail →
              </Link>
            </div>

            <p className="text-[11px] text-gray-400 mb-2">24 Jam Kedepan</p>
            <div className="grid grid-cols-3 gap-2 text-center bg-blue-50 rounded-lg p-3 mb-5">
              {forecast24h.map(({ time, icon: Icon, temp }) => (
                <div key={time}>
                  <p className="text-[10px] text-gray-400">{time}</p>
                  <Icon size={18} className="mx-auto my-1 text-primary-600" />
                  <p className="text-xs font-semibold text-gray-700">{temp}</p>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-gray-400 mb-2">7 Hari Kedepan</p>
            <div className="space-y-3">
              {forecast7d.map(({ day, date, icon: Icon, range: r }) => (
                <div key={day} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 text-gray-600">
                    <Icon size={15} className="text-primary-600" /> {day}
                  </span>
                  <span className="text-gray-400">{r}</span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </main>

      <DashboardFooter />
    </div>
  );
}

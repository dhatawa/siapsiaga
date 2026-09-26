import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ChevronDown, ChevronUp, Wind, Droplets } from 'lucide-react';
import DashboardNavbar from '../components/DashboardNavbar';
import DashboardFooter from '../components/DashboardFooter';
import PageWithChatbot from '../components/PageWithChatbot';
import { hourlyForecast, weeklyForecastDetail } from '../data/cuacaData';

export default function WeatherForecastPage() {
  const [expanded, setExpanded] = useState(weeklyForecastDetail[0]?.day ?? null);

  return (
    <PageWithChatbot>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <DashboardNavbar />

        <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        <div className="text-xs text-gray-400 mb-4">
          <Link to="/dashboard" className="hover:underline">Home</Link>
          <span className="mx-1.5">›</span>
          <span className="text-gray-600">Detail Prediksi Cuaca</span>
        </div>

        {/* AI recommendation banner */}
        <div className="bg-brand-red text-white rounded-xl p-5 flex items-start gap-3">
          <AlertTriangle size={20} className="shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold flex items-center gap-2">
              Rekomendasi Siap Siaga AI
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-medium">TERUPDATE</span>
            </p>
            <p className="text-xs text-white/90 mt-1.5 leading-relaxed">
              Musim hujan telah tiba. Pastikan saluran air bersih, siapkan tas siaga bencana, dan
              pantau tinggi muka air sungai secara berkala.
            </p>
          </div>
        </div>

        {/* Hourly forecast */}
        <div className="mt-8">
          <h2 className="text-sm font-semibold text-gray-800 mb-3">Prediksi Per Jam</h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {hourlyForecast.map((h, i) => (
              <div
                key={h.time}
                className={`shrink-0 w-20 rounded-lg border p-3 text-center ${
                  i === 0 ? 'border-primary-700 bg-blue-50' : 'border-gray-100 bg-white'
                }`}
              >
                <p className={`text-[11px] ${i === 0 ? 'text-primary-700 font-medium' : 'text-gray-400'}`}>
                  {h.time}
                </p>
                <h.icon size={20} className="mx-auto my-2 text-primary-600" />
                <p className="text-sm font-bold text-gray-900">{h.temp}</p>
                <p className="text-[10px] text-gray-400 flex items-center justify-center gap-0.5 mt-1">
                  <Droplets size={10} /> {h.rain}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 7-day forecast */}
        <div className="mt-8">
          <h2 className="text-sm font-semibold text-gray-800 mb-3">Prediksi 7 Hari Kedepan</h2>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm divide-y divide-gray-100">
            {weeklyForecastDetail.map((d) => {
              const isOpen = expanded === d.day;
              return (
                <div key={d.day}>
                  <button
                    onClick={() => setExpanded(isOpen ? null : d.day)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left"
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-gray-800 w-16">{d.day}</span>
                      <span className="text-xs text-gray-400">{d.date}</span>
                      <d.icon size={18} className="text-primary-600" />
                    </span>
                    <span className="flex items-center gap-4">
                      <span className="text-sm text-gray-600">{d.range}</span>
                      {isOpen ? (
                        <ChevronUp size={16} className="text-gray-400" />
                      ) : (
                        <ChevronDown size={16} className="text-gray-400" />
                      )}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-4 flex items-center gap-6 text-xs text-gray-500">
                      <span className="flex items-center gap-1.5">
                        <Droplets size={13} className="text-primary-600" /> Curah Hujan: {d.rain}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Wind size={13} className="text-primary-600" /> Angin: {d.wind}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <DashboardFooter />
    </div>
  </PageWithChatbot>
  );
}

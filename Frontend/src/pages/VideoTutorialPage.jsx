import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';
import DashboardNavbar from '../components/DashboardNavbar';
import DashboardFooter from '../components/DashboardFooter';
import { videos, videoCategories } from '../data/edukasiData';

export default function VideoTutorialPage() {
  const [activeCategory, setActiveCategory] = useState('Semua');

  const filtered =
    activeCategory === 'Semua' ? videos : videos.filter((v) => v.category === activeCategory);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <DashboardNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        <Link to="/edukasi" className="text-xs text-primary-700 hover:underline">
          ← Kembali ke Edukasi & Tips
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 mt-3">Video Tutorial Mitigasi</h1>
        <p className="text-sm text-gray-500 mt-1">
          Pelajari teknik mitigasi bencana melalui panduan visual langkah demi langkah.
        </p>

        <div className="flex items-center gap-6 mt-6 border-b border-gray-200">
          {videoCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-sm pb-3 -mb-px border-b-2 transition-colors ${
                activeCategory === cat
                  ? 'border-brand-red text-brand-red font-medium'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
          {filtered.map((v) => (
            <div key={v.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="relative h-40 bg-gray-200 flex items-center justify-center">
                <span className={`absolute top-2 left-2 text-[10px] font-semibold text-white px-2 py-0.5 rounded ${v.categoryColor} uppercase`}>
                  {v.category}
                </span>
                <span className="absolute bottom-2 right-2 text-[10px] font-medium text-white bg-black/60 px-1.5 py-0.5 rounded">
                  {v.duration}
                </span>
                <span className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow">
                  <Play size={16} className="ml-0.5 text-gray-700" />
                </span>
              </div>
              <div className="p-4">
                <p className="text-[11px] text-gray-400">{v.date}</p>
                <p className="text-sm font-semibold text-gray-900 mt-1">{v.title}</p>
                <p className="text-xs text-gray-500 mt-1.5 leading-relaxed line-clamp-2">{v.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-8">
          <button className="text-sm font-medium text-primary-700 bg-primary-50 hover:bg-primary-100 px-5 py-2 rounded-lg">
            Muat Lebih Banyak
          </button>
        </div>
      </main>

      <DashboardFooter />
    </div>
  );
}

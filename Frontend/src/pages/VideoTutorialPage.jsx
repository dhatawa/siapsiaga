import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Play,
  ArrowLeft,
  Video as VideoIcon,
  X,
  Calendar,
  Layers,
  Loader2,
  Sparkles,
  Film
} from 'lucide-react';
import DashboardNavbar from '../components/DashboardNavbar';
import DashboardFooter from '../components/DashboardFooter';
import PageWithChatbot from '../components/PageWithChatbot';
import { videos as fallbackVideos, videoCategories as defaultCategories } from '../data/edukasiData';
import { contentService } from '../services/contentService';

export default function VideoTutorialPage() {
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [dbVideos, setDbVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePlayingVideo, setActivePlayingVideo] = useState(null);

  useEffect(() => {
    async function loadVideos() {
      try {
        setLoading(true);
        const data = await contentService.getPublicContents({ type: 'video' });
        setDbVideos(data || []);
      } catch (err) {
        console.error('Failed to load dynamic videos:', err);
      } finally {
        setLoading(false);
      }
    }
    loadVideos();
  }, []);

  const allVideos = dbVideos.length > 0 ? dbVideos : fallbackVideos;

  // Extract unique categories
  const categories = [
    'Semua',
    ...Array.from(new Set(allVideos.map((v) => v.category).filter(Boolean)))
  ];

  const filtered =
    activeCategory === 'Semua'
      ? allVideos
      : allVideos.filter((v) => v.category === activeCategory);

  const getYoutubeEmbedUrl = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}?autoplay=1` : null;
  };

  const getCategoryBadgeClass = (category = '') => {
    const cat = category.toLowerCase();
    if (cat.includes('gempa')) return 'bg-red-600 text-white';
    if (cat.includes('banjir')) return 'bg-blue-600 text-white';
    if (cat.includes('kebakaran')) return 'bg-orange-600 text-white';
    if (cat.includes('tsunami')) return 'bg-indigo-600 text-white';
    return 'bg-gray-800 text-white';
  };

  return (
    <PageWithChatbot>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <DashboardNavbar />

        <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
          {/* Back Navigation */}
          <Link
            to="/edukasi"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-700 hover:text-red-700 bg-white border border-gray-200 px-3.5 py-2 rounded-xl shadow-2xs hover:bg-gray-50 transition mb-4"
          >
            <ArrowLeft size={14} /> Kembali ke Edukasi & Tips
          </Link>

          {/* Header Title */}
          <div className="flex items-start justify-between flex-wrap gap-4 mt-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                  <Film size={22} />
                </span>
                <h1 className="text-2xl font-bold text-gray-900">Video Tutorial Mitigasi</h1>
              </div>
              <p className="text-sm text-gray-500 mt-1 max-w-2xl ml-10">
                Pelajari teknik mitigasi dan simulasi keselamatan bencana melalui panduan visual interaktif langkah demi langkah.
              </p>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-2 border-b border-gray-200">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-xs font-semibold px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
                  activeCategory === cat
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Video Cards Grid */}
          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center bg-white rounded-2xl border border-gray-100 shadow-sm mt-6">
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-3" />
              <p className="text-xs text-gray-500 font-medium">Memuat galeri video tutorial...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200 p-8 mt-6">
              <VideoIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-gray-900">Belum Ada Video pada Kategori Ini</h3>
              <p className="text-xs text-gray-500 mt-1">
                Silakan pilih kategori lain atau periksa kembali nanti.
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {filtered.map((v) => (
                <div
                  key={v.id}
                  onClick={() => setActivePlayingVideo(v)}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col cursor-pointer group"
                >
                  {/* Thumbnail / Video Preview Area */}
                  <div className="relative h-48 bg-gradient-to-br from-gray-900 to-indigo-950 flex items-center justify-center overflow-hidden">
                    {v.thumbnail_url ? (
                      <img
                        src={v.thumbnail_url}
                        alt={v.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : null}

                    {/* Dark Overlay with Play Icon */}
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/25 transition-colors flex items-center justify-center">
                      <span className="w-12 h-12 rounded-full bg-white/90 shadow-lg flex items-center justify-center text-gray-900 group-hover:scale-110 transition-transform">
                        <Play size={20} className="ml-1 fill-gray-900" />
                      </span>
                    </div>

                    {/* Top Category Badge */}
                    <span
                      className={`absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-sm ${getCategoryBadgeClass(
                        v.category
                      )}`}
                    >
                      {v.category}
                    </span>

                    {/* Duration / Source Badge */}
                    <span className="absolute bottom-3 right-3 text-[10px] font-semibold text-white bg-black/70 backdrop-blur px-2 py-0.5 rounded-md">
                      {v.duration || 'Video Tutorial'}
                    </span>
                  </div>

                  {/* Video Info Body */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] text-gray-400">
                        {v.updated_at || v.created_at
                          ? new Date(v.updated_at || v.created_at).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })
                          : v.date || 'SiapSiaga Video'}
                      </span>

                      <h3 className="text-sm font-bold text-gray-900 mt-1 line-clamp-2 leading-snug group-hover:text-indigo-600 transition-colors">
                        {v.title}
                      </h3>

                      <p className="text-xs text-gray-500 mt-1.5 leading-relaxed line-clamp-2">
                        {v.body || v.desc || 'Tonton simulasi dan panduan pencegahan bencana.'}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-600 flex items-center gap-1 group-hover:underline">
                        <Play size={12} className="fill-indigo-600" /> Putar Video
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

        <DashboardFooter />
      </div>

      {/* Interactive Video Player Modal */}
      {activePlayingVideo && (
        <div
          onClick={() => setActivePlayingVideo(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 flex flex-col max-h-[90vh]"
          >
            {/* Modal Header */}
            <div className="px-6 py-4 bg-gray-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-indigo-600 uppercase">
                  {activePlayingVideo.category}
                </span>
                <h3 className="text-sm font-bold text-gray-100 truncate max-w-md">
                  {activePlayingVideo.title}
                </h3>
              </div>
              <button
                onClick={() => setActivePlayingVideo(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Video Screen */}
            <div className="bg-black aspect-video w-full flex items-center justify-center">
              {activePlayingVideo.video_url && getYoutubeEmbedUrl(activePlayingVideo.video_url) ? (
                <iframe
                  src={getYoutubeEmbedUrl(activePlayingVideo.video_url)}
                  title={activePlayingVideo.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : activePlayingVideo.video_url ? (
                <video
                  src={activePlayingVideo.video_url}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-center p-8 text-white/70">
                  <Play size={36} className="mx-auto mb-2 text-white/50" />
                  <p className="text-sm">Video sedang dalam proses pembaruan oleh administrator.</p>
                </div>
              )}
            </div>

            {/* Video Description Section */}
            <div className="p-6 overflow-y-auto">
              <h2 className="text-base font-bold text-gray-900">{activePlayingVideo.title}</h2>
              <p className="text-xs text-gray-500 mt-1">
                Kategori: <span className="font-semibold text-gray-700">{activePlayingVideo.category}</span>
              </p>
              <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-700 leading-relaxed whitespace-pre-line">
                {activePlayingVideo.body || activePlayingVideo.desc || 'Video simulasi tanggap bencana resmi dari Tim SiapSiaga.'}
              </div>
            </div>
          </div>
        </div>
      )}
    </PageWithChatbot>
  );
}

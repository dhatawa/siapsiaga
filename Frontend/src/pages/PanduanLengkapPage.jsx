import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  CheckCircle2,
  PhoneCall,
  ArrowLeft,
  Calendar,
  User,
  Share2,
  Bookmark,
  Loader2,
  FileText,
  ShieldCheck,
  AlertTriangle,
  Info
} from 'lucide-react';
import Swal from 'sweetalert2';
import DashboardNavbar from '../components/DashboardNavbar';
import DashboardFooter from '../components/DashboardFooter';
import PageWithChatbot from '../components/PageWithChatbot';
import { guides } from '../data/edukasiData';
import { contentService } from '../services/contentService';

export default function PanduanLengkapPage() {
  const { slug } = useParams();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchDetail() {
      try {
        setLoading(true);
        // Cek ke MySQL database
        const dbData = await contentService.getContentBySlug(slug);
        if (dbData) {
          setContent({
            isFromDb: true,
            title: dbData.title,
            category: dbData.category,
            body: dbData.body,
            thumbnail_url: dbData.thumbnail_url,
            author_name: dbData.author_name || 'Tim SiapSiaga',
            updated_at: dbData.updated_at || dbData.created_at,
            type: dbData.type,
            video_url: dbData.video_url
          });
          return;
        }
      } catch (err) {
        // Jika tidak ada di DB, coba fallback dari data lokal
        const localGuide = guides[slug];
        if (localGuide) {
          setContent({
            isFromDb: false,
            title: localGuide.fullTitle,
            category: localGuide.title,
            body: localGuide.fullDesc,
            tips: localGuide.tips,
            prevention: localGuide.prevention,
            pass: localGuide.pass,
            author_name: 'Pusat Mitigasi SiapSiaga',
            updated_at: new Date()
          });
          return;
        }
      } finally {
        setLoading(false);
      }
    }

    fetchDetail();
  }, [slug]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: content?.title || 'Panduan Edukasi SiapSiaga',
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      Swal.fire({
        icon: 'success',
        title: 'Tautan Disalin',
        text: 'Tautan panduan berhasil disalin ke clipboard.',
        timer: 1500,
        showConfirmButton: false
      });
    }
  };

  const getEmergencyContact = (category = '') => {
    const cat = category.toLowerCase();
    if (cat.includes('kebakaran')) return { number: '113', label: 'Pemadam Kebakaran' };
    if (cat.includes('banjir') || cat.includes('gempa') || cat.includes('tsunami'))
      return { number: '115 / 117', label: 'Basarnas & BNPB' };
    return { number: '112', label: 'Layanan Panggilan Darurat Terpadu' };
  };

  return (
    <PageWithChatbot>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <DashboardNavbar />

        <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
          {/* Breadcrumb / Back Button */}
          <div className="flex items-center justify-between gap-4 mb-4">
            <Link
              to="/edukasi"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-700 hover:text-red-700 bg-white border border-gray-200 px-3.5 py-2 rounded-xl shadow-2xs hover:bg-gray-50 transition"
            >
              <ArrowLeft size={14} /> Kembali ke Edukasi & Tips
            </Link>

            {content && (
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 px-3.5 py-2 rounded-xl shadow-2xs hover:bg-gray-50 transition"
              >
                <Share2 size={13} /> {copied ? 'Tautan Disalin!' : 'Bagikan Panduan'}
              </button>
            )}
          </div>

          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center bg-white rounded-2xl border border-gray-100 shadow-sm my-6">
              <Loader2 className="w-8 h-8 text-brand-red animate-spin mb-3" />
              <p className="text-xs text-gray-500 font-medium">Memuat materi panduan lengkap...</p>
            </div>
          ) : !content ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200 p-8 my-6">
              <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
              <h2 className="text-lg font-bold text-gray-900">Panduan Tidak Ditemukan</h2>
              <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto mb-5">
                Materi edukasi yang Anda cari mungkin sedang dalam tahap pembaruan atau telah dialihkan.
              </p>
              <Link
                to="/edukasi"
                className="inline-flex items-center gap-1.5 text-xs font-semibold bg-brand-red text-white px-4 py-2.5 rounded-xl hover:bg-red-700 transition"
              >
                Jelajahi Panduan Lainnya
              </Link>
            </div>
          ) : (
            <>
              {/* Header Title Section */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-bold px-3 py-1 rounded-lg bg-red-50 text-brand-red border border-red-200 uppercase tracking-wider">
                    {content.category}
                  </span>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Calendar size={13} />
                    {new Date(content.updated_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
                  {content.title}
                </h1>

                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
                  <div className="w-6 h-6 rounded-full bg-brand-red/10 text-brand-red flex items-center justify-center font-bold text-[10px]">
                    <User size={12} />
                  </div>
                  <span>Diverifikasi oleh: <strong className="text-gray-700">{content.author_name}</strong></span>
                </div>
              </div>

              {/* Main Content & Sidebar Grid */}
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Left / Main Content Body */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
                    {/* Thumbnail if Available */}
                    {content.thumbnail_url && (
                      <div className="rounded-xl overflow-hidden mb-6 bg-gray-100 max-h-96 border border-gray-100 shadow-sm">
                        <img
                          src={content.thumbnail_url}
                          alt={content.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Text Body */}
                    {content.body && (
                      <div className="text-gray-800 text-sm leading-relaxed whitespace-pre-line space-y-4 font-normal">
                        {content.body}
                      </div>
                    )}

                    {/* Structured PASS steps for fallback/pre-configured guide */}
                    {content.pass && (
                      <div className="mt-8 pt-6 border-t border-gray-100">
                        <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <ShieldCheck size={18} className="text-brand-red" /> Metode T.A.T.A (P.A.S.S)
                        </h3>
                        <div className="grid sm:grid-cols-2 gap-3.5">
                          {content.pass.map((step) => (
                            <div key={step.title} className="flex gap-3 bg-gray-50/80 rounded-xl p-3.5 border border-gray-100">
                              <span className="w-8 h-8 rounded-xl bg-brand-red text-white text-xs font-bold flex items-center justify-center shrink-0 shadow-2xs">
                                {step.letter}
                              </span>
                              <div>
                                <p className="text-xs font-bold text-gray-900">{step.title}</p>
                                <p className="text-[11px] text-gray-600 mt-1 leading-relaxed">{step.desc}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Quick Tips */}
                    {content.tips && content.tips.length > 0 && (
                      <div className="mt-8 pt-6 border-t border-gray-100">
                        <h3 className="text-sm font-bold text-gray-900 mb-3">Tips Penting</h3>
                        <div className="grid sm:grid-cols-2 gap-3">
                          {content.tips.map((t) => (
                            <div key={t.title} className="bg-red-50/40 border border-red-100 rounded-xl p-3.5">
                              <p className="text-xs font-bold text-gray-900">{t.title}</p>
                              <p className="text-[11px] text-gray-600 mt-1 leading-relaxed">{t.desc}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Sidebar */}
                <div className="space-y-5">
                  {/* Prevention Tips Box if available */}
                  {content.prevention && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                      <p className="text-sm font-bold text-brand-red flex items-center gap-2 mb-4">
                        <ShieldCheck size={16} /> Langkah Pencegahan Utama
                      </p>
                      <div className="space-y-3.5">
                        {content.prevention.map((p) => (
                          <div key={p.title} className="flex gap-2.5">
                            <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                            <div>
                              <p className="text-xs font-bold text-gray-800">{p.title}</p>
                              <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">{p.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Emergency Hotline Card */}
                  <div className="bg-gradient-to-br from-red-600 to-rose-700 rounded-2xl shadow-sm p-6 text-center text-white">
                    <span className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center mx-auto mb-3">
                      <PhoneCall size={20} className="text-white" />
                    </span>
                    <p className="text-xs text-white/80 font-medium">Nomor Panggilan Darurat</p>
                    <p className="text-3xl font-extrabold tracking-tight mt-1">
                      {getEmergencyContact(content.category).number}
                    </p>
                    <p className="text-xs text-white/90 mt-1 font-medium">
                      {getEmergencyContact(content.category).label}
                    </p>
                    <a
                      href={`tel:${getEmergencyContact(content.category).number.split('/')[0].trim()}`}
                      className="mt-4 block w-full bg-white text-brand-red font-bold text-xs py-2.5 rounded-xl hover:bg-gray-100 transition shadow-sm"
                    >
                      Hubungi Sekarang
                    </a>
                  </div>

                  {/* Education Navigation Link */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <p className="text-xs font-bold text-gray-800 mb-2">Ingin belajar lebih lanjut?</p>
                    <p className="text-[11px] text-gray-500 mb-3.5">
                      Lihat simulasi visual dan video tutorial teknik penyelamatan diri.
                    </p>
                    <Link
                      to="/edukasi/video"
                      className="block text-center text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 p-2.5 rounded-xl transition"
                    >
                      Tonton Video Tutorial Mitigasi →
                    </Link>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>

        <DashboardFooter />
      </div>
    </PageWithChatbot>
  );
}

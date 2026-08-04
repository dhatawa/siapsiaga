import { useParams, Link, Navigate } from 'react-router-dom';
import { CheckCircle2, PhoneCall } from 'lucide-react';
import DashboardNavbar from '../components/DashboardNavbar';
import DashboardFooter from '../components/DashboardFooter';
import { guides } from '../data/edukasiData';

export default function PanduanLengkapPage() {
  const { slug } = useParams();
  const guide = guides[slug];

  if (!guide) return <Navigate to="/edukasi" replace />;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <DashboardNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        <Link to="/edukasi" className="text-xs text-primary-700 hover:underline">
          ← Kembali ke Edukasi & Tips
        </Link>

        <h1 className="text-2xl font-bold text-brand-red mt-3">{guide.fullTitle}</h1>
        <p className="text-sm text-gray-500 mt-2 max-w-2xl">{guide.fullDesc}</p>

        <div className="grid lg:grid-cols-3 gap-5 mt-6">
          {/* Left / main content */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            {guide.imageCaption !== false && (
              <>
                <p className="text-sm font-semibold text-gray-800 mb-3">
                  Cara Menggunakan Alat Pemadam Api Ringan (APAR)
                </p>
                <div className="border border-gray-100 rounded-lg h-64 bg-gray-50 flex items-center justify-center text-gray-300 text-xs mb-2">
                  Ilustrasi langkah penggunaan APAR
                </div>
              </>
            )}

            {guide.pass && (
              <>
                <p className="text-sm font-semibold text-gray-800 mt-6 mb-3">
                  Metode T.A.T.A (P.A.S.S)
                </p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {guide.pass.map((step) => (
                    <div key={step.title} className="flex gap-3 bg-gray-50 rounded-lg p-3">
                      <span className="w-7 h-7 rounded-full bg-brand-red text-white text-xs font-bold flex items-center justify-center shrink-0">
                        {step.letter}
                      </span>
                      <div>
                        <p className="text-xs font-semibold text-gray-800">{step.title}</p>
                        <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {!guide.pass && guide.tips && guide.tips.length > 0 && (
              <div className="grid sm:grid-cols-2 gap-3">
                {guide.tips.map((t) => (
                  <div key={t.title} className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-gray-800">{t.title}</p>
                    <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">{t.desc}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <div className="flex flex-col gap-5">
            {guide.prevention && (
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <p className="text-sm font-semibold text-brand-red flex items-center gap-1.5 mb-4">
                  Tips Pencegahan
                </p>
                <div className="space-y-4">
                  {guide.prevention.map((p) => (
                    <div key={p.title} className="flex gap-2">
                      <CheckCircle2 size={15} className="text-primary-700 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-gray-800">{p.title}</p>
                        <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">{p.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 text-center">
              <span className="w-9 h-9 rounded-full bg-red-50 text-brand-red flex items-center justify-center mx-auto mb-2">
                <PhoneCall size={16} />
              </span>
              <p className="text-xs text-gray-500">Darurat?</p>
              <p className="text-2xl font-extrabold text-brand-red mt-1">113</p>
              <p className="text-[11px] text-gray-400 mt-1">Pemadam Kebakaran</p>
            </div>
          </div>
        </div>
      </main>

      <DashboardFooter />
    </div>
  );
}

import { useState } from 'react';
import { Plus, Pencil, Trash2, ChevronDown, Play, FileText } from 'lucide-react';
import { contentItems, contentTabs } from '../../data/adminData';

export default function AdminKonten() {
  const [activeTab, setActiveTab] = useState('Semua Konten');

  const filtered =
    activeTab === 'Semua Konten'
      ? contentItems
      : contentItems.filter((c) =>
          activeTab === 'Panduan Edukasi' ? c.type === 'article' : c.type === 'video'
        );

  return (
    <div>
      <div className="flex items-start justify-between flex-wrap gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Konten</h1>
          <p className="text-sm text-gray-500 mt-1">
            Kelola panduan edukasi dan sumber video untuk kesadaran publik.
          </p>
        </div>
        <button className="flex items-center gap-1.5 text-xs font-medium bg-brand-red hover:bg-red-700 text-white px-3.5 py-2 rounded-lg">
          <Plus size={14} /> Buat Baru
        </button>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
        <div className="flex items-center gap-6 border-b border-gray-200">
          {contentTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-sm pb-3 -mb-px border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-brand-red text-brand-red font-medium'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <button className="flex items-center gap-2 text-xs font-medium bg-white border border-gray-200 px-3 py-1.5 rounded-lg text-gray-600 hover:bg-gray-50">
          Semua Status <ChevronDown size={13} />
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((c) => (
          <div key={c.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="relative h-32 bg-gray-100 flex items-center justify-center text-gray-300">
              <span
                className={`absolute top-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded ${
                  c.status === 'DISTRIBUSIKAN' ? 'bg-primary-700 text-white' : 'bg-gray-500 text-white'
                }`}
              >
                {c.status}
              </span>
              {c.type === 'video' ? (
                <span className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center">
                  <Play size={15} className="ml-0.5 text-gray-700" />
                </span>
              ) : (
                <FileText size={22} />
              )}
            </div>
            <div className="p-4">
              <p className={`text-[11px] font-medium ${c.categoryColor}`}>{c.category}</p>
              <p className="text-sm font-semibold text-gray-900 mt-1 leading-snug">{c.title}</p>
              <div className="flex items-center justify-between mt-3">
                <p className="text-[11px] text-gray-400">{c.updated}</p>
                <div className="flex items-center gap-2.5">
                  <button className="text-primary-700 hover:text-primary-800">
                    <Pencil size={13} />
                  </button>
                  <button className="text-brand-red hover:text-red-700">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        <button className="border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 py-10 text-gray-400 hover:border-primary-300 hover:text-primary-600 transition-colors">
          <span className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center">
            <Plus size={18} />
          </span>
          <span className="text-sm font-medium">Tambah Konten Baru</span>
          <span className="text-xs">Sumber Artikel atau Video</span>
        </button>
      </div>
    </div>
  );
}

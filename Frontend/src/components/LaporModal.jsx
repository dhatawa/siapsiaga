import React from 'react';
import { X, UploadCloud } from 'lucide-react';

export default function LaporModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
        {/* Header Modal */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div>
            <h3 className="text-base font-bold text-gray-800">Siap Siaga Lapor</h3>
            <p className="text-xs text-gray-500">Silakan laporkan bencana atau keadaan lingkungan</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form className="space-y-4 mt-4" onSubmit={(e) => e.preventDefault()}>
          {/* File Upload Dropzone */}
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-red-400 transition cursor-pointer bg-gray-50/50">
            <UploadCloud className="mx-auto text-gray-400 mb-2" size={32} />
            <p className="text-xs text-gray-700 font-medium">
              <span className="text-red-700 font-semibold hover:underline">Click to upload</span> or drag and drop
            </p>
            <p className="text-[10px] text-gray-400 mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</p>
          </div>

          {/* Input Kejadian */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Kejadian <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <select className="w-full text-xs bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-gray-600 focus:outline-none focus:ring-1 focus:ring-red-500">
                <option value="">Pilih Jenis Bencana</option>
                <option value="banjir">Banjir</option>
                <option value="gempa">Gempa Bumi</option>
                <option value="kebakaran">Kebakaran</option>
                <option value="longsor">Tanah Longsor</option>
                <option value="angin">Angin Kencang</option>
              </select>
              <input
                type="text"
                placeholder="Isi Ringkasan"
                className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>
          </div>

          {/* Input Deskripsi */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Deskripsi (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="Jelaskan Secara detail kejadian"
              className="w-full text-xs border border-gray-200 rounded-lg p-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-red-500 resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-medium text-white bg-red-800 hover:bg-red-900 rounded-lg shadow-sm transition"
            >
              Confirm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
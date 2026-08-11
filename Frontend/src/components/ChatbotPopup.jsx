import { useState } from 'react';
import { X, MessageSquare, Mic, Smile, Send } from 'lucide-react';

const suggestions = [
  'Apa Persiapan saya pada cuaca saat ini?',
  'Bagaimana cara menghadapi banjir?',
];

export default function ChatbotPopup({ open, onClose }) {
  const [message, setMessage] = useState('');

  if (!open) return null;

  return (
    <div className="fixed bottom-24 right-6 w-[340px] max-w-[90vw] bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden z-50">
      {/* Header */}
      <div className="bg-brand-red text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <MessageSquare size={16} />
          </div>
          <div>
            <p className="text-sm font-semibold leading-tight">Siap Siaga AI</p>
            <p className="text-[11px] flex items-center gap-1 text-white/90">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
              ONLINE
            </p>
          </div>
        </div>
        <button onClick={onClose} className="hover:opacity-80">
          <X size={18} />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 min-h-[280px] flex flex-col items-center justify-center px-6 text-center gap-3 py-8">
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
          <MessageSquare size={22} />
        </div>
        <p className="text-sm font-semibold text-gray-800">Halo, saya Siap Siaga AI</p>
        <p className="text-xs text-gray-500 leading-relaxed">
          Asisten cerdas Anda untuk kesiapsiagaan bencana. Ada yang bisa saya bantu hari ini?
        </p>
      </div>

      {/* Suggestions */}
      <div className="flex flex-wrap gap-2 px-3 pb-3">
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={() => setMessage(s)}
            className="text-[11px] bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full px-3 py-1.5 text-left"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="border-t border-gray-100 p-2 flex items-center gap-2">
        <button className="text-gray-400 hover:text-gray-600 p-1">
          <Mic size={18} />
        </button>
        <button className="text-gray-400 hover:text-gray-600 p-1">
          <Smile size={18} />
        </button>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          type="text"
          placeholder="Tulis pesan Anda di sini..."
          className="flex-1 text-sm outline-none px-1 py-1.5"
        />
        <button className="bg-brand-red text-white p-2 rounded-lg hover:bg-red-700">
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}

export function ChatbotToggleButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-brand-red text-white shadow-lg hover:bg-red-700 z-40"
    >
      <span className="absolute inset-0 rounded-full bg-brand-red/20 animate-ping" />
      <span className="absolute inset-0 rounded-full border border-white/20" />
      <span className="relative z-10 flex items-center justify-center w-full h-full">
        <MessageSquare size={20} />
      </span>
    </button>
  );
}

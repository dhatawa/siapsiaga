import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Mic, Smile, Send, Square, Maximize2, RotateCcw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import SiagaBotIcon from './SiagaBotIcon';

// URL aplikasi chatbot Next.js (folder /Chatbot)
import { CHATBOT_URL } from '../config';

const suggestions = [
  'Apa Persiapan saya pada cuaca saat ini?',
  'Bagaimana cara menghadapi banjir?',
];

/** Render teks jawaban: pertahankan baris baru dan ubah **tebal** menjadi <strong>. */
function FormattedText({ text }) {
  return text.split('\n').map((line, i) => (
    <p key={i} className={line.trim() ? '' : 'h-2'}>
      {line.split(/(\*\*[^*]+\*\*)/g).map((part, j) =>
        part.startsWith('**') && part.endsWith('**') ? (
          <strong key={j}>{part.slice(2, -2)}</strong>
        ) : (
          part.replace(/^#{1,6}\s+/, '')
        )
      )}
    </p>
  ));
}

export default function ChatbotPopup({ open, onClose }) {
  const { token, isAuthenticated, logout } = useAuth();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState('');
  const abortRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, open]);

  const sendMessage = async (text) => {
    const content = text.trim();
    if (!content || isStreaming || !token) return;

    setError('');
    setMessage('');
    const history = [...messages, { role: 'user', content }];
    setMessages([...history, { role: 'assistant', content: '' }]);
    setIsStreaming(true);

    const controller = new AbortController();
    abortRef.current = controller;

    const updateAnswer = (answer) =>
      setMessages((prev) => {
        const next = [...prev];
        next[next.length - 1] = { role: 'assistant', content: answer };
        return next;
      });

    try {
      const res = await fetch(`${CHATBOT_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ messages: history }),
        signal: controller.signal,
      });

      if (res.status === 401) {
        logout();
        throw new Error('Sesi Anda telah berakhir. Silakan login kembali.');
      }
      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || 'Gagal mendapatkan jawaban.');
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let answer = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        answer += decoder.decode(value, { stream: true });
        updateAnswer(answer);
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message || 'Tidak dapat terhubung ke layanan chatbot.');
      }
      // Buang balasan kosong jika gagal sebelum ada teks
      setMessages((prev) =>
        prev[prev.length - 1]?.content === '' ? prev.slice(0, -1) : prev
      );
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
    }
  };

  const resetChat = () => {
    abortRef.current?.abort();
    setMessages([]);
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(message);
  };

  return (
    <div
      inert={!open}
      aria-hidden={!open}
      className={`fixed bottom-24 right-6 w-[340px] max-w-[90vw] bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden z-50 origin-bottom-right chat-popup ${
        open ? 'chat-popup-open' : 'chat-popup-closed'
      }`}
    >
      {/* Header */}
      <div className="bg-brand-red text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center chat-avatar">
            <SiagaBotIcon size={26} />
          </div>
          <div>
            <p className="text-sm font-semibold leading-tight">Siap Siaga AI</p>
            <p className="text-[11px] flex items-center gap-1 text-white/90">
              <span className="relative flex w-1.5 h-1.5">
                <span className="absolute inset-0 rounded-full bg-green-400 animate-ping" />
                <span className="relative w-1.5 h-1.5 rounded-full bg-green-400" />
              </span>
              {isStreaming ? 'MENGETIK...' : 'ONLINE'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isAuthenticated && messages.length > 0 && (
            <button onClick={resetChat} className="hover:opacity-80" title="Percakapan baru">
              <RotateCcw size={16} />
            </button>
          )}
          {isAuthenticated && (
            <a
              href={`${CHATBOT_URL}/#token=${encodeURIComponent(token)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80"
              title="Buka layar penuh"
            >
              <Maximize2 size={16} />
            </a>
          )}
          <button onClick={onClose} className="hover:opacity-80" title="Tutup">
            <X size={18} />
          </button>
        </div>
      </div>

      {!isAuthenticated ? (
        /* Belum login */
        <div className="flex-1 min-h-[280px] flex flex-col items-center justify-center px-6 text-center gap-3 py-8 chat-fade-up">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center chat-float">
            <SiagaBotIcon size={44} />
          </div>
          <p className="text-sm font-semibold text-gray-800">Login untuk memakai Siap Siaga AI</p>
          <p className="text-xs text-gray-500 leading-relaxed">
            Asisten informasi bencana alam hanya tersedia untuk pengguna yang sudah masuk.
          </p>
          <Link
            to="/login"
            onClick={onClose}
            className="mt-1 bg-brand-red text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Masuk
          </Link>
        </div>
      ) : (
        <>
          {/* Body */}
          {messages.length === 0 ? (
            <div className="flex-1 min-h-[280px] flex flex-col items-center justify-center px-6 text-center gap-3 py-8 chat-fade-up">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center chat-float">
                <SiagaBotIcon size={44} />
              </div>
              <p className="text-sm font-semibold text-gray-800">Halo, saya Siap Siaga AI</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                Asisten cerdas Anda untuk kesiapsiagaan bencana. Ada yang bisa saya bantu hari ini?
              </p>
            </div>
          ) : (
            <div className="h-[340px] max-h-[55vh] overflow-y-auto px-3 py-3 space-y-3">
              {messages.map((m, i) =>
                m.role === 'user' ? (
                  <div key={i} className="flex justify-end chat-msg-user">
                    <div className="max-w-[85%] bg-brand-red text-white text-sm rounded-2xl rounded-br-sm px-3 py-2 whitespace-pre-wrap break-words">
                      {m.content}
                    </div>
                  </div>
                ) : (
                  <div key={i} className="flex justify-start chat-msg-bot">
                    <div className="max-w-[90%] bg-gray-100 text-gray-800 text-sm rounded-2xl rounded-bl-sm px-3 py-2 break-words space-y-0.5">
                      {m.content ? (
                        <>
                          <FormattedText text={m.content} />
                          {isStreaming && i === messages.length - 1 && <span className="chat-caret" />}
                        </>
                      ) : (
                        <span className="flex gap-1 py-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" />
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:150ms]" />
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:300ms]" />
                        </span>
                      )}
                    </div>
                  </div>
                )
              )}
              <div ref={bottomRef} />
            </div>
          )}

          {error && (
            <p className="mx-3 mb-2 text-[11px] text-brand-red bg-red-50 rounded-lg px-3 py-2 chat-shake">{error}</p>
          )}

          {/* Suggestions */}
          {messages.length === 0 && (
            <div className="flex flex-wrap gap-2 px-3 pb-3">
              {suggestions.map((s, i) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  style={{ animationDelay: `${150 + i * 90}ms` }}
                  className="text-[11px] bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full px-3 py-1.5 text-left chat-fade-up transition-transform hover:-translate-y-0.5"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleSubmit} className="border-t border-gray-100 p-2 flex items-center gap-2">
            <button type="button" className="text-gray-400 hover:text-gray-600 p-1">
              <Mic size={18} />
            </button>
            <button type="button" className="text-gray-400 hover:text-gray-600 p-1">
              <Smile size={18} />
            </button>
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              type="text"
              maxLength={4000}
              placeholder="Tulis pesan Anda di sini..."
              className="flex-1 text-sm outline-none px-1 py-1.5"
            />
            {isStreaming ? (
              <button
                type="button"
                onClick={() => abortRef.current?.abort()}
                className="bg-gray-200 text-gray-700 p-2 rounded-lg hover:bg-gray-300"
                title="Berhenti"
              >
                <Square size={16} />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!message.trim()}
                className="bg-brand-red text-white p-2 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-transform active:scale-90 enabled:hover:-rotate-12"
                title="Kirim"
              >
                <Send size={16} />
              </button>
            )}
          </form>
        </>
      )}
    </div>
  );
}

export function ChatbotToggleButton({ onClick, open = false }) {
  return (
    <button
      onClick={onClick}
      aria-label={open ? 'Tutup chatbot' : 'Buka chatbot'}
      className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-white border-2 border-brand-red text-brand-red shadow-lg shadow-red-200/60 hover:bg-red-50 z-40 transition-transform duration-200 hover:scale-110 active:scale-95"
    >
      {!open && <span className="absolute inset-0 rounded-full bg-brand-red/15 animate-ping" />}
      <span className="relative z-10 flex items-center justify-center w-full h-full">
        <span className={`absolute chat-toggle-icon ${open ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'}`}>
          <SiagaBotIcon size={42} className="chat-float" />
        </span>
        <span className={`absolute chat-toggle-icon ${open ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'}`}>
          <X size={22} />
        </span>
      </span>
    </button>
  );
}

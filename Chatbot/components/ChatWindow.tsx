"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { LogoutIcon, PlusIcon, SendIcon, ShieldIcon, StopIcon } from "./Icons";
import type { StoredUser } from "@/lib/session";

type Message = { id: string; role: "user" | "assistant"; content: string };

type Props = {
  token: string;
  user: StoredUser;
  onLogout: () => void;
};

const SUGGESTIONS = [
  "Apa yang harus dilakukan saat terjadi gempa bumi?",
  "Apa saja isi tas siaga bencana?",
  "Bagaimana tanda-tanda tsunami akan datang?",
  "Cara mencegah banjir di lingkungan rumah",
];

const newId = () => Math.random().toString(36).slice(2);

export default function ChatWindow({ token, user, onLogout }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState("");
  const abortRef = useRef<AbortController | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  // Tinggi textarea mengikuti isi (maks ~6 baris)
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [input]);

  async function sendMessage(text: string) {
    const content = text.trim();
    if (!content || isStreaming) return;

    setError("");
    setInput("");
    const userMsg: Message = { id: newId(), role: "user", content };
    const assistantId = newId();
    const history = [...messages, userMsg];
    setMessages([...history, { id: assistantId, role: "assistant", content: "" }]);
    setIsStreaming(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          messages: history.map(({ role, content }) => ({ role, content })),
        }),
        signal: controller.signal,
      });

      if (res.status === 401) {
        onLogout();
        return;
      }
      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || "Gagal mendapatkan jawaban.");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let answer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        answer += decoder.decode(value, { stream: true });
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, content: answer } : m))
        );
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
      }
      // Hapus balasan kosong jika gagal sebelum ada teks
      setMessages((prev) => prev.filter((m) => m.id !== assistantId || m.content));
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
      textareaRef.current?.focus();
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  function newChat() {
    abortRef.current?.abort();
    setMessages([]);
    setError("");
  }

  return (
    <div className="flex h-dvh flex-col">
      {/* Header */}
      <header className="flex items-center justify-between gap-3 border-b border-gray-200 bg-white px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <div className="chat-avatar flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand text-white">
            <ShieldIcon />
          </div>
          <div className="min-w-0">
            <h1 className="text-sm font-semibold leading-tight">Siap Siaga AI</h1>
            <p className="flex items-center gap-1.5 truncate text-xs text-gray-500">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inset-0 animate-ping rounded-full bg-green-400" />
                <span className="relative h-1.5 w-1.5 rounded-full bg-green-500" />
              </span>
              {isStreaming ? "Sedang mengetik..." : "Asisten informasi bencana alam"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <span className="hidden max-w-40 truncate text-sm text-gray-600 sm:inline">{user.name}</span>
          <button
            onClick={newChat}
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm text-gray-600 hover:bg-gray-100"
            title="Percakapan baru"
          >
            <PlusIcon />
            <span className="hidden sm:inline">Chat baru</span>
          </button>
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm text-gray-600 hover:bg-gray-100"
            title="Keluar"
          >
            <LogoutIcon />
            <span className="hidden sm:inline">Keluar</span>
          </button>
        </div>
      </header>

      {/* Daftar pesan */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6">
          {messages.length === 0 ? (
            <div className="chat-fade-up flex flex-col items-center pt-10 text-center sm:pt-20">
              <div className="chat-float mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-soft text-brand">
                <ShieldIcon className="h-7 w-7" />
              </div>
              <h2 className="text-xl font-semibold">Halo, {user.name.split(" ")[0]}</h2>
              <p className="mt-2 max-w-md text-sm text-gray-500">
                Saya siap membantu informasi seputar bencana alam: gempa bumi, tsunami, gunung
                meletus, banjir, tanah longsor, angin topan, mitigasi, dan evakuasi.
              </p>
              <div className="mt-8 grid w-full gap-2 sm:grid-cols-2">
                {SUGGESTIONS.map((s, i) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    style={{ animationDelay: `${200 + i * 80}ms` }}
                    className="chat-fade-up rounded-xl border border-gray-200 bg-white px-4 py-3 text-left text-sm text-gray-700 transition hover:-translate-y-0.5 hover:border-brand/40 hover:bg-brand-soft hover:shadow-sm"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((m, i) =>
                m.role === "user" ? (
                  <div key={m.id} className="chat-msg-user flex justify-end">
                    <div className="max-w-[85%] whitespace-pre-wrap break-words rounded-2xl rounded-br-md bg-brand px-4 py-2.5 text-[15px] text-white sm:max-w-[75%]">
                      {m.content}
                    </div>
                  </div>
                ) : (
                  <div key={m.id} className="chat-msg-bot flex gap-3">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand">
                      <ShieldIcon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1 pt-1 text-[15px] text-gray-800">
                      {m.content ? (
                        <div className="markdown">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
                          {isStreaming && i === messages.length - 1 && <span className="chat-caret" />}
                        </div>
                      ) : (
                        <TypingDots />
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
          )}

          {error && (
            <p className="chat-shake mt-6 rounded-lg bg-brand-soft px-4 py-3 text-sm text-brand">{error}</p>
          )}
          <div ref={bottomRef} />
        </div>
      </main>

      {/* Form input */}
      <footer className="border-t border-gray-200 bg-white px-4 pb-[max(env(safe-area-inset-bottom),12px)] pt-3 sm:px-6">
        <form onSubmit={handleSubmit} className="mx-auto flex w-full max-w-3xl items-end gap-2">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            maxLength={4000}
            placeholder="Tanyakan seputar bencana alam..."
            className="max-h-40 min-h-[46px] flex-1 resize-none rounded-xl border border-gray-300 px-4 py-3 text-[15px] outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
          {isStreaming ? (
            <button
              type="button"
              onClick={() => abortRef.current?.abort()}
              className="flex h-[46px] shrink-0 items-center gap-2 rounded-xl border border-gray-300 px-4 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              <StopIcon />
              <span className="hidden sm:inline">Berhenti</span>
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim()}
              className="group flex h-[46px] shrink-0 items-center gap-2 rounded-xl bg-brand px-4 text-sm font-semibold text-white transition hover:bg-brand-dark active:scale-95 disabled:opacity-50"
            >
              <SendIcon className="h-4 w-4 transition-transform group-enabled:group-hover:translate-x-0.5 group-enabled:group-hover:-translate-y-0.5" />
              <span>Kirim</span>
            </button>
          )}
        </form>
        <p className="mx-auto mt-2 max-w-3xl text-center text-[11px] text-gray-400">
          Dalam keadaan darurat, hubungi 112. Selalu cek informasi resmi BMKG dan BNPB.
        </p>
      </footer>
    </div>
  );
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1 py-2" aria-label="Sedang mengetik">
      {[0, 150, 300].map((delay) => (
        <span
          key={delay}
          className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
          style={{ animationDelay: `${delay}ms` }}
        />
      ))}
    </div>
  );
}

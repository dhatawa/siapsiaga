import { generateReply, type ChatMessage } from "@/lib/siagaAI/engine";
import { verifyUser } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Siap Siaga AI berjalan lokal di server ini (lihat lib/siagaAI), tanpa API AI eksternal.

const MAX_HISTORY = 20; // pesan terakhir yang dipakai sebagai konteks
const MAX_CHARS = 4000; // panjang maksimum satu pesan
const TYPING_DELAY_MS = 12; // jeda antar potongan teks agar jawaban tampil seperti diketik

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || "http://localhost:5173")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

// Saat pengembangan, izinkan semua alamat lokal (port Vite bisa berpindah ke 5174, 5175, dst.)
const DEV_LOCAL_ORIGIN = /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/;
const IS_DEV = process.env.NODE_ENV !== "production";

function isAllowedOrigin(origin: string) {
  return ALLOWED_ORIGINS.includes(origin) || (IS_DEV && DEV_LOCAL_ORIGIN.test(origin));
}

function corsHeaders(origin: string | null): Record<string, string> {
  if (!origin || !isAllowedOrigin(origin)) return {};
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    Vary: "Origin",
  };
}

function jsonError(message: string, status: number, cors: Record<string, string>) {
  return Response.json({ success: false, message }, { status, headers: cors });
}

function parseMessages(body: unknown): ChatMessage[] | null {
  const raw = (body as { messages?: unknown })?.messages;
  if (!Array.isArray(raw)) return null;

  const messages: ChatMessage[] = [];
  for (const m of raw) {
    if (
      !m ||
      (m.role !== "user" && m.role !== "assistant") ||
      typeof m.content !== "string" ||
      !m.content.trim()
    ) {
      continue;
    }
    messages.push({ role: m.role, content: m.content.slice(0, MAX_CHARS) });
  }

  const recent = messages.slice(-MAX_HISTORY);
  if (!recent.length || recent[recent.length - 1].role !== "user") return null;
  return recent;
}

export async function OPTIONS(req: Request) {
  return new Response(null, { status: 204, headers: corsHeaders(req.headers.get("origin")) });
}

export async function POST(req: Request) {
  const cors = corsHeaders(req.headers.get("origin"));

  // 1. Hanya pengguna yang sudah login
  const user = await verifyUser(req.headers.get("authorization"));
  if (!user) {
    return jsonError("Sesi tidak valid. Silakan login terlebih dahulu.", 401, cors);
  }

  // 2. Validasi input
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError("Format permintaan tidak valid.", 400, cors);
  }
  const messages = parseMessages(body);
  if (!messages) {
    return jsonError("Pesan tidak boleh kosong.", 400, cors);
  }

  // 3. Buat jawaban dengan Siap Siaga AI lokal
  let answer: string;
  try {
    answer = await generateReply(messages);
  } catch (err) {
    console.error("Siap Siaga AI error:", err);
    return jsonError("Terjadi kesalahan saat memproses jawaban.", 500, cors);
  }

  // 4. Alirkan jawaban sedikit demi sedikit (efek mengetik)
  const encoder = new TextEncoder();
  const chunks = answer.match(/\S+\s*|\s+/g) ?? [answer];
  let cancelled = false;

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      for (const chunk of chunks) {
        if (cancelled) return;
        controller.enqueue(encoder.encode(chunk));
        await new Promise((r) => setTimeout(r, TYPING_DELAY_MS));
      }
      controller.close();
    },
    cancel() {
      cancelled = true; // pengguna menekan tombol berhenti / menutup koneksi
    },
  });

  return new Response(stream, {
    headers: {
      ...cors,
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Accel-Buffering": "no",
    },
  });
}

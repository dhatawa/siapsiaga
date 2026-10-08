import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT } from "@/lib/systemPrompt";
import { verifyUser } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const client = new Anthropic(); // membaca ANTHROPIC_API_KEY dari environment
const MODEL = process.env.ANTHROPIC_MODEL || "claude-opus-5";
// Fallback server-side saat model menolak karena safety classifier (hanya Opus 5 / Fable 5.1)
const SUPPORTS_FALLBACK = MODEL === "claude-opus-5" || MODEL === "claude-fable-5-1";

const MAX_HISTORY = 20; // pesan terakhir yang dikirim ke model
const MAX_CHARS = 4000; // panjang maksimum satu pesan

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || "http://localhost:5173")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

function corsHeaders(origin: string | null): Record<string, string> {
  if (!origin || !ALLOWED_ORIGINS.includes(origin)) return {};
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

type ChatMessage = { role: "user" | "assistant"; content: string };

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

  // Ambil riwayat terakhir, dan pastikan dimulai dari pesan user
  const recent = messages.slice(-MAX_HISTORY);
  while (recent.length && recent[0].role !== "user") recent.shift();
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

  // 3. Panggil Claude dengan system prompt, lalu alirkan teks ke klien
  const stream = client.beta.messages.stream({
    model: MODEL,
    max_tokens: 16000,
    system: SYSTEM_PROMPT,
    messages,
    output_config: { effort: "medium" },
    ...(SUPPORTS_FALLBACK
      ? { betas: ["server-side-fallback-2026-07-01"], fallbacks: "default" as const }
      : {}),
  });

  const encoder = new TextEncoder();
  const body$ = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        const final = await stream.finalMessage();
        if (final.stop_reason === "refusal") {
          controller.enqueue(
            encoder.encode(
              "\n\nMaaf, saya tidak dapat melanjutkan jawaban ini. Silakan ajukan pertanyaan lain seputar bencana alam."
            )
          );
        }
        controller.close();
      } catch (err) {
        if (err instanceof Anthropic.RateLimitError) {
          console.error("Claude rate limit:", err.message);
          controller.enqueue(encoder.encode("\n\n[Server sedang sibuk. Coba lagi sebentar lagi.]"));
        } else if (err instanceof Anthropic.AuthenticationError) {
          console.error("ANTHROPIC_API_KEY tidak valid:", err.message);
          controller.enqueue(encoder.encode("\n\n[Konfigurasi server chatbot bermasalah.]"));
        } else if (err instanceof Anthropic.APIError) {
          console.error("Claude API error:", err.status, err.message);
          controller.enqueue(encoder.encode("\n\n[Terjadi kesalahan saat memproses jawaban.]"));
        } else {
          console.error("Chat stream error:", err);
          controller.enqueue(encoder.encode("\n\n[Koneksi ke layanan AI terputus.]"));
        }
        controller.close();
      }
    },
    cancel() {
      stream.abort(); // pengguna menutup koneksi / menekan tombol berhenti
    },
  });

  return new Response(body$, {
    headers: {
      ...cors,
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Accel-Buffering": "no",
    },
  });
}

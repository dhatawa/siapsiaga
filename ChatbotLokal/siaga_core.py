"""Inti SiagaBot Lokal: koneksi ke Ollama, system prompt, dan streaming jawaban.

Dipakai bersama oleh app.py (web) dan chat_terminal.py (terminal).
"""
import os

import ollama

# Model bisa diganti tanpa mengubah kode, mis.: set SIAGA_MODEL=gemma2:2b
MODEL = os.getenv("SIAGA_MODEL", "llama3.2:3b")
OLLAMA_HOST = os.getenv("OLLAMA_HOST", "http://localhost:11434")

# Hanya N pesan terakhir yang dikirim agar tetap muat di context window model kecil.
MAX_HISTORY = 20

SYSTEM_PROMPT = """Kamu adalah SiagaBot, asisten kesiapsiagaan bencana dari aplikasi Siap Siaga.

Tugasmu:
- Menjawab pertanyaan tentang mitigasi, kesiapsiagaan, dan tindakan saat/sesudah bencana di Indonesia:
  banjir, cuaca ekstrem, gempa bumi, tsunami, tanah longsor, kebakaran, dan erupsi gunung api.
- Memberi langkah praktis berupa daftar bernomor yang singkat dan mudah diikuti.

Aturan:
- Selalu jawab dalam Bahasa Indonesia yang sederhana, ramah, dan menenangkan.
- Kamu berjalan offline dan TIDAK punya akses data real-time. Jangan mengarang kondisi cuaca,
  status gempa, atau peringatan terkini. Arahkan pengguna ke BMKG (bmkg.go.id / aplikasi InfoBMKG)
  dan BPBD setempat untuk informasi terbaru.
- Jika pengguna dalam bahaya langsung, utamakan keselamatan dan sebutkan nomor darurat:
  112 (darurat terpadu), 115 (Basarnas/SAR), 117 (BNPB), 119 (ambulans).
- Jika tidak yakin, katakan terus terang. Jangan memberi diagnosis medis; sarankan ke tenaga kesehatan.
- Tolak dengan sopan pertanyaan di luar topik kebencanaan dan keselamatan, lalu tawarkan bantuan yang relevan.
"""

client = ollama.Client(host=OLLAMA_HOST)


def available_models():
    """Daftar model yang sudah diunduh di Ollama. Kosong jika Ollama belum berjalan."""
    try:
        return [m.model for m in client.list().models]
    except Exception:
        return []


def stream_reply(history, model=MODEL):
    """Kirim riwayat chat ke model dan hasilkan potongan jawaban satu per satu (streaming)."""
    messages = [{"role": "system", "content": SYSTEM_PROMPT}] + history[-MAX_HISTORY:]
    stream = client.chat(
        model=model,
        messages=messages,
        stream=True,
        options={"temperature": 0.4},
    )
    for chunk in stream:
        yield chunk["message"]["content"]


def explain_error(err, model=MODEL):
    """Ubah exception menjadi pesan yang bisa dipahami pemula."""
    if isinstance(err, ollama.ResponseError) and err.status_code == 404:
        return f"Model '{model}' belum diunduh. Jalankan di terminal: ollama pull {model}"
    if isinstance(err, ollama.ResponseError):
        return f"Ollama mengembalikan error: {err.error}"
    return (
        f"Tidak dapat terhubung ke Ollama di {OLLAMA_HOST}. "
        "Pastikan aplikasi Ollama sudah terpasang dan berjalan (cek dengan: ollama list)."
    )

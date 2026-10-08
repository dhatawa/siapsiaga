# Siap Siaga AI — Chatbot Bencana Alam

Chatbot AI yang berfokus pada bencana alam (gempa bumi, tsunami, gunung meletus, banjir, tanah longsor, cuaca ekstrem, mitigasi, dan evakuasi). Percakapan dibuat tetap natural: bot menanggapi sapaan dan pertanyaan lanjutan dengan konteks, serta mengarahkan dengan ramah jika ditanya hal di luar cakupan.

- **Tech stack:** Next.js (App Router) + React + Tailwind CSS + Claude API (`@anthropic-ai/sdk`, streaming)
- **Login:** memakai akun website Siap Siaga yang sama. API chat memverifikasi token ke backend Express (`GET /api/auth/me`), jadi hanya pengguna yang sudah login yang bisa chat.

## Struktur file

```
Chatbot/
├── app/
│   ├── api/chat/route.ts   # API chat: cek login → panggil Claude + system prompt → stream jawaban
│   ├── layout.tsx
│   ├── page.tsx            # Cek sesi, lalu tampilkan form login atau jendela chat
│   └── globals.css         # Tailwind + gaya markdown jawaban
├── components/
│   ├── ChatWindow.tsx      # UI chat (daftar pesan, input, tombol Kirim/Berhenti)
│   ├── LoginForm.tsx       # Login dengan akun Siap Siaga
│   └── Icons.tsx
├── lib/
│   ├── systemPrompt.ts     # Cakupan topik dan gaya percakapan chatbot
│   ├── auth.ts             # Verifikasi token ke backend Express
│   └── session.ts          # Simpan token di localStorage
└── package.json
```

Integrasi dengan website: [`Frontend/src/components/ChatbotPopup.jsx`](../Frontend/src/components/ChatbotPopup.jsx) (popup chat di dashboard dan halaman lain) memanggil `http://localhost:3000/api/chat` dengan token pengguna yang sedang login. Tombol ⤢ di popup membuka chatbot versi layar penuh tanpa perlu login lagi.

## Menjalankan secara lokal

Butuh Node.js 20 atau yang lebih baru.

### 1. Siapkan environment variable

Semua environment variable (Backend, Frontend, dan Chatbot) dipusatkan di satu file `.env` pada root folder `siapsiaga`. Salin dari template bila belum ada:

```bash
cp .env.example .env
```

Variabel yang dipakai chatbot:

| Variabel | Wajib | Keterangan |
|---|---|---|
| `ANTHROPIC_API_KEY` | Ya | API key dari https://console.anthropic.com |
| `ANTHROPIC_MODEL` | Tidak | Default `claude-opus-5`. Bisa diganti, misalnya `claude-sonnet-5` atau `claude-haiku-4-5` untuk biaya lebih rendah |
| `BACKEND_URL` | Ya | URL backend Express yang dipakai server Next.js untuk verifikasi token (default `http://localhost:5000`) |
| `NEXT_PUBLIC_BACKEND_URL` | Ya | URL backend yang dipanggil browser untuk form login di halaman chatbot |
| `ALLOWED_ORIGINS` | Ya | Origin website Frontend yang boleh memanggil `/api/chat`, dipisah koma (default `http://localhost:5173`) |

Frontend (Vite) membaca `VITE_CHATBOT_URL` dari file `.env` yang sama.

### 2. Install dan jalankan (3 terminal)

```bash
# Terminal 1 — Backend Express (login & database)
cd Backend
npm install
npm run dev            # http://localhost:5000

# Terminal 2 — Chatbot Next.js
cd Chatbot
npm install
npm run dev            # http://localhost:3000

# Terminal 3 — Website Frontend (Vite)
cd Frontend
npm install
npm run dev            # http://localhost:5173
```

### 3. Coba

1. Buka http://localhost:5173, login, lalu klik tombol chat merah di pojok kanan bawah.
2. Atau buka http://localhost:3000 langsung dan login dengan akun yang sama.

Contoh percakapan:
- "Apa yang harus dilakukan saat gempa?" → dijawab dengan panduan praktis
- "Kalau saya di lantai 3?" → dijawab sebagai pertanyaan lanjutan dengan konteks gempa
- "Terima kasih" → ditanggapi dengan wajar, tanpa mengulang perkenalan
- "Buatkan resep nasi goreng" → diarahkan dengan ramah kembali ke topik bencana

## Catatan

- **System prompt** ada di [`lib/systemPrompt.ts`](lib/systemPrompt.ts) dan dikirim di setiap pemanggilan API dari server. Pengguna tidak bisa mengubahnya.
- Riwayat chat dikirim ulang setiap pesan (maks. 20 pesan terakhir, 4000 karakter per pesan) dan tidak disimpan di database. Tombol "Chat baru" mengosongkan riwayat.
- Jika memakai `claude-opus-5`, *server-side fallback* (`fallbacks: "default"`) aktif. Kalau safety classifier menolak permintaan, API otomatis melanjutkannya dengan model cadangan.
- Untuk produksi, ganti semua URL `localhost` di env dengan domain asli, lalu tambahkan domain website ke `ALLOWED_ORIGINS`.

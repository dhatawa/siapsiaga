# Siap Siaga AI — Chatbot Bencana Alam

Chatbot AI yang berfokus pada bencana alam (gempa bumi, tsunami, gunung meletus, banjir, tanah longsor, cuaca ekstrem, mitigasi, dan evakuasi). Percakapan dibuat tetap natural: bot menanggapi sapaan dan pertanyaan lanjutan dengan konteks, serta mengarahkan dengan ramah jika ditanya hal di luar cakupan.

- **Tech stack:** Next.js (App Router) + React + Tailwind CSS + **Siap Siaga AI** (mesin NLP lokal, tanpa API AI eksternal)
- **Offline dari layanan AI:** tidak butuh API key dan tidak ada biaya token. Satu-satunya data dari luar adalah info gempa terkini dari BMKG lewat Backend (`/api/bmkg/earthquake`).
- **Login:** memakai akun website Siap Siaga yang sama. API chat memverifikasi token ke backend Express (`GET /api/auth/me`), jadi hanya pengguna yang sudah login yang bisa chat.

## Struktur file

```
Chatbot/
├── app/
│   ├── api/chat/route.ts   # API chat: cek login → Siap Siaga AI lokal → stream jawaban
│   ├── layout.tsx
│   ├── page.tsx            # Cek sesi, lalu tampilkan form login atau jendela chat
│   └── globals.css         # Tailwind + gaya markdown jawaban
├── components/
│   ├── ChatWindow.tsx      # UI chat (daftar pesan, input, tombol Kirim/Berhenti)
│   ├── LoginForm.tsx       # Login dengan akun Siap Siaga
│   └── Icons.tsx
├── lib/
│   ├── siagaAI/
│   │   ├── engine.ts       # Mesin chatbot: deteksi bencana & fase, TF-IDF, konteks, penolakan topik lain
│   │   ├── knowledge.ts    # Basis pengetahuan: intent, contoh pertanyaan, dan jawaban
│   │   └── text.ts         # Normalisasi Bahasa Indonesia: kata gaul, salah ketik, stemming
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
| `BACKEND_URL` | Ya | URL backend Express untuk verifikasi token dan info gempa terkini BMKG (default `http://localhost:5000`) |
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

## Cara kerja Siap Siaga AI

Siap Siaga AI adalah chatbot **retrieval-based** (berbasis pencarian jawaban), bukan model generatif. Setiap pesan diproses seperti ini:

1. **Normalisasi teks** – huruf kecil, kata gaul ke kata baku ("gmn" → "bagaimana"), koreksi salah ketik kata kunci ("gmpa" → "gempa"), kata ulang ("tanda2"), dan stemming sederhana (buang imbuhan).
2. **Deteksi jenis bencana** (gempa, tsunami, banjir, longsor, erupsi, cuaca ekstrem, kebakaran, kekeringan) dan **fase** (info/penyebab, tanda-tanda, sebelum, saat, setelah).
3. **Klasifikasi maksud** dengan **TF-IDF + cosine similarity** terhadap contoh pertanyaan di `knowledge.ts`, ditambah kemiripan **trigram karakter** agar tahan salah ketik. Skor diberi bobot tambahan jika jenis bencana dan fasenya cocok.
4. **Konteks percakapan** – pertanyaan lanjutan seperti "kalau saya di lantai 3?" atau "kalau setelahnya?" memakai jenis bencana dan fase dari pertanyaan sebelumnya.
5. **Batasan topik** – pertanyaan tanpa kata kunci kebencanaan ditolak dengan ramah. Kata seperti "tolong" atau "terjebak" memunculkan nomor darurat lebih dulu.
6. **Data real-time** – "gempa terkini" diambil dari BMKG melalui Backend. Untuk cuaca dan status gunung, bot mengarahkan ke BMKG dan MAGMA Indonesia.

Menambah pengetahuan cukup dengan menambah intent baru (contoh pertanyaan + jawaban) di [`lib/siagaAI/knowledge.ts`](lib/siagaAI/knowledge.ts), tanpa melatih ulang secara manual. Model TF-IDF dibangun otomatis saat server berjalan.

**Kelebihan:** gratis, cepat, jawaban terkontrol dan tidak mengarang, tidak bisa dibelokkan ke topik lain.
**Keterbatasan:** hanya bisa menjawab hal yang ada di basis pengetahuan, dan kalimatnya tidak disusun ulang seperti model bahasa besar.

## Catatan

- Riwayat chat dikirim ulang setiap pesan (maks. 20 pesan terakhir, 4000 karakter per pesan) dan tidak disimpan di database. Tombol "Chat baru" mengosongkan riwayat.
- Untuk produksi, ganti semua URL `localhost` di env dengan domain asli, lalu tambahkan domain website ke `ALLOWED_ORIGINS`.

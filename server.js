require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ==========================================
// 1. MIDDLEWARE ANTI-CACHE (Hanya untuk Development)
// Biar CSS langsung berubah tanpa perlu Hard Refresh!
// ==========================================
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.set('Expires', '-1');
    res.set('Pragma', 'no-cache');
    next();
});

// ==========================================
// KONFIGURASI STATIC FILE SERVING
// ==========================================
app.use(express.static(path.join(__dirname, 'public')));

// ==========================================
// ROUTE API (ENDPOINTS)
// ==========================================

// ... (Biarkan endpoint /api/weather tetap sama seperti milikmu) ...
app.get('/api/weather', (req, res) => {
    res.json({
        location: "Bandung",
        current: { temp: 26, condition: "Cerah Berawan", feels_like: 28, humidity: 78, wind: 12, rain_chance: 30, icon: "⛅", uv: 5 },
        hourly: [{ time: "08:00", isNow: true, icon: "⛅", temp: 26 }, { time: "09:00", isNow: false, icon: "⛅", temp: 27 }],
        forecast: [{ day: "Sen", icon: "⛅", high: 29, low: 22, bar_width: 80, rain_pct: 20 }]
    });
});

// ==========================================
// 2. PERBAIKAN API BERITA (Dibatasi 4 Data)
// ==========================================
app.get('/api/news', (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : 4; // Menerima parameter limit

    // Simulasi database berisi banyak berita
    const dbBerita = [
        {
            category: "Banjir", 
            url: "https://www.bmkg.go.id/berita/?p=peringatan-dini-banjir", 
            image: "https://images.unsplash.com/photo-1468245856972-a0333f3f8293?q=80&w=600&auto=format&fit=crop",
            thumbIcon: "🌊", thumbBg: "#dbeafe",
            source: "BMKG", time: "1 Jam lalu", title: "Siaga Banjir Bandung Selatan",
            snippet: "Hujan deras sejak malam memicu potensi genangan.", tags: [{ id: "banjir", text: "Banjir" }]
        },
        {
            category: "Cuaca", 
            url: "https://www.bmkg.go.id/cuaca/prakiraan-cuaca.bmkg", 
            image: "https://images.unsplash.com/photo-1545134969-8debd725b733?q=80&w=600&auto=format&fit=crop",
            thumbIcon: "⛈️", thumbBg: "#ede9fe",
            source: "BPBD", time: "3 Jam lalu", title: "Peringatan Dini Cuaca Ekstrem",
            snippet: "Angin kencang diprediksi melanda wilayah utara hari ini.", tags: [{ id: "angin", text: "Angin" }]
        },
        {
            category: "Gempa", 
            url: "https://warning.bmkg.go.id/", 
            image: "https://images.unsplash.com/photo-1498675549048-c92c81fb3b2f?q=80&w=600&auto=format&fit=crop",
            thumbIcon: "⚠️", thumbBg: "#fee2e2",
            source: "BMKG", time: "5 Jam lalu", title: "Gempa Magnitudo 3.2 Lembang",
            snippet: "Gempa tektonik dangkal terasa hingga pusat kota Bandung.", tags: [{ id: "gempa", text: "Gempa" }]
        },
        {
            category: "Longsor", 
            url: "https://bnpb.go.id/berita", 
            image: "https://images.unsplash.com/photo-1620055209355-08146de7eb77?q=80&w=600&auto=format&fit=crop",
            thumbIcon: "⛰️", thumbBg: "#d1fae5",
            source: "Dinas PU", time: "12 Jam lalu", title: "Jalur Alternatif Tertutup Longsor",
            snippet: "Akses jalan tersendat, tim gabungan sedang evakuasi material.", tags: [{ id: "longsor", text: "Longsor" }]
        }
    ];

    res.json({
        articles: dbBerita.slice(0, limit), // Mengembalikan maksimal 4 berita
        lastUpdated: new Date().toISOString()
    });
});

// Route tambahan untuk melayani tombol refresh dari UI News
app.post('/api/news/refresh', (req, res) => {
    res.json({ success: true, message: "Data berita berhasil disegarkan" });
});

app.get('/api/education', (req, res) => {
    res.json({ banjir: [["Evakuasi ke tempat tinggi", "Matikan listrik"]] });
});

app.get('/api/cctv', (req, res) => {
    res.json([{ id: "CCTV-01", name: "Sungai Cikapundung", area: "Bandung" }]);
});

app.post('/api/analyze-frame', (req, res) => {
    res.json({ status: "SAFE", confidence: 95 });
});

app.get('/api/alerts', (req, res) => {
    res.json([]);
});

app.get('/api/siagabot-status', (req, res) => {
    res.json({ active: "aman", statuses: {} });
});

// START SERVER
app.listen(PORT, () => {
    console.log(`🚀 SiapSiaga backend listening at http://localhost:${PORT}`);
});
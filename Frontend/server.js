require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { Groq } = require('groq-sdk');
const { exec } = require('child_process');
const webpush = require('web-push');
const cron = require('node-cron');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const app = express();
const PORT = process.env.PORT || 3000;
// PASTIKAN INI ADA DI BAGIAN ATAS (Di bawah inisiasi app & const express)
app.use(cors());
app.use(express.json()); // <--- INI WAJIB DI ATAS BIAR BACA EMAILNYA LANCAR

const nodemailer = require('nodemailer');

// 1. Setup Kurir Email
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// 2. Database Sementara
let databaseEmailWarga = [];
let databasePushSubscribers = [];

// ==========================================
// VAPID KEYS SETUP UNTUK PUSH NOTIFICATION
// ==========================================
const publicVapidKey = process.env.VAPID_PUBLIC_KEY || "BN2xa-zUTb1TbpIDUqjBHAmuMm1KypJwgLRqI-EWY5gxrH1FJcvNjns37HnaDKyZ6XgPLygQm9hTBr1gjo7RU_0";
const privateVapidKey = process.env.VAPID_PRIVATE_KEY || "NO-WcBQUg5BzYIuxwMqa26bCshNeNtvZaduAxRr9SvM";

try {
    webpush.setVapidDetails(
        'mailto:siapsiagaofc@gmail.com',
        publicVapidKey,
        privateVapidKey
    );
} catch(e) {
    console.log("Web Push Not Configured/Vapid Details error:", e);
}

// 3. Endpoint API buat Berlangganan
app.post('/api/subscribe', (req, res) => {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
        return res.status(400).json({ error: "Email tidak valid cok!" });
    }

    if (!databaseEmailWarga.includes(email)) {
        databaseEmailWarga.push(email);

        // --- LOGIKA EMAIL SELAMAT DATANG ---
        const welcomeOptions = {
            from: '"Siap Siaga Pusat" <siapsiagaofc@gmail.com>',
            to: email,
            subject: 'Selamat Datang di Siap Siaga!',
            html: `
                <div style="font-family: sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
                    <h2 style="color: #10B981;">Halo Warga Siaga!</h2>
                    <p>Terima kasih sudah berlangganan notifikasi darurat. Sekarang kamu akan jadi yang pertama tahu kalau ada potensi bencana di sekitar Bandung.</p>
                    <p style="font-size: 13px; color: #64748b;">Pantau terus dashboard kami untuk kondisi real-time.</p>
                    <br>
                    <p><strong>Stay Safe,</strong><br>SiagaBot Assistant</p>
                </div>
            `
        };

        transporter.sendMail(welcomeOptions, (err, info) => {
            if (err) console.log("Gagal kirim email welcome:", err);
            else console.log("Email welcome terkirim ke:", email);
        });
    }

    res.json({ success: true, message: "Berhasil berlangganan Siap Siaga!" });
});

// Endpoint untuk mendapatkan Public VAPID Key
app.get('/api/vapidPublicKey', (req, res) => {
    res.json({ publicKey: publicVapidKey });
});

// Endpoint untuk menyimpan Push Subscription
app.post('/api/subscribe/push', (req, res) => {
    const subscription = req.body;
    
    // Simpan ke database sementara
    if (!databasePushSubscribers.find(sub => sub.endpoint === subscription.endpoint)) {
        databasePushSubscribers.push(subscription);
        
        // Kirim welcome push notification
        const payload = JSON.stringify({
            title: "Selamat Datang di SiapSiaga!",
            body: "Anda berhasil berlangganan notifikasi push. Peringatan dini akan muncul di layar ini.",
            url: "https://siapsiaga--dhatawaa.replit.app/"
        });
        
        webpush.sendNotification(subscription, payload).catch(err => console.error("Welcome Push failed", err));
    }
    
    res.status(201).json({ success: true });
});

function blastPushNotification(payload) {
    const payloadString = JSON.stringify(payload);
    databasePushSubscribers.forEach(subscription => {
        webpush.sendNotification(subscription, payloadString)
            .catch(error => console.error("Push Notification error:", error));
    });
}

// 4. Fungsi Blast Email
function blastEmailBahaya(ketinggianAir) {
    if (databaseEmailWarga.length === 0) {
        console.log("Belum ada warga yang subscribe email.");
        return;
    }

    const mailOptions = {
        from: '"Siap Siaga Pusat" <siapsiagaofc@gmail.com>', // <--- UDAH GUE BENERIN
        to: databaseEmailWarga.join(','),
        subject: '🚨 PERINGATAN DARURAT: BANJIR BANDANG!',
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; border-top: 5px solid #E63946; background: #fef2f2;">
                <h2 style="color: #E63946;">⚠️ PERINGATAN DARURAT SIAP SIAGA ⚠️</h2>
                <p>Halo Warga,</p>
                <p>Sistem IoT kami mendeteksi kenaikan air sungai yang tidak normal! <strong>(Ketinggian air saat ini: ${ketinggianAir} cm)</strong>.</p>
                <p>Harap segera amankan dokumen penting, matikan aliran listrik, dan bersiap menuju titik kumpul evakuasi terdekat.</p>
                <br>
                <p><strong>- SiagaBot & Tim Mitigasi</strong></p>
            </div>
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) console.log("Gagal ngirim email:", error);
        else console.log("Email darurat sukses terkirim:", info.response);
    });

    // KIRIM PUSH NOTIFICATION KE LAYAR KUNCI HP
    blastPushNotification({
        title: "⚠️ PERINGATAN DARURAT: BANJIR BANDANG!",
        body: `Sistem IoT mendeteksi kenaikan air tidak normal (${ketinggianAir} cm). Segera evakuasi!`,
        vibrate: [300, 100, 400, 100, 400, 100, 400],
        requireInteraction: true
    });
}

// 5. TOMBOL RAHASIA BUAT TESTING EMAIL (Hanya buat nyoba)
app.get('/api/test-email', (req, res) => {
    // Kita simulasiin air naik jadi 180 cm
    blastEmailBahaya(180);
    res.send("Pemicu email darurat telah dijalankan! Cek terminal dan kotak masuk Gmail.");
});

// Setup cron job untuk notifikasi cuaca berkala (Jam 6 pagi, 12 siang, 6 sore)
cron.schedule('0 6,12,18 * * *', () => {
    console.log("Menjalankan cron job Push Notification Cuaca...");
    if (databasePushSubscribers.length > 0) {
        blastPushNotification({
            title: "Update Cuaca SiapSiaga",
            body: "Pantau kondisi cuaca hari ini dan tetap waspada terhadap lingkungan sekitar Anda.",
            url: "https://siapsiaga--dhatawaa.replit.app/"
        });
    }
});

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

// Helper fungsi mapping WMO Code (Open-Meteo) ke Icon & Deskripsi UI
function mapWMO(code) {
    const weatherMap = {
        0: { desc: "Cerah", icon: "☀" },
        1: { desc: "Cerah Berawan", icon: "⛅" },
        2: { desc: "Berawan", icon: "⛅" },
        3: { desc: "Mendung", icon: "☁" },
        45: { desc: "Berkabut", icon: "☁" },
        48: { desc: "Kabut Tebal", icon: "☁" },
        51: { desc: "Gerimis Ringan", icon: "🌧" },
        53: { desc: "Gerimis", icon: "🌧" },
        55: { desc: "Gerimis Lebat", icon: "🌧" },
        61: { desc: "Hujan Ringan", icon: "🌧" },
        63: { desc: "Hujan Sedang", icon: "🌧" },
        65: { desc: "Hujan Lebat", icon: "🌧" },
        71: { desc: "Salju Ringan", icon: "❄" },
        73: { desc: "Salju Sedang", icon: "❄" },
        75: { desc: "Salju Lebat", icon: "❄" },
        80: { desc: "Hujan Gerimis", icon: "🌧" },
        81: { desc: "Hujan Deras", icon: "⛈" },
        82: { desc: "Badai Hujan", icon: "⛈" },
        95: { desc: "Badai Petir", icon: "🌩" },
        96: { desc: "Badai Petir Ringan", icon: "🌩" },
        99: { desc: "Badai Petir Lebat", icon: "🌩" }
    };
    return weatherMap[code] || { desc: "Tidak Diketahui", icon: "⛅" };
}

app.get('/api/weather', async (req, res) => {
    const { lat, lon } = req.query;

    if (lat && lon) {
        try {
            const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`;
            const weatherRes = await fetch(weatherUrl);

            const geoUrl = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;
            const geoRes = await fetch(geoUrl, {
                headers: { 'User-Agent': 'SiapSiaga App (Education/Non-profit)' }
            });

            if (!weatherRes.ok) throw new Error("Gagal mengambil data cuaca dari Open-Meteo");

            const wData = await weatherRes.json();

            let cityName = "Lokasi Anda";
            if (geoRes.ok) {
                const gData = await geoRes.json();
                if (gData.address) {
                    cityName = gData.address.city || gData.address.town || gData.address.village || gData.address.county || "Lokasi Anda";
                }
            }

            const currentWMO = mapWMO(wData.current.weather_code);

            const currentHourIndex = wData.hourly.time.findIndex(t => new Date(t).getHours() === new Date().getHours());
            const hourlyData = [];
            for (let i = 0; i < 3; i++) {
                let idx = currentHourIndex + i;
                if (idx < wData.hourly.time.length) {
                    let wmo = mapWMO(wData.hourly.weather_code[idx]);
                    hourlyData.push({
                        time: i === 0 ? "KINI" : wData.hourly.time[idx].slice(11, 16),
                        isNow: i === 0,
                        icon: wmo.icon,
                        temp: Math.round(wData.hourly.temperature_2m[idx])
                    });
                }
            }

            const forecastData = [];
            const daysArr = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
            for (let i = 0; i < 4; i++) {
                let wmo = mapWMO(wData.daily.weather_code[i]);
                let dateObj = new Date(wData.daily.time[i]);
                forecastData.push({
                    day: i === 0 ? "Hari Ini" : daysArr[dateObj.getDay()],
                    icon: wmo.icon,
                    high: Math.round(wData.daily.temperature_2m_max[i]),
                    low: Math.round(wData.daily.temperature_2m_min[i]),
                    bar_width: Math.floor(Math.random() * (100 - 40 + 1) + 40),
                    rain_pct: wData.daily.precipitation_probability_max[i] || 0
                });
            }

            return res.json({
                location: cityName,
                current: {
                    temp: Math.round(wData.current.temperature_2m),
                    condition: currentWMO.desc,
                    feels_like: Math.round(wData.current.apparent_temperature),
                    humidity: wData.current.relative_humidity_2m,
                    wind: Math.round(wData.current.wind_speed_10m),
                    rain_chance: wData.daily.precipitation_probability_max[0] || 0,
                    icon: currentWMO.icon,
                    uv: 5
                },
                hourly: hourlyData,
                forecast: forecastData
            });

        } catch (error) {
            console.error("API Weather Error, fallback ke mock:", error);
        }
    }

    res.json({
        location: "Bandung",
        current: { temp: 26, condition: "Cerah Berawan", feels_like: 28, humidity: 78, wind: 12, rain_chance: 30, icon: "⛅", uv: 5 },
        hourly: [{ time: "08:00", isNow: true, icon: "⛅", temp: 26 }, { time: "09:00", isNow: false, icon: "⛅", temp: 27 }],
        forecast: [{ day: "Sen", icon: "⛅", high: 29, low: 22, bar_width: 80, rain_pct: 20 }]
    });
});

// ==========================================
// 2. PERBAIKAN API BERITA (Dibatasi 4 Data, Dirotasi 3x Sehari)
// ==========================================
app.get('/api/news', (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : 4;

    const dbBerita = [
        {
            category: "Banjir", url: "https://www.bmkg.go.id/berita/?p=peringatan-dini-banjir", image: "https://images.unsplash.com/photo-1468245856972-a0333f3f8293?q=80&w=600&auto=format&fit=crop",
            thumbIcon: "🌊", thumbBg: "#dbeafe", source: "BMKG", time: "1 Jam lalu", title: "Siaga Banjir Bandung Selatan", snippet: "Hujan deras sejak malam memicu potensi genangan.", tags: [{ id: "banjir", text: "Banjir" }]
        },
        {
            category: "Cuaca", url: "https://www.bmkg.go.id/cuaca/prakiraan-cuaca.bmkg", image: "https://images.unsplash.com/photo-1545134969-8debd725b733?q=80&w=600&auto=format&fit=crop",
            thumbIcon: "⛈️", thumbBg: "#ede9fe", source: "BPBD", time: "3 Jam lalu", title: "Peringatan Dini Cuaca Ekstrem", snippet: "Angin kencang diprediksi melanda wilayah utara hari ini.", tags: [{ id: "angin", text: "Angin" }]
        },
        {
            category: "Gempa", url: "https://warning.bmkg.go.id/", image: "https://images.unsplash.com/photo-1498675549048-c92c81fb3b2f?q=80&w=600&auto=format&fit=crop",
            thumbIcon: "⚠️", thumbBg: "#fee2e2", source: "BMKG", time: "5 Jam lalu", title: "Gempa Magnitudo 3.2 Lembang", snippet: "Gempa tektonik dangkal terasa hingga pusat kota Bandung.", tags: [{ id: "gempa", text: "Gempa" }]
        },
        {
            category: "Longsor", url: "https://bnpb.go.id/berita", image: "https://images.unsplash.com/photo-1620055209355-08146de7eb77?q=80&w=600&auto=format&fit=crop",
            thumbIcon: "⛰️", thumbBg: "#d1fae5", source: "Dinas PU", time: "7 Jam lalu", title: "Jalur Alternatif Tertutup Longsor", snippet: "Akses jalan tersendat, evakuasi material.", tags: [{ id: "longsor", text: "Longsor" }]
        },
        {
            category: "Bencana", url: "https://bnpb.go.id/", image: "https://images.unsplash.com/photo-1527680455799-a8684d092e07?q=80&w=600&auto=format&fit=crop",
            thumbIcon: "🚨", thumbBg: "#fee2e2", source: "BNPB", time: "11 Jam lalu", title: "Koordinasi Relawan Kebencanaan", snippet: "Tim Siaga diturunkan untuk pemantauan potensi pergeseran tanah.", tags: [{ id: "bencana", text: "Bencana" }]
        },
        {
            category: "Gunung", url: "https://vsi.esdm.go.id/", image: "https://images.unsplash.com/photo-1583091910243-7f2c2bb6f0e7?q=80&w=600&auto=format&fit=crop",
            thumbIcon: "🌋", thumbBg: "#ffedd5", source: "PVMBG", time: "14 Jam lalu", title: "Status Gunung Tangkuban Parahu", snippet: "Terpantau aman dengan status level I (Normal).", tags: [{ id: "gunung", text: "Gunung" }]
        }
    ];

    // Logika agar berita berubah 3x sehari (Setiap 8 Jam)
    const hour = new Date().getHours();
    const phase = Math.floor(hour / 8); // 0 (0-7), 1 (8-15), 2 (16-23)
    
    // Geser index berdasarkan fase hari ini agar beritanya terkesan update
    const startIndex = (phase * 2) % dbBerita.length;
    let selectedArticles = [...dbBerita.slice(startIndex), ...dbBerita.slice(0, startIndex)].slice(0, limit);

    res.json({
        articles: selectedArticles,
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
    res.json([
        { id: "CCTV-01", name: "Sungai Cikapundung", area: "Bandung" },
        { id: "CCTV-02", name: "Jalan Suci (Gasibu)", area: "Bandung" }
    ]);
});

// GANTI endpoint /api/analyze-frame yang lama dengan ini:
app.post('/api/analyze-frame', (req, res) => {
  const { imageData, cameraId } = req.body;
  
  // Jika tidak ada imageData, return mock (untuk kompatibilitas fetchCCTV lama)
  if (!imageData) {
    return res.json({ status: "SAFE", confidence: 95 });
  }

  const scriptPath = path.join(__dirname, 'detect_flood.py');
  const pythonCmd = process.platform === 'win32' ? 'python' : 'python3';
  
  const child = exec(
    `${pythonCmd} "${scriptPath}" "${imageData}"`,
    { maxBuffer: 10 * 1024 * 1024 },
    (error, stdout, stderr) => {
      if (stderr) console.error('Python stderr:', stderr);
      
      if (error) {
        console.error('AI Inference Error:', error.message);
        return res.json({ status: "SAFE", confidence: 90 });
      }
      
      try {
        const aiResult = JSON.parse(stdout.trim());
        console.log(`🤖 AI [${cameraId || 'unknown'}]: ${aiResult.status} (${aiResult.confidence}%)`);
        res.json(aiResult);
      } catch (parseErr) {
        console.error('Failed to parse AI output:', stdout);
        res.json({ status: "SAFE", confidence: 90 });
      }
    }
  );

  req.on('close', () => { if (!child.killed) child.kill('SIGTERM'); });
});

app.get('/api/alerts', (req, res) => {
    res.json([]);
});

app.get('/api/siagabot-status', (req, res) => {
    res.json({ active: "aman", statuses: {} });
});

// ==========================================
// API CHATBOT GEMINI
// ==========================================
app.post('/api/chat', async (req, res) => {
    try {
        const { message, cctvStatus } = req.body;
        if (!message) {
            return res.status(400).json({ error: "Pesan tidak boleh kosong" });
        }

        // Susun konteks tambahan berdasarkan status CCTV saat ini
        let extraContext = "";
        if (cctvStatus) {
            if (cctvStatus.banjir > 0) {
                extraContext = `\nSTATUS SAAT INI: TERJADI BANJIR! AI mendeteksi ${cctvStatus.banjir} titik banjir dari rekaman CCTV. Harap himbau pengguna untuk waspada dan evakuasi jika dekat lokasi kejadian.`;
            } else if (cctvStatus.naik > 0) {
                extraContext = `\nSTATUS SAAT INI: WASPADA. AI mendeteksi ${cctvStatus.naik} titik peringatan air naik.`;
            } else {
                extraContext = `\nSTATUS SAAT INI: AMAN. Tidak ada deteksi banjir dari seluruh ${cctvStatus.aman || 0} titik CCTV.`;
            }
        }

        const systemPrompt = "Kamu adalah SiagaBot, asisten khusus kebencanaan. Kamu hanya boleh menjawab pertanyaan seputar bencana alam, cuaca, mitigasi, dan keadaan darurat di Indonesia. Jika pengguna bertanya di luar topik tersebut, tolak dengan sopan dan ingatkan bahwa kamu adalah asisten khusus kebencanaan." + extraContext;

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: systemPrompt
                },
                {
                    role: "user",
                    content: message
                }
            ],
            model: "llama-3.1-8b-instant",
            temperature: 0.5,
            max_tokens: 1024,
        });

        const responseText = chatCompletion.choices[0]?.message?.content || "";

        res.json({ reply: responseText });
    } catch (error) {
        console.error("SiagaBot API Error:", error.message, error);
        res.status(500).json({ error: "Maaf, SiagaBot sedang gangguan jaringan nih. Coba sebentar lagi ya! (Detail: " + error.message + ")" });
    }
});

// START SERVER
const server = app.listen(PORT, () => {
    console.log(`🚀 SiapSiaga backend listening at http://localhost:${PORT}`);
});

// ==========================================
// CCTV HLS PROXY (Tanpa FFmpeg)
// ==========================================
const fetch = require('node-fetch');

app.get('/api/proxy/m3u8', async (req, res) => {
    try {
        const lokasi = req.query.lokasi || '';
        let targetUrl = "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8";
        let baseUrl = "https://test-streams.mux.dev/x36xhzz/";
        // Check if gasibu
        if (lokasi.toLowerCase().includes("suci") || lokasi.toLowerCase().includes("surapati") || lokasi.toLowerCase().includes("gasibu")) {
             targetUrl = "https://pelindung.bandung.go.id:3443/video/DAHUA/GASIBU.m3u8";
             baseUrl = "https://pelindung.bandung.go.id:3443/video/DAHUA/";
        }
        
        const response = await fetch(targetUrl);
        if (!response.ok) throw new Error("Gagal mengambil m3u8");
        
        let m3u8Text = await response.text();
        
        // Rewrite .ts files / secondary m3u8s to use our proxy
        const lines = m3u8Text.split('\n');
        const rewritten = lines.map(line => {
             const trimmed = line.trim();
             if (trimmed && !trimmed.startsWith('#')) {
                 const fullTsUrl = trimmed.startsWith('http') ? trimmed : baseUrl + trimmed;
                 // If it's a sub-playlist (.m3u8), proxy to m3u8, else proxy to ts
                 if (fullTsUrl.endsWith('.m3u8')) {
                     // For nested m3u8, we should theoretically parse it, but test stream x36xhzz does have nested ones.
                     // The easiest way is to let the user fallback to straight url if it fails, but we'll try to proxy it.
                     return `/api/proxy/m3u8-sub?url=${encodeURIComponent(fullTsUrl)}&base=${encodeURIComponent(baseUrl)}`;
                 }
                 return `/api/proxy/ts?url=${encodeURIComponent(fullTsUrl)}`;
             }
             return line;
        });
        
        res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.send(rewritten.join('\n'));

    } catch (err) {
        console.error("Proxy M3U8 Error:", err.message);
        res.status(500).send("Error reading m3u8");
    }
});

// For mux.dev nested m3u8 (the animation), we need a sub-proxy
app.get('/api/proxy/m3u8-sub', async (req, res) => {
    try {
        const targetUrl = req.query.url;
        const passedBase = req.query.base || '';
        if (!targetUrl) return res.status(400).send("No url");

        const response = await fetch(targetUrl);
        if (!response.ok) throw new Error("Gagal mengambil m3u8 sub");
        
        let m3u8Text = await response.text();
        
        const lines = m3u8Text.split('\n');
        // Extract new base URL path correctly (e.g. up to the last slash)
        const lastSlash = targetUrl.lastIndexOf('/');
        const newBaseUrl = lastSlash !== -1 ? targetUrl.substring(0, lastSlash + 1) : passedBase;

        const rewritten = lines.map(line => {
             const trimmed = line.trim();
             if (trimmed && !trimmed.startsWith('#')) {
                 const fullTsUrl = trimmed.startsWith('http') ? trimmed : newBaseUrl + trimmed;
                 return `/api/proxy/ts?url=${encodeURIComponent(fullTsUrl)}`;
             }
             return line;
        });
        
        res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.send(rewritten.join('\n'));
    } catch (err) {
        console.error("Proxy nested M3U8 Error:", err.message);
        res.status(500).send("Error reading m3u8 sub");
    }
});

app.get('/api/proxy/ts', async (req, res) => {
    try {
        const targetUrl = req.query.url;
        if (!targetUrl) return res.status(400).send("No url");

        const response = await fetch(targetUrl);
        if (!response.ok) throw new Error("Gagal mengambil ts segment");

        res.setHeader('Content-Type', 'video/mp2t');
        res.setHeader('Access-Control-Allow-Origin', '*');
        response.body.pipe(res); 
    } catch (err) {
        console.error("Proxy TS Error:", err.message);
        res.status(500).send("Error reading ts");
    }
});
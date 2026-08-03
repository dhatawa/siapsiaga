
function safeSet(id, prop, val) {
  const el = document.getElementById(id);
  if (el) el[prop] = val;
}

/* ============================================================
   SIAPSIAGA PWA — Main Application Logic v3.5
   ============================================================ */

let fasaData = {};
let API_BASE = "/api";

// ── SVG weather icon map (inline SVG strings by condition keyword) ──
const WEATHER_ICONS = {
  clear: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="22" fill="#FCD34D" filter="url(#glow)"/>
    <defs><filter id="glow"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
    ${[0, 45, 90, 135, 180, 225, 270, 315].map((a) => `<line x1="50" y1="18" x2="50" y2="10" stroke="#FCD34D" stroke-width="4" stroke-linecap="round" transform="rotate(${a} 50 50)"/>`).join("")}
  </svg>`,
  cloudy: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <circle cx="38" cy="45" r="20" fill="rgba(255,255,255,0.75)"/>
    <ellipse cx="60" cy="48" rx="26" ry="18" fill="white"/>
    <ellipse cx="35" cy="55" rx="18" ry="12" fill="white"/>
  </svg>`,
  partlycloudy: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <circle cx="28" cy="38" r="16" fill="#FCD34D"/>
    ${[0, 60, 120, 180, 240, 300].map((a) => `<line x1="28" y1="16" x2="28" y2="10" stroke="#FCD34D" stroke-width="3" stroke-linecap="round" transform="rotate(${a} 28 38)"/>`).join("")}
    <circle cx="58" cy="50" r="16" fill="white"/>
    <ellipse cx="72" cy="55" rx="20" ry="14" fill="white"/>
    <ellipse cx="48" cy="58" rx="18" ry="12" fill="white"/>
  </svg>`,
  rain: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="35" r="18" fill="rgba(255,255,255,0.9)"/>
    <ellipse cx="38" cy="55" rx="20" ry="14" fill="rgba(255,255,255,0.85)"/>
    <ellipse cx="58" cy="52" rx="24" ry="16" fill="white"/>
    <line x1="34" y1="72" x2="30" y2="85" stroke="#93C5FD" stroke-width="3" stroke-linecap="round"/>
    <line x1="44" y1="72" x2="40" y2="85" stroke="#93C5FD" stroke-width="3" stroke-linecap="round"/>
    <line x1="54" y1="72" x2="50" y2="85" stroke="#93C5FD" stroke-width="3" stroke-linecap="round"/>
    <line x1="64" y1="72" x2="60" y2="85" stroke="#93C5FD" stroke-width="3" stroke-linecap="round"/>
  </svg>`,
  storm: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="32" r="18" fill="rgba(148,163,184,0.9)"/>
    <ellipse cx="35" cy="48" rx="22" ry="14" fill="rgba(100,116,139,0.9)"/>
    <ellipse cx="60" cy="46" rx="25" ry="16" fill="#64748B"/>
    <polyline points="53,60 46,75 53,75 44,92" fill="none" stroke="#FCD34D" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
  drizzle: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="35" r="17" fill="rgba(27, 25, 25, 0.9)"/>
    <ellipse cx="38" cy="52" rx="20" ry="13" fill="rgba(255,255,255,0.85)"/>
    <ellipse cx="58" cy="50" rx="22" ry="14" fill="white"/>
    <line x1="36" y1="68" x2="33" y2="76" stroke="#BFDBFE" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="46" y1="68" x2="43" y2="76" stroke="#BFDBFE" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="56" y1="68" x2="53" y2="76" stroke="#BFDBFE" stroke-width="2.5" stroke-linecap="round"/>
  </svg>`,
};

// Map emoji strings from API to SVG condition keys
function emojiToCondKey(icon) {
  if (!icon) return "partlycloudy";
  if (icon.includes("☀") || icon.includes("🌞")) return "clear";
  if (icon.includes("⛅")) return "partlycloudy";
  if (icon.includes("☁")) return "cloudy";
  if (icon.includes("⛈")) return "storm";
  if (icon.includes("🌧") || icon.includes("🌦")) return "rain";
  if (icon.includes("🌩")) return "storm";
  return "partlycloudy";
}

// ── Set weather hero gradient dynamically ──
function updateWeatherHero(condKey, iconEmoji) {
  const hero = document.getElementById("weather-hero-card");
  const iconWrap = document.getElementById("w-icon");
  if (!hero) return;

  // Map condition to data-cond attr
  const condMap = {
    clear: "clear",
    partlycloudy: "rain",
    cloudy: "cloudy",
    rain: "rain",
    drizzle: "rain",
    storm: "storm",
  };
  hero.setAttribute("data-cond", condMap[condKey] || "rain");

  // Inject SVG icon
  if (iconWrap) {
    iconWrap.innerHTML = WEATHER_ICONS[condKey] || WEATHER_ICONS.partlycloudy;
  }
}

// ============================================================
// v3.0 — EMERGENCY TOAST NOTIFICATION
// ============================================================
let toastTimer = null;

function showToast(title, desc, durationMs = 8000) {
  const toast = document.getElementById("emergency-toast");
  const titleEl = document.getElementById("toast-title");
  const descEl = document.getElementById("toast-desc");
  if (!toast) return;

  // Clear any previous timer
  if (toastTimer) clearTimeout(toastTimer);

  // Set content
  if (titleEl) titleEl.textContent = title;
  if (descEl) descEl.textContent = desc;

  // Set progress bar duration via CSS variable
  toast.style.setProperty("--toast-duration", `${durationMs}ms`);

  // Remove any previous animation class to restart
  toast.classList.remove("show", "hide");
  // Force reflow
  void toast.offsetWidth;
  toast.classList.add("show");

  // Auto dismiss
  toastTimer = setTimeout(() => {
    dismissToast();
  }, durationMs);
}

function dismissToast() {
  const toast = document.getElementById("emergency-toast");
  if (!toast) return;
  if (toastTimer) {
    clearTimeout(toastTimer);
    toastTimer = null;
  }
  toast.classList.remove("show");
  toast.classList.add("hide");
  // Clean up after animation
  setTimeout(() => {
    toast.classList.remove("hide");
  }, 500);
}

// ============================================================
// v3.0 — WIND MAP (Weekly Rotation)
// ============================================================
const WIND_MAPS = [
  "assets/wind/wind_week1.png",
  "assets/wind/wind_week2.png",
  "assets/wind/wind_week3.png",
  "assets/wind/wind_week4.png",
];

function updateWindMap() {
  const img = document.getElementById("wind-map-img");
  const periodEl = document.getElementById("wind-map-period");
  if (!img) return;

  const now = new Date();
  // Calculate the week number of the year to determine which map to show
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const dayOfYear = Math.floor((now - startOfYear) / 86400000);
  const weekOfYear = Math.floor(dayOfYear / 7);
  const mapIndex = weekOfYear % WIND_MAPS.length;

  // Determine the start date of the current 7-day period
  const currentDayInWeek = dayOfYear % 7;
  const weekStart = new Date(now);
  weekStart.setDate(weekStart.getDate() - currentDayInWeek);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  const formatDate = (d) => {
    return d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Fade out, change src, fade in
  img.style.opacity = "0";
  setTimeout(() => {
    img.src = WIND_MAPS[mapIndex];
    img.style.opacity = "1";
  }, 300);

  if (periodEl) {
    periodEl.textContent = `Periode: ${formatDate(weekStart)} \u2013 ${formatDate(weekEnd)}`;
  }
}

// ── App Initialization ──
async function initApp() {
  window.API_BASE = "https://siapsiaga--dhatawaa.replit.app/api";

  await fetchEducation();

  await Promise.all([fetchWeather(), fetchNews(), fetchCCTV(), fetchAlerts()]);

  // v3.0: Initialize wind map
  updateWindMap();

  // v3.0: Show demo emergency toast after 3 seconds
  setTimeout(() => {
    showToast(
      "Waspada Banjir Bandang",
      "Tinggi air meningkat drastis di area Dayeuhkolot, Bandung. Warga sekitar bantaran sungai harap waspada.",
      8000,
    );
  }, 3000);

  setInterval(
    () => {
      fetchWeather();
      fetchNews();
      fetchCCTV();
      fetchAlerts();
    },
    5 * 60 * 1000,
  );

  // v3.0: Check wind map every hour (in case day changes)
  setInterval(updateWindMap, 60 * 60 * 1000);
}

// ── Weather Logic ──
async function fetchWeather() {
  try {
    let url = `${API_BASE}/weather?city=Bandung`;

    if ("geolocation" in navigator) {
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 5000,
            maximumAge: 60000
          });
        });
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        url = `${API_BASE}/weather?lat=${lat}&lon=${lon}`;
      } catch (geoErr) {
        console.warn("Akses lokasi ditolak atau timeout, fallback ke Bandung:", geoErr);
      }
    } else {
      console.warn("Geolokasi tidak didukung perangkat ini, fallback ke Bandung.");
    }

    const res = await fetch(url);
    const data = await res.json();

    if (data && data.location) {
      const el_w_location = document.getElementById('w-location'); if (el_w_location) el_w_location.innerHTML = `
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
        ${data.location.toUpperCase()}`;
      const el_w_temp = document.getElementById('w-temp'); if (el_w_temp) el_w_temp.innerHTML = `${data.current.temp}<sup>°C</sup>`;
      const elTxt_w_cond = document.getElementById('w-cond'); if (elTxt_w_cond) elTxt_w_cond.textContent = data.current.condition;
      const elTxt_w_feels = document.getElementById('w-feels'); if (elTxt_w_feels) elTxt_w_feels.textContent = `${data.current.feels_like}°C`;
      const elTxt_w_humidity = document.getElementById('w-humidity'); if (elTxt_w_humidity) elTxt_w_humidity.textContent = `${data.current.humidity}%`;
      const elTxt_w_wind = document.getElementById('w-wind'); if (elTxt_w_wind) elTxt_w_wind.textContent = `${data.current.wind} km/h`;
      const elTxt_w_rain = document.getElementById('w-rain'); if (elTxt_w_rain) elTxt_w_rain.textContent = `${data.current.rain_chance}%`;

      // Update hero gradient and icon
      const condKey = emojiToCondKey(data.current.icon);
      updateWeatherHero(condKey, data.current.icon);
    }

    // UV
    let uvText = data.current.uv;
    if (data.current.uv >= 11) uvText += " Ekstrem";
    else if (data.current.uv >= 8) uvText += " Sangat Tinggi";
    else if (data.current.uv >= 6) uvText += " Tinggi";
    else if (data.current.uv >= 3) uvText += " Sedang";
    else uvText += " Rendah";
    const elTxt_w_uv = document.getElementById('w-uv'); if (elTxt_w_uv) elTxt_w_uv.textContent = uvText;

    // UV/Rain badge
    const uvBadge = document.getElementById("w-uv-badge");
    if (uvBadge) {
      if (data.current.uv >= 6 || data.current.rain_chance >= 70) {
        uvBadge.style.display = "inline-flex";
        uvBadge.innerHTML =
          data.current.uv >= 6
            ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true" width="12" height="12"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg> Risiko UV Tinggi`
            : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true" width="12" height="12"><line x1="8" y1="19" x2="8" y2="21"/><path d="M20 16.58A5 5 0 0018 7h-1.26A8 8 0 104 15.25"/></svg> Waspada Hujan`;
      } else {
        uvBadge.style.display = "none";
      }
    }

    // Hourly
    const hourlyHtml = data.hourly
      .map((h) => {
        const timeParts = h.time.split(":");
        const formatted = timeParts[0] + ".00";
        return `
        <div class="hcard ${h.isNow ? "now" : ""}" role="listitem">
          <div class="ht">${h.isNow ? "KINI" : formatted}</div>
          <div class="hi">${h.icon}</div>
          <div class="hv">${h.temp}°</div>
        </div>`;
      })
      .join("");
    const el_w_hourly = document.getElementById('w-hourly'); if (el_w_hourly) el_w_hourly.innerHTML = hourlyHtml;

    // Forecast
    const forecastHtml = data.forecast
      .map(
        (f) => `
      <div class="forecast-item" role="listitem">
        <div class="fi-day">${f.day}</div>
        <div class="fi-icon">${f.icon}</div>
        <div class="fi-t">
          <span class="fi-hi">${f.high}°</span>
          <span class="fi-lo">${f.low}°</span>
        </div>
        <div class="fi-bar-wrap">
          <div class="fi-bar-fill" style="width:${f.bar_width}%"></div>
        </div>
        <div class="fi-pct">${f.rain_pct}%</div>
      </div>`,
      )
      .join("");
    const el_w_forecast = document.getElementById('w-forecast'); if (el_w_forecast) el_w_forecast.innerHTML = forecastHtml;
  } catch (err) {
    console.error("Failed to load weather data", err);
  }
}

// ── CCTV Logic ──
async function fetchCCTV() {
  try {
    const res = await fetch(`${API_BASE}/cctv`);
    const cameras = await res.json();

    const aiPromises = cameras.map((cam) =>
      fetch(`${API_BASE}/analyze-frame`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cameraId: cam.id }),
      }).then((r) => r.json()),
    );
    const aiResults = await Promise.all(aiPromises);

    let cctvHtml = "";
    let amanCnt = 0,
      banjirCnt = 0,
      naikCnt = 0;

    cameras.forEach((cam, i) => {
      const ai = aiResults[i];
      let aiClass = "ai-clear";
      let borderClass = "";
      let statusTxt = "AMAN";
      let bgStyle = "";

      if (ai.status === "FLOOD") {
        aiClass = "ai-flood";
        borderClass = "flooded";
        statusTxt = "⚠ BANJIR";
        bgStyle = "background:#1A0808;";
        banjirCnt++;
      } else if (ai.status === "RISING") {
        aiClass = "ai-rise";
        borderClass = "rising";
        statusTxt = "↑ NAIK";
        bgStyle = "background:#1A1200;";
        naikCnt++;
      } else {
        statusTxt = "✓ AMAN";
        amanCnt++;
      }

      const idColor =
        ai.status === "FLOOD"
          ? "color:#FF6B6B"
          : ai.status === "RISING"
            ? "color:#FCD34D"
            : "color:#546E8A";

      cctvHtml += `
        <div class="cam ${borderClass}" onclick="bukaCam(this,'${cam.name}','${ai.status}')"
          role="button" aria-label="Kamera ${cam.name} - Status ${ai.status}" tabindex="0">
          <div class="cam-screen" style="${bgStyle}">
            <span class="corner corner-tl" aria-hidden="true"></span>
            <span class="corner corner-tr" aria-hidden="true"></span>
            <span class="corner corner-bl" aria-hidden="true"></span>
            <span class="corner corner-br" aria-hidden="true"></span>
            <div class="cam-ts">--:--:--</div>
            <div class="cam-live"><div class="cam-live-txt">LIVE</div></div>
            <div style="display:flex;flex-direction:column;align-items:center;z-index:1">
              <div class="cam-icon-ph" style="${ai.status !== "SAFE" ? "opacity:.15" : ""}">📷</div>
              <div class="cam-id" style="${idColor}">${cam.id}</div>
            </div>
            <div class="ai-strip ${aiClass}">
              <span class="ai-txt">${statusTxt}</span>
              <span class="ai-conf">AI ${ai.confidence}%</span>
            </div>
          </div>
          <div class="cam-foot">
            <div class="cam-name">${cam.name}</div>
            <div class="cam-area">${cam.area}</div>
          </div>
        </div>`;
    });

    const grid =
      document.getElementById("cctv-grid") ||
      document.querySelector(".cctv-grid");
    if (grid) grid.innerHTML = cctvHtml;

    // Update summary counts
    const el = (id) => document.getElementById(id);
    if (el("cctv-aman")) el("cctv-aman").textContent = amanCnt;
    if (el("cctv-banjir")) el("cctv-banjir").textContent = banjirCnt;
    if (el("cctv-naik")) el("cctv-naik").textContent = naikCnt;

    // Simpan status CCTV secara global untuk Chatbot
    window.currentCctvStatus = { banjir: banjirCnt, naik: naikCnt, aman: amanCnt };

    // Update status siaga Bot otomatis berdasarkan prioritas tingkat bahaya
    if (typeof window.setStatus === "function") {
      if (banjirCnt > 0) {
        window.setStatus('waspada', '⚠️ Waspada! AI mendeteksi potensi banjir pada rekaman CCTV. Harap hindari area terkait dan pantau terus info terbaru.');
      } else if (naikCnt > 0) {
        window.setStatus('waspada', '⚠️ Perhatian! Ketinggian air terpantau meningkat pada kamera CCTV. Harap berhati-hati.');
      } else {
        // Hanya reset ke aman jika sebelumnya tidak sedang ada manual set status bahaya
        window.setStatus('aman', 'Halo! Semuanya baik-baik saja hari ini. Tidak ada genangan banjir terdeteksi di CCTV wilayah Bandung. Kamu bisa beraktivitas seperti biasa! 😊');
      }
    }
  } catch (err) {
    console.error("Failed to load CCTV data", err);
  }
}

// ── Alert Logic ──
async function fetchAlerts() {
  try {
    const res = await fetch(`${API_BASE}/alerts`);
    const alerts = await res.json();

    if (alerts.length === 0) {
      const el_alerts_container = document.getElementById('alerts-container'); if (el_alerts_container) el_alerts_container.innerHTML = '<div class="card" style="text-align:center;color:var(--ink-4);padding:24px">Tidak ada peringatan aktif saat ini.</div>';
      return;
    }

    const alertsHtml = alerts
      .map((a) => {
        let levelClass = "al-info";
        let levelColor = "var(--sky)";
        let iconPath =
          '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>';
        if (a.level === "CRITICAL") {
          levelClass = "al-crit";
          levelColor = "var(--red)";
          iconPath =
            '<path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>';
        } else if (a.level === "WARNING") {
          levelClass = "al-warn";
          levelColor = "var(--amber)";
          iconPath =
            '<path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/>';
        }

        return `
        <div class="alert-item ${levelClass}">
          <div class="al-level" style="color:${levelColor}">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true">${iconPath}</svg>
            ${a.level}
          </div>
          <div class="al-title">${a.title}</div>
          <div class="al-desc">${a.desc}</div>
          <div class="al-meta">
            <span>📍 ${a.area}</span>
            <span>🕒 ${a.time}</span>
          </div>
        </div>`;
      })
      .join("");

    const el_alerts_container = document.getElementById('alerts-container'); if (el_alerts_container) el_alerts_container.innerHTML = alertsHtml;

    // Update count badge
    const badge = document.getElementById("alerts-count-badge");
    if (badge) {
      badge.innerHTML = `
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        ${alerts.length} Aktif`;
    }
  } catch (err) {
    console.error("Failed to load alerts", err);
  }
}

// ── News Logic ──
async function fetchNews() {
  try {
    const res = await fetch(`${API_BASE}/news`);
    const data = await res.json();
    const news = data.articles || [];

    updateNewsStatus(data);

    if (news.length === 0) {
      // Tampilkan error jika kosong di Tab Berita
      const el_berita_list = document.getElementById('berita-list');
      if (el_berita_list) el_berita_list.innerHTML = `
        <div class="news-error">
          <div class="news-error-icon">📭</div>
          <div class="news-error-msg">Belum ada berita bencana tersedia.</div>
        </div>`;
      return;
    }

    // ==========================================
    // 1. RENDER UNTUK TAB BERITA (FULL LIST)
    // ==========================================
    const newsHtmlTab = news.map((n, i) => {
      // v3.0: Build thumbnail with real image or emoji fallback
      const thumbContent = n.image
        ? `<img src="${n.image}" alt="" loading="lazy" onerror="this.parentElement.innerHTML='<span class=nthumb-fallback>${n.thumbIcon}</span>'"/>`
        : `<span class="nthumb-fallback">${n.thumbIcon}</span>`;

      return `
      <a class="ncard fade-in" data-cat="${n.category}" style="animation-delay:${i * 0.05}s"
        href="${n.url}" target="_blank" rel="noopener noreferrer" aria-label="${n.title}">
        <div class="nthumb" style="background:${n.thumbBg}">${thumbContent}</div>
        <div class="nbody">
          <div class="nsrc-row">
            <span class="nsrc">${n.source}</span>
            <span class="ntime">· ${n.time}</span>
            <span class="next-link" aria-hidden="true">↗</span>
          </div>
          <div class="nhead">${n.title}</div>
          <div class="nsnip">${n.snippet}</div>
          <div class="ntags">
            ${n.tags && n.tags.length > 0 ? n.tags.map((t) => `<span class="ntag ${getTagClass(t.id)}">${t.text}</span>`).join("") : ""}
          </div>
        </div>
      </a>`;
    }).join("");

    const el_berita_list = document.getElementById('berita-list');
    if (el_berita_list) el_berita_list.innerHTML = newsHtmlTab;

    // ==========================================
    // 2. RENDER UNTUK DASHBOARD BERANDA (SCROLL NYAMPING)
    // ==========================================
    // Ambil 4 berita terbaru saja untuk dashboard
    const newsHtmlDashboard = news.slice(0, 4).map((n, i) => {
      const thumbContent = n.image
        ? `<img src="${n.image}" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:12px;"/>`
        : n.thumbIcon;

      // Menggunakan class .news-card sesuai template bento HTML
      const firstTagClass = n.tags && n.tags.length > 0 ? getTagClass(n.tags[0].id) : "tag-banjir";

      return `
        <a class="news-card fade-in" href="${n.url}" target="_blank" rel="noopener noreferrer" style="animation-delay:${i * 0.05}s; text-decoration:none; color:inherit;">
          <div class="news-thumb" style="background:${n.thumbBg}; display:flex; align-items:center; justify-content:center; font-size:1.8rem;">${thumbContent}</div>
          <div class="news-body">
            <div class="news-tag ${firstTagClass}">${n.category.toUpperCase()}</div>
            <div class="news-title">${n.title}</div>
            <div class="news-time">${n.source} · ${n.time}</div>
          </div>
        </a>`;
    }).join("");

    // Cari elemen pembungkus berita scroll di dashboard
    const el_dashboard_news = document.querySelector('.news-scroll');
    if (el_dashboard_news) {
      el_dashboard_news.innerHTML = newsHtmlDashboard;
    }

  } catch (err) {
    console.error("Failed to load news data", err);
  }
}

function updateNewsStatus(data) {
  const statusEl = document.getElementById("news-status");
  if (!statusEl) return;
  const statusText = statusEl.querySelector(".news-status-text");
  const statusDot = statusEl.querySelector(".news-status-dot");

  if (data.error && (!data.articles || data.articles.length === 0)) {
    statusDot.style.background = "var(--red)";
    statusText.innerHTML = `<b>⚠ Error:</b> ${data.error}`;
  } else {
    statusDot.style.background = "var(--emerald)";
    const lastTime = data.lastUpdated
      ? new Date(data.lastUpdated).toLocaleString("id-ID", {
        timeZone: "Asia/Jakarta",
        hour: "2-digit",
        minute: "2-digit",
        day: "numeric",
        month: "short",
      })
      : "-";
    statusText.innerHTML = `<b>${data.articles?.length || 0} berita</b> · Diperbarui ${lastTime}`;
  }
}

async function manualRefreshNews() {
  const btn = document.querySelector(".news-refresh-btn");
  btn.classList.add("loading");
  btn.innerHTML = `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" style="display:inline;vertical-align:middle;margin-right:4px;animation:spin 1s linear infinite" aria-hidden="true"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>`;
  try {
    await fetch(`${API_BASE}/news/refresh`, { method: "POST" });
    await fetchNews();
  } catch (err) {
    console.error(err);
  }
  btn.classList.remove("loading");
  btn.innerHTML = `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" style="display:inline;vertical-align:middle;margin-right:4px" aria-hidden="true"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg> Refresh`;
}

// ── Education Logic ──
async function fetchEducation() {
  // API call omitted since we are using static HTML now
}

function toggleDis(head) {
  const card = head.closest(".dis-card");
  const wasOpen = card.classList.contains("open");
  document.querySelectorAll(".dis-card").forEach((c) => {
    c.classList.remove("open");
    const h = c.querySelector(".dis-head");
    if (h) h.setAttribute("aria-expanded", "false");
  });
  if (!wasOpen) {
    card.classList.add("open");
    head.setAttribute("aria-expanded", "true");

    // Auto buka panel fase pertama jika belum pernah buka
    if (!card.dataset.initialized) {
      const firstTab = card.querySelector(".ptab");
      if (firstTab) switchFase(firstTab, 0);
      card.dataset.initialized = "true";
    }
  }
}

function renderFase(el, type, idx) {
  // Tidak dipakai, sudah menggunakan elemen `.phase-panel`
}

function switchFase(btn, idx) {
  const card = btn.closest(".dis-card");

  // Set tab buttons active status
  card.querySelectorAll(".ptab").forEach((t, i) => {
    t.classList.toggle("active", i === idx);
    t.setAttribute("aria-selected", i === idx ? "true" : "false");
  });

  // Show / hide corresponding static div phase-panel
  const panels = card.querySelectorAll(".phase-panel");
  panels.forEach((p, i) => {
    p.style.display = (i === idx) ? "block" : "none";
  });
}

function filterEdu(type, btn) {
  document.querySelectorAll(".etab").forEach((t) => {
    t.classList.remove("active");
    t.setAttribute("aria-pressed", "false");
  });
  btn.classList.add("active");
  btn.setAttribute("aria-pressed", "true");
  document.querySelectorAll(".dis-card").forEach((c) => {
    const show = type === "all" || c.getAttribute("data-type") === type;
    c.style.display = show ? "block" : "none";
  });
}

function filterBerita(cat, btn) {
  document.querySelectorAll(".nf").forEach((b) => {
    b.classList.remove("active");
    b.setAttribute("aria-pressed", "false");
  });
  btn.classList.add("active");
  btn.setAttribute("aria-pressed", "true");
  document.querySelectorAll("#berita-list .ncard").forEach((c) => {
    const show = cat === "all" || c.getAttribute("data-cat") === cat;
    c.style.display = show ? "flex" : "none";
  });
}

// ── Utils ──

window.openEmergencyModal = function (type) {
  const title = document.getElementById("emergency-modal-title");
  const body = document.getElementById("emergency-modal-body");

  if (type === 'p3k') {
    title.textContent = 'Panduan P3K Darurat';
    body.innerHTML = `
      <ul style="margin:0; padding-left:20px; text-align:left;">
        <li style="margin-bottom:8px;"><strong>Luka Memar:</strong> Kompres area dengan es selama 15 menit.</li>
        <li style="margin-bottom:8px;"><strong>Pendarahan:</strong> Tekan kuat pada luka menggunakan kain kasa/bersih untuk menghentikan pendarahan.</li>
        <li style="margin-bottom:8px;"><strong>Patah Tulang:</strong> Jangan pindahkan korban. Stabilkan area yang patah lalu hubungi petugas darurat.</li>
        <li style="margin-bottom:8px;"><strong>Luka Bakar:</strong> Alirkan air dingin (bukan es) selama 10 menit.</li>
      </ul>
      <p style="margin-top:10px; font-weight:600; text-align:left;">Pastikan kotak P3K Anda berisi alat yang lengkap (perban, alkohol, plester, obat obatan dasar).</p>
    `;
  } else if (type === 'kontak') {
    title.textContent = 'Nomor Darurat Nasional';
    body.innerHTML = `
      <ul style="margin:0; padding-left:20px; text-align:left;">
        <li style="margin-bottom:8px;"><strong>Ambulans/Kemenkes:</strong> 118 / 119</li>
        <li style="margin-bottom:8px;"><strong>Polri:</strong> 110</li>
        <li style="margin-bottom:8px;"><strong>Pemadam Kebakaran:</strong> 113</li>
        <li style="margin-bottom:8px;"><strong>SAR Nasional / Basarnas:</strong> 115</li>
        <li style="margin-bottom:8px;"><strong>BNPB / Posko Bencana:</strong> 117</li>
        <li style="margin-bottom:8px;"><strong>PLN (Gangguan Listrik):</strong> 123</li>
      </ul>
      <p style="margin-top:10px; font-weight:600; text-align:left;">Simpan nomor ini untuk dihubungi jika keadaan mendesak memburuk.</p>
    `;
  }

  document.getElementById("emergency-modal").classList.add("active");
  document.getElementById("emergency-modal-overlay").classList.add("active");
};

window.closeEmergencyModal = function () {
  document.getElementById("emergency-modal").classList.remove("active");
  document.getElementById("emergency-modal-overlay").classList.remove("active");
};
function getTagClass(tagId) {
  const map = {
    banjir: "tflood",
    gempa: "tquake",
    angin: "twind",
    longsor: "tslide",
    gunung: "twind",
    kebakaran: "twind",
    bencana: "tquake",
  };
  return map[tagId] || "tquake";
}

// ── Navigation ──
function ganti(tab, btn) {
  document
    .querySelectorAll(".view")
    .forEach((v) => v.classList.remove("active"));
  document.querySelectorAll(".nav-btn").forEach((b) => {
    b.classList.remove("active");
    b.setAttribute("aria-selected", "false");
  });
  const targetView = document.getElementById("view-" + tab);
  if (targetView) targetView.classList.add("active");
  if (btn) {
    btn.classList.add("active");
    btn.setAttribute("aria-selected", "true");
  }
}

function bukaCam(el, nama, status) {
  console.log("Kamera dibuka:", nama, "| Status AI:", status);
  if (typeof window.openCCTV === "function") {
    window.openCCTV(nama);
  }
}

let hlsInstance = null;

window.openCCTV = function (locationName) {
  const modal = document.getElementById("cctv-modal");
  const overlay = document.getElementById("cctv-modal-overlay");
  const title = document.getElementById("cctv-modal-title");
  let videoEl = document.getElementById("cctv-player");

  if (title) title.textContent = "Live CCTV - " + locationName;
  if (modal) modal.classList.add("active");
  if (overlay) overlay.classList.add("active");

  // Jika elemen target masih canvas (karena update sebelumnya), ubah kembali ke video
  if (videoEl && videoEl.tagName.toLowerCase() === "canvas") {
    const video = document.createElement("video");
    video.id = "cctv-player";
    video.controls = true;
    video.autoplay = true;
    video.style.width = "100%";
    video.style.borderRadius = "10px";
    videoEl.parentNode.replaceChild(video, videoEl);
    videoEl = video;
  }

  // Gunakan proxy backend kita (sesuaikan dengan API_BASE supaya bisa load dari cPanel/Replit)
  const proxyUrl = `${window.API_BASE || '/api'}/proxy/m3u8?lokasi=${encodeURIComponent(locationName)}`;

  if (videoEl) {
    if (typeof Hls !== "undefined" && Hls.isSupported()) {
      if (hlsInstance) hlsInstance.destroy();
      hlsInstance = new Hls({ debug: false });
      hlsInstance.loadSource(proxyUrl);
      hlsInstance.attachMedia(videoEl);
      hlsInstance.on(Hls.Events.MANIFEST_PARSED, function () {
        videoEl.play().catch(e => console.log("Autoplay blocked:", e));
      });
    } else if (videoEl.canPlayType('application/vnd.apple.mpegurl')) {
      videoEl.src = proxyUrl;
      videoEl.addEventListener('loadedmetadata', function () {
        videoEl.play().catch(e => console.log("Autoplay blocked:", e));
      });
    }
  }
};

window.closeCCTV = function () {
  const modal = document.getElementById("cctv-modal");
  const overlay = document.getElementById("cctv-modal-overlay");
  const videoEl = document.getElementById("cctv-player");

  if (modal) modal.classList.remove("active");
  if (overlay) overlay.classList.remove("active");

  if (hlsInstance) {
    hlsInstance.destroy();
    hlsInstance = null;
  }
  if (videoEl && videoEl.tagName.toLowerCase() === "video") {
    videoEl.pause();
    videoEl.src = "";
    videoEl.removeAttribute('src');
    videoEl.load();
  }
};

function updateTimestamps() {
  const now = new Date();
  const ts = now.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  document.querySelectorAll(".cam-ts").forEach((el) => (el.textContent = ts));
}

// ── Keyboard nav support for accordion ──
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    const head = e.target.closest(".dis-head");
    if (head) {
      e.preventDefault();
      toggleDis(head);
    }
  }
});

// ── Spin animation for refresh icon ──
const styleEl = document.createElement("style");
styleEl.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
document.head.appendChild(styleEl);

// ── Event Listeners ──
setInterval(updateTimestamps, 1000);
document.addEventListener("DOMContentLoaded", initApp);

/* ============================================================
   SIAGABOT — Vanilla JS Controller
   ============================================================ */
(function () {
  /* ── Data tiap status ── */
  const DEFAULT_STATUS_DATA = {
    aman: {
      bodyColor: "#10B981",
      armColor: "#10B981",
      legColor: "#0d9169",
      feetColor: "#0a7a57",
      helmTopColor: "#FFB703",
      helmBrimColor: "#e0a800",
      pupilColor: "#10B981",
      antennaColor: "#10B981",
      badgeText: "Kondisi Aman",
      mouthPath: "M33 66 Q40 72 47 66" /* senyum */,
      browOpacity: "0",
      blushOpacity: "0.4",
      sweatOpacity: "0",
      exclaimOpacity: "0",
      defaultMessage:
        "Halo! Semuanya baik-baik saja hari ini. Tidak ada ancaman bencana terdeteksi di Bandung. Cuaca cerah berawan, risiko banjir rendah. Kamu bisa beraktivitas seperti biasa! 😊",
    },
    waspada: {
      bodyColor: "#F97316",
      armColor: "#F97316",
      legColor: "#ea580c",
      feetColor: "#dc2626",
      helmTopColor: "#FDBA74",
      helmBrimColor: "#F97316",
      pupilColor: "#b45309",
      antennaColor: "#F97316",
      badgeText: "Siaga Waspada",
      mouthPath: "M33 68 Q40 61 47 68" /* kaget / cemas */,
      browOpacity: "1",
      blushOpacity: "0.1",
      sweatOpacity: "0.75",
      exclaimOpacity: "1",
      defaultMessage:
        "⚠ Perhatian! Intensitas hujan meningkat di wilayah Bandung Barat dan Cimahi. Pantau terus kondisi Sungai Cikapundung. Warga di zona RB-II harap bersiap melakukan evakuasi jika diperlukan.",
    },
    bahaya: {
      bodyColor: "#E63946",
      armColor: "#E63946",
      legColor: "#c81020",
      feetColor: "#991b1b",
      helmTopColor: "#374151",
      helmBrimColor: "#1f2937",
      pupilColor: "#7f1d1d",
      antennaColor: "#E63946",
      badgeText: "Bahaya Kritis",
      mouthPath: "M34 68 Q40 58 46 68" /* panik / terbuka */,
      browOpacity: "1",
      blushOpacity: "0",
      sweatOpacity: "1",
      exclaimOpacity: "1",
      defaultMessage:
        "🚨 DARURAT! Banjir bandang terdeteksi di Jl. Soekarno-Hatta. Ketinggian air +2.3m & terus naik. SEGERA EVAKUASI ke titik kumpul terdekat. Hindari kawasan underpass dan jembatan!",
    },
  };

  const STATUS_DATA = JSON.parse(JSON.stringify(DEFAULT_STATUS_DATA));

  const STATUS_ORDER = ["aman", "waspada", "bahaya"];
  let currentStatus = "aman";
  let isAnimating = false;

  /* ── Helper: ambil elemen SVG ── */
  function sbot(id) {
    return document.getElementById(id);
  }

  async function loadStatusData() {
    try {
      const res = await fetch(`${API_BASE}/siagabot-status`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (!data || !data.statuses) return;

      Object.keys(DEFAULT_STATUS_DATA).forEach((key) => {
        if (data.statuses[key]) {
          STATUS_DATA[key] = { ...STATUS_DATA[key], ...data.statuses[key] };
        }
      });

      if (data.active && STATUS_DATA[data.active]) {
        currentStatus = data.active;
      }
    } catch (err) {
      console.warn(
        "Gagal memuat status SiagaBot dari server, memakai konfigurasi lokal.",
        err,
      );
    }
  }

  function updateStatusButtons(key) {
    ["aman", "waspada", "bahaya"].forEach((statusKey) => {
      const btn = document.getElementById(`mini-status-btn-${statusKey}`);
      if (btn) btn.classList.toggle("is-active", statusKey === key);
    });
  }

  /* ── Terapkan warna & ekspresi ke SVG ── */
  function applyBotVisuals(key) {
    const d = STATUS_DATA[key];

    ["sbot", "msbot"].forEach((prefix) => {
      sbot(prefix + "-body")?.setAttribute("fill", d.bodyColor);
      sbot(prefix + "-arm-l")?.setAttribute("fill", d.armColor);
      sbot(prefix + "-arm-r")?.setAttribute("fill", d.armColor);
      sbot(prefix + "-antenna-bulb")?.setAttribute("fill", d.antennaColor);
      sbot(prefix + "-antenna-ring")?.setAttribute("stroke", d.antennaColor);
      sbot(prefix + "-helm-top")?.setAttribute("fill", d.helmTopColor);
      sbot(prefix + "-helm-brim")?.setAttribute("fill", d.helmBrimColor);
      sbot(prefix + "-pupil-l")?.setAttribute("fill", d.pupilColor);
      sbot(prefix + "-pupil-r")?.setAttribute("fill", d.pupilColor);
      sbot(prefix + "-mouth")?.setAttribute("d", d.mouthPath);
      sbot(prefix + "-brow-l")?.setAttribute("opacity", d.browOpacity);
      sbot(prefix + "-brow-r")?.setAttribute("opacity", d.browOpacity);
      sbot(prefix + "-blush-l")?.setAttribute("opacity", d.blushOpacity);
      sbot(prefix + "-blush-r")?.setAttribute("opacity", d.blushOpacity);
      sbot(prefix + "-sweat")?.setAttribute("opacity", d.sweatOpacity);
      sbot(prefix + "-exclaim")?.setAttribute("opacity", d.exclaimOpacity);
    });

    /* kaki & sepatu */
    document
      .querySelectorAll(".sbot-leg, .msbot-leg")
      .forEach((el) => el.setAttribute("fill", d.legColor));
    document
      .querySelectorAll(".sbot-foot, .msbot-foot")
      .forEach((el) => el.setAttribute("fill", d.feetColor));
  }

  /* ── Animasi typing → tampilkan pesan ── */
  function showMessage(text) {
    ["sbot-message", "msbot-message"].forEach((id) => {
      const el = sbot(id);
      if (!el) return;

      el.classList.add("is-fading");
      setTimeout(() => {
        /* tampilkan typing dots */
        el.innerHTML =
          '<div class="siaga-typing"><span></span><span></span><span></span></div>';
        el.classList.remove("is-fading");
      }, 150);

      /* setelah 900ms, tampilkan teks asli */
      setTimeout(() => {
        el.textContent = text;
      }, 900);
    });
  }

  /* ── Update timestamp ── */
  function updateTime() {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    ["sbot-time", "msbot-time"].forEach((id) => {
      const el = sbot(id);
      if (el) el.textContent = "Diperbarui " + hh + ":" + mm + " WIB";
    });
  }

  /* ══════════════════════════════════════
     PUBLIC API
  ═══════════════════════════════════════ */

  /**
   * setStatus(key)
   * Ganti status SiagaBot.
   * @param {'aman'|'waspada'|'bahaya'} key
   * @param {string} [customMessage] — opsional, override pesan default
   */
  window.setStatus = function (key, customMessage) {
    if (!STATUS_DATA[key] || isAnimating) return;
    isAnimating = true;
    currentStatus = key;

    const wrapper = document.getElementById("briefing-wrapper");
    if (wrapper) wrapper.className = "briefing-wrapper status-" + key;

    const miniWrapper = document.getElementById("mini-briefing-wrapper");
    if (miniWrapper)
      miniWrapper.className = "mini-siagabot-wrapper status-" + key;

    const fab = document.getElementById("chatbot-fab");
    if (fab) fab.className = "chatbot-fab status-" + key;

    applyBotVisuals(key);
    updateStatusButtons(key);

    ["sbot-badge", "msbot-badge"].forEach((id) => {
      const badge = sbot(id);
      if (badge) badge.textContent = STATUS_DATA[key].badgeText;
    });

    const msg = customMessage || STATUS_DATA[key].defaultMessage;
    showMessage(msg);
    updateTime();

    setTimeout(() => {
      isAnimating = false;
    }, 1000);
  };

  /**
   * setBotMessage(text)
   * Isi teks bubble dari LLM/AI backend tanpa mengubah status.
   * @param {string} text
   */
  window.setBotMessage = function (text) {
    showMessage(text);
    updateTime();
  };

  /**
   * nextStatus()
   * Putar ke status berikutnya (dipakai saat klik kartu).
   */
  window.nextStatus = function () {
    const idx = STATUS_ORDER.indexOf(currentStatus);
    const next = STATUS_ORDER[(idx + 1) % STATUS_ORDER.length];
    window.setStatus(next);
  };

  /**
   * nextStatusMini()
   */
  window.nextStatusMini = function () {
    const wrapper = document.getElementById("mini-briefing-wrapper");
    let activeStatus = currentStatus;

    if (wrapper) {
      if (wrapper.classList.contains("status-bahaya")) activeStatus = "bahaya";
      else if (wrapper.classList.contains("status-waspada"))
        activeStatus = "waspada";
      else activeStatus = "aman";
    }

    const idx = STATUS_ORDER.indexOf(activeStatus);
    const next = STATUS_ORDER[(idx + 1 + STATUS_ORDER.length) % STATUS_ORDER.length];
    window.setStatus(next);
  };

  loadStatusData().finally(() => {
    updateStatusButtons(currentStatus);
    window.setStatus(currentStatus);
  });

  /**
   * toggleChatModal()
   * Membuka / menutup bottom sheet chatbot
   */
  window.toggleChatModal = function (forceOpen) {
    const modal = document.getElementById("chat-modal");
    const overlay = document.getElementById("chat-modal-overlay");
    if (!modal || !overlay) return;

    const shouldOpen =
      typeof forceOpen === "boolean"
        ? forceOpen
        : !modal.classList.contains("active");

    modal.classList.toggle("active", shouldOpen);
    overlay.classList.toggle("active", shouldOpen);
    document.body.style.overflow = shouldOpen ? "hidden" : "";
  };

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") window.toggleChatModal(false);
  });

  /**
   * sendChatMessage()
   * Mengirim dummy chat message via Chatbot UI
   */
  window.sendChatMessage = async function (overrideText) {
    const input = document.getElementById("chat-input");
    const body = document.getElementById("chat-body");
    if (!body) return;

    let msg = "";
    if (typeof overrideText === 'string' && overrideText.trim() !== "") {
      msg = overrideText.trim();
    } else {
      if (!input || !input.value || input.value.trim() === "") return;
      msg = input.value.trim();
    }

    // Add User Message
    const userDiv = document.createElement("div");
    userDiv.className = "chat-msg chat-msg-user";
    userDiv.textContent = msg;
    body.appendChild(userDiv);

    input.value = "";
    body.scrollTop = body.scrollHeight;

    // Add Loading Indicator
    const loadingDiv = document.createElement("div");
    loadingDiv.className = "chat-msg chat-msg-bot";
    loadingDiv.innerHTML = '<span style="animation: blink 1.4s infinite both; width:6px; height:6px; background:currentColor; border-radius:50%; display:inline-block;"></span> <span style="animation: blink 1.4s infinite both; animation-delay: 0.2s; width:6px; height:6px; background:currentColor; border-radius:50%; display:inline-block;"></span> <span style="animation: blink 1.4s infinite both; animation-delay: 0.4s; width:6px; height:6px; background:currentColor; border-radius:50%; display:inline-block;"></span>';
    body.appendChild(loadingDiv);
    body.scrollTop = body.scrollHeight;

    try {
      // Call Backend API
      const res = await fetch('/api/chat', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Sisipkan metadata status CCTV jika tersedia
        body: JSON.stringify({ 
          message: msg,
          cctvStatus: window.currentCctvStatus || { aman: 0, banjir: 0, naik: 0 }
        })
      });
      const data = await res.json();

      if (res.ok && data.reply) {
        // Simple Markdown logic: format bold and newlines
        const formattedReply = data.reply
          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
          .replace(/\*(.*?)\*/g, "<em>$1</em>")
          .replace(/\n/g, "<br>");
        loadingDiv.innerHTML = formattedReply;
      } else {
        loadingDiv.innerHTML = data.error || "Maaf, sistem tidak dapat memproses pesan.";
      }
    } catch (err) {
      console.error("Chat Error:", err);
      loadingDiv.innerHTML = "Koneksi terputus. Silakan coba lagi nanti.";
    }

    body.scrollTop = body.scrollHeight;
  };

  /* Inisialisasi awal (pastikan DOM siap) */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      applyBotVisuals("aman");
      updateTime();
    });
  } else {
    applyBotVisuals("aman");
    updateTime();
  }
})();

/* ============================================================
   TAMBAHAN FUNGSI INTERAKTIVITAS (STRICT DOM MANIPULATION)
   ============================================================ */

/**
 * Mengontrol Status Bencana dengan hanya memanipulasi class list.
 * Tidak ada penyuntikan inline style CSS.
 * @param {string} status - Pilihan: 'aman', 'waspada', 'bahaya'
 */
const setDisasterStatus = (status) => {
  const mainContainer = document.getElementById("app") || document.body;
  if (mainContainer) {
    mainContainer.classList.remove("status-aman", "status-waspada", "status-bahaya");
    if (status === "aman" || status === "waspada" || status === "bahaya") {
      mainContainer.classList.add(`status-${status}`);
    }
  }
};

/**
 * Menutup modal Chatbot hanya dengan menghapus class '.active'
 */
const closeChatbotModal = () => {
  const modal = document.querySelector(".chat-modal");
  const overlay = document.querySelector(".chat-modal-overlay");
  if (modal) modal.classList.remove("active");
  if (overlay) overlay.classList.remove("active");
};

/**
 * Membuka modal Chatbot hanya dengan menambahkan class '.active'
 */
const openChatbotModal = () => {
  const modal = document.querySelector(".chat-modal");
  const overlay = document.querySelector(".chat-modal-overlay");
  if (modal) modal.classList.add("active");
  if (overlay) overlay.classList.add("active");
};

// Mendaftarkan event listeners untuk elemen Chatbot
document.addEventListener("DOMContentLoaded", () => {
  const fabButton = document.getElementById("chatbot-fab") || document.querySelector(".chatbot-fab");
  const overlayEl = document.getElementById("chat-modal-overlay") || document.querySelector(".chat-modal-overlay");
  // Beberapa desain mungkin menggunakan class .close atau #chat-modal-close
  const closeButtons = document.querySelectorAll(".chat-modal-close, .close-modal");

  if (fabButton) {
    fabButton.addEventListener("click", (e) => {
      e.preventDefault();
      openChatbotModal();
    });
  }

  if (closeButtons.length > 0) {
    closeButtons.forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        closeChatbotModal();
      });
    });
  }

  if (overlayEl) {
    overlayEl.addEventListener("click", () => {
      closeChatbotModal();
    });
  }
});

// ============================================================
// WEB PUSH NOTIFICATIONS
// ============================================================
window.subscribePushNotif = async function() {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    alert("Push notifications tidak didukung pada browser ini.");
    return;
  }
  
  try {
    const perm = await Notification.requestPermission();
    if (perm !== "granted") {
      alert("Izin notifikasi ditolak! Harap izinkan melalui setting browser.");
      return;
    }
    
    const apiBaseUrl = window.API_BASE || '/api';
    const vkRes = await fetch(apiBaseUrl + '/vapidPublicKey');
    const vkData = await vkRes.json();
    const publicVapidKey = vkData.publicKey;
    
    function urlBase64ToUint8Array(base64String) {
      const padding = '='.repeat((4 - base64String.length % 4) % 4);
      const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');
      const rawData = window.atob(base64);
      const outputArray = new Uint8Array(rawData.length);
      for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
      }
      return outputArray;
    }
    
    const registration = await navigator.serviceWorker.ready;
    let subscription = await registration.pushManager.getSubscription();
    
    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
      });
    }
    
    // Kirim subscription ke backend
    const subRes = await fetch(apiBaseUrl + '/subscribe/push', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(subscription)
    });
    
    const subData = await subRes.json();
    if (subData.success) {
      const modal = document.getElementById("success-modal");
      const overlay = document.getElementById("success-modal-overlay");
      if (modal && overlay) {
        overlay.classList.add("active");
        modal.classList.add("active");
      } else {
        alert("Berhasil mengaktifkan Notifikasi Layar Kunci (Push)!");
      }
    } else {
      alert("Gagal mengaktifkan push: " + (subData.error || ""));
    }
  } catch (err) {
    console.error("Error setting up push notifications", err);
    alert("Terjadi kesalahan sistem saat mengatur Push Notifications.");
  }
};

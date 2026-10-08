import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Hand } from 'lucide-react';
import './sijan-smart.css';
import SijanSmartDevice from './SijanSmartDevice';
import { CLOSED_WIDTH, EXPLODED_WIDTH, PARTS, STACK_BREAKPOINT } from './sijanSmartData';

export default function SijanSmartShowcase() {
  const [open, setOpen] = useState(false);
  const [powerOff, setPowerOff] = useState(false);
  const [active, setActive] = useState(null);
  const [toast, setToast] = useState({ msg: '', show: false });
  const [stageW, setStageW] = useState(() =>
    typeof window === 'undefined' ? 1200 : Math.min(window.innerWidth - 48, 1232)
  );

  const stageRef = useRef(null);
  const canvasRef = useRef(null);
  const deviceRef = useRef(null);
  const slideRef = useRef(null);
  const pinRefs = useRef({});
  const cardRefs = useRef({});
  const leaderRefs = useRef({});
  const toastTimer = useRef(null);
  const navBusy = useRef(false);

  const stacked = stageW < STACK_BREAKPOINT;
  // Desktop: lebar kolom tengah = lebar panggung − padding (2×72) − kolom kartu (2×230) − gap (2×24)
  const scale = stacked
    ? Math.min(1, (stageW - 32) / (open ? EXPLODED_WIDTH : CLOSED_WIDTH))
    : Math.min(1, (stageW - 652) / EXPLODED_WIDTH);

  // Nilai terbaru untuk dibaca loop animasi tanpa me-restart effect.
  const live = useRef({ open, stacked });
  live.current = { open, stacked };

  /* ---------- Hujan (canvas) + garis penunjuk ---------- */
  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const WIND = -0.14;
    let W = 0, H = 0, drops = [], splashes = [], raf = 0, visible = false;

    const makeDrop = (initial) => {
      const z = Math.random();
      return {
        x: Math.random() * (W + 160) - 40,
        y: initial ? Math.random() * H : -30 - Math.random() * H * 0.3,
        z, len: 8 + z * 18, v: 6 + z * 11, a: 0.08 + z * 0.22, w: 0.6 + z * 0.9,
      };
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = stage.clientWidth; H = stage.clientHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(220, (W * H) / (reduceMotion ? 16000 : 5500)));
      drops = Array.from({ length: count }, () => makeDrop(true));
      setStageW(W);
    };

    const drawRain = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.lineCap = 'round';
      for (const d of drops) {
        d.y += d.v; d.x += d.v * WIND;
        ctx.strokeStyle = `rgba(100, 116, 139, ${d.a})`;
        ctx.lineWidth = d.w;
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - d.len * WIND, d.y - d.len);
        ctx.stroke();
        if (d.y > H - 2) {
          if (d.z > 0.6) splashes.push({ x: d.x, y: H - 3, r: 1, life: 1 });
          Object.assign(d, makeDrop(false));
        }
      }
      for (let i = splashes.length - 1; i >= 0; i--) {
        const s = splashes[i];
        s.life -= 0.04; s.r += 0.6;
        if (s.life <= 0) { splashes.splice(i, 1); continue; }
        ctx.strokeStyle = `rgba(100, 116, 139, ${s.life * 0.25})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.ellipse(s.x, s.y, s.r * 2.2, s.r * 0.5, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
    };

    const drawLeaders = () => {
      if (!live.current.open || live.current.stacked) return;
      const s = stage.getBoundingClientRect();
      for (const part of PARTS) {
        const pin = pinRefs.current[part.id];
        const card = cardRefs.current[part.id];
        const L = leaderRefs.current[part.id];
        if (!pin || !card || !L?.path) continue;
        const p = pin.getBoundingClientRect();
        const c = card.getBoundingClientRect();
        const px = p.left + p.width / 2 - s.left;
        const py = p.top + p.height / 2 - s.top;
        const ex = (part.side === 'left' ? c.right : c.left) - s.left;
        const ey = c.top + 25 - s.top;
        const bx = ex + (part.side === 'left' ? 28 : -28);
        // Garis dimulai dari tepi pin agar angkanya tidak tertutup.
        const len = Math.hypot(bx - px, ey - py) || 1;
        const r = p.width / 2 + 3;
        const ax = px + ((bx - px) / len) * r;
        const ay = py + ((ey - py) / len) * r;
        L.path.setAttribute('d', `M${ax.toFixed(1)},${ay.toFixed(1)} L${bx.toFixed(1)},${ey.toFixed(1)} L${ex.toFixed(1)},${ey.toFixed(1)}`);
        L.end.setAttribute('cx', ex); L.end.setAttribute('cy', ey);
        L.start.setAttribute('cx', ax); L.start.setAttribute('cy', ay);
      }
    };

    const loop = () => {
      if (!visible) { raf = 0; return; }
      drawRain();
      drawLeaders();
      raf = requestAnimationFrame(loop);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(stage);
    // Animasi hanya berjalan saat section terlihat di layar.
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(loop);
    });
    io.observe(stage);

    return () => {
      ro.disconnect();
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const showToast = useCallback((msg) => {
    setToast({ msg, show: true });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast((t) => ({ ...t, show: false })), 2200);
  }, []);

  /* ---------- Navigasi prototype ---------- */
  const navigate = (dir) => {
    if (navBusy.current) return;
    navBusy.current = true;
    setOpen(false);
    showToast(dir > 0 ? 'Menampilkan prototype selanjutnya' : 'Menampilkan prototype sebelumnya');

    const el = slideRef.current;
    const exitCls = dir > 0 ? 'sj-out-left' : 'sj-out-right';
    const enterCls = dir > 0 ? 'sj-out-right' : 'sj-out-left';
    el.classList.add(exitCls);
    setTimeout(() => {
      // Lompat ke sisi berlawanan tanpa animasi, lalu geser masuk.
      el.classList.add('sj-no-anim');
      el.classList.remove(exitCls);
      el.classList.add(enterCls);
      void el.offsetWidth;
      el.classList.remove('sj-no-anim', enterCls);
      setTimeout(() => { navBusy.current = false; }, 450);
    }, 450);
  };

  /* ---------- Interaksi perangkat ---------- */
  const toggleOpen = () => setOpen((v) => !v);

  const handleDeviceKey = (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleOpen(); }
  };

  const handleStageKey = (e) => {
    if (e.key === 'ArrowLeft') navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
    if (e.key === 'Escape') setOpen(false);
  };

  const handleRocker = (e) => {
    e.stopPropagation();
    setPowerOff(!powerOff);
    showToast(powerOff ? 'Perangkat dinyalakan' : 'Perangkat dimatikan');
  };

  const canTilt = typeof window !== 'undefined'
    && window.matchMedia('(pointer: fine)').matches
    && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const handlePointerMove = (e) => {
    if (!canTilt) return;
    const r = stageRef.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    deviceRef.current.style.setProperty('--sj-ry', `${(x * 8).toFixed(2)}deg`);
    deviceRef.current.style.setProperty('--sj-rx', `${(-y * 5).toFixed(2)}deg`);
  };

  const resetTilt = () => {
    deviceRef.current?.style.setProperty('--sj-ry', '0deg');
    deviceRef.current?.style.setProperty('--sj-rx', '0deg');
  };

  const pin = (id, style) => (
    <span
      ref={(el) => { pinRefs.current[id] = el; }}
      className={`sj-pin ${active === id ? 'is-active' : ''}`}
      style={style}
    >
      {id}
    </span>
  );

  const renderCard = (part, index) => (
    <article
      key={part.id}
      ref={(el) => { cardRefs.current[part.id] = el; }}
      className={`sj-card sj-panel ${active === part.id ? 'is-active' : ''}`}
      style={{ '--i': index }}
      onMouseEnter={() => setActive(part.id)}
      onMouseLeave={() => setActive(null)}
      aria-hidden={!open}
    >
      <header>
        <span className="sj-num">{part.id}</span>
        <h4>{part.title}</h4>
        <span className={`sj-tag ${part.type === 'ext' ? 'sj-tag-ext' : 'sj-tag-int'}`}>
          {part.type === 'ext' ? 'Eksternal' : 'Internal'}
        </span>
      </header>
      <p>{part.desc}</p>
    </article>
  );

  const leftParts = PARTS.filter((p) => p.side === 'left');
  const rightParts = PARTS.filter((p) => p.side === 'right');

  return (
    <div
      ref={stageRef}
      className="sj-stage"
      data-open={open}
      data-stacked={stacked}
      onKeyDown={handleStageKey}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
    >
      <canvas ref={canvasRef} className="sj-rain" aria-hidden="true" />

      <div ref={slideRef} className="sj-slide">
        <div className="sj-grid">
          {/* Kolom kiri: intro + komponen eksternal */}
          <div className="sj-col sj-col-left">
            <div className="sj-overview sj-intro">
              <p className="sj-eyebrow">Prototype 01</p>
              <h3>SIJAN SMART</h3>
              <p className="sj-sub">Siaga Hujan Smart</p>
              <p className="sj-lead">
                Stasiun siaga hujan berbasis ESP32 yang memantau curah hujan, suhu, dan kelembapan,
                lalu memberi peringatan dini lewat layar, LED, dan sirene.
              </p>
              <div className="sj-specs">
                <span>ESP32</span><span>DHT22</span><span>Solar 6V</span><span>MQTT</span>
              </div>
            </div>
            {leftParts.map((p) => renderCard(p, PARTS.indexOf(p)))}
          </div>

          <SijanSmartDevice
            open={open}
            powerOff={powerOff}
            scale={scale}
            deviceRef={deviceRef}
            toggleOpen={toggleOpen}
            handleDeviceKey={handleDeviceKey}
            handleRocker={handleRocker}
            pin={pin}
          />

          {/* Kolom kanan: telemetri + komponen internal */}
          <div className="sj-col sj-col-right">
            <aside className="sj-overview sj-telemetry sj-panel">
              <div className="sj-telemetry-head"><span className="sj-live" />Telemetri langsung</div>
              <div className="sj-metric"><div className="sj-metric-row"><span>Status</span><b className="sj-warn">Siaga Hujan</b></div></div>
              <div className="sj-metric">
                <div className="sj-metric-row"><span>Curah hujan</span><b>Sedang</b></div>
                <div className="sj-bar sj-bar-warn"><i style={{ width: '55%' }} /></div>
              </div>
              <div className="sj-metric">
                <div className="sj-metric-row"><span>Suhu</span><b>24°C</b></div>
                <div className="sj-bar"><i style={{ width: '48%' }} /></div>
              </div>
              <div className="sj-metric">
                <div className="sj-metric-row"><span>Kelembapan</span><b>85%</b></div>
                <div className="sj-bar"><i style={{ width: '85%' }} /></div>
              </div>
            </aside>
            {rightParts.map((p) => renderCard(p, PARTS.indexOf(p)))}
          </div>
        </div>
      </div>

      {/* Garis penunjuk (koordinat dihitung di loop animasi) */}
      <svg className="sj-leaders" aria-hidden="true">
        {PARTS.map((part, i) => (
          <g key={part.id} style={{ '--i': i }} className={active === part.id ? 'is-active' : ''}>
            <path ref={(el) => { leaderRefs.current[part.id] = { ...leaderRefs.current[part.id], path: el }; }} pathLength="1" />
            <circle ref={(el) => { leaderRefs.current[part.id] = { ...leaderRefs.current[part.id], end: el }; }} r="2.5" />
            <circle ref={(el) => { leaderRefs.current[part.id] = { ...leaderRefs.current[part.id], start: el }; }} r="1.8" />
          </g>
        ))}
      </svg>

      <button
        type="button"
        onClick={() => navigate(-1)}
        aria-label="Prototype sebelumnya"
        className="sj-nav sj-prev button-scale inline-flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm transition duration-200 hover:bg-gray-100 hover:text-red-600"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        type="button"
        onClick={() => navigate(1)}
        aria-label="Prototype selanjutnya"
        className="sj-nav sj-next button-scale inline-flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm transition duration-200 hover:bg-gray-100 hover:text-red-600"
      >
        <ChevronRight size={20} />
      </button>

      <div className={`sj-toast ${toast.show ? 'is-show' : ''}`} role="status" aria-live="polite">{toast.msg}</div>

      <div className="sj-hint">
        <Hand size={15} />
        <span>{open ? 'Klik perangkat lagi untuk menutup casing' : 'Klik perangkat untuk melihat bagian dalam'}</span>
      </div>
    </div>
  );
}

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import './sijan-smart-interactive.css';
import { SIJAN_DEVICE_WEBP } from './sijanDeviceImg';

export default function SijanSmartShowcase() {
  const [isExpanded, setIsExpanded] = useState(false);
  const heroRef = useRef(null);
  const infoRef = useRef(null);
  const glowRef = useRef(null);
  const devRef = useRef(null);
  const tapRef = useRef(null);
  const cueRef = useRef(null);
  const tiltRef = useRef(null);
  const cutRef = useRef(null);
  const doorRef = useRef(null);
  const vigRef = useRef(null);
  const xbarRef = useRef(null);
  const linesRef = useRef(null);
  const partsRef = useRef(null);

  // References to functions & timelines
  const stateRef = useRef('closed'); // 'closed' | 'info' | 'explore'
  const tlRef = useRef(null);
  const exRef = useRef(null);
  const desktopRef = useRef(true);
  const setActiveRef = useRef(null);
  const layoutRef = useRef(null);
  const openExploreRef = useRef(null);
  const closeExploreRef = useRef(null);

  useEffect(() => {
    const hero = heroRef.current;
    const info = infoRef.current;
    const glow = glowRef.current;
    const dev = devRef.current;
    const cue = cueRef.current;
    const tilt = tiltRef.current;
    const cut = cutRef.current;
    const door = doorRef.current;
    const vig = vigRef.current;
    const xbar = xbarRef.current;
    const linesSvg = linesRef.current;
    const partsContainer = partsRef.current;

    if (!hero || !info || !dev) return;

    const lines = Array.from(linesSvg.querySelectorAll('path'));
    const ancs = Array.from(cut.querySelectorAll('.anc'));
    const parts = Array.from(cut.querySelectorAll('.part'));
    const fx = Array.from(dev.querySelectorAll('.lcdglow, .ledg'));
    const cards = Array.from(partsContainer.querySelectorAll('.card')).sort(
      (a, b) => Number(a.dataset.i) - Number(b.dataset.i)
    );
    const ins = Array.from(info.querySelectorAll('[data-in]'));
    const ls = Array.from(info.querySelectorAll('[data-line]'));

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function setActive(i) {
      cut.classList.toggle('hl', i >= 0);
      parts.forEach((el, k) => el.classList.toggle('on', k === i));
      cards.forEach((el, k) => el.classList.toggle('active', k === i));
      lines.forEach((el, k) => el.classList.toggle('on', k === i));
    }
    setActiveRef.current = setActive;

    function layout() {
      if (!desktopRef.current) return;
      const hr = hero.getBoundingClientRect();
      ancs.forEach((h, i) => {
        if (!cards[i] || !lines[i]) return;
        const a = h.getBoundingClientRect();
        const c = cards[i].getBoundingClientRect();
        const L = c.left < hr.left + hr.width / 2;
        const x1 = (L ? c.right : c.left) - hr.left;
        const y1 = c.top + c.height / 2 - hr.top;
        lines[i].setAttribute(
          'd',
          `M${x1} ${y1}H${x1 + (L ? 34 : -34)}L${a.left + a.width / 2 - hr.left} ${a.top + a.height / 2 - hr.top}`
        );
      });
    }
    layoutRef.current = layout;

    function makeTimeline(isDesktop) {
      gsap.set(dev, { xPercent: -50 });
      gsap.set(ls, { yPercent: 110 });
      gsap.set(ins, { opacity: 0, y: 28 });
      gsap.set(info, { x: '18vw', opacity: 0 });

      const t = gsap.timeline({ paused: true, defaults: { ease: 'none' } });
      const heroWidth = hero.clientWidth || window.innerWidth;
      const v = isDesktop
        ? { x: -0.226 * heroWidth }
        : { scale: 0.5, clipPath: 'inset(0% 0% 22% 0%)' };

      t.to(cue, { opacity: 0, duration: 0.3 }, 0)
        .to(dev, Object.assign({ duration: 1.5, ease: 'power3.inOut' }, v), 0)
        .to(glow, { opacity: 1, duration: 1.2 }, 0.3)
        .to(info, { x: 0, opacity: 1, duration: 1, ease: 'power2.out' }, 0.8)
        .to(ins[0], { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 1)
        .to(ls, { yPercent: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out' }, 1.05)
        .to(ins[1], { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, 1.5)
        .to(ins[2], { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, 1.7);

      return t;
    }

    function openExplore() {
      stateRef.current = 'explore';
      hero.classList.add('explore');
      const W = dev.offsetWidth;
      const H = dev.offsetHeight;
      const bw = 0.5563 * W;
      const heroW = hero.clientWidth || window.innerWidth;
      const heroH = hero.clientHeight || window.innerHeight;
      const isDesk = desktopRef.current;
      const s = Math.min(
        isDesk ? 1.2 : 1.3,
        ((isDesk ? 0.34 : 0.7) * heroW) / bw,
        (0.86 * heroH) / (0.556 * H)
      );
      const xf = -s * (0.469 - 0.5) * W;
      const yf = heroH * (isDesk ? 0.5 : 0.34) - dev.offsetTop - s * 0.43 * H;

      gsap.set(door, { transformPerspective: 900, transformOrigin: '0% 50%' });
      const c = { x: 0, scale: 1, duration: 1.4, ease: 'power3.inOut' };
      if (!isDesk) c.clipPath = 'inset(0% 0% 0% 0%)';

      if (exRef.current) exRef.current.kill();
      const ex = gsap.timeline({
        defaults: { ease: 'none' },
        onReverseComplete: () => {
          hero.classList.remove('explore');
          setActive(-1);
        },
      });

      ex.to(info, { x: isDesk ? '-6vw' : 0, y: isDesk ? 0 : 16, opacity: 0, duration: 0.6, ease: 'power2.in' }, 0)
        .to(dev, c, 0)
        .to(vig, { opacity: 1, duration: 1 }, 1.6)
        .to(dev, { x: xf, y: yf, scale: s, duration: 1.3, ease: 'power3.inOut' }, 1.5)
        .to(xbar, { opacity: 1, duration: 0.6 }, 2.6)
        .to(fx, { opacity: 0, duration: 0.3 }, 2.7)
        .to(cut, { opacity: 1, duration: 0.2 }, 2.7)
        .to(door, { rotateY: -108, duration: 1.1, ease: 'power2.inOut' }, 2.8)
        .fromTo(cards, { opacity: 0 }, { opacity: 1, duration: 0.6, stagger: 0.09, ease: 'power2.out' }, 3.5)
        .call(() => {
          if (!desktopRef.current) setActive(0);
        }, null, 3.6)
        .to(ancs, { opacity: 1, duration: 0.4, stagger: 0.06 }, 3.9)
        .call(layout, null, 3.9)
        .fromTo(lines, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.7, stagger: 0.08 }, 3.95);

      ex.timeScale(reduce ? 99 : 1);
      exRef.current = ex;
    }
    openExploreRef.current = openExplore;

    function closeExplore() {
      if (stateRef.current !== 'explore') return;
      stateRef.current = 'info';
      if (exRef.current) {
        exRef.current.timeScale(reduce ? 99 : 1.3).reverse();
      }
    }
    closeExploreRef.current = closeExplore;

    const mm = gsap.matchMedia();
    mm.add(
      {
        d: '(min-width: 821px)',
        m: '(max-width: 820px)',
      },
      (ctx) => {
        const was = stateRef.current !== 'closed';
        if (tlRef.current) tlRef.current.kill();
        if (exRef.current) exRef.current.kill();
        hero.classList.remove('explore');
        setActive(-1);

        gsap.set(fx.concat(ancs), { clearProps: 'opacity' });
        gsap.set([dev, info, glow, cue, vig, xbar, cut, door].concat(ins, ls, cards), { clearProps: 'all' });

        desktopRef.current = Boolean(ctx.conditions.d);
        const tl = makeTimeline(desktopRef.current);
        tlRef.current = tl;

        stateRef.current = was ? 'info' : 'closed';
        if (was) tl.progress(1);
      }
    );

    // Keyboard navigation (Escape to close explore)
    const onKeyDown = (e) => {
      if (e.key === 'Escape') closeExplore();
    };
    window.addEventListener('keydown', onKeyDown);

    // Window resize layout update
    const onResize = () => {
      if (stateRef.current === 'explore') layout();
    };
    window.addEventListener('resize', onResize);

    // Mobile scroll snap listener
    const onPartsScroll = () => {
      if (desktopRef.current) return;
      const m = partsContainer.getBoundingClientRect();
      const mid = m.left + m.width / 2;
      let best = 0;
      let bd = 1e9;
      cards.forEach((c, i) => {
        const r = c.getBoundingClientRect();
        const d = Math.abs(r.left + r.width / 2 - mid);
        if (d < bd) {
          bd = d;
          best = i;
        }
      });
      setActive(best);
    };
    partsContainer.addEventListener('scroll', onPartsScroll);

    // 3D Tilt follows mouse cursor
    let onPointerMove;
    if (!reduce && window.matchMedia('(pointer:fine)').matches) {
      gsap.set(tilt, { transformPerspective: 1100 });
      const rx = gsap.quickTo(tilt, 'rotationX', { duration: 0.9, ease: 'power3' });
      const ry = gsap.quickTo(tilt, 'rotationY', { duration: 0.9, ease: 'power3' });

      onPointerMove = (e) => {
        const hr = hero.getBoundingClientRect();
        const nx = (e.clientX - hr.left) / hr.width - 0.5;
        const ny = (e.clientY - hr.top) / hr.height - 0.5;
        ry(nx * 5);
        rx(-ny * 3);
      };
      hero.addEventListener('pointermove', onPointerMove);
    }

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', onResize);
      partsContainer.removeEventListener('scroll', onPartsScroll);
      if (onPointerMove) {
        hero.removeEventListener('pointermove', onPointerMove);
      }
      mm.revert();
    };
  }, []);

  const handleTap = () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (stateRef.current === 'closed') {
      stateRef.current = 'info';
      setIsExpanded(true);
      if (tlRef.current) tlRef.current.timeScale(reduce ? 99 : 1).play();
    } else if (stateRef.current === 'info') {
      stateRef.current = 'closed';
      setIsExpanded(false);
      if (tlRef.current) tlRef.current.timeScale(reduce ? 99 : 1.4).reverse();
    }
  };

  const handleExplore = (e) => {
    e.preventDefault();
    if (stateRef.current === 'info' && openExploreRef.current) {
      openExploreRef.current();
    }
  };

  const handleBack = () => {
    if (closeExploreRef.current) {
      closeExploreRef.current();
    }
  };

  const handleCardEnter = (i) => {
    if (desktopRef.current && setActiveRef.current) {
      setActiveRef.current(i);
    }
  };

  const handleCardLeave = () => {
    if (desktopRef.current && setActiveRef.current) {
      setActiveRef.current(-1);
    }
  };

  return (
    <div className="sijan-interactive-hero">
      {/* SVG Definitions */}
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="gM" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f3f5f8" />
            <stop offset="0.55" stopColor="#b9c0c9" />
            <stop offset="1" stopColor="#8d96a2" />
          </linearGradient>
          <linearGradient id="gB" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#2f6d8c" />
            <stop offset="1" stopColor="#143143" />
          </linearGradient>
          <linearGradient id="gP" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#8450c0" />
            <stop offset="1" stopColor="#4c2678" />
          </linearGradient>
          <linearGradient id="gL" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2d78c9" />
            <stop offset="1" stopColor="#16467c" />
          </linearGradient>
          <linearGradient id="gG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#dcf3fc" />
            <stop offset="1" stopColor="#a6d6ea" />
          </linearGradient>
          <linearGradient id="gC" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#58b884" />
            <stop offset="0.55" stopColor="#2c7a4b" />
            <stop offset="1" stopColor="#15472d" />
          </linearGradient>
          <radialGradient id="gR" cx="0.38" cy="0.35" r="0.75">
            <stop offset="0" stopColor="#ffb8b2" />
            <stop offset="0.55" stopColor="#ff3b30" />
            <stop offset="1" stopColor="#9c130d" />
          </radialGradient>
          <radialGradient id="gY" cx="0.38" cy="0.35" r="0.75">
            <stop offset="0" stopColor="#fff2b8" />
            <stop offset="0.55" stopColor="#ffc83d" />
            <stop offset="1" stopColor="#a87708" />
          </radialGradient>
          <radialGradient id="gN" cx="0.38" cy="0.35" r="0.75">
            <stop offset="0" stopColor="#bff7cc" />
            <stop offset="0.55" stopColor="#34c759" />
            <stop offset="1" stopColor="#14773a" />
          </radialGradient>
        </defs>
        <symbol id="c0" viewBox="0 0 60 120">
          <rect x="4" y="2" width="52" height="116" rx="3.5" fill="url(#gB)" stroke="#0d2634" strokeWidth="0.6" />
          <path d="M10 13h8V7h6v6h6V7h6v6h8V7h4" fill="none" stroke="#e7c15a" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M7 24V110M53 24V110" stroke="#12161b" strokeWidth="4.4" />
          <path d="M7 24V110M53 24V110" stroke="#dcbc60" strokeWidth="2.6" strokeDasharray="2.4 1.8" />
          <rect x="10" y="18" width="40" height="40" rx="2" fill="url(#gM)" stroke="#7d8591" strokeWidth="0.6" />
          <rect x="12" y="20" width="36" height="36" rx="1.4" fill="none" stroke="#fff" strokeOpacity="0.55" strokeWidth="0.5" />
          <text x="30" y="30" fontSize="3.6" textAnchor="middle" fontFamily="monospace" fill="#3a424e">ESP32-WROOM-32</text>
          <text x="30" y="42" fontSize="8" textAnchor="middle" fontFamily="sans-serif" fontWeight="700" fill="#222a35">ESP32</text>
          <path d="M16 48h28M16 51h22" stroke="#6e7783" strokeWidth="0.9" />
          <rect x="22" y="66" width="16" height="13" rx="1" fill="#10151b" />
          <circle cx="24.5" cy="68.5" r="0.9" fill="#566" />
          <rect x="13" y="96" width="8" height="7" rx="1" fill="#e5e8ec" stroke="#555" strokeWidth="0.5" />
          <rect x="39" y="96" width="8" height="7" rx="1" fill="#e5e8ec" stroke="#555" strokeWidth="0.5" />
          <circle cx="45" cy="86" r="1.3" fill="#ff5148" />
          <rect x="19" y="106" width="22" height="13" rx="1.2" fill="url(#gM)" stroke="#6f7782" strokeWidth="0.5" />
          <rect x="22" y="111" width="16" height="3.4" rx="0.8" fill="#1b1f25" />
        </symbol>
        <symbol id="c1" viewBox="0 0 120 60">
          <rect width="120" height="46" rx="3" fill="url(#gL)" stroke="#0e2d52" strokeWidth="0.6" />
          <g fill="#0a1a30" stroke="#d6b45a" strokeWidth="0.6">
            <circle cx="4.5" cy="4.5" r="1.7" />
            <circle cx="115.5" cy="4.5" r="1.7" />
            <circle cx="4.5" cy="41.5" r="1.7" />
            <circle cx="115.5" cy="41.5" r="1.7" />
          </g>
          <rect x="9" y="5" width="102" height="34" rx="1" fill="#0f141a" />
          <rect x="11" y="7" width="98" height="30" fill="url(#gG)" />
          <g fontFamily="monospace" fontSize="5.6" fill="#10303f">
            <text x="14" y="16.5">STATUS: SIAGA HUJAN</text>
            <text x="14" y="24.5">CURAH: SEDANG</text>
            <text x="14" y="32.5">SUHU: 24°C|LEMBAP: 85%</text>
          </g>
          <path d="M11 7h98L97 37H11z" fill="#fff" opacity="0.12" />
          <path d="M8 43H112" stroke="#12161b" strokeWidth="3.4" />
          <path d="M8 43H112" stroke="#dcbc60" strokeWidth="2" strokeDasharray="2.2 1.6" />
          <rect x="34" y="47" width="52" height="12" rx="1.5" fill="#1a3a86" stroke="#0e2257" strokeWidth="0.5" />
          <rect x="40" y="49.5" width="14" height="7" rx="0.8" fill="#0b0f14" />
          <rect x="62" y="49.5" width="9" height="7" rx="1" fill="#2c6bd8" />
          <circle cx="66.5" cy="53" r="2.4" fill="#cfd5db" stroke="#789" strokeWidth="0.4" />
        </symbol>
        <symbol id="c2" viewBox="0 0 120 40">
          <rect width="120" height="40" rx="3.5" fill="#14181f" stroke="#3a4352" strokeWidth="0.7" />
          <g fill="#07090c" stroke="#cdb15c" strokeWidth="0.5">
            <circle cx="4.5" cy="4.5" r="1.6" />
            <circle cx="115.5" cy="4.5" r="1.6" />
            <circle cx="4.5" cy="35.5" r="1.6" />
            <circle cx="115.5" cy="35.5" r="1.6" />
          </g>
          <circle cx="24" cy="18" r="12.5" fill="#ff3b30" opacity="0.16" />
          <circle cx="60" cy="18" r="12.5" fill="#ffc83d" opacity="0.16" />
          <circle cx="96" cy="18" r="12.5" fill="#34c759" opacity="0.16" />
          <g fill="#2a2f38" stroke="#0a0c10" strokeWidth="1">
            <circle cx="24" cy="18" r="9.4" />
            <circle cx="60" cy="18" r="9.4" />
            <circle cx="96" cy="18" r="9.4" />
          </g>
          <circle cx="24" cy="18" r="7.4" fill="url(#gR)" />
          <circle cx="60" cy="18" r="7.4" fill="url(#gY)" />
          <circle cx="96" cy="18" r="7.4" fill="url(#gN)" />
          <g fill="#fff" opacity="0.6">
            <ellipse cx="21.8" cy="15.4" rx="2.4" ry="1.6" />
            <ellipse cx="57.8" cy="15.4" rx="2.4" ry="1.6" />
            <ellipse cx="93.8" cy="15.4" rx="2.4" ry="1.6" />
          </g>
          <g fill="#c9b27a" stroke="#6b5a2c" strokeWidth="0.3">
            <rect x="17" y="32" width="14" height="3.6" rx="0.8" />
            <rect x="53" y="32" width="14" height="3.6" rx="0.8" />
            <rect x="89" y="32" width="14" height="3.6" rx="0.8" />
          </g>
        </symbol>
        <symbol id="c3" viewBox="0 0 140 56">
          <rect width="140" height="56" rx="6" fill="#1b2129" stroke="#2f3947" strokeWidth="0.8" />
          <rect x="130" y="13" width="6" height="8" rx="1.6" fill="url(#gM)" />
          <rect x="8" y="6" width="122" height="22" rx="9" fill="url(#gC)" />
          <rect x="8" y="6" width="10" height="22" rx="5" fill="url(#gM)" />
          <rect x="40" y="6" width="3" height="22" fill="#fff" opacity="0.9" />
          <path d="M20 10c34-1.6 70-1.6 106 0" stroke="#fff" strokeOpacity="0.3" strokeWidth="1.2" fill="none" />
          <text x="78" y="19.5" fontSize="8" fontWeight="700" textAnchor="middle" fontFamily="sans-serif" fill="#fff">18650</text>
          <text x="108" y="19" fontSize="4" fontFamily="sans-serif" fill="#e8fff0">3.7V Li-ion</text>
          <rect x="4" y="35" width="6" height="8" rx="1.6" fill="url(#gM)" />
          <rect x="10" y="30" width="122" height="22" rx="9" fill="url(#gC)" />
          <rect x="122" y="30" width="10" height="22" rx="5" fill="url(#gM)" />
          <rect x="97" y="30" width="3" height="22" fill="#fff" opacity="0.9" />
          <path d="M14 34c34-1.6 70-1.6 106 0" stroke="#fff" strokeOpacity="0.3" strokeWidth="1.2" fill="none" />
          <text x="62" y="43.5" fontSize="8" fontWeight="700" textAnchor="middle" fontFamily="sans-serif" fill="#fff">18650</text>
          <text x="30" y="43" fontSize="4" fontFamily="sans-serif" fill="#e8fff0">3.7V Li-ion</text>
        </symbol>
        <symbol id="c4" viewBox="0 0 60 44">
          <rect width="60" height="44" rx="2.5" fill="url(#gP)" stroke="#341a55" strokeWidth="0.6" />
          <g fill="#12091f" stroke="#d6b45a" strokeWidth="0.5">
            <circle cx="3.6" cy="3.6" r="1.4" />
            <circle cx="56.4" cy="3.6" r="1.4" />
          </g>
          <rect x="21" y="7" width="18" height="15" rx="1.3" fill="url(#gM)" stroke="#6f7782" strokeWidth="0.5" />
          <circle cx="30" cy="14.5" r="2.4" fill="#1d2228" stroke="#79818b" strokeWidth="0.5" />
          <g fill="#d8d0b8" stroke="#6b5a2c" strokeWidth="0.25">
            <rect x="43" y="9" width="5" height="2.2" />
            <rect x="43" y="13" width="5" height="2.2" />
            <rect x="11" y="9" width="5" height="2.2" />
          </g>
          <text x="8" y="31" fontSize="4.4" fontFamily="monospace" fill="#fff" opacity="0.9">BME280</text>
          <path d="M7 39H53" stroke="#12161b" strokeWidth="3.4" />
          <path d="M7 39H53" stroke="#dcbc60" strokeWidth="2.2" strokeDasharray="2.4 1.6" />
        </symbol>
      </svg>

      <main className="hero" id="hero" ref={heroRef}>
        <div className="glow" id="glow" ref={glowRef}></div>

        <div className="device" id="device" ref={devRef}>
          <div className="tilt" id="tilt" ref={tiltRef}>
            <button
              className="tap"
              id="tap"
              ref={tapRef}
              type="button"
              aria-expanded={isExpanded}
              aria-label="Ketuk perangkat SIJAN SMART untuk melihat informasi"
              onClick={handleTap}
            >
              <img
                src={SIJAN_DEVICE_WEBP}
                alt="Perangkat SIJAN SMART — Siaga Hujan Smart"
                width="888"
                height="1330"
                decoding="async"
              />
            </button>

            <div className="cut" id="cut" ref={cutRef}>
              <svg viewBox="0 0 247 257" preserveAspectRatio="none" role="img" aria-label="Bagian dalam alat: ESP32, LCD I2C, lampu traffic, baterai, sensor BME280">
                <rect width="247" height="257" rx="9" fill="#151a21" />
                <rect x="3" y="3" width="241" height="251" rx="7" fill="none" stroke="#C81E2C" strokeOpacity="0.45" />
                <g fill="none" stroke="#C81E2C" strokeWidth="1.2" strokeOpacity="0.75">
                  <path d="M82 52C92 52 90 42 98 42" />
                  <path d="M82 92C90 92 90 106 98 106" />
                  <path d="M82 112C120 120 150 150 166 156" />
                  <path d="M53 130C53 152 44 160 44 176" />
                </g>
                <g className="part" id="p0">
                  <use href="#c0" x="24" y="14" width="58" height="116" />
                </g>
                <g className="part" id="p1">
                  <use href="#c1" x="98" y="8" width="132" height="66" />
                </g>
                <g className="part" id="p2">
                  <use href="#c2" x="98" y="86" width="132" height="44" />
                </g>
                <g className="part" id="p3">
                  <use href="#c3" x="12" y="176" width="140" height="56" />
                </g>
                <g className="part" id="p4">
                  <use href="#c4" x="166" y="140" width="60" height="44" />
                </g>
              </svg>
              <i className="anc" style={{ left: '12.1%', top: '27.2%' }}></i>
              <i className="anc" style={{ left: '91.5%', top: '15.6%' }}></i>
              <i className="anc" style={{ left: '91.5%', top: '42%' }}></i>
              <i className="anc" style={{ left: '6.5%', top: '79.4%' }}></i>
              <i className="anc" style={{ left: '89.9%', top: '63%' }}></i>
            </div>

            <div className="door" id="door" ref={doorRef}>
              <img src={SIJAN_DEVICE_WEBP} alt="" aria-hidden="true" />
            </div>

            <i className="lcdglow"></i>
            <i className="ledg" style={{ left: '55.6%', background: 'radial-gradient(#ff3b30, transparent 70%)' }}></i>
            <i className="ledg" style={{ left: '60.4%', background: 'radial-gradient(#ffc83d, transparent 70%)' }}></i>
            <i className="ledg" style={{ left: '65.1%', background: 'radial-gradient(#34c759, transparent 70%)' }}></i>
          </div>
        </div>

        <div className="vig" id="vig" ref={vigRef}></div>

        <div className="xbar" id="xbar" ref={xbarRef}>
          <button className="back" id="back" type="button" onClick={handleBack}>
            ← Kembali
          </button>
          <p>Komponen SIJANSMART</p>
        </div>

        <svg className="lines" id="lines" ref={linesRef} aria-hidden="true">
          <path pathLength="1" />
          <path pathLength="1" />
          <path pathLength="1" />
          <path pathLength="1" />
          <path pathLength="1" />
        </svg>

        <div className="parts" id="parts" ref={partsRef}>
          <div className="col l">
            <article
              className="card"
              data-i="0"
              onPointerEnter={() => handleCardEnter(0)}
              onPointerLeave={handleCardLeave}
            >
              <div className="tile">
                <svg viewBox="0 0 60 120" aria-hidden="true">
                  <use href="#c0" />
                </svg>
              </div>
              <div className="txt">
                <h3>ESP32</h3>
                <small>Wi‑Fi + Bluetooth</small>
                <p>Otak sistem di dalam rumah alat. Membaca sensor, mengolah data, lalu mengirimnya ke dashboard.</p>
              </div>
            </article>

            <article
              className="card"
              data-i="3"
              onPointerEnter={() => handleCardEnter(3)}
              onPointerLeave={handleCardLeave}
            >
              <div className="tile">
                <svg viewBox="0 0 140 56" aria-hidden="true">
                  <use href="#c3" />
                </svg>
              </div>
              <div className="txt">
                <h3>Baterai</h3>
                <small>Catu daya mandiri</small>
                <p>Sumber daya di dalam rumah alat agar tetap bekerja tanpa bergantung pada satu sumber listrik.</p>
              </div>
            </article>
          </div>

          <div className="col r">
            <article
              className="card"
              data-i="1"
              onPointerEnter={() => handleCardEnter(1)}
              onPointerLeave={handleCardLeave}
            >
              <div className="tile">
                <svg viewBox="0 0 120 60" aria-hidden="true">
                  <use href="#c1" />
                </svg>
              </div>
              <div className="txt">
                <h3>LCD I2C</h3>
                <small>Layar karakter · 2 kabel data</small>
                <p>Layar di panel depan yang menampilkan status, curah hujan, suhu, dan kelembapan.</p>
              </div>
            </article>

            <article
              className="card"
              data-i="2"
              onPointerEnter={() => handleCardEnter(2)}
              onPointerLeave={handleCardLeave}
            >
              <div className="tile">
                <svg viewBox="0 0 120 40" aria-hidden="true">
                  <use href="#c2" />
                </svg>
              </div>
              <div className="txt">
                <h3>Lampu Traffic</h3>
                <small>LED merah · kuning · hijau</small>
                <p>Penanda tingkat siaga di panel depan yang terlihat jelas dari jauh.</p>
              </div>
            </article>

            <article
              className="card"
              data-i="4"
              onPointerEnter={() => handleCardEnter(4)}
              onPointerLeave={handleCardLeave}
            >
              <div className="tile">
                <svg viewBox="0 0 60 44" aria-hidden="true">
                  <use href="#c4" />
                </svg>
              </div>
              <div className="txt">
                <h3>Sensor BME</h3>
                <small>BME280 · suhu, lembap, tekanan</small>
                <p>Dipasang dekat ventilasi untuk membaca kondisi udara sebagai dasar prediksi hujan.</p>
              </div>
            </article>
          </div>
        </div>

        <div className="cue" id="cue" ref={cueRef}>
          <i></i>Tap alatnya
        </div>

        <section className="info" id="info" ref={infoRef} aria-label="Tentang Sijansmart">
          <p className="brand" data-in>
            SIJANSMART
          </p>
          <h1>
            <span className="l">
              <span data-line>Smart Solution</span>
            </span>
            <span className="l">
              <span data-line>for a Better Future</span>
            </span>
          </h1>
          <p className="desc" data-in>
            Sijansmart merupakan solusi berbasis teknologi yang dirancang untuk membantu menciptakan sistem yang lebih
            cerdas, efisien, dan terintegrasi.
          </p>
          <button className="btn" id="explore" type="button" data-in onClick={handleExplore}>
            Explore Sijansmart <span aria-hidden="true">→</span>
          </button>
        </section>
      </main>
    </div>
  );
}

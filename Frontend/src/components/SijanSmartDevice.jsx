export default function SijanSmartDevice({
  open,
  powerOff,
  scale,
  deviceRef,
  toggleOpen,
  handleDeviceKey,
  handleRocker,
  pin,
}) {
  return (
    <div className="sj-device-col">
      <div className="sj-device-fit" style={{ '--sj-scale': Math.max(0.4, scale).toFixed(3) }}>
        <div
          ref={deviceRef}
          className={`sj-device ${powerOff ? 'is-off' : ''}`}
          role="button"
          tabIndex={0}
          aria-pressed={open}
          aria-label="Perangkat SIJAN SMART. Tekan untuk membuka atau menutup tampilan komponen."
          onClick={toggleOpen}
          onKeyDown={handleDeviceKey}
        >
          <div className="sj-pole" aria-hidden="true" />

          <div className="sj-part sj-roof">
            <svg viewBox="0 0 300 96" aria-hidden="true">
              <defs>
                <pattern id="sj-cells-l" width="12" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(-24.6)">
                  <rect width="12" height="9" fill="#1e293b" />
                  <rect x=".9" y=".9" width="10.2" height="7.2" fill="#334e74" />
                </pattern>
                <pattern id="sj-cells-r" width="12" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(24.6)">
                  <rect width="12" height="9" fill="#1e293b" />
                  <rect x=".9" y=".9" width="10.2" height="7.2" fill="#334e74" />
                </pattern>
                <linearGradient id="sj-gloss" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#fff" stopOpacity=".3" />
                  <stop offset=".5" stopColor="#fff" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="sj-trim" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#9aa2ab" />
                  <stop offset="1" stopColor="#3e444c" />
                </linearGradient>
              </defs>
              <path d="M150 20 L8 84 L10 93 L150 29 L290 93 L292 84 Z" fill="url(#sj-trim)" />
              <path d="M150 2 L0 70 L8 84 L150 20 Z" fill="url(#sj-cells-l)" stroke="#8d959e" strokeWidth="1.2" />
              <path d="M150 2 L300 70 L292 84 L150 20 Z" fill="url(#sj-cells-r)" stroke="#8d959e" strokeWidth="1.2" />
              <path d="M150 2 L0 70 L8 84 L150 20 Z" fill="url(#sj-gloss)" />
              <path d="M150 2 L300 70 L292 84 L150 20 Z" fill="url(#sj-gloss)" opacity=".6" />
              <path d="M136 10 L150 0 L164 10 L164 17 L150 8 L136 17 Z" fill="#b4bcc5" />
            </svg>
            {pin(1, { left: 58, top: 40 })}
          </div>

          <div className="sj-part sj-head">
            <span className="sj-screw sj-s-bl" /><span className="sj-screw sj-s-br" />
            <div className="sj-grill"><i />{pin(2, { right: -30, top: 4 })}</div>
            <div className="sj-logo"><strong>SIJAN SMART</strong><span>Siaga Hujan Smart</span></div>
          </div>

          <div className="sj-part sj-body">
            <div className="sj-housing">
              <span className="sj-boss sj-b1" /><span className="sj-boss sj-b2" />
              <span className="sj-boss sj-b3" /><span className="sj-boss sj-b4" />
              <span className="sj-footprint" style={{ left: 18, top: 18, width: 56, height: 80 }} />
              <span className="sj-footprint" style={{ left: 92, top: 26, width: 112, height: 66 }} />
              <span className="sj-footprint" style={{ left: 60, top: 150, width: 132, height: 64 }} />
              <span className="sj-seal">IP65 · SJ-01</span>

              <div className="sj-comp sj-c-dht">
                <svg width="56" height="80" viewBox="0 0 56 80" aria-hidden="true">
                  <defs>
                    <pattern id="sj-holes" width="6.4" height="6.4" patternUnits="userSpaceOnUse">
                      <rect width="6.4" height="6.4" fill="#eef1f4" />
                      <rect x="1.2" y="1.2" width="4" height="4" rx=".6" fill="#8b949f" />
                    </pattern>
                  </defs>
                  <rect x="2" y="44" width="52" height="30" rx="3" fill="#1e4fd8" stroke="#163da8" />
                  <rect x="40" y="58" width="9" height="4" rx="1" fill="#c7a46a" />
                  <line x1="20" y1="72" x2="20" y2="80" stroke="#d6ad55" strokeWidth="2" />
                  <line x1="28" y1="72" x2="28" y2="80" stroke="#d6ad55" strokeWidth="2" />
                  <line x1="36" y1="72" x2="36" y2="80" stroke="#d6ad55" strokeWidth="2" />
                  <rect x="8" y="2" width="40" height="54" rx="3" fill="#eef1f4" stroke="#c9ced6" />
                  <rect x="11" y="6" width="34" height="34" fill="url(#sj-holes)" />
                  <text x="28" y="50" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="6.5" fontWeight="700" fill="#5b6675">DHT22</text>
                </svg>
                {pin(5, { right: -12, top: -12 })}
              </div>

              <div className="sj-comp sj-c-esp">
                <svg width="112" height="66" viewBox="0 0 112 66" aria-hidden="true">
                  <defs>
                    <pattern id="sj-hdr" width="6" height="6" patternUnits="userSpaceOnUse">
                      <rect width="6" height="6" fill="#0b0d11" />
                      <circle cx="3" cy="3" r="1.4" fill="#d6ad55" />
                    </pattern>
                    <linearGradient id="sj-shield" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0" stopColor="#e3e7eb" />
                      <stop offset=".5" stopColor="#a8b0b8" />
                      <stop offset="1" stopColor="#d0d5da" />
                    </linearGradient>
                  </defs>
                  <rect x="0" y="0" width="112" height="66" rx="4" fill="#1a1e26" stroke="#2f3846" />
                  <rect x="6" y="2" width="96" height="6" fill="url(#sj-hdr)" />
                  <rect x="6" y="58" width="96" height="6" fill="url(#sj-hdr)" />
                  <rect x="-3" y="26" width="10" height="14" rx="1.5" fill="#a3abb4" />
                  <rect x="12" y="15" width="8" height="6" rx="1" fill="#2c3139" /><circle cx="16" cy="18" r="1.6" fill="#4b525c" />
                  <rect x="12" y="45" width="8" height="6" rx="1" fill="#2c3139" /><circle cx="16" cy="48" r="1.6" fill="#4b525c" />
                  <circle cx="24" cy="33" r="1.8" fill="#ef4444" />
                  <rect x="32" y="13" width="54" height="40" rx="2" fill="url(#sj-shield)" />
                  <text x="59" y="31" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="8" fontWeight="700" fill="#3b4048">ESP32</text>
                  <text x="59" y="40" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="4.6" fill="#555c66">WROOM-32</text>
                  <rect x="88" y="12" width="20" height="42" fill="#121820" />
                  <path d="M92 16 h12 v6 h-9 v6 h9 v6 h-9 v6 h9 v6 h-12" fill="none" stroke="#d6ad55" strokeWidth="1.6" />
                </svg>
                {pin(6, { right: -12, top: -12 })}
              </div>

              <div className="sj-comp sj-c-bat">
                <svg width="132" height="64" viewBox="0 0 132 64" aria-hidden="true">
                  <defs>
                    <linearGradient id="sj-cell" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor="#3fbfb2" />
                      <stop offset=".45" stopColor="#0f8a7e" />
                      <stop offset="1" stopColor="#075e57" />
                    </linearGradient>
                  </defs>
                  <rect x="0" y="0" width="132" height="64" rx="6" fill="#101317" stroke="#2a2f37" />
                  <rect x="8" y="8" width="112" height="21" rx="10" fill="url(#sj-cell)" />
                  <rect x="8" y="35" width="112" height="21" rx="10" fill="url(#sj-cell)" />
                  <rect x="118" y="13" width="6" height="11" rx="2" fill="#c3c9cf" />
                  <rect x="118" y="40" width="6" height="11" rx="2" fill="#c3c9cf" />
                  <rect x="40" y="8" width="30" height="21" fill="rgba(255,255,255,.12)" />
                  <rect x="40" y="35" width="30" height="21" fill="rgba(255,255,255,.12)" />
                  <text x="55" y="21.5" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="6" fontWeight="700" fill="#e7fffb">18650</text>
                  <text x="55" y="48.5" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="6" fontWeight="700" fill="#e7fffb">3.7V</text>
                </svg>
                {pin(7, { right: -12, top: -12 })}
              </div>
            </div>

            <div className="sj-cover">
              <span className="sj-screw sj-s-tl" /><span className="sj-screw sj-s-tr" />
              <span className="sj-screw sj-s-bl" /><span className="sj-screw sj-s-br" />

              <div className="sj-lcd-frame">
                <span className="sj-screw sj-s-tl" /><span className="sj-screw sj-s-tr" />
                <span className="sj-screw sj-s-bl" /><span className="sj-screw sj-s-br" />
                <div className="sj-screen">
                  <div>STATUS: SIAGA HUJAN</div>
                  <div>CURAH: SEDANG</div>
                  <div>SUHU: 24°C | LEMBAP: 85%</div>
                </div>
                {pin(3, { left: -12, top: -12 })}
              </div>

              <div className="sj-controls">
                <span className="sj-rocker" title="Saklar daya (klik untuk ON/OFF)" onClick={handleRocker}><i /></span>
                <div className="sj-leds">
                  <span className="sj-led sj-led-r" /><span className="sj-led sj-led-y" /><span className="sj-led sj-led-g" />
                  {pin(4, { left: 11, top: -30 })}
                </div>
                <span className="sj-mini-grill" />
              </div>

              <span className="sj-model">SJ-01 · IP65</span>
            </div>
          </div>

          <svg className="sj-cables" viewBox="0 0 250 96" aria-hidden="true">
            <rect x="100" y="-2" width="16" height="9" rx="2" fill="#15171b" />
            <rect x="132" y="-2" width="16" height="9" rx="2" fill="#15171b" />
            <g fill="none" strokeLinecap="round">
              <path d="M108 6 C 104 40, 86 52, 113 72 S 117 92, 115 98" stroke="#0b0c0f" strokeWidth="8" />
              <path d="M108 6 C 104 40, 86 52, 113 72 S 117 92, 115 98" stroke="rgba(255,255,255,.08)" strokeWidth="8" strokeDasharray="1.5 2.5" />
              <path d="M140 6 C 152 36, 162 58, 138 76 S 134 92, 135 98" stroke="#0b0c0f" strokeWidth="8" />
              <path d="M140 6 C 152 36, 162 58, 138 76 S 134 92, 135 98" stroke="rgba(255,255,255,.08)" strokeWidth="8" strokeDasharray="1.5 2.5" />
            </g>
            <rect x="104" y="80" width="42" height="10" rx="2" fill="#7c848d" />
            <rect x="104" y="80" width="42" height="3" rx="1" fill="#b9c0c7" />
          </svg>
        </div>
      </div>
    </div>
  );
}

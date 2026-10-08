// Maskot SiagaBot: robot hijau berhelm proyek kuning dengan antena.
// Dipakai sebagai ikon chatbot (tombol mengambang, header, dan layar sambutan).
export default function SiagaBotIcon({ size = 40, className = '', title }) {
  return (
    <svg
      viewBox="0 0 80 90"
      width={size}
      height={size}
      className={className}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      xmlns="http://www.w3.org/2000/svg"
    >
      {title && <title>{title}</title>}

      {/* Antena */}
      <line x1="40" y1="18" x2="40" y2="10" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="40" cy="8" r="6.5" fill="none" stroke="#10B981" strokeWidth="1.5" opacity="0.5" />
      <circle cx="40" cy="8" r="4" fill="#10B981" />

      {/* Helm */}
      <path d="M21 42 Q22 20 40 18 Q58 20 59 42 Z" fill="#FFB703" />
      <path d="M14 42 Q14 38 40 37 Q66 38 66 42 L64 44 Q40 43 16 44 Z" fill="#E0A800" />
      <path d="M24 38 Q40 36 56 38" stroke="rgba(255,255,255,0.4)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <circle cx="33" cy="30" r="2" fill="rgba(255,255,255,0.25)" />
      <circle cx="40" cy="27" r="2" fill="rgba(255,255,255,0.25)" />
      <circle cx="47" cy="30" r="2" fill="rgba(255,255,255,0.25)" />

      {/* Lengan & kaki */}
      <rect x="9" y="50" width="11" height="8" rx="4" fill="#10B981" />
      <rect x="60" y="50" width="11" height="8" rx="4" fill="#10B981" />
      <rect x="27" y="74" width="10" height="9" rx="4" fill="#10B981" />
      <rect x="43" y="74" width="10" height="9" rx="4" fill="#10B981" />
      <rect x="25" y="80" width="14" height="6" rx="3" fill="#0D9169" />
      <rect x="41" y="80" width="14" height="6" rx="3" fill="#0D9169" />

      {/* Badan & wajah */}
      <rect x="18" y="42" width="44" height="34" rx="14" fill="#10B981" />
      <rect x="22" y="46" width="36" height="22" rx="9" fill="rgba(0,0,0,0.35)" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
      <circle cx="33" cy="57" r="5" fill="#fff" />
      <circle cx="33" cy="57" r="3" fill="#10B981" />
      <circle cx="34.5" cy="55.5" r="1" fill="#fff" opacity="0.8" />
      <circle cx="47" cy="57" r="5" fill="#fff" />
      <circle cx="47" cy="57" r="3" fill="#10B981" />
      <circle cx="48.5" cy="55.5" r="1" fill="#fff" opacity="0.8" />
      <path d="M33 66 Q40 72 47 66" stroke="rgba(255,255,255,0.9)" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <ellipse cx="24" cy="62" rx="3.5" ry="2.5" fill="rgba(255,150,150,0.4)" />
      <ellipse cx="56" cy="62" rx="3.5" ry="2.5" fill="rgba(255,150,150,0.4)" />
    </svg>
  );
}

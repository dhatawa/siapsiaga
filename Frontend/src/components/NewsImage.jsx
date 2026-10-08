import { useState } from 'react';
import { ImageOff } from 'lucide-react';

/**
 * Gambar berita dengan fallback bila gambar kosong atau gagal dimuat
 */
export default function NewsImage({ src, alt, label = 'Tidak ada gambar', className = '' }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className={`w-full h-full flex flex-col items-center justify-center gap-1.5 text-gray-300 text-xs ${className}`}>
        <ImageOff size={20} />
        <span>{label}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={`w-full h-full object-cover ${className}`}
    />
  );
}

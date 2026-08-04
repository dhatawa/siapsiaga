import { HardHat, Waves, Home, Flame } from 'lucide-react';

export const guides = {
  'gempa-bumi': {
    slug: 'gempa-bumi',
    icon: HardHat,
    color: 'red',
    title: 'Gempa Bumi',
    shortDesc:
      'Indonesia berada di kawasan Cincin Api. Pahami teknik "Drop, Cover, and Hold On" (Merunduk, Berlindung, dan Bertahan) saat terjadi guncangan.',
    tips: [
      { title: 'Siapkan Tas Siaga Bencana', desc: 'Air, makanan tahan lama, P3K, senter.' },
      { title: 'Ketahui Jalur Evakuasi', desc: 'Identifikasi tempat aman di luar ruangan.' },
    ],
    fullTitle: 'Panduan Keselamatan Gempa Bumi',
    fullDesc:
      'Langkah-langkah krusial untuk mencegah, menghadapi, dan menanggulangi insiden gempa bumi di lingkungan rumah maupun tempat kerja. Pahami penggunaannya untuk keselamatan bersama.',
  },
  tsunami: {
    slug: 'tsunami',
    icon: Waves,
    color: 'blue',
    title: 'Tsunami',
    shortDesc:
      'Waspadai gempa kuat di dekat pantai atau surutnya air laut secara tiba-tiba. Segera menjauh menuju daratan tinggi.',
    tips: [],
    note: 'Jangan menunggu peringatan resmi jika terasa gempa kuat.',
    fullTitle: 'Panduan Keselamatan Tsunami',
    fullDesc:
      'Langkah-langkah krusial untuk mencegah, menghadapi, dan menanggulangi insiden tsunami di lingkungan rumah maupun tempat kerja. Pahami penggunaannya untuk keselamatan bersama.',
  },
  banjir: {
    slug: 'banjir',
    icon: Home,
    color: 'red',
    title: 'Banjir',
    shortDesc:
      'Pindahkan barang berharga ke tempat yang lebih tinggi. Matikan aliran listrik dari meteran utama jika air mulai masuk rumah.',
    tips: [],
    fullTitle: 'Panduan Keselamatan Banjir',
    fullDesc:
      'Langkah-langkah krusial untuk mencegah, menghadapi, dan menanggulangi insiden banjir di lingkungan rumah maupun tempat kerja. Pahami penggunaannya untuk keselamatan bersama.',
  },
  kebakaran: {
    slug: 'kebakaran',
    icon: Flame,
    color: 'red',
    title: 'Kebakaran',
    shortDesc:
      'Pahami penggunaan APAR (Alat Pemadam Api Ringan). Gunakan rute evakuasi terdekat, jangan gunakan lift.',
    tips: [],
    fullTitle: 'Panduan Keselamatan Kebakaran',
    fullDesc:
      'Langkah-langkah krusial untuk mencegah, menghadapi, dan menanggulangi insiden kebakaran di lingkungan rumah maupun tempat kerja. Pahami penggunaannya untuk keselamatan bersama.',
    prevention: [
      { title: 'Cek Instalasi Listrik', desc: 'Hindari penggunaan stop kontak berlebihan (bertumpuk).' },
      { title: 'Jauhkan Bahan Mudah Terbakar', desc: 'Simpan cairan mudah terbakar jauh dari sumber panas.' },
      { title: 'Pasang Detektor Asap', desc: 'Pastikan berfungsi dengan baik dan ganti baterainya berkala.' },
      { title: 'Siapkan Jalur Evakuasi', desc: 'Pastikan keluarga mengetahui jalur keluar tercepat.' },
    ],
    pass: [
      { letter: 'T', title: 'Tarik Pin', desc: 'Tarik pin pengaman pada tuas APAR. Ini akan mematahkan segel keamanan.' },
      { letter: 'A', title: 'Arahkan', desc: 'Arahkan selang atau nozzle ke dasar titik api, bukan ke bagian atas nyala api.' },
      { letter: 'T', title: 'Tekan Tuas', desc: 'Tekan tuas pegangan secara penuh untuk mengeluarkan bahan pemadam.' },
      { letter: 'A', title: 'Ayunkan', desc: 'Ayunkan nozzle dari sisi ke sisi (kiri-kanan) menuju arah dasar api hingga padam.' },
    ],
  },
};

export const videos = [
  {
    id: 1,
    category: 'Gempa',
    categoryColor: 'bg-black',
    date: '15 Okt 2024',
    duration: '12:45',
    title: 'Mitigasi Gempa Bumi di Rumah',
    desc: 'Panduan praktis mengamankan perabotan dan menentukan titik berlindung di dalam rumah saat...',
  },
  {
    id: 2,
    category: 'Banjir',
    categoryColor: 'bg-blue-600',
    date: '12 Okt 2024',
    duration: '08:20',
    title: 'Prosedur Evakuasi Banjir',
    desc: 'Langkah-langkah aman mengevakuasi keluarga dan barang berharga saat peringatan dini banjir...',
  },
  {
    id: 3,
    category: 'Kebakaran',
    categoryColor: 'bg-red-600',
    date: '05 Okt 2024',
    duration: '05:15',
    title: 'Penggunaan APAR yang Benar',
    desc: 'Tutorial singkat cara mencabut pin, mengarahkan nozzle, dan menyemprotkan APAR (Teknik PASS).',
  },
];

export const videoCategories = ['Semua', 'Gempa', 'Banjir', 'Kebakaran', 'Tsunami'];

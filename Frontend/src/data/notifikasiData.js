import { AlertTriangle, Newspaper, GraduationCap, MessageSquareText } from 'lucide-react';

export const notifications = [
  {
    id: 1,
    type: 'Laporan Bencana',
    icon: AlertTriangle,
    color: 'bg-red-600',
    title: 'Peringatan Dini: Potensi Banjir Wilayah Jakarta Selatan',
    desc: 'Curah hujan tinggi terdeteksi di hulu. Warga segera amankan properti penting dan waspada.',
    time: '2 mnt yang lalu',
    unread: true,
  },
  {
    id: 2,
    type: 'Berita Baru',
    icon: Newspaper,
    color: 'bg-primary-700',
    title: 'Update Terkini: Pemulihan Pasca Gempa di Cianjur',
    desc: 'Pemerintah daerah mulai mendistribusikan bantuan dan renovasi rumah warga terdampak.',
    time: '48 mnt yang lalu',
    unread: true,
  },
  {
    id: 3,
    type: 'Edukasi Baru',
    icon: GraduationCap,
    color: 'bg-emerald-600',
    title: 'Tips: Cara Menghadapi Gempa Saat di Gedung Tinggi',
    desc: 'Pelajari langkah-langkah krusial untuk menyelamatkan diri saat berada di perkantoran...',
    time: '2 jam yang lalu',
    unread: true,
  },
  {
    id: 4,
    type: 'Pesan Admin',
    icon: MessageSquareText,
    color: 'bg-gray-500',
    title: 'Pembaruan Sistem Aplikasi Siap Siaga v2.4',
    desc: 'Kami telah menambahkan fitur peta evakuasi real-time untuk meningkatkan keamanan warga.',
    time: 'kemarin',
    unread: false,
  },
];

export const disasterTypes = ['Gempa Bumi', 'Banjir', 'Kebakaran', 'Tsunami', 'Tanah Longsor', 'Angin Kencang', 'Lainnya'];

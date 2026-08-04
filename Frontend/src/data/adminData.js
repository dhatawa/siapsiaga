// Dummy data for the Siap Siaga Admin panel. Swap these for real API calls
// against the Node.js backend once it's ready.

export const dashboardStats = [
  { label: 'Total Pengguna', value: '24,592', badge: '+12%', badgeType: 'up', color: 'bg-brand-red' },
  { label: 'Sensor IoT Aktif', value: '1,024', suffix: '/1,050', suffixInline: true, dot: true, color: 'bg-primary-700' },
  { label: 'Laporan Pengguna (Tertunda)', value: '87', suffix: '420 tervalidasi', color: 'bg-gray-700' },
  { label: 'Peringatan Aktif', value: '3', color: 'bg-brand-red', highlight: true },
];

export const recentActivity = [
  {
    id: 1,
    color: 'bg-red-100 text-red-600',
    title: 'Peringatan Sistem:',
    desc: 'Ketinggian air tinggi terdeteksi di Sensor JKT-04.',
    time: '2 menit lalu',
  },
  {
    id: 2,
    color: 'bg-blue-100 text-blue-600',
    title: 'Laporan Pengguna:',
    desc: 'Insiden banjir dilaporkan di Kemang, divalidasi oleh Admin B.',
    time: '15 menit lalu',
  },
  {
    id: 3,
    color: 'bg-purple-100 text-purple-600',
    title: 'Kesehatan IoT:',
    desc: 'Sensor BDG-12 offline. Tiket pemeliharaan dibuat otomatis.',
    time: '1 jam lalu',
  },
  {
    id: 4,
    color: 'bg-red-100 text-red-600',
    title: 'Pengguna Baru:',
    desc: '45 pendaftaran pengguna baru dalam satu jam terakhir.',
    time: '2 jam lalu',
  },
];

export const adminUsers = [
  {
    id: 1,
    name: 'Ahmad Budi',
    email: 'ahmad@example.com',
    initials: 'AB',
    avatarColor: 'bg-blue-500',
    address: 'Jl. Merdeka No. 45, Jakarta',
    gender: 'Laki-laki',
    age: 34,
    status: 'Aktif',
  },
  {
    id: 2,
    name: 'Siti Wijaya',
    email: 'siti.w@example.com',
    initials: 'SW',
    avatarColor: 'bg-emerald-500',
    address: 'Komp. Cempaka Blok B/12, Bandung',
    gender: 'Perempuan',
    age: 28,
    status: 'Aktif',
  },
  {
    id: 3,
    name: 'Reza Saputra',
    email: 'reza.s@example.com',
    initials: 'RS',
    avatarColor: 'bg-gray-400',
    address: 'Jl. Sudirman 88, Surabaya',
    gender: 'Laki-laki',
    age: 41,
    status: 'Tidak Aktif',
  },
  {
    id: 4,
    name: 'Dian Kusuma',
    email: 'dian.k@example.com',
    initials: 'DK',
    avatarColor: 'bg-red-500',
    address: 'Desa Makmur Rt 02/01, Semarang',
    gender: 'Perempuan',
    age: 30,
    status: 'Aktif',
  },
];

export const adminStations = [
  {
    id: 1,
    name: 'STA Citarum Hulu',
    lat: '-6.9147',
    lng: '107.6098',
    area: 'Cekungan Bandung',
    status: 'Normal',
    statusColor: 'green',
    lastSync: '2 menit lalu',
  },
  {
    id: 2,
    name: 'STA Kopo Sayati',
    lat: '-6.9531',
    lng: '107.5768',
    area: 'Bandung Selatan',
    status: 'Siaga III',
    statusColor: 'yellow',
    lastSync: '1 menit lalu',
  },
  {
    id: 3,
    name: 'STA Baleendah',
    lat: '-6.9925',
    lng: '107.6321',
    area: 'Bandung Selatan',
    status: 'Offline',
    statusColor: 'gray',
    lastSync: 'Offline (2 jam)',
  },
  {
    id: 4,
    name: 'STA Dayeuhkolot',
    lat: '-6.9856',
    lng: '107.6251',
    area: 'Bandung Selatan',
    status: 'Siaga I (Kritis)',
    statusColor: 'red',
    lastSync: 'Baru saja',
  },
];

export const incidentReports = [
  {
    id: 1,
    name: 'Ahmad Budi',
    contact: '+62 813-2456-7890',
    initials: 'AB',
    avatarColor: 'bg-blue-500',
    type: 'Banjir',
    location: 'Kemang, Jakarta Selatan',
    datetime: '24 Okt 2023 - 14:30',
    status: 'Menunggu',
  },
  {
    id: 2,
    name: 'Citra Sari',
    contact: '+62 813-9876-5432',
    initials: 'CS',
    avatarColor: 'bg-pink-500',
    type: 'Kebakaran',
    location: 'Tambora, Jakarta Barat',
    datetime: '24 Okt 2023 - 10:15',
    status: 'Divalidasi',
  },
  {
    id: 3,
    name: 'Dian Wira',
    contact: 'Pengguna Anonim',
    initials: 'DW',
    avatarColor: 'bg-gray-400',
    type: 'Longsor',
    location: 'Cisarua, Bogor',
    datetime: '23 Okt 2023 - 18:45',
    status: 'Ditolak',
  },
];

export const iotSummary = [
  { label: 'Total Aktif', value: 245 },
  { label: 'Daring', value: 218, color: 'text-emerald-600' },
  { label: 'Masalah Kritis', value: 12, color: 'text-red-600', highlight: true },
  { label: 'Peringatan', value: 15, color: 'text-yellow-600' },
];

export const iotSensors = [
  {
    id: 'WL-BANTUL-04',
    type: 'Sensor Ketinggian Air',
    status: 'Kritis',
    issue: 'Masalah Perangkat Keras: Kabel Putus',
    lastPing: '2 jam yang lalu (14:32 WIB)',
  },
  {
    id: 'EQ-SLEMAN-12',
    type: 'Sensor Seismik',
    status: 'Peringatan',
    issue: 'Baterai Lemah (14%)',
    lastPing: '5 menit yang lalu (16:25 WIB)',
  },
  {
    id: 'WL-MERAPI-01',
    type: 'Pemantau Aliran Lahar',
    status: 'Peringatan',
    issue: 'Sinyal Lemah (-98 dBm)',
    lastPing: '12 menit yang lalu (16:18 WIB)',
  },
  {
    id: 'WG-KULON-08',
    type: 'Pengukur Angin',
    status: 'Daring',
    issue: 'Sistem Normal',
    lastPing: 'Baru saja (16:30 WIB)',
  },
  {
    id: 'WL-GUNUNG-02',
    type: 'Pengukur Hujan',
    status: 'Daring',
    issue: 'Sistem Normal',
    lastPing: '1 menit yang lalu (16:29 WIB)',
  },
];

export const alertTargetAreas = ['Jakarta Pusat', 'Jakarta Selatan', 'Jawa Barat', 'Banten'];

export const alertLevels = [
  { key: 'info', label: 'Info' },
  { key: 'peringatan', label: 'Peringatan' },
  { key: 'bahaya', label: 'Bahaya' },
];

export const recentBroadcasts = [
  {
    id: 1,
    level: 'BAHAYA',
    levelColor: 'bg-brand-red text-white',
    title: 'Peringatan Tsunami: Pantai S...',
    desc: 'Segera evakuasi ke tempat yan...',
    time: '10 menit yang lalu',
  },
  {
    id: 2,
    level: 'PERINGATAN',
    levelColor: 'bg-yellow-400 text-gray-900',
    title: 'Hujan Deras: Jakarta',
    desc: 'Waspadai potensi banjir di banda...',
    time: '2 jam yang lalu',
  },
  {
    id: 3,
    level: 'INFO',
    levelColor: 'bg-primary-700 text-white',
    title: 'Pemberitahuan Pemeliharaan ...',
    desc: 'Sirene peringatan dini akan diu...',
    time: 'Kemarin',
  },
];

export const contentItems = [
  {
    id: 1,
    status: 'DISTRIBUSIKAN',
    category: 'Keamanan Gempa Bumi',
    categoryColor: 'text-red-600',
    title: 'Prosedur Operasi Standar untuk Gempa...',
    updated: 'Diperbarui: 24 Okt',
    type: 'article',
  },
  {
    id: 2,
    status: 'DRAF',
    category: 'Kesadaran Tsunami',
    categoryColor: 'text-primary-700',
    title: 'Mengenali Protokol Sirine Peringatan Dini',
    updated: 'Dibuat: 26 Okt',
    type: 'video',
  },
  {
    id: 3,
    status: 'DISTRIBUSIKAN',
    category: 'Mitigasi Banjir',
    categoryColor: 'text-emerald-600',
    title: 'Menavigasi Rute Evakuasi Pinggiran Kota',
    updated: 'Diperbarui: 20 Okt',
    type: 'article',
  },
];

export const contentTabs = ['Semua Konten', 'Panduan Edukasi', 'Koleksi Video'];

export const logEntries = [
  { id: 1, actor: 'Admin B.', action: 'Memvalidasi laporan banjir #1023', time: '2 menit lalu' },
  { id: 2, actor: 'Sistem', action: 'Sensor BDG-12 berubah status ke offline', time: '1 jam lalu' },
  { id: 3, actor: 'Admin A.', action: 'Mengirim peringatan darurat ke wilayah Jakarta Selatan', time: '3 jam lalu' },
  { id: 4, actor: 'Sistem', action: 'Backup basis data harian selesai', time: 'Kemarin' },
];

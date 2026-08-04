// News items are ordered newest first — the top/first item is treated as
// the featured headline on the Berita list page.
export const newsList = [
  {
    id: 'gempa-tektonik-m5-2-selatan-jawa',
    category: 'Fenomena Alam',
    categoryColor: 'bg-red-600',
    date: '01 Mar, 14:00',
    source: 'BMKG / Tim BPBD',
    title: 'Gempa Tektonik M 5.2 Guncang Pesisir Selatan Jawa, Tidak Berpotensi Tsunami',
    excerpt:
      'Badan Meteorologi, Klimatologi, dan Geofisika (BMKG) melaporkan terjadinya gempa bumi tektonik dengan magnitudo 5.2 pada pukul 08:15 WIB. Episenter gempa berada di beberapa daerah pesisir selatan Jawa. Tim BPBD setempat sedang melakukan asesmen kerusakan ringan di beberapa fasilitas umum.',
    body: [
      'JAKARTA, Siap Siaga - Badan Meteorologi, Klimatologi, dan Geofisika (BMKG) melaporkan terjadinya gempa bumi tektonik dengan magnitudo 5.2 pada pukul 08:15 WIB. Episenter gempa terletak pada koordinat 8.5 LS dan 106.8 BT, atau tepatnya berlokasi di laut pada jarak 120 km arah barat daya Kabupaten Sukabumi, Jawa Barat, dengan kedalaman 35 km.',
      'Kepala Pusat Gempabumi dan Tsunami BMKG, Daryono, menyampaikan bahwa dengan memperhatikan lokasi episenter dan kedalaman hiposentrenya, gempa bumi yang terjadi merupakan jenis gempa bumi dangkal akibat adanya aktivitas subduksi lempeng Indo-Australia yang menunjam ke bawah lempeng Eurasia.',
      '"Hasil analisis mekanisme sumber menunjukkan bahwa gempa bumi memiliki mekanisme pergerakan naik (thrust fault)," ungkap Daryono dalam keterangan resminya.',
    ],
    impactAreas: [
      { area: 'Sukabumi dan Cianjur', desc: 'Skala intensitas III MMI (Getaran dirasakan nyata dalam rumah. Terasa getaran seakan akan truk berlalu).' },
      { area: 'Bandung dan Garut', desc: 'Skala intensitas II MMI (Getaran dirasakan oleh beberapa orang, benda-benda ringan yang digantung bergoyang).' },
    ],
    warning:
      'Hasil pemantauan menunjukkan bahwa gempa bumi ini TIDAK BERPOTENSI TSUNAMI. Masyarakat dihimbau untuk tetap tenang dan tidak terpengaruh oleh isu yang tidak dapat dipertanggungjawabkan kebenarannya.',
    footerNote:
      'Masyarakat diminta agar menghindari dan bangunan yang retak atau rusak diakibatkan oleh gempa. Periksa dan pastikan bangunan tempat tinggal Anda cukup tahan gempa, ataupun tidak ada aktivitas yang membahayakan kestabilan bangunan sebelum masuk kembali ke dalam rumah. Pastikan informasi resmi hanya bersumber dari BMKG dan disebarkan melalui kanal komunikasi resmi yang telah terverifikasi.',
  },
  {
    id: 'banjir-tidak-kunjung-berhenti',
    category: 'Banjir & Longsor',
    categoryColor: 'bg-blue-600',
    date: '',
    source: 'Kemenkes',
    title: 'Hujan Tidak Kunjung Berhenti sehingga Banjir Semakin Naik di Daerah Rawan',
    excerpt:
      'Masyarakat dihimbau untuk mengurangi aktivitas di luar ruangan. Potensi genangan air di beberapa titik rawan terutama...',
    body: ['Konten lengkap berita ini sedang disiapkan oleh tim redaksi Siap Siaga.'],
  },
  {
    id: 'antisipasi-dampak-el-nino',
    category: 'Cuaca Ekstrem',
    categoryColor: 'bg-yellow-500',
    date: '29 Jun 2026',
    source: '',
    title: 'Antisipasi Dampak El Nino, Pemerintah Siapkan Cadangan Air...',
    excerpt:
      'Musim kemarau panjang yang diperkirakan muncul pada bulan depan memaksa satgas daerah untuk berkoordinasi truk tangki.',
    body: ['Konten lengkap berita ini sedang disiapkan oleh tim redaksi Siap Siaga.'],
  },
  {
    id: 'simulasi-tanggap-bencana-sekolah',
    category: 'Edukasi',
    categoryColor: 'bg-gray-700',
    date: '1 April 2026',
    source: '',
    title: 'Simulasi Tanggap Bencana di Sekolah-Sekolah Rawan Gempa...',
    excerpt:
      'Program edukasi ribuan pelajar untuk memastikan kesiapan mental dan fisik saat menghadapi kondisi darurat.',
    body: ['Konten lengkap berita ini sedang disiapkan oleh tim redaksi Siap Siaga.'],
  },
  {
    id: 'status-gunung-merapi-bertahan',
    category: 'Fenomena Alam',
    categoryColor: 'bg-red-600',
    date: '1 Januari 2026',
    source: '',
    title: 'Status Gunung Merapi Bertahan di Level Siaga, Warga Diminta Jauhi...',
    excerpt:
      'Teramati aktivitas guguran lava pijar. BPPTKG merekomendasikan agar tidak ada aktivitas warga di daerah bahaya.',
    body: ['Konten lengkap berita ini sedang disiapkan oleh tim redaksi Siap Siaga.'],
  },
];

export const newsCategories = ['Semua Berita', 'Cuaca Ekstrem', 'Banjir & Longsor', 'Fenomena Alam', 'Edukasi'];

export const popularNews = [
  {
    id: 'status-gunung-merapi-bertahan',
    category: 'Aktivitas Vulkanik',
    date: '1 Januari 2026',
    title: 'Status Gunung Merapi Bertahan di Level Siaga, Warga Diminta...',
  },
  {
    id: 'antisipasi-dampak-el-nino',
    category: 'Cuaca Ekstrem',
    date: '23 Okt 2026',
    title: 'Peringatan Dini Cuaca Ekstrem: Hujan Lebat Disertai Angin...',
  },
  {
    id: 'simulasi-tanggap-bencana-sekolah',
    category: 'Edukasi',
    date: '20 Okt 2026',
    title: 'Panduan Siaga Bencana: Apa Saja yang Harus Ada di Tas...',
  },
];

export const emergencyContacts = [
  { label: 'Ambulan', number: '118' },
  { label: 'Basarnas', number: '115' },
  { label: 'Polisi', number: '110' },
];

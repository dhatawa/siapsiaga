// Basis pengetahuan Siap Siaga AI.
// Setiap intent punya contoh pertanyaan (patterns) yang dipakai untuk melatih model TF-IDF,
// dan jawaban yang dikirim ke pengguna. Tambah intent baru cukup di file ini.
// Rujukan umum: panduan kesiapsiagaan BNPB, BMKG, PVMBG/MAGMA Indonesia.

export type Hazard =
  | "gempa"
  | "tsunami"
  | "banjir"
  | "longsor"
  | "erupsi"
  | "cuaca"
  | "kebakaran"
  | "kekeringan"
  | "umum";

export type Facet = "info" | "tanda" | "sebelum" | "saat" | "setelah" | "umum";

export type Intent = {
  id: string;
  hazard: Hazard;
  facet: Facet;
  /** Pertanyaan singkat untuk saran "bisa ditanya juga" */
  label: string;
  patterns: string[];
  answer: string;
};

export const HAZARD_NAMES: Record<Hazard, string> = {
  gempa: "gempa bumi",
  tsunami: "tsunami",
  banjir: "banjir",
  longsor: "tanah longsor",
  erupsi: "erupsi gunung api",
  cuaca: "cuaca ekstrem",
  kebakaran: "kebakaran",
  kekeringan: "kekeringan",
  umum: "kebencanaan",
};

export const INTENTS: Intent[] = [
  // ======================= GEMPA BUMI =======================
  {
    id: "gempa_info",
    hazard: "gempa",
    facet: "info",
    label: "Apa itu gempa bumi dan penyebabnya?",
    patterns: [
      "apa itu gempa bumi",
      "pengertian gempa",
      "penyebab gempa bumi",
      "mengapa bisa terjadi gempa",
      "bagaimana gempa terjadi",
      "kenapa indonesia sering gempa",
      "apa arti magnitudo gempa",
      "bisakah gempa diprediksi",
    ],
    answer: `**Gempa bumi** adalah getaran di permukaan bumi akibat pelepasan energi secara tiba-tiba dari dalam bumi.

**Penyebab utama:**
1. **Tektonik** – pergeseran lempeng atau patahan (paling sering dan paling kuat).
2. **Vulkanik** – aktivitas magma gunung api.

Indonesia sering mengalami gempa karena berada di pertemuan beberapa lempeng besar (Indo-Australia, Eurasia, dan Pasifik).

**Magnitudo (M)** menunjukkan besar energi gempa, sedangkan **intensitas (skala MMI)** menunjukkan seberapa kuat guncangan dirasakan di suatu lokasi.

Penting: sampai sekarang **waktu gempa belum bisa diprediksi secara pasti**. Jika ada pesan berantai yang "meramal" gempa, abaikan dan cek kebenarannya di BMKG.`,
  },
  {
    id: "gempa_sebelum",
    hazard: "gempa",
    facet: "sebelum",
    label: "Bagaimana persiapan menghadapi gempa?",
    patterns: [
      "persiapan sebelum gempa",
      "bagaimana bersiap menghadapi gempa",
      "cara mengurangi risiko gempa di rumah",
      "antisipasi gempa bumi",
      "mitigasi gempa di rumah",
      "apa yang disiapkan sebelum terjadi gempa",
    ],
    answer: `Persiapan menghadapi gempa:

1. **Kenali jalur evakuasi dan titik kumpul** di rumah, sekolah, dan tempat kerja.
2. **Kencangkan lemari, rak, dan TV** ke dinding. Taruh benda berat di rak bagian bawah.
3. **Tentukan tempat berlindung** di tiap ruangan, misalnya di bawah meja yang kokoh.
4. **Siapkan tas siaga** (air, makanan, obat, senter, dokumen penting).
5. **Pelajari cara mematikan listrik (MCB) dan gas.**
6. **Latihan "Merunduk, Berlindung, Berpegangan"** bersama keluarga.
7. **Sepakati titik temu keluarga** jika terpisah saat gempa.
8. Jika membangun rumah, gunakan **struktur tahan gempa** (kolom dan balok saling terikat).`,
  },
  {
    id: "gempa_saat",
    hazard: "gempa",
    facet: "saat",
    label: "Apa yang dilakukan saat gempa terjadi?",
    patterns: [
      "apa yang harus dilakukan saat gempa",
      "saat terjadi gempa harus bagaimana",
      "tindakan ketika gempa",
      "cara menyelamatkan diri saat gempa",
      "gempa sedang terjadi saya harus apa",
      "saat gempa di dalam rumah",
      "saat gempa di luar ruangan",
      "saat gempa sedang menyetir di jalan",
    ],
    answer: `Saat gempa terjadi, tetap tenang dan lakukan:

**Di dalam bangunan**
1. **Merunduk, Berlindung, Berpegangan** – berlindung di bawah meja kokoh dan pegang kakinya.
2. Jika tidak ada meja, **lindungi kepala dan leher** dengan tangan atau tas, merapat ke dinding bagian dalam.
3. **Jauhi kaca, jendela, lemari, dan benda tergantung.**
4. **Jangan berlari keluar** selama guncangan masih terjadi, dan **jangan pakai lift**.

**Di luar ruangan**
- Menjauh dari bangunan, pohon, tiang listrik, dan papan reklame. Cari tanah lapang.

**Di dalam kendaraan**
- Menepi dan berhenti di tempat aman, jauh dari jembatan dan jalan layang. Tetap di dalam kendaraan sampai guncangan berhenti.

**Di dekat pantai**
- Jika guncangan **kuat atau lama** sampai sulit berdiri, segera menuju **tempat tinggi** setelah guncangan berhenti, tanpa menunggu sirene, karena bisa terjadi tsunami.`,
  },
  {
    id: "gempa_gedung",
    hazard: "gempa",
    facet: "saat",
    label: "Kalau gempa saat di gedung bertingkat?",
    patterns: [
      "gempa saat di lantai atas gedung",
      "kalau saya di lantai 3",
      "gempa di gedung bertingkat",
      "gempa di kantor atau mall",
      "gempa saat di sekolah atau di kelas",
      "gempa di apartemen lantai tinggi",
      "boleh pakai lift saat gempa",
    ],
    answer: `Jika gempa terjadi saat kamu di **lantai atas gedung bertingkat**:

1. **Jangan langsung lari ke tangga atau keluar.** Kebanyakan korban terluka karena jatuh atau tertimpa saat berlari.
2. **Merunduk, Berlindung, Berpegangan** di bawah meja kokoh atau di dekat dinding bagian dalam.
3. **Jauhi jendela, dinding kaca, dan rak tinggi.**
4. **Jangan gunakan lift.** Jika sedang di dalam lift, tekan semua tombol lantai dan keluar di lantai terdekat.
5. Setelah guncangan berhenti, **turun lewat tangga darurat** dengan tertib dan ikuti arahan petugas gedung.
6. Di kelas: berlindung di bawah meja dan lindungi kepala dengan tas, lalu ikuti arahan guru menuju titik kumpul.

Getaran di lantai atas memang terasa lebih kuat dan lebih lama. Itu normal, tetap tenang.`,
  },
  {
    id: "gempa_tidur",
    hazard: "gempa",
    facet: "saat",
    label: "Kalau gempa saat sedang tidur di malam hari?",
    patterns: [
      "gempa saat sedang tidur",
      "gempa malam hari di tempat tidur",
      "kalau gempa waktu tidur harus apa",
      "gempa tengah malam",
    ],
    answer: `Jika gempa terjadi saat kamu **sedang tidur**:

1. **Tetap di tempat tidur** dan lindungi kepala serta leher dengan bantal.
2. Kecuali ada **lampu gantung, rak, atau lemari** di atas atau di samping tempat tidur yang bisa jatuh. Kalau begitu, pindah ke sudut ruangan yang aman.
3. Setelah guncangan berhenti, nyalakan **senter** (jangan korek api atau lilin, bisa ada kebocoran gas).
4. Pakai **alas kaki** sebelum berjalan karena mungkin ada pecahan kaca.

Tips: simpan **senter, alas kaki, dan ponsel** di dekat tempat tidur, dan jangan letakkan benda berat di atas kepala tempat tidur.`,
  },
  {
    id: "gempa_setelah",
    hazard: "gempa",
    facet: "setelah",
    label: "Apa yang dilakukan setelah gempa?",
    patterns: [
      "apa yang dilakukan setelah gempa",
      "setelah gempa berhenti harus apa",
      "tindakan setelah gempa bumi",
      "gempa susulan bagaimana",
      "kapan boleh masuk rumah setelah gempa",
      "cek rumah retak setelah gempa",
    ],
    answer: `Setelah guncangan berhenti:

1. **Periksa diri dan orang di sekitar.** Berikan pertolongan pertama jika ada yang terluka.
2. **Keluar dengan hati-hati** menuju titik kumpul. Pakai alas kaki dan gunakan tangga, bukan lift.
3. **Waspada gempa susulan.** Jangan masuk ke bangunan yang retak besar, miring, atau rusak.
4. Jika **mencium bau gas**: jangan menyalakan api atau saklar listrik, buka jendela, dan segera keluar.
5. **Matikan listrik** dari MCB jika ada kabel atau instalasi yang rusak.
6. Jika berada di **pesisir** dan guncangan tadi kuat, segera menjauh dari pantai ke tempat tinggi.
7. Ikuti informasi resmi dari **BMKG dan BPBD**, dan **jangan menyebarkan hoaks**.`,
  },

  // ======================= TSUNAMI =======================
  {
    id: "tsunami_info",
    hazard: "tsunami",
    facet: "info",
    label: "Apa itu tsunami dan penyebabnya?",
    patterns: [
      "apa itu tsunami",
      "pengertian tsunami",
      "penyebab tsunami",
      "bagaimana tsunami terjadi",
      "apakah semua gempa menyebabkan tsunami",
      "berapa lama tsunami datang",
    ],
    answer: `**Tsunami** adalah rangkaian gelombang laut besar akibat gangguan tiba-tiba di dasar laut.

**Penyebab:**
1. **Gempa bawah laut** yang kuat dan dangkal (paling sering).
2. **Longsor bawah laut** atau longsor tebing ke laut.
3. **Erupsi gunung api** di laut, contohnya Anak Krakatau tahun 2018.

Hal penting:
- **Tidak semua gempa memicu tsunami**, tetapi gempa kuat di pesisir harus selalu diwaspadai.
- Tsunami bisa tiba dalam **hitungan menit** setelah gempa dekat pantai.
- Tsunami datang **bergelombang selama berjam-jam**, dan gelombang pertama belum tentu yang terbesar.`,
  },
  {
    id: "tsunami_tanda",
    hazard: "tsunami",
    facet: "tanda",
    label: "Apa tanda-tanda tsunami akan datang?",
    patterns: [
      "tanda tanda tsunami",
      "ciri ciri akan terjadi tsunami",
      "bagaimana tahu akan ada tsunami",
      "air laut surut tiba tiba",
      "gejala tsunami",
    ],
    answer: `Tanda-tanda tsunami yang perlu dikenali:

1. **Guncangan gempa kuat atau lama** (sulit berdiri) saat berada di dekat pantai.
2. **Air laut surut tiba-tiba** sampai dasar laut terlihat.
3. **Suara gemuruh keras** dari arah laut, seperti suara pesawat atau kereta.
4. **Peringatan resmi** dari BMKG, sirene, atau pengumuman petugas.

Jika mengalami salah satu tanda alam di atas, **langsung evakuasi ke tempat tinggi**. Jangan menunggu peringatan resmi dan jangan mendekat ke pantai untuk melihat air surut.`,
  },
  {
    id: "tsunami_sebelum",
    hazard: "tsunami",
    facet: "sebelum",
    label: "Bagaimana persiapan menghadapi tsunami?",
    patterns: [
      "persiapan menghadapi tsunami",
      "antisipasi tsunami bagi warga pesisir",
      "tinggal dekat pantai harus siap apa",
      "jalur evakuasi tsunami",
      "tempat evakuasi tsunami",
    ],
    answer: `Persiapan jika tinggal atau beraktivitas di pesisir:

1. **Cek apakah lokasimu termasuk zona rawan tsunami**, misalnya lewat aplikasi **inaRISK** dari BNPB.
2. **Kenali jalur evakuasi** (biasanya ada rambu) dan **tempat evakuasi**: bukit, dataran tinggi, atau gedung evakuasi vertikal yang kokoh.
3. **Latih rute evakuasi dengan berjalan kaki** bersama keluarga, dan hitung waktu tempuhnya.
4. **Siapkan tas siaga** di dekat pintu.
5. Pasang **InfoBMKG** di ponsel untuk menerima peringatan dini.
6. Sepakati **titik temu keluarga** di tempat tinggi.`,
  },
  {
    id: "tsunami_saat",
    hazard: "tsunami",
    facet: "saat",
    label: "Apa yang dilakukan saat ada peringatan tsunami?",
    patterns: [
      "apa yang dilakukan saat tsunami",
      "ada peringatan tsunami harus bagaimana",
      "cara menyelamatkan diri dari tsunami",
      "kemana harus lari saat tsunami",
      "sirene tsunami berbunyi",
    ],
    answer: `Saat ada tanda atau peringatan tsunami:

1. **Segera menuju tempat tinggi** atau sejauh mungkin dari pantai. Setiap menit sangat berharga.
2. **Utamakan berjalan kaki atau berlari.** Kendaraan mudah terjebak macet.
3. Jika tidak sempat ke bukit, naik ke **lantai atas gedung beton yang kokoh** (evakuasi vertikal).
4. **Jangan kembali** untuk mengambil barang.
5. **Jauhi sungai dan muara**, karena tsunami bisa masuk jauh ke daratan melalui aliran sungai.
6. Jika terseret air, **raih benda yang mengapung**.
7. **Tetap di tempat aman** sampai ada pernyataan resmi bahwa peringatan tsunami telah berakhir.`,
  },
  {
    id: "tsunami_setelah",
    hazard: "tsunami",
    facet: "setelah",
    label: "Apa yang dilakukan setelah tsunami?",
    patterns: [
      "apa yang dilakukan setelah tsunami",
      "kapan boleh kembali setelah tsunami",
      "setelah air tsunami surut",
    ],
    answer: `Setelah tsunami:

1. **Jangan kembali ke pantai** sebelum BMKG atau pemerintah menyatakan peringatan berakhir. Gelombang susulan bisa datang berjam-jam kemudian.
2. **Hindari genangan dan puing**, karena bisa ada kabel listrik, paku, atau benda tajam.
3. **Jangan minum air sumur atau air ledeng** sebelum dipastikan aman.
4. **Periksa bangunan** sebelum masuk karena fondasinya bisa tergerus air.
5. Laporkan orang hilang ke **posko atau Basarnas (115)**, dan ikuti arahan petugas.`,
  },

  // ======================= BANJIR =======================
  {
    id: "banjir_info",
    hazard: "banjir",
    facet: "info",
    label: "Apa penyebab banjir?",
    patterns: [
      "apa itu banjir",
      "penyebab banjir",
      "mengapa sering terjadi banjir",
      "apa itu banjir bandang",
      "apa itu banjir rob",
      "jenis jenis banjir",
    ],
    answer: `**Banjir** terjadi ketika air meluap dan menggenangi daratan yang biasanya kering.

**Penyebab umum:**
1. Curah hujan tinggi dalam waktu lama.
2. Sungai meluap karena kapasitasnya tidak cukup.
3. Saluran air tersumbat sampah dan drainase buruk.
4. Berkurangnya daerah resapan akibat betonisasi dan penebangan hutan.

**Jenis yang perlu dikenal:**
- **Banjir genangan** – air naik perlahan di kawasan rendah.
- **Banjir bandang** – arus deras yang datang tiba-tiba dari hulu dan membawa lumpur, batu, dan kayu. Sangat berbahaya.
- **Banjir rob** – air laut pasang menggenangi daratan pesisir.`,
  },
  {
    id: "banjir_tanda",
    hazard: "banjir",
    facet: "tanda",
    label: "Apa tanda-tanda banjir akan datang?",
    patterns: [
      "tanda tanda banjir",
      "ciri ciri akan banjir bandang",
      "bagaimana tahu air akan naik",
      "gejala banjir bandang",
    ],
    answer: `Tanda-tanda banjir perlu diwaspadai, terutama di musim hujan:

1. **Hujan deras berjam-jam**, terutama di daerah hulu atau pegunungan.
2. **Air sungai naik cepat** dan warnanya berubah menjadi keruh kecokelatan.
3. Sungai **membawa ranting, kayu, atau sampah** lebih banyak dari biasanya (tanda banjir bandang).
4. **Suara gemuruh** dari arah hulu.
5. **Peringatan dari BPBD atau BMKG**, atau kentongan dan pengumuman warga.

Jika tanda-tanda ini muncul, segera bersiap mengungsi ke tempat yang lebih tinggi.`,
  },
  {
    id: "banjir_sebelum",
    hazard: "banjir",
    facet: "sebelum",
    label: "Bagaimana persiapan menghadapi banjir?",
    patterns: [
      "persiapan menghadapi banjir",
      "cara mencegah banjir di rumah",
      "antisipasi banjir musim hujan",
      "apa yang disiapkan sebelum banjir",
      "mitigasi banjir",
    ],
    answer: `Persiapan menghadapi banjir:

1. **Simpan dokumen penting** di map atau plastik kedap air, di tempat yang tinggi.
2. **Siapkan tas siaga** (air minum, makanan, obat, senter, pakaian ganti).
3. **Tinggikan stopkontak** dan barang elektronik, atau siapkan rak tinggi.
4. **Bersihkan selokan** dan jangan membuang sampah ke sungai atau saluran air.
5. Buat **lubang biopori atau sumur resapan** untuk menambah resapan air.
6. **Kenali lokasi pengungsian** dan jalur menuju ke sana.
7. **Pantau peringatan** dari BMKG dan BPBD, terutama saat hujan lebat.`,
  },
  {
    id: "banjir_saat",
    hazard: "banjir",
    facet: "saat",
    label: "Apa yang dilakukan saat banjir?",
    patterns: [
      "apa yang dilakukan saat banjir",
      "air mulai masuk ke rumah harus apa",
      "rumah kebanjiran harus bagaimana",
      "cara menyelamatkan diri saat banjir",
      "boleh menerobos banjir dengan motor",
      "berjalan di arus banjir",
    ],
    answer: `Saat banjir datang:

1. **Matikan listrik dari MCB dan tutup gas**, selama tangan dan kakimu masih kering.
2. **Pindahkan keluarga dan barang penting** ke tempat yang lebih tinggi.
3. **Segera mengungsi** jika air terus naik atau ada perintah evakuasi. Jangan menunggu malam.
4. **Jangan berjalan di arus deras.** Air setinggi 15 cm yang mengalir cepat bisa menjatuhkan orang dewasa.
5. **Jangan menerobos banjir** dengan motor atau mobil. Kendaraan bisa terseret atau mogok.
6. **Jauhi tiang dan kabel listrik**, selokan, dan lubang yang tertutup air.
7. **Awasi anak-anak** dan jangan biarkan mereka bermain di air banjir.`,
  },
  {
    id: "banjir_listrik",
    hazard: "banjir",
    facet: "saat",
    label: "Bagaimana mengamankan listrik saat banjir?",
    patterns: [
      "listrik saat banjir bagaimana",
      "kapan mematikan listrik saat banjir",
      "bahaya kesetrum saat banjir",
      "kapan boleh menyalakan listrik setelah banjir",
    ],
    answer: `Keamanan listrik saat banjir:

1. **Matikan MCB sebelum air masuk**, dan hanya jika tangan, kaki, dan lantai masih kering.
2. Jika air sudah menggenang, **jangan menyentuh MCB, stopkontak, atau alat listrik**. Hubungi **PLN di 123**.
3. **Jauhi kabel putus dan tiang listrik** yang terendam.
4. Setelah banjir, **jangan langsung menyalakan listrik**. Pastikan instalasi dan peralatan sudah kering dan diperiksa oleh teknisi atau PLN.`,
  },
  {
    id: "banjir_setelah",
    hazard: "banjir",
    facet: "setelah",
    label: "Apa yang dilakukan setelah banjir surut?",
    patterns: [
      "apa yang dilakukan setelah banjir",
      "membersihkan rumah setelah banjir",
      "penyakit setelah banjir",
      "setelah banjir surut harus apa",
      "apa itu leptospirosis",
    ],
    answer: `Setelah banjir surut:

1. **Bersihkan lumpur** dengan sarung tangan dan sepatu bot.
2. **Buang makanan** yang terendam air banjir.
3. **Rebus air minum** sampai mendidih, atau gunakan air kemasan.
4. **Periksa instalasi listrik** sebelum menyalakannya kembali.
5. **Waspada hewan** seperti ular atau tikus yang masuk ke rumah.
6. **Waspadai penyakit** seperti diare, penyakit kulit, dan **leptospirosis** (dari air yang tercemar kencing tikus). Segera ke puskesmas jika demam tinggi dan nyeri otot betis setelah terkena air banjir.
7. **Foto kerusakan** untuk keperluan laporan atau bantuan.`,
  },

  // ======================= TANAH LONGSOR =======================
  {
    id: "longsor_info",
    hazard: "longsor",
    facet: "info",
    label: "Apa penyebab tanah longsor?",
    patterns: [
      "apa itu tanah longsor",
      "penyebab longsor",
      "mengapa terjadi tanah longsor",
      "daerah rawan longsor",
    ],
    answer: `**Tanah longsor** adalah pergerakan tanah atau batuan menuruni lereng.

**Pemicu umum:**
1. **Hujan lebat yang lama**, sehingga tanah jenuh air dan menjadi berat.
2. **Lereng yang curam** dengan tanah gembur.
3. **Penggundulan hutan** sehingga tidak ada akar yang menahan tanah.
4. **Pemotongan lereng** untuk jalan atau bangunan tanpa penguat.
5. **Gempa bumi** yang mengguncang lereng.

Daerah rawan biasanya berada di perbukitan, tebing, dan bantaran sungai yang curam, terutama saat musim hujan.`,
  },
  {
    id: "longsor_tanda",
    hazard: "longsor",
    facet: "tanda",
    label: "Apa tanda-tanda akan terjadi longsor?",
    patterns: [
      "tanda tanda tanah longsor",
      "ciri ciri akan longsor",
      "retakan tanah di lereng",
      "gejala longsor",
    ],
    answer: `Tanda-tanda awal tanah longsor:

1. **Muncul retakan baru** di tanah, lereng, jalan, atau dinding rumah.
2. **Pohon, tiang, atau pagar miring.**
3. **Muncul mata air atau rembesan baru** di lereng, atau air tiba-tiba menjadi keruh.
4. **Pintu dan jendela tiba-tiba sulit dibuka** karena bangunan bergeser.
5. **Kerikil atau tanah kecil mulai berjatuhan** dari lereng.
6. **Suara gemuruh** dari arah lereng.

Jika melihat tanda ini saat hujan lebat, **segera menjauh dari lereng** dan laporkan ke RT/RW atau BPBD.`,
  },
  {
    id: "longsor_sebelum",
    hazard: "longsor",
    facet: "sebelum",
    label: "Bagaimana mencegah dan bersiap menghadapi longsor?",
    patterns: [
      "cara mencegah tanah longsor",
      "persiapan menghadapi longsor",
      "mitigasi tanah longsor",
      "tinggal di daerah lereng harus bagaimana",
    ],
    answer: `Mencegah dan bersiap menghadapi longsor:

1. **Hindari membangun rumah** tepat di bawah atau di bibir tebing yang curam.
2. **Tanam pohon berakar kuat** di lereng, misalnya akar wangi (vetiver) atau bambu.
3. Buat **terasering dan saluran air** agar air hujan tidak meresap berlebihan ke lereng.
4. **Jangan memotong lereng secara tegak** tanpa dinding penahan.
5. **Periksa retakan** secara rutin saat musim hujan.
6. Sepakati **sistem peringatan warga** (kentongan, grup pesan) dan jalur evakuasi.`,
  },
  {
    id: "longsor_saat",
    hazard: "longsor",
    facet: "saat",
    label: "Apa yang dilakukan saat terjadi longsor?",
    patterns: [
      "apa yang dilakukan saat longsor",
      "terjadi tanah longsor harus apa",
      "cara menyelamatkan diri dari longsor",
      "kemana lari saat longsor",
    ],
    answer: `Saat terjadi longsor:

1. **Segera menjauh dari jalur longsor ke arah samping**, menuju tempat yang lebih tinggi dan stabil. **Jangan lari ke arah bawah lereng.**
2. Jika tidak sempat menghindar, **lindungi kepala** dan meringkuk.
3. **Jangan menyeberangi aliran lumpur** atau sungai yang membawa material longsor.
4. **Waspadai longsor susulan**, terutama jika hujan masih turun.
5. Hubungi **112 atau Basarnas (115)** jika ada orang yang tertimbun.`,
  },
  {
    id: "longsor_setelah",
    hazard: "longsor",
    facet: "setelah",
    label: "Apa yang dilakukan setelah longsor?",
    patterns: [
      "apa yang dilakukan setelah longsor",
      "setelah tanah longsor harus apa",
      "menolong korban tertimbun longsor",
    ],
    answer: `Setelah longsor:

1. **Jauhi area longsor** karena longsor susulan bisa terjadi.
2. **Jangan menggali sendiri** untuk mencari korban tanpa tim SAR, karena berisiko menimbulkan longsor baru. Laporkan ke **Basarnas (115)** atau **BPBD**.
3. **Periksa kerusakan** saluran air, pipa, dan kabel listrik di sekitar rumah.
4. **Laporkan retakan baru** di sekitar lokasi ke aparat setempat.
5. Tetap mengungsi sampai lokasi dinyatakan aman.`,
  },

  // ======================= ERUPSI GUNUNG API =======================
  {
    id: "erupsi_info",
    hazard: "erupsi",
    facet: "info",
    label: "Apa bahaya erupsi gunung api?",
    patterns: [
      "apa itu erupsi gunung berapi",
      "bahaya gunung meletus",
      "apa itu awan panas",
      "apa itu lahar",
      "status gunung api normal waspada siaga awas",
      "arti level status gunung api",
    ],
    answer: `**Erupsi** adalah keluarnya magma, gas, dan material dari gunung api.

**Bahaya utama:**
1. **Awan panas** (wedus gembel) – campuran gas dan material panas yang meluncur sangat cepat. Paling mematikan.
2. **Lontaran batu pijar** di sekitar kawah.
3. **Hujan abu** – mengganggu pernapasan dan bisa merobohkan atap.
4. **Lahar** – aliran lumpur dan batu vulkanik, terutama saat hujan.
5. **Gas beracun** di sekitar kawah.

**Status gunung api** (ditetapkan PVMBG):
- **Level I – Normal**
- **Level II – Waspada**
- **Level III – Siaga**
- **Level IV – Awas**

Status terkini dapat dicek di **MAGMA Indonesia (magma.esdm.go.id)**.`,
  },
  {
    id: "erupsi_tanda",
    hazard: "erupsi",
    facet: "tanda",
    label: "Apa tanda-tanda gunung akan meletus?",
    patterns: [
      "tanda tanda gunung akan meletus",
      "ciri ciri gunung akan erupsi",
      "gejala gunung berapi aktif",
    ],
    answer: `Beberapa tanda gunung api meningkat aktivitasnya:

1. **Gempa vulkanik** yang terasa semakin sering.
2. **Suara gemuruh** dari arah gunung.
3. **Suhu di sekitar gunung naik**, mata air mengering, atau tumbuhan layu.
4. **Bau belerang** yang lebih menyengat.
5. **Hewan turun** dari lereng gunung.

Tanda alam tidak selalu muncul. Pegangan paling penting adalah **status resmi dari PVMBG** (cek di MAGMA Indonesia) dan **perintah evakuasi dari pemerintah daerah**.`,
  },
  {
    id: "erupsi_sebelum",
    hazard: "erupsi",
    facet: "sebelum",
    label: "Bagaimana persiapan menghadapi erupsi?",
    patterns: [
      "persiapan menghadapi gunung meletus",
      "tinggal dekat gunung berapi harus siap apa",
      "antisipasi erupsi gunung api",
    ],
    answer: `Persiapan jika tinggal di sekitar gunung api:

1. **Pantau status gunung** dan **radius bahaya** yang ditetapkan PVMBG atau BPBD.
2. **Kenali jalur evakuasi** dan lokasi pengungsian.
3. Siapkan **masker (sebaiknya N95), kacamata pelindung**, dan pakaian lengan panjang.
4. **Siapkan tas siaga**, termasuk persediaan air bersih.
5. Rencanakan **evakuasi untuk ternak** jika memilikinya.
6. **Patuhi larangan** memasuki kawasan rawan saat status meningkat.`,
  },
  {
    id: "erupsi_saat",
    hazard: "erupsi",
    facet: "saat",
    label: "Apa yang dilakukan saat gunung meletus?",
    patterns: [
      "apa yang dilakukan saat gunung meletus",
      "saat erupsi gunung berapi harus bagaimana",
      "cara menyelamatkan diri dari awan panas",
      "ada perintah evakuasi gunung",
    ],
    answer: `Saat gunung api meletus:

1. **Patuhi perintah evakuasi** dan segera keluar dari radius bahaya.
2. **Hindari lembah dan aliran sungai** yang berhulu di gunung karena bisa dilalui awan panas dan lahar.
3. Gunakan **masker atau kain basah**, kacamata, dan pakaian lengan panjang.
4. **Jangan memakai lensa kontak**, karena abu bisa melukai mata.
5. **Jangan menonton erupsi dari dekat** atau mendekati kawah.
6. Jika di dalam rumah saat hujan abu, **tutup pintu dan jendela**.`,
  },
  {
    id: "erupsi_abu",
    hazard: "erupsi",
    facet: "saat",
    label: "Bagaimana menghadapi hujan abu vulkanik?",
    patterns: [
      "hujan abu vulkanik harus bagaimana",
      "bahaya abu vulkanik untuk kesehatan",
      "masker untuk abu gunung",
      "membersihkan abu di atap",
    ],
    answer: `Menghadapi **hujan abu vulkanik**:

1. **Tetap di dalam rumah**, tutup pintu, jendela, dan ventilasi.
2. Jika harus keluar, pakai **masker N95** (atau kain basah), **kacamata**, dan baju lengan panjang.
3. **Tutup tandon dan sumber air minum** agar tidak tercemar abu.
4. **Bersihkan abu dari atap** secara berkala karena abu basah sangat berat dan bisa merobohkan atap. Lakukan dengan hati-hati.
5. **Basahi abu sebelum dibersihkan**, jangan disapu kering supaya tidak beterbangan.
6. Jika berkendara, **pelan-pelan dan nyalakan lampu** karena jalan licin dan jarak pandang terbatas.
7. Orang dengan asma atau gangguan pernapasan sebaiknya **tidak beraktivitas di luar**.`,
  },
  {
    id: "erupsi_setelah",
    hazard: "erupsi",
    facet: "setelah",
    label: "Apa yang dilakukan setelah erupsi?",
    patterns: [
      "apa yang dilakukan setelah gunung meletus",
      "kapan boleh pulang setelah erupsi",
      "bahaya lahar dingin setelah erupsi",
    ],
    answer: `Setelah erupsi:

1. **Jangan kembali ke rumah** sebelum ada izin dari pemerintah atau BPBD.
2. **Waspadai lahar dingin** saat hujan, terutama di sekitar sungai yang berhulu di gunung.
3. **Bersihkan abu** dari atap, talang, dan halaman (basahi dulu agar tidak beterbangan).
4. **Periksa sumber air** sebelum digunakan.
5. **Tetap pakai masker** saat membersihkan abu.`,
  },

  // ======================= CUACA EKSTREM =======================
  {
    id: "cuaca_info",
    hazard: "cuaca",
    facet: "info",
    label: "Apa saja cuaca ekstrem itu?",
    patterns: [
      "apa itu cuaca ekstrem",
      "jenis cuaca ekstrem",
      "apa itu angin puting beliung",
      "penyebab puting beliung",
      "apa itu siklon tropis",
    ],
    answer: `**Cuaca ekstrem** adalah kondisi cuaca yang bisa menimbulkan bencana, misalnya:

1. **Hujan sangat lebat** yang memicu banjir dan longsor.
2. **Angin kencang dan puting beliung** – pusaran angin kencang yang terbentuk dari awan cumulonimbus, biasanya singkat tapi merusak.
3. **Petir** dan **hujan es**.
4. **Gelombang laut tinggi** yang berbahaya bagi nelayan dan kapal kecil.
5. **Siklon tropis** yang dampaknya bisa terasa di wilayah Indonesia.

**BMKG** mengeluarkan peringatan dini cuaca yang bisa dipantau lewat aplikasi **InfoBMKG** atau bmkg.go.id.`,
  },
  {
    id: "cuaca_sebelum",
    hazard: "cuaca",
    facet: "sebelum",
    label: "Bagaimana bersiap menghadapi cuaca ekstrem?",
    patterns: [
      "persiapan menghadapi cuaca ekstrem",
      "antisipasi angin kencang di rumah",
      "persiapan musim hujan dan angin",
    ],
    answer: `Bersiap menghadapi cuaca ekstrem:

1. **Pantau peringatan dini BMKG** lewat aplikasi InfoBMKG.
2. **Pangkas dahan pohon** yang rapuh atau terlalu dekat dengan rumah dan kabel listrik.
3. **Perkuat atap, genteng, dan seng** yang longgar.
4. **Bersihkan talang dan saluran air.**
5. **Amankan benda di luar rumah** yang bisa terbang tertiup angin.
6. Siapkan **senter, power bank, dan tas siaga** jika listrik padam.`,
  },
  {
    id: "cuaca_saat",
    hazard: "cuaca",
    facet: "saat",
    label: "Apa yang dilakukan saat angin kencang atau puting beliung?",
    patterns: [
      "apa yang dilakukan saat puting beliung",
      "saat angin kencang harus bagaimana",
      "saat badai di jalan",
      "hujan deras dan angin kencang di luar rumah",
      "ada puting beliung di jalan",
      "melihat puting beliung mendekat",
    ],
    answer: `Saat angin kencang atau puting beliung:

1. **Masuk ke bangunan yang kokoh** dan jauhi jendela kaca.
2. Jika di luar, **jauhi pohon besar, papan reklame, tiang listrik**, dan bangunan semipermanen.
3. Jika berkendara, **menepi di tempat aman** yang jauh dari pohon dan reklame.
4. Jika tidak ada tempat berlindung, **cari cekungan atau tempat rendah** dan lindungi kepala.
5. **Jangan berteduh di bawah pohon** atau di dekat bangunan yang atapnya bisa terbang.`,
  },
  {
    id: "cuaca_petir",
    hazard: "cuaca",
    facet: "saat",
    label: "Bagaimana agar aman dari petir?",
    patterns: [
      "cara aman dari petir",
      "saat ada petir harus bagaimana",
      "boleh berteduh di bawah pohon saat petir",
      "main hp saat petir",
    ],
    answer: `Agar aman dari sambaran petir:

1. **Segera masuk ke bangunan** atau **mobil dengan atap logam tertutup**.
2. **Jangan berteduh di bawah pohon** yang berdiri sendiri.
3. **Jauhi tanah lapang, puncak bukit, pantai, kolam, dan sungai.**
4. Di dalam rumah, **hindari menyentuh peralatan listrik yang tersambung** dan keran air.
5. Jika terjebak di tempat terbuka, **berjongkok rendah** dengan kaki rapat, dan jangan berbaring di tanah.
6. Tunggu sekitar **30 menit setelah petir terakhir** sebelum keluar lagi.`,
  },
  {
    id: "cuaca_setelah",
    hazard: "cuaca",
    facet: "setelah",
    label: "Apa yang dilakukan setelah angin kencang?",
    patterns: [
      "apa yang dilakukan setelah puting beliung",
      "setelah badai harus apa",
      "pohon tumbang dan kabel putus setelah angin kencang",
    ],
    answer: `Setelah angin kencang atau puting beliung:

1. **Jauhi kabel listrik yang putus** dan laporkan ke **PLN (123)**.
2. **Hati-hati dengan pohon tumbang** dan puing atap.
3. **Periksa atap dan struktur rumah** sebelum masuk.
4. **Laporkan kerusakan** ke RT/RW atau BPBD setempat.
5. Dokumentasikan kerusakan untuk keperluan bantuan.`,
  },

  // ======================= KEBAKARAN =======================
  {
    id: "kebakaran_sebelum",
    hazard: "kebakaran",
    facet: "sebelum",
    label: "Bagaimana mencegah kebakaran di rumah?",
    patterns: [
      "cara mencegah kebakaran di rumah",
      "penyebab kebakaran rumah",
      "pencegahan korsleting listrik",
      "cara menggunakan apar",
      "apa itu apar",
    ],
    answer: `Mencegah kebakaran di rumah:

1. **Jangan menumpuk colokan** di satu stopkontak, dan ganti kabel yang terkelupas.
2. **Periksa selang dan regulator gas LPG** secara berkala.
3. **Jangan tinggalkan kompor, lilin, atau obat nyamuk bakar** yang menyala tanpa pengawasan.
4. **Simpan korek dan bahan mudah terbakar** jauh dari jangkauan anak.
5. Sediakan **APAR (Alat Pemadam Api Ringan)** dan pelajari cara memakainya:
   - **Tarik** pin pengaman,
   - **Arahkan** selang ke pangkal api,
   - **Tekan** tuas,
   - **Sapukan** ke kiri dan kanan.
6. Pasang **detektor asap** jika memungkinkan.`,
  },
  {
    id: "kebakaran_saat",
    hazard: "kebakaran",
    facet: "saat",
    label: "Apa yang dilakukan saat terjadi kebakaran?",
    patterns: [
      "apa yang dilakukan saat kebakaran",
      "rumah terbakar harus apa",
      "cara menyelamatkan diri dari kebakaran",
      "terjebak asap kebakaran",
      "baju terbakar harus bagaimana",
      "nomor pemadam kebakaran",
    ],
    answer: `Saat terjadi kebakaran:

1. **Beri tahu orang lain** dengan berteriak, lalu **segera keluar**.
2. Hubungi **Pemadam Kebakaran di 113** atau **112**.
3. Jika ada asap, **merangkaklah serendah mungkin** dan tutup hidung dengan kain basah.
4. **Sentuh pintu dengan punggung tangan** sebelum membukanya. Jika panas, jangan dibuka, cari jalan lain.
5. **Jangan memakai lift** dan jangan kembali untuk mengambil barang.
6. Jika pakaian terbakar: **berhenti, jatuhkan diri, dan berguling** sampai api padam.
7. Padamkan sendiri **hanya jika api masih kecil** dan kamu punya APAR atau karung basah.`,
  },
  {
    id: "kebakaran_gas",
    hazard: "kebakaran",
    facet: "saat",
    label: "Apa yang dilakukan jika gas LPG bocor?",
    patterns: [
      "gas lpg bocor harus apa",
      "tabung gas bocor",
      "bau gas di dapur",
      "tabung gas terbakar cara memadamkan",
    ],
    answer: `Jika **gas LPG bocor**:

1. **Jangan menyalakan api, korek, atau saklar listrik** (termasuk lampu dan kipas).
2. **Buka semua pintu dan jendela** agar gas keluar.
3. **Lepaskan regulator** dari tabung.
4. **Bawa tabung ke tempat terbuka** yang jauh dari sumber api.
5. Jika api sudah menyala di tabung, **tutup tabung dengan karung atau kain basah** agar api padam karena kekurangan oksigen.
6. Jika api membesar, **segera keluar dan hubungi Damkar (113)**.`,
  },
  {
    id: "kebakaran_hutan",
    hazard: "kebakaran",
    facet: "info",
    label: "Bagaimana menghadapi kebakaran hutan dan kabut asap?",
    patterns: [
      "kebakaran hutan dan lahan",
      "kabut asap kebakaran hutan",
      "bahaya asap karhutla untuk kesehatan",
      "penyebab kebakaran hutan",
    ],
    answer: `**Kebakaran hutan dan lahan (karhutla)** banyak terjadi saat kemarau, sering kali akibat pembukaan lahan dengan cara membakar.

Menghadapi **kabut asap**:
1. **Kurangi aktivitas di luar rumah**, terutama anak, lansia, ibu hamil, dan penderita penyakit paru.
2. Gunakan **masker N95** jika harus keluar. Masker kain biasa kurang efektif menyaring partikel asap.
3. **Tutup pintu, jendela, dan ventilasi.**
4. **Minum air putih yang cukup.**
5. Segera ke fasilitas kesehatan jika **sesak napas** atau batuk tidak kunjung reda.

Pencegahan: **jangan membakar lahan atau sampah**, terutama di musim kemarau.`,
  },
  {
    id: "kebakaran_setelah",
    hazard: "kebakaran",
    facet: "setelah",
    label: "Apa yang dilakukan setelah kebakaran?",
    patterns: [
      "apa yang dilakukan setelah kebakaran",
      "setelah api padam harus apa",
      "kapan boleh masuk rumah setelah terbakar",
    ],
    answer: `Setelah kebakaran padam:

1. **Jangan masuk** sebelum dinyatakan aman oleh petugas pemadam kebakaran.
2. **Waspadai struktur yang rapuh** seperti atap, dinding, dan lantai.
3. **Jangan menyalakan listrik atau gas** sebelum diperiksa.
4. **Buang makanan dan obat** yang terkena panas, asap, atau air pemadam.
5. **Dokumentasikan kerusakan** untuk laporan dan klaim asuransi jika ada.`,
  },

  // ======================= KEKERINGAN =======================
  {
    id: "kekeringan_info",
    hazard: "kekeringan",
    facet: "info",
    label: "Apa itu kekeringan dan dampaknya?",
    patterns: [
      "apa itu kekeringan",
      "penyebab kekeringan",
      "dampak kemarau panjang",
      "apa itu el nino",
    ],
    answer: `**Kekeringan** adalah kondisi kekurangan air dalam waktu lama karena curah hujan jauh di bawah normal.

**Penyebab:** kemarau panjang (bisa diperkuat fenomena **El Niño**), berkurangnya daerah resapan, dan penggunaan air berlebihan.

**Dampak:** krisis air bersih, gagal panen, kebakaran hutan dan lahan, serta gangguan kesehatan seperti diare karena sanitasi buruk.`,
  },
  {
    id: "kekeringan_sebelum",
    hazard: "kekeringan",
    facet: "sebelum",
    label: "Bagaimana menghadapi kekeringan?",
    patterns: [
      "cara menghadapi kekeringan",
      "persiapan musim kemarau",
      "cara menghemat air saat kemarau",
      "krisis air bersih saat kemarau",
    ],
    answer: `Menghadapi kekeringan:

1. **Hemat air**: tutup keran saat tidak dipakai, perbaiki pipa bocor, dan gunakan ulang air bekas cucian untuk menyiram tanaman.
2. **Tampung air hujan** saat musim hujan.
3. Buat **sumur resapan dan lubang biopori** supaya air tanah terisi kembali.
4. **Utamakan air bersih untuk minum dan memasak.**
5. Pilih **tanaman yang tahan kering** dan atur jadwal tanam sesuai info iklim BMKG.
6. **Jangan membakar sampah atau lahan** karena risiko kebakaran meningkat saat kemarau.`,
  },

  // ======================= UMUM =======================
  {
    id: "tas_siaga",
    hazard: "umum",
    facet: "sebelum",
    label: "Apa isi tas siaga bencana?",
    patterns: [
      "apa isi tas siaga bencana",
      "barang yang harus disiapkan untuk darurat bencana",
      "perlengkapan darurat bencana",
      "isi tas darurat",
      "persiapan barang sebelum bencana",
      "emergency kit",
    ],
    answer: `Isi **tas siaga bencana** (cukup untuk sekitar 3 hari):

1. **Dokumen penting** (fotokopi KTP, KK, ijazah, surat tanah) di dalam plastik kedap air.
2. **Air minum dan makanan tahan lama** (biskuit, makanan kaleng, roti kering).
3. **Obat-obatan pribadi** dan **kotak P3K**.
4. **Senter, baterai cadangan, dan power bank.**
5. **Pakaian ganti**, jaket atau jas hujan, dan selimut tipis.
6. **Masker, peluit** (untuk meminta tolong), dan **uang tunai**.
7. **Perlengkapan kebersihan**: sabun, sikat gigi, pembalut, tisu basah.
8. **Catatan nomor darurat** dan kontak keluarga.
9. Kebutuhan khusus: susu dan popok bayi, kacamata, alat bantu lansia.

Letakkan tas di dekat pintu, dan **periksa isinya setiap 6 bulan** (cek tanggal kedaluwarsa).`,
  },
  {
    id: "umum_saat",
    hazard: "umum",
    facet: "saat",
    label: "Apa yang dilakukan saat terjadi bencana?",
    patterns: [
      "apa yang dilakukan saat bencana",
      "tindakan saat terjadi bencana alam",
      "cara menyelamatkan diri saat bencana",
      "langkah pertama ketika bencana datang",
      "harus bagaimana saat ada bencana",
    ],
    answer: `Prinsip umum saat terjadi bencana:

1. **Tetap tenang** dan utamakan keselamatan diri serta keluarga, bukan harta benda.
2. **Ikuti arahan petugas** dan informasi resmi (BMKG, BPBD), bukan kabar berantai.
3. **Segera evakuasi** ke titik kumpul atau tempat aman jika diminta atau jika kondisi membahayakan.
4. **Bawa tas siaga** jika sempat, jangan kembali untuk mengambil barang.
5. **Bantu anak-anak, lansia, dan penyandang disabilitas** di sekitarmu.
6. **Hubungi 112** jika ada yang terluka atau terjebak.

Setiap jenis bencana punya langkah khusus. Sebutkan bencananya (misalnya gempa, banjir, atau longsor) supaya saya bisa memberi panduan yang lebih tepat.`,
  },
  {
    id: "nomor_darurat",
    hazard: "umum",
    facet: "umum",
    label: "Berapa nomor telepon darurat di Indonesia?",
    patterns: [
      "nomor telepon darurat",
      "nomor darurat bencana",
      "nomor basarnas",
      "nomor ambulans",
      "nomor bnpb",
      "menghubungi siapa saat bencana",
      "call center darurat",
    ],
    answer: `**Nomor darurat di Indonesia:**

- Panggilan darurat terpadu: **112**
- Pemadam Kebakaran: **113**
- Basarnas (pencarian & pertolongan): **115**
- BNPB: **117**
- Ambulans: **118 / 119**
- Polisi: **110**
- PLN (gangguan listrik): **123**

Simpan juga nomor **BPBD** di daerahmu. Nomor 112 bisa dihubungi gratis dari ponsel.`,
  },
  {
    id: "rencana_keluarga",
    hazard: "umum",
    facet: "sebelum",
    label: "Bagaimana membuat rencana darurat keluarga?",
    patterns: [
      "rencana darurat keluarga",
      "cara menyiapkan keluarga menghadapi bencana",
      "titik kumpul keluarga",
      "latihan evakuasi keluarga",
      "kesiapsiagaan keluarga",
    ],
    answer: `Membuat **rencana darurat keluarga**:

1. **Kenali risiko bencana** di sekitar rumah (bisa dicek lewat aplikasi **inaRISK**).
2. **Tentukan dua titik kumpul**: satu di dekat rumah dan satu di luar lingkungan (misalnya masjid atau sekolah).
3. **Tentukan satu kontak keluarga di luar kota** sebagai penghubung jika terpisah.
4. **Bagi peran**: siapa yang membawa tas siaga, siapa yang membantu anak atau lansia, siapa yang mematikan listrik dan gas.
5. **Catat kebutuhan khusus** anggota keluarga (obat rutin, alat bantu, hewan peliharaan).
6. **Latihan evakuasi** minimal setahun sekali.`,
  },
  {
    id: "kelompok_rentan",
    hazard: "umum",
    facet: "umum",
    label: "Bagaimana membantu anak, lansia, dan disabilitas saat bencana?",
    patterns: [
      "evakuasi lansia saat bencana",
      "anak anak saat bencana",
      "penyandang disabilitas saat bencana",
      "ibu hamil saat bencana",
      "kelompok rentan bencana",
    ],
    answer: `Membantu **kelompok rentan** saat bencana:

1. **Anak-anak**: ajarkan cara berlindung dan nomor kontak orang tua, pastikan mereka tahu titik kumpul, dan dampingi selama evakuasi.
2. **Lansia**: siapkan obat rutin, kacamata, dan alat bantu jalan. Tentukan siapa yang mendampingi.
3. **Penyandang disabilitas**: sesuaikan rencana evakuasi dengan kebutuhannya, misalnya jalur kursi roda atau isyarat visual untuk tuli.
4. **Ibu hamil dan bayi**: siapkan buku KIA, susu, popok, dan evakuasi lebih awal.
5. **Daftarkan kebutuhan khusus** ke RT/RW atau posko agar diprioritaskan saat evakuasi.`,
  },
  {
    id: "pertolongan_pertama",
    hazard: "umum",
    facet: "setelah",
    label: "Bagaimana pertolongan pertama untuk korban bencana?",
    patterns: [
      "pertolongan pertama korban bencana",
      "cara menolong orang luka",
      "pertolongan pertama luka bakar",
      "pertolongan pertama patah tulang",
      "cara menghentikan pendarahan",
      "isi kotak pertolongan pertama",
    ],
    answer: `**Pertolongan pertama** dasar (bukan pengganti tenaga medis):

1. **Pastikan lokasi aman** untuk dirimu sebelum menolong.
2. **Perdarahan**: tekan luka dengan kain bersih dan pertahankan tekanan.
3. **Luka ringan**: bersihkan dengan air bersih lalu tutup dengan perban.
4. **Luka bakar**: alirkan **air bersih mengalir sekitar 20 menit**. Jangan mengoleskan pasta gigi, mentega, atau minyak.
5. **Dugaan patah tulang**: jangan digerakkan atau diluruskan. Pasang bidai dari kayu atau kardus.
6. **Korban tidak sadar**: periksa napas, hubungi **112 atau 118/119**, dan jangan memindahkan korban kecuali lokasinya berbahaya.

Segera bawa korban ke tenaga kesehatan untuk penanganan lanjutan.`,
  },
  {
    id: "pengungsian",
    hazard: "umum",
    facet: "setelah",
    label: "Apa yang perlu diperhatikan di pengungsian?",
    patterns: [
      "tips di tempat pengungsian",
      "hidup di pengungsian",
      "kesehatan di posko pengungsian",
      "harus mengungsi kemana",
    ],
    answer: `Tips selama di **pengungsian**:

1. **Daftarkan diri dan keluarga** ke posko agar tercatat dan mendapat bantuan.
2. **Laporkan kebutuhan khusus** (bayi, lansia, ibu hamil, disabilitas, penyakit kronis).
3. **Jaga kebersihan**: cuci tangan dengan sabun, buang sampah pada tempatnya.
4. **Gunakan air bersih** untuk minum dan memasak.
5. **Awasi anak-anak** dan jaga barang berharga.
6. **Jaga kesehatan mental**: saling berbicara dan ikut kegiatan bersama.
7. Ikuti **informasi resmi** dari petugas, bukan kabar dari mulut ke mulut.`,
  },
  {
    id: "mitigasi_info",
    hazard: "umum",
    facet: "info",
    label: "Apa itu mitigasi dan kesiapsiagaan bencana?",
    patterns: [
      "apa itu mitigasi bencana",
      "pengertian kesiapsiagaan bencana",
      "tahapan penanggulangan bencana",
      "contoh mitigasi bencana",
      "mitigasi struktural dan nonstruktural",
    ],
    answer: `**Mitigasi bencana** adalah upaya mengurangi risiko dan dampak bencana sebelum bencana terjadi.

- **Mitigasi struktural (fisik)**: bangunan tahan gempa, tanggul, sabo dam, sumur resapan, shelter tsunami.
- **Mitigasi nonstruktural**: edukasi, peta rawan bencana, tata ruang, peringatan dini, latihan evakuasi.

**Kesiapsiagaan** adalah kesiapan masyarakat untuk bertindak cepat dan tepat saat bencana, misalnya punya tas siaga dan rencana evakuasi.

**Tahapan penanggulangan bencana:**
1. **Pra-bencana** – pencegahan, mitigasi, kesiapsiagaan.
2. **Tanggap darurat** – evakuasi, penyelamatan, pemenuhan kebutuhan dasar.
3. **Pasca-bencana** – rehabilitasi dan rekonstruksi.`,
  },
  {
    id: "jenis_bencana",
    hazard: "umum",
    facet: "info",
    label: "Apa saja jenis bencana alam?",
    patterns: [
      "apa saja jenis bencana alam",
      "macam macam bencana",
      "bencana yang sering terjadi di indonesia",
      "apa itu bencana",
      "pengertian bencana alam",
    ],
    answer: `Menurut UU No. 24 Tahun 2007, **bencana** dibagi menjadi bencana **alam**, **nonalam**, dan **sosial**.

**Bencana alam** yang sering terjadi di Indonesia:
1. **Banjir** dan banjir bandang
2. **Tanah longsor**
3. **Cuaca ekstrem** (angin kencang, puting beliung)
4. **Gempa bumi**
5. **Tsunami**
6. **Erupsi gunung api**
7. **Kekeringan**
8. **Kebakaran hutan dan lahan**

Kamu bisa bertanya ke saya tentang penyebab, tanda-tanda, persiapan, tindakan saat terjadi, atau langkah setelah bencana-bencana di atas.`,
  },
  {
    id: "sumber_resmi",
    hazard: "umum",
    facet: "umum",
    label: "Di mana mendapat informasi bencana yang resmi?",
    patterns: [
      "sumber informasi bencana resmi",
      "aplikasi peringatan dini bencana",
      "cek peta rawan bencana",
      "apa itu inarisk",
      "cara mengecek hoaks bencana",
      "apa itu bmkg",
      "apa itu bnpb dan bpbd",
    ],
    answer: `Sumber informasi bencana yang **resmi**:

1. **BMKG** (bmkg.go.id, aplikasi **InfoBMKG**) – cuaca, gempa, dan peringatan dini tsunami.
2. **PVMBG / MAGMA Indonesia** (magma.esdm.go.id) – status gunung api dan gerakan tanah.
3. **BNPB** (bnpb.go.id) – informasi kebencanaan nasional, dan aplikasi **inaRISK** untuk mengecek risiko bencana di lokasimu.
4. **BPBD** kabupaten/kota – informasi dan evakuasi di daerahmu.

Jika menerima kabar bencana dari pesan berantai, **cek dulu di sumber resmi** sebelum membagikannya.`,
  },
  {
    id: "kesehatan_mental",
    hazard: "umum",
    facet: "setelah",
    label: "Bagaimana mengatasi rasa cemas setelah bencana?",
    patterns: [
      "trauma setelah bencana",
      "takut dan cemas setelah gempa",
      "anak trauma bencana",
      "kesehatan mental korban bencana",
      "saya takut terjadi bencana",
      "saya takut gempa lagi",
      "khawatir dan panik kalau terjadi banjir",
      "cemas tidak bisa tidur karena takut bencana",
    ],
    answer: `Merasa **takut, cemas, atau sulit tidur** setelah bencana adalah reaksi yang wajar.

Yang bisa membantu:
1. **Ceritakan perasaanmu** kepada orang yang kamu percaya.
2. **Kembali ke rutinitas sederhana**: makan, tidur, dan beraktivitas teratur.
3. **Batasi melihat berita atau video bencana** berulang-ulang.
4. **Susun rencana kesiapsiagaan.** Merasa lebih siap sering kali mengurangi rasa cemas.
5. Untuk anak: **dengarkan mereka**, beri penjelasan sederhana, dan tetap dekat dengan mereka.

Jika rasa cemas berlangsung lama atau mengganggu kegiatan sehari-hari, **cari bantuan tenaga profesional** di puskesmas atau layanan psikologi.`,
  },
  {
    id: "tentang_siapsiaga",
    hazard: "umum",
    facet: "umum",
    label: "Apa itu aplikasi Siap Siaga?",
    patterns: [
      "apa itu siap siaga",
      "aplikasi siap siaga untuk apa",
      "fitur siap siaga",
      "sensor iot siap siaga",
      "cara melaporkan bencana di aplikasi",
    ],
    answer: `**Siap Siaga** adalah aplikasi berbasis **AIoT** untuk kesiapsiagaan dan peringatan dini bencana di Indonesia.

Fitur utamanya:
1. **Pemantauan sensor IoT** (misalnya suhu, kelembapan, dan tekanan udara) beserta prediksi cuaca.
2. **Peringatan dan notifikasi** bencana.
3. **Info gempa terkini** dari BMKG dan **berita kebencanaan**.
4. **Edukasi**: tips, panduan lengkap, dan video tutorial kesiapsiagaan.
5. **Lapor bencana** – pengguna dapat mengirim laporan kejadian di sekitarnya.
6. **Siap Siaga AI** – asisten yang sedang kamu ajak bicara sekarang.`,
  },
];

export const INTENT_BY_ID = new Map(INTENTS.map((i) => [i.id, i]));

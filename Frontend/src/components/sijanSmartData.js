export const PARTS = [
  { id: 1, side: 'left', type: 'ext', title: 'Kanopi Panel Surya', desc: 'Melindungi perangkat dari hujan langsung sekaligus menjadi panel surya 6V yang mengisi baterai di siang hari.' },
  { id: 2, side: 'left', type: 'ext', title: 'Speaker Sirene', desc: 'Membunyikan sirene peringatan dini ketika curah hujan melewati ambang batas bahaya.' },
  { id: 3, side: 'left', type: 'ext', title: 'Layar LCD 20×4 I2C', desc: 'Menampilkan status siaga, intensitas curah hujan, suhu, dan kelembapan secara real-time.' },
  { id: 4, side: 'left', type: 'ext', title: 'Saklar & LED Indikator', desc: 'Saklar daya utama. LED hijau berarti aman, kuning waspada, dan merah bahaya.' },
  { id: 5, side: 'right', type: 'int', title: 'Sensor DHT22', desc: 'Mengukur suhu (−40 s.d. 80 °C) dan kelembapan udara (0–100%) sebagai indikator potensi hujan.' },
  { id: 6, side: 'right', type: 'int', title: 'Mikrokontroler ESP32', desc: 'Otak perangkat: membaca sensor, menjalankan logika status siaga, lalu mengirim data ke server lewat MQTT.' },
  { id: 7, side: 'right', type: 'int', title: 'Baterai Li-ion 2×18650', desc: 'Cadangan daya yang diisi panel surya, agar perangkat tetap menyala saat listrik padam di tengah badai.' },
];

export const STACK_BREAKPOINT = 1000;
export const EXPLODED_WIDTH = 600;
export const CLOSED_WIDTH = 330;

import { CloudRain, Cloud, CloudLightning, Sun, CloudSun } from 'lucide-react';

export const sensorChartData = [
  { time: '00:00', suhu: 26, kelembapan: 82 },
  { time: '03:00', suhu: 25, kelembapan: 85 },
  { time: '06:00', suhu: 27, kelembapan: 80 },
  { time: '09:00', suhu: 30, kelembapan: 70 },
  { time: '12:00', suhu: 32, kelembapan: 65 },
  { time: '15:00', suhu: 31, kelembapan: 72 },
  { time: '18:00', suhu: 28, kelembapan: 78 },
];

export const forecast24h = [
  { time: 'Sekarang', icon: CloudRain, temp: '30°' },
  { time: '15:00', icon: Cloud, temp: '29°' },
  { time: '18:00', icon: CloudRain, temp: '26°' },
];

export const forecast7d = [
  {
    day: 'Besok',
    date: '25 Okt',
    icon: CloudRain,
    range: '24° - 28°',
    rain: '90%',
    wind: '15 km/h',
  },
  { day: 'Rabu', date: '26 Okt', icon: CloudRain, range: '25° - 29°', rain: '85%', wind: '12 km/h' },
  { day: 'Kamis', date: '27 Okt', icon: Cloud, range: '26° - 30°', rain: '40%', wind: '10 km/h' },
];

export const hourlyForecast = [
  { time: 'Sekarang', icon: CloudRain, temp: '28°', rain: '80%' },
  { time: '10:00', icon: CloudRain, temp: '27°', rain: '85%' },
  { time: '11:00', icon: CloudRain, temp: '28°', rain: '90%' },
  { time: '12:00', icon: CloudRain, temp: '25°', rain: '95%' },
  { time: '13:00', icon: CloudRain, temp: '25°', rain: '80%' },
  { time: '14:00', icon: Cloud, temp: '26°', rain: '60%' },
  { time: '15:00', icon: Cloud, temp: '27°', rain: '49%' },
  { time: '16:00', icon: CloudSun, temp: '28°', rain: '20%' },
  { time: '17:00', icon: CloudSun, temp: '28°', rain: '10%' },
  { time: '18:00', icon: Sun, temp: '27°', rain: '5%' },
  { time: '19:00', icon: Cloud, temp: '26°', rain: '5%' },
  { time: '20:00', icon: Cloud, temp: '26°', rain: '10%' },
];

export const weeklyForecastDetail = [
  {
    day: 'Besok',
    date: '25 Okt',
    icon: CloudRain,
    range: '24° - 28°',
    rain: '90%',
    wind: '15 km/h',
  },
  { day: 'Rabu', date: '26 Okt', icon: CloudRain, range: '25° - 29°', rain: '85%', wind: '12 km/h' },
  { day: 'Kamis', date: '27 Okt', icon: Cloud, range: '26° - 30°', rain: '40%', wind: '10 km/h' },
  { day: 'Jumat', date: '28 Okt', icon: CloudSun, range: '25° - 31°', rain: '20%', wind: '8 km/h' },
  { day: 'Sabtu', date: '29 Okt', icon: Sun, range: '24° - 32°', rain: '10%', wind: '7 km/h' },
];

export const sensors = {
  kopo: {
    id: 'kopo',
    name: 'Sensor Kopo (DHT22)',
    updatedAt: '15 menit yang lalu',
    suhu: '32°C',
    kelembapan: '78%',
    recommendation:
      'Musim hujan telah tiba. AI merekomendasikan: Pastikan saluran air bersih, siapkan tas siaga bencana di tempat yang mudah dijangkau, dan pantau tinggi muka air sungai secara berkala.',
  },
};

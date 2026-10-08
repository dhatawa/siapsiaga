require('./env');

/*
 * Konfigurasi koneksi MQTT untuk perangkat IoT (SIJAN SMART dan prototype berikutnya).
 * Semua nilai dibaca dari .env di root folder siapsiaga (lihat bagian "MQTT" di .env.example).
 *
 * Contoh pemakaian (setelah `npm install mqtt` di folder Backend):
 *
 *   const mqtt = require('mqtt');
 *   const mqttConfig = require('./config/mqtt');
 *
 *   if (mqttConfig.enabled) {
 *     const client = mqtt.connect(mqttConfig.url, mqttConfig.options);
 *     client.on('connect', () => {
 *       client.subscribe([mqttConfig.topics.telemetry(), mqttConfig.topics.status()], { qos: mqttConfig.qos });
 *     });
 *     client.on('message', (topic, payload) => {
 *       const data = JSON.parse(payload.toString());
 *       // simpan ke database / teruskan sebagai peringatan
 *     });
 *   }
 *
 * Contoh payload telemetri dari ESP32 (JSON):
 *   {
 *     "deviceId": "sijan-01",
 *     "status": "SIAGA",          // AMAN | WASPADA | SIAGA | BAHAYA
 *     "rainLevel": "SEDANG",      // TIDAK_HUJAN | RINGAN | SEDANG | LEBAT
 *     "temperature": 24.0,        // °C
 *     "humidity": 85,             // %
 *     "battery": 3.92,            // volt
 *     "ts": 1767225600            // unix time (detik)
 *   }
 */

const toInt = (value, fallback) => {
  const n = parseInt(value, 10);
  return Number.isFinite(n) ? n : fallback;
};

const BASE_TOPIC = (process.env.MQTT_BASE_TOPIC || 'siapsiaga').replace(/\/+$/, '');

// '+' = wildcard satu level MQTT, dipakai server untuk subscribe ke semua perangkat.
const deviceTopic = (suffix) => (deviceId = '+') => `${BASE_TOPIC}/devices/${deviceId}/${suffix}`;

const mqttConfig = {
  // Set MQTT_ENABLED=true di .env bila broker sudah siap.
  enabled: process.env.MQTT_ENABLED === 'true',

  // mqtt://host:1883 (tanpa TLS), mqtts://host:8883 (TLS), ws(s)://host:port/mqtt (WebSocket)
  url: process.env.MQTT_URL || 'mqtt://localhost:1883',

  // Diteruskan langsung ke mqtt.connect(url, options)
  options: {
    clientId: process.env.MQTT_CLIENT_ID || `siapsiaga-backend-${Math.random().toString(16).slice(2, 8)}`,
    username: process.env.MQTT_USERNAME || undefined,
    password: process.env.MQTT_PASSWORD || undefined,
    clean: true,
    keepalive: toInt(process.env.MQTT_KEEPALIVE, 60),               // detik
    reconnectPeriod: toInt(process.env.MQTT_RECONNECT_MS, 5000),    // ms, 0 = jangan reconnect
    connectTimeout: toInt(process.env.MQTT_CONNECT_TIMEOUT_MS, 10000),
    rejectUnauthorized: process.env.MQTT_TLS_REJECT_UNAUTHORIZED !== 'false',
  },

  // 0 = at most once, 1 = at least once, 2 = exactly once
  qos: toInt(process.env.MQTT_QOS, 1),

  baseTopic: BASE_TOPIC,

  topics: {
    telemetry: deviceTopic('telemetry'), // ESP32 → server: data sensor berkala
    status: deviceTopic('status'),       // ESP32 → server: online/offline (pakai Last Will)
    alert: deviceTopic('alert'),         // ESP32 → server: status siaga berubah
    command: deviceTopic('cmd'),         // server → ESP32: perintah (sirene, interval kirim, dll.)
  },
};

module.exports = mqttConfig;

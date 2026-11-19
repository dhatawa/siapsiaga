// Siap Siaga AI — mesin chatbot lokal (tanpa API eksternal).
//
// Cara kerja singkat:
// 1. Normalisasi teks (kata gaul, sinonim, stemming) → lihat text.ts
// 2. Deteksi jenis bencana (gempa, banjir, ...) dan fase (sebelum / saat / setelah / tanda / info)
// 3. Klasifikasi maksud dengan TF-IDF + kemiripan kosinus terhadap contoh pertanyaan di knowledge.ts,
//    ditambah kemiripan trigram karakter agar tahan salah ketik
// 4. Pakai konteks percakapan untuk pertanyaan lanjutan ("kalau setelahnya?")
// 5. Tolak dengan ramah jika pertanyaan di luar topik bencana

import { charTrigrams, cosine, normalize, stem, tokenize } from "./text";
import { HAZARD_NAMES, INTENTS, type Facet, type Hazard, type Intent } from "./knowledge";

export type ChatMessage = { role: "user" | "assistant"; content: string };

// ---------- Pola deteksi (dijalankan pada teks yang sudah dinormalisasi) ----------

const HAZARD_PATTERNS: [Exclude<Hazard, "umum">, RegExp][] = [
  ["gempa", /\b(gempa|guncangan|getaran|magnitudo|skala richter|lempeng|patahan)\b/],
  ["tsunami", /\b(tsunami|air laut surut)\b/],
  ["banjir", /\b(banjir|rob|genangan|luapan|meluap|leptospirosis|air( [a-z]+)? (naik|masuk|meluap|setinggi|menggenang))\b/],
  ["longsor", /\b(longsor|tanah (bergerak|retak|ambles|gerak)|retakan tanah|lereng|tebing)\b/],
  ["erupsi", /\b(erupsi|gunung|lahar|awan panas|abu|kawah|magma|wedus gembel|pvmbg)\b/],
  ["cuaca", /\b(cuaca|puting beliung|beliung|angin (kencang|ribut|besar)|badai|petir|halilintar|geledek|hujan (deras|lebat|es)|siklon|topan|gelombang tinggi)\b/],
  ["kebakaran", /\b(terbakar|pemadam|damkar|apar|kobaran|lpg|gas( [a-z]+){0,3} bocor|bocor( [a-z]+)? gas|tabung gas|bau gas|asap|korsleting|konsleting|api (di|membesar|menyala|menyebar|kompor)|kompor)\b/],
  ["kekeringan", /\b(kekeringan|el nino|krisis air|kekurangan air|kemarau)\b/],
];

const GENERAL_DISASTER =
  /\b(bencana|mitigasi|evakuasi|siaga|darurat|mengungsi|posko|pertolongan pertama|bmkg|bnpb|bpbd|basarnas|inarisk|peringatan dini|sirene|titik kumpul|korban|tanggap darurat|selamat diri|menyelamatkan diri|trauma|luka|tas siaga|ambulans|lansia|disabilitas|takut|cemas|khawatir|panik|pendarahan|perdarahan|patah tulang|pingsan|tidak sadar|berdarah|terjebak|terperangkap|tertimbun|hanyut|tenggelam|emergency|hoaks|pertolongan)\b/;

const FACET_PATTERNS: [Facet, RegExp][] = [
  ["info", /\b(apa itu|apa sih|pengertian|arti|definisi|maksud|penyebab|sebab|mengapa|proses|jenis|macam|bahaya|dampak|level|status)\b/],
  ["tanda", /\b(tanda|ciri|gejala|indikasi|pertanda)\b/],
  ["sebelum", /\b(sebelum|sebelumnya|persiapan|siapkan|disiapkan|menyiapkan|bersiap|antisipasi|mencegah|pencegahan|cegah|mitigasi)\b/],
  ["saat", /\b(saat|sedang|tiba tiba|berlangsung|terjebak|lagi terjadi)\b/],
  ["setelah", /\b(setelah|setelahnya|surut|reda|berhenti|berakhir|selesai|pemulihan|susulan|pulang)\b/],
];

const FOLLOW_UP = /^(kalau|terus|lalu|bagaimana dengan|bagaimana kalau|dan|kemudian|trus|nah)\b|\b(tadi|tersebut|itu|nya|setelahnya|sebelumnya)\b/;

const EMOTION = /\b(takut|cemas|khawatir|panik|trauma|stres|gelisah|was was|parno)\b/;

const EMERGENCY =
  /\b(tolong|darurat|terjebak|terperangkap|tertimbun|hanyut|terseret|tenggelam|luka parah|berdarah|pingsan|tidak sadar|sesak napas|kejebak|help)\b/;

const REALTIME_GEMPA =
  /(gempa.{0,25}(terkini|terbaru|barusan|baru saja|hari ini|tadi|kemarin|sekarang|dimana|di mana))|((terkini|terbaru|info|data|update|kabar|cek|lihat).{0,15}gempa)|(ada gempa (tidak|nggak|apa))|(barusan.{0,15}gempa)/;
const REALTIME_CUACA = /((cuaca|prakiraan|hujan).{0,20}(hari ini|besok|sekarang|terkini|nanti))|prakiraan cuaca/;
const REALTIME_GUNUNG = /(status.{0,20}gunung.{0,30}(sekarang|terkini|hari ini|saat ini))|(gunung.{0,30}(sekarang|terkini|hari ini|saat ini))/;

// Basa-basi
const GREETING =
  /^(halo+|hal+o|hai+|hi+|hello|hey|hei|helo|pagi|siang|sore|malam|selamat (pagi|siang|sore|malam)|assalamualaikum( wr wb)?|assalamu alaikum|asalamualaikum|permisi|p)\b\s*/;
const THANKS = /\b(terima kasih|terimakasih|thank you|makasih)\b/;
const WHO = /\b(siapa kamu|kamu siapa|kamu itu apa|kamu apa|nama kamu|siapa nama|kamu bisa apa|bisa bantu apa|apa yang bisa kamu|fungsi kamu|kamu ai|kamu robot|kamu bot)\b/;
const BYE = /\b(dadah|dah dulu|bye|sampai jumpa|selamat tinggal|sampai nanti|pamit)\b/;
const ACK = /^(oke+|ok|okay|baik|siap|sip+|mantap|paham|mengerti|noted|iya|ya|oh+|oh begitu|begitu|wah|keren|bagus|good|nice)( (kak|min|ya|deh|banget|sekali|saya|mengerti|paham|begitu))*$/;

// Intent ringkasan per bencana jika maksud kurang jelas
const OVERVIEW: Record<Exclude<Hazard, "umum">, string> = {
  gempa: "gempa_saat",
  tsunami: "tsunami_saat",
  banjir: "banjir_saat",
  longsor: "longsor_tanda",
  erupsi: "erupsi_info",
  cuaca: "cuaca_info",
  kebakaran: "kebakaran_saat",
  kekeringan: "kekeringan_sebelum",
};

// Kata kunci yang ditambahkan ke query saat memakai konteks percakapan sebelumnya
const HAZARD_KEYWORD: Record<Exclude<Hazard, "umum">, string> = {
  gempa: "gempa",
  tsunami: "tsunami",
  banjir: "banjir",
  longsor: "longsor",
  erupsi: "gunung erupsi",
  cuaca: "angin cuaca",
  kebakaran: "terbakar",
  kekeringan: "kekeringan",
};

// ---------- Model TF-IDF (dibangun sekali saat server start) ----------

type PatternVec = { intent: Intent; words: Map<string, number>; chars: Map<string, number> };

function buildModel() {
  const docs = INTENTS.flatMap((intent) =>
    intent.patterns.map((p) => {
      const norm = normalize(p);
      return { intent, tokens: tokenize(norm), chars: charTrigrams(norm) };
    })
  );
  const df = new Map<string, number>();
  for (const d of docs) for (const t of new Set(d.tokens)) df.set(t, (df.get(t) ?? 0) + 1);
  const idf = new Map<string, number>();
  for (const [t, n] of df) idf.set(t, Math.log((docs.length + 1) / (n + 1)) + 1);

  const vectorize = (tokens: string[]) => {
    const v = new Map<string, number>();
    for (const t of tokens) {
      const w = idf.get(t);
      if (w) v.set(t, (v.get(t) ?? 0) + w);
    }
    return v;
  };
  const patterns: PatternVec[] = docs.map((d) => ({ intent: d.intent, words: vectorize(d.tokens), chars: d.chars }));
  return { patterns, vectorize };
}

const MODEL = buildModel();

// ---------- Helper ----------

function detectHazards(norm: string): Set<Hazard> {
  const found = new Set<Hazard>();
  for (const [h, re] of HAZARD_PATTERNS) if (re.test(norm)) found.add(h);
  return found;
}

function detectFacets(norm: string): Set<Facet> {
  const found = new Set<Facet>();
  for (const [f, re] of FACET_PATTERNS) if (re.test(norm)) found.add(f);
  return found;
}

function pick<T>(items: T[], seed: string): T {
  let h = 0;
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return items[h % items.length];
}

function wasAnswered(intent: Intent, history: ChatMessage[]) {
  const head = intent.answer.slice(0, 80);
  return history.some((m) => m.role === "assistant" && m.content.includes(head));
}

type Scored = { intent: Intent; sim: number; score: number };

function rankIntents(norm: string, extra: string, hazards: Set<Hazard>, facets: Set<Facet>): Scored[] {
  const query = `${norm} ${extra}`.trim();
  const qWords = MODEL.vectorize(tokenize(query));
  const qChars = charTrigrams(query);

  const best = new Map<string, Scored>();
  for (const p of MODEL.patterns) {
    const { intent } = p;
    // Intent spesifik bencana hanya boleh dipilih jika bencananya terdeteksi
    if (intent.hazard !== "umum" && !hazards.has(intent.hazard)) continue;

    const sim = 0.75 * cosine(qWords, p.words) + 0.25 * cosine(qChars, p.chars);
    let score = sim;
    if (hazards.size && intent.hazard !== "umum") score += 0.15;
    if (facets.has(intent.facet)) score += 0.25;

    const prev = best.get(intent.id);
    if (!prev || score > prev.score) best.set(intent.id, { intent, sim, score });
  }
  return [...best.values()].sort((a, b) => b.score - a.score);
}

function suggestions(chosen: Intent, history: ChatMessage[]): string {
  const pool = INTENTS.filter(
    (i) => i.id !== chosen.id && i.hazard === chosen.hazard && !wasAnswered(i, history)
  );
  const order: Facet[] = ["sebelum", "saat", "setelah", "tanda", "info", "umum"];
  pool.sort((a, b) => order.indexOf(a.facet) - order.indexOf(b.facet));
  const picks = pool.slice(0, 2);
  if (!picks.length) return "";
  return `\n\n**Bisa ditanyakan juga:**\n${picks.map((p) => `- ${p.label}`).join("\n")}`;
}

const TOPICS_LIST =
  "gempa bumi, tsunami, banjir, tanah longsor, erupsi gunung api, cuaca ekstrem, kebakaran, dan kekeringan";

const EMERGENCY_NOTE =
  "**Jika kamu atau orang di dekatmu dalam bahaya sekarang, segera hubungi 112 (darurat) atau Basarnas 115.** Utamakan keselamatan, lalu baca panduan berikut.\n\n";

// ---------- Data real-time dari backend (BMKG) ----------

async function latestEarthquake(): Promise<string> {
  const base = process.env.BACKEND_URL || "http://localhost:5000";
  try {
    const res = await fetch(`${base}/api/bmkg/earthquake`, {
      signal: AbortSignal.timeout(5000),
      cache: "no-store",
    });
    const json = await res.json();
    const g = json?.data;
    if (!res.ok || !g) throw new Error("data kosong");
    const felt = g.felt && g.felt !== "-" ? `\n- **Dirasakan:** ${g.felt}` : "";
    return `**Gempa terkini menurut BMKG**

- **Waktu:** ${g.date}, ${g.time}
- **Magnitudo:** M ${g.magnitude}
- **Kedalaman:** ${g.depth}
- **Lokasi:** ${g.location}
- **Potensi:** ${g.potential}${felt}

Data diambil langsung dari BMKG. Untuk pembaruan berikutnya, pantau aplikasi **InfoBMKG** atau bmkg.go.id.`;
  } catch {
    return "Maaf, saya belum bisa mengambil data gempa terkini dari BMKG saat ini. Silakan cek langsung di aplikasi **InfoBMKG** atau **bmkg.go.id**.";
  }
}

// ---------- Fungsi utama ----------

export async function generateReply(messages: ChatMessage[]): Promise<string> {
  const current = messages[messages.length - 1].content;
  const history = messages.slice(0, -1);
  let norm = normalize(current);

  // 1. Basa-basi
  const greeted = GREETING.test(norm);
  if (greeted) norm = norm.replace(GREETING, "").trim();
  const isFirst = !history.some((m) => m.role === "assistant");

  if (!norm) {
    return isFirst
      ? `Halo! Saya **Siap Siaga AI**, asisten kesiapsiagaan bencana. Saya bisa membantu soal ${TOPICS_LIST}: mulai dari penyebab, tanda-tanda, persiapan, sampai apa yang dilakukan saat dan setelah bencana.\n\nAda yang ingin kamu ketahui?`
      : "Halo lagi! Ada yang ingin kamu tanyakan seputar bencana atau kesiapsiagaan?";
  }

  const hazardsNow = detectHazards(norm);
  const short = norm.split(" ").length <= 5;

  if (WHO.test(norm) && !hazardsNow.size) {
    return `Saya **Siap Siaga AI**, asisten di aplikasi Siap Siaga. Saya berjalan langsung di server Siap Siaga tanpa layanan AI dari luar, dan fokus pada topik bencana alam: ${TOPICS_LIST}.\n\nKamu bisa bertanya misalnya:\n- Apa yang harus dilakukan saat gempa?\n- Apa isi tas siaga bencana?\n- Apa tanda-tanda tanah longsor?`;
  }
  if (THANKS.test(norm) && !hazardsNow.size && short) {
    return pick(
      [
        "Sama-sama! Semoga kamu dan keluarga selalu aman. Kalau ada pertanyaan lain soal kesiapsiagaan, tanyakan saja.",
        "Sama-sama, senang bisa membantu. Tetap waspada dan jangan lupa siapkan tas siaga, ya!",
        "Terima kasih kembali! Kapan pun butuh info soal bencana, saya siap membantu.",
      ],
      current
    );
  }
  if (BYE.test(norm) && !hazardsNow.size && short) {
    return "Sampai jumpa! Tetap siaga dan jaga keselamatan, ya.";
  }
  if (ACK.test(norm)) {
    return "Baik! Kalau masih ada yang ingin ditanyakan soal bencana atau kesiapsiagaan, silakan.";
  }

  // 2. Permintaan data real-time
  if (REALTIME_GEMPA.test(norm) && !/\b(saat|setelah|sebelum|tanda|persiapan)\b/.test(norm)) {
    return latestEarthquake();
  }
  if (REALTIME_CUACA.test(norm)) {
    return "Saya tidak menyimpan data prakiraan cuaca real-time. Untuk prakiraan cuaca dan peringatan dini, cek aplikasi **InfoBMKG** atau **bmkg.go.id**. Di aplikasi Siap Siaga, kamu juga bisa membuka halaman **Prakiraan Cuaca** yang memakai data sensor IoT.\n\nKalau mau, saya bisa jelaskan cara bersiap menghadapi cuaca ekstrem.";
  }
  if (REALTIME_GUNUNG.test(norm)) {
    return "Saya tidak memiliki data status gunung api terkini. Status resmi (Normal, Waspada, Siaga, Awas) bisa dicek di **MAGMA Indonesia (magma.esdm.go.id)** milik PVMBG.\n\nKalau mau, saya bisa jelaskan arti tiap level status atau apa yang perlu disiapkan.";
  }

  // 3. Tentukan jenis bencana & fase, gunakan konteks bila ini pertanyaan lanjutan
  let hazards = hazardsNow;
  let facets = detectFacets(norm);
  let extra = "";
  const prevUser = history.filter((m) => m.role === "user").reverse();
  const isFollowUp = FOLLOW_UP.test(norm) || norm.split(" ").length <= 6;

  if (!hazards.size && isFollowUp) {
    for (const m of prevUser.slice(0, 3)) {
      const h = detectHazards(normalize(m.content));
      if (h.size) {
        hazards = h;
        extra = [...h].map((x) => HAZARD_KEYWORD[x as Exclude<Hazard, "umum">]).join(" ");
        if (!facets.size) facets = detectFacets(normalize(prevUser[0].content));
        break;
      }
    }
  }

  // Pertanyaan lanjutan singkat ("kalau gempa?") mewarisi fase dari pertanyaan sebelumnya
  if (!facets.size && isFollowUp && hazardsNow.size) {
    for (const m of prevUser.slice(0, 3)) {
      const f = detectFacets(normalize(m.content));
      if (f.size) {
        facets = f;
        break;
      }
    }
  }
  // Pertanyaan tindakan ("harus apa?") atau situasi darurat tanpa fase → anggap "saat terjadi"
  if (!facets.size && (EMERGENCY.test(norm) || /\b(harus|lakukan|tindakan|langkah|menyelamatkan|selamat)\b/.test(norm))) {
    facets = new Set<Facet>(["saat"]);
  }

  const general = GENERAL_DISASTER.test(norm);
  const ranked = rankIntents(norm, extra, hazards, facets);
  // Ungkapan rasa takut/cemas diarahkan ke dukungan psikologis
  if (EMOTION.test(norm) && !/\b(saat|setelah|sebelum|tanda)\b/.test(norm)) {
    const idx = ranked.findIndex((r) => r.intent.id === "kesehatan_mental");
    if (idx > 0) ranked.unshift(...ranked.splice(idx, 1));
  }

  // 4. Darurat tanpa jenis bencana yang jelas → nomor darurat dulu
  if (!hazards.size && EMERGENCY.test(norm) && general) {
    const nomor = INTENTS.find((i) => i.id === "nomor_darurat")!;
    return `${EMERGENCY_NOTE}${nomor.answer}`;
  }

  // 5. Di luar topik bencana
  // Tanpa jenis bencana: jawab hanya jika ada kata kunci kebencanaan dan maksudnya cukup jelas
  if (!hazards.size && (!general || !ranked.length || ranked[0].sim < 0.25)) {
    if (general) {
      return `Saya bisa membantu soal ${TOPICS_LIST}. Coba sebutkan jenis bencananya atau hal yang ingin kamu ketahui, misalnya:\n- Apa isi tas siaga bencana?\n- Apa yang dilakukan saat banjir?\n- Berapa nomor darurat di Indonesia?`;
    }
    return pick(
      [
        `Maaf, saya hanya bisa membantu pertanyaan seputar bencana alam dan kesiapsiagaan, seperti ${TOPICS_LIST}. Ada yang ingin kamu tanyakan tentang itu?`,
        "Pertanyaan itu di luar cakupan saya. Saya khusus membantu soal bencana alam, misalnya cara bersiap menghadapi gempa, banjir, atau tanah longsor. Ada yang bisa saya bantu?",
        "Maaf, saya hanya menjawab topik kebencanaan dan keselamatan. Coba tanyakan misalnya \"apa yang dilakukan saat gempa?\" atau \"apa isi tas siaga?\".",
      ],
      current
    );
  }

  // 6. Pilih jawaban
  let chosen: Scored | undefined = ranked[0];
  if (hazards.size && (!chosen || (chosen.sim < 0.12 && !facets.size))) {
    const h = [...hazards][0] as Exclude<Hazard, "umum">;
    const overview = ranked.find((r) => r.intent.id === OVERVIEW[h]);
    if (overview) chosen = overview;
  }
  if (!chosen) {
    return `Saya bisa membantu soal ${TOPICS_LIST}. Bisa dijelaskan lebih spesifik apa yang ingin kamu ketahui?`;
  }

  let prefix = "";
  if (wasAnswered(chosen.intent, history)) {
    const alt = ranked.find(
      (r) => r.intent.hazard === chosen!.intent.hazard && !wasAnswered(r.intent, history)
    );
    if (alt) {
      chosen = alt;
      prefix = "Melengkapi jawaban sebelumnya:\n\n";
    }
  }

  const intro = greeted && isFirst ? "Halo! " : "";
  const emergency = EMERGENCY.test(norm) ? EMERGENCY_NOTE : "";
  const hazardName =
    chosen.intent.hazard !== "umum" && !hazardsNow.size && extra
      ? `(Masih tentang **${HAZARD_NAMES[chosen.intent.hazard]}**)\n\n`
      : "";

  return `${intro}${emergency}${prefix}${hazardName}${chosen.intent.answer}${suggestions(chosen.intent, [
    ...history,
    { role: "assistant", content: chosen.intent.answer },
  ])}`;
}

// Diekspor untuk pengujian
export const _internal = { normalize, stem, detectHazards, detectFacets, rankIntents };

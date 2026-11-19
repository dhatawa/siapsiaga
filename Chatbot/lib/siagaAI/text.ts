// Pengolahan teks Bahasa Indonesia untuk Siap Siaga AI:
// normalisasi kata gaul, sinonim, stopword, dan stemming sederhana.

// Kata gaul / singkatan → bentuk baku
const SLANG: Record<string, string> = {
  gmn: "bagaimana", gimana: "bagaimana", bgmn: "bagaimana", gmana: "bagaimana",
  knp: "mengapa", kenapa: "mengapa", napa: "mengapa",
  gak: "tidak", ga: "tidak", gk: "tidak", nggak: "tidak", ngga: "tidak", enggak: "tidak", tdk: "tidak", engga: "tidak",
  yg: "yang", utk: "untuk", untk: "untuk", dgn: "dengan", dg: "dengan", dr: "dari", dri: "dari",
  klo: "kalau", kalo: "kalau", kl: "kalau", jika: "kalau", jikalau: "kalau", bila: "kalau", apabila: "kalau",
  sdh: "sudah", udah: "sudah", udh: "sudah", dah: "sudah",
  blm: "belum", blum: "belum", bs: "bisa", bsa: "bisa",
  td: "tadi", skrg: "sekarang", skrang: "sekarang", trs: "terus", trus: "terus",
  aja: "saja", aj: "saja", hrs: "harus", gw: "saya", gue: "saya", aku: "saya", sy: "saya", ane: "saya",
  lu: "kamu", lo: "kamu", km: "kamu", kmu: "kamu", anda: "kamu",
  tau: "tahu", tw: "tahu", pengen: "ingin", pgn: "ingin", mau: "ingin",
  pas: "saat", ketika: "saat", sewaktu: "saat", waktu: "saat",
  abis: "setelah", habis: "setelah", sehabis: "setelah", sesudah: "setelah", usai: "setelah", pasca: "setelah",
  ap: "apa", apaan: "apa", tsb: "tersebut", dll: "lainnya", dsb: "lainnya",
  org: "orang", rmh: "rumah", tmpt: "tempat", tmp: "tempat", krn: "karena", karna: "karena",
  makasih: "terima kasih", makasi: "terima kasih", mksh: "terima kasih", thanks: "terima kasih", thx: "terima kasih", tq: "terima kasih",
  p3k: "pertolongan pertama", ppgd: "pertolongan pertama",
  hp: "ponsel", handphone: "ponsel",
  ngapain: "lakukan", ngapa: "lakukan", gmpa: "gempa", tsunamy: "tsunami", sunami: "tsunami",
};

// Kata kunci penting yang dikoreksi bila salah ketik 1 huruf (mis. "gemoa" → "gempa")
const FUZZY_KEYWORDS = [
  "gempa", "tsunami", "banjir", "longsor", "erupsi", "gunung", "terbakar", "kebakaran",
  "beliung", "kekeringan", "evakuasi", "bencana", "mitigasi", "pengungsian",
];
// Kata yang mirip kata kunci tetapi bukan salah ketik
const FUZZY_EXCEPTIONS = new Set(["banjar", "gempar", "bencong", "evaluasi", "tempa", "gunting"]);

function editDistance(a: string, b: string): number {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return dp[a.length][b.length];
}

function fixTypo(word: string): string {
  if (word.length < 4 || FUZZY_EXCEPTIONS.has(word) || FUZZY_KEYWORDS.includes(word)) return word;
  for (const k of FUZZY_KEYWORDS) {
    if (k[0] === word[0] && Math.abs(k.length - word.length) <= 1 && editDistance(word, k) <= 1) return k;
  }
  return word;
}

// Sinonim → kata kunci utama (setelah slang)
const SYNONYMS: Record<string, string> = {
  lindu: "gempa", gempabumi: "gempa",
  meletus: "erupsi", letusan: "erupsi", erupsinya: "erupsi", vulkanik: "erupsi", gunungapi: "gunung",
  kebanjiran: "banjir", banjirnya: "banjir",
  longsoran: "longsor", longsornya: "longsor",
  kebakaran: "terbakar", karhutla: "terbakar",
  kemarau: "kekeringan",
  ngungsi: "mengungsi", pengungsian: "mengungsi", pengungsi: "mengungsi",
};

const STOPWORDS = new Set(
  (
    "yang dan di ke dari itu ini saya kita kami kamu ada untuk dengan atau juga akan kalau bisa dong sih ya " +
    "nih kah lah deh nya ingin tahu apa bagaimana mengapa cara harus perlu sebaiknya baik hal tentang soal " +
    "seperti pada oleh agar supaya saja sudah lalu terus kemudian lagi lain lainnya dia mereka adalah ialah yaitu jadi karena " +
    "tolong mohon minta jelaskan jelasin kasih beri berikan sebutkan dapat boleh tidak belum mana gitu begitu " +
    "the a an hai halo hi oke ok min kak bang pak bu mas mbak"
  ).split(" ")
);

/** Huruf kecil, buang tanda baca, ganti kata gaul & sinonim. */
export function normalize(input: string): string {
  const words = input
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/\b([a-z]{2,})2\b/g, "$1 $1") // kata ulang: "tanda2" → "tanda tanda"
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => SLANG[w] ?? w)
    .join(" ")
    .split(" ")
    .map((w) => SYNONYMS[fixTypo(w)] ?? fixTypo(w));
  return words.join(" ").trim();
}

/** Stemmer sederhana (buang imbuhan umum). Tidak sempurna, tapi konsisten untuk data latih dan pertanyaan. */
export function stem(word: string): string {
  let w = word;
  if (w.length <= 4) return w;
  w = w.replace(/(lah|kah|tah|pun)$/, "");
  w = w.replace(/(ku|mu|nya)$/, "");
  for (const suf of ["kan", "an", "i"]) {
    if (w.endsWith(suf) && w.length - suf.length >= 4) {
      w = w.slice(0, -suf.length);
      break;
    }
  }
  for (const pre of ["meng", "meny", "mem", "men", "me", "peng", "peny", "pem", "pen", "pe", "di", "ter", "ber", "be", "ke", "se"]) {
    if (w.startsWith(pre) && w.length - pre.length >= 4) {
      w = w.slice(pre.length);
      break;
    }
  }
  return w;
}

/** Token untuk TF-IDF: kata bermakna yang sudah di-stem. */
export function tokenize(normalized: string): string[] {
  return normalized
    .split(" ")
    .filter((w) => w.length > 1 && !STOPWORDS.has(w))
    .map(stem);
}

/** Trigram karakter, membantu mengenali salah ketik ("gmpa", "tsunammi"). */
export function charTrigrams(normalized: string): Map<string, number> {
  const grams = new Map<string, number>();
  for (const word of normalized.split(" ")) {
    if (STOPWORDS.has(word) || word.length < 2) continue;
    const padded = ` ${word} `;
    for (let i = 0; i < padded.length - 2; i++) {
      const g = padded.slice(i, i + 3);
      grams.set(g, (grams.get(g) ?? 0) + 1);
    }
  }
  return grams;
}

export function cosine(a: Map<string, number>, b: Map<string, number>): number {
  if (!a.size || !b.size) return 0;
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (const [k, v] of a) {
    na += v * v;
    const bv = b.get(k);
    if (bv) dot += v * bv;
  }
  for (const v of b.values()) nb += v * v;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

export const lightPresets = [
  { id: "soft", name: "Lembut", key: 70, fill: 48, rim: 28, temp: 42 },
  { id: "drama", name: "Drama", key: 100, fill: 12, rim: 80, temp: 28 },
  { id: "north", name: "Utara", key: 52, fill: 64, rim: 36, temp: 18 },
] as const;

export type PresetId = (typeof lightPresets)[number]["id"];

export const studio = {
  keyCool: "#d5e8ff",
  keyWarm: "#ffe0c2",
  fill: "#eef4fb",
  rim: "#c5dcff",
  ambientSky: "#f3f7fc",
  ambientGround: "#b7c6d6",
};

export const product = {
  brand: "Muryatech",
  distributor: "CV. Busa Mas Bali",
  series: "Chemical Laundry Profesional",
  category: "Detergen Laundry",
  name: "LAUDET",
  line: "LAUDET L",
  kicker: "Premium Laundry Detergent",
  summary: "Detergen utama untuk mengangkat dan mengikat kotoran selama proses pencucian.",
  note: "Ringkasan fungsi berdasarkan informasi produk Muryatech. Dosis dan wash formula perlu disesuaikan dengan kondisi air, jenis linen, dan tingkat kotoran.",
  roles: [
    "Membantu mengangkat kotoran dari serat kain.",
    "Membantu mengikat kotoran selama proses pencucian.",
    "Dirancang untuk kebutuhan laundry profesional.",
  ],
  stage: "Main wash",
  guide: "Mengikuti wash formula dan panduan teknis",
  area: "Bali & Nusra",
  support: "Konsultasi teknis",
  steps: [
    {
      n: "01",
      t: "Identifikasi kebutuhan",
      d: "Sampaikan jenis usaha, karakter linen, kendala noda, dan proses laundry yang sedang digunakan.",
    },
    {
      n: "02",
      t: "Rekomendasi produk",
      d: "Pemilihan produk disesuaikan dengan kebutuhan operasional dan urutan wash formula.",
    },
    {
      n: "03",
      t: "Uji dan evaluasi",
      d: "Hasil dapat dievaluasi bersama sebelum penerapan rutin di operasional laundry.",
    },
    {
      n: "04",
      t: "Dukungan berkelanjutan",
      d: "Konsultasikan perubahan kondisi linen, air, atau proses agar formula tetap relevan.",
    },
  ],
  consult:
    "Tim Busa Mas Bali membantu mengarahkan pemilihan chemical berdasarkan jenis linen, karakter noda, kondisi air, mesin, dan target hasil laundry.",
};

export const contact = {
  label: "Konsultasikan Produk",
  phone: "6282237963375",
};

export const related = [
  { name: "ALDET", role: "Penguat Alkali" },
  { name: "LAUDET", role: "Premium Laundry Detergent", current: true },
  { name: "M.OMAXS", role: "Pemutih Berwarna" },
  { name: "MC-BLEACH", role: "Pemutih Laundry" },
] as const;

export function whatsappHref() {
  const text =
    "Halo Busa Mas Bali, saya ingin konsultasi LAUDET Premium Laundry Detergent.";
  return `https://wa.me/${contact.phone}?text=${encodeURIComponent(text)}`;
}

const PREF_KEY = "busamas-laudet";

export type StudioPrefs = {
  autoRotate: boolean;
  key: number;
  fill: number;
  rim: number;
  temp: number;
  presetId: PresetId | null;
};

export function readPrefs(): Partial<StudioPrefs> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PREF_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as Partial<StudioPrefs>;
    const next: Partial<StudioPrefs> = {};
    if (typeof data.autoRotate === "boolean") next.autoRotate = data.autoRotate;
    if (typeof data.key === "number") next.key = data.key;
    if (typeof data.fill === "number") next.fill = data.fill;
    if (typeof data.rim === "number") next.rim = data.rim;
    if (typeof data.temp === "number") next.temp = data.temp;
    if (data.presetId === null || lightPresets.some((p) => p.id === data.presetId)) {
      next.presetId = data.presetId ?? null;
    }
    return next;
  } catch {
    return null;
  }
}

export function writePrefs(prefs: StudioPrefs) {
  try {
    localStorage.setItem(PREF_KEY, JSON.stringify(prefs));
  } catch {
    /* private mode */
  }
}

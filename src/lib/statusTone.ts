/**
 * Centralized status → tone mapping & badge class.
 * Goal: konsistensi warna badge di seluruh tabel dan jaminan
 * tidak ada status yang tampil tanpa style (selalu fallback ke "neutral").
 */
export type Tone = "success" | "warning" | "danger" | "info" | "neutral";

export const toneClass: Record<Tone, string> = {
  success: "bg-emerald-50 text-emerald-700 ring-emerald-200/80",
  warning: "bg-amber-50 text-amber-700 ring-amber-200/80",
  danger: "bg-rose-50 text-rose-700 ring-rose-200/80",
  info: "bg-sky-50 text-sky-700 ring-sky-200/80",
  neutral: "bg-slate-100 text-slate-700 ring-slate-200/80",
};

/**
 * Mapping label status (case-insensitive) → tone.
 * Tambahkan label baru di sini agar otomatis konsisten di semua tabel.
 */
const LABEL_TONE: Record<string, Tone> = {
  // Success
  approved: "success",
  paid: "success",
  lunas: "success",
  lancar: "success",
  selesai: "success",
  aktif: "success",
  active: "success",
  done: "success",
  completed: "success",
  berhasil: "success",
  success: "success",

  // Warning
  pending: "warning",
  waiting: "warning",
  menunggu: "warning",
  terlambat: "warning",
  late: "warning",
  overdue: "warning",
  dijadwalkan: "warning",
  scheduled: "warning",
  "mendekati expired": "warning",

  // Danger
  rejected: "danger",
  ditolak: "danger",
  unpaid: "danger",
  expired: "danger",
  "jatuh tempo": "danger",
  failed: "danger",
  gagal: "danger",
  cancelled: "danger",
  dibatalkan: "danger",

  // Info
  review: "info",
  proses: "info",
  "in progress": "info",
  processing: "info",
  draft: "info",
  submitted: "info",
};

export const resolveTone = (label?: string | null, fallback?: Tone): Tone => {
  const key = (label ?? "").trim().toLowerCase();
  if (key && LABEL_TONE[key]) return LABEL_TONE[key];
  // Label kosong → neutral. Label tak dikenal → paksa neutral (abaikan fallback warna lain)
  // agar status asing tidak salah-warna.
  if (!key) return fallback ?? "neutral";
  return "neutral";
};

export const statusBadgeClass = (label?: string | null, fallback?: Tone): string =>
  toneClass[resolveTone(label, fallback)];

/** True jika label cocok dengan mapping yang dikenal. */
export const isKnownStatus = (label?: string | null): boolean => {
  const key = (label ?? "").trim().toLowerCase();
  return key.length > 0 && key in LABEL_TONE;
};

/**
 * Label aman untuk ditampilkan / atribut title.
 * Kosong/null/whitespace → "Tidak tersedia".
 */
export const statusLabel = (label?: string | null, fallback = "Tidak tersedia"): string => {
  const s = (label ?? "").trim();
  return s.length > 0 ? s : fallback;
};


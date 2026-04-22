/**
 * Format helpers untuk tabel/laporan.
 *
 * Kontrak nilai-aman:
 * - dash:    fallback "—" untuk null/undefined/NaN/string kosong
 * - pick:    akses dot-path tanpa risiko TypeError
 * - dashPath: shortcut pick + dash
 * - money:   format Rupiah konsisten ("Rp X.XXX")
 */

/**
 * Fallback aman untuk render nilai apa pun (termasuk nested optional fields).
 * - null/undefined/NaN/""/whitespace → "—"
 * - number → diformat sesuai locale id-ID
 * - boolean → "Ya"/"Tidak"
 * - object/array → "—" (tidak akan crash karena kita tidak panggil method)
 */
export const dash = (v: unknown): string => {
  if (v == null) return "—";
  if (typeof v === "number") return Number.isFinite(v) ? v.toLocaleString("id-ID") : "—";
  if (typeof v === "boolean") return v ? "Ya" : "Tidak";
  if (typeof v === "object") return "—";
  const s = String(v).trim();
  return s.length > 0 ? s : "—";
};

/**
 * Akses dot-path yang aman: pick(row, "asli.tipe") setara r?.asli?.tipe
 * tanpa risiko TypeError saat properti antara hilang.
 */
export const pick = (obj: unknown, path: string): unknown => {
  if (obj == null) return undefined;
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc == null || typeof acc !== "object") return undefined;
    return (acc as Record<string, unknown>)[key];
  }, obj);
};

/** Shortcut: pick + dash dalam satu panggilan. */
export const dashPath = (obj: unknown, path: string): string => dash(pick(obj, path));

/**
 * Fallback khusus kolom nominal/uang.
 * - null/undefined/"" → "Rp 0"
 * - number → diformat "Rp X.XXX"
 * - string sudah berisi "Rp" → dikembalikan apa adanya (trim)
 * - string angka mentah → diformat dengan prefix "Rp"
 */
export const money = (v?: string | number | null): string => {
  if (v == null) return "Rp 0";
  if (typeof v === "number") {
    if (!Number.isFinite(v)) return "Rp 0";
    return `Rp ${v.toLocaleString("id-ID")}`;
  }
  const s = String(v).trim();
  if (s.length === 0) return "Rp 0";
  if (/rp/i.test(s)) return s;
  const n = Number(s.replace(/[^\d-]/g, ""));
  if (!Number.isFinite(n)) return "Rp 0";
  return `Rp ${n.toLocaleString("id-ID")}`;
};

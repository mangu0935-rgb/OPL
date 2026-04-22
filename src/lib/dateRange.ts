/**
 * Helper rentang tanggal untuk filter laporan.
 * Tidak bergantung pada library date-fns supaya footprint tetap kecil.
 */

export const today = (): Date => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

export const subMonths = (base: Date, n: number): Date => {
  const d = new Date(base);
  d.setMonth(d.getMonth() - n);
  return d;
};

export const startOfYear = (base: Date): Date => new Date(base.getFullYear(), 0, 1);

export type DatePreset = "Last 3 Months" | "Last 6 Months" | "Last Year" | "YTD" | string;

export const computePresetRange = (preset: DatePreset): { from: Date; to: Date } => {
  const to = today();
  if (preset === "Last 3 Months") return { from: subMonths(to, 3), to };
  if (preset === "Last 6 Months") return { from: subMonths(to, 6), to };
  if (preset === "Last Year") return { from: subMonths(to, 12), to };
  return { from: startOfYear(to), to }; // YTD
};

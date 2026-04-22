import {
  ArrowUpRight as _ArrowUpRight, // eslint-disable-line @typescript-eslint/no-unused-vars
  FileText,
  Calendar as CalendarIcon,
  CreditCard,
  Calculator,
  Wallet,
  Receipt,
  PiggyBank,
  type LucideIcon,
} from "lucide-react";

export type StatCard = {
  label: string;
  value: string;
  change: string;
  icon: LucideIcon;
  color: string;
};

export type FinanceStat = {
  label: string;
  value: string;
  icon: LucideIcon;
  color: string;
};

export type PieDatum = { name: string; value: number; color: string };

export type KlaimPoint = { period: string; date: Date; count: number; value: number };

export type ServicePoint = { month: string; date: Date; jumlah: number; biaya: number };

export type UgsRow = {
  asli: { plat: string; tipe: string };
  ganti: { plat: string; tipe: string };
  periode: string;
  periodeStart: Date;
  alasan: string;
  status: "Aktif" | "Selesai" | "Proses";
};

export type FsRow = {
  invoice: string;
  customer: string;
  status: "Unpaid" | "Paid" | "Pending";
  nominal: string;
  date: Date;
};

export const stats: StatCard[] = [
  { label: "Total Aset", value: "6.020", change: "+2.4%", icon: Calculator, color: "bg-brand-blue/10 text-brand-blue" },
  { label: "STNK Segera Berakhir", value: "6", change: "+0.0%", icon: FileText, color: "bg-amber-50 text-amber-600" },
  { label: "Fasilitas Segera Berakhir", value: "3.939", change: "+5.2%", icon: CalendarIcon, color: "bg-emerald-50 text-emerald-600" },
  { label: "On Proses Klaim", value: "3", change: "-25.0%", icon: CreditCard, color: "bg-violet-50 text-violet-600" },
];

export const financeStats: FinanceStat[] = [
  { label: "Total Outstanding", value: "Rp 0", icon: Wallet, color: "bg-rose-50 text-rose-600" },
  { label: "Pembayaran Terakhir", value: "Rp 45.372.546", icon: Receipt, color: "bg-brand-blue/10 text-brand-blue" },
  { label: "Saldo Overpayment", value: "Rp 0", icon: PiggyBank, color: "bg-emerald-50 text-emerald-600" },
];

export const filters = ["Last 3 Months", "Last 6 Months", "Last Year", "YTD"] as const;

export const pieData: PieDatum[] = [
  { name: "Lainnya", value: 23, color: "hsl(258 74% 64%)" },
  { name: "BMW", value: 92, color: "hsl(142 65% 48%)" },
  { name: "BYD", value: 3625, color: "hsl(0 88% 60%)" },
  { name: "Chery", value: 56, color: "hsl(38 92% 55%)" },
  { name: "Daihatsu", value: 84, color: "hsl(216 84% 58%)" },
  { name: "Denza", value: 218, color: "hsl(262 78% 64%)" },
  { name: "Honda", value: 1411, color: "hsl(326 78% 58%)" },
  { name: "Hyundai", value: 76, color: "hsl(181 52% 48%)" },
  { name: "Isuzu", value: 38, color: "hsl(28 92% 58%)" },
  { name: "Kawasaki", value: 28, color: "hsl(84 78% 42%)" },
  { name: "KIA", value: 61, color: "hsl(260 62% 60%)" },
  { name: "Lexus", value: 70, color: "hsl(146 66% 45%)" },
  { name: "Mazda", value: 47, color: "hsl(6 90% 58%)" },
  { name: "Mercedes", value: 41, color: "hsl(43 96% 52%)" },
  { name: "Mini Cooper", value: 35, color: "hsl(219 78% 59%)" },
  { name: "Mitsubishi", value: 58, color: "hsl(260 78% 66%)" },
  { name: "Morris Gar", value: 24, color: "hsl(330 74% 62%)" },
  { name: "Nissan", value: 33, color: "hsl(179 66% 43%)" },
];

export const klaimTrend: KlaimPoint[] = [
  { period: "Apr 2025", date: new Date(2025, 3, 1), count: 10, value: 15 },
  { period: "May 2025", date: new Date(2025, 4, 1), count: 30, value: 45 },
  { period: "Jun 2025", date: new Date(2025, 5, 1), count: 55, value: 65 },
  { period: "Jul 2025", date: new Date(2025, 6, 1), count: 125, value: 140 },
  { period: "Aug 2025", date: new Date(2025, 7, 1), count: 30, value: 35 },
  { period: "Sep 2025", date: new Date(2025, 8, 1), count: 75, value: 45 },
  { period: "Oct 2025", date: new Date(2025, 9, 1), count: 32, value: 32 },
  { period: "Nov 2025", date: new Date(2025, 10, 1), count: 10, value: 5 },
];

export const serviceData: ServicePoint[] = [
  { month: "Apr 2025", date: new Date(2025, 3, 1), jumlah: 120, biaya: 9 },
  { month: "May 2025", date: new Date(2025, 4, 1), jumlah: 210, biaya: 20 },
  { month: "Jun 2025", date: new Date(2025, 5, 1), jumlah: 185, biaya: 17 },
  { month: "Jul 2025", date: new Date(2025, 6, 1), jumlah: 220, biaya: 20 },
  { month: "Aug 2025", date: new Date(2025, 7, 1), jumlah: 215, biaya: 20 },
  { month: "Sep 2025", date: new Date(2025, 8, 1), jumlah: 195, biaya: 18 },
  { month: "Oct 2025", date: new Date(2025, 9, 1), jumlah: 305, biaya: 31 },
];

export const ugsRows: UgsRow[] = [
  {
    asli: { plat: "B 1234 ABC", tipe: "Toyota Avanza 2022" },
    ganti: { plat: "B 9988 XYZ", tipe: "Toyota Innova 2023" },
    periode: "12 Apr - 26 Apr 2025",
    periodeStart: new Date(2025, 3, 12),
    alasan: "Service Berkala 40.000 km",
    status: "Aktif",
  },
  {
    asli: { plat: "B 5678 DEF", tipe: "Honda Brio 2021" },
    ganti: { plat: "B 4422 LMN", tipe: "Honda Mobilio 2022" },
    periode: "15 Apr - 22 Apr 2025",
    periodeStart: new Date(2025, 3, 15),
    alasan: "Perbaikan Body & Cat Ulang",
    status: "Proses",
  },
  {
    asli: { plat: "B 9012 GHI", tipe: "Mitsubishi Xpander 2023" },
    ganti: { plat: "B 7766 PQR", tipe: "Mitsubishi Pajero Sport 2022" },
    periode: "18 Apr - 02 Mei 2025",
    periodeStart: new Date(2025, 3, 18),
    alasan: "Klaim Asuransi Kecelakaan",
    status: "Aktif",
  },
  {
    asli: { plat: "B 3456 JKL", tipe: "Daihatsu Sigra 2020" },
    ganti: { plat: "B 5511 STU", tipe: "Daihatsu Xenia 2021" },
    periode: "01 Apr - 14 Apr 2025",
    periodeStart: new Date(2025, 3, 1),
    alasan: "Tune Up & Spooring",
    status: "Selesai",
  },
  {
    asli: { plat: "B 7788 MNO", tipe: "Suzuki Ertiga 2022" },
    ganti: { plat: "B 2244 VWX", tipe: "Suzuki XL7 2023" },
    periode: "22 Apr - 06 Mei 2025",
    periodeStart: new Date(2025, 3, 22),
    alasan: "Penggantian Mesin",
    status: "Proses",
  },
  {
    asli: { plat: "B 6655 RST", tipe: "Nissan Livina 2021" },
    ganti: { plat: "B 1199 CDE", tipe: "Nissan Serena 2022" },
    periode: "05 Apr - 19 Apr 2025",
    periodeStart: new Date(2025, 3, 5),
    alasan: "Service AC & Kelistrikan",
    status: "Selesai",
  },
];

export const fsRows: FsRow[] = [
  { invoice: "1017-000-8-559026", customer: "PT ASDP INDONESIA FERRY (PERSERO)", status: "Unpaid", nominal: "Rp 11.660.001", date: new Date(2025, 3, 22) },
  { invoice: "1017-000-8-559027", customer: "PT PELINDO MULTI TERMINAL", status: "Paid", nominal: "Rp  8.150.000", date: new Date(2025, 3, 18) },
  { invoice: "1017-000-8-559028", customer: "PT GARUDA INDONESIA (PERSERO)", status: "Pending", nominal: "Rp 11.380.000", date: new Date(2025, 3, 15) },
  { invoice: "1017-000-8-559029", customer: "PT KAI LOGISTIK", status: "Paid", nominal: "Rp  8.150.000", date: new Date(2025, 3, 10) },
  { invoice: "1017-000-8-559030", customer: "PT POS INDONESIA (PERSERO)", status: "Unpaid", nominal: "Rp  8.500.000", date: new Date(2025, 3, 5) },
  { invoice: "1017-000-8-559031", customer: "PT TELKOM INDONESIA", status: "Pending", nominal: "Rp 14.250.000", date: new Date(2025, 3, 2) },
];

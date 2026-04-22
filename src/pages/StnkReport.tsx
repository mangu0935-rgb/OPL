import AppLayout from "@/components/AppLayout";
import { RecordsTable, RecordRow } from "@/components/RecordsTable";

const rows: RecordRow[] = [
  { id: "1", cells: ["STNK/2025/001", "B 1234 ABC", "Toyota Avanza 2022", "Berlaku s/d 12 Apr 2026"], status: { label: "Aktif", tone: "success" } },
  { id: "2", cells: ["STNK/2025/002", "B 5678 DEF", "Honda Brio 2021", "Berlaku s/d 03 Mei 2025"], status: { label: "Mendekati Expired", tone: "warning" } },
  { id: "3", cells: ["STNK/2025/003", "B 9012 GHI", "Mitsubishi Xpander 2023", "Berlaku s/d 20 Sep 2026"], status: { label: "Aktif", tone: "success" } },
  { id: "4", cells: ["STNK/2025/004", "B 3456 JKL", "Daihatsu Sigra 2020", "Berlaku s/d 15 Mar 2025"], status: { label: "Expired", tone: "danger" } },
  { id: "5", cells: ["STNK/2025/005", "B 7788 MNO", "Suzuki Ertiga 2022", "Berlaku s/d 28 Apr 2025"], status: { label: "Mendekati Expired", tone: "warning" } },
  { id: "6", cells: ["STNK/2025/006", "B 6655 RST", "Nissan Livina 2021", "Berlaku s/d 14 Nov 2025"], status: { label: "Aktif", tone: "success" } },
];

const StnkReport = () => (
  <AppLayout title="STNK Report" breadcrumb="Beranda / Records / STNK Report">
    <RecordsTable
      title="Daftar Laporan STNK"
      subtitle="Pemantauan masa berlaku STNK kendaraan jaminan"
      searchPlaceholder="Cari plat / nomor laporan..."
      columns={["No. Laporan", "Plat Nomor", "Kendaraan", "Masa Berlaku", "Status"]}
      rows={rows}
      viewTitle={(r) => `Detail STNK ${r.cells[1]}`}
      renderView={(r) => (
        <div className="space-y-4">
          <div className="rounded-lg border-2 border-amber-200 bg-amber-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">Status Kendaraan</p>
            <p className="mt-1 text-lg font-bold text-amber-900">{r.cells[3]}</p>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><p className="text-muted-foreground">No. Laporan</p><p className="font-semibold text-brand-navy">{r.cells[0]}</p></div>
            <div><p className="text-muted-foreground">Plat Nomor</p><p className="font-semibold text-brand-navy">{r.cells[1]}</p></div>
            <div><p className="text-muted-foreground">Kendaraan</p><p className="font-semibold text-brand-navy">{r.cells[2]}</p></div>
            <div><p className="text-muted-foreground">No. Rangka</p><p className="font-mono font-semibold text-brand-navy">MHKM1BA3JKJ123456</p></div>
            <div><p className="text-muted-foreground">No. Mesin</p><p className="font-mono font-semibold text-brand-navy">2NR1234567</p></div>
            <div><p className="text-muted-foreground">Pemilik</p><p className="font-semibold text-brand-navy">PT Maju Sentosa</p></div>
            <div><p className="text-muted-foreground">Pajak Terakhir</p><p className="font-semibold text-brand-navy">12 Apr 2024</p></div>
            <div><p className="text-muted-foreground">Masa Berlaku</p><p className="font-semibold text-brand-navy">{r.cells[3]}</p></div>
          </div>
        </div>
      )}
    />
  </AppLayout>
);

export default StnkReport;

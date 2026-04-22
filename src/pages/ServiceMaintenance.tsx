import AppLayout from "@/components/AppLayout";
import { RecordsTable, RecordRow } from "@/components/RecordsTable";

const rows: RecordRow[] = [
  { id: "1", cells: ["SVC/2025/001", "B 1234 ABC", "Toyota Avanza 2022", "Service Berkala 40.000 km", "20 Apr 2025", "Rp 1.350.000"], status: { label: "Selesai", tone: "success" } },
  { id: "2", cells: ["SVC/2025/002", "B 5678 DEF", "Honda Brio 2021", "Ganti Oli & Filter", "16 Apr 2025", "Rp    685.000"], status: { label: "Selesai", tone: "success" } },
  { id: "3", cells: ["SVC/2025/003", "B 9012 GHI", "Mitsubishi Xpander 2023", "Tune Up & Spooring", "12 Apr 2025", "Rp 2.475.000"], status: { label: "Proses", tone: "info" } },
  { id: "4", cells: ["SVC/2025/004", "B 3456 JKL", "Daihatsu Sigra 2020", "Perbaikan AC", "08 Apr 2025", "Rp    925.000"], status: { label: "Dijadwalkan", tone: "warning" } },
  { id: "5", cells: ["SVC/2025/005", "B 7788 MNO", "Suzuki Ertiga 2022", "Service Berkala 20.000 km", "04 Apr 2025", "Rp 1.450.000"], status: { label: "Selesai", tone: "success" } },
  { id: "6", cells: ["SVC/2025/006", "B 6655 RST", "Nissan Livina 2021", "Ganti Kampas Rem", "01 Apr 2025", "Rp 1.180.000"], status: { label: "Selesai", tone: "success" } },
];

const ServiceMaintenance = () => (
  <AppLayout title="Service & Maintenance" breadcrumb="OPL / Records / Service & Maintenance">
    <RecordsTable
      title="Daftar Service & Maintenance"
      subtitle="Riwayat service dan perawatan kendaraan operasional"
      searchPlaceholder="Cari nomor service / plat..."
      columns={["No. Service", "Plat Nomor", "Kendaraan", "Jenis Service", "Tanggal", "Biaya", "Status"]}
      rows={rows}
      viewTitle={(r) => `Detail ${r.cells[0]}`}
      renderView={(r) => (
        <div className="space-y-4">
          <div className="rounded-lg bg-gradient-to-r from-brand-navy to-brand-blue p-5 text-white">
            <p className="text-xs opacity-80">Total Biaya Service</p>
            <p className="text-3xl font-bold">{r.cells[5]}</p>
            <p className="mt-1 text-xs">Tanggal: {r.cells[4]}</p>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><p className="text-muted-foreground">No. Service</p><p className="font-semibold text-brand-navy">{r.cells[0]}</p></div>
            <div><p className="text-muted-foreground">Plat Nomor</p><p className="font-semibold text-brand-navy">{r.cells[1]}</p></div>
            <div><p className="text-muted-foreground">Kendaraan</p><p className="font-semibold text-brand-navy">{r.cells[2]}</p></div>
            <div><p className="text-muted-foreground">Jenis Service</p><p className="font-semibold text-brand-navy">{r.cells[3]}</p></div>
            <div><p className="text-muted-foreground">Bengkel</p><p className="font-semibold text-brand-navy">Auto2000 Pasar Minggu</p></div>
            <div><p className="text-muted-foreground">Mekanik</p><p className="font-semibold text-brand-navy">Bpk. Sutrisno</p></div>
            <div><p className="text-muted-foreground">Kilometer</p><p className="font-semibold text-brand-navy">45.230 km</p></div>
            <div><p className="text-muted-foreground">Service Berikutnya</p><p className="font-semibold text-brand-navy">12 Jul 2025</p></div>
          </div>
          <div className="rounded-lg border border-border">
            <table className="table-premium w-full text-sm">
              <thead className="text-left">
                <tr>
                  <th className="px-3 py-2 font-semibold">Item</th>
                  <th className="px-3 py-2 text-right font-semibold">Biaya</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr><td className="px-3 py-2">Jasa Service</td><td className="px-3 py-2 text-right font-semibold">Rp   450.000</td></tr>
                <tr><td className="px-3 py-2">Sparepart</td><td className="px-3 py-2 text-right font-semibold">Rp   650.000</td></tr>
                <tr><td className="px-3 py-2">Oli &amp; Cairan</td><td className="px-3 py-2 text-right font-semibold">Rp   150.000</td></tr>
                <tr className="bg-muted/30"><td className="px-3 py-2 font-bold">Total</td><td className="px-3 py-2 text-right font-bold text-brand-navy">{r.cells[5]}</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    />
  </AppLayout>
);

export default ServiceMaintenance;

import AppLayout from "@/components/AppLayout";
import { RecordsTable, RecordRow } from "@/components/RecordsTable";
import { printDocument } from "@/lib/printDocument";

const rows: RecordRow[] = [
  { id: "1", cells: ["FS/2025/Q1", "Triwulan I 2025", "Audited", "15 Apr 2025"], status: { label: "Lancar", tone: "success" } },
  { id: "2", cells: ["FS/2024/Q4", "Triwulan IV 2024", "Audited", "20 Jan 2025"], status: { label: "Lancar", tone: "success" } },
  { id: "3", cells: ["FS/2024/Q3", "Triwulan III 2024", "Unaudited", "22 Okt 2024"], status: { label: "Terlambat", tone: "warning" } },
  { id: "4", cells: ["FS/2024/Q2", "Triwulan II 2024", "Audited", "18 Jul 2024"], status: { label: "Lancar", tone: "success" } },
  { id: "5", cells: ["FS/2024/Q1", "Triwulan I 2024", "Audited", "16 Apr 2024"], status: { label: "Lancar", tone: "success" } },
];

const FinancialStatement = () => (
  <AppLayout title="Financial Statement" breadcrumb="Beranda / Records / Financial Statement">
    <RecordsTable
      title="Daftar Laporan Keuangan"
      subtitle="Riwayat penyampaian laporan keuangan periodik"
      searchPlaceholder="Cari laporan..."
      columns={["No. Laporan", "Periode", "Jenis", "Tanggal Submit", "Status"]}
      rows={rows}
      viewTitle={(r) => `Detail ${r.cells[0]} — ${r.cells[1]}`}
      onPrint={(r) => {
        const isLate = r.status?.label === "Terlambat";
        printDocument({
          docType: "FINANCIAL STATEMENT",
          docNumber: String(r.cells[0]),
          sections: [
            { type: "banner", label: "Status Laporan", value: `${r.status?.label} — ${r.cells[1]}`, tone: isLate ? "warning" : "success" },
            {
              type: "meta",
              left: [
                { label: "No. Laporan", value: String(r.cells[0]) },
                { label: "Jenis", value: String(r.cells[2]) },
                { label: "Auditor", value: "KAP Mulyana & Rekan" },
              ],
              right: [
                { label: "Periode", value: String(r.cells[1]) },
                { label: "Tanggal Submit", value: String(r.cells[3]) },
                { label: "Total Aset", value: "Rp 12.450.000.000" },
              ],
            },
            {
              type: "table",
              headers: ["Pos", "Nilai"],
              rows: [
                ["Pendapatan", "Rp 4.250.000.000"],
                ["Beban Operasional", "Rp 2.890.000.000"],
                ["Laba Bersih", "Rp 1.360.000.000"],
              ],
              total: { label: "TOTAL LABA BERSIH", value: "Rp 1.360.000.000" },
            },
            { type: "notes", title: "Catatan:", body: "Laporan keuangan telah disusun sesuai PSAK dan diaudit oleh kantor akuntan publik terdaftar." },
          ],
        });
      }}
      renderView={(r) => {
        const isLate = r.status?.label === "Terlambat";
        return (
          <div className="space-y-4">
            <div className={`rounded-lg p-4 ${isLate ? "border-2 border-amber-200 bg-amber-50" : "border-2 border-emerald-200 bg-emerald-50"}`}>
              <p className={`text-xs font-semibold uppercase tracking-wide ${isLate ? "text-amber-800" : "text-emerald-800"}`}>Status Laporan</p>
              <p className={`mt-1 text-lg font-bold ${isLate ? "text-amber-900" : "text-emerald-900"}`}>
                {r.status?.label} — {r.cells[1]}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><p className="text-muted-foreground">No. Laporan</p><p className="font-semibold text-brand-navy">{r.cells[0]}</p></div>
              <div><p className="text-muted-foreground">Periode</p><p className="font-semibold text-brand-navy">{r.cells[1]}</p></div>
              <div><p className="text-muted-foreground">Jenis</p><p className="font-semibold text-brand-navy">{r.cells[2]}</p></div>
              <div><p className="text-muted-foreground">Tanggal Submit</p><p className="font-semibold text-brand-navy">{r.cells[3]}</p></div>
              <div><p className="text-muted-foreground">Auditor</p><p className="font-semibold text-brand-navy">KAP Mulyana &amp; Rekan</p></div>
              <div><p className="text-muted-foreground">Total Aset</p><p className="font-semibold text-brand-navy">Rp 12.450.000.000</p></div>
            </div>
            <div className="rounded-lg border border-border">
              <table className="table-premium w-full text-sm">
                <thead className="text-left">
                  <tr>
                    <th className="px-3 py-2 font-semibold">Pos</th>
                    <th className="px-3 py-2 text-right font-semibold">Nilai</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr><td className="px-3 py-2">Pendapatan</td><td className="px-3 py-2 text-right font-semibold">Rp 4.250.000.000</td></tr>
                  <tr><td className="px-3 py-2">Beban Operasional</td><td className="px-3 py-2 text-right font-semibold">Rp 2.890.000.000</td></tr>
                  <tr><td className="px-3 py-2">Laba Bersih</td><td className="px-3 py-2 text-right font-bold text-emerald-700">Rp 1.360.000.000</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      }}
    />
  </AppLayout>
);

export default FinancialStatement;

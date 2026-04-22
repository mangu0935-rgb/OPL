import AppLayout from "@/components/AppLayout";
import { RecordsTable, RecordRow } from "@/components/RecordsTable";

const rows: RecordRow[] = [
  { id: "1", cells: ["UGS/2025/001", "PT ASDP Indonesia Ferry", "22 Apr 2025", "Rp 285.500.000"], status: { label: "Approved", tone: "success" } },
  { id: "2", cells: ["UGS/2025/002", "PT Pelindo Multi Terminal", "18 Apr 2025", "Rp 172.250.000"], status: { label: "Pending", tone: "warning" } },
  { id: "3", cells: ["UGS/2025/003", "PT Garuda Indonesia (Persero)", "15 Apr 2025", "Rp 340.750.000"], status: { label: "Approved", tone: "success" } },
  { id: "4", cells: ["UGS/2025/004", "PT KAI Logistik", "10 Apr 2025", "Rp  98.400.000"], status: { label: "Rejected", tone: "danger" } },
  { id: "5", cells: ["UGS/2025/005", "PT Pos Indonesia (Persero)", "05 Apr 2025", "Rp 412.300.000"], status: { label: "Approved", tone: "success" } },
  { id: "6", cells: ["UGS/2025/006", "PT Telkom Indonesia", "02 Apr 2025", "Rp 156.800.000"], status: { label: "Approved", tone: "success" } },
];

const UGS = () => (
  <AppLayout title="Update Guarantee Status (UGS)" breadcrumb="Beranda / Records / UGS">
    <RecordsTable
      title="Daftar UGS"
      subtitle="Riwayat update status jaminan debitur"
      searchPlaceholder="Cari nomor UGS..."
      columns={["No. UGS", "Debitur", "Tanggal", "Nilai Jaminan", "Status"]}
      rows={rows}
      viewTitle={(r) => `Detail ${r.cells[0]}`}
      renderView={(r) => (
        <div className="space-y-4">
          <div className="rounded-lg bg-gradient-to-r from-brand-navy to-brand-blue p-5 text-white">
            <p className="text-xs opacity-80">Nilai Jaminan</p>
            <p className="text-3xl font-bold">{r.cells[3]}</p>
            <p className="mt-1 text-xs">Tanggal: {r.cells[2]}</p>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><p className="text-muted-foreground">No. UGS</p><p className="font-semibold text-brand-navy">{r.cells[0]}</p></div>
            <div><p className="text-muted-foreground">Debitur</p><p className="font-semibold text-brand-navy">{r.cells[1]}</p></div>
            <div><p className="text-muted-foreground">Jenis Jaminan</p><p className="font-semibold text-brand-navy">Sertifikat Hak Milik</p></div>
            <div><p className="text-muted-foreground">Lokasi</p><p className="font-semibold text-brand-navy">Jakarta Selatan</p></div>
            <div><p className="text-muted-foreground">Penilai</p><p className="font-semibold text-brand-navy">KJPP Mitra Appraisal</p></div>
            <div><p className="text-muted-foreground">Berlaku s/d</p><p className="font-semibold text-brand-navy">12 Apr 2026</p></div>
          </div>
          <div className="rounded-lg border border-border p-4 text-sm">
            <p className="font-semibold text-brand-navy">Catatan</p>
            <p className="mt-1 text-muted-foreground">Update jaminan disetujui sesuai laporan appraisal terbaru. Dokumen pendukung telah diverifikasi.</p>
          </div>
        </div>
      )}
    />
  </AppLayout>
);

export default UGS;

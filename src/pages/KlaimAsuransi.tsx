import { useState } from "react";
import { toast } from "sonner";
import { Clock } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { RecordsTable, RecordRow } from "@/components/RecordsTable";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Upload } from "lucide-react";
import { printDocument } from "@/lib/printDocument";
import { generateClaimReceiptPdf } from "@/lib/generateClaimReceiptPdf";

// Format Indonesian plate: 1-2 letters, space, 1-4 digits, space, 1-3 letters (e.g. "B 1234 ABC")
const PLAT_REGEX = /^[A-Z]{1,2}\s\d{1,4}\s[A-Z]{1,3}$/;

const toneFor = (label?: string): "success" | "warning" | "danger" | "info" => {
  if (label === "Approved") return "success";
  if (label === "Rejected") return "danger";
  if (label === "Review") return "info";
  return "warning";
};

const initialRows: RecordRow[] = [
  { id: "1", cells: ["KLM/2025/001", "B 1234 ABC", "Kecelakaan", "Rp  24.500.000", "18 Apr 2025"], status: { label: "Approved", tone: "success" } },
  { id: "2", cells: ["KLM/2025/002", "B 9012 GHI", "Kerusakan Banjir", "Rp  47.250.000", "15 Apr 2025"], status: { label: "Review", tone: "info" } },
  { id: "3", cells: ["KLM/2025/003", "B 5678 DEF", "Kehilangan Spion", "Rp   3.850.000", "10 Apr 2025"], status: { label: "Pending", tone: "warning" } },
  { id: "4", cells: ["KLM/2025/004", "B 7788 MNO", "Kecelakaan Ringan", "Rp  12.750.000", "05 Apr 2025"], status: { label: "Approved", tone: "success" } },
  { id: "5", cells: ["KLM/2025/005", "B 3456 JKL", "Kecelakaan Berat", "Rp 138.400.000", "28 Mar 2025"], status: { label: "Rejected", tone: "danger" } },
];

const formatRupiah = (raw: string) => {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  return "Rp " + Number(digits).toLocaleString("id-ID");
};

const formatDateId = (iso: string) => {
  if (!iso) return new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
  return new Date(iso).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
};

const KlaimAsuransi = () => {
  const [addOpen, setAddOpen] = useState(false);
  const [rows, setRows] = useState<RecordRow[]>(initialRows);
  const [form, setForm] = useState({ plat: "", jenis: "Kecelakaan", tanggal: "", nilai: "", kronologi: "" });

  const resetForm = () => setForm({ plat: "", jenis: "Kecelakaan", tanggal: "", nilai: "", kronologi: "" });

  const generateReceipt = (data: { noKlaim: string; plat: string; jenis: string; nilai: string; tanggal: string; kronologi: string }) => {
    const receiptDate = new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });
    const receiptTime = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
    printDocument({
      docType: "TANDA TERIMA PENGAJUAN KLAIM",
      docNumber: data.noKlaim,
      sections: [
        {
          type: "banner",
          label: "Status Pengajuan",
          value: `PENDING — Diterima pada ${receiptDate} ${receiptTime} WIB`,
          tone: "warning",
        },
        {
          type: "meta",
          left: [
            { label: "No. Klaim", value: data.noKlaim },
            { label: "Plat Nomor", value: data.plat },
            { label: "Jenis Klaim", value: data.jenis },
            { label: "Pemohon", value: "PT Maju Sentosa" },
          ],
          right: [
            { label: "Tgl Pengajuan", value: receiptDate },
            { label: "Tgl Kejadian", value: data.tanggal },
            { label: "Estimasi Nilai", value: data.nilai },
            { label: "Diterima Oleh", value: "Sistem OPL Terpadu" },
          ],
        },
        {
          type: "notes",
          title: "Kronologi Kejadian:",
          body: data.kronologi || "Tidak ada kronologi yang dilampirkan.",
        },
        {
          type: "notes",
          title: "Catatan Penting:",
          body: "Tanda terima ini merupakan bukti bahwa pengajuan klaim Anda telah diterima oleh sistem. Tim kami akan melakukan verifikasi dokumen dalam 2–5 hari kerja. Anda akan menerima notifikasi melalui email dan dashboard saat status klaim berubah.",
        },
      ],
    });
  };

  const handleSubmit = () => {
    const plat = form.plat.trim().toUpperCase().replace(/\s+/g, " ");
    if (!plat) {
      toast.error("Plat nomor wajib diisi");
      return;
    }
    if (!PLAT_REGEX.test(plat)) {
      toast.error("Format plat nomor tidak valid", {
        description: "Gunakan format seperti \"B 1234 ABC\".",
      });
      return;
    }
    const nextSeq = String(rows.length + 1).padStart(3, "0");
    const noKlaim = `KLM/2025/${nextSeq}`;
    const nilaiFormatted = formatRupiah(form.nilai) || "Rp 0";
    const tanggalFormatted = formatDateId(form.tanggal);
    const newRow: RecordRow = {
      id: `new-${Date.now()}`,
      cells: [noKlaim, plat, form.jenis, nilaiFormatted, tanggalFormatted],
      status: { label: "Pending", tone: "warning" },
    };
    setRows((prev) => [newRow, ...prev]);
    const receiptData = {
      noKlaim,
      plat,
      jenis: form.jenis,
      nilai: nilaiFormatted,
      tanggal: tanggalFormatted,
      kronologi: form.kronologi,
    };
    resetForm();
    setAddOpen(false);
    toast.success("Klaim berhasil diajukan", {
      description: `${noKlaim} • ${plat} sedang menunggu review. PDF tanda terima sedang diunduh.`,
      action: {
        label: "Cetak Ulang",
        onClick: () => generateReceipt(receiptData),
      },
      duration: 8000,
    });
    // Auto-download PDF receipt with claim details and date
    generateClaimReceiptPdf(receiptData).catch(() => {
      toast.error("Gagal mengunduh PDF tanda terima");
    });
    // Notify when the claim officially enters Pending status (awaiting review)
    setTimeout(() => {
      toast(`Klaim ${noKlaim} berstatus Pending`, {
        description: `${plat} • ${form.jenis} — menunggu verifikasi tim (estimasi 2–5 hari kerja).`,
        icon: <Clock className="h-4 w-4 text-warning" />,
        duration: 7000,
      });
    }, 1200);
  };

  const newestPending = rows.find((r) => r.status?.label === "Pending");

  return (
    <AppLayout title="Klaim Asuransi" breadcrumb="Beranda / Records / Klaim Asuransi">
      {newestPending && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-warning/30 bg-warning/10 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-warning/20">
              <Clock className="h-5 w-5 text-warning" />
            </div>
            <div className="text-sm">
              <p className="font-semibold text-brand-navy">
                Klaim Pending Terbaru: {newestPending.cells[0]}
              </p>
              <p className="text-muted-foreground">
                {newestPending.cells[1]} • {newestPending.cells[2]} • Diajukan {newestPending.cells[4]}
              </p>
            </div>
          </div>
          <span className="rounded-full bg-warning px-3 py-1 text-xs font-bold uppercase tracking-wide text-warning-foreground">
            {newestPending.status?.label}
          </span>
        </div>
      )}
      <RecordsTable
        title="Daftar Klaim Asuransi"
        subtitle="Pengajuan dan riwayat klaim asuransi kendaraan"
        searchPlaceholder="Cari nomor klaim..."
        columns={["No. Klaim", "Plat Nomor", "Jenis Klaim", "Nilai Klaim", "Tgl Pengajuan", "Status"]}
        rows={rows}
        showAdd
        addLabel="Ajukan Klaim"
        onAdd={() => setAddOpen(true)}
        viewTitle={(r) => `Detail Klaim ${r.cells[0]}`}
        onPrint={(r) => {
          printDocument({
            docType: "KLAIM ASURANSI",
            docNumber: String(r.cells[0]),
            sections: [
              { type: "banner", label: "Status Klaim", value: `${r.status?.label} — ${r.cells[2]}`, tone: toneFor(r.status?.label) },
              {
                type: "meta",
                left: [
                  { label: "No. Klaim", value: String(r.cells[0]) },
                  { label: "Plat Nomor", value: String(r.cells[1]) },
                  { label: "Asuransi", value: "PT Asuransi Jaya" },
                  { label: "Lokasi Kejadian", value: "Jakarta Selatan" },
                ],
                right: [
                  { label: "Jenis Klaim", value: String(r.cells[2]) },
                  { label: "Tgl Pengajuan", value: String(r.cells[4]) },
                  { label: "Polis", value: "POL-2024-998877" },
                  { label: "Nilai Klaim", value: String(r.cells[3]) },
                ],
              },
              {
                type: "table",
                headers: ["Dokumen Pendukung", "Status"],
                rows: [
                  ["Foto Kerusakan Kendaraan", "✓ Diterima"],
                  ["Laporan Polisi", "✓ Diterima"],
                  ["Fotokopi STNK & SIM", "✓ Diterima"],
                  ["Surat Pernyataan", "✓ Diterima"],
                ],
              },
              { type: "notes", title: "Kronologi:", body: "Kejadian terjadi pada saat kendaraan terparkir. Bukti foto, laporan polisi, dan dokumen pendukung telah dilampirkan untuk proses verifikasi klaim." },
            ],
          });
        }}
        renderView={(r) => (
          <div className="space-y-4">
            <div className="rounded-lg bg-gradient-to-r from-brand-navy to-brand-blue p-5 text-white">
              <p className="text-xs opacity-80">Nilai Klaim Diajukan</p>
              <p className="text-3xl font-bold">{r.cells[3]}</p>
              <p className="mt-1 text-xs">Diajukan: {r.cells[4]}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><p className="text-muted-foreground">No. Klaim</p><p className="font-semibold text-brand-navy">{r.cells[0]}</p></div>
              <div><p className="text-muted-foreground">Plat Nomor</p><p className="font-semibold text-brand-navy">{r.cells[1]}</p></div>
              <div><p className="text-muted-foreground">Jenis Klaim</p><p className="font-semibold text-brand-navy">{r.cells[2]}</p></div>
              <div><p className="text-muted-foreground">Asuransi</p><p className="font-semibold text-brand-navy">PT Asuransi Jaya</p></div>
              <div><p className="text-muted-foreground">Polis</p><p className="font-mono font-semibold text-brand-navy">POL-2024-998877</p></div>
              <div><p className="text-muted-foreground">Lokasi Kejadian</p><p className="font-semibold text-brand-navy">Jakarta Selatan</p></div>
            </div>
            <div className="rounded-lg border border-border p-4 text-sm">
              <p className="font-semibold text-brand-navy">Kronologi Singkat</p>
              <p className="mt-1 text-muted-foreground">
                Kejadian terjadi pada saat kendaraan terparkir. Bukti foto, laporan polisi, dan dokumen pendukung telah dilampirkan.
              </p>
            </div>
          </div>
        )}
      />

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle className="text-brand-navy">Ajukan Klaim Asuransi Baru</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="col-span-2">
              <label className="text-sm font-semibold text-brand-navy">Plat Nomor Kendaraan</label>
              <input
                value={form.plat}
                onChange={(e) => setForm({ ...form, plat: e.target.value })}
                maxLength={15}
                className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-brand-blue focus:outline-none"
                placeholder="B 1234 ABC"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-brand-navy">Jenis Klaim</label>
              <select
                value={form.jenis}
                onChange={(e) => setForm({ ...form, jenis: e.target.value })}
                className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              >
                <option>Kecelakaan</option>
                <option>Kehilangan</option>
                <option>Kerusakan Banjir</option>
                <option>Lainnya</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-brand-navy">Tanggal Kejadian</label>
              <input
                type="date"
                value={form.tanggal}
                onChange={(e) => setForm({ ...form, tanggal: e.target.value })}
                className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            <div className="col-span-2">
              <label className="text-sm font-semibold text-brand-navy">Estimasi Nilai Klaim</label>
              <input
                value={form.nilai}
                onChange={(e) => setForm({ ...form, nilai: formatRupiah(e.target.value) })}
                className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                placeholder="Rp ..."
              />
            </div>
            <div className="col-span-2">
              <label className="text-sm font-semibold text-brand-navy">Kronologi</label>
              <textarea
                rows={3}
                value={form.kronologi}
                onChange={(e) => setForm({ ...form, kronologi: e.target.value })}
                maxLength={1000}
                className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                placeholder="Jelaskan kronologi kejadian..."
              />
            </div>
            <div className="col-span-2">
              <label className="text-sm font-semibold text-brand-navy">Dokumen Pendukung</label>
              <div className="mt-2 flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-input p-6 text-center">
                <Upload className="h-8 w-8 text-brand-blue" />
                <p className="text-sm font-semibold text-brand-navy">Drag &amp; drop atau klik untuk upload</p>
                <p className="text-xs text-muted-foreground">PDF / JPG / PNG (maks. 10MB)</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <button onClick={() => { resetForm(); setAddOpen(false); }} className="rounded-lg border border-input px-4 py-2 text-sm font-semibold hover:bg-muted">Batal</button>
            <button onClick={handleSubmit} disabled={!form.plat.trim()} className="rounded-lg bg-brand-blue px-4 py-2 text-sm font-bold text-white hover:bg-brand-blue/90 disabled:opacity-50">Ajukan Klaim</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default KlaimAsuransi;

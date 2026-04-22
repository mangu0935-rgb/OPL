import { useState } from "react";
import { Download, Trash2, FileText, FileSpreadsheet, AlertCircle } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

const items = [
  { id: 1, name: "Invoice-April-2025.pdf", type: "pdf", size: "2.4 MB", date: "20 Apr 2025 14:32", status: "Selesai" },
  { id: 2, name: "Rekap-Pembayaran-Q1.xlsx", type: "xlsx", size: "856 KB", date: "18 Apr 2025 09:15", status: "Selesai" },
  { id: 3, name: "Kontrak-OPL-001.pdf", type: "pdf", size: "5.1 MB", date: "15 Apr 2025 11:08", status: "Selesai" },
  { id: 4, name: "Laporan-Tagihan-2024.xlsx", type: "xlsx", size: "1.2 MB", date: "10 Apr 2025 16:44", status: "Selesai" },
  { id: 5, name: "Statement-Maret.pdf", type: "pdf", size: "892 KB", date: "05 Apr 2025 08:22", status: "Selesai" },
];

const Downloads = () => {
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  return (
    <AppLayout title="Download Management" breadcrumb="Beranda / Download">
      <div className="rounded-xl border border-border bg-card shadow-sm">
        <div className="border-b border-border p-5">
          <h2 className="text-lg font-bold text-brand-navy">Riwayat Download</h2>
          <p className="text-sm text-muted-foreground">Kelola file yang telah Anda unduh dari sistem</p>
        </div>

        <div className="divide-y divide-border">
          {items.map((it) => {
            const Icon = it.type === "pdf" ? FileText : FileSpreadsheet;
            const color = it.type === "pdf" ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600";
            return (
              <div key={it.id} className="flex items-center justify-between gap-4 p-4 hover:bg-muted/30">
                <div className="flex min-w-0 items-center gap-4">
                  <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-lg ${color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-brand-navy">{it.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {it.size} • {it.date} • <span className="font-semibold text-emerald-600">{it.status}</span>
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 gap-1">
                  <button className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-brand-blue hover:bg-brand-blue/10">
                    <Download className="h-4 w-4" /> Unduh Ulang
                  </button>
                  <button onClick={() => setConfirmDelete(it.id)} className="rounded-lg p-2 text-destructive hover:bg-destructive/10" aria-label="Hapus">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Delete Confirmation Pop-Up */}
      <Dialog open={confirmDelete !== null} onOpenChange={(o) => !o && setConfirmDelete(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-red-50">
              <AlertCircle className="h-7 w-7 text-red-600" />
            </div>
            <DialogTitle className="text-center text-brand-navy">Hapus File?</DialogTitle>
          </DialogHeader>
          <p className="text-center text-sm text-muted-foreground">
            File yang dihapus tidak dapat dikembalikan. Apakah Anda yakin ingin menghapus file ini dari riwayat?
          </p>
          <DialogFooter className="!justify-center gap-2">
            <button onClick={() => setConfirmDelete(null)} className="rounded-lg border border-input px-5 py-2.5 text-sm font-semibold hover:bg-muted">
              Batal
            </button>
            <button onClick={() => setConfirmDelete(null)} className="rounded-lg bg-destructive px-5 py-2.5 text-sm font-bold text-white hover:bg-destructive/90">
              Ya, Hapus
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default Downloads;

import { useState } from "react";
import { Filter, Download, Eye, Search, Printer, FileDown } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { printInvoice } from "@/lib/printInvoice";
import { statusBadgeClass } from "@/lib/statusTone";

type Status = "Lunas" | "Pending" | "Jatuh Tempo";

const invoices: { id: string; no: string; tgl: string; jatuhTempo: string; nominal: string; status: Status }[] = [
  { id: "1", no: "INV/2025/04/001", tgl: "01 Apr 2025", jatuhTempo: "15 Apr 2025", nominal: "Rp 11.660.001", status: "Lunas" },
  { id: "2", no: "INV/2025/04/002", tgl: "03 Apr 2025", jatuhTempo: "17 Apr 2025", nominal: "Rp  8.150.000", status: "Lunas" },
  { id: "3", no: "INV/2025/04/003", tgl: "05 Apr 2025", jatuhTempo: "19 Apr 2025", nominal: "Rp 11.380.000", status: "Pending" },
  { id: "4", no: "INV/2025/04/004", tgl: "08 Apr 2025", jatuhTempo: "22 Apr 2025", nominal: "Rp  8.150.000", status: "Lunas" },
  { id: "5", no: "INV/2025/04/005", tgl: "10 Apr 2025", jatuhTempo: "24 Apr 2025", nominal: "Rp  8.500.000", status: "Jatuh Tempo" },
  { id: "6", no: "INV/2025/04/006", tgl: "12 Apr 2025", jatuhTempo: "26 Apr 2025", nominal: "Rp 14.250.000", status: "Pending" },
  { id: "7", no: "INV/2025/04/007", tgl: "14 Apr 2025", jatuhTempo: "28 Apr 2025", nominal: "Rp 45.372.546", status: "Lunas" },
];

// Status badge classes resolved centrally via @/lib/statusTone (statusBadgeClass).

const Invoices = () => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [downloadOpen, setDownloadOpen] = useState(false);
  const [viewing, setViewing] = useState<typeof invoices[0] | null>(null);

  return (
    <AppLayout title="Invoice Management" breadcrumb="Beranda / Invoice">
      <div className="rounded-xl border border-border bg-card shadow-sm">
        {/* Toolbar */}
        <div className="flex flex-col items-start justify-between gap-3 border-b border-border p-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-lg font-bold text-brand-navy">Daftar Invoice</h2>
            <p className="text-sm text-muted-foreground">Kelola dan pantau seluruh tagihan Anda</p>
          </div>
          <div className="flex w-full flex-wrap items-center gap-2 md:w-auto">
            <div className="relative flex-1 md:w-72 md:flex-initial">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input placeholder="Cari nomor invoice..." className="h-10 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm focus:border-brand-blue focus:outline-none" />
            </div>
            <button onClick={() => setFilterOpen(true)} className="inline-flex h-10 items-center gap-2 rounded-lg border border-input bg-background px-4 text-sm font-semibold text-brand-navy hover:bg-muted">
              <Filter className="h-4 w-4" /> Filter
            </button>
            <button onClick={() => setDownloadOpen(true)} className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand-blue px-4 text-sm font-bold text-white hover:bg-brand-blue/90">
              <Download className="h-4 w-4" /> Download
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="table-premium w-full text-sm">
            <thead className="text-left">
              <tr>
                <th className="px-4 py-3 font-semibold">No. Invoice</th>
                <th className="px-4 py-3 font-semibold">Tgl Terbit</th>
                <th className="px-4 py-3 font-semibold">Jatuh Tempo</th>
                <th className="px-4 py-3 font-semibold">Nominal</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 text-right font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {invoices.map((inv) => (
                <tr key={inv.id}>
                  <td className="px-4 py-3 font-mono font-semibold text-brand-navy">{inv.no}</td>
                  <td className="px-4 py-3 text-muted-foreground">{inv.tgl}</td>
                  <td className="px-4 py-3 text-muted-foreground">{inv.jatuhTempo}</td>
                  <td className="px-4 py-3 font-bold text-brand-navy">{inv.nominal}</td>
                  <td className="px-4 py-3">
                    <span className={`pill ${statusBadgeClass(inv.status)}`}>
                      <span className="pill-dot" /> {inv.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button onClick={() => setViewing(inv)} className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-brand-blue hover:bg-brand-blue/10">
                        <Eye className="h-4 w-4" /> Lihat
                      </button>
                      <button onClick={() => printInvoice(inv)} className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-brand-navy hover:bg-muted" aria-label="Cetak">
                        <Printer className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-border p-4 text-sm text-muted-foreground">
          <span>Menampilkan 1–7 dari 24 invoice</span>
          <div className="flex gap-1">
            <button className="rounded-md border border-input px-3 py-1 hover:bg-muted">‹</button>
            <button className="rounded-md bg-brand-blue px-3 py-1 font-bold text-white">1</button>
            <button className="rounded-md border border-input px-3 py-1 hover:bg-muted">2</button>
            <button className="rounded-md border border-input px-3 py-1 hover:bg-muted">3</button>
            <button className="rounded-md border border-input px-3 py-1 hover:bg-muted">›</button>
          </div>
        </div>
      </div>

      {/* Filter Modal */}
      <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle className="text-brand-navy">Filter Invoice</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-brand-navy">Status</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {(["Semua", "Lunas", "Pending", "Jatuh Tempo"] as const).map((s) => (
                  <label key={s} className="flex items-center gap-2 rounded-lg border border-input px-3 py-2 text-sm hover:bg-muted">
                    <input type="checkbox" defaultChecked={s === "Semua"} className="h-4 w-4" />
                    {s}
                  </label>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-semibold text-brand-navy">Dari Tanggal</label>
                <input type="date" className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="text-sm font-semibold text-brand-navy">Sampai Tanggal</label>
                <input type="date" className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-brand-navy">Rentang Nominal</label>
              <div className="mt-2 grid grid-cols-2 gap-3">
                <input placeholder="Min Rp" className="rounded-lg border border-input bg-background px-3 py-2 text-sm" />
                <input placeholder="Max Rp" className="rounded-lg border border-input bg-background px-3 py-2 text-sm" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <button onClick={() => setFilterOpen(false)} className="rounded-lg border border-input px-4 py-2 text-sm font-semibold hover:bg-muted">Reset</button>
            <button onClick={() => setFilterOpen(false)} className="rounded-lg bg-brand-blue px-4 py-2 text-sm font-bold text-white hover:bg-brand-blue/90">Terapkan</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Download Modal */}
      <Dialog open={downloadOpen} onOpenChange={setDownloadOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="text-brand-navy">Download Invoice</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Pilih format file untuk mengunduh data invoice yang ditampilkan.</p>
          <div className="mt-2 grid grid-cols-2 gap-3">
            <button data-testid="download-excel" className="btn-format-light">
              <FileDown className="h-8 w-8 text-brand-blue" />
              <span>Excel (.xlsx)</span>
            </button>
            <button data-testid="download-pdf" className="btn-format-light">
              <Printer className="h-8 w-8 text-brand-blue" />
              <span>PDF (.pdf)</span>
            </button>
          </div>
          <DialogFooter>
            <button onClick={() => setDownloadOpen(false)} className="rounded-lg border border-input px-4 py-2 text-sm font-semibold hover:bg-muted">Batal</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Invoice Modal */}
      <Dialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-brand-navy">Detail Invoice {viewing?.no}</DialogTitle>
          </DialogHeader>
          {viewing && (
            <div className="space-y-4">
              <div className="rounded-lg bg-gradient-to-r from-brand-navy to-brand-blue p-5 text-white">
                <p className="text-xs opacity-80">Total Tagihan</p>
                <p className="text-3xl font-bold">{viewing.nominal}</p>
                <p className="mt-1 text-xs">Jatuh tempo: {viewing.jatuhTempo}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><p className="text-muted-foreground">Nomor Invoice</p><p className="font-semibold text-brand-navy">{viewing.no}</p></div>
                <div><p className="text-muted-foreground">Tanggal Terbit</p><p className="font-semibold text-brand-navy">{viewing.tgl}</p></div>
                <div><p className="text-muted-foreground">Jatuh Tempo</p><p className="font-semibold text-brand-navy">{viewing.jatuhTempo}</p></div>
                <div><p className="text-muted-foreground">Status</p>
                  <span className={`pill mt-1 ${statusBadgeClass(viewing.status)}`}><span className="pill-dot" /> {viewing.status}</span>
                </div>
              </div>
              <div className="rounded-lg border border-border">
                <table className="table-premium w-full text-sm">
                  <thead className="text-left">
                    <tr><th className="px-3 py-2 font-semibold">Deskripsi</th><th className="px-3 py-2 text-right font-semibold">Subtotal</th></tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr><td className="px-3 py-2">Cicilan Bulanan</td><td className="px-3 py-2 text-right font-semibold">Rp 11.250.000</td></tr>
                    <tr><td className="px-3 py-2">Biaya Admin</td><td className="px-3 py-2 text-right font-semibold">Rp    250.000</td></tr>
                    <tr><td className="px-3 py-2">PPN 11%</td><td className="px-3 py-2 text-right font-semibold">Rp  1.000.000</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
          <DialogFooter>
            <button onClick={() => viewing && printInvoice(viewing)} className="inline-flex items-center gap-2 rounded-lg border border-input px-4 py-2 text-sm font-semibold hover:bg-muted">
              <Printer className="h-4 w-4" /> Cetak
            </button>
            <button onClick={() => viewing && printInvoice(viewing)} className="inline-flex items-center gap-2 rounded-lg bg-brand-blue px-4 py-2 text-sm font-bold text-white hover:bg-brand-blue/90">
              <Download className="h-4 w-4" /> Download PDF
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default Invoices;

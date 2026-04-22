import { ReactNode, useState } from "react";
import { Search, Download, Eye, Plus, FileDown, Printer, SlidersHorizontal } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { statusBadgeClass, statusLabel } from "@/lib/statusTone";

const todayId = () =>
  new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });

export type RecordRow = {
  id: string;
  cells: (string | ReactNode)[];
  status?: { label: string; tone: "success" | "warning" | "danger" | "info" };
};

export type RecordsTableProps = {
  title: string;
  subtitle: string;
  searchPlaceholder?: string;
  columns: string[];
  rows: RecordRow[];
  showAdd?: boolean;
  addLabel?: string;
  onAdd?: () => void;
  renderView: (row: RecordRow) => ReactNode;
  viewTitle: (row: RecordRow) => string;
  /** Optional callback yang dipakai sebagian halaman (mis. KlaimAsuransi) untuk handler print row. */
  onPrint?: (row: RecordRow) => void;
  valueRangeLabel?: string;
  statusOptions?: string[];
};

// Class mapping handled centrally in @/lib/statusTone (statusBadgeClass).

export const RecordsTable = ({
  title,
  subtitle,
  searchPlaceholder = "Cari...",
  columns,
  rows,
  showAdd = false,
  addLabel = "Tambah",
  onAdd,
  renderView,
  viewTitle,
  valueRangeLabel = "Nominal",
  statusOptions,
}: RecordsTableProps) => {
  const [downloadOpen, setDownloadOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [viewing, setViewing] = useState<RecordRow | null>(null);
  const [requestRow, setRequestRow] = useState<RecordRow | null>(null);
  const [requestSent, setRequestSent] = useState(false);

  const derivedStatuses = Array.from(
    new Set(rows.map((r) => r.status?.label).filter(Boolean) as string[])
  );
  const statuses = statusOptions ?? derivedStatuses;

  return (
    <>
      <span className="print-date" aria-hidden="true">{todayId()}</span>
      <div className="card-premium" data-print-section>
        <div className="flex flex-col items-start justify-between gap-3 border-b border-border/70 bg-gradient-to-b from-card to-surface-muted/40 p-5 md:flex-row md:items-center">
          <div>
            <h2 className="section-title text-lg">{title}</h2>
            <p className="mt-1 pl-3.5 text-sm text-muted-foreground">{subtitle}</p>
          </div>
          <div className="no-print flex w-full flex-wrap items-center gap-2 md:w-auto">
            <div className="relative flex-1 md:w-72 md:flex-initial">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                placeholder={searchPlaceholder}
                className="input-premium pl-9"
              />
            </div>
            {showAdd && (
              <button onClick={onAdd} className="btn-ghost-premium h-10">
                <Plus className="h-4 w-4" /> {addLabel}
              </button>
            )}
            <button onClick={() => setFilterOpen(true)} className="btn-ghost-premium h-10">
              <SlidersHorizontal className="h-4 w-4" /> Filter
            </button>
            <button onClick={() => setDownloadOpen(true)} className="btn-premium h-10">
              <Download className="h-4 w-4" /> Request Download
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="table-premium w-full text-sm">
            <thead className="text-left">
              <tr>
                {columns.map((c) => (
                  <th key={c} className="px-4 py-3.5 first:pl-5">{c}</th>
                ))}
                <th className="print-actions-col px-4 py-3.5 pr-5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {rows.map((row) => (
                <tr key={row.id}>
                  {row.cells.map((cell, i) => (
                    <td key={i} className="px-4 py-3.5 text-brand-navy first:pl-5 first:font-semibold">{cell}</td>
                  ))}
                  {row.status && (
                    <td className="px-4 py-3.5">
                      <span
                        className={`pill ${statusBadgeClass(row.status.label)}`}
                        title={statusLabel(row.status.label)}
                      >
                        <span className="pill-dot" /> {statusLabel(row.status.label)}
                      </span>
                    </td>
                  )}
                  <td className="print-actions-col px-4 py-3.5 pr-5 text-right">
                    <button onClick={() => setViewing(row)} className="row-action-btn">
                      <Eye className="h-3.5 w-3.5" /> Lihat
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="print-pagination no-print flex items-center justify-between border-t border-border/70 bg-gradient-to-b from-surface-muted/40 to-card px-5 py-3.5 text-sm text-muted-foreground">
          <span>Menampilkan <span className="font-semibold text-brand-navy">1–{rows.length}</span> dari <span className="font-semibold text-brand-navy">{rows.length}</span> data</span>
          <div className="flex gap-1.5">
            <button className="grid h-8 w-8 place-items-center rounded-lg border border-input bg-card text-muted-foreground transition-all hover:border-brand-blue/40 hover:text-brand-blue">‹</button>
            <button className="grid h-8 min-w-8 place-items-center rounded-lg bg-brand-blue px-2.5 font-bold text-white shadow-sm">1</button>
            <button className="grid h-8 w-8 place-items-center rounded-lg border border-input bg-card text-muted-foreground transition-all hover:border-brand-blue/40 hover:text-brand-blue">›</button>
          </div>
        </div>
      </div>

      <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle className="text-brand-navy">Filter {title}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            {statuses.length > 0 && (
              <div>
                <label className="text-sm font-semibold text-brand-navy">Status</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-input px-3 py-2 text-sm hover:bg-muted">
                    <input type="checkbox" defaultChecked className="h-4 w-4" />
                    <span className="pill bg-slate-100 text-slate-700 ring-slate-200/80">
                      <span className="pill-dot" /> Semua
                    </span>
                  </label>
                  {statuses.map((s) => (
                    <label key={s} className="flex cursor-pointer items-center gap-2 rounded-lg border border-input px-3 py-2 text-sm hover:bg-muted">
                      <input type="checkbox" className="h-4 w-4" />
                      <span className={`pill ${statusBadgeClass(s)}`}>
                        <span className="pill-dot" /> {s}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}
            <div>
              <label className="text-sm font-semibold text-brand-navy">Periode</label>
              <div className="mt-2 grid grid-cols-2 gap-3">
                <div>
                  <p className="mb-1 text-xs text-muted-foreground">Dari Tanggal</p>
                  <input type="date" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
                </div>
                <div>
                  <p className="mb-1 text-xs text-muted-foreground">Sampai Tanggal</p>
                  <input type="date" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
                </div>
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-brand-navy">Rentang {valueRangeLabel}</label>
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

      <Dialog open={downloadOpen} onOpenChange={setDownloadOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="text-brand-navy">Request Download</DialogTitle></DialogHeader>
          <div className="flex flex-col items-center gap-3 py-2 text-center">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-brand-blue/10">
              <Download className="h-7 w-7 text-brand-blue" />
            </div>
            <p className="text-base font-bold text-brand-navy">Permintaan download akan diproses</p>
            <p className="text-sm text-muted-foreground">
              File akan tersedia di menu <span className="font-semibold text-brand-navy">Download Management</span> setelah selesai diproses.
            </p>
            <div className="mt-2 grid w-full grid-cols-2 gap-3">
              <button className="flex flex-col items-center gap-2 rounded-lg border border-input p-4 hover:border-brand-blue hover:bg-brand-blue/5">
                <FileDown className="h-7 w-7 text-brand-blue" />
                <span className="text-sm font-bold text-brand-navy">Excel (.xlsx)</span>
              </button>
              <button className="flex flex-col items-center gap-2 rounded-lg border border-input p-4 hover:border-brand-blue hover:bg-brand-blue/5">
                <Printer className="h-7 w-7 text-brand-blue" />
                <span className="text-sm font-bold text-brand-navy">PDF (.pdf)</span>
              </button>
            </div>
          </div>
          <DialogFooter>
            <button onClick={() => setDownloadOpen(false)} className="rounded-lg border border-input px-4 py-2 text-sm font-semibold hover:bg-muted">Batal</button>
            <button onClick={() => setDownloadOpen(false)} className="rounded-lg bg-brand-blue px-4 py-2 text-sm font-bold text-white hover:bg-brand-blue/90">Kirim Request</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-brand-navy">{viewing && viewTitle(viewing)}</DialogTitle>
          </DialogHeader>
          {viewing && renderView(viewing)}
          <DialogFooter>
            <button onClick={() => setViewing(null)} className="rounded-lg border border-input px-4 py-2 text-sm font-semibold hover:bg-muted">Tutup</button>
            <button
              onClick={() => {
                if (viewing) {
                  setRequestRow(viewing);
                  setRequestSent(false);
                  setViewing(null);
                }
              }}
              className="inline-flex items-center gap-2 rounded-lg bg-brand-blue px-4 py-2 text-sm font-bold text-white hover:bg-brand-blue/90"
            >
              <Download className="h-4 w-4" /> Download
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Per-item download request */}
      <Dialog
        open={!!requestRow}
        onOpenChange={(o) => {
          if (!o) {
            setRequestRow(null);
            setRequestSent(false);
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-brand-navy">
              {requestSent ? "Permintaan Terkirim" : "Request Download Data"}
            </DialogTitle>
          </DialogHeader>
          {!requestSent ? (
            <div className="flex flex-col items-center gap-3 py-2 text-center">
              <div className="grid h-14 w-14 place-items-center rounded-full bg-brand-blue/10">
                <Download className="h-7 w-7 text-brand-blue" />
              </div>
              <p className="text-base font-bold text-brand-navy">
                {requestRow && viewTitle(requestRow)}
              </p>
              <p className="text-sm text-muted-foreground">
                Pilih format file untuk data yang Anda minta. File akan tersedia di menu{" "}
                <span className="font-semibold text-brand-navy">Download Management</span> setelah selesai diproses.
              </p>
              <div className="mt-2 grid w-full grid-cols-2 gap-3">
                <button
                  onClick={() => setRequestSent(true)}
                  className="flex flex-col items-center gap-2 rounded-lg border border-input p-4 hover:border-brand-blue hover:bg-brand-blue/5"
                >
                  <FileDown className="h-7 w-7 text-brand-blue" />
                  <span className="text-sm font-bold text-brand-navy">Excel (.xlsx)</span>
                </button>
                <button
                  onClick={() => setRequestSent(true)}
                  className="flex flex-col items-center gap-2 rounded-lg border border-input p-4 hover:border-brand-blue hover:bg-brand-blue/5"
                >
                  <Printer className="h-7 w-7 text-brand-blue" />
                  <span className="text-sm font-bold text-brand-navy">PDF (.pdf)</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 py-4 text-center">
              <div className="grid h-14 w-14 place-items-center rounded-full bg-emerald-100">
                <Download className="h-7 w-7 text-emerald-600" />
              </div>
              <p className="text-base font-bold text-brand-navy">Permintaan berhasil dikirim</p>
              <p className="text-sm text-muted-foreground">
                Data <span className="font-semibold text-brand-navy">{requestRow && viewTitle(requestRow)}</span> sedang diproses.
                Cek menu <span className="font-semibold text-brand-navy">Download Management</span> untuk mengunduh file ketika sudah siap.
              </p>
            </div>
          )}
          <DialogFooter>
            <button
              onClick={() => {
                setRequestRow(null);
                setRequestSent(false);
              }}
              className="rounded-lg border border-input px-4 py-2 text-sm font-semibold hover:bg-muted"
            >
              {requestSent ? "Tutup" : "Batal"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

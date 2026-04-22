import { getLogoUrl } from "./printAssets";

export type PrintInvoiceData = {
  no: string;
  tgl: string;
  jatuhTempo: string;
  nominal: string;
  status: string;
};

export function printInvoice(inv: PrintInvoiceData) {
  const w = window.open("", "_blank", "width=900,height=1000");
  if (!w) return;

  const logoUrl = getLogoUrl();
  const isLunas = inv.status === "Lunas";
  const wmText = isLunas ? "LUNAS" : "BELUM DIBAYAR";
  const wmColor = isLunas ? "#047857" : "#b91c1c";

  const html = `<!doctype html>
<html lang="id" data-theme="light">
<head>
<meta charset="utf-8" />
<meta name="color-scheme" content="light only" />
<title>Invoice ${inv.no}</title>
<style>
  /* Force light scheme regardless of OS / browser dark mode */
  :root { color-scheme: light only; }
  @page { size: A4; margin: 18mm; }
  * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; forced-color-adjust: none; }
  html, body { margin: 0; padding: 0; background: #ffffff !important; color-scheme: light; }
  body { font-family: -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #0f1f3d; padding: 24px; }
  .sheet { max-width: 780px; margin: 0 auto; background: #fff; padding: 36px; border-radius: 8px; box-shadow: 0 4px 24px rgba(0,0,0,.06); position: relative; overflow: hidden; isolation: isolate; }
  .watermark { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); pointer-events: none; z-index: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 18px; }
  .watermark img { width: 320px; max-width: 50vw; opacity: 0.06; transform: rotate(-22deg); filter: grayscale(100%); display: block; }
  .watermark .stamp { font-family: -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; font-weight: 900; font-size: 84px; letter-spacing: 8px; color: ${wmColor}; opacity: 0.15; border: 8px solid ${wmColor}; padding: 14px 36px; border-radius: 14px; transform: rotate(-22deg); white-space: nowrap; }
  .sheet > *:not(.watermark) { position: relative; z-index: 2; }
  .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #0f1f3d; padding-bottom: 18px; margin-bottom: 24px; break-inside: avoid-page; page-break-inside: avoid; gap: 16px; }
  .brand { display: flex; align-items: center; gap: 12px; min-width: 0; }
  .brand img { height: 44px; width: auto; max-width: 180px; object-fit: contain; display: block; flex-shrink: 0; }
  .brand .brand-text { font-weight: 700; font-size: 10px; color: #5a6781; letter-spacing: 2px; }
  .doc-title { text-align: right; }
  .doc-title h1 { margin: 0; font-size: 26px; letter-spacing: 4px; color: #0f1f3d; }
  .doc-title p { margin: 4px 0 0; font-size: 12px; color: #5a6781; }
  .doc-section { margin-bottom: 20px; break-inside: avoid-page; page-break-inside: avoid; }
  .meta { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; font-size: 13px; }
  .meta .label { color: #5a6781; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
  .meta .val { font-weight: 700; }
  .badge { display: inline-block; padding: 4px 10px; border-radius: 999px; font-size: 11px; font-weight: 700; }
  .b-lunas { background: #ecfdf5; color: #047857; }
  .b-pending { background: #fffbeb; color: #b45309; }
  .b-tempo { background: #fef2f2; color: #b91c1c; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  thead { display: table-header-group; }
  thead th { background: #0f1f3d; color: #fff; text-align: left; padding: 10px 12px; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; }
  thead th:last-child { text-align: right; }
  tbody td { padding: 10px 12px; border-bottom: 1px solid #e5e7eb; }
  tbody td:last-child { text-align: right; font-weight: 600; }
  tr, td, th, tfoot { break-inside: avoid-page; page-break-inside: avoid; }
  tfoot td { padding: 10px 12px; font-weight: 700; }
  tfoot tr.total td { background: #0f1f3d; color: #fff; font-size: 15px; }
  tfoot tr.total td:last-child { text-align: right; }
  .notes { font-size: 11px; color: #5a6781; border-top: 1px dashed #cbd5e1; padding-top: 16px; line-height: 1.6; }
  .signature { display: flex; justify-content: space-between; margin-top: 36px; font-size: 12px; break-inside: avoid-page; page-break-inside: avoid; }
  .signature div { text-align: center; width: 200px; }
  .signature .line { margin-top: 60px; border-top: 1px solid #0f1f3d; padding-top: 6px; font-weight: 700; }
  .actions { max-width: 780px; margin: 16px auto 0; display: flex; gap: 8px; justify-content: flex-end; }
  .actions button { padding: 10px 18px; border-radius: 6px; border: 0; cursor: pointer; font-weight: 700; font-size: 13px; }
  .btn-print { background: #1a56db; color: #fff; }
  .btn-close { background: #e5e7eb; color: #0f1f3d; }
  @media print {
    body { padding: 0; background: #fff !important; }
    .sheet { box-shadow: none; padding: 0; max-width: none; overflow: visible; background: #fff !important; }
    .actions { display: none !important; }
    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
  }

  /* Hard override against OS dark mode — output must always be light */
  @media (prefers-color-scheme: dark) {
    html, body { background: #fff !important; color: #0f1f3d !important; }
    .sheet { background: #fff !important; color: #0f1f3d !important; }
    thead th, tfoot tr.total td { background: #0f1f3d !important; color: #fff !important; }
    tbody td { background: #fff !important; color: #0f1f3d !important; }
    .notes { color: #5a6781 !important; background: transparent !important; }
    .b-lunas { background: #ecfdf5 !important; color: #047857 !important; }
    .b-pending { background: #fffbeb !important; color: #b45309 !important; }
    .b-tempo { background: #fef2f2 !important; color: #b91c1c !important; }
  }
</style>
</head>
<body>
  <div class="sheet">
    <div class="watermark"><img src="${logoUrl}" alt="" /><div class="stamp">${wmText}</div></div>
    <div class="header">
      <div class="brand">
        <img src="${logoUrl}" alt="BRI Finance" />
        <span class="brand-text">OPL TERPADU</span>
      </div>
      <div class="doc-title">
        <h1>INVOICE</h1>
        <p>${inv.no}</p>
      </div>
    </div>

    <section class="doc-section">
      <div class="meta">
        <div>
          <div class="label">Ditagihkan Kepada</div>
          <div class="val">PT Maju Sentosa</div>
          <div style="font-size:12px;color:#5a6781;margin-top:2px;">Jl. Sudirman Kav. 45, Jakarta Selatan</div>
        </div>
        <div style="text-align:right;">
          <div class="label">Tanggal Terbit</div>
          <div class="val">${inv.tgl}</div>
          <div class="label" style="margin-top:10px;">Jatuh Tempo</div>
          <div class="val">${inv.jatuhTempo}</div>
          <div style="margin-top:10px;">
            <span class="badge ${inv.status === "Lunas" ? "b-lunas" : inv.status === "Pending" ? "b-pending" : "b-tempo"}">${inv.status}</span>
          </div>
        </div>
      </div>
    </section>

    <section class="doc-section">
      <table>
        <thead>
          <tr><th style="width:60px;">No.</th><th>Deskripsi</th><th style="width:140px;">Subtotal</th></tr>
        </thead>
        <tbody>
          <tr><td>1</td><td>Cicilan Bulanan</td><td>Rp 11.250.000</td></tr>
          <tr><td>2</td><td>Biaya Admin</td><td>Rp 250.000</td></tr>
          <tr><td>3</td><td>PPN 11%</td><td>Rp 1.000.000</td></tr>
        </tbody>
        <tfoot>
          <tr class="total"><td colspan="2">TOTAL TAGIHAN</td><td>${inv.nominal}</td></tr>
        </tfoot>
      </table>
    </section>

    <section class="doc-section">
      <div class="notes">
        <strong>Catatan Pembayaran:</strong><br/>
        Mohon lakukan pembayaran sebelum tanggal jatuh tempo ke rekening BRI Finance an. PT BRI Multifinance Indonesia, No. Rek 0123-4567-8901. Sertakan nomor invoice pada keterangan transfer.
      </div>
    </section>

    <div class="signature">
      <div><div class="line">Penerima</div></div>
      <div><div class="line">BRI Finance</div></div>
    </div>
  </div>

  <div class="actions">
    <button class="btn-close" onclick="window.close()">Tutup</button>
    <button class="btn-print" onclick="window.print()">Cetak / Simpan PDF</button>
  </div>

  <script>window.addEventListener('load', () => setTimeout(() => window.print(), 400));</script>
</body>
</html>`;

  w.document.write(html);
  w.document.close();
}

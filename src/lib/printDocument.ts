import { getLogoUrl } from "./printAssets";

export type DocSection =
  | { type: "meta"; left: { label: string; value: string }[]; right: { label: string; value: string }[] }
  | { type: "banner"; label: string; value: string; tone?: "success" | "warning" | "danger" | "info" }
  | { type: "table"; headers: string[]; rows: string[][]; total?: { label: string; value: string } }
  | { type: "notes"; title: string; body: string };

export type PrintDoc = {
  docType: string;
  docNumber: string;
  sections: DocSection[];
};

const toneColor = {
  success: { bg: "#ecfdf5", border: "#a7f3d0", text: "#047857" },
  warning: { bg: "#fffbeb", border: "#fcd34d", text: "#b45309" },
  danger: { bg: "#fef2f2", border: "#fecaca", text: "#b91c1c" },
  info: { bg: "#eff6ff", border: "#bfdbfe", text: "#1d4ed8" },
} as const;

const renderSection = (section: DocSection) => {
  if (section.type === "banner") {
    const c = toneColor[section.tone ?? "success"];
    return `<section class="doc-section doc-section-banner">
      <div class="banner" style="background:${c.bg};border:2px solid ${c.border};color:${c.text};">
        <div class="banner-label">${section.label}</div>
        <div class="banner-value">${section.value}</div>
      </div>
    </section>`;
  }

  if (section.type === "meta") {
    const col = (items: { label: string; value: string }[]) =>
      items.map((item) => `<div><div class="label">${item.label}</div><div class="val">${item.value}</div></div>`).join("");

    return `<section class="doc-section doc-section-meta">
      <div class="meta-grid">
        <div class="meta-col">${col(section.left)}</div>
        <div class="meta-col" style="text-align:right;">${col(section.right)}</div>
      </div>
    </section>`;
  }

  if (section.type === "table") {
    const head = section.headers
      .map((header, index) => `<th${index === section.headers.length - 1 ? ' style="text-align:right;"' : ""}>${header}</th>`)
      .join("");

    const body = section.rows
      .map(
        (row) =>
          `<tr>${row
            .map((cell, index) => `<td${index === row.length - 1 ? ' style="text-align:right;font-weight:600;"' : ""}>${cell}</td>`)
            .join("")}</tr>`
      )
      .join("");

    const foot = section.total
      ? `<tfoot><tr class="total"><td colspan="${section.headers.length - 1}">${section.total.label}</td><td>${section.total.value}</td></tr></tfoot>`
      : "";

    return `<section class="doc-section doc-section-table">
      <table>
        <thead><tr>${head}</tr></thead>
        <tbody>${body}</tbody>
        ${foot}
      </table>
    </section>`;
  }

  return `<section class="doc-section doc-section-notes">
    <div class="notes"><strong>${section.title}</strong><br/>${section.body}</div>
  </section>`;
};

export function printDocument(doc: PrintDoc) {
  const w = window.open("", "_blank", "width=900,height=1000");
  if (!w) return;

  const logoUrl = getLogoUrl();
  const sectionsHtml = doc.sections.map(renderSection).join("");

  const now = new Date();
  const dateStr = now.toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });

  const html = `<!doctype html>
<html lang="id" data-theme="light"><head><meta charset="utf-8"/>
<meta name="color-scheme" content="light only" />
<title>${doc.docType} ${doc.docNumber}</title>
<style>
  /* Force light scheme regardless of OS / browser dark mode */
  :root { color-scheme: light only; }
  @page { size: A4; margin: 16mm 14mm 18mm 14mm; }
  * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; forced-color-adjust: none; }
  html, body { margin: 0; padding: 0; background: #f4f6fb !important; color-scheme: light; }
  body { font-family: -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #0f1f3d; padding: 24px; position: relative; }

  /* Watermark — fixed so it repeats on every printed page */
  .wm { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 0; pointer-events: none; }
  .wm img { width: 320px; max-width: 50vw; opacity: 0.05; transform: rotate(-22deg); filter: grayscale(100%); display: block; }

  .sheet { max-width: 780px; margin: 0 auto; background: #fff; padding: 28px 32px 32px; border-radius: 10px; box-shadow: 0 8px 28px rgba(15,31,61,.08); position: relative; z-index: 1; }

  /* Header */
  .header { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; padding-bottom: 14px; margin-bottom: 18px; border-bottom: 2px solid #0f1f3d; }
  .brand { display: flex; align-items: center; gap: 12px; min-width: 0; }
  .brand img { height: 38px; width: auto; max-width: 160px; object-fit: contain; display: block; flex-shrink: 0; }
  .brand-text { font-weight: 700; font-size: 9px; color: #5a6781; letter-spacing: 2px; }
  .doc-title { text-align: right; }
  .doc-title h1 { margin: 0; font-size: 17px; letter-spacing: 1.5px; color: #0f1f3d; text-transform: uppercase; font-weight: 800; }
  .doc-title p { margin: 3px 0 0; font-size: 10px; color: #5a6781; font-weight: 600; }
  .doc-title .date { color: #8a96b0; font-size: 9px; margin-top: 2px; }

  /* Sections */
  .doc-section { margin-bottom: 12px; break-inside: avoid; page-break-inside: avoid; }
  .doc-section-banner .banner { padding: 10px 14px; border-radius: 6px; border-left-width: 4px !important; }
  .banner-label { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; opacity: .85; }
  .banner-value { font-size: 14px; font-weight: 800; margin-top: 2px; }

  .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; font-size: 11px; background: #f8fafc; border: 1px solid #e5e7eb; border-radius: 6px; padding: 12px 14px; }
  .meta-col > div { margin-bottom: 6px; }
  .meta-col > div:last-child { margin-bottom: 0; }
  .label { color: #5a6781; font-size: 8.5px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 1px; font-weight: 600; }
  .val { font-weight: 700; font-size: 11.5px; color: #0f1f3d; }

  table { width: 100%; border-collapse: collapse; font-size: 11px; border-radius: 6px; overflow: hidden; }
  thead { display: table-header-group; }
  thead th { background: #0f1f3d; color: #fff; text-align: left; padding: 8px 10px; font-size: 9.5px; text-transform: uppercase; letter-spacing: .8px; font-weight: 700; }
  tbody td { padding: 7px 10px; border-bottom: 1px solid #eef0f4; }
  tbody tr:nth-child(even) td { background: #fafbfd; }
  tr, td, th, tfoot { break-inside: avoid; page-break-inside: avoid; }
  tfoot tr.total td { background: #0f1f3d; color: #fff; padding: 9px 10px; font-weight: 700; font-size: 11.5px; }
  tfoot tr.total td:last-child { text-align: right; }

  .notes { font-size: 10px; color: #475569; background: #fffbeb; border: 1px solid #fde68a; border-left: 4px solid #f59e0b; padding: 10px 12px; border-radius: 6px; line-height: 1.55; }
  .notes strong { color: #92400e; display: block; margin-bottom: 3px; font-size: 10.5px; }

  .signature { display: flex; justify-content: space-between; margin-top: 24px; font-size: 10px; gap: 24px; break-inside: avoid; page-break-inside: avoid; }
  .signature div { text-align: center; flex: 1; }
  .signature .line { margin-top: 48px; border-top: 1px solid #0f1f3d; padding-top: 4px; font-weight: 700; font-size: 10.5px; }

  .footer-note { margin-top: 18px; padding-top: 10px; border-top: 1px dashed #cbd5e1; text-align: center; font-size: 8.5px; color: #94a3b8; letter-spacing: .5px; }

  .actions { max-width: 780px; margin: 14px auto 0; display: flex; gap: 8px; justify-content: flex-end; position: relative; z-index: 2; }
  .actions button { padding: 9px 16px; border-radius: 6px; border: 0; cursor: pointer; font-weight: 700; font-size: 12px; }
  .btn-print { background: #1a56db; color: #fff; }
  .btn-close { background: #e5e7eb; color: #0f1f3d; }

  @media print {
    html, body { background: #fff !important; padding: 0; }
    .sheet { box-shadow: none; padding: 0; max-width: none; border-radius: 0; background: #fff !important; }
    .actions { display: none !important; }
    .wm { position: fixed; }
  }

  /* Hard override against OS dark mode — output must always be light */
  @media (prefers-color-scheme: dark) {
    html, body { background: #f4f6fb !important; color: #0f1f3d !important; }
    .sheet { background: #fff !important; color: #0f1f3d !important; }
    .meta-grid { background: #f8fafc !important; color: #0f1f3d !important; }
    thead th, tfoot tr.total td { background: #0f1f3d !important; color: #fff !important; }
    tbody td { background: #fff !important; color: #0f1f3d !important; }
    tbody tr:nth-child(even) td { background: #fafbfd !important; }
    .notes { background: #fffbeb !important; color: #475569 !important; }
  }
</style></head>
<body>
  <div class="wm"><img src="${logoUrl}" alt="" /></div>
  <div class="sheet">
    <div class="header">
      <div class="brand">
        <img src="${logoUrl}" alt="BRI Finance" />
        <div>
          <div style="font-weight:800;font-size:13px;color:#0f1f3d;letter-spacing:.3px;">BRI Finance</div>
          <div class="brand-text">OPL TERPADU</div>
        </div>
      </div>
      <div class="doc-title">
        <h1>${doc.docType}</h1>
        <p>${doc.docNumber}</p>
        <div class="date">Diterbitkan: ${dateStr}</div>
      </div>
    </div>
    ${sectionsHtml}
    <div class="signature">
      <div><div class="line">Penerima</div></div>
      <div><div class="line">BRI Finance</div></div>
    </div>
    <div class="footer-note">Dokumen resmi BRI Finance — OPL Terpadu • Dicetak otomatis ${dateStr}</div>
  </div>
  <div class="actions">
    <button class="btn-close" onclick="window.close()">Tutup</button>
    <button class="btn-print" onclick="window.print()">Cetak / Simpan PDF</button>
  </div>
  <script>window.addEventListener('load', () => setTimeout(() => window.print(), 500));</script>
</body></html>`;

  w.document.write(html);
  w.document.close();
}

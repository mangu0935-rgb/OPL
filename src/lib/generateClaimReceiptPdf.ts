import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logoUrl from "@/assets/bri-finance-logo.png";

export type ClaimReceiptData = {
  noKlaim: string;
  plat: string;
  jenis: string;
  nilai: string;
  tanggal: string;
  kronologi: string;
};

const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

export async function generateClaimReceiptPdf(data: ClaimReceiptData) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  const now = new Date();
  const dateStr = now.toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });
  const timeStr = now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

  // Watermark
  try {
    const img = await loadImage(logoUrl);
    const wmW = 120;
    const ratio = img.height / img.width;
    const wmH = wmW * ratio;
    // @ts-expect-error - GState supported at runtime
    doc.setGState(new doc.GState({ opacity: 0.08 }));
    doc.addImage(img, "PNG", (pageW - wmW) / 2, (pageH - wmH) / 2, wmW, wmH);
    // @ts-expect-error - reset opacity
    doc.setGState(new doc.GState({ opacity: 1 }));

    // Header logo
    doc.addImage(img, "PNG", 18, 14, 28, 28 * ratio);
  } catch {
    /* ignore */
  }

  // Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(90, 103, 129);
  doc.text("OPL TERPADU", 50, 22);

  doc.setFontSize(16);
  doc.setTextColor(15, 31, 61);
  doc.text("TANDA TERIMA PENGAJUAN KLAIM", pageW - 18, 20, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(90, 103, 129);
  doc.text(data.noKlaim, pageW - 18, 27, { align: "right" });

  doc.setDrawColor(15, 31, 61);
  doc.setLineWidth(0.8);
  doc.line(18, 36, pageW - 18, 36);

  // Status banner
  doc.setFillColor(255, 251, 235);
  doc.setDrawColor(252, 211, 77);
  doc.roundedRect(18, 42, pageW - 36, 16, 2, 2, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(180, 83, 9);
  doc.text("STATUS PENGAJUAN", 22, 48);
  doc.setFontSize(11);
  doc.text(`PENDING — Diterima ${dateStr} ${timeStr} WIB`, 22, 54);

  // Detail table
  autoTable(doc, {
    startY: 64,
    theme: "plain",
    styles: { fontSize: 10, cellPadding: 2, textColor: [15, 31, 61] },
    columnStyles: {
      0: { fontStyle: "bold", textColor: [90, 103, 129], cellWidth: 40 },
      1: { cellWidth: 55 },
      2: { fontStyle: "bold", textColor: [90, 103, 129], cellWidth: 40 },
      3: { cellWidth: "auto" },
    },
    body: [
      ["No. Klaim", data.noKlaim, "Tgl Pengajuan", dateStr],
      ["Plat Nomor", data.plat, "Tgl Kejadian", data.tanggal],
      ["Jenis Klaim", data.jenis, "Estimasi Nilai", data.nilai],
      ["Pemohon", "PT Maju Sentosa", "Diterima Oleh", "Sistem OPL Terpadu"],
    ],
  });

  // Kronologi
  // @ts-expect-error - lastAutoTable injected by plugin
  let y = (doc.lastAutoTable?.finalY ?? 100) + 8;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(15, 31, 61);
  doc.text("Kronologi Kejadian", 18, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(60, 70, 90);
  const kronologi = data.kronologi || "Tidak ada kronologi yang dilampirkan.";
  const kronLines = doc.splitTextToSize(kronologi, pageW - 36);
  doc.text(kronLines, 18, y + 5);
  y += 5 + kronLines.length * 4 + 6;

  // Notes
  doc.setFillColor(239, 246, 255);
  doc.setDrawColor(191, 219, 254);
  const noteText =
    "Tanda terima ini merupakan bukti bahwa pengajuan klaim Anda telah diterima oleh sistem. " +
    "Tim kami akan melakukan verifikasi dokumen dalam 2–5 hari kerja. Anda akan menerima notifikasi " +
    "melalui email dan dashboard saat status klaim berubah.";
  const noteLines = doc.splitTextToSize(noteText, pageW - 44);
  const noteH = noteLines.length * 4 + 10;
  doc.roundedRect(18, y, pageW - 36, noteH, 2, 2, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(29, 78, 216);
  doc.text("Catatan Penting", 22, y + 6);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(30, 58, 138);
  doc.text(noteLines, 22, y + 11);

  // Signature
  const sigY = pageH - 40;
  doc.setDrawColor(15, 31, 61);
  doc.setLineWidth(0.3);
  doc.line(30, sigY, 80, sigY);
  doc.line(pageW - 80, sigY, pageW - 30, sigY);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(15, 31, 61);
  doc.text("Penerima", 55, sigY + 5, { align: "center" });
  doc.text("BRI Finance", pageW - 55, sigY + 5, { align: "center" });

  // Footer
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(140, 150, 170);
  doc.text(`Dicetak otomatis oleh OPL Terpadu • ${dateStr} ${timeStr} WIB`, pageW / 2, pageH - 10, { align: "center" });

  const safeNo = data.noKlaim.replace(/[^a-zA-Z0-9]/g, "-");
  doc.save(`Tanda-Terima-${safeNo}.pdf`);
}

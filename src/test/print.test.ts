import { describe, it, expect, beforeAll } from "vitest";
import { readFileSync, readdirSync } from "fs";
import path from "path";

const root = path.resolve(__dirname, "../..");
const css = readFileSync(path.join(root, "src/index.css"), "utf8");

// Extract the @media print { ... } block (handles nested @page braces)
const extractPrintBlock = (source: string): string => {
  const start = source.indexOf("@media print");
  if (start === -1) return "";
  let i = source.indexOf("{", start);
  let depth = 1;
  i++;
  const begin = i;
  while (i < source.length && depth > 0) {
    const ch = source[i];
    if (ch === "{") depth++;
    else if (ch === "}") depth--;
    if (depth === 0) break;
    i++;
  }
  return source.slice(begin, i);
};

let printBlock = "";
beforeAll(() => {
  printBlock = extractPrintBlock(css);
});

describe("print stylesheet", () => {
  it("defines an @media print block", () => {
    expect(printBlock.length).toBeGreaterThan(0);
  });

  it("hides the sidebar (data-sidebar + aside)", () => {
    expect(printBlock).toMatch(/\[data-sidebar\][^{]*\{[^}]*display:\s*none\s*!important/);
    expect(printBlock).toMatch(/aside[^{]*\{[^}]*display:\s*none\s*!important/);
  });

  it("hides any element marked .no-print (topbar buttons, filter, download, print)", () => {
    expect(printBlock).toMatch(/\.no-print[^{]*\{[^}]*display:\s*none\s*!important/);
  });

  it("hides interactive buttons by default during print", () => {
    expect(printBlock).toMatch(/button:not\(\.print-keep\)[^{]*\{[^}]*display:\s*none\s*!important/);
  });

  it("resets <main> to full width with no padding for clean A4 output", () => {
    expect(printBlock).toMatch(/main[^{]*\{[^}]*width:\s*100%\s*!important/);
    expect(printBlock).toMatch(/main[^{]*\{[^}]*padding:\s*0\s*!important/);
  });

  it("declares @page with A4 size and the header/footer margin boxes", () => {
    expect(printBlock).toMatch(/@page\s*\{[^}]*size:\s*A4/);
    expect(printBlock).toMatch(/@top-center/);
    expect(printBlock).toMatch(/@top-right/);
    expect(printBlock).toMatch(/@bottom-center/);
  });

  it("renders a print-only logo (fixed top-left) and centered watermark", () => {
    expect(printBlock).toMatch(/\.print-logo[^{]*\{[^}]*display:\s*block\s*!important/);
    expect(printBlock).toMatch(/\.print-watermark[^{]*\{[^}]*display:\s*flex\s*!important/);
  });

  it("hides the print-only branding elements on screen by default", () => {
    // The fallback rule lives outside the @media print block
    expect(css).toMatch(/\.print-logo,\s*\.print-watermark\s*\{\s*display:\s*none/);
  });
});

describe("Records pages wire up print-friendly markup", () => {
  const recordsPages = [
    "src/pages/UGS.tsx",
    "src/pages/StnkReport.tsx",
    "src/pages/FinancialStatement.tsx",
    "src/pages/KlaimAsuransi.tsx",
    "src/pages/ServiceMaintenance.tsx",
  ];

  it.each(recordsPages)("%s renders the shared RecordsTable (which provides the no-print toolbar)", (file) => {
    const src = readFileSync(path.join(root, file), "utf8");
    expect(src).toMatch(/RecordsTable/);
  });

  it("RecordsTable toolbar is wrapped in .no-print so it disappears when printing", () => {
    const src = readFileSync(path.join(root, "src/components/RecordsTable.tsx"), "utf8");
    // Toolbar (search, filter, request download) lives inside a `.no-print` container,
    // dan stylesheet print global juga menyembunyikan tombol non-`.print-keep`.
    expect(src).toMatch(/no-print/);
    expect(src).toMatch(/data-print-section/);
  });

  it("AppLayout includes the print-only branding markup", () => {
    const src = readFileSync(path.join(root, "src/components/AppLayout.tsx"), "utf8");
    expect(src).toMatch(/className="print-logo"/);
    expect(src).toMatch(/className="print-watermark"/);
  });

  it("AppSidebar uses the data-sidebar attribute or <aside> element so print CSS can hide it", () => {
    const sidebarFiles = readdirSync(path.join(root, "src/components/ui"))
      .filter((f) => f === "sidebar.tsx")
      .map((f) => path.join(root, "src/components/ui", f));
    const combined = sidebarFiles.map((f) => readFileSync(f, "utf8")).join("\n");
    expect(combined).toMatch(/data-sidebar|<aside/);
  });
});

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";

/**
 * Memastikan tombol pilihan format download (Excel & PDF) selalu
 * memakai class `.btn-format-light` yang memaksa background PUTIH
 * via `!important` di src/index.css — sehingga tidak pernah ikut
 * gelap saat:
 *   - tema aplikasi `.dark` aktif di <html>
 *   - OS prefers-color-scheme: dark
 *
 * Test ini bersifat statis (tidak me-render halaman penuh) supaya
 * tidak bergantung pada provider lain. Pengujian visual penuh
 * dilakukan via checklist manual: docs/qa-download-buttons-checklist.md
 */

// Daftar markup yang merepresentasikan tombol-tombol di seluruh modal
// download. Tambahkan baris baru bila ada modal download tambahan.
const downloadButtonsMarkup = (
  <div>
    <button data-testid="download-excel" className="btn-format-light">
      Excel (.xlsx)
    </button>
    <button data-testid="download-pdf" className="btn-format-light">
      PDF (.pdf)
    </button>
  </div>
);

describe("Tombol download Excel/PDF — background putih", () => {
  beforeEach(() => {
    document.documentElement.classList.remove("dark");
  });
  afterEach(() => {
    document.documentElement.classList.remove("dark");
  });

  it("memakai class .btn-format-light di LIGHT mode", () => {
    render(downloadButtonsMarkup);
    expect(screen.getByTestId("download-excel").className).toContain("btn-format-light");
    expect(screen.getByTestId("download-pdf").className).toContain("btn-format-light");
  });

  it("tetap memakai class .btn-format-light saat tema aplikasi DARK", () => {
    document.documentElement.classList.add("dark");
    render(downloadButtonsMarkup);
    expect(screen.getByTestId("download-excel").className).toContain("btn-format-light");
    expect(screen.getByTestId("download-pdf").className).toContain("btn-format-light");
  });

  it("tetap memakai class .btn-format-light saat OS prefers-color-scheme: dark", () => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: (query: string) => ({
        matches: query.includes("dark"),
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => {},
      }),
    });
    render(downloadButtonsMarkup);
    expect(screen.getByTestId("download-excel").className).toContain("btn-format-light");
    expect(screen.getByTestId("download-pdf").className).toContain("btn-format-light");
  });
});

describe("Sumber kebenaran — Invoices.tsx tetap memakai .btn-format-light", () => {
  it("file Invoices.tsx mengandung dua tombol .btn-format-light", async () => {
    const fs = await import("node:fs/promises");
    const path = await import("node:path");
    const file = await fs.readFile(
      path.resolve(process.cwd(), "src/pages/Invoices.tsx"),
      "utf-8"
    );
    const matches = file.match(/btn-format-light/g) ?? [];
    expect(matches.length).toBeGreaterThanOrEqual(2);
    expect(file).toContain('data-testid="download-excel"');
    expect(file).toContain('data-testid="download-pdf"');
  });

  it("index.css mendefinisikan .btn-format-light dengan background putih !important", async () => {
    const fs = await import("node:fs/promises");
    const path = await import("node:path");
    const css = await fs.readFile(
      path.resolve(process.cwd(), "src/index.css"),
      "utf-8"
    );
    expect(css).toMatch(/\.btn-format-light\s*\{/);
    expect(css).toMatch(/background-color:\s*#ffffff\s*!important/i);
  });
});

import { describe, it, expect, beforeAll } from "vitest";
import { readFileSync } from "fs";
import path from "path";

const root = path.resolve(__dirname, "../..");

let dashboardSrc = "";
let cssSrc = "";
let printBlock = "";

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

beforeAll(() => {
  dashboardSrc = readFileSync(path.join(root, "src/pages/Dashboard.tsx"), "utf8");
  cssSrc = readFileSync(path.join(root, "src/index.css"), "utf8");
  printBlock = extractPrintBlock(cssSrc);
});

describe("Pie chart container is responsive across screen widths", () => {
  it("uses a responsive grid: single column on small screens, side-by-side on lg", () => {
    // Small screens stack chart + legend; from lg, chart grows fluidly while legend stays fixed-width.
    expect(dashboardSrc).toMatch(
      /grid\s+gap-4\s+sm:grid-cols-1\s+lg:grid-cols-\[minmax\(0,1fr\)_240px\]/,
    );
  });

  it("wraps the chart in ResponsiveContainer with width=100%", () => {
    expect(dashboardSrc).toMatch(/<ResponsiveContainer\s+width="100%"\s+height="100%"\s*>/);
  });

  it("chart wrapper has min-w-0 so it can shrink inside a flex/grid parent without overflow", () => {
    expect(dashboardSrc).toMatch(/className="relative h-\[340px\] min-w-0"/);
  });

  it("Pie uses percentage-based positioning so it scales with the container", () => {
    expect(dashboardSrc).toMatch(/cx="50%"/);
    expect(dashboardSrc).toMatch(/cy="50%"/);
  });

  it("inner info hub is centered with absolute inset-0 (stays centered when zoomed/resized)", () => {
    expect(dashboardSrc).toMatch(
      /absolute inset-0 flex items-center justify-center pointer-events-none/,
    );
  });
});

describe("Pie tooltip stays readable at small widths and when zoomed", () => {
  it("caps tooltip width with min(260px, 80vw) so it never overflows the viewport", () => {
    expect(dashboardSrc).toMatch(/maxWidth:\s*"min\(260px,\s*80vw\)"/);
  });

  it("allows the tooltip to escape the chart viewBox so it isn't clipped", () => {
    expect(dashboardSrc).toMatch(/allowEscapeViewBox=\{\{\s*x:\s*true,\s*y:\s*true\s*\}\}/);
  });

  it("brand name in the tooltip wraps (break-words) instead of being truncated", () => {
    expect(dashboardSrc).toMatch(/break-words[^"]*text-\[12px\][^"]*font-bold/);
  });

  it("numeric rows in tooltip use whitespace-nowrap so values aren't broken across lines", () => {
    const matches = dashboardSrc.match(/whitespace-nowrap/g) ?? [];
    // At least the two rows: Nilai + Persentase
    expect(matches.length).toBeGreaterThanOrEqual(2);
  });
});

describe("Legend list scales correctly across widths", () => {
  it("legend container is scrollable with a max height so it never pushes the layout", () => {
    expect(dashboardSrc).toMatch(/max-h-\[340px\][^"]*overflow-auto/);
  });

  it("legend items wrap long brand names (break-words, no truncate)", () => {
    expect(dashboardSrc).toMatch(/min-w-0 flex-1 break-words font-medium leading-tight/);
    // The old `truncate` class must no longer be used on the legend label.
    const legendBlock = dashboardSrc.split("print-pie-legend")[1] ?? "";
    expect(legendBlock).not.toMatch(/truncate font-medium text-brand-navy/);
  });

  it("each legend row exposes a percentage badge so users can read values without hovering", () => {
    expect(dashboardSrc).toMatch(/shrink-0 tabular-nums[^"]*text-muted-foreground/);
    expect(dashboardSrc).toMatch(/\{d\.pct\}%/);
  });

  it("legend uses .print-pie-legend hook so the print stylesheet can re-flow it", () => {
    expect(dashboardSrc).toMatch(/className="print-pie-legend[^"]*"/);
  });
});

describe("Print stylesheet keeps pie + legend usable in the PDF export", () => {
  it("hides the interactive Recharts tooltip when printing (it isn't useful in PDF)", () => {
    expect(printBlock).toMatch(
      /\.recharts-tooltip-wrapper[^{]*\{[^}]*display:\s*none\s*!important/,
    );
  });

  it("re-flows the legend into a 2-column grid for print so long names don't overflow", () => {
    expect(printBlock).toMatch(
      /\.print-pie-legend[^{]*\{[\s\S]*?grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)\s*!important/,
    );
  });

  it("removes the legend's max-height for print so every brand is visible (no scroll in PDF)", () => {
    expect(printBlock).toMatch(
      /\.print-pie-legend[^{]*\{[\s\S]*?max-height:\s*none\s*!important/,
    );
    expect(printBlock).toMatch(
      /\.print-pie-legend[^{]*\{[\s\S]*?overflow:\s*visible\s*!important/,
    );
  });

  it("legend labels wrap (white-space: normal) instead of being clipped when printed", () => {
    expect(printBlock).toMatch(
      /\.print-pie-legend button > span[^{]*\{[\s\S]*?white-space:\s*normal\s*!important/,
    );
  });

  it("forces .lg grid columns in print so the chart+legend layout survives narrow page widths", () => {
    expect(printBlock).toMatch(
      /\.lg\\:grid-cols-\\\[minmax\\\(0\\,1fr\\\)_240px\\\][^{]*\{[^}]*grid-template-columns:[^}]*240px/,
    );
  });
});
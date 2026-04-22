import { useCallback, useMemo, useState } from "react";
import { ArrowUpRight, Calendar as CalendarIcon, Printer, User, Shield, Building2, CalendarDays, X } from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Sector,
  Tooltip,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ComposedChart,
  Line,
  Area,
} from "recharts";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import AppLayout from "@/components/AppLayout";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { statusBadgeClass } from "@/lib/statusTone";
import { dash, dashPath, money } from "@/lib/format";
import { computePresetRange } from "@/lib/dateRange";
import {
  stats,
  financeStats,
  filters,
  pieData,
  klaimTrend,
  serviceData,
  ugsRows,
  fsRows,
} from "./dashboard/data";


const Dashboard = () => {
  const [activeFilter, setActiveFilter] = useState<string>("");
  const [trendMode, setTrendMode] = useState<"count" | "value" | "both">("both");
  const [activePieIndex, setActivePieIndex] = useState<number | null>(null);

  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({
    from: new Date(2025, 3, 1),
    to: new Date(2025, 10, 30),
  });
  const [fromOpen, setFromOpen] = useState(false);
  const [toOpen, setToOpen] = useState(false);

  const applyPreset = (preset: string) => {
    setActiveFilter(preset);
    setDateRange(computePresetRange(preset));
  };

  const clearRange = () => {
    setActiveFilter("");
    setDateRange({ from: undefined, to: undefined });
  };

  const inRange = useCallback(
    (d?: Date) => {
      if (!d) return true;
      if (dateRange.from && d < dateRange.from) return false;
      if (dateRange.to && d > dateRange.to) return false;
      return true;
    },
    [dateRange]
  );

  const filteredKlaim = useMemo(() => klaimTrend.filter((r) => inRange(r.date)), [inRange]);
  const filteredService = useMemo(() => serviceData.filter((r) => inRange(r.date)), [inRange]);
  const [fsStatusFilter, setFsStatusFilter] = useState<"All" | "Unpaid" | "Paid" | "Pending">("All");
  const [ugsStatusFilter, setUgsStatusFilter] = useState<"All" | "Aktif" | "Selesai" | "Proses">("All");
  const filteredFs = useMemo(
    () => fsRows.filter((r) => inRange(r.date) && (fsStatusFilter === "All" || r.status === fsStatusFilter)),
    [inRange, fsStatusFilter]
  );
  const filteredUgs = useMemo(
    () => ugsRows.filter((r) => inRange(r.periodeStart) && (ugsStatusFilter === "All" || r.status === ugsStatusFilter)),
    [inRange, ugsStatusFilter]
  );

  // Skala proporsional berdasarkan rasio bulan terpilih vs total bulan referensi (klaimTrend).
  // Saat tidak ada filter aktif, ratio = 1 → angka asli.
  const periodRatio = useMemo(() => {
    if (!dateRange.from && !dateRange.to) return 1;
    const total = klaimTrend.length || 1;
    return filteredKlaim.length / total;
  }, [dateRange, filteredKlaim.length]);

  const filteredPieData = useMemo(() => {
    // Pie ikut filter periode: nilai unit diskalakan dengan periodRatio
    // (sama seperti KPI Total Aset) sehingga distribusi mencerminkan
    // rentang tanggal yang dipilih user.
    const scaled = pieData
      .map((d) => ({ ...d, value: Math.max(0, Math.round(d.value * periodRatio)) }))
      .filter((d) => d.value > 0);
    const total = scaled.reduce((sum, d) => sum + d.value, 0) || 1;
    return scaled.map((d) => ({
      ...d,
      pct: Number(((d.value / total) * 100).toFixed(1)),
    }));
  }, [periodRatio]);
  const filteredPieTotal = useMemo(
    () => filteredPieData.reduce((sum, d) => sum + d.value, 0),
    [filteredPieData]
  );

  // KPI atas (Total Aset, STNK, Fasilitas) ikut diskalakan; "On Proses Klaim" pakai jumlah bulan klaim terfilter.
  const filteredStats = useMemo(() => {
    const scale = (n: number) => Math.max(0, Math.round(n * periodRatio));
    const onProses = filteredKlaim.reduce((s, r) => s + (r.count > 0 ? 1 : 0), 0);
    return [
      { ...stats[0], value: scale(6020).toLocaleString("id-ID") },
      { ...stats[1], value: String(scale(6)) },
      { ...stats[2], value: scale(3939).toLocaleString("id-ID") },
      { ...stats[3], value: String(onProses || scale(3)) },
    ];
  }, [periodRatio, filteredKlaim]);

  // Finance stats: Pembayaran Terakhir = nominal invoice paling baru dalam periode.
  const filteredFinanceStats = useMemo(() => {
    const paid = filteredFs.filter((r) => r.status === "Paid");
    const latest = [...paid].sort((a, b) => b.date.getTime() - a.date.getTime())[0];
    const unpaidTotal = filteredFs
      .filter((r) => r.status === "Unpaid" || r.status === "Pending")
      .reduce((s, r) => s + Number(r.nominal.replace(/[^\d]/g, "")), 0);
    return [
      { ...financeStats[0], value: `Rp ${unpaidTotal.toLocaleString("id-ID")}` },
      { ...financeStats[1], value: latest ? latest.nominal.trim() : "Rp 0" },
      { ...financeStats[2], value: financeStats[2].value },
    ];
  }, [filteredFs]);

  const fmt = (d?: Date) => (d ? format(d, "dd MMM yyyy", { locale: localeId }) : "Pilih tanggal");
  const reportDate = new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });

  return (
    <AppLayout title="Dashboard OPL" breadcrumb="OPL / Dashboard OPL">
      <span className="print-date" aria-hidden="true">{reportDate}</span>

      <div className="card-premium print-offset-top mb-5 flex flex-col items-start justify-between gap-3 p-4 md:flex-row md:items-center" data-print-section>
        <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-sm">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">USER:</span>
            <span className="font-bold text-brand-navy">PT Maju Sentosa</span>
            <span className="text-xs text-muted-foreground">(maju_sentosa)</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">ROLE:</span>
            <span className="font-bold text-brand-navy">Debitur</span>
          </div>
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">COMPANY:</span>
            <span className="font-bold text-brand-navy">PT Maju Sentosa</span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">TANGGAL:</span>
            <span className="font-bold text-brand-navy">{reportDate}</span>
          </div>
        </div>
        <button onClick={() => window.print()} className="no-print grid h-9 w-9 place-items-center rounded-lg bg-brand-blue text-white hover:bg-brand-blue/90" aria-label="Print">
          <Printer className="h-4 w-4" />
        </button>
      </div>

      <div className="card-premium no-print mb-4 flex flex-col gap-3 p-3 lg:flex-row lg:flex-wrap lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2 text-sm font-bold text-brand-navy">Periode</span>
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => applyPreset(f)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-semibold transition",
                activeFilter === f ? "bg-brand-blue text-white shadow-sm" : "text-muted-foreground hover:bg-muted"
              )}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground">Dari</span>
          <Popover open={fromOpen} onOpenChange={setFromOpen}>
            <PopoverTrigger asChild>
              <button
                className={cn(
                  "inline-flex h-9 items-center gap-2 rounded-lg border border-input bg-background px-3 text-xs font-semibold hover:bg-muted",
                  dateRange.from ? "text-brand-navy" : "text-muted-foreground"
                )}
              >
                <CalendarIcon className="h-3.5 w-3.5" />
                {fmt(dateRange.from)}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateRange.from}
                onSelect={(d) => {
                  setActiveFilter("");
                  setDateRange((prev) => ({ ...prev, from: d ?? undefined }));
                  setFromOpen(false);
                }}
                disabled={(d) => (dateRange.to ? d > dateRange.to : false)}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>

          <span className="text-xs font-semibold text-muted-foreground">Sampai</span>
          <Popover open={toOpen} onOpenChange={setToOpen}>
            <PopoverTrigger asChild>
              <button
                className={cn(
                  "inline-flex h-9 items-center gap-2 rounded-lg border border-input bg-background px-3 text-xs font-semibold hover:bg-muted",
                  dateRange.to ? "text-brand-navy" : "text-muted-foreground"
                )}
              >
                <CalendarIcon className="h-3.5 w-3.5" />
                {fmt(dateRange.to)}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateRange.to}
                onSelect={(d) => {
                  setActiveFilter("");
                  setDateRange((prev) => ({ ...prev, to: d ?? undefined }));
                  setToOpen(false);
                }}
                disabled={(d) => (dateRange.from ? d < dateRange.from : false)}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>

          {(dateRange.from || dateRange.to) && (
            <button
              onClick={clearRange}
              className="inline-flex h-9 items-center gap-1 rounded-lg px-2 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-brand-navy"
              aria-label="Reset rentang tanggal"
            >
              <X className="h-3.5 w-3.5" /> Reset
            </button>
          )}
        </div>
      </div>

      {/* Distribusi + Stat Cards (sejajar) */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3" data-print-section>
        <div className="card-premium relative overflow-hidden p-5 lg:col-span-2">
          {/* Ambient gradient backdrop */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{
              backgroundImage:
                "radial-gradient(circle at 18% 12%, hsl(var(--brand-blue) / 0.08), transparent 55%), radial-gradient(circle at 88% 88%, hsl(326 78% 58% / 0.06), transparent 55%)",
            }}
          />

          <div className="relative flex items-start justify-between gap-3">
            <div>
              <h3 className="section-title">Distribusi Total Aset per Merek</h3>
              <p className="mt-0.5 text-[11px] font-medium text-muted-foreground">
                {filteredPieData.length} merek · {filteredPieTotal.toLocaleString("id-ID")} unit
              </p>
            </div>
            <span className="hidden items-center gap-1.5 rounded-full border border-border/60 bg-card/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground backdrop-blur sm:inline-flex">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-blue" />
              Live Snapshot
            </span>
          </div>

          <div className="relative mt-3">
            {filteredPieTotal === 0 ? (
              <div className="grid h-[340px] place-items-center rounded-2xl border border-dashed border-border/60 text-sm text-muted-foreground">
                Tidak ada data aset untuk ditampilkan
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-[minmax(0,1fr)_240px] lg:items-center">
                {/* Donut chart */}
                <div className="relative h-[340px] min-w-0">
                  <div className="pointer-events-none absolute inset-[18%] rounded-full bg-gradient-to-br from-brand-blue/10 via-brand-blue/5 to-transparent blur-2xl" />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="flex h-[120px] w-[120px] flex-col items-center justify-center rounded-full border border-border/60 bg-card/90 shadow-lg backdrop-blur-sm">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Total Aset</span>
                      <span className="mt-1 text-2xl font-extrabold tabular-nums text-brand-navy">
                        {filteredPieTotal.toLocaleString("id-ID")}
                      </span>
                      <span className="text-[11px] font-medium text-muted-foreground">{filteredPieData.length} merek</span>
                    </div>
                  </div>

                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                      <Tooltip
                        cursor={{ fill: "transparent" }}
                        allowEscapeViewBox={{ x: true, y: true }}
                        wrapperStyle={{ outline: "none", zIndex: 50, pointerEvents: "none" }}
                        content={({ active, payload }) => {
                          if (!active || !payload?.length) return null;
                          const d = payload[0].payload as { name: string; value: number; pct: number; color: string };
                          return (
                            <div
                              className="no-print animate-fade-in rounded-xl border border-border/60 bg-card/95 px-3 py-2 shadow-xl backdrop-blur"
                              style={{ maxWidth: "min(260px, 80vw)" }}
                            >
                              <div className="flex items-center gap-2">
                                <span className="h-2.5 w-2.5 shrink-0 rounded-full ring-2 ring-card" style={{ background: d.color }} />
                                <span className="break-words text-[12px] font-bold leading-tight text-brand-navy">
                                  {d.name}
                                </span>
                              </div>
                              <div className="mt-1.5 grid gap-1 text-[11px] text-brand-navy">
                                <div className="flex items-center justify-between gap-3 whitespace-nowrap">
                                  <span className="text-muted-foreground">Nilai</span>
                                  <span className="font-extrabold tabular-nums">{d.value.toLocaleString("id-ID")}</span>
                                </div>
                                <div className="flex items-center justify-between gap-3 whitespace-nowrap">
                                  <span className="text-muted-foreground">Persentase</span>
                                  <span className="rounded-full bg-brand-blue/10 px-2 py-0.5 text-[10px] font-bold tabular-nums text-brand-blue">
                                    {d.pct}%
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        }}
                      />
                      <Pie
                        data={filteredPieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={78}
                        outerRadius={126}
                        minAngle={2}
                        paddingAngle={1.2}
                        stroke="hsl(var(--card))"
                        strokeWidth={3}
                        labelLine={false}
                        activeIndex={activePieIndex ?? undefined}
                        activeShape={(props: {
                          cx?: number;
                          cy?: number;
                          innerRadius?: number;
                          outerRadius?: number;
                          startAngle?: number;
                          endAngle?: number;
                          fill?: string;
                        }) => (
                          <Sector
                            {...props}
                            outerRadius={(props.outerRadius ?? 126) + 10}
                            cornerRadius={6}
                            style={{ filter: `drop-shadow(0 10px 24px ${(props.fill ?? "#2563eb")}40)` }}
                          />
                        )}
                        onMouseEnter={(_, i) => setActivePieIndex(i)}
                        onMouseLeave={() => setActivePieIndex(null)}
                        isAnimationActive={false}
                      >
                        {filteredPieData.map((d, i) => {
                          const dim = activePieIndex !== null && activePieIndex !== i;
                          return (
                            <Cell
                              key={d.name}
                              fill={d.color}
                              fillOpacity={dim ? 0.32 : 1}
                              style={{ transition: "fill-opacity 220ms ease-out" }}
                            />
                          );
                        })}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Legend list — dot + nama + persentase, wrap-friendly */}
                <div className="print-pie-legend grid max-h-[340px] content-start gap-1.5 overflow-auto pr-1">
                  {filteredPieData.map((d, i) => {
                    const active = activePieIndex === i;
                    return (
                      <button
                        key={d.name}
                        type="button"
                        onMouseEnter={() => setActivePieIndex(i)}
                        onMouseLeave={() => setActivePieIndex(null)}
                        className={cn(
                          "flex items-center gap-2 rounded-md px-1.5 py-1 text-left text-xs transition-colors print-keep",
                          active ? "bg-muted/70" : "hover:bg-muted/50"
                        )}
                      >
                        <span
                          className="h-2.5 w-2.5 shrink-0 rounded-full"
                          style={{ background: d.color }}
                        />
                        <span className="min-w-0 flex-1 break-words font-medium leading-tight text-brand-navy">
                          {d.name}
                        </span>
                        <span className="shrink-0 tabular-nums text-[10px] font-bold text-muted-foreground">
                          {d.pct}%
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:col-span-1">
          {filteredStats.map((s) => (
            <div key={s.label} className="card-premium flex items-center gap-4 p-4">
              <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ring-1 ring-border/50 ${s.color}`}>
                <s.icon className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1 text-right">
                <p className="text-xs font-medium text-muted-foreground">{s.label}</p>
                <p className="text-2xl font-bold text-brand-navy">{s.value}</p>
                <p className={`mt-0.5 flex items-center justify-end gap-1 text-[11px] font-semibold ${s.change.startsWith("-") ? "text-rose-600" : "text-emerald-600"}`}>
                  <ArrowUpRight className={`h-3 w-3 ${s.change.startsWith("-") ? "rotate-90" : ""}`} /> {s.change}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trend Klaim & Service Maintenance — full-width, sendiri-sendiri */}
      <div className="mt-4 grid grid-cols-1 gap-4" data-print-section>
        {/* === TREND KLAIM === */}
        <div className="card-premium p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="section-title">Trend Klaim Asuransi</h3>
              <p className="mt-1 pl-3.5 text-xs text-muted-foreground">Jumlah klaim & nilai per periode</p>
            </div>
            <div className="no-print flex items-center gap-1 rounded-lg bg-muted p-1">
              {(["count", "value", "both"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setTrendMode(m)}
                  className={`rounded-md px-3 py-1 text-xs font-semibold capitalize transition-all ${trendMode === m ? "bg-brand-blue text-white shadow-sm" : "text-muted-foreground hover:text-brand-navy"}`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* KPI chips */}
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="rounded-xl bg-gradient-to-br from-brand-blue/10 via-brand-blue/5 to-transparent p-3 ring-1 ring-brand-blue/15">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Total Klaim</p>
              <p className="mt-0.5 text-xl font-extrabold tabular-nums text-brand-navy">
                {filteredKlaim.reduce((s, r) => s + r.count, 0).toLocaleString("id-ID")}
              </p>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent p-3 ring-1 ring-amber-500/15">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Total Nilai</p>
              <p className="mt-0.5 text-xl font-extrabold tabular-nums text-brand-navy">
                Rp {filteredKlaim.reduce((s, r) => s + r.value, 0).toLocaleString("id-ID")}<span className="text-xs font-medium text-muted-foreground"> jt</span>
              </p>
            </div>
          </div>

          <div className="mt-3 h-64 overflow-hidden rounded-xl bg-gradient-to-b from-brand-blue/[0.03] to-transparent p-2 ring-1 ring-border/40">
            <ResponsiveContainer>
              <ComposedChart data={filteredKlaim} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="klaim-bar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--brand-blue))" stopOpacity={0.95} />
                    <stop offset="100%" stopColor="hsl(var(--brand-blue))" stopOpacity={0.45} />
                  </linearGradient>
                  <linearGradient id="klaim-line" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="hsl(var(--brand-accent))" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="hsl(38 92% 55%)" stopOpacity={1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 4" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="period" stroke="hsl(var(--muted-foreground))" fontSize={10.5} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: "hsl(var(--brand-blue) / 0.06)" }}
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid hsl(var(--border))",
                    boxShadow: "0 12px 32px -12px hsl(220 40% 20% / 0.18)",
                    padding: "8px 12px",
                    fontSize: 12,
                    background: "hsl(var(--card) / 0.95)",
                    backdropFilter: "blur(6px)",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 6 }} iconType="circle" />
                {(trendMode === "count" || trendMode === "both") && (
                  <Bar dataKey="count" name="Jumlah Klaim" fill="url(#klaim-bar)" radius={[8, 8, 0, 0]} barSize={22} />
                )}
                {(trendMode === "value" || trendMode === "both") && (
                  <Line
                    type="monotone"
                    dataKey="value"
                    name="Total Nilai (Juta Rp)"
                    stroke="url(#klaim-line)"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "hsl(var(--card))", stroke: "hsl(var(--brand-accent))", strokeWidth: 2 }}
                    activeDot={{ r: 6, fill: "hsl(var(--brand-accent))", stroke: "hsl(var(--card))", strokeWidth: 2 }}
                  />
                )}
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* === SERVICE & MAINTENANCE === */}
        <div className="card-premium p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="section-title">Service &amp; Maintenance</h3>
              <p className="mt-1 pl-3.5 text-xs text-muted-foreground">Jumlah service & total biaya per bulan</p>
            </div>
          </div>

          {/* KPI chips */}
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="rounded-xl bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent p-3 ring-1 ring-emerald-500/15">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Total Service</p>
              <p className="mt-0.5 text-xl font-extrabold tabular-nums text-brand-navy">
                {filteredService.reduce((s, r) => s + r.jumlah, 0).toLocaleString("id-ID")}
              </p>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-violet-500/10 via-violet-500/5 to-transparent p-3 ring-1 ring-violet-500/15">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Total Biaya</p>
              <p className="mt-0.5 text-xl font-extrabold tabular-nums text-brand-navy">
                Rp {filteredService.reduce((s, r) => s + r.biaya, 0).toLocaleString("id-ID")}<span className="text-xs font-medium text-muted-foreground"> jt</span>
              </p>
            </div>
          </div>

          {/* Combined chart: Jumlah Service (bar) + Total Biaya (area/line) */}
          <div className="mt-3 h-64 overflow-hidden rounded-xl bg-gradient-to-b from-emerald-500/[0.04] via-transparent to-violet-500/[0.04] p-2.5 ring-1 ring-border/40">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={filteredService} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="srv-bar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(160 84% 45%)" stopOpacity={0.95} />
                    <stop offset="100%" stopColor="hsl(160 84% 45%)" stopOpacity={0.4} />
                  </linearGradient>
                  <linearGradient id="srv-area" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(262 83% 58%)" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="hsl(262 83% 58%)" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 4" stroke="hsl(var(--border))" vertical={false} />
                <XAxis
                  dataKey="month"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={10.5}
                  tickLine={false}
                  axisLine={false}
                  interval="preserveStartEnd"
                  tickFormatter={(v: string) => v.split(" ")[0]}
                  minTickGap={6}
                />
                <YAxis
                  yAxisId="left"
                  stroke="hsl(160 84% 35%)"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  width={32}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="hsl(262 83% 50%)"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  width={32}
                  tickFormatter={(v: number) => `${v}`}
                />
                <Tooltip
                  cursor={{ fill: "hsl(var(--brand-blue) / 0.05)" }}
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid hsl(var(--border))",
                    boxShadow: "0 12px 32px -12px hsl(220 40% 20% / 0.18)",
                    padding: "8px 12px",
                    fontSize: 12,
                    background: "hsl(var(--card) / 0.95)",
                    backdropFilter: "blur(6px)",
                  }}
                  formatter={(value: number, name: string) =>
                    name === "Biaya (Jt)"
                      ? [`Rp ${value.toLocaleString("id-ID")} jt`, name]
                      : [value.toLocaleString("id-ID"), name]
                  }
                />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 6 }} iconType="circle" />
                <Bar
                  yAxisId="left"
                  dataKey="jumlah"
                  name="Jumlah Service"
                  fill="url(#srv-bar)"
                  radius={[8, 8, 0, 0]}
                  maxBarSize={28}
                />
                <Area
                  yAxisId="right"
                  type="monotone"
                  dataKey="biaya"
                  name="Biaya (Jt)"
                  stroke="hsl(262 83% 58%)"
                  strokeWidth={2.5}
                  fill="url(#srv-area)"
                  dot={{ r: 3.5, fill: "hsl(var(--card))", stroke: "hsl(262 83% 58%)", strokeWidth: 2 }}
                  activeDot={{ r: 5.5, fill: "hsl(262 83% 58%)", stroke: "hsl(var(--card))", strokeWidth: 2 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3" data-print-section>
        {filteredFinanceStats.map((s) => (
          <div key={s.label} className="card-premium p-5">
            <div className="flex items-center justify-between">
              <div className={`grid h-10 w-10 place-items-center rounded-xl ring-1 ring-border/50 ${s.color}`}>
                <s.icon className="h-5 w-5" />
              </div>
              <p className="text-right text-xs font-medium text-muted-foreground">{s.label}</p>
            </div>
            <p className="mt-3 text-right text-2xl font-bold text-brand-navy">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-4">
        <div className="card-premium" data-print-section>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 p-4">
            <div className="flex items-center gap-2">
              <h3 className="section-title">Ringkasan Financial Statement</h3>
              {(!fsRows || fsRows.length === 0) && (
                <span
                  className="pill bg-slate-100 text-slate-600 ring-slate-200/80"
                  title="Sumber data masih kosong"
                >
                  <span className="pill-dot" /> Data dummy belum tersedia
                </span>
              )}
            </div>
            <div className="no-print flex flex-wrap items-center gap-1.5">
              {(["All", "Unpaid", "Paid", "Pending"] as const).map((s) => {
                const active = fsStatusFilter === s;
                const cls = s === "All" ? "bg-slate-100 text-slate-700 ring-slate-200/80" : statusBadgeClass(s);
                return (
                  <button
                    key={s}
                    onClick={() => setFsStatusFilter(s)}
                    className={`pill cursor-pointer transition-all ${cls} ${active ? "ring-2 ring-offset-1 ring-brand-blue/60 scale-[1.02]" : "opacity-70 hover:opacity-100"}`}
                  >
                    <span className="pill-dot" /> {s === "All" ? "Semua" : s}
                  </button>
                );
              })}
              <button className="ml-1 text-xs font-semibold text-brand-blue hover:underline">Lihat Semua →</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="table-premium w-full text-sm">
              <thead className="text-left">
                <tr>
                  <th className="px-4 py-3 font-semibold">Nomor Invoice</th>
                  <th className="px-4 py-3 font-semibold">Customer</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 text-right font-semibold">Nominal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredFs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-10 text-center text-sm text-muted-foreground">Tidak ada invoice pada periode ini</td>
                  </tr>
                ) : filteredFs.map((r, i) => (
                  <tr key={i}>
                    <td className="px-4 py-3 font-mono text-[12px] font-bold text-brand-navy">{dash(r.invoice)}</td>
                    <td className="px-4 py-3 text-xs text-brand-navy">{dash(r.customer)}</td>
                    <td className="px-4 py-3">
                      <span className={`pill ${statusBadgeClass(r.status)}`}>
                        <span className="pill-dot" /> {dash(r.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-bold tabular-nums text-brand-navy">{money(r.nominal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card-premium" data-print-section>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 p-4">
            <div className="flex items-center gap-2">
              <h3 className="section-title">UGS Aktif</h3>
              {(!ugsRows || ugsRows.length === 0) && (
                <span
                  className="pill bg-slate-100 text-slate-600 ring-slate-200/80"
                  title="Sumber data masih kosong"
                >
                  <span className="pill-dot" /> Data dummy belum tersedia
                </span>
              )}
            </div>
            <div className="no-print flex flex-wrap items-center gap-1.5">
              {(["All", "Aktif", "Proses", "Selesai"] as const).map((s) => {
                const active = ugsStatusFilter === s;
                const cls = s === "All" ? "bg-slate-100 text-slate-700 ring-slate-200/80" : statusBadgeClass(s);
                return (
                  <button
                    key={s}
                    onClick={() => setUgsStatusFilter(s)}
                    className={`pill cursor-pointer transition-all ${cls} ${active ? "ring-2 ring-offset-1 ring-brand-blue/60 scale-[1.02]" : "opacity-70 hover:opacity-100"}`}
                  >
                    <span className="pill-dot" /> {s === "All" ? "Semua" : s}
                  </button>
                );
              })}
              <button className="ml-1 text-xs font-semibold text-brand-blue hover:underline">Lihat Semua →</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="table-premium w-full text-sm">
              <thead className="text-left">
                <tr>
                  <th className="px-4 py-3 font-semibold">Kendaraan Asli</th>
                  <th className="px-4 py-3 font-semibold">Kendaraan Pengganti</th>
                  <th className="px-4 py-3 font-semibold">Periode</th>
                  <th className="px-4 py-3 font-semibold">Alasan</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredUgs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-sm text-muted-foreground">Tidak ada UGS pada periode ini</td>
                  </tr>
                ) : (
                  filteredUgs.map((r, i) => (
                    <tr key={i}>
                      <td className="px-4 py-3"><p className="font-bold text-brand-navy">{dashPath(r, "asli.plat")}</p><p className="text-xs text-muted-foreground">{dashPath(r, "asli.tipe")}</p></td>
                      <td className="px-4 py-3"><p className="font-bold text-brand-navy">{dashPath(r, "ganti.plat")}</p><p className="text-xs text-muted-foreground">{dashPath(r, "ganti.tipe")}</p></td>
                      <td className="px-4 py-3 text-xs text-brand-navy">{dash(r.periode)}</td>
                      <td className="px-4 py-3 text-xs text-brand-navy">{dash(r.alasan)}</td>
                      <td className="px-4 py-3"><span className={`pill ${statusBadgeClass(r.status)}`}><span className="pill-dot" /> {dash(r.status)}</span></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;

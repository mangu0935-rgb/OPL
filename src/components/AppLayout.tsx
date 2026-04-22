import { ReactNode } from "react";
import { Bell, HelpCircle, Settings, Search, Shield, Receipt, Car, Sun, Moon, LogOut, User } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Link, useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useTheme } from "@/components/ThemeProvider";
import briLogo from "@/assets/bri-finance-logo.png";

type Notif = {
  id: string;
  category: "stnk" | "klaim" | "invoice";
  title: string;
  desc: string;
  time: string;
  unread?: boolean;
};

const notifications: Notif[] = [
  { id: "n1", category: "stnk", title: "STNK B 5678 DEF mendekati expired", desc: "Berlaku s/d 28 Apr 2025 — segera perpanjang.", time: "5 menit lalu", unread: true },
  { id: "n2", category: "klaim", title: "Klaim KLM/2025/003 menunggu review", desc: "Dokumen pendukung sedang diverifikasi.", time: "1 jam lalu", unread: true },
  { id: "n3", category: "invoice", title: "Invoice INV/2025/04/007 jatuh tempo", desc: "Nominal Rp 18.750.000 — jatuh tempo 28 Apr 2025.", time: "3 jam lalu", unread: true },
  { id: "n4", category: "stnk", title: "STNK B 9012 GHI sudah diperpanjang", desc: "Berlaku s/d 15 Apr 2027.", time: "Kemarin" },
  { id: "n5", category: "invoice", title: "Pembayaran INV/2025/04/001 diterima", desc: "Rp 12.500.000 berhasil diproses.", time: "2 hari lalu" },
];

const catMeta = {
  stnk: { icon: Car, bg: "bg-amber-500/10", fg: "text-amber-500", label: "STNK" },
  klaim: { icon: Shield, bg: "bg-violet-500/10", fg: "text-violet-500", label: "Klaim" },
  invoice: { icon: Receipt, bg: "bg-brand-blue/10", fg: "text-brand-blue", label: "Invoice" },
} as const;

interface Props {
  children: ReactNode;
  title: string;
  breadcrumb?: string;
}

const AppLayout = ({ children, title, breadcrumb }: Props) => {
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  return (
    <SidebarProvider>
      {/* Print-only branding — rendered at the very top of the layout tree
          (outside <main>) so `position: fixed` is anchored to the viewport
          and the logo/watermark repeat on EVERY printed page. */}
      <img src={briLogo} alt="BRI Finance" className="print-logo" aria-hidden="true" />
      <div className="print-watermark" aria-hidden="true">
        <img src={briLogo} alt="" />
      </div>
      <div className="flex min-h-screen w-full bg-surface-muted">
        <AppSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Topbar */}
          <header className="glass-header sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/70 px-4 transition-shadow duration-300 md:px-6">
            <div className="flex items-center gap-3">
              <SidebarTrigger
                aria-label="Buka atau tutup menu navigasi"
                title="Toggle menu navigasi"
                className="h-10 w-10 rounded-lg border-2 border-brand-blue/30 bg-brand-blue/5 text-brand-blue shadow-sm transition-all duration-200 ease-out hover:scale-105 hover:border-brand-blue hover:bg-brand-blue hover:text-white hover:shadow-md active:scale-95 focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2"
              />
              <div className="min-w-0">
                <h1 className="truncate text-base font-bold text-brand-navy md:text-lg">{title}</h1>
                {breadcrumb && (
                  <p className="hidden truncate text-xs text-muted-foreground sm:block">{breadcrumb}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1.5 md:gap-3">
              <div className="relative hidden lg:block">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  placeholder="Cari..."
                  className="h-9 w-56 rounded-lg border border-input bg-surface-muted pl-9 pr-3 text-sm transition-all duration-200 focus:border-brand-blue focus:bg-card focus:shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 xl:w-64"
                />
              </div>
              <button
                onClick={toggle}
                className="rounded-lg p-2 text-muted-foreground transition-all duration-200 hover:bg-muted hover:text-brand-navy hover:scale-110 active:scale-95"
                aria-label={theme === "dark" ? "Aktifkan mode terang" : "Aktifkan mode gelap"}
                title={theme === "dark" ? "Mode terang" : "Mode gelap"}
              >
                {theme === "dark" ? <Sun className="h-5 w-5 animate-fade-in" /> : <Moon className="h-5 w-5 animate-fade-in" />}
              </button>
              <Link
                to="/help"
                className="rounded-lg p-2 text-muted-foreground transition-all duration-200 hover:bg-muted hover:text-brand-navy hover:scale-110 active:scale-95"
                aria-label="Bantuan"
                title="Need Help"
              >
                <HelpCircle className="h-5 w-5" />
              </Link>
              <Popover>
                <PopoverTrigger asChild>
                  <button className="relative rounded-lg p-2 text-muted-foreground transition-all duration-200 hover:bg-muted hover:text-brand-navy hover:scale-110 active:scale-95" aria-label="Notifikasi">
                    <Bell className="h-5 w-5" />
                    <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-brand-accent px-1 text-[10px] font-bold text-white ring-2 ring-white animate-scale-in">
                      {notifications.filter((n) => n.unread).length}
                    </span>
                  </button>
                </PopoverTrigger>
                <PopoverContent align="end" sideOffset={8} className="w-[360px] p-0">
                  <div className="flex items-center justify-between border-b border-border px-4 py-3">
                    <div>
                      <p className="text-sm font-bold text-brand-navy">Notifikasi</p>
                      <p className="text-xs text-muted-foreground">{notifications.filter((n) => n.unread).length} belum dibaca</p>
                    </div>
                    <button className="text-xs font-semibold text-brand-blue hover:underline">Tandai sudah dibaca</button>
                  </div>
                  <div className="max-h-[380px] divide-y divide-border overflow-y-auto">
                    {notifications.map((n) => {
                      const m = catMeta[n.category];
                      const Icon = m.icon;
                      return (
                        <button key={n.id} className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors duration-150 hover:bg-muted/40">
                          <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${m.bg} ${m.fg}`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <p className="truncate text-sm font-semibold text-brand-navy">{n.title}</p>
                              {n.unread && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-accent" />}
                            </div>
                            <p className="line-clamp-2 text-xs text-muted-foreground">{n.desc}</p>
                            <p className="mt-1 text-[11px] font-medium text-muted-foreground">{n.time}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  <div className="border-t border-border p-2">
                    <button className="w-full rounded-md py-2 text-center text-sm font-semibold text-brand-blue hover:bg-brand-blue/5">
                      Lihat semua notifikasi
                    </button>
                  </div>
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    className="flex items-center gap-2 rounded-lg border-l border-border pl-2 transition-all hover:opacity-90 sm:gap-3 sm:pl-3"
                    aria-label="Menu profil"
                  >
                    <div className="hidden text-right lg:block">
                      <p className="text-sm font-semibold text-brand-navy">PT Maju Sentosa</p>
                      <p className="text-xs text-muted-foreground">Debitur</p>
                    </div>
                    <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-brand-blue to-brand-navy text-sm font-bold text-white shadow-md ring-2 ring-white transition-all duration-200 hover:scale-110 hover:shadow-lg cursor-pointer">
                      MS
                    </div>
                  </button>
                </PopoverTrigger>
                <PopoverContent align="end" sideOffset={8} className="w-64 p-0">
                  <div className="flex items-center gap-3 border-b border-border px-4 py-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-blue to-brand-navy text-sm font-bold text-white">
                      MS
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-brand-navy">PT Maju Sentosa</p>
                      <p className="truncate text-xs text-muted-foreground">Debitur</p>
                    </div>
                  </div>
                  <div className="p-1.5">
                    <Link
                      to="/settings"
                      className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-brand-navy transition hover:bg-muted"
                    >
                      <User className="h-4 w-4 text-muted-foreground" />
                      Profil Saya
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-brand-navy transition hover:bg-muted"
                    >
                      <Settings className="h-4 w-4 text-muted-foreground" />
                      Pengaturan
                    </Link>
                  </div>
                  <div className="border-t border-border p-1.5">
                    <button
                      onClick={() => navigate("/login")}
                      className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold text-destructive transition hover:bg-destructive/5"
                    >
                      <LogOut className="h-4 w-4" />
                      Keluar
                    </button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </header>

          <main className="flex-1 p-3 sm:p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;

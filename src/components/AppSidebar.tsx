import { useState } from "react";
import { Home, FileText, Folder, Download, ChevronDown, Headphones } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import logo from "@/assets/bri-finance-logo.png";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const mainItems = [
  { title: "Dashboard OPL", url: "/dashboard", icon: Home },
  { title: "Invoice Management", url: "/invoices", icon: FileText },
];

const records = [
  { title: "Klaim Asuransi", url: "/records/klaim" },
  { title: "Service & Maintenance", url: "/records/service" },
  { title: "STNK Report", url: "/records/stnk" },
  { title: "Financial Statement", url: "/records/financial" },
  { title: "UGS (Unit Ganti Sementara)", url: "/records/ugs" },
];

const adminItems = [
  { title: "Download Management", url: "/downloads", icon: Download },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { pathname } = useLocation();

  const recordsActive = records.some((r) => pathname.startsWith(r.url));

  const [recordsOpen, setRecordsOpen] = useState(recordsActive);

  // Active link styles — premium with gradient + left accent bar
  const linkClass = (active: boolean, indent = false) =>
    `group relative flex items-center gap-3 rounded-lg ${indent ? "pl-10 pr-3" : "px-3"} py-2 text-sm transition-all duration-200 ease-out hover:translate-x-0.5 ${
      active
        ? "bg-gradient-to-r from-brand-blue/15 via-brand-blue/8 to-transparent font-bold text-brand-blue shadow-[inset_3px_0_0_0_hsl(var(--brand-blue))]"
        : "font-medium text-brand-navy hover:bg-muted/60 hover:text-brand-blue"
    }`;

  return (
    <Sidebar collapsible="icon" className="border-r border-border transition-[width] duration-300 ease-in-out">
      <SidebarHeader className="h-16 border-b border-border bg-card px-4 py-0 transition-colors">
        <div className={`flex h-full items-center transition-all duration-300 ${collapsed ? "justify-center" : "justify-start"}`}>
          {collapsed ? (
            <div className="flex h-9 w-9 shrink-0 animate-fade-in items-center justify-center rounded-full bg-card shadow-sm ring-2 ring-brand-blue/30 transition-all duration-200 hover:ring-brand-blue/60 hover:shadow-md">
              <img src={logo} alt="BRI Finance" className="h-6 w-6 object-contain" />
            </div>
          ) : (
            <img src={logo} alt="BRI Finance" className="h-7 w-auto max-w-[150px] animate-fade-in object-contain transition-all sm:h-8" />
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-card">
        {/* Section label */}
        {!collapsed && (
          <div className="flex items-center gap-2 px-4 pt-4 pb-1">
            <span className="h-3 w-0.5 bg-brand-blue/40" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              OPL (Operational Lease)
            </span>
          </div>
        )}

        {/* Main items */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1 px-2">
              {mainItems.map((item) => {
                const active = pathname === item.url || pathname.startsWith(item.url + "/");
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild className="h-10">
                      <NavLink to={item.url} className={linkClass(active)}>
                        <item.icon className="h-5 w-5 shrink-0" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}

              {/* Records group with chevron */}
              <SidebarMenuItem>
                {collapsed ? (
                  <Popover>
                    <PopoverTrigger asChild>
                      <SidebarMenuButton
                        className={`h-10 ${linkClass(recordsActive)} w-full`}
                        aria-label="Records"
                        title="Records"
                      >
                        <Folder className="h-5 w-5 shrink-0" />
                      </SidebarMenuButton>
                    </PopoverTrigger>
                    <PopoverContent side="right" align="start" className="w-60 p-1">
                      <div className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        Records
                      </div>
                      <div className="flex flex-col gap-0.5">
                        {records.map((item) => {
                          const active = pathname.startsWith(item.url);
                          return (
                            <NavLink
                              key={item.url}
                              to={item.url}
                              className={`rounded-md px-3 py-2 text-sm transition-colors ${
                                active
                                  ? "bg-brand-blue/10 font-bold text-brand-blue"
                                  : "font-medium text-brand-navy hover:bg-muted"
                              }`}
                            >
                              {item.title}
                            </NavLink>
                          );
                        })}
                      </div>
                    </PopoverContent>
                  </Popover>
                ) : (
                  <SidebarMenuButton
                    className={`h-10 ${linkClass(recordsActive)} w-full`}
                    onClick={() => setRecordsOpen((v) => !v)}
                  >
                    <Folder className="h-5 w-5 shrink-0" />
                    <span className="flex-1 text-left">Records</span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${recordsOpen ? "rotate-180" : ""}`}
                    />
                  </SidebarMenuButton>
                )}
              </SidebarMenuItem>

              {!collapsed && recordsOpen && (
                <div className="mt-1 flex flex-col gap-0.5">
                  {records.map((item) => {
                    const active = pathname.startsWith(item.url);
                    return (
                      <NavLink key={item.url} to={item.url} className={linkClass(active, true)}>
                        <span>{item.title}</span>
                      </NavLink>
                    );
                  })}
                </div>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Admin items as top-level entries with their own icons (sesuai mockup) */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1 px-2">
              {adminItems.map((item) => {
                const active = pathname === item.url || pathname.startsWith(item.url + "/");
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild className="h-10">
                      <NavLink to={item.url} className={linkClass(active)}>
                        <item.icon className="h-5 w-5 shrink-0" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border bg-card p-3">
        {!collapsed && (
          <NavLink
            to="/help"
            className="group relative mb-3 block overflow-hidden rounded-2xl p-4 text-center text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
            style={{
              background:
                "linear-gradient(135deg, hsl(217 91% 58%) 0%, hsl(222 80% 42%) 100%)",
              boxShadow:
                "0 1px 0 0 hsl(0 0% 100% / 0.18) inset, 0 14px 30px -12px hsl(217 91% 30% / 0.55)",
            }}
          >
            {/* Decorative circle top-right */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-white/15"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -right-2 -top-2 h-10 w-10 rounded-full bg-white/10"
            />
            <div className="relative flex flex-col items-center gap-2">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-white/20 ring-1 ring-white/30 backdrop-blur">
                <Headphones className="h-5 w-5 text-white" />
              </div>
              <p className="text-sm font-bold leading-tight">Need Help?</p>
              <p className="text-xs text-white/85">Check our docs</p>
              <span className="mt-1 inline-flex w-full items-center justify-center rounded-lg bg-white px-3 py-2 text-xs font-bold text-brand-blue shadow-sm transition group-hover:bg-white/95">
                Documentation
              </span>
            </div>
          </NavLink>
        )}
        {collapsed && (
          <NavLink
            to="/help"
            className="mb-2 grid h-10 w-10 place-items-center rounded-lg bg-brand-blue text-white shadow-md transition hover:bg-brand-blue/90"
            aria-label="Need Help"
            title="Need Help"
          >
            <Headphones className="h-5 w-5" />
          </NavLink>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}

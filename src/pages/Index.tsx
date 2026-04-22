import { FileText, Receipt, CheckCircle2, Shield, PieChart, Headphones, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import logo from "@/assets/bri-finance-logo.png";
import heroImg from "@/assets/hero-illustration.png";
import BackToTop from "@/components/BackToTop";

const features = [
  { icon: FileText, title: "Kelola Kontak", desc: "Akses dan kelola semua kontrak operasional leasing Anda dalam satu sistem terintegrasi yang mudah digunakan." },
  { icon: Receipt, title: "Pantau Tagihan", desc: "Pantau status tagihan, jatuh tempo, dan riwayat pembayaran secara waktu nyata agar tidak ada yang terlewat." },
  { icon: CheckCircle2, title: "Konfirmasi Pembayaran", desc: "Lakukan konfirmasi pembayaran secara praktis dan transparan melalui sistem terpadu tanpa proses manual yang rumit." },
  { icon: Shield, title: "Keamanan Data", desc: "Data Anda terlindungi dengan sistem keamanan berlapis dan enkripsi tingkat tinggi sesuai standar industri keuangan." },
  { icon: PieChart, title: "Laporan Keuangan", desc: "Akses laporan keuangan dan analisis data untuk mendukung pengambilan keputusan bisnis yang lebih baik dan akurat." },
  { icon: Headphones, title: "Dukungan 24/7", desc: "Tim layanan pelanggan siap membantu Anda kapan saja dengan respons yang cepat dan profesional untuk setiap kendala." },
];

const Index = () => {
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Sync header height to CSS var so any anchor offsets stay accurate.
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const setVar = () => {
      const h = el.getBoundingClientRect().height;
      document.documentElement.style.setProperty("--header-h", `${Math.round(h) + 12}px`);
    };
    setVar();
    const ro = new ResizeObserver(setVar);
    ro.observe(el);
    window.addEventListener("resize", setVar);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", setVar);
    };
  }, [scrolled]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header — putih, minimal, premium */}
      <header
        ref={headerRef}
        className={`fixed inset-x-0 top-0 z-30 transition-all duration-300 ${
          scrolled
            ? "border-b border-border/60 bg-background/85 backdrop-blur-lg shadow-sm"
            : "bg-background/70 backdrop-blur"
        }`}
      >
        <div className="container mx-auto flex items-center justify-between px-5 py-3 sm:px-8 sm:py-4">
          <Link to="/" aria-label="BRI Finance — Beranda" className="shrink-0">
            <img src={logo} alt="BRI Finance" className="block h-8 w-auto object-contain sm:h-9" />
          </Link>
          <nav className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/login"
              className="rounded-md px-3 py-2 text-sm font-semibold text-brand-navy/80 transition hover:bg-muted hover:text-brand-navy sm:px-4"
            >
              Masuk
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center rounded-lg px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 sm:px-5"
              style={{
                background: "linear-gradient(135deg, hsl(217 91% 58%) 0%, hsl(222 80% 42%) 100%)",
                boxShadow:
                  "0 1px 0 0 hsl(0 0% 100% / 0.18) inset, 0 8px 22px -8px hsl(217 91% 50% / 0.55), 0 0 0 1px hsl(217 91% 60% / 0.3)",
              }}
            >
              Daftar
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-[hsl(217,64%,13%)] pt-24 pb-16 lg:pt-32 lg:pb-24">
        {/* Decorative ambient glow */}
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            backgroundImage:
              "radial-gradient(circle at 18% 28%, hsl(217 91% 38% / 0.55), transparent 55%), radial-gradient(circle at 88% 72%, hsl(217 91% 48% / 0.35), transparent 50%)",
          }}
        />
        {/* Subtle grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(hsl(0 0% 100%) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 100%) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />

        <div className="container relative mx-auto grid grid-cols-1 items-center gap-10 px-6 sm:px-8 lg:grid-cols-2 lg:gap-14">
          {/* Illustration card */}
          <div className="order-2 flex justify-center lg:order-1 lg:justify-start">
            <div className="relative">
              <div className="absolute -inset-5 rounded-[2rem] bg-[hsl(210,95%,75%)]/20 blur-2xl" aria-hidden />
              <div
                className="relative overflow-hidden rounded-3xl p-6 ring-1 ring-white/15 sm:p-8"
                style={{
                  background:
                    "linear-gradient(135deg, hsl(217 91% 58%) 0%, hsl(222 80% 38%) 100%)",
                  boxShadow:
                    "0 1px 0 0 hsl(0 0% 100% / 0.18) inset, 0 30px 80px -22px hsl(217 91% 30% / 0.7)",
                }}
              >
                <div
                  className="pointer-events-none absolute -inset-1 opacity-40"
                  style={{
                    background:
                      "radial-gradient(circle at 30% 18%, hsl(210 95% 80% / 0.55), transparent 60%)",
                  }}
                />
                <img
                  src={heroImg}
                  alt="Layanan Debitur OPL"
                  width={420}
                  height={420}
                  className="relative mx-auto h-[280px] w-[280px] object-contain sm:h-[340px] sm:w-[340px] lg:h-[400px] lg:w-[400px]"
                />
              </div>
            </div>
          </div>

          {/* Copy + CTAs */}
          <div className="order-1 animate-fade-in lg:order-2">
            <h1 className="text-4xl font-bold leading-[1.05] tracking-tight text-[hsl(210,95%,75%)] sm:text-5xl lg:text-6xl">
              Layanan Debitur OPL
              <span className="mt-2 block text-white">Terpadu</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
              Kelola kontrak, pantau tagihan, lakukan konfirmasi pembayaran, serta atur layanan dan perawatan dengan mudah dan efisien dalam satu platform terintegrasi.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/login" className="lp-cta-primary">
                Masuk Sekarang
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/register" className="lp-cta-ghost">
                Daftar Akun
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Fitur Utama */}
      <section className="bg-surface-muted py-20 lg:py-28">
        <div className="container mx-auto px-6 sm:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl">
              Fitur Utama
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Solusi terintegrasi untuk mengelola semua kebutuhan operasional leasing Anda dengan lebih cerdas.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:mt-14 lg:grid-cols-3 lg:gap-6">
            {features.map((f) => (
              <article key={f.title} className="lp-feature-card">
                <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-blue/15 to-brand-blue/5 ring-1 ring-brand-blue/15 transition-all duration-500 group-hover:from-brand-blue group-hover:to-[hsl(222,80%,42%)] group-hover:ring-brand-blue/40 group-hover:shadow-lg group-hover:shadow-brand-blue/40">
                  <f.icon className="h-5 w-5 text-brand-blue transition-colors duration-500 group-hover:text-white" />
                </div>
                <h3 className="relative mt-5 text-base font-bold tracking-tight text-brand-navy">
                  {f.title}
                </h3>
                <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">
                  {f.desc}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Siap Memulai */}
      <section className="relative overflow-hidden bg-[hsl(217,64%,13%)] py-20 lg:py-24">
        <div
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              "radial-gradient(circle at 50% 0%, hsl(217 91% 45% / 0.4), transparent 60%)",
          }}
        />
        <div className="container relative mx-auto px-6 sm:px-8">
          <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-8 text-center backdrop-blur sm:p-12">
            <h2 className="text-3xl font-bold tracking-tight text-[hsl(210,95%,75%)] sm:text-4xl lg:text-5xl">
              Siap Memulai?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/75 sm:text-base">
              Bergabunglah dengan perusahaan-perusahaan terpercaya yang telah mempercayakan pengelolaan operasional leasing mereka kepada BRI Finance.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/login" className="lp-cta-primary">
                Masuk Sekarang
              </Link>
              <Link to="/register" className="lp-cta-ghost">
                Daftar Akun Baru
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[hsl(217,64%,8%)] py-6">
        <div className="container mx-auto px-6 sm:px-8" />
      </footer>

      <BackToTop />
    </div>
  );
};

export default Index;

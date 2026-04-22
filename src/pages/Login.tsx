import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";

const Login = () => {
  const [showPwd, setShowPwd] = useState(false);
  const [tab, setTab] = useState<"login" | "register">("login");

  return (
    <AuthLayout
      variant="blue"
      heading={
        <>
          Layanan Debitur
          <br />
          <span className="text-brand-blue-light">OPL Terpadu</span>
        </>
      }
      description="Kelola kontrak, pantau tagihan, dan lakukan konfirmasi pembayaran dengan mudah dan transparan."
    >
      <div className="rounded-2xl bg-card p-8 shadow-xl ring-1 ring-border/40">
        <h1 className="text-3xl font-bold text-brand-navy">Selamat Datang</h1>
        <p className="mt-2 text-sm text-muted-foreground">Masukan kredensial akun anda untuk melanjutkan</p>

        {/* Tabs */}
        <div className="mt-6 flex border-b border-border">
          <button
            onClick={() => setTab("login")}
            className={`flex-1 pb-3 text-sm font-semibold transition ${tab === "login" ? "border-b-2 border-brand-blue text-brand-blue" : "text-muted-foreground"}`}
          >
            Login
          </button>
          <Link
            to="/register"
            onClick={() => setTab("register")}
            className="flex-1 pb-3 text-center text-sm font-semibold text-muted-foreground hover:text-brand-blue"
          >
            Register
          </Link>
        </div>

        <form className="mt-6 space-y-5" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="text-sm font-semibold text-brand-navy">Username</label>
            <input type="text" placeholder="Enter your username" className="mt-2 w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm placeholder:text-muted-foreground/70 focus:border-brand-blue focus:outline-none" />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-brand-navy">Password</label>
              <Link to="/reset-password" className="text-sm font-semibold text-brand-blue hover:underline">Lupa password?</Link>
            </div>
            <div className="relative mt-2">
              <input type={showPwd ? "text" : "password"} placeholder="Enter your password" className="w-full rounded-lg border border-input bg-background px-4 py-2.5 pr-10 text-sm placeholder:text-muted-foreground/70 focus:border-brand-blue focus:outline-none" />
              <button type="button" onClick={() => setShowPwd((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input type="checkbox" className="h-4 w-4 rounded border-input" />
            Ingat saya
          </label>

          <div className="rounded-lg bg-brand-blue/5 p-4">
            <p className="text-sm font-bold text-brand-navy">
              Verifikasi 2FA: Buka Microsoft Authenticator dan masukkan kode 6 digit.
            </p>
          </div>

          <div>
            <label className="text-sm font-semibold text-brand-navy">Kode 2FA</label>
            <input type="text" maxLength={6} className="mt-2 w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm tracking-widest focus:border-brand-blue focus:outline-none" />
          </div>

          <Link to="/dashboard" className="block w-full rounded-lg bg-brand-blue py-3 text-center text-sm font-bold text-white shadow-md transition hover:bg-brand-blue/90">
            Masuk Sekarang
          </Link>

          <p className="text-center text-xs text-muted-foreground">
            Use demo credentials for quick access, or register a new account with full authentication.
          </p>
          <p className="text-right text-xs font-semibold text-muted-foreground">v0.2 Prototype - Authentication Enabled</p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;

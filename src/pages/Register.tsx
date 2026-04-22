import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";

const Register = () => {
  const [showPwd, setShowPwd] = useState(false);

  return (
    <AuthLayout
      variant="blue"
      heading={
        <>
          Bergabung dengan
          <br />
          <span className="text-brand-blue-light">Ekosistem Digital</span>
        </>
      }
      description="Daftarkan akun anda untuk akses penuh ke layanan pembiayaan, monitoring kontrak, dan kemudahan transaksi digital."
    >
      <div className="rounded-2xl bg-card p-8 shadow-xl ring-1 ring-border/40">
        <h1 className="text-3xl font-bold text-brand-navy">Buat Akun Baru</h1>
        <p className="mt-2 text-sm text-muted-foreground">Lengkapi data diri anda untuk memulai layanan</p>

        <div className="mt-6 flex border-b border-border">
          <Link to="/login" className="flex-1 pb-3 text-center text-sm font-semibold text-muted-foreground hover:text-brand-blue">Login</Link>
          <button className="flex-1 border-b-2 border-brand-blue pb-3 text-sm font-semibold text-brand-blue">Register</button>
        </div>

        <form className="mt-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="text-sm font-semibold text-brand-navy">Nama Lengkap</label>
            <input type="text" placeholder="Cth: Budi Santoso" className="mt-2 w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm placeholder:text-muted-foreground/70 focus:border-brand-blue focus:outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-semibold text-brand-navy">Email</label>
              <input type="email" placeholder="nama@email.com" className="mt-2 w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm placeholder:text-muted-foreground/70 focus:border-brand-blue focus:outline-none" />
            </div>
            <div>
              <label className="text-sm font-semibold text-brand-navy">No. Handphone</label>
              <input type="tel" placeholder="08..." className="mt-2 w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm placeholder:text-muted-foreground/70 focus:border-brand-blue focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold text-brand-navy">Password</label>
            <div className="relative mt-2">
              <input type={showPwd ? "text" : "password"} placeholder="Minimal 8 karakter" className="w-full rounded-lg border border-input bg-background px-4 py-2.5 pr-10 text-sm placeholder:text-muted-foreground/70 focus:border-brand-blue focus:outline-none" />
              <button type="button" onClick={() => setShowPwd((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input type="checkbox" className="h-4 w-4 rounded border-input" />
            Saya menyetujui <a href="#" className="font-semibold text-brand-blue">Syarat & Ketentuan</a> yang berlaku.
          </label>
          <button className="w-full rounded-lg bg-brand-blue py-3 text-sm font-bold text-white shadow-md transition hover:bg-brand-blue/90">
            Register
          </button>

          <div className="relative my-2 flex items-center">
            <div className="flex-grow border-t border-border" />
            <span className="mx-4 text-xs text-muted-foreground">OR sign with</span>
            <div className="flex-grow border-t border-border" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button type="button" className="flex items-center justify-center gap-2 rounded-lg border border-input bg-card py-2.5 text-sm font-semibold hover:bg-muted">
              <svg className="h-4 w-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Google
            </button>
            <button type="button" className="flex items-center justify-center gap-2 rounded-lg border border-input bg-card py-2.5 text-sm font-semibold hover:bg-muted">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              Facebook
            </button>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Sudah memiliki akun? <Link to="/login" className="font-bold text-brand-blue hover:underline">Masuk disini</Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Register;

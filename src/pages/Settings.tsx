import AppLayout from "@/components/AppLayout";
import { User, Lock, Bell, Shield } from "lucide-react";

const Settings = () => (
  <AppLayout title="Pengaturan" breadcrumb="Beranda / Pengaturan">
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {[
        { icon: User, title: "Profil Akun", desc: "Kelola informasi pribadi & perusahaan" },
        { icon: Lock, title: "Keamanan", desc: "Ganti password & atur 2FA" },
        { icon: Bell, title: "Notifikasi", desc: "Atur preferensi notifikasi email & SMS" },
        { icon: Shield, title: "Privasi", desc: "Kelola data & izin akses Anda" },
      ].map((s) => (
        <button key={s.title} className="flex items-start gap-4 rounded-xl border border-border bg-card p-5 text-left shadow-sm transition hover:shadow-md">
          <div className="grid h-11 w-11 place-items-center rounded-lg bg-brand-blue/10 text-brand-blue">
            <s.icon className="h-5 w-5" />
          </div>
          <div>
            <p className="font-bold text-brand-navy">{s.title}</p>
            <p className="text-sm text-muted-foreground">{s.desc}</p>
          </div>
        </button>
      ))}
    </div>
  </AppLayout>
);

export default Settings;

import { useEffect, useState } from "react";
import AuthLayout from "@/components/AuthLayout";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import illu from "@/assets/auth-illustration.png";

const OtpVerification = () => {
  const [seconds, setSeconds] = useState(294);
  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <AuthLayout variant="blue" illustration={illu}>
      <div className="rounded-2xl bg-card p-10 shadow-xl ring-1 ring-border/40">
        <h1 className="text-center text-3xl font-bold text-brand-navy">Verifikasi OTP</h1>
        <p className="mx-auto mt-3 max-w-sm text-center text-sm leading-relaxed text-muted-foreground">
          Masukkan 4 digit kode OTP yang telah dikirim ke email/SMS Anda
        </p>

        <div className="mt-6 rounded-lg bg-brand-blue/5 py-3 text-center text-sm font-bold text-brand-navy">
          Demo Mode: Kode OTP Anda adalah <span className="text-brand-accent">5325</span>
        </div>

        <div className="mt-6 flex justify-center">
          <InputOTP maxLength={4}>
            <InputOTPGroup className="gap-3">
              {[0, 1, 2, 3].map((i) => (
                <InputOTPSlot key={i} index={i} className="h-14 w-14 rounded-lg border-input text-xl font-bold" />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>

        <p className="mt-6 text-center text-sm font-bold text-brand-blue">
          Kode akan kedaluwarsa dalam: {mm}:{ss}
        </p>

        <a href="/dashboard" className="mt-6 block w-full rounded-lg bg-brand-blue py-3 text-center text-sm font-bold text-white shadow-md transition hover:bg-brand-blue/90">
          Verifikasi
        </a>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          <button className="font-bold text-brand-blue hover:underline">Kirim ulang</button> kode OTP
        </p>
      </div>
    </AuthLayout>
  );
};

export default OtpVerification;

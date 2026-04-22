import { ReactNode } from "react";
import logo from "@/assets/bri-finance-logo.png";

interface AuthLayoutProps {
  variant?: "blue" | "white";
  illustration?: string;
  heading?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
}

const AuthLayout = ({ variant = "blue", illustration, heading, description, children }: AuthLayoutProps) => {
  const leftBg = variant === "blue" ? "bg-brand-blue" : "bg-card";
  const textColor = variant === "blue" ? "text-primary-foreground" : "text-brand-navy";

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* Left panel */}
      <aside className={`relative hidden flex-col p-12 lg:flex ${leftBg}`}>
        <div className="inline-flex w-fit shrink-0 items-center gap-2 rounded-lg bg-card px-3 py-1.5 shadow-md ring-1 ring-border">
          <img src={logo} alt="BRI Finance" className="h-7 w-auto max-w-[150px] object-contain sm:h-8" />
        </div>
        <div className="flex flex-1 flex-col justify-center">
          {illustration && (
            <img src={illustration} alt="" width={420} height={420} className="max-h-[420px] w-auto object-contain" />
          )}
          {heading && (
            <div className="space-y-5">
              <h2 className={`text-5xl font-bold leading-tight ${textColor}`}>{heading}</h2>
              {description && <p className={`max-w-md text-sm leading-relaxed ${variant === "blue" ? "text-white/85" : "text-muted-foreground"}`}>{description}</p>}
            </div>
          )}
        </div>
        <p className={`text-xs ${variant === "blue" ? "text-white/70" : "text-muted-foreground"}`}>
          © 2026 BRI Finance. All rights reserved.
        </p>
      </aside>

      {/* Right panel */}
      <main className="flex items-center justify-center bg-surface-muted p-4 sm:p-6 md:p-12">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
};

export default AuthLayout;

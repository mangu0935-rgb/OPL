import { Link } from "react-router-dom";
import AuthLayout from "@/components/AuthLayout";
import illu from "@/assets/auth-illustration.png";

const ResetPassword = () => {
  return (
    <AuthLayout variant="blue" illustration={illu}>
      <div className="rounded-2xl bg-card p-10 shadow-xl ring-1 ring-border/40">
        <h1 className="text-3xl font-bold text-brand-navy">Reset Password</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Enter your email address and we'll send you an email with instructions to reset your password.
        </p>

        <form className="mt-6 space-y-5" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="text-sm font-bold text-brand-navy">Email</label>
            <input type="email" placeholder="Enter your email address" className="mt-2 w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm placeholder:text-muted-foreground/70 focus:border-brand-blue focus:outline-none" />
          </div>
          <button className="w-full rounded-lg bg-brand-blue py-3 text-sm font-bold text-white shadow-md hover:bg-brand-blue/90">
            Reset Password
          </button>
          <p className="text-center text-sm text-muted-foreground">
            Back to <Link to="/login" className="font-bold text-brand-blue hover:underline">Sign In</Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default ResetPassword;

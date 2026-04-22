import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import Index from "./pages/Index.tsx";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import ResetPassword from "./pages/ResetPassword.tsx";
import OtpVerification from "./pages/OtpVerification.tsx";
import LockScreen from "./pages/LockScreen.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Invoices from "./pages/Invoices.tsx";
import Downloads from "./pages/Downloads.tsx";
import Settings from "./pages/Settings.tsx";
import UGS from "./pages/UGS.tsx";
import StnkReport from "./pages/StnkReport.tsx";
import ServiceMaintenance from "./pages/ServiceMaintenance.tsx";
import FinancialStatement from "./pages/FinancialStatement.tsx";
import KlaimAsuransi from "./pages/KlaimAsuransi.tsx";
import Help from "./pages/Help.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/otp" element={<OtpVerification />} />
          <Route path="/lock" element={<LockScreen />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/downloads" element={<Downloads />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/records/ugs" element={<UGS />} />
          <Route path="/records/stnk" element={<StnkReport />} />
          <Route path="/records/service" element={<ServiceMaintenance />} />
          <Route path="/records/financial" element={<FinancialStatement />} />
          <Route path="/records/klaim" element={<KlaimAsuransi />} />
          <Route path="/help" element={<Help />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

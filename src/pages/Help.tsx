import { HelpCircle, Mail, MessageSquare, Phone } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  { q: "Apa itu OPL Terpadu?", a: "OPL Terpadu adalah platform digital BRI Finance untuk mengelola operasional leasing debitur secara terintegrasi — mulai dari kontrak, tagihan, klaim asuransi, hingga service kendaraan dalam satu sistem." },
  { q: "Bagaimana cara mendaftar sebagai debitur?", a: "Klik tombol Daftar di pojok kanan atas, lengkapi data perusahaan dan verifikasi identitas. Tim kami akan memvalidasi pengajuan Anda dalam 1x24 jam kerja." },
  { q: "Apakah data saya aman di platform ini?", a: "Ya. Kami menerapkan enkripsi tingkat tinggi, role-based access, serta audit log sesuai standar keamanan industri keuangan dan regulasi OJK." },
  { q: "Bagaimana cara mengajukan klaim asuransi?", a: "Setelah login, masuk ke menu Klaim Asuransi, isi formulir pengajuan beserta kronologi dan dokumen pendukung. Status klaim dapat dipantau secara real-time." },
  { q: "Apakah ada biaya tambahan untuk menggunakan platform?", a: "Tidak. Layanan platform OPL Terpadu sudah termasuk dalam paket layanan operasional leasing BRI Finance Anda." },
  { q: "Bagaimana jika saya butuh bantuan?", a: "Tim Customer Support kami siap membantu 24/7 melalui chat in-app, email, maupun telepon. Anda juga dapat mengakses pusat bantuan langsung dari dashboard." },
];

const channels = [
  { icon: Phone, label: "Telepon", value: "1500-094", desc: "Senin–Jumat, 08.00–17.00 WIB" },
  { icon: Mail, label: "Email", value: "support@brifinance.co.id", desc: "Respons dalam 1x24 jam kerja" },
  { icon: MessageSquare, label: "Live Chat", value: "Tersedia di dashboard", desc: "24/7 melalui ikon bantuan" },
];

const Help = () => {
  return (
    <AppLayout title="Need Help" breadcrumb="Bantuan / FAQ">
      <div className="space-y-6">
        {/* Hero */}
        <section className="card-premium p-6 md:p-8">
          <div className="flex items-start gap-4">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand-blue/10 text-brand-blue ring-1 ring-brand-blue/20">
              <HelpCircle className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-brand-navy md:text-2xl">Pusat Bantuan</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Temukan jawaban atas pertanyaan umum atau hubungi tim dukungan kami.
              </p>
            </div>
          </div>
        </section>

        {/* Contact channels */}
        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {channels.map((c) => (
            <div key={c.label} className="card-premium p-5">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-brand-blue/10 text-brand-blue">
                  <c.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{c.label}</p>
                  <p className="text-sm font-bold text-brand-navy">{c.value}</p>
                </div>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">{c.desc}</p>
            </div>
          ))}
        </section>

        {/* FAQ */}
        <section className="card-premium p-6 md:p-8">
          <div className="mb-5 flex items-center gap-2">
            <span className="h-3 w-0.5 bg-brand-blue/40" />
            <h3 className="section-title">Pertanyaan yang Sering Diajukan</h3>
          </div>
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((f, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="rounded-xl border border-border bg-surface-muted/40 px-4"
              >
                <AccordionTrigger className="py-4 text-left text-sm font-bold text-brand-navy hover:no-underline md:text-base">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="pb-4 text-sm leading-relaxed text-muted-foreground">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      </div>
    </AppLayout>
  );
};

export default Help;

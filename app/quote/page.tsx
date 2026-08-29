import type { Metadata } from "next";
import InnerShell from "@/components/site/InnerShell";
import QuoteComposer from "@/components/site/QuoteComposer";

export const metadata: Metadata = {
  title: "Request a Printing & Branding Quote",
  description: "Request a fast Seska Investments quotation for printing, signage, branding, PVC IDs, awards, apparel, stationery, plotting and finishing in Kampala, Uganda.",
  alternates: { canonical: "/quote" },
};

export default function QuotePage() {
  return (
    <InnerShell
      index="05 / QUOTE"
      eyebrow="START A JOB"
      title="TELL US WHAT YOU NEED. WE'LL TAKE IT FROM THERE."
      intro="Build a clear WhatsApp quotation request with the core details Seska needs to understand your job quickly."
      accent="magenta"
      heroImage="/media/stationery.svg"
      heroAlt="Printed stationery and production samples"
      heroPosition="center 46%"
    >
      <section className="inner-section quote-layout"><div><span className="inner-label">FAST QUOTE</span><h2>FROM SPECIFICATION TO PRODUCTION.</h2><p>Turnaround depends on the job, material, quantity and finishing. Share as much detail as possible so the production team can quote accurately.</p><div className="quote-notes"><div><strong>Artwork</strong><span>PDF, PSD, JPG, PNG, Word, PowerPoint, AI, EPS</span></div><div><strong>Payments</strong><span>Mobile Money, bank transfer, cash, card and approved company terms</span></div><div><strong>Delivery</strong><span>Kampala pickup and delivery coordination across Uganda</span></div></div></div><QuoteComposer /></section>
    </InnerShell>
  );
}

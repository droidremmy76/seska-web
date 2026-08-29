import InnerShell from "@/components/site/InnerShell";
import QuoteComposer from "@/components/site/QuoteComposer";

export default function QuotePage() {
  return (
    <InnerShell index="05 / QUOTE" eyebrow="START A JOB" title="TELL US WHAT YOU NEED. WE'LL TAKE IT FROM THERE." intro="Build a clear WhatsApp quotation request with the core details Seska needs to understand your job quickly." accent="magenta">
      <section className="inner-section quote-layout"><div><span className="inner-label">FAST QUOTE</span><h2>FROM SPECIFICATION TO PRODUCTION.</h2><p>Turnaround depends on the job, material, quantity and finishing. Share as much detail as possible so the production team can quote accurately.</p><div className="quote-notes"><div><strong>Artwork</strong><span>PDF, PSD, JPG, PNG, Word, PowerPoint, AI, EPS</span></div><div><strong>Payments</strong><span>Mobile Money, bank transfer, cash, card and approved company terms</span></div><div><strong>Delivery</strong><span>Kampala pickup and delivery coordination across Uganda</span></div></div></div><QuoteComposer /></section>
    </InnerShell>
  );
}

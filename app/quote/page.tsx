import type { Metadata } from "next";
import InnerShell from "@/components/site/InnerShell";
import QuoteComposer from "@/components/site/QuoteComposer";
import FAQList from "@/components/site/FAQList";

export const metadata: Metadata = {
  title: "Request a Printing & Branding Quote",
  description: "Request a fast Seska Investments quotation for printing, signage, branding, PVC IDs, awards, apparel, stationery, plotting and finishing in Kampala, Uganda.",
  alternates: { canonical: "/quote" },
};

const briefItems = [
  "What product or service you need",
  "Quantity required",
  "Finished size or dimensions",
  "Preferred material or stock, if known",
  "Finishing required",
  "Artwork status and file format",
  "Deadline or event date",
  "Pickup or delivery destination",
] as const;

const faqs = [
  {
    question: "Why are prices not shown as a fixed online price list?",
    answer: "Printing and branding prices change with size, quantity, material, ink coverage, finishing, installation and deadline. Seska quotes each job from its actual production specification so the price reflects what will really be produced.",
  },
  {
    question: "What artwork should I send for the fastest quotation?",
    answer: "Send the final artwork if you have it, together with quantity, size, material preference and deadline. PDF, AI or EPS files are ideal for production, but PSD, JPG, PNG, Word and PowerPoint can also be reviewed.",
  },
  {
    question: "Can Seska help if my artwork is not print-ready?",
    answer: "Yes. Seska provides graphic-design and prepress support for layout cleanup, vector preparation, CMYK setup and production-ready file preparation where required.",
  },
  {
    question: "Which payment methods are accepted?",
    answer: "Payment can be coordinated through Mobile Money, bank transfer, cash or card. Approved company customers may also arrange agreed payment terms.",
  },
  {
    question: "How quickly can my job be completed?",
    answer: "Turnaround depends on the product, quantity, material, finishing and production schedule. If the job is urgent, include the exact deadline in the request so feasibility can be confirmed before production starts.",
  },
  {
    question: "Can I order from outside Kampala?",
    answer: "Yes. Artwork, specifications and quotation approval can be handled remotely, and delivery can be coordinated to destinations across Uganda depending on the finished job.",
  },
] as const;

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
      <section className="inner-section quote-layout">
        <div>
          <span className="inner-label">FAST QUOTE</span>
          <h2>FROM SPECIFICATION TO PRODUCTION.</h2>
          <p>Turnaround depends on the job, material, quantity and finishing. Share as much detail as possible so the production team can quote accurately.</p>
          <div className="quote-notes">
            <div><strong>Artwork</strong><span>PDF, PSD, JPG, PNG, Word, PowerPoint, AI, EPS</span></div>
            <div><strong>Payments</strong><span>Mobile Money, bank transfer, cash, card and approved company terms</span></div>
            <div><strong>Delivery</strong><span>Kampala pickup and delivery coordination across Uganda</span></div>
          </div>
        </div>
        <QuoteComposer />
      </section>

      <section className="inner-section brief-checklist">
        <div>
          <span className="inner-label">A BETTER BRIEF = A FASTER QUOTE</span>
          <h2>THE EIGHT DETAILS THAT MOVE A JOB FORWARD.</h2>
        </div>
        <div className="brief-items">
          {briefItems.map((item, index) => (
            <div className="brief-item" key={item}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{item}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="inner-section production-assurance" aria-label="Quotation workflow">
        <article><span>01</span><h3>Send the brief</h3><p>Use the form or WhatsApp and include the product, quantity, size, deadline and artwork.</p></article>
        <article><span>02</span><h3>Confirm the specification</h3><p>Material, finishing, production method and any installation or delivery requirements are clarified.</p></article>
        <article><span>03</span><h3>Approve the quotation</h3><p>Once the job scope and price are accepted, payment or deposit is coordinated before production.</p></article>
        <article><span>04</span><h3>Production starts</h3><p>The job moves into printing, branding, finishing, quality control and dispatch according to the agreed specification.</p></article>
      </section>

      <FAQList items={faqs} eyebrow="QUOTATION QUESTIONS" title="CLEAR BEFORE WE PRINT." />
    </InnerShell>
  );
}

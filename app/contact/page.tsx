import type { Metadata } from "next";
import Image from "next/image";
import InnerShell from "@/components/site/InnerShell";
import { SESKA_DATA } from "@/data/seska";

export const metadata: Metadata = {
  title: "Contact Seska Investments Kampala",
  description: "Contact Seska Investments on Nasser Road, Kampala for commercial printing, branding, signage, PVC IDs, stationery, awards, apparel and finishing enquiries.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const whatsappUrl = `https://wa.me/${SESKA_DATA.info.whatsappRaw}?text=${encodeURIComponent(SESKA_DATA.info.whatsappMessage)}`;
  return (
    <InnerShell
      index="06 / CONTACT"
      eyebrow="NASSER ROAD / KAMPALA"
      title="LET'S MAKE SOMETHING PEOPLE NOTICE."
      intro="Visit, call, email or send your artwork remotely. Seska can coordinate quotation, production and collection or delivery from Kampala."
      accent="cyan"
      heroImage="/media/workshop.svg"
      heroAlt="Seska Investments workshop and production environment in Kampala"
      heroPosition="center 44%"
    >
      <section className="inner-section contact-grid"><div><span className="inner-label">VISIT</span><h2>{SESKA_DATA.info.address}</h2><p>For production enquiries, artwork review and collection coordination.</p></div><div className="contact-card"><span className="inner-label">DIRECT CONTACT</span><a href={whatsappUrl} target="_blank" rel="noopener noreferrer">{SESKA_DATA.info.whatsappFormatted} ↗</a><a href="mailto:seskainvestmentsltd@gmail.com">seskainvestmentsltd@gmail.com ↗</a><p>Monday–Saturday · 8:00 AM–6:00 PM</p></div></section>
      <section className="inner-section split-section"><div className="trust-image" style={{ minHeight: 500 }}><Image src="/media/workshop.svg" alt="Seska Investments workshop in Kampala" fill sizes="(max-width: 900px) 100vw, 50vw" /></div><div className="contact-visual" style={{ minHeight: 500 }}><Image src="/media/merchandise.svg" alt="Seska branded corporate merchandise" fill sizes="(max-width: 900px) 100vw, 50vw" /></div></section>
      <section className="inner-section dark-panel"><span className="inner-label">REMOTE ORDERING</span><h2>SEND THE FILE. CONFIRM THE SPECS. LET PRODUCTION MOVE.</h2><p>Customers can send artwork and requirements through WhatsApp or email, receive a quotation and coordinate production remotely.</p><a className="button button-primary" href={whatsappUrl} target="_blank" rel="noopener noreferrer">Start on WhatsApp ↗</a></section>
    </InnerShell>
  );
}

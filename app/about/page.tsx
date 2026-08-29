import type { Metadata } from "next";
import Image from "next/image";
import InnerShell from "@/components/site/InnerShell";

export const metadata: Metadata = {
  title: "About Seska Investments",
  description: "Learn about Seska Investments Ltd, a Kampala printing, branding and visual-production company serving organisations and individuals from Nasser Road.",
  alternates: { canonical: "/about" },
};

const groups = ["Companies & SMEs", "Schools & universities", "NGOs & government organisations", "Architects, engineers & construction firms", "Events, churches & community organisations", "Individual customers"];

export default function AboutPage() {
  return (
    <InnerShell
      index="01 / ABOUT"
      eyebrow="WHO WE ARE"
      title="PRINTED IN KAMPALA. BUILT ON RELIABILITY."
      intro="Seska Investments Ltd is a commercial print, branding and visual-production company serving organisations and individuals from Nasser Road, Kampala."
      heroImage="/media/workshop.svg"
      heroAlt="Seska Investments production workshop in Kampala"
      heroPosition="center 42%"
    >
      <section className="inner-section split-section"><div><span className="inner-label">OUR APPROACH</span><h2>ONE PRODUCTION PARTNER FROM IDEA TO FINISH.</h2></div><div className="inner-prose"><p>Seska combines design support, digital and large-format production, identification products, branded apparel, merchandise and professional finishing in one practical workflow.</p><p>That means fewer hand-offs, clearer accountability and work that is prepared for the way it will actually be printed, installed, worn or distributed.</p></div></section>
      <section className="inner-section split-section"><div className="trust-image" style={{ minHeight: 520 }}><Image src="/media/workshop.svg" alt="Seska Investments production workshop on Nasser Road, Kampala" fill sizes="(max-width: 900px) 100vw, 50vw" /></div><div className="inner-prose"><span className="inner-label">REAL PRODUCTION / NASSER ROAD</span><h2>DESIGN, PRINT, FINISH AND DISPATCH UNDER ONE WORKFLOW.</h2><p>Our production environment brings commercial printing, large-format output, identification, branded apparel and finishing closer together so specifications can move from artwork to finished product with practical oversight.</p></div></section>
      <section className="inner-section stat-band"><div><strong>10+</strong><span>Years of experience</span></div><div><strong>1,000+</strong><span>Jobs completed</span></div><div><strong>100+</strong><span>Customers and organisations served</span></div></section>
      <section className="inner-section"><div className="inner-heading-row"><span className="inner-label">WHO WE SERVE</span><h2>BUILT FOR EVERYDAY BUSINESS AND HIGH-STAKES DELIVERY.</h2></div><div className="pill-grid">{groups.map((group, index) => <div key={group}><span>0{index + 1}</span><strong>{group}</strong></div>)}</div></section>
    </InnerShell>
  );
}

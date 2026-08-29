import InnerShell from "@/components/site/InnerShell";
import { SESKA_DATA } from "@/data/seska";

const specialist = ["Website Design & Motion Graphics", "A0 / A1 / A2 Technical Plotting", "Professional Print Finishing", "Awards, Plaques, Trophies & Medals", "Labels, Stickers & Vinyl Production"];

export default function ServicesPage() {
  return (
    <InnerShell index="02 / SERVICES" eyebrow="CAPABILITIES" title="FROM FILE TO FINISHED PRODUCT." intro="Commercial printing, branding and production services engineered for sharp colour, durable materials and dependable turnaround in Kampala and across Uganda." accent="magenta">
      <section className="inner-section service-page-list">{SESKA_DATA.services.map((service, index) => <article key={service.title}><span className="service-page-number">0{index + 1}</span><div><h2>{service.title}</h2><p>{service.desc}</p><div className="service-tags">{service.items.map((item) => <span key={item}>{item}</span>)}</div></div></article>)}</section>
      <section className="inner-section dark-panel"><span className="inner-label">SPECIALIST CAPABILITIES</span><div className="specialist-grid">{specialist.map((item, index) => <div key={item}><span>0{index + 6}</span><h3>{item}</h3></div>)}</div></section>
    </InnerShell>
  );
}

import Image from "next/image";
import InnerShell from "@/components/site/InnerShell";
import { SESKA_DATA } from "@/data/seska";

const specialist = ["Website Design & Motion Graphics", "A0 / A1 / A2 Technical Plotting", "Professional Print Finishing", "Awards, Plaques, Trophies & Medals", "Labels, Stickers & Vinyl Production"];

const productionViews = [
  { title: "Large-Format Production", label: "PRINT / VINYL / SIGNAGE", image: "/media/large-format.svg" },
  { title: "Apparel Branding", label: "EMBROIDERY / APPAREL", image: "/media/apparel.svg" },
  { title: "Professional Finishing", label: "CUT / FINISH / DELIVER", image: "/media/finishing.svg" },
];

export default function ServicesPage() {
  return (
    <InnerShell index="02 / SERVICES" eyebrow="CAPABILITIES" title="FROM FILE TO FINISHED PRODUCT." intro="Commercial printing, branding and production services engineered for sharp colour, durable materials and dependable turnaround in Kampala and across Uganda." accent="magenta">
      <section className="inner-section service-page-list">{SESKA_DATA.services.map((service, index) => <article key={service.title}><span className="service-page-number">0{index + 1}</span><div><h2>{service.title}</h2><p>{service.desc}</p><div className="service-tags">{service.items.map((item) => <span key={item}>{item}</span>)}</div></div></article>)}</section>
      <section className="inner-section product-grid">{productionViews.map((item, index) => <article key={item.title}><div className="product-image"><Image src={item.image} alt={item.title} fill sizes="(max-width: 800px) 100vw, 33vw" /></div><span>0{index + 1}</span><h2>{item.title}</h2><p>{item.label}</p></article>)}</section>
      <section className="inner-section dark-panel"><span className="inner-label">SPECIALIST CAPABILITIES</span><div className="specialist-grid">{specialist.map((item, index) => <div key={item}><span>0{index + 6}</span><h3>{item}</h3></div>)}</div></section>
    </InnerShell>
  );
}

import Image from "next/image";
import InnerShell from "@/components/site/InnerShell";
import { SESKA_DATA } from "@/data/seska";

export default function WorkPage() {
  return (
    <InnerShell index="04 / WORK" eyebrow="SELECTED PRODUCTION" title="MADE TO BE SEEN, USED AND REMEMBERED." intro="A visual overview of the production categories Seska handles across print, signage, identification, apparel and promotional branding.">
      <section className="inner-section portfolio-grid">{SESKA_DATA.work.map((item, index) => <article key={item.title} className={index % 3 === 0 ? "portfolio-wide" : ""}><div className="portfolio-image"><Image src={item.image} alt={item.title} fill sizes="(max-width: 900px) 100vw, 55vw" /></div><span>{item.category}</span><h2>{item.title}</h2></article>)}</section>
      <section className="inner-section note-panel"><span className="inner-label">PROJECT GALLERIES</span><h2>FULL CASE STUDIES ARE THE NEXT BUILD PASS.</h2><p>The interactive project modal architecture is prepared for real project photography, production specifications, materials, finishing and turnaround details.</p></section>
    </InnerShell>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import InnerShell from "@/components/site/InnerShell";
import FAQList from "@/components/site/FAQList";
import { SESKA_DATA } from "@/data/seska";

export const metadata: Metadata = {
  title: "Printing & Branding Services",
  description: "Explore Seska Investments services in Kampala: digital and offset printing, large-format signage, apparel branding, PVC IDs, graphic design, websites, motion graphics, plotting, awards and print finishing.",
  alternates: { canonical: "/services" },
};

const productionViews = [
  { title: "Large-Format Production", label: "PRINT / VINYL / SIGNAGE", image: "/media/large-format.svg" },
  { title: "Apparel Branding", label: "EMBROIDERY / APPAREL", image: "/media/apparel.svg" },
  { title: "Professional Finishing", label: "CUT / FINISH / DELIVER", image: "/media/finishing.svg" },
];

const specialistServices = [
  {
    title: "Website Design & Motion Graphics",
    desc: "Business websites and digital motion assets designed to extend a brand beyond print while keeping the same visual discipline across screens and campaigns.",
    items: ["Business Websites", "Landing Pages", "Website Redesign", "Logo Animation", "Social Motion Graphics", "Digital Advertisements"],
  },
  {
    title: "Technical & Large-Format Plotting",
    desc: "Large technical documents reproduced clearly for architects, engineers, surveyors and construction teams that need dependable plan output and scanning.",
    items: ["A0 Printing", "A1 Printing", "A2 Printing", "Architectural Plans", "Engineering Drawings", "Large-Format Scanning"],
  },
  {
    title: "Professional Print Finishing",
    desc: "The production work that turns a printed sheet into a presentation-ready final product, from protection and binding to precise cutting and folding.",
    items: ["Lamination", "Binding", "Trimming", "Creasing", "Folding", "Document Sealing", "Die-Cutting"],
  },
  {
    title: "Awards & Recognition Products",
    desc: "Presentation-ready recognition items for corporate ceremonies, schools, institutions, competitions and special events.",
    items: ["Trophies", "Plaques", "Medals", "Crystal Awards", "Glass Awards", "Certificates"],
  },
];

const faqs = [
  {
    question: "Can I send artwork without visiting the shop?",
    answer: "Yes. Customers can send specifications and artwork through WhatsApp or email, receive a quotation, confirm production details and coordinate collection or delivery remotely.",
  },
  {
    question: "Which artwork formats can Seska receive?",
    answer: "Common accepted formats include PDF, Adobe Illustrator or EPS, Photoshop files, JPG, PNG, Microsoft Word and PowerPoint. Production-ready PDF or vector artwork is preferred where available.",
  },
  {
    question: "Do you handle urgent or same-day jobs?",
    answer: "Turnaround always depends on the product, quantity, material, finishing and current production load. Suitable urgent jobs can be prioritised when the specification allows it.",
  },
  {
    question: "Can you print architectural or engineering plans?",
    answer: "Yes. Seska handles A0, A1 and A2 technical output, architectural plans, engineering drawings, survey layouts and large-format document reproduction.",
  },
  {
    question: "Do you offer website design and motion graphics as well as printing?",
    answer: "Yes. Seska also offers business websites, company-profile websites, landing pages, website redesign, logo animation, promotional motion graphics and digital advertisements.",
  },
  {
    question: "Can finished work be delivered outside Kampala?",
    answer: "Yes. Pickup is available in Kampala and delivery can be coordinated across Uganda depending on the job, destination and delivery requirements.",
  },
] as const;

export default function ServicesPage() {
  const directory = [
    ...SESKA_DATA.services.map((service) => ({ title: service.title, desc: service.desc, items: service.items })),
    ...specialistServices,
  ];

  return (
    <InnerShell
      index="02 / SERVICES"
      eyebrow="CAPABILITIES"
      title="FROM FILE TO FINISHED PRODUCT."
      intro="Commercial printing, branding and production services engineered for sharp colour, durable materials and dependable turnaround in Kampala and across Uganda."
      accent="magenta"
      heroImage="/media/large-format.svg"
      heroAlt="Large-format printing and branding production"
      heroPosition="center 45%"
    >
      <section className="inner-section service-page-list">
        {SESKA_DATA.services.map((service, index) => (
          <article key={service.title}>
            <span className="service-page-number">0{index + 1}</span>
            <div>
              <h2>{service.title}</h2>
              <p>{service.desc}</p>
              <div className="service-tags">{service.items.map((item) => <span key={item}>{item}</span>)}</div>
            </div>
          </article>
        ))}
      </section>

      <section className="inner-section product-grid">
        {productionViews.map((item, index) => (
          <article key={item.title}>
            <div className="product-image"><Image src={item.image} alt={item.title} fill sizes="(max-width: 800px) 100vw, 33vw" /></div>
            <span>0{index + 1}</span>
            <h2>{item.title}</h2>
            <p>{item.label}</p>
          </article>
        ))}
      </section>

      <section className="inner-section service-directory">
        <div className="service-directory-head">
          <div><span className="inner-label">FULL SERVICE DIRECTORY</span><h2>NINE PRODUCTION CAPABILITIES. ONE PARTNER.</h2></div>
          <p>Use this directory as a quick map of what Seska can produce. Every job is quoted around its real size, material, quantity, finishing and deadline rather than a one-size-fits-all price.</p>
        </div>
        <div className="service-directory-grid">
          {directory.map((service, index) => (
            <article className="service-directory-card" key={service.title}>
              <span>{String(index + 1).padStart(2, "0")} / 09</span>
              <h3>{service.title}</h3>
              <p>{service.desc}</p>
              <ul>{service.items.map((item) => <li key={item}>{item}</li>)}</ul>
              <Link href="/quote">Request this service ↗</Link>
            </article>
          ))}
        </div>
      </section>

      <section className="inner-section production-assurance" aria-label="Seska production principles">
        <article><span>01</span><h3>Artwork checked before production</h3><p>Files, dimensions and output requirements are reviewed before the job moves to press or fabrication.</p></article>
        <article><span>02</span><h3>Material matched to the job</h3><p>Media, stock and finishing are selected according to how and where the finished product will be used.</p></article>
        <article><span>03</span><h3>Turnaround quoted realistically</h3><p>Deadlines depend on quantity, complexity, finishing and current production load rather than a generic promise.</p></article>
        <article><span>04</span><h3>Collection or delivery coordinated</h3><p>Finished jobs can be collected in Kampala or coordinated for delivery across Uganda.</p></article>
      </section>

      <FAQList items={faqs} eyebrow="SERVICE QUESTIONS" title="WHAT CUSTOMERS USUALLY ASK." />
    </InnerShell>
  );
}

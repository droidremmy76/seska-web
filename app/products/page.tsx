import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import InnerShell from "@/components/site/InnerShell";

export const metadata: Metadata = {
  title: "Corporate Products, Stationery & Awards",
  description: "Corporate merchandise, branded apparel, PVC IDs, printed stationery, awards and professional print finishing from Seska Investments in Kampala.",
  alternates: { canonical: "/products" },
};

const categories = [
  {
    title: "Corporate Merchandise",
    desc: "Useful branded products for staff kits, launches, campaigns, conferences and corporate gifting.",
    image: "/media/merchandise.svg",
    items: ["Mugs", "Bottles", "Pens", "Notebooks", "Tote Bags", "Corporate Gifts"],
    quoteService: "Apparel & Merchandise Branding",
  },
  {
    title: "Apparel & Workwear",
    desc: "Branded clothing built for teams, events and everyday professional use.",
    image: "/media/apparel.svg",
    items: ["T-Shirts", "Polo Shirts", "Uniforms", "Workwear", "Caps", "Corporate Shirts"],
    quoteService: "Apparel & Merchandise Branding",
  },
  {
    title: "PVC IDs & Lanyards",
    desc: "Durable identification systems for staff, students, members and controlled access environments.",
    image: "/media/pvc-ids.svg",
    items: ["Staff IDs", "Student IDs", "Membership Cards", "Access Cards", "Proximity Cards", "Lanyards"],
    quoteService: "Office Stationery & PVC IDs",
  },
  {
    title: "Printed Stationery",
    desc: "Everyday business print that keeps documents, communication and brand presentation consistent.",
    image: "/media/stationery.svg",
    items: ["Business Cards", "Receipt Books", "Letterheads", "Notebooks", "Calendars", "Invitations"],
    quoteService: "Digital & Offset Printing",
  },
  {
    title: "Awards & Recognition",
    desc: "Presentation-ready recognition products for ceremonies, competitions, schools and corporate events.",
    image: "/media/awards.svg",
    items: ["Trophies", "Plaques", "Medals", "Crystal Awards", "Glass Awards", "Certificates"],
    quoteService: "Awards, Plaques, Trophies & Medals",
  },
  {
    title: "Professional Print Finishing",
    desc: "Production finishing that protects, shapes and completes printed work before handover or delivery.",
    image: "/media/finishing.svg",
    items: ["Lamination", "Binding", "Trimming", "Creasing", "Folding", "Die-Cutting"],
    quoteService: "Professional Print Finishing",
  },
] as const;

const decisionGuide = [
  ["01", "Purpose", "Tell us where the item will be used: office, outdoor, event, school, retail, campaign or gifting."],
  ["02", "Quantity", "Quantity affects production method, unit economics, packaging and realistic turnaround."],
  ["03", "Branding", "Share the logo, colours and artwork so size, placement and application method can be checked."],
  ["04", "Deadline", "Give the real event or delivery date so production and finishing can be planned correctly."],
] as const;

const productionMethods = [
  ["Embroidery", "Uniforms, polos, caps and durable apparel branding"],
  ["Heat Transfer", "Short-run apparel, names, numbers and detailed garment graphics"],
  ["Sublimation", "Suitable mugs, promotional products and selected textile applications"],
  ["Digital Print", "Business stationery, cards, brochures, books and short-run commercial print"],
  ["Large Format", "Banners, vinyl, displays, event graphics and signage"],
  ["PVC Card Print", "Staff, student, membership and proximity identification"],
] as const;

export default function ProductsPage() {
  return (
    <InnerShell
      index="03 / PRODUCTS"
      eyebrow="STATIONERY & BRANDING"
      title="USEFUL OBJECTS. VISIBLE BRANDS."
      intro="A curated range of corporate merchandise, apparel, identification products, awards and stationery that keeps your brand present beyond the printed page."
      accent="yellow"
      heroImage="/media/merchandise.svg"
      heroAlt="Seska branded corporate merchandise"
      heroPosition="center 48%"
    >
      <section className="inner-section products-intro">
        <div>
          <span className="inner-label">PRODUCT CATALOGUE</span>
          <h2>CHOOSE THE PRODUCT. WE'LL HELP SPECIFY THE RIGHT PRODUCTION.</h2>
        </div>
        <p>Most branded products do not have one universal specification. Material, branding method, quantity, artwork and deadline all affect how the job should be produced. Browse the main product families below, then send the real requirement for quotation.</p>
      </section>

      <section className="inner-section product-grid product-catalogue">
        {categories.map((item, index) => (
          <article key={item.title}>
            <div className="product-image"><Image src={item.image} alt={item.title} fill sizes="(max-width: 800px) 100vw, 50vw" /></div>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h2>{item.title}</h2>
            <p>{item.desc}</p>
            <ul>{item.items.map((product) => <li key={product}>{product}</li>)}</ul>
            <Link href={`/quote?service=${encodeURIComponent(item.quoteService)}`}>Quote this category ↗</Link>
          </article>
        ))}
      </section>

      <section className="inner-section product-decision-guide">
        <div className="product-decision-copy">
          <span className="inner-label">BEFORE WE QUOTE</span>
          <h2>FOUR DETAILS THAT MAKE PRODUCT ORDERS MOVE FASTER.</h2>
          <p>You do not need to know every production term. Start with what the item is for, how many you need and when you need it. Seska can help clarify the rest.</p>
          <Link className="button button-primary" href="/quote">Build a quotation request ↗</Link>
        </div>
        <div className="product-decision-list">
          {decisionGuide.map(([number, title, text]) => (
            <article key={title}>
              <span>{number}</span>
              <div><h3>{title}</h3><p>{text}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className="inner-section product-methods">
        <div className="product-methods-head">
          <span className="inner-label">PRODUCTION METHODS</span>
          <h2>THE BRANDING METHOD SHOULD FIT THE OBJECT.</h2>
        </div>
        <div className="product-methods-grid">
          {productionMethods.map(([method, use], index) => (
            <article key={method}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{method}</h3>
              <p>{use}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="inner-section product-cta">
        <div>
          <span className="inner-label">BULK / CORPORATE / INSTITUTIONAL</span>
          <h2>PLANNING A STAFF KIT, EVENT PACK OR LARGE ORDER?</h2>
        </div>
        <div>
          <p>Send the item list, quantities, branding requirements and deadline. We can group multiple products into one production brief for a clearer quotation.</p>
          <Link className="button button-primary" href="/quote">Request a combined quote ↗</Link>
        </div>
      </section>
    </InnerShell>
  );
}

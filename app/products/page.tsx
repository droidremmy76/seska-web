import type { Metadata } from "next";
import Image from "next/image";
import InnerShell from "@/components/site/InnerShell";

export const metadata: Metadata = {
  title: "Corporate Products, Stationery & Awards",
  description: "Corporate merchandise, branded apparel, PVC IDs, printed stationery, awards and professional print finishing from Seska Investments in Kampala.",
  alternates: { canonical: "/products" },
};

const categories = [
  { title: "Corporate Merchandise", desc: "Branded mugs, bottles, pens, gifts and promotional items.", image: "/media/merchandise.svg" },
  { title: "Apparel & Workwear", desc: "T-shirts, uniforms, caps, shirts and branded clothing.", image: "/media/apparel.svg" },
  { title: "PVC IDs & Lanyards", desc: "Staff, membership, access and proximity identification systems.", image: "/media/pvc-ids.svg" },
  { title: "Printed Stationery", desc: "Business cards, notebooks, receipt books, stationery and branded office materials.", image: "/media/stationery.svg" },
  { title: "Awards & Recognition", desc: "Plaques, trophies, medals, crystal awards, certificates and recognition products.", image: "/media/awards.svg" },
  { title: "Professional Print Finishing", desc: "Lamination, binding, trimming, creasing, folding, sealing and production finishing.", image: "/media/finishing.svg" },
];

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
      <section className="inner-section product-grid">{categories.map((item, index) => <article key={item.title}><div className="product-image"><Image src={item.image} alt={item.title} fill sizes="(max-width: 800px) 100vw, 50vw" /></div><span>{String(index + 1).padStart(2, "0")}</span><h2>{item.title}</h2><p>{item.desc}</p></article>)}</section>
    </InnerShell>
  );
}

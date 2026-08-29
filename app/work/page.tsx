import type { Metadata } from "next";
import Link from "next/link";
import InnerShell from "@/components/site/InnerShell";
import WorkGallery from "@/components/work/WorkGallery";

export const metadata: Metadata = {
  title: "Printing & Branding Portfolio",
  description: "Explore Seska Investments production categories across large-format signage, commercial print, PVC IDs, apparel, promotional merchandise, awards and corporate stationery.",
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  return (
    <InnerShell
      index="04 / WORK"
      eyebrow="SELECTED PRODUCTION"
      title="MADE TO BE SEEN, USED AND REMEMBERED."
      intro="Explore Seska production categories across print, signage, identification, apparel and promotional branding. Open any project to inspect materials, techniques, finishing and production details."
      heroImage="/media/workshop-real.jpg"
      heroAlt="Seska Investments production workshop in Kampala"
      heroPosition="center 48%"
    >
      <WorkGallery />

      <section className="inner-section note-panel">
        <span className="inner-label">YOUR JOB / YOUR SPECIFICATION</span>
        <h2>SEE A DIRECTION THAT FITS YOUR PROJECT?</h2>
        <p>Every job is quoted around the actual size, quantity, material, artwork, finishing and deadline. Use the project views as production references, then send Seska your exact requirements.</p>
        <Link className="button button-primary" href="/quote">Request a production quote ↗</Link>
      </section>
    </InnerShell>
  );
}

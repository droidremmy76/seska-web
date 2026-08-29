import InnerShell from "@/components/site/InnerShell";
import WorkGallery from "@/components/work/WorkGallery";

export default function WorkPage() {
  return (
    <InnerShell
      index="04 / WORK"
      eyebrow="SELECTED PRODUCTION"
      title="MADE TO BE SEEN, USED AND REMEMBERED."
      intro="Explore Seska production categories across print, signage, identification, apparel and promotional branding. Open any project to inspect materials, techniques, finishing and production details."
    >
      <WorkGallery />

      <section className="inner-section note-panel">
        <span className="inner-label">REAL PROJECT MEDIA PASS</span>
        <h2>THE CASE-STUDY SYSTEM IS NOW LIVE.</h2>
        <p>
          The portfolio is ready for the real Seska project photography supplied for this build. The current category visuals can be replaced progressively without changing the interaction, specification or gallery architecture.
        </p>
      </section>
    </InnerShell>
  );
}

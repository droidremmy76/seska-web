export default function HomePage() {
  return (
    <main className="page-shell">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">SESKA INVESTMENTS LTD · NASSER ROAD · KAMPALA</p>
          <h1>DIGITAL PRINTING<br/>AT ITS BEST.</h1>
          <p className="lede">Commercial printing, graphic design, large-format signage, apparel branding and office stationery.</p>
          <div className="actions">
            <a href="https://wa.me/256705884016" target="_blank" rel="noreferrer">GET A QUOTE ↗</a>
            <a href="#services">EXPLORE SERVICES ↓</a>
          </div>
        </div>
      </section>
      <section id="services" className="content-section">
        <p className="eyebrow">01 / SERVICES</p>
        <h2>PRINT. BRAND. BUILD.</h2>
        <div className="service-grid">
          {[
            "Graphic & Print Design",
            "Digital & Large-Format Printing",
            "Commercial & Apparel Branding",
            "Outdoor & Signage Manufacturing",
            "Office & Commercial Stationery"
          ].map((service, index) => (
            <article key={service}>
              <span>0{index + 1}</span>
              <h3>{service}</h3>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

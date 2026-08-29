"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SESKA_DATA } from "@/data/seska";

gsap.registerPlugin(ScrollTrigger);

export default function HomeExperience() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [slide, setSlide] = useState(0);
  const whatsappUrl = useMemo(
    () => `https://wa.me/${SESKA_DATA.info.whatsappRaw}?text=${encodeURIComponent(SESKA_DATA.info.whatsappMessage)}`,
    []
  );

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSlide((current) => (current + 1) % SESKA_DATA.hero.slides.length);
    }, 5200);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!rootRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-copy > *",
        { y: 34, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, stagger: 0.08, ease: "power3.out", delay: 0.15 }
      );
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
        gsap.fromTo(
          element,
          { y: 55, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.85,
            ease: "power3.out",
            scrollTrigger: { trigger: element, start: "top 88%", once: true },
          }
        );
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  const activeSlide = SESKA_DATA.hero.slides[slide];

  return (
    <div ref={rootRef} className="site-shell">
      <header className="site-nav">
        <a className="brand" href="#top" aria-label="Seska Investments home">
          <Image src="/media/logo.svg" alt="Seska Investments Ltd" width={240} height={88} priority />
        </a>
        <nav aria-label="Main navigation">
          <a href="#services">Services</a>
          <a href="#work">Work</a>
          <a href="#process">Process</a>
          <a href="#contact">Contact</a>
        </nav>
        <a className="nav-cta" href={whatsappUrl} target="_blank" rel="noopener noreferrer">
          Get a Quote ↗
        </a>
      </header>

      <main>
        <section id="top" className="hero-section">
          <div className="hero-media" aria-hidden="true">
            {SESKA_DATA.hero.slides.map((item, index) => (
              <div key={item.image} className={`hero-image ${index === slide ? "is-active" : ""}`}>
                <Image src={item.image} alt="" fill sizes="100vw" priority={index === 0} />
              </div>
            ))}
            <div className="hero-vignette" />
            <div className="hero-gridlines" />
          </div>

          <div className="hero-copy">
            <p className="hero-kicker">COMMERCIAL PRINT & VISUAL PRODUCTION / KAMPALA / UGANDA</p>
            <div className="hero-title-wrap">
              <h1>{SESKA_DATA.hero.headline}</h1>
              <span className="registration-mark" aria-hidden="true"><i /><i /><i /></span>
            </div>
            <p className="hero-subheadline">{SESKA_DATA.hero.subheadline}</p>
            <div className="hero-actions">
              <a className="button button-primary" href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                {SESKA_DATA.hero.primaryCta} ↗
              </a>
              <a className="button button-ghost" href="#contact">{SESKA_DATA.hero.secondaryCta} ↓</a>
            </div>
          </div>

          <div className="hero-slide-meta">
            <div>
              <span>0{slide + 1} / 03</span>
              <p>{activeSlide.eyebrow}</p>
            </div>
            <strong>{activeSlide.title}</strong>
          </div>

          <div className="slide-dots" aria-label="Hero slides">
            {SESKA_DATA.hero.slides.map((item, index) => (
              <button key={item.image} className={index === slide ? "is-active" : ""} onClick={() => setSlide(index)} aria-label={`Show slide ${index + 1}`} />
            ))}
          </div>
        </section>

        <div className="ticker" aria-hidden="true">
          <div>PRINT • BRAND • SIGN • EMBROIDER • FINISH • DELIVER • KAMPALA • UGANDA •&nbsp;</div>
          <div>PRINT • BRAND • SIGN • EMBROIDER • FINISH • DELIVER • KAMPALA • UGANDA •&nbsp;</div>
        </div>

        <section className="statement-section section-light" data-reveal>
          <div className="section-index">01 / WHAT WE DO</div>
          <h2>WE TURN IDEAS INTO THINGS PEOPLE CAN <span>SEE, TOUCH & REMEMBER.</span></h2>
          <p>From urgent one-off jobs to enterprise production runs, Seska brings design, print, branding and finishing together under one Kampala production roof.</p>
        </section>

        <section id="services" className="services-section section-light">
          <div className="section-heading" data-reveal>
            <span>02 / CAPABILITIES</span>
            <h2>FIVE WAYS WE MAKE BRANDS VISIBLE.</h2>
          </div>
          <div className="services-list">
            {SESKA_DATA.services.map((service, index) => (
              <article className="service-card" key={service.title} data-reveal>
                <div className="service-number">0{index + 1}</div>
                <div className="service-copy">
                  <h3>{service.title}</h3>
                  <p>{service.desc}</p>
                  <div className="service-tags">
                    {service.items.map((item) => <span key={item}>{item}</span>)}
                  </div>
                </div>
                <div className={`service-accent accent-${index % 3}`} aria-hidden="true" />
              </article>
            ))}
          </div>
        </section>

        <section className="trust-section" data-reveal>
          <div className="trust-image">
            <Image src="/media/workshop.svg" alt="Seska workshop and production system in Kampala" fill sizes="(max-width: 900px) 100vw, 50vw" />
          </div>
          <div className="trust-copy">
            <span className="section-index">03 / PRODUCTION</span>
            <h2>BUILT ON NASSER ROAD. MADE FOR UGANDA.</h2>
            <p>Seska combines artwork preparation, production equipment, finishing and dispatch in one practical workflow built around deadlines, colour accuracy and dependable delivery.</p>
            <div className="metrics">
              <div><strong>20+</strong><span>Years experience</span></div>
              <div><strong>1,000+</strong><span>Jobs completed</span></div>
              <div><strong>100+</strong><span>Customers served</span></div>
            </div>
          </div>
        </section>

        <section id="work" className="work-section section-light">
          <div className="section-heading" data-reveal>
            <span>04 / SELECTED WORK</span>
            <h2>MADE TO BE SEEN.</h2>
          </div>
          <div className="work-grid">
            {SESKA_DATA.work.map((item, index) => (
              <article className={`work-card work-${index + 1}`} key={item.title} data-reveal>
                <div className="work-image">
                  <Image src={item.image} alt={item.title} fill sizes="(max-width: 900px) 100vw, 50vw" />
                </div>
                <div className="work-meta"><span>{item.category}</span><h3>{item.title}</h3><b>↗</b></div>
              </article>
            ))}
          </div>
        </section>

        <section id="process" className="process-section">
          <div className="section-heading dark" data-reveal>
            <span>05 / EXPRESS ORDERING</span>
            <h2>FROM BRIEF TO DELIVERY.</h2>
          </div>
          <div className="process-grid">
            {SESKA_DATA.process.map((step, index) => (
              <article key={step.title} data-reveal>
                <div className="process-node"><span>0{index + 1}</span></div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="contact" className="contact-section">
          <div className="contact-copy" data-reveal>
            <span>06 / START A PROJECT</span>
            <h2>READY TO PRINT?</h2>
            <p>{SESKA_DATA.info.address}</p>
            <div className="contact-actions">
              <a className="button button-primary" href={whatsappUrl} target="_blank" rel="noopener noreferrer">WhatsApp Us ↗</a>
              <a className="contact-phone" href={whatsappUrl} target="_blank" rel="noopener noreferrer">{SESKA_DATA.info.whatsappFormatted}</a>
            </div>
          </div>
          <div className="contact-visual" data-reveal>
            <Image src="/media/merchandise.svg" alt="Seska branded merchandise showcase" fill sizes="(max-width: 900px) 100vw, 42vw" />
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <Image src="/media/logo.svg" alt="Seska Investments Ltd" width={210} height={70} />
        <p>{SESKA_DATA.info.tagline}</p>
        <p>© {new Date().getFullYear()} Seska Investments Ltd · Kampala, Uganda</p>
        <div className="cmyk-strip" aria-hidden="true"><i /><i /><i /><i /></div>
      </footer>
    </div>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SESKA_DATA } from "@/data/seska";
import { useScene, type SceneMode } from "@/context/SceneContext";
import { useCursor } from "@/context/CursorContext";
import MobileMenu from "@/components/site/MobileMenu";
import DesktopNav from "@/components/site/DesktopNav";

gsap.registerPlugin(ScrollTrigger);

const SCENE_TARGETS: Array<{ selector: string; scene: SceneMode }> = [
  { selector: "#top", scene: "hero" },
  { selector: "#services", scene: "services" },
  { selector: "#work", scene: "work" },
  { selector: "#process", scene: "process" },
  { selector: "#contact", scene: "contact" },
];

const CLIENT_GROUPS = [
  ["Companies & SMEs", "Corporate print, signage, uniforms and everyday business materials"],
  ["Schools & Universities", "IDs, certificates, books, event branding and institutional print"],
  ["NGOs & Government", "Campaign materials, reports, stationery, displays and formal production"],
  ["Architects & Engineers", "A0 / A1 / A2 plans, technical drawings, scanning and reproduction"],
  ["Events & Communities", "Banners, flags, apparel, awards, invitations and promotional products"],
  ["Individual Customers", "Personal print jobs, gifts, apparel, invitations and custom branding"],
] as const;

export default function HomeExperience() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [slide, setSlide] = useState(0);
  const { setScene } = useScene();
  const { setCursor, resetCursor } = useCursor();

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

      SCENE_TARGETS.forEach(({ selector, scene }) => {
        const element = rootRef.current?.querySelector<HTMLElement>(selector);
        if (!element) return;

        ScrollTrigger.create({
          trigger: element,
          start: "top 55%",
          end: "bottom 45%",
          onEnter: () => setScene(scene),
          onEnterBack: () => setScene(scene),
        });
      });
    }, rootRef);

    return () => ctx.revert();
  }, [setScene]);

  const activeSlide = SESKA_DATA.hero.slides[slide];
  const activeHeadline = slide === 0 ? SESKA_DATA.hero.headline : activeSlide.title;

  return (
    <div ref={rootRef} className="site-shell">
      <header className="site-nav">
        <a className="brand" href="#top" aria-label="Seska Investments home">
          <Image src="/media/logo.svg" alt="Seska Investments Ltd" width={240} height={88} priority />
        </a>
        <DesktopNav ariaLabel="Main navigation" />
        <Link
          className="nav-cta"
          href="/quote"
          onMouseEnter={() => setCursor("pointer", "QUOTE")}
          onMouseLeave={resetCursor}
        >
          Get a Quote ↗
        </Link>
        <MobileMenu />
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
              <h1 key={`hero-headline-${slide}`} className="hero-dynamic-title">{activeHeadline}</h1>
              <span className="registration-mark" aria-hidden="true"><i /><i /><i /></span>
            </div>
            <p className="hero-subheadline">{SESKA_DATA.hero.subheadline}</p>
            <div className="hero-actions">
              <a
                className="button button-primary"
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setCursor("pointer", "SEND")}
                onMouseLeave={resetCursor}
              >
                {SESKA_DATA.hero.primaryCta} ↗
              </a>
              <Link
                className="button button-ghost"
                href="/quote"
                onMouseEnter={() => setCursor("pointer", "QUOTE")}
                onMouseLeave={resetCursor}
              >
                {SESKA_DATA.hero.secondaryCta} ↗
              </Link>
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
              <button
                key={item.image}
                className={index === slide ? "is-active" : ""}
                onClick={() => setSlide(index)}
                onMouseEnter={() => setCursor("pointer", `0${index + 1}`)}
                onMouseLeave={resetCursor}
                aria-label={`Show slide ${index + 1}`}
              />
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
              <Link
                className="service-card"
                key={service.title}
                href="/services"
                data-reveal
                onMouseEnter={() => setCursor("pointer", "EXPLORE")}
                onMouseLeave={resetCursor}
              >
                <div className="service-number">0{index + 1}</div>
                <div className="service-copy">
                  <h3>{service.title}</h3>
                  <p>{service.desc}</p>
                  <div className="service-tags">
                    {service.items.map((item) => <span key={item}>{item}</span>)}
                  </div>
                </div>
                <div className={`service-accent accent-${index % 3}`} aria-hidden="true" />
              </Link>
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
              <div><strong>10+</strong><span>Years experience</span></div>
              <div><strong>{SESKA_DATA.info.jobsCompleted}</strong><span>Jobs completed</span></div>
              <div><strong>{SESKA_DATA.info.customersServed}</strong><span>Customers served</span></div>
            </div>
          </div>
        </section>

        <section className="home-clients section-light" data-reveal>
          <div className="home-clients-head">
            <span>04 / WHO WE SERVE</span>
            <h2>BUILT FOR ORGANISATIONS THAT CANNOT AFFORD TO LOOK UNPREPARED.</h2>
            <p>From one urgent job to recurring institutional production, the workflow is designed around clear specifications, dependable output and practical delivery.</p>
          </div>
          <div className="home-client-grid">
            {CLIENT_GROUPS.map(([group, description], index) => (
              <article key={group}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{group}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
          <Link
            className="home-clients-link"
            href="/about"
            onMouseEnter={() => setCursor("pointer", "ABOUT")}
            onMouseLeave={resetCursor}
          >
            More about Seska ↗
          </Link>
        </section>

        <section id="work" className="work-section section-light">
          <div className="section-heading" data-reveal>
            <span>05 / SELECTED WORK</span>
            <h2>MADE TO BE SEEN.</h2>
          </div>
          <div className="work-grid">
            {SESKA_DATA.work.map((item, index) => (
              <Link
                className={`work-card work-${index + 1}`}
                key={item.id}
                href={`/work#${item.id}`}
                data-reveal
                onMouseEnter={() => setCursor("view", "VIEW")}
                onMouseLeave={resetCursor}
              >
                <div className="work-image">
                  <Image src={item.image} alt={item.title} fill sizes="(max-width: 900px) 100vw, 50vw" />
                </div>
                <div className="work-meta"><span>{item.category}</span><h3>{item.title}</h3><b>↗</b></div>
              </Link>
            ))}
          </div>
          <div className="home-section-link" data-reveal>
            <Link
              href="/work"
              onMouseEnter={() => setCursor("pointer", "ALL WORK")}
              onMouseLeave={resetCursor}
            >
              Explore all project categories ↗
            </Link>
          </div>
        </section>

        <section id="process" className="process-section">
          <div className="section-heading dark" data-reveal>
            <span>06 / EXPRESS ORDERING</span>
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
            <span>07 / START A PROJECT</span>
            <h2>READY TO PRINT?</h2>
            <p>{SESKA_DATA.info.address}</p>
            <div className="contact-actions">
              <a
                className="button button-primary"
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setCursor("pointer", "CHAT")}
                onMouseLeave={resetCursor}
              >
                WhatsApp Us ↗
              </a>
              <Link
                className="contact-phone"
                href="/contact"
                onMouseEnter={() => setCursor("pointer", "VISIT")}
                onMouseLeave={resetCursor}
              >
                Contact & directions ↗
              </Link>
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

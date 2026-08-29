"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { SESKA_DATA } from "@/data/seska";

type Project = (typeof SESKA_DATA.work)[number];

export default function WorkGallery() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const selected = selectedIndex === null ? null : SESKA_DATA.work[selectedIndex];

  return (
    <>
      <section className="inner-section portfolio-grid interactive-portfolio">
        {SESKA_DATA.work.map((item, index) => (
          <button
            id={item.id}
            type="button"
            key={item.id}
            className={`portfolio-project ${index % 3 === 0 ? "portfolio-wide" : ""}`}
            onClick={() => setSelectedIndex(index)}
            aria-haspopup="dialog"
            aria-expanded={selectedIndex === index}
            aria-label={`Open ${item.title} project details`}
          >
            <div className="portfolio-image">
              <Image src={item.image} alt={item.title} fill sizes="(max-width: 900px) 100vw, 55vw" />
              <span className="portfolio-view">VIEW PROJECT ↗</span>
            </div>
            <span>{item.category}</span>
            <h2>{item.title}</h2>
            <p>{item.summary}</p>
          </button>
        ))}
      </section>

      {selected && selectedIndex !== null ? (
        <ProjectModal
          project={selected}
          projectIndex={selectedIndex}
          onClose={() => setSelectedIndex(null)}
          onPrevious={() => setSelectedIndex((selectedIndex - 1 + SESKA_DATA.work.length) % SESKA_DATA.work.length)}
          onNext={() => setSelectedIndex((selectedIndex + 1) % SESKA_DATA.work.length)}
        />
      ) : null}
    </>
  );
}

type ProjectModalProps = {
  project: Project;
  projectIndex: number;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
};

function ProjectModal({ project, projectIndex, onClose, onPrevious, onNext }: ProjectModalProps) {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const [galleryIndex, setGalleryIndex] = useState(0);

  const close = useCallback(() => {
    if (!overlayRef.current || !panelRef.current) {
      onClose();
      return;
    }

    const tl = gsap.timeline({ onComplete: onClose });
    tl.to(panelRef.current, { y: 36, opacity: 0, duration: 0.3, ease: "power3.in" });
    tl.to(overlayRef.current, { opacity: 0, duration: 0.2, ease: "power2.in" }, "-=0.14");
  }, [onClose]);

  useEffect(() => {
    setGalleryIndex(0);
  }, [project.id]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const ctx = gsap.context(() => {
      gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power2.out" });
      gsap.fromTo(panelRef.current, { y: 48, opacity: 0, scale: 0.985 }, { y: 0, opacity: 1, scale: 1, duration: 0.65, ease: "power4.out" });
      gsap.fromTo("[data-project-reveal]", { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, stagger: 0.055, ease: "power3.out", delay: 0.14 });
    }, overlayRef);

    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        onPrevious();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        onNext();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      ctx.revert();
    };
  }, [close, onNext, onPrevious]);

  const activeImage = project.gallery[galleryIndex] ?? project.image;

  return (
    <div
      ref={overlayRef}
      className="work-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <div ref={panelRef} className="work-modal-panel">
        <header className="work-modal-bar">
          <div>
            <span>PROJECT {String(projectIndex + 1).padStart(2, "0")}</span>
            <strong>{project.category}</strong>
          </div>
          <button ref={closeButtonRef} type="button" onClick={close} aria-label="Close project details">CLOSE ×</button>
        </header>

        <div className="work-modal-hero">
          <div className="work-modal-copy">
            <span data-project-reveal>{project.category}</span>
            <h2 id="project-modal-title" data-project-reveal>{project.title}</h2>
            <p data-project-reveal>{project.summary}</p>
            <div className="modal-registration" data-project-reveal aria-hidden="true"><i /><i /><i /><i /></div>
          </div>
          <div className="work-modal-image" data-project-reveal>
            <Image src={activeImage} alt={`${project.title} view ${galleryIndex + 1}`} fill sizes="(max-width: 980px) 100vw, 60vw" />
            <div className="work-modal-image-count">{String(galleryIndex + 1).padStart(2, "0")} / {String(project.gallery.length).padStart(2, "0")}</div>
          </div>
        </div>

        <section className="work-specs">
          <Spec label="Material / Stock" value={project.specs.material} accent="cyan" />
          <Spec label="Production Technique" value={project.specs.technique} accent="magenta" />
          <Spec label="Finishing" value={project.specs.finishing} accent="yellow" />
          <Spec label="Turnaround" value={project.specs.turnaround} accent="black" />
          <Spec label="Client Category" value={project.specs.clientCategory} accent="cyan" />
        </section>

        <section className="work-modal-gallery" aria-label={`${project.title} gallery`}>
          {project.gallery.map((image, index) => (
            <button
              type="button"
              key={`${project.id}-${image}-${index}`}
              className={index === galleryIndex ? "is-active" : ""}
              onClick={() => setGalleryIndex(index)}
              aria-label={`Show project image ${index + 1}`}
              aria-pressed={index === galleryIndex}
            >
              <Image src={image} alt="" fill sizes="(max-width: 700px) 50vw, 24vw" />
              <span>0{index + 1}</span>
            </button>
          ))}
        </section>

        <footer className="work-modal-nav">
          <button type="button" onClick={onPrevious}>← PREVIOUS PROJECT</button>
          <a href="/quote">REQUEST SOMETHING LIKE THIS ↗</a>
          <button type="button" onClick={onNext}>NEXT PROJECT →</button>
        </footer>
      </div>
    </div>
  );
}

type SpecProps = {
  label: string;
  value: string;
  accent: "cyan" | "magenta" | "yellow" | "black";
};

function Spec({ label, value, accent }: SpecProps) {
  return (
    <div className={`work-spec work-spec-${accent}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

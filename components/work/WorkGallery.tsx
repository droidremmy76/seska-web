"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { SESKA_DATA } from "@/data/seska";
import { useCursor } from "@/context/CursorContext";
import { useScene } from "@/context/SceneContext";

type Project = (typeof SESKA_DATA.work)[number];

const FILTERS = [
  { key: "all", label: "All Work", match: (_id: string) => true },
  { key: "print", label: "Print & Signage", match: (id: string) => ["large-format", "print-finishing", "corporate-stationery"].includes(id) },
  { key: "promo", label: "Apparel & Promo", match: (id: string) => ["corporate-apparel", "corporate-merchandise"].includes(id) },
  { key: "ids", label: "PVC IDs", match: (id: string) => id === "pvc-ids" },
  { key: "awards", label: "Awards", match: (id: string) => id === "awards-recognition" },
  { key: "production", label: "Production", match: (id: string) => id === "workshop-production" },
] as const;

type FilterKey = (typeof FILTERS)[number]["key"];

export default function WorkGallery() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [filter, setFilter] = useState<FilterKey>("all");
  const selected = selectedIndex === null ? null : SESKA_DATA.work[selectedIndex];
  const { setCursor, resetCursor } = useCursor();
  const { setScene } = useScene();

  useEffect(() => {
    setScene("work");
    return () => resetCursor();
  }, [setScene, resetCursor]);

  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.replace(/^#/, ""));
    if (!id) return;
    const index = SESKA_DATA.work.findIndex((item) => item.id === id);
    if (index >= 0) setSelectedIndex(index);
  }, []);

  const selectProject = useCallback((index: number) => {
    setSelectedIndex(index);
    const project = SESKA_DATA.work[index];
    window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}#${project.id}`);
  }, []);

  const closeProject = useCallback(() => {
    setSelectedIndex(null);
    window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
  }, []);

  const previousProject = useCallback(() => {
    if (selectedIndex === null) return;
    selectProject((selectedIndex - 1 + SESKA_DATA.work.length) % SESKA_DATA.work.length);
  }, [selectProject, selectedIndex]);

  const nextProject = useCallback(() => {
    if (selectedIndex === null) return;
    selectProject((selectedIndex + 1) % SESKA_DATA.work.length);
  }, [selectProject, selectedIndex]);

  const activeFilter = FILTERS.find((item) => item.key === filter) ?? FILTERS[0];
  const visibleProjects = SESKA_DATA.work
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => activeFilter.match(item.id));

  return (
    <>
      <section className="inner-section work-intro-band">
        <p>Browse by production family, then open any card for a closer project-style view with materials, production technique, finishing, turnaround guidance and client category.</p>
        <strong>{visibleProjects.length} production {visibleProjects.length === 1 ? "category" : "categories"}</strong>
      </section>

      <div className="portfolio-filter" role="toolbar" aria-label="Filter work categories">
        {FILTERS.map((item) => (
          <button
            key={item.key}
            type="button"
            className={filter === item.key ? "is-active" : ""}
            onClick={() => setFilter(item.key)}
            aria-pressed={filter === item.key}
          >
            {item.label}
          </button>
        ))}
      </div>

      <section className="inner-section portfolio-grid interactive-portfolio">
        {visibleProjects.map(({ item, index }) => (
          <button
            id={item.id}
            type="button"
            key={item.id}
            className={`portfolio-project ${index % 3 === 0 ? "portfolio-wide" : ""}`}
            onClick={() => selectProject(index)}
            onMouseEnter={() => setCursor("view", "VIEW")}
            onMouseLeave={resetCursor}
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
          onClose={closeProject}
          onPrevious={previousProject}
          onNext={nextProject}
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
  const { setCursor, resetCursor } = useCursor();

  const close = useCallback(() => {
    resetCursor();
    if (!overlayRef.current || !panelRef.current) {
      onClose();
      return;
    }

    const tl = gsap.timeline({ onComplete: onClose });
    tl.to(panelRef.current, { y: 36, opacity: 0, duration: 0.3, ease: "power3.in" });
    tl.to(overlayRef.current, { opacity: 0, duration: 0.2, ease: "power2.in" }, "-=0.14");
  }, [onClose, resetCursor]);

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

    requestAnimationFrame(() => closeButtonRef.current?.focus());

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        onPrevious();
        return;
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        onNext();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;

      const focusable = Array.from(panelRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      resetCursor();
      ctx.revert();
    };
  }, [close, onNext, onPrevious, resetCursor]);

  const activeImage = project.gallery[galleryIndex] ?? project.image;
  const showNextGalleryImage = () => setGalleryIndex((current) => (current + 1) % project.gallery.length);

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
          <button
            ref={closeButtonRef}
            type="button"
            onClick={close}
            onMouseEnter={() => setCursor("pointer", "CLOSE")}
            onMouseLeave={resetCursor}
            aria-label="Close project details"
          >
            CLOSE ×
          </button>
        </header>

        <div className="work-modal-hero">
          <div className="work-modal-copy">
            <span data-project-reveal>{project.category}</span>
            <h2 id="project-modal-title" data-project-reveal>{project.title}</h2>
            <p data-project-reveal>{project.summary}</p>
            <div className="modal-registration" data-project-reveal aria-hidden="true"><i /><i /><i /><i /></div>
          </div>
          <button
            type="button"
            className="work-modal-image"
            data-project-reveal
            onClick={showNextGalleryImage}
            onMouseEnter={() => setCursor("drag", "NEXT")}
            onMouseLeave={resetCursor}
            aria-label={`Show next image for ${project.title}`}
          >
            <Image src={activeImage} alt={`${project.title} view ${galleryIndex + 1}`} fill sizes="(max-width: 980px) 100vw, 60vw" />
            <div className="work-modal-image-count">{String(galleryIndex + 1).padStart(2, "0")} / {String(project.gallery.length).padStart(2, "0")}</div>
          </button>
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
              onMouseEnter={() => setCursor("view", "ZOOM")}
              onMouseLeave={resetCursor}
              aria-label={`Show project image ${index + 1}`}
              aria-pressed={index === galleryIndex}
            >
              <Image src={image} alt="" fill sizes="(max-width: 700px) 50vw, 24vw" />
              <span>0{index + 1}</span>
            </button>
          ))}
        </section>

        <footer className="work-modal-nav">
          <button
            type="button"
            onClick={onPrevious}
            onMouseEnter={() => setCursor("drag", "PREV")}
            onMouseLeave={resetCursor}
          >
            ← PREVIOUS PROJECT
          </button>
          <a
            href="/quote"
            onMouseEnter={() => setCursor("pointer", "QUOTE")}
            onMouseLeave={resetCursor}
          >
            REQUEST SOMETHING LIKE THIS ↗
          </a>
          <button
            type="button"
            onClick={onNext}
            onMouseEnter={() => setCursor("drag", "NEXT")}
            onMouseLeave={resetCursor}
          >
            NEXT PROJECT →
          </button>
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

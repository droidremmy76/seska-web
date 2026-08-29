"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { SESKA_DATA } from "@/data/seska";

const LINKS = [
  ["Home", "/"],
  ["About", "/about"],
  ["Services", "/services"],
  ["Products", "/products"],
  ["Work", "/work"],
  ["Contact", "/contact"],
] as const;

export default function MobileMenu() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const firstLinkRef = useRef<HTMLAnchorElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) return;

    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const ctx = gsap.context(() => {
      gsap.fromTo(
        panelRef.current,
        { clipPath: "inset(0 0 100% 0)" },
        { clipPath: "inset(0 0 0% 0)", duration: 0.58, ease: "power4.inOut" }
      );
      gsap.fromTo(
        "[data-menu-link]",
        { y: 32, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.05, duration: 0.5, ease: "power3.out", delay: 0.16 }
      );
    }, panelRef);

    requestAnimationFrame(() => firstLinkRef.current?.focus());

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) return;

      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      );
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

    window.addEventListener("keydown", handleKey);

    return () => {
      document.body.style.overflow = oldOverflow;
      window.removeEventListener("keydown", handleKey);
      ctx.revert();
      requestAnimationFrame(() => triggerRef.current?.focus());
    };
  }, [open]);

  const whatsappUrl = `https://wa.me/${SESKA_DATA.info.whatsappRaw}?text=${encodeURIComponent(SESKA_DATA.info.whatsappMessage)}`;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="mobile-menu-trigger"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="mobile-navigation"
      >
        MENU <span aria-hidden="true">≡</span>
      </button>

      {open ? (
        <div
          id="mobile-navigation"
          ref={panelRef}
          className="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
        >
          <div className="mobile-menu-top">
            <span>SESKA / NASSER ROAD / KAMPALA</span>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close navigation">
              CLOSE ×
            </button>
          </div>

          <nav aria-label="Mobile navigation">
            {LINKS.map(([label, href], index) => {
              const active = href === "/" ? pathname === "/" : pathname.startsWith(href);

              return (
                <Link
                  key={href}
                  ref={index === 0 ? firstLinkRef : undefined}
                  href={href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  data-menu-link
                >
                  <span>{String(index).padStart(2, "0")}</span>
                  <strong>{label}</strong>
                  <b aria-hidden="true">↗</b>
                </Link>
              );
            })}
          </nav>

          <div className="mobile-menu-actions" data-menu-link>
            <Link href="/quote" onClick={() => setOpen(false)} aria-current={pathname === "/quote" ? "page" : undefined}>
              Request a Quote ↗
            </Link>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              WhatsApp {SESKA_DATA.info.whatsappFormatted} ↗
            </a>
          </div>

          <div className="mobile-menu-foot" data-menu-link>
            <p>{SESKA_DATA.info.address}</p>
            <p>{SESKA_DATA.info.tagline}</p>
          </div>
          <div className="mobile-menu-cmyk" aria-hidden="true"><i /><i /><i /><i /></div>
        </div>
      ) : null}
    </>
  );
}

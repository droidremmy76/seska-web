import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { SESKA_DATA } from "@/data/seska";

type Accent = "cyan" | "magenta" | "yellow";

type InnerShellProps = {
  index: string;
  eyebrow: string;
  title: string;
  intro: string;
  accent?: Accent;
  children: ReactNode;
};

export default function InnerShell({ index, eyebrow, title, intro, accent = "cyan", children }: InnerShellProps) {
  const whatsappUrl = `https://wa.me/${SESKA_DATA.info.whatsappRaw}?text=${encodeURIComponent(SESKA_DATA.info.whatsappMessage)}`;

  return (
    <div className={`inner-shell accent-${accent}`}>
      <header className="inner-nav">
        <Link href="/" className="inner-brand" aria-label="Seska Investments home">
          <Image src="/media/logo.svg" alt="Seska Investments Ltd" width={190} height={64} priority />
        </Link>
        <nav aria-label="Site navigation">
          <Link href="/about">About</Link>
          <Link href="/services">Services</Link>
          <Link href="/products">Products</Link>
          <Link href="/work">Work</Link>
          <Link href="/contact">Contact</Link>
        </nav>
        <Link className="inner-quote" href="/quote">Request a Quote ↗</Link>
      </header>

      <main>
        <section className="inner-hero">
          <div className="inner-hero-grid" aria-hidden="true" />
          <div className="inner-hero-topline"><span>{index}</span><span>{eyebrow}</span><span>KAMPALA / UGANDA</span></div>
          <h1>{title}</h1>
          <div className="inner-hero-foot">
            <p>{intro}</p>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">Start on WhatsApp ↗</a>
          </div>
          <div className="inner-registration" aria-hidden="true"><i /><i /><i /><i /></div>
        </section>
        {children}
      </main>

      <footer className="inner-footer">
        <div><Image src="/media/logo.svg" alt="Seska Investments Ltd" width={170} height={58} /></div>
        <div><strong>{SESKA_DATA.info.address}</strong><span>{SESKA_DATA.info.whatsappFormatted}</span></div>
        <div><span>{SESKA_DATA.info.tagline}</span><span>© {new Date().getFullYear()} Seska Investments Ltd</span></div>
        <div className="cmyk-strip" aria-hidden="true"><i /><i /><i /><i /></div>
      </footer>
    </div>
  );
}

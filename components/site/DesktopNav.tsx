"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  ["About", "/about"],
  ["Services", "/services"],
  ["Products", "/products"],
  ["Work", "/work"],
  ["Contact", "/contact"],
] as const;

export default function DesktopNav({ ariaLabel = "Site navigation" }: { ariaLabel?: string }) {
  const pathname = usePathname();

  return (
    <nav aria-label={ariaLabel}>
      {LINKS.map(([label, href]) => {
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link key={href} href={href} className={active ? "is-active" : undefined} aria-current={active ? "page" : undefined}>
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

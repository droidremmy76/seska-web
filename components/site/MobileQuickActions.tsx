"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SESKA_DATA } from "@/data/seska";

export default function MobileQuickActions() {
  const pathname = usePathname();
  const whatsappUrl = `https://wa.me/${SESKA_DATA.info.whatsappRaw}?text=${encodeURIComponent(SESKA_DATA.info.whatsappMessage)}`;

  return (
    <div className="mobile-quick-actions" aria-label="Quick actions">
      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">WhatsApp ↗</a>
      {pathname !== "/quote" ? <Link href="/quote">Get a Quote ↗</Link> : <Link href="/contact">Contact Seska ↗</Link>}
    </div>
  );
}

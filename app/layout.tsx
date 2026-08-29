import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./inner-pages.css";
import "./work-modal.css";
import "./home-extra.css";
import "./photo-pass.css";
import "./mobile-menu.css";
import "./route-transitions.css";
import "./polish-pass.css";
import { ClientMotionShell } from "@/components/providers/ClientMotionShell";
import { SESKA_DATA } from "@/data/seska";

const siteUrl = "https://seskainvestments.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Seska Investments Ltd | Digital Printing & Branding in Kampala",
    template: "%s | Seska Investments Ltd",
  },
  description: "Professional commercial printing, graphic design, large-format printing, signage, apparel branding, PVC IDs, awards and office stationery in Kampala, Uganda.",
  applicationName: "Seska Investments Ltd",
  keywords: [
    "printing Kampala",
    "digital printing Uganda",
    "large format printing Kampala",
    "branding Kampala",
    "Nasser Road printing",
    "PVC ID cards Uganda",
    "corporate branding Uganda",
    "graphic design Kampala",
    "stationery printing Uganda",
  ],
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "en_UG",
    url: siteUrl,
    siteName: "Seska Investments Ltd",
    title: "Seska Investments Ltd | Digital Printing & Branding in Kampala",
    description: "Commercial printing, large-format branding, apparel, PVC IDs, awards, stationery and graphic design from Nasser Road, Kampala.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Seska Investments Ltd | Digital Printing & Branding in Kampala",
    description: "Commercial printing, branding and visual production from Nasser Road, Kampala, Uganda.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#020817",
};

const businessJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Seska Investments Ltd",
  url: siteUrl,
  description: "Commercial printing, graphic design, large-format branding, apparel branding, PVC identification, awards, stationery and print finishing in Kampala, Uganda.",
  telephone: SESKA_DATA.info.whatsappFormatted,
  email: "seskainvestmentsltd@gmail.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: SESKA_DATA.info.address,
    addressLocality: "Kampala",
    addressCountry: "UG",
  },
  areaServed: { "@type": "Country", name: "Uganda" },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "08:00",
      closes: "18:00",
    },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd) }}
        />
        <ClientMotionShell>{children}</ClientMotionShell>
      </body>
    </html>
  );
}

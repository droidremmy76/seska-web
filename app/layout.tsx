import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./inner-pages.css";
import { ClientMotionShell } from "@/components/providers/ClientMotionShell";

export const metadata: Metadata = {
  title: "Seska Investments Ltd | Digital Printing & Branding in Kampala",
  description: "Professional commercial printing, graphic design, large-format printing, signage, apparel branding and office stationery in Kampala, Uganda."
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#020817"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <ClientMotionShell>{children}</ClientMotionShell>
      </body>
    </html>
  );
}

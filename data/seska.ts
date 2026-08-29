export const SESKA_DATA = {
  colors: {
    white: "#FFFFFF",
    black: "#000000",
    obsidian: "#020817",
    cyan: "#00AEEF",
    magenta: "#FF007F",
    yellow: "#FFE600",
  },
  info: {
    address: "SS Plaza / A ONE Plaza, Nasser Road, Kampala, Uganda",
    whatsappFormatted: "+256 784 502 302",
    whatsappRaw: "256784502302",
    whatsappMessage: "Hello Seska Investments, I have a design/printing inquiry.",
    tagline: "Customer Satisfaction is Feature #1",
    experience: "20+ Years",
  },
  hero: {
    headline: "DIGITAL PRINTING AT ITS BEST.",
    subheadline:
      "Premium printing and branding from the heart of Kampala. From one urgent print job to thousands of commercial pieces, Seska Investments Ltd combines sharp colour reproduction, quality materials, professional finishing and fast turnaround to deliver work your business can confidently put its name on.",
    primaryCta: "Send Your Design",
    secondaryCta: "Get a Fast Quote",
    slides: [
      { image: "/media/large-format.svg", eyebrow: "Large Format / Vinyl / Signage", title: "BRANDING MADE TO BE SEEN." },
      { image: "/media/apparel.svg", eyebrow: "Corporate Apparel / Embroidery", title: "YOUR BRAND, WORN WELL." },
      { image: "/media/finishing.svg", eyebrow: "Commercial Print / Finishing", title: "PRINTED SHARP. FINISHED RIGHT." },
    ],
  },
  services: [
    {
      title: "Digital & Offset Printing",
      desc: "Fast, high-definition print production for everyday business needs and high-volume commercial jobs, with crisp colour, accurate finishing and dependable turnaround from Kampala.",
      items: ["Brochures", "Flyers", "Business Cards", "Corporate Stationery", "Books"],
    },
    {
      title: "Large-Format & Signage",
      desc: "High-impact outdoor and indoor branding produced with durable materials, sharp graphics and professional finishing for businesses that need to be seen clearly and consistently.",
      items: ["Teardrops", "Pull-Ups", "Billboards", "Vinyl Stickers", "3D Signs"],
    },
    {
      title: "Apparel & Merchandise Branding",
      desc: "Professional branding for uniforms, promotional apparel and corporate merchandise, combining durable application methods with clean, consistent brand presentation.",
      items: ["Screen Printing", "Embroidery", "T-Shirts", "Uniforms", "Caps"],
    },
    {
      title: "Office Stationery & PVC IDs",
      desc: "Practical, professional identity and office products built for daily business use, with durable materials, precise printing and reliable finishing.",
      items: ["Fargo IDs", "Lanyards", "Notebooks", "Rubber Stamps", "Access Cards"],
    },
    {
      title: "Creative Graphic Design",
      desc: "Production-ready design support for businesses that need strong visual identity, clean layouts and technically accurate files prepared for professional CMYK printing.",
      items: ["Brand Identity", "Vector Layout", "Prepress", "CMYK Separation", "Motion Graphics"],
    },
  ],
  work: [
    { title: "Large Format Production", category: "SIGNAGE / VINYL", image: "/media/large-format.svg" },
    { title: "Corporate Apparel", category: "EMBROIDERY / BRANDING", image: "/media/apparel.svg" },
    { title: "PVC & Proximity IDs", category: "IDENTIFICATION", image: "/media/pvc-ids.svg" },
    { title: "Print Finishing", category: "COMMERCIAL PRINT", image: "/media/finishing.svg" },
    { title: "Workshop & Production", category: "NASSER ROAD / KAMPALA", image: "/media/workshop.svg" },
    { title: "Corporate Merchandise", category: "PROMOTIONAL PRODUCTS", image: "/media/merchandise.svg" },
  ],
  process: [
    { title: "Share Design", desc: "Send artwork or work with our in-house designers on Nasser Road." },
    { title: "Make Payment", desc: "Confirm order specs and initiate deposit via Mobile Money or Bank." },
    { title: "Production", desc: "High-precision printing, colour matching and professional finishing on press." },
    { title: "Express Delivery", desc: "Pickup in Kampala or swift doorstep delivery across Uganda." },
  ],
} as const;

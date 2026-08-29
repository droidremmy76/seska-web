"use client";

import { FormEvent, useMemo, useState } from "react";
import { SESKA_DATA } from "@/data/seska";

const specialistServices = [
  "Website Design & Motion Graphics",
  "A0 / A1 / A2 Technical Plotting",
  "Awards, Plaques, Trophies & Medals",
  "Labels, Stickers & Vinyl Production",
  "Professional Print Finishing",
];

const artworkOptions = ["Artwork ready", "Need Seska design support", "Not sure yet"];
const deliveryOptions = ["Pickup on Nasser Road", "Delivery in Kampala", "Delivery outside Kampala", "To be confirmed"];

export default function QuoteComposer() {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [service, setService] = useState("Digital & Offset Printing");
  const [quantity, setQuantity] = useState("");
  const [deadline, setDeadline] = useState("");
  const [artwork, setArtwork] = useState(artworkOptions[0]);
  const [delivery, setDelivery] = useState(deliveryOptions[0]);
  const [details, setDetails] = useState("");

  const serviceOptions = useMemo(() => [...SESKA_DATA.services.map((item) => item.title), ...specialistServices], []);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = [
      "Hello Seska Investments, I would like a quotation.",
      "",
      `Name: ${name}`,
      company ? `Company / organisation: ${company}` : "",
      phone ? `Phone: ${phone}` : "",
      email ? `Email: ${email}` : "",
      `Service: ${service}`,
      quantity ? `Quantity / size: ${quantity}` : "",
      deadline ? `Required by: ${deadline}` : "",
      `Artwork: ${artwork}`,
      `Collection / delivery: ${delivery}`,
      details ? `Job details: ${details}` : "",
      "",
      "I can send the artwork/files here on WhatsApp after this message.",
    ].filter(Boolean).join("\n");
    window.open(`https://wa.me/${SESKA_DATA.info.whatsappRaw}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  }

  return (
    <form className="quote-form" onSubmit={submit}>
      <label><span>Your name</span><input value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" placeholder="Your name" /></label>
      <label><span>Company / organisation</span><input value={company} onChange={(e) => setCompany(e.target.value)} autoComplete="organization" placeholder="Optional" /></label>
      <label><span>Phone / WhatsApp</span><input value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" inputMode="tel" placeholder="e.g. +256..." /></label>
      <label><span>Email</span><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" placeholder="Optional" /></label>
      <label><span>Service</span><select value={service} onChange={(e) => setService(e.target.value)}>{serviceOptions.map((item) => <option key={item}>{item}</option>)}</select></label>
      <label><span>Quantity / size</span><input value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="e.g. 500 brochures, A4" /></label>
      <label><span>Required by</span><input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} /></label>
      <label><span>Artwork status</span><select value={artwork} onChange={(e) => setArtwork(e.target.value)}>{artworkOptions.map((item) => <option key={item}>{item}</option>)}</select></label>
      <label><span>Collection / delivery</span><select value={delivery} onChange={(e) => setDelivery(e.target.value)}>{deliveryOptions.map((item) => <option key={item}>{item}</option>)}</select></label>
      <label className="quote-form-wide"><span>Tell us about the job</span><textarea value={details} onChange={(e) => setDetails(e.target.value)} rows={6} placeholder="Material, colours, finishing, dimensions, delivery location, special instructions or anything else we should know." /></label>
      <div className="quote-form-wide quote-submit"><p>PDF, PSD, JPG, PNG, Word, PowerPoint, AI and EPS artwork can be attached in WhatsApp after the quotation request opens.</p><button type="submit">Build WhatsApp Request ↗</button></div>
    </form>
  );
}

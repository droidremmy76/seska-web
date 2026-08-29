"use client";

import { FormEvent, useState } from "react";
import { SESKA_DATA } from "@/data/seska";

export default function QuoteComposer() {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [service, setService] = useState("Digital & Offset Printing");
  const [quantity, setQuantity] = useState("");
  const [details, setDetails] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = [
      "Hello Seska Investments, I would like a quotation.",
      `Name: ${name}`,
      company ? `Company: ${company}` : "",
      `Service: ${service}`,
      quantity ? `Quantity: ${quantity}` : "",
      details ? `Details: ${details}` : "",
    ].filter(Boolean).join("\n");
    window.open(`https://wa.me/${SESKA_DATA.info.whatsappRaw}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  }

  return (
    <form className="quote-form" onSubmit={submit}>
      <label><span>Your name</span><input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Your name" /></label>
      <label><span>Company / organisation</span><input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Optional" /></label>
      <label><span>Service</span><select value={service} onChange={(e) => setService(e.target.value)}>{SESKA_DATA.services.map((item) => <option key={item.title}>{item.title}</option>)}</select></label>
      <label><span>Quantity / size</span><input value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="e.g. 500 brochures, A4" /></label>
      <label className="quote-form-wide"><span>Tell us about the job</span><textarea value={details} onChange={(e) => setDetails(e.target.value)} rows={6} placeholder="Material, finishing, deadline, delivery location, or any other details." /></label>
      <div className="quote-form-wide quote-submit"><p>You can send PDF, PSD, JPG, PNG, Word, PowerPoint, AI or EPS artwork directly in WhatsApp after opening the request.</p><button type="submit">Build WhatsApp Request ↗</button></div>
    </form>
  );
}

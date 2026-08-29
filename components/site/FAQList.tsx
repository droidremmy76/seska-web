type FAQItem = {
  question: string;
  answer: string;
};

type FAQListProps = {
  eyebrow?: string;
  title?: string;
  items: readonly FAQItem[];
};

export default function FAQList({ eyebrow = "COMMON QUESTIONS", title = "BEFORE PRODUCTION STARTS.", items }: FAQListProps) {
  return (
    <section className="inner-section faq-section">
      <div className="faq-heading">
        <span className="inner-label">{eyebrow}</span>
        <h2>{title}</h2>
      </div>
      <div className="faq-list">
        {items.map((item, index) => (
          <details key={item.question}>
            <summary>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{item.question}</strong>
              <b aria-hidden="true">+</b>
            </summary>
            <div className="faq-answer"><p>{item.answer}</p></div>
          </details>
        ))}
      </div>
    </section>
  );
}

export default function FAQItem({ faq, defaultOpen = false }) {
  return (
    <details className="faq-item" open={defaultOpen}>
      <summary>{faq.question}</summary>
      <p>{faq.answer}</p>
    </details>
  );
}

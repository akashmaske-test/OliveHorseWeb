import FAQItem from "../components/FAQItem.jsx";
import SectionHeading from "../components/SectionHeading.jsx";

export default function FAQ({ homepage, faqData }) {
  return (
    <section className="section" id={homepage.faqSection.id}>
      <div className="container">
        <SectionHeading section={homepage.faqSection} />
        <div className="faq-list">
          {faqData.faqs.map((faq, index) => (
            <FAQItem faq={faq} defaultOpen={index === 0} key={faq.question} />
          ))}
        </div>
      </div>
    </section>
  );
}

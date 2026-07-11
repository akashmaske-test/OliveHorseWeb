import BenefitCard from "../components/BenefitCard.jsx";
import SectionHeading from "../components/SectionHeading.jsx";

export default function Benefits({ homepage }) {
  return (
    <section className="section" id={homepage.benefits.id}>
      <div className="container">
        <SectionHeading section={homepage.benefits} />
        <div className="card-grid benefits-grid">
          {homepage.benefits.items.map((item) => (
            <BenefitCard item={item} key={item.title} />
          ))}
        </div>
      </div>
    </section>
  );
}

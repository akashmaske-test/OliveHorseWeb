import PricingCard from "../components/PricingCard.jsx";
import SectionHeading from "../components/SectionHeading.jsx";

export default function Pricing({ homepage }) {
  const pricing = homepage.pricing;

  return (
    <section className="section forest" id={pricing.id}>
      <div className="container">
        <SectionHeading section={pricing} />
        <div className="card-grid pricing-grid">
          {pricing.plans.map((plan) => (
            <PricingCard plan={plan} key={plan.name} />
          ))}
        </div>
        <p className="registration-note">{pricing.registrationNote}</p>
      </div>
    </section>
  );
}

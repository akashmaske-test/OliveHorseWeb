import Button from "./Button.jsx";

export default function PricingCard({ plan }) {
  return (
    <article className={`pricing-card${plan.featured ? " featured" : ""}`}>
      <h3>{plan.name}</h3>
      <div className="price">
        <strong>{plan.price}</strong>
        <span>{plan.billing}</span>
      </div>
      <p>{plan.description}</p>
      <ul className="feature-list">
        {plan.features.map((feature) => (
          <li key={feature}>{feature}</li>
        ))}
      </ul>
      <Button href="#trial-form" variant={plan.featured ? "primary" : "light"} small>
        {plan.cta}
      </Button>
    </article>
  );
}

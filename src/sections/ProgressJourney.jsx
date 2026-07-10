import SectionHeading from "../components/SectionHeading.jsx";

export default function ProgressJourney({ homepage }) {
  const journey = homepage.progressJourney;

  return (
    <section className="section ivory" id="progress-journey">
      <div className="container">
        <SectionHeading section={journey} />
        <div className="timeline">
          {journey.steps.map((step) => (
            <article className="timeline-card" key={step.number}>
              <span className="step-number">{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

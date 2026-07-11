import Button from "./Button.jsx";

export default function ProgrammeCard({ programme, image }) {
  return (
    <article className="card programme-card">
      <div className="card-media">
        <img src={image} alt={programme.name} loading="lazy" />
      </div>
      <div className="card-body">
        <div>
          <p className="meta">{programme.ageRange}</p>
          <h3>{programme.name}</h3>
        </div>
        <p>{programme.description}</p>
        <ul className="pill-row">
          {programme.level.map((item) => (
            <li className="pill" key={item}>
              {item}
            </li>
          ))}
        </ul>
        <ul className="feature-list">
          {programme.benefits.slice(0, 3).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="meta">{programme.price}</p>
        <Button href="#trial-form" variant="secondary" small>
          {programme.cta}
        </Button>
      </div>
    </article>
  );
}

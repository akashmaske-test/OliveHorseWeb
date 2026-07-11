import { imageMap } from "../data/siteData.js";

export default function Instructor({ homepage }) {
  const instructor = homepage.instructor;

  return (
    <section className="section" id="instructor">
      <div className="container split-grid">
        <div className="image-frame portrait-frame">
          <img src={imageMap.founder} alt={instructor.image.alt} loading="lazy" />
        </div>
        <div className="split-copy">
          <div>
            <p className="eyebrow">{instructor.eyebrow}</p>
            <h2>{instructor.heading}</h2>
          </div>
          <div>
            <p className="meta">{instructor.role}</p>
            <h3>{instructor.name}</h3>
          </div>
          {instructor.description.map((item) => (
            <p className="lede" key={item}>
              {item}
            </p>
          ))}
          <ul className="credentials">
            {instructor.credentials.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

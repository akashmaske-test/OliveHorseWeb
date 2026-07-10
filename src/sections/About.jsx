import { imageMap } from "../data/siteData.js";

export default function About({ homepage }) {
  const about = homepage.about;

  return (
    <section className="section ivory" id={about.id}>
      <div className="container split-grid">
        <div className="image-frame portrait-frame">
          <img src={imageMap.founder} alt={homepage.instructor.image.alt} loading="lazy" />
        </div>
        <div className="split-copy">
          <div>
            <p className="eyebrow">{about.eyebrow}</p>
            <h2>{about.heading}</h2>
          </div>
          {about.description.map((item) => (
            <p className="lede" key={item}>
              {item}
            </p>
          ))}
          <div className="highlight-grid">
            {about.highlights.map((item) => (
              <div className="highlight" key={item.label}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

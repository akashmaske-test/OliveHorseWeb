import Button from "../components/Button.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import { imageMap } from "../data/siteData.js";

export default function AgeGroups({ homepage }) {
  const section = homepage.ageGroups;

  return (
    <section className="section ivory" id="age-groups">
      <div className="container">
        <SectionHeading section={section} />
        <div className="card-grid age-grid">
          {section.groups.map((group) => (
            <article className="card age-card" key={group.title}>
              <div className="card-media">
                <img src={imageMap.ageGroups[group.title]} alt={group.title} loading="lazy" />
              </div>
              <div className="card-body">
                <div>
                  <p className="meta">{group.ageRange}</p>
                  <h3>{group.title}</h3>
                </div>
                <p>{group.description}</p>
                <Button href="#programmes" variant="secondary" small>
                  {group.cta}
                </Button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

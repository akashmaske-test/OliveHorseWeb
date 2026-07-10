export default function SectionHeading({ section, centered = false }) {
  return (
    <div className={`section-heading${centered ? " center" : ""}`}>
      <p className="eyebrow">{section.eyebrow}</p>
      <h2>{section.heading}</h2>
      {section.description ? <p className="lede">{section.description}</p> : null}
    </div>
  );
}

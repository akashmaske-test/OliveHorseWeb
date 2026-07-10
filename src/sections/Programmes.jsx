import ProgrammeCard from "../components/ProgrammeCard.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import { imageMap, programmeOrder } from "../data/siteData.js";

export default function Programmes({ homepage, programmeData }) {
  const programmesById = new Map(programmeData.programmes.map((programme) => [programme.id, programme]));

  return (
    <section className="section" id={homepage.programmesPreview.id}>
      <div className="container">
        <SectionHeading section={homepage.programmesPreview} />
        <div className="card-grid programmes-grid" id={programmeData.section.id}>
          {programmeOrder
            .map((id) => programmesById.get(id))
            .filter(Boolean)
            .map((programme) => (
              <ProgrammeCard programme={programme} image={imageMap.programmes[programme.id]} key={programme.id} />
            ))}
        </div>
      </div>
    </section>
  );
}

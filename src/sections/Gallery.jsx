import SectionHeading from "../components/SectionHeading.jsx";
import { imageMap } from "../data/siteData.js";

export default function Gallery({ homepage }) {
  const gallery = homepage.gallery;
  const fallbackAlts = [
    gallery.images[1]?.alt,
    gallery.images[4]?.alt,
    gallery.images[5]?.alt,
    gallery.images[0]?.alt,
    gallery.images[2]?.alt,
  ];

  return (
    <section className="section" id={gallery.id}>
      <div className="container">
        <SectionHeading section={gallery} />
        <div className="gallery-grid">
          {imageMap.gallery.map((src, index) => (
            <figure className={`gallery-item${index === 0 ? " tall" : ""}`} key={src}>
              <img src={src} alt={fallbackAlts[index] || gallery.heading} loading="lazy" />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

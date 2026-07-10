import Button from "../components/Button.jsx";
import { imageMap } from "../data/siteData.js";

export default function Hero({ homepage, business }) {
  const hero = homepage.hero;

  return (
    <section className="hero-section" id="hero">
      <div className="container hero-grid">
        <div className="hero-copy">
          <div>
            <p className="eyebrow">{hero.eyebrow}</p>
            <h1>{hero.heading}</h1>
            <p className="lede">{hero.description}</p>
          </div>
          <div className="button-row">
            <Button href={hero.primaryCTA.href}>{hero.primaryCTA.label}</Button>
            <Button href={hero.secondaryCTA.href} variant="secondary">
              {hero.secondaryCTA.label}
            </Button>
            <Button href={hero.whatsappCTA.href} variant="whatsapp" className="hero-whatsapp">
              {hero.whatsappCTA.label}
            </Button>
          </div>
          <ul className="trust-list">
            {hero.trustPoints.map((point) => (
              <li key={point}>
                <span className="check-dot">✓</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="hero-media">
          <div className="image-frame hero-image">
            <img src={imageMap.hero} alt={hero.image.alt} />
          </div>
          <div className="stat-ribbon">
            <strong>{business.brand.foundedYear}</strong>
            <span>{business.socialProof.reviewCountLabel}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

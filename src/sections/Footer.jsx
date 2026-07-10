import { imageMap } from "../data/siteData.js";

export default function Footer({ homepage, business }) {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <a className="brand-link" href="#main">
              <img className="brand-logo" src={imageMap.logo} alt={homepage.navigation.logoAlt} />
              <span className="brand-copy">
                <span className="brand-name">{business.brand.name}</span>
                <span className="brand-tagline">{business.brand.tagline}</span>
              </span>
            </a>
            <p>{homepage.footer.description}</p>
          </div>
          <nav className="footer-links" aria-label="Footer navigation">
            {homepage.footer.quickLinks.map((item) => (
              <a href={item.href} key={item.href}>
                {item.label}
              </a>
            ))}
            {homepage.footer.legalLinks.map((item) => (
              <a href={item.href} key={item.href}>
                {item.label}
              </a>
            ))}
          </nav>
        </div>
        <div className="footer-bottom">
          <span>{homepage.footer.copyright}</span>
          <span className="social-links">
            <a href={business.contact.instagram}>Instagram</a>
            <a href={business.contact.facebook}>Facebook</a>
          </span>
        </div>
      </div>
    </footer>
  );
}

import { useEffect, useState } from "react";
import Button from "../components/Button.jsx";
import { imageMap } from "../data/siteData.js";

export default function Header({ homepage, business }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("drawer-open", drawerOpen);
    return () => document.body.classList.remove("drawer-open");
  }, [drawerOpen]);

  const closeDrawer = () => setDrawerOpen(false);

  return (
    <header className="site-header">
      <div className="nav-shell">
        <a className="brand-link" href="#main" aria-label={homepage.navigation.logoAlt} onClick={closeDrawer}>
          <img className="brand-logo" src={imageMap.logo} alt={homepage.navigation.logoAlt} />
          <span className="brand-copy">
            <span className="brand-name">{business.brand.name}</span>
            <span className="brand-tagline">{business.brand.tagline}</span>
          </span>
        </a>
        <nav className="nav-links" aria-label="Primary navigation">
          {homepage.navigation.items.map((item) => (
            <a className="nav-link" href={item.href} key={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <Button href={homepage.navigation.cta.href} className="desktop-cta">
          {homepage.navigation.cta.label}
        </Button>
        <button
          className="drawer-toggle"
          type="button"
          aria-controls="mobile-drawer"
          aria-expanded={drawerOpen}
          aria-label="Menu"
          onClick={() => setDrawerOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
      <nav className={`mobile-drawer${drawerOpen ? " open" : ""}`} id="mobile-drawer" aria-label="Mobile navigation">
        {homepage.navigation.items.map((item) => (
          <a href={item.href} key={item.href} onClick={closeDrawer}>
            {item.label}
          </a>
        ))}
        <Button href={homepage.navigation.cta.href} onClick={closeDrawer}>
          {homepage.navigation.cta.label}
        </Button>
      </nav>
    </header>
  );
}

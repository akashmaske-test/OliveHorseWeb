import { useEffect, useState } from "react";
import Button from "../components/Button.jsx";
import { imageMap } from "../data/siteData.js";

function BlogIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 3.75h11a2.25 2.25 0 0 1 2.25 2.25v14.25H7.25A2.25 2.25 0 0 1 5 18V3.75Z" />
      <path d="M8.5 8h6.5M8.5 12h6.5M8.5 16h4" />
    </svg>
  );
}

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
        <a className="blog-nav-link" href="/blog/" aria-label="Read OliveHorse blog resources">
          <BlogIcon />
          <span>Blog</span>
        </a>
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
        <a className="blog-mobile-link" href="/blog/" onClick={closeDrawer}>
          <BlogIcon />
          Blog and resources
        </a>
        <Button href={homepage.navigation.cta.href} onClick={closeDrawer}>
          {homepage.navigation.cta.label}
        </Button>
      </nav>
    </header>
  );
}

import React from "react";
import { imageMap, siteData } from "../data/siteData.js";

function StaticHeader() {
  const { business, homepage } = siteData;

  return (
    <header className="site-header">
      <div className="nav-shell">
        <a className="brand-link" href="/" aria-label={homepage.navigation.logoAlt}>
          <img className="brand-logo" src={imageMap.logo} alt={homepage.navigation.logoAlt} />
          <span className="brand-copy">
            <span className="brand-name">{business.brand.name}</span>
            <span className="brand-tagline">{business.brand.tagline}</span>
          </span>
        </a>
        <nav className="static-nav-links" aria-label="Primary navigation">
          <a className="nav-link" href="/">Home</a>
          <a className="nav-link static-nav-detail" href="/#programmes">Programmes</a>
          <a className="nav-link" href="/blog/">Blog</a>
          <a className="nav-link static-nav-detail" href="/#contact">Contact</a>
        </nav>
        <a className="btn btn-primary btn-small static-header-cta" href="/#trial-form">{homepage.navigation.cta.label}</a>
      </div>
    </header>
  );
}

function StaticFooter() {
  const { business, homepage } = siteData;
  const homepageLink = (href) => (href.startsWith("#") ? `/${href}` : href);

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <a className="brand-link" href="/" aria-label={homepage.navigation.logoAlt}>
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
              <a href={homepageLink(item.href)} key={item.href}>{item.label}</a>
            ))}
            <a href="/blog/">Blog</a>
            {homepage.footer.legalLinks.map((item) => (
              <a href={homepageLink(item.href)} key={item.href}>{item.label}</a>
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

export function BlogIndexPage({ posts }) {
  return (
    <>
      <StaticHeader />
      <main id="main" className="section">
        <div className="container">
          <p className="eyebrow">OliveHorse Resources</p>
          <h1>Karate and Self-Defence Resources</h1>
          <p className="lede">Helpful guidance about choosing and getting started with Karate and self-defence training.</p>
          {posts.length ? (
            <div className="card-grid">
              {posts.map((post) => (
                <article className="card card-body" key={post.slug}>
                  <p className="meta">{post.date}</p>
                  <h2><a href={`/blog/${post.slug}/`}>{post.title}</a></h2>
                  <p>{post.description}</p>
                  <a className="btn btn-secondary btn-small" href={`/blog/${post.slug}/`}>Read article</a>
                </article>
              ))}
            </div>
          ) : (
            <p>No articles have been published yet. Please check back soon.</p>
          )}
        </div>
      </main>
      <StaticFooter />
    </>
  );
}

export function ArticlePage({ post, relatedPosts }) {
  return (
    <>
      <StaticHeader />
      <main id="main" className="section">
        <article className="container blog-article">
          <nav className="breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span><a href="/blog/">Resources</a><span aria-hidden="true">/</span><span>{post.title}</span></nav>
          <p className="eyebrow">Karate resources</p>
          <h1>{post.title}</h1>
          <p className="lede">{post.description}</p>
          <p className="meta">{post.date} · {post.readingTime} min read</p>
          <div className="blog-content" dangerouslySetInnerHTML={{ __html: post.html }} />
          {relatedPosts.length ? <section aria-labelledby="related-heading"><h2 id="related-heading">Related resources</h2><ul>{relatedPosts.map((item) => <li key={item.slug}><a href={`/blog/${item.slug}/`}>{item.title}</a></li>)}</ul></section> : null}
        </article>
      </main>
      <StaticFooter />
    </>
  );
}

export function LegalPage({ title, children }) {
  return (
    <>
      <StaticHeader />
      <main id="main" className="section"><article className="container blog-article"><h1>{title}</h1>{children}</article></main>
      <StaticFooter />
    </>
  );
}

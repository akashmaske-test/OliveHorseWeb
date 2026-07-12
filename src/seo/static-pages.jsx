function StaticHeader() {
  return (
    <header className="site-header">
      <div className="nav-shell">
        <a className="brand-link" href="/" aria-label="OliveHorse Fitness Academy">
          <span className="brand-copy">
            <span className="brand-name">OliveHorse Fitness Academy</span>
            <span className="brand-tagline">Discipline. Strength. Confidence.</span>
          </span>
        </a>
        <nav className="nav-links" aria-label="Primary navigation">
          <a className="nav-link" href="/">Home</a>
          <a className="nav-link" href="/blog/">Resources</a>
        </nav>
      </div>
    </header>
  );
}

function StaticFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-bottom">
        <span>© OliveHorse Fitness Academy. All rights reserved.</span>
        <span className="social-links">
          <a href="/privacy-policy/">Privacy Policy</a>
          <a href="/terms/">Terms and Conditions</a>
        </span>
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
          {post.featured_image ? <figure className="blog-featured-image"><img src={post.featured_image} alt={post.featured_image_alt || ""} loading="eager" /></figure> : null}
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
import React from "react";

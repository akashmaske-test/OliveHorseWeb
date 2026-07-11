import fs from "node:fs";
import path from "node:path";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { siteData } from "../src/data/siteData.js";
import { ArticlePage, BlogIndexPage, LegalPage } from "../src/seo/static-pages.jsx";
import { absoluteUrl, breadcrumbSchema, organizationSchema, pageMetadata, serviceSchemas, staticPages, websiteSchema } from "../src/seo/site.js";
import { readBlogPosts } from "../src/blog/content.js";

const dist = path.resolve("dist");
const template = fs.readFileSync(path.join(dist, "index.html"), "utf8");
const posts = readBlogPosts();

function esc(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function headFor(metadata, schemas = []) {
  const jsonLd = schemas.map((schema) => `<script type="application/ld+json">${JSON.stringify(schema).replaceAll("<", "\\u003c")}</script>`).join("\n    ");
  return `\n    <title>${esc(metadata.title)}</title>\n    <meta name="description" content="${esc(metadata.description)}" />\n    <meta name="robots" content="${metadata.robots}" />\n    <link rel="canonical" href="${metadata.canonical}" />\n    <meta property="og:title" content="${esc(metadata.ogTitle)}" />\n    <meta property="og:description" content="${esc(metadata.ogDescription)}" />\n    <meta property="og:url" content="${metadata.ogUrl}" />\n    <meta property="og:type" content="website" />\n    <meta name="twitter:card" content="summary" />\n    ${jsonLd}`;
}

function renderDocument({ pathname, metadata, markup, schemas, interactive = false, clientScript = false }) {
  let html = template
    .replace(/<title>[\s\S]*?<\/title>/, "")
    .replace(/\s*<meta name="description"[^>]*>/, "")
    .replace(/\s*<meta property="og:title"[^>]*>/, "")
    .replace(/\s*<meta property="og:description"[^>]*>/, "")
    .replace(/\s*<meta property="og:image"[^>]*>/, "")
    .replace("<head>", `<head>${headFor(metadata, schemas)}`)
    .replace("<div id=\"root\"></div>", `<div id="root"${interactive ? " data-prerendered=\"true\"" : ""}>${markup}</div>`);
  if (!clientScript) html = html.replace(/\s*<script type="module"[^>]*><\/script>/, "");
  return html;
}

function writeRoute(route, html) {
  const output = route === "/" ? path.join(dist, "index.html") : path.join(dist, route.replace(/^\//, ""), "index.html");
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, html);
}

function homeMarkup() {
  const { homepage, programmes, business } = siteData;
  const verifiedHeroDescription = "Structured Karate, fitness and practical self-defence programmes for children, teenagers, adults and women in a supportive training environment.";
  const programmeCards = programmes.programmes.slice(0, 6).map((programme) => `<article class="card card-body"><h2>${esc(programme.shortName)}</h2><p>${esc(programme.description)}</p><a class="btn btn-secondary btn-small" href="#trial-form">${esc(programme.cta)}</a></article>`).join("");
  return `<a class="skip-link" href="#main">Skip to content</a><header class="site-header"><div class="nav-shell"><a class="brand-link" href="/" aria-label="${esc(business.brand.name)}"><span class="brand-copy"><span class="brand-name">${esc(business.brand.name)}</span><span class="brand-tagline">${esc(business.brand.tagline)}</span></span></a><nav class="nav-links" aria-label="Primary navigation"><a class="nav-link" href="#about">About</a><a class="nav-link" href="#programmes">Programmes</a><a class="nav-link" href="#contact">Contact</a><a class="nav-link" href="/blog/">Resources</a></nav></div></header><main id="main"><section class="hero"><div class="container"><p class="eyebrow">${esc(homepage.hero.eyebrow)}</p><h1>${esc(homepage.hero.heading)}</h1><p class="lede">${esc(verifiedHeroDescription)}</p><a class="btn btn-primary" href="#trial-form">${esc(homepage.hero.primaryCTA.label)}</a></div></section><section class="section ivory" id="programmes"><div class="container"><p class="eyebrow">${esc(homepage.programmesPreview.eyebrow)}</p><h2>${esc(homepage.programmesPreview.heading)}</h2><p class="lede">${esc(homepage.programmesPreview.description)}</p><div class="card-grid">${programmeCards}</div></div></section><section class="section" id="about"><div class="container"><p class="eyebrow">${esc(homepage.about.eyebrow)}</p><h2>${esc(homepage.about.heading)}</h2>${homepage.about.description.map((paragraph) => `<p class="lede">${esc(paragraph)}</p>`).join("")}</div></section><section class="section orange" id="trial-form"><div class="container"><p class="eyebrow">${esc(homepage.trialForm.eyebrow)}</p><h2>${esc(homepage.trialForm.heading)}</h2><p class="lede">${esc(homepage.trialForm.description)}</p><p>Contact OliveHorse Fitness Academy directly to discuss an introductory trial class.</p></div></section><section class="section" id="contact"><div class="container"><p class="eyebrow">${esc(homepage.contact.eyebrow)}</p><h2>${esc(homepage.contact.heading)}</h2><p class="lede">${esc(homepage.contact.description)}</p></div></section></main><footer class="site-footer"><div class="container footer-bottom"><span>© OliveHorse Fitness Academy. All rights reserved.</span><span class="social-links"><a href="/privacy-policy/">Privacy Policy</a><a href="/terms/">Terms and Conditions</a></span></div></footer>`;
}

const homeMetadata = pageMetadata("/", staticPages["/"]);
writeRoute("/", renderDocument({
  pathname: "/",
  metadata: homeMetadata,
  markup: homeMarkup(),
  interactive: false,
  clientScript: true,
  schemas: [organizationSchema(), websiteSchema(), ...serviceSchemas(siteData.programmes)],
}));

writeRoute("/blog/", renderDocument({
  pathname: "/blog/",
  metadata: pageMetadata("/blog/", staticPages["/blog/"]),
  markup: renderToStaticMarkup(<BlogIndexPage posts={posts} />),
  schemas: [organizationSchema(), websiteSchema(), breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Resources", path: "/blog/" }])],
}));

posts.forEach((post) => {
  const route = `/blog/${post.slug}/`;
  const metadata = pageMetadata(route, {
    title: post.title,
    description: post.description,
    indexable: true,
    ogTitle: post.title,
    ogDescription: post.description,
  });
  const relatedPosts = posts.filter((item) => item.slug !== post.slug).slice(0, 3);
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    ...(post.updated_date ? { dateModified: post.updated_date } : {}),
    author: { "@type": "Organization", name: post.author },
    mainEntityOfPage: metadata.canonical,
  };
  writeRoute(route, renderDocument({
    pathname: route,
    metadata,
    markup: renderToStaticMarkup(<ArticlePage post={post} relatedPosts={relatedPosts} />),
    schemas: [organizationSchema(), breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Resources", path: "/blog/" }, { name: post.title, path: route }]), articleSchema],
  }));
});

const privacyMarkup = renderToStaticMarkup(<LegalPage title="Privacy Policy"><p>This website may collect the information you submit through its enquiry form to respond to your request. Do not submit sensitive personal information through the form.</p><p>For questions about personal information submitted through this website, contact the academy using the published contact options.</p></LegalPage>);
const termsMarkup = renderToStaticMarkup(<LegalPage title="Terms and Conditions"><p>Website information is provided for general information about OliveHorse Fitness Academy programmes. Class availability, schedules and enrolment arrangements should be confirmed directly with the academy.</p><p>Website visitors must not misuse the site or its enquiry form.</p></LegalPage>);
writeRoute("/privacy-policy/", renderDocument({ pathname: "/privacy-policy/", metadata: pageMetadata("/privacy-policy/", staticPages["/privacy-policy/"]), markup: privacyMarkup, schemas: [organizationSchema()] }));
writeRoute("/terms/", renderDocument({ pathname: "/terms/", metadata: pageMetadata("/terms/", staticPages["/terms/"]), markup: termsMarkup, schemas: [organizationSchema()] }));

const sitemapUrls = ["/", "/blog/", ...posts.map((post) => `/blog/${post.slug}/`)];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls.map((route) => `  <url><loc>${absoluteUrl(route)}</loc></url>`).join("\n")}\n</urlset>\n`;
fs.writeFileSync(path.join(dist, "sitemap.xml"), sitemap);
fs.writeFileSync(path.join(dist, "robots.txt"), `User-agent: *\nAllow: /\nDisallow: /seo-automation/\nSitemap: ${absoluteUrl("/sitemap.xml")}\n`);
fs.writeFileSync(path.join(dist, "404.html"), renderDocument({ pathname: "/404", metadata: pageMetadata("/404", { title: "Page Not Found | OliveHorse Fitness Academy", description: "The requested page could not be found.", indexable: false }), markup: "<main class=\"section\"><div class=\"container\"><h1>Page not found</h1><p>The page you requested does not exist.</p><p><a href=\"/\">Return home</a></p></div></main>", schemas: [] }));
console.log(`Prerendered ${posts.length + 4} public pages and generated sitemap.xml and robots.txt.`);

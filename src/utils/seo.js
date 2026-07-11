import { absoluteUrl, organizationSchema, SITE_URL, websiteSchema } from "../seo/site.js";

function upsert(selector, tagName, attributes) {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement(tagName);
    document.head.appendChild(element);
  }
  Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
}

export function applySeo(homepage) {
  document.title = homepage.seo.title;
  document.querySelector('meta[name="description"]')?.setAttribute("content", homepage.seo.description);
  document.querySelector('meta[property="og:title"]')?.setAttribute("content", homepage.seo.ogTitle);
  document.querySelector('meta[property="og:description"]')?.setAttribute("content", homepage.seo.ogDescription);
  upsert('meta[property="og:url"]', "meta", { property: "og:url", content: SITE_URL });
  upsert('meta[name="twitter:card"]', "meta", { name: "twitter:card", content: "summary" });
  upsert('link[rel="canonical"]', "link", { rel: "canonical", href: absoluteUrl("/") });
  upsert('meta[name="robots"]', "meta", { name: "robots", content: "index,follow" });

  document.querySelectorAll('script[data-schema="olivehorse"]').forEach((script) => script.remove());

  [organizationSchema(), websiteSchema()].forEach((schema) => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.dataset.schema = "olivehorse";
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  });
}

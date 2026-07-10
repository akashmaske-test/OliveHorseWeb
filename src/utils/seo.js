import { imageMap } from "../data/siteData.js";

export function localBusinessSchema(homepage, business) {
  const address = business.contact.address;

  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "SportsActivityLocation"],
    name: business.brand.name,
    description: homepage.seo.description,
    telephone: business.contact.phone,
    email: business.contact.email,
    url: window.location.href,
    foundingDate: String(business.brand.foundedYear),
    address: {
      "@type": "PostalAddress",
      streetAddress: [address.line1, address.line2].filter(Boolean).join(", "),
      addressLocality: address.city,
      addressRegion: address.state,
      postalCode: address.postalCode,
      addressCountry: address.country,
    },
    areaServed: business.serviceAreas,
    image: `${window.location.origin}${imageMap.hero}`,
  };
}

export function faqSchema(faqData) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqData.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function applySeo(homepage, business, faqData) {
  document.title = homepage.seo.title;
  document.querySelector('meta[name="description"]')?.setAttribute("content", homepage.seo.description);
  document.querySelector('meta[property="og:title"]')?.setAttribute("content", homepage.seo.ogTitle);
  document.querySelector('meta[property="og:description"]')?.setAttribute("content", homepage.seo.ogDescription);
  document.querySelector('meta[property="og:image"]')?.setAttribute("content", imageMap.hero);

  document.querySelectorAll('script[data-schema="olivehorse"]').forEach((script) => script.remove());

  [localBusinessSchema(homepage, business), faqSchema(faqData)].forEach((schema) => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.dataset.schema = "olivehorse";
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  });
}

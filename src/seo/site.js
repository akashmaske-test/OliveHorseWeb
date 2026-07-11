export const SITE_URL = "https://olivehorsefitness.vercel.app";
export const SITE_NAME = "OliveHorse Fitness Academy";
export const SITE_LANGUAGE = "en";
export const GOOGLE_SITE_VERIFICATION = "eWZ2ylVUXkZJ7_QKkdXPWqOGkLdHK7YMHNWkwk3kS_M";

export function absoluteUrl(pathname = "/") {
  return new URL(pathname, `${SITE_URL}/`).toString();
}

export const staticPages = {
  "/": {
    title: "Karate Classes in Santacruz, Mumbai | OliveHorse Fitness Academy",
    description:
      "Karate, fitness and practical self-defence programmes for children, teenagers, adults and women in Santacruz, Mumbai. Enquire about a free trial class.",
    indexable: true,
  },
  "/blog/": {
    title: "Karate and Self-Defence Resources | OliveHorse Fitness Academy",
    description:
      "Practical articles about Karate, self-defence, fitness and choosing the right training programme in Santacruz, Mumbai.",
    indexable: true,
  },
  "/privacy-policy/": {
    title: "Privacy Policy | OliveHorse Fitness Academy",
    description: "Privacy information for OliveHorse Fitness Academy website visitors and enquiry-form users.",
    indexable: false,
  },
  "/terms/": {
    title: "Terms and Conditions | OliveHorse Fitness Academy",
    description: "Website terms and conditions for OliveHorse Fitness Academy.",
    indexable: false,
  },
};

export function pageMetadata(pathname, page) {
  const canonical = absoluteUrl(pathname);
  return {
    ...page,
    canonical,
    robots: page.indexable ? "index,follow" : "noindex,follow",
    ogTitle: page.ogTitle || page.title,
    ogDescription: page.ogDescription || page.description,
    ogUrl: canonical,
    language: SITE_LANGUAGE,
  };
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: absoluteUrl("/"),
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: absoluteUrl("/"),
    inLanguage: SITE_LANGUAGE,
  };
}

export function breadcrumbSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function serviceSchemas(programmes) {
  return programmes.programmes.map((programme) => ({
    "@context": "https://schema.org",
    "@type": "Service",
    name: programme.name,
    description: programme.description,
    provider: {
      "@type": "Organization",
      name: SITE_NAME,
      url: absoluteUrl("/"),
    },
  }));
}

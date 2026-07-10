const IMAGE_MAP = {
  logo: "public/images/01-logo.png",
  founder: "public/images/02-founder-pravin-nawale.png",
  hero: "public/images/03-group-training-session.png",
  programmes: {
    "kids-beginner-karate": "public/images/04-kids-karate-class.png",
    "teen-karate-fitness": "public/images/05-teen-karate-class.png",
    "adult-karate-self-defence": "public/images/06-adult-karate-class.png",
    "womens-self-defence": "public/images/07-womens-self-defence.png",
    "private-karate-coaching": "public/images/08-private-coaching.png",
    "competition-karate-training": "public/images/09-competition-training.png",
  },
  ageGroups: {
    Children: "public/images/04-kids-karate-class.png",
    Teenagers: "public/images/05-teen-karate-class.png",
    Adults: "public/images/06-adult-karate-class.png",
    Women: "public/images/07-womens-self-defence.png",
  },
  gallery: [
    "public/images/09-competition-training.png",
    "public/images/10-belt-examination.png",
    "public/images/11-group-achievement.png",
    "public/images/12-academy-interior.png",
    "public/images/03-group-training-session.png",
  ],
};

const PROGRAMME_ORDER = [
  "kids-beginner-karate",
  "teen-karate-fitness",
  "adult-karate-self-defence",
  "womens-self-defence",
  "private-karate-coaching",
  "competition-karate-training",
];

const ICONS = {
  focus: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="7"></circle><circle cx="12" cy="12" r="3"></circle><path d="M12 2v3M12 19v3M2 12h3M19 12h3"></path></svg>',
  shield: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6l7-3z"></path><path d="M9 12l2 2 4-5"></path></svg>',
  strength: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 8v8M18 8v8M3 10v4M21 10v4M6 12h12"></path></svg>',
  confidence: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l2.7 5.5 6.1.9-4.4 4.3 1 6.1L12 16.9 6.6 19.8l1-6.1-4.4-4.3 6.1-.9L12 3z"></path></svg>',
  flexibility: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 21c4-2 7-6 8-11"></path><path d="M15 10l4 4"></path><path d="M13 4a2 2 0 1 0 4 0 2 2 0 0 0-4 0"></path><path d="M5 12c3-2 6-3 10-2"></path></svg>',
  progress: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19h16"></path><path d="M6 16l4-4 3 3 5-7"></path><path d="M18 8h-4M18 8v4"></path></svg>',
};

const app = document.getElementById("app");

async function getJson(path) {
  const response = await fetch(path, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Unable to load ${path}`);
  }
  return response.json();
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function attr(value = "") {
  return escapeHtml(value);
}

function telHref(phone = "") {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

function whatsappHref(phone = "") {
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/${digits}`;
}

function addressText(address) {
  return [
    address.academy,
    address.line1,
    address.line2,
    address.area,
    address.city,
    address.state,
    address.postalCode,
    address.country,
  ]
    .filter(Boolean)
    .join(", ");
}

function initials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function sectionHeading(section, centered = false) {
  return `
    <div class="section-heading${centered ? " center" : ""}">
      <p class="eyebrow">${escapeHtml(section.eyebrow)}</p>
      <h2>${escapeHtml(section.heading)}</h2>
      ${section.description ? `<p class="lede">${escapeHtml(section.description)}</p>` : ""}
    </div>
  `;
}

function button(cta, variant = "primary", extraClass = "") {
  if (!cta) return "";
  const label = typeof cta === "string" ? cta : cta.label;
  const href = typeof cta === "string" ? "#trial-form" : cta.href;
  return `<a class="btn btn-${variant} ${extraClass}" href="${attr(href)}">${escapeHtml(label)}</a>`;
}

function renderHeader(homepage, business) {
  const navItems = homepage.navigation.items
    .map((item) => `<a class="nav-link" href="${attr(item.href)}">${escapeHtml(item.label)}</a>`)
    .join("");

  const mobileItems = homepage.navigation.items
    .map((item) => `<a href="${attr(item.href)}">${escapeHtml(item.label)}</a>`)
    .join("");

  return `
    <header class="site-header">
      <div class="nav-shell">
        <a class="brand-link" href="#main" aria-label="${attr(homepage.navigation.logoAlt)}">
          <img class="brand-logo" src="${IMAGE_MAP.logo}" alt="${attr(homepage.navigation.logoAlt)}" />
          <span class="brand-copy">
            <span class="brand-name">${escapeHtml(business.brand.name)}</span>
            <span class="brand-tagline">${escapeHtml(business.brand.tagline)}</span>
          </span>
        </a>
        <nav class="nav-links" aria-label="Primary navigation">${navItems}</nav>
        ${button(homepage.navigation.cta, "primary", "desktop-cta")}
        <button class="drawer-toggle" type="button" aria-controls="mobile-drawer" aria-expanded="false" aria-label="Menu">
          <span></span><span></span><span></span>
        </button>
      </div>
      <nav class="mobile-drawer" id="mobile-drawer" aria-label="Mobile navigation">
        ${mobileItems}
        ${button(homepage.navigation.cta, "primary")}
      </nav>
    </header>
  `;
}

function renderHero(homepage, business) {
  const hero = homepage.hero;
  const trust = hero.trustPoints
    .map((point) => `<li><span class="check-dot">✓</span><span>${escapeHtml(point)}</span></li>`)
    .join("");

  return `
    <section class="hero-section" id="hero">
      <div class="container hero-grid">
        <div class="hero-copy">
          <div>
            <p class="eyebrow">${escapeHtml(hero.eyebrow)}</p>
            <h1>${escapeHtml(hero.heading)}</h1>
            <p class="lede">${escapeHtml(hero.description)}</p>
          </div>
          <div class="button-row">
            ${button(hero.primaryCTA, "primary")}
            ${button(hero.secondaryCTA, "secondary")}
            ${button(hero.whatsappCTA, "whatsapp", "hero-whatsapp")}
          </div>
          <ul class="trust-list">${trust}</ul>
        </div>
        <div class="hero-media">
          <div class="image-frame hero-image">
            <img src="${IMAGE_MAP.hero}" alt="${attr(hero.image.alt)}" />
          </div>
          <div class="stat-ribbon">
            <strong>${escapeHtml(String(business.brand.foundedYear))}</strong>
            <span>${escapeHtml(business.socialProof.reviewCountLabel)}</span>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderProgrammes(homepage, programmeData) {
  const programmes = new Map(programmeData.programmes.map((programme) => [programme.id, programme]));
  const cards = PROGRAMME_ORDER.map((id) => programmes.get(id))
    .filter(Boolean)
    .map((programme) => {
      const level = programme.level.map((item) => `<li class="pill">${escapeHtml(item)}</li>`).join("");
      const benefits = programme.benefits
        .slice(0, 3)
        .map((item) => `<li>${escapeHtml(item)}</li>`)
        .join("");

      return `
        <article class="card programme-card">
          <div class="card-media">
            <img src="${IMAGE_MAP.programmes[programme.id]}" alt="${attr(programme.name)}" loading="lazy" />
          </div>
          <div class="card-body">
            <div>
              <p class="meta">${escapeHtml(programme.ageRange)}</p>
              <h3>${escapeHtml(programme.name)}</h3>
            </div>
            <p>${escapeHtml(programme.description)}</p>
            <ul class="pill-row">${level}</ul>
            <ul class="feature-list">${benefits}</ul>
            <p class="meta">${escapeHtml(programme.price)}</p>
            ${button({ label: programme.cta, href: "#trial-form" }, "secondary", "btn-small")}
          </div>
        </article>
      `;
    })
    .join("");

  return `
    <section class="section" id="${attr(homepage.programmesPreview.id)}">
      <div class="container">
        ${sectionHeading(homepage.programmesPreview)}
        <div class="card-grid programmes-grid" id="${attr(programmeData.section.id)}">${cards}</div>
      </div>
    </section>
  `;
}

function renderAbout(homepage) {
  const about = homepage.about;
  const paragraphs = about.description.map((item) => `<p class="lede">${escapeHtml(item)}</p>`).join("");
  const highlights = about.highlights
    .map(
      (item) => `
        <div class="highlight">
          <strong>${escapeHtml(item.value)}</strong>
          <span>${escapeHtml(item.label)}</span>
        </div>
      `,
    )
    .join("");

  return `
    <section class="section ivory" id="${attr(about.id)}">
      <div class="container split-grid">
        <div class="image-frame portrait-frame">
          <img src="${IMAGE_MAP.founder}" alt="${attr(homepage.instructor.image.alt)}" loading="lazy" />
        </div>
        <div class="split-copy">
          <div>
            <p class="eyebrow">${escapeHtml(about.eyebrow)}</p>
            <h2>${escapeHtml(about.heading)}</h2>
          </div>
          ${paragraphs}
          <div class="highlight-grid">${highlights}</div>
        </div>
      </div>
    </section>
  `;
}

function renderBenefits(homepage) {
  const items = homepage.benefits.items
    .map(
      (item) => `
        <article class="benefit-card">
          <span class="icon-badge">${ICONS[item.icon] || ICONS.progress}</span>
          <div class="card-body">
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.description)}</p>
          </div>
        </article>
      `,
    )
    .join("");

  return `
    <section class="section" id="${attr(homepage.benefits.id)}">
      <div class="container">
        ${sectionHeading(homepage.benefits)}
        <div class="card-grid benefits-grid">${items}</div>
      </div>
    </section>
  `;
}

function renderAgeGroups(homepage) {
  const section = homepage.ageGroups;
  const cards = section.groups
    .map(
      (group) => `
        <article class="card age-card">
          <div class="card-media">
            <img src="${IMAGE_MAP.ageGroups[group.title]}" alt="${attr(group.title)}" loading="lazy" />
          </div>
          <div class="card-body">
            <div>
              <p class="meta">${escapeHtml(group.ageRange)}</p>
              <h3>${escapeHtml(group.title)}</h3>
            </div>
            <p>${escapeHtml(group.description)}</p>
            ${button({ label: group.cta, href: "#programmes" }, "secondary", "btn-small")}
          </div>
        </article>
      `,
    )
    .join("");

  return `
    <section class="section ivory" id="age-groups">
      <div class="container">
        ${sectionHeading(section)}
        <div class="card-grid age-grid">${cards}</div>
      </div>
    </section>
  `;
}

function renderInstructor(homepage) {
  const instructor = homepage.instructor;
  const paragraphs = instructor.description.map((item) => `<p class="lede">${escapeHtml(item)}</p>`).join("");
  const credentials = instructor.credentials.map((item) => `<li>${escapeHtml(item)}</li>`).join("");

  return `
    <section class="section" id="instructor">
      <div class="container split-grid">
        <div class="image-frame portrait-frame">
          <img src="${IMAGE_MAP.founder}" alt="${attr(instructor.image.alt)}" loading="lazy" />
        </div>
        <div class="split-copy">
          <div>
            <p class="eyebrow">${escapeHtml(instructor.eyebrow)}</p>
            <h2>${escapeHtml(instructor.heading)}</h2>
          </div>
          <div>
            <p class="meta">${escapeHtml(instructor.role)}</p>
            <h3>${escapeHtml(instructor.name)}</h3>
          </div>
          ${paragraphs}
          <ul class="credentials">${credentials}</ul>
        </div>
      </div>
    </section>
  `;
}

function renderSchedule(homepage) {
  const schedule = homepage.schedule;
  const rows = schedule.batches
    .map(
      (batch) => `
        <tr>
          <td>${escapeHtml(batch.group)}</td>
          <td>${escapeHtml(batch.days)}</td>
          <td>${escapeHtml(batch.time)}</td>
          <td>${escapeHtml(batch.availability)}</td>
        </tr>
      `,
    )
    .join("");

  const cards = schedule.batches
    .map(
      (batch) => `
        <article class="schedule-card">
          <h3>${escapeHtml(batch.group)}</h3>
          <dl>
            <div><dt>Days</dt><dd>${escapeHtml(batch.days)}</dd></div>
            <div><dt>Time</dt><dd>${escapeHtml(batch.time)}</dd></div>
            <div><dt>Availability</dt><dd>${escapeHtml(batch.availability)}</dd></div>
          </dl>
        </article>
      `,
    )
    .join("");

  return `
    <section class="section ivory" id="${attr(schedule.id)}">
      <div class="container">
        ${sectionHeading(schedule)}
        <div class="schedule-table-wrap">
          <table class="schedule-table">
            <thead>
              <tr><th>Batch</th><th>Days</th><th>Time</th><th>Availability</th></tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
        <div class="schedule-cards">${cards}</div>
        <div class="notice-row">
          <p>${escapeHtml(schedule.notice)}</p>
          ${button(schedule.cta, "primary")}
        </div>
      </div>
    </section>
  `;
}

function renderProgressJourney(homepage) {
  const journey = homepage.progressJourney;
  const steps = journey.steps
    .map(
      (step) => `
        <article class="timeline-card">
          <span class="step-number">${escapeHtml(step.number)}</span>
          <h3>${escapeHtml(step.title)}</h3>
          <p>${escapeHtml(step.description)}</p>
        </article>
      `,
    )
    .join("");

  return `
    <section class="section ivory" id="progress-journey">
      <div class="container">
        ${sectionHeading(journey)}
        <div class="timeline">${steps}</div>
      </div>
    </section>
  `;
}

function renderGallery(homepage) {
  const gallery = homepage.gallery;
  const fallbackAlts = [
    gallery.images[1]?.alt,
    gallery.images[4]?.alt,
    gallery.images[5]?.alt,
    gallery.images[0]?.alt,
    gallery.images[2]?.alt,
  ];
  const items = IMAGE_MAP.gallery
    .map(
      (src, index) => `
        <figure class="gallery-item${index === 0 ? " tall" : ""}">
          <img src="${src}" alt="${attr(fallbackAlts[index] || gallery.heading)}" loading="lazy" />
        </figure>
      `,
    )
    .join("");

  return `
    <section class="section" id="${attr(gallery.id)}">
      <div class="container">
        ${sectionHeading(gallery)}
        <div class="gallery-grid">${items}</div>
      </div>
    </section>
  `;
}

function renderPricing(homepage) {
  const pricing = homepage.pricing;
  const plans = pricing.plans
    .map((plan) => {
      const features = plan.features.map((feature) => `<li>${escapeHtml(feature)}</li>`).join("");
      return `
        <article class="pricing-card${plan.featured ? " featured" : ""}">
          <h3>${escapeHtml(plan.name)}</h3>
          <div class="price">
            <strong>${escapeHtml(plan.price)}</strong>
            <span>${escapeHtml(plan.billing)}</span>
          </div>
          <p>${escapeHtml(plan.description)}</p>
          <ul class="feature-list">${features}</ul>
          ${button({ label: plan.cta, href: "#trial-form" }, plan.featured ? "primary" : "light", "btn-small")}
        </article>
      `;
    })
    .join("");

  return `
    <section class="section forest" id="${attr(pricing.id)}">
      <div class="container">
        ${sectionHeading(pricing)}
        <div class="card-grid pricing-grid">${plans}</div>
        <p class="registration-note">${escapeHtml(pricing.registrationNote)}</p>
      </div>
    </section>
  `;
}

function renderTestimonials(homepage, testimonialsData) {
  const settings = testimonialsData.displaySettings;
  const cards = testimonialsData.testimonials
    .map(
      (testimonial) => `
        <article class="testimonial-card">
          <div class="testimonial-top">
            <span class="avatar" aria-hidden="true">${escapeHtml(initials(testimonial.name))}</span>
            <div>
              <h3>${escapeHtml(testimonial.name)}</h3>
              ${settings.showRole ? `<p>${escapeHtml(testimonial.role)}</p>` : ""}
            </div>
          </div>
          ${settings.showRatings ? `<div class="stars" aria-label="${attr(`${testimonial.rating} out of 5`)}">${"&#9733;".repeat(testimonial.rating)}</div>` : ""}
          <p>${escapeHtml(testimonial.review)}</p>
          ${settings.showProgramme ? `<p class="meta">${escapeHtml(testimonial.programme)}</p>` : ""}
        </article>
      `,
    )
    .join("");

  return `
    <section class="section ivory" id="${attr(homepage.testimonialsSection.id)}">
      <div class="container">
        ${sectionHeading(homepage.testimonialsSection)}
        <div class="card-grid testimonial-grid">${cards}</div>
      </div>
    </section>
  `;
}

function renderFaq(homepage, faqData) {
  const faqs = faqData.faqs
    .map(
      (faq, index) => `
        <details class="faq-item"${index === 0 ? " open" : ""}>
          <summary>${escapeHtml(faq.question)}</summary>
          <p>${escapeHtml(faq.answer)}</p>
        </details>
      `,
    )
    .join("");

  return `
    <section class="section" id="${attr(homepage.faqSection.id)}">
      <div class="container">
        ${sectionHeading(homepage.faqSection)}
        <div class="faq-list">${faqs}</div>
      </div>
    </section>
  `;
}

function renderField(field) {
  const required = field.required ? " required" : "";
  const placeholder = field.placeholder ? ` placeholder="${attr(field.placeholder)}"` : "";
  const label = `${escapeHtml(field.label)}${field.required ? " *" : ""}`;

  if (field.type === "select") {
    const options = field.options
      .map((option) => `<option value="${attr(option)}">${escapeHtml(option)}</option>`)
      .join("");
    return `
      <div class="field">
        <label for="${attr(field.name)}">${label}</label>
        <select id="${attr(field.name)}" name="${attr(field.name)}"${required}>
          <option value=""></option>
          ${options}
        </select>
      </div>
    `;
  }

  if (field.type === "textarea") {
    return `
      <div class="field full">
        <label for="${attr(field.name)}">${label}</label>
        <textarea id="${attr(field.name)}" name="${attr(field.name)}"${placeholder}${required}></textarea>
      </div>
    `;
  }

  return `
    <div class="field">
      <label for="${attr(field.name)}">${label}</label>
      <input id="${attr(field.name)}" name="${attr(field.name)}" type="${attr(field.type)}"${placeholder}${required} />
    </div>
  `;
}

function renderTrialForm(homepage) {
  const form = homepage.trialForm;
  const fields = form.fields.map(renderField).join("");

  return `
    <section class="section orange" id="${attr(form.id)}">
      <div class="container trial-grid">
        <div class="trial-copy">
          <p class="eyebrow">${escapeHtml(form.eyebrow)}</p>
          <h2>${escapeHtml(form.heading)}</h2>
          <p class="lede">${escapeHtml(form.description)}</p>
        </div>
        <div class="trial-card">
          <form class="trial-form" action="https://formspree.io/f/mwvdgqng" method="POST" data-success="${attr(form.successMessage)}">
            <input type="hidden" name="_subject" value="New OliveHorse trial class enquiry" />
            ${fields}
            <p class="consent">${escapeHtml(form.consent)}</p>
            <button class="btn btn-primary form-submit" type="submit">${escapeHtml(form.submitLabel)}</button>
            <p class="form-status" role="status"></p>
          </form>
        </div>
      </div>
    </section>
  `;
}

function renderContact(homepage, business) {
  const contact = homepage.contact;
  const address = addressText(business.contact.address);
  const directions = business.contact.googleBusinessProfile || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  const map = contact.mapEmbedUrl
    ? `<iframe title="${attr(contact.mapTitle)}" src="${attr(contact.mapEmbedUrl)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`
    : `
      <div>
        <h3>${escapeHtml(contact.mapTitle)}</h3>
        <p>${escapeHtml(address)}</p>
        ${button({ label: contact.directionsCTA, href: directions }, "light")}
      </div>
    `;

  return `
    <section class="section" id="${attr(contact.id)}">
      <div class="container">
        ${sectionHeading(contact)}
        <div class="contact-grid">
          <div class="contact-list">
            <article class="contact-card">
              <strong>${escapeHtml(contact.phoneLabel)}</strong>
              <p><a href="${attr(telHref(business.contact.phone))}">${escapeHtml(business.contact.phone)}</a></p>
            </article>
            <article class="contact-card">
              <strong>${escapeHtml(contact.whatsappLabel)}</strong>
              <p><a href="${attr(whatsappHref(business.contact.whatsapp))}">${escapeHtml(business.contact.whatsapp)}</a></p>
            </article>
            <article class="contact-card">
              <strong>${escapeHtml(contact.emailLabel)}</strong>
              <p><a href="mailto:${attr(business.contact.email)}">${escapeHtml(business.contact.email)}</a></p>
            </article>
            <article class="contact-card">
              <strong>${escapeHtml(contact.addressLabel)}</strong>
              <p>${escapeHtml(address)}</p>
            </article>
            <article class="contact-card">
              <strong>${escapeHtml(contact.hoursLabel)}</strong>
              <p>${escapeHtml(contact.hours)}</p>
            </article>
          </div>
          <div class="map-panel">${map}</div>
        </div>
      </div>
    </section>
  `;
}

function renderFooter(homepage, business) {
  const quickLinks = homepage.footer.quickLinks
    .map((item) => `<a href="${attr(item.href)}">${escapeHtml(item.label)}</a>`)
    .join("");
  const legalLinks = homepage.footer.legalLinks
    .map((item) => `<a href="${attr(item.href)}">${escapeHtml(item.label)}</a>`)
    .join("");

  return `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <a class="brand-link" href="#main">
              <img class="brand-logo" src="${IMAGE_MAP.logo}" alt="${attr(homepage.navigation.logoAlt)}" />
              <span class="brand-copy">
                <span class="brand-name">${escapeHtml(business.brand.name)}</span>
                <span class="brand-tagline">${escapeHtml(business.brand.tagline)}</span>
              </span>
            </a>
            <p>${escapeHtml(homepage.footer.description)}</p>
          </div>
          <nav class="footer-links" aria-label="Footer navigation">${quickLinks}${legalLinks}</nav>
        </div>
        <div class="footer-bottom">
          <span>${escapeHtml(homepage.footer.copyright)}</span>
          <span class="social-links">
            <a href="${attr(business.contact.instagram)}">Instagram</a>
            <a href="${attr(business.contact.facebook)}">Facebook</a>
          </span>
        </div>
      </div>
    </footer>
  `;
}

function localBusinessSchema(homepage, business) {
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
    image: `${window.location.origin}/${IMAGE_MAP.hero}`,
  };
}

function faqSchema(faqData) {
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

function updateSeo(homepage, business, faqData) {
  document.title = homepage.seo.title;
  document.querySelector('meta[name="description"]').setAttribute("content", homepage.seo.description);
  document.querySelector('meta[property="og:title"]').setAttribute("content", homepage.seo.ogTitle);
  document.querySelector('meta[property="og:description"]').setAttribute("content", homepage.seo.ogDescription);
  document.querySelector('meta[property="og:image"]').setAttribute("content", IMAGE_MAP.hero);

  const schemas = [localBusinessSchema(homepage, business), faqSchema(faqData)];
  schemas.forEach((schema) => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  });
}

function bindInteractions(homepage) {
  const toggle = document.querySelector(".drawer-toggle");
  const drawer = document.getElementById("mobile-drawer");

  toggle?.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!isOpen));
    drawer.classList.toggle("open", !isOpen);
    document.body.classList.toggle("drawer-open", !isOpen);
  });

  drawer?.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      toggle.setAttribute("aria-expanded", "false");
      drawer.classList.remove("open");
      document.body.classList.remove("drawer-open");
    }
  });

  document.querySelector(".trial-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const submitButton = form.querySelector(".form-submit");
    const status = form.querySelector(".form-status");
    const failureMessage = "Unable to send your enquiry right now. Please try again or contact us on WhatsApp.";

    submitButton.disabled = true;
    status.classList.remove("visible");
    status.textContent = "";

    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: new FormData(form),
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Form submission failed");
      }

      form.reset();
      status.textContent = form.dataset.success || homepage.trialForm.successMessage;
    } catch (error) {
      status.textContent = failureMessage;
    } finally {
      status.classList.add("visible");
      submitButton.disabled = false;
    }
  });
}

function renderPage(data) {
  const { homepage, programmes, faq, testimonials, business } = data;
  return `
    ${renderHeader(homepage, business)}
    <main id="main">
      ${renderHero(homepage, business)}
      ${renderProgrammes(homepage, programmes)}
      ${renderAbout(homepage)}
      ${renderBenefits(homepage)}
      ${renderAgeGroups(homepage)}
      ${renderInstructor(homepage)}
      ${renderSchedule(homepage)}
      ${renderProgressJourney(homepage)}
      ${renderGallery(homepage)}
      ${renderPricing(homepage)}
      ${renderTestimonials(homepage, testimonials)}
      ${renderFaq(homepage, faq)}
      ${renderTrialForm(homepage)}
      ${renderContact(homepage, business)}
    </main>
    ${renderFooter(homepage, business)}
    ${button(homepage.hero.whatsappCTA, "whatsapp", "sticky-whatsapp")}
  `;
}

async function init() {
  try {
    const [homepage, testimonials, programmes, business, faq] = await Promise.all([
      getJson("content/homepage.json"),
      getJson("content/testimonials.json"),
      getJson("content/programmes.json"),
      getJson("content/business.json"),
      getJson("content/faq.json"),
    ]);

    updateSeo(homepage, business, faq);
    app.innerHTML = renderPage({ homepage, testimonials, programmes, business, faq });
    bindInteractions(homepage);
  } catch (error) {
    app.innerHTML = `
      <main class="loading" id="main">
        <p>${escapeHtml(error.message)}</p>
      </main>
    `;
  }
}

init();

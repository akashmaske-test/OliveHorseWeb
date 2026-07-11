import { useEffect } from "react";
import { formspreeEndpoint, siteData } from "./data/siteData.js";
import { applySeo } from "./utils/seo.js";
import Header from "./sections/Header.jsx";
import Hero from "./sections/Hero.jsx";
import Programmes from "./sections/Programmes.jsx";
import About from "./sections/About.jsx";
import Benefits from "./sections/Benefits.jsx";
import AgeGroups from "./sections/AgeGroups.jsx";
import Instructor from "./sections/Instructor.jsx";
import Schedule from "./sections/Schedule.jsx";
import ProgressJourney from "./sections/ProgressJourney.jsx";
import Gallery from "./sections/Gallery.jsx";
import Pricing from "./sections/Pricing.jsx";
import Testimonials from "./sections/Testimonials.jsx";
import FAQ from "./sections/FAQ.jsx";
import TrialForm from "./sections/TrialForm.jsx";
import Contact from "./sections/Contact.jsx";
import Footer from "./sections/Footer.jsx";
import Button from "./components/Button.jsx";

export default function App() {
  const { business, faq, homepage, programmes, testimonials } = siteData;

  useEffect(() => {
    applySeo(homepage, business, faq);
  }, [business, faq, homepage]);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header homepage={homepage} business={business} />
      <main id="main">
        <Hero homepage={homepage} business={business} />
        <Programmes homepage={homepage} programmeData={programmes} />
        <About homepage={homepage} />
        <Benefits homepage={homepage} />
        <AgeGroups homepage={homepage} />
        <Instructor homepage={homepage} />
        <Schedule homepage={homepage} />
        <ProgressJourney homepage={homepage} />
        <Gallery homepage={homepage} />
        <Pricing homepage={homepage} />
        <Testimonials homepage={homepage} testimonialsData={testimonials} />
        <FAQ homepage={homepage} faqData={faq} />
        <TrialForm homepage={homepage} endpoint={formspreeEndpoint} />
        <Contact homepage={homepage} business={business} />
      </main>
      <Footer homepage={homepage} business={business} />
      <Button href={homepage.hero.whatsappCTA.href} variant="whatsapp" className="sticky-whatsapp">
        {homepage.hero.whatsappCTA.label}
      </Button>
    </>
  );
}

import SectionHeading from "../components/SectionHeading.jsx";
import TestimonialCard from "../components/TestimonialCard.jsx";

export default function Testimonials({ homepage, testimonialsData }) {
  return (
    <section className="section ivory" id={homepage.testimonialsSection.id}>
      <div className="container">
        <SectionHeading section={homepage.testimonialsSection} />
        <div className="card-grid testimonial-grid">
          {testimonialsData.testimonials.map((testimonial) => (
            <TestimonialCard testimonial={testimonial} settings={testimonialsData.displaySettings} key={testimonial.id} />
          ))}
        </div>
      </div>
    </section>
  );
}

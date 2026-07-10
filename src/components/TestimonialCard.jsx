import { initials } from "../utils/helpers.js";

export default function TestimonialCard({ testimonial, settings }) {
  return (
    <article className="testimonial-card">
      <div className="testimonial-top">
        <span className="avatar" aria-hidden="true">
          {initials(testimonial.name)}
        </span>
        <div>
          <h3>{testimonial.name}</h3>
          {settings.showRole ? <p>{testimonial.role}</p> : null}
        </div>
      </div>
      {settings.showRatings ? (
        <div className="stars" aria-label={`${testimonial.rating} out of 5`}>
          {"★".repeat(testimonial.rating)}
        </div>
      ) : null}
      <p>{testimonial.review}</p>
      {settings.showProgramme ? <p className="meta">{testimonial.programme}</p> : null}
    </article>
  );
}

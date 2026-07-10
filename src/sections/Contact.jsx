import Button from "../components/Button.jsx";
import { addressText, telHref, whatsappHref } from "../utils/helpers.js";

export default function Contact({ homepage, business }) {
  const contact = homepage.contact;
  const address = addressText(business.contact.address);
  const directions = business.contact.googleBusinessProfile || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

  return (
    <section className="section" id={contact.id}>
      <div className="container">
        <div className="section-heading">
          <p className="eyebrow">{contact.eyebrow}</p>
          <h2>{contact.heading}</h2>
          <p className="lede">{contact.description}</p>
        </div>
        <div className="contact-grid">
          <div className="contact-list">
            <article className="contact-card">
              <strong>{contact.phoneLabel}</strong>
              <p>
                <a href={telHref(business.contact.phone)}>{business.contact.phone}</a>
              </p>
            </article>
            <article className="contact-card">
              <strong>{contact.whatsappLabel}</strong>
              <p>
                <a href={whatsappHref(business.contact.whatsapp)}>{business.contact.whatsapp}</a>
              </p>
            </article>
            <article className="contact-card">
              <strong>{contact.emailLabel}</strong>
              <p>
                <a href={`mailto:${business.contact.email}`}>{business.contact.email}</a>
              </p>
            </article>
            <article className="contact-card">
              <strong>{contact.addressLabel}</strong>
              <p>{address}</p>
            </article>
            <article className="contact-card">
              <strong>{contact.hoursLabel}</strong>
              <p>{contact.hours}</p>
            </article>
          </div>
          <div className="map-panel">
            {contact.mapEmbedUrl ? (
              <iframe title={contact.mapTitle} src={contact.mapEmbedUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
            ) : (
              <div>
                <h3>{contact.mapTitle}</h3>
                <p>{address}</p>
                <Button href={directions} variant="light">
                  {contact.directionsCTA}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

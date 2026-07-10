import { useState } from "react";
import Button from "../components/Button.jsx";

function Field({ field }) {
  const label = `${field.label}${field.required ? " *" : ""}`;

  if (field.type === "select") {
    return (
      <div className="field">
        <label htmlFor={field.name}>{label}</label>
        <select id={field.name} name={field.name} required={field.required}>
          <option value=""></option>
          {field.options.map((option) => (
            <option value={option} key={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (field.type === "textarea") {
    return (
      <div className="field full">
        <label htmlFor={field.name}>{label}</label>
        <textarea id={field.name} name={field.name} placeholder={field.placeholder} required={field.required}></textarea>
      </div>
    );
  }

  return (
    <div className="field">
      <label htmlFor={field.name}>{label}</label>
      <input id={field.name} name={field.name} type={field.type} placeholder={field.placeholder} required={field.required} />
    </div>
  );
}

export default function TrialForm({ homepage, endpoint }) {
  const form = homepage.trialForm;
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState("");
  const failureMessage = "Unable to send your enquiry right now. Please try again or contact us on WhatsApp.";

  async function handleSubmit(event) {
    event.preventDefault();
    const currentForm = event.currentTarget;

    if (!currentForm.checkValidity()) {
      currentForm.reportValidity();
      return;
    }

    setSubmitting(true);
    setStatus("");

    try {
      const response = await fetch(currentForm.action, {
        method: currentForm.method,
        body: new FormData(currentForm),
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Form submission failed");
      }

      currentForm.reset();
      setStatus(form.successMessage);
    } catch (error) {
      setStatus(failureMessage);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="section orange" id={form.id}>
      <div className="container trial-grid">
        <div className="trial-copy">
          <p className="eyebrow">{form.eyebrow}</p>
          <h2>{form.heading}</h2>
          <p className="lede">{form.description}</p>
        </div>
        <div className="trial-card">
          <form className="trial-form" action={endpoint} method="POST" onSubmit={handleSubmit}>
            <input type="hidden" name="_subject" value="New OliveHorse trial class enquiry" />
            {form.fields.map((field) => (
              <Field field={field} key={field.name} />
            ))}
            <p className="consent">{form.consent}</p>
            <Button className="form-submit" type="submit" disabled={submitting}>
              {form.submitLabel}
            </Button>
            <p className={`form-status${status ? " visible" : ""}`} role="status">
              {status}
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useRef, useState } from "react";
import { Icon } from "./catering-icons";

type FieldName = "name" | "phone" | "email" | "description";
type FormErrors = Partial<Record<FieldName, string>>;
const recipient = "srivaripleasanton@gmail.com";
const submissionUrl = `https://formsubmit.co/ajax/${recipient}`;

export function ContactForm() {
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const inFlight = useRef(false);

  async function sendMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const description = String(data.get("description") ?? "").trim();
    const emailInput = form.elements.namedItem("email") as HTMLInputElement;
    const nextErrors: FormErrors = {};

    if (!name) nextErrors.name = "Please enter your name.";
    if (!phone && !email) nextErrors.phone = "Please provide a phone number or email so we can reply.";
    if (email && emailInput.validity.typeMismatch) nextErrors.email = "Please enter a valid email address.";
    if (!description) nextErrors.description = "Please tell us how we can help.";
    setErrors(nextErrors);

    const firstError = Object.keys(nextErrors)[0];
    if (firstError) {
      setStatus("idle");
      (form.elements.namedItem(firstError) as HTMLElement).focus();
      return;
    }

    inFlight.current = true;
    setStatus("sending");
    try {
      const response = await fetch(submissionUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name,
          ...(phone ? { phone } : {}),
          ...(email ? { email } : {}),
          description,
          _subject: "New Srivari Catering contact enquiry",
          _template: "table",
          _captcha: "false",
          _honey: String(data.get("_honey") ?? ""),
        }),
        signal: AbortSignal.timeout(20000),
      });
      const result = await response.json();
      const needsActivation = typeof result.message === "string" && /activat|confirm.*email|verify.*email/i.test(result.message);
      if (!response.ok || (result.success !== true && result.success !== "true") || needsActivation) {
        throw new Error("Submission was not confirmed.");
      }
      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    } finally {
      inFlight.current = false;
    }
  }

  function clearFeedback() {
    setErrors({});
    if (!inFlight.current) setStatus("idle");
  }

  return (
    <section className="contact-form-section contact-card" aria-labelledby="contact-form-title">
      <h2 id="contact-form-title"><Icon name="mail" /> Send Us a Message</h2>
      <p className="contact-form-intro" id="contact-form-help">Just your name, a phone number or email, and a description.</p>
      <form noValidate onSubmit={sendMessage} onChange={clearFeedback} aria-describedby="contact-form-help contact-form-note" aria-busy={status === "sending"}>
        <input className="contact-honeypot" type="text" name="_honey" autoComplete="off" tabIndex={-1} aria-hidden="true" />
        <fieldset className="contact-form-fields" disabled={status === "sending"}>
          <div>
            <label htmlFor="contact-name">Name <span className="contact-required">(required)</span></label>
            <input id="contact-name" name="name" autoComplete="name" required aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "contact-name-error" : undefined} />
            {errors.name && <p className="contact-form-error" id="contact-name-error">{errors.name}</p>}
          </div>
          <fieldset className="contact-reply-fields">
            <legend>Phone or email <span className="contact-required">(at least one required)</span></legend>
            <div className="contact-reply-grid">
              <div>
                <label htmlFor="contact-phone">Phone</label>
                <input id="contact-phone" name="phone" type="tel" autoComplete="tel" aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? "contact-phone-error" : undefined} />
              </div>
              <div>
                <label htmlFor="contact-email">Email</label>
                <input id="contact-email" name="email" type="email" autoComplete="email" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "contact-email-error" : undefined} />
              </div>
            </div>
            {errors.phone && <p className="contact-form-error" id="contact-phone-error">{errors.phone}</p>}
            {errors.email && <p className="contact-form-error" id="contact-email-error">{errors.email}</p>}
          </fieldset>
          <div>
            <label htmlFor="contact-description">Description <span className="contact-required">(required)</span></label>
            <textarea id="contact-description" name="description" rows={4} required aria-invalid={Boolean(errors.description)} aria-describedby={errors.description ? "contact-description-error" : undefined} />
            {errors.description && <p className="contact-form-error" id="contact-description-error">{errors.description}</p>}
          </div>
        </fieldset>
        <p className="contact-form-note" id="contact-form-note">Your message will be emailed to {recipient}.</p>
        <button type="submit" className="button" disabled={status === "sending"}>{status === "sending" ? "Sending…" : "Send Message"} <Icon name="arrow" /></button>
        {status === "success" && <p className="contact-form-status" role="status">Thank you! Your message has been submitted. We’ll be in touch.</p>}
        {status === "error" && <p className="contact-form-status contact-form-error" role="alert">We couldn’t confirm your submission. Your details are still here; try again or email <a href={`mailto:${recipient}`}>{recipient}</a> directly.</p>}
      </form>
    </section>
  );
}

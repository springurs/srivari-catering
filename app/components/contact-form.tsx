"use client";

import { useState, type FormEvent } from "react";
import { Icon } from "./catering-icons";

type FieldName = "name" | "phone" | "email" | "description";
type FormErrors = Partial<Record<FieldName, string>>;

export function ContactForm() {
  const [errors, setErrors] = useState<FormErrors>({});
  const [result, setResult] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function validateMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;
    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const emailInput = form.elements.namedItem("email") as HTMLInputElement;
    const nextErrors: FormErrors = {};

    if (!name) nextErrors.name = "Please enter your name.";
    if (!phone && !email) nextErrors.phone = "Please provide a phone number or email so we can reply.";
    if (email && emailInput.validity.typeMismatch) nextErrors.email = "Please enter a valid email address.";
    if (!description) nextErrors.description = "Please tell us how we can help.";
    setErrors(nextErrors);
    setResult("");

    const firstError = Object.keys(nextErrors)[0];
    if (firstError) {
      (form.elements.namedItem(firstError) as HTMLElement).focus();
      return;
    }

    formData.set("name", name);
    formData.set("description", description);
    if (phone) formData.set("phone", phone);
    else formData.delete("phone");
    if (email) formData.set("email", email);
    else formData.delete("email");

    setIsSubmitting(true);
    setResult("Sending your message…");
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
        signal: AbortSignal.timeout(20000),
      });
      const responseData = await response.json();
      if (!response.ok || responseData.success !== true) {
        throw new Error("Submission was not confirmed.");
      }
      form.reset();
      setResult("Thank you! Your message has been submitted.");
    } catch {
      setResult("We couldn’t confirm your submission. Your details are still here; please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function clearFeedback() {
    setErrors({});
    setResult("");
  }

  return (
    <section className="contact-form-section contact-card" aria-labelledby="contact-form-title">
      <h2 id="contact-form-title"><Icon name="mail" /> Send Us a Message</h2>
      <p className="contact-form-intro" id="contact-form-help">Just your name, a phone number or email, and a description.</p>
      <form noValidate onSubmit={validateMessage} onChange={clearFeedback} aria-describedby="contact-form-help contact-form-note" aria-busy={isSubmitting}>
        <input type="hidden" name="access_key" value="821b7b4c-e655-44a1-8aaa-1018a3fe850d"></input>
        <fieldset className="contact-form-fields" disabled={isSubmitting}>
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
        <p className="contact-form-note" id="contact-form-note">We’ll reply using the phone number or email you provide.</p>
        <button type="submit" className="button" disabled={isSubmitting}>{isSubmitting ? "Sending…" : "Send Message"} <Icon name="arrow" /></button>
        {result && <p className="contact-form-note" role="status">{result}</p>}
      </form>
    </section>
  );
}

"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { Icon } from "./catering-icons";
import { contactAccessKey } from "../data/contact-settings";

type FieldName = "name" | "phone" | "email" | "description";
type FormErrors = Partial<Record<FieldName, string>>;

export function ContactForm({ cateringRequest }: {
  cateringRequest?: { preview: string; packageName: string; people: string; staff: string; cutlery: boolean; date: string; time: string; dietaryRequests: string[]; includeServiceExtras?: boolean };
} = {}) {
  const id = useId();
  const fieldId = (field: string) => `${cateringRequest ? `catering-${id}` : "contact"}-${field}`;
  const [errors, setErrors] = useState<FormErrors>({});
  const [result, setResult] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const pending = useRef(false);

  async function validateMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending.current || isSent) return;
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
    if (cateringRequest) {
      formData.set("subject", `Catering request — ${cateringRequest.packageName} — ${cateringRequest.people} people`);
      formData.set("package", cateringRequest.packageName);
      formData.set("number_of_people", cateringRequest.people);
      formData.set("dietary_requests", cateringRequest.dietaryRequests.length ? cateringRequest.dietaryRequests.join(" · ") : "Not requested");
      if (cateringRequest.includeServiceExtras !== false) {
        formData.set("service_staff", cateringRequest.staff);
        formData.set("cutlery_and_plates", cateringRequest.cutlery ? "Requested" : "Not requested");
      }
      if (cateringRequest.date) formData.set("event_date", cateringRequest.date);
      if (cateringRequest.time) formData.set("event_time", cateringRequest.time);
      formData.set("request_preview", cateringRequest.preview);
      formData.set("message", cateringRequest.preview);
    }

    pending.current = true;
    setIsSubmitting(true);
    setResult(cateringRequest ? "Sending your catering request…" : "Sending your message…");
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
      setIsSent(Boolean(cateringRequest));
      setResult(cateringRequest ? "Thank you! Your catering request has been submitted. Our team will contact you to discuss availability and the next steps." : "Thank you! Your message has been submitted.");
    } catch {
      setResult("We couldn’t confirm your submission. Your details are still here; please try again.");
    } finally {
      pending.current = false;
      setIsSubmitting(false);
    }
  }

  function clearFeedback() {
    setErrors({});
    setResult("");
  }

  return (
    <section className={`contact-form-section ${cateringRequest ? "catering-contact-form" : "contact-card"}`} aria-labelledby={fieldId("form-title")}>
      {cateringRequest ? <h4 id={fieldId("form-title")}>Your contact details</h4> : <h2 id={fieldId("form-title")}><Icon name="mail" /> Send Us a Message</h2>}
      <p className="contact-form-intro" id={fieldId("form-help")}>{cateringRequest ? "Add your contact details and anything specific you’d like to discuss. Your package, guest count, date, time, selected menu, and dietary requests will be included automatically in the email to our team." : "Just your name, a phone number or email, and a description."}</p>
      <form noValidate onSubmit={validateMessage} onChange={clearFeedback} aria-describedby={`${fieldId("form-help")} ${fieldId("form-note")}`} aria-busy={isSubmitting}>
        <input type="hidden" name="access_key" value={contactAccessKey}></input>
        {cateringRequest && <input type="hidden" name="request_preview" value={cateringRequest.preview} />}
        <fieldset className="contact-form-fields" disabled={isSubmitting || isSent}>
          <div>
            <label htmlFor={fieldId("name")}>Name <span className="contact-required">(required)</span></label>
            <input id={fieldId("name")} name="name" autoComplete="name" required aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? fieldId("name-error") : undefined} />
            {errors.name && <p className="contact-form-error" id={fieldId("name-error")}>{errors.name}</p>}
          </div>
          <fieldset className="contact-reply-fields">
            <legend>Phone or email <span className="contact-required">(at least one required)</span></legend>
            <div className="contact-reply-grid">
              <div>
                <label htmlFor={fieldId("phone")}>Phone</label>
                <input id={fieldId("phone")} name="phone" type="tel" autoComplete="tel" aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? fieldId("phone-error") : undefined} />
              </div>
              <div>
                <label htmlFor={fieldId("email")}>Email</label>
                <input id={fieldId("email")} name="email" type="email" autoComplete="email" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? fieldId("email-error") : undefined} />
              </div>
            </div>
            {errors.phone && <p className="contact-form-error" id={fieldId("phone-error")}>{errors.phone}</p>}
            {errors.email && <p className="contact-form-error" id={fieldId("email-error")}>{errors.email}</p>}
          </fieldset>
          <div>
            <label htmlFor={fieldId("description")}>{cateringRequest ? "Special requests / Description" : "Description"} <span className="contact-required">(required)</span></label>
            <textarea id={fieldId("description")} name="description" rows={4} required placeholder={cateringRequest ? "Tell us which dishes or how many guests need Jain or no-onion, no-garlic preparation, plus any venue or menu preferences." : "How can we help? Include any Jain or no-onion, no-garlic requests."} aria-invalid={Boolean(errors.description)} aria-describedby={errors.description ? fieldId("description-error") : undefined} />
            {errors.description && <p className="contact-form-error" id={fieldId("description-error")}>{errors.description}</p>}
          </div>
        </fieldset>
        <p className="contact-form-note" id={fieldId("form-note")}>We’ll reply using the phone number or email you provide.{cateringRequest && " Submitting an enquiry does not confirm a booking."}</p>
        <button type="submit" className="button" disabled={isSubmitting || isSent}>{isSubmitting ? "Sending…" : isSent ? "Request submitted" : cateringRequest ? "Send catering request" : "Send Message"} <Icon name="arrow" /></button>
        {result && <p className="contact-form-note" role="status">{result}</p>}
      </form>
    </section>
  );
}

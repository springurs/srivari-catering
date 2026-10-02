import { Icon } from "./catering-icons";
import { ContactForm } from "./contact-form";

const addressQuery = encodeURIComponent("3180 Santa Rita Rd, Pleasanton, CA 94566");
const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${addressQuery}`;

export function ContactSection() {
  return (
    <section className="contact-section" id="contact" aria-labelledby="contact-title">
      <div className="contact-heading">
        <p className="eyebrow">LET’S PLAN SOMETHING SPECIAL</p>
        <h1 id="contact-title">Contact Us</h1>
        <p>Visit us in Pleasanton or get in touch to plan your next gathering.</p>
      </div>
      <div className="contact-layout">
        <section className="contact-map" aria-labelledby="contact-map-title">
          <div className="contact-map-heading">
            <div>
              <h2 id="contact-map-title">Find Us in Pleasanton</h2>
              <p>3180 Santa Rita Rd, Pleasanton, CA 94566</p>
            </div>
            <a className="text-link" href={mapsUrl} target="_blank" rel="noopener noreferrer">
              Open in Google Maps <Icon name="arrow" />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
          <iframe
            title="Map showing Srivari at 3180 Santa Rita Rd, Pleasanton, CA 94566"
            src={`https://www.google.com/maps?q=${addressQuery}&z=15&output=embed`}
            width="100%"
            height="360"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
        </section>
        <ContactForm />
      </div>
    </section>
  );
}

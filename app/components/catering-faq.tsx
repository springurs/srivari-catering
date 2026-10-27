import Link from "next/link";
import type { CateringFaq } from "../data/catering-faq";
import { homeFaqs } from "../data/catering-faq";
import { Icon } from "./catering-icons";

export function FaqList({ items, openFirst = false }: { items: CateringFaq[]; openFirst?: boolean }) {
  return (
    <div className="faq-list">
      {items.map((faq, index) => (
        <details className="faq-item" id={`question-${faq.id}`} key={faq.id} open={openFirst && index === 0}>
          <summary><span>{faq.question}</span><span className="faq-toggle" aria-hidden="true">+</span></summary>
          <div className="faq-answer">
            <p>{faq.answer}</p>
            {faq.links && <ul className="faq-links" aria-label="Related information">
              {faq.links.map((link) => <li key={link.href}>{link.href.startsWith("https://")
                ? <a href={link.href} target="_blank" rel="noopener noreferrer">{link.label} ↗<span className="sr-only"> (opens in a new tab)</span></a>
                // Load the document with its Diwali bookmark so the planner reads it on initialisation.
                : link.href === "/#diwali"
                  ? <a href={link.href}>{link.label} <Icon name="arrow" /></a>
                  : <Link href={link.href}>{link.label} <Icon name="arrow" /></Link>}
              </li>)}
            </ul>}
          </div>
        </details>
      ))}
    </div>
  );
}

export function HomeFaqs() {
  return (
    <section className="home-faq" id="catering-questions" aria-labelledby="home-faq-title">
      <div className="home-faq-intro">
        <p className="eyebrow">A LITTLE HELP WITH PLANNING</p>
        <h2 id="home-faq-title">Catering questions, answered.</h2>
        <p>Find the right guest count, explore individual trays, and choose how you’d like to order.</p>
        <Link className="text-link" href="/faq">Read all catering FAQs <Icon name="arrow" /></Link>
      </div>
      <FaqList items={homeFaqs} />
    </section>
  );
}

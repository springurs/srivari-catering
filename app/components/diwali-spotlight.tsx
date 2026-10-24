import { useRef, useState, type MouseEvent } from "react";
import { diwaliMenus } from "../data/diwali-menu";
import { siteUrl } from "../data/site-seo";
import { Icon } from "./catering-icons";

export function DiwaliSpotlight({ onExplore }: { onExplore: (packageName?: string) => void }) {
  const [copyStatus, setCopyStatus] = useState<"" | "copied" | "manual">("");
  const shareInput = useRef<HTMLInputElement>(null);
  const shareUrl = `${siteUrl}/#diwali`;

  function openSharedMenu(event: MouseEvent<HTMLAnchorElement>) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    onExplore();
  }

  async function copyDiwaliLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("manual");
      requestAnimationFrame(() => { shareInput.current?.focus(); shareInput.current?.select(); });
    }
  }

  return (
    <section className="diwali-spotlight" id="diwali-specials" aria-labelledby="diwali-specials-title">
      <div className="diwali-spotlight-card">
        <Icon name="lotus" className="diwali-spotlight-ornament" />
        <div className="diwali-spotlight-copy">
          <p className="diwali-spotlight-kicker"><Icon name="flame" /> DIWALI CATERING SPECIALS</p>
          <h2 id="diwali-specials-title">Host the lights. <span>We bring the feast.</span></h2>
          <p className="diwali-spotlight-description">For family gatherings, poojas, and office celebrations. Bring everyone together over a festive vegetarian spread, or let our live dosa station be part of the celebration.</p>
          <div className="diwali-spotlight-offers" aria-label="Explore our Diwali specials">
            {diwaliMenus.map((menu) => (
              <button
                className={`diwali-spotlight-offer${menu.name === "Signature Celebration" ? " is-recommended" : ""}`}
                type="button"
                key={menu.name}
                aria-label={`Explore ${menu.name} for Diwali, $${menu.pricePerPerson?.toFixed(2)} per person, minimum ${menu.minimumGuests} guests`}
                aria-controls="occasion-packages"
                onClick={() => onExplore(menu.name)}
              >
                {menu.name === "Signature Celebration" && <span className="diwali-offer-recommendation">Recommended</span>}
                <span className="diwali-offer-name">{menu.name}</span>
                <span className="diwali-offer-price"><span>From</span><strong>${menu.pricePerPerson?.toFixed(2)}</strong><small>per person</small></span>
                <span className="diwali-offer-minimum">Min. {menu.minimumGuests} guests{menu.serviceDuration ? " · 2 hours" : ""}</span>
              </button>
            ))}
          </div>
          <div className="diwali-spotlight-actions">
            <button className="button" type="button" aria-controls="occasion-packages" onClick={() => onExplore()}>Explore Diwali specials <Icon name="arrow" /></button>
            <a className="diwali-spotlight-call" href="tel:+14088930438">Call (408) 893-0438 <span>for your Diwali quote</span></a>
          </div>
          <div className="diwali-share">
            <button className="diwali-share-button" type="button" onClick={() => void copyDiwaliLink()}>Copy Diwali link</button>
            <a href={shareUrl} onClick={openSharedMenu}>Share Diwali menu <span aria-hidden="true">↗</span></a>
            <span role="status">{copyStatus === "copied" ? "Diwali link copied!" : copyStatus === "manual" ? "Copy the selected link below." : ""}</span>
            {copyStatus === "manual" && <input ref={shareInput} aria-label="Diwali menu link to copy" value={shareUrl} readOnly onFocus={(event) => event.currentTarget.select()} />}
          </div>
          <p className="diwali-spotlight-note">100% vegetarian · No onion &amp; garlic options on request.<br />Tax, delivery and additional services extra.</p>
        </div>
      </div>
    </section>
  );
}

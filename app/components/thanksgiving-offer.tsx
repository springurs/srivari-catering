"use client";

import { useState, useSyncExternalStore } from "react";
import { Icon } from "./catering-icons";
import { isThanksgivingOfferActive, thanksgivingOffer } from "../data/thanksgiving-offer";

function subscribeToOffer(onChange: () => void) {
  let timer: ReturnType<typeof setTimeout>;
  const update = () => {
    onChange();
    if (isThanksgivingOfferActive()) timer = setTimeout(update, Math.min(thanksgivingOffer.endsAt - Date.now() + 1, 2_147_483_647));
  };
  update();
  window.addEventListener("focus", onChange);
  return () => { clearTimeout(timer); window.removeEventListener("focus", onChange); };
}

export function useThanksgivingOffer() {
  return useSyncExternalStore(subscribeToOffer, isThanksgivingOfferActive, () => true);
}

export function ThanksgivingOffer({ onChoose }: { onChoose: () => void }) {
  const [copyStatus, setCopyStatus] = useState("");
  async function copyCode() {
    try {
      await navigator.clipboard.writeText(thanksgivingOffer.code);
      setCopyStatus("Code copied — use it with any package.");
    } catch {
      setCopyStatus("Use code THANKS10 when placing your order.");
    }
  }
  return <section className="harvest-offer" id="thanksgiving-offer" aria-labelledby="harvest-offer-title">
    <div className="harvest-offer-copy">
      <p className="harvest-offer-eyebrow"><span /> A LITTLE THANKS, FROM OUR KITCHEN</p>
      <h2 id="harvest-offer-title">Skip the Thanksgiving<br /><em>cooking!</em></h2>
      <p className="harvest-offer-description">More time with your people. A feast made for sharing.<br />Choose any package and let Srivari take care of the food.</p>
      <div className="harvest-offer-actions">
        <button className="button" type="button" onClick={onChoose} aria-controls="occasion-packages">Use offer &amp; choose a package <Icon name="arrow" /></button>
        <a className="harvest-offer-call" href="tel:+14088930438">Or call <strong>+1 (408) 893-0438</strong></a>
      </div>
      <a className="harvest-offer-visit" href="https://www.google.com/maps/search/?api=1&query=3180%20Santa%20Rita%20Rd%2C%20Pleasanton%2C%20CA%2094566" target="_blank" rel="noopener noreferrer">
        <Icon name="pin" /><span><strong>Visit us in Pleasanton</strong><span>3180 Santa Rita Rd, Pleasanton, CA 94566</span></span><Icon name="arrow" /><span className="sr-only">Open directions in a new tab</span>
      </a>
      <p className="harvest-offer-fineprint">10% off orders over $40 with code THANKS10. Ends November 26.</p>
    </div>
    <div className="harvest-offer-ticket">
      <div className="harvest-offer-ticket-top"><span>THANKSGIVING OFFERS</span><span>ENDS 11/26</span></div>
      <p className="harvest-offer-amount"><strong>10<span>%</span></strong><span>OFF</span></p>
      <p className="harvest-offer-threshold">on orders over $40</p>
      <div className="harvest-offer-code-row"><div><span>YOUR OFFER CODE</span><code>{thanksgivingOffer.code}</code></div><button type="button" onClick={() => void copyCode()} aria-label="Copy offer code THANKS10">Copy code</button></div>
      <p className="harvest-offer-status" role="status">{copyStatus || "A little saving. A lot to be thankful for."}</p>
    </div>
  </section>;
}

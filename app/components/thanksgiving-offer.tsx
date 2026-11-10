"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type PointerEvent } from "react";
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
  const [revealed, setRevealed] = useState(false);
  const [scratching, setScratching] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stroke = useRef<{ pointerId: number; x: number; y: number; moves: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    context.globalCompositeOperation = "source-over";
    const coating = context.createLinearGradient(0, 0, canvas.width, canvas.height);
    coating.addColorStop(0, "#edcea0");
    coating.addColorStop(.5, "#c59860");
    coating.addColorStop(1, "#f4dbb7");
    context.fillStyle = coating;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#80502f22";
    for (let x = 0; x < canvas.width; x += 16) {
      for (let y = 0; y < canvas.height; y += 16) context.fillRect(x, y, 2, 2);
    }
  }, []);

  function revealCode() {
    stroke.current = null;
    setRevealed(true);
  }

  function checkScratchedArea() {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
    let cleared = 0;
    let samples = 0;
    for (let i = 3; i < pixels.length; i += 64) {
      samples++;
      if (pixels[i] < 128) cleared++;
    }
    if (cleared / samples >= .35) revealCode();
  }

  function scratch(event: PointerEvent<HTMLCanvasElement>, start = false) {
    if (revealed || (start && event.button !== 0)) return;
    const canvas = event.currentTarget;
    const context = canvas.getContext("2d");
    if (!context) { revealCode(); return; }
    const bounds = canvas.getBoundingClientRect();
    const x = (event.clientX - bounds.left) * canvas.width / bounds.width;
    const y = (event.clientY - bounds.top) * canvas.height / bounds.height;
    if (start) {
      canvas.setPointerCapture(event.pointerId);
      stroke.current = { pointerId: event.pointerId, x, y, moves: 0 };
      setScratching(true);
    }
    const previous = stroke.current;
    if (!previous || previous.pointerId !== event.pointerId) return;
    context.globalCompositeOperation = "destination-out";
    context.lineWidth = 48;
    context.lineCap = "round";
    context.beginPath();
    context.moveTo(previous.x, previous.y);
    context.lineTo(x + .01, y);
    context.stroke();
    stroke.current = { pointerId: event.pointerId, x, y, moves: previous.moves + 1 };
    if ((previous.moves + 1) % 6 === 0) checkScratchedArea();
  }

  function finishScratch(event: PointerEvent<HTMLCanvasElement>) {
    if (stroke.current?.pointerId !== event.pointerId) return;
    stroke.current = null;
    checkScratchedArea();
  }
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
      <p className="harvest-offer-fineprint">10% off orders over $40. Reveal your offer code below. Ends November 26.</p>
    </div>
    <div className="harvest-offer-ticket">
      <div className="harvest-offer-ticket-top"><span>THANKSGIVING OFFERS</span><span>ENDS 11/26</span></div>
      <p className="harvest-offer-amount"><strong>10<span>%</span></strong><span>OFF</span></p>
      <p className="harvest-offer-threshold">on orders over $40</p>
      <div className="harvest-offer-code-row">
        <div className="harvest-scratch-code">
          <span>{revealed ? "YOUR OFFER CODE" : "A LITTLE SURPRISE FOR YOU"}</span>
          <div className={`harvest-scratch-surface${revealed ? " is-revealed" : ""}`}>
            <code aria-hidden={!revealed}>{thanksgivingOffer.code}</code>
            {!revealed && <>
              <canvas ref={canvasRef} width={600} height={160} aria-hidden="true" onPointerDown={(event) => scratch(event, true)} onPointerMove={scratch} onPointerUp={finishScratch} onPointerCancel={finishScratch} onLostPointerCapture={finishScratch} />
              {!scratching && <span className="harvest-scratch-hint" aria-hidden="true">✦ Scratch here ✦</span>}
            </>}
          </div>
        </div>
        <button type="button" onClick={revealed ? () => void copyCode() : revealCode}>{revealed ? "Copy code" : "Reveal code"}</button>
      </div>
      <p className="harvest-offer-status" role="status">{copyStatus || (revealed ? `Your code is ${thanksgivingOffer.code} — use it with any package.` : "Scratch with your finger or mouse, or select Reveal code.")}</p>
    </div>
  </section>;
}

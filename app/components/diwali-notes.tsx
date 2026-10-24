import { diwaliNotes } from "../data/diwali-menu";

export function DiwaliNotes() {
  return (
    <aside className="diwali-notes" aria-labelledby="diwali-notes-title">
      <p className="eyebrow">DIWALI CELEBRATIONS</p>
      <h3 id="diwali-notes-title">A feast for your celebration</h3>
      <ul>{diwaliNotes.map((note) => <li key={note}>{note}</li>)}</ul>
      <p>Discuss your Diwali menu: <a className="text-link" href="tel:+14088930438">+1 (408) 893-0438</a></p>
    </aside>
  );
}

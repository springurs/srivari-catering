import { festiveExtras, festiveSpecialties } from "../data/festive-menu";

export function FestiveOptions() {
  return (
    <div className="festive-options">
      <section aria-labelledby="festive-extras-title">
        <p className="eyebrow">MAKE YOUR CELEBRATION YOUR OWN</p>
        <h3 id="festive-extras-title">Golu upgrades & individual boxes</h3>
        <div className="festive-extras-grid">
          {festiveExtras.map((extra) => (
            <article className="festive-extra" key={extra.name}>
              <h4>{extra.name}</h4>
              <ul>{extra.items.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
          ))}
        </div>
      </section>
      <section className="festive-specialties" aria-labelledby="festive-specialties-title">
        <p className="eyebrow">TRADITIONAL FESTIVE FAVOURITES</p>
        <h3 id="festive-specialties-title">Unique Tamil & Telugu Golu Specialties</h3>
        <p>All items may be prepared in traditional Sattvic, no-onion and no-garlic style. Jain options are also available on request.</p>
        <p className="festive-serving-note">Small serves approximately 10–12 · Medium serves approximately 20–25</p>
        <p>Suggested pickup rates before tax and delivery. Where shown, quantities are pieces unless marked in lb.</p>
        <div className="festive-tables">
          {festiveSpecialties.map((category) => (
            <div className="festive-table" key={category.name}>
              <table>
                <caption>{category.name}</caption>
                <thead><tr><th scope="col">Item</th><th scope="col">Small</th><th scope="col">Medium</th></tr></thead>
                <tbody>{category.rows.map(([item, small, medium]) => (
                  <tr key={item}><th scope="row">{item}</th><td>{small}</td><td>{medium}</td></tr>
                ))}</tbody>
              </table>
            </div>
          ))}
        </div>
      </section>
      <p className="festive-contact">Discuss your festive menu and upgrades: <a className="text-link" href="tel:+14088930438">+1 (408) 893-0438</a></p>
    </div>
  );
}

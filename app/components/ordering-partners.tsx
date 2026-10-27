import Link from "next/link";
import { ezCaterOrderingUrl } from "../data/ordering-partners";
import { Icon } from "./catering-icons";

export function OrderingPartners() {
  return (
    <section className="ordering-partners" id="ordering-partners" aria-labelledby="ordering-partners-title">
      <div className="ordering-partners-copy">
        <p className="eyebrow">ANOTHER WAY TO ORDER</p>
        <h2 id="ordering-partners-title">Your Srivari favourites, on ezCater.</h2>
        <p>Planning an office lunch, team meeting, or celebration? Browse our catering menu and place your order through ezCater.</p>
        <p className="ordering-partners-direct">For a custom menu or event requirements, <Link href="/contact">talk to our catering team</Link>.</p>
        <p className="ordering-partners-direct"><Link href="/faq#ezcater">Questions about ordering on ezCater?</Link></p>
      </div>
      <div className="ordering-partners-actions">
        <span className="ordering-partners-name">ezCater</span>
        <a className="button" href={ezCaterOrderingUrl} target="_blank" rel="noopener noreferrer" aria-describedby="ordering-partners-note">
          Order on ezCater <Icon name="arrow" /><span className="sr-only"> (opens in a new tab)</span>
        </a>
        <p id="ordering-partners-note">External ordering site · Opens in a new tab</p>
      </div>
    </section>
  );
}

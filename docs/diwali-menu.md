# Diwali catering

The seasonal occasion is now **Diwali Catering**, with a **Choose Your Diwali Feast** package section. The supplied poster replaces the previous seasonal packages and specialty tables.

| Package | Per person | Minimum | Service |
| --- | --- | --- | --- |
| Classic Feast | $17.99 | 25 guests | Catering menu |
| Signature Celebration | $19.99 | 25 guests | Catering menu |
| Live Dosa Celebration | $21.99 | 35 guests | Unlimited dosas, 2-hour service |

Classic Feast has eight single-choice groups and includes steamed rice and pickle. Signature Celebration has nine groups: two distinct starters, with a maximum of one paneer starter, and one choice in each remaining group. Steamed rice and salan are included. The six starred recipe options retain the poster's kitchen-confirmation/possible-upgrade note. Every event uses one menu; delivery, tax and additional services are extra.

Live Dosa Celebration has one starter, biryani, dessert and complimentary beverage selection, with sambar, chutneys, raita and salan included. The poster does not enumerate its accompaniment choices, so the builder uses dishes from the two Diwali feast menus and the existing live-catering beverages. That source and the need to confirm the live-station menu are disclosed in the package notes. The existing eleven dosa varieties remain available. The standalone Live Catering occasion retains its separate 30-guest offer.

The poster's prices apply only to these three Diwali packages; other packages retain pricing on enquiry. The prices and selected dishes carry into search, the planner, request preview and enquiry email. No new fees or tax rates have been assumed. Menu choice limits are enforced in the UI, preview validation and saved-plan decoding. Removed package names cannot restore from an old cookie.

Run `npm run test:diwali`, `npm run test:plan`, `npm run test:search`, `npm run lint`, and `npm run build`.

## Homepage Diwali feature

A separate, full-width teal-and-gold Diwali Specials section appears immediately below the main homepage hero and above Choose Your Occasion, with larger headings, package names and prominent prices. Signature Celebration has a contrasting recommended card. Its three offer buttons use the existing package data and open the corresponding Diwali menu. Signature Celebration is marked Recommended, matching the supplied marketing poster. Explore Diwali specials opens the Diwali category, and the quote link calls (408) 893-0438.

The supplied `Elegant Diwali Catering Packages (1).png` is preserved unchanged as [public/images/diwali-catering-poster.png](../public/images/diwali-catering-poster.png). A WebP encoding is also retained as a source asset. The homepage feature displays the full-width package and pricing cards; the flyer has been removed from the layout. The poster is user-supplied artwork. The detailed package selections remain defined in the Diwali menu data.

## Sharing and bookmarks

Share **https://srivaricatering.com/#diwali** after deploying the changes. The fragment automatically opens the Diwali category and scrolls to its packages on a fresh visit or reload. An explicit Diwali bookmark takes precedence over the browser's saved catering plan. Selecting Diwali through the occasion card, promotion, package cards or menu search updates the address bar to the same bookmark. Leaving Diwali or clearing the plan removes that bookmark, so it cannot reopen the wrong category on reload.

The promotion contains Copy Diwali link and Share Diwali menu controls. Copy uses the configured public site origin, even during local preview, and falls back to a selected, read-only URL when clipboard access is unavailable. Shared URLs do not include contact details or saved-plan selections. No additional page or sitemap entry is needed for the fragment link.

## Occasion image

Generated using the built-in imagegen tool on October 24, 2026 and encoded as WebP for the website. The selected image is [public/images/occasion-diwali.webp](../public/images/occasion-diwali.webp) (1536 × 1024). It is illustrative imagery, rather than a photograph of the restaurant's actual food.

Final prompt:

> Use case: photorealistic-natural. Asset type: landscape photograph for Srivari vegetarian catering website Diwali occasion card, 3:2 landscape composition. Primary request: an elegant Diwali vegetarian feast with glowing terracotta diyas, warm fairy-light bokeh, a modest marigold accent, gleaming brass serving bowls of paneer curry, jackfruit vegetable biryani, small golden masala vadai, and gulab jamun. Food visibly appetising in foreground, diyas clearly identifiable near the food, restrained festive styling in warm gold, cream and orange matching a luxury Indian vegetarian catering brand. High-end editorial food photography, natural textures, shallow depth of field, no people, no lettering, no logos, no watermarks, no Golu dolls or tiered figurine display. Generate a new image, not a menu poster.

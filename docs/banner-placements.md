# Responsive Srivari catering placements

Publish the catering website with the new `public/embeds/` assets first. Then paste one of the following tags into a **Custom HTML / Embed HTML block in the page body**, at the position where the banner should appear. The same centrally hosted script works on `srivaricatering.com` and `srivaripleasanton.com`.

This is an inline promotional placement. It is not a Google Ads, Google Tag Manager, or other ad-network remarketing tag. It does not require a platform account or set visitor cookies.

## Tags for the two websites

On **srivaricatering.com**:

```html
<script async
  src="https://srivaricatering.com/embeds/srivari-catering.js"
  data-campaign="catering"
  data-theme="dark"
  data-placement="catering-home-banner">
</script>
<noscript><a href="https://srivaricatering.com/#occasions">Explore Srivari vegetarian catering</a></noscript>
```

On **srivaripleasanton.com**:

```html
<script async
  src="https://srivaricatering.com/embeds/srivari-catering.js"
  data-campaign="catering"
  data-theme="dark"
  data-placement="restaurant-home-banner">
</script>
<noscript><a href="https://srivaricatering.com/#occasions">Explore Srivari vegetarian catering</a></noscript>
```

The banner renders immediately before its script tag. Its width follows the surrounding column and its height adjusts to its content. Use a normal full-width section or sidebar with automatic height, rather than a fixed-height ad slot. The main button opens a new tab, and the phone link calls (408) 893-0438.

For a homepage placement, put it after the introductory content or before the footer. Existing Diwali campaign tags now show the Thanksgiving harvest promotion.

## Diwali placement

```html
<script async
  src="https://srivaricatering.com/embeds/srivari-catering.js"
  data-campaign="diwali"
  data-theme="dark"
  data-placement="restaurant-diwali-banner">
</script>
<noscript><a href="https://srivaricatering.com/#diwali">Explore Srivari Diwali catering</a></noscript>
```

`data-campaign="diwali"` is now a compatibility alias for `thanksgiving`. Both render the same harvest design, copy, and Thanksgiving offer link, and use `utm_campaign=srivari-thanksgiving`. Existing partner script tags, including versioned script URLs, continue to work without any changes on the partner website. Destination, source, and placement settings are preserved. Thanksgiving uses the theme name `light` with its own forest green harvest palette; no partner configuration changes are needed. Other campaigns retain the standard ivory palette for `light`.

Preview the existing partner configuration at `/embeds/demo.html?campaign=diwali&theme=light`. Deploy the updated shared assets on srivaricatering.com for partner websites to receive the replacement on reload. JavaScript-disabled visitors still see the partner page's existing `noscript` fallback, which cannot be changed by the shared script.

## Navarathri placement

The Navarathri campaign retains its animated lamp, gold string-light borders, and responsive layout. It defaults to ivory and links to the catering contact page for quotes. Preview it locally at `http://localhost:3000/embeds/demo.html?campaign=navarathri&theme=light`.

```html
<script async
  src="https://srivaricatering.com/embeds/srivari-catering.js"
  data-campaign="navarathri"
  data-theme="light"
  data-placement="restaurant-navarathri-banner">
</script>
<noscript><a href="https://srivaricatering.com/contact">Enquire about Srivari Navarathri catering</a></noscript>
```

Publish the updated embed assets before using this tag on another website.

## Thanksgiving placement

The Thanksgiving campaign uses a compact deep forest green harvest design with thin engraved wheat-and-pumpkin borders and a visible orange pumpkin below the logo. It retains `data-theme="light"` for partner compatibility, with campaign-specific colors that keep this forest green design. Other ivory campaigns are unchanged. It has no hanging flowers, large corner decorations, diya, or string lights. The border stays outside the copy and buttons, including narrow placements. Its button opens the homepage Thanksgiving offer section. Preview it at `http://localhost:3000/embeds/demo.html?campaign=thanksgiving&theme=light`.

```html
<script async
  src="https://srivaricatering.com/embeds/srivari-catering.js"
  data-campaign="thanksgiving"
  data-theme="light"
  data-placement="restaurant-thanksgiving-banner">
</script>
<noscript><a href="https://srivaricatering.com/#thanksgiving-offer">Explore Srivari Thanksgiving catering</a></noscript>
```

The banner includes a compact scratch-to-reveal offer: **10% off orders over $40**, with code **THANKS10**, through November 26, 2026 (Pacific time). Visitors can scratch with a mouse or finger, or use the keyboard-accessible Reveal code button, then copy the code to mention with their catering enquiry. The existing Diwali tag shows the same offer. The offer is hidden after expiry and for ezCater destinations; it does not apply a discount automatically or transfer a code to an external cart. Keep the embed terms synchronized with `app/data/thanksgiving-offer.ts` if the promotion changes.

On wide placements, the scratch card sits in the right column, with a small Explore button below the copy on the left. It uses a bright gold ticket with a burnt-orange 10% OFF heading, expiry badge, ticket notches, and pale-gold scratch panel, contrasting with the forest green harvest banner. Narrow placements stack the card below the text. Publish the updated shared assets on srivaricatering.com for existing partner tags to receive the scratch card.

## ezCater placement

```html
<script async
  src="https://srivaricatering.com/embeds/srivari-catering.js"
  data-campaign="corporate"
  data-destination="ezcater"
  data-theme="light"
  data-placement="restaurant-ezcater-banner">
</script>
<noscript><a href="https://www.ezcater.com/catering/srivari-3?fulfillmentDetailId=f9917079-1d88-471b-8ac1-e74b901096d9">Order Srivari on ezCater</a></noscript>
```

This uses the supplied ezCater URL including its fulfillment parameter. No website planner information is transferred into ezCater. Review the menu, fees, and availability on the external ordering site.

## Optional settings

| Attribute | Values / behaviour |
| --- | --- |
| `data-campaign` | `catering` (default), `diwali`, `navarathri`, `thanksgiving`, or `corporate`. Navarathri and corporate enquiries link to `/contact`; Diwali and Thanksgiving both link to `/#thanksgiving-offer`. |
| `data-theme` | `dark` (teal) or `light` (ivory). Defaults to teal, or ivory for Navarathri. Diwali and Thanksgiving use the `light` name with their own forest green harvest palette. |
| `data-destination` | `website` (default) or `ezcater`. |
| `data-placement` | A short placement label such as `restaurant-home-banner`; letters, numbers, underscores, and hyphens only. |
| `data-source` | Optional source label; defaults to the embedding website’s hostname. Letters, numbers, periods, and hyphens only. |
| `data-container` | Optional ID of an existing element to append the banner into. The element must exist before the script executes. |

For a named placement, put the container before the script:

```html
<div id="srivari-sidebar-promotion"></div>
<script async
  src="https://srivaricatering.com/embeds/srivari-catering.js"
  data-container="srivari-sidebar-promotion"
  data-campaign="corporate"
  data-placement="restaurant-sidebar">
</script>
```

Each tag creates one independent placement. Multiple tags may appear on the same page. Unknown campaign and theme values fall back to general catering and teal. The embed does not accept arbitrary destination URLs or user-provided HTML.

## Preview and maintenance

- Local preview after `npm run build`: `http://localhost:8790/embeds/demo.html` when using the existing Cloudflare preview on port 8790.
- Published preview: `https://srivaricatering.com/embeds/demo.html` after deployment.
- The public domain is attached to the Cloudflare Worker `srivari-events-catering`; `wrangler.jsonc` targets that Worker. Deploying the separate `srivari-catering` Worker does not update `srivaricatering.com`.
- The preview offers all campaigns, themes, destinations, and a width slider from 160 to 1440 pixels, plus a copyable tag.
- `public/embeds/srivari-catering.js` contains the creative text, destinations, and image paths. If the ezCater URL changes, update its embed constant as well as `app/data/ordering-partners.ts`.
- `public/embeds/srivari-catering.css` contains the isolated layout and colours. CSS container queries adapt to the placement width, with a wrapping flex layout as a fallback.
- `public/_headers` makes these utility assets revalidate on reload and applies `noindex` on Cloudflare. ETags allow unchanged files to be reused without keeping an older banner revision for five minutes. The demo also contains its own `noindex` meta tag and is not included in the public sitemap.

The script uses Shadow DOM so its layout does not inherit the restaurant website’s heading, image, button, or font styles. It loads only its stylesheet and Srivari-hosted images. Website links add `utm_source` (hostname or source label), `utm_medium=referral`, `utm_campaign`, and `utm_content` (placement label). The ezCater URL is left intact. The embed does not count impressions, send click beacons, set cookies, store browser data, or add analytics. URL labels only become reports if analytics is configured separately on the destination.

If the host website uses a Content Security Policy, allow `https://srivaricatering.com` in its script, stylesheet, and image sources. Editors that strip script tags need their supported Custom HTML or script-injection facility. The optional `noscript` link provides a plain link when JavaScript is disabled.

The supplied assets and placement tags are ready for review; deployment and pasting them into the restaurant website are separate publishing steps.

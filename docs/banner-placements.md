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

For a homepage placement, put it after the introductory content or before the footer. The existing Diwali promotion already leads the catering homepage; a second Diwali banner is better suited to the restaurant homepage or a smaller secondary placement.

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

The button opens the existing `#diwali` bookmark and Diwali package choices. Prices are not repeated in the creative, so menu enquiries and any future price changes remain on the destination page.

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
| `data-campaign` | `catering` (default), `diwali`, or `corporate`. Corporate enquiries link to `/contact`. |
| `data-theme` | `dark` (default teal) or `light` (ivory). |
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
- The preview offers all campaigns, themes, destinations, and a width slider from 160 to 1440 pixels, plus a copyable tag.
- `public/embeds/srivari-catering.js` contains the creative text, destinations, and image paths. If the ezCater URL changes, update its embed constant as well as `app/data/ordering-partners.ts`.
- `public/embeds/srivari-catering.css` contains the isolated layout and colours. CSS container queries adapt to the placement width, with a wrapping flex layout as a fallback.
- `public/_headers` applies a five-minute asset cache and `noindex` to these utility assets on Cloudflare. The demo also contains its own `noindex` meta tag and is not included in the public sitemap.

The script uses Shadow DOM so its layout does not inherit the restaurant website’s heading, image, button, or font styles. It loads only its stylesheet and Srivari-hosted images. Website links add `utm_source` (hostname or source label), `utm_medium=referral`, `utm_campaign`, and `utm_content` (placement label). The ezCater URL is left intact. The embed does not count impressions, send click beacons, set cookies, store browser data, or add analytics. URL labels only become reports if analytics is configured separately on the destination.

If the host website uses a Content Security Policy, allow `https://srivaricatering.com` in its script, stylesheet, and image sources. Editors that strip script tags need their supported Custom HTML or script-injection facility. The optional `noscript` link provides a plain link when JavaScript is disabled.

The supplied assets and placement tags are ready for review; deployment and pasting them into the restaurant website are separate publishing steps.

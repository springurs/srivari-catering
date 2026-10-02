# Srivari Catering

A responsive catering website built with Next.js, React, TypeScript, and Tailwind CSS. The homepage follows the supplied mockup with a left navigation sidebar, wide buffet hero, five occasion cards, and the Pleasanton address in the footer.

Selecting Weddings, Traditional Package, Corporate Events, Combos, or Festive Catering reveals relevant packages. Weddings contains Wedding Thali Combo ($24.99 per person). Corporate Events contains three proposed vegetarian menus: Srivari Power Lunch, The Boardroom Feast, and The Meeting Break, all with pricing upon enquiry. Traditional Package contains Andhra Inti Bhojanam ($22.99 per person), Apna Ghar Ka Bhojan ($23.99 per person), and Namba Oru Sapadu ($22.99 per person). Combos contains Srivari Signature Veg Feast ($20 per person, minimum 25 guests), plus a Tiffin Combos subsection with Quick Fill Combo, Jumbo Combo, and Wedding Style Tiffin. Tiffin dishes follow the supplied menus, with Jain options noted for Quick Fill and Jumbo; prices and minimum orders were not supplied, so pricing is upon enquiry. Each package option includes a matching food thumbnail beside its title. Visitors can inspect all included dishes and open an event planner prefilled with their occasion and package. The $20 combo supports choosing two distinct starters, two distinct curries, and one dessert; selections are included in the downloadable brief. About Us is a detailed homepage section immediately after Choose Your Occasion, covering Tamil, Andhra, and North Indian vegetarian meals, South Indian tiffin, Tamil and Telugu festive specialties, and modern office menus. Cuisine descriptions follow the current menu data, with Jain and no-onion/no-garlic guidance limited to the supplied options. Sidebar and footer About Us links reach this section from both pages. Gallery and its dialog have been removed. Contact Us opens a separate `/contact` page with a map and simple enquiry form; both pages share the sidebar and footer. The Contact Us page splits equally between an interactive Google Map on the left and the enquiry form on the right, stacking vertically on mobile. It also includes a link to open Google Maps in a new tab.

Festive Catering contains the supplied Golu Season Packages: Small ($99, serves 8–10), Medium ($219, serves 15–20), and Premium Golu Heritage ($399, serves 25–30). Prices are per package. Full inclusions, upgrades, individual Golu boxes, and all 77 rows across the six Tamil and Telugu specialty tables are transcribed from the two supplied attachments. Specialty rates are suggested pickup prices before tax and delivery, with small/medium serving guidance and item-specific quantities preserved. The Medium package requires one sweet selection in the planner.

The corporate menus were created at the user’s request as modern menu suggestions, rather than transcribed from the PDFs. Srivari Power Lunch offers a choice of rice or millet base and paneer or chickpea main; required choices are included in the event brief. The Boardroom Feast pairs paneer tikka and beetroot-aloo sliders with dahi papdi chaat cups and a shared lunch spread. The Meeting Break features podi idly skewers, mini uttapam tacos, paniyaram, paneer wraps, rose-rabdi dessert cups, and tea or coffee. Power Lunch also includes masala corn and peanut chaat cups. Dish availability, prices, minimum orders, packaging, and dietary arrangements must be confirmed with the business. Individual bowls and shared spreads were inspired by the formats on [Sweetgreen’s catering page](https://www.sweetgreen.com/catering); the Indian dishes and names are original suggestions for Srivari. Slider and finger-food formats were also informed by [Peter and Paul’s corporate catering menu](https://corporate.bypeterandpauls.com/pdf/Corporate-Catering-Menus.pdf).

## Development

```sh
npm install
npm run dev
```

Open http://localhost:3000.

## Production

```sh
npm run lint
npm run build
```

The project uses `output: "export"`; deploy the generated `out/` directory to a static host. Use a static file server to preview `out/` locally rather than `next start`.

## Cloudflare Workers deployment

`wrangler.jsonc` configures the `srivari-catering` Worker to serve the static export from `out/`, including the exported 404 page. This site does not need the OpenNext server adapter.

Use these settings in Cloudflare Workers Builds:

- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`
- Root directory: the repository root

For Cloudflare Pages instead, use `npm run build` and set the build output directory to `out`.

Local preview and deployment checks:

```sh
npm run preview
```

To validate deployment configuration without publishing:

```sh
npm run build
npx wrangler deploy --dry-run
```

To publish manually after authenticating with Cloudflare, run `npm run deploy`.

If a previous deployment attempt auto-generated OpenNext files only in the Cloudflare build environment, clear the build cache once and redeploy from a commit containing `wrangler.jsonc` and the updated lockfile. Deploying the explicit static-assets configuration avoids the auto-migration that tried to read `.next/standalone/.next/server/pages-manifest.json` from a static export.

## Content and enquiries

Combo menus, prices, selection options, and the $20 combo's minimum order are transcribed from the supplied PDF in `app/data/catering-menu.ts`. Apna Ghar Ka Bhojan comes from page 6 of the six-page edition, `Srivari_Vegetarian_Catering_Combos (1) (2).pdf`. The PDF does not specify a minimum order for the three thali menus, so no minimum is displayed for those packages. Namba Oru Sapadu contains the current 14-dish menu, including Masal Vadai / Medhu Vada and Paruppu Podi with Ghee. The current menu sets Apna Ghar Ka Bhojan at $23.99 and Namba Oru Sapadu at $22.99 per person; these business edits take precedence over earlier PDF prices. No minimum order is specified for Namba Oru Sapadu. The separate Contact Us page and the footer use the supplied address: 3180 Santa Rita Rd, Pleasanton, CA 94566. The contact form submits enquiries to the supplied address srivaripleasanton@gmail.com through FormSubmit. The Address and Additional Information cards have been removed at the user’s request. The catering phone (408) 893-0438 remains in the festive menu. No customer testimonials have been invented.

The event planner validates required fields and creates a brief that visitors can download or copy. It does not transmit personal details or confirm bookings. Visitors can contact the business using the Contact Us links or the simple enquiry form. The form requires a nonblank name and description, plus at least one of phone or email; a supplied email must be valid. It POSTs JSON to `https://formsubmit.co/ajax/srivaripleasanton@gmail.com` using [FormSubmit’s AJAX integration](https://formsubmit.co/ajax-documentation). The submit button and fields are disabled while sending; duplicate submissions are prevented. Only an explicit successful response shows confirmation and clears the fields. Network, HTTP, provider, activation, and malformed-response failures preserve the entered details and show a retry/direct-email option. Requests time out after 20 seconds. A hidden honeypot helps filter bots; reCAPTCHA is disabled to keep the requested simple AJAX flow. Editing a field clears old validation and submission feedback. The separate event planner still produces local briefs and does not submit them.

About Us uses the real photograph supplied as `thali2.jpg`, copied unchanged to `public/images/about-thali.jpg` (1436 × 1600 pixels). The full portrait framing is preserved on desktop and mobile. The section uses a plain ivory background with white cuisine cards and gold accents, without a background image or gradient.

The locally stored hero and occasion photographs are generated illustrative imagery. The five occasion cards now use separate photographs matching Weddings, Traditional Package, Corporate Events, Combos, and Festive Catering. Generation prompts and provenance are recorded in [docs/hero-image.md](docs/hero-image.md), [docs/occasion-images.md](docs/occasion-images.md), and [docs/package-images.md](docs/package-images.md).

## Contact form email activation

FormSubmit does not require an API key or a server change for this static website. Before accepting live enquiries, submit the form once from the deployed website, then open the activation email sent by FormSubmit to **srivaripleasanton@gmail.com** and confirm the form. See [FormSubmit setup](https://formsubmit.co/). Check the spam folder if necessary. The mailbox owner must complete this step; inbox delivery has not been verified during development.

Contact-form browser checks intercept the provider request and cover validation, request contents, pending state, success, provider rejection, activation responses, HTTP errors, malformed JSON, network failures, and retries without sending test emails.

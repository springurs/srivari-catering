# Srivari Catering

A responsive catering website built with Next.js, React, TypeScript, and Tailwind CSS. The homepage follows the supplied mockup with a left navigation sidebar, wide buffet hero, five occasion cards, and the Pleasanton address in the footer.

Selecting Weddings, Traditional Package, Corporate Events, Combos, or Festive Catering reveals relevant packages. Weddings contains Wedding Thali Combo ($24.99 per person). Corporate Events contains three proposed vegetarian menus: Srivari Power Lunch, The Boardroom Feast, and The Meeting Break, all with pricing upon enquiry. Traditional Package contains Andhra Inti Bhojanam ($22.99 per person), Apna Ghar Ka Bhojan ($23.99 per person), and Namba Oru Sapadu ($22.99 per person). Combos contains Srivari Signature Veg Feast ($20 per person, minimum 25 guests), plus a Tiffin Combos subsection with Quick Fill Combo, Jumbo Combo, and Wedding Style Tiffin. Tiffin dishes follow the supplied menus, with Jain options noted for Quick Fill and Jumbo; prices were not supplied, so pricing is upon enquiry. All wedding, traditional, and combo packages, including tiffin combos, require at least 25 people. This minimum appears on package cards, package details, and the planner, which blocks fewer than 25 people. Each package option includes a matching food thumbnail beside its title. Visitors can inspect all included dishes and open a simple planner prefilled with their package. The $20 combo supports choosing two distinct starters, two distinct curries, and one dessert; selections are included in the downloadable brief. About Us is a detailed homepage section immediately after Choose Your Occasion, covering Tamil, Andhra, and North Indian vegetarian meals, South Indian tiffin, Tamil and Telugu festive specialties, and modern office menus. Cuisine descriptions follow the current menu data, with Jain and no-onion/no-garlic guidance limited to the supplied options. Sidebar and footer About Us links reach this section from both pages. Gallery and its dialog have been removed. Contact Us opens a separate `/contact` page with a map and simple enquiry form; both pages share the sidebar and footer. The Contact Us page splits equally between an interactive Google Map on the left and the enquiry form on the right, stacking vertically on mobile. It also includes a link to open Google Maps in a new tab.

Festive Catering contains the supplied Golu Season Packages: Small ($99, serves 8–10), Medium ($219, serves 15–20), and Premium Golu Heritage ($399, serves 25–30). Prices are per package. Full inclusions, upgrades, individual Golu boxes, and all 77 rows across the six Tamil and Telugu specialty tables are transcribed from the two supplied attachments. Specialty rates are suggested pickup prices before tax and delivery, with small/medium serving guidance and item-specific quantities preserved. The Medium package requires one sweet selection in the package menu.

The corporate menus were created at the user’s request as modern menu suggestions, rather than transcribed from the PDFs. Srivari Power Lunch offers a choice of rice or millet base and paneer or chickpea main; required choices are included in the event brief. The Boardroom Feast pairs paneer tikka and beetroot-aloo sliders with dahi papdi chaat cups and a shared lunch spread. The Meeting Break features podi idly skewers, mini uttapam tacos, paniyaram, paneer wraps, rose-rabdi dessert cups, and tea or coffee. Power Lunch also includes masala corn and peanut chaat cups. Dish availability, prices, minimum orders, packaging, and dietary arrangements must be confirmed with the business. Individual bowls and shared spreads were inspired by the formats on [Sweetgreen’s catering page](https://www.sweetgreen.com/catering); the Indian dishes and names are original suggestions for Srivari. Slider and finger-food formats were also informed by [Peter and Paul’s corporate catering menu](https://corporate.bypeterandpauls.com/pdf/Corporate-Catering-Menus.pdf).

## Development

“Build your perfect menu” groups checkbox choices into accordions, with the first section open by default. Click or use the keyboard on a section heading to open or close it; opening a section collapses the previous one. A section collapses automatically when its last required choice is checked, opening and focusing the next unfinished section. If later sections are complete, it returns to an earlier unfinished section; after every section is complete, all panels collapse. Sections with multiple choice groups stay open until every group is complete. Completed sections can be reopened to edit; unchecking an item keeps the section open until its replacement is selected. Srivari Signature Veg Feast has accordions for Vegetarian starters, Rice & breads, Curries & lentils, and Dessert. Heading counters show selected totals, and choices persist when sections collapse. Reset all appears on the right of Build your perfect menu; it clears only the current package’s choices, resets counters and limits, reopens its first section, and updates the planner while preserving the package and number of people. Choices saved for other packages remain. Panels expand and collapse with a 320ms height transition and a short fade; icons rotate. Closed panels are inert, and reduced-motion preferences disable transitions. Selecting the maximum disables unselected items in that group; checked items remain available to uncheck. Srivari Signature Veg Feast allows two starters, two curries, and one dessert. Its Rice & breads section also requires one rice, one bread, and one biryani/pulao selection; Curries & lentils requires one sambar/dal and one rasam/shorba/kadhi selection alongside the two curries. Each single-choice group uses the existing package alternatives and allows one checked item. Wedding Thali, Andhra Inti Bhojanam, Apna Ghar Ka Bhojan, Namba Oru Sapadu, Quick Fill, Jumbo, and Wedding Style Tiffin now use the same builder for every or/slash alternative. Groups follow the existing course sections; quantities and common dish names are preserved, and bread-with-curry options retain their accompaniments. Fixed inclusions and both fixed Wedding Thali desserts remain included. Their Plan with this package button follows the builder. Corporate and festive menu definitions and button locations are unchanged. The same controls enforce one sweet for Medium Golu and one base/main each for Power Lunch. Choices are retained separately per package. The planner shows one Full package menu section, where selected starters, rice, bread, biryani/pulao, curries, lentils, soup, and dessert from Build your perfect menu replace their choice placeholders. The separate selected-items section is removed; Edit selections sits beside the Full package menu heading. Accompaniments and other fixed inclusions remain. Power Lunch fills in the chosen bowl base and main, and Medium Golu adds the selected sweet. These resolved inclusions also appear in the brief and update when choices change. It retains the package selector and number-of-people field. Edit selections returns to the package checkboxes; fixed packages list their included items. Name, email, occasion, date, location, notes, and the repeated full choice lists have been removed from the planner. Creating a brief requires each group’s exact selection count, includes the full package menu with the chosen dishes filled in, and hides a previous brief when its selections change.

Every package displays its included items in named course groups, covering starters, mains, sides, sweets, and drinks as applicable. Existing dish choices, quantities, and prices are preserved. Corporate packages also show suggested item descriptions, including slider fillings, chaat cups, bowl components, and meeting snacks; these are proposed compositions to confirm with the team. Menu lists and selection options use 14px text, with 20px course headings. Festive tables use 14px text on desktop and 13px on mobile.

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

Combo menus, prices, selection options, and the $20 combo's minimum order are transcribed from the supplied PDF in `app/data/catering-menu.ts`. Apna Ghar Ka Bhojan comes from page 6 of the six-page edition, `Srivari_Vegetarian_Catering_Combos (1) (2).pdf`. The business update sets a minimum of 25 people for all wedding, traditional, and combo packages, overriding the PDFs where no minimum was specified. Namba Oru Sapadu contains the current 14-dish menu, including Masal Vadai / Medhu Vada and Paruppu Podi with Ghee. The current menu sets Apna Ghar Ka Bhojan at $23.99 and Namba Oru Sapadu at $22.99 per person; these business edits take precedence over earlier PDF prices. Namba Oru Sapadu also requires at least 25 people. The separate Contact Us page and the footer use the supplied address: 3180 Santa Rita Rd, Pleasanton, CA 94566. The contact form uses Web3Forms with the access key configured in its hidden input. The Address and Additional Information cards have been removed at the user’s request. The catering phone (408) 893-0438 remains in the festive menu. No customer testimonials have been invented.

The event planner validates the number of people (including package minimums) and exact menu selection counts, then creates a brief containing the package, people, and full package menu with the chosen dishes filled in that visitors can download or copy. It does not transmit personal details or confirm bookings. Visitors can contact the business using the Contact Us links or the simple enquiry form. The form requires a nonblank name and description, plus at least one of phone or email; a supplied email must be valid. It submits `FormData` to `https://api.web3forms.com/submit`, including the configured access key exactly once. Client validation blocks invalid submissions; pending submissions disable the form. Confirmed successful responses clear the fields, while provider, HTTP, network, timeout, and invalid-response errors retain the entered details for retry. Editing a field clears old validation and submission feedback. The separate event planner still produces local briefs and does not submit them.

About Us uses the real photograph supplied as `thali2.jpg`, copied unchanged to `public/images/about-thali.jpg` (1436 × 1600 pixels). The full portrait framing is preserved on desktop and mobile. The section uses a plain ivory background with white cuisine cards and gold accents, without a background image or gradient.

The locally stored hero and occasion photographs are generated illustrative imagery. The five occasion cards now use separate photographs matching Weddings, Traditional Package, Corporate Events, Combos, and Festive Catering. Generation prompts and provenance are recorded in [docs/hero-image.md](docs/hero-image.md), [docs/occasion-images.md](docs/occasion-images.md), and [docs/package-images.md](docs/package-images.md).

## Contact form behavior

The Web3Forms access key controls the recipient inbox. Its intended destination is srivaripleasanton@gmail.com; confirm that mapping in the Web3Forms account. Local browser checks mock API responses and do not send test messages, so live inbox delivery has not been verified.

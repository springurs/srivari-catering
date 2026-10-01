# Srivari Catering

A responsive catering website built with Next.js, React, TypeScript, and Tailwind CSS. The homepage follows the supplied mockup with a left navigation sidebar, wide buffet hero, five occasion cards, and the Pleasanton address in the footer.

Selecting Weddings, Birthday Parties, Corporate Events, Housewarming, or Festive Catering reveals relevant sample packages. Visitors can inspect the included dishes and open an event planner prefilled with their occasion and package. About Us and Gallery open accessible dialogs.

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

## Content and enquiries

Menu names and dishes are sample content to be confirmed with the business. The footer uses the supplied address: 3180 Santa Rita Rd, Pleasanton CA 94566. Package pricing is shown as available upon enquiry; no phone number, email address, prices, or customer testimonials have been invented.

The event planner validates required fields and creates a brief that visitors can download or copy. It does not transmit personal details or confirm bookings. Add the business's verified contact details and an enquiry delivery service before accepting enquiries online.

The locally stored hero and occasion photographs are generated illustrative imagery. Generation prompts and provenance are recorded in [docs/hero-image.md](docs/hero-image.md).

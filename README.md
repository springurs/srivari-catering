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

Menu names and dishes are sample content to be confirmed with the business. The footer uses the supplied address: 3180 Santa Rita Rd, Pleasanton CA 94566. Package pricing is shown as available upon enquiry; no phone number, email address, prices, or customer testimonials have been invented.

The event planner validates required fields and creates a brief that visitors can download or copy. It does not transmit personal details or confirm bookings. Add the business's verified contact details and an enquiry delivery service before accepting enquiries online.

The locally stored hero and occasion photographs are generated illustrative imagery. Generation prompts and provenance are recorded in [docs/hero-image.md](docs/hero-image.md).

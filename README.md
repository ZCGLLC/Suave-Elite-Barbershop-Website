# Suave Elite Barbershop — Website

A static marketing site for **Suave Elite Barbershop**, 4540 Ross Avenue, Suite 110,
Dallas, TX 75204. Built as plain HTML, CSS and JavaScript with no build step or
dependencies, so it can be hosted anywhere that serves files.

## Pages

| File            | Purpose                                                                    |
| --------------- | -------------------------------------------------------------------------- |
| `index.html`    | Home — hero, the shop's standard, signature services, barbers, gallery, reviews, hours and map |
| `services.html` | The complete service menu, all 24 services with prices, durations and category filters |
| `shop.html`     | "The Counter" — retail grooming products by category, plus gift cards       |
| `visit.html`    | Address, hours, parking, amenities, FAQs and contact                        |

Supporting files: `assets/css/style.css`, `assets/js/main.js`,
`assets/img/favicon.svg`, `robots.txt`, `sitemap.xml`.

## Running it

No install required. Open `index.html` directly, or serve the folder:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Deploying

Any static host works — GitHub Pages, Netlify, Vercel, Cloudflare Pages or plain
shared hosting. Upload the repository contents to the web root.

Before going live, replace the placeholder domain
`https://www.suaveelitebarbershop.com/` in the `<link rel="canonical">` tags, the
JSON-LD blocks, `robots.txt` and `sitemap.xml` with the real domain.

## Business details used

These come from the shop's public listings (Google, Booksy, Yelp and local
directories) and are hard-coded in the HTML:

- **Address** — 4540 Ross Ave, Suite 110, Dallas, TX 75204 (Old East Dallas)
- **Phone** — (214) 272-9996
- **Hours** — Monday to Saturday 10 AM – 7 PM, Sunday 10 AM – 5 PM
- **Booking** — the Booksy profile linked from every "Book" button
- **Rating** — 4.7★ on Google; 5.0★ across 1,200+ Booksy bookings

### Service menu

All 24 services and prices are taken from the shop's published booking menu:
haircut and men's haircut $40, skin fade $35, buzz cut $30, kid's haircut $30,
head shave $30, shaved head $35, line up $25, edge up $10, shape up $20, design
$10, eyebrow shaping $10, the six beard services at $20 each, hot towel shave $40,
straight razor shave $35, haircut & beard $50, head shave & beard trim $40, full
service $60, and hair wash $10.

The service descriptions were written for this site — they describe standard
barbering practice rather than being quoted from the shop, so read them through
and adjust anything that does not match how you actually work.

## Things to confirm or replace before launch

1. **Photography.** Every image slot is currently an elegant line-art placeholder
   (`.frame` elements). Drop real photos of the shop, the barbers and finished cuts
   into `assets/img/` and replace the `<div class="frame__placeholder">…</div>`
   inside each frame with `<img src="assets/img/your-photo.jpg" alt="…">`. This is
   the single biggest visual upgrade available to the site.
2. **Product pricing.** The shop has no published retail price list, so every item
   on `shop.html` shows "At the counter" instead of a number. Swap those
   `<span class="product__price">` values for real prices, and adjust the product
   names to the brands actually stocked.
3. **Barber roster.** `index.html` lists Bryan, Andrea "Dre" and Jacob, who are
   named repeatedly in public reviews. Confirm the spelling, titles and the full
   roster, and add or remove cards to match the team.
4. **Social links.** The Instagram and Facebook links in the footer currently point
   at the platform home pages. Point them at the shop's real profiles.
5. **Hours.** Google and Booksy list closing at 7 PM; one directory lists 8 PM.
   The site uses 7 PM, in `visit.html`, `index.html`, the footers, the JSON-LD and
   the `HOURS` array in `assets/js/main.js`. Update all five if that is wrong.
6. **Review quotes.** The three quotes on the home page are real, drawn from public
   Yelp, Booksy and Google review summaries. Replace them with newer favourites
   whenever you like — keep the attributions honest.

## How the code is organised

`assets/css/style.css` is a single numbered stylesheet: design tokens first, then
layout primitives, typography, and each component in turn. Colours, fonts and
spacing all come from custom properties at the top, so the whole palette can be
retuned from `:root`.

`assets/js/main.js` is one IIFE with no dependencies. It handles the sticky header,
the mobile drawer, scroll reveals, the live open/closed indicator, the FAQ
accordion, the service filters and the sub-navigation highlighting. Everything
degrades gracefully — with JavaScript off, all content is still present and
readable, and `prefers-reduced-motion` disables every animation.

Opening hours live in one place in JavaScript, as the `HOURS` array. The status
line reads the current time in `America/Chicago`, so it stays correct for visitors
in other timezones.

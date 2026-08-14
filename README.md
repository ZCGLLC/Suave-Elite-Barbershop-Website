# Suave Elite Barbershop — Website

A clean, classy, high-end marketing website for **Suave Elite Barbershop** (4540 Ross Ave, Suite 110, Dallas, TX 75204 · Old East Dallas), built to reflect the shop's real Google reputation (4.7+ stars) and full service menu.

## Stack

Pure static HTML / CSS / JS — no build step, no dependencies. Works on any static host (GitHub Pages, Netlify, Vercel, S3, etc.).

- `index.html` — page markup and content
- `css/styles.css` — design system (black / ivory / brushed-gold palette, serif + sans typography)
- `js/script.js` — mobile nav toggle, sticky header shadow, scroll-reveal animations
- `images/` — hero and gallery imagery

## Sections

Sticky header & mobile nav · Hero · Trust strip (rating & review stats) · About · Services & Pricing (full real menu) · Barbers · Gallery · Reviews · Visit/Location (with embedded map & hours) · Final CTA · Footer.

## Local preview

```bash
python3 -m http.server 8080
# then open http://localhost:8080
```

## Content sourcing

Business details (address, phone, hours, service menu & pricing, team names, review excerpts) were gathered from the shop's public listings (Google, Yelp, Booksy, ZipAppointments, MapQuest, BestProsInTown). Pricing and hours should be reconfirmed periodically, as they are subject to change — a note to this effect is included in the Services section of the site.

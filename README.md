# Suave Elite Barbershop — Website

A clean, high-end single-page website for **Suave Elite Barbershop**, located at
4540 Ross Avenue, Suite 110, Dallas, TX 75204 (Old East Dallas).

## Highlights

- **Real business data** — services, prices, barbers, hours, phone number and photos are
  sourced from the shop's public Booksy profile and Google listing.
- **Full grooming menu** — haircuts, beard & shave services, signature packages
  (Presidential, VIP, Urban Luxe, House Calls) and finishing touches, with "from" pricing.
- **Barber roster** — all 8 resident barbers with photos, specialties and direct
  Booksy booking links.
- **Gallery** — real photos of the barbers' work.
- **Visit section** — hours (with today's row highlighted), embedded Google Map,
  tap-to-call phone number and directions link.
- Dark, gold-accented design with editorial serif typography, scroll-reveal animations,
  a gallery lightbox and a fully responsive layout with a mobile menu.

## Tech

Pure static site — no build step, no dependencies.

```
index.html      # single-page site
css/styles.css  # all styling
js/main.js      # nav, reveal animations, lightbox, hours highlight
assets/img/     # shop and barber photos
```

## Run locally

Open `index.html` directly, or serve it:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploy

Works out of the box on any static host (GitHub Pages, Netlify, Vercel, Cloudflare Pages).

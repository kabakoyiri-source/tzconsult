# Tzeriz Consultant – website

Static website (HTML / CSS / JavaScript). No build step and no framework: upload the whole folder to any web host (OVH, o2switch, Netlify, Vercel, GitHub Pages…).

## Structure
- `index.html` – Home
- `firm.html` – The Firm
- `expertise.html` – Expertise, Client Representation, Management of affairs
- `contact.html` – Contact form
- `legal.html` – Legal notice and privacy policy
- `css/style.css`, `js/main.js`, `images/` (original artworks and generated editorial images)
- `images/GENERATED-IMAGES.md` — image generation prompts and the final asset list

Fonts load from Google Fonts (Cormorant Garamond for headings, Jost for text).

## Design notes
- Palette: midnight ink, ivory paper and champagne gold, defined as variables at the top of `css/style.css`.
- The home page opens with a short curtain animation, shown once per browser session. All animations are switched off for visitors who ask their system for reduced motion, and every page stays fully readable if JavaScript is disabled.

## To complete before going live
1. **Email address**: the site uses `contact@tzeriz-consultant.com`. If the domain is different, replace it everywhere (search for `tzeriz-consultant.com` in all .html files and in `js/main.js`).
2. **Contact form**: create a form endpoint (e.g. Formspree, Getform, or your own backend) and put its URL in `data-endpoint=""` on the `<form id="contact-form">` in `contact.html`. Until then the form shows the email address instead.
3. **Legal notice** (`legal.html`): fill in legal form, registered office, registration number and host (marked `[to be completed]`).
4. **Founding partner** (`firm.html`, section `#leadership`): replace `images/business.jpg` in the arched frame with a portrait (portrait format works best) and, if desired, add the partner's name to the "Founding Partner" caption.
5. **Open Graph**: change `og:image` to the absolute URL once the domain is known (e.g. `https://www.tzeriz-consultant.com/images/hero.jpg`).

# Tzeriz Consultant – website

Static website (HTML / CSS / JavaScript). No build step and no framework: upload the whole folder to any web host (OVH, o2switch, Netlify, Vercel, GitHub Pages…).

## Structure
- `index.html` – Home
- `firm.html` – The Firm
- `expertise.html` – Expertise, Client Representation, Management of affairs
- `contact.html` – Contact form
- `verification.html` – KYC and address verification, AML Crypto information and donation details copied from the supplied project
- `legal.html` – Legal notice and privacy policy
- `css/style.css`, `js/main.js`, `images/` (original artworks, generated editorial images and stock photography)
- `images/GENERATED-IMAGES.md` — image generation prompts and the final asset list
- `images/PHOTO-CREDITS.md` — sources and licenses for the real photographs

Fonts load from Google Fonts (Cormorant Garamond for headings, Jost for text).

## Design notes
- Palette: midnight ink, ivory paper and champagne gold, defined as variables at the top of `css/style.css`.
- The home page opens with a short curtain animation, shown once per browser session. All animations are switched off for visitors who ask their system for reduced motion, and every page stays fully readable if JavaScript is disabled.

## To complete before going live
1. **Email address**: the site uses `contact@tzeriz-consultant.com`. If the domain is different, replace it everywhere (search for `tzeriz-consultant.com` in all .html files and in `js/main.js`).
2. **Contact form**: create a form endpoint (e.g. Formspree, Getform, or your own backend) and put its URL in `data-endpoint=""` on the `<form id="contact-form">` in `contact.html`. Until then the form shows the email address instead.
3. **Legal notice** (`legal.html`): fill in legal form, registered office, registration number and host (marked `[to be completed]`).
4. **Founding partner** (`firm.html`, section `#leadership`): the section currently uses an illustrative photograph of Lady Justice. If a portrait of the actual founding partner becomes available, replace `images/leadership-law.jpg` and its responsive version, then update the caption and alternative text.
5. **Open Graph**: change `og:image` to the absolute URL once the domain is known (e.g. `https://www.tzeriz-consultant.com/images/hero.jpg`).
6. **Team** (`index.html` and `firm.html`, section `#team`): the six names and job titles are illustrative examples requested for the design. Both directories remain visible without scroll-reveal animations. Replace the examples on both pages with confirmed team details and update the visible explanatory note before presenting them as actual staff.
7. **Verification** (`verification.html`): configure `data-endpoint=""` on `#kyc-form` with the intended HTTPS submission service. The form posts `name`, `number` and `documents` only when the visitor submits. Until configured, it directs visitors to contact the firm and never reports a successful submission. The page retains the source project's Meye Asset Management references, AML Crypto text and donation addresses; confirm those details before changing them to another entity. `js/verification.js` handles manual entry, explicit clipboard pasting, submission and copying the displayed donation addresses. It does not import the old portal's authentication or data storage.

# PulseFit Fitness — Website

A fictional but realistic gym website for **PulseFit**, based in Pithoragarh, Uttarakhand. This is a portfolio-quality project structured well enough to adapt for a real gym client.

## Status: Phase 5 — Homepage Build + Correction Pass

Phase 4 built the foundation: project structure, the global CSS system, the header with mobile + desktop navigation, and the hero section.

Phase 5 built the rest of the homepage, in this order:

1. Trust Strip — "Is PulseFit For You?" (4 self-identification paths)
2. Why PulseFit — 4 benefits, in a split layout rather than a card-grid
3. Programs — Build Muscle, Weight Loss, Get Stronger, Personal Training
4. Facilities (image-led gallery) + a beginner-friendly reassurance callout ("Pehla din hai? Tension nahi.")
5. Trainers preview (with photo areas) + Membership preview (with demo pricing)
6. Testimonials (explicitly labeled as demo content) + a weekly class-timetable preview
7. Visit Us (location, hours, map, call/WhatsApp/directions) + FAQ
8. A final CTA band + an expanded footer

A correction pass then fixed: a missing standalone "Why PulseFit" section, text-heavy facility cards (now an illustrated image gallery), placeholder-initial trainer avatars (now proper photo areas with experience listed), hidden membership pricing (now shown in ₹, clearly marked as demo), a mislabeled "schedule" that was really just operating hours (now a real class timetable), an unlabeled placeholder phone number (now explicitly marked as a demo contact), and dead `#` links on every "Start Free Trial" / "WhatsApp Us" CTA (now pointing to a real `trial.html` placeholder page and working `wa.me` links).

Dedicated pages for `/programs`, `/membership`, `/trainers`, `/schedule`, and `/visit` are linked from the header, footer, and relevant sections, but are not built yet — that's future-phase work. `trial.html` is built, as a minimal non-form placeholder for the "Start Free Trial" CTA.

## Running it locally

No build step, no dependencies. Just open `index.html` in a browser.

```
pulsefit/
├── index.html
├── trial.html
├── styles.css
├── script.js
└── assets/
    ├── images/
    ├── icons/
    └── logo/
```

## Stack

Plain HTML, CSS, and vanilla JavaScript. No frameworks, no build tools.

## Design tokens

Colors, spacing, radii, and type sizes all live as CSS custom properties at the top of `styles.css`, under `:root`. Change a value once there and it updates everywhere it's used.

| Token | Value | Use |
|---|---|---|
| `--bg` | `#0C0D0F` | page background |
| `--surface` / `--surface-2` | `#15171A` / `#1D2024` | cards, panels |
| `--text` / `--text-muted` | `#F5F6F7` / `#A5A9B0` | body copy |
| `--accent` | `#B7F000` | CTAs, highlights — used sparingly by design |
| `--warm` | `#E9E5DC` | reserved for later phases |

Display font is **Oswald**, body font is **Inter**, both loaded from Google Fonts in `index.html`.

## Mobile-first

The primary reference width is 390px. The mobile layout isn't a shrunk-down desktop layout — it's built first, then progressively expanded at 768px, 1024px, 1280px and 1440px in the "Responsive rules" section of `styles.css`. The hamburger menu switches over to the full horizontal navigation at the 1024px breakpoint.

## Navigation behavior (`script.js`)

A single `navigation()` function handles the mobile menu:

- Opens/closes on tap of the hamburger button
- Closes on <kbd>Escape</kbd>, returning focus to the hamburger
- Closes automatically after a navigation link is selected
- Locks background scroll while open
- Keeps `aria-expanded` (on the button) and `aria-hidden` (on the menu panel) as the single source of truth the CSS reads from, so the visual and accessible states can't drift apart
- Uses `inert` on `<main>` while the menu is open, so keyboard and screen-reader focus can't land on content hidden behind the overlay
- Closes itself if the window is resized past the desktop breakpoint while open

## What's intentionally not here yet

- No backend, no form submissions, no real trial/booking flow — `trial.html` is a static placeholder explaining that online booking isn't live, with Call/WhatsApp as the immediate path
- No fabricated reviews, ratings, or member counts — testimonials are explicitly labeled as demo content, and membership prices are explicitly labeled as demo/fictional
- The `/programs`, `/membership`, `/trainers`, `/schedule`, and `/visit` pages themselves aren't built — only linked to
- Call and WhatsApp numbers (`+91 90000 00000`) are visibly labeled in-page as a demo placeholder, not a working number
- Facility "photos" are original geometric SVG illustrations, not stock photography — avoids any copyright or misrepresentation risk for a fictional business; a note in the section says real photos will replace them later
- Trainer "photos" are illustrated silhouettes with a visible "Demo Photo" badge, not real people — using stock photos of real individuals to represent fictional staff would misrepresent them
- No React/Tailwind/Bootstrap/build system, per the project's constraints

## Browser support

Built against current evergreen browsers (Chrome, Firefox, Safari, Edge). Uses modern but well-supported CSS (`aspect-ratio`, `:focus-visible`, custom properties) and the `inert` attribute.

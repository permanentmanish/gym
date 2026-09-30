# PulseFit Fitness — Website

A fictional but realistic gym website for **PulseFit**, based in Pithoragarh, Uttarakhand. This is a portfolio-quality project structured well enough to adapt for a real gym client.

## Status: Phase 4 — Foundation

This phase builds the foundation only: project structure, the global CSS system, the header with mobile + desktop navigation, and the hero section. No other homepage sections (Programs, Membership, Trainers, Schedule, FAQ, Location, Testimonials) exist yet — they belong to later phases.

## Running it locally

No build step, no dependencies. Just open `index.html` in a browser.

```
pulsefit-fitness/
├── index.html
├── trial.html
├── assets/
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   └── script.js
│   ├── images/
│   └── icons/
└── README.md
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

- No backend, no form submissions, no real trial/booking flow — CTAs currently link to placeholder anchors (`#`)
- No fabricated reviews, ratings, or member counts
- No additional homepage sections beyond the header and hero
- No React/Tailwind/Bootstrap/build system, per the project's constraints

## Browser support

Built against current evergreen browsers (Chrome, Firefox, Safari, Edge). Uses modern but well-supported CSS (`aspect-ratio`, `:focus-visible`, custom properties) and the `inert` attribute.

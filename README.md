# TECHNICAL HANDOVER DOCUMENT

---

## ananselearning.com

**Culturally rooted learning products and worlds for children in Ghana and the diaspora.**

---

| Field | Detail |
|---|---|
| **Document Title** | Technical Handover Document — Ananse Learning Website |
| **Website** | https://ananselearning.com |
| **Repository** | https://github.com/ananselearning/ananselearning.github.io |
| **Date** | March 2026 |
| **Status** | Live / Production |
| **Prepared By** | Ananse Learning Development Team |

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Hosting & Domain Configuration](#2-hosting--domain-configuration)
3. [Site Architecture](#3-site-architecture)
4. [Pages & Content](#4-pages--content)
5. [Navigation](#5-navigation)
6. [Design System](#6-design-system)
7. [Technology Stack & Dependencies](#7-technology-stack--dependencies)
8. [JavaScript Systems](#8-javascript-systems)
9. [Product Catalogue](#9-product-catalogue)
10. [Image Assets](#10-image-assets)
11. [External Integrations](#11-external-integrations)
12. [Store UX System](#12-store-ux-system)
13. [Theme System](#13-theme-system)
14. [Footer System](#14-footer-system)
15. [Domain Redirections](#15-domain-redirections)
16. [Deployment Process](#16-deployment-process)
17. [File & Naming Conventions](#17-file--naming-conventions)
18. [Ongoing Maintenance Guide](#18-ongoing-maintenance-guide)

---

## 1. Project Overview

Ananse Learning is a Ghanaian educational brand producing culturally grounded books,
posters, and flashcards for children. The website serves as both a brand presence and
a primary sales channel, hosting the full product catalogue with direct Paystack
payment links.

The site is a **fully static website** — no backend, no CMS, no build step. It is
composed of plain HTML, CSS, and JavaScript files hosted on GitHub Pages with a custom
domain.

### Key Facts

| Item | Detail |
|---|---|
| Site type | Static HTML (no build system, no framework) |
| Default theme | Dark mode |
| Primary language | English |
| Primary market | Ghana (GHS pricing) + diaspora |
| Customer contact | WhatsApp, Email, Instagram |
| Payment processor | Paystack |
| Newsletter | Google Apps Script endpoint |

---

## 2. Hosting & Domain Configuration

| Property | Value |
|---|---|
| **Hosting platform** | GitHub Pages |
| **Repository branch** | `main` |
| **Custom domain** | `ananselearning.com` |
| **CNAME file** | `/CNAME` (contains `ananselearning.com`) |
| **DNS provider** | GoDaddy |
| **SSL** | Enforced automatically by GitHub Pages |

### How it works

GitHub Pages serves the repository contents directly. The `CNAME` file in the
repository root instructs GitHub Pages to respond to requests at `ananselearning.com`.
The DNS A records and CNAME records pointing `ananselearning.com` to GitHub Pages'
servers are configured in the GoDaddy DNS dashboard.

---

## 3. Site Architecture

```
ananselearning.github.io/
├── CNAME
├── README.md
├── index.html                     ← Home page
├── store/
│   └── index.html                 ← Store / product catalogue
├── about/
│   └── index.html                 ← About page
├── contact/
│   └── index.html                 ← Contact page
├── ntentan-universe/
│   └── index.html                 ← Ntentan Universe brand world
├── studiomansa/
│   └── index.html                 ← Studio Mansa creative arm
├── payments/
│   └── index.html                 ← Payments & fulfilment info
├── orders-admin-desk/
│   └── index.html                 ← Redirect → /store/
├── qr-holding-page/
│   └── index.html                 ← QR code landing page
└── assets/
    ├── ananse.css                 ← Brand colours, themes, component overrides
    ├── store-ux.css               ← Store-specific styles
    ├── style.css                  ← Base layout and components
    ├── css/
    │   ├── normalize.css          ← CSS reset
    │   └── vendor.css             ← Plugin styles (AOS, Slick, Chocolat, etc.)
    ├── icomoon/
    │   ├── icomoon.css            ← Icon font stylesheet
    │   └── fonts/                 ← eot, ttf, woff, svg icon font files
    ├── images/                    ← All image assets (see Section 10)
    └── js/
        ├── jquery-1.11.0.min.js   ← jQuery (self-hosted)
        ├── plugins.js             ← Concatenated vendor plugins
        ├── script.js              ← jQuery UI interactions
        ├── site-interactions.js   ← Theme, imagery, WhatsApp, newsletter, analytics
        ├── store-interactions.js  ← Store logic, Paystack URL mapping, card UI
        ├── store-ux.js            ← Scroll spy, sticky nav, progress bar
        └── footer.js              ← Dynamic footer rendering
```

### Page Structure (all pages share)

Every page uses the following consistent structure:

- `<!DOCTYPE html>` with `lang="en"` and `data-theme="dark"` on `<html>`
- Favicon: `assets/images/logo/al-2.jpg`
- Open Graph and Twitter Card meta tags
- Consistent `<header>` with StellarNav navigation
- Dynamic `<footer>` rendered by `footer.js`

### CSS Load Order (per page)

| Order | File | Purpose |
|---|---|---|
| 1 | `normalize.css` | CSS reset |
| 2 | `icomoon.css` | Icon font |
| 3 | `vendor.css` | Plugin styles |
| 4 | `style.css` | Base layout |
| 5 | `ananse.css` | Brand colours & theme |
| 6 | `store-ux.css` | Store-specific (store page only) |

### JavaScript Load Order (per page)

| Order | File | Purpose |
|---|---|---|
| 1 | Bootstrap 5.3.1 CDN | Framework JS |
| 2 | `jquery-1.11.0.min.js` | jQuery |
| 3 | `plugins.js` | Slick, AOS, StellarNav, Chocolat, HC-Sticky, Jarallax |
| 4 | `script.js` | Carousels, tabs, scroll |
| 5 | `footer.js` | Renders footer HTML |
| 6 | `site-interactions.js` | Theme, imagery, WhatsApp, newsletter |
| 7 | `store-interactions.js` | Store only — product cards, Paystack |
| 8 | `store-ux.js` | Store only — scroll spy, sticky nav |

---

## 4. Pages & Content

| Page | URL | Key Sections |
|---|---|---|
| **Home** | `/` | Hero, Brand Intro, Product Highlights (Bilingual Language Pack, Afafantɔ Starter Set), Characters, Newsletter |
| **Store** | `/store/` | Hero, Category Nav (Books, Posters, Flashcards, Bundles), Product Cards, Stockists |
| **About** | `/about/` | Mission, Story, Values, Team |
| **Contact** | `/contact/` | Contact form, Enquiries, Partnerships |
| **Ntentan Universe** | `/ntentan-universe/` | Characters, Storyworld, Cultural themes |
| **Studio Mansa** | `/studiomansa/` | Creative design arm; animated domain-typing hero |
| **Payments** | `/payments/` | Payment options (Ghana + diaspora), Bank transfer details |
| **QR Bridge** | `/qr-holding-page/` | Landing page for QR codes printed on physical products |
| **Orders Redirect** | `/orders-admin-desk/` | `<meta refresh>` + JS redirect → `/store/` |

### Hero Image Mapping

Hero background images are set dynamically by `site-interactions.js` using
`getPageImageConfig()`, which pattern-matches against `window.location.pathname`:

| Path | Hero Image | Section Image |
|---|---|---|
| `/` | `hero-home-family-reading.jpg` | — |
| `/about/` | `hero-about-learning-journey.jpg` | — |
| `/contact/` | `hero-contact-community.jpg` | `section-contact-reading.jpg` |
| `/ntentan-universe/` | `hero-ntentan-universe.jpg` | `section-ntentan-story.jpg` |
| `/studiomansa/` | `hero-studio-mansa.jpg` | `section-studio-mansa.jpg` |
| `/qr-holding-page/` | `hero-qr-coming-soon.jpg` | `section-learning-pathways.jpg` |
| `/store/` `/payments/` | Set inline in HTML (not via JS) | — |

All hero/section images live in `assets/images/page-images/`.

---

## 5. Navigation

### Main Navigation (all pages)

| Label | URL |
|---|---|
| Home | `/` |
| About | `/about/` |
| Ntentan Universe | `/ntentan-universe/` |
| Store | `/store/` |
| Contact | `/contact/` |

Navigation is built as a `<ul>` inside `.stellarnav`. On mobile, the StellarNav
jQuery plugin toggles a hamburger menu that adds a `.responsive` class.

The active page receives `<li class="menu-item active">`.

A theme toggle button is appended dynamically to the nav by `site-interactions.js`.

### Top Bar

Present on all pages above the main nav:

| Left | Right |
|---|---|
| Instagram: `instagram.com/ananselearning` | WhatsApp: `wa.me/233244840042` |
| Email: `ananselearning@gmail.com` | — |

### Store Category Navigation

A sticky sub-navigation bar on `/store/` only, with scroll-spy powered by
`IntersectionObserver` (root margin `-30% 0px -60% 0px`):

| Section | Anchor |
|---|---|
| Featured | `#featured` |
| Books | `#books` |
| Posters | `#posters` |
| Flashcards | `#flashcards` |
| Bundles | `#bundles` |
| Stockists | `#stockists` |

---

## 6. Design System

### Brand Colour Palette

| Swatch | Name | Hex | CSS Variable | Usage |
|---|---|---|---|---|
| Teal | `#8FC9CB` | `--color-teal` | Primary brand, buttons, accents |
| Sage | `#96C0AA` | `--color-sage` | Secondary, supporting accents |
| Terra Dark | `#A63F1B` | `--color-terra-dark` | Warm CTA highlights |
| Terra | `#BC5A38` | `--color-terra` | Warm accent |
| Amber | `#E79002` | `--color-amber` | Attention, badges |
| Peach | `#FFDCC2` | `--color-peach` | Soft background accent |
| Blush | `#FFDDD2` | `--color-blush` | Soft highlight |
| Coral | `#E29578` | `--color-coral` | Warm midtone accent |

Bootstrap overrides: `--bs-primary: #8FC9CB` · `--bs-secondary: #96C0AA`

### Dark Mode (default — `data-theme="dark"`)

| Token | Value | Usage |
|---|---|---|
| `--light-color` | `#0d2225` | Page background |
| `--surface-color` | `#102a2d` | Card surfaces |
| `--surface-alt` | `#163235` | Alternating sections |
| `--border-soft` | `#2a5559` | Subtle borders |
| `--body-text-color` | `#d2eeef` | Body copy |
| `--muted-text-color` | `#8FC9CB` | Metadata, captions |
| `--hero-bg-start` | `#0d2225` | Hero gradient start |
| `--hero-bg-end` | `#102a2d` | Hero gradient end |
| `--topbar-bg` | `#0d2225` | Top bar background |
| `--footer-bg` | `#0a1a1c` | Footer background |
| `--glow-strong` | `rgba(143,201,203,.35)` | CTA glow effect |

### Light Mode (`data-theme="light"`)

| Token | Value | Usage |
|---|---|---|
| `--accent-color` | `#96C0AA` | Links, highlights |
| `--light-color` | `#f0f9f9` | Page background |
| `--surface-color` | `#ffffff` | Card surfaces |
| `--body-text-color` | `#1a3435` | Body copy |
| `--topbar-bg` | `#2a6b72` | Top bar background |
| `--footer-bg` | `#1d4f55` | Footer background |

### Typography

| Role | Font | Source |
|---|---|---|
| Body | **Raleway** | Google Fonts (`@import` in CSS) |
| Headings | **Prata** | Google Fonts (`@import` in CSS) |

---

## 7. Technology Stack & Dependencies

### Framework / CDN

| Library | Version | How loaded |
|---|---|---|
| Bootstrap CSS | 5.3.1 | CDN (`cdn.jsdelivr.net`) |
| Bootstrap JS bundle | 5.3.1 | CDN (`cdn.jsdelivr.net`) |
| jQuery | 1.11.0 | Self-hosted (`assets/js/`) |

### Bundled Plugins (inside `plugins.js`)

| Library | Version | Purpose |
|---|---|---|
| AOS (Animate On Scroll) | — | Scroll-triggered fade/slide animations |
| jQuery Easing | — | Custom animation easing functions |
| Slick Carousel | 1.6.0 | Product carousels, image sliders |
| StellarNav | — | Responsive hamburger nav |
| Chocolat | 1.0.4 | Image lightbox / gallery overlay |
| HC-Sticky | 2.2.1 | Sticky positioning for headers |
| Slide Nav | 1.0.1 | Smooth scroll navigation |
| Jarallax | — | Background parallax effects |

### Self-hosted Assets

| Asset | Path |
|---|---|
| Icon font (Icomoon) | `assets/icomoon/` |
| Google Fonts (Raleway, Prata) | Loaded via CSS `@import` (external call) |

---

## 8. JavaScript Systems

### `site-interactions.js` — All Pages

| Function | Purpose |
|---|---|
| `initThemeMode()` | Applies saved `localStorage` theme on load; toggles `data-theme` on `<html>` |
| `initPageImagery()` | Calls `getPageImageConfig()` to set hero + section background images by path |
| `initWhatsAppPrefillLinks()` | Reads `data-whatsapp-context` attributes and builds prefilled `wa.me` links |
| `initNewsletterForms()` | Submits newsletter email via `fetch` POST to Google Apps Script endpoint |
| `initVisitLogging()` | Logs page visits to a Google Apps Script analytics endpoint |
| `initRevealAnimations()` | Triggers AOS / IntersectionObserver scroll reveals |
| `initPointerGlow()` | Ambient pointer glow effect on hero sections |

### `store-interactions.js` — Store Page Only

| Function | Purpose |
|---|---|
| `getPaystackProductUrl(title)` | Maps a product title to its Paystack buy URL via `normalizeProductTitle()` |
| `getCardPaystackProductUrl(card, default)` | Resolves per-image URL from `data-preview-links` for flashcard packs |
| `normalizeProductTitle(value)` | NFKD normalise → strip diacritics → lowercase → strip punctuation & hyphens → collapse whitespace |
| `initCyclingCardImages()` | Rotates images on cards with `data-preview-images` every 5 s with 250 ms fade |
| `initStorePreviewPaystackTiles()` | Quick-view overlay: prev/next slider, dots, arrow key navigation |
| `initStockistCards()` | Makes stockist cards clickable via their Instagram/profile link |

**Important:** `normalizeProductTitle()` strips hyphens (replacing them with spaces).
All `getPaystackProductUrl()` match strings must therefore be written **without
hyphens** — e.g. `"asante twi english"` not `"asante twi-english"`.

### `store-ux.js` — Store Page Only

| Feature | Implementation |
|---|---|
| Scroll progress bar | `.scroll-progress` width updated on `scroll` event |
| Sticky category nav | `.is-scrolled` shadow class added after 200 px of scroll |
| Scroll spy | `IntersectionObserver` with root margin `-30% 0px -60% 0px` |
| Smooth scroll | Click handler using `--header-height` CSS variable for offset |

### `footer.js` — All Pages

Dynamically renders the full footer HTML into `.site-footer-grid` on every page.

| Column | Content |
|---|---|
| Address | Airport West, 198 Osu Badu St, Accra |
| Social | Facebook, Instagram, Email (Gmail app → mailto fallback), Phone |
| Quick Links | Shop, About, Contact |
| Newsletter | Email input → POST to Google Apps Script |

Mobile behaviour: footer auto-collapses after 3 seconds, re-collapses on user
scroll/touch. CSS classes: `.is-mobile-collapsed` / `.footer-mobile-collapsed`.

---

## 9. Product Catalogue

### Books

| Title | Format | Size | Pages | Price (GHS) | Paystack slug |
|---|---|---|---|---|---|
| abcdawadawa | Educational | 8.25 × 8.25 in | 34 | 80 | `ananselearning-book-abcdawadawa` |
| abd (Asante Twi-English) Bilingual Book | Educational | A4 | 48 | 120 | `ananselearning-book-abd-asante-twi-english-bilingual-book` |
| My Favourite Things — Eno's Colouring Book | Colouring | A4 | 32 | 80 | `ananselearning-my-favourite-things---enos-colouring-book` |
| The Design Workbook: Food & Culture | Workbook | A4 | 84 | 150 | `ananselearning-book-the-design-workbook-food--culture-book-` |
| Worlds They Made | Non-fiction | 7.5 × 9.5 in | 66 | 150 | `ananselearning-book-worlds-they-made` |
| Adobea Bakes Coconut Doughnuts | Storybook | A4 | 36 | 100 | `ananselearning-book-adobea-bakes-coconut-doughts` |
| Animal Colouring Book | Colouring | A4 | 24 | 60 | `animal-colouring-book-axjage` |

All book links: `https://paystack.com/buy/{slug}`

### Poster Sets

| Set | Symbol Origin | Theme | Posters | Price (GHS) | Saving |
|---|---|---|---|---|---|
| Mate Masie | Adinkra | Language & Literacy | 10 × A3 | 380 | 100 |
| Awale Te | Ga | Language & Literacy | 10 × A3 | 380 | 100 |
| Gomekadi | Ewe | Language & Literacy | 10 × A3 | 380 | 100 |
| Dame Dame | Adinkra | Numeracy | 5 × A3 | 200 | 100 |

### Individual Add-On Posters (GHS 60 each, A3)

| Title | Image file |
|---|---|
| Lizzie the Lion | `14-lizzie-the-lion.png` |
| Zanzama the Zebra | `16-zanzama-the-zebra.png` |
| Gigraw the Giraffe | `15-gigraw-the-giraffe.png` |
| Brempong the Bear | `13-brempong-the-bear.png` |
| Journey to Kukurantumi | `17-journey-to-kukurantumi.png` |
| Jungle Portrait | `12-jungle-portrait.png` |
| Animal Portrait | `11-animal-portrait.png` |
| Plantain: Green to Gold | `8-green-to-gold.png` |

### Flashcard Packs

| Title | Content | Card size | Languages | Price (GHS) |
|---|---|---|---|---|
| Bilingual Language Pack | Numbers, Shapes, Days, Months | 6 × 4 in | Asante Twi · Ewe · Ga | 360 |
| A Year of Affirmations | 12 months, 12 affirmations | 6 × 4 in | Asante Twi · Ewe · Ga | 160 |

Flashcard packs have **per-language Paystack URLs** resolved at click time from
`data-preview-links` (pipe-delimited), based on which image is currently displayed:

| Pack | Asante Twi | Ewe | Ga |
|---|---|---|---|
| Bilingual Language Pack | `asante-twi-bilingual-language-pack-flashcards` | `eve-bilingual-language-pack-flashcards` | `ga-bilingual-language-pack-flashcards-ewmmrs` |
| A Year of Affirmations | `asante-twi-a-year-of-affirmations` | `eve-a-year-of-affirmations-` | `ga-a-year-of-affirmations` |

### Curated Bundles

| Bundle | Badge | Ages | Price (GHS) | Was (GHS) | Paystack slug |
|---|---|---|---|---|---|
| Afafanto Starter Set | Starter Set | 3–7 | 300 | 380 | `afafanto-starter-set-bundle` |
| Boa Me Na Me Mmoa Wo | Sibling Set | 3–10 | 550 | 650 | `boa-me-na-me-mmoa-wo-bundle` |
| Nyansapo Family Learning | Family Learning | 5–14 | 500 | 625 | `nyansapo-family-learning-set-bundle` |
| Eban Homeschool Set | Homeschool | 4–12 | 900 | 1,090 | `eban-homeschool-set-bundle` |

### Stockists (Accra, Ghana)

| Name | Location | Instagram |
|---|---|---|
| Kinkane Bookshop | Mansa Gold Cafe, Osu | `@kinkanebookshop` |
| Maraaba Mart | Ogbojo Koo St, Adjiringanor | `@maraabaminimart` |
| Kingdom Books & Stationery | University of Ghana, Legon | `@kingdombooksandstationery` |
| EPP Books Global | Legon Boundary, Accra | `@eppbookservices` |
| City Reads | Adenta (100 Aviation Rd) + Osu (Okodan Rd) | `@booksenroute` |

---

## 10. Image Assets

```
assets/images/
├── book-covers/          Book front + back covers (jpeg/png)
├── bundles/              Bundle promotional images (4 items)
├── characters/           Brand characters: al-walkingstick, anansewaa,
│                         brempong, mansa
├── chocolat/             Lightbox plugin UI assets
├── flashcards/
│   ├── a-year-of-affirmations/   Covers in 3 languages
│   └── language-packs/
│       ├── asante-twi-pack/      9 images (cover + 4 subjects)
│       ├── eve-pack/             10 images
│       └── ga-pack/              10 images
├── logo/                 Brand logos, favicon variants
├── page-images/          Hero backgrounds + section images (18 files)
├── placeholders/         3 fallback images (book, flashcard, poster)
├── posters/              23 individual poster images (numbered 1–23)
├── stockists/            5 stockist location photos
├── pattern1.png
├── pattern2.png
└── leaf.png
```

### File naming conventions

| Asset type | Pattern |
|---|---|
| Book covers | `book-{slug}-cover.{jpeg|png}` |
| Book back covers | `book-{slug}-back-cover.{jpeg|png}` |
| Posters | `{number}-{slug}.png` |
| Page hero images | `hero-{page-slug}.jpg` |
| Page section images | `section-{description}.jpg` |
| Flashcard images | `{subject}-front-cover.jpg` · `{subject}-back-cover.jpg` |
| Bundles | `{slug}.png` |

---

## 11. External Integrations

| Service | Purpose | Endpoint / Contact |
|---|---|---|
| **Paystack** | Per-product payment links | `paystack.com/buy/{slug}` |
| **Paystack Shop** | General store link | `paystack.shop/ananselearning` |
| **Google Apps Script** | Newsletter form submission | `script.google.com/macros/s/…/exec` (POST) |
| **Google Apps Script** | Visit / page-view logging | `script.google.com/macros/s/…/exec` (POST) |
| **WhatsApp** | Customer enquiries | `wa.me/233244840042` |
| **Instagram** | Social media | `instagram.com/ananselearning` |
| **Facebook** | Social media | `facebook.com/profile.php?id=61584932624965` |
| **Email** | Contact | `ananselearning@gmail.com` |

---

## 12. Store UX System

### Card Click Behaviour

When a product card is clicked:

1. If the click target is a **figure / image** → open quick-view overlay
2. If the click target is inside a **details/summary** → expand/collapse content only
3. If the click target is an **`<a>` or `<button>`** → follow its default behaviour
4. Otherwise → open the product's Paystack URL in a new tab

### Image Cycling

Cards with a `data-preview-images` attribute rotate through images every **5 seconds**
with a 250 ms fade transition (toggle `.is-fading` class on the `<img>`).

### Quick-View Overlay

Overlays the current card image. If the card has multiple preview images:
- Prev / next buttons navigate images
- Dot indicators show position
- Left / Right arrow keys also navigate
- Clicking outside the overlay closes it

---

## 13. Theme System

| Property | Detail |
|---|---|
| Default theme | **Dark** (`data-theme="dark"` on `<html>`) |
| Toggle | Button injected into nav by `site-interactions.js` |
| Persistence | `localStorage.setItem("theme", ...)` / `localStorage.getItem("theme")` |
| Dark icon | Moon |
| Light icon | Sun |
| CSS mechanism | `[data-theme="dark"]` selector overrides all `--color-*` and semantic tokens |

---

## 14. Footer System

The footer is fully **dynamic** — `footer.js` builds and inserts the footer HTML
into the `.site-footer-grid` container on every page at runtime.

| Column | Content |
|---|---|
| Brand / Address | Airport West, 198 Osu Badu St, Accra |
| Social | Facebook, Instagram, Email, Phone |
| Quick Links | Shop, About, Contact |
| Newsletter | Email input → Google Apps Script POST |

**Mobile behaviour:** Auto-collapses 3 seconds after page load. Collapses again on user
scroll or touch. Email link attempts to open the Gmail app first, then falls back to
`mailto:`, then the browser's compose window.

---

## 15. Domain Redirections

| Source | Destination | Mechanism | Where configured |
|---|---|---|---|
| `studiomansa.com` | `https://ananselearning.com/studiomansa/` | 301 permanent redirect | **GoDaddy dashboard** → Domain Forwarding |
| `www.ananselearning.com` | `https://ananselearning.com` | Automatic | GitHub Pages |
| `/orders-admin-desk/` | `/store/` | `<meta http-equiv="refresh">` + `window.location.replace` | In-file HTML/JS |

### Important: studiomansa.com

The `studiomansa.com` domain is registered separately on GoDaddy and uses GoDaddy's
**Domain Forwarding** feature (not DNS) to forward all traffic to
`https://ananselearning.com/studiomansa/`. This is configured entirely in the GoDaddy
account dashboard and is **not** controlled by any file in this repository. If the
forwarding expires or the domain lapses, `studiomansa.com` will stop redirecting.

---

## 16. Deployment Process

### How to deploy changes

1. Edit files locally in the cloned repository
2. Stage changes: `git add .`
3. Commit: `git commit -m "description of changes"`
4. Push: `git push origin main`
5. GitHub Pages auto-deploys within ~60 seconds — no build step required

### Local development

```bash
# Clone
git clone https://github.com/ananselearning/ananselearning.github.io.git
cd ananselearning.github.io

# Serve locally (any static server)
python3 -m http.server 8000
# or
npx serve .
```

> Note: Paths like `/store/` require being served from the root (not opened as
> `file://`) so that clean URLs resolve correctly.

---

## 17. File & Naming Conventions

All files and folders use **lowercase-hyphen** convention — no spaces, no underscores,
no uppercase:

| ✓ Correct | ✗ Incorrect |
|---|---|
| `book-covers/` | `Book Covers/`, `book_covers/` |
| `1-numbers-front-cover.jpg` | `1 Numbers Front Cover.jpg` |
| `hero-contact-community.jpg` | `Hero_Contact_Community.jpg` |

Each page is a **folder with an `index.html` file** inside it, enabling clean URLs
(`/store/` rather than `/store.html`) via GitHub Pages' default directory index
resolution.

---

## 18. Ongoing Maintenance Guide

### Adding a new product

1. Add the product image to the appropriate `assets/images/` subdirectory
2. Add the product card HTML in `store/index.html` under the correct `<section>`
3. Add the Paystack URL mapping in `store-interactions.js` → `getPaystackProductUrl()`
   - Match strings must be **post-normalisation** (no hyphens, no diacritics, lowercase)
4. If needed, add the image filename to the relevant `get*FileName()` helper
5. Update any badge counts in the store hero stats
6. Commit and push

### Adding a new page

1. Create `new-page/index.html` using any existing page as a template
2. Add the nav link to the `<header>` of **all** pages
3. Add hero image config to `site-interactions.js` → `getPageImageConfig()`
4. Add hero image(s) to `assets/images/page-images/`
5. Ensure `.site-footer-grid` container is present in the new page's HTML

### Updating a price

1. Update the price text in `store/index.html`
2. If the product appears on the home page, update `index.html` too
3. Paystack prices are managed on the **Paystack dashboard** — not in this codebase

### Updating a Paystack URL

Update both:
- The `href` on the "Buy Now" `<a>` button in `store/index.html`
- The return value in `getPaystackProductUrl()` in `store-interactions.js`

### Monitoring checklist

| Check | Frequency | How |
|---|---|---|
| Site is live | Weekly | Visit `ananselearning.com` |
| All Paystack links work | Monthly | Click-test each "Buy Now" button |
| `studiomansa.com` redirect | Monthly | Visit `studiomansa.com`, confirm redirect |
| Newsletter signup | Monthly | Submit a test email, verify Google Sheet |
| SSL certificate | Automatic | Managed by GitHub Pages |
| Image 404 errors | After each deploy | Browser DevTools → Console / Network tab |
| GoDaddy domain renewal | Annually | Check GoDaddy account for expiry dates on both `ananselearning.com` and `studiomansa.com` |

### Updating dependencies

| Dependency | How to update |
|---|---|
| Bootstrap | Change version number in all `<link>` and `<script>` CDN tags across all HTML files |
| jQuery | Replace `assets/js/jquery-1.11.0.min.js` with the new file |
| Plugins bundle | Update `assets/js/plugins.js` (concatenated file) |
| Icomoon icon font | Re-export from icomoon.io and replace `assets/icomoon/` |

---

*Document version 1.0 — March 2026*

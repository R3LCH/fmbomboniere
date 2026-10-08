# Changelog

All notable changes to this project are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- White textured vases with tulips in Idee regalo (`research/build.py`); 32 photos now fill the last row of the two-column All gallery.
- Admin panel (`/admin.html`): upload, replace, delete and reorder photos with IT/EN descriptions; add, rename, reorder and delete categories; pick hero and About photos; edit every section text with IT ↔ EN auto-translation (MyMemory).
- VPS deploy: dependency-free Node server (`server/server.mjs`) with password login, content and uploads in a Docker volume, plus `deploy/nginx-vps.conf` for HTTPS.
- GitHub Pages and IONOS builds include the admin as a browser-only preview (IndexedDB).

### Changed

- Hide all three hero photos and decorative stars below 768px (`Hero.tsx`), leaving a text-and-CTA mobile hero without reserved collage space; tablet and desktop keep the photos.
- Categories and their names now come from site content instead of a fixed list; Docker image serves through the Node server instead of nginx (`nginx.conf` removed).
- Admin Testi tab redesigned as a live mock of each site section with in-place editing and the other language shown under every text; translation runs on Enter instead of buttons; admin uses the site's IT/EN toggle (top right) and shows the logo; the photo Date field is no longer shown (it never appeared on the site).
- Admin translation falls back to the unofficial Google endpoint (`translate.googleapis.com`) when MyMemory fails or hits its quota (`src/admin/translate.ts`).

### Fixed

- Mobile occasions use two aligned columns without separators at row starts (`About.tsx`), instead of wrapping separator-prefixed items.
- Hero and About no longer crash when fewer than three photos exist.
- Mobile hero arch is vertically centered against the two right-hand photos (`Hero.tsx`); desktop bottom alignment and padding are unchanged.
- Admin translation no longer accepts MyMemory fuzzy memory hits for a different sentence ("La felicità dipende da noi" returned "Admire someone's beauty…"); only exact memory hits or MyMemory's own MT are used, otherwise Google is tried (`src/admin/translate.ts`).

## [1.1.0] - 2026-10-06

### Changed

- Gallery rebuilt with 31 distinct photos, one per event or set, mostly from the shop's Facebook photo grid. Near-duplicate angles were removed.
- Collections reduced to five: Battesimo, Comunione e Cresima, Matrimonio, Feste e ricorrenze, Idee regalo. Laurea and Eventi are merged into Feste e ricorrenze.
- New hero collage (Aurora's First Communion, aviator-teddy christening, mint tulip gifts) and About photo (white boxes with gypsophila).

## [1.0.0] - 2026-10-06

### Added

- Single-page showcase site for FM Bomboniere di Francesca Moliterni (Scalea), Italian and English, with the language choice persisted.
- Sections: intro curtain, hero arch collage with sparkles, Chi siamo, Collezioni, Galleria, Contatti, footer.
- Gallery of 23 recent Instagram photos (2026-03 → 2026-09) in 6 collections, with filter chips (GSAP Flip) and an accessible lightbox (focus handling, Esc, arrow keys, swipe, counter).
- Contact rows for address/Maps, phone, WhatsApp, email, Instagram and Facebook, plus a lazy-loaded Google Maps embed.
- Design system: `design/DESIGN.md`, DTCG tokens `design/fm.tokens.json`, component contracts `design/components.json`.
- Reduced-motion mode: no transforms, smooth scroll, parallax, sparkles or intro.
- SEO: meta, Open Graph, Twitter card, JSON-LD `Store`, `manifest.json`. Absolute canonical/OG/JSON-LD URLs come from `VITE_SITE_URL`, with generated `robots.txt` and `sitemap.xml`.
- AI-ready files: `llms.txt`, `AGENTS.md`, `CLAUDE.md`, with design docs published under `/design/`.
- Deploy targets: GitHub Pages workflow, Docker + nginx, and IONOS portable build with `.htaccess`.
- Photo pipeline in `research/` (`posts.py`, `parse.py`, `build.py`) with provenance in `research/photos.md`.

[1.1.0]: https://github.com/R3LCH/fmbomboniere/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/R3LCH/fmbomboniere/releases/tag/v1.0.0

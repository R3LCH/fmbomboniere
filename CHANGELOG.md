# Changelog

All notable changes to this project are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses [Semantic Versioning](https://semver.org/).

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

[1.0.0]: https://github.com/R3LCH/fmbomboniere/releases/tag/v1.0.0

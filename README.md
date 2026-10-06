# FM Bomboniere

Showcase website for FM Bomboniere di Francesca Moliterni, a bomboniere and gift shop at Via Tommaso Campanella 33, Scalea (CS). It's a single page in Italian and English with these sections: hero collage, Chi siamo, Collezioni, Galleria (filters + lightbox), Contatti and footer. There is no e-commerce and there are no prices.

Stack: Vite 8, React 19, TypeScript, Tailwind CSS 4, GSAP 3.15 (ScrollTrigger, Flip), Lenis, and self-hosted fonts (Cormorant Garamond, Jost). See `PLAN.md` for the checklist and `idea.md` for the brief.

## Develop

```bash
npm ci
npm run dev        # dev server
npm run build      # type-check + production build into dist/
npm run preview    # serve dist/
```

Build-time environment:

| Variable | Default | Purpose |
|---|---|---|
| `VITE_BASE` | `/` | Asset base path: `/fmbomboniere/` (GitHub Pages), `/` (own server), `./` (portable) |
| `VITE_SITE_URL` | `https://r3lch.github.io/fmbomboniere/` | Public absolute URL. Fills `%SITE_URL%` in `index.html` (canonical, `og:url`, `og:image`, `twitter:image`, JSON-LD `url`/`image`) and is used to generate `robots.txt` and `sitemap.xml` |

## Project structure

```text
index.html               meta, OG, JSON-LD (uses %SITE_URL%)
vite.config.ts           base path + `fm-site` plugin (SITE_URL, robots.txt, sitemap.xml, dist/design/*)
src/
  App.tsx                section order, skip link, gallery filter state
  data.ts                collections, photo helpers, hero/about/cover picks, CONTACT
  data/gallery.json      gallery manifest
  i18n.tsx               IT/EN dictionaries, persisted language, <html lang>
  motion.ts              GSAP/Lenis setup, useMotion, sectionReveals, scroll lock
  index.css              design tokens (@theme), type scale, buttons, ornaments
  components/            Header, Intro, Hero, About, Collections, Gallery, Lightbox, Contact, Footer, ui
public/                  logo, icons, manifest.json, llms.txt, img/gallery/*.webp
design/                  DESIGN.md, fm.tokens.json, components.json
research/                research notes, photo provenance and the photo pipeline
deploy/ionos.htaccess    Apache config for IONOS webspace
Dockerfile, nginx.conf, docker-compose.yml
```

## Gallery photos

Every entry in `src/data/gallery.json` looks like this:

```json
{
  "src": "img/gallery/<slug>.webp",
  "thumb": "img/gallery/<slug>-640.webp",
  "w": 1200,
  "h": 1600,
  "collection": "matrimonio",
  "alt_it": "Descrizione in italiano",
  "alt_en": "English description",
  "featured": false,
  "date": "2026-09-20"
}
```

- `src` is up to 1600px on the long side. `thumb` is 640px. Both are WebP files in `public/img/gallery/`. `w`/`h` are the pixel size of `src`.
- `collection` must be one of `matrimonio`, `battesimo`, `comunione`, `laurea`, `eventi` or `regali` (`COLLECTIONS` in `src/data.ts`). Entries with any other value are skipped. Collection cards and filter chips only appear for collections that have photos. A new collection needs an entry in `COLLECTIONS` and `c.<name>` labels in both dictionaries in `src/i18n.tsx`.
- `featured` photos are preferred for collection covers. The hero and About photos are picked by slug (`HERO_SLUGS` and `aboutPhoto` in `src/data.ts`), so update those if you remove a photo they use.
- Landscape photos (ratio > 1.15) span two gallery columns.
- Keep the manifest sorted newest first. The brief asks for recent collections only.

### Photo pipeline (`research/`)

Most photos come from the shop's public Facebook photo grid (`raw/fbfull/NNN.jpg`, full size, keyed in `raw/fbfull/index.json`). The rest come from its Instagram posts (2026-03 → 2026-09), because Instagram shows only the 12 newest posts without a login. Each photo is listed with its source in `research/photos.md`. Keep one photo per event or set, never several angles of the same favours. The scripts run inside `research/` with a local venv (`playwright`, `pillow`). `research/.venv/` and `research/raw/` are gitignored.

```bash
cd research
python3 -m venv .venv && .venv/bin/pip install playwright pillow && .venv/bin/playwright install chromium
.venv/bin/python posts.py               # crawl posts from raw/profile.html → raw/posts.json
.venv/bin/python parse.py raw/*.html    # extract carousel media from saved post HTML → raw/media.json
# download the chosen Instagram slides as raw/<code>_<NN>.jpg or Facebook photos as raw/fbfull/NNN.jpg, then edit SEL in build.py
.venv/bin/python build.py               # writes public/img/gallery/*.webp, src/data/gallery.json, photos.md
```

`build.py` overwrites `src/data/gallery.json` and `research/photos.md`. Add new photos to its `SEL` list instead of editing those two files by hand.

The photos belong to FM Bomboniere and are used on its own website. Don't reuse them elsewhere.

## i18n

UI copy lives in `src/i18n.tsx`. `it` is the source dictionary, and `en` must have the same keys (TypeScript enforces this). The language choice is stored in `localStorage` (`fm-lang`) and mirrored to `<html lang>`. Photo alt text is per entry (`alt_it`/`alt_en`). `index.html` meta stays in Italian.

## Design docs

- `design/DESIGN.md`: the binding design contract, covering color roles with WCAG ratios, type, layout, components, motion, reduced motion and prohibited patterns.
- `design/fm.tokens.json`: W3C DTCG tokens. They mirror `DESIGN.md` and `src/index.css`, so change all three together.
- `design/components.json`: component contracts (props, behaviour, accessibility).

The build copies all three into `dist/design/`, and `public/llms.txt` links to them.

## Deploy

### GitHub Pages

Pushing to `main` runs `.github/workflows/pages.yml`. It builds with `VITE_BASE=/<repo>/` and `VITE_SITE_URL=https://r3lch.github.io/fmbomboniere/`. Under Settings → Pages, set Source to GitHub Actions.

### Own server (Docker + nginx)

```bash
docker compose build --build-arg VITE_SITE_URL=https://<domain>/ && docker compose up -d   # http://<host>:8080
```

The image builds with `VITE_BASE=/`. Without Docker, run `VITE_BASE=/ VITE_SITE_URL=https://<domain>/ npm run build` and serve `dist/` with `nginx.conf`.

### IONOS managed webspace

Build a portable release:

```bash
VITE_BASE=./ VITE_SITE_URL=https://<domain>/ npm run build
```

Upload the contents of `dist/`, plus `deploy/ionos.htaccess` renamed to `.htaccess`, to the directory the domain points to (`/public/fmbomboniere`). The `.htaccess` disables listings, denies hidden and service files, and sets nosniff, referrer and no-cache headers for HTML/JSON. It has no HTTPS or domain redirect until a domain and certificate exist.

When the shop gets its own domain, every hosting build must set `VITE_SITE_URL` to it. Otherwise canonical, OG, `robots.txt` and `sitemap.xml` keep pointing at GitHub Pages.

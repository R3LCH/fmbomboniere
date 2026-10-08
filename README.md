# FM Bomboniere

Showcase website for FM Bomboniere di Francesca Moliterni, a bomboniere and gift shop at Via Tommaso Campanella 33, Scalea (CS). It's a single page in Italian and English with these sections: hero collage, Chi siamo, Collezioni, Galleria (filters + lightbox), Contatti and footer. There is no e-commerce and there are no prices. An admin panel (`/admin.html`) edits photos, categories, the hero/About photos and all section text.

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
| `VITE_ADMIN_MODE` | (preview) | `server`: admin talks to the Node API (VPS). Unset: browser-only preview (GitHub Pages, IONOS) |

## Project structure

```text
index.html               meta, OG, JSON-LD (uses %SITE_URL%)
admin.html               admin panel entry (noindex)
vite.config.ts           base path, two pages + `fm-site` plugin (SITE_URL, robots.txt, sitemap.xml, dist/design/*)
src/
  App.tsx                section order, skip link, gallery filter state
  content.ts             Content model, shipped defaults, store (server API or IndexedDB preview)
  data.ts                derived photos/collections, hero/about/cover picks, CONTACT
  data/gallery.json      shipped gallery manifest
  i18n.tsx               IT/EN dictionaries + admin text overrides, persisted language, <html lang>
  motion.ts              GSAP/Lenis setup, useMotion, sectionReveals, scroll lock
  index.css              design tokens (@theme), type scale, buttons, ornaments
  components/            Header, Intro, Hero, About, Collections, Gallery, Lightbox, Contact, Footer, ui
  admin/                 admin panel: Photos, Categories, SitePhotos, Texts, image resize, translation
server/server.mjs        VPS server: static dist/, /uploads, password-protected /api (no dependencies)
public/                  logo, icons, manifest.json, llms.txt, img/gallery/*.webp
design/                  DESIGN.md, fm.tokens.json, components.json
research/                research notes, photo provenance and the photo pipeline
deploy/                  ionos.htaccess, nginx-vps.conf (HTTPS reverse proxy)
Dockerfile, docker-compose.yml, .env.example
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
- Categories, their IT/EN names and the hero/About picks are defaults in `DEFAULT_CONTENT` (`src/content.ts`). Entries whose `collection` is not a known category are skipped; cards and filter chips only appear for categories with photos.
- `featured` photos are preferred for collection covers.
- All gallery tiles use uniform 4:5 crops; the lightbox shows the full uncropped image.
- The photo pipeline groups entries by collection. Use recent work and avoid near-duplicate angles.

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

UI copy lives in `src/i18n.tsx`. `it` is the source dictionary, and `en` must have the same keys (TypeScript enforces this). The admin Texts tab stores per-key overrides in `Content.text`; empty fields fall back to the dictionaries. The language choice is stored in `localStorage` (`fm-lang`) and mirrored to `<html lang>`. Photo alt text is per entry (`alt_it`/`alt_en`). `index.html` meta stays in Italian.

## Admin panel

`/admin.html` (also `/admin` on the VPS) has four tabs: Foto (upload, replace, delete, reorder, category, IT/EN description, featured, date), Categorie (add, rename, reorder, delete when empty), Foto del sito (hero collage and About portrait), Testi (every UI string, grouped by section). Changes apply on Salva modifiche; unsaved changes trigger a leave-page warning.

- Uploads are resized in the browser to the same renditions as `research/build.py` (1600px q82 + 640px q80 WebP), so the server needs no image libraries.
- Each IT/EN field pair has IT → EN and EN → IT buttons. Translation uses the public MyMemory API (`api.mymemory.translated.net`), so the text being translated is sent to that service. The result fills the field for review; nothing is saved until Save.
- Preview mode (GitHub Pages, IONOS): no login, everything is stored in this browser's IndexedDB (`fm-admin`), and only this browser's copy of the site shows the edits. It is a demo, not publishing.
- Server mode (VPS): password login (12h HttpOnly SameSite=Strict cookie, 5 failed attempts per IP per 15 minutes), content in `/data/content.json`, uploads in `/data/uploads/`. Saved content replaces the shipped `gallery.json` defaults; Ripristina contenuti originali restores them.

## Design docs

- `design/DESIGN.md`: the binding design contract, covering color roles with WCAG ratios, type, layout, components, motion, reduced motion and prohibited patterns.
- `design/fm.tokens.json`: W3C DTCG tokens. They mirror `DESIGN.md` and `src/index.css`, so change all three together.
- `design/components.json`: component contracts (props, behaviour, accessibility).

The build copies all three into `dist/design/`, and `public/llms.txt` links to them.

## Deploy

### GitHub Pages (admin preview)

Pushing to `main` runs `.github/workflows/pages.yml`. It builds with `VITE_BASE=/<repo>/` and `VITE_SITE_URL=https://r3lch.github.io/fmbomboniere/`. Under Settings → Pages, set Source to GitHub Actions. The admin preview is at https://r3lch.github.io/fmbomboniere/admin.html.

### VPS (Docker + Node server)

```bash
cp .env.example .env            # set ADMIN_PASSWORD (≥10 chars), SESSION_SECRET (openssl rand -hex 32), VITE_SITE_URL
docker compose up -d --build    # listens on 127.0.0.1:8080, data in the fm-data volume
```

Put nginx with HTTPS in front: copy `deploy/nginx-vps.conf` to `/etc/nginx/sites-available/`, replace `example.com`, enable it, then `certbot --nginx -d <domain>`. The admin login must only be used over HTTPS. Back up the `fm-data` volume (`content.json` + `uploads/`). Without `SESSION_SECRET`, admin sessions end on every restart.

### IONOS managed webspace

Build a portable release:

```bash
VITE_BASE=./ VITE_SITE_URL=https://<domain>/ npm run build
```

Upload the contents of `dist/`, plus `deploy/ionos.htaccess` renamed to `.htaccess`, to the directory the domain points to (`/public/fmbomboniere`). The `.htaccess` disables listings, denies hidden and service files, and sets nosniff, referrer and no-cache headers for HTML/JSON. It has no HTTPS or domain redirect until a domain and certificate exist.

When the shop gets its own domain, every hosting build must set `VITE_SITE_URL` to it. Otherwise canonical, OG, `robots.txt` and `sitemap.xml` keep pointing at GitHub Pages.

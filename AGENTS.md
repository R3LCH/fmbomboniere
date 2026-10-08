# FM Bomboniere: agent guide

Single-page showcase site (IT/EN) for FM Bomboniere di Francesca Moliterni, Scalea. Overview and deploy: `README.md`. Checklist: `PLAN.md`. Brief: `idea.md`.

## Stack

Vite 8, React 19, TypeScript, Tailwind CSS 4 (`@theme` in `src/index.css`), GSAP 3.15 (ScrollTrigger, Flip), Lenis, and fonts from `@fontsource`. Dependencies are pinned to exact versions, so keep them that way.

## Paths

- `src/components/*`: sections. Shared pieces are in `ui.tsx`. Contracts are in `design/components.json`.
- `src/content.ts`: `Content` model (categories, photos, hero/About picks, text overrides), `DEFAULT_CONTENT`, store (server API or IndexedDB preview). `src/data.ts` derives photos/collections from it; `src/data/gallery.json` is the shipped manifest.
- `src/admin/*` + `admin.html`: admin panel. `server/server.mjs`: VPS server (static + `/api`), no dependencies.
- `src/i18n.tsx`: all UI copy (`it` is the source, `en` has the same keys).
- `src/motion.ts`: `useMotion`, `sectionReveals`, Lenis, scroll lock.
- `vite.config.ts`: `VITE_BASE`, plus the `fm-site` plugin that handles `%SITE_URL%`, `robots.txt`, `sitemap.xml` and `dist/design/*`.
- `design/`: `DESIGN.md`, `fm.tokens.json` (DTCG), `components.json`.
- `research/`: notes, photo provenance (`photos.md`), and the photo pipeline (`posts.py`, `parse.py`, `build.py`).

## Commands

```bash
npm ci
npm run dev
npm run build                                  # tsc -b && vite build
VITE_BASE=/fmbomboniere/ npm run build         # GitHub Pages
VITE_ADMIN_MODE=server VITE_BASE=/ npm run build && ADMIN_PASSWORD=<10+ chars> node server/server.mjs   # VPS mode, :8080
VITE_BASE=./ VITE_SITE_URL=https://<domain>/ npm run build   # portable (IONOS)
```

## Rules

- Read `design/DESIGN.md` before any UI work and follow its Prohibited list.
- Tokens are the source of truth. Colors, type, spacing, radii, shadows, durations and easings come from `design/fm.tokens.json` / `src/index.css`. Never hard-code new values. When a token changes, update `DESIGN.md`, `fm.tokens.json` and `index.css` together.
- Never invent business facts: no founding year, reviews, prices, opening hours, staff or products that aren't in `idea.md`, `src/data.ts` or the shop's own posts. Ask when unsure.
- Gallery photos are the shop's own recent work (Facebook photo grid, Instagram posts), one per event or set, with no near-duplicate angles. Every photo must be listed in `research/photos.md` and come from `research/build.py`. Collections: `battesimo`, `comunione`, `matrimonio`, `feste`, `regali`.
- Reduced motion is required. Animations go inside `useMotion` / `gsap.matchMedia()` with `(prefers-reduced-motion: no-preference)`. Under reduce, use no transforms, Lenis, parallax, sparkles or intro, and at most 150ms of opacity. Set hidden states from JS only, so content is never hidden without JS.
- Accessibility: 44px targets, a visible focus ring (`focus` token), `aria-pressed` on toggles, and dialog focus returned to its trigger. Every new string goes in both dictionaries.
- Asset URLs go through `asset()` (base-path aware). Absolute URLs in `index.html` use `%SITE_URL%`.
- Update `CHANGELOG.md` for user-visible changes.

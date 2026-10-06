# FM Bomboniere: implementation plan

Goal: a fully built, designed and working showcase site for FM Bomboniere di Francesca Moliterni (Scalea), published on GitHub Pages and ready to move to a hosting service (IONOS / own server) later.

Binding design contract: `design/DESIGN.md`. Research inputs: `research/*.md`.

## Phase 1: Research
- [x] 1.1 Read the brief (`idea.md`): white / light blue / light pink, elegant font, simple showcase, recent collections only
- [x] 1.2 Read all repo skills (`.agents/skills/*`) → `research/skills-digest.md`
- [x] 1.3 Design systems (designsystems.one: Radix + Zendesk Garden, AI-ready pillars, tools) → `research/design-systems.md`
- [x] 1.4 Example sites (siteofsites, siteinspire, awwwards; primary reference Ceci New York) → `research/example-sites.md`
- [x] 1.5 Useful materials (Codrops techniques, pmnd.rs, Blender verdict: no 3D) → `research/useful-materials.md`
- [x] 1.6 Study sibling projects `../la-dolce-isola`, `../pasticceria-marylou` (stack, deploy, Pages workflow)

## Phase 2: Design system
- [x] 2.1 Color roles with measured WCAG contrast
- [x] 2.2 Typography (Cormorant Garamond + Jost), scale, spacing, radii, elevation
- [x] 2.3 Component specs (header, hero collage, about, collections, gallery, lightbox, contact, footer)
- [x] 2.4 Motion table + reduced-motion policy + prohibited list → `design/DESIGN.md`
- [x] 2.5 Machine-readable tokens `design/fm.tokens.json` (DTCG) + component contracts `design/components.json`

## Phase 3: Assets
- [x] 3.1 Gallery photos: 23 recent Instagram images (2026-03 → 2026-09), webp 1600 + 640, manifest `src/data/gallery.json`, provenance `research/photos.md`
- [x] 3.2 First logo extraction from page 2 (circular crop with dark backdrop)
- [x] 3.3 Verified: header/footer/icons use page 2 of `logo.pdf` (pink monogram + pink glitter ring); page 1 (gold on black) is not used anywhere
- [x] 3.4 Header and footer render the page-2 disc as-is (circular, transparent outside the disc)

## Phase 4: Build (Vite 8 + React 19 + TS + Tailwind 4 + GSAP/ScrollTrigger/Flip + Lenis)
- [x] 4.1 Scaffold, pinned dependencies, `VITE_BASE`-driven base path
- [x] 4.2 Tokens in `src/index.css` (`@theme`), self-hosted fonts
- [x] 4.3 IT/EN i18n with persisted choice and `<html lang>`
- [x] 4.4 Header: transparent → frosted on scroll, mobile overlay menu, language toggle, logo
- [x] 4.5 Intro curtain (once per session, skipped on reduced motion)
- [x] 4.6 Hero: arch collage, split headline reveal, parallax, sparkles, CTAs
- [x] 4.7 Chi siamo, Collezioni (cards set the gallery filter)
- [x] 4.8 Galleria: filter chips + GSAP Flip, lazy srcset images, clip-path reveals
- [x] 4.9 Lightbox: dialog, focus trap, Esc, arrows, swipe, counter, caption
- [x] 4.10 Contatti: address + Maps link + lazy iframe, phone, WhatsApp, email, Instagram, Facebook
- [x] 4.11 Footer with logo, contacts, socials, back to top
- [x] 4.12 Lightbox caption fix (collection on its own line, no stray separator)
- [x] 4.13 Footer tagline contrast fix

## Phase 5: Deploy readiness
- [x] 5.1 `.github/workflows/pages.yml` (base `/<repo>/`)
- [x] 5.2 `Dockerfile` + `nginx.conf` + `docker-compose.yml` (base `/`)
- [x] 5.3 `deploy/ionos.htaccess` (portable `VITE_BASE=./` build)
- [x] 5.4 SEO: meta, OG, JSON-LD LocalBusiness, robots.txt, manifest.json
- [x] 5.5 Absolute canonical/OG/JSON-LD URLs from `VITE_SITE_URL` (`fm-site` plugin in `vite.config.ts`); generated `robots.txt` + `sitemap.xml`

## Phase 6: Docs and AI-ready files
- [x] 6.1 `README.md` (stack, develop, content updates, deploy: Pages / Docker / IONOS)
- [x] 6.2 `AGENTS.md` + `CLAUDE.md` (`@AGENTS.md`)
- [x] 6.3 `public/llms.txt` index + build copies of `design/*` into `dist/design/`
- [x] 6.4 `CHANGELOG.md`
- [x] 6.5 `research/` scratch check: no throwaway scripts left; `posts.py`/`parse.py`/`build.py` are the documented photo pipeline

## Phase 7: QA (desktop 1440, laptop 1280, tablet 768, mobile 390/375)
- [x] 7.1 Build passes, zero TS errors
- [x] 7.2 Playwright: no console errors, no 4xx, no horizontal overflow, nothing left hidden after reveals
- [x] 7.3 Filters (7 chips, counts 23/4/10/6/1/1/1), lightbox open/next/Esc, scroll unlock, both logos present
- [x] 7.4 Reduced-motion run
- [x] 7.5 Full re-QA after swarm audit (VisualQA + CodeQA): gallery switched to uniform 4:5 tiles (no row holes at 2/3/4 cols); portable `./` build checked
- [x] 7.6 Keyboard-only pass at 375/768/1280: skip link first, logical focus order, lightbox focus trap + focus return to tile

## Phase 8: Publish
- [x] 8.1 `git init`
- [ ] 8.2 First commit
- [ ] 8.3 Create GitHub repo `R3LCH/fmbomboniere` and push `main`
- [ ] 8.4 Enable Pages (GitHub Actions source), wait for the workflow, verify the live URL

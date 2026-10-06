# FM Bomboniere design system

The site is a quiet, photo-led boutique showcase: white canvas, powder-pink and sky-blue surfaces, charcoal ink that echoes the logo's dark disc, and rose gold kept for small details. Elegant, not modern-flashy. The products are the main attraction.

Sources: `research/skills-digest.md`, `research/design-systems.md` (Radix role separation + Zendesk Garden contrast and geometry), `research/example-sites.md` (primary reference Ceci New York; secondary Flowerdose, WWAKE, Oh les Fleurs, Ladurée), `research/useful-materials.md` (Codrops techniques).

Dials: variance 4, motion 4, density 2–3. Light theme only.

## Color roles (WCAG ratios measured)

| Token | Hex | Role |
|---|---|---|
| `surface` | `#FFFFFF` | main canvas, lightbox mattes |
| `surface-ivory` | `#FCFAF8` | alternate canvas |
| `surface-blush` | `#F8EAEE` | pink section wash (About, Contact) |
| `surface-sky` | `#E8F2F8` | blue section wash (Hero band, Collections) |
| `ink` | `#2E2A30` | headings/body; 14.1 white, 12.1 blush, 12.4 sky |
| `ink-muted` | `#5E5862` | secondary text/captions; ≥5.9 on every surface |
| `action` | `#7A4F5E` | dusty-rose CTA fill/links; white label 6.76; ≥5.8 as text |
| `action-hover` | `#63404D` | CTA hover; white label 8.86 |
| `focus` | `#425E70` | 2px focus outline, offset 3px; ≥5.9 |
| `rose-gold` | `#C59B90` | decorative hairlines, ornaments, sparkles only (never text) |
| `blue-deco` | `#BBD3DF` | decorative accents only |
| `line` | `#E7DCDF` | dividers |
| `logo-disc` | `#2B2729` | backdrop behind the logo (footer band) |

Rules: pastels are surfaces, never foreground. One interaction accent (`action`). No metallic gradients except the logo artwork itself. Only very soft linear washes between surfaces (blush→white) at section boundaries; no radial blobs.

## Typography

- Display: Cormorant Garamond (`@fontsource/cormorant-garamond`, 400/500/600 + 400/500 italic). Italic in one word per headline at most, as an accent.
- Body/UI: Jost Variable (`@fontsource-variable/jost`), 300–500.
- No extra script font; the script lives only inside the logo. Remove `@fontsource/pinyon-script`.
- Scale (size/line-height): eyebrow 12/16 Jost 500 uppercase +0.18em; caption 13/20; nav 14/20 +0.06em; body 17/28 (Jost 300/400); lead 19/31; h3 `clamp(1.5rem,1.2rem+1vw,1.875rem)`/1.2; h2 `clamp(2.25rem,1.6rem+2.4vw,3.5rem)`/1.08; h1 `clamp(2.75rem,1.8rem+4vw,5.25rem)`/1.02, tracking −0.01em, weight 500.
- Body measure ≤ 60ch. `font-synthesis: none`. `text-wrap: balance` on headings, `pretty` on paragraphs.

## Space, shape, elevation

- Space scale 4/8/12/16/24/32/40/48/64/96/128px. Gutter `clamp(1.25rem,4vw,4rem)`; section padding `clamp(4.5rem,9vw,8.5rem)`; container 1240px; gallery gap 12px mobile / 20px desktop.
- Radius: 2px controls inside forms, 6px images, 14px dialog/menu panels, 999px pills (buttons, filter chips). Arches allowed: `border-radius: 999px 999px 6px 6px` for the hero main photo and About portrait frame (classic bomboniera feel).
- Shadows: none on gallery. Hero photo frame `0 30px 60px -30px rgb(46 42 48 / .25)`. Lightbox none (dim backdrop). Never animate box-shadow.
- Ornament: thin rose-gold hairline + small four-point star (SVG) used as a section divider; at most one per section.

## Layout & components

- Header: 72px (desktop) / 64px (mobile), fixed. Transparent over the hero; after 24px scroll it becomes `rgb(255 255 255 / .82)` + `backdrop-filter: blur(12px)` + 1px `line` border (solid white fallback). Logo left (circle, 52px→44px on scroll), nav center/right, IT/EN toggle, mobile hamburger → full-screen ivory overlay with staggered links.
- Hero (Ceci collage adapted): left text column (eyebrow "Scalea · dal …" only if verified; otherwise "Bomboniere e articoli da regalo"), H1 ≤ 2 lines, ≤20-word lead, two CTAs (primary "Scopri la galleria", secondary outline "Contattaci" / WhatsApp). Right: 3-photo collage (tall arch photo + two stacked) from `featured` images, 4–8 SVG sparkles near the arch. Below 768px, hide the whole collage and sparkles with no reserved space. Tablet (768–1023px): arch vertically centered beside the two small photos without stack bottom padding. Desktop retains bottom alignment and stack padding.
- About ("Chi siamo"): blush wash, 2–3 sentences, list of occasions (Matrimonio · Battesimo · Comunione · Cresima · Nascita · Laurea · Regali), small logo-disc medallion. Below 768px, occasions use two left-aligned columns without separators; wider layouts retain the wrapping serif list and hairlines.
- Collections: sky wash, one card per collection present in the manifest (photo 4:5, serif name, count). Click = jump to gallery with that filter active.
- Gallery: filter chips (Tutte + collections present) with `aria-pressed`; CSS Grid (2/3/4 columns) of uniform 4:5 tiles with `object-cover`, so rows never have holes for any filter or column count; full uncropped photo in the lightbox. Each tile is a `<button>` opening the lightbox.
- Lightbox: native `<dialog>` or role=dialog with focus trap, Esc, ←/→, swipe, counter "3 / 24", caption (alt text + collection), close button 44px; scroll locked; focus restored to the tile.
- Contact: blush; address with Maps link, lazy Google Maps iframe (with title), phone, WhatsApp, email, Instagram, Facebook as large tappable rows with line icons (1.5px stroke, consistent set).
- Footer: dark `logo-disc` band so the logo sits naturally on its own background; logo 120px, short line, contacts, socials, © year, back-to-top.

## Motion

GSAP 3.15 + ScrollTrigger + Flip; Lenis for smooth wheel scroll (touch stays native). One `gsap.context` per component, reverted on unmount; `gsap.matchMedia()` branches on `(prefers-reduced-motion: no-preference)`.

| Purpose | Values |
|---|---|
| Intro curtain | ivory overlay, logo fades in 0→1 and scales 0.94→1 (0.6s), curtain lifts `yPercent:-100` 0.7s `expo.inOut`; total ≤1.3s; skipped on reduced motion and if already played this session |
| Headline reveal | split into lines (static spans, no lib), `yPercent:110→0` in overflow-hidden masks, 0.9s `expo.out`, stagger 0.08 |
| Section reveal | opacity 0→1, y 16→0, 0.7s `cubic-bezier(.16,1,.3,1)`, start `top 85%`, once |
| Image reveal | clip-path `inset(100% 0 0 0)`→`inset(0)` 1.0s `expo.out` + inner img scale 1.12→1 |
| Hero parallax | collage photos `yPercent` ±6 scrub, desktop only |
| Filter | `Flip.from` 0.6s `power3.inOut`, absolute, entering fade/scale .96→1, leaving fade .2s |
| Lightbox | backdrop fade .3s; image from tile rect via Flip (0.55s `power3.inOut`), close .4s; prev/next crossfade .35s + x 24px |
| Hover (fine pointer only) | image scale 1→1.04 0.7s `cubic-bezier(.23,1,.32,1)`; buttons bg-color 220ms; press scale .98 120ms |
| Menu overlay | clip-path circle/inset from toggle 0.6s `expo.inOut`, links stagger 0.06 |
| Sparkles | CSS keyframes opacity 0→.8→0, scale .6→1, 3–6s offset cycles, paused when offscreen; none under reduced motion |

Reduced motion: no transforms, no Lenis, no parallax/sparkles/curtain; content visible immediately; ≤150ms opacity only. Hidden states are set by JS only when animation initializes, so content never stays hidden if JS fails.

## Prohibited

Glitter over product photos, emojis, fake reviews/metrics/dates, pricing, e-commerce, marquees, scroll hijacking or pinning, custom cursors, 3D/WebGL, neon, dark mode, `transition: all`, more than one accent color, em dashes in UI copy.

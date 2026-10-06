# FM Bomboniere — design-system research

Use **Radix Themes** for restrained semantic tokens and **Zendesk Garden** for contrast discipline, modest radii, and readable scale; borrow principles, not their enterprise-looking components. [INFERENCE] A white-led, serif editorial treatment with blush/blue surfaces and charcoal text best preserves this boutique’s refined, non-futuristic brief. AI-readiness here means editable machine-readable design contracts—not adding an AI feature to the public website.

## Map / existing precedent
- `design-systems/designsystems.md:1` → requires the directory, AI-ready pillars, and tools research.
- `fmbomboniere/idea.md:7` → current attractive collections, short explanation, elegant type, white/light blue/light pink; simple showcase, not commerce.
- `la-dolce-isola/src/index.css:1-40` → Tailwind 4 `@theme`, locally packaged fonts, semantic colors, custom cubic-beziers; reuse this mechanism, not its burgundy palette.
- `la-dolce-isola/src/index.css:87-96` → reduced-motion rule disables animations but **does not disable CSS transitions**; do not copy that omission.
- `la-dolce-isola/package.json:11-39` → React, TS, GSAP, Fontsource, Vite, Tailwind/Vite plugin precedent. Its 3D/flipbook dependencies are irrelevant here.
- Directory inspected: https://www.designsystems.one/design-systems (streamed HTML contains the cards; reader extraction only exposed the header).

## Chosen references: exactly two
### 1. Radix Themes / Primitives — customizable restraint
- Directory entry: https://www.designsystems.one/design-systems/radix-ui ; official: https://www.radix-ui.com/ . Themes provides tokens; Primitives provides unstyled behavior. Do not confuse them.
- Color: https://www.radix-ui.com/themes/docs/theme/color — 12-step scales: 1–2 backgrounds; 3–5 interactive surfaces; 6–8 borders; 9–10 solid fills; 11–12 text. Pink, sky, bronze, mauve, sand available. Copy **role separation**, not saturated accent-9 buttons.
- Type: https://www.radix-ui.com/themes/docs/theme/typography — size/line-height pairs: 12/16, 14/20, 16/24, 18/26, 20/28, 24/30, 28/36, 35/40, 60/60px; explicit custom heading and body font tokens.
- Spacing: https://www.radix-ui.com/themes/docs/theme/spacing — 4,8,12,16,24,32,40,48,64px; density scales uniformly. Useful baseline, extend only section-level whitespace.
- Radius: https://www.radix-ui.com/themes/docs/theme/radius — six-step scale, factors none/small/medium/large/full; full is contextual, not “round every object.” Keep images modestly rounded, pills only for controls.
- Shadow: https://www.radix-ui.com/themes/docs/theme/shadows — six tiers distinguish inset/panels/small overlays/dialogs; normal gallery images need not be floating app cards.
- Motion: https://www.radix-ui.com/primitives/docs/guides/animation — CSS `data-state="open|closed"` keyframes suspend unmount until exit ends; example 300ms enter/exit. JS transitions need `forceMount` and explicit lifecycle control. **These are examples, not a prescribed motion-token scale.**
- [INFERENCE] Best fit because custom serif families and subdued surface roles can stay elegant without inheriting a SaaS aesthetic; install no full Themes library just to obtain these numbers.

### 2. Zendesk Garden — quiet geometry / accessibility
- Directory entry: https://www.designsystems.one/design-systems/garden ; official: https://garden.zendesk.com/ .
- Color: https://garden.zendesk.com/design/color/ — twelve shades per hue, contrast-normalized; docs say 600 ≥3:1, 700 ≥4.5:1, 800+ ≥7:1 against white or shade 100. **Those guarantees belong to Garden’s palette, not arbitrary FM hex colors.** Never rely on color alone.
- Type: https://garden.zendesk.com/components/typography/ — six steps SM→XXXL, paired font/line-height tokens. Rendered page CSS exposes 12/16,14/20,18/24,22/28,26/32,36/44px; modest hierarchy rather than huge bold interface lettering.
- Spacing/radius: https://garden.zendesk.com/components/theme-object/ — `space.base` drives a base-4 component system, xxs→xxl layout units; example `borderRadii` sm=2px, md=4px, lg=8px. Reuse small geometry and four-pixel rhythm.
- Shadows: same page distinguishes focus-ring shadows from elevated modal/notification shadows; color guide explicitly says not to shadow elements that should not be elevated.
- Motion inspected in those pages’ generated CSS: state changes use 100ms and 250ms; floating-listbox example 200ms `cubic-bezier(.15,.85,.35,1.2)` with overshoot. **Do not import that overshoot** into a calm boutique; use the FM curve below.
- [INFERENCE] Its modest radii and low visual noise fit classic boutique packaging better than large Material-style controls. Do not adopt its default system font, blue interface chrome, or styled-components stack.

## Proposed FM tokens — recommendations, not claimed existing brand tokens
### Color roles
[INFERENCE] Contrast notes below are conservative design expectations, not measured results; main agent should calculate every shipped foreground/background pair using WCAG relative luminance. Require ≥4.5:1 normal text, ≥3:1 large text (24px regular / ~18.7px bold), ≥3:1 essential UI boundaries/icons. Use 4.5:1 even for thin serif headlines when possible.

| Semantic CSS token | Hex | Use / contrast constraint |
|---|---|---|
| `--color-surface` | `#FFFFFF` | Main canvas and image mattes |
| `--color-surface-paper` | `#FCFAF8` | Warm near-white secondary canvas |
| `--color-surface-blush` | `#F8EDEF` | Pink section wash; never light-colored text |
| `--color-surface-sky` | `#EAF3F7` | Blue section wash; never white text |
| `--color-text` | `#303034` | Charcoal, echo logo; expected comfortably ≥7:1 on all four surfaces |
| `--color-text-muted` | `#62616A` | Body/captions; expected ≥4.5:1 on all four surfaces; keep fully opaque |
| `--color-action` | `#795461` | Dark dusty rose, links/primary CTA; white label expected ≥4.5:1 |
| `--color-action-hover` | `#63434F` | Darker CTA state; same white label |
| `--color-focus` | `#425E70` | Dark desaturated blue outline; expected ≥3:1 on pale surfaces |
| `--color-decoration-rose` | `#C59B90` | Rose-gold echo, decorative strokes only; not small text/essential icons |
| `--color-decoration-blue` | `#BBD3DF` | Decorative blue accents only; not white-labeled buttons |
| `--color-divider` | `#E4DADB` | Decorative separators only, not sole affordance for controls |

- Primary CTA: dusty rose fill/white text; secondary: pale blue fill/charcoal text. Pale colors are **surfaces**, not readable foreground colors.
- Focus: `outline:2px solid var(--color-focus); outline-offset:4px`; preserve outlines in forced-colors mode.
- Keep original logo intact; rose-gold/glitter colors are decorative identity, not a reason to use metallic gradients throughout the page.

### Type, spacing, shape
- [INFERENCE] Display: **Bodoni Moda Variable**, 400–500, roman + occasional italic; body/navigation: **Manrope Variable**, 400/500. These fonts already have repo installation precedent. No extra script font outside the supplied logo.
- Fontsource imports precedent: `@fontsource-variable/bodoni-moda/opsz.css`, `opsz-italic.css`, `@fontsource-variable/manrope/wght.css`; enable `font-optical-sizing:auto; font-synthesis:none`.
- Scale (font-size / line-height): caption 12/18; nav 14/20; body 16/26; lead 18/30; product title 24/30; h3 28/34; h2 `clamp(2rem,1.5rem + 2vw,3rem)` /1.15; h1 `clamp(2.75rem,1.75rem + 4vw,5rem)` /1.08. Tracking: body 0; display −.015em; short uppercase eyebrows +.14em.
- Spacing primitive scale: 4,8,12,16,24,32,40,48,64,96,128px. Semantic gutter `clamp(1rem,4vw,4rem)`; section block padding `clamp(4rem,8vw,8rem)`; gallery gap 24px mobile /40px desktop; caption gap 12px; text width 52ch; container 1200px.
- Radii: small 4px; image 8px; dialog 16px; pill 999px. Avoid giant rounded app-card grids. Interactive targets at least 44×44px.
- Shadows: none for normal gallery; optional photograph matte `0 8px 28px rgb(48 48 52 / .06)`; lightbox `0 24px 72px rgb(48 48 52 / .14)`. Do not animate box-shadow.

### Motion — smooth without spectacle
- Durations: press 120ms; hover 220ms; menu/lightbox enter 320ms, exit 220ms; gallery reveal 650ms; photo zoom 700ms; per-item stagger 70ms, capped to four items.
- Easing: settle `cubic-bezier(.23,1,.32,1)` (existing precedent); overlay `cubic-bezier(.32,.72,0,1)` (existing precedent); exit `cubic-bezier(.4,0,1,1)`.
- Reveal technique: opacity 0→1 + y 16px→0, once at viewport 85%; no pinning, parallax, blur reveals, scroll hijacking, bounce, or sparkling particle field. Product photography stays the attraction.
- CSS hover only on `(hover:hover) and (pointer:fine)`: image scale 1→1.025 inside overflow-hidden image frame; transform/opacity only. Do not move captions or zoom layout dimensions.
- GSAP: scope with `gsap.context(..., root)` and `context.revert()` cleanup; branch with `gsap.matchMedia()` on `prefers-reduced-motion`. Set hidden state only when animation is initialized, not as a permanent CSS default.
- Reduced motion: no translation/scale/stagger, no smooth scrolling, visible final content; optional ≤100ms opacity only. Disable **transitions and animations**, and skip GSAP timelines as well as applying CSS.
- Supplemental principle inspected: https://spectrum.adobe.com/foundations/behavior/motion — motion must add meaning and respect reduced motion; Spectrum 2’s detailed motion guidance is explicitly still in development. Not selected as a third complete token reference.

## What “AI-ready” requires / apply to static Vite
Source: https://www.designsystems.one/ai-ready#pillars ; detail: https://www.designsystems.one/ai-ready/agent-files .
- **Pillar 1: machine-readable tokens.** A `.tokens.json` source of truth, semantic-over-primitive layering, typed values and intent descriptions/JSDoc/TSDoc. Named CSS vars or TS exports are discoverable alternatives in its checklist, but the pillar recommends DTCG JSON.
- **Pillar 2: MCP query surface.** Expose tokens/components/patterns at edit time: `list-tokens`, `find-component`, `get-pattern`; resources include catalog, exact contracts, decisions. MCP is an editor/developer service, **not Vite browser runtime**. Static JSON URLs do not constitute an MCP server.
- **Pillar 3: component contracts.** TS-first constrained/discriminated unions, machine-readable component docs, type-checked composition examples, optional shadcn-style registry distribution. Existing components in this site remain plain TSX.
- Nuance: article headline says all three compound; checklist also recognizes repo files, package types, registries and readable docs as useful distribution paths. A token/doc-only site is useful, but must not claim to implement the full three-pillar stack.

Proposed file contract (inside `fmbomboniere/`, not workspace-wide):
1. `design/fm.tokens.json` — authoritative colors/type/space/radius/shadow/motion; DTCG `$type`, `$value`, `$description`; aliases `{color.palette.charcoal}`. Current color shape uses `{ "colorSpace":"srgb", "components":[1,1,1], "alpha":1, "hex":"#FFFFFF" }`; dimensions `{ "value":16,"unit":"px" }`, durations `{ "value":220,"unit":"ms" }`, cubicBezier `[.23,1,.32,1]`.
2. `src/styles/tokens.css` — generated CSS vars plus Tailwind 4 `@theme` mappings imported once by app CSS; do not create a separate Tailwind 3 config convention or hand-maintain duplicate token values.
3. `DESIGN.md` — concise portable visual contract: palette roles, typography, hierarchy, image rules, approved compositions, motion/reduced-motion, accessibility and prohibited treatments. Reference JSON for exact values.
4. `AGENTS.md` — short durable instructions: exact stack, token/doc paths, approved components, content provenance and validation commands. Tell agents explicitly to read DESIGN.md for UI work; it is not automatically discovered everywhere.
5. `CLAUDE.md` when Claude Code is a consumer — first line **`@AGENTS.md`**, not a Markdown link. Source explains that links are inert and Claude’s memory files stack rather than override.
6. `design/components.json` — actual exports/import paths, constrained prop variants, required alt/label props, keyboard/focus behavior; generate from or maintain next to TS contracts, never invent nonexistent APIs. `design/examples.tsx` — checked examples using those real components; not screenshot-only documentation.
7. `public/llms.txt` — public Markdown index linking `/design/DESIGN.md`, `/design/fm.tokens.json`, `/design/components.json`; publish copies from the same sources during build. It is an index **handed to agents**, not an SEO guarantee or crawler-access control file. Do not publish private instructions.
8. Full-pillar option: `tools/design-mcp.ts` plus consumer’s MCP config, read-only tools/resources backed by those same source files, run locally over stdio. Hosting the marketing site remains static; do not put server code in `src/` or pretend `/mcp.json` creates a working server.
9. Consumer-specific alternatives only when used: `.cursor/rules/design.mdc` with meaningful description/globs; `.github/copilot-instructions.md`; `.github/instructions/ui.instructions.md` with `applyTo`; `.agents/skills/fm-design/SKILL.md` (name/description, on-demand deeper guidance). Avoid nine conflicting duplicate rule sets.

- DTCG upstream: https://www.designtokens.org/TR/2025.10/format/ — stable Community Group specification, **not a W3C Standard**, despite the hub’s shorthand “W3C-spec.” Validate exporter shape rather than assuming legacy string-hex JSON complies.
- Vite upstream: https://vite.dev/guide/assets.html#the-public-directory — `public/` files are served/copied verbatim with stable filenames; no backend needed for `.txt/.json/.md`. Root deployment links use `/design/...`; for subpath deployment generate matching base-prefixed index links.
- Practices main agent should enforce: token-schema validation, token→CSS drift check, examples type-check, actual-export contract check, real contrast pairs, keyboard/lightbox focus/Escape/return-focus, reduced-motion behavior, 200% zoom/mobile overflow. None was executed in this read-only research.
- [UNKNOWN] FM build/deploy base and final domain were not established; do not hardcode a invented production origin in public docs.

## Relevant tools from the actual directory
Source inspected: https://www.designsystems.one/tools ; eight listed tools, no signup. Token editing stays in-browser; website scanners send the supplied URL to their server.
- https://www.designsystems.one/tools/token-generator — OKLCH scales anchored to brand hex, semantic roles, live previews, APCA, 12 exports including DTCG/Tokens Studio/Figma Variables. Use for roles/export exploration; **APCA is not WCAG 2.x contrast certification**.
- https://www.designsystems.one/tools/accessibility-checklist — design-system WCAG/APCA checklist; prioritize contrast, focus, image alternatives, reduced motion, dialog keyboard behavior.
- https://www.designsystems.one/tools/grid-builder — columns/gutters/margins/container/breakpoints → CSS Grid/Flexbox/Tailwind/layout tokens. Use a simple editorial gallery; do not turn it into a dashboard bento.
- https://www.designsystems.one/tools/token-diff — compares color/type/spacing/shape/motion roles; useful when refreshing seasonal gallery styling.
- https://www.designsystems.one/tools/release-checker — compares token exports, breaking renames/removals, SemVer/release notes; optional for this small internal token set.
- https://www.designsystems.one/tools/website-to-design-md — extracts design.md, tokens.css, DTCG JSON and Tailwind theme from public URLs; useful reference extraction, not proof of brand fidelity.
- https://www.designsystems.one/tools/agent-ready-check — scans five signals: llms.txt, registry, DTCG, MCP, Code Connect. Evidence aid, not a reason to add unnecessary infrastructure/Figma integration for a score.
- https://www.designsystems.one/tools/roi-calculator — listed but not material for a one-site boutique showcase; skip installation.
- These are browser utilities, not required npm dependencies. Keep existing Vite/Tailwind/GSAP/Fontsource stack; optional token translation tool **Style Dictionary** is named by DTCG upstream when a generated CSS pipeline is chosen.

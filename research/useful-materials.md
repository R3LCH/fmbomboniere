# Useful materials — FM Bomboniere

Recommend a photo-first DOM gallery with GSAP image reveals and Flip expansion; Lenis is optional, not necessary for smooth transitions. [INFERENCE] Blender/Three.js and a second animation engine would add complexity without serving the simple, refined showcase brief; borrow the sparkle aesthetic, not its GPU implementation.

## Source map
- `useful-materials/codesnippets.md:1-2` → [Codrops Hub](https://tympanus.net/codrops/hub/), tutorial/demo discovery.
- `useful-materials/polmanders.md:1-2` → [pmnd.rs](https://pmnd.rs/) projects; configure docs MCP before first library use, then use only MCP.
- `useful-materials/blender-setup.md:1-7` → Blender optional; MCP required before use; computer-use visual verification recommended.
- `fmbomboniere/idea.md:8-24` → current genuine collection photography, short introduction, elegant typography, soft white/blue/pink, simple and not overly modern.
- [Official Poimandres docs index](https://docs.pmnd.rs/) → ecosystem library descriptions and exact MCP setup.

## Six concrete Codrops picks

### 1. Smooth image reveal — Animated Product Grid Preview with GSAP & Clip-Path
- [Tutorial](https://tympanus.net/codrops/2025/05/27/animated-product-grid-preview-with-gsap-clip-path/) · [Demo](https://tympanus.net/Tutorials/GridToFullPreview) · [Code](https://github.com/gwen-bo/codrops-grid-to-preview).
- Actual stack: GSAP, vanilla JS, CSS clip-path. Cross-shaped polygon overlay closes its gaps while surrounding cards translate; geometry recalculates on resize; hover uses 100ms debounce.
- Recommended adaptation: borrow masking, not puzzle assembly. Proposed tween: `gsap.fromTo(frame,{clipPath:'inset(0 0 100% 0)'},{clipPath:'inset(0 0 0% 0)',duration:.75,ease:'power2.out'})`; inner image scale `1.035 → 1` concurrently, once at viewport entry.
- [INFERENCE] A quiet inset reveal fits better than the original cross effect. This is an adaptation of a hover-preview demo, not an existing on-scroll snippet. Demo images are AI-generated; never reuse them as shop stock. Hover requires touch/click equivalent.

### 2. Grid → fullscreen — Infinite GSAP Scroll Gallery with Parallax and Flip Transitions
- [Tutorial](https://tympanus.net/codrops/2026/07/30/building-an-infinite-gsap-scroll-gallery-with-parallax-and-flip-transitions/) · [Demo](https://tympanus.net/Tutorials/InfiniteScrollGSAPGallery/) · [Code](https://github.com/surya-aditya/codrops-infinite-scroll-and-content-transition).
- Actual stack: GSAP Observer, Flip, SplitText; **not Lenis**. Opening captures thumbnail bounds then `Flip.from(state,{targets:preview,absolute:true})`; closing uses `Flip.fit(preview,thumbnail,...)`.
- Invariant: assign selected thumbnail and separate preview matching `data-flip-id` **before** capture; only one thumbnail claims it. Snapshot → mutate → animate.
- Real open flow awaits image decoding and rechecks state afterward, kills existing thumbnail reveal tween, tracks `closed|opening|open|closing`. Escape mid-open reverses timeline; Escape during decode resets without assuming a timeline exists.
- Recommended: take only transition; retain finite native document scrolling. Proposed open `.55s power3.inOut`, close `.4s`; native image buttons plus accessible dialog, focus containment/restoration, Escape and inert background.
- Article explicitly documents absent keyboard scrolling and reduced-motion support; do not inherit them. Its Observer hijacks wheel/touch and prevents normal scrolling, unsuitable for reachable business contacts/footer.

### 3. Flip filtering basis — Animating Responsive Grid Layout Transitions with GSAP Flip
- [Tutorial](https://tympanus.net/codrops/2026/01/20/animating-responsive-grid-layout-transitions-with-gsap-flip/) · [Demo](https://tympanus.net/Tutorials/GridLayoutTransitions/) · [Code](https://github.com/Ibaliqbal/grid-layout-transition).
- Actual stack: GSAP + Flip + CSS Grid. Captures all items, changes `data-size-grid`, animates column/layout change; guards identical selection and active animation.
- **Demonstrates density switching, not category filtering.** Proposed category adaptation: `const state=Flip.getState(cards);` → apply visibility filter preserving stable DOM targets → `Flip.from(state,{duration:.4,ease:'power2.inOut',absolute:true,scale:true,onEnter:els=>gsap.fromTo(els,{opacity:0},{opacity:1,duration:.2}),onLeave:els=>gsap.to(els,{opacity:0,duration:.15})})`.
- Confirm entering/leaving details against [official Flip documentation](https://gsap.com/docs/v3/Plugins/Flip/) before implementation; that API page was not exercised here.
- React: capture before state change, animate after committed layout in `useLayoutEffect`. [INFERENCE] Keeping keyed nodes mounted and hiding excluded items retains leave targets; unmounting first loses geometry. Hidden controls must not receive focus; refresh ScrollTrigger after layout settles.
- Only offer categories supported by actual current collection metadata. Omit tutorial v2's random staggering and grid-wide blur/brightness.

### 4. Gentle sparkle reference — Crafting a Dreamy Particle Effect with Three.js and GPGPU
- [Tutorial](https://tympanus.net/codrops/2024/12/19/crafting-a-dreamy-particle-effect-with-three-js-and-gpgpu/) · [Demo](https://tympanus.net/Tutorials/DreamyParticles) · [Code](https://github.com/DGFX/codrops-dreamy-particles).
- Actual technique: Three.js MeshSurfaceSampler, GPUComputationRenderer position/velocity textures, GLSL circular points brightening with velocity, BVH raycasting for mouse repulsion, EffectComposer + custom MotionBloomPass.
- [INFERENCE] Gold shimmer fits the logo but thousands of simulated particles and bloom do not justify their renderer here. Do not ship this tutorial wholesale.
- Recommended lightweight reinterpretation: 6–10 small SVG four-point stars near logo ring; rose gold `#BE9586`, muted gold `#C8AE79`; opacity `0 → .4 → 0`, scale `.9 → 1 → .9`, offset 4–7s cycles. This CSS/SVG alternative is **not** the original implementation.
- `aria-hidden=true`, `pointer-events:none`; pause offscreen/hidden-tab, disable under reduced motion, never glitter over product photographs.

### 5. Text reveal — Making Stagger Reveal Animations for Text
- [Tutorial](https://tympanus.net/codrops/2020/06/17/making-stagger-reveal-animations-for-text/) · [Demo](http://tympanus.net/Tutorials/TypographyMotion/) · [Code](https://github.com/codrops/TypographyMotion/).
- Actual stack: GSAP + Splitting.js; overflow-hidden paragraphs, characters translate from `y:100%`, `.014s` stagger and `.5s` duration. Original also preloads Adobe Fonts and adds a custom cursor.
- Recommended adaptation: one hero headline, masked words/lines, `.6s power2.out`, line stagger `.06s`; leave body text and logo script intact. Known static headline spans need no splitting dependency.
- If responsive splitting is necessary, use GSAP SplitText already present in pick 2 rather than adding both splitting libraries. Wait for `document.fonts.ready`, handle line reflow, revert split during cleanup and preserve accessible full text.
- Omit cursor, page-switch choreography and tutorial font/content assets.

### 6. Lenis smooth scrolling — Getting Creative with Infinite Loop Scrolling
- [Tutorial](https://tympanus.net/codrops/2023/01/11/getting-creative-with-infinite-loop-scrolling/) · [Demo](http://tympanus.net/Tutorials/LoopScrolling/) · [Code](https://github.com/codrops/LoopScrolling/).
- Actual stack: Lenis + GSAP/ScrollTrigger + imagesLoaded. Sets `infinite:true`, clones opening grid items, drives Lenis via RAF and ScrollTrigger via scroll event.
- Recommended: synchronization only; no infinite loop/cloning/stretch/scale-to-zero. A local shop needs reachable contact section and finite page.
- Historical article uses `smooth:true` and Studio Freight URLs. Current [Lenis README](https://github.com/darkroomengineering/lenis): package `lenis`, `import 'lenis/dist/lenis.css'`, option `smoothWheel` rather than historical `smooth`.
- Proposed integration: `const lenis=new Lenis({anchors:true,syncTouch:false}); const tick=(t:number)=>lenis.raf(t*1000); lenis.on('scroll',ScrollTrigger.update); gsap.ticker.add(tick);` Never also enable autoRaf or run another RAF.
- Upstream recommends `gsap.ticker.lagSmoothing(0)`; this changes global GSAP behavior, so apply deliberately. Cleanup ticker, listener and `lenis.destroy()` on React unmount.
- Current README lists `respectReducedMotion:true` default; [UNKNOWN] installed-version support. Robust policy: skip Lenis instantiation under reduced motion; retain native touch scrolling and coordinate modal scroll lock.

## Poimandres fit and bundle value
Roles are sourced from [official index](https://docs.pmnd.rs/); fit/cost judgments are [INFERENCE]. [UNKNOWN] Exact gzip/tree-shaken bundle sizes were not measured; no invented KB estimates.

| Library | Possible role | Recommendation |
|---|---|---|
| React Spring / `@react-spring/web` | Interruptible gesture springs/lightbox | Skip: duplicates GSAP; fixed gentle transitions need no second runtime. |
| `zustand` | Shared lightbox/category state | Small state-oriented addition, but React state/context is sufficient for one gallery; add only for real cross-component state need. |
| `jotai` | Atomic gallery state | Skip: atoms add no evident value for selected photo/filter. |
| `valtio` | Shared React/vanilla proxy state | Skip: GSAP DOM integration does not require another state model. |
| `@react-three/fiber` + `three` | Actual 3D product viewer | Reject photo-gallery use: renderer/Three payload, canvas lifecycle and GPU work; consider only with approved real models and explicit viewer requirement. |
| `@react-three/drei` | R3F helpers; possible sparkles | Reject for glitter alone: requires Fiber/Three. [UNKNOWN] Sparkles API not queried through MCP, so do not implement from memory. |
| `@react-three/postprocessing` | Bloom/glow | Reject: dependencies plus extra GPU passes for decoration available with CSS/SVG. |
| `@react-three/a11y` | WebGL accessibility helpers | Relevant if 3D chosen, not a reason to replace semantic HTML gallery. |
| `leva`, uikit, xr, physics tools | Debug GUI/canvas UI/XR/physics | No requirement; omit. |

## MCP prerequisites — guidance, not executed setup
- Repo requires Poimandres MCP configured before library use; subsequent library guidance through MCP only. Reading setup index is not evidence of a connected server.
- Official endpoint: `https://docs.pmnd.rs/api/mcp`, HTTP transport.
- Claude Code: `claude mcp add --transport http pmndrs https://docs.pmnd.rs/api/mcp`.
- Plugin alternative: `/plugin marketplace add pmndrs/claude-code-plugin`, then `/plugin install pmndrs@pmndrs`.
- Generic configuration concept: `{"mcpServers":{"pmndrs":{"type":"http","url":"https://docs.pmnd.rs/api/mcp"}}}`; outer schema varies by client.
- Docs explicitly exposes MCP IDs including `react-three-fiber`, `drei`, `zustand`, `react-postprocessing`, `a11y`; not every indexed library has an MCP badge, so do not assume equal coverage.
- [UNKNOWN] Connection availability: this research agent has no MCP configuration/client tools, only model_health/swarm devices. No MCP connection was configured or exercised.

## Blender/3D decision
- [INFERENCE] Not sensible for current brief: genuine current collection photos are the deliverable; invented 3D favors could misrepresent stock, modeling adds an approval/asset pipeline, interactive 3D pushes the style toward an experimental showcase.
- Possible justified exception: explicitly approved static decorative render, or accurate supplied-model viewer with actual business need. Static AVIF/WebP render avoids runtime Three/Fiber payload; never substitute it for unavailable real product photos.
- [Upstream setup](https://github.com/ahujasid/mcp-for-blender) now uses package `mcp-for-blender` (formerly `blender-mcp`; legacy existing configurations still work).
- With official uv installed: `uvx mcp-for-blender setup`. Manual client config: `{"mcpServers":{"blender":{"command":"uvx","args":["mcp-for-blender"]}}}`; addon: `uvx mcp-for-blender install-addon`, enable **Interface: MCP for Blender** in Preferences.
- Restart client, open Blender; addon starts server on opening, or viewport `N` → MCP for Blender → Start MCP Server. Upstream warns to run only one MCP server instance. Repository recommends computer-use visual verification.
- [UNKNOWN] Local Blender/uv/addon availability; nothing installed or exercised.

## Implementation guardrails and handoff checks
- Proposed colors, not logo samples: white `#FFFFFF`, porcelain `#FCFAF8`, blush `#F4E5E8`, powder blue `#E7EFF4`, charcoal `#302D2D`, rose gold `#BE9586`.
- One scoped GSAP context/component, reverted on unmount; separate reveal mask/image from Flip geometry wrapper to prevent competing transforms.
- Reduced motion: static visible headings/images, no particle/parallax/smooth-scroll; modal/filter may use brief opacity. Real content remains usable without successful JS/image loading.
- Avoid loading gates, pinned gallery, custom cursor, autoplay carousel, GPU distortion and continuous shimmer on merchandise.
- Research evidence: tutorial text/readmes inspected; demos not browser-tested; no builds/bundle checks run. Main agent should check filter enter/leave/reflow, Escape during image decode/opening, focus restoration, touch/native scroll, reduced motion, React StrictMode cleanup, slow/failed image loads and snippet/asset licensing before copying.

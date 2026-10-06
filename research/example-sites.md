# Example sites

Use Ceci New York’s wedding-couture collage and gallery as the primary reference. Borrow Flowerdose’s occasion navigation and pastel photography, WWAKE’s gallery precision, Oh les Fleurs’ concise artisan introduction, and Ladurée’s gift-packaging presentation; adapt everything into FM’s white/powder-blue/blush showcase, not an online store.

## Ceci New York (PRIMARY)
- url: https://www.cecinewyork.com/
- gallery: https://www.cecinewyork.com/blogs/couture-gallery/
- visual: https://www.cecinewyork.com/cdn/shop/files/AUG_SEPT_HOMEPAGE.png?v=1692235989&width=1200
- observed: Current homepage leads with Bespoke Invitations/View our gallery and includes macarons gift boxes and personalized invitations. Hero asset is a five-photo wedding collage with a tall central stationery view, stacked side photographs and fine white gutters. Gallery contains short introduction, square project thumbnails and Details links.
- borrow: Traditional romantic photo hierarchy; five-image real-product hero collage; project-based collection gallery; unobtrusive captions; centered original FM logo with three anchor links.
- proposed_typography: Cormorant Garamond 500/600 + Source Sans 3 400; proposed equivalents, not identified source fonts.
- proposed_motion: 0.7s opacity/16px vertical reveal; 1.025 image hover scale over 0.55s; static captions and visible keyboard focus.

## Flowerdose
- url: https://flowerdose.com.au/
- discovery: https://www.awwwards.com/sites/flower-dose
- visual: https://flowerdose.com.au/cdn/shop/files/Lifestyle_flowerdose_7.jpg?v=1759784677&width=1200
- observed: Current content includes photo-led entry, local-florist introduction, Shop by Occasion tiles, best sellers, paired product photos and previous/next controls. Hero photography has pink plaster, blush ribbons, white flowers and pale green clothing.
- borrow: Adult pastel photography; occasion-led collection browsing; whole-object/detail photo pairs; user-controlled gallery rather than autoplay. Replace commerce nav with showcase/contact.
- proposed_motion: 0.35s detail-photo dissolve on hover/focus; native mobile swipe if horizontal gallery is used.
- gotcha: 2022 award screenshot is historical: current HTML identifies Shopify Mojave 2.0.3.

## WWAKE
- url: https://wwake.com/
- discovery: https://www.siteofsites.co/websites/wwake
- visual: https://static.wixstatic.com/media/ef5d4a_2ceea2e631634d10aacfc5e77c719972~mv2.png
- observed: Directory screenshot has white background, centered mark, small nav and four equal image columns alternating object close-ups and worn jewelry. Current homepage includes collection storytelling and paired alternate/lifestyle product photography.
- borrow: Consistent crop, aligned edges, imagery larger than captions, alternating full object and tactile detail. Use 3 columns/20–24px gutters for FM rather than flush fashion grid.
- proposed_typography: Borrow restrained sans captions/body; retain romantic FM serif headings. [UNKNOWN] Exact source font names.
- proposed_motion: 0.4s alternate-photo dissolve; no card shadows or moving titles.

## Oh les Fleurs!
- url: https://www.ohlesfleurs.com/
- discovery: https://www.awwwards.com/sites/oh-les-fleurs
- observed: Artisan descriptor, emotional headline, collection CTA, three portrait bouquet images, seasonal groups, craftsmanship/family/local introduction and contact/services. Awwwards categorizes Animation and provides Cards/Footer clips; clip behavior not inspected.
- borrow: Short what-we-do followed immediately by current collection imagery; authentic Francesca/craft introduction; clear contact endpoint.
- proposed_typography: Traditional serif heading/readable sans paragraph; [UNKNOWN] source font names.
- proposed_motion: Small image reveals with 0.08s staggering; thin link underline; no scroll hijacking.
- reject: Do not borrow saturated green/magenta, emojis or generic trust-card layout.

## Ladurée
- url: https://laduree.com/en-ww
- gallery: https://laduree.com/en-ww/collections/all-the-laduree-creations
- observed: Photo/video-backed hero, short Maison story, craftsmanship block, boutique/address photography. Current collection feed includes Versailles gift sets, macaron boxes and gift assortments.
- borrow: Ceremonial packaged-object presentation; distinguish collections, craftsmanship and visiting the boutique; photograph closed packaging and open details.
- proposed_typography: Elegant serif with restrained same-family italic and small sans nav; Cormorant Garamond/Source Sans 3 are proposed equivalents. [UNKNOWN] Actual source font names.
- proposed_motion: 0.6–0.8s section reveals and packaging-view dissolves; no mandatory video or cinematic complexity.

## composition
[INFERENCE / recommendation] Compact centered-logo header → pale-blue introduction/heading → Ceci-like five-photo favor collage → short Francesca introduction → generous collection gallery → pale-blush contact/visit section. Collage desktop grid: 1fr 1.65fr 1fr, central image spanning two rows; phone: one lead image + 2×2 details.

## proposed_tokens
{'white': '#FFFFFF', 'powder_blue': '#EEF5F9', 'blush': '#FAEFF2', 'charcoal': '#353338', 'secondary_text': '#65616A', 'divider': '#E5DDE1', 'muted_rose_detail': '#AD7884', 'note': 'Proposed FM colors, not sampled reference tokens. Pastels are surfaces, not body text; rose-gold chiefly remains inside original logo.'}

## proposed_motion_snippet
gsap.fromTo(el,{autoAlpha:0,y:16},{autoAlpha:1,y:0,duration:0.75,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 88%',once:true}}); Honor reduced motion by showing content immediately and disabling scaling/smooth scrolling; native scrolling, no pinned scenes.

## evidence_map
- great-websites-examples/examples.md:1-9 lists all three directories and premium animation requirement; read successfully.
- Site of Sites homepage/listings and Awwwards directory/relevant entries read; followed actual destinations and inspected image assets.
- Siteinspire homepage, florist category and Wrap detail returned HTTP 429; searched indexed content instead. Not treated as visually inspected.

## eliminated
- flwr.co.nz: 2019 bridal award screenshot is attractive, but live linked domain now serves casino content. Excluded.
- Minor Rose is a hair salon; wayside flowers is a bookmark project; Bouquet is experimental art; Garden Party is cannabis retail. Excluded despite misleading names.
- Bloom Bar is a genuine floral studio, but live extracted output mostly contains theme menu fragments; excluded for five stronger current-content references.

## unknowns
- [UNKNOWN] Current rendered hover states, mobile layout and animation timing were not interactively inspected; no browser tool exposed.
- All recommended fonts, hex colors and timings are proposals, not claims of source measurements.

## verification
Read-only research; no repository changes or builds/tests executed.
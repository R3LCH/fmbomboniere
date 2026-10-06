"""Curated gallery v2: Instagram (raw/<code>_<slide>.jpg) + Facebook photos grid (raw/fbfull/NNN.jpg).
One shot per event/set, no near-duplicate angles. Run from research/: python build2.py"""
import json, glob, os
from PIL import Image

OUT = "../public/img/gallery"
fbidx = json.load(open("raw/fbfull/index.json"))  # NNN -> FB image key (fbcdn file stem)

# (source, slug, collection, alt_it, alt_en, featured, date)  source: "ig:<rawid>" or "fb:<NNN>"
SEL = [
 # Battesimo
 ("fb:134", "battesimo-mariafrancesca-buste-arcobaleno", "battesimo", "Buste arcobaleno con fiocchi in chiffon rosa antico e bigliettino del battesimo", "Rainbow favour bags with dusty-pink chiffon bows and christening tag", False, ""),
 ("fb:119", "battesimo-orsetti-corona", "battesimo", "Orsetti con coroncina dorata e cuore su scatole azzurre e tulle", "Teddy bears with gold crowns and hearts on light blue boxes and tulle", False, ""),
 ("fb:093", "battesimo-orsetto-aviatore", "battesimo", "Allestimento battesimo con orsetto aviatore, torta azzurra e scatoline con nastro celeste", "Christening setup with aviator teddy, light blue cake and favour boxes with sky-blue ribbon", True, ""),
 ("fb:105", "battesimo-francesco-scatola-azzurra", "battesimo", "Scatola bianca con nastri azzurri e tag con orsetto per il battesimo di Francesco", "White box with light blue ribbons and teddy tag for Francesco's christening", False, "2025-06-08"),
 ("ig:DbtPxU7Atsq_03", "battesimo-joseph-fiocco-azzurro", "battesimo", "Bomboniera battesimo con nastri azzurri e avorio e bigliettino con orsetto per Joseph", "Christening favour with light blue and ivory ribbons and teddy-bear tag for Joseph", False, "2026-08-06"),
 ("ig:Da_rmO-AuWa_04", "battesimo-alessia-confettata", "battesimo", "Confettata rosa e lilla con vasi di confetti e cartellini arcobaleno", "Pink and lilac sugared almond bar with jars and rainbow labels", False, "2026-07-20"),
 ("ig:Da7fGpNAszv_02", "battesimo-azzurra-scatole-cuore", "battesimo", "Scatole con finestra a cuore e fiocchi fucsia per il battesimo di Azzurra", "Heart-window boxes with fuchsia bows for Azzurra's christening", False, "2026-07-18"),
 # Comunione e Cresima
 ("fb:109", "cresima-giulia-borsetta-fiore", "comunione", "Borsetta avorio con fiore pesca e nastro rosa antico per la Cresima di Giulia", "Ivory handbag favour with peach flower and dusty-pink ribbon for Giulia's Confirmation", False, ""),
 ("fb:110", "comunione-aurora-fiori-rosa", "comunione", "Scatole bianche e rosa con fiori secchi cipria e bigliettino della Prima Comunione di Aurora", "White and pink boxes with blush dried flowers and Aurora's First Communion tag", True, ""),
 ("fb:113", "comunione-giovanni-fiocco-oro", "comunione", "Scatola con fiocco giallo oro, fiore in ceramica e coppetta in vetro per la Comunione di Giovanni", "Box with golden yellow bow, ceramic flower and glass dish for Giovanni's Communion", False, "2025-05-18"),
 ("fb:097", "comunione-nicholas-nastri-oro", "comunione", "Bomboniere con nastri oro e avorio stampati Prima Comunione per Nicholas", "Favours with gold and ivory ribbons printed Prima Comunione for Nicholas", False, ""),
 ("fb:107", "comunione-ludovico-fiori-azzurri", "comunione", "Scatole bianche con fiori azzurri e nastro celeste per la Prima Comunione di Ludovico", "White boxes with blue flowers and sky-blue ribbon for Ludovico's First Communion", False, ""),
 ("fb:087", "cresima-giada-candela", "comunione", "Cilindri bianchi con fiori avorio e oro accanto a una candela per la Cresima di Giada", "White cylinders with ivory and gold flowers beside a candle for Giada's Confirmation", False, ""),
 ("ig:Da-twMGAp9-_01", "comunione-chanel-cappelliere-rosa", "comunione", "Cappelliere rosa in velluto con rose cipria e nome Chanel in oro", "Pink velvet hatboxes topped with blush roses and the name Chanel in gold", False, "2026-07-19"),
 ("ig:DbNdoNagmEn_03", "comunione-andrea-cilindri", "comunione", "Scatole cilindriche lilla con fiocchi verdi, fiori bianchi e tag della Prima Comunione di Andrea", "Lilac cylinder boxes with green bows, white flowers and First Communion tags for Andrea", False, "2026-07-25"),
 # Matrimonio
 ("fb:096", "matrimonio-scatole-gypsophila", "matrimonio", "Scatole bianche testurizzate con nastri di raso e mazzolini di gypsophila", "Textured white boxes with satin ribbons and baby's breath posies", True, ""),
 ("fb:033", "matrimonio-mr-mrs-ciotoline", "matrimonio", "Ciotoline in ceramica a cuore su tagliere in legno con scritta Mr & Mrs", "Heart-shaped ceramic dishes on a wooden board with Mr & Mrs sign", False, ""),
 ("fb:081", "matrimonio-taglieri-cuore", "matrimonio", "Taglieri a cuore in legno con ciotoline, vasetti di miele e posate", "Heart-shaped wooden boards with dishes, honey jars and spreaders", False, ""),
 ("ig:DdgjYQdAhui_02", "matrimonio-davide-veronica-coppetta", "matrimonio", "Coppetta in vetro con confetti, fiocco champagne e bigliettino floreale sul segnaposto del matrimonio", "Glass bowl of sugared almonds with champagne bow and floral tag on a wedding place setting", False, "2026-09-20"),
 ("ig:DWBaxqQAl3z_00", "matrimonio-partecipazioni-2026", "matrimonio", "Collezione partecipazioni 2026 ad arco nei colori beige, rosa, verde e lilla", "2026 arched wedding invitation collection in beige, pink, green and lilac", False, "2026-03-18"),
 # Feste e ricorrenze
 ("fb:095", "diciottesimo-pietro-nastri-tiffany", "feste", "Scatole trasparenti con nastri verde tiffany e tag 18 per i diciotto anni di Pietro", "Clear boxes with tiffany-green ribbons and 18 tags for Pietro's eighteenth", True, ""),
 ("fb:092", "diciottesimo-fiori-corallo", "feste", "Distesa di fiori in feltro corallo e salvia con tag 18", "Field of coral and sage felt flowers with 18 tags", False, ""),
 ("fb:086", "anniversario-50-anni-oro", "feste", "Scatole bianche con nastri oro e tag per i 50 anni insieme", "White boxes with gold ribbons and 50th anniversary tags", False, ""),
 ("ig:Da709nIAu4l_01", "diciottesimo-pasquale-apribottiglie", "feste", "Apribottiglie personalizzato 18 anni di Pasquale con scatola blu e fiocco petrolio", "Personalised 18th birthday bottle opener for Pasquale with blue box and teal bow", False, "2026-07-18"),
 ("ig:DbtPkOfAsA2_01", "laurea-sacchetto-rosso-quadrifoglio", "feste", "Sacchetto rosso per laurea con nastro personalizzato e portachiavi quadrifoglio", "Red graduation pouch with printed ribbon and four-leaf-clover keyring", False, "2026-08-06"),
 # Idee regalo
 ("fb:128", "regali-tulipani-menta", "regali", "Vaso menta con tulipani, dosatore e tazzina su ventagli di carta pastello", "Mint vase with tulips, soap dispenser and cup on pastel paper fans", True, ""),
 ("fb:126", "regali-lampade-rosa-lilla", "regali", "Lampade in vetro rosa e lilla con diffusore di profumo", "Pink and lilac glass lamps with a fragrance diffuser", False, ""),
 ("fb:121", "regali-vasi-floreali", "regali", "Vasi e barattoli in ceramica decorati con fiori e farfalle pastello", "Ceramic vases and jars painted with pastel flowers and butterflies", False, ""),
 ("fb:077", "regali-lanterne-cioccolatini", "regali", "Lanterne in vetro lilla e rosa con ciotola a cuore di cioccolatini", "Lilac and pink glass lanterns with a heart bowl of chocolates", False, ""),
 ("fb:080", "regali-barattoli-vetro-rosa", "regali", "Barattoli e alzatine in vetro rosa su colonne pastello", "Pink glass jars and cake stands on pastel pedestals", False, ""),
 ("ig:DWBareogn8O_00", "regali-profumatori-pastello", "regali", "Profumatori per ambiente in vetro con tappi floreali nei toni pastello", "Glass home fragrance diffusers with flower caps in pastel tones", False, "2026-03-18"),
 ("fb:123", "regali-vasi-bianchi-tulipani", "regali", "Vasi bianchi dalla superficie intrecciata con tulipani rosa, bianchi e gialli", "White textured vases with pink, white and yellow tulips", False, ""),
]

ORDER = ["battesimo", "comunione", "matrimonio", "feste", "regali"]

os.makedirs(OUT, exist_ok=True)
for f in glob.glob(f"{OUT}/*.webp"):
    os.remove(f)
out, md = [], ["# Gallery sources", "",
               "One photo per event/set. `fb:` = Facebook page photos grid (logged-out, image key shown), `ig:` = Instagram post slide.", "",
               "| slug | collection | source | date |", "|---|---|---|---|"]
for src, slug, col, ai, ae, feat, date in SEL:
    kind, ref = src.split(":", 1)
    path = f"raw/fbfull/{int(ref):03d}.jpg" if kind == "fb" else f"raw/{ref}.jpg"
    im = Image.open(path).convert("RGB")
    big = im.copy(); big.thumbnail((1600, 1600), Image.LANCZOS)
    big.save(f"{OUT}/{slug}.webp", quality=82, method=6)
    th = im.copy(); th.thumbnail((640, 640), Image.LANCZOS)
    th.save(f"{OUT}/{slug}-640.webp", quality=80, method=6)
    out.append({"src": f"img/gallery/{slug}.webp", "thumb": f"img/gallery/{slug}-640.webp", "w": big.width, "h": big.height,
                "collection": col, "alt_it": ai, "alt_en": ae, "featured": feat, "date": date})
    where = (f"Facebook photos, {fbidx[str(int(ref))]}" if kind == "fb"
             else f"https://www.instagram.com/p/{ref.rsplit('_', 1)[0]}/ (slide {int(ref[-2:]) + 1})")
    md.append(f"| {slug} | {col} | {where} | {date or 'n/d'} |")
out.sort(key=lambda x: ORDER.index(x["collection"]))
json.dump(out, open("../src/data/gallery.json", "w"), ensure_ascii=False, indent=2)
open("photos.md", "w").write("\n".join(md) + "\n")
from collections import Counter
print(len(out), Counter(o["collection"] for o in out))

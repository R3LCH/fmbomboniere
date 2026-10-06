import json, datetime
from PIL import Image

media = json.load(open("raw/media.json"))
# (raw id, slug, collection, alt_it, alt_en, featured)
SEL = [
 ("DdgjYQdAhui_02", "matrimonio-davide-veronica-coppetta", "matrimonio", "Coppetta in vetro con confetti, fiocco champagne e bigliettino floreale sul segnaposto del matrimonio", "Glass bowl of sugared almonds with champagne bow and floral tag on a wedding place setting", True),
 ("DdgjYQdAhui_03", "matrimonio-davide-veronica-lecca-confetti", "matrimonio", "Spiedino di confetti avvolto in tulle con nastro avorio e bigliettino di ringraziamento", "Sugared almond skewer wrapped in tulle with ivory ribbon and thank-you tag", False),
 ("DdgjYQdAhui_07", "matrimonio-davide-veronica-tavola", "matrimonio", "Tavola nuziale apparecchiata in bianco con bomboniere a fiocco su ogni piatto", "White wedding table set with bow-tied favours on every plate", False),
 ("DbtPxU7Atsq_03", "battesimo-joseph-fiocco-azzurro", "battesimo", "Bomboniera battesimo con nastri azzurri e avorio e bigliettino con orsetto per Joseph", "Christening favour with light blue and ivory ribbons and teddy-bear tag for Joseph", True),
 ("DbtPxU7Atsq_01", "battesimo-joseph-nastri", "battesimo", "Fiocco in raso azzurro con scritta Il mio Battesimo e tag personalizzato", "Light blue satin bow printed Il mio Battesimo with personalised tag", False),
 ("DbtPxU7Atsq_02", "battesimo-joseph-scatoline", "battesimo", "Scatoline bianche con nastri azzurri e bigliettini con orsetto", "White favour boxes with light blue ribbons and teddy-bear tags", False),
 ("DbtPkOfAsA2_01", "laurea-sacchetto-rosso-quadrifoglio", "laurea", "Sacchetto rosso per laurea con nastro personalizzato e portachiavi quadrifoglio", "Red graduation pouch with printed ribbon and four-leaf-clover keyring", False),
 ("DbNdoNagmEn_03", "comunione-andrea-cilindri", "comunione", "Scatole cilindriche lilla con fiocchi verdi, fiori bianchi e tag della Prima Comunione di Andrea", "Lilac cylinder boxes with green bows, white flowers and First Communion tags for Andrea", True),
 ("DbNdoNagmEn_01", "comunione-andrea-fiocco-verde", "comunione", "Dettaglio del fiocco verde salvia e bigliettino La mia Comunione Andrea", "Close-up of sage green bow and La mia Comunione Andrea tag", False),
 ("DbNdoNagmEn_02", "comunione-andrea-allestimento", "comunione", "Allestimento all'aperto con scatola in plexiglass di confetti verdi e borse bianche", "Outdoor display with clear box of green sugared almonds and white gift bags", False),
 ("DbNdoNagmEn_04", "comunione-andrea-tavolo-bomboniere", "comunione", "Tavolo bomboniere con cilindri bianchi, calle e vasetti di fiori", "Favour table with white cylinders, calla lilies and small flower vases", False),
 ("Da_rmO-AuWa_04", "battesimo-alessia-confettata", "battesimo", "Confettata rosa e lilla con vasi di confetti e cartellini arcobaleno", "Pink and lilac sugared almond bar with jars and rainbow labels", False),
 ("Da_rmO-AuWa_07", "battesimo-alessia-torta-confetti", "battesimo", "Alzata con scritta Alessia e orsetti, confetti dorati e rosa sul tavolo del battesimo", "Stand with Alessia sign, teddy bears and gold and pink sugared almonds on the christening table", False),
 ("Da_rmO-AuWa_05", "battesimo-alessia-allestimento-mare", "battesimo", "Tavolo bomboniere rosa con palloncini e orsetti affacciato sul mare", "Pink favour table with balloons and teddy bears overlooking the sea", False),
 ("Da_rmO-AuWa_03", "battesimo-alessia-segnalibro", "battesimo", "Segnalibro arcobaleno personalizzato per il battesimo di Alessia", "Personalised rainbow bookmark for Alessia's christening", False),
 ("Da-twMGAp9-_01", "comunione-chanel-cappelliere-rosa", "comunione", "Cappelliere rosa in velluto con rose cipria e nome Chanel in oro", "Pink velvet hatboxes topped with blush roses and the name Chanel in gold", True),
 ("Da-twMGAp9-_02", "comunione-chanel-tavolo", "comunione", "Tavolo di cappelliere rosa con rose e tag della Comunione di Chanel", "Table of pink hatboxes with roses and Chanel Communion tags", False),
 ("Da709nIAu4l_01", "diciottesimo-pasquale-apribottiglie", "eventi", "Apribottiglie personalizzato 18 anni di Pasquale con scatola blu e fiocco petrolio", "Personalised 18th birthday bottle opener for Pasquale with blue box and teal bow", True),
 ("Da7fGpNAszv_02", "battesimo-azzurra-scatole-cuore", "battesimo", "Scatole con finestra a cuore e fiocchi fucsia per il battesimo di Azzurra", "Heart-window boxes with fuchsia bows for Azzurra's christening", True),
 ("Da7fGpNAszv_01", "battesimo-azzurra-tavolo", "battesimo", "Tavolo all'aperto con decine di scatoline a cuore e nastri rosa", "Outdoor table with dozens of heart boxes tied with pink ribbon", False),
 ("Da7fGpNAszv_03", "battesimo-azzurra-dettaglio", "battesimo", "Dettaglio delle scatole dorate con cuore traforato e tulle rosa", "Detail of gold boxes with cut-out hearts and pink tulle", False),
 ("DWBaxqQAl3z_00", "matrimonio-partecipazioni-2026", "matrimonio", "Collezione partecipazioni 2026 ad arco nei colori beige, rosa, verde e lilla", "2026 arched wedding invitation collection in beige, pink, green and lilac", False),
 ("DWBareogn8O_00", "regali-profumatori-pastello", "regali", "Profumatori per ambiente in vetro con tappi floreali nei toni pastello", "Glass home fragrance diffusers with flower caps in pastel tones", False),
]
out, md = [], ["# Gallery sources", "", "| slug | post | date | caption excerpt |", "|---|---|---|---|"]
for rid, slug, col, ai, ae, feat in SEL:
    code = rid.rsplit("_", 1)[0]
    p = media[code]
    date = datetime.datetime.utcfromtimestamp(p["taken_at"]).strftime("%Y-%m-%d")
    im = Image.open(f"raw/{rid}.jpg").convert("RGB")
    big = im.copy(); big.thumbnail((1600, 1600), Image.LANCZOS)
    big.save(f"../public/img/gallery/{slug}.webp", quality=82, method=6)
    th = im.copy(); th.thumbnail((640, 640), Image.LANCZOS)
    th.save(f"../public/img/gallery/{slug}-640.webp", quality=80, method=6)
    out.append({"src": f"img/gallery/{slug}.webp", "thumb": f"img/gallery/{slug}-640.webp", "w": big.width, "h": big.height,
                "collection": col, "alt_it": ai, "alt_en": ae, "featured": feat, "date": date})
    cap = (p["caption"] or "—").replace("\n", " ").replace("|", "/")[:90]
    md.append(f"| {slug} | https://www.instagram.com/p/{code}/ (slide {int(rid[-2:])+1}) | {date} | {cap} |")
out.sort(key=lambda x: x["date"], reverse=True)
json.dump(out, open("../src/data/gallery.json", "w"), ensure_ascii=False, indent=2)
open("photos.md", "w").write("\n".join(md) + "\n")
print(len(out))

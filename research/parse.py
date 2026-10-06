import json, re, sys, glob

posts = {}

def best(iv):
    c = (iv or {}).get("candidates") or []
    c = sorted(c, key=lambda x: x.get("width", 0) * x.get("height", 0), reverse=True)
    return c[0] if c else None

def walk(o):
    if isinstance(o, dict):
        g = o.get("if_not_gated_logged_out")
        if isinstance(g, dict):
            o = {**o, **g}
        if o.get("code") and ("carousel_media" in o or "image_versions2" in o) and o.get("taken_at"):
            code = o["code"]
            items = o.get("carousel_media") or [o]
            slides = []
            for it in items:
                b = best(it.get("image_versions2"))
                if b:
                    slides.append({"url": b["url"], "w": b.get("width") or it.get("original_width"), "h": b.get("height") or it.get("original_height"),
                                   "video": bool(it.get("video_versions")),
                                   "acc": it.get("accessibility_caption")})
            cap = (o.get("caption") or {}).get("text") if isinstance(o.get("caption"), dict) else None
            prev = posts.get(code)
            if not prev or len(slides) > len(prev["slides"]):
                posts[code] = {"code": code, "taken_at": o["taken_at"], "caption": cap,
                               "type": o.get("media_type"), "product": o.get("product_type"),
                               "slides": slides}
        for v in o.values():
            walk(v)
    elif isinstance(o, list):
        for v in o:
            walk(v)

for f in sys.argv[1:]:
    h = open(f).read()
    for m in re.finditer(r'<script type="application/json"[^>]*>(.*?)</script>', h, re.S):
        try:
            walk(json.loads(m.group(1)))
        except Exception:
            pass

try:
    old = json.load(open("raw/media.json"))
except Exception:
    old = {}
for k, v in posts.items():
    if k not in old or len(v["slides"]) >= len(old[k]["slides"]):
        old[k] = v
json.dump(old, open("raw/media.json", "w"), indent=1)
import datetime
for k, v in sorted(old.items(), key=lambda kv: -kv[1]["taken_at"]):
    print(k, datetime.date.fromtimestamp(v["taken_at"]), v["product"], len(v["slides"]), (v["caption"] or "")[:70].replace("\n", " "))
print(len(old))

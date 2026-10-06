import json, re, asyncio, sys
from playwright.async_api import async_playwright

seed = "DWBareogn8O DWBaxqQAl3z DdgjYQdAhui DbtPxU7Atsq DbtPkOfAsA2 DbNdoNagmEn Da_rmO-AuWa Da-twMGAp9- Da71Z4YAuOt Da709nIAu4l Da7fGpNAszv".split()
html = open("raw/profile.html").read()
codes = list(dict.fromkeys(seed + re.findall(r'/p/([A-Za-z0-9_-]+)/', html)))
out = {}

async def one(ctx, code):
    pg = await ctx.new_page()
    rec = {"code": code, "imgs": []}
    try:
        await pg.goto(f"https://www.instagram.com/p/{code}/", wait_until="domcontentloaded")
        await pg.wait_for_timeout(2500)
        rec["og_image"] = await pg.get_attribute('meta[property="og:image"]', "content")
        rec["og_desc"] = await pg.get_attribute('meta[property="og:description"]', "content")
        t = await pg.query_selector("time[datetime]")
        rec["date"] = await t.get_attribute("datetime") if t else None
        # walk carousel
        for _ in range(20):
            for im in await pg.query_selector_all("article img, main img"):
                s = await im.get_attribute("srcset") or ""
                src = (s.split(",")[-1].strip().split(" ")[0]) if s else await im.get_attribute("src")
                alt = await im.get_attribute("alt") or ""
                if src and "scontent" in src and "s150x150" not in src and src not in [i[0] for i in rec["imgs"]]:
                    rec["imgs"].append([src, alt])
            nb = await pg.query_selector('button[aria-label="Avanti"], button[aria-label="Next"]')
            if not nb:
                break
            await nb.click()
            await pg.wait_for_timeout(700)
        rec["links"] = list(dict.fromkeys(re.findall(r'/p/([A-Za-z0-9_-]{9,})/', await pg.content())))
    except Exception as e:
        rec["err"] = str(e)
    await pg.close()
    return rec

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        ctx = await b.new_context(viewport={"width": 1280, "height": 1400}, locale="it-IT")
        seen=set(); q=list(codes)
        while q and len(seen)<70:
            c=q.pop(0)
            if c in seen: continue
            seen.add(c)
            r = await one(ctx, c)
            q += [l for l in r.get("links",[]) if l not in seen]
            out[c] = r
            print(c, r.get("date"), len(r["imgs"]), (r.get("og_desc") or "")[:80], flush=True)
        await b.close()
    json.dump(out, open("raw/posts.json", "w"), indent=1)

asyncio.run(main())

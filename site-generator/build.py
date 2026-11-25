# -*- coding: utf-8 -*-
import json, os, sys, html
sys.path.insert(0, os.path.dirname(__file__))
from content import *
import re
from content2 import LANG_SHORT, LEGAL, PH, SV, _SELLER
_SELLER_EMAIL = _SELLER.get('email') or 'hello@example.com'

DOMAIN = os.environ.get("SITE_DOMAIN", "https://example.com")  # replace with your real domain, then rebuild
PREVIEW = os.environ.get("SITE_PREVIEW", "1") == "1"  # noindex + banner
FORM_PREVIEW = os.environ.get("SITE_FORM_PREVIEW", "0") == "1"  # form only simulates
OUT = os.path.join(os.path.dirname(__file__), "site")
E = html.escape
CHECK = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5L20 7"/></svg>'
PCOL = {"shift": "#FF7A6B", "apps": "#7C5CFF", "bot": "#22B07D", "web": "#4D6FF0"}
PORDER = ["shift", "apps", "bot", "web"]


def phx(v):
    return f'<span class="ph">{E(v)}</span>' if v.startswith('[') else E(v)


def tick(color):
    return f'<span class="check" style="background:{color}">{CHECK}</span>'


def page(lang):
    L = LANGS[lang]
    root = "" if lang == "en" else "../"
    mk = MARKETS[lang]
    dm = DEFAULT_MARKET[lang]

    # --- market options (all languages) ---
    opts = []
    for code, meta in MARKET_META.items():
        name = MARKETS[meta["lang"]][code]["name"]
        opts.append(f'<option value="{code}" data-lang="{meta["lang"]}">{E(name)}</option>')
    market_select = "".join(opts)

    CUR = ' aria-current="true"'
    langs_links = "".join(
        f'<a class="lang-link" href="{root}{LANG_PATH[l]}" hreflang="{l}" lang="{l}"{CUR if l == lang else ""}>{LANG_SHORT[l]}</a>'
        for l in LANGS)

    nav = "".join(f'<li><a class="nav-link" href="#{k}">{E(v)}</a></li>' for k, v in
                  [("industries", L["nav"]["industries"]), ("products", L["nav"]["products"]), ("demo", L["nav"]["demo"]),
                   ("roi", L["nav"]["roi"]), ("plans", L["nav"]["plans"]), ("process", L["nav"]["process"]), ("faq", L["nav"]["faq"])])

    # --- hero ---
    hp = L["hero_phone"]
    hero_tasks = ""
    for i, t in enumerate(hp["tasks"]):
        done = i < 2
        if done:
            hero_tasks += f'<div class="row-in ui-card" style="display:flex;gap:10px;align-items:center;padding:12px;animation-delay:{0.9+i*0.2:.1f}s"><span class="check" style="background:#22C08A">{CHECK}</span><span style="font-size:13px;color:#8A90A0;text-decoration:line-through">{E(t)}</span></div>'
        elif i == 2:
            hero_tasks += f'<div class="row-in" style="display:flex;gap:10px;align-items:center;padding:12px;border-radius:12px;background:#FFF1EE;border:1.5px solid #FF7A6B;animation-delay:{0.9+i*0.2:.1f}s"><span class="check" style="border:2px solid #FF7A6B"></span><span style="font-size:13px;font-weight:600">{E(t)}</span></div>'
        else:
            hero_tasks += f'<div class="row-in ui-card" style="display:flex;gap:10px;align-items:center;padding:12px;animation-delay:{0.9+i*0.2:.1f}s"><span class="check" style="border:2px solid #CDD1DB"></span><span style="font-size:13px">{E(t)}</span></div>'
    t0, t1, t2 = L["toasts"]
    ic = lambda bg, stroke, d: f'<span class="toast-ic" style="background:{bg}"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="{stroke}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{d}</svg></span>'
    hero = f'''
<section class="hero" style="position:relative;padding:70px 0 80px"><div class="wrap"><div class="g-hero">
<div>
<div class="rise glass badge-pill"><span class="live"></span><span data-m="tag">{E(mk[dm]["tag"])}</span></div>
<h1 class="disp h1 rise d1">{L["hero_h1"]}</h1>
<p class="lead muted rise d2" data-m="lead2">{E(mk[dm]["lead2"])}</p>
<p class="muted rise d2" style="font-size:17px;line-height:1.6;max-width:560px;margin:14px 0 0">{E(L["hero_lead"])}</p>
<div class="rise d3" style="display:flex;gap:12px;flex-wrap:wrap;margin-top:30px"><a class="btn btn-accent" href="#contact">{E(L["hero_cta1"])}</a><a class="btn btn-soft" href="#demo">{E(L["hero_cta2"])}</a></div>
<ul class="rise d4 checks">{"".join(f'<li>{tick("#22A877")}{E(c)}</li>' for c in L["checks"])}</ul>
</div>
<div class="rise hide-sm hero-devices d2" aria-hidden="true">
<div class="float-a" style="position:absolute;left:50%;margin-left:-143px;top:0"><div class="phone"><div class="phone-screen"><div class="island"></div>
<div style="padding:50px 20px 20px;background:#FFE5DF"><div style="font-size:12px;color:#8E3A30;font-weight:500">{E(hp["shift"])}</div><div style="font-size:27px;font-weight:600;margin-top:4px;letter-spacing:-.03em">{E(hp["time"])}</div>
<div style="height:5px;background:rgba(20,22,28,.08);border-radius:6px;margin-top:14px;overflow:hidden"><div class="prog" style="width:62%;height:100%;background:#FF7A6B;border-radius:6px"></div></div></div>
<div style="padding:14px;display:flex;flex-direction:column;gap:9px"><div style="font-size:11px;font-weight:600;color:#6B7080;letter-spacing:.08em;text-transform:uppercase">{E(hp["head"])}</div>{hero_tasks}
<div style="display:flex;gap:8px;margin-top:4px"><div style="flex:1;background:#14161C;color:#FFFFFF;border-radius:14px;padding:12px;font-size:12px;font-weight:600;text-align:center">{E(hp["chat"])}</div><div style="flex:1;background:#E5483D;color:#FFFFFF;border-radius:14px;padding:12px;font-size:12px;font-weight:700;text-align:center">{E(hp["sos"])}</div></div></div>
<div class="reflect"></div></div></div></div>
<div class="toast glass2 float-b" style="position:absolute;left:-10px;top:50px">{ic("#FFE9E6","#E5483D",'<path d="M7 7h11l-3-3"/><path d="M17 17H6l3 3"/>')}{E(t0)}</div>
<div class="toast glass2 float-a" style="position:absolute;right:-10px;top:250px;animation-delay:-3s">{ic("#E6ECFF","#2F55D4",'<path d="M4 4h16v12H5l-1 4z"/>')}{E(t1)}</div>
<div class="toast glass2 float-b" style="position:absolute;left:10px;bottom:30px;animation-delay:-5s">{ic("#DDF7EC","#0B7350",'<path d="M5 12l5 5L20 7"/>')}{E(t2)}</div>
</div></div></div></section>'''

    # --- market strip ---
    market = f'''
<section class="section" id="market" style="padding-top:0"><div class="wrap"><div class="glass reveal market-card">
<div class="split"><div><div class="kicker">{E(L["market_label"])}</div><h2 class="disp h2" style="font-size:44px">{L["market_title"]}</h2></div>
<p class="muted" style="font-size:16px;max-width:420px;margin:0">{E(L["market_sub"])}</p></div>
<div id="market-chips" class="chips" role="group" aria-label="{E(L["market_label"])}" style="margin-top:26px"></div></div></div></section>'''

    # --- industries ---
    chips, panels = [], []
    for i, (key, ind) in enumerate(L["industries"].items()):
        chips.append(f'<button type="button" class="chip" data-ind="{key}" aria-pressed="{"true" if i == 0 else "false"}">{E(ind["label"])}</button>')
        recs = "".join(f'<span class="rec"><span class="dot" style="background:{PCOL[r]}"></span>{E(L["products"][r]["name"])}</span>' for r in ind["recs"])
        pains = "".join(f'<li><span class="check" style="background:#FFE9E6"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#B42A20" stroke-width="3" stroke-linecap="round" aria-hidden="true"><path d="M7 7l10 10"/><path d="M17 7L7 17"/></svg></span><span style="font-size:17px">{E(p)}</span></li>' for p in ind["pains"])
        panels.append(f'''<div class="g-2 ind-panel" data-panel="{key}"{"" if i == 0 else " hidden"} style="margin-top:32px;gap:24px">
<div class="solid" style="border-radius:26px;padding:30px"><div style="font-size:14px;font-weight:600;color:#B42A20">{E(L["ind_typical"])} {E(ind["label"])}</div><ul class="list-check" style="margin-top:18px">{pains}</ul></div>
<div style="border-radius:26px;padding:30px;background:var(--accentSoft);border:1px solid var(--line)"><div style="font-size:14px;font-weight:600;color:var(--accent)">{E(L["ind_reco"])}</div><div class="chips" style="margin-top:16px">{recs}</div><p style="font-size:17px;line-height:1.55;margin:18px 0 0">{E(ind["why"])}</p><a class="btn btn-accent" href="#contact" data-ask="{E(ind["label"])}" style="margin-top:22px">{E(L["ind_ask"])}</a></div></div>''')
    industries = f'''
<section id="industries" class="section" style="padding-top:20px"><div class="wrap"><div class="glass reveal" style="border-radius:36px;padding:44px">
<div class="split"><div><div class="kicker">{E(L["ind_kicker"])}</div><h2 class="disp h2" style="font-size:48px">{E(L["ind_title"])}</h2></div><p class="muted" style="font-size:16px;max-width:360px;margin:0">{E(L["ind_sub"])}</p></div>
<div id="ind-chips" class="chips" role="group" aria-label="{E(L["ind_title"])}" style="margin-top:28px">{"".join(chips)}</div>
<div aria-live="polite">{"".join(panels)}</div></div></div></section>'''

    # --- products ---
    cards = ""
    for k in PORDER:
        p = L["products"][k]
        after = "".join(f'<li>{tick(PCOL[k])}<span style="font-size:15px">{E(a)}</span></li>' for a in p["after"])
        cards += f'''<article class="card glass reveal prod" data-prod="{k}"><div class="prod-head"><span class="svc-ic" style="background:{PCOL[k]}22"><span style="background:{PCOL[k]}"></span></span><div style="min-width:0"><h3 class="disp" style="font-size:22px;margin:0">{E(p["name"])}</h3><div class="muted" style="font-size:14px;margin-top:2px">{E(p["tag"])}</div></div><span class="sug" hidden>{E(L["suggested"])}</span></div>
<div class="lbl bad">{E(L["before"])}</div><p style="font-size:15px;line-height:1.55;margin:8px 0 0">{E(p["before"])}</p><div class="line-t" style="margin:16px 0"></div>
<div class="lbl good">{E(L["after"])}</div><ul class="list-check" style="margin-top:12px">{after}</ul></article>'''
    products = f'''
<section class="section" id="products"><div class="wrap"><div class="split reveal"><div><div class="kicker">{E(L["prod_kicker"])}</div><h2 class="disp h2" style="font-size:52px;max-width:760px">{L["prod_title"]}</h2></div><p class="muted" style="font-size:17px;line-height:1.6;max-width:360px;margin:0">{E(L["prod_sub"])}</p></div>
<div class="g-4 g-prod" style="margin-top:40px">{cards}</div></div></section>'''

    # --- demo ---
    dp = L["demo_phone"]
    dtasks = ""
    for i, t in enumerate(dp["tasks"]):
        dtasks += f'<button type="button" class="task" aria-pressed="{"true" if i < 2 else "false"}"><span class="check">{CHECK}</span>{E(t)}</button>'
    s0, s1, s2 = L["demo_stats"]
    demo = f'''
<section class="section" id="demo"><div class="wrap"><div class="g-2" style="align-items:center;gap:56px">
<div class="reveal"><div class="kicker">{E(L["demo_kicker"])}</div><h2 class="disp h2">{L["demo_title"]}</h2><p class="muted" style="font-size:18px;line-height:1.6;margin:18px 0 0">{E(L["demo_text"])}</p>
<div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-top:28px">
<div class="solid stat"><div class="disp" id="demo-done">2/5</div><div class="muted" style="font-size:13px">{E(s0)}</div></div>
<div class="solid stat"><div class="disp" id="demo-pct">40 %</div><div class="muted" style="font-size:13px">{E(s1)}</div></div>
<div class="solid stat"><div class="disp">0</div><div class="muted" style="font-size:13px">{E(s2)}</div></div></div>
<div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:24px"><button type="button" class="btn btn-soft" id="demo-reset">{E(L["demo_reset"])}</button><a class="btn btn-accent" href="#contact">{E(L["demo_cta"])}</a></div></div>
<div style="display:flex;justify-content:center" class="reveal"><div class="phone"><div class="phone-screen"><div class="island"></div>
<div style="padding:48px 18px 16px;background:#FFE5DF"><div style="font-size:12px;color:#8E3A30;font-weight:500">{E(dp["shift"])}</div><div style="font-size:24px;font-weight:600;margin-top:4px">{E(dp["hi"])}</div>
<div style="height:6px;background:rgba(20,22,28,.08);border-radius:6px;margin-top:12px;overflow:hidden"><div id="demo-bar" style="height:100%;width:40%;background:#FF7A6B;border-radius:6px;transition:width .6s cubic-bezier(.2,.7,.2,1)"></div></div></div>
<div style="padding:12px 14px;display:flex;flex-direction:column;gap:8px" aria-live="polite">
<div id="demo-all" class="pop" style="padding:12px;border-radius:14px;background:#DDF7EC;color:#0B7350;font-size:13px;font-weight:600;text-align:center" hidden>{E(dp["all"])}</div>{dtasks}
<div id="demo-sos-msg" style="padding:12px;border-radius:14px;background:#E5483D;color:#FFFFFF;font-size:13px;font-weight:600;text-align:center" hidden>{E(dp["sosmsg"])}</div></div>
<div style="position:absolute;left:14px;right:14px;bottom:18px;display:flex;gap:8px"><span style="flex:1;background:#14161C;color:#FFFFFF;border-radius:14px;padding:13px;font-size:12px;font-weight:600;text-align:center">{E(dp["chat"])}</span><button type="button" id="demo-sos" style="flex:1;border:0;background:#E5483D;color:#FFFFFF;border-radius:14px;padding:13px;font-size:12px;font-weight:700;min-height:44px">{E(dp["sos"])}</button></div>
<div class="reflect"></div></div></div></div></div></div></section>'''

    # --- calculator ---
    r = L["roi"]
    roi = f'''
<section class="section" id="roi"><div class="wrap"><div class="reveal"><div class="kicker">{E(L["roi_kicker"])}</div><h2 class="disp h2" style="max-width:760px">{L["roi_title"]}</h2></div>
<div class="g-2 glass reveal" style="margin-top:36px;border-radius:34px;padding:40px;gap:44px">
<div style="display:flex;flex-direction:column;gap:30px">
<div><div class="calc-row"><label for="r-hours">{E(r["hours"])}</label><output class="disp" id="o-hours" for="r-hours">12</output></div><input id="r-hours" class="range" type="range" min="2" max="60" step="1" value="12"><div class="muted" style="font-size:13px;margin-top:8px">{E(r["hint"])}</div></div>
<div><div class="calc-row"><label for="r-rate">{E(r["rate"])}</label><output class="disp" id="o-rate" for="r-rate"></output></div><input id="r-rate" class="range" type="range" min="10" max="100" step="1" value="30"></div>
<div><div class="calc-row"><label for="r-share">{E(r["share"])}</label><output class="disp" id="o-share" for="r-share">35 %</output></div><input id="r-share" class="range" type="range" min="10" max="70" step="5" value="35"></div></div>
<div class="calc-result" aria-live="polite"><div><div style="font-size:14px;font-weight:600;color:var(--accent)">{E(r["result"])}</div><div class="disp" id="res-eur" style="font-size:60px;line-height:1;margin-top:14px">0</div>
<div style="font-size:19px;margin-top:12px">{E(r["equals"])} <strong id="res-hours">0</strong> {E(r["hrs"])}</div><div class="muted" style="font-size:15px;margin-top:4px">{E(r["or_"])} <span id="res-days">0</span> {E(r["days"])}</div></div>
<div><p class="muted" style="font-size:13px;line-height:1.5;margin:0">{E(r["note"])}</p><a class="btn btn-accent btn-block" href="#contact" style="margin-top:16px">{E(r["cta"])}</a></div></div></div></div></section>'''

    # --- plans ---
    tiers = ""
    for i, t in enumerate(L["tiers"]):
        feats = "".join(f'<li>{tick("#4D6FF0")}<span style="font-size:15px">{E(f)}</span></li>' for f in t["feats"])
        badge = f'<span class="tier-badge">{E(t["badge"])}</span>' if t["badge"] else ""
        feat = " tier-feat" if i == 1 else ""
        tiers += f'''<article class="card glass reveal tier{feat}">{badge}<h3 class="disp" style="font-size:25px;margin:0">{E(t["name"])}</h3><p class="muted" style="font-size:15px;line-height:1.5;margin:8px 0 0">{E(t["desc"])}</p>
<div class="disp" style="font-size:22px;margin-top:20px">{E(L["price_line"])}</div><ul class="list-check" style="margin:22px 0">{feats}</ul><a class="btn {"btn-accent" if i == 1 else "btn-soft"} btn-block" href="#contact" data-plan="{E(t["name"])}" style="margin-top:auto">{E(L["price_cta"])}</a></article>'''
    plans = f'''
<section class="section" id="plans"><div class="wrap"><div style="text-align:center" class="reveal"><div class="kicker">{E(L["plans_kicker"])}</div><h2 class="disp h2">{L["plans_title"]}</h2>
<div class="gift"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8s1-5 4.5-5a2.5 2.5 0 0 1 0 5"/></svg><span>{E(L["gift"])}</span></div></div>
<div class="g-3" style="margin-top:36px;align-items:stretch">{tiers}</div></div></section>'''

    # --- process and payment ---
    steps = "".join(f'<li class="step"><span class="step-n disp">{i+1}</span><div><h3 class="disp" style="font-size:20px;margin:0">{E(t)}</h3><p class="muted" style="font-size:15px;line-height:1.55;margin:6px 0 0">{E(d)}</p></div></li>' for i, (t, d) in enumerate(L["steps"]))
    paypts = "".join(f'<li>{tick("#22A877")}<span style="font-size:16px">{E(x)}</span></li>' for x in L["pay_points"])
    process = f'''
<section class="section" id="process"><div class="wrap"><div class="split reveal"><div><div class="kicker">{E(L["proc_kicker"])}</div><h2 class="disp h2" style="max-width:760px">{L["proc_title"]}</h2></div><p class="muted" style="font-size:17px;line-height:1.6;max-width:360px;margin:0">{E(L["proc_sub"])}</p></div>
<div class="g-2 reveal" style="margin-top:36px;gap:28px;align-items:start"><ol class="steps glass">{steps}</ol>
<div class="solid paybox"><h3 class="disp" style="font-size:24px;margin:0">{E(L["pay_title"])}</h3><ul class="list-check" style="margin-top:20px">{paypts}</ul>
<div class="paynote"><div class="lbl" style="color:var(--accent)">{E(L["market_label"])}</div><p id="pay-market" data-m="pay" style="font-size:16px;line-height:1.55;margin:8px 0 0">{E(mk[dm]["pay"])}</p></div></div></div></div></section>'''

    # --- faq ---
    faq = "".join(f'<details><summary>{E(q)}<span class="faq-ic" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg></span></summary><p>{E(a)}</p></details>' for q, a in L["faq"])
    faq_html = f'''
<section class="section" id="faq"><div class="wrap" style="max-width:860px"><h2 class="disp h2 reveal" style="text-align:center">{E(L["faq_title"])}</h2><div class="faq reveal" style="margin-top:30px;border-bottom:1px solid var(--line)">{faq}</div></div></section>'''

    # --- contact ---
    c = L["ct"]
    sizes = "".join(f'<option>{E(s)}</option>' for s in c["sizes"])
    contact = f'''
<section class="section" id="contact"><div class="wrap"><div class="g-2 glass reveal" style="border-radius:34px;padding:40px;gap:44px;align-items:start">
<div><div class="kicker">{E(L["ct_kicker"])}</div><h2 class="disp h2" style="font-size:44px">{E(L["ct_title"])}</h2>
<div class="direct"><div class="muted" style="font-size:14px;font-weight:600">{E(c["direct"])}</div><div id="direct-box" style="margin-top:12px"></div></div></div>
<div><form id="lead-form" novalidate><div class="hp" aria-hidden="true"><label for="f-web">Website</label><input id="f-web" name="website" tabindex="-1" autocomplete="off"></div>
<div style="display:flex;flex-direction:column;gap:16px">
<div class="field"><label for="f-name">{E(c["name"])}</label><input id="f-name" name="name" autocomplete="name"></div>
<div class="field"><label for="f-contact">{E(c["contact"])}</label><input id="f-contact" name="contact" autocomplete="email"></div>
<div class="field"><label for="f-size">{E(c["size"])}</label><select id="f-size" name="size" class="sel sel-block">{sizes}</select></div>
<div class="field"><label for="f-msg">{E(c["msg"])}</label><textarea id="f-msg" name="message" rows="3"></textarea></div>
<label class="consent" for="f-consent"><input id="f-consent" type="checkbox"><span>{E(c["consent"])}</span></label>
<p class="err" id="f-error" role="alert" hidden></p>
<button type="submit" class="btn btn-accent btn-block" id="f-send">{E(c["send"])}</button></div></form>
<div id="f-sent" hidden class="pop sent"><div class="disp" style="font-size:28px">{E(c["sent_t"])}</div><p class="muted" style="font-size:17px;margin:10px 0 0">{E(c["sent_p"])} <span id="f-sent-note"></span></p></div></div></div></div></section>'''

    LP = root + LANG_PATH[lang] if LANG_PATH[lang] else root
    # --- footer ---
    footer = f'''
<footer class="wrap"><div class="footer-grid"><div><a class="logo" href="#top" style="margin-left:-2px"><span class="logo-mark" aria-hidden="true"><span></span><span></span></span><span class="disp logo-text">{BRAND}</span></a><p class="muted" style="margin:10px 0 0;max-width:280px">{E(L["foot_about"])}</p></div>
<div><strong>{E(L["foot_links"])}</strong><ul>{"".join(f'<li><a href="#{k}">{E(v)}</a></li>' for k, v in L["nav"].items())}</ul></div>
<div><strong>{LANG_NAME[lang]}</strong><ul>{"".join(f'<li><a href="{root}{LANG_PATH[l]}" hreflang="{l}">{LANG_NAME[l]}</a></li>' for l in LANGS)}</ul></div>
<div class="muted" style="font-size:13px;line-height:1.6"><a href="{LP}privacy/">{E(L["legal"]["privacy"])}</a> · <a href="{LP}terms/">{E(L["legal"]["terms"])}</a> · <a href="{LP}imprint/">{E(L["legal"]["imprint"])}</a><br>{phx(SV[lang]["name"])}<br>{E(L["foot_note"])}<br>© <span class="year"></span> {BRAND}</div></div></footer>'''

    # --- head / SEO ---
    path = LANG_PATH[lang]
    alt = "".join(f'<link rel="alternate" hreflang="{l}" href="{DOMAIN}/{LANG_PATH[l]}">' for l in LANGS) + f'<link rel="alternate" hreflang="x-default" href="{DOMAIN}/">'
    ld = json.dumps({"@context": "https://schema.org", "@type": "Organization", "name": BRAND, "url": f"{DOMAIN}/{path}", "description": L["desc"]}, ensure_ascii=False)
    robots = '<meta name="robots" content="noindex, nofollow">' if PREVIEW else '<meta name="robots" content="index, follow">'
    boot = {
        "lang": lang, "root": root, "defaultMarket": dm, "langShort": LANG_SHORT,
        "paths": {l: LANG_PATH[l] for l in LANGS},
        "meta": MARKET_META,
        "markets": {code: {**MARKETS[MARKET_META[code]["lang"]][code], "label": MARKETS[MARKET_META[code]["lang"]][code]["name"]} for code in MARKET_META},
        "roi": {"unit_h": r["unit_h"]},
        "ct": {k: c[k] for k in ["err", "err_name", "err_contact", "err_consent", "fail", "sending", "send", "sent_preview", "copy", "copied", "mail_note", "name", "contact", "size"]},
        "indOrderTpl": list(L["industries"].keys()),
    }
    preview = f'<div role="note" class="previewbar">{E(L["preview"])}</div>' if PREVIEW else ""
    doc = f'''<!doctype html>
<html lang="{lang}" data-theme="dark" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
{robots}
<title>{E(L["title"])}</title>
<meta name="description" content="{E(L["desc"])}">
<link rel="canonical" href="{DOMAIN}/{path}">
{alt}
<meta property="og:type" content="website"><meta property="og:title" content="{E(L["title"])}"><meta property="og:description" content="{E(L["desc"])}"><meta property="og:url" content="{DOMAIN}/{path}"><meta property="og:locale" content="{LANG_LOCALE_OG[lang]}">
<meta name="theme-color" content="#0D0E12">
<link rel="icon" href="{root}assets/img/favicon.svg" type="image/svg+xml">
<link rel="preload" href="{root}assets/fonts/InterDisplay-600.woff" as="font" type="font/woff" crossorigin>
<link rel="stylesheet" href="{root}assets/css/style.css">
<link rel="stylesheet" href="{root}assets/css/extra.css">
<script type="application/ld+json">{ld}</script>
<script>document.documentElement.classList.remove('no-js');document.documentElement.classList.add('js')</script>
</head>
<body id="top">
<a class="skip" href="#main">{E(L["skip"])}</a>
{preview}
<div class="bg-blobs" aria-hidden="true">
<div class="blob drift" style="width:620px;height:620px;left:-200px;top:-120px;background:#FF8A6E"></div>
<div class="blob drift" style="width:520px;height:520px;right:-160px;top:120px;background:#3A3F52;animation-delay:-5s"></div>
<div class="blob drift" style="width:480px;height:480px;left:30%;top:1800px;background:#FF8A6E;animation-delay:-9s"></div>
<div class="blob drift" style="width:520px;height:520px;right:-100px;top:3600px;background:#3A3F52;animation-delay:-3s"></div></div>
<div class="nav-wrap"><header class="navbar glass2">
<a class="logo" href="#top" aria-label="{BRAND}"><span class="logo-mark" aria-hidden="true"><span></span><span></span></span><span class="disp logo-text">{BRAND}</span></a>
<button type="button" class="nav-burger" id="nav-burger" aria-expanded="false" aria-controls="nav-menu-panel" aria-label="{E(L["nav"].get("menu","Menu"))}"><span></span><span></span><span></span></button>
<nav aria-label="Main" class="menu-panel" id="nav-menu-panel">
<ul class="menu">{nav}</ul>
<div class="nav-actions-panel">
<label class="sr-only" for="market-select">{E(L["market_label"])}</label><select id="market-select" class="sel">{market_select}</select>
<div class="langs" role="group" aria-label="Language">{langs_links}</div>
<a class="btn btn-ink btn-sm nav-cta" href="#contact">{E(L["nav_cta"])}</a>
</div></nav></header></div>
<main id="main">{hero}{market}{industries}{products}{demo}{roi}{plans}{process}{faq_html}{contact}</main>
{footer}
<script>window.SHIFTLY={json.dumps(boot, ensure_ascii=False)};</script>
<script src="{root}assets/js/config.js"></script>
<script src="{root}assets/js/main.js"></script>
</body></html>'''
    d = os.path.join(OUT, path)
    os.makedirs(d, exist_ok=True)
    with open(os.path.join(d, "index.html"), "w", encoding="utf-8") as f:
        f.write(doc)


def legal_page(lang, kind):
    L = LANGS[lang]
    root = "../" if lang == "en" else "../../"
    base = LANG_PATH[lang]
    title, sections = LEGAL[lang][kind]
    vals = SV[lang]
    fill = lambda t: re.sub(r"\{(\w+)\}", lambda m: phx(vals[m.group(1)]) if m.group(1) in vals else m.group(0), E(t))
    body = "".join(f'<h2 class="disp">{E(h)}</h2><p>{fill(t)}</p>' for h, t in sections)
    others = " · ".join(f'<a href="../{k}/">{E(L["legal"][k])}</a>' for k in ("privacy", "terms", "imprint") if k != kind)
    doc = f'''<!doctype html>
<html lang="{lang}" data-theme="dark" class="no-js"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, follow"><title>{E(title)} – {BRAND}</title>
<link rel="icon" href="{root}assets/img/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="{root}assets/css/style.css"><link rel="stylesheet" href="{root}assets/css/extra.css">
<script>document.documentElement.classList.remove('no-js');document.documentElement.classList.add('js')</script></head>
<body><div class="wrap" style="padding-top:40px;padding-bottom:80px"><a class="logo" href="{root}{base}"><span class="logo-mark" aria-hidden="true"><span></span><span></span></span><span class="disp logo-text">{BRAND}</span></a>
<div class="legal" style="margin-top:30px"><h1 class="disp h2">{E(title)}</h1>{('<p class="note-ph">' + E(LEGAL[lang]["note"]) + '</p>') if kind != "imprint" else ""}{body}
<p style="margin-top:40px"><a href="{root}{base}">← {BRAND}</a> · {others}</p></div></div></body></html>'''
    d = os.path.join(OUT, base, kind)
    os.makedirs(d, exist_ok=True)
    with open(os.path.join(d, "index.html"), "w", encoding="utf-8") as f:
        f.write(doc)


for l in LANGS:
    page(l)
    legal_page(l, "privacy")
    legal_page(l, "terms")
    legal_page(l, "imprint")

with open(os.path.join(OUT, "sitemap.xml"), "w", encoding="utf-8") as f:
    urls = "".join(f'<url><loc>{DOMAIN}/{LANG_PATH[l]}</loc></url>' for l in LANGS)
    f.write(f'<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">{urls}</urlset>')
with open(os.path.join(OUT, "robots.txt"), "w") as f:
    f.write(("User-agent: *\nDisallow: /\n" if PREVIEW else "User-agent: *\nAllow: /\n") + f"Sitemap: {DOMAIN}/sitemap.xml\n")
with open(os.path.join(OUT, "assets/img/favicon.svg"), "w") as f:
    f.write('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect x="2" y="2" width="20" height="20" rx="7" fill="#5B7CFF"/><circle cx="21" cy="21" r="10" fill="#FF9A7E" fill-opacity=".9"/></svg>')
with open(os.path.join(OUT, "assets/js/config.js"), "w", encoding="utf-8") as f:
    f.write(f'''/* SETTINGS: edit these before launch */
window.SHIFTLY_CONFIG = {{
  preview: {"true" if FORM_PREVIEW else "false"},          // true: the form only simulates sending
  formEndpoint: "",       // e.g. a Formspree URL; leave empty to use the direct channels only
  email: "{_SELLER_EMAIL}",
  telegram: "your_telegram_handle",   // without @
  whatsapp: "10000000000"             // international format, digits only
}};
''')
print("built", OUT, "DOMAIN=", DOMAIN, "PREVIEW=", PREVIEW)

/* Shiftly: interactions, country adaptation. No frameworks, no tracking. */
(function () {
  'use strict';
  var S = window.SHIFTLY || {};
  var CFG = window.SHIFTLY_CONFIG || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };
  var reduceMotion = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* theme */
  var themeBtn = $('#theme-toggle');
  if (themeBtn) themeBtn.addEventListener('click', function () {
    var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next); store.set('sh-theme', next);
  });

  /* mobile nav: burger opens the menu panel; closes on link click or outside tap */
  var burger = $('#nav-burger'), panel = $('#nav-menu-panel');
  if (burger && panel) {
    var closeMenu = function () { burger.setAttribute('aria-expanded', 'false'); panel.classList.remove('is-open'); };
    burger.addEventListener('click', function () {
      var open = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', open ? 'false' : 'true');
      panel.classList.toggle('is-open', !open);
    });
    $$('a,button', panel).forEach(function (el) { el.addEventListener('click', function () { if (window.innerWidth <= 860) closeMenu(); }); });
    document.addEventListener('click', function (e) { if (!panel.contains(e.target) && !burger.contains(e.target)) closeMenu(); });
    window.addEventListener('resize', function () { if (window.innerWidth > 860) closeMenu(); });
  }

  /* reveal on scroll (content stays visible if observer is missing) */
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { threshold: 0.08 });
    $$('.reveal').forEach(function (el) { io.observe(el); });
  } else { $$('.reveal').forEach(function (el) { el.classList.add('is-in'); }); }

  /* ---------- market ---------- */
  var current = S.defaultMarket;
  var fmtMoney = function (n, code) {
    var m = S.meta[code];
    try { return new Intl.NumberFormat(m.locale, { style: 'currency', currency: m.cur, maximumFractionDigits: 0 }).format(n); }
    catch (e) { return Math.round(n) + ' ' + m.cur; }
  };
  var fmtNum = function (n, code) {
    try { return new Intl.NumberFormat(S.meta[code].locale, { maximumFractionDigits: 0 }).format(n); } catch (e) { return String(Math.round(n)); }
  };

  var chipsBox = $('#market-chips');
  var codesHere = Object.keys(S.meta).filter(function (c) { return S.meta[c].lang === S.lang; });
  var allCodes = Object.keys(S.meta);
  function buildMarketChips() {
    chipsBox.innerHTML = '';
    allCodes.forEach(function (code) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'chip mchip'; b.setAttribute('data-code', code);
      b.setAttribute('aria-pressed', code === current ? 'true' : 'false');
      b.innerHTML = '<span></span><small></small>';
      b.firstChild.textContent = S.markets[code].label;
      b.lastChild.textContent = (S.langShort[S.meta[code].lang] || S.meta[code].lang.toUpperCase()) + ' · ' + S.meta[code].cur;
      b.addEventListener('click', function () { chooseMarket(code); });
      chipsBox.appendChild(b);
    });
  }

  function chooseMarket(code) {
    var meta = S.meta[code];
    if (meta.lang !== S.lang) {
      store.set('sh-market', code);
      location.href = S.root + S.paths[meta.lang] + '?m=' + code;
      return;
    }
    current = code; store.set('sh-market', code);
    applyMarket();
  }

  var channelBox = $('#direct-box');
  function copyText(t, btn) {
    var done = function () { var o = btn.textContent; btn.textContent = S.ct.copied; setTimeout(function () { btn.textContent = o; }, 1500); };
    try { navigator.clipboard.writeText(t).then(done, function () {}); } catch (e) {}
  }
  function renderChannel() {
    var chan = S.meta[current].chan, label, href, shown;
    if (chan === 'tg') { shown = '@' + (CFG.telegram || ''); href = 'https://t.me/' + (CFG.telegram || ''); label = 'Telegram'; }
    else if (chan === 'wa') { shown = '+' + (CFG.whatsapp || ''); href = 'https://wa.me/' + (CFG.whatsapp || ''); label = 'WhatsApp'; }
    else { shown = CFG.email || ''; href = 'mailto:' + (CFG.email || ''); label = 'Email'; }
    channelBox.innerHTML = '';
    var line = document.createElement('div'); line.className = 'dline';
    var a = document.createElement('a'); a.className = 'btn btn-ink'; a.href = href; a.target = '_blank'; a.rel = 'noopener'; a.textContent = label;
    var code = document.createElement('code'); code.textContent = shown;
    var cp = document.createElement('button'); cp.type = 'button'; cp.className = 'copy'; cp.textContent = S.ct.copy;
    cp.addEventListener('click', function () { copyText(shown, cp); });
    line.appendChild(a); line.appendChild(code); line.appendChild(cp); channelBox.appendChild(line);
  }

  /* calculator state depends on market */
  var rHours = $('#r-hours'), rRate = $('#r-rate'), rShare = $('#r-share');
  function setupRate() {
    var base = S.meta[current].rate;
    var step = Math.max(1, Math.round(base / 40));
    rRate.min = Math.max(step, Math.round(base * 0.3 / step) * step);
    rRate.max = Math.round(base * 3 / step) * step;
    rRate.step = step; rRate.value = Math.round(base / step) * step;
  }
  function calc() {
    var h = +rHours.value, r = +rRate.value, s = +rShare.value;
    $('#o-hours').textContent = h + ' ' + S.roi.unit_h;
    $('#o-rate').textContent = fmtMoney(r, current);
    $('#o-share').textContent = s + ' %';
    var saved = h * 46 * s / 100;
    $('#res-eur').textContent = fmtMoney(saved * r, current);
    $('#res-hours').textContent = fmtNum(saved, current);
    $('#res-days').textContent = fmtNum(saved / 8, current);
  }

  function applyMarket() {
    var m = S.markets[current];
    $$('[data-m="tag"]').forEach(function (e) { e.textContent = m.tag; });
    $$('[data-m="lead2"]').forEach(function (e) { e.textContent = m.lead2; });
    $$('[data-m="pay"]').forEach(function (e) { e.textContent = m.pay; });
    $$('#market-chips .chip').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-code') === current ? 'true' : 'false'); });
    var sel = $('#market-select'); if (sel) sel.value = current;
    /* suggested products */
    $$('.prod').forEach(function (p) {
      var on = m.lead.indexOf(p.getAttribute('data-prod')) > -1;
      p.classList.toggle('is-suggested', on);
      var sug = $('.sug', p); if (sug) sug.hidden = !on;
    });
    /* industry order */
    var box = $('#ind-chips');
    m.order.forEach(function (k) { var b = $('[data-ind="' + k + '"]', box); if (b) box.appendChild(b); });
    var first = $('[data-ind="' + m.order[0] + '"]', box); if (first) first.click();
    setupRate(); calc(); renderChannel();
    document.documentElement.setAttribute('data-market', current);
  }

  /* ---------- industry chips ---------- */
  $$('#ind-chips .chip').forEach(function (b) {
    b.addEventListener('click', function () {
      $$('#ind-chips .chip').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      $$('.ind-panel').forEach(function (p) {
        var show = p.getAttribute('data-panel') === b.getAttribute('data-ind');
        p.hidden = !show;
        if (show) { p.classList.remove('screen-in'); void p.offsetWidth; p.classList.add('screen-in'); }
      });
    });
  });
  $$('[data-ask]').forEach(function (a) {
    a.addEventListener('click', function () {
      var t = $('#f-msg'); if (t && !t.value) t.value = a.getAttribute('data-ask');
    });
  });
  $$('[data-plan]').forEach(function (a) {
    a.addEventListener('click', function () {
      var t = $('#f-msg'); if (t && !t.value) t.value = a.getAttribute('data-plan');
    });
  });

  /* ---------- demo ---------- */
  var tasks = $$('.task');
  var updateDemo = function () {
    var done = tasks.filter(function (t) { return t.getAttribute('aria-pressed') === 'true'; }).length;
    var pct = Math.round(done / tasks.length * 100);
    $('#demo-done').textContent = done + '/' + tasks.length;
    $('#demo-pct').textContent = pct + ' %';
    $('#demo-bar').style.width = pct + '%';
    $('#demo-all').hidden = done !== tasks.length;
  };
  tasks.forEach(function (t) {
    t.addEventListener('click', function () { t.setAttribute('aria-pressed', t.getAttribute('aria-pressed') === 'true' ? 'false' : 'true'); updateDemo(); });
  });
  var sosT;
  $('#demo-sos').addEventListener('click', function () {
    var s = $('#demo-sos-msg'); s.hidden = false; s.classList.remove('pop'); void s.offsetWidth; s.classList.add('pop');
    clearTimeout(sosT); sosT = setTimeout(function () { s.hidden = true; }, 2600);
  });
  $('#demo-reset').addEventListener('click', function () { tasks.forEach(function (t) { t.setAttribute('aria-pressed', 'false'); }); updateDemo(); });
  updateDemo();

  /* ---------- calculator events ---------- */
  [rHours, rRate, rShare].forEach(function (el) { el.addEventListener('input', calc); });

  /* ---------- lead form ---------- */
  var form = $('#lead-form');
  var showSent = function (preview) {
    form.hidden = true; $('#f-sent').hidden = false;
    $('#f-sent-note').textContent = preview ? S.ct.sent_preview : '';
  };
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var err = $('#f-error'); err.hidden = true;
    var name = $('#f-name'), contact = $('#f-contact'), consent = $('#f-consent'), bad = [];
    name.setAttribute('aria-invalid', name.value.trim() ? 'false' : 'true'); if (!name.value.trim()) bad.push(S.ct.err_name);
    contact.setAttribute('aria-invalid', contact.value.trim().length > 4 ? 'false' : 'true'); if (contact.value.trim().length <= 4) bad.push(S.ct.err_contact);
    if (!consent.checked) bad.push(S.ct.err_consent);
    if (bad.length) { err.textContent = S.ct.err + ' ' + bad.join(', ') + '.'; err.hidden = false; return; }
    if ($('#f-web').value) return; /* honeypot */
    var payload = { name: name.value.trim(), contact: contact.value.trim(), size: $('#f-size').value, message: $('#f-msg').value.trim(), market: current, lang: S.lang };
    if (CFG.preview) { showSent(true); return; }
    if (!CFG.formEndpoint) {
      /* no form service: hand the request over to the visitor's email app */
      var body = [S.ct.name + ': ' + payload.name, S.ct.contact + ': ' + payload.contact, S.ct.size + ': ' + payload.size, payload.message].join('\n');
      var mail = 'mailto:' + CFG.email + '?subject=' + encodeURIComponent('FreiForms: ' + payload.name) + '&body=' + encodeURIComponent(body);
      showSent(false);
      var n = $('#f-sent-note'); n.textContent = S.ct.mail_note + ' ' + CFG.email;
      location.href = mail;
      return;
    }
    var btn = $('#f-send'); btn.disabled = true; btn.textContent = S.ct.sending;
    fetch(CFG.formEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(payload) })
      .then(function (r) { if (!r.ok) throw new Error(r.status); showSent(false); })
      .catch(function () { err.textContent = S.ct.fail; err.hidden = false; btn.disabled = false; btn.textContent = S.ct.send; });
  });

  /* market select in nav */
  var msel = $('#market-select');
  if (msel) msel.addEventListener('change', function () { chooseMarket(msel.value); });

  /* year */
  $$('.year').forEach(function (y) { y.textContent = new Date().getFullYear(); });

  /* start: ?m=XX, then remembered market of this language, then default */
  var q = (location.search.match(/[?&]m=([A-Z]{2})/) || [])[1];
  var saved = store.get('sh-market');
  if (q && S.meta[q] && S.meta[q].lang === S.lang) current = q;
  else if (saved && S.meta[saved] && S.meta[saved].lang === S.lang) current = saved;
  buildMarketChips();
  applyMarket();
})();

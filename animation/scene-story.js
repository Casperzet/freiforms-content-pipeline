import { THREE, RoundedBoxGeometry, proStage, proPhone, dust, rrect, F } from './pro.js';
import { UI, STORY } from './story-content.js';

/* v3 stories in "Quiet Premium": home (hook, hook2) -> phone flips on the bridge -> work (pain) -> plan (turn) -> end card (cta).
   Everything is driven by window.TIMING (timing/timing-<lang>-<reel>.json). */

const C = { bg: '#0d0e12', panel: '#17181e', panel2: '#1f2129', text: '#f2efe9', mute: '#8d8f99', coral: '#ff8a6e', blue: '#7aa2ff', green: '#4fd1a1', violet: '#a98bff', line: 'rgba(255,255,255,.07)' };
const PAL = [C.coral, C.blue, C.green, C.violet];

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const ease = x => { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
const easeOut = x => 1 - Math.pow(1 - clamp(x), 3);
const lerp = (a, b, k) => a + (b - a) * k;

/* ---------------- phone screens ---------------- */
function statusBar(c, W, time) {
  c.fillStyle = C.text; c.font = F(600, 30); c.textAlign = 'left'; c.fillText(time, 54, 66);
  c.textAlign = 'right'; c.fillText('100%', W - 54, 66); c.textAlign = 'left';
}
function wrap(c, text, maxW) {
  const words = text.split(' '), lines = []; let cur = '';
  for (const w of words) { const t = cur ? cur + ' ' + w : w; if (c.measureText(t).width > maxW && cur) { lines.push(cur); cur = w; } else cur = t; }
  if (cur) lines.push(cur); return lines;
}
function homeScreen(c, st, W, H, h, ui) {
  c.fillStyle = C.bg; c.fillRect(0, 0, W, H);
  statusBar(c, W, h.time);
  c.fillStyle = C.panel; c.fillRect(0, 96, W, 140);
  [0, 1, 2].forEach(i => { c.fillStyle = PAL[i]; c.beginPath(); c.arc(70 + i * 34, 166, 28, 0, 7); c.fill(); c.strokeStyle = C.panel; c.lineWidth = 5; c.stroke(); });
  c.fillStyle = C.text; c.font = F(700, 36); c.fillText(h.title, 190, 176);
  let y = 290;
  h.m.forEach(([name, text], i) => {
    const k = clamp((st.msgs ?? 3) - i); if (k <= 0) return;
    c.globalAlpha = k; c.font = F(500, 29);
    const lines = wrap(c, text, W - 200); const bh = 64 + lines.length * 38;
    const mine = i === 1; const x = mine ? W - 40 - 520 : 40;
    c.fillStyle = mine ? '#2a2420' : C.panel2; rrect(c, x, y, 520, bh, 30); c.fill();
    c.fillStyle = PAL[i]; c.font = F(600, 22); c.fillText(name, x + 30, y + 40);
    c.fillStyle = C.text; c.font = F(500, 29); lines.forEach((ln, j) => c.fillText(ln, x + 30, y + 80 + j * 38));
    y += bh + 22; c.globalAlpha = 1;
  });
  if ((st.pill ?? 0) > 0) {
    c.globalAlpha = st.pill; c.font = F(700, 25); const pw = c.measureText(h.pill).width + 64;
    c.fillStyle = 'rgba(255,138,110,.16)'; rrect(c, W / 2 - pw / 2, y + 14, pw, 56, 28); c.fill();
    c.fillStyle = C.coral; c.textAlign = 'center'; c.fillText(h.pill, W / 2, y + 51); c.textAlign = 'left'; c.globalAlpha = 1;
  }
  c.fillStyle = C.panel; c.fillRect(0, H - 120, W, 120);
  c.fillStyle = C.panel2; rrect(c, 40, H - 98, W - 80, 70, 35); c.fill();
  c.fillStyle = C.mute; c.font = F(500, 26); c.fillText(ui.msg, 78, H - 52);
}
function planScreen(c, st, W, H, s, lang, ui) {
  const fill = st.fill ?? 0; // 0 = gap visible, 1 = covered
  c.fillStyle = C.bg; c.fillRect(0, 0, W, H);
  statusBar(c, W, fill > .5 ? '06:02' : '21:47');
  c.fillStyle = C.mute; c.font = F(600, 24); c.fillText(ui.plan, 54, 160);
  c.fillStyle = C.text; c.font = F(700, 64); c.fillText(s.day[lang], 54, 236);
  c.fillStyle = C.mute; c.font = F(500, 28); c.fillText(s.date[lang] + ' · ' + ui.branch, 54, 280);
  const ok = fill > .5, label = ok ? ui.full : ui.gap, col = ok ? C.green : C.coral;
  c.font = F(600, 24); const lw = c.measureText(label).width + 80;
  c.fillStyle = ok ? 'rgba(79,209,161,.14)' : 'rgba(255,138,110,.14)'; rrect(c, 54, 312, lw, 56, 28); c.fill();
  c.fillStyle = col; c.beginPath(); c.arc(84, 340, 9, 0, 7); c.fill(); c.fillText(label, 104, 349);
  const x0 = 210, x1 = W - 54, hour = hh => x0 + (x1 - x0) * (hh - 6) / 16;
  c.fillStyle = C.mute; c.font = F(500, 20);
  [6, 10, 14, 18, 22].forEach(hh => { c.fillText(String(hh).padStart(2, '0'), hour(hh) - 12, 428); c.fillStyle = C.line; c.fillRect(hour(hh), 440, 2, 560); c.fillStyle = C.mute; });
  const span = [[6, 14], [6, 14], [10, 18], [14, 22], [14, 22]], cols = [C.coral, C.green, C.violet, C.blue, C.coral];
  ui.names.forEach((n, i) => {
    const y = 466 + i * 104, [a, b] = span[i], tag = (i === s.gapRow && s.gapTag) ? s.gapTag[lang] : ui.tags[i];
    c.font = F(600, 28); c.fillStyle = C.text;
    if (i === s.gapRow && fill < 1) {
      // empty slot: dashed coral outline, then it fills
      c.save(); c.setLineDash([14, 10]); c.strokeStyle = C.coral; c.lineWidth = 3; rrect(c, hour(a), y + 10, hour(b) - hour(a), 62, 18); c.stroke(); c.restore();
      c.fillStyle = C.coral; c.font = F(600, 22); c.fillText(ui.open, hour(a) + 18, y + 49);
      c.globalAlpha = 1 - fill * 0; c.fillStyle = 'rgba(242,239,233,.35)'; c.font = F(600, 28); c.fillText('—', 54, y + 46); c.globalAlpha = 1;
      if (fill > 0) { c.save(); c.globalAlpha = fill; c.fillStyle = cols[i]; rrect(c, hour(a), y + 10, (hour(b) - hour(a)) * fill, 62, 18); c.fill(); c.restore(); }
      return;
    }
    c.fillText(n, 54, y + 46);
    c.fillStyle = cols[i]; rrect(c, hour(a), y + 10, hour(b) - hour(a), 62, 18); c.fill();
    c.fillStyle = '#121318'; c.font = F(700, 22); c.fillText(tag, hour(a) + 18, y + 49);
  });
  if (fill >= 1) {
    const cy = 1030;
    c.fillStyle = C.panel2; rrect(c, 40, cy, W - 80, 150, 32); c.fill();
    c.fillStyle = C.green; c.beginPath(); c.arc(104, cy + 75, 34, 0, 7); c.fill();
    c.strokeStyle = '#0d0e12'; c.lineWidth = 7; c.lineCap = 'round'; c.beginPath(); c.moveTo(88, cy + 76); c.lineTo(100, cy + 88); c.lineTo(121, cy + 63); c.stroke();
    const [t1, t2] = st.turn; c.fillStyle = C.text; c.font = F(700, 30); c.fillText(t1, 162, cy + 66);
    c.fillStyle = C.mute; c.font = F(500, 24); c.fillText(t2, 162, cy + 106);
  }
}

/* ---------------- clear glass card: thin slab, bright rim, moving sheen ---------------- */
function glass(title, text, col, now) {
  const w = 1.92, h = .58, px = 900, ph = Math.round(px * h / w);
  const g = new THREE.Group();
  const slab = new THREE.Mesh(new RoundedBoxGeometry(w, h, .07, 6, .16),
    new THREE.MeshPhysicalMaterial({ color: 0x232733, roughness: .1, metalness: 0, clearcoat: 1, clearcoatRoughness: .04, transparent: true, opacity: .34, envMapIntensity: 2.4, depthWrite: false, side: THREE.DoubleSide }));
  g.add(slab);
  const cv = document.createElement('canvas'); cv.width = px; cv.height = ph; const c = cv.getContext('2d');
  const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
  const face = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex, transparent: true, toneMapped: false, depthWrite: false }));
  face.position.z = .037; g.add(face);
  const r = ph * .27;
  g.userData.draw = (sheen, alpha = 1) => {
    c.clearRect(0, 0, px, ph);
    c.save(); rrect(c, 0, 0, px, ph, r); c.clip();
    // faint body tint + vertical light falloff (thickness feel)
    const body = c.createLinearGradient(0, 0, 0, ph); body.addColorStop(0, 'rgba(255,255,255,.10)'); body.addColorStop(.5, 'rgba(255,255,255,.03)'); body.addColorStop(1, 'rgba(0,0,0,.10)');
    c.fillStyle = body; c.fillRect(0, 0, px, ph);
    // diagonal moving sheen
    const sx = lerp(-px * .6, px * 1.4, sheen);
    const sg = c.createLinearGradient(sx - 160, 0, sx + 160, ph); sg.addColorStop(0, 'rgba(255,255,255,0)'); sg.addColorStop(.5, 'rgba(255,255,255,.13)'); sg.addColorStop(1, 'rgba(255,255,255,0)');
    c.fillStyle = sg; c.fillRect(0, 0, px, ph);
    c.restore();
    // rim: bright top-left edge, darker bottom-right (reads as a bevel, not a flat plate)
    const rim = c.createLinearGradient(0, 0, px, ph); rim.addColorStop(0, 'rgba(255,255,255,.55)'); rim.addColorStop(.45, 'rgba(255,255,255,.14)'); rim.addColorStop(1, 'rgba(255,255,255,.05)');
    c.strokeStyle = rim; c.lineWidth = 3; rrect(c, 1.5, 1.5, px - 3, ph - 3, r); c.stroke();
    const inner = c.createLinearGradient(0, 0, 0, ph); inner.addColorStop(0, 'rgba(255,255,255,.18)'); inner.addColorStop(.25, 'rgba(255,255,255,0)');
    c.strokeStyle = inner; c.lineWidth = 2; rrect(c, 7, 7, px - 14, ph - 14, r - 6); c.stroke();
    // content
    c.fillStyle = col; rrect(c, 34, ph / 2 - 40, 80, 80, 22); c.fill();
    c.fillStyle = 'rgba(255,255,255,.92)'; c.font = F(700, 34); c.textAlign = 'center'; c.fillText(title[0], 74, ph / 2 + 12); c.textAlign = 'left';
    c.fillStyle = 'rgba(255,255,255,.62)'; c.font = F(600, 24); c.fillText(title + ' · ' + now, 140, ph / 2 - 14);
    let size = 32; c.font = F(600, size); while (c.measureText(text).width > px - 180 && size > 22) { size--; c.font = F(600, size); }
    c.fillStyle = '#ffffff'; c.fillText(text, 140, ph / 2 + 28);
    tex.needsUpdate = true;
    slab.material.opacity = .34 * alpha; face.material.opacity = alpha;
  };
  g.userData.draw(0);
  return g;
}

/* keep an object fully inside the frame with a margin (in NDC), by nudging x/y */
function keepInside(obj, camera, m = .1) {
  for (let it = 0; it < 4; it++) {
    obj.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(obj); const pts = [];
    for (const x of [box.min.x, box.max.x]) for (const y of [box.min.y, box.max.y]) for (const z of [box.min.z, box.max.z]) pts.push(new THREE.Vector3(x, y, z).project(camera));
    const minX = Math.min(...pts.map(p => p.x)), maxX = Math.max(...pts.map(p => p.x)), minY = Math.min(...pts.map(p => p.y)), maxY = Math.max(...pts.map(p => p.y));
    let dx = 0, dy = 0;
    if (minX < -1 + m) dx = (-1 + m) - minX; else if (maxX > 1 - m) dx = (1 - m) - maxX;
    if (minY < -1 + m) dy = (-1 + m) - minY; else if (maxY > 1 - m) dy = (1 - m) - maxY;
    if (!dx && !dy) return;
    const d = camera.position.distanceTo(obj.getWorldPosition(new THREE.Vector3()));
    const hh = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * d;
    obj.position.x += dx * hh * camera.aspect; obj.position.y += dy * hh;
  }
}

/* ---------------- props (home half) ---------------- */
function propKeys() {
  const g = new THREE.Group();
  const brass = new THREE.MeshPhysicalMaterial({ color: 0xc9a46a, metalness: 1, roughness: .28, clearcoat: .4 });
  const steel = new THREE.MeshPhysicalMaterial({ color: 0xb8bcc4, metalness: 1, roughness: .22 });
  const ring = new THREE.Mesh(new THREE.TorusGeometry(.34, .03, 16, 64), steel); g.add(ring);
  const key = (mat, ang, len) => {
    const k = new THREE.Group();
    const head = new THREE.Mesh(new THREE.CylinderGeometry(.2, .2, .05, 40), mat); head.rotation.x = Math.PI / 2; k.add(head);
    const hole = new THREE.Mesh(new THREE.TorusGeometry(.06, .02, 10, 24), mat); hole.position.y = .08; k.add(hole);
    const blade = new THREE.Mesh(new RoundedBoxGeometry(.11, len, .04, 3, .02), mat); blade.position.y = -.2 - len / 2; k.add(blade);
    for (let i = 0; i < 3; i++) { const t = new THREE.Mesh(new THREE.BoxGeometry(.07, .06, .04), mat); t.position.set(.08, -.32 - i * .13 - len * .25, 0); k.add(t); }
    k.position.set(Math.sin(ang) * .3, -Math.cos(ang) * .3 - .25, 0); k.rotation.z = ang; return k;
  };
  g.add(key(brass, -.35, .7), key(steel, .3, .62));
  g.traverse(o => { if (o.isMesh) o.castShadow = true; });
  return g;
}
function propMilk(lang) {
  const g = new THREE.Group();
  const label = { de: 'Milch', en: 'Milk', ru: 'Молоко', uk: 'Молоко' }[lang];
  const mk = () => {
    const cv = document.createElement('canvas'); cv.width = 256; cv.height = 512; const c = cv.getContext('2d');
    c.fillStyle = '#f3f1ec'; c.fillRect(0, 0, 256, 512);
    c.fillStyle = '#7aa2ff'; c.fillRect(0, 300, 256, 212);
    c.fillStyle = '#20232b'; c.font = '600 56px "Instrument Serif", Georgia, serif'; c.font = 'italic 64px "Instrument Serif", Georgia, serif'; c.textAlign = 'center'; c.fillText(label, 128, 230);
    c.fillStyle = 'rgba(255,255,255,.9)'; c.font = '600 30px "Inter Display", sans-serif'; c.fillText('1 L', 128, 380);
    const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; return t;
  };
  const tex = mk();
  const side = new THREE.MeshPhysicalMaterial({ map: tex, roughness: .55, clearcoat: .2 });
  const top = new THREE.MeshPhysicalMaterial({ color: 0xf3f1ec, roughness: .6 });
  for (let i = 0; i < 3; i++) {
    const p = new THREE.Group();
    const body = new THREE.Mesh(new RoundedBoxGeometry(.5, 1.0, .5, 4, .04), [side, side, top, top, side, side]); p.add(body);
    const roof = new THREE.Mesh(new THREE.CylinderGeometry(.0, .36, .26, 4, 1), top); roof.rotation.y = Math.PI / 4; roof.position.y = .63; roof.scale.set(1, 1, .98); p.add(roof);
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(.07, .07, .07, 24), new THREE.MeshPhysicalMaterial({ color: 0xff8a6e, roughness: .4 })); cap.position.set(.1, .74, .1); p.add(cap);
    p.position.set((i - 1) * .58, 0, i === 1 ? .15 : 0); p.rotation.y = (i - 1) * -.18; g.add(p);
  }
  g.traverse(o => { if (o.isMesh) o.castShadow = true; });
  return g;
}
function propNote(lang) {
  const g = new THREE.Group();
  const txt = { de: ['Zahnarzt', 'Do 9:30'], en: ['Dentist', 'Thu 9:30'], ru: ['Стоматолог', 'чт 9:30'], uk: ['Стоматолог', 'чт 9:30'] }[lang];
  const cv = document.createElement('canvas'); cv.width = 512; cv.height = 512; const c = cv.getContext('2d');
  c.fillStyle = '#f2e7c9'; c.fillRect(0, 0, 512, 512);
  c.strokeStyle = 'rgba(80,70,50,.12)'; for (let i = 1; i < 9; i++) { c.beginPath(); c.moveTo(0, i * 56); c.lineTo(512, i * 56); c.stroke(); }
  c.fillStyle = '#2a2a32'; c.font = 'italic 92px "Instrument Serif", Georgia, serif'; c.fillText(txt[0], 44, 230); c.fillText(txt[1], 44, 340);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace;
  const geo = new THREE.PlaneGeometry(1.15, 1.15, 16, 16); const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) { const x = pos.getX(i), y = pos.getY(i); pos.setZ(i, Math.pow(Math.max(0, -y + .2), 2) * .18 + x * x * .04); }
  geo.computeVertexNormals();
  const paper = new THREE.Mesh(geo, new THREE.MeshPhysicalMaterial({ map: t, roughness: .8, side: THREE.DoubleSide })); paper.castShadow = true; g.add(paper);
  const mag = new THREE.Mesh(new THREE.CylinderGeometry(.11, .11, .07, 32), new THREE.MeshPhysicalMaterial({ color: 0xff8a6e, roughness: .3, clearcoat: 1 }));
  mag.rotation.x = Math.PI / 2; mag.position.set(0, .46, .05); g.add(mag);
  return g;
}

/* ---------------- overlay (editorial type) ---------------- */
function headline(html) {
  const m = html.match(/^(.*?)<em>(.*)<\/em>(.*)$/);
  return m ? `${m[1].trim()}<br><em>${m[2].trim()}</em>${m[3] || ''}` : html;
}

export function build(stage, ov) {
  const T = window.TIMING; const lang = T.lang || 'de', reel = T.reel || 'a';
  const s = STORY[reel], ui = UI[lang], home = s.home[lang];
  const B = Object.fromEntries(T.lines.map(l => [l.beat, l]));
  const tBridge = B.bridge.start, tPain = B.pain.start, tTurn = B.turn.start, tCta = B.cta.start, D = T.duration;
  const tFlip = tBridge + (B.bridge.end - tBridge) * .5;

  const S = proStage({ bloom: .42, threshold: .84 });
  const { scene, camera } = S;
  const motes = dust(240); motes.material.opacity = .32; scene.add(motes);

  const phone = proPhone((c, st, W, H) => st.mode === 'home' ? homeScreen(c, st, W, H, home, ui) : planScreen(c, st, W, H, s, lang, ui));
  scene.add(phone);

  const prop = s.prop === 'keys' ? propKeys() : s.prop === 'milk' ? propMilk(lang) : propNote(lang);
  scene.add(prop);

  const homeCards = home.m.map(([n, tx], i) => glass(n, tx, PAL[i], ui.now));
  const painCards = s.pain[lang].map(([n, tx], i) => glass(n, tx, [C.violet, C.coral, C.blue][i], ui.now));
  const turnCards = s.turn[lang].map(([n, tx], i) => glass(n, tx, [C.green, C.coral][i], ui.now));
  [...homeCards, ...painCards, ...turnCards].forEach(k => scene.add(k));

  // overlay: one block per beat + end card
  const beats = ['hook', 'hook2', 'bridge', 'pain', 'turn'];
  ov.innerHTML = `<div class="brand" id="brand">Frei<b>Forms</b></div>` +
    beats.map(b => `<div class="label hl" id="b-${b}" style="top:92px;opacity:0">${headline(B[b].screen)}</div>`).join('') +
    `<div class="rule" id="rule" style="top:0;opacity:0"></div>
     <div id="end" style="position:absolute;inset:0;opacity:0;display:flex;flex-direction:column;justify-content:center;padding:0 40px">
       <div style="font-size:15px;font-weight:600;letter-spacing:.32em;text-transform:uppercase;color:rgba(244,241,236,.6)">Frei<b style="color:#ff8a6e;font-weight:600">Forms</b></div>
       <div class="label" style="position:relative;left:0;top:0;margin-top:26px;font-size:56px;line-height:1.02;letter-spacing:-.035em;width:460px">${ui.cta}<br><em>${ui.ctaEm}</em></div>
       <div style="margin-top:30px;width:64px;height:1px;background:rgba(244,241,236,.4)"></div>
       <div style="margin-top:22px;font-size:22px;font-weight:500;color:rgba(244,241,236,.7)">@frei_forms</div>
     </div>`;
  // fit every headline into 466 px width and at most 3 lines
  ov.querySelectorAll('.hl').forEach(el => {
    let fs = 54; el.style.fontSize = fs + 'px'; el.style.lineHeight = '1.04'; el.style.letterSpacing = '-.035em'; el.style.width = '466px';
    while ((el.scrollHeight > 3.3 * fs * 1.04 || el.scrollWidth > 470) && fs > 34) { fs -= 2; el.style.fontSize = fs + 'px'; }
    el.dataset.h = el.scrollHeight;
  });

  const beatAt = t => { let cur = null; for (const b of beats) if (t >= B[b].start - .2) cur = b; return t >= tCta - .1 ? null : cur; };
  const placeCard = (k, x, y, z, ry, k01, sheen) => {
    const a = easeOut(k01);
    k.visible = a > .001;
    k.position.set(x - (1 - a) * .7, y, z); k.rotation.set(.02, ry, 0);
    k.scale.setScalar(.96 + .04 * a);
    k.userData.draw(sheen, a);
    keepInside(k, camera, .07);
  };

  function update(t) {
    // ----- overlay -----
    const cur = beatAt(t);
    beats.forEach(b => {
      const el = ov.querySelector('#b-' + b); const st = B[b].start - .2;
      const next = beats[beats.indexOf(b) + 1]; const en = next ? B[next].start - .2 : tCta - .1;
      const a = clamp((t - st) / .35) * clamp((en - t) / .25);
      el.style.opacity = a.toFixed(3); el.style.transform = `translateY(${((1 - easeOut(clamp((t - st) / .5))) * 14).toFixed(2)}px)`;
    });
    const rule = ov.querySelector('#rule'); const curEl = cur && ov.querySelector('#b-' + cur);
    if (curEl) { rule.style.top = (92 + +curEl.dataset.h + 22) + 'px'; rule.style.opacity = ov.querySelector('#b-' + cur).style.opacity; } else rule.style.opacity = 0;
    const endA = ease((t - tCta) / .7); ov.querySelector('#end').style.opacity = endA.toFixed(3);
    ov.querySelector('#brand').style.opacity = (1 - endA).toFixed(3);

    // ----- camera: slow push-in, gentle drift -----
    const push = t / D;
    camera.position.set(.35 + Math.sin(t * .23) * .12, .45 + Math.cos(t * .19) * .08, 15.2 - push * .9);
    camera.lookAt(.2, -.1, 0);

    // ----- phone: home -> flip at bridge -> plan; leaves for end card -----
    const flip = ease((t - (tFlip - .45)) / .9);           // 0..1 during the flip
    const mode = flip < .5 ? 'home' : 'plan';
    const homeSt = { mode: 'home', msgs: clamp((t - .15) / 1.2) * 3, pill: clamp((t - B.hook2.start) / .5) };
    const fill = clamp((t - (tTurn + .25)) / .9);
    const planSt = { mode: 'plan', fill: fill >= 1 ? 1 : (t >= tTurn ? fill : 0), turn: s.turn[lang][0] };
    phone.userData.redraw(mode === 'home' ? homeSt : planSt);
    const out = ease((t - tCta) / .8);
    const intro = easeOut(t / 1.1);
    phone.position.set(1.05 + out * 2.6, -1.45 - (1 - intro) * .6, 0);
    phone.rotation.set(.06, -.34 + Math.sin(flip * Math.PI) * 0 + flip * Math.PI * 2 * 0 + (flip > 0 && flip < 1 ? 0 : 0), .04);
    // flip: rotate around Y through 180°, swap screen at the midpoint (we never show the back: squash at 90°)
    const fy = flip * Math.PI;
    phone.rotation.y = -.34 + (flip < .5 ? fy : fy - Math.PI);
    phone.scale.set(.94 * Math.max(.02, Math.abs(Math.cos(fy))) , .94, .94);
    phone.visible = out < .999;

    // ----- prop: home half only, upper right, exits before the flip -----
    const pIn = easeOut((t - .3) / 1.2), pOut = ease((t - (tBridge - .1)) / .8);
    prop.visible = pIn > 0 && pOut < 1;
    const pp = { keys: [1.25, .55, 1.2, .6], milk: [1.2, .35, .4, .52], note: [1.3, .5, .9, .78] }[s.prop];
    prop.position.set(pp[0] + pOut * 2.2, pp[1] + (1 - pIn) * .5 + Math.sin(t * .8) * .04, pp[2]);
    prop.scale.setScalar(pp[3] * (.9 + .1 * pIn));
    prop.rotation.set(.15 + Math.sin(t * .5) * .05, -.5 + t * .08, s.prop === 'keys' ? .3 + Math.sin(t * 1.1) * .08 : .05);

    // ----- glass cards -----
    const xL = -.72, ys = [.05, -.72, -1.49];
    homeCards.forEach((k, i) => {
      const a = clamp((t - (.35 + i * .5)) / .6) * (1 - clamp((t - (tBridge - .2)) / .45));
      placeCard(k, xL + (i % 2) * -.1, ys[i] + Math.sin(t * .6 + i) * .03, .7 - i * .22, .24, a, ((t * .18 + i * .3) % 1.4) / 1.4);
    });
    painCards.forEach((k, i) => {
      const a = clamp((t - (tPain + i * .45)) / .6) * (1 - clamp((t - (tTurn - .25)) / .45));
      placeCard(k, xL + (i % 2) * -.1, ys[i] + Math.sin(t * .6 + i) * .03, .7 - i * .22, .24, a, ((t * .18 + i * .3) % 1.4) / 1.4);
    });
    turnCards.forEach((k, i) => {
      const a = clamp((t - (tTurn + 1.0 + i * .5)) / .6) * (1 - clamp((t - (tCta - .2)) / .5));
      placeCard(k, xL, ys[i] - .2, .8 - i * .25, .22, a, ((t * .18 + i * .3) % 1.4) / 1.4);
    });

    motes.userData.update(t);
    S.render(t);
  }
  return { duration: D, update };
}

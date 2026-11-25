import { THREE, RoundedBoxGeometry, clamp, lerp, seg, easeInOut, easeOut, easeIn, easeOutBack, setupStage, floorDisc, blobShadow, makeBlob, makeBubble, makePhone, Confetti, el, show, endCard, ball, rr, toon, outline } from './lib.js';
import { mixHex, makeLabel, makeCap, makeRobot, makeStars, twinkle } from './extras.js';

/* Reel C: "Kunden schreiben nachts" (15 s): night chat -> assistant tidies the request -> calm morning */
const MSGS = ['Habt ihr morgen Zeit?', 'Gibt es Termine am Freitag?', 'Was kostet eine Website?', 'Hallo? Seid ihr noch da?'];
const TS = [.6, 1.5, 2.4, 3.2];
const ROWS = [['Name', 'Kundin A.'], ['Datum', 'Fr, 10:00 Uhr'], ['Anliegen', 'Website-Anfrage'], ['Status', 'bereit für dich']];

function fit(c, text, maxW, size, weight = 700) {
  c.font = `${weight} ${size}px "Inter Display"`;
  while (c.measureText(text).width > maxW && size > 18) { size -= 2; c.font = `${weight} ${size}px "Inter Display"`; }
  return size;
}

function drawScreen(c, st, W, H) {
  const t = st.t ?? 0;
  c.textAlign = 'left'; c.globalAlpha = 1;
  /* night layer */
  c.fillStyle = '#161a45'; c.fillRect(0, 0, W, H);
  c.fillStyle = '#0d1030'; c.fillRect(0, 0, W, 210);
  c.fillStyle = '#9fb0ff'; c.font = '600 28px "Inter Display"'; c.fillText('Nachrichten', 36, 70);
  c.fillStyle = '#fff'; c.font = '700 88px "Inter Display"'; c.fillText('23:47', 36, 168);
  MSGS.forEach((m, i) => {
    const a = easeOut(clamp((t - TS[i]) / .4)); if (a <= 0) return;
    const y = 250 + i * 165 + (1 - a) * 40;
    c.globalAlpha = a; c.fillStyle = i % 2 ? '#3b4fd0' : '#4f63e8'; rr(c, 36, y, W - 72, 130, 36); c.fill();
    c.fillStyle = '#fff'; const sz = fit(c, m, W - 130, 36); c.font = `700 ${sz}px "Inter Display"`; c.fillText(m, 66, y + 78);
  });
  c.globalAlpha = 1;
  /* day layer: tidy request card */
  const d = easeOut(clamp((t - 4.2) / .6));
  if (d > 0) {
    c.globalAlpha = d; c.fillStyle = '#f7f8fb'; c.fillRect(0, 0, W, H);
    c.fillStyle = '#14161c'; c.fillRect(0, 0, W, 210);
    c.fillStyle = '#b8bdc9'; c.font = '600 28px "Inter Display"'; c.fillText('Assistent · neu', 36, 70);
    c.fillStyle = '#fff'; c.font = '700 54px "Inter Display"'; c.fillText('Anfrage geordnet', 36, 160);
    ROWS.forEach((r, i) => {
      const a = easeOut(clamp((t - 6.0 - i * .5) / .5)); if (a <= 0) return;
      const y = 250 + i * 150, x = 36 + (1 - a) * 320;
      c.globalAlpha = d * a; c.fillStyle = '#fff'; c.strokeStyle = '#e7e9f0'; c.lineWidth = 3; rr(c, x, y, W - 72, 124, 28); c.fill(); c.stroke();
      c.fillStyle = '#6b7080'; c.font = '600 26px "Inter Display"'; c.fillText(r[0], x + 30, y + 44);
      c.fillStyle = '#14161c'; const sz = fit(c, r[1], W - 72 - 170, 38); c.font = `700 ${sz}px "Inter Display"`; c.fillText(r[1], x + 30, y + 92);
      const k = easeOutBack(clamp((t - 6.3 - i * .5) / .35));
      if (k > 0) {
        const cx = x + W - 72 - 52, cy = y + 62;
        c.fillStyle = '#22c08a'; c.beginPath(); c.arc(cx, cy, 26 * k, 0, 7); c.fill();
        c.strokeStyle = '#fff'; c.lineWidth = 6 * Math.min(1, k); c.lineCap = 'round'; c.beginPath(); c.moveTo(cx - 12, cy); c.lineTo(cx - 3, cy + 10); c.lineTo(cx + 13, cy - 10); c.stroke();
      }
    });
    const pk = easeOutBack(clamp((t - 8.1) / .4));
    if (t > 8.1) {
      c.globalAlpha = d; c.fillStyle = '#dff7ec'; rr(c, 36, 880, W - 72, 90 * Math.min(1, pk), 45); c.fill();
      c.fillStyle = '#0b7350'; c.font = '700 36px "Inter Display"'; c.textAlign = 'center'; c.fillText('Alles erfasst', W / 2, 938); c.textAlign = 'left';
    }
  }
  c.globalAlpha = 1;
}

export function build(stage, ov) {
  const { renderer, scene, camera, sun } = setupStage();
  const ambient = scene.children.find(o => o.isAmbientLight);
  const floor = floorDisc(0x3a3c86, 4.6); scene.add(floor);
  const stars = makeStars(44, 21); scene.add(stars);

  /* moon (left, between hook pill and Frei) */
  const moon = new THREE.Group();
  { const mb = ball(.95, 0xfff1c0, 1, 1, 1, .04); mb.material = new THREE.MeshBasicMaterial({ color: 0xfff1c0 }); moon.add(mb); }
  for (const [x, y, z, r] of [[-.3, .25, .85, .16], [.32, -.2, .82, .2], [.35, .38, .72, .12]]) { const cr = ball(r, 0xf0dc9c, 1, 1, .3, 0); cr.material = new THREE.MeshBasicMaterial({ color: 0xe6cf86 }); cr.position.set(x, y, z); moon.add(cr); }
  moon.position.set(-1.9, 4.9, -3.2); scene.add(moon);

  /* Frei, asleep with night cap */
  const frei = makeBlob(0xff7a6b); scene.add(frei.root);
  const cap = makeCap(0x4d6ff0); frei.b.add(cap);
  const arcs = [];
  for (const s of [-1, 1]) {
    const a = new THREE.Mesh(new THREE.TorusGeometry(.16, .035, 8, 16, Math.PI), new THREE.MeshBasicMaterial({ color: 0x2b2250 }));
    a.rotation.z = Math.PI; a.position.set(s * .37, .26, .9); frei.b.add(a); arcs.push(a);
  }
  const sh = blobShadow(1.25); scene.add(sh);
  const FX = -1.25, FS = .88;

  /* Z's */
  const zs = [0, 1, 2].map(i => { const z = makeLabel('Z', { w: .5, h: .5, font: '700 300px "Inter Display"', color: '#ffffff', px: 256 }); scene.add(z); return z; });

  /* table + phone */
  const table = new THREE.Mesh(new RoundedBoxGeometry(1.8, .9, 1.0, 3, .15), toon(0x5a50a8)); outline(table, .04);
  table.position.set(.95, .45, .6); scene.add(table);
  const glow = new THREE.Mesh(new THREE.CircleGeometry(1.9, 40), new THREE.MeshBasicMaterial({ color: 0x6f8bff, transparent: true, opacity: .28, depthWrite: false })); scene.add(glow);
  const phone = makePhone(drawScreen); scene.add(phone);
  const badge = makeLabel('1', { w: .9, h: .9, font: '700 340px "Inter Display"', color: '#fff', bg: '#e5483d', px: 256 });
  badge.position.set(.85, 1.75, .22); phone.add(badge);
  const clock = makeLabel('23:47', { w: 1.1, h: .46, font: '700 190px "Inter Display"', color: '#fff', bg: 'rgba(255,255,255,.2)', px: 512 });
  clock.position.set(.95, .5, 1.12); scene.add(clock);
  let lastBadge = 1;

  /* customer bubbles */
  const SLOT_X = [.55, 1.55, .55, 1.55];
  const bubbles = MSGS.map((tx, i) => {
    const m = makeBubble(tx, { bg: i % 2 ? '#e6ecff' : '#ffffff', tailLeft: i % 2 === 0, w: 1.6 }); scene.add(m); return { m, ts: TS[i], x: SLOT_X[i] };
  });

  /* robot assistant + its bubbles */
  const robot = makeRobot(); scene.add(robot);
  const dots = ['.', '. .', '. . .'].map(s => { const m = makeBubble(s, { bg: '#ffffff', w: 1.1, tailLeft: false }); scene.add(m); return m; });
  const reply = makeBubble('Hallo! Für wann?', { bg: '#ffffff', w: 2.0, tailLeft: false }); scene.add(reply);

  const conf = new Confetti(46, 9); scene.add(conf.g);

  const hooks = [
    [el(ov, 'hook', 'Kunden schreiben <em>nachts.</em> Wer antwortet?'), .1, 3.6],
    [el(ov, 'hook', 'Ein Assistent nimmt die Anfrage an.'), 4.0, 7.4],
    [el(ov, 'hook', 'Morgens siehst du nur <em>das Wichtige.</em>'), 8.0, 10.6],
    [el(ov, 'hook', 'Keine Anfrage <em>geht verloren.</em>'), 10.7, 12.4],
  ];
  const end = endCard(ov);

  function update(t) {
    const p = seg(t, 8.5, 10.5);
    stage.style.background = `linear-gradient(180deg, ${mixHex('#12143a', '#ffe3da', p)} 0%, ${mixHex('#2b2d73', '#f1e6ff', p)} 55%, ${mixHex('#4b4a99', '#dfe8ff', p)} 100%)`;
    if (ambient) ambient.intensity = lerp(1.05, 1.35, p);
    sun.intensity = lerp(1.6, 2.2, p); sun.color.set(mixHex('#c5d0ff', '#ffffff', p));
    floor.material.color.set(mixHex('#3a3c86', '#f4efff', p));
    table.material.color.set(mixHex('#5a50a8', '#9a8ff0', p));
    twinkle(stars, t, 1 - seg(t, 8.5, 10));
    moon.position.y = 4.9 - 3.4 * easeIn(seg(t, 8.5, 10.8)); moon.scale.setScalar(Math.max(.001, .8 * (1 - seg(t, 9.6, 10.8))));
    moon.visible = moon.scale.x > .01;

    /* Frei */
    const asleep = t < 8.6;
    const wake = seg(t, 8.6, 8.95);
    let hop = 0; if (t > 10.9) hop = Math.abs(Math.sin((t - 10.9) * 5.2)) * .4 * Math.exp(-(t - 10.9) * .5);
    frei.root.position.set(FX, hop, 0); frei.root.scale.setScalar(FS);
    frei.root.rotation.z = asleep ? Math.sin(t * 1.1) * .025 : 0;
    const blink = (t % 2.6) > 2.5 ? .1 : 1;
    if (asleep) {
      frei.face({ mouth: 'smile', mouthScale: .7, eyeOpen: .06 });
      frei.squash(1 + .025 * Math.sin(t * 2.2));
    } else {
      const yawn = t < 9.6;
      frei.face({ mouth: yawn ? 'open' : 'smile', mouthScale: yawn ? 1.1 + .15 * Math.sin(t * 9) : 1.35, eyeOpen: Math.max(.2, easeOut(wake)) * blink, look: [1, .25] });
      frei.squash(1 + .12 * Math.sin(Math.PI * seg(t, 8.7, 9.8)) * (t < 9.8 ? 1 : 0) - (hop > .02 ? -.05 : 0));
    }
    frei.eyes.forEach(e => { e.visible = !asleep; });
    arcs.forEach(a => { a.visible = asleep; });
    const up = asleep ? 0 : easeOutBack(seg(t, 8.8, 9.3)) * (1 - seg(t, 10.3, 10.8));
    frei.arm(0, up, .1); frei.arm(1, up, .1);
    cap.rotation.z = -.3 + (t > 9 ? Math.sin(t * 5) * .05 : 0);
    sh.position.set(FX, .02, 0); sh.scale.setScalar(FS * (1 - hop * .35));

    /* Z's */
    zs.forEach((z, i) => {
      const ph = ((t * .45 + i / 3) % 1);
      z.visible = asleep && t > .15;
      z.position.set(-1.45 + ph * .35 + i * .05, 3.0 + ph * 1.2, .8);
      z.scale.setScalar(.6 + ph * .6); z.material.opacity = Math.sin(Math.PI * ph) * (1 - seg(t, 8.3, 8.7));
    });

    /* phone: small on the table -> big */
    const pk = easeOutBack(seg(t, 3.95, 4.8));
    phone.position.set(.95, lerp(1.95, 2.2, pk), lerp(.6, 1.6, pk));
    phone.scale.setScalar(lerp(.55, .92, pk));
    phone.rotation.set(lerp(-.2, 0, pk), lerp(-.2, Math.sin(t * 1.4) * .1, seg(t, 3.95, 4.8)), 0);
    phone.userData.redraw({ t });
    glow.position.set(.95, lerp(1.95, 2.2, pk), -.3); glow.scale.setScalar(lerp(.7, 1.1, pk)); glow.material.opacity = .28 * (1 - p) * (.85 + .15 * Math.sin(t * 3));
    /* badge and clock */
    const cnt = TS.filter(x => t >= x).length;
    if (cnt && cnt !== lastBadge) { lastBadge = cnt; badge.userData.redraw(String(cnt)); }
    const bs = t < TS[0] ? 0 : easeOutBack(seg(t, TS[0], TS[0] + .3)) * (1 - seg(t, 3.9, 4.3));
    badge.visible = bs > .02; badge.scale.setScalar(Math.max(.001, bs));
    const cs = easeOut(seg(t, .15, .5)) * (1 - seg(t, 3.9, 4.3));
    clock.visible = cs > .02; clock.scale.setScalar(Math.max(.001, cs)); clock.position.y = .5;

    /* customer bubbles */
    bubbles.forEach((b, i) => {
      const m = b.m;
      if (t < b.ts) { m.visible = false; return; }
      const s = t - b.ts, k = easeOutBack(seg(t, b.ts, b.ts + .4));
      let x = lerp(.95, b.x, k), y = lerp(3.0, Math.min(5.0, 3.35 + .55 * s), k), z = lerp(.9, 1.0, k), sc = Math.min(1, k + .001);
      if (t > 3.95) { const q = easeIn(seg(t, 3.95, 4.5)); x = lerp(x, .95, q); y = lerp(y, 2.4, q); z = lerp(z, 1.6, q); sc *= 1 - q; }
      m.visible = sc > .02; m.position.set(x, y + Math.sin(t * 2 + i) * .04, z); m.scale.setScalar(Math.max(.001, sc));
      m.rotation.set(0, Math.sin(t * 1.6 + i) * .15, Math.sin(t * 2 + i) * .05);
    });

    /* robot */
    const rk = seg(t, 4.0, 4.8);
    robot.visible = t >= 4.0;
    const hov = t > 4.8 ? 1 : 0;
    robot.position.set(lerp(.95, -.38, easeOutBack(rk)), lerp(2.4, 2.85, easeOut(rk)) + Math.sin(rk * Math.PI) * 1.0 + hov * Math.sin(t * 2.4) * .1, lerp(1.7, 1.8, rk));
    robot.scale.setScalar(.6 * easeOut(seg(t, 4.0, 4.4)) + .001);
    robot.rotation.set(0, Math.sin(t * 1.3) * .15, Math.sin(t * 1.7) * .06);
    robot.userData.tip.scale.setScalar(1 + .25 * Math.sin(t * 8));
    /* robot bubbles */
    const dv = t >= 4.9 && t < 5.6, di = Math.floor((t - 4.9) * 4) % 3;
    dots.forEach((m, i) => { m.visible = dv && i === di; m.position.set(-.68, 4.35, 2.0); m.scale.setScalar(Math.max(.001, easeOutBack(seg(t, 4.9, 5.2)))); });
    const rv = t >= 5.6 && t < 7.6, rs = easeOutBack(seg(t, 5.6, 5.95)) * (1 - easeIn(seg(t, 7.3, 7.6)));
    reply.visible = rv; reply.position.set(-1.04, 4.35 + Math.sin(t * 2) * .04, 2.0); reply.scale.setScalar(Math.max(.001, rs));

    conf.update(t - 9.8, [.95, 4.3, 2.2]);
    camera.position.set(Math.sin(t * .5) * .12, 3.3, 13 - .6 * seg(t, 4, 6));
    camera.lookAt(0, 3.3, 0);
    for (const [e, a, b] of hooks) show(e, t, a, b);
    end.update(t, 12.6);
    renderer.render(scene, camera);
  }
  return { duration: 15, update };
}

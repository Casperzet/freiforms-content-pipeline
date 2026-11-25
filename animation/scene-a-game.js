import { gameStage, gMat, screenGlow } from './game.js';
import { THREE, clamp, lerp, seg, easeInOut, easeOut, easeIn, easeOutBack, bounceOut, rng, setupStage, floorDisc, blobShadow, makeBlob, makeBubble, makePhone, Confetti, el, show, endCard, ball, rr } from './lib.js';

/* Reel A: "Dienstplan-Chaos" (15 s): chaos in chat bubbles -> one plan on the phone */
export function build(stage, ov) {
  stage.style.background = 'linear-gradient(180deg,#ffe3da 0%,#f1e6ff 55%,#dfe8ff 100%)';
  const { renderer, scene, camera, sun } = setupStage();
  const G = gameStage(renderer, scene, sun);
  G.shadowCatcher(9);
  scene.add(floorDisc(0xf4efff, 4.6));
  const frei = makeBlob(0xff7a6b); scene.add(frei.root);
  const sh = blobShadow(1.25); scene.add(sh);
  const sweat = ball(.12, 0x6ec6ff, .8, 1.25, .8, .0); scene.add(sweat);

  const texts = ['Wer übernimmt Samstag?', 'Hab ich nicht gesehen', 'Kann jemand tauschen??', 'Wer macht Kasse 2?', 'Dienstplan.jpg', 'Bin ich Montag dran?', 'Hallo?? Antwort!', 'Plan nicht lesbar', 'Wer hat den Schlüssel?'];
  const rest = [[-1.2, 1.3, 1.2], [1.2, 1.6, 1.0], [-1.0, 3.0, .2], [1.05, 3.8, .1], [-.9, 4.6, -.2], [.95, 5.4, -.4], [0, 3.4, -1], [-1.1, 2.1, -.6], [1.1, 2.6, -.6]];
  const bubbles = texts.map((tx, i) => {
    const m = makeBubble(tx, { bg: ['#ffe9e6', '#e6ecff', '#ffffff'][i % 3], tailLeft: i % 2 === 0, w: 2.3 });
    scene.add(m); return { m, ts: .2 + i * .4, r: rest[i], tsuck: 6.1 + i * .07 };
  });

  const phone = makePhone((c, st, W, H) => {
    const p = st.p;
    c.fillStyle = '#f7f8fb'; c.fillRect(0, 0, W, H);
    c.fillStyle = '#14161c'; c.fillRect(0, 0, W, 230);
    c.fillStyle = '#b8bdc9'; c.font = '600 26px "Inter Display"'; c.fillText('Teamleitung · Live', 36, 96);
    c.fillStyle = '#22c08a'; c.beginPath(); c.arc(W - 56, 88, 10, 0, 7); c.fill();
    c.fillStyle = '#fff'; c.font = '700 48px "Inter Display"'; c.fillText('Samstag · Früh', 36, 160);
    const rows = [['Anna', '06:00 – 14:00', '#ffe1a8'], ['Mehmet', '14:00 – 22:00', '#cfd9ff'], ['Lena', 'Kasse 2 ab 10:00', '#c8f1df'], ['Marat', 'Tausch bestätigt', '#ffd6cf']];
    rows.forEach((r, i) => {
      const a = easeOut(clamp((p - .3 - i * .35) / .5)); if (a <= 0) return;
      const y = 270 + i * 150, x = 36 + (1 - a) * 320;
      c.globalAlpha = a; c.fillStyle = '#fff'; c.strokeStyle = '#e7e9f0'; c.lineWidth = 3; rr(c, x, y, W - 72, 124, 28); c.fill(); c.stroke();
      c.fillStyle = r[2]; c.beginPath(); c.arc(x + 62, y + 62, 38, 0, 7); c.fill();
      c.fillStyle = '#14161c'; c.font = '700 30px "Inter Display"'; c.textAlign = 'center'; c.fillText(r[0][0], x + 62, y + 74); c.textAlign = 'left';
      c.font = '700 34px "Inter Display"'; c.fillText(r[0], x + 126, y + 56);
      c.fillStyle = '#6b7080'; c.font = '600 26px "Inter Display"'; c.fillText(r[1], x + 126, y + 96);
      const k = easeOutBack(clamp((p - 1.1 - i * .25) / .35));
      if (k > 0) { c.fillStyle = '#22c08a'; c.beginPath(); c.arc(x + W - 72 - 56, y + 62, 24 * k, 0, 7); c.fill();
        c.strokeStyle = '#fff'; c.lineWidth = 6; c.lineCap = 'round'; c.beginPath(); c.moveTo(x + W - 72 - 68 * 1, y + 62); c.lineTo(x + W - 72 - 58, y + 72); c.lineTo(x + W - 72 - 42, y + 52); c.stroke(); }
      c.globalAlpha = 1;
    });
    const pr = easeOut(clamp((p - 1.8) / 1.2));
    c.fillStyle = '#eef0f5'; rr(c, 36, 900, W - 72, 26, 13); c.fill();
    c.fillStyle = '#ff7a6b'; rr(c, 36, 900, (W - 72) * .86 * pr, 26, 13); c.fill();
    c.fillStyle = '#6b7080'; c.font = '600 24px "Inter Display"'; c.fillText('Fortschritt', 36, 960);
  });
  scene.add(phone);
  const glow = screenGlow(0x9fc4ff, 1.4); phone.add(glow); G.castAll(phone); G.castAll(frei.root);

  const ring = new THREE.Mesh(new THREE.TorusGeometry(1, .06, 8, 40), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true })); scene.add(ring);
  const conf = new Confetti(46, 5); scene.add(conf.g);

  const hooks = [
    [el(ov, 'hook', 'Dein Dienstplan ist ein <em>Foto</em> in der WhatsApp-Gruppe?'), .1, 3.8],
    [el(ov, 'hook', 'Jeder fragt. <em>Keiner</em> weiß Bescheid.'), 3.9, 5.9],
    [el(ov, 'hook', 'Und jetzt: <em>ein Plan</em> für alle.'), 6.0, 7.4],
    [el(ov, 'hook', 'Alle sehen ihn. <em>Auf dem Handy.</em>'), 7.5, 10.2],
    [el(ov, 'hook', 'Aufgaben. Tausch. Chat.'), 10.3, 12.4],
  ];
  const end = endCard(ov);

  function update(t) {
    const chaos = seg(t, .2, 4.5) * (t < 6.3 ? 1 : 0);
    const happy = t >= 7.2;
    // Frei
    const fx = lerp(0, -1.25, easeInOut(seg(t, 7.0, 7.9)));
    const fs = lerp(1.15, .88, easeInOut(seg(t, 7.0, 7.9)));
    let hop = 0; if (t > 7.5 && t < 11) hop = Math.abs(Math.sin((t - 7.5) * 5.2)) * .55 * Math.exp(-(t - 7.5) * .55);
    if (t > 12) hop = Math.abs(Math.sin((t - 12) * 5.2)) * .3;
    frei.root.position.set(fx + Math.sin(t * 38) * .035 * chaos, hop, 0);
    frei.root.scale.setScalar(fs);
    frei.squash(1 + .07 * Math.sin(t * 9) * chaos - (hop > .02 ? -.05 : 0));
    const blink = (t % 2.6) > 2.5 ? .1 : 1;
    if (!happy) frei.face({ mouth: 'open', mouthScale: 1 + .18 * Math.sin(t * 14) * chaos + .25, eyeOpen: blink * (1 + .05 * chaos), look: [Math.sin(t * 3), Math.cos(t * 2.2) * .6] });
    else frei.face({ mouth: t > 7.6 ? 'grin' : 'smile', eyeOpen: blink, look: [1, .2] });
    const up = happy ? easeOutBack(seg(t, 8.0, 8.4)) * (t < 9.6 ? 1 : 1 - seg(t, 9.6, 10)) : 0;
    frei.arm(0, up, .1); frei.arm(1, up, .1);
    sh.position.set(frei.root.position.x, .02, 0); sh.scale.setScalar(fs * (1 - hop * .35));
    // sweat
    sweat.visible = t > 2.4 && t < 6.3;
    sweat.position.set(fx + .95 * fs, 2.1 - ((t * 1.1) % 1) * .8, .6);
    // bubbles
    for (const [i, b] of bubbles.entries()) {
      const m = b.m;
      if (t < b.ts) { m.visible = false; continue; }
      m.visible = true;
      const k = bounceOut(seg(t, b.ts, b.ts + .9));
      let x = b.r[0], y = lerp(b.r[1] + 8, b.r[1], k), z = b.r[2], sc = 1;
      x += Math.sin(t * 2.3 + i) * .06 * (1 + chaos); y += Math.cos(t * 1.9 + i * 2) * .05;
      if (t > b.tsuck) {
        const s = easeIn(seg(t, b.tsuck, b.tsuck + .55));
        x = lerp(x, 0, s); y = lerp(y, 2.4, s); z = lerp(z, 1.2, s); sc = 1 - s;
      }
      m.visible = sc > .02; m.position.set(x, y, z); m.scale.setScalar(Math.max(.001, sc));
      m.rotation.set(0, Math.sin(t * 1.7 + i) * .2, Math.sin(t * 2.1 + i * 1.3) * .08 * (.5 + chaos));
    }
    // phone
    const pin = easeOutBack(seg(t, 5.8, 6.6));
    const px = lerp(0, .95, easeInOut(seg(t, 7.0, 7.9)));
    phone.visible = t >= 5.8;
    phone.position.set(px, lerp(-4.5, 2.2, pin), 1.6);
    phone.scale.setScalar(lerp(.4, .92, pin));
    phone.rotation.set(0, Math.sin(t * 1.4) * .12 - .1 * (1 - seg(t, 7, 8)), Math.sin(t * 1.1) * .03);
    phone.userData.redraw({ p: t - 7.2 });
    // ring
    const rk = seg(t, 5.9, 6.7); ring.visible = rk > 0 && rk < 1;
    ring.position.set(0, 2.2, 2.2); ring.scale.setScalar(.5 + rk * 3.2); ring.material.opacity = 1 - rk;
    // confetti
    conf.update(t - 8.0, [px, 4.3, 2.2]);
    // camera
    camera.position.set(Math.sin(t * .5) * .12, 3.3, 13 - .8 * seg(t, 5.8, 8));
    camera.lookAt(0, 3.3, 0);
    // overlay
    for (const [e, a, b] of hooks) show(e, t, a, b);
    end.update(t, 12.6);
    renderer.render(scene, camera);
  }
  const _u = update;
  return { duration: 15, update: (t) => { _u(t); glow.intensity = 1.2 + .5 * Math.sin(t * 3); } };
}

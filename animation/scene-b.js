import { THREE, RoundedBoxGeometry, clamp, lerp, seg, easeInOut, easeOut, easeIn, easeOutBack, rng, setupStage, floorDisc, blobShadow, makeBlob, makeBubble, makePhone, Confetti, el, show, endCard, ball, rr, toon, basic, outline } from './lib.js';
import { mixHex, makeLabel } from './extras.js';

/* Reel B: "Krankmeldung um 5:40 Uhr" (15 s): alarm + sick message -> panic -> shift is open in the app -> colleague takes it */
export function build(stage, ov) {
  const { renderer, scene, camera } = setupStage();
  const floor = floorDisc(0x8f89cc, 4.6); scene.add(floor);
  const sh = blobShadow(1.25); scene.add(sh);

  /* ---------- Frei (sleeping at first) ---------- */
  const frei = makeBlob(0xff7a6b); scene.add(frei.root);
  const sleepArcs = [];
  for (const s of [-1, 1]) {
    const a = new THREE.Mesh(new THREE.TorusGeometry(.16, .05, 8, 20, Math.PI), basic(0x2b2250));
    a.rotation.z = Math.PI; a.rotation.y = s * .35; a.position.set(s * .37, .3, .88); frei.b.add(a); sleepArcs.push(a);
  }
  const sweat = ball(.12, 0x6ec6ff, .8, 1.25, .8, 0); scene.add(sweat);

  /* Z labels */
  const zs = [0, 1, 2].map(() => { const m = makeLabel('Z', { w: .5, h: .5, font: '700 300px "Inter Display"', color: '#ffffff', px: 256 }); scene.add(m); return m; });

  /* ---------- table + alarm clock ---------- */
  const tableGrp = new THREE.Group(); scene.add(tableGrp);
  const table = new THREE.Mesh(new RoundedBoxGeometry(2.0, .8, 1.2, 3, .12), toon(0xd9b48f)); outline(table, .04); table.position.y = .4; tableGrp.add(table);
  const clock = new THREE.Group(); clock.position.set(-.55, 1.26, .1); tableGrp.add(clock);
  const cBody = ball(.48, 0xe5483d, 1, 1, .8, .05); clock.add(cBody);
  for (const s of [-1, 1]) {
    const bell = ball(.16, 0xffd23f, 1, .8, 1, .06); bell.position.set(s * .3, .42, 0); clock.add(bell);
    const leg = ball(.09, 0x2b2250, 1, 1, 1, 0); leg.position.set(s * .25, -.44, .05); clock.add(leg);
  }
  const hammer = new THREE.Mesh(new THREE.CylinderGeometry(.025, .025, .3, 8), basic(0x2b2250)); hammer.position.y = .58; clock.add(hammer);
  const face = makeLabel('05:40', { w: .72, h: .36, font: '700 130px "Inter Display"', color: '#e5483d', bg: '#ffffff', px: 512 }); face.position.set(0, 0, .42); clock.add(face);
  const rings = [];
  for (const s of [-1, 1]) for (let i = -1; i <= 1; i++) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(.05, .24, .03), basic(0xffd23f)); m.position.set(s * (.78 + (i === 0 ? .06 : 0)), .1 + i * .28, .2); m.rotation.z = -s * i * .5; clock.add(m); rings.push(m);
  }

  /* ---------- phone ---------- */
  const phone = makePhone((c, st, W, H) => {
    const t = st.t || 0;
    c.fillStyle = '#f7f8fb'; c.fillRect(0, 0, W, H);
    // message view
    if (t < 5.7) {
      c.fillStyle = '#14161c'; c.fillRect(0, 0, W, 230);
      c.fillStyle = '#b8bdc9'; c.font = '600 26px "Inter Display"'; c.fillText('Nachrichten', 36, 96);
      c.fillStyle = '#fff'; c.font = '700 48px "Inter Display"'; c.fillText('Team-Chat', 36, 160);
      const a = easeOutBack(clamp((t - 1.3) / .4));
      if (a > 0) {
        c.save(); c.translate(0, (1 - a) * 70); c.globalAlpha = clamp(a);
        c.fillStyle = '#fff'; c.strokeStyle = '#ff7a6b'; c.lineWidth = 5; rr(c, 36, 290, W - 72, 170, 32); c.fill(); c.stroke();
        c.fillStyle = '#c8f1df'; c.beginPath(); c.arc(116, 375, 46, 0, 7); c.fill();
        c.fillStyle = '#14161c'; c.font = '700 36px "Inter Display"'; c.textAlign = 'center'; c.fillText('L', 116, 388); c.textAlign = 'left';
        c.font = '700 34px "Inter Display"'; c.fillText('Lena', 186, 350);
        c.fillStyle = '#e5483d'; c.font = '700 38px "Inter Display"'; c.fillText('Bin krank, sorry', 186, 408);
        c.restore();
      }
    }
    // schedule view (cross-fades in)
    const fa = clamp((t - 5.2) / .4);
    if (fa > 0) {
      c.save(); c.globalAlpha = fa;
      c.fillStyle = '#f7f8fb'; c.fillRect(0, 0, W, H);
      c.fillStyle = '#14161c'; c.fillRect(0, 0, W, 230);
      c.fillStyle = '#b8bdc9'; c.font = '600 26px "Inter Display"'; c.fillText('Teamleitung · Live', 36, 96);
      c.fillStyle = '#22c08a'; c.beginPath(); c.arc(W - 56, 88, 10, 0, 7); c.fill();
      c.fillStyle = '#fff'; c.font = '700 48px "Inter Display"'; c.fillText('Samstag · Früh', 36, 160);
      const taken = t >= 7.8;
      const rows = [
        { n: taken ? 'Anna übernimmt' : '06:00 – 14:00', s: taken ? '06:00 – 14:00' : 'Wer springt ein?', open: true },
        { n: 'Mehmet', s: '14:00 – 22:00', col: '#cfd9ff' },
        { n: 'Marat', s: 'Kasse 2 ab 10:00', col: '#ffd6cf' },
      ];
      rows.forEach((r, i) => {
        const a = easeOut(clamp((t - 5.6 - i * .3) / .5)); if (a <= 0) return;
        const y = 270 + i * 150, x = 36 + (1 - a) * 320;
        let pop = 1; if (r.open && taken) pop = 1 + .07 * Math.sin(clamp((t - 7.8) / .35) * Math.PI);
        c.save(); c.globalAlpha = a * fa; c.translate(x + (W - 72) / 2, y + 62); c.scale(pop, pop); c.translate(-(x + (W - 72) / 2), -(y + 62));
        if (r.open) { c.fillStyle = taken ? '#ddf7ec' : '#ffe9e6'; c.strokeStyle = taken ? '#22c08a' : '#ff7a6b'; c.lineWidth = 5; }
        else { c.fillStyle = '#fff'; c.strokeStyle = '#e7e9f0'; c.lineWidth = 3; }
        rr(c, x, y, W - 72, 124, 28); c.fill(); c.stroke();
        c.fillStyle = r.open ? (taken ? '#9ce0c3' : '#ffb9ae') : r.col; c.beginPath(); c.arc(x + 62, y + 62, 38, 0, 7); c.fill();
        c.fillStyle = '#14161c'; c.font = '700 30px "Inter Display"'; c.textAlign = 'center'; c.fillText(r.open ? (taken ? 'A' : '?') : r.n[0], x + 62, y + 74); c.textAlign = 'left';
        c.font = '700 33px "Inter Display"'; c.fillText(r.n, x + 126, y + 56);
        c.fillStyle = '#6b7080'; c.font = '600 26px "Inter Display"'; c.fillText(r.s, x + 126, y + 96);
        if (r.open && !taken) {
          c.fillStyle = '#e5483d'; rr(c, x + W - 72 - 120, y + 40, 90, 44, 22); c.fill();
          c.fillStyle = '#fff'; c.font = '700 26px "Inter Display"'; c.textAlign = 'center'; c.fillText('frei', x + W - 72 - 75, y + 71); c.textAlign = 'left';
        } else {
          const k = r.open ? easeOutBack(clamp((t - 7.8) / .35)) : easeOutBack(clamp((t - 6.2 - i * .25) / .35));
          if (k > 0) {
            c.fillStyle = '#22c08a'; c.beginPath(); c.arc(x + W - 72 - 56, y + 62, 24 * k, 0, 7); c.fill();
            c.strokeStyle = '#fff'; c.lineWidth = 6; c.lineCap = 'round'; c.beginPath(); c.moveTo(x + W - 72 - 68, y + 62); c.lineTo(x + W - 72 - 58, y + 72); c.lineTo(x + W - 72 - 42, y + 52); c.stroke();
          }
        }
        c.restore();
      });
      c.fillStyle = '#6b7080'; c.font = '600 28px "Inter Display"'; c.fillText('Offene Schichten', 36, 780);
      c.fillStyle = taken ? '#22c08a' : '#e5483d'; c.font = '700 120px "Inter Display"'; c.fillText(taken ? '0' : '1', 36, 900);
      c.restore();
    }
  });
  scene.add(phone);

  /* sick-message bubble */
  const msg = makeBubble('Bin krank, sorry', { bg: '#ffe9e6', tailLeft: false, w: 2.1 }); scene.add(msg);

  /* colleagues in avatar discs */
  function avatar(blobColor, discColor, r, s) {
    const g = new THREE.Group();
    const disc = new THREE.Mesh(new THREE.CircleGeometry(r, 40), new THREE.MeshBasicMaterial({ color: discColor })); g.add(disc);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(r, .05, 8, 40), basic(0x2b2250)); g.add(ring);
    const b = makeBlob(blobColor); b.root.scale.setScalar(s); b.root.position.set(0, -s, .35); g.add(b.root);
    b.face({ mouth: 'smile', eyeOpen: 1, look: [-.4, -.1] });
    g.userData.b = b; scene.add(g); return g;
  }
  const anna = avatar(0x7ad9b5, 0xcfeee1, .75, .5); anna.position.set(-1.45, 4.2, .3);
  const mehmet = avatar(0x9b86ff, 0xe0d9ff, .62, .42); mehmet.position.set(1.55, 4.75, .3);
  const annaBubble = makeBubble('Übernehme ich!', { bg: '#ddf7ec', tailLeft: true, w: 1.9 }); scene.add(annaBubble);

  const conf = new Confetti(46, 9); scene.add(conf.g);

  const hooks = [
    [el(ov, 'hook', 'Krankmeldung um <em>5:40 Uhr.</em> Was jetzt?'), .1, 3.6],
    [el(ov, 'hook', 'Wer springt ein?'), 3.7, 5.4],
    [el(ov, 'hook', 'Offene Schicht <em>im Plan.</em>'), 5.5, 7.9],
    [el(ov, 'hook', 'Schicht frei. <em>Kollegen sehen es sofort.</em>'), 8.0, 10.4],
    [el(ov, 'hook', 'Plan B in <em>30 Sekunden.</em>'), 10.5, 12.4],
  ];
  const end = endCard(ov);

  const SKY = [['#2b2f6b', '#ffe3da'], ['#5b4fa0', '#f1e6ff'], ['#8d7ac2', '#dfe8ff']];

  function update(t) {
    // sky
    const sk = easeInOut(seg(t, 5, 9));
    stage.style.background = `linear-gradient(180deg,${mixHex(SKY[0][0], SKY[0][1], sk)} 0%,${mixHex(SKY[1][0], SKY[1][1], sk)} 55%,${mixHex(SKY[2][0], SKY[2][1], sk)} 100%)`;
    floor.material.color.set(mixHex('#8f89cc', '#f4efff', sk));

    const sleeping = t < 2.6;
    const wake = seg(t, 2.6, 3.1);
    const mv = easeInOut(seg(t, 5.0, 5.9));
    const fx = lerp(-1.1, -1.25, mv), fs = lerp(1.05, .88, mv);
    // hops: wake-up jump and later relief hops
    let hop = 0;
    if (t >= 2.6 && t < 3.3) hop = Math.sin(seg(t, 2.6, 3.3) * Math.PI) * .8;
    if (t > 7.9 && t < 11) hop = Math.abs(Math.sin((t - 7.9) * 5.2)) * .55 * Math.exp(-(t - 7.9) * .55);
    if (t > 12) hop = Math.abs(Math.sin((t - 12) * 5.2)) * .3;
    const panic = t > 2.9 && t < 5.9 ? 1 : 0;
    frei.root.position.set(fx + Math.sin(t * 38) * .035 * panic, hop, 0);
    frei.root.scale.setScalar(fs);
    let sy = 1 + .03 * Math.sin(t * 2.2);
    if (t >= 2.6 && t < 3.3) sy = 1 + .22 * Math.sin(seg(t, 2.6, 3.3) * Math.PI) - .05;
    if (panic) sy = 1 + .06 * Math.sin(t * 9);
    frei.squash(sy);
    const blink = (t % 2.6) > 2.5 ? .1 : 1;
    frei.eyes.forEach(e => { e.visible = !sleeping; });
    sleepArcs.forEach(a => { a.visible = sleeping; });
    if (sleeping) frei.face({ mouth: 'flat', eyeOpen: .06, look: [0, 0] });
    else if (t < 5.9) frei.face({ mouth: 'open', mouthScale: 1.1 + .15 * Math.sin(t * 14), eyeOpen: lerp(.3, 1.25, easeOutBack(wake)) * (panic ? 1 : blink), look: [Math.sin(t * 5) * .6 + .6, .3] });
    else if (t < 7.9) frei.face({ mouth: 'open', mouthScale: .75, eyeOpen: blink, look: [1, .5] });
    else frei.face({ mouth: 'grin', eyeOpen: blink, look: [1, .2] });
    let up = 0;
    if (t > 2.9 && t < 5.9) up = .55 + .3 * Math.sin(t * 14);
    if (t > 8.2 && t < 10.4) up = easeOutBack(seg(t, 8.2, 8.6)) * (t < 9.9 ? 1 : 1 - seg(t, 9.9, 10.4));
    frei.arm(0, up, .1); frei.arm(1, up, .1);
    sh.position.set(frei.root.position.x, .02, 0); sh.scale.setScalar(fs * (1 - hop * .3));
    sweat.visible = t > 3.2 && t < 6.5;
    sweat.position.set(fx + .95 * fs, 2.1 - ((t * 1.1) % 1) * .8, .6);

    // Z labels
    zs.forEach((m, i) => {
      const ph = ((t * .5 + i / 3) % 1);
      m.visible = sleeping;
      m.position.set(fx + .75 + ph * .6, 2.2 + ph * 1.3, .6);
      m.scale.setScalar(.5 + ph * .7); m.material.opacity = Math.sin(ph * Math.PI) * clamp((2.6 - t) / .3 + 1);
    });

    // table + clock
    const sink = easeIn(seg(t, 4.8, 5.8));
    tableGrp.position.set(1.3, -sink * 2.2, .3); tableGrp.visible = sink < .99;
    const ringing = t < 2.6;
    clock.rotation.z = ringing ? Math.sin(t * 60) * .08 : 0;
    clock.position.y = 1.26 + (ringing ? Math.abs(Math.sin(t * 40)) * .03 : 0);
    rings.forEach((m, i) => { m.visible = ringing && (Math.floor(t * 10) + i) % 2 === 0; });
    face.userData.redraw(t < 2.6 && Math.floor(t * 3) % 2 === 1 ? '' : '05:40');

    // phone
    const k = easeInOut(seg(t, 5.0, 5.9)), kb = easeOutBack(seg(t, 5.0, 5.9));
    const vib = t > 1.3 && t < 2.5 ? Math.sin(t * 70) * .02 : 0;
    phone.position.set(lerp(1.85, .95, k) + vib, lerp(1.55, 2.2, k) - sink * 0, lerp(.6, 1.6, k));
    phone.scale.setScalar(lerp(.42, .92, kb));
    phone.rotation.set(0, Math.sin(t * 1.4) * .1 * k, lerp(-.12, 0, k) + vib * 2);
    phone.userData.redraw({ t });

    // message bubble from the phone
    const mIn = easeOutBack(seg(t, 1.4, 1.85)), mOut = easeIn(seg(t, 4.8, 5.3));
    msg.visible = t >= 1.4 && mOut < .98;
    msg.position.set(lerp(1.85, .9, easeOut(seg(t, 1.4, 1.9))) + Math.sin(t * 3) * .03, lerp(2.4, 3.5, easeOut(seg(t, 1.4, 1.9))) + Math.sin(t * 2.3) * .05, 1.0);
    msg.scale.setScalar(Math.max(.001, mIn * (1 - mOut)));
    msg.rotation.z = Math.sin(t * 2.5) * .05;

    // colleagues
    const aIn = easeOutBack(seg(t, 7.0, 7.45)), mIn2 = easeOutBack(seg(t, 7.2, 7.65));
    anna.visible = t >= 7.0; mehmet.visible = t >= 7.2;
    anna.scale.setScalar(Math.max(.001, aIn)); mehmet.scale.setScalar(Math.max(.001, mIn2));
    anna.userData.b.root.position.y = -.5 + Math.abs(Math.sin(t * 4)) * .05;
    anna.userData.b.arm(1, t > 7.5 ? .5 + .4 * Math.sin(t * 8) : 0);
    mehmet.userData.b.arm(0, t > 7.6 ? .5 + .4 * Math.sin(t * 8 + 1) : 0);
    const bIn = easeOutBack(seg(t, 7.4, 7.85));
    annaBubble.visible = t >= 7.4; annaBubble.position.set(-1.0, 3.05 + Math.sin(t * 2.4) * .04, 1.2); annaBubble.scale.setScalar(Math.max(.001, bIn));
    annaBubble.rotation.z = Math.sin(t * 2) * .04;

    conf.update(t - 8.2, [.95, 4.3, 2.2]);

    camera.position.set(Math.sin(t * .5) * .12, 3.3, 13 - .8 * seg(t, 5, 8));
    camera.lookAt(0, 3.3, 0);
    for (const [e, a, b] of hooks) show(e, t, a, b);
    end.update(t, 12.6);
    renderer.render(scene, camera);
  }
  return { duration: 15, update };
}

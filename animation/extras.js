import { THREE, RoundedBoxGeometry, clamp, rng, toon, basic, outline, ball, rr } from './lib.js';

/* "#rrggbb" mix between two colors (for sky gradients) */
export function mixHex(a, b, t) {
  const ca = new THREE.Color(a), cb = new THREE.Color(b); return '#' + ca.lerp(cb, clamp(t)).getHexString();
}

/* flat text plane (clock face, "Z", counters). m.userData.redraw(text) changes the text */
export function makeLabel(text, { w = 1, h = .5, font = '700 120px "Inter Display"', color = '#fff', bg = null, px = 512 } = {}) {
  const cv = document.createElement('canvas'); cv.width = px; cv.height = Math.round(px * h / w); const c = cv.getContext('2d');
  const paint = (txt) => {
    c.clearRect(0, 0, cv.width, cv.height);
    if (bg) { c.fillStyle = bg; rr(c, 0, 0, cv.width, cv.height, cv.height * .2); c.fill(); }
    c.fillStyle = color; c.font = font; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(txt, cv.width / 2, cv.height / 2 + 6);
  };
  paint(text);
  const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace;
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide, depthWrite: false }));
  m.userData.redraw = (txt) => { paint(txt); tex.needsUpdate = true; };
  return m;
}

/* night cap for the mascot: frei.b.add(makeCap()) */
export function makeCap(color = 0x4d6ff0) {
  const g = new THREE.Group();
  const cone = new THREE.Mesh(new THREE.ConeGeometry(.72, 1.15, 24), toon(color)); outline(cone, .05); cone.position.y = .45; g.add(cone);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(.7, .13, 10, 28), toon(0xffffff)); rim.rotation.x = Math.PI / 2; outline(rim, .06); g.add(rim);
  const pom = ball(.17, 0xffffff, 1, 1, 1, .06); pom.position.set(.15, 1.1, 0); g.add(pom);
  g.position.set(.1, .82, -.02); g.rotation.z = -.3; return g;
}

/* cute assistant robot, origin at its feet, about 2 units tall */
export function makeRobot() {
  const g = new THREE.Group();
  const head = new THREE.Mesh(new RoundedBoxGeometry(1.3, 1.0, 1.0, 4, .25), toon(0x4d6ff0)); outline(head, .05); head.position.y = .9; g.add(head);
  const body = new THREE.Mesh(new RoundedBoxGeometry(.8, .6, .7, 4, .2), toon(0x7c9bff)); outline(body, .06); body.position.y = .1; g.add(body);
  for (const s of [-1, 1]) {
    const e = ball(.15, 0xffffff, 1, 1.1, .5, 0); e.position.set(s * .3, .98, .5); g.add(e);
    const p = ball(.08, 0x2b2250, 1, 1.1, .6, 0); p.position.z = .1; e.add(p);
    const ch = ball(.1, 0xff9cb0, 1, .6, .3, 0); ch.position.set(s * .5, .76, .48); g.add(ch);
  }
  const sm = new THREE.Mesh(new THREE.TorusGeometry(.1, .03, 8, 18, Math.PI), basic(0xffffff)); sm.rotation.z = Math.PI; sm.position.set(0, .8, .51); g.add(sm);
  const st = new THREE.Mesh(new THREE.CylinderGeometry(.03, .03, .35, 8), basic(0x2b2250)); st.position.y = 1.55; g.add(st);
  const tip = ball(.12, 0xff7a6b, 1, 1, 1, .05); tip.position.y = 1.78; g.add(tip);
  g.userData.tip = tip; return g;
}

/* twinkling stars in the back; update with twinkle(group, t) */
export function makeStars(n = 40, seed = 11) {
  const g = new THREE.Group(), r = rng(seed); g.userData.items = [];
  for (let i = 0; i < n; i++) {
    const s = new THREE.Mesh(new THREE.SphereGeometry(.04 + r() * .05, 8, 6), basic(0xffffff, { transparent: true }));
    s.position.set((r() - .5) * 7, 2 + r() * 6.5, -4 - r() * 2); s.userData.ph = r() * 6; g.add(s); g.userData.items.push(s);
  }
  return g;
}
export function twinkle(g, t, alpha = 1) { for (const s of g.userData.items) s.material.opacity = alpha * (.45 + .55 * Math.abs(Math.sin(t * 2 + s.userData.ph))); g.visible = alpha > .02; }

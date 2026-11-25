import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
export const GAME = typeof location !== 'undefined' && new URLSearchParams(location.search).has('game');
export { THREE, RoundedBoxGeometry };

/* ---------- math / easing ---------- */
export const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lerp = (a, b, t) => a + (b - a) * t;
export const seg = (t, t0, t1) => clamp((t - t0) / (t1 - t0));
export const easeInOut = t => (t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
export const easeOut = t => 1 - Math.pow(1 - t, 3);
export const easeIn = t => t * t * t;
export const easeOutBack = t => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
export const bounceOut = t => { const n = 7.5625, d = 2.75; if (t < 1 / d) return n * t * t; if (t < 2 / d) return n * (t -= 1.5 / d) * t + .75; if (t < 2.5 / d) return n * (t -= 2.25 / d) * t + .9375; return n * (t -= 2.625 / d) * t + .984375; };
export function rng(seed) { let a = seed >>> 0; return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

/* ---------- materials ---------- */
const gradTex = (() => { const d = new Uint8Array([110, 190, 255, 255]); const t = new THREE.DataTexture(d, 4, 1, THREE.RedFormat); t.minFilter = t.magFilter = THREE.NearestFilter; t.needsUpdate = true; return t; })();
export const toon = c => GAME
  ? new THREE.MeshPhysicalMaterial({ color: c, roughness: .42, metalness: 0, clearcoat: .65, clearcoatRoughness: .28, sheen: .35, sheenRoughness: .6, sheenColor: new THREE.Color(0xffffff) })
  : new THREE.MeshToonMaterial({ color: c, gradientMap: gradTex });
export const basic = (c, o = {}) => new THREE.MeshBasicMaterial({ color: c, ...o });
export function outline(mesh, thick = 0.05, color = 0x2b2250) {
  if (GAME) return null;
  const m = new THREE.Mesh(mesh.geometry, new THREE.MeshBasicMaterial({ color, side: THREE.BackSide }));
  m.scale.setScalar(1 + thick); mesh.add(m); return m;
}
export function ball(r, color, sx = 1, sy = 1, sz = 1, ol = 0.05) {
  const m = new THREE.Mesh(new THREE.SphereGeometry(r, 28, 20), toon(color)); m.scale.set(sx, sy, sz); if (ol) outline(m, ol); return m;
}

/* ---------- stage ---------- */
export function setupStage() {
  const canvas = document.getElementById('c');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(2); renderer.setSize(540, 960, false); canvas.style.width = '540px'; canvas.style.height = '960px';
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 540 / 960, 0.1, 100);
  camera.position.set(0, 3.3, 13); camera.lookAt(0, 3.3, 0);
  scene.add(new THREE.AmbientLight(0xffffff, 1.35));
  const sun = new THREE.DirectionalLight(0xffffff, 2.2); sun.position.set(3, 7, 6); scene.add(sun);
  if (GAME) {
    renderer.toneMapping = THREE.NeutralToneMapping; renderer.toneMappingExposure = 1.0;
    renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    const pm = new THREE.PMREMGenerator(renderer); scene.environment = pm.fromScene(new RoomEnvironment(), .04).texture; scene.environmentIntensity = .75;
    scene.children.filter(o => o.isAmbientLight).forEach(a => a.intensity = .35);
    sun.intensity = 2.4; sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048);
    Object.assign(sun.shadow.camera, { left: -5, right: 5, top: 8, bottom: -3, near: .5, far: 30 }); sun.shadow.camera.updateProjectionMatrix();
    sun.shadow.radius = 6; sun.shadow.bias = -.0015; sun.shadow.normalBias = .06;
    const rim = new THREE.DirectionalLight(0xffd9cf, 1.1); rim.position.set(-5, 5, -5); scene.add(rim);
    const orig = renderer.render.bind(renderer);
    renderer.render = (sc, cam) => { sc.traverse(o => { if (o.isMesh) { const tr = o.material && o.material.transparent; o.castShadow = !tr; o.receiveShadow = !tr; } }); orig(sc, cam); };
  }
  return { renderer, scene, camera, sun };
}
export function floorDisc(color = 0xe9e4ff, r = 5) {
  const mat = GAME ? new THREE.MeshPhysicalMaterial({ color, roughness: .35, clearcoat: .4 }) : toon(color);
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, .3, 64), mat); m.position.y = -.15; return m;
}
export function blobShadow(r = 1) {
  if (GAME) { const g = new THREE.Group(); g.visible = false; return g; }
  const m = new THREE.Mesh(new THREE.CircleGeometry(r, 32), new THREE.MeshBasicMaterial({ color: 0x2b2250, transparent: true, opacity: .16, depthWrite: false }));
  m.rotation.x = -Math.PI / 2; m.position.y = .02; return m;
}

/* ---------- mascot ---------- */
export function makeBlob(color = 0xff7a6b) {
  const root = new THREE.Group(), sq = new THREE.Group(), b = new THREE.Group();
  root.add(sq); sq.add(b); b.position.y = 1;
  const body = ball(1, color, 1, .94, .95, .045); b.add(body);
  const eyes = [], pupils = [];
  for (const s of [-1, 1]) {
    const e = ball(.27, 0xffffff, 1, 1.2, .55, 0); e.position.set(s * .37, .28, .83); e.rotation.y = s * .35; b.add(e); eyes.push(e);
    const p = ball(.15, 0x2b2250, 1, 1.15, .6, 0); p.position.set(0, 0, .22); e.add(p); pupils.push(p);
    const h = ball(.05, 0xffffff, 1, 1, 1, 0); h.position.set(.05, .07, .12); p.add(h);
    const ch = ball(.17, 0xff9cb0, 1, .6, .25, 0); ch.position.set(s * .66, -.1, .68); ch.rotation.y = s * .8; b.add(ch);
  }
  const mouths = {};
  const smile = new THREE.Mesh(new THREE.TorusGeometry(.17, .04, 8, 24, Math.PI), basic(0x2b2250)); smile.rotation.z = Math.PI; smile.position.set(0, -.02, .94);
  const frown = new THREE.Mesh(new THREE.TorusGeometry(.15, .04, 8, 24, Math.PI), basic(0x2b2250)); frown.position.set(0, -.2, .94);
  const open = ball(.2, 0x5a1f2e, 1, 1.1, .4, 0); open.position.set(0, -.12, .93); const tongue = ball(.1, 0xff7f95, 1, .6, .5, 0); tongue.position.set(0, -.1, .1); open.add(tongue);
  const flat = new THREE.Mesh(new THREE.BoxGeometry(.24, .04, .04), basic(0x2b2250)); flat.position.set(0, -.12, .95);
  const grin = ball(.22, 0x5a1f2e, 1.15, .65, .4, 0); grin.position.set(0, -.1, .93);
  Object.assign(mouths, { smile, frown, open, flat, grin }); const base = {}; for (const k in mouths) { b.add(mouths[k]); base[k] = mouths[k].scale.clone(); }
  const arms = [];
  for (const s of [-1, 1]) { const a = ball(.21, color, 1, 1, 1, .06); a.position.set(s * .98, -.15, .05); b.add(a); arms.push(a); }
  for (const s of [-1, 1]) { const f = ball(.27, color, 1.1, .55, 1, .06); f.position.set(s * .4, -.9, .3); b.add(f); }
  const api = {
    root, sq, b, eyes, pupils, arms, body,
    face({ mouth = 'smile', eyeOpen = 1, look = [0, 0], mouthScale = 1 } = {}) {
      for (const k in mouths) mouths[k].visible = k === mouth;
      if (mouths[mouth]) mouths[mouth].scale.copy(base[mouth]).multiplyScalar(mouthScale);
      eyes.forEach(e => { e.scale.y = 1.2 * Math.max(.06, eyeOpen); });
      pupils.forEach(p => { p.position.x = look[0] * .08; p.position.y = look[1] * .08; p.visible = eyeOpen > .3; });
    },
    squash(sy) { sq.scale.set(1 / Math.sqrt(sy), sy, 1 / Math.sqrt(sy)); },
    arm(i, raise, out = 0) { arms[i].position.y = -.15 + raise * .7; arms[i].position.x = (i === 0 ? -1 : 1) * (.98 + out - raise * .18); },
  };
  api.face(); return api;
}

/* ---------- chat bubble ---------- */
function rr(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
export function makeBubble(text, { bg = '#ffffff', fg = '#2b2250', w = 2.5, tailLeft = true, border = '#2b2250' } = {}) {
  const W = 640, H = 260, cv = document.createElement('canvas'); cv.width = W; cv.height = H; const c = cv.getContext('2d');
  c.fillStyle = bg; c.strokeStyle = border; c.lineWidth = 10; c.lineJoin = 'round';
  rr(c, 14, 14, W - 28, 170, 64); c.fill(); c.stroke();
  c.beginPath(); const tx = tailLeft ? 110 : W - 110, d = tailLeft ? 1 : -1;
  c.moveTo(tx, 176); c.lineTo(tx + d * 10, 244); c.lineTo(tx + d * 74, 176); c.closePath(); c.fill(); c.stroke();
  c.fillStyle = bg; c.fillRect(tx - 6 * d + (tailLeft ? 4 : -70), 170, 70, 14);
  c.fillStyle = fg; c.textAlign = 'center'; c.textBaseline = 'middle';
  let size = 58; c.font = `700 ${size}px "Inter Display", sans-serif`;
  while (c.measureText(text).width > W - 100 && size > 26) { size -= 2; c.font = `700 ${size}px "Inter Display", sans-serif`; }
  c.fillText(text, W / 2, 100);
  const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, w * H / W), new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide, depthWrite: false }));
  return m;
}

/* ---------- phone ---------- */
export function makePhone(drawScreen) {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new RoundedBoxGeometry(1.8, 3.6, .22, 4, .26), toon(0x1f2233)); outline(body, .03); g.add(body);
  const cv = document.createElement('canvas'); cv.width = 540; cv.height = 1080; const ctx = cv.getContext('2d');
  const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 3.2), new THREE.MeshBasicMaterial({ map: tex })); screen.position.z = .115; g.add(screen);
  g.userData.redraw = (state) => { drawScreen(ctx, state, 540, 1080); tex.needsUpdate = true; };
  g.userData.redraw({ p: 0 });
  return g;
}
export { rr };

/* ---------- confetti ---------- */
export class Confetti {
  constructor(n = 40, seed = 3, colors = [0xff7a6b, 0x4d6ff0, 0x22c08a, 0xffd23f, 0x7c5cff]) {
    this.g = new THREE.Group(); this.items = [];
    const r = rng(seed);
    for (let i = 0; i < n; i++) {
      const m = new THREE.Mesh(new THREE.BoxGeometry(.14, .22, .03), basic(colors[i % colors.length])); this.g.add(m);
      this.items.push({ m, vx: (r() - .5) * 5, vy: 3 + r() * 4, vz: (r() - .5) * 2, rx: r() * 8, rz: r() * 8 });
    }
  }
  update(t, origin = [0, 2, 1]) {
    this.g.visible = t > 0 && t < 2.6;
    for (const it of this.items) {
      it.m.position.set(origin[0] + it.vx * t, origin[1] + it.vy * t - 4.2 * t * t, origin[2] + it.vz * t);
      it.m.rotation.set(it.rx * t, 0, it.rz * t); it.m.scale.setScalar(clamp(1 - (t - 1.8) / .8));
    }
  }
}

/* ---------- overlay helpers (DOM) ---------- */
export function el(parent, cls, html) { const e = document.createElement('div'); e.className = cls; e.innerHTML = html; parent.appendChild(e); return e; }
/* show element between t0 and t1 with pop-in */
export function show(e, t, t0, t1, { inDur = .28, outDur = .2 } = {}) {
  const a = seg(t, t0, t0 + inDur), o = 1 - seg(t, t1 - outDur, t1);
  const op = t < t0 || t > t1 ? 0 : Math.min(a, o);
  e.style.opacity = op;
  const sc = lerp(.82, 1, easeOutBack(a)) * lerp(.96, 1, o);
  e.style.transform = `translate(-50%, ${lerp(14, 0, easeOut(a))}px) scale(${sc})`;
}

/* ---------- common scene parts ---------- */
export function endCard(parent) {
  const veil = el(parent, 'veil', '');
  const card = el(parent, 'endcard', `<div class="mark"><i></i><b></b></div><div class="brand">FreiForms</div><div class="claim">Schichtplan ohne Chaos</div><div class="cta">Mehr im Profil</div>`);
  return { veil, card, update(t, t0) {
    const a = seg(t, t0, t0 + .5); veil.style.opacity = a * .97;
    const b = seg(t, t0 + .25, t0 + .85); card.style.opacity = b; card.style.transform = `translate(-50%,-50%) scale(${lerp(.85, 1, easeOutBack(b))})`;
  } };
}

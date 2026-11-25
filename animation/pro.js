import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
export { THREE, RoundedBoxGeometry };

/* ---------- "Quiet Premium" stage: dark graphite, cinematic light, bloom, grade ---------- */
const GradeShader = {
  uniforms: { tDiffuse: { value: null }, uTime: { value: 0 }, uVig: { value: .3 }, uGrain: { value: .035 } },
  vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }`,
  fragmentShader: `uniform sampler2D tDiffuse; uniform float uTime, uVig, uGrain; varying vec2 vUv;
    float h(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233))) * 43758.5453); }
    void main(){
      vec4 c = texture2D(tDiffuse, vUv);
      vec2 d = vUv - .5; d.x *= .75;
      float v = smoothstep(.85, .2, length(d)); c.rgb *= mix(1. - uVig, 1., v);
      c.rgb += (h(vUv * 1000. + uTime) - .5) * uGrain;
      gl_FragColor = c; }`,
};

export function proStage({ bg = 0x08090d, bloom = .5, threshold = .78, exposure = 1.0 } = {}) {
  const canvas = document.getElementById('c');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, preserveDrawingBuffer: true });
  renderer.setPixelRatio(2); renderer.setSize(540, 960, false);
  canvas.style.width = '540px'; canvas.style.height = '960px';
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = exposure;
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  scene.background = backdrop();
  scene.fog = new THREE.FogExp2(bg, .02);
  const pm = new THREE.PMREMGenerator(renderer);
  scene.environment = pm.fromScene(new RoomEnvironment(), .04).texture;
  scene.environmentIntensity = .55;

  const camera = new THREE.PerspectiveCamera(30, 540 / 960, .1, 100);
  camera.position.set(0, 0, 15); camera.lookAt(0, 0, 0);

  const key = new THREE.SpotLight(0xffe2c4, 140, 40, .55, .8, 1.6); key.position.set(-6, 9, 8); key.target.position.set(0, 0, 0);
  key.castShadow = true; key.shadow.mapSize.set(2048, 2048); key.shadow.bias = -.0005;
  scene.add(key, key.target);
  const rim = new THREE.DirectionalLight(0x8fb4ff, 3.4); rim.position.set(6, 3, -6); scene.add(rim);
  const fill = new THREE.HemisphereLight(0x9aa6c8, 0x0b0c10, .25); scene.add(fill);

  const rt = new THREE.WebGLRenderTarget(1080, 1920, { type: THREE.HalfFloatType, samples: 4 });
  const composer = new EffectComposer(renderer, rt);
  composer.setPixelRatio(2); composer.setSize(540, 960);
  composer.addPass(new RenderPass(scene, camera));
  const bloomPass = new UnrealBloomPass(new THREE.Vector2(540, 960), bloom, .75, threshold); composer.addPass(bloomPass);
  const grade = new ShaderPass(GradeShader); composer.addPass(grade);
  composer.addPass(new OutputPass());

  return { renderer, scene, camera, key, rim, fill, bloomPass, grade, render(t = 0) { grade.uniforms.uTime.value = t; composer.render(); } };
}

/* deep graphite backdrop with a warm glow low-right and a cool glow top-left */
export function backdrop({ warm = [255, 138, 110], cool = [110, 150, 255], wx = .68, wy = .62, cx = .18, cy = .12 } = {}) {
  const cv = document.createElement('canvas'); cv.width = 540; cv.height = 960; const c = cv.getContext('2d');
  c.fillStyle = '#07080b'; c.fillRect(0, 0, 540, 960);
  const glow = (x, y, r, rgb, a) => { const g = c.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, `rgba(${rgb},${a})`); g.addColorStop(1, `rgba(${rgb},0)`); c.fillStyle = g; c.fillRect(0, 0, 540, 960); };
  glow(540 * wx, 960 * wy, 520, warm.join(','), .16);
  glow(540 * cx, 960 * cy, 460, cool.join(','), .10);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; return t;
}

/* ---------- volumetric light beam + floating dust ---------- */
export function lightBeam({ from = [-6, 9, 8], to = [0, -1, 0], radius = 3.2, color = 0xffe7cc, opacity = .07 } = {}) {
  const a = new THREE.Vector3(...from), b = new THREE.Vector3(...to), len = a.distanceTo(b);
  const geo = new THREE.ConeGeometry(radius, len, 48, 1, true); geo.translate(0, -len / 2, 0);
  const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, fog: false });
  const m = new THREE.Mesh(geo, mat); m.position.copy(a);
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, -1, 0), b.clone().sub(a).normalize());
  return m;
}
export function dust(n = 420, seed = 7) {
  let s = seed; const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
  const pos = new Float32Array(n * 3), base = [];
  for (let i = 0; i < n; i++) { base.push([(r() - .5) * 9, (r() - .5) * 14, (r() - .5) * 8 - 1, r() * 6.28]); }
  const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const cv = document.createElement('canvas'); cv.width = cv.height = 64; const c = cv.getContext('2d');
  const gr = c.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = gr; c.fillRect(0, 0, 64, 64);
  const mat = new THREE.PointsMaterial({ size: .05, map: new THREE.CanvasTexture(cv), transparent: true, opacity: .55, depthWrite: false, blending: THREE.AdditiveBlending, color: 0xffe9d6 });
  const pts = new THREE.Points(geo, mat);
  pts.userData.update = (t) => { base.forEach((b, i) => { pos[i * 3] = b[0] + Math.sin(t * .25 + b[3]) * .25; pos[i * 3 + 1] = b[1] + ((t * .12 + b[3]) % 1) * .6; pos[i * 3 + 2] = b[2] + Math.cos(t * .2 + b[3]) * .2; }); geo.attributes.position.needsUpdate = true; };
  pts.userData.update(0); return pts;
}

/* ---------- premium phone: titanium frame, glass, bright unlit screen ---------- */
export function proPhone(draw, { w = 1.95, h = 4.05, sw = 720, sh = 1500 } = {}) {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new RoundedBoxGeometry(w, h, .24, 8, .34), new THREE.MeshPhysicalMaterial({ color: 0x3a3c42, metalness: 1, roughness: .32, clearcoat: .3 }));
  body.castShadow = true; g.add(body);
  const bezel = new THREE.Mesh(new RoundedBoxGeometry(w - .06, h - .06, .02, 6, .3), new THREE.MeshPhysicalMaterial({ color: 0x050506, roughness: .15 }));
  bezel.position.z = .118; g.add(bezel);
  const cv = document.createElement('canvas'); cv.width = sw; cv.height = sh; const ctx = cv.getContext('2d');
  const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
  const sW = w - .16, sH = h - .16;
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(sW, sH), new THREE.MeshBasicMaterial({ map: tex, toneMapped: false, alphaMap: roundedMask(sW, sH, .27), transparent: true }));
  screen.position.z = .131; g.add(screen);
  const glass = new THREE.Mesh(new THREE.PlaneGeometry(sW, sH), new THREE.MeshPhysicalMaterial({ color: 0x000000, roughness: .04, metalness: 0, clearcoat: 1, transparent: true, opacity: .06, envMapIntensity: 2.2, alphaMap: roundedMask(sW, sH, .27) }));
  glass.position.z = .134; g.add(glass);
  const island = new THREE.Mesh(new RoundedBoxGeometry(.52, .15, .01, 4, .07), new THREE.MeshBasicMaterial({ color: 0x000000 }));
  island.position.set(0, sH / 2 - .17, .136); g.add(island);
  g.userData.redraw = (state) => { draw(ctx, state, sw, sh); tex.needsUpdate = true; };
  g.userData.redraw({});
  return g;
}
function roundedMask(w, h, r) {
  const cv = document.createElement('canvas'); cv.width = 256; cv.height = Math.round(256 * h / w); const c = cv.getContext('2d');
  c.fillStyle = '#000'; c.fillRect(0, 0, cv.width, cv.height); c.fillStyle = '#fff'; rrect(c, 0, 0, cv.width, cv.height, r / w * cv.width); c.fill();
  return new THREE.CanvasTexture(cv);
}

/* ---------- frosted glass card with crisp content ---------- */
export function glassCard(draw, { w = 2.05, h = .62, px = 900 } = {}) {
  const g = new THREE.Group();
  const slab = new THREE.Mesh(new RoundedBoxGeometry(w, h, .04, 6, .17), new THREE.MeshPhysicalMaterial({ color: 0x14161c, roughness: .16, metalness: .1, clearcoat: 1, clearcoatRoughness: .06, transparent: true, opacity: .62, envMapIntensity: 1.6, depthWrite: false }));
  g.add(slab);
  const edge = new THREE.Mesh(new RoundedBoxGeometry(w + .025, h + .025, .01, 6, .18), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: .14, depthWrite: false }));
  edge.position.z = -.012; g.add(edge);
  const cv = document.createElement('canvas'); cv.width = px; cv.height = Math.round(px * h / w); const c = cv.getContext('2d');
  draw(c, cv.width, cv.height);
  // glass sheen behind the content: light top edge fading down
  c.save(); c.globalCompositeOperation = 'destination-over';
  const sh = c.createLinearGradient(0, 0, 0, cv.height); sh.addColorStop(0, 'rgba(255,255,255,.16)'); sh.addColorStop(.45, 'rgba(255,255,255,.04)'); sh.addColorStop(1, 'rgba(255,255,255,.02)');
  c.fillStyle = sh; rrect(c, 0, 0, cv.width, cv.height, cv.height * .23); c.fill(); c.restore();
  const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
  const face = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex, transparent: true, toneMapped: false, depthWrite: false }));
  face.position.z = .032; g.add(face);
  return g;
}

/* ---------- canvas helpers ---------- */
export function rrect(c, x, y, w, h, r) { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }
export const F = (w, s) => `${w} ${s}px "Inter Display", system-ui, sans-serif`;

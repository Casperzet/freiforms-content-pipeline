import { THREE, RoundedBoxGeometry, rng } from './lib.js';

/* Shared "game" environment: a small shop / cafe corner behind the characters.
   const set = makeSet(scene, { mood: 'day' | 'dawn' | 'night' });  then each frame: set.update(t, light01)
   light01: 0 = night, 1 = full day (drives window glow, lamp, wall tint). */
const P = (color, rough = .7, extra = {}) => new THREE.MeshPhysicalMaterial({ color, roughness: rough, ...extra });

export function makeSet(scene, { mood = 'day', seed = 4, sun = null } = {}) {
  const g = new THREE.Group(); scene.add(g);
  const r = rng(seed);

  // floor: large glossy tiles
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), P(0xefe9f5, .38, { clearcoat: .5, clearcoatRoughness: .3 }));
  floor.rotation.x = -Math.PI / 2; floor.position.y = -.002; g.add(floor);

  // back wall + wainscot
  const wallMat = P(0xf3e4dc, .9);
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(30, 16), wallMat); wall.position.set(0, 7, -6.5); g.add(wall);
  const wains = new THREE.Mesh(new RoundedBoxGeometry(30, 2.2, .3, 2, .08), P(0xd9c8f0, .6)); wains.position.set(0, 1.1, -6.35); g.add(wains);

  // window on the right with emissive sky
  const winSky = new THREE.MeshBasicMaterial({ color: 0xbfe3ff });
  const win = new THREE.Group(); win.position.set(3.2, 4.8, -6.3); g.add(win);
  const pane = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 3.4), winSky); win.add(pane);
  const frameMat = P(0xffffff, .5);
  for (const [w, h, x, y] of [[3.5, .18, 0, 1.75], [3.5, .18, 0, -1.75], [.18, 3.6, 1.66, 0], [.18, 3.6, -1.66, 0], [.1, 3.4, 0, 0], [3.2, .1, 0, 0]]) {
    const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, .2), frameMat); b.position.set(x, y, .08); win.add(b);
  }

  // shelves with products on the left
  const shelfMat = P(0xc89b6d, .55);
  const prodCols = [0xff7a6b, 0x4d6ff0, 0x22c08a, 0xffd23f, 0x7c5cff, 0xff9cb0, 0xffffff];
  for (const y of [3.4, 5.0, 6.6]) {
    const sh = new THREE.Mesh(new RoundedBoxGeometry(4.6, .14, .9, 2, .05), shelfMat); sh.position.set(-3.1, y, -6.0); g.add(sh);
    let x = -5.2;
    while (x < -1.1) {
      const kind = r();
      const c = prodCols[Math.floor(r() * prodCols.length)];
      let m;
      if (kind < .45) { const h = .5 + r() * .5; m = new THREE.Mesh(new RoundedBoxGeometry(.42, h, .42, 2, .06), P(c, .45, { clearcoat: .4 })); m.position.set(x + .22, y + .07 + h / 2, -6.0); x += .5; }
      else if (kind < .8) { const h = .5 + r() * .4; m = new THREE.Mesh(new THREE.CylinderGeometry(.17, .17, h, 20), P(c, .25, { clearcoat: .8 })); m.position.set(x + .18, y + .07 + h / 2, -6.0); x += .42; }
      else { m = new THREE.Mesh(new THREE.SphereGeometry(.22, 20, 14), P(c, .4)); m.position.set(x + .22, y + .29, -6.0); x += .5; }
      g.add(m);
    }
  }

  // counter at the back
  const counter = new THREE.Mesh(new RoundedBoxGeometry(5.5, 1.6, 1.2, 3, .12), P(0x2b2250, .5, { clearcoat: .3 }));
  counter.position.set(3.6, .8, -4.8); g.add(counter);
  const top = new THREE.Mesh(new RoundedBoxGeometry(5.7, .14, 1.4, 2, .05), P(0xf2efe9, .3, { clearcoat: .6 }));
  top.position.set(3.6, 1.67, -4.8); g.add(top);

  // pendant lamps with glowing bulbs
  const bulbMat = new THREE.MeshBasicMaterial({ color: 0xfff1c9 });
  const lamps = [];
  for (const x of [-2.4, 2.4]) {
    const cord = new THREE.Mesh(new THREE.CylinderGeometry(.02, .02, 3, 6), P(0x2b2250, .6)); cord.position.set(x, 9.3, -3.5); g.add(cord);
    const shade = new THREE.Mesh(new THREE.ConeGeometry(.6, .6, 28, 1, true), P(0xff7a6b, .45, { side: THREE.DoubleSide })); shade.position.set(x, 7.7, -3.5); g.add(shade);
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(.16, 16, 12), bulbMat); bulb.position.set(x, 7.42, -3.5); g.add(bulb);
    const pl = new THREE.PointLight(0xffd7a0, 6, 9, 2); pl.position.set(x, 7.2, -3.5); g.add(pl); lamps.push(pl);
  }

  // plant
  const pot = new THREE.Mesh(new THREE.CylinderGeometry(.5, .38, .8, 24), P(0xf2efe9, .5)); pot.position.set(-3.4, .4, -3.2); g.add(pot);
  for (let i = 0; i < 9; i++) {
    const a = i / 9 * Math.PI * 2, rr = .25 + r() * .25;
    const leaf = new THREE.Mesh(new THREE.SphereGeometry(.32 + r() * .12, 16, 12), P(0x2fa36b, .55));
    leaf.scale.set(1, 1.5, .6); leaf.position.set(-3.4 + Math.cos(a) * rr, 1.2 + r() * .9, -3.2 + Math.sin(a) * rr); leaf.rotation.set(r(), a, r() * .5); g.add(leaf);
  }

  const dayWall = new THREE.Color(0xf3e4dc), nightWall = new THREE.Color(0x2c2f5e);
  const daySky = new THREE.Color(0xbfe3ff), dawnSky = new THREE.Color(0xffc2a6), nightSky = new THREE.Color(0x1b2156);
  const init = { day: 1, dawn: .55, night: 0 }[mood] ?? 1;
  const api = {
    group: g,
    update(t, light = init) {
      wallMat.color.copy(nightWall).lerp(dayWall, light);
      if (light < .5) winSky.color.copy(nightSky).lerp(dawnSky, light * 2); else winSky.color.copy(dawnSky).lerp(daySky, (light - .5) * 2);
      lamps.forEach(l => { l.intensity = 3 + 6 * (1 - light); });
      // dim the whole scene at night: key light, environment, ambient
      if (sun) sun.intensity = .45 + 1.95 * light;
      scene.environmentIntensity = .22 + .53 * light;
      scene.children.forEach(o => { if (o.isAmbientLight) o.intensity = .12 + .23 * light; if (o.isHemisphereLight) o.intensity = .2 + .7 * light; });
    },
  };
  api.update(0, init);
  return api;
}

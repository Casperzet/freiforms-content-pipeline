import { setupStage, makeBlob, makePhone, rr } from './lib.js';
import { makeSet } from './set.js';

/* look-dev test scene for the game style */
export function build(stage, ov) {
  stage.style.background = '#f3e4dc';
  const { renderer, scene, camera } = setupStage();
  const set = makeSet(scene, { mood: 'day' });
  const frei = makeBlob(0xff7a6b); scene.add(frei.root); frei.root.position.set(-1.2, 0, 0); frei.root.scale.setScalar(.95);
  frei.face({ mouth: 'grin', look: [1, .2] });
  const phone = makePhone((c, st, W, H) => { c.fillStyle = '#f7f8fb'; c.fillRect(0, 0, W, H); c.fillStyle = '#14161c'; c.fillRect(0, 0, W, 230); c.fillStyle = '#fff'; c.font = '700 48px "Inter Display"'; c.fillText('Samstag · Früh', 36, 160);
    ['Anna', 'Mehmet', 'Lena'].forEach((n, i) => { c.fillStyle = '#fff'; rr(c, 36, 270 + i * 150, W - 72, 124, 28); c.fill(); c.fillStyle = '#14161c'; c.font = '700 34px "Inter Display"'; c.fillText(n, 160, 340 + i * 150); }); });
  phone.position.set(1.0, 2.2, 1.4); phone.scale.setScalar(.92); phone.rotation.y = -.15; scene.add(phone);
  return { duration: 2, update(t) { set.update(t, t < 1 ? 1 : 0); renderer.render(scene, camera); } };
}

import { THREE } from './lib.js';

/* "Game" look: physical materials, soft shadows, image-based-like ambient light, screen glow.
   Use: const G = gameStage(renderer, scene, sun); then gMat(color, {rough, metal}) instead of toon(). */
export function gMat(color, { rough = .55, metal = 0, emissive = 0x000000, ei = 0 } = {}) {
  return new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal, emissive, emissiveIntensity: ei });
}

export function gameStage(renderer, scene, sun) {
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -4; sun.shadow.camera.right = 4;
  sun.shadow.camera.top = 6; sun.shadow.camera.bottom = -2;
  sun.shadow.radius = 6; sun.shadow.bias = -0.0008;
  scene.add(new THREE.HemisphereLight(0xdfe9ff, 0x3a3150, .9));
  const rim = new THREE.DirectionalLight(0xffd6c8, .9); rim.position.set(-5, 4, -4); scene.add(rim);
  return {
    shadowCatcher(size = 9) {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(size, size), new THREE.ShadowMaterial({ opacity: .28 }));
      m.rotation.x = -Math.PI / 2; m.position.y = 0.001; m.receiveShadow = true; scene.add(m); return m;
    },
    castAll(root) { root.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } }); },
  };
}

/* screen glow: a soft additive light in front of a phone */
export function screenGlow(color = 0x7fb0ff, intensity = 1.2) {
  const l = new THREE.PointLight(color, intensity, 4, 2); l.position.set(0, 0, 1.2); return l;
}

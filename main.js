import {
  AdditiveBlending, BufferAttribute, BufferGeometry, CanvasTexture, Color,
  PerspectiveCamera, Points, RawShaderMaterial, Scene, WebGLRenderer
} from "https://cdn.skypack.dev/three@0.136.0";

import { OrbitControls } from "https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls";
import { TWEEN } from "https://cdn.skypack.dev/three@0.136.0/examples/jsm/libs/tween.module.min.js";

console.clear();

/* ============================
   CANVAS + SCENE
============================ */
const canvas = document.getElementById("canvas");

const scene = new Scene();
const camera = new PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 100);
camera.position.set(0, 2, 3);

const renderer = new WebGLRenderer({ canvas });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const orbit = new OrbitControls(camera, canvas);

/* ============================
   STAR ALPHA TEXTURE
============================ */
const ctx = document.createElement("canvas").getContext("2d");
ctx.canvas.width = ctx.canvas.height = 32;

ctx.fillStyle = "#000";
ctx.fillRect(0, 0, 32, 32);

let grd = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
grd.addColorStop(0, "#fff");
grd.addColorStop(1, "#000");
ctx.fillStyle = grd;
ctx.fillRect(0, 0, 32, 32);

const alphaMap = new CanvasTexture(ctx.canvas);


/* ============================
   GALAXY GEOMETRY
============================ */
const count = 128 ** 2;
const galaxyGeometry = new BufferGeometry();

const galaxyPosition = new Float32Array(count * 3);
const galaxySeed = new Float32Array(count * 3);
const galaxySize = new Float32Array(count);

for (let i = 0; i < count; i++) {
  galaxyPosition[i * 3] = i / count;
  galaxySeed[i * 3] = Math.random();
  galaxySeed[i * 3 + 1] = Math.random();
  galaxySeed[i * 3 + 2] = Math.random();
  galaxySize[i] = Math.random() * 2 + 0.5;
}

galaxyGeometry.setAttribute("position", new BufferAttribute(galaxyPosition, 3));
galaxyGeometry.setAttribute("seed", new BufferAttribute(galaxySeed, 3));
galaxyGeometry.setAttribute("size", new BufferAttribute(galaxySize, 1));

const innColor = new Color("#f40");
const outColor = new Color("#a7f");

const shaderUtils = `
float random (vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}
vec3 scatter (vec3 seed) {
  float u = random(seed.xy);
  float v = random(seed.yz);
  float theta = u * 6.28318530718;
  float phi = acos(2.0 * v - 1.0);
  float sinTheta = sin(theta);
  float cosTheta = cos(theta);
  float sinPhi = sin(phi);
  float cosPhi = cos(phi);
  return vec3(sinPhi * cosTheta, sinPhi * sinTheta, cosPhi);
}
`;

const galaxyMaterial = new RawShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uSize: { value: renderer.getPixelRatio() },
    uBranches: { value: 2 },
    uRadius: { value: 0 },
    uSpin: { value: Math.PI * 0.25 },
    uRandomness: { value: 0 },
    uAlphaMap: { value: alphaMap },
    uColorInn: { value: innColor },
    uColorOut: { value: outColor },
  },

  vertexShader: `
precision highp float;

attribute vec3 position;
attribute float size;
attribute vec3 seed;
uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

uniform float uTime;
uniform float uSize;
uniform float uBranches;
uniform float uRadius;
uniform float uSpin;
uniform float uRandomness;

varying float vDistance;

${shaderUtils}

void main() {
  vec3 p = position;
  float st = sqrt(p.x);
  float qt = p.x * p.x;
  float mt = mix(st, qt, p.x);

  float angle = qt * uSpin * (2.0 - sqrt(1.0 - qt));
  float branchOffset = (6.28318530718 / uBranches) * floor(seed.x * uBranches);
  p.x = position.x * cos(angle + branchOffset) * uRadius;
  p.z = position.x * sin(angle + branchOffset) * uRadius;

  p += scatter(seed) * random(seed.zx) * uRandomness * mt;
  p.y *= 0.5 + qt * 0.5;

  vec3 temp = p;
  float ac = cos(-uTime * (2.0 - st) * 0.5);
  float as = sin(-uTime * (2.0 - st) * 0.5);
  p.x = temp.x * ac - temp.z * as;
  p.z = temp.x * as + temp.z * ac;

  vDistance = mt;

  vec4 mvp = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mvp;
  gl_PointSize = (10.0 * size * uSize) / -mvp.z;
}
`,

  fragmentShader: `
precision highp float;
uniform vec3 uColorInn;
uniform vec3 uColorOut;
uniform sampler2D uAlphaMap;

varying float vDistance;

void main() {
  vec2 uv = vec2(gl_PointCoord.x, 1.0 - gl_PointCoord.y);
  float a = texture2D(uAlphaMap, uv).g;
  if (a < 0.1) discard;

  vec3 color = mix(uColorInn, uColorOut, vDistance);
  gl_FragColor = vec4(color, a);
}
`,

  transparent: true,
  depthWrite: false,
  depthTest: false,
  blending: AdditiveBlending,
});

const galaxy = new Points(galaxyGeometry, galaxyMaterial);
scene.add(galaxy);


/* ============================
   UNIVERSE STAR FIELD
============================ */
const universeGeometry = new BufferGeometry();

const universeSeed = new Float32Array((count * 3) / 2);
const universeSize = new Float32Array(count / 2);

for (let i = 0; i < count / 2; i++) {
  universeSeed[i * 3] = Math.random();
  universeSeed[i * 3 + 1] = Math.random();
  universeSeed[i * 3 + 2] = Math.random();
  universeSize[i] = Math.random() * 2 + 0.5;
}

universeGeometry.setAttribute("position", new BufferAttribute(new Float32Array((count * 3) / 2), 3));
universeGeometry.setAttribute("seed", new BufferAttribute(universeSeed, 3));
universeGeometry.setAttribute("size", new BufferAttribute(universeSize, 1));

const universeMaterial = new RawShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uSize: galaxyMaterial.uniforms.uSize,
    uRadius: galaxyMaterial.uniforms.uRadius,
    uAlphaMap: galaxyMaterial.uniforms.uAlphaMap,
  },

  vertexShader: `
precision highp float;

attribute vec3 seed;
attribute float size;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

uniform float uTime;
uniform float uSize;
uniform float uRadius;

${shaderUtils}

void main() {
  vec3 p = scatter(seed) * 3.0;

  float q = random(seed.zx);
  for (int i = 0; i < 3; i++) q *= q;
  p *= q;

  float l = length(p) / 3.0;
  vec3 temp = p;
  float ql = 1.0 - l;
  for (int i = 0; i < 3; i++) ql *= ql;

  float ac = cos(-uTime * ql);
  float as = sin(-uTime * ql);
  p.x = temp.x * ac - temp.z * as;
  p.z = temp.x * as + temp.z * ac;

  vec4 mvp = modelViewMatrix * vec4(p * uRadius, 1.0);
  gl_Position = projectionMatrix * mvp;

  gl_PointSize = (size * uSize * (2.0 - l)) / -mvp.z;
}
`,

  fragmentShader: `
precision highp float;
uniform sampler2D uAlphaMap;

void main() {
  vec2 uv = vec2(gl_PointCoord.x, 1.0 - gl_PointCoord.y);
  float a = texture2D(uAlphaMap, uv).g;
  if (a < 0.1) discard;

  gl_FragColor = vec4(1.0, 1.0, 1.0, a);
}
`,

  transparent: true,
  depthWrite: false,
  depthTest: false,
  blending: AdditiveBlending,
});

const universe = new Points(universeGeometry, universeMaterial);
scene.add(universe);


/* ========================================
   INTRO ANIMATION (giữ nguyên)
======================================= */
new TWEEN.Tween({ r: 0, s: 0, rand: 0 })
  .to({ r: 1.618, s: Math.PI * 2, rand: 0.5 })
  .duration(5000)
  .easing(TWEEN.Easing.Cubic.InOut)
  .onUpdate((v) => {
    galaxyMaterial.uniforms.uRadius.value = v.r;
    galaxyMaterial.uniforms.uSpin.value = v.s;
    galaxyMaterial.uniforms.uRandomness.value = v.rand;
  })
  .start();


/* ========================================
   HÀM ZOOM OUT ĐỂ UI.JS GỌI
======================================= */
window.__galaxyZoomOut = function () {

  new TWEEN.Tween(camera.position)
    .to({ z: 0.05 }, 2000)
    .easing(TWEEN.Easing.Cubic.In)
    .start();

  new TWEEN.Tween(galaxyMaterial.uniforms.uRadius)
    .to({ value: 8 }, 2000)
    .easing(TWEEN.Easing.Cubic.In)
    .start();
};


/* ========================================
   LOOP
======================================= */
renderer.setAnimationLoop(() => {
  galaxyMaterial.uniforms.uTime.value += 0.0015;
  universeMaterial.uniforms.uTime.value += 0.001;

  TWEEN.update();
  orbit.update();
  renderer.render(scene, camera);
});

/* Resize */
addEventListener("resize", () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});
/* =====================================================
   HÀM HỦY SCENE CHO UI.js GỌI
===================================================== */

window.__destroyGalaxyScene = function () {

  // 1. Stop renderer loop
  renderer.setAnimationLoop(null);

  // 2. Dispose galaxy
  galaxyGeometry.dispose();
  galaxyMaterial.dispose();

  // 3. Dispose universe
  universeGeometry.dispose();
  universeMaterial.dispose();

  // 4. Remove objects from scene
  scene.remove(galaxy);
  scene.remove(universe);

  // 5. Dispose renderer
  renderer.dispose();

  // 6. Xóa canvas để main2.js tạo canvas mới
  renderer.domElement.remove();

  console.log("MAIN.JS destroyed completely.");
};

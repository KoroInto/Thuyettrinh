import * as THREE from "https://cdn.skypack.dev/three@0.136.0";

console.clear();

const canvas = document.getElementById("canvas");

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 1000);
camera.position.set(0, 0, 3);

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(innerWidth, innerHeight);

/* === Tạo starfield nhỏ === */
const stars = new THREE.BufferGeometry();
const count = 2000;

const pos = new Float32Array(count * 3);
for (let i = 0; i < count * 3; i++) pos[i] = (Math.random() - 0.5) * 10;

stars.setAttribute("position", new THREE.BufferAttribute(pos, 3));

const material = new THREE.PointsMaterial({
  color: "#ffffff",
  size: 0.02,
});

const starField = new THREE.Points(stars, material);
scene.add(starField);

/* === Loop === */
function animate() {
  starField.rotation.y += 0.0008;
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();

/* Resize */
addEventListener("resize", () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

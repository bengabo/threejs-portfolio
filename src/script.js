import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const loaddingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loaddingManager);
const spaceTexture = textureLoader.load(
  "./img/wil-stewart-RpDA3uYkJWM-unsplash_SPACE.jpg"
);
scene.background = spaceTexture;

/**
 * Geometries
 */
// Torus
const torus = new THREE.Mesh(
  new THREE.TorusGeometry(10, 3, 16, 100),
  new THREE.MeshStandardMaterial({
    color: 0xff6347,
  })
);
// scene.add(torus);

// Star
const addStar = () => {
  const star = new THREE.Mesh(
    new THREE.SphereGeometry(0.25),
    new THREE.MeshBasicMaterial({ color: 0xffffff })
  );
  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(200));
  star.position.set(x, y, z);
  scene.add(star);
};
Array(250).fill().forEach(addStar);

// Cube
const cubeTexture = textureLoader.load("./img/Wam_visage.png");
const cube = new THREE.Mesh(
  new THREE.BoxGeometry(5, 5, 5),
  new THREE.MeshBasicMaterial({
    map: cubeTexture,
  })
);
// scene.add(cube);

const helper = new THREE.BoxHelper(cube);
helper.material.color.setHex(0x474747);
helper.material.blending = THREE.AdditiveBlending;
helper.material.transparent = true;
// scene.add(helper);

// Planet
const moonTexture = textureLoader.load("./img/Moon_Diffuse_4000x2000px.jpg");
const moonDispTexture = textureLoader.load("./img/MOON_ldem_3_8bit.jpg");
const moonNormTexture = textureLoader.load("./img/Moon_Normal_4000x2000px.jpg");
const moon = new THREE.Mesh(
  new THREE.SphereGeometry(10, 32, 32),
  new THREE.MeshStandardMaterial({
    map: moonNormTexture,
    normalMap: moonNormTexture,
    color: "#CE65ED",
    // displacementMap: moonDispTexture,
  })
);
scene.add(moon);

/**
 * Lights
 */
const pointLight = new THREE.PointLight(0xffffff, 1.5);
pointLight.position.set(13, 5, 15);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.15);
scene.add(pointLight, ambientLight);
const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(lightHelper);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  1000
);
camera.position.z = 30;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.minDistance = 25;
controls.maxDistance = 25;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  torus.rotation.x += 0.001;
  torus.rotation.y += 0.001;
  torus.rotation.z += 0.001;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();

import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import * as dat from "lil-gui";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("#bg");

// Scene
const scene = new THREE.Scene();

//Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  1000
);
camera.position.x = -3;
camera.position.z = 30;
scene.add(camera);

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
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(sizes.width, sizes.height),
  1.5,
  0.4,
  0.85
);
bloomPass.threshold = 0;
bloomPass.strength = 0.6;
const renderScene = new RenderPass(scene, camera);
const composer = new EffectComposer(renderer);
composer.setPixelRatio(2);
composer.addPass(renderScene);
composer.addPass(bloomPass);

const group = new THREE.Group();
scene.add(group);

composer.setSize(sizes.width, sizes.height);
bloomPass.setSize(sizes.width, sizes.height);

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
const torus = (radius, tube, radialSegments, tubularSegments, hexaColor) => {
  const torusGeometry = new THREE.TorusGeometry(
    radius,
    tube,
    radialSegments,
    tubularSegments
  );
  const torusMaterial = new THREE.MeshBasicMaterial({ color: hexaColor });
  const torusMesh = new THREE.Mesh(torusGeometry, torusMaterial);
  return torusMesh;
};

const torus1 = torus(6, 0.05, 8, 8, 0xffffff);
const torus2 = torus(6, 0.05, 8, 8, 0xffffff);
torus2.rotation.set(1, 1, 1);
const torus3 = torus(6, 0.05, 8, 8, 0xffffff);
torus3.rotation.set(2.5, 2.5, 2.5);
scene.add(torus1, torus2, torus3);

// Stars field
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
cube.rotation.y = -15;
cube.rotation.x = 0.5;
scene.add(cube);

const helper = new THREE.BoxHelper(cube);
helper.material.color.setHex(0x474747);
helper.material.blending = THREE.AdditiveBlending;
helper.material.transparent = true;
// scene.add(helper);

// Moon
const moonTexture = textureLoader.load("./img/Moon_Diffuse_4000x2000px.jpg");
const moonNormTexture1 = textureLoader.load(
  "./img/Moon_Normal_4000x2000px.jpg"
);
const moonNormTexture2 = textureLoader.load("./img/moon_normal.jpg");
const moon = new THREE.Mesh(
  new THREE.SphereGeometry(10, 32, 32),
  new THREE.MeshStandardMaterial({
    map: moonNormTexture1,
    normalMap: moonNormTexture1,
    color: "#CE65ED",
    // displacementMap: moonDispTexture,
  })
);
scene.add(moon);
moon.position.z = 30;
moon.position.x = -10;

/**
 * Lights
 */
const pointLight = new THREE.PointLight(0xffffff, 1.5);
pointLight.position.set(13, 5, 15);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.15);
scene.add(pointLight, ambientLight);

/**
 * Helpers
 */
const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(lightHelper, gridHelper);

/**
 * Scroll function
 */
function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;
}

document.body.onscroll = moveCamera;
moveCamera();

// Controls
// const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;
// controls.minDistance = 25;
// controls.maxDistance = 25;

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // torus1.rotation.x += 0.01;
  // torus1.rotation.y += 0.005;
  // torus1.rotation.z += 0.01;
  moon.rotation.y -= 0.0005;

  // Update controls
  // controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();

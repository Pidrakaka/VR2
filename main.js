import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Создаём сцену
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x202020);

// Камера
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 1.6, 3);

// Рендерер
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.xr.enabled = true;
document.body.appendChild(renderer.domElement);

// VR Button
document.body.appendChild(VRButton.createButton(renderer));

// Добавляем OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.minDistance = 1;
controls.maxDistance = 50;

// Свет
const light = new THREE.HemisphereLight(0xffffff, 0x444444);
light.position.set(0, 1, 0);
scene.add(light);

// 🎵 Добавляем кнопку для запуска музыки
const playButton = document.createElement('button');
playButton.innerText = "▶️ Включить музыку";
playButton.style.position = "absolute";
playButton.style.top = "10px";
playButton.style.left = "10px";
playButton.style.padding = "10px";
playButton.style.zIndex = "1000";
document.body.appendChild(playButton);

// 🎧 Настраиваем аудио
const listener = new THREE.AudioListener();
camera.add(listener);

const sound = new THREE.Audio(listener);
const audioLoader = new THREE.AudioLoader();
audioLoader.load('./audio/sigma.mp3', function(buffer) {
    sound.setBuffer(buffer);
    sound.setLoop(true);
    sound.setVolume(0.5);
});

// Запускаем музыку после клика
playButton.addEventListener("click", function () {
    if (!sound.isPlaying) {
        sound.play();
        playButton.style.display = "none"; // Скрываем кнопку после клика
    }
});

// Загрузка модели комнаты
const loader = new GLTFLoader();
loader.load(
  './models/room/scene.gltf',
  function (gltf) {
    scene.add(gltf.scene);
    gltf.scene.position.set(0, 0, 1);
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

// Загрузка второй модели
let wednsdayModel;
const loader2 = new GLTFLoader();
loader2.load(
  './models/wednsday/scene.gltf',
  function (gltf) {
    wednsdayModel = gltf.scene;
    scene.add(wednsdayModel);
    wednsdayModel.position.set(1, 0.2, 2);
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

// Анимация вращения модели
const clock = new THREE.Clock();

function animate() {
  const delta = clock.getDelta();

  if (wednsdayModel) {
    wednsdayModel.rotation.y += delta;
  }

  controls.update();

  renderer.setAnimationLoop(() => {
    controls.update();
    if (wednsdayModel) {
      wednsdayModel.rotation.y += delta;
    }
    renderer.render(scene, camera);
  });
}
animate();

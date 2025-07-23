// Import the THREE.js library
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import { FBXLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/FBXLoader.js";

// --- Scene Setup ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf0f0f0);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.getElementById("container3D").appendChild(renderer.domElement);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

let bikeModel;

// --- OrbitControls Setup ---
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.minDistance = 1;
controls.maxDistance = 10;
controls.enablePan = false;   // Disable panning
controls.enableRotate = true;
controls.enableZoom = true;   // Enable zoom

// --- Lighting ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight1.position.set(5, 5, 5).normalize();
directionalLight1.castShadow = true;
directionalLight1.shadow.mapSize.width = 1024;
directionalLight1.shadow.mapSize.height = 1024;
directionalLight1.shadow.camera.near = 0.5;
directionalLight1.shadow.camera.far = 50;
directionalLight1.shadow.camera.left = -10; directionalLight1.shadow.camera.right = 10;
directionalLight1.shadow.camera.top = 10; directionalLight1.shadow.camera.bottom = -10;
scene.add(directionalLight1);

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.2);
directionalLight2.position.set(-5, 3, -5).normalize();
scene.add(directionalLight2);

const directionalLight3 = new THREE.DirectionalLight(0xffffff, 0.2);
directionalLight3.position.set(0, 5, -5).normalize();
scene.add(directionalLight3);

// --- Plane (Floor) ---
const planeGeometry = new THREE.PlaneGeometry(200, 200);
const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
const plane = new THREE.Mesh(planeGeometry, planeMaterial); 
plane.rotation.x = - Math.PI / 2;
plane.position.y = 0; // Adjust if your model's base isn't at y=0
plane.receiveShadow = true;
scene.add(plane);

// --- Model Loading (FBX) ---
const loader = new FBXLoader();

loader.load(
    './assets/fixie.fbx', // Your FBX model path
    function (object) {
        bikeModel = object;
        scene.add(bikeModel);

        bikeModel.scale.set(0.01, 0.01, 0.01);
        bikeModel.position.set(0, 0, 0);
        bikeModel.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        console.log("FBX model loaded successfully!");

        bikeModel.rotation.y = 180

        // Focus camera on the model
        controls.target.set(bikeModel.position.x, bikeModel.position.y + 0.5, bikeModel.position.z);
        controls.update();

        // Adjust camera position relative to the model
        camera.position.set(
            -2.4161365560554855,
            0.817079899845506,
            2.7339832808122146
            // bikeModel.position.x + 0.2,
            // bikeModel.position.y + 3.5,
            // bikeModel.position.z + 1.3
        );
        camera.rotation.set(
            -0.2904111512698071,   // Nilai _x (radian)
            -0.7025964578616679,   // Nilai _y (radian)
            -0.19077549914824213,  // Nilai _z (radian)
            'XYZ'                  // Nilai _order
        );
        console.log("Updated")
        // camera.lookAt(controls.target);

    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
        console.error("Error loading FBX model:", error);
    }
);

// --- Rotation Button Logic ---
let isRotatingLeft = false;
let isRotatingRight = false;
const rotationSpeed = 0.05; // Radians per frame

document.addEventListener('DOMContentLoaded', () => {
    const rotateLeftButton = document.getElementById('rotateLeft');
    const rotateRightButton = document.getElementById('rotateRight');

    if (rotateLeftButton && rotateRightButton) {
        rotateLeftButton.addEventListener('mousedown', () => { isRotatingLeft = true; });
        rotateLeftButton.addEventListener('mouseup', () => { isRotatingLeft = false; });
        rotateLeftButton.addEventListener('mouseleave', () => { isRotatingLeft = false; });

        rotateRightButton.addEventListener('mousedown', () => { isRotatingRight = true; });
        rotateRightButton.addEventListener('mouseup', () => { isRotatingRight = false; });
        rotateRightButton.addEventListener('mouseleave', () => { isRotatingRight = false; });
    }
});

// --- Animation Loop ---
function animate() {
    console.log("camera position: ", camera.position)
    console.log("camera rotation: ", camera.rotation)

    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);

    if (bikeModel) {
        if (isRotatingLeft) {
            bikeModel.rotation.y += rotationSpeed;
        } else if (isRotatingRight) {
            bikeModel.rotation.y -= rotationSpeed;
        }
    }
}

// --- Handle Window Resizing ---
window.addEventListener("resize", function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// --- Start Rendering ---
animate();
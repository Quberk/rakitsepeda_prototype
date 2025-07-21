// Import the THREE.js library
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
// To allow for the camera to move around the scene
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
// To allow for importing the .gltf file
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

// --- Setup Scene, Camera, Renderer ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf0f0f0); 

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

camera.position.set(0, 0.5, 3); 


const renderer = new THREE.WebGLRenderer({ alpha: true }); // Alpha: true allows for transparent background if needed
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio); // Untuk ketajaman di layar HiDPI
document.getElementById("container3D").appendChild(renderer.domElement);

let bikeModel;

const loader = new GLTFLoader();

loader.load(
    './assets/bike.glb',
    function (gltf) {
        bikeModel = gltf.scene;
        scene.add(bikeModel);

        bikeModel.scale.set(1, 1, 1);

        console.log("Bike model loaded successfully!", bikeModel);

        if (bikeModel) {
            controls.target.set(bikeModel.position.x, bikeModel.position.y, bikeModel.position.z);
            controls.update();
        }
    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
        console.error("Error loading bike model:", error);
    }
);

// --- Lighting ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8); // Cahaya merata yang lembut
scene.add(ambientLight);

const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1);
directionalLight1.position.set(5, 5, 5).normalize(); // Dari depan atas kanan
scene.add(directionalLight1);

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.7);
directionalLight2.position.set(-5, 3, -5).normalize(); // Dari belakang bawah kiri
scene.add(directionalLight2);

// --- OrbitControls (untuk memutar dan zoom) ---
// Aktifkan OrbitControls selalu agar bisa diputar-putar
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Rotasi lebih halus dengan inersia
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false; // Mencegah kamera bergeser secara tidak sengaja
controls.minDistance = 1; // Jarak zoom minimum
controls.maxDistance = 10; // Jarak zoom maksimum (sesuaikan)

// --- Debugging Helpers (Opsional, bisa dihapus setelah development) ---
const gridHelper = new THREE.GridHelper(10, 10);
scene.add(gridHelper);

const axesHelper = new THREE.AxesHelper(5); // Sumbu X=merah, Y=hijau, Z=biru
scene.add(axesHelper);

// --- Animation Loop ---
function animate() {
    requestAnimationFrame(animate);

    // Perbarui kontrol setiap frame
    controls.update(); 

    renderer.render(scene, camera);
}

// --- Handle Window Resizing ---
window.addEventListener("resize", function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// --- Start the 3D rendering ---
animate();

// --- Tambahan: Contoh fungsi untuk kustomisasi warna (jika diperlukan nanti) ---
// Ini akan membutuhkan panel kontrol di HTML dan penyesuaian pada model GLTF
/*
function changeBikeColor(colorHex) {
    if (bikeModel) {
        const newColor = new THREE.Color(colorHex);
        bikeModel.traverse((child) => {
            if (child.isMesh && child.material) {
                // Ini akan mengubah warna semua material.
                // Untuk bagian spesifik (misal: rangka), Anda perlu mengakses child.name
                // atau child.userData untuk identifikasi.
                if (child.material.isMeshStandardMaterial || child.material.isMeshPhongMaterial) {
                    child.material.color.set(newColor);
                    child.material.needsUpdate = true;
                }
            }
        });
    }
}
// Contoh penggunaan: changeBikeColor('#ff0000');
*/
// Import the THREE.js library
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
// To allow for the camera to move around the scene
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
// To allow for importing the .gltf file
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";
import { FBXLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/FBXLoader.js";


// --- Setup Scene, Camera, Renderer ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf0f0f0); 

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0.5, 3); 

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true }); // Tambahkan antialias: true di sini
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.getElementById("container3D").appendChild(renderer.domElement);

// --- AKTIFKAN BAYANGAN PADA RENDERER (PENTING!) ---
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Membuat bayangan lebih lembut

let bikeModel;

// const loader = new GLTFLoader();

// loader.load(
//     './assets/bike.glb', // <-- Sesuaikan path ini!
//     function (gltf) {
//         bikeModel = gltf.scene;
//         scene.add(bikeModel);

//         bikeModel.scale.set(1, 1, 1);
//         bikeModel.position.set(0, 0, 0); 

//         // AKTIFKAN BAYANGAN PADA SEMUA MESH DALAM MODEL
//         bikeModel.traverse((child) => {
//             if (child.isMesh) {
//                 child.castShadow = true;
//                 child.receiveShadow = true;
//             }
//         });

//         console.log("Bike model loaded successfully!", bikeModel);

//         if (bikeModel) {
//             controls.target.set(bikeModel.position.x, bikeModel.position.y, bikeModel.position.z);
//             controls.update();
//         }
//     },
//     function (xhr) {
//         console.log((xhr.loaded / xhr.total * 100) + '% loaded');
//     },
//     function (error) {
//         console.error("Error loading bike model:", error);
//     }
// );

const loader = new FBXLoader(); // Ganti new GLTFLoader() menjadi new FBXLoader()

loader.load(
    './assets/fixie.fbx', // Ganti path file kamu ke .fbx
    function (object) { // Perhatikan: callback function sering menerima 'object' bukan 'gltf'
        bikeModel = object; // FBXLoader langsung mengembalikan Object3D
        scene.add(bikeModel);

        // Penyesuaian skala/posisi mungkin sangat penting untuk FBX
        bikeModel.scale.set(0.01, 0.01, 0.01); // FBX seringkali diekspor dengan skala sangat besar
        bikeModel.position.set(0, 0, 0);

        // Aktifkan bayangan jika diperlukan (seringkali perlu traverse)
        bikeModel.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                // FBXLoader mungkin memuat material non-PBR (misalnya MeshLambertMaterial, MeshPhongMaterial)
                // Jika kamu ingin PBR, kamu mungkin perlu mengganti materialnya secara manual
                // atau memastikan material PBR diekspor dengan benar dari software 3D kamu.
            }
        });

        console.log("FBX model loaded successfully!", bikeModel);

        if (bikeModel) {
            controls.target.set(bikeModel.position.x, bikeModel.position.y, bikeModel.position.z);
            controls.update();
        }
    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
        console.error("Error loading FBX model:", error);
    }
);

// --- Lighting ---
// Ambient Light: Menambah cahaya dasar keseluruhan, jangan terlalu dominan
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4); // Intensitas standar 0.8-1.0
scene.add(ambientLight);

// Directional Light 1 (Main Light / Key Light)
const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1); // **INTENSITAS LEBIH TINGGI**
directionalLight1.position.set(5, 5, 5).normalize(); 
directionalLight1.castShadow = true; // Aktifkan bayangan
directionalLight1.shadow.mapSize.width = 1024; // Resolusi bayangan lebih tinggi
directionalLight1.shadow.mapSize.height = 1024;
directionalLight1.shadow.camera.near = 0.5; // Jarak dekat kamera bayangan
directionalLight1.shadow.camera.far = 50; // Jarak jauh kamera bayangan
directionalLight1.shadow.camera.left = -10; directionalLight1.shadow.camera.right = 10;
directionalLight1.shadow.camera.top = 10; directionalLight1.shadow.camera.bottom = -10;
scene.add(directionalLight1);

// Directional Light 2 (Fill Light) - untuk mengisi bayangan utama
const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.3); // **INTENSITAS LEBIH TINGGI**
directionalLight2.position.set(-5, 3, -5).normalize();
scene.add(directionalLight2);

// Tambahan: Mungkin satu lampu lagi dari arah lain (Rim Light)
const directionalLight3 = new THREE.DirectionalLight(0xffffff, 1);
directionalLight3.position.set(0, 5, -5).normalize(); // Dari belakang atas
scene.add(directionalLight3);


// --- OrbitControls (untuk memutar dan zoom) ---
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.minDistance = 1; 
controls.maxDistance = 10; 

// --- Debugging Helpers (Opsional, sudah dimatikan/dihilangkan) ---
// const gridHelper = new THREE.GridHelper(10, 10);
// scene.add(gridHelper);

// const axesHelper = new THREE.AxesHelper(5); // Sumbu X=merah, Y=hijau, Z=biru
// scene.add(axesHelper);

// --- Menambahkan Plane (Lantai) ---
const planeGeometry = new THREE.PlaneGeometry(200, 200);
const planeMaterial = new THREE.MeshStandardMaterial({ color: 0xA0522D });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = - Math.PI / 2;
plane.position.y = 0;
plane.receiveShadow = true;
scene.add(plane);


// --- Animation Loop ---
function animate() {
    requestAnimationFrame(animate);
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

// ... (contoh fungsi kustomisasi warna) ...
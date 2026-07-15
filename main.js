// 1. Core Scene Setup (3D World Banana)
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 10); // Camera ko perfect angle par set kiya

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('.webgl'),
    alpha: true,
    antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// 2. Lighting (Car par realistic chamak aur shadow lane ke liye)
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5); 
scene.add(ambientLight);

const topLight = new THREE.DirectionalLight(0xffffff, 2);
topLight.position.set(0, 10, 0);
scene.add(topLight);

const dirLight1 = new THREE.DirectionalLight(0x1c69d4, 3); // BMW Blue Accent Light
dirLight1.position.set(5, 5, 5);
scene.add(dirLight1);

const dirLight2 = new THREE.DirectionalLight(0xffffff, 2);
dirLight2.position.set(-5, 3, 2);
scene.add(dirLight2);

// 3. Real 3D Model Loader (GLTFLoader aur DRACOLoader Setup)
// Pehle Draco Loader set up kiya taake compressed model decode ho sake
const dracoLoader = new THREE.DRACOLoader();
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');

const loader = new THREE.GLTFLoader();
loader.setDRACOLoader(dracoLoader); // Loader ko Draco Loader assign kiya

let bmwModel;

loader.load(
    'bmw_m4csl.glb?v=1',
    (gltf) => {
        bmwModel = gltf.scene;
        
        // Gadi ka size aur position setup
        bmwModel.scale.set(1, 1, 1); 
        bmwModel.position.set(0, 0, 0);
        
        scene.add(bmwModel);
        console.log("BMW Model Successfully Loaded!");

        // Scroll animations register karein
        initScrollAnimations(bmwModel);
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    (error) => {
        console.error('Model load karne me error aaya:', error);
    }
);

// 4. GSAP Scroll Animation (Scroll karne par position badalna)
gsap.registerPlugin(ScrollTrigger);

function initScrollAnimations(targetModel) {
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: "body",
            start: "top top",
            end: "bottom bottom",
            scrub: 1
        }
    });

    // Scroll 1: Car left side me move aur rotate hogi
    tl.to(targetModel.position, { x: -1.5, y: 0, z: 0 }, 0)
      .to(targetModel.rotation, { y: Math.PI * 1 }, 0);

    // Scroll 2: Car right side me chali jayegi
    tl.to(targetModel.position, { x: 1.5, y: 0, z: -1 })
      .to(targetModel.rotation, { y: Math.PI * 2 });

    // Scroll 3: Car wapas center me close-up me aaye
    tl.to(targetModel.position, { x: 0, y: 0.5, z: 2 })
      .to(targetModel.rotation, { y: Math.PI * 3 });
}

// 5. Responsive Design (Window resize handler)
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// 6. Animation Loop (Slow automatic idle rotation)
const tick = () => {
    if (bmwModel) {
        bmwModel.rotation.y += 0.003;
    }
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
};

tick();

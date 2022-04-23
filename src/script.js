import './style.css'
import * as THREE from 'three'
import { gsap } from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger.js"
gsap.registerPlugin(ScrollTrigger);
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'


// assign canvas dom element to variable
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

//create cube geometry
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
// create red material
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })

// Loaders

// Texture loader
const textureLoader = new THREE.TextureLoader()

// GLTF loader
const gltfLoader = new GLTFLoader()

// Baked Texture
 const bakedTexture = textureLoader.load('baked.jpg');
bakedTexture.flipY = false;
bakedTexture.encoding = THREE.sRGBEncoding;

//Baked Material
const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture });

// Bulb Material
const bulbMaterial = new THREE.MeshBasicMaterial({ color: 0xffffe5 });


// load street model and apply materials
gltfLoader.load(
    'street.glb',
    function traverseThroughGeometry (gltf) {
        gltf.scene.traverse(
            function applyBakedMaterialToAllChildren (child) {
                child.material = bakedMaterial
            }
        )
        const bulb1Mesh = gltf.scene.children.find(child => child.name === 'bulbs')
        bulb1Mesh.material = bulbMaterial

        // gltf.scene.scale.set(2, 2, 2)
        scene.add( ... gltf.scene.children);
                
    }
)

// const axesHelper = new THREE.AxesHelper( 5 );
// scene.add( axesHelper );


// set grid parameters and add grid to scene
// const size = 15;
// const divisions = 10;
// const gridHelper = new THREE.GridHelper( size, divisions );
// scene.add( gridHelper );


//inital canvas sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}


//resizer
window.addEventListener('resize', () =>
    {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update cameras
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    scrollCamera.aspect = sizes.width / sizes.height
    scrollCamera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
});


// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.outputEncoding = THREE.sRGBEncoding;


// scrollCamera moving on path
const scrollCamera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height)
scrollCamera.near = 1
scrollCamera.far = 30
//scene.add(scrollCamera)


// create path

const curve = new THREE.CatmullRomCurve3( [
	new THREE.Vector3( -15, 10, 15 ),
    new THREE.Vector3( -10, 5, -10 ),
	new THREE.Vector3( 2, 1, -10 ),
	new THREE.Vector3( 2, 1, -4 ),
	new THREE.Vector3( 2.5, 5, 13 )],
    false,
)

const points = curve.getPoints( 10 );

// Path Target object, scrollCamera will be attached to it later
var pathTarget = new THREE.Vector3(0,0,0)


// camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height);
camera.position.set(20,10,20);

// // make path visible
// const geometry = new THREE.BufferGeometry().setFromPoints( points );
// const splineMaterial = new THREE.LineBasicMaterial( { color: 0xff0000 } );
// const curveObject = new THREE.Line( geometry, splineMaterial );
// scene.add(curveObject)

// // scrollCamera helper
// const scrollCameraHelper = new THREE.CameraHelper(scrollCamera);
// scene.add(scrollCameraHelper);

// // Orbit Controls
// const controls = new OrbitControls( camera, renderer.domElement );

// Camera Target
var scrollCameraTarget = new THREE.Vector3(-2,1,2)


//assign button to varible
const exploreButton = document.getElementById("explore");

//add event listender to variable
exploreButton.addEventListener("click", null)



// Scroll Animation
var pathPercent = {value: 0 }; // position on path 0=Start, 1=end

gsap.to(pathPercent, {
    scrollTrigger: {
        trigger: "body",
        endTrigger: "footer",
        id: "section1",
        start: "top 0%",
        end: "bottom 100%",
        scrub: 0.5,
        markers: false,
        toggleActions: "restart pause reverse reset"
    },
    value: 1
}
);


// Animate Explorer Button

// gsap.to("#explore" ,{
//     scrollTrigger: {
//         trigger: "#explore",
//         start: "center 70%",
//         end: "center 20%",
//         scrub: 1,
//         markers: true,
//         toggleActions: "restart pause reverse reset"
//     },
//     x: 400,
//     rotation: 360,
//     duration: 3
// });


/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime
    
    //playScrollAnimations();
    //curve.getPoint((clock.getElapsedTime() * speed) % 1.0, pathTarget)

    curve.getPoint(pathPercent.value, pathTarget); // update pathTarget position on path

    scrollCamera.position.copy(pathTarget) // copy scrollCamera position to pathTarget
    scrollCamera.lookAt(scrollCameraTarget)

    // Render
    renderer.render(scene, scrollCamera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
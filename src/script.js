import './style.css'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

import { gsap } from 'gsap';
gsap.registerPlugin(ScrollTrigger);
import { ScrollTrigger } from "gsap/ScrollTrigger.js"


// Scene
const scene = new THREE.Scene()

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

        scene.add( ... gltf.scene.children);
                
    }
)

//inital canvas sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight/1.5
}

//resizer
window.addEventListener('resize', () =>
    {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight/1.5

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
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setClearColor( 0xffffff, 0)

document.getElementById('canvas1-container').appendChild( renderer.domElement );
//document.getElementById('canvas2-container').appendChild( renderer.domElement );


// scrollCamera moving on path
const scrollCamera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height)
scrollCamera.near = 1
scrollCamera.far = 30
//scene.add(scrollCamera)


// camera path
const curve = new THREE.CatmullRomCurve3( [
	new THREE.Vector3( 0, 25, 0 ),
    new THREE.Vector3( 0, 2, 12 )],
    false,
)

const points = curve.getPoints( 10 );

// Camera Target
var scrollCameraTarget = new THREE.Vector3( 0, 1.5, -1 )

// Path Target object, scrollCamera will be attached to it later
var pathTarget = new THREE.Vector3(0,0,0)


// camera
let cameraFov = 35;
const camera = new THREE.PerspectiveCamera(cameraFov, sizes.width / sizes.height);
camera.position.set(20,10,20);

// make path visible
// const geometry = new THREE.BufferGeometry().setFromPoints( points2 );
// const splineMaterial = new THREE.LineBasicMaterial( { color: 0xff0000 } );
// const curveObject = new THREE.Line( geometry, splineMaterial );
// scene.add(curveObject)

// // scrollCamera helper
// const scrollCameraHelper = new THREE.CameraHelper(scrollCamera);
// scene.add(scrollCameraHelper);



// Scroll Animation
var pathPercent = {value: 0 }; // position on path 0=Start, 1=end

gsap.to(pathPercent, {
    scrollTrigger: {
        trigger: ".page-container",
        endTrigger: ".section1-container",
        start: "top 0%",
        end: "top 80%",
        scrub: 1,
        markers: false,
        pin: true,
        toggleActions: "restart pause reverse reset"
    },
    value: 1 }
);


// Animate
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    curve.getPoint(pathPercent.value, pathTarget); // update pathTarget position on path

    scrollCamera.position.copy(pathTarget) // copy scrollCamera position to pathTarget
    scrollCamera.lookAt(scrollCameraTarget)

    renderer.render(scene, scrollCamera)

    window.requestAnimationFrame(tick)
}

tick()
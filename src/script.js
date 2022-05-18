import './style.css'
import GUI from 'lil-gui'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import particlesVertexShader from './shaders/particles/vertex.glsl'
import particlesFragmentShader from './shaders/particles/fragment.glsl'

import { gsap } from 'gsap';
gsap.registerPlugin(ScrollTrigger);
import { ScrollTrigger } from "gsap/ScrollTrigger.js"

// assign canvas dom element to variable
const canvas = document.querySelector('canvas.webgl')


// Scene
const scene = new THREE.Scene()

// Loaders

// Texture loader
const textureLoader = new THREE.TextureLoader()

// GLTF loader
const gltfLoader = new GLTFLoader()

// debug
const gui = new GUI({
    autoPlace: false,
    width: 400
});

gui.domElement.id = 'gui';

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

// particles geometry
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 40;
const particlesPosition = new Float32Array(particlesCount * 3);
const scaleArray = new Float32Array(particlesCount)


for(let i = 0; i < particlesCount; i++) {
    particlesPosition[i * 3 + 0] = (Math.random() - 0.5) * 4
    particlesPosition[i * 3 + 1] = (Math.random() +0.5) * 1.5
    particlesPosition[i * 3 + 2] = (Math.random() - 0.5) * 10

    scaleArray[i] = Math.random()
    
}
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlesPosition, 3))
particlesGeometry.setAttribute('aScale', new THREE.BufferAttribute(scaleArray, 1))


// particles material
const particlesMaterial = new THREE.ShaderMaterial({
    uniforms:
    {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uSize: { value: 220 }
    },
    vertexShader: particlesVertexShader,
    fragmentShader: particlesFragmentShader,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
})

gui.add(particlesMaterial.uniforms.uSize, 'value').min(0).max(500).step(1).name('particlesSize')

// particles points
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles);



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
    // camera.aspect = sizes.width / sizes.height
    // camera.updateProjectionMatrix()

    scrollCamera.aspect = sizes.width / sizes.height
    scrollCamera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    // Update particles
    particlesMaterial.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2)

});

let debugBackground = {};


// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.outputEncoding = THREE.sRGBEncoding;

// debugBackground.clearColor = '#00061e';
debugBackground.clearColor = '#00000';

renderer.setClearColor( debugBackground.clearColor)

// let viewport = new THREE.Vector4();
// renderer.getViewport(viewport);
// console.log(viewport);


gui.addColor (debugBackground, 'clearColor', )
gui.onChange(() =>
{
    renderer.setClearColor( debugBackground.clearColor)
})



//document.getElementById('canvas-container').appendChild( renderer.domElement );
//document.getElementById('canvas2-container').appendChild( renderer.domElement );


// scrollCamera moving on path
const scrollCamera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height)
scrollCamera.near = 1
scrollCamera.far = 30
//scene.add(scrollCamera)


// camera dive path
// const curve = new THREE.CatmullRomCurve3( [
// 	new THREE.Vector3( 0, 25, 0 ),
//     new THREE.Vector3( 0, 2, 12 )],
//     false,
// )

const curve = new THREE.CatmullRomCurve3( [
	new THREE.Vector3( 10, 15, 20 ),
    new THREE.Vector3( 10, 5, 0 ),
    new THREE.Vector3( 5, 5, -5 ),
    new THREE.Vector3( -5, 5, -15 )


],
    
    false,
)

const points = curve.getPoints( 10 );

// Camera Target
var scrollCameraTarget = new THREE.Vector3( -5, -1.5, 0 )

// Path Target object, scrollCamera will be attached to it later
var pathTarget = new THREE.Vector3(0,0,0)


// camera
// let cameraFov = 35;
// const camera = new THREE.PerspectiveCamera(cameraFov, sizes.width / sizes.height);
// camera.position.set(20,10,20);

// // make path visible
// const geometry = new THREE.BufferGeometry().setFromPoints( points );
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
        // trigger: ".page-container",
        // endTrigger: "footer",
        start: "0",
        end: "4000",
        scrub: 1,
        markers: true,
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

    // Update materials
    particlesMaterial.uniforms.uTime.value = elapsedTime

    curve.getPoint(pathPercent.value, pathTarget); // update pathTarget position on path

    scrollCamera.position.copy(pathTarget) // copy scrollCamera position to pathTarget
    scrollCamera.lookAt(scrollCameraTarget)

    renderer.render(scene, scrollCamera)
    //renderer.setViewport()

    window.requestAnimationFrame(tick)
}

tick()
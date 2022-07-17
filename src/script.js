import './style.css'
import GUI from 'lil-gui'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
// import particlesVertexShader from './shaders/particles/vertex.glsl'
// import particlesFragmentShader from './shaders/particles/fragment.glsl'

import { gsap } from 'gsap';
gsap.registerPlugin(ScrollTrigger);
import { ScrollTrigger } from "gsap/ScrollTrigger.js"
import { Object3D } from 'three'

// assign canvas dom element to variable
const canvas = document.querySelector('canvas.webgl')


// Scene
const scene = new THREE.Scene()

// Loaders

// Texture loader
const textureLoader = new THREE.TextureLoader()

// GLTF loader
const gltfLoader = new GLTFLoader()

// this utility function allows you to use any three.js loader with promises and async/await
function modelLoader(url) {
    return new Promise((resolve, reject) => {
      gltfLoader.load(url, data=> resolve(data), null, reject);
    });
  }

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

// Window Material
const windowMaterial = new THREE.MeshBasicMaterial({ color: 0x9db2be, transparent: true, opacity: 0.5 });

// standardMaterial
const workingMaterial = new THREE.MeshNormalMaterial({  });


// async loading and position (move up and rotate each letter and cube) function
async function loadObjectAndPosition(url, i) {
    const gltfData = await modelLoader(url),

    model = gltfData.scene.children[0];

    scene.add(model);

    if (i !== undefined) {
        model.position.y = i * 8;
        model.rotation.y = i*(Math.PI / 2);
    }

    model.traverse(
        function applyMaterialsToChildren (child) {
            if (child.name.includes('window')) {
                child.material = windowMaterial;
            }
            else {
                child.material = workingMaterial;
            }
        }
    )
}

// load base
loadObjectAndPosition('base.glb');


// button eventlistener
document.getElementById("load-button").addEventListener("click", readUserInputAndLoad);
document.getElementById("do-button").addEventListener("click", removeItems);


// read user input and load objects (letters+cube)
function readUserInputAndLoad() {
    let userInput = document.getElementById("input-field").value;
    for (let i = 0; i < userInput.length; i++) {
        loadObjectAndPosition(userInput.charAt(i)+".glb", i)
        loadObjectAndPosition('cube.glb', i)
    }
}

function removeItems() {
    let elementsToBeRemoved = [];
    scene.traverse(
        function selectObjectsToBeRemoved (child) {
            if (child.name.includes('container') && child.type === "Object3D") {
                elementsToBeRemoved.push(child);
            }
        }
    )

    for (let i = 0; i < elementsToBeRemoved.length; i++) {
        scene.remove(elementsToBeRemoved[i]);
    }
}



// // particles geometry
// const particlesGeometry = new THREE.BufferGeometry();
// const particlesCount = 40;
// const particlesPosition = new Float32Array(particlesCount * 3);
// const scaleArray = new Float32Array(particlesCount)


// for(let i = 0; i < particlesCount; i++) {
//     particlesPosition[i * 3 + 0] = (Math.random() - 0.5) * 4
//     particlesPosition[i * 3 + 1] = (Math.random() +0.5) * 1.5
//     particlesPosition[i * 3 + 2] = (Math.random() - 0.5) * 10

//     scaleArray[i] = Math.random()
    
// }
// particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlesPosition, 3))
// particlesGeometry.setAttribute('aScale', new THREE.BufferAttribute(scaleArray, 1))


// // particles material
// const particlesMaterial = new THREE.ShaderMaterial({
//     uniforms:
//     {
//         uTime: { value: 0 },
//         uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
//         uSize: { value: 220 }
//     },
//     vertexShader: particlesVertexShader,
//     fragmentShader: particlesFragmentShader,
//     transparent: true,
//     blending: THREE.AdditiveBlending,
//     depthWrite: false
// })

// gui.add(particlesMaterial.uniforms.uSize, 'value').min(0).max(500).step(1).name('particlesSize')

// // particles points
// const particles = new THREE.Points(particlesGeometry, particlesMaterial)
// scene.add(particles);

// working light
// const workingLight = new THREE.AmbientLight( 0x404040 );
// scene.add( workingLight );

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
    workingCamera.aspect = sizes.width / sizes.height
    workingCamera.updateProjectionMatrix()

    scrollCamera.aspect = sizes.width / sizes.height
    scrollCamera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    // Update particles
    // particlesMaterial.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2)

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

debugBackground.clearColor = '#000000';

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
const scrollCamera = new THREE.PerspectiveCamera(55, sizes.width / sizes.height)
scrollCamera.near = 1
scrollCamera.far = 130
scene.add(scrollCamera)

// camera dive path
// const curve = new THREE.CatmullRomCurve3( [
// 	new THREE.Vector3( 0, 25, 0 ),
//  new THREE.Vector3( 0, 2, 12 )],
//     false,
// )

// const curve = new THREE.CatmullRomCurve3( [
// 	new THREE.Vector3( 10, 15, 20 ),
//     new THREE.Vector3( 10, 5, 0 ),
//     new THREE.Vector3( 5, 5, -5 ),
//     new THREE.Vector3( -5, 5, -15 )],
//     false,
// )

const cameraCurve = new THREE.CatmullRomCurve3( [
	new THREE.Vector3( -70, 30, 70 ),
    new THREE.Vector3( -70, 30, -70 ),
    new THREE.Vector3( 70, 30, -70 ),
    new THREE.Vector3( 70, 30, 70 )
    
    ],
    true,
)


// Camera Target
var scrollCameraTarget = new THREE.Vector3( 0, 1, 0 )

// Path Target object, scrollCamera will be attached to it later
var cameraPathTarget = new THREE.Vector3(0,0,0)

const targetCurve = new THREE.CatmullRomCurve3( [
	new THREE.Vector3(0, 35, 0 ),
    new THREE.Vector3(0, 35, 0 ),
    new THREE.Vector3(0, 35, 0 )
    
    ],
    false,
)

//const points2 = targetCurve.getPoints( 10 );

// Path Target object, scrollCameraTarget will be attached to it later
var targetPathTarget = new THREE.Vector3(0,0,0)


// workingCamera
let workingCameraFov = 25;
const workingCamera = new THREE.PerspectiveCamera(workingCameraFov, sizes.width / sizes.height);
workingCamera.position.set(130,40,130);
scene.add(workingCamera);

// orbitcontrols
const controls = new OrbitControls( workingCamera, renderer.domElement );
controls.target.set(0, 30, 0)


// // axesHelper
// const axesHelper = new THREE.AxesHelper( 50 );
// scene.add( axesHelper );

// // make path visible
// const points = cameraCurve.getPoints( 10 );

// const geometry = new THREE.BufferGeometry().setFromPoints( points );
// const splineMaterial = new THREE.LineBasicMaterial( { color: 0xff0000 } );
// const curveObject = new THREE.Line( geometry, splineMaterial );
// scene.add(curveObject)

// // scrollCamera helper
// const scrollCameraHelper = new THREE.CameraHelper(scrollCamera);
// scene.add(scrollCameraHelper);


// Scroll Animation
var cameraAndTargetPathTarget = {value: 0 }; // position on path 0=Start, 1=end

gsap.to(cameraAndTargetPathTarget, {
    scrollTrigger: {
        // trigger: ".page-container",
        // endTrigger: "footer",
        start: "0",
        end: "2000",
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
    // particlesMaterial.uniforms.uTime.value = elapsedTime

    cameraCurve.getPoint(cameraAndTargetPathTarget.value, cameraPathTarget); // update cameraPathTarget position on path
    targetCurve.getPoint(cameraAndTargetPathTarget.value, scrollCameraTarget); // update scrollCameraTarget position on path

    scrollCamera.position.copy(cameraPathTarget) // copy scrollCamera position to cameraPathTarget
    scrollCamera.lookAt(scrollCameraTarget)

    controls.update();


    renderer.render(scene, scrollCamera)
    //renderer.setViewport()

    window.requestAnimationFrame(tick)
}

tick()
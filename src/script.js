import './style.css'
import GUI from 'lil-gui'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
// import particlesVertexShader from './shaders/particles/vertex.glsl'
// import particlesFragmentShader from './shaders/particles/fragment.glsl'

// import { gsap } from 'gsap';
// gsap.registerPlugin(ScrollTrigger);
// import { ScrollTrigger } from "gsap/ScrollTrigger.js"

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
const bulbMaterial = new THREE.MeshBasicMaterial({ color: 0x9db2be, transparent: true, opacity: 0.5 });

// standardMaterial
const workingMaterial = new THREE.MeshNormalMaterial({  });


// button eventlistener
document.getElementById("load-button").addEventListener("click", readUserInputAndLoad);


// function called when file is loaded
// function onLoad( gltf ) {
//     const letter = gltf.scene.children[0];
//     scene.add(letter)
//     console.log(letter);
//     //letter.rotation.y = Math.PI / 2;
//     letter.position.y = 0-16;
// }


function readUserInputAndLoad() {
    let userInput = document.getElementById("input-field").value;
    //console.log(userInput.length);
    for (let i = 0; i < userInput.length; i++) {
        gltfLoader.load(
        
        userInput.charAt(i)+".glb",

        function onLoad( gltf ) {
            gltf.scene.traverse(function applyBakedMaterialToAllChildren (child) {
                child.material = workingMaterial
                }
            )
            //console.log(gltf);
            const windowsGeometry = gltf.scene.children.find(child => child.name === 'windows')
            console.log(windowsGeometry);
            windowsGeometry.children[0].material = bulbMaterial
        
            const letter = gltf.scene;
            letter.position.y = i * 8;
            letter.rotation.y = i*(Math.PI / 2);
            //letter.translateOnAxis( (0, 0, 0), 0 );
            scene.add(letter)
            }
        );

        gltfLoader.load(

        'cube.glb',

        function onLoad( gltf ) {
            const cube = gltf.scene.children[0];
            cube.position.y = i * 8;
            cube.rotation.y = i*(Math.PI / 2)+(Math.PI / 2);
            //scene.add(cube)
        }
        )

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
const workingLight = new THREE.AmbientLight( 0x404040 );
scene.add( workingLight );





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

    // Update particles
    //particlesMaterial.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2)

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
const scrollCamera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height)
scrollCamera.near = 1
scrollCamera.far = 30
//scene.add(scrollCamera)

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
	new THREE.Vector3( -18.168121337890625, 6.210661888122559, -1.5272449254989624 ),
    new THREE.Vector3( -8.440740585327148, 3.891592502593994, 10.972755432128906 ),
    new THREE.Vector3( 1.2866392135620117, 1.5725231170654297, -1.527244210243225 ),
    new THREE.Vector3( -8.440740585327148, 3.891592502593994, -14.027244567871094 )
    
    ],
    true,
)


// Camera Target
var scrollCameraTarget = new THREE.Vector3( 0, 1, 0 )

// Path Target object, scrollCamera will be attached to it later
var cameraPathTarget = new THREE.Vector3(0,0,0)

const targetCurve = new THREE.CatmullRomCurve3( [
	new THREE.Vector3( -2.5, 1, -0.46 ),
    new THREE.Vector3( -2.5, 1, -0.46 ),
    new THREE.Vector3( -2.5, 1, -0.46 )
    
    ],
    false,
)

//const points2 = targetCurve.getPoints( 10 );

// Path Target object, scrollCameraTarget will be attached to it later
var targetPathTarget = new THREE.Vector3(0,0,0)


// camera
let cameraFov = 35;
const camera = new THREE.PerspectiveCamera(cameraFov, sizes.width / sizes.height);
camera.position.set(100,20,30);
scene.add(camera);

// orbitcontrols
const controls = new OrbitControls( camera, renderer.domElement );


// axesHelper
const axesHelper = new THREE.AxesHelper( 50 );
scene.add( axesHelper );

// make path visible
// const points = cameraCurve.getPoints( 10 );

// const geometry = new THREE.BufferGeometry().setFromPoints( points );
// const splineMaterial = new THREE.LineBasicMaterial( { color: 0xff0000 } );
// const curveObject = new THREE.Line( geometry, splineMaterial );
// scene.add(curveObject)

// // scrollCamera helper
// const scrollCameraHelper = new THREE.CameraHelper(scrollCamera);
// scene.add(scrollCameraHelper);



// Scroll Animation
// var cameraAndTargetPathTarget = {value: 0 }; // position on path 0=Start, 1=end

// gsap.to(cameraAndTargetPathTarget, {
//     scrollTrigger: {
//         // trigger: ".page-container",
//         // endTrigger: "footer",
//         start: "0",
//         end: "4000",
//         scrub: 1,
//         markers: true,
//         toggleActions: "restart pause reverse reset"
//     },
//     value: 1 }
// );


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

    // cameraCurve.getPoint(cameraAndTargetPathTarget.value, cameraPathTarget); // update cameraPathTarget position on path
    // targetCurve.getPoint(cameraAndTargetPathTarget.value, scrollCameraTarget); // update scrollCameraTarget position on path

    // scrollCamera.position.copy(cameraPathTarget) // copy scrollCamera position to cameraPathTarget
    // scrollCamera.lookAt(scrollCameraTarget)

    controls.update();


    renderer.render(scene, camera)
    //renderer.setViewport()

    window.requestAnimationFrame(tick)
}

tick()
import './style.css'
import * as THREE from 'three'
import gsap from 'gsap'
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
    'streetAni.glb',
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
    width: window.innerWidth/1.5,
    height: window.innerHeight
}


//resizer
window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth/1.5
    sizes.height = window.innerHeight

    // Update cameras
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    scrollCamera.aspect = sizes.width / sizes.height
    scrollCamera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

})

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height)
camera.position.x = 20
camera.position.y = 10
camera.position.z = 10
camera.lookAt(0,0,0)
scene.add(camera)

/**
 * scrollCamera
 */
const scrollCamera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height)
scrollCamera.near = 1
scrollCamera.far = 30
//scene.add(scrollCamera)

// scrollCamera helper

// const scrollCameraHelper = new THREE.CameraHelper(scrollCamera);
// scene.add(scrollCameraHelper);

// create path

const curve = new THREE.CatmullRomCurve3( [
	new THREE.Vector3( -15, 10, 15 ),
    new THREE.Vector3( -10, 5, -10 ),
	new THREE.Vector3( 2, 2, -10 ),
	new THREE.Vector3( 2.5, 1.5, -4 ),
	new THREE.Vector3( 2.5, 5, 20 )],
    false,
)

const points = curve.getPoints( 10 );


// make path visible
// const geometry = new THREE.BufferGeometry().setFromPoints( points );
// const splineMaterial = new THREE.LineBasicMaterial( { color: 0xff0000 } );
// const curveObject = new THREE.Line( geometry, splineMaterial );
// scene.add(curveObject)


//var speed = 0.1

var pathTarget = new THREE.Vector3(0,0,0)
var cameraTarget = new THREE.Vector3(-2,2,2)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.outputEncoding = THREE.sRGBEncoding;


/**
 * Orbit Controls
 */

// const controls = new OrbitControls( camera, renderer.domElement );





//scroll progress

let scrollPercent;

//  Liner Interpolation
//  lerp(min, max, ratio)
//  eg,
//  lerp(20, 60, .5)) = 40
//  lerp(-20, 60, .5)) = 20
//  lerp(20, 60, .75)) = 50
//  lerp(-20, -10, .1)) = -.19
//  
function lerp(x, y, a) {
    return (1 - a) * x + a * y;
}

//  Used to fit the lerps to start and end at specific scrolling percentages
function scalePercent(start, end) {
return (scrollPercent - start) / (end - start);
}

var animationScripts = [];


//var cameraPositionOnPathStart = curve.getPoint(0, pathTarget);
//var cameraPositionOnPathEnd = curve.getPoint(1, pathTarget);

//console.log(cameraPositionOnPathEnd);

//put camera on path
curve.getPoint(0, pathTarget);

// add an animation that moves the camera between 0-100 percent of scroll
animationScripts.push({
start: 0,
end: 100,
func: () => {
    var pathPercent = lerp(0, 1, scalePercent(0, 100));
    //console.log(pathPercent);
    curve.getPoint(pathPercent, pathTarget);
    //cameraTarget.x = lerp(0, -4, scalePercent(0, 100));
    console.log(cameraTarget);

    //console.log(camera.position.x + " " + camera.position.y)
},
})

  function playScrollAnimations() {
    animationScripts.forEach((a) => {
        if (scrollPercent >= a.start && scrollPercent < a.end) {
            a.func()
        }
    })
  }


  document.getElementsByTagName('body')[0].onscroll = function() { 
    var h = document.documentElement, 
    b = document.body,
    st = 'scrollTop',
    sh = 'scrollHeight';
    
    scrollPercent = (h[st]||b[st]) / ((h[sh]||b[sh]) - h.clientHeight) * 100;
    document.getElementById('scrollProgress').innerHTML = scrollPercent;
  };


/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

 //gsap.to(mesh.position, { duration: 1, delay: 1, x: 2 })

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime
    
    playScrollAnimations();
    //curve.getPoint((clock.getElapsedTime() * speed) % 1.0, pathTarget)

    scrollCamera.position.copy(pathTarget)
    scrollCamera.lookAt(cameraTarget)

    // Render
    renderer.render(scene, scrollCamera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

//window.scrollTo({ top: 0, behavior: 'smooth' });


tick()
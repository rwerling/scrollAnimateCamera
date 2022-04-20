import './style.css'
import * as THREE from 'three'
import gsap from 'gsap'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"



/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Cubes
 */
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })

let mx = -2.5;
for (let i = 0; i<3; i++){
    const cubes = new THREE.Mesh(cubeGeometry, material)
    cubes.position.x = mx;
    cubes.position.y = 0.5;
    cubes.position.z = -0.5;
    scene.add(cubes)
    mx+=2;
}



// const axesHelper = new THREE.AxesHelper( 5 );
// scene.add( axesHelper );


/**
 * Grid
 */
const size = 10;
const divisions = 10;

const gridHelper = new THREE.GridHelper( size, divisions );
scene.add( gridHelper );




/**
 * Resizer
 */

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


})


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

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
const scrollCamera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height)
scrollCamera.near = 1
scrollCamera.far = 13
//scene.add(scrollCamera)

// scrollCamera helper

const scrollCameraHelper = new THREE.CameraHelper(scrollCamera);
scene.add(scrollCameraHelper);

// create path

const curve = new THREE.CatmullRomCurve3( [
	new THREE.Vector3( -4, 1, 4 ),
	new THREE.Vector3( -4, 2, -4 ),
	new THREE.Vector3( 4, 4, -4 ),
	new THREE.Vector3( 4, 6, 4 )],
    true,
)

const points = curve.getPoints( 10 );

// make path visible
const geometry = new THREE.BufferGeometry().setFromPoints( points );
const splineMaterial = new THREE.LineBasicMaterial( { color: 0xff0000 } );
const curveObject = new THREE.Line( geometry, splineMaterial );
scene.add(curveObject)


var speed = 0.1

var pathTarget = new THREE.Vector3(0,0,0)


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


// add an animation that moves the camera between 0-100 percent of scroll
animationScripts.push({
start: 0,
end: 100,
func: () => {
    // curve.getPoint((clock.getElapsedTime() * speed) % 1.0, pathTarget)
    //curve.getPoint(0.1, pathTarget)
    //curve.getPoint(,pathTarget) = lerp(0, 1, scalePercent(0, 100));
    //pathTarget = lerp(curve.getPoint(0,pathTarget), curve.getPoint(1,pathTarget), scalePercent(0, 100));
    //pathTarget = curve.getPoint(0.2,pathTarget)
    var pathPercent = lerp(0, 1, scalePercent(0, 100));
    //pathTarget = new THREE.Vector3(3,1,-5);
    console.log(pathPercent);
    curve.getPoint(pathPercent, pathTarget);

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
    scrollCamera.lookAt(0, 1, 0)

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
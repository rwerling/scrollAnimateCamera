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
scrollCamera.position.x = -8
scrollCamera.position.y = 5
scrollCamera.position.z = 6
scrollCamera.lookAt(0,0,0)
scrollCamera.near = 1
scrollCamera.far = 15
scene.add(scrollCamera)

// scrollCamera helper

const scrollCameraHelper = new THREE.CameraHelper(scrollCamera);
scene.add(scrollCameraHelper);

/**
 * Camera Path Random
 */

const curve = new THREE.CatmullRomCurve3( [
	new THREE.Vector3( -4, -2, 4 ),
	new THREE.Vector3( -4, 0, -4 ),
	new THREE.Vector3( 4, 0, -4 ),
	new THREE.Vector3( 4, 2, 4 )
    ],
    true,
    )
const points = curve.getPoints( 50 );
const geometry = new THREE.BufferGeometry().setFromPoints( points );

const splineMaterial = new THREE.LineBasicMaterial( { color: 0xff0000 } );

// Create the final object to add to the scene
const curveObject = new THREE.Line( geometry, splineMaterial );

scene.add(curveObject)

/**
 * Camera Path Ellipse
 */

const ellipse = new THREE.EllipseCurve(
	0,  0,            // ax, aY
	5, 10,           // xRadius, yRadius
	0,  2 * Math.PI,  // aStartAngle, aEndAngle
	false,            // aClockwise
	0                 // aRotation
);

console.log(ellipse);
//ellipse.rotation.set(0,1,0);


const ellipsePoints = ellipse.getPoints( 50 );
const ellipseGeometry = new THREE.BufferGeometry().setFromPoints( ellipsePoints );


const ellipseMaterial = new THREE.LineBasicMaterial( { color: 0xff0000 } );

// Create the final object to add to the scene
const ellipseObject = new THREE.Line( ellipseGeometry, ellipseMaterial );
//ellipseObject.rotateZ = Math.PI / 2;

//scene.add(ellipseObject)
//console.log(ellipseObject);





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

const controls = new OrbitControls( camera, renderer.domElement );



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
    
    curve.getPoint((clock.getElapsedTime() * speed) % 1.0, pathTarget)

    scrollCamera.position.copy(pathTarget)
    scrollCamera.lookAt(0, 1, 0)

    // Render
    renderer.render(scene, scrollCamera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()